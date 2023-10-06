# 📚 Library Management System API

Welcome to the Library Management System API, your portal to efficient library operations. This comprehensive guide will introduce you to the intricacies of our robust API, data models, and the art of user authentication.

🚀 **Backend Deployment**: Our backend is securely deployed and accessible at [Backend Deployment](https://library-managemnet-system.onrender.com/). Take a journey into the heart of our Library Management System!

📘 **API Documentation**: Dive deeper into the API functionalities by exploring our detailed [Swagger Documentation](https://library-managemnet-system.onrender.com/api-docs/).

**Rate Limiting**: This API has rate limiting implemented to ensure fair usage and server stability. Please see the [Rate Limiting Section](#7-rate-limiting) for details on rate limits.

## Table of Contents

1. [Introduction](#1-introduction)
2. [Authentication](#2-authentication)
3. [Data Models](#3-data-models)
4. [API Endpoints](#4-api-endpoints)
   - [User](#user-model)
   - [Books](#books-model)
5. [API Documentation](#5-api-documentation)
6. [Running the Project](#6-running-the-project)

---

## 1. Introduction

Explore the capabilities of our Library Management System, where organization meets knowledge. Uncover the potential of our RESTful API, allowing users to seamlessly manage books, borrowers, and borrowing records.

## 2. Authentication

🔐 Authentication is at the core of our Library Management System. Using JSON Web Tokens (JWT), users can register, log in, and securely access our API. Explore the documented routes below to leverage our platform fully.

## 3. Data Models

### User Model

- The User model contains essential user data, including name, email, and a securely hashed password.

### Books Model

- The Books model represents the heart of the library, with details such as ISBN, title, author, published year, quantity, and genre.


## 4. API Endpoints

### User

- `POST /user/register`: 📝 Register a new user. Provide a name, email, and password in the request body.

- `POST /user/login`: 🚪 Log in a user. Submit your email and password in the request body and receive a JWT token upon successful login.

### Books

- `POST /book/create`: ➕ Add a new book to the library. Provide book details in the request body, including ISBN, title, author, published year, quantity, and genre.

- `PUT /book/update/:id`: 🔄 Update book details by id. Authentication and authorization are required. Include the ISBN in the route parameter and provide updated book details in the request body.

- `DELETE /book/delete/:id`: 🗑️ Remove a book from the library by id. Authentication and authorization are required. Include the ISBN in the route parameter.

- `GET /book/list`: 📚 Get a paginated list of books. Optional query parameters `page` and `pageSize` for pagination.

- `GET /book/search`: 🔍 Search for books by title, author, or ISBN. Provide a search query using the `query` query parameter.

### Borrowing

- `POST /book/borrow/:bookId`: 📖 Borrow a book. Provide the book ID in the route parameter and user ID in the request body. Authentication and authorization are required.

- `PATCH /book/return/:bookId`: 📚 Return a borrowed book. Provide the book ID in the route parameter and user ID in the request body. Authentication and authorization are required.

## 5. API Documentation

For a comprehensive API experience, consult our detailed [Swagger Documentation](https://library-managemnet-system.onrender.com/api-docs/).

## 6. Running the Project

Ready to streamline your library operations? Follow these steps:

1. Clone the repository to your local machine.

2. Install the required dependencies using `npm install`.

3. Configure your database connection (MongoDB) in the project.

4. Start the server with `npm start`.

5. Explore the API endpoints and ensure proper authentication where required.

## 7. Rate Limiting

To maintain server stability and prevent abuse of the API, rate limiting has been implemented for various API endpoints. Rate limiting restricts the number of requests that can be made to certain endpoints within a specified time frame. This helps ensure fair usage of the API resources and prevents excessive requests from a single source.

### User Registration and Login

- **Endpoints**: `/api/users/register`, `/api/users/login`
- **Rate Limit**: Max 5 requests per IP address per hour
- **Message**: If you exceed the rate limit for user registration or login attempts, you will receive a response with the message "Too many registration/login attempts from this IP. Please try again later."

### Book Listing

- **Endpoint**: `/api/books/list`
- **Rate Limit**: Max 100 requests per IP address per hour
- **Message**: If you exceed the rate limit for book listing requests, you will receive a response with the message "Rate limit exceeded for book listing. Please wait and try again later."


Please adhere to the rate limits to ensure a smooth experience for all users. If you encounter rate-limiting responses, wait for the specified time frame before making additional requests.

---

Sample of Swagger Documentation
![Screenshot (213)](https://github.com/Smoke221/Library-Management-System/assets/114225283/0b0001df-2bef-4dff-987b-648193b365bc)


This README serves as your gateway to efficient library management. Dive into the API documentation and make the most of our Library Management System.
