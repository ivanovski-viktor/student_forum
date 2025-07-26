package models

import (
	"time"

	"github.com/ivanovski-viktor/student_forum/server/db"
)

// This will be my basic version to start building the API
type Post struct {
	ID           int64      `json:"id"`
	Title        string     `json:"title" binding:"required"`
	Description  string     `json:"description" binding:"required"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    *time.Time `json:"updated_at,omitempty"`
	UserID       int64      `json:"user_id"`
	Upvotes      int        `json:"upvotes"`
	Downvotes    int        `json:"downvotes"`
	CommentCount int        `json:"comment_count"`
}

// Create post
func (p *Post) Create() error {
	p.CreatedAt = time.Now()

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

// Get all posts
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

		err := rows.Scan(&post.ID, &post.Title, &post.Description, &post.CreatedAt, &post.UpdatedAt, &post.UserID, &post.Upvotes, &post.Downvotes, &post.CommentCount)
		if err != nil {
			return nil, err
		}

		posts = append(posts, post)
	}
	return posts, nil
}

// Get post by id
func GetPostById(id int64) (*Post, error) {
	query :=
		`SELECT * 
	FROM posts 
	WHERE id = ?`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return nil, err
	}

	defer stmt.Close()

	var post Post

	err = stmt.QueryRow(id).Scan(&post.ID, &post.Title, &post.Description, &post.CreatedAt, &post.UpdatedAt, &post.UserID, &post.Upvotes, &post.Downvotes, &post.CommentCount)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

// Update post
func (p *Post) Update() error {
	now := time.Now()
	p.UpdatedAt = &now
	query := `
		UPDATE posts 
		SET title = ?, description = ?, updated_at = ?
		WHERE id = ?
	`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(&p.Title, &p.Description, &p.UpdatedAt, &p.ID)
	return err
}

// Delete post
func (p *Post) Delete() error {
	query := `DELETE FROM posts WHERE id = ?`
	_, err := db.DB.Exec(query, p.ID)
	if err != nil {
		return err
	}
	return nil
}

// Update votes and upvotes
func (p *Post) UpdateVotes(voteType int) error {
	var query string
	if voteType == 1 {
		query = `UPDATE posts SET upvotes = upvotes + 1 WHERE id = ?`
	} else if voteType == -1 {
		query = `UPDATE posts SET downvotes = downvotes + 1 WHERE id = ?`
	}

	_, err := db.DB.Exec(query, p.ID)
	if err != nil {
		return err
	}
	return nil
}
