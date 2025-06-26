package middleware

import (
	"ecommerce-api/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AdminAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, ok := c.Get("role")
		if !ok || role != "admin" {
			c.JSON(http.StatusForbidden, models.NewErrorResponse("Access denied"))
			c.Abort()
			return
		}
		c.Next()
	}
}
