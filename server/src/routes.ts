import { FastifyInstance } from 'fastify';
import { db } from './db';

interface MapRow {
  id: number;
  name: string;
  width: number;
  height: number;
  grid_data: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

interface CreateMapBody {
  name: string;
  width: number;
  height: number;
  grid_data?: string;
  thumbnail?: string;
}

interface UpdateMapBody {
  name?: string;
  grid_data?: string;
  thumbnail?: string;
}

export async function mapRoutes(app: FastifyInstance) {
  // GET /api/maps - list all maps (without grid_data for performance)
  app.get('/api/maps', async () => {
    const rows = db.prepare(
      'SELECT id, name, width, height, thumbnail, created_at, updated_at FROM maps ORDER BY updated_at DESC'
    ).all() as Omit<MapRow, 'grid_data'>[];
    return rows;
  });

  // GET /api/maps/:id - get single map with full data
  app.get<{ Params: { id: string } }>('/api/maps/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      reply.code(400).send({ error: 'Invalid id' });
      return;
    }
    const row = db.prepare('SELECT * FROM maps WHERE id = ?').get(id) as MapRow | undefined;
    if (!row) {
      reply.code(404).send({ error: 'Map not found' });
      return;
    }
    return row;
  });

  // POST /api/maps - create a new map
  app.post<{ Body: CreateMapBody }>('/api/maps', async (request, reply) => {
    const { name, width, height, grid_data, thumbnail } = request.body;
    if (!name || !width || !height) {
      reply.code(400).send({ error: 'name, width, height are required' });
      return;
    }
    const result = db.prepare(
      'INSERT INTO maps (name, width, height, grid_data, thumbnail) VALUES (?, ?, ?, ?, ?)'
    ).run(name, width, height, grid_data || '{}', thumbnail || null);
    return { id: result.lastInsertRowid };
  });

  // PUT /api/maps/:id - update a map
  app.put<{ Params: { id: string }; Body: UpdateMapBody }>('/api/maps/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      reply.code(400).send({ error: 'Invalid id' });
      return;
    }
    const existing = db.prepare('SELECT id FROM maps WHERE id = ?').get(id);
    if (!existing) {
      reply.code(404).send({ error: 'Map not found' });
      return;
    }
    const { name, grid_data, thumbnail } = request.body;
    const updates: string[] = [];
    const values: (string | number | null)[] = [];
    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (grid_data !== undefined) { updates.push('grid_data = ?'); values.push(grid_data); }
    if (thumbnail !== undefined) { updates.push('thumbnail = ?'); values.push(thumbnail); }
    if (updates.length === 0) {
      reply.code(400).send({ error: 'No fields to update' });
      return;
    }
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);
    db.prepare(`UPDATE maps SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    return { ok: true };
  });

  // DELETE /api/maps/:id
  app.delete<{ Params: { id: string } }>('/api/maps/:id', async (request, reply) => {
    const id = parseInt(request.params.id, 10);
    if (isNaN(id)) {
      reply.code(400).send({ error: 'Invalid id' });
      return;
    }
    const result = db.prepare('DELETE FROM maps WHERE id = ?').run(id);
    if (result.changes === 0) {
      reply.code(404).send({ error: 'Map not found' });
      return;
    }
    return { ok: true };
  });
}
