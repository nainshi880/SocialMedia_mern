# Hosting Guide - MERN Social Media Application

This guide will walk you through hosting your MERN stack application on various platforms.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup (MongoDB Atlas)](#database-setup)
3. [Backend Hosting Options](#backend-hosting)
4. [Frontend Hosting Options](#frontend-hosting)
5. [Environment Variables](#environment-variables)
6. [Post-Deployment Checklist](#checklist)

---

## Prerequisites

- GitHub account with your code pushed
- MongoDB Atlas account (free tier available)
- Accounts on hosting platforms (all have free tiers)

---

## Database Setup - MongoDB Atlas

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (choose the FREE tier)

### Step 2: Configure Database Access

1. Go to **Database Access** → **Add New Database User**
2. Create a username and password (save these!)
3. Set user privileges to **Read and write to any database**

### Step 3: Configure Network Access

1. Go to **Network Access** → **Add IP Address**
2. Click **Allow Access from Anywhere** (for development)
   - Or add specific IPs for production
3. Click **Confirm**

### Step 4: Get Connection String

1. Go to **Database** → Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with your database name (e.g., `socialmedia`)

**Example connection string:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/socialmedia?retryWrites=true&w=majority
```

---

## Backend Hosting

### Option 1: Render (Recommended - Easy & Free)

#### Step 1: Create Account
1. Go to [Render](https://render.com)
2. Sign up with GitHub

#### Step 2: Create Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Select your repository: `SocialMedia_mern`

#### Step 3: Configure Backend Service
- **Name:** `socialmedia-backend` (or any name)
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

#### Step 4: Add Environment Variables
Click **Environment** tab and add:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
```

#### Step 5: Deploy
- Click **Create Web Service**
- Wait for deployment (5-10 minutes)
- Copy your backend URL (e.g., `https://socialmedia-backend.onrender.com`)

**Note:** Free tier services on Render spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

### Option 2: Railway

#### Step 1: Create Account
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub

#### Step 2: Create New Project
1. Click **New Project**
2. Select **Deploy from GitHub repo**
3. Choose your repository

#### Step 3: Configure Service
1. Select the `backend` folder
2. Railway auto-detects Node.js
3. Add environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT` (optional, Railway assigns automatically)

#### Step 4: Deploy
- Railway automatically deploys
- Get your backend URL from the service dashboard

---

### Option 3: Heroku

#### Step 1: Install Heroku CLI
Download from [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

#### Step 2: Login
```bash
heroku login
```

#### Step 3: Create App
```bash
cd backend
heroku create your-app-name
```

#### Step 4: Set Environment Variables
```bash
heroku config:set MONGO_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret
```

#### Step 5: Deploy
```bash
git push heroku main
```

---

## Frontend Hosting

### Option 1: Vercel (Recommended - Best for Vite/React)

#### Step 1: Create Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub

#### Step 2: Import Project
1. Click **Add New Project**
2. Import your GitHub repository
3. Select `SocialMedia_mern`

#### Step 3: Configure Project
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

#### Step 4: Add Environment Variables
Click **Environment Variables** and add:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```
(Replace with your actual backend URL)

#### Step 5: Deploy
- Click **Deploy**
- Wait for build to complete
- Get your frontend URL (e.g., `https://your-app.vercel.app`)

---

### Option 2: Netlify

#### Step 1: Create Account
1. Go to [Netlify](https://netlify.com)
2. Sign up with GitHub

#### Step 2: Add New Site
1. Click **Add new site** → **Import an existing project**
2. Connect GitHub and select your repository

#### Step 3: Configure Build Settings
- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`

#### Step 4: Add Environment Variables
Go to **Site settings** → **Environment variables**:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

#### Step 5: Deploy
- Click **Deploy site**
- Get your frontend URL

---

### Option 3: GitHub Pages (Static Only)

**Note:** GitHub Pages only serves static files. You'll need to update your API URL to point to your hosted backend.

1. Update `vite.config.js` to add base path
2. Build the project: `npm run build`
3. Push `dist` folder to `gh-pages` branch
4. Enable GitHub Pages in repository settings

---

## Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/socialmedia?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
```

### Frontend (.env or .env.production)
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Important:** 
- Vite requires `VITE_` prefix for environment variables
- Never commit `.env` files to GitHub
- Add `.env` to `.gitignore`

---

## Post-Deployment Checklist

### Backend
- [ ] Backend is accessible (test with: `https://your-backend-url/api/posts`)
- [ ] CORS is configured to allow your frontend domain
- [ ] Environment variables are set correctly
- [ ] MongoDB connection is working
- [ ] File uploads directory is accessible

### Frontend
- [ ] Frontend is accessible
- [ ] API URL is correctly configured
- [ ] Can register new users
- [ ] Can login
- [ ] Can create posts
- [ ] Can upload images/videos
- [ ] All features work correctly

### Security
- [ ] JWT_SECRET is strong and unique
- [ ] MongoDB password is secure
- [ ] CORS only allows your frontend domain
- [ ] Environment variables are not exposed

---

## Updating CORS for Production

Update `backend/server.js` to allow your frontend domain:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
};

app.use(cors(corsOptions));
```

Add to backend environment variables:
```
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## Troubleshooting

### Backend Issues

**Problem:** Backend not starting
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check build logs for errors

**Problem:** CORS errors
- Update CORS configuration to include frontend URL
- Check that frontend URL in environment variables is correct

**Problem:** File uploads not working
- Verify uploads directory exists
- Check file size limits
- Ensure static file serving is configured

### Frontend Issues

**Problem:** API calls failing
- Verify `VITE_API_URL` is set correctly
- Check backend is running and accessible
- Verify CORS is configured on backend

**Problem:** Build failing
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript/ESLint errors

---

## Recommended Hosting Stack

**For Beginners:**
- **Backend:** Render (easiest setup)
- **Frontend:** Vercel (best for Vite)
- **Database:** MongoDB Atlas (free tier)

**For Production:**
- **Backend:** Railway or Render (paid plans)
- **Frontend:** Vercel or Netlify
- **Database:** MongoDB Atlas (paid plans for better performance)

---

## Cost Estimate

**Free Tier:**
- MongoDB Atlas: Free (512MB storage)
- Render: Free (spins down after inactivity)
- Vercel: Free (100GB bandwidth/month)
- **Total: $0/month**

**Paid Tier (Recommended for Production):**
- MongoDB Atlas: ~$9/month
- Render: ~$7/month
- Vercel: Free (usually sufficient)
- **Total: ~$16/month**

---

## Next Steps

1. Set up MongoDB Atlas
2. Deploy backend to Render/Railway
3. Deploy frontend to Vercel/Netlify
4. Update environment variables
5. Test all features
6. Share your live application! 🚀

---

**Need Help?** Open an issue on GitHub or check the platform-specific documentation.

