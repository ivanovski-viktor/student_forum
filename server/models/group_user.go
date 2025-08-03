package models

import (
	"time"

	"github.com/ivanovski-viktor/student_forum/server/db"
)

type GroupUser struct {
	UserID    int64     `json:"user_id"`
	GroupName string    `json:"group_name"`
	JoinedAt  time.Time `json:"joined_at"`
}

func JoinGroup(userID int64, groupName string) error {
	query := `
		INSERT INTO groups_users (user_id, group_name, joined_at)
		VALUES (?, ?, ?)
	`

	_, err := db.DB.Exec(query, userID, groupName, time.Now())
	return err
}

func LeaveGroup(userID int64, groupName string) error {
	query := `
		DELETE FROM groups_users
		WHERE user_id = ? AND group_name = ?
	`

	_, err := db.DB.Exec(query, userID, groupName)
	return err
}

func IsUserInGroup(userID int64, groupName string) (bool, error) {
	query := `
		SELECT COUNT(*) FROM groups_users
		WHERE user_id = ? AND group_name = ?
	`

	var count int
	err := db.DB.QueryRow(query, userID, groupName).Scan(&count)
	if err != nil {
		return false, err
	}

	return count > 0, nil
}

func GetGroupsForUser(userID int64) ([]GroupUser, error) {
	query := `
		SELECT user_id, group_name, joined_at FROM groups_users
		WHERE user_id = ?
	`

	rows, err := db.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groupUsers []GroupUser

	for rows.Next() {
		var gu GroupUser
		if err := rows.Scan(&gu.UserID, &gu.GroupName, &gu.JoinedAt); err != nil {
			return nil, err
		}
		groupUsers = append(groupUsers, gu)
	}

	return groupUsers, nil
}

func GetUsersInGroup(groupName string) ([]GroupUser, error) {
	query := `
		SELECT user_id, group_name, joined_at FROM groups_users
		WHERE group_name = ?
	`

	rows, err := db.DB.Query(query, groupName)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groupUsers []GroupUser

	for rows.Next() {
		var gu GroupUser
		if err := rows.Scan(&gu.UserID, &gu.GroupName, &gu.JoinedAt); err != nil {
			return nil, err
		}
		groupUsers = append(groupUsers, gu)
	}

	return groupUsers, nil
}
