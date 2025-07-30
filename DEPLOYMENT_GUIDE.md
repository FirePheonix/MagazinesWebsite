# Vercel Deployment Guide

This guide will help you deploy both the frontend and backend of your magazine website to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be on GitHub
3. **Environment Variables**: You'll need to set up environment variables in Vercel

## Environment Variables Setup

### Backend Environment Variables

You'll need to set these in your Vercel backend project:

```
MONGO=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=your_frontend_vercel_url
IK_YOUR_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IK_YOUR_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IK_YOUR_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

### Frontend Environment Variables

Set these in your Vercel frontend project:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=your_backend_vercel_url
```

## Deployment Steps

### Step 1: Deploy Backend

1. **Push your code to GitHub** (if not already done)
2. **Go to Vercel Dashboard** and click "New Project"
3. **Import your GitHub repository**
4. **Configure the project**:
   - **Framework Preset**: Node.js
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all the backend environment variables listed above

6. **Deploy**: Click "Deploy"

### Step 2: Deploy Frontend

1. **Create a new Vercel project** for the frontend
2. **Import the same GitHub repository**
3. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - Add the frontend environment variables listed above
   - Make sure `VITE_API_URL` points to your backend Vercel URL

5. **Deploy**: Click "Deploy"

## Project Structure for Vercel

### Backend (`/backend`)
```
backend/
├── index.js          # Main server file
├── package.json      # Dependencies and scripts
├── vercel.json       # Vercel configuration
├── lib/
├── routes/
├── controllers/
├── models/
└── middleware/
```

### Frontend (`/client`)
```
client/
├── src/              # React source code
├── public/           # Static assets
├── package.json      # Dependencies and scripts
├── vercel.json       # Vercel configuration
├── vite.config.ts    # Vite configuration
└── dist/             # Build output (generated)
```

## Important Notes

### Backend Considerations

1. **Database**: Make sure your MongoDB connection string is accessible from Vercel
2. **CORS**: The backend is configured to accept requests from your frontend domain
3. **Environment Variables**: All sensitive data should be in Vercel environment variables
4. **File Uploads**: For file uploads, consider using external services like ImageKit (already configured)

### Frontend Considerations

1. **API Calls**: Update your API calls to use the backend Vercel URL
2. **Environment Variables**: Use `VITE_` prefix for client-side environment variables
3. **Static Assets**: All assets in `public/` will be served correctly
4. **Routing**: React Router will work with Vercel's configuration

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check if all dependencies are in `package.json`
   - Ensure TypeScript errors are handled (already configured)

2. **Environment Variables**:
   - Make sure all required variables are set in Vercel
   - Check that variable names match your code

3. **CORS Issues**:
   - Verify `CLIENT_URL` in backend environment variables
   - Check that frontend URL is correct

4. **Database Connection**:
   - Ensure MongoDB connection string is correct
   - Check if your database allows connections from Vercel's IP ranges

### Debugging

1. **Check Vercel Logs**: Go to your project → Functions → View Function Logs
2. **Test API Endpoints**: Use the `/health` endpoint to verify backend is running
3. **Check Environment Variables**: Verify all variables are set correctly in Vercel dashboard

## Post-Deployment

1. **Test All Features**: Make sure all functionality works as expected
2. **Update Documentation**: Update any hardcoded URLs to use your Vercel domains
3. **Set Up Custom Domains**: If needed, configure custom domains in Vercel
4. **Monitor Performance**: Use Vercel Analytics to monitor your application

## URLs Structure

After deployment, you'll have:
- **Frontend**: `https://your-frontend-project.vercel.app`
- **Backend**: `https://your-backend-project.vercel.app`

Make sure to update the `VITE_API_URL` in your frontend environment variables to point to your backend URL.

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **CORS**: Only allow your frontend domain in CORS configuration
3. **Authentication**: Ensure Clerk authentication is properly configured
4. **Database**: Use connection string with proper authentication

## Performance Optimization

1. **Image Optimization**: Use Vercel's image optimization features
2. **Caching**: Configure appropriate caching headers
3. **CDN**: Vercel automatically provides global CDN
4. **Build Optimization**: The current configuration optimizes for production builds 