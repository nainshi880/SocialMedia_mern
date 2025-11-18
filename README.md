# Social Media MERN Stack Application

A full-stack social media application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application provides user authentication, post creation, likes, comments, and media uploads.

## 🚀 Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication
  - Password hashing with bcrypt
  - Secure token management

- **Posts Management**
  - Create, read, update, and delete posts
  - Rich media support (images and videos)
  - Upload files or use URLs
  - Media preview before posting

- **Social Interactions**
  - Like posts
  - Comment on posts
  - View like and comment counts
  - Real-time engagement tracking

- **User Interface**
  - Modern, responsive design with Tailwind CSS
  - Beautiful gradient backgrounds
  - Smooth animations and transitions
  - Mobile-friendly layout

- **Notifications**
  - Badge counts for likes and comments on your posts
  - Navigate directly to posts with engagement
  - Visual highlighting of active posts

- **Search Functionality**
  - Search posts by content
  - Search by author username
  - Inline search in navbar

- **Stats Dashboard**
  - View likes and comments statistics
  - See engagement on your posts
  - Filter by likes or comments

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Navigation
- **Tailwind CSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File uploads
- **Nodemailer** - Email service

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nainshi880/SocialMedia_mern.git
   cd SocialMedia_mern
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

## ⚙️ Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

**Example:**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialmedia
JWT_SECRET=your_super_secret_jwt_key_here
```

**For MongoDB Atlas:**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/socialmedia?retryWrites=true&w=majority
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5000` by default. If your backend runs on a different port, update the API base URL in `frontend/src/api.js`.

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

3. **Open your browser**
   Navigate to `http://localhost:5173`

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production mode**
   ```bash
   cd backend
   npm start
   ```

## 📁 Project Structure

```
mern-project/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   └── postController.js  # Post CRUD operations
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   ├── upload.js          # Multer configuration
│   │   └── mediaUpload.js     # Media upload middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Post.js            # Post schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   └── posts.js           # Post routes
│   ├── uploads/               # Uploaded media files
│   ├── server.js              # Express server setup
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Icons.jsx      # SVG icon components
│   │   │   ├── PostForm.jsx   # Post creation form
│   │   │   └── PostItem.jsx   # Individual post component
│   │   ├── pages/
│   │   │   ├── Feed.jsx       # Main feed page
│   │   │   ├── Login.jsx      # Login page
│   │   │   ├── Register.jsx  # Registration page
│   │   │   └── Stats.jsx      # Statistics page
│   │   ├── api.js             # API helper functions
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   └── package.json
│
├── .gitignore
├── README.md
└── API_DOCUMENTATION.md
```

## 📚 API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Quick API Reference

**Base URL:** `http://localhost:5000/api`

#### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

#### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create a new post
- `PUT /posts/:id` - Update a post
- `DELETE /posts/:id` - Delete a post
- `POST /posts/:id/like` - Like/unlike a post
- `POST /posts/:id/comment` - Add a comment to a post

## 🎨 Features in Detail

### User Registration & Login
- Beautiful gradient UI design
- Form validation
- Auto-generated username from email
- Password strength indicator
- Error handling with user-friendly messages

### Post Creation
- Rich text content
- Image and video uploads
- URL-based media support
- Media preview
- Real-time post updates

### Engagement Features
- Like/unlike posts
- Add comments
- View engagement counts
- Notification badges
- Direct navigation to engaged posts

### Search & Filter
- Search posts by content
- Search by author
- Real-time search results

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected API routes
- Input validation
- Secure file upload handling

## 🧪 Testing

You can test the API endpoints using the provided Postman collection:
- Import `backend/MERN_Project.postman_collection.json` into Postman
- See `backend/POSTMAN_TESTING_GUIDE.md` for testing instructions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Nainshi**
- GitHub: [@nainshi880](https://github.com/nainshi880)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database
- Tailwind CSS for the utility-first CSS framework

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub.

---

**Happy Coding! 🚀**

