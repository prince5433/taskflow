# 🚀 TaskFlow — Full-Stack Task Management Platform

A scalable REST API with **JWT Authentication**, **Role-Based Access Control (RBAC)**, and a modern **React** frontend for task management.

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-blue?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-green?logo=mongodb)
![React](https://img.shields.io/badge/React-18-blue?logo=react)

---

## 📋 Features

### Backend
- ✅ **User Registration & Login** — bcrypt password hashing + JWT tokens
- ✅ **Role-Based Access Control** — `user` and `admin` roles
- ✅ **Full CRUD for Tasks** — create, read, update, delete with ownership checks
- ✅ **API Versioning** — all routes under `/api/v1/`
- ✅ **Input Validation** — express-validator on all endpoints
- ✅ **Global Error Handling** — structured JSON responses with Mongoose error parsing
- ✅ **API Documentation** — Swagger UI at `/api-docs`
- ✅ **Security** — Helmet, CORS, rate limiting, body size limits
- ✅ **Pagination & Filtering** — query tasks by status, priority with pagination
- ✅ **Task Analytics** — aggregation endpoint for task statistics

### Frontend
- ✅ **Modern React UI** — Vite + React 18 with React Router
- ✅ **JWT Token Management** — localStorage + axios interceptors
- ✅ **Protected Routes** — dashboard requires authentication
- ✅ **Full Task CRUD** — create, edit, delete tasks via modal UI
- ✅ **Inline Status Updates** — change task status directly from cards
- ✅ **Stats Dashboard** — real-time task statistics
- ✅ **Filters** — filter by status and priority
- ✅ **Toast Notifications** — success/error feedback from API
- ✅ **Premium Dark Theme** — glassmorphism, gradients, animations
- ✅ **Responsive Design** — works on desktop, tablet, mobile

---

## 🏗️ Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, Login, GetMe
│   │   │   └── taskController.js   # CRUD + Stats
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification
│   │   │   ├── rbac.js             # Role-based access
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   └── validate.js         # express-validator runner
│   │   ├── models/
│   │   │   ├── User.js             # User schema (bcrypt hashing)
│   │   │   └── Task.js             # Task schema (indexes)
│   │   ├── routes/v1/
│   │   │   ├── authRoutes.js       # Auth endpoints
│   │   │   └── taskRoutes.js       # Task endpoints
│   │   ├── utils/
│   │   │   └── generateToken.js    # JWT generation
│   │   └── server.js               # Express entry point
│   ├── swagger.js                   # OpenAPI 3.0 spec
│   ├── .env                        # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskModal.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios instance + interceptors
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                # Premium dark theme
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── README.md
└── SCALABILITY.md
```

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **MongoDB** running locally or a MongoDB Atlas connection string

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start the Application

```bash
# Terminal 1 — Start backend
cd backend
npm run dev

# Terminal 2 — Start frontend
cd frontend
npm run dev
```

- **API**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:5000/api-docs

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login & get JWT |
| GET | `/api/v1/auth/me` | Private | Get current user profile |
| GET | `/api/v1/auth/users` | Admin | Get all users |

### Tasks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/tasks` | Private | List tasks (paginated, filterable) |
| GET | `/api/v1/tasks/stats` | Private | Task statistics |
| GET | `/api/v1/tasks/:id` | Private | Get single task |
| POST | `/api/v1/tasks` | Private | Create task |
| PUT | `/api/v1/tasks/:id` | Private | Update task (owner/admin) |
| DELETE | `/api/v1/tasks/:id` | Private | Delete task (owner/admin) |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | API health check |

---

## 🔐 Security Features

- **Password Hashing** — bcrypt with 12 salt rounds
- **JWT Authentication** — tokens in `Authorization: Bearer <token>` header
- **Role-Based Access** — user vs admin permissions on all endpoints
- **Rate Limiting** — 100 requests / 15 minutes per IP
- **Helmet** — security HTTP headers
- **CORS** — configured origin restriction
- **Body Size Limit** — 10KB max request body
- **Input Sanitization** — express-validator on all inputs
- **Ownership Checks** — users can only modify their own tasks

---

## 🗄️ Database Schema

### User
| Field | Type | Constraints |
|-------|------|-------------|
| name | String | Required, 2-50 chars |
| email | String | Required, unique, valid email |
| password | String | Required, min 6 chars, hashed (select: false) |
| role | String | Enum: user/admin, default: user |
| createdAt | Date | Auto-generated |

### Task
| Field | Type | Constraints |
|-------|------|-------------|
| title | String | Required, 3-100 chars |
| description | String | Optional, max 500 chars |
| status | String | Enum: todo/in-progress/done, default: todo |
| priority | String | Enum: low/medium/high, default: medium |
| dueDate | Date | Optional |
| createdBy | ObjectId | Ref to User, required |
| createdAt | Date | Auto-generated |

**Indexes**: Compound indexes on `(createdBy, status)` and `(createdBy, priority)` for query performance.

---

## 📖 API Documentation

Interactive Swagger documentation is available at:
```
http://localhost:5000/api-docs
```

---

## 🧪 Testing the API

### Register a user
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create a task (use token from login response)
```bash
curl -X POST http://localhost:5000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Complete API docs","description":"Write Swagger documentation","priority":"high"}'
```

---

## 📄 License

ISC
