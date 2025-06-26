package controllers

import (
	"ecommerce-api/models"
	"ecommerce-api/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type AdminController struct {
	adminService *services.AdminService
}

func NewAdminController(adminService *services.AdminService) *AdminController {
	return &AdminController{adminService: adminService}
}

func (c *AdminController) GetAdminStats(ctx *gin.Context) {
	stats, err := c.adminService.GetAdminStats()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, models.NewErrorResponse(err.Error()))
		return
	}
	ctx.JSON(http.StatusOK, models.NewSuccessResponse(stats, "Stats fetched successfully"))
}
