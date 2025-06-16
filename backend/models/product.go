package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Product struct {
	ID          primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	Name        string             `json:"name" bson:"name"`
	Description string             `json:"description" bson:"description"`
	Price       float64            `json:"price" bson:"price"`
	Stock       int                `json:"stock" bson:"stock"`
	Category    string             `json:"category" bson:"category"`
	Images      []string           `json:"images" bson:"images"`
	CreatedAt   primitive.DateTime `json:"created_at" bson:"created_at"`
	Discount    float64            `json:"discount" bson:"discount" default:"0"`
	CategoryID  string             `json:"category_id" bson:"category_id"`
	UpdatedAt   primitive.DateTime `json:"updated_at" bson:"updated_at"`
}
