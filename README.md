# n8n MCP Server

[![MCP](https://img.shields.io/badge/MCP-Model%20Context%20Protocol-blue)](https://github.com/anthropics/model-context-protocol)
[![n8n](https://img.shields.io/badge/n8n-workflow%20automation-orange)](https://n8n.io)

MCP (Model Context Protocol) server for n8n workflow automation. This server enables AI assistants like Claude to interact with n8n instances via the REST API.

## Features

- 🔄 **Workflow Management**: List, create, update, and delete workflows
- ▶️ **Execution Control**: Execute workflows and monitor executions
- 🏷️ **Tag Management**: Organize workflows with tags
- 📊 **Execution History**: Access workflow execution history and results
- 🔑 **Credential Management**: List available credentials (read-only)
- 🌐 **Webhook Management**: Create and manage webhooks
- 🔍 **Search**: Search workflows by name or tags

## Prerequisites

- Node.js 18 or higher
- n8n instance with API access enabled
- n8n API key

## Installation

### From npm (when published)

```bash
npm install -g n8n-mcp-server
```

### From source

```bash
git clone https://github.com/nikolausm/n8n-mcp-server.git
cd n8n-mcp-server
npm install
npm run build
```

## Configuration

### Getting your n8n API Key

1. Log in to your n8n instance
2. Go to Settings → API
3. Generate an API key

### Configure Claude Desktop

Add the following to your Claude Desktop configuration (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["/path/to/n8n-mcp-server/dist/index.js"],
      "env": {
        "N8N_URL": "https://your-n8n-instance.com",
        "N8N_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

For n8n cloud instances, use:
- `N8N_URL`: `https://your-subdomain.app.n8n.cloud`

## Available Tools

### Workflow Management

- `list_workflows` - List all workflows with optional filtering
- `get_workflow` - Get detailed information about a specific workflow
- `create_workflow` - Create a new workflow from JSON
- `update_workflow` - Update an existing workflow
- `delete_workflow` - Delete a workflow
- `activate_workflow` - Activate a workflow
- `deactivate_workflow` - Deactivate a workflow

### Execution

- `execute_workflow` - Execute a workflow with optional input data
- `get_executions` - Get execution history with filtering options
- `get_execution` - Get details of a specific execution
- `delete_execution` - Delete an execution
- `retry_execution` - Retry a failed execution

### Tags

- `get_tags` - List all available tags
- `create_tag` - Create a new tag
- `update_tag` - Update a tag
- `delete_tag` - Delete a tag

### Other

- `get_credentials` - List available credentials (names only)
- `search_workflows` - Search workflows by name or tags
- `get_workflow_webhooks` - Get webhook URLs for a workflow

## Usage Examples

### List all active workflows

```
Assistant: I'll list all your active n8n workflows.

[Uses list_workflows tool with active=true]
```

### Execute a workflow

```
Assistant: I'll execute the workflow with the data you provided.

[Uses execute_workflow tool with workflowId and data]
```

### Create a new workflow

```
Assistant: I'll create a new workflow for you.

[Uses create_workflow tool with workflow JSON]
```

## Development

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Test locally

```bash
N8N_URL=https://your-instance.com N8N_API_KEY=your-key npm start
```

### Run tests

```bash
npm test
```

## Security Notes

- Never commit your API keys
- Use environment variables for sensitive data
- The MCP server has the same permissions as your API key
- Consider using a restricted API key if possible

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT - see [LICENSE](LICENSE) file

## Support

- 🐛 [Report bugs](https://github.com/nikolausm/n8n-mcp-server/issues)
- 💡 [Request features](https://github.com/nikolausm/n8n-mcp-server/issues)
- 📖 [n8n API Documentation](https://docs.n8n.io/api/)
- 🤝 [MCP Documentation](https://github.com/anthropics/model-context-protocol)

## Author

Michael Nikolaus - [GitHub](https://github.com/nikolausm)
