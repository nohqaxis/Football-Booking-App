# Vercel Deployment Guide

## Quick Deploy

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect the settings

3. **Build Settings:**
   - **Root Directory:** Leave as is (root)
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Output Directory:** `frontend/dist`
   - **Install Command:** `npm install` (runs in root, then frontend)

4. **Environment Variables:**
   - No environment variables needed for basic setup

5. **Deploy!**

## Important Notes

### Database Storage
⚠️ **Current Limitation:** The app uses `/tmp` directory for data storage in serverless functions. This means:
- Data is **ephemeral** and may be cleared between function invocations
- Data does **not persist** across deployments
- This is fine for **testing/demos** but **not for production**

### For Production Use:
Consider migrating to:
- **Vercel KV** (Redis) - Free tier available
- **MongoDB Atlas** - Free tier available
- **Supabase** - Free PostgreSQL
- **PlanetScale** - Free MySQL
- **Firebase Firestore** - Free tier available

### API Routes
All API routes are in the `/api` folder and will be automatically deployed as serverless functions:
- `/api/pitches` - Get all pitches
- `/api/pitches/[id]` - Get specific pitch
- `/api/bookings` - Get/Create bookings
- `/api/bookings/[id]` - Delete booking
- `/api/bookings/check-availability` - Check availability

## Troubleshooting

### 404 Errors
- Make sure `vercel.json` is in the root directory
- Check that API routes are in the `/api` folder
- Verify build output is `frontend/dist`

### CORS Issues
- CORS headers are already configured in each API route
- Check browser console for specific errors

### Build Failures
- Ensure Node.js version is 18+ (set in Vercel project settings)
- Check that all dependencies are in `package.json`

## Local Testing

To test the Vercel setup locally:

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

This will simulate the Vercel environment locally.

