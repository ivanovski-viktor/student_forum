CREATE TABLE IF NOT EXISTS groups (
    name TEXT PRIMARY KEY,
    description TEXT,
    creator_id INTEGER NOT NULL,
    created_at DATETIME NOT NULL,

    FOREIGN KEY (creator_id) REFERENCES users(id)
);