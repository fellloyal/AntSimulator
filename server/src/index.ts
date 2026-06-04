import Fastify from 'fastify';
import cors from '@fastify/cors';
import { db } from './db';
import { mapRoutes } from './routes';

const PORT = 3001;

async function main() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });

  await mapRoutes(app);

  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main();
