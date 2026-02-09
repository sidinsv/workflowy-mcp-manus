import fetch from "node-fetch";
import type {
  WorkFlowyNode,
  WorkFlowyTarget,
  CreateNodeRequest,
  UpdateNodeRequest,
  MoveNodeRequest,
  CreateNodeResponse,
  GetNodeResponse,
  ListNodesResponse,
  ExportNodesResponse,
  ListTargetsResponse,
} from "./types";

export class WorkFlowyAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = "WorkFlowyAPIError";
  }
}

export class WorkFlowyClient {
  private apiKey: string;
  private baseUrl = "https://workflowy.com/api/v1";
  private lastExportTime = 0;
  private exportRateLimit = 60000; // 1 minute in milliseconds

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `WorkFlowy API error: ${response.status} ${response.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorJson.error || errorMessage;
        } catch {
          // If not JSON, use the text
          if (errorText) errorMessage = errorText;
        }

        throw new WorkFlowyAPIError(errorMessage, response.status, errorText);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof WorkFlowyAPIError) {
        throw error;
      }
      throw new WorkFlowyAPIError(
        `Network error: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Create a new node
   */
  async createNode(request: CreateNodeRequest): Promise<string> {
    const response = await this.request<CreateNodeResponse>(
      "POST",
      "/nodes",
      request
    );
    return response.item_id;
  }

  /**
   * Update an existing node
   */
  async updateNode(nodeId: string, request: UpdateNodeRequest): Promise<void> {
    await this.request("POST", `/nodes/${nodeId}`, request);
  }

  /**
   * Get a specific node by ID
   */
  async getNode(nodeId: string): Promise<WorkFlowyNode> {
    const response = await this.request<GetNodeResponse>(
      "GET",
      `/nodes/${nodeId}`
    );
    return response.node;
  }

  /**
   * List child nodes of a parent
   */
  async listNodes(parentId?: string): Promise<WorkFlowyNode[]> {
    const params = parentId ? `?parent_id=${encodeURIComponent(parentId)}` : "";
    const response = await this.request<ListNodesResponse>(
      "GET",
      `/nodes${params}`
    );
    return response.nodes;
  }

  /**
   * Delete a node
   */
  async deleteNode(nodeId: string): Promise<void> {
    await this.request("DELETE", `/nodes/${nodeId}`);
  }

  /**
   * Move a node to a new parent
   */
  async moveNode(nodeId: string, request: MoveNodeRequest): Promise<void> {
    await this.request("POST", `/nodes/${nodeId}/move`, request);
  }

  /**
   * Mark a node as complete
   */
  async completeNode(nodeId: string): Promise<void> {
    await this.request("POST", `/nodes/${nodeId}/complete`);
  }

  /**
   * Mark a node as uncomplete
   */
  async uncompleteNode(nodeId: string): Promise<void> {
    await this.request("POST", `/nodes/${nodeId}/uncomplete`);
  }

  /**
   * Export all nodes (rate limited to 1 req/min)
   */
  async exportNodes(): Promise<WorkFlowyNode[]> {
    const now = Date.now();
    const timeSinceLastExport = now - this.lastExportTime;
    
    if (timeSinceLastExport < this.exportRateLimit) {
      const waitTime = Math.ceil((this.exportRateLimit - timeSinceLastExport) / 1000);
      throw new WorkFlowyAPIError(
        `Export rate limit: Please wait ${waitTime} seconds before exporting again`,
        429
      );
    }

    const response = await this.request<ExportNodesResponse>(
      "GET",
      "/nodes-export"
    );
    
    this.lastExportTime = now;
    return response.nodes;
  }

  /**
   * List all targets (shortcuts and system targets)
   */
  async listTargets(): Promise<WorkFlowyTarget[]> {
    const response = await this.request<ListTargetsResponse>(
      "GET",
      "/targets"
    );
    return response.targets;
  }
}
