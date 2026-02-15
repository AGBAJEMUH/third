import { createClient } from '@libsql/client';

const url = process.env.LIBSQL_DB_URL || 'file:./data/mindforge.db';
const authToken = process.env.LIBSQL_DB_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

export default client;

// User queries
export const userQueries = {
  create: async (email: string, passwordHash: string, name: string) => {
    return await client.execute({
      sql: `INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)`,
      args: [email, passwordHash, name]
    });
  },

  findByEmail: async (email: string) => {
    const result = await client.execute({
      sql: `SELECT * FROM users WHERE email = ?`,
      args: [email]
    });
    return result.rows[0];
  },

  findById: async (id: number) => {
    const result = await client.execute({
      sql: `SELECT id, email, name, created_at FROM users WHERE id = ?`,
      args: [id]
    });
    return result.rows[0];
  },
};

// Mind map queries
export const mindMapQueries = {
  create: async (userId: number, title: string, description: string | null, dataContent: string, isPublic: number) => {
    const result = await client.execute({
      sql: `INSERT INTO mind_maps (user_id, title, description, data, is_public) VALUES (?, ?, ?, ?, ?)`,
      args: [userId, title, description, dataContent, isPublic]
    });
    return { lastInsertRowid: result.lastInsertRowid };
  },

  findById: async (id: string | number) => {
    const result = await client.execute({
      sql: `SELECT * FROM mind_maps WHERE id = ?`,
      args: [id]
    });
    return result.rows[0];
  },

  findByUserId: async (userId: number) => {
    const result = await client.execute({
      sql: `SELECT id, title, description, is_public, created_at, updated_at FROM mind_maps WHERE user_id = ? ORDER BY updated_at DESC`,
      args: [userId]
    });
    return result.rows;
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
    return result.rows;
  },

  findById: async (id: number) => {
    const result = await client.execute({
      sql: `SELECT * FROM templates WHERE id = ?`,
      args: [id]
    });
    return result.rows[0];
  },
};

// Collaborator queries
export const collaboratorQueries = {
  add: async (mindMapId: number, userId: number, permission: string) => {
    return await client.execute({
      sql: `INSERT INTO collaborators (mind_map_id, user_id, permission) VALUES (?, ?, ?)`,
      args: [mindMapId, userId, permission]
    });
  },

  findByMapId: async (mapId: string | number) => {
    const result = await client.execute({
      sql: `SELECT c.*, u.name, u.email FROM collaborators c JOIN users u ON c.user_id = u.id WHERE c.mind_map_id = ?`,
      args: [mapId]
    });
    return result.rows;
  },
};
