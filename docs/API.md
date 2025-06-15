# n8n MCP Server API Documentation

## Available Tools

### Workflow Management

#### `list_workflows`
List all workflows with optional filtering.

**Parameters:**
- `active` (boolean, optional): Filter by active status
- `limit` (number, optional): Maximum number of workflows to return (default: 10)
- `cursor` (string, optional): Cursor for pagination
- `tags` (string[], optional): Filter by tags

**Returns:** Array of workflow objects

#### `get_workflow`
Get detailed information about a specific workflow.

**Parameters:**
- `workflowId` (string, required): The ID of the workflow

**Returns:** Complete workflow object with nodes, connections, and settings

#### `create_workflow`
Create a new workflow.

**Parameters:**
- `name` (string, required): Name of the workflow
- `nodes` (array, required): Array of workflow nodes
- `connections` (object, required): Node connections object
- `active` (boolean, optional): Whether to activate the workflow (default: false)
- `settings` (object, optional): Workflow settings
- `tags` (string[], optional): Tags for the workflow

**Returns:** Created workflow object

#### `update_workflow`
Update an existing workflow.

**Parameters:**
- `workflowId` (string, required): The ID of the workflow to update
- `name` (string, optional): New name for the workflow
- `nodes` (array, optional): Updated nodes array
- `connections` (object, optional): Updated connections object
- `active` (boolean, optional): Activation status
- `settings` (object, optional): Updated workflow settings
- `tags` (string[], optional): Updated tags

**Returns:** Updated workflow object

#### `delete_workflow`
Delete a workflow.

**Parameters:**
- `workflowId` (string, required): The ID of the workflow to delete

**Returns:** Success message

#### `activate_workflow`
Activate a workflow.

**Parameters:**
- `workflowId` (string, required): The ID of the workflow to activate

**Returns:** Updated workflow object

#### `deactivate_workflow`
Deactivate a workflow.

**Parameters:**
- `workflowId` (string, required): The ID of the workflow to deactivate

**Returns:** Updated workflow object

### Execution Management

#### `execute_workflow`
Execute a workflow with optional input data.

**Parameters:**
- `workflowId` (string, required): The ID of the workflow to execute
- `data` (object, optional): Input data for the workflow execution

**Returns:** Execution result object

#### `get_executions`
Get workflow execution history.

**Parameters:**
- `workflowId` (string, optional): Filter by workflow ID
- `finished` (boolean, optional): Filter by execution status
- `limit` (number, optional): Maximum number of executions to return (default: 10)
- `cursor` (string, optional): Cursor for pagination

**Returns:** Array of execution objects

#### `get_execution`
Get details of a specific execution.

**Parameters:**
- `executionId` (string, required): The ID of the execution

**Returns:** Complete execution object with data

#### `delete_execution`
Delete an execution.

**Parameters:**
- `executionId` (string, required): The ID of the execution to delete

**Returns:** Success message

#### `retry_execution`
Retry a failed execution.

**Parameters:**
- `executionId` (string, required): The ID of the execution to retry

**Returns:** New execution object

### Tag Management

#### `get_tags`
List all available tags.

**Parameters:** None

**Returns:** Array of tag objects

#### `create_tag`
Create a new tag.

**Parameters:**
- `name` (string, required): Name of the tag

**Returns:** Created tag object

#### `update_tag`
Update a tag.

**Parameters:**
- `tagId` (string, required): The ID of the tag to update
- `name` (string, required): New name for the tag

**Returns:** Updated tag object

#### `delete_tag`
Delete a tag.

**Parameters:**
- `tagId` (string, required): The ID of the tag to delete

**Returns:** Success message

### Other Tools

#### `get_credentials`
List available credentials (names only, no sensitive data).

**Parameters:** None

**Returns:** Array of credential objects (without sensitive data)

#### `search_workflows`
Search workflows by name or tags.

**Parameters:**
- `query` (string, required): Search query

**Returns:** Array of matching workflow objects

#### `get_workflow_webhooks`
Get webhook URLs for a workflow.

**Parameters:**
- `workflowId` (string, required): The ID of the workflow

**Returns:** Array of webhook information objects
