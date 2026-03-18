# 📄 BuildMaster Project Documentation

Welcome to the **BuildMaster** documentation. This document explains the architecture, technical decisions, and operational workflows of the platform.

---

## 🏗️ Architecture: The Monorepo Strategy

The project uses a **monorepo structure** to maintain synchronization between the frontend, backend, and database layers. This ensures that shared types and logic are always consistent.

### 1. `/frontend` (React 19 + Vite 6)
- **Framework**: React with TypeScript for type-safe UI components.
- **Styling**: Tailwind CSS 4 for a utility-first, performant design system.
- **State Management**: React Context API for global `AuthContext`.
- **Animations**: `framer-motion` (via `motion/react`) for premium page transitions, hover effects, and skeleton loaders.
- **Routing**: `react-router-dom` 7 for multi-page navigation (Landing, Login, Dashboard).
- **API Handling**: `axios` with interceptors for automatic JWT handling and token refresh.

### 2. `/backend` (Express + Prisma + JWT)
- **Framework**: Express.js with TypeScript using an MVC (Model-View-Controller) pattern.
- **Database ORM**: Prisma ORM with SQLite for local development (extensible to PostgreSQL).
- **Security**: 
  - `bcryptjs` for high-entropy password hashing.
  - `jsonwebtoken` for secure session management with access + refresh token rotation.
  - Role-based authorization middleware (`authenticate` & `authorize`).
- **Validation**: `Zod` for schema-driven request validation on all endpoints.
- **AI Integration**: Secure proxy to Google Gemini API (protecting the API key on the server).

### 3. `/shared` (Common Types)
- Centralized TypeScript interfaces for users, projects, and API responses. This prevents "contract drift" between the frontend and backend.

---

## 🛠️ How It Works: Core Workflows

### 1. The Authentication Flow
1. **User Login**: Frontend POSTs to `/api/auth/login`.
2. **Token Generation**: Backend validates credentials, generates a short-lived `accessToken` and a long-lived `refreshToken`.
3. **Frontend Persistence**: Tokens are stored in `localStorage`.
4. **Auto-Attach**: The Axios interceptor automatically adds `Authorization: Bearer <token>` to all protected requests.
5. **Silent Refresh**: If a 401 (Expired) error occurs, the frontend silently calls `/api/auth/refresh` to get a new token without interrupting the user.

### 2. Role-Based Navigation
- The platform uses **3 distinct dashboards**:
  - **Admin**: Full oversight. Can view all projects, manage system-wide settings, and check project pools.
  - **Merchant**: Focused on creation. Can create new projects, view their own project analytics, and manage their status.
  - **User**: Submission-focused. Users can view status updates on their assigned projects and submit complex intake forms.

### 3. AI-Powered Workflow
- Instead of calling Gemini directly from the browser (risky), the frontend calls `/api/ai/generate`.
- The backend appends necessary context and the API key before communicating with Google's servers.
- This ensures your API usage is audited, secure, and hidden from the client's network tab.

---

## 🚀 Deployment Guide

### STEP 1: Deploy the Backend to Railway
1. **Repository**: Push the `backend/` directory to a private GitHub repo.
2. **New Service**: Select "GitHub Repo" on Railway.
3. **Environment**: Set the following variables:
   - `JWT_SECRET`: Random 32char string.
   - `JWT_REFRESH_SECRET`: Another random 32char string.
   - `DATABASE_URL`: `file:/data/prod.db` (or a PostgreSQL URL from a Railway DB service).
   - `FRONTEND_URL`: Your Vercel frontend URL (once created).
   - `GEMINI_API_KEY`: Your Google Gemini key.
4. **Deploy**: Railway uses the provided `railway.json` to build and start the server.

### STEP 2: Deploy the Frontend to Vercel
1. **Repository**: Push the `frontend/` directory to a GitHub repo.
2. **Project Setup**:
   - Framework Preset: **Vite**.
   - Root Directory: `frontend`.
3. **Environment**:
   - `VITE_API_URL`: Use your Railway backend URL + `/api` (e.g., `https://api.yourdomain.com/api`).
4. **Deploy**: Vercel uses `vercel.json` to handle React Router's client-side navigation.

---

## ⚖️ Technical Decisions & Rationale

- **Prisma instead of raw SQL**: Provides type-safety and auto-completion in the IDE, reducing developer error during database operations.
- **Zod for Validation**: Ensures that malicious or malformed requests never reach the controller logic, acting as a first line of defense.
- **Axios Interceptors**: Keeps the frontend code clean of "token logic" by handling it globally.
- **Framer Motion**: Chosen over CSS transitions for complex layout animations and sequenced transitions that give the SaaS a "premium" feel.

---

## 📈 Future Scalability
- **PostgreSQL**: Simply change the Prisma provider to move from SQLite to a production Postgres instance.
- **Redis**: Add a Redis layer for token blacklisting or rate limiting.
- **Docker**: Both apps include standard `package.json` scripts making them easy to containerize.

---

*Prepared by senior engineering for BuildMaster Project.*
