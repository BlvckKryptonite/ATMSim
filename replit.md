# ATM Simulator - Replit.md

## Overview

This is a full-stack ATM Simulator application built with React frontend and Express backend. The application simulates a complete ATM experience including user authentication, account management, and transaction processing with receipt generation capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React Query for server state, React hooks for local state
- **Build Tool**: Vite for development and build process
- **Authentication**: Client-side authentication manager with subscription pattern

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **API Design**: RESTful API endpoints
- **Error Handling**: Centralized error middleware
- **Development**: Hot reloading with Vite integration

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle migrations
- **Development Storage**: In-memory storage class for demo data
- **Session Management**: PostgreSQL session store with connect-pg-simple

## Key Components

### Authentication System
- PIN-based authentication (4-digit numeric PIN)
- Session-based user management
- Demo users pre-populated for testing
- Secure credential validation without exposing PINs to client

### Transaction System
- Deposit and withdrawal operations
- Real-time balance updates
- Transaction history tracking
- Unique reference ID generation for each transaction
- Input validation with Zod schemas

### User Interface
- Mobile-responsive design with Tailwind CSS
- Clean ATM-like interface using shadcn/ui components
- Loading states and error handling
- Receipt generation and download functionality
- Transaction history with filtering options

### Receipt Generation
- Text-based receipt format
- Downloadable as .txt files
- Includes transaction details, timestamps, and reference IDs
- Modal-based receipt display with download option

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

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **zod**: Schema validation library
- **wouter**: Lightweight React router

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type safety
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler for production builds

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations manage schema changes

### Environment Configuration
- **Development**: Uses in-memory storage with demo data
- **Production**: Requires `DATABASE_URL` environment variable for PostgreSQL
- **Build**: Single command builds both frontend and backend

### Scripts
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server
- `npm run db:push`: Apply database schema changes

The application is designed to work seamlessly in both development (with demo data) and production (with PostgreSQL) environments, making it easy to develop and deploy.