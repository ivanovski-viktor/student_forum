package routes

import (
	"errors"
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
		context.JSON(http.StatusBadRequest, gin.H{ "message": "Could not parse request data!"})
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
		return
	}

	if len(posts) < 1 {
	context.JSON(http.StatusOK, gin.H{"posts": []models.Post{}})
	return
}

    context.JSON( http.StatusOK, gin.H{"posts": posts})
	return 
}

func getPost(context *gin.Context) {

	postId, err := parseParamToInt("id", context)
	if err != nil {
		context.JSON( http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}
	
	post, err :=  models.GetPostById(postId)

	if err != nil {
		context.JSON( http.StatusNotFound, gin.H{"message": "Unable to get post!"})
		return
	}

	context.JSON( http.StatusOK, gin.H{"message": post})
	return 
}

func deletePost(context *gin.Context) {

	postId, err := parseParamToInt("id", context)
	if err != nil {
		context.JSON( http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}

	err = models.DeletePostByID(postId)

	if err != nil {
		context.JSON( http.StatusNotFound, gin.H{"message": "Unable to find and delete the post!"})
		return
	}

	context.Status(http.StatusNoContent)
	return
}

func updatePost(context *gin.Context) {

	postId, err := parseParamToInt("id", context)
	if err != nil {
		context.JSON( http.StatusBadRequest, gin.H{"message": "Unable to parse post id!"})
		return
	}
	
	post, err :=  models.GetPostById(postId)

	// seperate struct for control of user input
	var input struct {
		Title       *string `json:"title"`
		Description *string `json:"description"`
	}

	if err := context.ShouldBindJSON(&input); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
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
		context.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to update post!"})
		return
	}

    context.JSON( http.StatusOK, gin.H{"message": fmt.Sprintf("Updated post: %s", post.Title),})
	return 
}
//helper function for converting param of type string to int
func parseParamToInt(param string, context *gin.Context ) (int64, error){

	postIdStr := context.Param(param)

	postId, err := strconv.ParseInt(postIdStr, 10, 64)
	if err != nil {
		return 0,  errors.New("Unable to parse param, param must be a number!")
	}
	return postId, nil
}