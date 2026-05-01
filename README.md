# TeamFlow - Team Task Manager

A full-stack web app for project & task management with role-based access (Admin/Member).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcryptjs |
| Deploy | Railway |

---

## Project Structure

```
teamflow/
├── backend/
│   ├── models/         # Mongoose models (User, Project, Task)
│   ├── routes/         # REST API routes
│   ├── middleware/      # JWT auth middleware
│   ├── server.js       # Express server entry
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/      # React pages (Login, Dashboard, Projects, etc.)
│   │   ├── components/ # Layout, Badges, TaskModal, Toast
│   │   ├── api.js      # Axios API calls
│   │   ├── AuthContext.js
│   │   └── App.js
│   ├── public/
│   └── package.json
├── team-task-manager.html  # Standalone single-file version (no setup needed)
└── README.md
```

---

## Local Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm install
npm run dev
# Runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start
# Runs on http://localhost:3000
```

---

## API Endpoints

### Auth
| Method | URL | Access |
|--------|-----|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Private |

### Projects
| Method | URL | Access |
|--------|-----|--------|
| GET | /api/projects | All users |
| POST | /api/projects | Admin only |
| PUT | /api/projects/:id | Admin only |
| DELETE | /api/projects/:id | Admin only |

### Tasks
| Method | URL | Access |
|--------|-----|--------|
| GET | /api/tasks | Admin: all / Member: own |
| GET | /api/tasks/my | Own tasks |
| POST | /api/tasks | Admin only |
| PUT | /api/tasks/:id | Admin (all fields) / Member (status only) |
| DELETE | /api/tasks/:id | Admin only |

### Users
| Method | URL | Access |
|--------|-----|--------|
| GET | /api/users | Admin only |
| PUT | /api/users/:id/role | Admin only |

---

## Role Permissions

| Feature | Admin | Member |
|---------|-------|--------|
| View all projects | ✅ | ✅ |
| Create/Edit/Delete projects | ✅ | ❌ |
| View all tasks | ✅ | Own only |
| Create/Assign tasks | ✅ | ❌ |
| Update task status | ✅ | Own only |
| Delete tasks | ✅ | ❌ |
| Manage team roles | ✅ | ❌ |

---

## Deploy on Railway

### Backend

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Add MongoDB service (Railway provides free MongoDB)
3. Set environment variables:
   ```
   MONGO_URI=<your_railway_mongo_url>
   JWT_SECRET=your_secret_key_here
   PORT=5000
   NODE_ENV=production
   ```
4. Set start command: `node server.js`
5. Root directory: `backend`

### Frontend

1. New Service in same Railway project → GitHub repo
2. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```
3. Build command: `npm run build`
4. Start command: `npx serve -s build`
5. Root directory: `frontend`

---

## Quick Demo (No Setup)

Open `team-task-manager.html` directly in a browser — fully functional standalone version with in-memory data.
