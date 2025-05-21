import http from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { koaMiddleware } from '@as-integrations/koa';
import { resolvers } from './resolvers';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
global.__filename = fileURLToPath(import.meta.url);
global.__dirname = path.dirname(__filename);

// The GraphQL schema
const typeDefs = fs
  .readdirSync(path.join(__dirname, 'schemas'))
  .map((fileName) => {
    return fs.readFileSync(path.join(__dirname, 'schemas', fileName), 'utf-8');
  });

const app = new Koa();
const httpServer = http.createServer(app.callback());

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(cors());
app.use(bodyParser());
app.use(
  koaMiddleware(server, {
    context: async ({ ctx }) => ({ token: ctx.headers.token }),
  }),
);

await new Promise<void>((resolve) =>
  httpServer.listen({ port: 4000 }, resolve),
);
console.log(`🚀 Server ready at http://localhost:4000`);
