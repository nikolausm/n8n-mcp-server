export const tools = [
  // Workflow Management
  {
    name: "list_workflows",
    description: "List all n8n workflows with optional filtering",
    inputSchema: {
      type: "object",
      properties: {
        active: {
          type: "boolean",
          description: "Filter by active status",
        },
        limit: {
          type: "number",
          description: "Maximum number of workflows to return",
          default: 10,
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Filter by tags",
        },
      },
    },
  },
  {
    name: "get_workflow",
    description: "Get detailed information about a specific workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflowId: {
          type: "string",
          description: "The ID of the workflow",
        },
      },
      required: ["workflowId"],
    },
  },
  {
    name: "create_workflow",
    description: "Create a new n8n workflow from JSON definition",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the workflow",
        },
        nodes: {
          type: "array",
          description: "Array of workflow nodes",
        },
        connections: {
          type: "object",
          description: "Node connections object",
        },
        active: {
          type: "boolean",
          description: "Whether to activate the workflow",
          default: false,
        },
        settings: {
          type: "object",
          description: "Workflow settings",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Tags for the workflow",
        },
      },
      required: ["name", "nodes", "connections"],
    },
  },
  {
    name: "update_workflow",
    description: "Update an existing workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflowId: {
          type: "string",
          description: "The ID of the workflow to update",
        },
        name: {
          type: "string",
          description: "New name for the workflow",
        },
        nodes: {
          type: "array",
          description: "Updated nodes array",
        },
        connections: {
          type: "object",
          description: "Updated connections object",
        },
        active: {
          type: "boolean",
          description: "Activation status",
        },
        settings: {
          type: "object",
          description: "Updated workflow settings",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description: "Updated tags",
        },
      },
      required: ["workflowId"],
    },
  },
  {
    name: "delete_workflow",
    description: "Delete a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflowId: {
          type: "string",
          description: "The ID of the workflow to delete",
        },
      },
      required: ["workflowId"],
    },
  },
  {
    name: "activate_workflow",
    description: "Activate a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflowId: {
          type: "string",
          description: "The ID of the workflow to activate",
        },
      },
      required: ["workflowId"],
    },
  },
  {
    name: "deactivate_workflow",
    description: "Deactivate a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflowId: {
          type: "string",
          description: "The ID of the workflow to deactivate",
        },
      },
      required: ["workflowId"],
    },
  },

  // Execution Management
  {
    name: "execute_workflow",
    description: "Execute a workflow with optional input data",
    inputSchema: {
      type: "object",
      properties: {
        workflowId: {
          type: "string",
          description: "The ID of the workflow to execute",
        },
        data: {
          type: "object",
          description: "Input data for the workflow execution",
        },
      },
      required: ["workflowId"],
    },
  },
  {
    name: "get_executions",
    description: "Get workflow execution history with filtering options",
    inputSchema: {
      type: "object",
      properties: {
        workflowId: {
          type: "string",
          description: "Filter by workflow ID",
        },
        finished: {
          type: "boolean",
          description: "Filter by execution status",
        },
        limit: {
          type: "number",
          description: "Maximum number of executions to return",
          default: 10,
        },
        cursor: {
          type: "string",
          description: "Cursor for pagination",
        },
      },
    },
  },
  {
    name: "get_execution",
    description: "Get details of a specific execution",
    inputSchema: {
      type: "object",
      properties: {
        executionId: {
          type: "string",
          description: "The ID of the execution",
        },
      },
      required: ["executionId"],
    },
  },
  {
    name: "delete_execution",
    description: "Delete an execution",
    inputSchema: {
      type: "object",
      properties: {
        executionId: {
          type: "string",
          description: "The ID of the execution to delete",
        },
      },
      required: ["executionId"],
    },
  },
  {
    name: "retry_execution",
    description: "Retry a failed execution",
    inputSchema: {
      type: "object",
      properties: {
        executionId: {
          type: "string",
          description: "The ID of the execution to retry",
        },
      },
      required: ["executionId"],
    },
  },

  // Tag Management
  {
    name: "get_tags",
    description: "List all available tags",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "create_tag",
    description: "Create a new tag",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the tag",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "update_tag",
    description: "Update a tag",
    inputSchema: {
      type: "object",
      properties: {
        tagId: {
          type: "string",
          description: "The ID of the tag to update",
        },
        name: {
          type: "string",
          description: "New name for the tag",
        },
      },
      required: ["tagId", "name"],
    },
  },
  {
    name: "delete_tag",
    description: "Delete a tag",
    inputSchema: {
      type: "object",
      properties: {
        tagId: {
          type: "string",
          description: "The ID of the tag to delete",
        },
      },
      required: ["tagId"],
    },
  },

  // Other Tools
  {
    name: "get_credentials",
    description: "List available credentials (names only, no sensitive data)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "search_workflows",
    description: "Search workflows by name or tags",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_workflow_webhooks",
    description: "Get webhook URLs for a workflow",
    inputSchema: {
      type: "object",
      properties: {
        workflowId: {
          type: "string",
          description: "The ID of the workflow",
        },
      },
      required: ["workflowId"],
    },
  },
];
