import { createMcpHandler } from "mcp-handler";
import { createMcpTools } from "../../../lib/mcp-tools";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = createMcpHandler(
  (server) => {
    // Get API key from request headers
    // This will be available in the handler context
    const request = (server as any).request;
    const authHeader = request?.headers?.get?.("authorization") || "";
    
    // Extract API key from "Bearer API_KEY" format
    const apiKey = authHeader.replace(/^Bearer\s+/i, "").trim();
    
    if (!apiKey) {
      throw new Error("Missing Authorization header. Please provide your WorkFlowy API key as: Authorization: Bearer YOUR_API_KEY");
    }

    // Create tools with the API key
    const tools = createMcpTools(apiKey);

    // Register all tools
    Object.entries(tools).forEach(([name, tool]) => {
      server.registerTool(
        name,
        {
          description: tool.description,
          inputSchema: tool.schema,
        },
        tool.handler
      );
    });
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: false,
  }
);

export { handler as GET, handler as POST };
