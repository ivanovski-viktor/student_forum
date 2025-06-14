package routes

import (
	"fmt"
	"net/http"

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
		context.JSON(http.StatusBadRequest, gin.H{"message": err})
		return
	}


    context.JSON( http.StatusOK, gin.H{"message": fmt.Sprintf("Post %s created", post.Title),})
	return 
}
func getAllPosts(context *gin.Context) {

	posts, err := models.GetAll()

	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting posts!"})
	}

	if len(posts) < 1 {
		context.JSON( http.StatusOK, gin.H{"message": "No posts available!"})
		return 
	}

    context.JSON( http.StatusOK, gin.H{"posts": posts})
	return 
}
func getPost(context *gin.Context) {
    context.JSON( http.StatusOK, gin.H{"message": "Coming soon!"})
	return 
}
