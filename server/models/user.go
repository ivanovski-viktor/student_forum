package models

import (
	"errors"

	"github.com/ivanovski-viktor/student_forum/server/db"
)

type User struct {
	ID       int64  `binding:required`
	Username string `binding:required`
	Email    string `binding:required`
	Password string `binding:required`
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

	// validate password
	if u.Password != retrievedPassword {
		return errors.New("invalid login credentials")
	}
	return nil
}
