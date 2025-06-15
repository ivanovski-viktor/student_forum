package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/models"
)

func createPost(context *gin.Context) {

	var post models.Post

	err := context.ShouldBindJSON(&post)

	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{ "message": "Cound not parse request data!"})
		return
	}

	err = post.Create()
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to create post!"})
		return
	}


    context.JSON( http.StatusOK, gin.H{"message": fmt.Sprintf("Created post: %s", post.Title),})
	return 
}

func getAllPosts(context *gin.Context) {

	posts, err := models.GetAll()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting posts!"})
	}

	if len(posts) < 1 {
	context.JSON(http.StatusOK, gin.H{"posts": []models.Post{}})
	return
}

    context.JSON( http.StatusOK, gin.H{"posts": posts})
	return 
}

func getPost(context *gin.Context) {

	postIdStr := context.Param("id")

	postId, err := strconv.ParseInt(postIdStr, 10, 64)
	if err != nil {
		context.JSON( http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}

	post, err :=  models.GetPostById(postId)

	if err != nil {
		context.JSON( http.StatusBadRequest, gin.H{"message": "Unable to get post!"})
		return
	}

	context.JSON( http.StatusOK, gin.H{"message": post})
	return 
}

func deletePost(context *gin.Context) {
	postIdStr := context.Param("id")

	postId, err := strconv.ParseInt(postIdStr, 10, 64)

	if err != nil {
		context.JSON( http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}

	err = models.DeletePostByID(postId)

	if err != nil {
		context.JSON( http.StatusInternalServerError, gin.H{"message": "Unable to find and delete the post!"})
		return
	}

	context.JSON(http.StatusNoContent, models.Post{})
	return
}