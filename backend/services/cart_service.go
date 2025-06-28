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
	err := s.TryCreateCart(userID)
	if err != nil {
		return nil, err
	}
	filter := bson.M{"user_id": userID}
	var cart models.Cart
	err = s.collection.FindOne(context.Background(), filter).Decode(&cart)
	if err != nil {
		return nil, err
	}
	if cart.Items == nil {
		cart.Items = []models.CartItem{}
	}

	return &cart, nil
}
func (s *CartService) AddToCart(userID string, productID string, quantity int, size string) error {
	err := s.TryCreateCart(userID)
	if err != nil {
		return err
	}

	filter := bson.M{
		"user_id": userID,
		"items": bson.M{
			"$elemMatch": bson.M{
				"product_id": productID,
				"size":       size,
			},
		},
	}

	var cart models.Cart
	err = s.collection.FindOne(context.Background(), filter).Decode(&cart)
	if err == nil {
		update := bson.M{
			"$inc": bson.M{
				"items.$.quantity": quantity,
			},
		}
		_, err = s.collection.UpdateOne(context.Background(), filter, update)
		return err
	}

	filter = bson.M{"user_id": userID}
	update := bson.M{
		"$push": bson.M{
			"items": bson.M{
				"product_id": productID,
				"quantity":   quantity,
				"size":       size,
			},
		},
	}
	_, err = s.collection.UpdateOne(context.Background(), filter, update)
	return err
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

func (s *CartService) DeleteCartItem(userID string, productID string, size string) error {
	filter := bson.M{"user_id": userID, "items.product_id": productID, "items.size": size}
	update := bson.M{"$pull": bson.M{"items": bson.M{"product_id": productID, "size": size}}}
	_, err := s.collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}
	return nil
}
func (s *CartService) TryCreateCart(userID string) error {
	filter := bson.M{"user_id": userID}
	if err := s.collection.FindOne(context.Background(), filter).Err(); err != nil {
		if err == mongo.ErrNoDocuments {
			_, err := s.collection.InsertOne(context.Background(), filter)
			if err != nil {
				return err
			}
		}
		return err
	}

	return nil
}
