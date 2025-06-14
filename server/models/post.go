package models

import (
	"time"

	"github.com/ivanovski-viktor/student_forum/server/db"
)

//This will be my basic version to start building the API
type Post struct {
	ID          int64      `json:"id"`
    Title       string     `json:"title" binding:"required"`
    Description string     `json:"description" binding:"required"`
    CreatedAt   time.Time  `json:"created_at"`
    UpdatedAt   *time.Time `json:"updated_at,omitempty"`
    UserID      int64      `json:"user_id"`
}



func (p Post) Create() error {
	p.CreatedAt = time.Now()
	p.UpdatedAt = nil

	query := `
		INSERT INTO posts(title, description, created_at, updated_at, user_id)
		VALUES (?, ?, ?, ?, ?)
	`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()

	result, err := stmt.Exec(&p.Title, &p.Description, &p.CreatedAt, &p.UpdatedAt, &p.UserID)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	p.ID = id

	return err
}

func GetAll() ([]Post, error) {
	query := "SELECT * FROM posts"

	rows, err := db.DB.Query(query)
	if err != nil {
		return nil, err
	}
	
	defer rows.Close()

	var posts []Post

	for rows.Next() {
		var post Post

		err := rows.Scan(&post.ID, &post.Title, &post.Description, &post.CreatedAt, &post.UpdatedAt, &post.UserID)
		if err != nil {
			return nil, err
		}
	
		posts = append(posts, post)
	}
	return posts, nil
}