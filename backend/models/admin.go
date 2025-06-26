package models

type Stats struct {
	TotalUsers    int `json:"total_users"`
	TotalOrders   int `json:"total_orders"`
	TotalProducts int `json:"total_products"`
}
