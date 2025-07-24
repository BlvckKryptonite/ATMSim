# ATMSim - Professional ATM Simulator

## Overview

ATMSim is a sophisticated full-stack ATM Simulator application featuring a React TypeScript frontend and Express.js backend with PostgreSQL database integration. The application provides a complete banking simulation experience including secure PIN-based authentication, real-time account management, transaction processing, and receipt generation capabilities. This portfolio project demonstrates modern web development practices and enterprise-grade architecture patterns. Designed and developed by Muma K.

## User Preferences

Preferred communication style: Technical but highly readable - include framework details and architectural decisions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe component development
- **UI Library**: shadcn/ui component system built on Radix UI primitives
- **Styling**: Tailwind CSS v3 utility-first framework with custom ATM color palette
- **Routing**: Wouter lightweight client-side router (alternative to React Router)
- **State Management**: 
  - TanStack Query v5 for server state management and caching
  - React hooks (useState, useEffect) for local component state
  - Custom authentication manager with observable pattern
- **Forms**: React Hook Form with Zod validation and @hookform/resolvers
- **Build Tool**: Vite 5 for lightning-fast development and optimized production builds
- **Bundling**: esbuild for ultra-fast JavaScript transpilation
- **Icons**: Lucide React icon library for consistent UI elements

### Backend Architecture
- **Framework**: Express.js 4.x with TypeScript for robust server-side development
- **Runtime**: Node.js v20 with ES modules for modern JavaScript features
- **API Design**: RESTful API architecture with resource-based endpoints
- **Request Validation**: Zod schema validation for type-safe API contracts
- **Error Handling**: Centralized error middleware with structured error responses
- **Session Management**: Express sessions with PostgreSQL store using connect-pg-simple
- **Development**: Hot module replacement (HMR) with Vite integration for instant reloads
- **Security**: Secure PIN validation without client-side exposure

### Database Management System
- **Primary Database**: PostgreSQL 15+ (production-grade ACID-compliant RDBMS)
- **Database Provider**: Neon Database (serverless PostgreSQL with auto-scaling)
- **ORM**: Drizzle ORM with TypeScript-first approach and zero-runtime overhead
- **Connection Pool**: @neondatabase/serverless with WebSocket support for edge environments
- **Schema Management**: 
  - Drizzle Kit for schema migrations and introspection
  - `npm run db:push` for direct schema synchronization (development)
  - Type-safe schema definitions with automatic TypeScript generation
- **Data Persistence**: 
  - Production: DatabaseStorage class with PostgreSQL persistence
  - Development: Seamless fallback to MemStorage for rapid prototyping
- **Demo Data**: Pre-seeded with 5 user accounts including transaction history
- **Session Store**: PostgreSQL-backed session storage for secure authentication state

## Core Features & Components

### 🔐 Authentication System
- **PIN-Based Security**: 4-digit numeric PIN authentication system
- **Session Management**: Express sessions with PostgreSQL persistence
- **Demo Accounts**: 5 pre-seeded user accounts for immediate testing
- **Security**: Server-side credential validation with zero PIN exposure to client
- **Auto-Logout**: Session timeout and security controls

### 💰 Banking Operations
- **Deposit Transactions**: Real-time balance updates with instant feedback
- **Withdrawal Operations**: Balance validation and overdraft protection
- **Transaction History**: Complete audit trail with timestamps and reference IDs
- **Balance Tracking**: Live balance updates across all operations
- **Data Validation**: Zod schema validation for all financial operations

### 🎨 User Interface & Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **ATM-Style Interface**: Professional banking UI using shadcn/ui components
- **Loading States**: Skeleton loading and progress indicators
- **Error Handling**: User-friendly error messages with recovery suggestions
- **Accessibility**: ARIA-compliant components via Radix UI primitives
- **Custom Branding**: Integrated ATMSim logo with credit card iconography
- **Dark Mode Ready**: CSS variables and theme system prepared
- **Playful Animations**: Confetti celebrations for successful transactions and downloads

### 📄 Receipt System
- **Digital Receipts**: Professional receipt generation with company branding
- **Multiple Formats**: Download receipts as PDF or text files
- **PDF Generation**: jsPDF library creates ATM-sized PDF receipts (80mm x 120mm)
- **Transaction Details**: Complete transaction metadata including reference IDs
- **Modal Display**: In-app receipt preview with dual download options
- **Professional Layout**: ATM-style formatting with proper spacing and typography
- **Branded Format**: ATMSim logo integration and "Designed by Muma K." attribution

### 🗄️ Data Management
- **PostgreSQL Integration**: Production-grade database with ACID compliance
- **ORM Layer**: Type-safe Drizzle ORM with automatic migrations
- **Demo Data**: Rich seed data including user "Muma Kalobwe" with transaction history
- **Development Mode**: Seamless fallback to in-memory storage for rapid development
- **Schema Versioning**: Automated database schema management

## Data Flow

1. **Authentication Flow**:
   - User enters username and PIN on login page
   - Backend validates credentials against user database
   - Successful authentication returns user data (excluding PIN)
   - Client stores user state in authentication manager

2. **Transaction Flow**:
   - User initiates deposit/withdrawal from dashboard
   - Form validation using Zod schemas
   - API request to backend with transaction data
   - Backend updates user balance and creates transaction record
   - Success response triggers balance update and receipt generation
   - Transaction history automatically refreshes

3. **Data Persistence**:
   - Production: PostgreSQL with Drizzle ORM
   - Development: In-memory storage with demo data
   - Session management for user authentication state

## Technology Stack & Dependencies

### Core Frontend Dependencies
- **React 18**: Modern React with concurrent features and automatic batching
- **TypeScript 5.x**: Static type checking and enhanced developer experience
- **@tanstack/react-query v5**: Powerful data synchronization for React applications
- **wouter**: Minimalist routing library (2KB vs 45KB for React Router)
- **react-hook-form**: Performant forms with easy validation
- **@hookform/resolvers**: Resolvers for schema validation libraries
- **tailwindcss**: Utility-first CSS framework with JIT compilation
- **@radix-ui/***: Unstyled, accessible UI primitives (20+ components)
- **lucide-react**: Beautiful & consistent icon library (1000+ icons)
- **clsx & tailwind-merge**: Utility functions for conditional CSS classes
- **zod**: TypeScript-first schema validation with static type inference
- **jspdf**: PDF generation library for creating professional receipts
- **canvas-confetti**: Interactive confetti animations for delightful user feedback

### Core Backend Dependencies
- **Express.js 4.x**: Fast, unopinionated web framework for Node.js
- **@neondatabase/serverless**: Serverless PostgreSQL driver with connection pooling
- **drizzle-orm**: Lightweight TypeScript ORM with excellent performance
- **drizzle-zod**: Integration between Drizzle ORM and Zod validation
- **express-session**: Session middleware for Express applications
- **connect-pg-simple**: PostgreSQL session store for Express sessions
- **ws**: WebSocket library for real-time connections (Neon requirement)

### Development & Build Tools
- **Vite 5**: Next-generation frontend build tool with HMR
- **esbuild**: Extremely fast JavaScript bundler and minifier
- **tsx**: TypeScript execution environment for Node.js
- **drizzle-kit**: CLI companion for Drizzle ORM schema management
- **@vitejs/plugin-react**: Official Vite plugin for React applications
- **@types/***: TypeScript definitions for enhanced development experience
- **autoprefixer**: PostCSS plugin to parse CSS and add vendor prefixes
- **postcss**: CSS transformation tool with plugin ecosystem

## Build & Deployment Strategy

### Production Build Process
- **Frontend Build**: Vite compiles React TypeScript app with tree-shaking and code splitting to `dist/public`
- **Backend Build**: esbuild bundles Express TypeScript server to optimized `dist/index.js`
- **Static Assets**: Logo files and public assets automatically copied to build directory
- **Database**: Drizzle migrations handle schema versioning and data integrity

### Environment Configuration
- **Development Environment**: 
  - Hot module replacement via Vite dev server
  - Automatic database connection with fallback to in-memory storage
  - Demo data seeding for immediate testing
- **Production Environment**: 
  - Requires `DATABASE_URL` environment variable for PostgreSQL connection
  - Optimized builds with minification and compression
  - Session persistence via PostgreSQL store
- **Database Requirements**: PostgreSQL 13+ with connection pooling support

### Available Scripts
- `npm run dev`: Development server with HMR and auto-restart
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server startup
- `npm run db:push`: Apply Drizzle schema changes to database
- `npm run db:generate`: Generate migration files from schema changes

### Deployment Readiness
The application follows modern deployment best practices with environment-aware configuration, making it ready for deployment on platforms like Vercel, Railway, or traditional VPS hosting. The PostgreSQL database can be hosted on services like Neon, Supabase, or traditional PostgreSQL providers.

## Project Structure & Git Integration

### Repository Organization
```
├── client/                 # React frontend application
│   ├── public/            # Static assets (logos, favicon)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── pages/         # Route components (login, dashboard, etc.)
│   │   └── index.css      # Global styles and Tailwind configuration
├── server/                # Express.js backend application
│   ├── db.ts             # Database connection and configuration
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Data access layer and storage interfaces
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle database schema and Zod validators
├── attached_assets/      # User-uploaded assets (logos, design files)
└── Configuration files   # Package.json, TypeScript, Tailwind, etc.
```

### Git Repository Setup
- **Clean Commit History**: Well-structured commits with descriptive messages
- **Environment Files**: .env.example template provided for required environment variables
- **Gitignore**: Comprehensive .gitignore excluding node_modules, build artifacts, and sensitive files
- **Documentation**: Complete README.md ready for GitHub with setup instructions
- **Branch Strategy**: Main branch stable and deployment-ready
- **CI/CD Ready**: Structure supports GitHub Actions or similar deployment pipelines

### Key Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required for production)
- `NODE_ENV`: Environment setting (development/production)
- `SESSION_SECRET`: Session encryption key (auto-generated in development)

### Portfolio Highlights
- **Full-Stack Architecture**: Demonstrates proficiency in modern React and Node.js development
- **Database Integration**: Production-ready PostgreSQL implementation with ORM
- **Type Safety**: End-to-end TypeScript implementation with shared schemas
- **Modern Tooling**: Vite, Drizzle ORM, TanStack Query, and other cutting-edge technologies
- **Professional UI**: Custom branding with shadcn/ui components and responsive design
- **Security Best Practices**: Secure authentication, input validation, and session management

**Project Attribution**: Designed and developed by Muma K. as a portfolio demonstration of modern full-stack web development capabilities.