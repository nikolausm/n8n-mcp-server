import assert from "node:assert/strict";
import test from "node:test";
import axios from "axios";
import { handleToolCall } from "../dist/handlers.js";
import { N8nClient } from "../dist/n8n-client.js";

const connections = { Start: { main: [[{ node: "Next", type: "main", index: 0 }]] } };
const settings = { timezone: "Europe/Berlin", custom: { enabled: false, values: [1, null] } };

test("create retains nested records and the existing inactive default", async () => {
  const input = { name: "Synthetic", nodes: [], connections, settings };
  const client = { createWorkflow: async payload => payload };
  assert.deepEqual(await handleToolCall("create_workflow", input, client), { ...input, active: false });
});

test("partial update preserves records without introducing omitted fields", async () => {
  let call;
  const client = { updateWorkflow: async (...args) => { call = args; return { ok: true }; } };
  await handleToolCall("update_workflow", { workflowId: "synthetic", settings }, client);
  assert.deepEqual(call, ["synthetic", { settings }]);
});

test("execution data keeps arbitrary nested values", async () => {
  const data = { text: "synthetic", flag: false, count: 0, nested: [null, { key: "value" }] };
  let call;
  const client = { executeWorkflow: async (...args) => { call = args; return { ok: true }; } };
  await handleToolCall("execute_workflow", { workflowId: "synthetic", data }, client);
  assert.deepEqual(call, ["synthetic", data]);
});

test("malformed record inputs are rejected before any client action", async () => {
  let calls = 0;
  const client = new Proxy({}, { get: () => async () => { calls++; } });
  for (const bad of [null, [], "not-an-object", 42]) {
    for (const [name, args] of [
      ["create_workflow", { name: "Synthetic", nodes: [], connections: bad }],
      ["update_workflow", { workflowId: "synthetic", settings: bad }],
      ["execute_workflow", { workflowId: "synthetic", data: bad }],
    ]) await assert.rejects(handleToolCall(name, args, client));
  }
  assert.equal(calls, 0);
});

test("API workflow response validation preserves records and rejects malformed ones", async t => {
  const originalAdapter = axios.defaults.adapter;
  t.after(() => { axios.defaults.adapter = originalAdapter; });
  let response = {
    id: "synthetic", name: "Synthetic", active: false,
    createdAt: "2026-10-26", updatedAt: "2026-10-26",
    nodes: [], connections, settings,
  };
  axios.defaults.adapter = async config => {
    assert.equal(config.method, "get");
    assert.equal(config.url, "/api/v1/workflows/synthetic");
    return { status: 200, statusText: "OK", headers: {}, config, data: response };
  };
  const client = new N8nClient("https://synthetic.invalid", "synthetic-token");
  assert.deepEqual(await client.getWorkflow("synthetic"), response);
  response = { ...response, connections: [] };
  await assert.rejects(client.getWorkflow("synthetic"));
});
