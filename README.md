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
