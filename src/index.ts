#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { N8nClient } from "./n8n-client.js";
import { tools } from "./tools.js";
import { handleToolCall } from "./handlers.js";

// Initialize server
const server = new Server(
  {
    name: "n8n-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize n8n client
const n8nClient = new N8nClient(
  process.env.N8N_URL || "http://localhost:5678",
  process.env.N8N_API_KEY || ""
);

// Register tool list handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Register tool call handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;
    const result = await handleToolCall(name, args, n8nClient);
    return {
      content: [
        {
          type: "text",
          text: typeof result === "string" ? result : JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return {
      content: [
        {
          type: "text",
          text: `Error: ${errorMessage}`,
        },
      ],
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("n8n MCP server running on stdio");
  console.error(`Connected to n8n at: ${process.env.N8N_URL || "http://localhost:5678"}`);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
