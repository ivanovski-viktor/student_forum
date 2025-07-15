package utils

import (
	"regexp"

	"github.com/go-playground/validator/v10"
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
