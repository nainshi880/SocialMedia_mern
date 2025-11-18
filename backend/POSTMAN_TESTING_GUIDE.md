# Postman API Testing Guide

## Base URL
```
http://localhost:5000/api
```

## Setup Instructions

1. Make sure your backend server is running on port 5000
2. Import the `MERN_Project.postman_collection.json` file into Postman
3. For authenticated requests, you'll need to:
   - First register/login to get a token
   - Copy the token from the response
   - Set it in the collection variable `token` or manually add it to the Authorization header

---

## Authentication APIs

### 1. Register User
**Endpoint:** `POST /api/auth/register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected Response (201):**
```json
{
  "message": "User created"
}
```

**Error Cases:**
- 400: Email or username already exists
- 500: Server error

---

### 2. Login
**Endpoint:** `POST /api/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Expected Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_id_here",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

**Error Cases:**
- 400: Invalid credentials
- 500: Server error

**Important:** Copy the `token` from this response for authenticated requests!

---

### 3. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "john@example.com"
}
```

**Expected Response (200):**
```json
{
  "message": "Password reset token created",
  "resetUrl": "http://localhost:5173/reset-password/token_here"
}
```

**Error Cases:**
- 400: No user with that email
- 500: Server error

**Note:** Copy the token from `resetUrl` for the reset password endpoint.

---

### 4. Reset Password
**Endpoint:** `POST /api/auth/reset-password/:token`

**Headers:**
```
Content-Type: application/json
```

**URL Parameter:**
- `token`: The reset token from forgot-password response

**Body (JSON):**
```json
{
  "password": "newpassword123"
}
```

**Expected Response (200):**
```json
{
  "message": "Password reset successful"
}
```

**Error Cases:**
- 400: Token is invalid or expired
- 500: Server error

---

## Post APIs

**All post endpoints (except GET) require authentication!**

### Setting Authorization Header

For authenticated requests, add this header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Replace `YOUR_TOKEN_HERE` with the token from the login response.

---

### 5. Create Post
**Endpoint:** `POST /api/posts`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "content": "This is my first post!",
  "image": "https://example.com/image.jpg"
}
```

**Note:** `image` field is optional.

**Expected Response (201):**
```json
{
  "_id": "post_id",
  "content": "This is my first post!",
  "image": "https://example.com/image.jpg",
  "author": {
    "_id": "user_id",
    "username": "johndoe"
  },
  "likes": [],
  "comments": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Cases:**
- 401: No token provided / Invalid token
- 500: Server error

---

### 6. Get All Posts
**Endpoint:** `GET /api/posts`

**Headers:**
```
(none required)
```

**Expected Response (200):**
```json
[
  {
    "_id": "post_id",
    "content": "This is my first post!",
    "image": "https://example.com/image.jpg",
    "author": {
      "_id": "user_id",
      "username": "johndoe"
    },
    "likes": ["user_id_1", "user_id_2"],
    "comments": [
      {
        "_id": "comment_id",
        "user": {
          "_id": "user_id",
          "username": "janedoe"
        },
        "text": "Great post!",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Cases:**
- 500: Server error

---

### 7. Get Single Post
**Endpoint:** `GET /api/posts/:id`

**Headers:**
```
(none required)
```

**URL Parameter:**
- `id`: Post ID

**Expected Response (200):**
```json
{
  "_id": "post_id",
  "content": "This is my first post!",
  "image": "https://example.com/image.jpg",
  "author": {
    "_id": "user_id",
    "username": "johndoe"
  },
  "likes": [],
  "comments": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Cases:**
- 404: Post not found
- 500: Server error

---

### 8. Update Post
**Endpoint:** `PUT /api/posts/:id`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**URL Parameter:**
- `id`: Post ID

**Body (JSON):**
```json
{
  "content": "Updated post content",
  "image": "https://example.com/new-image.jpg"
}
```

**Note:** Both fields are optional - only include fields you want to update.

**Expected Response (200):**
```json
{
  "_id": "post_id",
  "content": "Updated post content",
  "image": "https://example.com/new-image.jpg",
  "author": "user_id",
  "likes": [],
  "comments": [],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Cases:**
- 401: No token provided / Invalid token
- 403: Not authorized (not the post author)
- 404: Post not found
- 500: Server error

---

### 9. Delete Post
**Endpoint:** `DELETE /api/posts/:id`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**URL Parameter:**
- `id`: Post ID

**Expected Response (200):**
```json
{
  "message": "Deleted"
}
```

**Error Cases:**
- 401: No token provided / Invalid token
- 403: Not authorized (not the post author)
- 404: Post not found
- 500: Server error

---

### 10. Toggle Like on Post
**Endpoint:** `POST /api/posts/:id/like`

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**URL Parameter:**
- `id`: Post ID

**Expected Response (200):**
```json
{
  "likesCount": 5,
  "liked": true
}
```

**Note:** 
- `liked: true` means you just liked the post
- `liked: false` means you just unliked the post
- This endpoint toggles the like status

**Error Cases:**
- 401: No token provided / Invalid token
- 404: Post not found
- 500: Server error

---

### 11. Add Comment to Post
**Endpoint:** `POST /api/posts/:id/comment`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**URL Parameter:**
- `id`: Post ID

**Body (JSON):**
```json
{
  "text": "This is a great post!"
}
```

**Expected Response (201):**
```json
{
  "_id": "comment_id",
  "user": {
    "_id": "user_id",
    "username": "johndoe"
  },
  "text": "This is a great post!",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Error Cases:**
- 401: No token provided / Invalid token
- 404: Post not found
- 500: Server error

---

## Testing Workflow

### Recommended Testing Order:

1. **Register a new user** → Get user credentials
2. **Login** → Get authentication token
3. **Create a post** → Get post ID
4. **Get all posts** → Verify your post appears
5. **Get single post** → Use the post ID from step 3
6. **Update post** → Modify your post
7. **Add comment** → Comment on your post
8. **Toggle like** → Like your post
9. **Delete post** → Remove your post
10. **Test forgot password** → Get reset token
11. **Test reset password** → Use token from step 10

### Tips:

- Save the token from login response as a collection variable
- Use Postman's environment variables for base URL and token
- Test error cases (invalid token, wrong credentials, etc.)
- Test authorization (try updating/deleting someone else's post)

---

## Common Issues

1. **401 Unauthorized**: Make sure you're including the `Authorization: Bearer TOKEN` header
2. **403 Forbidden**: You're trying to modify a post that doesn't belong to you
3. **404 Not Found**: The post ID doesn't exist
4. **400 Bad Request**: Missing required fields or invalid data format

