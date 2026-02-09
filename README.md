# WorkFlowy MCP Server

A powerful Model Context Protocol (MCP) server that integrates WorkFlowy's outline and task management capabilities with AI assistants. Access your WorkFlowy data from anywhere through Smithery's cloud gateway.

## Features

✨ **Complete WorkFlowy API Integration**
- Create, read, update, and delete nodes
- Move nodes between parents
- Mark nodes as complete/incomplete
- Access targets (inbox, home, custom shortcuts)

🔍 **Advanced Search**
- Full-text search across all nodes
- Regex pattern matching
- Case-sensitive/insensitive search
- Subtree filtering

📌 **Bookmark Management**
- Save frequently-used node IDs with friendly names
- Quick access to important locations
- List and delete bookmarks

⚡ **Performance Optimizations**
- Local caching for fast searches
- Optimistic updates
- Configurable cache TTL
- Rate limiting compliance

## Installation

### Option 1: Use via Smithery (Recommended)

1. Visit [smithery.ai](https://smithery.ai)
2. Search for "workflowy-mcp"
3. Click "Connect" and provide your WorkFlowy API key
4. Start using with your favorite AI assistant!

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/workflowy-mcp.git
cd workflowy-mcp

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run with your API key
WORKFLOWY_API_KEY=your_key_here pnpm run dev
```

## Getting Your WorkFlowy API Key

1. Visit [https://beta.workflowy.com/api-reference/](https://beta.workflowy.com/api-reference/)
2. Click "Get API Key"
3. Copy your API key
4. Keep it secure - never commit it to version control!

## Available Tools

### Core Node Operations

#### `workflowy_create_node`
Create a new node with markdown formatting support.

```json
{
  "parent_id": "inbox",
  "name": "# Project Planning",
  "note": "Detailed project notes",
  "layoutMode": "h1",
  "position": "top"
}
```

#### `workflowy_update_node`
Update an existing node's properties.

```json
{
  "node_id": "abc-123-def",
  "name": "Updated task name",
  "note": "New notes"
}
```

#### `workflowy_get_node`
Retrieve a specific node by ID.

```json
{
  "node_id": "abc-123-def"
}
```

#### `workflowy_list_nodes`
List child nodes of a parent.

```json
{
  "parent_id": "inbox"
}
```

#### `workflowy_delete_node`
Permanently delete a node and its children.

```json
{
  "node_id": "abc-123-def"
}
```

#### `workflowy_move_node`
Move a node to a new parent.

```json
{
  "node_id": "abc-123-def",
  "parent_id": "home",
  "position": "top"
}
```

#### `workflowy_complete_node`
Mark a node as completed.

```json
{
  "node_id": "abc-123-def"
}
```

#### `workflowy_uncomplete_node`
Mark a node as uncompleted.

```json
{
  "node_id": "abc-123-def"
}
```

### Targets & Navigation

#### `workflowy_get_targets`
Get all available targets (inbox, home, shortcuts).

```json
{}
```

### Search & Discovery

#### `workflowy_search_nodes`
Search nodes with advanced options.

```json
{
  "query": "project",
  "case_sensitive": false,
  "regex": false,
  "parent_id": "optional-parent-id"
}
```

#### `workflowy_sync_cache`
Manually sync the local cache (rate limited to 1/min).

```json
{}
```

### Bookmarks

#### `workflowy_save_bookmark`
Save a node ID with a friendly name.

```json
{
  "node_id": "abc-123-def",
  "name": "My Project"
}
```

#### `workflowy_list_bookmarks`
List all saved bookmarks.

```json
{}
```

#### `workflowy_delete_bookmark`
Delete a bookmark by name.

```json
{
  "name": "My Project"
}
```

## Usage Examples

### With Claude Desktop

Ask Claude:
- "List my WorkFlowy inbox items"
- "Create a new task 'Review PR' in my inbox"
- "Search for all nodes containing 'meeting notes'"
- "Mark task abc-123-def as complete"
- "Save node abc-123-def as bookmark 'Sprint Planning'"

### With Other MCP Clients

Any MCP-compatible client can use this server. Simply configure it with your WorkFlowy API key and start interacting!

## Configuration

### Environment Variables

- `WORKFLOWY_API_KEY` - Your WorkFlowy API key (required)
- `CACHE_ENABLED` - Enable caching (default: true)
- `CACHE_TTL` - Cache time-to-live in seconds (default: 3600)

### Cache Behavior

- **Auto-sync**: Cache syncs automatically on first search
- **TTL**: Cache expires after 1 hour by default
- **Manual sync**: Use `workflowy_sync_cache` tool
- **Optimistic updates**: Create/update/delete operations update cache immediately

## API Limitations

⚠️ **Important**: The WorkFlowy API has some limitations:

- **Export rate limit**: 1 request per minute (for search/sync operations)
- **No native search**: Search is implemented via local caching
- **No URL ID support**: Web interface IDs are not compatible with API IDs
- **Hierarchical navigation**: Must navigate from root to find deeply nested nodes

## Architecture

```
workflowy-mcp/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── config.ts             # Configuration schema
│   ├── client/
│   │   ├── workflowy.ts      # WorkFlowy API client
│   │   └── types.ts          # TypeScript types
│   ├── cache/
│   │   └── memory.ts         # In-memory cache
│   └── utils/
│       ├── bookmarks.ts      # Bookmark storage
│       └── errors.ts         # Error handling
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- WorkFlowy account with API access

### Setup

```bash
# Install dependencies
pnpm install

# Run in development mode
WORKFLOWY_API_KEY=your_key pnpm run dev

# Build for production
pnpm run build

# Run built version
WORKFLOWY_API_KEY=your_key pnpm start
```

### Testing with MCP Inspector

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Run the server with inspector
WORKFLOWY_API_KEY=your_key npx @modelcontextprotocol/inspector pnpm run dev
```

## Deployment

### Deploy to Vercel (for Smithery URL method)

1. Fork this repository
2. Import to Vercel
3. Add `WORKFLOWY_API_KEY` environment variable
4. Deploy
5. Publish to Smithery using the Vercel URL

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Acknowledgments

- Built with [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk)
- Inspired by existing WorkFlowy MCP implementations:
  - [vladzima/workflowy-mcp](https://github.com/vladzima/workflowy-mcp)
  - [mholzen/workflowy](https://github.com/mholzen/workflowy)
  - [danield137/mcp-workflowy](https://github.com/danield137/mcp-workflowy)
  - [rodolfo-terriquez/workflowy-local-mcp](https://github.com/rodolfo-terriquez/workflowy-local-mcp)
  - [rodolfo-terriquez/workflowy-mcp](https://github.com/rodolfo-terriquez/workflowy-mcp)

## Support

- 📖 [WorkFlowy API Documentation](https://beta.workflowy.com/api-reference/)
- 💬 [MCP Documentation](https://modelcontextprotocol.io/)
- 🌐 [Smithery](https://smithery.ai/)

---

Made with ❤️ for the WorkFlowy and MCP communities
