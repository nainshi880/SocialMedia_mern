# Quick Deployment Configuration Reference

## Vercel Configuration (Frontend)

When deploying to Vercel, use these settings:

### Project Settings
- **Framework Preset:** `Vite`
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Environment Variables
Add this in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## Render Configuration (Backend)

### Service Settings
- **Name:** `socialmedia-backend`
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

### Environment Variables
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=https://your-frontend-url.vercel.app
```

---

## Step-by-Step Deployment

### 1. Deploy Backend First

1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Configure as shown above
5. Add environment variables
6. Deploy and copy the backend URL

### 2. Deploy Frontend

1. Go to [Vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure as shown above
4. Add `VITE_API_URL` environment variable (use your backend URL)
5. Deploy

### 3. Update Backend CORS

1. Go back to Render dashboard
2. Add `FRONTEND_URL` environment variable (use your Vercel URL)
3. Redeploy backend

---

## Testing Your Deployment

### Test Backend
```bash
curl https://your-backend-url.onrender.com/api/posts
```

### Test Frontend
- Visit your Vercel URL
- Try registering a new user
- Create a post
- Test all features

---

## Common Issues

**CORS Error:**
- Make sure `FRONTEND_URL` is set in backend environment variables
- Ensure the URL matches exactly (including https://)

**API Not Working:**
- Verify `VITE_API_URL` is set correctly in Vercel
- Check that backend URL includes `/api` at the end
- Ensure backend is running (Render free tier spins down)

**Build Fails:**
- Check Node.js version compatibility
- Verify all dependencies in package.json
- Check build logs for specific errors

