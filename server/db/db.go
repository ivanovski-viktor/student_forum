package db

import (
	"database/sql"
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/sqlite3"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func InitDB() {
    var err error
    DB, err = sql.Open("sqlite3", "file:student_forum.db?_foreign_keys=on")
    if err != nil {
        log.Fatalf("Could not connect to DB: %v", err)
    }

    if err := DB.Ping(); err != nil {
        log.Fatalf("Could not ping DB: %v", err)
    }

    runMigrations()
}

func runMigrations() {
    migrationPath := "file://db/migrations"
    dbPath := "sqlite3://student_forum.db"

    m, err := migrate.New(migrationPath, dbPath)
    if err != nil {
        log.Fatalf("Failed to initialize migrations: %v", err)
    }

    if err := m.Up(); err != nil && err != migrate.ErrNoChange {
        log.Fatalf("Failed to run migrations: %v", err)
    }

    log.Println("Migrations applied successfully")
}
