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

type ProductService struct {
	collection *mongo.Collection
}

func NewProductService(db *mongo.Database) *ProductService {
	return &ProductService{
		collection: db.Collection("products"),
	}
}

func (s *ProductService) CreateProduct(product *models.Product) (*models.Product, error) {
	// Set timestamps
	product.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	product.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())

	result, err := s.collection.InsertOne(context.Background(), product)
	if err != nil {
		return nil, err
	}

	product.ID = result.InsertedID.(primitive.ObjectID)
	return product, nil
}

func (s *ProductService) ListProducts() ([]*models.Product, error) {
	cursor, err := s.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var products []*models.Product
	if err := cursor.All(context.Background(), &products); err != nil {
		return nil, err
	}

	return products, nil
}

func (s *ProductService) GetProduct(id primitive.ObjectID) (*models.Product, error) {
	var product models.Product
	err := s.collection.FindOne(context.Background(), bson.M{"_id": id}).Decode(&product)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("product not found")
		}
		return nil, err
	}
	return &product, nil
}

func (s *ProductService) UpdateProduct(id primitive.ObjectID, product *models.Product) (*models.Product, error) {
	update := bson.M{
		"$set": bson.M{
			"name":         product.Name,
			"description":  product.Description,
			"price":        product.Price,
			"stock":        product.Stock,
			"size":         product.Size,
			"category":     product.Category,
			"sub_category": product.SubCategory,
			"bestseller":   product.Bestseller,
			"images":       product.Images,
			"updated_at":   primitive.NewDateTimeFromTime(time.Now()),
		},
	}

	result := s.collection.FindOneAndUpdate(
		context.Background(),
		bson.M{"_id": id},
		update,
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	)

	var updatedProduct models.Product
	if err := result.Decode(&updatedProduct); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, errors.New("product not found")
		}
		return nil, err
	}

	return &updatedProduct, nil
}

func (s *ProductService) DeleteProduct(id primitive.ObjectID) error {
	result, err := s.collection.DeleteOne(context.Background(), bson.M{"_id": id})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return errors.New("product not found")
	}

	return nil
}

func (s *ProductService) UpdateStock(id primitive.ObjectID, quantity int) error {
	update := bson.M{
		"$inc": bson.M{
			"stock": quantity,
		},
		"$set": bson.M{
			"updated_at": time.Now(),
		},
	}

	result, err := s.collection.UpdateOne(context.Background(), bson.M{"_id": id}, update)
	if err != nil {
		return err
	}

	if result.ModifiedCount == 0 {
		return errors.New("product not found")
	}

	return nil
}
