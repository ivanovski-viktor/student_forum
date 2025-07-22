package utils

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// helper function for converting param of type string to int
func ParseParamToInt(param string, c *gin.Context) (int64, error) {
	paramInt, err := strconv.ParseInt(c.Param(param), 10, 64)
	if err != nil {
		return 0, err
	}
	return paramInt, nil
}

func GetAuthenticatedUserId(c *gin.Context) (int64, bool) {
	userIdRaw, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return 0, false
	}

	userId, ok := userIdRaw.(int64)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Invalid user ID"})
		return 0, false
	}

	return userId, true
}
