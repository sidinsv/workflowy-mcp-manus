# Complete Smithery Setup Guide

This guide provides step-by-step instructions for publishing your WorkFlowy MCP server to Smithery so you can use it anywhere.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start (Recommended Path)](#quick-start-recommended-path)
3. [Method 1: GitHub + Vercel + Smithery URL](#method-1-github--vercel--smithery-url)
4. [Method 2: Direct Smithery Hosted](#method-2-direct-smithery-hosted)
5. [Testing Your Deployment](#testing-your-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, make sure you have:

- ✅ A GitHub account
- ✅ A WorkFlowy account with API access
- ✅ Your WorkFlowy API key ([get it here](https://beta.workflowy.com/api-reference/))
- ✅ Node.js 20+ installed locally (for testing)

---

## Quick Start (Recommended Path)

**Total time: ~15 minutes**

This is the fastest way to get your server published and accessible from anywhere:

### Step 1: Push to GitHub (2 minutes)

```bash
# Navigate to your project
cd /path/to/workflowy-mcp

# Create a new GitHub repository
gh repo create workflowy-mcp --public --source=. --push

# Or if you prefer the web interface:
# 1. Go to github.com/new
# 2. Create a new repository named "workflowy-mcp"
# 3. Follow the instructions to push your existing code
```

### Step 2: Deploy to Vercel (5 minutes)

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository**:
   - Select "workflowy-mcp" from your repositories
   - Click "Import"

4. **Configure the project**:
   - Framework Preset: **Other**
   - Build Command: `pnpm run build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

5. **Deploy**:
   - Click "Deploy"
   - Wait for deployment to complete (~2 minutes)
   - Copy your deployment URL (e.g., `https://workflowy-mcp.vercel.app`)

### Step 3: Publish to Smithery (5 minutes)

1. **Go to [smithery.ai/new](https://smithery.ai/new)**

2. **Select "URL" tab**

3. **Enter your Vercel URL**:
   - Paste: `https://your-project.vercel.app`

4. **Complete the publishing flow**:
   - Smithery will scan your server
   - Review the extracted tools and metadata
   - Confirm and publish

5. **Done!** Your server is now live at `smithery.ai/server/@yourusername/workflowy-mcp`

### Step 4: Connect and Use (3 minutes)

1. **In Claude Desktop** (or any MCP client):
   - Go to Settings → MCP Servers
   - Click "Add Server"
   - Search for "workflowy-mcp"
   - Click "Connect"
   - Enter your WorkFlowy API key when prompted

2. **Start using**:
   - "List my WorkFlowy inbox"
   - "Create a task 'Review PR' in my inbox"
   - "Search for nodes containing 'meeting'"

---

## Method 1: GitHub + Vercel + Smithery URL

This is the recommended method for most users. It gives you full control and free hosting.

### 1.1 Prepare Your Code

Ensure your repository has all necessary files:

```
workflowy-mcp/
├── src/                    # Source code
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── README.md               # Documentation
├── .gitignore              # Git ignore rules
└── LICENSE                 # MIT License
```

### 1.2 Create GitHub Repository

**Option A: Using GitHub CLI**

```bash
cd /path/to/workflowy-mcp

# Login to GitHub (if not already)
gh auth login

# Create and push repository
gh repo create workflowy-mcp --public --source=. --push
```

**Option B: Using Web Interface**

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `workflowy-mcp`
3. Visibility: Public (required for free Vercel hosting)
4. Click "Create repository"
5. Follow the instructions to push your code:

```bash
cd /path/to/workflowy-mcp
git remote add origin https://github.com/yourusername/workflowy-mcp.git
git branch -M main
git push -u origin main
```

### 1.3 Deploy to Vercel

**Why Vercel?**
- Free tier with generous limits
- Automatic deployments on git push
- Global CDN for fast response times
- Easy HTTPS setup

**Deployment Steps:**

1. **Sign up/Login to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**:
   - Click "Add New" → "Project"
   - Select your GitHub repository `workflowy-mcp`
   - Click "Import"

3. **Configure Build Settings**:
   ```
   Framework Preset: Other
   Build Command: pnpm run build
   Output Directory: dist
   Install Command: pnpm install
   Node.js Version: 20.x
   ```

4. **Environment Variables** (Optional):
   - You don't need to set `WORKFLOWY_API_KEY` here
   - API keys are provided per-request via headers
   - Optionally set `CACHE_TTL` if you want custom cache duration

5. **Deploy**:
   - Click "Deploy"
   - Wait for build to complete
   - Your server will be live at `https://workflowy-mcp-xxx.vercel.app`

6. **Get Your URL**:
   - Copy the deployment URL from Vercel dashboard
   - This is what you'll use for Smithery

### 1.4 Publish to Smithery

1. **Navigate to Smithery**:
   - Go to [smithery.ai/new](https://smithery.ai/new)
   - Or click "Add Server" from your Smithery dashboard

2. **Select URL Method**:
   - Click the "URL" tab
   - This method is for servers you host yourself

3. **Enter Server URL**:
   - Paste your Vercel URL: `https://workflowy-mcp-xxx.vercel.app`
   - Click "Next"

4. **Server Scanning**:
   - Smithery will connect to your server
   - It will extract metadata (tools, descriptions, parameters)
   - This may take 30-60 seconds

5. **Configure Server Details**:
   - **Name**: workflowy-mcp (auto-filled)
   - **Description**: Review and edit if needed
   - **Category**: Productivity / Task Management
   - **Tags**: workflowy, tasks, notes, outline

6. **Authentication Setup**:
   - Smithery detects that your server requires an API key
   - It will automatically configure the auth flow
   - Users will be prompted for their WorkFlowy API key when connecting

7. **Review & Publish**:
   - Review the extracted tools (should show 14 tools)
   - Check that all descriptions are accurate
   - Click "Publish"

8. **Success!**:
   - Your server is now live on Smithery
   - Share the URL: `https://smithery.ai/server/@yourusername/workflowy-mcp`

### 1.5 Update Your Server

When you make changes to your code:

```bash
# Make your changes
git add .
git commit -m "Add new feature"
git push

# Vercel automatically redeploys
# Wait ~2 minutes for deployment

# Update Smithery metadata
# Go to smithery.ai/server/@yourusername/workflowy-mcp/settings
# Click "Re-scan Server"
```

---

## Method 2: Direct Smithery Hosted

**Status**: Private Early Access

If you have access to Smithery's hosted platform, you can deploy directly without external hosting.

### 2.1 Install Smithery CLI

```bash
npm install -g @smithery/cli
```

### 2.2 Modify Your Code

Smithery hosted requires a specific structure. Create `src/smithery.ts`:

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
// Import your existing tools and logic

export default function createServer({ config }) {
  const server = new McpServer({
    name: "workflowy-mcp",
    version: "1.0.0",
  });

  // Register all your tools here
  // ... (copy from src/index.ts)

  return server.server;
}

export const configSchema = z.object({
  apiKey: z.string().describe("Your WorkFlowy API key"),
  cacheEnabled: z.boolean().default(true),
  cacheTTL: z.number().default(3600),
});

export const stateful = false; // Stateless for better performance
```

### 2.3 Update package.json

```json
{
  "name": "workflowy-mcp",
  "version": "1.0.0",
  "type": "module",
  "module": "./src/smithery.ts",
  "scripts": {
    "dev": "smithery dev",
    "build": "smithery build"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.25.1",
    "zod": "^4",
    "node-fetch": "^3.3.2"
  },
  "devDependencies": {
    "@smithery/cli": "^2.2.1"
  }
}
```

### 2.4 Deploy

```bash
# Login to Smithery
smithery login

# Deploy your server
smithery deploy --name @yourusername/workflowy-mcp

# Your server is now live!
```

**Runtime Constraints**:
- Memory: 128 MB
- CPU time: 30 seconds per request
- No filesystem access
- No native Node.js modules
- No spawning processes

**Note**: These constraints should be fine for our server since we don't use filesystem or native modules.

---

## Testing Your Deployment

### Test 1: Verify Server is Running

```bash
# Check if your Vercel deployment is live
curl https://your-project.vercel.app

# Should return MCP server info or a health check response
```

### Test 2: Test with MCP Inspector

```bash
# Install MCP Inspector
npm install -g @modelcontextprotocol/inspector

# Test your deployed server
npx @modelcontextprotocol/inspector https://your-project.vercel.app
```

### Test 3: Connect with Claude Desktop

1. Open Claude Desktop
2. Go to Settings → MCP Servers
3. Add your server from Smithery
4. Provide your WorkFlowy API key
5. Test with commands:
   - "List my WorkFlowy targets"
   - "Search for nodes containing 'test'"

### Test 4: Verify All Tools Work

Try each tool category:

**Node Operations**:
```
Create a test node in my inbox
Update the node with new text
Mark it as complete
Delete the test node
```

**Search**:
```
Search for nodes containing "project"
Search with regex pattern "task-\d+"
```

**Bookmarks**:
```
Save node abc-123 as bookmark "Test"
List all my bookmarks
Delete bookmark "Test"
```

---

## Troubleshooting

### Issue: Vercel Build Fails

**Symptoms**: Build fails with TypeScript errors

**Solution**:
```bash
# Test build locally first
cd /path/to/workflowy-mcp
pnpm run build

# Fix any TypeScript errors
# Then push to GitHub
git add .
git commit -m "Fix build errors"
git push
```

### Issue: Smithery Can't Connect to Server

**Symptoms**: "Server not responding" or "Connection timeout"

**Checklist**:
1. ✅ Is your Vercel deployment live?
2. ✅ Is the URL correct (HTTPS)?
3. ✅ Does the server respond to HTTP requests?
4. ✅ Are there any CORS issues?

**Solution**:
```bash
# Test the URL manually
curl -I https://your-project.vercel.app

# Check Vercel logs for errors
vercel logs
```

### Issue: "API Key Required" Error

**Symptoms**: Tools fail with authentication error

**Solution**:
- Ensure you provided your WorkFlowy API key when connecting
- Verify the API key is valid at https://beta.workflowy.com/api-reference/
- Check that the key is being sent in the `x-api-key` header

### Issue: "Rate Limit" Error

**Symptoms**: Search fails with "Please wait X seconds"

**Solution**:
- The WorkFlowy export endpoint is limited to 1 request per minute
- Wait before trying again
- Cache is automatically used to avoid this limit
- Manual sync with `workflowy_sync_cache` is also rate limited

### Issue: Tools Not Showing in Smithery

**Symptoms**: Smithery shows 0 tools or incomplete list

**Solution**:
1. Check that your server implements MCP protocol correctly
2. Verify `ListToolsRequestSchema` handler is working
3. Re-scan your server in Smithery settings
4. Check Vercel logs for errors

### Issue: Deployment URL Changes

**Symptoms**: Vercel URL changes after redeployment

**Solution**:
- Use a custom domain (Vercel settings)
- Or use Vercel's stable production URL
- Update Smithery with new URL if needed

---

## Best Practices

### Security

1. **Never commit API keys** to GitHub
2. **Use environment variables** for sensitive data
3. **Enable HTTPS only** (Vercel does this automatically)
4. **Monitor usage** via Vercel analytics
5. **Rotate API keys** periodically

### Performance

1. **Enable caching** for better search performance
2. **Use bookmarks** for frequently accessed nodes
3. **Batch operations** when possible
4. **Monitor response times** in Vercel

### Maintenance

1. **Keep dependencies updated**:
   ```bash
   pnpm update
   ```

2. **Monitor Vercel logs** for errors:
   ```bash
   vercel logs
   ```

3. **Test before deploying**:
   ```bash
   pnpm run build
   pnpm run dev
   ```

4. **Use semantic versioning**:
   ```bash
   # Update version in package.json
   git tag v1.0.1
   git push --tags
   ```

---

## Next Steps

After successful deployment:

1. ✅ **Share your server** with the community
2. ✅ **Add to your AI workflows** (Claude, ChatGPT, etc.)
3. ✅ **Build automations** with WorkFlowy
4. ✅ **Contribute improvements** back to the project
5. ✅ **Join the MCP community** on Discord

---

## Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Smithery Documentation**: [smithery.ai/docs](https://smithery.ai/docs)
- **MCP Protocol**: [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- **WorkFlowy API**: [beta.workflowy.com/api-reference/](https://beta.workflowy.com/api-reference/)

---

## Success Checklist

Before you're done, verify:

- ✅ Code is pushed to GitHub
- ✅ Vercel deployment is live and accessible
- ✅ Smithery server is published and shows all 14 tools
- ✅ Can connect from Claude Desktop (or other MCP client)
- ✅ All tools work correctly with your WorkFlowy account
- ✅ Documentation is complete and accurate
- ✅ Repository has proper README, LICENSE, and .gitignore

---

**Congratulations!** 🎉 Your WorkFlowy MCP server is now live and accessible from anywhere via Smithery!
