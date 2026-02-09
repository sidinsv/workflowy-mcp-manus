# Quick Start Guide

Get your WorkFlowy MCP server running in 15 minutes!

## 🚀 Fast Track to Smithery

### Step 1: Get Your API Key (2 min)

1. Visit [https://beta.workflowy.com/api-reference/](https://beta.workflowy.com/api-reference/)
2. Click "Get API Key"
3. Copy your API key

### Step 2: Push to GitHub (3 min)

```bash
cd /path/to/workflowy-mcp

# Using GitHub CLI (recommended)
gh repo create workflowy-mcp --public --source=. --push

# Or manually at github.com/new
```

### Step 3: Deploy to Vercel (5 min)

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click "Add New Project"
3. Import `workflowy-mcp` repository
4. Configure:
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
5. Click "Deploy"
6. Copy your URL: `https://workflowy-mcp-xxx.vercel.app`

### Step 4: Publish to Smithery (5 min)

1. Go to [smithery.ai/new](https://smithery.ai/new)
2. Click "URL" tab
3. Paste your Vercel URL
4. Click "Publish"
5. Done! 🎉

### Step 5: Connect & Use (2 min)

**In Claude Desktop:**
1. Settings → MCP Servers → Add Server
2. Search "workflowy-mcp"
3. Enter your WorkFlowy API key
4. Start using:
   - "List my WorkFlowy inbox"
   - "Create a task 'Test' in my inbox"
   - "Search for nodes containing 'project'"

---

## 🛠️ Local Development

### Quick Test

```bash
# Install dependencies
pnpm install

# Build
pnpm run build

# Run with your API key
WORKFLOWY_API_KEY=your_key pnpm run dev
```

### Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "workflowy": {
      "command": "node",
      "args": ["/absolute/path/to/workflowy-mcp/dist/index.js"],
      "env": {
        "WORKFLOWY_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

Restart Claude Desktop.

---

## 📚 Available Tools

### Core Operations
- `workflowy_create_node` - Create nodes
- `workflowy_update_node` - Update nodes
- `workflowy_get_node` - Get node details
- `workflowy_list_nodes` - List child nodes
- `workflowy_delete_node` - Delete nodes
- `workflowy_move_node` - Move nodes
- `workflowy_complete_node` - Mark complete
- `workflowy_uncomplete_node` - Mark incomplete

### Discovery
- `workflowy_get_targets` - Get inbox/home/shortcuts
- `workflowy_search_nodes` - Full-text search
- `workflowy_sync_cache` - Sync cache manually

### Bookmarks
- `workflowy_save_bookmark` - Save bookmark
- `workflowy_list_bookmarks` - List bookmarks
- `workflowy_delete_bookmark` - Delete bookmark

---

## 💡 Example Commands

Ask your AI assistant:

```
"List my WorkFlowy inbox items"
"Create a new task 'Review PR #123' in my inbox"
"Search for all nodes containing 'meeting notes'"
"Mark task abc-123-def as complete"
"Save node abc-123-def as bookmark 'Sprint Planning'"
"Move task xyz-456 to my inbox"
"Get all my WorkFlowy shortcuts"
```

---

## 🔧 Troubleshooting

### Build fails?
```bash
pnpm run build
# Fix any TypeScript errors shown
```

### Can't connect to WorkFlowy?
- Check your API key at https://beta.workflowy.com/api-reference/
- Ensure API key is provided correctly

### Rate limit error?
- Export endpoint: 1 request per minute
- Wait before trying search/sync again

### Need help?
- See [SMITHERY_SETUP.md](./SMITHERY_SETUP.md) for detailed guide
- Check [API_REFERENCE.md](./API_REFERENCE.md) for tool details
- Read [README.md](./README.md) for full documentation

---

## 📖 Learn More

- **Full Setup Guide**: [SMITHERY_SETUP.md](./SMITHERY_SETUP.md)
- **API Reference**: [API_REFERENCE.md](./API_REFERENCE.md)
- **Deployment Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Main README**: [README.md](./README.md)

---

**That's it!** You're ready to use WorkFlowy with AI assistants anywhere. 🎉
