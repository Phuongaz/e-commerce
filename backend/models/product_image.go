package models

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProductImage struct {
	ID        primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	ProductID primitive.ObjectID `json:"product_id" bson:"product_id"`
	URL       string             `json:"url" bson:"url"`
	CreatedAt primitive.DateTime `json:"created_at" bson:"created_at"`
}
