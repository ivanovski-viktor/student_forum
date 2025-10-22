package controllers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/models"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

func GetComment(c *gin.Context) {
	commentId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid comment ID"})
		return
	}

	comment, err := models.GetCommentByID(commentId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Comment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"comment": comment})
}

func GetCommentReplies(c *gin.Context) {
	commentId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid comment ID"})
		return
	}

	replies, err := models.GetCommentReplies(commentId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Comment not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"replies": replies})
}

func CreateComment(c *gin.Context) {
	userId := c.GetInt64("userId")

	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid post ID"})
		return
	}

	_, err = models.GetPostById(postId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Post does not exist"})
		return
	}

	var req struct {
		ParentID *int64 `json:"parent_id,omitempty"`
		Content  string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data"})
		return
	}

	comment := &models.Comment{
		PostID:    postId,
		UserID:    userId,
		ParentID:  req.ParentID,
		Content:   req.Content,
		CreatedAt: time.Now(),
	}

	if err := comment.Create(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create comment"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"comment": comment})
}

func GetCommentsForPost(c *gin.Context) {
	postId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid post ID"})
		return
	}

	_, err = models.GetPostById(postId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Post does not exist"})
		return
	}

	comments, err := models.GetCommentsByPostID(postId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to fetch comments"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"comments": comments})
}

func UpdateComment(c *gin.Context) {

	commentId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid comment ID"})
		return
	}

	userId := c.GetInt64("userId")

	comment, err := models.GetCommentByID(commentId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Comment not found"})
		return
	}

	if comment.UserID != userId {
		c.JSON(http.StatusForbidden, gin.H{"message": "Not authorized to edit this comment"})
		return
	}

	var req struct {
		Content string `json:"content" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Content is required"})
		return
	}

	comment.Content = req.Content

	if err := comment.Update(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update comment"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"comment": comment})
}

func DeleteComment(c *gin.Context) {
	commentId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid comment ID"})
		return
	}

	userId := c.GetInt64("userId")

	comment, err := models.GetCommentByID(commentId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Comment not found"})
		return
	}

	if comment.UserID != userId {
		c.JSON(http.StatusForbidden, gin.H{"message": "Not authorized to delete this comment"})
		return
	}

	if err := comment.Delete(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete comment", "error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}
