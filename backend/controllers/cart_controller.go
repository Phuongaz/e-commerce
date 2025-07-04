package controllers

import (
	"ecommerce-api/models"
	"ecommerce-api/services"
	"ecommerce-api/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type CartController struct {
	cartService *services.CartService
}

func NewCartController(cartService *services.CartService) *CartController {
	return &CartController{
		cartService: cartService,
	}
}

func (c *CartController) GetCart(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	cart, err := c.cartService.GetCart(userID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(models.CartResponse{Items: cart.Items}, utils.MessageCartFecthSuccess))
}

func (c *CartController) AddToCart(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	var cartItem models.CartItem
	if err := ctx.ShouldBindJSON(&cartItem); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	err := c.cartService.AddToCart(userID, cartItem.ProductID, cartItem.Quantity, cartItem.Size)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(nil, utils.MessageCartItemAddSuccess))
}

func (c *CartController) UpdateCart(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	var cartItem []models.CartItem
	if err := ctx.ShouldBindJSON(&cartItem); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	err := c.cartService.UpdateCart(userID, cartItem)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(nil, utils.MessageCartUpdated))
}

func (c *CartController) DeleteCartItem(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	var cartItem models.DeleteCartItemRequest
	if err := ctx.ShouldBindJSON(&cartItem); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	err := c.cartService.DeleteCartItem(userID, cartItem.ProductID, cartItem.Size)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(nil, utils.MessageCartItemDeleteSuccess))
}

func (c *CartController) MergeCart(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	var cartItem []models.CartItem
	if err := ctx.ShouldBindJSON(&cartItem); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	err := c.cartService.MergeCart(userID, cartItem)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(nil, utils.MessageCartMergeSuccess))
}
