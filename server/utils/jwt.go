package utils

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/ivanovski-viktor/student_forum/server/config"
)

func GenerateJWTToken(email string, userId int64) (string, error) {
	secretKey := config.JWTSecretKey

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"email":  email,
			"userId": userId,
			// 1 hour time until token expires
			"exp": time.Now().Add(time.Hour).Unix(),
		})
	return token.SignedString([]byte(secretKey))
}

func VerifyJWTToken(token string) (int64, error) {

	secretKey := config.JWTSecretKey

	parsedToken, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		// .(check for type)
		_, ok := token.Method.(*jwt.SigningMethodHMAC)

		if !ok {
			return nil, errors.New("unexpected signing method")
		}

		return []byte(secretKey), nil
	})
	if err != nil {
		return 0, errors.New("could not parse token")
	}

	validToken := parsedToken.Valid

	if !validToken {
		return 0, errors.New("invalid token")
	}

	claims, ok := parsedToken.Claims.(jwt.MapClaims)

	if !ok {
		return 0, errors.New("invalid token claims")
	}

	userIdFloat, _ := claims["userId"].(float64)

	userId := int64(userIdFloat)

	return userId, nil
}
