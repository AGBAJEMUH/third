-- MindForge Database Schema
-- SQLite database for user authentication and mind map storage

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Mind maps table
CREATE TABLE IF NOT EXISTS mind_maps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  data TEXT NOT NULL, -- JSON data for nodes and connections
  is_public BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Collaborators table (for shared mind maps)
CREATE TABLE IF NOT EXISTS collaborators (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  mind_map_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  permission TEXT DEFAULT 'view', -- 'view' or 'edit'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mind_map_id) REFERENCES mind_maps(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(mind_map_id, user_id)
);

-- Templates table
CREATE TABLE IF NOT EXISTS templates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  data TEXT NOT NULL, -- JSON data for template structure
  thumbnail_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mind_maps_user_id ON mind_maps(user_id);
CREATE INDEX IF NOT EXISTS idx_mind_maps_created_at ON mind_maps(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_collaborators_mind_map_id ON collaborators(mind_map_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON collaborators(user_id);

-- Insert sample templates
INSERT OR IGNORE INTO templates (id, name, description, category, data) VALUES
(1, 'Project Planning', 'Organize project tasks, milestones, and deliverables', 'Business', '{"nodes":[{"id":"root","text":"Project Name","x":0,"y":0,"color":"#0ea5e9"},{"id":"1","text":"Phase 1","x":-200,"y":100,"color":"#8b5cf6"},{"id":"2","text":"Phase 2","x":0,"y":100,"color":"#8b5cf6"},{"id":"3","text":"Phase 3","x":200,"y":100,"color":"#8b5cf6"}],"connections":[{"from":"root","to":"1"},{"from":"root","to":"2"},{"from":"root","to":"3"}]}'),
(2, 'Study Guide', 'Create comprehensive study materials and learning paths', 'Education', '{"nodes":[{"id":"root","text":"Subject","x":0,"y":0,"color":"#d946ef"},{"id":"1","text":"Topic 1","x":-150,"y":100,"color":"#0ea5e9"},{"id":"2","text":"Topic 2","x":150,"y":100,"color":"#0ea5e9"}],"connections":[{"from":"root","to":"1"},{"from":"root","to":"2"}]}'),
(3, 'Brainstorming', 'Free-form idea generation and exploration', 'Creative', '{"nodes":[{"id":"root","text":"Main Idea","x":0,"y":0,"color":"#10b981"}],"connections":[]}'),
(4, 'SWOT Analysis', 'Analyze Strengths, Weaknesses, Opportunities, and Threats', 'Business', '{"nodes":[{"id":"root","text":"SWOT Analysis","x":0,"y":0,"color":"#0ea5e9"},{"id":"1","text":"Strengths","x":-200,"y":-100,"color":"#10b981"},{"id":"2","text":"Weaknesses","x":200,"y":-100,"color":"#ef4444"},{"id":"3","text":"Opportunities","x":-200,"y":100,"color":"#f59e0b"},{"id":"4","text":"Threats","x":200,"y":100,"color":"#8b5cf6"}],"connections":[{"from":"root","to":"1"},{"from":"root","to":"2"},{"from":"root","to":"3"},{"from":"root","to":"4"}]}');
