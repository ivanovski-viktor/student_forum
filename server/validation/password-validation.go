package validation

import (
	"net/http"
	"regexp"

	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/ivanovski-viktor/student_forum/server/models"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

var (
	hasLower   = regexp.MustCompile(`[a-z]`)
	hasUpper   = regexp.MustCompile(`[A-Z]`)
	hasDigit   = regexp.MustCompile(`\d`)
	hasSpecial = regexp.MustCompile(`[\W_]`)
)

func validateStrongPassword(password string) bool {
	if len(password) < 8 {
		return false
	}
	if !hasLower.MatchString(password) {
		return false
	}
	if !hasUpper.MatchString(password) {
		return false
	}
	if !hasDigit.MatchString(password) {
		return false
	}
	if !hasSpecial.MatchString(password) {
		return false
	}
	return true
}

func StrongPasswordValidator(fl validator.FieldLevel) bool {
	password := fl.Field().String()
	return validateStrongPassword(password)
}

func HandleStrongPasswordError(err error, c *gin.Context) bool {
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, fieldErr := range validationErrors {
			if fieldErr.Tag() == "strongpwd" {
				c.JSON(http.StatusBadRequest, gin.H{
					"message": "Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.",
				})
				return true
			}
		}
	}
	return false
}

func ValidatePasswordChange(c *gin.Context, input models.ChangePassword, user *models.User) bool {
	if !utils.CheckPasswordHash(input.Password, user.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid password!"})
		return false
	}

	if input.NewPassword != input.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Passwords must match!"})
		return false
	}

	if utils.CheckPasswordHash(input.NewPassword, user.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "New password cannot be the same as the old password!"})
		return false
	}
	return true
}
