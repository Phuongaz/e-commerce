package models

type Cart struct {
	UserID string     `json:"user_id" bson:"user_id"`
	Items  []CartItem `json:"items" bson:"items"`
}

type CartItem struct {
	ProductID string `json:"product_id" bson:"product_id"`
	Quantity  int    `json:"quantity" bson:"quantity"`
	Size      string `json:"size" bson:"size"`
}

type CartResponse struct {
	Items []CartItem `json:"items" bson:"items"`
}

type DeleteCartItemRequest struct {
	ProductID string `json:"product_id" binding:"required"`
	Size      string `json:"size" binding:"required"`
}
