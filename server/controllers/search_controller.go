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
	Type string `json:"type"`
	ID   int64  `json:"id,omitempty"`
	Name string `json:"name"`
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

	// Helper function to search posts and users (have ID)
	searchWithID := func(sqlStr, resultType string) {
		rows, err := db.DB.Query(sqlStr, searchTerm)
		if err != nil && err != sql.ErrNoRows {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		for rows.Next() {
			var id int64
			var name string
			if err := rows.Scan(&id, &name); err == nil {
				results = append(results, SearchResult{Type: resultType, ID: id, Name: name})
			}
		}
	}

	// Helper function to search groups (no ID)
	searchGroups := func(sqlStr string) {
		rows, err := db.DB.Query(sqlStr, searchTerm)
		if err != nil && err != sql.ErrNoRows {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		defer rows.Close()

		for rows.Next() {
			var name string
			if err := rows.Scan(&name); err == nil {
				results = append(results, SearchResult{Type: "group", Name: name})
			}
		}
	}

	switch req.Type {
	case "post":
		searchWithID(`SELECT id, title FROM posts WHERE title LIKE ?`, "post")
	case "user":
		searchWithID(`SELECT id, username FROM users WHERE username LIKE ?`, "user")
	case "group":
		searchGroups(`SELECT name FROM groups WHERE name LIKE ?`)
	case "", "all":
		searchWithID(`SELECT id, title FROM posts WHERE title LIKE ?`, "post")
		searchGroups(`SELECT name FROM groups WHERE name LIKE ?`)
		searchWithID(`SELECT id, username FROM users WHERE username LIKE ?`, "user")
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
