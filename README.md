<<<<<<< HEAD
# 🏗️ BuildMaster — Full-Stack SaaS Platform

AI-powered project management platform for agencies. Built with React, Express, Prisma, and SQLite.

## 📁 Project Structure

```
/as-buildmaster
├── /frontend          → React + Vite + TypeScript + Tailwind
├── /backend           → Express + TypeScript + Prisma + JWT
├── /database          → Raw SQL schema + seed (reference)
└── /shared            → Shared TypeScript types
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to SQLite database
npx prisma db push

# Seed the database with demo data
npm run db:seed

# Start dev server (port 5000)
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev
```

### 3. Open in Browser

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/health
- **Prisma Studio:** `cd backend && npx prisma studio` (opens on port 5555)

## 🔐 Demo Accounts

| Role     | Email                     | Password    |
|----------|---------------------------|-------------|
| Admin    | admin@buildmaster.com     | password123 |
| Merchant | merchant@buildmaster.com  | password123 |
| User     | user@buildmaster.com      | password123 |

## 🔌 API Endpoints

### Auth
| Method | Endpoint            | Description          | Auth |
|--------|---------------------|----------------------|------|
| POST   | /api/auth/register  | Register new user    | No   |
| POST   | /api/auth/login     | Login                | No   |
| POST   | /api/auth/refresh   | Refresh access token | No   |
| GET    | /api/auth/me        | Get current user     | Yes  |

### Users
| Method | Endpoint         | Description    | Auth  |
|--------|------------------|----------------|-------|
| GET    | /api/users       | List all users | Admin |
| GET    | /api/users/:id   | Get user by ID | Yes   |

### Projects
| Method | Endpoint            | Description    | Auth           |
|--------|---------------------|----------------|----------------|
| GET    | /api/projects       | List projects  | Yes            |
| GET    | /api/projects/:id   | Get project    | Yes            |
| POST   | /api/projects       | Create project | Admin/Merchant |
| PUT    | /api/projects/:id   | Update project | Admin/Merchant |
| DELETE | /api/projects/:id   | Delete project | Admin          |

### Config
| Method | Endpoint               | Description        | Auth |
|--------|------------------------|--------------------|------|
| GET    | /api/config/:projectId | Get project config | Yes  |
| POST   | /api/config            | Upsert config      | Yes  |

### AI
| Method | Endpoint          | Description           | Auth |
|--------|-------------------|-----------------------|------|
| POST   | /api/ai/generate  | Gemini AI generation  | Yes  |

## 🧭 Frontend Routes

| Path       | Page               | Description               |
|------------|--------------------|---------------------------|
| /          | Landing Page       | Hero + role cards + CTA    |
| /login     | Login/Register     | Authentication             |
| /admin     | Admin Dashboard    | Full system management     |
| /merchant  | Merchant Dashboard | Project management + stats |
| /user      | User Dashboard     | View projects + forms      |

## 🚀 Deployment

### Frontend → Vercel
1. Push `frontend/` to a Git repo
2. Connect to Vercel
3. Set environment variable: `VITE_API_URL=https://your-backend.railway.app/api`
4. Deploy — `vercel.json` handles SPA routing

### Backend → Railway
1. Push `backend/` to a Git repo
2. Connect to Railway
3. Set environment variables:
   - `JWT_SECRET` — strong random string
   - `JWT_REFRESH_SECRET` — another strong random string  
   - `DATABASE_URL` — `file:./prod.db` (SQLite) or PostgreSQL URL
   - `FRONTEND_URL` — your Vercel frontend URL
   - `GEMINI_API_KEY` — your Gemini API key
4. Deploy — `railway.json` handles build + start

### Database Migration to PostgreSQL
1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`
2. Update `DATABASE_URL` to your PostgreSQL connection string
3. Run `npx prisma db push`
4. Run `npm run db:seed`

## 🛠️ Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React 19, Vite, TypeScript, Tailwind CSS 4    |
| Animations | Framer Motion                                 |
| Backend    | Express.js, TypeScript                        |
| Database   | SQLite (Prisma ORM)                           |
| Auth       | JWT (access + refresh tokens), bcrypt          |
| Validation | Zod                                           |
| AI         | Google Gemini API (backend proxy)              |

## 📝 License

MIT
=======
# 🚀 BuildMaster

BuildMaster is a modern full-stack SaaS platform built using a **monorepo architecture**, ensuring seamless synchronization between frontend, backend, and shared logic.

## 🏗️ Tech Stack

### Frontend
- React 19 + Vite 6
- TypeScript
- Tailwind CSS 4
- Framer Motion
- React Router DOM 7
- Axios (with interceptors)

### Backend
- Express.js (TypeScript, MVC pattern)
- Prisma ORM
- JWT Authentication
- Zod Validation

### Database
- SQLite (development)
- PostgreSQL (production-ready)

## 🔑 Key Features

- 🔐 JWT Authentication (Access + Refresh Tokens)
- 👥 Role-Based Access Control (Admin, Merchant, User)
- ⚡ Monorepo structure for consistency
- 🤖 Secure AI integration (Google Gemini via backend)
- 🎨 Smooth UI animations with Framer Motion
- 🔄 Automatic token refresh using Axios interceptors

## 🧩 Project Structure

/frontend → React UI (Vite)
/backend → Express API (MVC + Prisma)
/shared → Common TypeScript types

## 🔄 Core Workflows

### Authentication Flow
1. User logs in via `/api/auth/login`
2. Backend generates access & refresh tokens
3. Tokens stored in localStorage
4. Axios attaches token to every request
5. Expired token → auto refresh via `/api/auth/refresh`

### Role-Based Access
- **Admin** → Full system control  
- **Merchant** → Manage projects  
- **User** → Submit & track updates  

### AI Integration
- Frontend calls `/api/ai/generate`
- Backend securely communicates with Google Gemini API
- API key remains protected on the server

## 🚀 Deployment

### Backend (Railway)
Set environment variables:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `DATABASE_URL`
- `FRONTEND_URL`
- `GEMINI_API_KEY`

### Frontend (Vercel)
- Framework: Vite
- Root Directory: `frontend`
- Environment Variable:
  - `VITE_API_URL`

## ⚖️ Technical Decisions

- **Prisma** → Type-safe database operations  
- **Zod** → Strong request validation  
- **Axios Interceptors** → Clean token handling  
- **Framer Motion** → Advanced UI animations  

## 📈 Scalability

- Easily migrate to PostgreSQL  
- Add Redis for caching or rate limiting  
- Ready for Docker containerization  

## 💡 Highlights

- Type-safe full-stack development  
- Secure and scalable architecture  
- Modern UI/UX with smooth animations  
>>>>>>> 7c7a9a6cf60b3101a7f872a0364de225fb8cdd73
