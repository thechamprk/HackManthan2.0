# Deployment Guide

## Environment
1. Copy `.env.example` to `.env` and fill credentials.
2. Ensure `HINDSIGHT_API_KEY` and `GROQ_API_KEY` are set.

## Local Docker Deployment
```bash
docker compose up --build
```

- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

## Manual Deployment
### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run build
npm run preview
```
