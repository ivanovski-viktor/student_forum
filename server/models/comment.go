package models

import (
	"database/sql"
	"time"

	"github.com/ivanovski-viktor/student_forum/server/db"
)

type Comment struct {
	ID        int64      `json:"id"`
	PostID    int64      `json:"post_id"`
	UserID    int64      `json:"user_id"`
	ParentID  *int64     `json:"parent_id,omitempty"` // only for replies
	Content   string     `json:"content"`
	CreatedAt time.Time  `json:"created_at"`
	Replies   []Comment  `json:"replies,omitempty"` // only for returning replies
}

func (c *Comment) Create() error {
	c.CreatedAt = time.Now()

	query := `
		INSERT INTO comments (post_id, user_id, parent_id, content, created_at)
		VALUES (?, ?, ?, ?, ?)
	`

	result, err := db.DB.Exec(query, c.PostID, c.UserID, c.ParentID, c.Content, c.CreatedAt)
	if err != nil {
		return err
	}

	c.ID, err = result.LastInsertId()
	return err
}

func GetCommentsByPostID(postID int64) ([]Comment, error) {
	query := `
		SELECT id, post_id, user_id, parent_id, content, created_at
		FROM comments
		WHERE post_id = ?
		ORDER BY created_at ASC
	`

	rows, err := db.DB.Query(query, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var all []Comment
	for rows.Next() {
		var c Comment
		var parentID sql.NullInt64

		if err := rows.Scan(&c.ID, &c.PostID, &c.UserID, &parentID, &c.Content, &c.CreatedAt); err != nil {
			return nil, err
		}
		if parentID.Valid {
			c.ParentID = &parentID.Int64
		}
		all = append(all, c)
	}

	var topLevel []Comment
	replies := make(map[int64][]Comment)

	for _, c := range all {
		if c.ParentID != nil {
			replies[*c.ParentID] = append(replies[*c.ParentID], c)
		} else {
			topLevel = append(topLevel, c)
		}
	}

	for i := range topLevel {
		topLevel[i].Replies = replies[topLevel[i].ID]
	}

	return topLevel, nil
}

func GetCommentByID(id int64) (*Comment, error) {
	query := `SELECT id, post_id, user_id, parent_id, content, created_at FROM comments WHERE id = ?`

	var c Comment
	var parentID sql.NullInt64

	err := db.DB.QueryRow(query, id).Scan(&c.ID, &c.PostID, &c.UserID, &parentID, &c.Content, &c.CreatedAt)
	if err != nil {
		return nil, err
	}
	if parentID.Valid {
		c.ParentID = &parentID.Int64
	}
	return &c, nil
}

func (c *Comment) Update() error {
	query := `UPDATE comments SET content = ? WHERE id = ?`
	_, err := db.DB.Exec(query, c.Content, c.ID)
	return err
}

func (c *Comment) Delete() error {
	tx, err := db.DB.Begin()
	if err != nil {
		return err
	}

	// Delete replies first
	_, err = tx.Exec(`DELETE FROM comments WHERE parent_id = ?`, c.ID)
	if err != nil {
		tx.Rollback()
		return err
	}

	// Delete the main comment
	_, err = tx.Exec(`DELETE FROM comments WHERE id = ?`, c.ID)
	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}
