# ATMSim - Vercel Deployment Documentation

This documents the successful deployment of ATMSim to Vercel at https://atm-sim-muma-k.vercel.app/

## Deployment Process

### Initial Configuration
Created the vercel.json configuration file to handle our React + Express.js full-stack setup:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.ts",
      "use": "@vercel/node"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist/public"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/$1"
    }
  ]
}
```

### Framework Selection
Selected "Other" as the framework preset in Vercel since this is a custom React + Express.js application, not a Next.js project. This allows Vercel to use our custom vercel.json configuration.

### Build Configuration
- **Build Command**: `npm run build` (uses existing package.json script)
- **Output Directory**: `dist` 
- **Install Command**: `npm install`

The existing build script handles both frontend (Vite) and backend (esbuild) compilation:
```json
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
```

### Configuration Issues Resolved
Initially encountered a Vercel error: "The functions property cannot be used in conjunction with the builds property." Fixed by removing the conflicting `functions` property from vercel.json.

### Environment Variables
Set up the following production environment variables in Vercel dashboard:
- `DATABASE_URL`: PostgreSQL connection string (Neon Database)
- `NODE_ENV`: production
- `SESSION_SECRET`: Generated session encryption key

### Database Integration
Using Neon Database (serverless PostgreSQL) for production data persistence. The existing Drizzle ORM configuration with `@neondatabase/serverless` driver works seamlessly in Vercel's serverless environment.

## Live Application
- **URL**: https://atm-sim-muma-k.vercel.app/
- **Status**: Fully functional with all features working
- **Demo Accounts**: All 5 demo accounts operational in production
- **Features Verified**: 
  - PIN authentication working
  - Real-time transactions processing
  - PDF receipt generation functional
  - Transaction history displaying correctly
  - Confetti animations working
  - Custom logo displaying properly

## Technical Stack in Production
- **Frontend**: React 18 + TypeScript built with Vite
- **Backend**: Express.js TypeScript serverless functions
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Hosting**: Vercel with automatic SSL
- **Domain**: atm-sim-muma-k.vercel.app (custom domain ready)

## Post-Deployment Notes
The application successfully demonstrates a complete full-stack banking simulator with professional-grade features. All core functionality including secure authentication, real-time balance updates, transaction processing, and receipt generation is working in the production environment.

This deployment serves as a portfolio showcase of modern web development capabilities using React, TypeScript, Express.js, and PostgreSQL in a serverless architecture.