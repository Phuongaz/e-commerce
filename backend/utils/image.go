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

var uploadDir = "uploads/images"

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
	if !IsAllowedImageType(file.Header.Get("Content-Type")) {
		return "", errors.New("invalid file type")
	}

	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("%s%s", uuid.New().String(), ext)
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

	return path, nil
}

func UploadImages(files []*multipart.FileHeader) ([]string, error) {
	var uploadedPaths []string

	for _, file := range files {
		path, err := UploadImage(file)
		if err != nil {
			return nil, err
		}
		uploadedPaths = append(uploadedPaths, path)
	}

	return uploadedPaths, nil
}
