package models

import (
	"database/sql"
	"time"

	"github.com/ivanovski-viktor/student_forum/server/db"
)

type Group struct {
	Name        string    `json:"name" binding:"required"` // primary key
	Description string    `json:"description" binding:"required"`
	CreatorID   int64     `json:"creator_id"`
	CreatedAt   time.Time `json:"created_at"`
	GroupImageURL string    `json:"group_image_url,omitempty"`
}

func (g *Group) Create() error {
	g.CreatedAt = time.Now()
	stmt, err := db.DB.Prepare(`
		INSERT INTO groups (name, description, creator_id, created_at)
		VALUES (?, ?, ?, ?)`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(g.Name, g.Description, g.CreatorID, g.CreatedAt)
	return err
}

func GetGroupByName(name string) (*Group, error) {
	stmt, err := db.DB.Prepare(`
		SELECT name, description, creator_id, created_at, group_image_url
		FROM groups WHERE name = ?`)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var g Group
	var groupImage sql.NullString

	err = stmt.QueryRow(name).Scan(&g.Name, &g.Description, &g.CreatorID, &g.CreatedAt, &groupImage)
	if err != nil {
		return nil, err
	}

	if groupImage.Valid {
		g.GroupImageURL = groupImage.String
	} else {
		g.GroupImageURL = ""
	}

	return &g, nil
}

func GetAllGroups() ([]Group, error) {
	stmt, err := db.DB.Prepare(`
		SELECT name, description, creator_id, created_at, group_image_url
		FROM groups ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	rows, err := stmt.Query()
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []Group
	for rows.Next() {
		var g Group
		var groupImage sql.NullString
		
		err := rows.Scan(&g.Name, &g.Description, &g.CreatorID, &g.CreatedAt, &groupImage)
		if err != nil {
			return nil, err
		}

		if groupImage.Valid {
			g.GroupImageURL = groupImage.String
		} else {
			g.GroupImageURL = ""
		}

		groups = append(groups, g)
	}
	return groups, nil
}

func (g *Group) Update() error {
	stmt, err := db.DB.Prepare(`
		UPDATE groups SET description = ? WHERE name = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(g.Description, g.Name)
	return err
}

func (g *Group) Delete() error {
	stmt, err := db.DB.Prepare(`DELETE FROM groups WHERE name = ?`)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(g.Name)
	return err
}
func (g *Group) UpdateGroupImage() error {
	query := "UPDATE groups SET group_image_url = ? WHERE name = ?"
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(g.GroupImageURL, g.Name)
	return err
}
