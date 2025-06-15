import axios, { AxiosInstance } from "axios";
import { z } from "zod";

// API response schemas
const WorkflowSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  nodes: z.array(z.any()),
  connections: z.record(z.any()),
  settings: z.record(z.any()).optional(),
  staticData: z.any().optional(),
  tags: z.array(z.string()).optional(),
});

const ExecutionSchema = z.object({
  id: z.string(),
  finished: z.boolean(),
  mode: z.string(),
  retryOf: z.string().nullable(),
  retrySuccessId: z.string().nullable(),
  startedAt: z.string(),
  stoppedAt: z.string().nullable(),
  workflowId: z.string(),
  workflowData: z.any().optional(),
  data: z.any().optional(),
});

export class N8nClient {
  private client: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "X-N8N-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          throw new Error("Authentication failed. Please check your API key.");
        }
        if (error.response?.status === 404) {
          throw new Error("Resource not found.");
        }
        throw new Error(
          error.response?.data?.message || error.message || "Unknown error occurred"
        );
      }
    );
  }

  // Workflow methods
  async listWorkflows(params?: {
    active?: boolean;
    limit?: number;
    cursor?: string;
    tags?: string[];
  }) {
    const response = await this.client.get("/api/v1/workflows", { params });
    return response.data;
  }

  async getWorkflow(id: string) {
    const response = await this.client.get(`/api/v1/workflows/${id}`);
    return WorkflowSchema.parse(response.data);
  }

  async createWorkflow(workflow: any) {
    const response = await this.client.post("/api/v1/workflows", workflow);
    return WorkflowSchema.parse(response.data);
  }

  async updateWorkflow(id: string, workflow: any) {
    const response = await this.client.patch(`/api/v1/workflows/${id}`, workflow);
    return WorkflowSchema.parse(response.data);
  }

  async deleteWorkflow(id: string) {
    await this.client.delete(`/api/v1/workflows/${id}`);
    return { success: true, message: `Workflow ${id} deleted successfully` };
  }

  async activateWorkflow(id: string) {
    const response = await this.client.patch(`/api/v1/workflows/${id}`, {
      active: true,
    });
    return WorkflowSchema.parse(response.data);
  }

  async deactivateWorkflow(id: string) {
    const response = await this.client.patch(`/api/v1/workflows/${id}`, {
      active: false,
    });
    return WorkflowSchema.parse(response.data);
  }

  // Execution methods
  async executeWorkflow(id: string, data?: any) {
    const response = await this.client.post(`/api/v1/workflows/${id}/execute`, {
      data,
    });
    return response.data;
  }

  async getExecutions(params?: {
    workflowId?: string;
    finished?: boolean;
    limit?: number;
    cursor?: string;
  }) {
    const response = await this.client.get("/api/v1/executions", { params });
    return response.data;
  }

  async getExecution(id: string) {
    const response = await this.client.get(`/api/v1/executions/${id}`);
    return ExecutionSchema.parse(response.data);
  }

  async deleteExecution(id: string) {
    await this.client.delete(`/api/v1/executions/${id}`);
    return { success: true, message: `Execution ${id} deleted successfully` };
  }

  async retryExecution(id: string) {
    const response = await this.client.post(`/api/v1/executions/${id}/retry`);
    return response.data;
  }

  // Tag methods
  async getTags() {
    const response = await this.client.get("/api/v1/tags");
    return response.data;
  }

  async createTag(name: string) {
    const response = await this.client.post("/api/v1/tags", { name });
    return response.data;
  }

  async updateTag(id: string, name: string) {
    const response = await this.client.patch(`/api/v1/tags/${id}`, { name });
    return response.data;
  }

  async deleteTag(id: string) {
    await this.client.delete(`/api/v1/tags/${id}`);
    return { success: true, message: `Tag ${id} deleted successfully` };
  }

  // Credential methods
  async getCredentials() {
    const response = await this.client.get("/api/v1/credentials");
    return response.data;
  }

  // Webhook methods
  async getWorkflowWebhooks(workflowId: string) {
    const workflow = await this.getWorkflow(workflowId);
    const webhookNodes = workflow.nodes.filter(
      (node: any) => node.type === "n8n-nodes-base.webhook"
    );
    
    return webhookNodes.map((node: any) => ({
      nodeId: node.id,
      nodeName: node.name,
      path: node.parameters?.path || node.webhookId,
      method: node.parameters?.httpMethod || "GET",
      webhookUrl: `${process.env.N8N_URL}/webhook/${node.parameters?.path || node.webhookId}`,
    }));
  }

  // Search method
  async searchWorkflows(query: string) {
    const allWorkflows = await this.listWorkflows({ limit: 100 });
    const searchLower = query.toLowerCase();
    
    return allWorkflows.data.filter((workflow: any) => {
      const nameMatch = workflow.name.toLowerCase().includes(searchLower);
      const tagMatch = workflow.tags?.some((tag: string) => 
        tag.toLowerCase().includes(searchLower)
      );
      return nameMatch || tagMatch;
    });
  }
}
