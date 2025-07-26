package db

import (
	"database/sql"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
	var err error
	DB, err = sql.Open("sqlite3", "student_forum.db")

	if err != nil {
		panic("Cound not connect to DB!")
	}

	DB.SetMaxOpenConns(10)
	DB.SetMaxIdleConns(5)

	createTables()
}

func createTables() {
	createUsersTable := `
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			username TEXT NOT NULL,
			email TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			profile_image_url TEXT,   
			created_at DATETIME NOT NULL)
	`

	_, err := DB.Exec(createUsersTable)

	if err != nil {
		panic("Could not create users table!")
	}

	createPostsTable := `
		CREATE TABLE IF NOT EXISTS posts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			title TEXT NOT NULL,
			description TEXT NOT NULL,
			created_at DATETIME NOT NULL,
			updated_at DATETIME,
			user_id INTEGER,
			upvotes INTEGER DEFAULT 0,
    		downvotes INTEGER DEFAULT 0,
			comment_count INTEGER DEFAULT 0
		)
	`

	_, err = DB.Exec(createPostsTable)

	if err != nil {
		panic("Could not create posts table!")
	}

}
