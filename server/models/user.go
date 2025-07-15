package models

import (
	"errors"

	"github.com/ivanovski-viktor/student_forum/server/db"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

type User struct {
	ID       int64  `binding:"required"`
	Username string `binding:"required"`
	Email    string `binding:"required,email"`
	Password string `binding:"required,strongpwd"`
}

type UserControl struct {
	Username        string `binding:"required"`
	Email           string `binding:"required,email"`
	Password        string `binding:"required,strongpwd"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

func (u *User) Create() error {
	query := "INSERT INTO users (username, email, password) VALUES (?, ?, ?)"
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()
	_, err = stmt.Exec(u.Username, u.Email, u.Password)

	return err
}

func (u *User) ValidateCredentials() error {
	query := "SELECT id, password FROM users WHERE email = ?"
	row := db.DB.QueryRow(query, u.Email)

	var retrievedPassword string

	err := row.Scan(&u.ID, &retrievedPassword)

	if err != nil {
		return errors.New("invalid login credentials")
	}

	//Validate password
	validPassword := utils.CheckPasswordHash(u.Password, retrievedPassword)
	if !validPassword {
		return errors.New("invalid login credentials")
	}
	return nil
}
