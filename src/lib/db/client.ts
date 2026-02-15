import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || './data/mindforge.db';
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Initialize schema
const schemaPath = path.join(process.cwd(), 'src/lib/db/schema.sql');
if (fs.existsSync(schemaPath)) {
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    db.exec(schema);
}

export default db;

// User queries
export const userQueries = {
    create: db.prepare(`
    INSERT INTO users (email, password_hash, name)
    VALUES (?, ?, ?)
  `),

    findByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),

    findById: db.prepare(`
    SELECT id, email, name, created_at FROM users WHERE id = ?
  `),
};

// Mind map queries
export const mindMapQueries = {
    create: db.prepare(`
    INSERT INTO mind_maps (user_id, title, description, data, is_public)
    VALUES (?, ?, ?, ?, ?)
  `),

    findById: db.prepare(`
    SELECT * FROM mind_maps WHERE id = ?
  `),

    findByUserId: db.prepare(`
    SELECT id, title, description, is_public, created_at, updated_at
    FROM mind_maps
    WHERE user_id = ?
    ORDER BY updated_at DESC
  `),

    update: db.prepare(`
    UPDATE mind_maps
    SET title = ?, description = ?, data = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND user_id = ?
  `),

    delete: db.prepare(`
    DELETE FROM mind_maps WHERE id = ? AND user_id = ?
  `),
};

// Template queries
export const templateQueries = {
    findAll: db.prepare(`
    SELECT * FROM templates ORDER BY category, name
  `),

    findById: db.prepare(`
    SELECT * FROM templates WHERE id = ?
  `),
};

// Collaborator queries
export const collaboratorQueries = {
    add: db.prepare(`
    INSERT INTO collaborators (mind_map_id, user_id, permission)
    VALUES (?, ?, ?)
  `),

    findByMapId: db.prepare(`
    SELECT c.*, u.name, u.email
    FROM collaborators c
    JOIN users u ON c.user_id = u.id
    WHERE c.mind_map_id = ?
  `),
};
