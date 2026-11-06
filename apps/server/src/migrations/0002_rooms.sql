CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  session_id TEXT,
  folder TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
