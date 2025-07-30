# Backend Deployment on Vercel - Step by Step

## Prerequisites
1. Your code is pushed to GitHub
2. You have a Vercel account
3. You have your environment variables ready

## Step 1: Prepare Your Backend Code

Make sure your backend folder structure looks like this:
```
backend/
├── index.js          # Main server file
├── package.json      # Dependencies
├── vercel.json       # Vercel config (already created)
├── lib/
├── routes/
├── controllers/
├── models/
└── middleware/
```

## Step 2: Go to Vercel Dashboard

1. Open [vercel.com](https://vercel.com)
2. Sign in to your account
3. Click **"New Project"**

## Step 3: Import Your Repository

1. Click **"Import Git Repository"**
2. Select your GitHub repository
3. Click **"Import"**

## Step 4: Configure the Project

**IMPORTANT**: You need to configure this as a Node.js project, not a static site.

### Project Settings:
- **Framework Preset**: Select **"Node.js"** (NOT "Other" or "Static")
- **Root Directory**: Type `backend`
- **Build Command**: Leave empty (or type `npm install`)
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

### Advanced Settings:
- **Node.js Version**: 18.x or 20.x (latest)

## Step 5: Add Environment Variables

**BEFORE clicking Deploy**, add these environment variables:

1. Click **"Environment Variables"** section
2. Add each variable one by one:

```
MONGO=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLIENT_URL=https://your-frontend-project.vercel.app
IK_YOUR_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IK_YOUR_IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IK_YOUR_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```

**Important Notes:**
- Replace `your_frontend_project.vercel.app` with your actual frontend URL
- Make sure your MongoDB connection string is accessible from Vercel
- Use the exact variable names (case-sensitive)

## Step 6: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. You'll get a URL like: `https://your-backend-project.vercel.app`

## Step 7: Test Your Backend

1. Test the health endpoint: `https://your-backend-project.vercel.app/health`
2. You should see: `{"status":"ok","message":"Server is running"}`

## Step 8: Update Frontend Environment Variable

1. Go to your frontend Vercel project
2. Go to **Settings** → **Environment Variables**
3. Update `VITE_API_URL` to your backend URL:
   ```
   VITE_API_URL=https://your-backend-project.vercel.app
   ```
4. Redeploy your frontend

## Troubleshooting

### Build Fails
- Check that you selected "Node.js" as framework
- Verify all dependencies are in `package.json`
- Check the build logs in Vercel dashboard

### Environment Variables Not Working
- Make sure variable names match exactly (case-sensitive)
- Check that you added them BEFORE deploying
- Verify in Vercel dashboard under Settings → Environment Variables

### API Not Responding
- Test the `/health` endpoint first
- Check Vercel function logs
- Verify CORS settings in your backend code

### Database Connection Issues
- Make sure MongoDB connection string is correct
- Check if your database allows connections from Vercel
- Verify network access settings

## Common Mistakes to Avoid

1. **Wrong Framework**: Don't select "Other" or "Static" - use "Node.js"
2. **Wrong Root Directory**: Make sure it's set to `backend`
3. **Missing Environment Variables**: Add them before deploying
4. **Wrong API URL**: Update frontend's `VITE_API_URL` after backend deployment

## Verification Checklist

- [ ] Backend deploys successfully
- [ ] `/health` endpoint returns `{"status":"ok"}`
- [ ] Environment variables are set correctly
- [ ] Frontend's `VITE_API_URL` points to backend URL
- [ ] Frontend redeployed with updated environment variables
- [ ] All API calls work from frontend

## Your Backend URL Structure

After deployment, your backend will be available at:
- **Base URL**: `https://your-backend-project.vercel.app`
- **Health Check**: `https://your-backend-project.vercel.app/health`
- **API Endpoints**: `https://your-backend-project.vercel.app/posts`, `/users`, `/comments`, etc.

## Next Steps

1. Deploy backend following these steps
2. Get your backend URL
3. Update frontend's `VITE_API_URL` environment variable
4. Redeploy frontend
5. Test all functionality

## Need Help?

- Check Vercel deployment logs
- Test endpoints with Postman or browser
- Check environment variables in Vercel dashboard
- Verify MongoDB connection 