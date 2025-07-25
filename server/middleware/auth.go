package middleware

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

func Authenticate(c *gin.Context) {
	token := c.Request.Header.Get("Authorization")

	if token == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Not authorized"})
		return
	}

	userId, err := utils.VerifyJWTToken(token)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message": "Not authorized " + err.Error()})
		return
	}

	c.Set("userId", userId)
	c.Next()
}
