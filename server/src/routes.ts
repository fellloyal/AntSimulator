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

// UI美化（task 22）：将老格式 gridData 升级为新格式
// 老墙壁: [cx, cy]           → 新墙壁: [cx, cy, obstacleType=1]
// 老食物:  [cx, cy, qty]      → 新食物:  [cx, cy, qty, foodType=0]
// 新增 terrain 字段（空数组）
function normalizeGridData(raw: string | undefined | null): string {
  if (!raw) return '{}';
  try {
    const data = JSON.parse(raw);
    const walls = (Array.isArray(data.walls) ? data.walls : []).map((w: any[]) =>
      Array.isArray(w) && w.length === 2 ? [w[0], w[1], 1] : w
    );
    const foods = (Array.isArray(data.foods) ? data.foods : []).map((f: any[]) =>
      Array.isArray(f) && f.length === 3 ? [f[0], f[1], f[2], 0] : f
    );
    const terrain = Array.isArray(data.terrain) ? data.terrain : [];
    return JSON.stringify({
      cellSize: data.cellSize || 4,
      terrain,
      walls,
      foods,
    });
  } catch {
    return raw;
  }
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
    ).run(name, width, height, normalizeGridData(grid_data), thumbnail || null);
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
    if (grid_data !== undefined) { updates.push('grid_data = ?'); values.push(normalizeGridData(grid_data)); }
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
