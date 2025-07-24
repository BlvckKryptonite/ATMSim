# ATMSim - Professional ATM Simulator

<div align="center">
  <img src="client/public/atm-sim-logo.png" alt="ATMSim Logo" height="80">
  
  <p><strong>A sophisticated full-stack ATM simulator built with modern web technologies</strong></p>
  
  [![Built with React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
  [![Built with TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
  [![Built with Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql)](https://www.postgresql.org/)
</div>

## 🚀 Live Demo

**Demo Accounts:**
- Username: `demo1` | PIN: `1234`
- Username: `demo2` | PIN: `5678`
- Username: `muma` | PIN: `9999` (Featured account with transaction history)

## ✨ Features

### 🔐 Security & Authentication
- **PIN-based Authentication**: 4-digit secure PIN system
- **Session Management**: PostgreSQL-backed session persistence
- **Server-side Validation**: Zero credential exposure to client
- **Auto-logout**: Session timeout controls

### 💰 Banking Operations
- **Real-time Transactions**: Instant deposit and withdrawal processing
- **Balance Management**: Live balance updates across all operations
- **Transaction History**: Complete audit trail with timestamps and reference IDs
- **Overdraft Protection**: Built-in balance validation

### 🎨 Modern User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Professional UI**: ATM-style interface using shadcn/ui components
- **Loading States**: Skeleton loading and progress indicators
- **Confetti Animations**: Playful success celebrations for transactions
- **Custom Branding**: Integrated logo with credit card iconography

### 📄 Receipt System
- **PDF Generation**: Professional ATM-sized receipts (80mm x 120mm)
- **Multiple Formats**: Download as PDF or text files
- **Dual Download Options**: Separate buttons for different formats
- **Branded Receipts**: Company branding and attribution included

### 🗄️ Data Management
- **PostgreSQL Database**: Production-grade ACID-compliant storage
- **Drizzle ORM**: Type-safe database operations with zero runtime overhead
- **Development Fallback**: In-memory storage for rapid prototyping
- **Auto-migrations**: Seamless schema management

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite 5** for lightning-fast builds and HMR
- **TanStack Query v5** for server state management
- **Tailwind CSS** with utility-first styling
- **shadcn/ui** component system built on Radix UI
- **React Hook Form** with Zod validation
- **jsPDF** for professional receipt generation
- **canvas-confetti** for delightful animations

### Backend
- **Express.js 4.x** with TypeScript
- **Node.js v20** with ES modules
- **Drizzle ORM** with PostgreSQL
- **Express Sessions** with PostgreSQL store
- **Zod** schema validation
- **RESTful API** architecture

### Database & Deployment
- **PostgreSQL 15+** (Neon Database)
- **Vercel/Heroku** deployment ready
- **Environment-aware** configuration
- **Custom domain** support

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/atmsim.git
   cd atmsim
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5000`

## 📊 Project Structure

```
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and configurations
│   │   └── pages/         # Route components
├── server/                # Express.js backend
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API endpoints
│   ├── storage.ts        # Data access layer
│   └── index.ts          # Server entry point
├── shared/               # Shared types and schemas
└── Configuration files   # TypeScript, Tailwind, etc.
```

## 🌐 Deployment

Ready for deployment on multiple platforms:

- **[Vercel](./DEPLOYMENT.md#vercel-deployment)** (Recommended)
- **[Heroku](./DEPLOYMENT.md#heroku-deployment)**
- **Railway, Netlify, or any Node.js hosting**

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🎯 Portfolio Highlights

This project demonstrates:
- **Full-Stack Architecture**: Modern React frontend with Express.js backend
- **Database Integration**: Production-ready PostgreSQL with ORM
- **Type Safety**: End-to-end TypeScript implementation
- **Modern Tooling**: Vite, Drizzle ORM, TanStack Query
- **Professional UI**: Custom branding with responsive design
- **Security Best Practices**: Secure authentication and input validation
- **User Experience**: Delightful animations and professional receipt generation

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - User login with PIN
- `POST /api/auth/logout` - User logout

### User Operations
- `GET /api/users/:id` - Get user profile
- `POST /api/users/:id/deposit` - Process deposit
- `POST /api/users/:id/withdraw` - Process withdrawal
- `GET /api/users/:id/transactions` - Get transaction history

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Designed and Developed by Muma K.**

A portfolio project demonstrating modern full-stack web development capabilities with React, TypeScript, Node.js, and PostgreSQL.

---

<div align="center">
  <p>Built with ❤️ using modern web technologies</p>
</div>