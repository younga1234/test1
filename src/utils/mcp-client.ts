import { MCPToolCallRequest, MCPToolCallResponse } from '../types';

/**
 * MCP Client for making tool calls to MCP servers
 */
export class MCPClient {
  private serverUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(serverUrl: string, apiKey?: string, timeout: number = 30000) {
    this.serverUrl = serverUrl;
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  /**
   * Call an MCP tool
   */
  async callTool<T = any>(
    toolName: string,
    input: Record<string, any>,
  ): Promise<MCPToolCallResponse<T>> {
    const startTime = Date.now();

    try {
      // In a real implementation, this would make an HTTP request to the MCP server
      // For this demo, we'll simulate the call
      const response = await this.makeRequest<T>({
        toolName,
        input,
      });

      const latency = Date.now() - startTime;

      return {
        result: response,
        metadata: {
          latency,
        },
      };
    } catch (error) {
      throw new Error(`MCP tool call failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Make HTTP request to MCP server
   */
  private async makeRequest<T>(request: MCPToolCallRequest): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // In production, this would be:
    // const response = await fetch(`${this.serverUrl}/tools/${request.toolName}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
    //   },
    //   body: JSON.stringify(request.input),
    //   signal: AbortSignal.timeout(this.timeout),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    // }
    //
    // return await response.json();

    // For demo purposes, return mock data
    return {
      success: true,
      data: `Mock result for ${request.toolName}`,
    } as T;
  }

  /**
   * List available tools from the MCP server
   */
  async listTools(): Promise<string[]> {
    // In production, this would fetch from the server
    return ['example_tool_1', 'example_tool_2'];
  }

  /**
   * Get tool schema
   */
  async getToolSchema(toolName: string): Promise<Record<string, any>> {
    // In production, this would fetch from the server
    return {
      name: toolName,
      inputSchema: {
        type: 'object',
        properties: {},
      },
    };
  }
}

/**
 * Global MCP client instance
 */
let globalClient: MCPClient | null = null;

/**
 * Initialize the global MCP client
 */
export function initializeMCPClient(serverUrl: string, apiKey?: string): void {
  globalClient = new MCPClient(serverUrl, apiKey);
}

/**
 * Get the global MCP client instance
 */
export function getMCPClient(): MCPClient {
  if (!globalClient) {
    throw new Error('MCP client not initialized. Call initializeMCPClient() first.');
  }
  return globalClient;
}

/**
 * Helper function to call MCP tools
 */
export async function callMCPTool<T = any>(
  toolName: string,
  input: Record<string, any>,
): Promise<T> {
  const client = getMCPClient();
  const response = await client.callTool<T>(toolName, input);
  return response.result;
}
