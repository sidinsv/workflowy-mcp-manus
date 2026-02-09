import { z } from "zod";
import { WorkFlowyClient } from "./client/workflowy";
import { NodeCache } from "./cache/memory";
import { BookmarkStore } from "./utils/bookmarks";
import { formatErrorResponse } from "./utils/errors";

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
    .describe("Parent node ID, target key, or omit for root nodes"),
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
  query: z.string().describe("Search query text or regex pattern"),
  case_sensitive: z
    .boolean()
    .default(false)
    .describe("Case-sensitive search"),
  regex: z.boolean().default(false).describe("Treat query as regex pattern"),
  parent_id: z
    .string()
    .optional()
    .describe("Limit search to this subtree"),
});

const saveBookmarkSchema = z.object({
  node_id: z.string().describe("Node UUID to bookmark"),
  name: z.string().describe("Friendly name for the bookmark"),
});

const deleteBookmarkSchema = z.object({
  name: z.string().describe("Name of the bookmark to delete"),
});

export function createMcpTools(apiKey: string) {
  const client = new WorkFlowyClient(apiKey);
  const cache = new NodeCache(3600); // 1 hour TTL
  const bookmarks = new BookmarkStore();

  return {
    workflowy_create_node: {
      description: "Create a new node in WorkFlowy with markdown formatting support",
      schema: createNodeSchema,
      handler: async (args: z.infer<typeof createNodeSchema>) => {
        try {
          const nodeId = await client.createNode(args);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ success: true, node_id: nodeId }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_update_node: {
      description: "Update an existing node's properties",
      schema: updateNodeSchema,
      handler: async (args: z.infer<typeof updateNodeSchema>) => {
        try {
          await client.updateNode(args.node_id, args);
          cache.clear();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ success: true }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_get_node: {
      description: "Retrieve a specific node by ID with all its properties",
      schema: getNodeSchema,
      handler: async (args: z.infer<typeof getNodeSchema>) => {
        try {
          const node = await client.getNode(args.node_id);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(node, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_list_nodes: {
      description: "List child nodes of a parent (unordered - sort by priority if needed)",
      schema: listNodesSchema,
      handler: async (args: z.infer<typeof listNodesSchema>) => {
        try {
          const nodes = await client.listNodes(args.parent_id);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ nodes, count: nodes.length }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_delete_node: {
      description: "Permanently delete a node and all its children (cannot be undone)",
      schema: deleteNodeSchema,
      handler: async (args: z.infer<typeof deleteNodeSchema>) => {
        try {
          await client.deleteNode(args.node_id);
          cache.clear();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ success: true }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_move_node: {
      description: "Move a node to a new parent location",
      schema: moveNodeSchema,
      handler: async (args: z.infer<typeof moveNodeSchema>) => {
        try {
          await client.moveNode(args.node_id, {
            parent_id: args.parent_id,
            position: args.position,
          });
          cache.clear();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ success: true }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_complete_node: {
      description: "Mark a node as completed (checked)",
      schema: completeNodeSchema,
      handler: async (args: z.infer<typeof completeNodeSchema>) => {
        try {
          await client.completeNode(args.node_id);
          cache.clear();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ success: true }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_uncomplete_node: {
      description: "Mark a node as uncompleted (unchecked)",
      schema: uncompleteNodeSchema,
      handler: async (args: z.infer<typeof uncompleteNodeSchema>) => {
        try {
          await client.uncompleteNode(args.node_id);
          cache.clear();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ success: true }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_get_targets: {
      description: "Get all available targets including system targets (inbox, today) and custom shortcuts",
      schema: z.object({}),
      handler: async () => {
        try {
          const targets = await client.listTargets();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ targets, count: targets.length }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_search_nodes: {
      description: "Search nodes by text query with advanced options (auto-syncs cache if needed, rate limited to 1/min)",
      schema: searchNodesSchema,
      handler: async (args: z.infer<typeof searchNodesSchema>) => {
        try {
          // Sync cache if needed
          if (!!cache.isValid()) {
            const allNodes = await client.exportNodes();
            cache.set(allNodes);
          }

          // Search in cache
          const results = cache.search(args.query, {
            caseSensitive: args.case_sensitive,
            regex: args.regex,
            parentId: args.parent_id,
          });

          return {
            content: [
              {
                type: "text" as const,
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
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_sync_cache: {
      description: "Manually sync the local cache with all WorkFlowy nodes (rate limited to 1 request per minute)",
      schema: z.object({}),
      handler: async () => {
        try {
          const allNodes = await client.exportNodes();
          cache.set(allNodes);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  {
                    success: true,
                    message: "Cache synced successfully",
                    ...cache.getStatus(),
                  },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_save_bookmark: {
      description: "Save a node ID with a friendly name for quick access later",
      schema: saveBookmarkSchema,
      handler: async (args: z.infer<typeof saveBookmarkSchema>) => {
        try {
          const bookmark = bookmarks.save(args.node_id, args.name);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ success: true, bookmark }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_list_bookmarks: {
      description: "List all saved bookmarks, sorted by creation time (newest first)",
      schema: z.object({}),
      handler: async () => {
        try {
          const bookmarkList = bookmarks.list();
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify(
                  { bookmarks: bookmarkList, count: bookmarkList.length },
                  null,
                  2
                ),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },

    workflowy_delete_bookmark: {
      description: "Delete a saved bookmark by name",
      schema: deleteBookmarkSchema,
      handler: async (args: z.infer<typeof deleteBookmarkSchema>) => {
        try {
          bookmarks.delete(args.name);
          return {
            content: [
              {
                type: "text" as const,
                text: JSON.stringify({ success: true }, null, 2),
              },
            ],
          };
        } catch (error) {
          return formatErrorResponse(error);
        }
      },
    },
  };
}
