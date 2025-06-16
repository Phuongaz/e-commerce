package models

import (
	"time"

	"gorm.io/gorm"
)

type Image struct {
	gorm.Model
	FileName    string    `json:"file_name" gorm:"not null"`
	ContentType string    `json:"content_type" gorm:"not null"`
	Size        int64     `json:"size" gorm:"not null"`
	Path        string    `json:"path" gorm:"not null"`
	UploadedAt  time.Time `json:"uploaded_at" gorm:"not null"`
}
