package services

import (
	"context"
	"ecommerce-api/models"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type OrderItem struct {
	ProductID primitive.ObjectID `bson:"product_id"`
	Quantity  int                `bson:"quantity"`
	Price     float64            `bson:"price"`
}

type Order struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	UserID    primitive.ObjectID `bson:"user_id"`
	Items     []OrderItem        `bson:"items"`
	Total     float64            `bson:"total"`
	Status    string             `bson:"status"`
	CreatedAt time.Time          `bson:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at"`
}

type OrderService struct {
	collection     *mongo.Collection
	productService *ProductService
}

func NewOrderService(db *mongo.Database, productService *ProductService) *OrderService {
	return &OrderService{
		collection:     db.Collection("orders"),
		productService: productService,
	}
}

func (s *OrderService) CreateOrder(userID primitive.ObjectID, items []OrderItem) (*Order, error) {
	var total float64
	for _, item := range items {
		product, err := s.productService.GetProduct(item.ProductID)
		if err != nil {
			return nil, err
		}

		if product.Stock < item.Quantity {
			return nil, errors.New("insufficient stock")
		}

		total += product.Price * float64(item.Quantity)
	}

	order := &Order{
		UserID:    userID,
		Items:     items,
		Total:     total,
		Status:    "pending",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	result, err := s.collection.InsertOne(context.Background(), order)
	if err != nil {
		return nil, err
	}

	order.ID = result.InsertedID.(primitive.ObjectID)

	// Update product stock
	for _, item := range items {
		err = s.productService.UpdateStock(item.ProductID, -item.Quantity)
		if err != nil {
			return nil, err
		}
	}

	return order, nil
}

func (s *OrderService) GetUserOrders(userID primitive.ObjectID) ([]*Order, error) {
	cursor, err := s.collection.Find(context.Background(), bson.M{"user_id": userID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var orders []*Order
	if err := cursor.All(context.Background(), &orders); err != nil {
		return nil, err
	}

	return orders, nil
}

func (s *OrderService) GetOrder(id primitive.ObjectID) (*Order, error) {
	var order Order
	err := s.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&order)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("order not found")
		}
		return nil, err
	}
	return &order, nil
}

func (s *OrderService) UpdateOrderStatus(id primitive.ObjectID, status string) (*Order, error) {
	update := bson.M{
		"$set": bson.M{
			"status":     status,
			"updated_at": time.Now(),
		},
	}

	result := s.collection.FindOneAndUpdate(
		context.Background(),
		bson.M{"_id": id},
		update,
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	)

	var order Order
	if err := result.Decode(&order); err != nil {
		return nil, err
	}

	return &order, nil
}

func (s *OrderService) CancelOrder(id primitive.ObjectID) error {
	order, err := s.GetOrder(id)
	if err != nil {
		return err
	}

	if order.Status != "pending" {
		return errors.New("can only cancel pending orders")
	}

	// Restore product stock
	for _, item := range order.Items {
		err = s.productService.UpdateStock(item.ProductID, item.Quantity)
		if err != nil {
			return err
		}
	}

	update := bson.M{
		"$set": bson.M{
			"status":     "cancelled",
			"updated_at": time.Now(),
		},
	}

	result, err := s.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	if err != nil {
		return err
	}

	if result.ModifiedCount == 0 {
		return errors.New("order not found")
	}

	return nil
}

func (s *OrderService) GetAllOrders() ([]models.Order, error) {
	cursor, err := s.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var orders []models.Order
	if err = cursor.All(context.Background(), &orders); err != nil {
		return nil, err
	}

	return orders, nil
}
