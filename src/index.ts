#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { WorkFlowyClient } from "./client/workflowy.js";
import { NodeCache } from "./cache/memory.js";
import { BookmarkStore } from "./utils/bookmarks.js";
import { formatErrorResponse, MCPError } from "./utils/errors.js";
import type { Config } from "./config.js";

// Server state
let client: WorkFlowyClient;
let cache: NodeCache;
let bookmarks: BookmarkStore;
let config: Config;

// Tool schemas
const createNodeSchema = z.object({
  parent_id: z
    .string()
    .describe('Parent node ID, target key (inbox/home), or "None" for root'),
  name: z.string().describe("Node text content (supports markdown formatting)"),
  note: z.string().optional().describe("Additional note content"),
  layoutMode: z
    .enum(["bullets", "todo", "h1", "h2", "h3", "code-block", "quote-block"])
    .optional()
    .describe("Display mode of the node"),
  position: z
    .enum(["top", "bottom"])
    .default("top")
    .describe("Where to place the new node"),
});

const updateNodeSchema = z.object({
  node_id: z.string().describe("ID of the node to update"),
  name: z.string().optional().describe("New node text content"),
  note: z.string().optional().describe("New note content"),
  layoutMode: z
    .enum(["bullets", "todo", "h1", "h2", "h3", "code-block", "quote-block"])
    .optional()
    .describe("New display mode"),
});

const getNodeSchema = z.object({
  node_id: z.string().describe("ID of the node to retrieve"),
});

const listNodesSchema = z.object({
  parent_id: z
    .string()
    .optional()
    .describe('Parent node ID, target key, or omit for root nodes'),
});

const deleteNodeSchema = z.object({
  node_id: z.string().describe("ID of the node to delete"),
});

const moveNodeSchema = z.object({
  node_id: z.string().describe("ID of the node to move"),
  parent_id: z.string().describe("New parent node ID or target key"),
  position: z
    .enum(["top", "bottom"])
    .default("top")
    .describe("Where to place the moved node"),
});

const completeNodeSchema = z.object({
  node_id: z.string().describe("ID of the node to mark as complete"),
});

const uncompleteNodeSchema = z.object({
  node_id: z.string().describe("ID of the node to mark as uncomplete"),
});

const searchNodesSchema = z.object({
  query: z.string().describe("Search query text"),
  case_sensitive: z.boolean().default(false).describe("Case-sensitive search"),
  regex: z.boolean().default(false).describe("Treat query as regex pattern"),
  parent_id: z
    .string()
    .optional()
    .describe("Limit search to this subtree (requires cached data)"),
});

const saveBookmarkSchema = z.object({
  node_id: z.string().describe("Node UUID to bookmark"),
  name: z.string().describe("Friendly name for the bookmark"),
});

const deleteBookmarkSchema = z.object({
  name: z.string().describe("Name of the bookmark to delete"),
});

// Create the MCP server
const server = new Server(
  {
    name: "workflowy-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "workflowy_create_node",
        description:
          "Create a new node in WorkFlowy. Supports markdown formatting, multiple layout modes (bullets, todo, headers), and positioning.",
        inputSchema: {
          type: "object",
          properties: {
            parent_id: {
              type: "string",
              description:
                'Parent node ID, target key (inbox/home), or "None" for root',
            },
            name: {
              type: "string",
              description: "Node text content (supports markdown formatting)",
            },
            note: {
              type: "string",
              description: "Additional note content",
            },
            layoutMode: {
              type: "string",
              enum: ["bullets", "todo", "h1", "h2", "h3", "code-block", "quote-block"],
              description: "Display mode of the node",
            },
            position: {
              type: "string",
              enum: ["top", "bottom"],
              description: "Where to place the new node",
            },
          },
          required: ["parent_id", "name"],
        },
      },
      {
        name: "workflowy_update_node",
        description:
          "Update an existing node's properties (name, note, layout mode).",
        inputSchema: {
          type: "object",
          properties: {
            node_id: { type: "string", description: "ID of the node to update" },
            name: { type: "string", description: "New node text content" },
            note: { type: "string", description: "New note content" },
            layoutMode: {
              type: "string",
              enum: ["bullets", "todo", "h1", "h2", "h3", "code-block", "quote-block"],
              description: "New display mode",
            },
          },
          required: ["node_id"],
        },
      },
      {
        name: "workflowy_get_node",
        description: "Retrieve a specific node by ID with all its properties.",
        inputSchema: {
          type: "object",
          properties: {
            node_id: { type: "string", description: "ID of the node to retrieve" },
          },
          required: ["node_id"],
        },
      },
      {
        name: "workflowy_list_nodes",
        description:
          "List child nodes of a parent. Returns nodes in unordered format - sort by priority field if needed.",
        inputSchema: {
          type: "object",
          properties: {
            parent_id: {
              type: "string",
              description: 'Parent node ID, target key, or omit for root nodes',
            },
          },
        },
      },
      {
        name: "workflowy_delete_node",
        description:
          "Permanently delete a node and all its children. This cannot be undone.",
        inputSchema: {
          type: "object",
          properties: {
            node_id: { type: "string", description: "ID of the node to delete" },
          },
          required: ["node_id"],
        },
      },
      {
        name: "workflowy_move_node",
        description: "Move a node to a new parent location.",
        inputSchema: {
          type: "object",
          properties: {
            node_id: { type: "string", description: "ID of the node to move" },
            parent_id: {
              type: "string",
              description: "New parent node ID or target key",
            },
            position: {
              type: "string",
              enum: ["top", "bottom"],
              description: "Where to place the moved node",
            },
          },
          required: ["node_id", "parent_id"],
        },
      },
      {
        name: "workflowy_complete_node",
        description: "Mark a node as completed (checked).",
        inputSchema: {
          type: "object",
          properties: {
            node_id: {
              type: "string",
              description: "ID of the node to mark as complete",
            },
          },
          required: ["node_id"],
        },
      },
      {
        name: "workflowy_uncomplete_node",
        description: "Mark a node as uncompleted (unchecked).",
        inputSchema: {
          type: "object",
          properties: {
            node_id: {
              type: "string",
              description: "ID of the node to mark as uncomplete",
            },
          },
          required: ["node_id"],
        },
      },
      {
        name: "workflowy_get_targets",
        description:
          "Get all available targets (inbox, home, and custom shortcuts).",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "workflowy_search_nodes",
        description:
          "Search nodes by text query. Automatically syncs cache if needed (rate limited to 1/min). Supports regex and case-sensitive search.",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string", description: "Search query text" },
            case_sensitive: {
              type: "boolean",
              description: "Case-sensitive search",
            },
            regex: {
              type: "boolean",
              description: "Treat query as regex pattern",
            },
            parent_id: {
              type: "string",
              description: "Limit search to this subtree",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "workflowy_sync_cache",
        description:
          "Manually sync the local cache with all WorkFlowy nodes. Rate limited to 1 request per minute.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "workflowy_save_bookmark",
        description:
          "Save a node ID with a friendly name for quick access later.",
        inputSchema: {
          type: "object",
          properties: {
            node_id: { type: "string", description: "Node UUID to bookmark" },
            name: { type: "string", description: "Friendly name for the bookmark" },
          },
          required: ["node_id", "name"],
        },
      },
      {
        name: "workflowy_list_bookmarks",
        description: "List all saved bookmarks.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "workflowy_delete_bookmark",
        description: "Delete a saved bookmark by name.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Name of the bookmark to delete" },
          },
          required: ["name"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "workflowy_create_node": {
        const params = createNodeSchema.parse(args);
        const nodeId = await client.createNode(params);

        // Optimistic cache update
        if (config.cacheEnabled && cache.isValid()) {
          cache.addNode({
            id: nodeId,
            name: params.name,
            note: params.note || null,
            priority: params.position === "top" ? 0 : 999999,
            data: { layoutMode: params.layoutMode || "bullets" },
            createdAt: Date.now() / 1000,
            modifiedAt: Date.now() / 1000,
            completedAt: null,
            parent_id: params.parent_id,
          });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, node_id: nodeId }, null, 2),
            },
          ],
        };
      }

      case "workflowy_update_node": {
        const params = updateNodeSchema.parse(args);
        const { node_id, ...updates } = params;
        await client.updateNode(node_id, updates);

        // Optimistic cache update
        if (config.cacheEnabled && cache.isValid()) {
          cache.updateNode(node_id, updates);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true }, null, 2),
            },
          ],
        };
      }

      case "workflowy_get_node": {
        const params = getNodeSchema.parse(args);
        const node = await client.getNode(params.node_id);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(node, null, 2),
            },
          ],
        };
      }

      case "workflowy_list_nodes": {
        const params = listNodesSchema.parse(args);
        const nodes = await client.listNodes(params.parent_id);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ nodes, count: nodes.length }, null, 2),
            },
          ],
        };
      }

      case "workflowy_delete_node": {
        const params = deleteNodeSchema.parse(args);
        await client.deleteNode(params.node_id);

        // Optimistic cache update
        if (config.cacheEnabled && cache.isValid()) {
          cache.deleteNode(params.node_id);
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true }, null, 2),
            },
          ],
        };
      }

      case "workflowy_move_node": {
        const params = moveNodeSchema.parse(args);
        const { node_id, ...moveParams } = params;
        await client.moveNode(node_id, moveParams);

        // Optimistic cache update
        if (config.cacheEnabled && cache.isValid()) {
          cache.updateNode(node_id, { parent_id: moveParams.parent_id });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true }, null, 2),
            },
          ],
        };
      }

      case "workflowy_complete_node": {
        const params = completeNodeSchema.parse(args);
        await client.completeNode(params.node_id);

        // Optimistic cache update
        if (config.cacheEnabled && cache.isValid()) {
          cache.updateNode(params.node_id, { completedAt: Date.now() / 1000 });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true }, null, 2),
            },
          ],
        };
      }

      case "workflowy_uncomplete_node": {
        const params = uncompleteNodeSchema.parse(args);
        await client.uncompleteNode(params.node_id);

        // Optimistic cache update
        if (config.cacheEnabled && cache.isValid()) {
          cache.updateNode(params.node_id, { completedAt: null });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true }, null, 2),
            },
          ],
        };
      }

      case "workflowy_get_targets": {
        const targets = await client.listTargets();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ targets, count: targets.length }, null, 2),
            },
          ],
        };
      }

      case "workflowy_search_nodes": {
        const params = searchNodesSchema.parse(args);

        // Ensure cache is populated
        if (!cache.isValid()) {
          const nodes = await client.exportNodes();
          cache.set(nodes);
        }

        const results = cache.search(params.query, {
          caseSensitive: params.case_sensitive,
          regex: params.regex,
          parentId: params.parent_id,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  results,
                  count: results.length,
                  cache_status: cache.getStatus(),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "workflowy_sync_cache": {
        const nodes = await client.exportNodes();
        cache.set(nodes);
        const status = cache.getStatus();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: true,
                  message: "Cache synced successfully",
                  ...status,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "workflowy_save_bookmark": {
        const params = saveBookmarkSchema.parse(args);
        const bookmark = bookmarks.save(params.node_id, params.name);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true, bookmark }, null, 2),
            },
          ],
        };
      }

      case "workflowy_list_bookmarks": {
        const allBookmarks = bookmarks.list();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                { bookmarks: allBookmarks, count: allBookmarks.length },
                null,
                2
              ),
            },
          ],
        };
      }

      case "workflowy_delete_bookmark": {
        const params = deleteBookmarkSchema.parse(args);
        const deleted = bookmarks.deleteByName(params.name);

        if (!deleted) {
          throw new MCPError(
            `Bookmark "${params.name}" not found`,
            "BOOKMARK_NOT_FOUND"
          );
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ success: true }, null, 2),
            },
          ],
        };
      }

      default:
        throw new MCPError(`Unknown tool: ${name}`, "UNKNOWN_TOOL");
    }
  } catch (error) {
    return formatErrorResponse(error);
  }
});

// Main function to start the server
async function main() {
  // Get API key from environment or command line
  const apiKey = process.env.WORKFLOWY_API_KEY || process.argv[2];

  if (!apiKey) {
    console.error("Error: WORKFLOWY_API_KEY environment variable or command line argument required");
    console.error("Usage: WORKFLOWY_API_KEY=your_key npm run dev");
    console.error("   or: npm run dev your_key");
    process.exit(1);
  }

  // Initialize configuration
  config = {
    apiKey,
    cacheEnabled: process.env.CACHE_ENABLED !== "false",
    cacheTTL: parseInt(process.env.CACHE_TTL || "3600", 10),
  };

  // Initialize client and cache
  client = new WorkFlowyClient(config.apiKey);
  cache = new NodeCache(config.cacheTTL);
  bookmarks = new BookmarkStore();

  // Start the server
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("WorkFlowy MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
