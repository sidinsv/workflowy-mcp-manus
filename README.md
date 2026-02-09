# WorkFlowy MCP Server

Production-ready MCP server for WorkFlowy with advanced search, caching, and bookmark management. Built with Next.js and optimized for Vercel deployment.

## 🚀 Quick Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import `sidinsv/workflowy-mcp-manus`
4. Click "Deploy" (no environment variables needed!)
5. Copy your deployment URL (e.g., `https://workflowy-mcp-manus.vercel.app`)

## 📡 Publish to Smithery

After deploying to Vercel:

1. Go to [smithery.ai/new](https://smithery.ai/new)
2. Click the "URL" tab
3. Enter your Vercel URL + `/api/mcp` (e.g., `https://workflowy-mcp-manus.vercel.app/api/mcp`)
4. Click "Publish"

Your server is now accessible from any MCP client worldwide! 🌍

## 🔑 Get Your WorkFlowy API Key

1. Visit [beta.workflowy.com/api-reference/](https://beta.workflowy.com/api-reference/)
2. Generate or copy your API key
3. Keep it secure - you'll provide it when connecting from your MCP client

## 💻 Connect from Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "workflowy": {
      "type": "streamable-http",
      "url": "https://workflowy-mcp-manus.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_WORKFLOWY_API_KEY"
      }
    }
  }
}
```

Replace `YOUR_WORKFLOWY_API_KEY` with your actual API key.

## ✨ Features

### 14 Powerful Tools

1. **workflowy_create_node** - Create nodes with markdown formatting
2. **workflowy_update_node** - Update node properties
3. **workflowy_get_node** - Retrieve specific nodes
4. **workflowy_list_nodes** - List child nodes
5. **workflowy_delete_node** - Delete nodes and children
6. **workflowy_move_node** - Move nodes to new parents
7. **workflowy_complete_node** - Mark as complete
8. **workflowy_uncomplete_node** - Mark as incomplete
9. **workflowy_get_targets** - List inbox, home, and shortcuts
10. **workflowy_search_nodes** - Advanced search with regex
11. **workflowy_sync_cache** - Manual cache synchronization
12. **workflowy_save_bookmark** - Save frequently-used nodes
13. **workflowy_list_bookmarks** - List all bookmarks
14. **workflowy_delete_bookmark** - Remove bookmarks

### Advanced Capabilities

- ✅ **Smart Caching** - 1-hour TTL reduces API calls
- ✅ **Full-Text Search** - Regex support, case-sensitive options
- ✅ **Bookmark Management** - Quick access to important nodes
- ✅ **Complete CRUD** - All WorkFlowy operations supported
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **Rate Limiting** - Automatic compliance with API limits

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/sidinsv/workflowy-mcp-manus.git
cd workflowy-mcp-manus

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm run build
```

## 📖 API Reference

See [API_REFERENCE.md](./API_REFERENCE.md) for complete tool documentation.

## 🏗️ Architecture

- **Framework**: Next.js 15 with App Router
- **MCP Handler**: `mcp-handler` for HTTP transport
- **Runtime**: Node.js serverless functions
- **Deployment**: Vercel (free tier supported)
- **Language**: TypeScript with full type safety

## 💰 Cost

**Completely FREE** for personal use:
- ✅ Vercel Free Tier: 100 hours execution/month
- ✅ GitHub: Free public repositories
- ✅ Smithery: Free publishing and usage
- ✅ WorkFlowy API: Free with your account

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🙏 Acknowledgments

Built with ❤️ using Manus AI, inspired by the WorkFlowy MCP community.

Special thanks to:
- [vladzima/workflowy-mcp](https://github.com/vladzima/workflowy-mcp)
- [mholzen/workflowy](https://github.com/mholzen/workflowy)
- [danield137/mcp-workflowy](https://github.com/danield137/mcp-workflowy)
- [rodolfo-terriquez/workflowy-mcp](https://github.com/rodolfo-terriquez/workflowy-mcp)
- [rodolfo-terriquez/workflowy-local-mcp](https://github.com/rodolfo-terriquez/workflowy-local-mcp)

---

**Need help?** Open an issue on [GitHub](https://github.com/sidinsv/workflowy-mcp-manus/issues)
