package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/models"
	"github.com/ivanovski-viktor/student_forum/server/utils"
	"github.com/ivanovski-viktor/student_forum/server/validation"
)

type UserInfo struct {
	ID              int64     `json:"id"`
	Username        string    `json:"username"`
	Email           string    `json:"email,omitempty"`
	ProfileImageURL string    `json:"profile_image_url,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
}

func RegisterUser(c *gin.Context) {

	var RegisterUser models.RegisterUser

	err := c.ShouldBindJSON(&RegisterUser)
	if err != nil {
		// get password validation error message
		if validation.HandleStrongPasswordError(err, c) {
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

	if RegisterUser.Password != RegisterUser.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Passwords must match!"})
		return
	}

	var user models.User
	user.Username = RegisterUser.Username
	user.Email = RegisterUser.Email
	user.Password = RegisterUser.Password

	//Password hashing
	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not hash password!"})
		return
	}
	user.Password = hashedPassword

	err = user.Create()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create user!"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Created user successfully!"})
}

func LoginUser(c *gin.Context) {
	var user models.User

	err := c.ShouldBindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unable to parse request data!"})
		return
	}

	err = user.ValidateCredentials()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid login credentials!"})
		return
	}

	token, err := utils.GenerateJWTToken(user.Email, user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not authenticate user!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Logged in successfully!", "token": token})
}

func GetUser(c *gin.Context) {

	userId, err := utils.ParseParamToInt("id", c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Unable to parse user id!"})
		return
	}

	user, err := models.GetUserById(userId)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Unable to get user!"})
		return
	}

	userInfo := UserInfo{
		ID:              user.ID,
		Username:        user.Username,
		ProfileImageURL: user.ProfileImageURL,
		CreatedAt:       user.CreatedAt,
	}

	c.JSON(http.StatusOK, gin.H{"user": userInfo})
}

func GetAuthenticatedUser(c *gin.Context) {

	// Get userId from context
	userId := c.GetInt64("userId")

	user, err := models.GetUserById(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "User not found"})
		return
	}

	userInfo := UserInfo{
		ID:              user.ID,
		Username:        user.Username,
		Email:           user.Email,
		ProfileImageURL: user.ProfileImageURL,
		CreatedAt:       user.CreatedAt,
	}

	c.JSON(http.StatusOK,
		gin.H{"user": userInfo})
}

func ChangeUserPassword(c *gin.Context) {

	var changePassword models.ChangePassword

	err := c.ShouldBindJSON(&changePassword)
	if err != nil {
		if validation.HandleStrongPasswordError(err, c) {
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

	userId := c.GetInt64("userId")

	user, err := models.GetUserById(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "User not found"})
		return
	}

	if !validation.ValidatePasswordChange(c, changePassword, user) {
		return
	}

	hashedPassword, err := utils.HashPassword(changePassword.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to hash password!"})
		return
	}

	err = user.ChangePassword(hashedPassword)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to change user password!"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Changed password successfully!"})
}

func UploadProfilePicture(c *gin.Context) {
	userId := c.GetInt64("userId")

	file, fileHeader, err := c.Request.FormFile("profile_picture")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Image is required"})
		return
	}

	user, err := models.GetUserById(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "User not found"})
		return
	}

	folderPath := fmt.Sprintf("profile_pictures/%d", userId)

	//Delete old profile image
	err = utils.DeleteFolderContents(folderPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to delete old profile image."})
		return
	}

	// Upload to Cloudinary
	imageURL, err := utils.UploadImageToCloudinary(file, fileHeader, folderPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to upload image" + err.Error()})
		return
	}

	user.ProfileImageURL = imageURL
	err = user.UpdateProfileImage()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save image"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Uploaded image successfully", "profile_image_url": imageURL})
}
