# 🛒 Simple E-commerce Platform

A simple full-stack e-commerce platform built with modern technologies, featuring a customer shopping interface, and robust backend services.

## 🌟 Features

### 🛍️ Customer Features
- **Product Catalog**: Browse products by categories, subcategories, and price ranges
- **Advanced Search & Filtering**: Smart product search with multiple filter options
- **Shopping Cart**: Add/remove items, adjust quantities, persist cart data
- **User Authentication**: Secure registration, login, and profile management
- **Guest Shopping**: Shop without registration with cart persistence
- **Order Management**: Place orders, track order status, view order history
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Product Galleries**: Interactive image galleries with multiple views
- **Address Management**: Vietnamese address system integration
- **Payment Options**: Cash on Delivery (COD) support

### 👨‍💼 Admin Features
- **Product Management**: CRUD operations for products with image uploads
- **Order Management**: View, update, and manage all customer orders
- **Category Management**: Organize products into categories and subcategories
- **Sales Analytics**: Dashboard with sales statistics and insights
- **User Management**: View and manage customer accounts
- **Inventory Tracking**: Monitor stock levels and product availability

### 🔧 Technical Features
- **REST API**: Comprehensive backend API with proper authentication
- **Image Handling**: Professional product image upload and management
- **Cart Synchronization**: Seamless cart merging between guest and authenticated users
- **Real-time Updates**: Live cart updates and order status changes
- **Error Handling**: Robust error handling with user-friendly messages
- **Security**: JWT authentication, CORS protection, and secure API endpoints

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Lightning fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Toastify** - Beautiful notifications
- **React Select** - Enhanced select components
- **React Slick** - Carousel/slider components

### Backend
- **Go** - High-performance backend language
- **Gin** - HTTP web framework for Go
- **MongoDB** - NoSQL database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving
- **SSL/TLS** - HTTPS support configuration

## 📁 Project Structure

```
e-commerce/
├── frontend/                 # Customer-facing React application
│   ├── src/
│   │   ├── api/             # API service functions
│   │   ├── assets/          # Static assets (images, icons)
│   │   ├── components/      # Reusable React components
│   │   ├── context/         # React context providers
│   │   ├── pages/           # Page components
│   │   └── App.jsx          # Main application component
│   ├── public/              # Public static files
│   └── package.json         # Frontend dependencies
│
├── AdminPanel/              # Admin dashboard React application
│   ├── src/
│   │   ├── components/      # Admin-specific components
│   │   ├── context/         # Admin context providers
│   │   ├── pages/           # Admin page components
│   │   └── App.jsx          # Admin app component
│   └── package.json         # Admin dependencies
│
├── backend/                 # Go backend server
│   ├── cmd/                 # Command-line utilities
│   ├── config/              # Configuration files
│   ├── controllers/         # HTTP request handlers
│   ├── middleware/          # HTTP middleware
│   ├── models/              # Data models
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   ├── utils/               # Utility functions
│   ├── uploads/             # Uploaded files storage
│   ├── main.go              # Application entry point
│   └── go.mod               # Go dependencies
│
├── nginx/                   # Nginx configuration
│   ├── conf/
│   └── ssl/                 # SSL certificates
│
├── docker-compose.yml       # Multi-container setup
└── README.md               # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **Go** (v1.19 or higher)
- **MongoDB** (v5.0 or higher)
- **Docker & Docker Compose** (optional)

## 🔧 Configuration

### Environment Variables 
- Please refer to the .env.example file.....

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: MongoDB's built-in protection
- **XSS Protection**: React's built-in XSS prevention