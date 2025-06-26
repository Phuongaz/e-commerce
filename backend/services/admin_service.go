package services

import (
	"context"
	"ecommerce-api/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type AdminService struct {
	userCollection    *mongo.Collection
	orderCollection   *mongo.Collection
	productCollection *mongo.Collection
}

func NewAdminService(db *mongo.Database) *AdminService {
	return &AdminService{
		userCollection:    db.Collection("users"),
		orderCollection:   db.Collection("orders"),
		productCollection: db.Collection("products"),
	}
}

func (s *AdminService) GetAdminStats() (*models.Stats, error) {
	stats := models.Stats{}

	userCount, err := s.userCollection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	stats.TotalUsers = int(userCount)

	orderCount, err := s.orderCollection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	stats.TotalOrders = int(orderCount)

	productCount, err := s.productCollection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	stats.TotalProducts = int(productCount)

	return &stats, nil
}
