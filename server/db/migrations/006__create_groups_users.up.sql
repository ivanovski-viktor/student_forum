CREATE TABLE IF NOT EXISTS groups_users (
    user_id INTEGER NOT NULL,
    group_name TEXT NOT NULL,
    joined_at DATETIME NOT NULL,

    PRIMARY KEY (user_id, group_name),

    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(group_name) REFERENCES groups(name) ON DELETE CASCADE
);