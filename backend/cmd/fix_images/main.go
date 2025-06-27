package main

import (
	"context"
	"fmt"
	"io/ioutil"
	"log"
	"path/filepath"
	"strings"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	// Use default MongoDB connection
	mongoURI := "mongodb://localhost:27017"
	dbName := "ecommerce"

	client, err := mongo.Connect(context.Background(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Error connecting to MongoDB:", err)
	}
	defer client.Disconnect(context.Background())

	db := client.Database(dbName)
	collection := db.Collection("products")

	// Get all uploaded images from uploads directory
	uploadDir := "uploads"
	files, err := ioutil.ReadDir(uploadDir)
	if err != nil {
		log.Fatal("Error reading uploads directory:", err)
	}

	var imageFiles []string
	for _, file := range files {
		if !file.IsDir() && isImageFile(file.Name()) {
			// Store relative path that matches static serving
			imagePath := "uploads/" + file.Name()
			imageFiles = append(imageFiles, imagePath)
		}
	}

	if len(imageFiles) == 0 {
		log.Println("No image files found in uploads directory")
		return
	}

	fmt.Printf("Found %d image files: %v\n", len(imageFiles), imageFiles)

	// Get all products without images
	cursor, err := collection.Find(context.Background(), bson.M{
		"$or": []bson.M{
			{"image": nil},
			{"image": bson.M{"$exists": false}},
			{"image": bson.M{"$size": 0}},
		},
	})
	if err != nil {
		log.Fatal("Error finding products:", err)
	}
	defer cursor.Close(context.Background())

	var products []bson.M
	if err := cursor.All(context.Background(), &products); err != nil {
		log.Fatal("Error decoding products:", err)
	}

	fmt.Printf("Found %d products without images\n", len(products))

	// Assign images to products
	updated := 0
	for i, product := range products {
		if i < len(imageFiles) {
			productID := product["_id"].(primitive.ObjectID)
			imagePath := imageFiles[i]

			_, err := collection.UpdateOne(
				context.Background(),
				bson.M{"_id": productID},
				bson.M{"$set": bson.M{"image": []string{imagePath}}},
			)
			if err != nil {
				log.Printf("Error updating product %s: %v", productID.Hex(), err)
				continue
			}

			fmt.Printf("✅ Updated product '%s' with image %s\n", product["name"], imagePath)
			updated++
		}
	}

	fmt.Printf("\n🎉 Successfully updated %d products with images!\n", updated)
}

func isImageFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	imageExts := []string{".jpg", ".jpeg", ".png", ".gif", ".webp"}
	for _, imgExt := range imageExts {
		if ext == imgExt {
			return true
		}
	}
	return false
}
