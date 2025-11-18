# Social Media MERN Stack Application - API Documentation

## Overview
This is a complete MERN stack social media application with user authentication, password reset, and full CRUD operations for posts with likes and comments.

## Backend APIs

### Base URL
```
http://localhost:5000/api
```

### Authentication APIs

#### 1. User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created"
}
```

#### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### 3. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset token created",
  "resetUrl": "http://localhost:5173/reset-password/token_here"
}
```

#### 4. Reset Password
**Endpoint:** `POST /api/auth/reset-password/:token`

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "Password reset successful"
}
```

### Post APIs

All post endpoints require authentication (Bearer token in Authorization header).

#### 1. Create Post
**Endpoint:** `POST /api/posts`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "This is my first post!",
  "image": "https://example.com/image.jpg" // optional
}
```

**Response:**
```json
{
  "_id": "post_id",
  "author": {
    "_id": "user_id",
    "username": "johndoe"
  },
  "content": "This is my first post!",
  "image": "https://example.com/image.jpg",
  "likes": [],
  "comments": [],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

#### 2. Get All Posts
**Endpoint:** `GET /api/posts`

**Response:**
```json
[
  {
    "_id": "post_id",
    "author": {
      "_id": "user_id",
      "username": "johndoe"
    },
    "content": "Post content",
    "image": "https://example.com/image.jpg",
    "likes": ["user_id1", "user_id2"],
    "comments": [
      {
        "_id": "comment_id",
        "user": {
          "_id": "user_id",
          "username": "janedoe"
        },
        "text": "Great post!",
        "createdAt": "2025-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
]
```

#### 3. Get Single Post
**Endpoint:** `GET /api/posts/:id`

**Response:**
```json
{
  "_id": "post_id",
  "author": {
    "_id": "user_id",
    "username": "johndoe"
  },
  "content": "Post content",
  "image": "https://example.com/image.jpg",
  "likes": ["user_id1"],
  "comments": [],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

#### 4. Update Post
**Endpoint:** `PUT /api/posts/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "Updated post content",
  "image": "https://example.com/new-image.jpg" // optional
}
```

**Response:**
```json
{
  "_id": "post_id",
  "author": "user_id",
  "content": "Updated post content",
  "image": "https://example.com/new-image.jpg",
  "likes": [],
  "comments": [],
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Note:** Only the post author can update their own posts.

#### 5. Delete Post
**Endpoint:** `DELETE /api/posts/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Deleted"
}
```

**Note:** Only the post author can delete their own posts.

#### 6. Like/Unlike Post
**Endpoint:** `POST /api/posts/:id/like`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "likesCount": 5,
  "liked": true
}
```

#### 7. Add Comment
**Endpoint:** `POST /api/posts/:id/comment`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "text": "This is a comment"
}
```

**Response:**
```json
{
  "_id": "comment_id",
  "user": {
    "_id": "user_id",
    "username": "janedoe"
  },
  "text": "This is a comment",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## Frontend Pages

### 1. Registration Page (`/`)
- User registration with username, email, and password
- Beautiful UI with image on left, form on right
- Link to login page

### 2. Login Page (`/login`)
- User login with username and password
- Link to forgot password page
- Link to registration page

### 3. Forgot Password Page (`/forgot-password`)
- Enter email to receive password reset link
- Displays reset URL (in development mode)

### 4. Reset Password Page (`/reset-password/:token`)
- Reset password using token from email
- Requires new password and confirmation

### 5. Feed Page (`/feed`)
- View all posts in reverse chronological order
- Create new posts with text and optional image URL
- Like/unlike posts
- Add comments to posts
- Edit own posts (inline editing)
- Delete own posts
- Logout functionality

## Setup Instructions

### Backend Setup
1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional):
```
MONGO_URI=mongodb://localhost:27017/mern-social
JWT_SECRET=your_secret_key_here
PORT=5000
```

4. Make sure MongoDB is running on your system

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Features Implemented

✅ User Registration (Email, Username, Password)
✅ User Login (Username, Password)
✅ Forgot Password API
✅ Reset Password API
✅ Create Post (CRUD - Create)
✅ Read Posts (CRUD - Read)
✅ Update Post (CRUD - Update)
✅ Delete Post (CRUD - Delete)
✅ Like/Unlike Post
✅ Add Comments to Post
✅ Beautiful UI with Tailwind CSS
✅ Responsive Design
✅ Authentication Middleware
✅ Error Handling

## Technology Stack

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- crypto for password reset tokens

**Frontend:**
- React
- React Router
- Tailwind CSS
- Fetch API for HTTP requests

## Notes

- Password reset tokens expire after 1 hour
- In production, implement email sending for password reset links using nodemailer or SendGrid
- All post operations require authentication
- Only post authors can edit or delete their own posts
- JWT tokens expire after 7 days

