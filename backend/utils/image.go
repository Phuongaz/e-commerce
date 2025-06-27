package utils

import (
	"errors"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"

	"slices"

	"github.com/google/uuid"
)

var uploadDir = "uploads"

func IsAllowedImageType(mimeType string) bool {
	allowedTypes := []string{
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
	}

	return slices.Contains(allowedTypes, mimeType)
}

func UploadImage(file *multipart.FileHeader) (string, error) {
	// TODO: validate image type
	// if !IsAllowedImageType(file.Header.Get("Content-Type")) {
	// 	return "", errors.New("invalid file type")
	// }

	ext := filepath.Ext(file.Filename)
	imageID := uuid.New().String()
	filename := fmt.Sprintf("%s%s", imageID, ext)
	path := filepath.Join(uploadDir, filename)

	if err := os.MkdirAll(uploadDir, 0755); err != nil {
		return "", err
	}

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	dst, err := os.Create(path)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		return "", err
	}

	// Return only the UUID ID, not the full path
	return imageID, nil
}

func UploadImages(files []*multipart.FileHeader) ([]string, error) {
	var imageIDs []string

	for _, file := range files {
		imageID, err := UploadImage(file)
		if err != nil {
			return nil, err
		}
		imageIDs = append(imageIDs, imageID)
	}

	return imageIDs, nil
}

func GetImage(id string) (string, error) {
	// Try different extensions
	extensions := []string{".jpg", ".jpeg", ".png", ".gif", ".webp"}

	for _, ext := range extensions {
		filename := fmt.Sprintf("%s%s", id, ext)
		path := filepath.Join(uploadDir, filename)

		if _, err := os.Stat(path); err == nil {
			return path, nil
		}
	}

	return "", errors.New("image not found")
}
