package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/models"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

func VoteOnPost(c *gin.Context) {
	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid post ID"})
		return
	}

	userId := c.GetInt64("userId")

	var input struct {
		VoteType int `json:"vote_type"` // 1 = upvote, -1 = downvote
	}

	if err := c.ShouldBindJSON(&input); err != nil || (input.VoteType != 1 && input.VoteType != -1) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "vote_type must be 1 or -1"})
		return
	}

	if err := models.CastPostVote(userId, postId, input.VoteType); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to cast vote", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Vote recorded"})
}

func GetUserVote(c *gin.Context) {
	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid post ID"})
		return
	}

	userId := c.GetInt64("userId")

	voteType, err := models.GetUserVote(userId, postId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get vote", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"vote_type": voteType})
}

func DeleteUserVote(c *gin.Context) {
	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid post ID"})
		return
	}

	userId := c.GetInt64("userId")

	err = models.DeleteUserVote(userId, postId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete vote", "error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}