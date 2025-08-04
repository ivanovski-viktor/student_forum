package utils

import (
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
