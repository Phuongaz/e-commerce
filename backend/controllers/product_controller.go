package controllers

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"

	"ecommerce-api/models"
	"ecommerce-api/services"

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

// //       const response = await axios.post(
//
//		`${backendUrl}/api/admin/products`,
//		{
//		  product: {
//			name,
//			description,
//			price,
//			category,
//			subCategory,
//			bestseller,
//			sizes,
//		  },
//		  images: images,
//		},
//		{
//		  headers: {
//			"Content-Type": "multipart/form-data",
//		  },
//		  withCredentials: true,
//		}
//	  );
func (c *ProductController) CreateProduct(ctx *gin.Context) {
	//get product from multipart/form-data
	var productInp services.CreateProductInput

	//get images from multipart/form-data
	images, err := ctx.MultipartForm()
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	//get product from form-data
	productInp.Product.Name = ctx.PostForm("name")
	productInp.Product.Description = ctx.PostForm("description")

	price := ctx.PostForm("price")
	if price == "" {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse("price is required"))
		return
	}

	productInp.Product.Price, err = strconv.ParseFloat(price, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse("invalid price format"))
		return
	}

	productInp.Product.Category = ctx.PostForm("category")
	productInp.Product.SubCategory = ctx.PostForm("subCategory")
	productInp.Product.Bestseller = ctx.PostForm("bestseller") == "true"

	// Handle sizes array properly
	var sizes []string
	form := ctx.Request.Form
	for key := range form {
		if strings.HasPrefix(key, "sizes") {
			sizes = append(sizes, ctx.PostForm(key))
		}
	}
	productInp.Product.Size = sizes

	productInp.Images = images.File["images"]

	createdProduct, err := c.productService.CreateProduct(&productInp)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusCreated, createdProduct)
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

	ctx.JSON(http.StatusOK, products)
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

	ctx.JSON(http.StatusOK, product)
}

func (c *ProductController) UpdateProduct(ctx *gin.Context) {
	id, err := primitive.ObjectIDFromHex(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var product models.Product
	if err := ctx.ShouldBindJSON(&product); err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedProduct, err := c.productService.UpdateProduct(id, &product)
	if err != nil {
		fmt.Println(err)
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, updatedProduct)
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

	ctx.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}
