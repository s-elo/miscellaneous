# MCP Miscellaneous

This is a simple MCP server that provides a few tools for testing purposes. It runs as an HTTP-based remote MCP server.

## Usage

### Build

```bash
$ pnpm build
```

### Run the HTTP Server

```bash
# Development mode (with tsx)
$ pnpm dev

# Production mode (after building)
$ node dist/index.js
```

The server will start on `http://localhost:3000` by default. You can customize the port and host using environment variables:

```bash
PORT=8080 HOST=0.0.0.0 pnpm dev
```

### HTTP Endpoints

The server exposes a single endpoint that handles all MCP protocol requests:

- **GET** `/` - Establishes an SSE (Server-Sent Events) stream for receiving server-to-client messages
- **POST** `/` - Sends JSON-RPC requests to the server
- **DELETE** `/` - Terminates a session (when using stateful mode)

### Config in any MCP client

For remote HTTP-based MCP servers, configure your client with:

```json
{
  "mcpServers": {
    "mcp-miscellaneous": {
      "url": "http://localhost:3000",
      "transport": "streamable-http"
    }
  }
}
```

See: https://modelcontextprotocol.io/quickstart/server

### Inspect the server

For HTTP-based servers, you need to:

1. **Start the server first** (in one terminal):

   ```bash
   pnpm dev
   # or
   node dist/index.js
   ```

2. **Use MCP Inspector's web UI** (in another terminal or browser):

   ```bash
   pnpm inspect
   ```

   Then in the inspector's web interface, connect to:

   - **URL**: `http://localhost:3000`
   - **Transport Type**: `streamable-http`

   The inspector will open a web UI at `http://127.0.0.1:6274` (or similar) where you can test the server.

## Tools

- `get-room`: Get information about a room
- `get-github-repo`: Get information about a GitHub repository
