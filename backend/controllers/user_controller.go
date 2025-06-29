package controllers

import (
	"net/http"
	"os"

	"ecommerce-api/models"
	"ecommerce-api/services"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserController struct {
	userService *services.UserService
}

func NewUserController(userService *services.UserService) *UserController {
	return &UserController{
		userService: userService,
	}
}

func (c *UserController) Register(ctx *gin.Context) {
	var input struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	existingUser, err := c.userService.GetUserByEmail(input.Email)
	if err == nil && existingUser != nil {
		ctx.JSON(http.StatusConflict, models.NewErrorResponse("User already exists"))
		return
	}

	user, err := c.userService.CreateUser(input.Name, input.Email, input.Password)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}
	token, err := c.userService.Login(input.Email, input.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}
	setCookie(ctx, token)
	ctx.JSON(http.StatusCreated, models.NewSuccessResponse(user, "User created successfully"))
}

func (c *UserController) Login(ctx *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	token, err := c.userService.Login(input.Email, input.Password)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, models.NewErrorResponse(err.Error()))
		return
	}

	setCookie(ctx, token)
	ctx.JSON(http.StatusOK, models.NewSuccessResponse(nil, "Login successful"))
}

// func (c *UserController) ForgotPassword(ctx *gin.Context) {
// 	var input struct {
// 		Email string `json:"email" binding:"required,email"`
// 	}

// 	if err := ctx.ShouldBindJSON(&input); err != nil {
// 		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	err := c.userService.SendPasswordResetEmail(input.Email)
// 	if err != nil {
// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send password reset email"})
// 		return
// 	}

// 	ctx.JSON(http.StatusOK, gin.H{"message": "Password reset email sent"})
// }

func (c *UserController) GetProfile(ctx *gin.Context) {
	userIDStr := ctx.GetString("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, models.NewErrorResponse("Invalid user ID"))
		return
	}

	user, err := c.userService.GetUserByID(userID)
	if err != nil {
		ctx.JSON(http.StatusNotFound, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, models.NewSuccessResponse(user, "Profile fetched successfully"))
}

func (c *UserController) UpdateProfile(ctx *gin.Context) {
	userIDStr := ctx.GetString("userID")
	userID, err := primitive.ObjectIDFromHex(userIDStr)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, models.NewErrorResponse("Invalid user ID"))
		return
	}

	var input struct {
		Name string `json:"name" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, models.NewErrorResponse(err.Error()))
		return
	}

	user, err := c.userService.UpdateUser(userID, input.Name)
	if err != nil {
		ctx.JSON(http.StatusNotFound, models.NewErrorResponse(err.Error()))
		return
	}

	ctx.JSON(http.StatusOK, user)
}

func (c *UserController) Logout(ctx *gin.Context) {
	ctx.SetCookie("access_token", "", -1, "/", "localhost", false, false)
	ctx.JSON(http.StatusOK, models.NewSuccessResponse(nil, "Logout successful"))
}

func setCookie(ctx *gin.Context, token string) {
	secure, httpOnly := false, false
	isDevelopment := os.Getenv("ENV") == "development"
	if !isDevelopment {
		secure, httpOnly = true, true
	}

	ctx.SetCookie("access_token", token, 3600, "/", "", secure, httpOnly)
}
