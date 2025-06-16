package routes

import (
	"ecommerce-api/controllers"
	"ecommerce-api/middleware"
	"ecommerce-api/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func SetupRoutes(r *gin.Engine, db *mongo.Database) {
	// Initialize services
	userService := services.NewUserService(db)
	productService := services.NewProductService(db)
	orderService := services.NewOrderService(db, productService)
	categoryService := services.NewCategoryService(db)

	// Initialize controllers
	userController := controllers.NewUserController(userService)
	productController := controllers.NewProductController(productService)
	orderController := controllers.NewOrderController(orderService)
	categoryController := controllers.NewCategoryController(categoryService)

	// Generate admin account
	err := userService.GenerateAdminAccount()
	if err != nil {
		panic("Failed to generate admin account: " + err.Error())
	}

	// Middleware
	r.Use(middleware.CORS())
	r.Use(middleware.Logger())

	// Public routes
	public := r.Group("/api")
	{
		// User routes
		auth := public.Group("/auth")
		{
			auth.POST("/register", userController.Register)
			auth.POST("/login", userController.Login)
			//auth.POST("/forgot-password", userController.ForgotPassword)
		}

		public.GET("/products", productController.ListProducts)
		public.GET("/products/:id", productController.GetProduct)
		public.GET("/categories", categoryController.ListCategories)
		public.GET("/categories/:id", categoryController.GetCategory)
	}

	protected := r.Group("/api")
	protected.Use(middleware.Auth())
	{
		protected.GET("/profile", userController.GetProfile)
		protected.PUT("/profile", userController.UpdateProfile)

		protected.POST("/orders", orderController.CreateOrder)
		protected.GET("/orders", orderController.GetUserOrders)
		protected.GET("/orders/:id", orderController.GetOrder)
		protected.PUT("/orders/:id/status", orderController.UpdateOrderStatus)
		protected.POST("/orders/:id/cancel", orderController.CancelOrder)
	}

	// Admin routes
	admin := r.Group("/api/admin")
	admin.Use(middleware.AdminAuth())
	{
		// Product management
		admin.POST("/products", productController.CreateProduct)
		admin.PUT("/products/:id", productController.UpdateProduct)
		admin.DELETE("/products/:id", productController.DeleteProduct)

		// Order management
		admin.PUT("/orders/:id/status", orderController.UpdateOrderStatus)
		admin.GET("/orders", orderController.GetAllOrders)

		// Category management
		admin.POST("/categories", categoryController.CreateCategory)
		admin.PUT("/categories/:id", categoryController.UpdateCategory)
		admin.DELETE("/categories/:id", categoryController.DeleteCategory)
		admin.GET("/categories", categoryController.ListCategories)
	}

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})
}
