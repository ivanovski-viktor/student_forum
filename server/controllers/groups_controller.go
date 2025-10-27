package controllers

import (
	"fmt"
	"math"
	"net/http"
	"regexp"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/models"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

func CreateGroup(c *gin.Context) {
	var group models.Group
	if err := c.ShouldBindJSON(&group); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data"})
		return
	}

	//Validation for group name
	name := group.Name
	if len(name) < 3 || len(name) > 20 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Group name must be between 3 and 20 characters."})
		return
	}

	matched, _ := regexp.MatchString(`^[a-zA-Z0-9]+$`, name)
	if !matched {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Group name can only contain letters and numbers."})
		return
	}


	userId := c.GetInt64("userId")
	group.CreatorID = userId

	if err := group.Create(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to create group"})
		return
	}

	// Auto-join the creator to the group
	err := models.JoinGroup(userId, group.Name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Group created, but failed to join creator"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Group created successfully"})
}

func GetAllGroups(c *gin.Context) {
	groups, err := models.GetAllGroups()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error getting groups"})
		return
	}

	if len(groups) == 0 {
		c.JSON(http.StatusOK, gin.H{"groups": []models.Group{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"groups": groups})
}

func GetGroup(c *gin.Context) {
	name := c.Param("name")

	group, err := models.GetGroupByName(name)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Group not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"group": group})
}

func UpdateGroup(c *gin.Context) {
	name := c.Param("name")

	group, err := models.GetGroupByName(name)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Group not found"})
		return
	}

	userId := c.GetInt64("userId")
	if group.CreatorID != userId {
		c.JSON(http.StatusForbidden, gin.H{"message": "Not authorized to update this group"})
		return
	}

	if err := c.ShouldBindJSON(&group); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request data"})
		return
	}

	if err := group.Update(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to update group"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"group": group})
}

func JoinGroup(c *gin.Context) {
	groupName := c.Param("name")
	userId := c.GetInt64("userId")

	err := models.JoinGroup(userId, groupName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to join group"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully joined group"})
}
func LeaveGroup(c *gin.Context) {
	groupName := c.Param("name")
	userId := c.GetInt64("userId")

	err := models.LeaveGroup(userId, groupName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to leave group"})
		return
	}

	c.Status(http.StatusNoContent)
}

func GetPostsForGroup(c *gin.Context) {
	groupName := c.Param("name")

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))

	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	// Get paginated posts for the group
	posts, err := models.GetPostsByGroupName(groupName, limit, offset)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get posts"})
		return
	}

	// Get total post count for the group
	totalCount, err := models.GetTotalPostsCountByGroup(groupName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get total count"})
		return
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(limit)))

	c.JSON(http.StatusOK, gin.H{
		"posts":       posts,
		"page":        page,
		"limit":       limit,
		"total_posts": totalCount,
		"total_pages": totalPages,
	})
}

func GetUsersInGroup( c *gin.Context) {
	groupName := c.Param("name");

	groupUsers, err := models.GetUsersInGroup(groupName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get group users", "err": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"groupUsers": groupUsers,
	})

}


func CreatePostInGroup(c *gin.Context) {
	groupName := c.Param("name")
	userId := c.GetInt64("userId")

	// Check group exists
	_, err := models.GetGroupByName(groupName)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Group not found"})
		return
	}

	inGroup, err := models.IsUserInGroup(userId, groupName) 
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{ "message": err.Error()})
		return
	}

	if !inGroup {
		c.JSON(http.StatusUnauthorized, gin.H{ "message": "Not a group member"})
		return
	}

	var post models.Post
	if err := c.ShouldBindJSON(&post); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid post data"})
		return
	}

	post.UserID = userId
	post.GroupName = &groupName

	if err := post.Create(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to create post in group"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Post created in group", "post": post})
}

func DeleteGroup(c *gin.Context) {
	name := c.Param("name")

	group, err := models.GetGroupByName(name)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Group not found"})
		return
	}

	userId := c.GetInt64("userId")
	if group.CreatorID != userId {
		c.JSON(http.StatusForbidden, gin.H{"message": "Not authorized to delete this group"})
		return
	}

	err = group.Delete()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to delete group", "error": err.Error()})
		return
	}

	c.Status(http.StatusNoContent)
}

func UploadGroupImage(c *gin.Context) {
	groupName := c.Param("name")
	userId := c.GetInt64("userId")

	file, fileHeader, err := c.Request.FormFile("group_image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required"})
		return
	}

	group, err := models.GetGroupByName(groupName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Group not found"})
		return
	}

	if group.CreatorID != userId {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Not authorized"})
		return
	}

	folderPath := fmt.Sprintf("group_media/%s/images", groupName)

	//Delete old image
	err = utils.DeleteFolderContents(folderPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to delete old group image."})
		return
	}

	// Upload to Cloudinary
	imageURL, err := utils.UploadFileToCloudinary(file, fileHeader, folderPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image" + err.Error()})
		return
	}

	group.GroupImageURL = imageURL
	err = group.UpdateGroupImage()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Uploaded image successfully", "group_image_url": imageURL})
}
func UploadCoverImage(c *gin.Context) {
	groupName := c.Param("name")
	userId := c.GetInt64("userId")

	file, fileHeader, err := c.Request.FormFile("group_cover")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required"})
		return
	}

	group, err := models.GetGroupByName(groupName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Group not found"})
		return
	}

	if group.CreatorID != userId {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Not authorized"})
		return
	}

	folderPath := fmt.Sprintf("group_media/%s/cover-images", groupName)

	//Delete old image
	err = utils.DeleteFolderContents(folderPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to delete old group cover image."})
		return
	}

	// Upload to Cloudinary
	imageURL, err := utils.UploadFileToCloudinary(file, fileHeader, folderPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload cover image" + err.Error()})
		return
	}

	group.GroupImageURL = imageURL
	err = group.UpdateCoverImage()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save cover image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Uploaded image successfully", "group_cover_url": imageURL})
}