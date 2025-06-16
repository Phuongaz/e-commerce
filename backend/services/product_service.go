package services

import (
	"context"
	"ecommerce-api/models"
	"ecommerce-api/utils"
	"errors"
	"mime/multipart"
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

type CreateProductInput struct {
	Product models.Product          `json:"product" binding:"required"`
	Images  []*multipart.FileHeader `form:"images" binding:"required"` //non-required
}

func (s *ProductService) CreateProduct(productInp *CreateProductInput) (*models.Product, error) {
	//upload images

	paths, err := utils.UploadImages(productInp.Images)
	if err != nil {
		return nil, err
	}
	productInp.Product.Images = paths

	result, err := s.collection.InsertOne(context.Background(), productInp.Product)
	if err != nil {
		return nil, err
	}

	productInp.Product.ID = result.InsertedID.(primitive.ObjectID)
	return &productInp.Product, nil
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
			"name":        product.Name,
			"description": product.Description,
			"price":       product.Price,
			"stock":       product.Stock,
			"images":      product.Images,
			"updated_at":  time.Now(),
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
