# ATMSim Deployment Guide

This guide provides step-by-step instructions for deploying your ATMSim application to professional hosting platforms with custom domains.

## Table of Contents
- [Vercel Deployment (Recommended)](#vercel-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Database Setup](#database-setup)
- [Environment Variables](#environment-variables)
- [Custom Domain Setup](#custom-domain-setup)

## Vercel Deployment (Recommended)

Vercel is ideal for React applications and provides excellent performance with automatic deployments.

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- PostgreSQL database (Neon, Supabase, or other provider)

### Step 1: Prepare Your Repository
1. Push your code to a GitHub repository
2. The existing build scripts are already configured for deployment:
   ```json
   {
     "scripts": {
       "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
       "start": "NODE_ENV=production node dist/index.js"
     }
   }
   ```

### Step 2: Create vercel.json Configuration
Create a `vercel.json` file in your project root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node",
      "config": {
        "includeFiles": ["dist/**"]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/dist/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ],
  "functions": {
    "dist/index.js": {
      "maxDuration": 30
    }
  }
}
```

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see Environment Variables section)
5. Click "Deploy"

### Step 4: Configure Custom Domain (Optional)
1. Go to your project dashboard on Vercel
2. Navigate to "Settings" → "Domains"
3. Add your custom domain (e.g., `atmsim.yourname.com`)
4. Follow DNS configuration instructions

## Heroku Deployment

Heroku is excellent for full-stack applications and provides easy PostgreSQL integration.

### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

### Step 1: Prepare for Heroku
1. Create a `Procfile` in your project root:
   ```
   web: npm start
   ```

2. The existing package.json is already configured for Heroku deployment. You may want to add these engines for version specification:
   ```json
   {
     "engines": {
       "node": "20.x",
       "npm": "10.x"
     }
   }
   ```

### Step 2: Create Heroku Application
```bash
# Login to Heroku
heroku login

# Create new Heroku app
heroku create your-atmsim-app

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:essential-0

# Set Node.js buildpack
heroku buildpacks:set heroku/nodejs
```

### Step 3: Configure Environment Variables
```bash
# Set session secret
heroku config:set SESSION_SECRET=$(openssl rand -base64 32)

# Set Node environment
heroku config:set NODE_ENV=production

# Database URL is automatically set by PostgreSQL addon
```

### Step 4: Deploy
```bash
# Add Heroku remote
git remote add heroku https://git.heroku.com/your-atmsim-app.git

# Deploy
git push heroku main

# Run database migrations
heroku run npm run db:push
```

### Step 5: Custom Domain Setup
```bash
# Add custom domain
heroku domains:add atmsim.yourname.com

# Configure DNS records as instructed by Heroku
```

## Database Setup

### Option 1: Neon Database (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Set as `DATABASE_URL` environment variable

### Option 2: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get PostgreSQL connection string from Settings → Database
4. Set as `DATABASE_URL` environment variable

### Option 3: Heroku PostgreSQL (Heroku only)
- Automatically configured when using `heroku addons:create heroku-postgresql`

## Environment Variables

Set these environment variables in your deployment platform:

### Required Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
SESSION_SECRET=your-random-session-secret
```

### Optional Variables
```env
PORT=5000
```

## Custom Domain Setup

### DNS Configuration
For your custom domain, add these DNS records:

**For Vercel:**
- Type: CNAME
- Name: atmsim (or your subdomain)
- Value: cname.vercel-dns.com

**For Heroku:**
- Type: CNAME
- Name: atmsim (or your subdomain)
- Value: your-app-name.herokuapp.com

### SSL Certificate
Both Vercel and Heroku automatically provide SSL certificates for custom domains.

## Post-Deployment Steps

1. **Test your application** at your new URL
2. **Run database migrations** if needed:
   ```bash
   # Vercel
   vercel env pull .env.local
   npm run db:push
   
   # Heroku
   heroku run npm run db:push
   ```
3. **Monitor application logs**:
   ```bash
   # Vercel
   vercel logs
   
   # Heroku
   heroku logs --tail
   ```

## Troubleshooting

### Common Issues

**Build Failures:**
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Verify build scripts are correct

**Database Connection Issues:**
- Verify `DATABASE_URL` format
- Check database provider firewall settings
- Ensure database exists and is accessible

**Static File Issues:**
- Verify build output directory structure
- Check routing configuration in `vercel.json`

### Getting Help
- Check platform-specific documentation
- Review application logs for detailed error messages
- Ensure environment variables are properly set

## Professional Portfolio Tips

1. **Use a custom domain** like `atmsim.yourname.com`
2. **Add analytics** to track usage (Google Analytics, Vercel Analytics)
3. **Monitor uptime** with services like UptimeRobot
4. **Create a landing page** explaining the project and technologies used
5. **Add a "View Source" link** to your GitHub repository

Your ATMSim is now ready for professional deployment with custom branding and URLs perfect for showcasing to potential employers and clients!