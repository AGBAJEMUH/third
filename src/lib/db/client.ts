import { createClient } from '@libsql/client';

const url = process.env.LIBSQL_DB_URL || 'file:./data/mindforge.db';
const authToken = process.env.LIBSQL_DB_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

export default client;

// Helper to convert BigInt values to numbers for JSON serialization
function convertBigInts(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return Number(obj);
  if (Array.isArray(obj)) return obj.map(convertBigInts);
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = convertBigInts(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// User queries
export const userQueries = {
  create: async (email: string, passwordHash: string, name: string) => {
    const result = await client.execute({
      sql: `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`,
      args: [email, passwordHash, name]
    });
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  },

  findByEmail: async (email: string) => {
    const result = await client.execute({
      sql: `SELECT * FROM users WHERE email = ?`,
      args: [email]
    });
    return convertBigInts(result.rows[0]);
  },

  findById: async (id: number) => {
    const result = await client.execute({
      sql: `SELECT id, email, name, created_at FROM users WHERE id = ?`,
      args: [id]
    });
    return convertBigInts(result.rows[0]);
  },
};

// Mind map queries
export const mindMapQueries = {
  create: async (userId: number, title: string, description: string | null, dataContent: string, isPublic: number) => {
    const result = await client.execute({
      sql: `INSERT INTO mind_maps (user_id, title, description, data, is_public) VALUES (?, ?, ?, ?, ?)`,
      args: [userId, title, description, dataContent, isPublic]
    });
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  },

  findById: async (id: string | number) => {
    const result = await client.execute({
      sql: `SELECT * FROM mind_maps WHERE id = ?`,
      args: [id]
    });
    return convertBigInts(result.rows[0]);
  },

  findByUserId: async (userId: number) => {
    const result = await client.execute({
      sql: `SELECT id, title, description, is_public, created_at, updated_at FROM mind_maps WHERE user_id = ? ORDER BY updated_at DESC`,
      args: [userId]
    });
    return convertBigInts(result.rows);
  },

  update: async (title: string, description: string | null, dataContent: string, id: string | number, userId: number) => {
    const result = await client.execute({
      sql: `UPDATE mind_maps SET title = ?, description = ?, data = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      args: [title, description, dataContent, id, userId]
    });
    return { changes: Number(result.rowsAffected) };
  },

  delete: async (id: string | number, userId: number) => {
    const result = await client.execute({
      sql: `DELETE FROM mind_maps WHERE id = ? AND user_id = ?`,
      args: [id, userId]
    });
    return { changes: Number(result.rowsAffected) };
  },
};

// Template queries
export const templateQueries = {
  findAll: async () => {
    const result = await client.execute(`SELECT * FROM templates ORDER BY category, name`);
    return convertBigInts(result.rows);
  },

  findById: async (id: number) => {
    const result = await client.execute({
      sql: `SELECT * FROM templates WHERE id = ?`,
      args: [id]
    });
    return convertBigInts(result.rows[0]);
  },
};

// Collaborator queries
export const collaboratorQueries = {
  add: async (mindMapId: number, userId: number, permission: string) => {
    const result = await client.execute({
      sql: `INSERT INTO collaborators (mind_map_id, user_id, permission) VALUES (?, ?, ?)`,
      args: [mindMapId, userId, permission]
    });
    return { lastInsertRowid: Number(result.lastInsertRowid) };
  },

  findByMapId: async (mapId: string | number) => {
    const result = await client.execute({
      sql: `SELECT c.*, u.name, u.email FROM collaborators c JOIN users u ON c.user_id = u.id WHERE c.mind_map_id = ?`,
      args: [mapId]
    });
    return convertBigInts(result.rows);
  },
};
