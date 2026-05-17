# Furniture Store Management System

## Project Overview

The Furniture Store Management System is a full-stack web application developed using Django and React.

It is designed to provide an online platform where customers can browse furniture products, add them to cart, place orders, and manage purchases.

The system also includes role-based access for:

- Admin
- Manager
- Customer

This project simplifies furniture store operations by digitizing inventory management, product management, and customer ordering.

---

# Why This Project Was Developed

Traditional furniture stores often face problems like:

- Manual inventory management
- Order tracking difficulties
- Product availability issues
- Limited customer interaction

This project solves these problems by providing an efficient digital platform.

---

# Features Implemented

## Authentication System

- User Registration
- User Login
- JWT Authentication
- Role-based Access Control

---

## Admin Features

- Add Products
- Update Products
- Delete Products
- Activate / Deactivate Products
- Manage Inventory
- Manage Users

---

## Manager Features

- View Product List
- Manage Product Availability
- Monitor Stock

---

## Customer Features

- Browse Products
- View Product Details
- Add to Cart
- Update Quantity
- Remove Products from Cart
- Checkout
- Place Orders
- View Orders

---

## Product Management

Each product contains:

- Product Name
- Description
- Price
- Length
- Width
- Height
- Category
- Quantity
- Product Image

---

## Cart System

- Add Products
- Quantity Validation
- Total Price Calculation
- Checkout Support

---

# Technologies Used

## Frontend

- React.js
- JavaScript
- HTML
- Material UI
- React Router DOM
- Axios

---

## Backend

- Django
- Django REST Framework
- Python

---

## Database

- MySQL

---

## Authentication

- JWT Token Authentication

---

# Project Architecture

Frontend (React)

↓

REST API

↓

Backend (Django)

↓

MySQL Database

---

# Project Structure

```
FurnitureStore/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── furniture/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│
└── README.md
```

---

# Installation Guide

## Clone the Repository

```bash
git clone <repository-url>
cd FurnitureStore
```

---

## Backend Setup

```bash
cd backend

python -m venv env

env\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

Backend runs on:

http://127.0.0.1:8000/

---

## Frontend Setup

Open another terminal

```bash
cd frontend

npm install

npm start
```

Frontend runs on:

http://localhost:3000/

---

# Default Admin Login

Email:

admin@system.com

Password:

admin123

---

# How to Use

## Customer

1. Register/Login
2. Browse Products
3. Add to Cart
4. Checkout
5. View Orders

---

## Admin

1. Login
2. Add Products
3. Manage Inventory
4. Activate/Deactivate Products

---

## Manager

1. Login
2. View Product Stock
3. Manage Product Status

---

# Objectives

The main objectives are:

- Build a scalable e-commerce system
- Implement secure authentication
- Manage inventory efficiently
- Provide seamless shopping experience

---

# Future Enhancements

- Online Payment Gateway
- Product Reviews
- Order Tracking
- AI Product Recommendations

---

# Developed Using

Django + React + MySQL

---

# Author

Prithvi Roshan


University Project


# GitHub Repository 
Link:https://github.com/c5047112/Bespoke_Furniture_Project