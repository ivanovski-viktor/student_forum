package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/ivanovski-viktor/student_forum/server/models"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

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

	var loginUser models.LoginUser
	var user models.User

	err := c.ShouldBindJSON(&loginUser)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

	user.Email = loginUser.Email
	user.Password = loginUser.Password

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

	var UserInfo models.UserInfo

	UserInfo.Username = user.Username
	UserInfo.CreatedAt = user.CreatedAt

	c.JSON(http.StatusOK, gin.H{"message": UserInfo})
}
