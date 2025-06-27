package controllers

import (
	"fmt"
	"net/http"

	"ecommerce-api/models"
	"ecommerce-api/services"
	"ecommerce-api/utils"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProductController struct {
	productService *services.ProductService
}

func NewProductController(productService *services.ProductService) *ProductController {
	return &ProductController{
		productService: productService,
	}
}

// UploadImages handles uploading multiple images and returns their IDs
func (c *ProductController) UploadImages(ctx *gin.Context) {
	form, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse("Failed to parse form data"))
		return
	}

	files := form.File["images"]
	if len(files) == 0 {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse("No images provided"))
		return
	}

	imageIDs, err := utils.UploadImages(files)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(map[string][]string{
		"image_ids": imageIDs,
	}, "Images uploaded successfully"))
}

func (c *ProductController) CreateProduct(ctx *gin.Context) {
	var product models.Product

	if err := ctx.ShouldBindJSON(&product); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	// Validate that image IDs exist
	for _, imageID := range product.Images {
		if _, err := utils.GetImage(imageID); err != nil {
			ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(fmt.Sprintf("Image with ID %s not found", imageID)))
			return
		}
	}

	createdProduct, err := c.productService.CreateProduct(&product)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusCreated, models.NewSuccessResponse(createdProduct, "Product created successfully"))
}

func (c *ProductController) ListProducts(ctx *gin.Context) {
	products, err := c.productService.ListProducts()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if len(products) == 0 {
		products = []*models.Product{}
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(products, "Products fetched successfully"))
}

func (c *ProductController) GetProduct(ctx *gin.Context) {
	id, err := primitive.ObjectIDFromHex(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	product, err := c.productService.GetProduct(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(product, "Product fetched successfully"))
}

func (c *ProductController) UpdateProduct(ctx *gin.Context) {
	id, err := primitive.ObjectIDFromHex(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse("Invalid product ID"))
		return
	}

	var product models.Product
	if err := ctx.ShouldBindJSON(&product); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	// Validate that image IDs exist
	for _, imageID := range product.Images {
		if _, err := utils.GetImage(imageID); err != nil {
			ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(fmt.Sprintf("Image with ID %s not found", imageID)))
			return
		}
	}

	updatedProduct, err := c.productService.UpdateProduct(id, &product)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(updatedProduct, "Product updated successfully"))
}

func (c *ProductController) DeleteProduct(ctx *gin.Context) {
	id, err := primitive.ObjectIDFromHex(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	if err := c.productService.DeleteProduct(id); err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(nil, "Product deleted successfully"))
}

func (c *ProductController) GetProductImage(ctx *gin.Context) {
	id := ctx.Param("id")
	image, err := utils.GetImage(id)

	if err != nil {
		ctx.JSON(http.StatusNotFound, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.File(image)
}
