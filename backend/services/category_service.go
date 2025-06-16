package services

import (
	"context"
	"ecommerce-api/models"
	"ecommerce-api/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type CategoryService struct {
	collection *mongo.Collection
}

func NewCategoryService(db *mongo.Database) *CategoryService {
	return &CategoryService{
		collection: db.Collection("categories"),
	}
}

func (s *CategoryService) CreateCategory(category *models.Category) (*models.Category, error) {
	category.ID = utils.RemoveDiacritics(category.Name)
	_, err := s.collection.InsertOne(context.Background(), category)
	if err != nil {
		return nil, err
	}

	return category, nil
}

func (s *CategoryService) ListCategories() ([]*models.Category, error) {
	cursor, err := s.collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var categories []*models.Category
	if err := cursor.All(context.Background(), &categories); err != nil {
		return nil, err
	}

	return categories, nil
}

func (s *CategoryService) GetCategory(id string) (*models.Category, error) {
	filter := bson.M{"_id": id}
	var category models.Category
	err := s.collection.FindOne(context.Background(), filter).Decode(&category)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // Category not found
		}
		return nil, err
	}

	return &category, nil
}

func (s *CategoryService) UpdateCategory(id string, category *models.Category) (*models.Category, error) {
	filter := bson.M{"_id": id}
	update := bson.M{
		"$set": category,
	}

	_, err := s.collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return nil, err
	}

	category.ID = id
	return category, nil
}

func (s *CategoryService) DeleteCategory(id string) error {
	filter := bson.M{"_id": id}
	_, err := s.collection.DeleteOne(context.Background(), filter)
	if err != nil {
		return err
	}

	return nil
}
func (s *CategoryService) AddProductToCategory(categoryID string, productID primitive.ObjectID) error {
	filter := bson.M{"_id": categoryID}
	update := bson.M{
		"$addToSet": bson.M{"products": productID},
	}

	_, err := s.collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	return nil
}
func (s *CategoryService) RemoveProductFromCategory(categoryID string, productID primitive.ObjectID) error {
	filter := bson.M{"_id": categoryID}
	update := bson.M{
		"$pull": bson.M{"products": productID},
	}

	_, err := s.collection.UpdateOne(context.Background(), filter, update)
	if err != nil {
		return err
	}

	return nil
}

func (s *CategoryService) GetProductsByCategoryID(categoryID primitive.ObjectID) ([]*models.Product, error) {
	filter := bson.M{"_id": categoryID}
	var category models.Category
	err := s.collection.FindOne(context.Background(), filter).Decode(&category)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // Category not found
		}
		return nil, err
	}

	products := make([]*models.Product, len(category.Products))
	for i := range category.Products {
		products[i] = &category.Products[i]
	}
	return products, nil
}

func (s *CategoryService) GetCategoryByName(name string) (*models.Category, error) {
	filter := bson.M{"name": name}
	var category models.Category
	err := s.collection.FindOne(context.Background(), filter).Decode(&category)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // Category not found
		}
		return nil, err
	}

	return &category, nil
}

func (s *CategoryService) GetCategoryByID(id primitive.ObjectID) (*models.Category, error) {
	filter := bson.M{"_id": id}
	var category models.Category
	err := s.collection.FindOne(context.Background(), filter).Decode(&category)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // Category not found
		}
		return nil, err
	}

	return &category, nil
}
