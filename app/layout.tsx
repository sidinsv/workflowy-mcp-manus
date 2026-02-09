export const metadata = {
  title: 'WorkFlowy MCP Server',
  description: 'Production-ready MCP server for WorkFlowy with advanced search, caching, and bookmark management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
