# 🛍️ CartEngine - MERN E-Commerce Platform

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2016.0.0-brightgreen.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

A full-featured e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that provides a seamless shopping experience with features like product browsing, cart management, order processing, and user authentication.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## Overview

A full-featured e-commerce platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js). This application provides a seamless shopping experience with features like user authentication, product management, shopping cart functionality, and secure payment processing.

## Features

- 🔐 User authentication and authorization
- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart management
- 💳 Secure payment processing with PayPal integration
- 📦 Order tracking and management
- ⭐ Product reviews and ratings
- 👤 User profile management
- 📱 Responsive design for all devices
- 🔄 Real-time updates
- 🎨 Modern UI with Tailwind CSS

## Screenshots

## Technology Stack

### Frontend
- **React.js** - Frontend library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication

### Additional Tools

- Cloudinary for image management
- PayPal for payment processing
- ESLint for code quality

## Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/iakshayrathee/CartEngine-MERN.git
```

2. Install dependencies for both frontend and backend

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Start the development servers

```bash
# Start backend server (from server directory)
npm run dev

# Start frontend development server (from client directory)
npm run dev
```

### Environment Variables

#### Backend (.env)

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
```

## Project Structure

```
mern-ecommerce/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   └── assets/       # Static assets
│   └── public/           # Public assets
│
└── server/               # Backend Node.js application
    ├── controllers/      # Route controllers
    ├── models/          # Mongoose models
    ├── routes/          # API routes
    └── helpers/         # Utility functions
```

## API Documentation

### Authentication

#### Register User
- **Endpoint:** `POST /api/auth/register`
- **Description:** Register a new user
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:**
  ```json
  {
    "token": "jwt.token.here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
  ```

#### Login User
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and get JWT token
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response:** Same as register response

### Products

#### Get All Products
- **Endpoint:** `GET /api/products`
- **Description:** Retrieve all products with pagination and filtering
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `category` - Filter by category
  - `sort` - Sort by field (price, -price, name, -name)
- **Response:**
  ```json
  {
    "products": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "price": 99.99,
        "description": "Product description",
        "images": ["image_url1", "image_url2"],
        "category": "Electronics",
        "stock": 50,
        "rating": 4.5
      }
    ],
    "totalPages": 5,
    "currentPage": 1
  }
  ```

### Cart

#### Add to Cart
- **Endpoint:** `POST /api/cart`
- **Authentication:** Required (JWT token)
- **Description:** Add a product to the user's cart
- **Request Body:**
  ```json
  {
    "productId": "product_id",
    "quantity": 1
  }
  ```
- **Response:**
  ```json
  {
    "message": "Product added to cart",
    "cart": {
      "items": [
        {
          "product": "product_id",
          "quantity": 1,
          "price": 99.99
        }
      ],
      "total": 99.99
    }
  }
  ```

### Orders

#### Create Order
- **Endpoint:** `POST /api/orders`
- **Authentication:** Required (JWT token)
- **Description:** Create a new order from cart items
- **Request Body:**
  ```json
  {
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "paypal"
  }
  ```
- **Response:**
  ```json
  {
    "_id": "order_id",
    "user": "user_id",
    "orderItems": [
      {
        "product": "product_id",
        "name": "Product Name",
        "quantity": 1,
        "price": 99.99
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "New York",
      "postalCode": "10001",
      "country": "USA"
    },
    "paymentMethod": "paypal",
    "paymentResult": {
      "id": "paypal_payment_id",
      "status": "COMPLETED",
      "update_time": "2025-07-28T12:00:00Z"
    },
    "itemsPrice": 99.99,
    "taxPrice": 8.00,
    "shippingPrice": 10.00,
    "totalPrice": 117.99,
    "isPaid": true,
    "isDelivered": false,
    "createdAt": "2025-07-28T12:00:00Z"
  }
  ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgements

- [React.js](https://reactjs.org/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PayPal API](https://developer.paypal.com/)
- [Cloudinary](https://cloudinary.com/)

---

⭐️ If you found this project helpful, please give it a star!
