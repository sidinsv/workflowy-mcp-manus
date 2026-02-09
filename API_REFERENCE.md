# API Reference

Complete reference for all WorkFlowy MCP server tools.

## Table of Contents

- [Node Operations](#node-operations)
- [Navigation & Discovery](#navigation--discovery)
- [Search](#search)
- [Bookmarks](#bookmarks)
- [Data Types](#data-types)
- [Error Codes](#error-codes)

## Node Operations

### workflowy_create_node

Create a new node in WorkFlowy with markdown formatting support.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `parent_id` | string | Yes | Parent node ID, target key (inbox/home), or "None" for root |
| `name` | string | Yes | Node text content (supports markdown formatting) |
| `note` | string | No | Additional note content |
| `layoutMode` | enum | No | Display mode: `bullets`, `todo`, `h1`, `h2`, `h3`, `code-block`, `quote-block` |
| `position` | enum | No | Placement: `top` (default) or `bottom` |

**Returns:**
```json
{
  "success": true,
  "node_id": "abc-123-def-456"
}
```

**Example:**
```json
{
  "parent_id": "inbox",
  "name": "# Project Planning\n\n- [ ] Define scope\n- [ ] Set timeline",
  "note": "Q1 2026 project",
  "layoutMode": "h1",
  "position": "top"
}
```

**Formatting Support:**
- **Markdown**: `# Header`, `## H2`, `**bold**`, `*italic*`, `[link](url)`
- **Dates**: `[2026-02-09]`, `[2026-02-09 14:30]`
- **Multiline**: Single `\n` joins into space, `\n\n` creates children

---

### workflowy_update_node

Update an existing node's properties.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `node_id` | string | Yes | ID of the node to update |
| `name` | string | No | New node text content |
| `note` | string | No | New note content |
| `layoutMode` | enum | No | New display mode |

**Returns:**
```json
{
  "success": true
}
```

**Example:**
```json
{
  "node_id": "abc-123-def",
  "name": "Updated task name",
  "note": "Updated notes"
}
```

---

### workflowy_get_node

Retrieve a specific node by ID with all its properties.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `node_id` | string | Yes | ID of the node to retrieve |

**Returns:**
```json
{
  "id": "abc-123-def",
  "name": "Task name",
  "note": "Task notes",
  "priority": 200,
  "data": {
    "layoutMode": "bullets"
  },
  "createdAt": 1707484800,
  "modifiedAt": 1707488400,
  "completedAt": null
}
```

---

### workflowy_list_nodes

List child nodes of a parent. Returns nodes in unordered format - sort by `priority` field if needed.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `parent_id` | string | No | Parent node ID, target key, or omit for root nodes |

**Returns:**
```json
{
  "nodes": [
    {
      "id": "abc-123",
      "name": "First task",
      "note": null,
      "priority": 100,
      "data": { "layoutMode": "bullets" },
      "createdAt": 1707484800,
      "modifiedAt": 1707488400,
      "completedAt": null
    }
  ],
  "count": 1
}
```

---

### workflowy_delete_node

Permanently delete a node and all its children. **This cannot be undone.**

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `node_id` | string | Yes | ID of the node to delete |

**Returns:**
```json
{
  "success": true
}
```

---

### workflowy_move_node

Move a node to a new parent location.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `node_id` | string | Yes | ID of the node to move |
| `parent_id` | string | Yes | New parent node ID or target key |
| `position` | enum | No | Placement: `top` (default) or `bottom` |

**Returns:**
```json
{
  "success": true
}
```

---

### workflowy_complete_node

Mark a node as completed (checked).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `node_id` | string | Yes | ID of the node to mark as complete |

**Returns:**
```json
{
  "success": true
}
```

---

### workflowy_uncomplete_node

Mark a node as uncompleted (unchecked).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `node_id` | string | Yes | ID of the node to mark as uncomplete |

**Returns:**
```json
{
  "success": true
}
```

---

## Navigation & Discovery

### workflowy_get_targets

Get all available targets including system targets (inbox, today) and custom shortcuts.

**Parameters:** None

**Returns:**
```json
{
  "targets": [
    {
      "key": "inbox",
      "type": "system",
      "name": "Inbox"
    },
    {
      "key": "home",
      "type": "shortcut",
      "name": "My Home Page"
    }
  ],
  "count": 2
}
```

**Target Types:**
- `system`: Built-in targets (inbox, today)
- `shortcut`: User-defined shortcuts

---

## Search

### workflowy_search_nodes

Search nodes by text query with advanced options. Automatically syncs cache if needed (rate limited to 1/min).

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `query` | string | Yes | Search query text or regex pattern |
| `case_sensitive` | boolean | No | Case-sensitive search (default: false) |
| `regex` | boolean | No | Treat query as regex pattern (default: false) |
| `parent_id` | string | No | Limit search to this subtree |

**Returns:**
```json
{
  "results": [
    {
      "id": "abc-123",
      "name": "Project planning meeting",
      "note": "Discuss timeline",
      "priority": 100,
      "data": { "layoutMode": "bullets" },
      "createdAt": 1707484800,
      "modifiedAt": 1707488400,
      "completedAt": null,
      "parent_id": "inbox"
    }
  ],
  "count": 1,
  "cache_status": {
    "cached": true,
    "nodeCount": 1523,
    "lastSync": 1707484800000,
    "expiresAt": 1707488400000
  }
}
```

**Search Features:**
- Searches both node names and notes
- Supports regex patterns
- Case-sensitive/insensitive options
- Subtree filtering

**Examples:**

Simple text search:
```json
{
  "query": "meeting"
}
```

Regex search:
```json
{
  "query": "project-\\d+",
  "regex": true
}
```

Case-sensitive search in subtree:
```json
{
  "query": "URGENT",
  "case_sensitive": true,
  "parent_id": "inbox"
}
```

---

### workflowy_sync_cache

Manually sync the local cache with all WorkFlowy nodes. **Rate limited to 1 request per minute.**

**Parameters:** None

**Returns:**
```json
{
  "success": true,
  "message": "Cache synced successfully",
  "cached": true,
  "nodeCount": 1523,
  "lastSync": 1707484800000,
  "expiresAt": 1707488400000
}
```

**Notes:**
- Cache automatically syncs on first search
- Cache expires after 1 hour by default (configurable)
- Optimistic updates keep cache fresh for CRUD operations

---

## Bookmarks

### workflowy_save_bookmark

Save a node ID with a friendly name for quick access later.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `node_id` | string | Yes | Node UUID to bookmark |
| `name` | string | Yes | Friendly name for the bookmark |

**Returns:**
```json
{
  "success": true,
  "bookmark": {
    "id": "bm_1707484800_abc123",
    "node_id": "abc-123-def",
    "name": "Sprint Planning",
    "created_at": 1707484800000
  }
}
```

---

### workflowy_list_bookmarks

List all saved bookmarks, sorted by creation time (newest first).

**Parameters:** None

**Returns:**
```json
{
  "bookmarks": [
    {
      "id": "bm_1707484800_abc123",
      "node_id": "abc-123-def",
      "name": "Sprint Planning",
      "created_at": 1707484800000
    }
  ],
  "count": 1
}
```

---

### workflowy_delete_bookmark

Delete a saved bookmark by name.

**Parameters:**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | Yes | Name of the bookmark to delete |

**Returns:**
```json
{
  "success": true
}
```

**Error:**
```json
{
  "error": "BOOKMARK_NOT_FOUND",
  "message": "Bookmark \"Sprint Planning\" not found"
}
```

---

## Data Types

### Node Object

```typescript
{
  id: string;              // Unique node identifier
  name: string;            // Node text content
  note: string | null;     // Additional note content
  priority: number;        // Sort order among siblings
  data: {
    layoutMode: string;    // Display mode
  };
  createdAt: number;       // Unix timestamp
  modifiedAt: number;      // Unix timestamp
  completedAt: number | null;  // Unix timestamp or null
  parent_id?: string;      // Only in export/search responses
}
```

### Target Object

```typescript
{
  key: string;             // Unique identifier (e.g., "inbox", "home")
  type: "shortcut" | "system";  // Target type
  name: string | null;     // Display name (null if not created)
}
```

### Bookmark Object

```typescript
{
  id: string;              // Unique bookmark identifier
  node_id: string;         // Referenced node UUID
  name: string;            // Friendly bookmark name
  created_at: number;      // Unix timestamp in milliseconds
}
```

---

## Error Codes

All errors return in this format:

```json
{
  "error": "ERROR_CODE",
  "message": "Human-readable error message",
  "details": { /* Additional context */ }
}
```

### Error Code Reference

| Code | Description | Resolution |
|------|-------------|------------|
| `WORKFLOWY_AUTH_ERROR` | Authentication failed | Check your API key |
| `WORKFLOWY_NOT_FOUND` | Node not found | Verify the node ID exists |
| `WORKFLOWY_RATE_LIMIT` | Rate limit exceeded | Wait before retrying (1 min for export) |
| `WORKFLOWY_INVALID_INPUT` | Invalid request parameters | Check parameter format |
| `WORKFLOWY_API_ERROR` | WorkFlowy API error | Check API status |
| `WORKFLOWY_NETWORK_ERROR` | Network connection failed | Check internet connection |
| `BOOKMARK_NOT_FOUND` | Bookmark not found | Verify bookmark name |
| `UNKNOWN_TOOL` | Tool not recognized | Check tool name spelling |
| `UNKNOWN_ERROR` | Unexpected error | Report to maintainers |

---

## Rate Limits

- **Export endpoint**: 1 request per minute (WorkFlowy limitation)
- **Other endpoints**: No specific limits, but be reasonable
- **Cache**: Reduces need for export calls

## Best Practices

1. **Use bookmarks** for frequently accessed nodes
2. **Enable caching** for better search performance
3. **Batch operations** when possible to reduce API calls
4. **Handle errors gracefully** with proper error codes
5. **Sort list results** by priority field when order matters
6. **Use targets** (inbox, home) instead of hardcoding node IDs

---

For more information, see the [README](./README.md) or [WorkFlowy API Documentation](https://beta.workflowy.com/api-reference/).
