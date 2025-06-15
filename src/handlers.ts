import { z } from "zod";
import { N8nClient } from "./n8n-client.js";

// Schema definitions for validation
const ListWorkflowsSchema = z.object({
  active: z.boolean().optional(),
  limit: z.number().optional().default(10),
  cursor: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

const WorkflowIdSchema = z.object({
  workflowId: z.string(),
});

const CreateWorkflowSchema = z.object({
  name: z.string(),
  nodes: z.array(z.any()),
  connections: z.record(z.any()),
  active: z.boolean().optional().default(false),
  settings: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

const UpdateWorkflowSchema = z.object({
  workflowId: z.string(),
  name: z.string().optional(),
  nodes: z.array(z.any()).optional(),
  connections: z.record(z.any()).optional(),
  active: z.boolean().optional(),
  settings: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

const ExecuteWorkflowSchema = z.object({
  workflowId: z.string(),
  data: z.record(z.any()).optional(),
});

const GetExecutionsSchema = z.object({
  workflowId: z.string().optional(),
  finished: z.boolean().optional(),
  limit: z.number().optional().default(10),
  cursor: z.string().optional(),
});

const ExecutionIdSchema = z.object({
  executionId: z.string(),
});

const TagNameSchema = z.object({
  name: z.string(),
});

const UpdateTagSchema = z.object({
  tagId: z.string(),
  name: z.string(),
});

const TagIdSchema = z.object({
  tagId: z.string(),
});

const SearchSchema = z.object({
  query: z.string(),
});

export async function handleToolCall(
  name: string,
  args: any,
  client: N8nClient
): Promise<any> {
  switch (name) {
    // Workflow Management
    case "list_workflows": {
      const params = ListWorkflowsSchema.parse(args);
      return await client.listWorkflows(params);
    }

    case "get_workflow": {
      const { workflowId } = WorkflowIdSchema.parse(args);
      return await client.getWorkflow(workflowId);
    }

    case "create_workflow": {
      const workflow = CreateWorkflowSchema.parse(args);
      return await client.createWorkflow(workflow);
    }

    case "update_workflow": {
      const { workflowId, ...updateData } = UpdateWorkflowSchema.parse(args);
      return await client.updateWorkflow(workflowId, updateData);
    }

    case "delete_workflow": {
      const { workflowId } = WorkflowIdSchema.parse(args);
      return await client.deleteWorkflow(workflowId);
    }

    case "activate_workflow": {
      const { workflowId } = WorkflowIdSchema.parse(args);
      return await client.activateWorkflow(workflowId);
    }

    case "deactivate_workflow": {
      const { workflowId } = WorkflowIdSchema.parse(args);
      return await client.deactivateWorkflow(workflowId);
    }

    // Execution Management
    case "execute_workflow": {
      const { workflowId, data } = ExecuteWorkflowSchema.parse(args);
      return await client.executeWorkflow(workflowId, data);
    }

    case "get_executions": {
      const params = GetExecutionsSchema.parse(args);
      return await client.getExecutions(params);
    }

    case "get_execution": {
      const { executionId } = ExecutionIdSchema.parse(args);
      return await client.getExecution(executionId);
    }

    case "delete_execution": {
      const { executionId } = ExecutionIdSchema.parse(args);
      return await client.deleteExecution(executionId);
    }

    case "retry_execution": {
      const { executionId } = ExecutionIdSchema.parse(args);
      return await client.retryExecution(executionId);
    }

    // Tag Management
    case "get_tags": {
      return await client.getTags();
    }

    case "create_tag": {
      const { name } = TagNameSchema.parse(args);
      return await client.createTag(name);
    }

    case "update_tag": {
      const { tagId, name } = UpdateTagSchema.parse(args);
      return await client.updateTag(tagId, name);
    }

    case "delete_tag": {
      const { tagId } = TagIdSchema.parse(args);
      return await client.deleteTag(tagId);
    }

    // Other Tools
    case "get_credentials": {
      return await client.getCredentials();
    }

    case "search_workflows": {
      const { query } = SearchSchema.parse(args);
      return await client.searchWorkflows(query);
    }

    case "get_workflow_webhooks": {
      const { workflowId } = WorkflowIdSchema.parse(args);
      return await client.getWorkflowWebhooks(workflowId);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
