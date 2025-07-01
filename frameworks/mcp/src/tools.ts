import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

export function useGetRoom(server: McpServer) {
  const rooms = [
    {
      id: 1,
      name: 'Room 1',
      description: 'This is a basic room',
    },
    {
      id: 2,
      name: 'Room 2',
      description: 'This is a standard room',
    },
    {
      id: 3,
      name: 'Room 3',
      description: 'This is a premium room',
    },
    {
      id: 4,
      name: 'Room 4',
      description: 'This is a luxury room',
    },
    {
      id: 5,
      name: 'Room 5',
      description: 'This is a suite room',
    },
  ];

  server.tool(
    'get-room',
    'Get information about a room',
    {
      roomId: z.string(),
    },
    async ({ roomId }) => {
      const room = rooms.find((room) => room.id === Number(roomId));
      if (!room) {
        return {
          content: [{ type: 'text', text: `Room ${roomId} not found` }],
        };
      }
      return {
        content: [
          {
            type: 'text',
            text: `Room ${roomId} is ${room.name} and ${room.description}`,
          },
        ],
      };
    },
  );
}

export function useGithubRepo(server: McpServer) {
  server.tool(
    'get-github-repo',
    'Get information about a GitHub repository',
    {
      repoName: z.string(),
    },
    async ({ repoName }) => {
      const response = await fetch(
        `https://api.github.com/repos/s-elo/${repoName}`,
      );
      const data = await response.json();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    },
  );
}
