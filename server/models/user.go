package models

import (
	"errors"
	"time"

	"github.com/ivanovski-viktor/student_forum/server/db"
	"github.com/ivanovski-viktor/student_forum/server/utils"
)

// Add birthdate in the future
type User struct {
	ID        int64     `json:"id,omitempty"`
	Username  string    `json:"username,omitempty"`
	Email     string    `json:"email" binding:"required,email"`
	Password  string    `json:"password" binding:"required"`
	CreatedAt time.Time `json:"created_at,omitempty"`
}

type RegisterUser struct {
	Username        string `json:"username" binding:"required"`
	Email           string `json:"email" binding:"required,email"`
	Password        string `json:"password" binding:"required,strongpwd"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

type ChangePassword struct {
	Password        string `json:"password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,strongpwd"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

func (u *User) Create() error {
	u.CreatedAt = time.Now()

	query := "INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)"
	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()
	_, err = stmt.Exec(u.Username, u.Email, u.Password, u.CreatedAt)

	return err
}

func (u *User) ValidateCredentials() error {
	query := "SELECT id, password, created_at FROM users WHERE email = ?"
	row := db.DB.QueryRow(query, u.Email)

	var retrievedPassword string

	err := row.Scan(&u.ID, &retrievedPassword, &u.CreatedAt)

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

func GetUserById(id int64) (*User, error) {
	query :=
		`SELECT username, email, password ,created_at 
	FROM users 
	WHERE id = ?`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return nil, err
	}

	defer stmt.Close()

	var user User

	err = stmt.QueryRow(id).Scan(&user.Username, &user.Email, &user.Password, &user.CreatedAt)
	if err != nil {
		return nil, err
	}

	user.ID = id
	return &user, nil
}

func (u *User) ChangePassword(newPassword string) error {
	query := "UPDATE users SET password = ? WHERE id = ?"

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}

	defer stmt.Close()

	_, err = stmt.Exec(newPassword, u.ID)
	if err != nil {
		return err
	}

	return nil
}
