package models

import (
	"database/sql"

	"github.com/ivanovski-viktor/student_forum/server/db"
)

func CastPostVote(userID, postID int64, voteType int) error {
	var existingVote int
	err := db.DB.QueryRow(`SELECT vote_type FROM post_votes WHERE post_id = ? AND user_id = ?`, postID, userID).Scan(&existingVote)

	switch {
	case err == sql.ErrNoRows:
		// No vote yet — insert and update post
		_, err := db.DB.Exec(`
			INSERT INTO post_votes (post_id, user_id, vote_type)
			VALUES (?, ?, ?)`,
			postID, userID, voteType,
		)
		if err != nil {
			return err
		}

		return updatePostVoteCount(postID, voteType, 1)

	case err != nil:
		return err

	case existingVote == voteType:
		// Vote already exists with same type, do nothing
		return nil

	default:
		// Change the vote type — update and adjust post counters
		_, err := db.DB.Exec(`
			UPDATE post_votes SET vote_type = ? WHERE post_id = ? AND user_id = ?`,
			voteType, postID, userID,
		)
		if err != nil {
			return err
		}

		if err := updatePostVoteCount(postID, existingVote, -1); err != nil {
			return err
		}
		return updatePostVoteCount(postID, voteType, 1)
	}
}

func updatePostVoteCount(postID int64, voteType int, delta int) error {
	var column string
	if voteType == 1 {
		column = "upvotes"
	} else {
		column = "downvotes"
	}

	query := `UPDATE posts SET ` + column + ` = ` + column + ` + ? WHERE id = ?`
	_, err := db.DB.Exec(query, delta, postID)
	return err
}

func GetUserVote(userID int64, postID int64) (*int, error) {
	query := `SELECT vote_type FROM post_votes
		WHERE user_id = ? AND post_id = ?`

	var voteType int;

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()
	err = stmt.QueryRow(userID, postID).Scan(&voteType)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &voteType, nil;
}

func DeleteUserVote(userID int64, postID int64) error {
	query := `DELETE FROM post_votes
		WHERE user_id = ? AND post_id = ?`

	stmt, err := db.DB.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(userID, postID)
	if err != nil {
		return err
	}

	return nil
}