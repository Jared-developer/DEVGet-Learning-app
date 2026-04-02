# How to Start the Application

## Prerequisites
- Node.js installed (v18 or higher)
- Both backend and frontend dependencies installed

## Step-by-Step Startup

### 1. Start Backend Server (REQUIRED)

Open a terminal and run:

```bash
cd backend
npm start
```

**Expected Output:**
```
> backend@1.0.0 start
> node server.js

Server running on port 5000
Connected to Supabase successfully
```

**Keep this terminal open!** The backend must stay running.

### 2. Start Frontend (in a NEW terminal)

Open a **new** terminal and run:

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Open Browser

Navigate to: `http://localhost:5173`

## Troubleshooting

### Backend won't start

**Error**: `Missing Supabase environment variables`

**Fix**:
```bash
# Make sure backend/.env exists with:
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
```

### Port already in use

**Error**: `Port 5000 is already in use`

**Fix**:
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
# Note the PID and kill it:
taskkill /PID <PID> /F

# Or change the port in backend/.env:
PORT=5001
```

### Frontend can't connect to backend

**Error**: `Failed to fetch` or `Network Error`

**Fix**:
1. Make sure backend is running (check terminal)
2. Verify `frontend/.env` has:
   ```
   VITE_API_URL=http://localhost:5000
   ```
3. Restart frontend after changing .env

## Quick Test

Once both servers are running, test the API:

```bash
# In a new terminal
curl http://localhost:5000/api/courses
```

You should get a JSON response with courses.

## For Get.AI Assistant to Work

1. ✅ Backend server running
2. ✅ Frontend server running
3. ✅ Logged in to the platform
4. ✅ Enrolled in a Pro course (MERN, AI/ML, Agentic AI)
5. ✅ Open the course page
6. ✅ Click the Get.AI button

## Stop Servers

Press `Ctrl+C` in each terminal to stop the servers.
