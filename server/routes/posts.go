package routes

import (
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

	userId := c.GetInt64("userId")
	post.UserID = userId

	err = post.Create()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to create post!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Created post!"})
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

	post, err := models.GetPostById(postId)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to get post!"})
		return
	}

	userId := c.GetInt64("userId")

	if post.UserID != userId {
		c.JSON(http.StatusNotFound, gin.H{"message": "Not authorized to delete the post!"})
		return
	}

	err = post.Delete()

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
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not get post!"})
		return
	}

	err = c.ShouldBindJSON(&post)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

	userId := c.GetInt64("userId")

	if post.UserID != userId {
		c.JSON(http.StatusNotFound, gin.H{"message": "Not authorized to update the post!"})
		return
	}

	err = post.Update()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to update post!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated the post!"})
}
