package routes

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/models"
)

func registerUser(c *gin.Context) {

	var user models.User

	err := c.ShouldBindJSON(&user)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

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
		c.JSON(http.StatusBadRequest, gin.H{"message": "Could not parse request data!"})
		return
	}

	err = user.ValidateCredentials()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid login credentials!"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Logged in successfully!"})

}
