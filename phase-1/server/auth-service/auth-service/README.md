# JWT Authentication Service

A Spring Boot application providing JWT-based user authentication with role-based access control.

## Features

* JWT Token Generation and Validation
* BCrypt Password Encryption
* Role-Based Access Control (STUDENT, STAFF, ADMIN)
* H2 Embedded Database
* RESTful API

## Quick Start

1. Build:
   ```
   mvn clean install
   ```

2. Run:
   ```
   mvn spring-boot:run
   ```

3. Access:
   - API: http://localhost:8080/api/auth
   - H2 Console: http://localhost:8080/h2-console

## Pre-loaded Test Users

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| staff | staff123 | STAFF |
| student | student123 | STUDENT |

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login and get JWT token
- GET /api/auth/me - Get current user details
- GET /api/auth/validate - Validate JWT token

### User Management (Admin Only)
- GET /api/auth/users - Get all users
- PUT /api/auth/deactivate/{id} - Deactivate user
- PUT /api/auth/reactivate/{id} - Reactivate user

## Technology Stack

- Java 11
- Spring Boot 2.7.14
- Spring Data JPA
- H2 Database
- JWT (JJWT 0.11.5)
- BCrypt
- Maven

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api/auth
```

### Endpoints

#### 1. User Signup
**POST** `/signup`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT",
  "department": "Computer Science"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "userId": 4,
  "username": "johndoe",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT",
  "department": "Computer Science",
  "message": "Account created successfully"
}
```

#### 2. User Login
**POST** `/login`

Authenticate user and get JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "username": "admin",
  "fullName": "Administrator",
  "email": "admin@school.com",
  "role": "ADMIN",
  "department": "Administration",
  "message": "Login successful"
}
```

#### 3. Validate Token
**GET** `/validate`

Validate JWT token and get user role.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "username": "admin",
  "role": "ADMIN",
  "userId": 1,
  "message": "Token is valid"
}
```

#### 4. Get Current User
**GET** `/me`

Get authenticated user's details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "userId": 1,
  "username": "admin",
  "fullName": "Administrator",
  "email": "admin@school.com",
  "role": "ADMIN",
  "roleDescription": "Admin - Full system access",
  "department": "Administration",
  "active": true,
  "createdAt": "2024-01-15T10:30:00"
}
```

#### 5. Check if Admin
**GET** `/is-admin`

Check if authenticated user is an admin.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "isAdmin": true
}
```

#### 6. Check if Staff or Admin
**GET** `/is-staff-or-admin`

Check if authenticated user is staff or admin.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "isStaffOrAdmin": true
}
```

#### 7. Change Password
**POST** `/change-password`

Change user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "admin123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

#### 8. Get All Users (Admin Only)
**GET** `/users`

Get list of all users.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
[
  {
    "userId": 1,
    "username": "admin",
    "fullName": "Administrator",
    "email": "admin@school.com",
    "role": "ADMIN",
    "department": "Administration",
    "active": true
  },
  {
    "userId": 2,
    "username": "staff",
    "fullName": "Staff Member",
    "email": "staff@school.com",
    "role": "STAFF",
    "department": "Equipment Management",
    "active": true
  }
]
```

#### 9. Deactivate User (Admin Only)
**PUT** `/deactivate/{userId}`

Deactivate a user account.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "message": "User deactivated successfully"
}
```

#### 10. Reactivate User (Admin Only)
**PUT** `/reactivate/{userId}`

Reactivate a user account.

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "message": "User reactivated successfully"
}
```

## 🧪 Testing the API

### Using cURL

#### 1. Signup a New User
```bash
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "test123",
    "fullName": "Test User",
    "email": "test@example.com",
    "role": "STUDENT",
    "department": "Engineering"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Save the token from the response.

#### 3. Get Current User
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 4. Validate Token
```bash
curl -X GET http://localhost:8080/api/auth/validate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
