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
