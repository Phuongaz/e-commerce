package controllers

import (
	"ecommerce-api/models"
	"ecommerce-api/services"

	"github.com/gin-gonic/gin"
)

type CategoryController struct {
	categoryService *services.CategoryService
}

func NewCategoryController(categoryService *services.CategoryService) *CategoryController {
	return &CategoryController{
		categoryService: categoryService,
	}
}

func (c *CategoryController) CreateCategory(ctx *gin.Context) {
	var category models.Category
	if err := ctx.ShouldBindJSON(&category); err != nil {
		ctx.JSON(400, models.NewErrorResponse(err.Error()))
		return
	}

	createdCategory, err := c.categoryService.CreateCategory(&category)
	if err != nil {
		ctx.JSON(500, models.NewErrorResponse("Failed to create category"))
		return
	}

	ctx.JSON(201, models.NewSuccessResponse(createdCategory, "Category created successfully"))
}

func (c *CategoryController) ListCategories(ctx *gin.Context) {
	categories, err := c.categoryService.ListCategories()
	if err != nil {
		ctx.JSON(500, models.NewErrorResponse("Failed to fetch categories"))
		return
	}

	ctx.JSON(200, models.NewSuccessResponse(categories, "Categories fetched successfully"))
}

func (c *CategoryController) GetCategory(ctx *gin.Context) {
	id := ctx.Param("id")

	category, err := c.categoryService.GetCategory(id)
	if err != nil {
		ctx.JSON(500, models.NewErrorResponse("Failed to fetch category"))
		return
	}
	if category == nil {
		ctx.JSON(404, models.NewErrorResponse("Category not found"))
		return
	}

	ctx.JSON(200, models.NewSuccessResponse(category, "Category fetched successfully"))
}

func (c *CategoryController) UpdateCategory(ctx *gin.Context) {
	id := ctx.Param("id")

	var category models.Category
	if err := ctx.ShouldBindJSON(&category); err != nil {
		ctx.JSON(400, models.NewErrorResponse(err.Error()))
		return
	}

	updatedCategory, err := c.categoryService.UpdateCategory(id, &category)
	if err != nil {
		ctx.JSON(500, models.NewErrorResponse("Failed to update category"))
		return
	}

	ctx.JSON(200, models.NewSuccessResponse(updatedCategory, "Category updated successfully"))
}

func (c *CategoryController) DeleteCategory(ctx *gin.Context) {
	id := ctx.Param("id")

	if err := c.categoryService.DeleteCategory(id); err != nil {
		ctx.JSON(500, models.NewErrorResponse("Failed to delete category"))
		return
	}

	ctx.JSON(204, models.NewSuccessResponse(nil, "Category deleted successfully"))
}
