package controllers

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/db"
)

type SearchRequest struct {
	Query string `json:"query"`
	Type  string `json:"type"` // "user", "group", "post", or ""
}

type SearchResult struct {
	Type     string `json:"type"`
	ID       int64  `json:"id,omitempty"`
	Name     string `json:"name"`
	ImageUrl string `json:"image_url,omitempty"`
}

func SearchHandler(c *gin.Context) {
	var req SearchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	if req.Query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "missing 'query' field"})
		return
	}

	searchTerm := "%" + req.Query + "%"
	results := []SearchResult{}

	search := func(query, resultType string, hasID, hasImage bool) {
		rows, err := db.DB.Query(query, searchTerm)
		if err != nil && err != sql.ErrNoRows {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		for rows.Next() {
			var r SearchResult
			r.Type = resultType

			if hasID && hasImage {
				var id int64
				var name, img string
				if err := rows.Scan(&id, &name, &img); err == nil {
					r.ID = id
					r.Name = name
					r.ImageUrl = img
					results = append(results, r)
				}
			} else if hasID && !hasImage {
				var id int64
				var name string
				if err := rows.Scan(&id, &name); err == nil {
					r.ID = id
					r.Name = name
					results = append(results, r)
				}
			} else if !hasID && hasImage {
				var name, img string
				if err := rows.Scan(&name, &img); err == nil {
					r.Name = name
					r.ImageUrl = img
					results = append(results, r)
				}
			} else {
				var name string
				if err := rows.Scan(&name); err == nil {
					r.Name = name
					results = append(results, r)
				}
			}
		}
	}

	switch req.Type {
	case "post":
		search(`SELECT id, title FROM posts WHERE title LIKE ?`, "post", true, false)
	case "user":
		search(`SELECT id, username, COALESCE(profile_image_url,'') FROM users WHERE username LIKE ?`, "user", true, true)
	case "group":
		search(`SELECT name, COALESCE(group_image_url,'') FROM groups WHERE name LIKE ?`, "group", false, true)
	case "", "all":
		search(`SELECT id, title FROM posts WHERE title LIKE ?`, "post", true, false)
		search(`SELECT name, COALESCE(group_image_url,'') FROM groups WHERE name LIKE ?`, "group", false, true)
		search(`SELECT id, username, COALESCE(profile_image_url,'') FROM users WHERE username LIKE ?`, "user", true, true)
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid 'type' value"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"query":   req.Query,
		"type":    req.Type,
		"results": results,
	})
}
