package routes

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/ivanovski-viktor/student_forum/server/models"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

type UserInfo struct {
	ID        int64     `json:"id"`
	Username  string    `json:"username"`
	Email     string    `json:"email,omitempty"`
	CreatedAt time.Time `json:"created_at"`
}

func registerUser(c *gin.Context) {

	var RegisterUser models.RegisterUser

	err := c.ShouldBindJSON(&RegisterUser)
	if err != nil {
		// get password validation error message
		if validationErrors, ok := err.(validator.ValidationErrors); ok {
			for _, fieldErr := range validationErrors {
				if fieldErr.Field() == "Password" && fieldErr.Tag() == "strongpwd" {
					c.JSON(http.StatusBadRequest, gin.H{
						"message": "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.",
					})
					return
				}
			}
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

func loginUser(c *gin.Context) {
	var user models.User

	err := c.ShouldBindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": err.Error()})
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

func getUser(c *gin.Context) {

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
		ID:        user.ID,
		Username:  user.Username,
		CreatedAt: user.CreatedAt,
	}

	c.JSON(http.StatusOK, gin.H{"message": userInfo})
}

func getAuthenticatedUser(c *gin.Context) {

	// Get userId from context
	userIdRaw, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	userId, ok := userIdRaw.(int64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Invalid user ID"})
		return
	}

	user, err := models.GetUserById(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "User not found"})
		return
	}

	userInfo := UserInfo{
		ID:        user.ID,
		Username:  user.Username,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
	}

	c.JSON(http.StatusOK,
		gin.H{"message": userInfo})
}

func changeUserPassword(c *gin.Context) {

	userIdRaw, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	userId, ok := userIdRaw.(int64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Invalid user ID"})
		return
	}

	user, err := models.GetUserById(userId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "User not found"})
		return
	}

	err = user.ChangePassword()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Unable to change user password!"})
		return
	}
}
