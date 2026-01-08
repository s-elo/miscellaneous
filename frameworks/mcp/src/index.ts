import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { useGetRoom, useGithubRepo } from './tools.js';
import express from 'express';

// Create server instance
const server = new McpServer({
  name: 'mcp-miscelaneous-server',
  version: '1.0.0',
  description: 'MCP server for miscellaneous tools',
});

useGetRoom(server);
useGithubRepo(server);

const app = express();

async function main() {
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const HOST = process.env.HOST || 'localhost';

  app.use(express.json());

  // Handle requests for SSE stream
  app.all('/', async (req, res) => {
    try {
      console.log(
        `Request recieved, ${req.method} ${req.url}: ${JSON.stringify(
          req.body,
          null,
          2,
        )}`,
      );

      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error('Error handling GET request:', error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: 'Internal server error',
          },
          id: null,
        });
      }
    }
  });

  // Start the HTTP server
  app.listen(PORT, HOST, () => {
    console.error(`MCP Server running on http://${HOST}:${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.error('SIGTERM received, shutting down gracefully');
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.error('SIGINT received, shutting down gracefully');
    process.exit(0);
  });
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
