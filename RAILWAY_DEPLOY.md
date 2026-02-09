# Deploy to Railway

Railway is an excellent alternative to Vercel for deploying your WorkFlowy MCP server.

## 🚂 Quick Deploy to Railway

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Login" and sign in with GitHub
3. Authorize Railway to access your repositories

### Step 2: Deploy from GitHub

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `sidinsv/workflowy-mcp-manus`
4. Railway will automatically detect Next.js and deploy

### Step 3: Get Your URL

1. Once deployed, click on your project
2. Go to "Settings" → "Networking"
3. Click "Generate Domain"
4. Copy your Railway URL (e.g., `https://workflowy-mcp-manus-production.up.railway.app`)

### Step 4: Publish to Smithery

1. Go to [smithery.ai/new](https://smithery.ai/new)
2. Click the "URL" tab
3. Enter your Railway URL + `/api/mcp`
   - Example: `https://workflowy-mcp-manus-production.up.railway.app/api/mcp`
4. Click "Publish"

## 🎉 Done!

Your WorkFlowy MCP server is now live on Railway and accessible via Smithery!

## 💰 Railway Free Tier

Railway offers a generous free tier:
- ✅ $5 of usage per month (free)
- ✅ Enough for personal use
- ✅ Automatic HTTPS
- ✅ Custom domains
- ✅ Zero-downtime deployments

## 🔧 Configuration

No environment variables needed! The server gets the API key from the Authorization header when clients connect.

## 📊 Monitoring

View your deployment:
1. Go to Railway dashboard
2. Click on your project
3. View logs, metrics, and deployments

## 🆚 Railway vs Vercel

**Railway Advantages**:
- Better for long-running processes
- More flexible runtime
- Easier WebSocket support
- Built-in database options

**Vercel Advantages**:
- Optimized for Next.js
- Faster cold starts
- Better for static sites
- More generous bandwidth

**Both work great for this MCP server!** Choose whichever you prefer.

## 🐛 Troubleshooting

### Build Fails

Check that:
- `pnpm` is installed (it should be auto-detected)
- Build command is `pnpm run build`
- Start command is `pnpm start`

### Server Not Responding

1. Check logs in Railway dashboard
2. Verify the domain is generated
3. Test the health endpoint: `https://your-domain.railway.app/`

### Smithery Connection Issues

Make sure you're using:
- The full URL with `/api/mcp` at the end
- HTTPS (not HTTP)
- The correct Railway domain

## 📚 Resources

- [Railway Docs](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Next.js on Railway](https://docs.railway.app/guides/nextjs)

---

**Need help?** Open an issue on [GitHub](https://github.com/sidinsv/workflowy-mcp-manus/issues)
