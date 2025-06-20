package middleware

import (
	"ecommerce-api/models"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	UserID string `json:"user_id"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Cookie("access_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, models.NewErrorResponse("Unauthorized"))
			c.Abort()
			return
		}
		token, err := jwt.Parse(cookie, func(token *jwt.Token) (any, error) {
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, models.NewErrorResponse("Invalid token"))
			c.Abort()
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.JSON(http.StatusUnauthorized, models.NewErrorResponse("Invalid token claims"))
			c.Abort()
			return
		}
		userID, ok := claims["user_id"].(string)
		if !ok {
			c.JSON(http.StatusUnauthorized, models.NewErrorResponse("Invalid user ID in token"))
			c.Abort()
			return
		}

		c.Set("userID", userID)
		c.Next()

		// authHeader := c.GetHeader("Authorization")
		// if authHeader == "" {
		// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
		// 	c.Abort()
		// 	return
		// }

		// parts := strings.Split(authHeader, " ")
		// if len(parts) != 2 || parts[0] != "Bearer" {
		// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization header format"})
		// 	c.Abort()
		// 	return
		// }

		// tokenString := parts[1]
		// token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		// 	// TODO: Get secret from config

		// 	return []byte(os.Getenv("JWT_SECRET")), nil
		// })

		// if err != nil || !token.Valid {
		// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		// 	c.Abort()
		// 	return
		// }

		// claims, ok := token.Claims.(jwt.MapClaims)
		// if !ok {
		// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		// 	c.Abort()
		// 	return
		// }

		// userID, ok := claims["user_id"].(string)
		// if !ok {
		// 	c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID in token"})
		// 	c.Abort()
		// 	return
		// }

		// c.Set("userID", userID)
		// c.Next()
	}
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get origin from request header
		origin := c.Request.Header.Get("Origin")

		// Allow specific origins
		allowedOrigins := []string{
			"http://localhost:3000",  // Frontend
			"http://localhost:3001",  // Admin Panel
			"https://localhost:3000", // Frontend (HTTPS)
			"https://localhost:3001",
			"http://localhost",
			"https://localhost",
		}

		isAllowed := false
		for _, allowed := range allowedOrigins {
			if origin == allowed {
				isAllowed = true
				break
			}
		}

		if isAllowed {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
			c.Writer.Header().Set("Access-Control-Expose-Headers", "Content-Length")
			c.Writer.Header().Set("Access-Control-Max-Age", "86400") // 24 hours
		}

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Next()
	}
}
