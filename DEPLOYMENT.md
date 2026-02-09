# Deployment Guide for Smithery

This guide walks you through deploying the WorkFlowy MCP server to Smithery for universal access.

## Deployment Options

### Option 1: URL Method with Vercel (Recommended)

This is the easiest and most flexible approach. You'll deploy your server to Vercel (free tier) and then publish it to Smithery.

#### Step 1: Prepare Your Repository

1. **Create a GitHub repository** (if you haven't already):
   ```bash
   cd /path/to/workflowy-mcp
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create workflowy-mcp --public --source=. --push
   ```

2. **Ensure your repository has these files**:
   - `package.json` - Dependencies and scripts
   - `tsconfig.json` - TypeScript configuration
   - `src/` - Source code
   - `vercel.json` - Vercel configuration (see below)

#### Step 2: Create Vercel Configuration

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/src/index.ts"
    }
  ]
}
```

**Note**: For Vercel deployment, you'll need to modify the server to support HTTP transport in addition to stdio. See the "HTTP Transport" section below.

#### Step 3: Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd /path/to/workflowy-mcp
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Select your GitHub repository
   - Configure project settings

5. **Add environment variables** (optional):
   - Go to your Vercel project settings
   - Add any environment variables if needed
   - Note: API keys are provided per-request via headers, not environment variables

6. **Get your deployment URL**:
   - After deployment, Vercel will provide a URL like `https://workflowy-mcp.vercel.app`
   - This is your public HTTPS URL for Smithery

#### Step 4: Publish to Smithery

1. **Go to Smithery**:
   - Visit [https://smithery.ai/new](https://smithery.ai/new)

2. **Select "URL" method**:
   - Click on the "URL" tab

3. **Enter your server URL**:
   - Paste your Vercel URL (e.g., `https://workflowy-mcp.vercel.app`)

4. **Complete the publishing flow**:
   - Smithery will scan your server
   - It will extract metadata (tools, prompts, resources)
   - Review and confirm the information

5. **Configure authentication**:
   - Since our server requires an API key, Smithery will prompt you
   - Users will provide their WorkFlowy API key when connecting

6. **Publish**:
   - Click "Publish" to make your server available
   - Your server is now accessible to anyone via Smithery!

### Option 2: Smithery Hosted (If Available)

**Status**: Private Early Access - Contact Smithery if interested

If you have access to Smithery Hosted:

1. **Build your server using Smithery CLI**:
   ```bash
   npm install -g @smithery/cli
   npx create-smithery@latest
   ```

2. **Deploy**:
   ```bash
   npx @smithery/cli deploy --name @your-org/workflowy-mcp
   ```

**Runtime Constraints**:
- Memory: 128 MB
- CPU time: 30 seconds per request
- No filesystem access, native modules, or spawning processes

### Option 3: Local Development

For testing and personal use:

1. **Run the server locally**:
   ```bash
   WORKFLOWY_API_KEY=your_key pnpm run dev
   ```

2. **Configure your MCP client** (e.g., Claude Desktop):
   ```json
   {
     "mcpServers": {
       "workflowy": {
         "command": "node",
         "args": ["/path/to/workflowy-mcp/dist/index.js"],
         "env": {
           "WORKFLOWY_API_KEY": "your_api_key_here"
         }
       }
     }
   }
   ```

## HTTP Transport for Vercel

To support Vercel deployment, you need to add HTTP transport support. Here's how:

### 1. Install Additional Dependencies

```bash
pnpm add express @types/express
```

### 2. Create HTTP Server Entry Point

Create `src/server.ts`:

```typescript
import express from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// Import your existing server setup

const app = express();
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  
  if (!apiKey) {
    return res.status(401).json({ error: "API key required" });
  }

  // Create server instance with API key
  const server = createMCPServer(apiKey);
  
  // Create SSE transport
  const transport = new SSEServerTransport("/mcp", res);
  await server.connect(transport);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Update package.json

```json
{
  "scripts": {
    "dev": "tsx src/index.ts",
    "dev:server": "tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

## Testing Your Deployment

### Test with MCP Inspector

```bash
# For local testing
WORKFLOWY_API_KEY=your_key npx @modelcontextprotocol/inspector pnpm run dev

# For HTTP server testing
npx @modelcontextprotocol/inspector http://localhost:3000/mcp
```

### Test with curl

```bash
# Test the HTTP endpoint
curl -X POST https://your-vercel-url.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_workflowy_api_key" \
  -d '{"method": "tools/list"}'
```

### Test with Claude Desktop

1. Add your Smithery-published server to Claude Desktop
2. Provide your WorkFlowy API key
3. Try commands like:
   - "List my WorkFlowy inbox"
   - "Search for nodes containing 'project'"

## Troubleshooting

### "API key required" error
- Ensure you're providing the WorkFlowy API key via the `x-api-key` header
- Check that the API key is valid at https://beta.workflowy.com/api-reference/

### "Rate limit" error
- The export endpoint is limited to 1 request per minute
- Wait before trying to sync/search again
- Cache is automatically used to avoid hitting this limit

### Server not responding
- Check Vercel logs for errors
- Verify your deployment URL is correct
- Ensure HTTPS is being used

### Smithery scanning fails
- Ensure your server is publicly accessible
- Check that it responds to MCP protocol requests
- Verify authentication is properly configured

## Updating Your Deployment

### Update Vercel Deployment

```bash
# Make your changes
git add .
git commit -m "Update server"
git push

# Vercel will automatically redeploy
```

### Update Smithery Listing

1. Go to your server's settings page on Smithery
2. Click "Re-scan" to update metadata
3. Changes will be reflected immediately

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for sensitive data
3. **Validate all inputs** (already implemented with Zod)
4. **Use HTTPS only** for production deployments
5. **Monitor usage** via Vercel analytics

## Cost Considerations

### Vercel Free Tier Limits
- 100 GB bandwidth per month
- 100 hours of serverless function execution
- Unlimited deployments

For most personal use cases, the free tier is sufficient. If you exceed limits, consider upgrading to Vercel Pro.

### Smithery
- Free to publish and use
- Built-in analytics and observability
- No hosting costs (you bring your own hosting)

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Publish to Smithery
3. 📝 Share your server with the community
4. 🚀 Build amazing workflows with AI assistants!

## Support

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **Smithery Issues**: [smithery.ai/support](https://smithery.ai/support)
- **MCP Protocol**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- **WorkFlowy API**: [beta.workflowy.com/api-reference/](https://beta.workflowy.com/api-reference/)

---

Happy deploying! 🚀
