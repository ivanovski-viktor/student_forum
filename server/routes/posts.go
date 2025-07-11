package routes

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/models"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

func createPost(c *gin.Context) {

	var post models.Post

	err := c.ShouldBindJSON(&post)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

	err = post.Create()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to create post!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Created post: %s", post.Title)})
}

func getAllPosts(c *gin.Context) {

	posts, err := models.GetAll()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting posts!"})
		return
	}

	if len(posts) < 1 {
		c.JSON(http.StatusOK, gin.H{"posts": []models.Post{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"posts": posts})
}

func getPost(c *gin.Context) {

	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}

	post, err := models.GetPostById(postId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Unable to get post!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": post})
}

func deletePost(c *gin.Context) {

	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}

	err = models.DeletePostByID(postId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Unable to find and delete the post!"})
		return
	}

	c.Status(http.StatusNoContent)
}

func updatePost(c *gin.Context) {

	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}

	post, err := models.GetPostById(postId)

	// seperate struct for control of user input
	var input struct {
		Title       *string `json:"title"`
		Description *string `json:"description"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

	// Apply updates if present
	if input.Title != nil {
		post.Title = *input.Title
	}
	if input.Description != nil {
		post.Description = *input.Description
	}

	err = post.Update()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to update post!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": fmt.Sprintf("Updated post: %s", post.Title)})
}
