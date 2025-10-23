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
	GroupName    *string    `json:"group_name,omitempty"`
	Upvotes      int        `json:"upvotes"`
	Downvotes    int        `json:"downvotes"`
	CommentCount int        `json:"comment_count"`
}

// Create post
func (p *Post) Create() error {
	p.CreatedAt = time.Now()

	query := `
		INSERT INTO posts(title, description, created_at, updated_at, user_id, group_name)
		VALUES (?, ?, ?, ?, ?, ?)
	`
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()

	result, err := stmt.Exec(&p.Title, &p.Description, &p.CreatedAt, &p.UpdatedAt, &p.UserID, &p.GroupName)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	p.ID = id

	return err
}

// Get all posts
func GetAll(limit, offset int) ([]Post, error) {
	query := `
	SELECT 
		p.id, p.title, p.description, p.created_at, p.updated_at,
		p.user_id, p.group_name,
		COUNT(DISTINCT CASE WHEN v.vote_type = 1 THEN v.user_id END) AS upvotes,
		COUNT(DISTINCT CASE WHEN v.vote_type = -1 THEN v.user_id END) AS downvotes,
		COUNT(DISTINCT CASE WHEN c.parent_id IS NULL THEN c.id END) AS comment_count
	FROM posts p
	LEFT JOIN post_votes v ON p.id = v.post_id
	LEFT JOIN comments c ON p.id = c.post_id
	GROUP BY p.id
	ORDER BY p.created_at DESC
	LIMIT ? OFFSET ?;
`

	rows, err := db.DB.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		err := rows.Scan(
			&p.ID, &p.Title, &p.Description, &p.CreatedAt, &p.UpdatedAt,
			&p.UserID, &p.GroupName, &p.Upvotes, &p.Downvotes, &p.CommentCount,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

// Get post by id
func GetPostById(id int64) (*Post, error) {
	query := `
		SELECT 
		p.id, p.title, p.description, p.created_at, p.updated_at,
		p.user_id, p.group_name,
		COUNT(DISTINCT CASE WHEN v.vote_type = 1 THEN v.user_id END) AS upvotes,
		COUNT(DISTINCT CASE WHEN v.vote_type = -1 THEN v.user_id END) AS downvotes,
		COUNT(DISTINCT CASE WHEN c.parent_id IS NULL THEN c.id END) AS comment_count
	FROM posts p
	LEFT JOIN post_votes v ON p.id = v.post_id
	LEFT JOIN comments c ON p.id = c.post_id
	WHERE p.id = ?
	GROUP BY p.id;
	`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var p Post
	err = stmt.QueryRow(id).Scan(
		&p.ID, &p.Title, &p.Description, &p.CreatedAt, &p.UpdatedAt,
		&p.UserID, &p.GroupName, &p.Upvotes, &p.Downvotes, &p.CommentCount,
	)
	if err != nil {
		return nil, err
	}
	return &p, nil
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

func GetPostsByGroupName(groupName string) ([]Post, error) {
	query := `SELECT id, title, description, user_id, group_name, created_at FROM posts WHERE group_name = ? ORDER BY created_at DESC`
	rows, err := db.DB.Query(query, groupName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []Post
	for rows.Next() {
		var p Post
		err := rows.Scan(&p.ID, &p.Title, &p.Description, &p.UserID, &p.GroupName, &p.CreatedAt)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}
