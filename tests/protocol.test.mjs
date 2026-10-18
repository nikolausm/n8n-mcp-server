import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const serverEntry = fileURLToPath(new URL("../dist/index.js", import.meta.url));

test("advertises all tools and rejects invalid input over stdio", async (t) => {
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [serverEntry],
    env: {
      ...process.env,
      N8N_URL: "http://127.0.0.1:9",
      N8N_API_KEY: "test-key",
    },
    stderr: "pipe",
  });
  const client = new Client({ name: "protocol-test", version: "1.0.0" });

  t.after(async () => {
    await client.close();
  });

  await client.connect(transport);
  const response = await client.listTools();

  assert.deepEqual(
    response.tools.map((tool) => tool.name).sort(),
    [
      "activate_workflow",
      "create_tag",
      "create_workflow",
      "deactivate_workflow",
      "delete_execution",
      "delete_tag",
      "delete_workflow",
      "execute_workflow",
      "get_credentials",
      "get_execution",
      "get_executions",
      "get_tags",
      "get_workflow",
      "get_workflow_webhooks",
      "list_workflows",
      "retry_execution",
      "search_workflows",
      "update_tag",
      "update_workflow",
    ],
  );

  const invalid = await client.callTool({ name: "get_workflow", arguments: {} });
  assert.equal(invalid.isError, true);
  assert.match(invalid.content[0].text, /workflowId/);
});
