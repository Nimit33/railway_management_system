# Railway Management System

A Railway Management System like IRCTC built with Node.js, Express, and MySQL, featuring real-time seat availability and secure booking system.

## Problem Statement
Build a railway management system where users can:
- Check train availability between 2 stations
- Book seats with real-time availability updates
- Handle race conditions for simultaneous bookings
- Implement role-based access (Admin/User)

## Features Implemented

### User Management
- User registration and authentication
- JWT-based authorization
- Role-based access control (Admin/User)

### Train Management
- Admin-protected train operations
- Real-time seat availability tracking
- Race condition handling using database transactions
- Secure booking system

## Tech Stack
- Node.js & Express.js
- MySQL with Sequelize ORM
- JWT for authentication
- Express Rate Limit for API protection

## API Documentation

### 1. User Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "Test9",
    "email": "test9@example.com",
    "password": "password9"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "test9@example.com",
    "password": "password9"
}
```

### 2. Train Management (Admin Only)

#### Add New Train
```http
POST /api/trains
Content-Type: application/json
x-api-key: nimit2

{
    "trainNumber": "12345",
    "trainName": "Express",
    "source": "Delhi",
    "destination": "Mumbai",
    "totalSeats": 100,
    "availableSeats": 100,
    "departureTime": "2024-03-20T10:00:00Z",
    "arrivalTime": "2024-03-20T18:00:00Z"
}
```

### 3. User Operations

#### Check Seat Availability
```http
GET /api/trains/availability?source=Delhi&destination=Mumbai
Authorization: Bearer <jwt_token>
```

#### Book Seat
```http
POST /api/trains/book
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
    "trainId": 1
}
```

#### Get Booking Details
```http
GET /api/trains/booking/1
Authorization: Bearer <jwt_token>
```

## Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd railway-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup MySQL Database**
```sql
CREATE DATABASE railway_management;
```

4. **Configure Environment Variables**
Create a .env file:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=railway_management
JWT_SECRET=nimit
ADMIN_API_KEY=nimit2
PORT=5001
```

5. **Start the Server**
```bash
npm run dev
```

## Security Features
- JWT Authentication for protected routes
- API Key protection for admin routes
- Race condition handling using database transactions
- Input validation and sanitization

## Assumptions
1. Users can book one seat at a time
2. Seat numbers are assigned automatically
3. Admin API key is required for administrative operations
4. JWT tokens expire after 30 days

## Race Condition Handling
The application handles race conditions during seat booking using:
- Database transactions
- Row-level locking
- Atomic operations for seat updates
