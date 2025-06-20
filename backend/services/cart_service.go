package services

import (
	"context"
	"ecommerce-api/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type CartService struct {
	collection *mongo.Collection
}

func NewCartService(db *mongo.Database) *CartService {
	return &CartService{
		collection: db.Collection("carts"),
	}
}

func (s *CartService) GetCart(userID string) (*models.Cart, error) {
	filter := bson.M{"user_id": userID}
	var cart models.Cart
	err := s.collection.FindOne(context.Background(), filter).Decode(&cart)
	if err != nil {
		return nil, err
	}
	return &cart, nil
}

func (s *CartService) AddToCart(userID string, productID string, quantity int, size string) error {
	filter := bson.M{"user_id": userID}
	update := bson.M{"$push": bson.M{"items": bson.M{"product_id": productID, "quantity": quantity, "size": size}}}
	_, err := s.collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}
	return nil
}

func (s *CartService) UpdateCart(userID string, cartItem []models.CartItem) error {
	filter := bson.M{"user_id": userID}
	update := bson.M{"$set": bson.M{"items": cartItem}}
	_, err := s.collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}
	return nil
}

// merge cart on  guest user after login
func (s *CartService) MergeCart(userID string, cartItem []models.CartItem) error {
	filter := bson.M{"user_id": userID}
	update := bson.M{"$push": bson.M{"items": cartItem}}
	_, err := s.collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}
	return nil
}
