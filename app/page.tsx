export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      maxWidth: '800px', 
      margin: '50px auto', 
      padding: '20px',
      lineHeight: '1.6'
    }}>
      <h1>WorkFlowy MCP Server</h1>
      <p>
        Production-ready MCP server for WorkFlowy with advanced search, caching, and bookmark management.
      </p>
      
      <h2>Status</h2>
      <p style={{ color: 'green', fontWeight: 'bold' }}>✓ Server is running</p>
      
      <h2>MCP Endpoint</h2>
      <code style={{ 
        background: '#f4f4f4', 
        padding: '10px', 
        display: 'block',
        borderRadius: '4px'
      }}>
        {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.vercel.app'}/api/mcp
      </code>
      
      <h2>Features</h2>
      <ul>
        <li>14 fully-functional tools for WorkFlowy management</li>
        <li>Advanced search with regex support</li>
        <li>Smart caching for better performance</li>
        <li>Bookmark management</li>
        <li>Complete CRUD operations</li>
      </ul>
      
      <h2>Documentation</h2>
      <p>
        Visit the{' '}
        <a href="https://github.com/sidinsv/workflowy-mcp-manus" target="_blank" rel="noopener noreferrer">
          GitHub repository
        </a>
        {' '}for complete documentation and setup instructions.
      </p>
      
      <h2>Quick Start</h2>
      <ol>
        <li>Get your WorkFlowy API key from <a href="https://beta.workflowy.com/api-reference/" target="_blank" rel="noopener noreferrer">beta.workflowy.com/api-reference/</a></li>
        <li>Add this server to your MCP client (Claude Desktop, etc.)</li>
        <li>Provide your API key when connecting</li>
        <li>Start managing your WorkFlowy with AI!</li>
      </ol>
      
      <footer style={{ marginTop: '50px', paddingTop: '20px', borderTop: '1px solid #ddd', color: '#666' }}>
        <p>Built with ❤️ using Manus AI</p>
      </footer>
    </div>
  );
}
