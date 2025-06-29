package controllers

import (
	"net/http"

	"ecommerce-api/models"
	"ecommerce-api/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type OrderController struct {
	orderService *services.OrderService
}

func NewOrderController(orderService *services.OrderService) *OrderController {
	return &OrderController{
		orderService: orderService,
	}
}

func (c *OrderController) CreateOrder(ctx *gin.Context) {
	userIDStr := ctx.GetString("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, models.NewErrorResponse("Invalid user ID"))
		return
	}

	var input struct {
		Items []services.OrderItem `json:"items" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	order, err := c.orderService.CreateOrder(userID, input.Items)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusCreated, order)
}

func (c *OrderController) GetUserOrders(ctx *gin.Context) {
	userIDStr := ctx.GetString("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, models.NewErrorResponse("Invalid user ID"))
		return
	}

	orders, err := c.orderService.GetUserOrders(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, orders)
}

func (c *OrderController) GetOrder(ctx *gin.Context) {
	userIDStr := ctx.GetString("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, models.NewErrorResponse("Invalid user ID"))
		return
	}

	orderID, err := primitive.ObjectIDFromHex(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse("Invalid order ID"))
		return
	}

	order, err := c.orderService.GetOrder(orderID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	// Check if the order belongs to the user
	if order.UserID != userID {
		ctx.JSON(http.StatusForbidden, models.NewErrorResponse("Access denied"))
		return
	}

	ctx.JSON(http.StatusOK, order)
}

func (c *OrderController) UpdateOrderStatus(ctx *gin.Context) {
	orderID, err := primitive.ObjectIDFromHex(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse("Invalid order ID"))
		return
	}

	var input struct {
		Status string `json:"status" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	order, err := c.orderService.UpdateOrderStatus(orderID, input.Status)
	if err != nil {
		ctx.JSON(http.StatusNotFound, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, order)
}

func (c *OrderController) CancelOrder(ctx *gin.Context) {
	orderID, err := primitive.ObjectIDFromHex(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse("Invalid order ID"))
		return
	}

	if err := c.orderService.CancelOrder(orderID); err != nil {
		ctx.JSON(http.StatusNotFound, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(nil, "Order cancelled successfully"))
}

func (c *OrderController) GetAllOrders(ctx *gin.Context) {
	//fillter by status
	filter := bson.M{}
	if status := ctx.Query("status"); status != "" {
		filter["status"] = status
	}

	//filter by date: startDate and endDate
	if startDate := ctx.Query("startDate"); startDate != "" {
		filter["created_at"] = bson.M{"$gte": startDate}
	}
	if endDate := ctx.Query("endDate"); endDate != "" {
		filter["created_at"] = bson.M{"$lte": endDate}
	}

	orders, err := c.orderService.GetAllOrders(filter)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(orders, "All orders retrieved successfully"))
}
