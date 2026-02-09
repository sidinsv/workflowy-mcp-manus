import { WorkFlowyAPIError } from "../client/workflowy.js";

export class MCPError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = "MCPError";
  }
}

/**
 * Convert WorkFlowy API errors to MCP errors
 */
export function handleWorkFlowyError(error: unknown): MCPError {
  if (error instanceof WorkFlowyAPIError) {
    if (error.statusCode === 401 || error.statusCode === 403) {
      return new MCPError(
        "Authentication failed. Please check your WorkFlowy API key.",
        "WORKFLOWY_AUTH_ERROR",
        error.details
      );
    }

    if (error.statusCode === 404) {
      return new MCPError(
        "Node not found. The specified node ID does not exist.",
        "WORKFLOWY_NOT_FOUND",
        error.details
      );
    }

    if (error.statusCode === 429) {
      return new MCPError(
        error.message,
        "WORKFLOWY_RATE_LIMIT",
        error.details
      );
    }

    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      return new MCPError(
        error.message,
        "WORKFLOWY_INVALID_INPUT",
        error.details
      );
    }

    return new MCPError(
      error.message,
      "WORKFLOWY_API_ERROR",
      error.details
    );
  }

  if (error instanceof Error) {
    return new MCPError(
      error.message,
      "WORKFLOWY_NETWORK_ERROR",
      { originalError: error.message }
    );
  }

  return new MCPError(
    "An unknown error occurred",
    "UNKNOWN_ERROR",
    { error: String(error) }
  );
}

/**
 * Format error for MCP response
 */
export function formatErrorResponse(error: unknown): {
  content: Array<{ type: string; text: string }>;
  isError: boolean;
} {
  const mcpError = error instanceof MCPError ? error : handleWorkFlowyError(error);

  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(
          {
            error: mcpError.code,
            message: mcpError.message,
            details: mcpError.details,
          },
          null,
          2
        ),
      },
    ],
    isError: true,
  };
}
