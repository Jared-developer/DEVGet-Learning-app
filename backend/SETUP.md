# DEVGet Learning Backend Setup Guide

## 🚨 MongoDB Connection Issue Fix

If you're getting the `queryTxt ETIMEOUT cluster0.jghg09h.mongodb.net` error, it means you're trying to connect to MongoDB Atlas but there's a network issue. Here are several solutions:

## 🔧 Solution Options

### Option 1: Use Local MongoDB (Recommended for Development)

#### Windows:
1. **Download MongoDB Community Server**
   ```
   https://www.mongodb.com/try/download/community
   ```

2. **Install MongoDB**
   - Run the installer
   - Choose "Complete" installation
   - Install as a Windows Service
   - Install MongoDB Compass (optional GUI)

3. **Start MongoDB**
   ```cmd
   # MongoDB should start automatically as a service
   # If not, run:
   net start MongoDB
   ```

4. **Verify MongoDB is running**
   ```cmd
   # Open Command Prompt and run:
   mongo --version
   # or
   mongod --version
   ```

#### macOS:
1. **Install using Homebrew**
   ```bash
   # Install Homebrew if you don't have it
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **Start MongoDB**
   ```bash
   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   
   # Or run manually
   mongod --config /usr/local/etc/mongod.conf
   ```

#### Linux (Ubuntu/Debian):
1. **Install MongoDB**
   ```bash
   # Import MongoDB public GPG key
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   
   # Create list file
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   
   # Update package database
   sudo apt-get update
   
   # Install MongoDB
   sudo apt-get install -y mongodb-org
   ```

2. **Start MongoDB**
   ```bash
   # Start MongoDB service
   sudo systemctl start mongod
   
   # Enable auto-start on boot
   sudo systemctl enable mongod
   ```

### Option 2: Fix MongoDB Atlas Connection

If you prefer to use MongoDB Atlas:

1. **Check Network Access**
   - Go to MongoDB Atlas Dashboard
   - Navigate to "Network Access"
   - Add your current IP address or use `0.0.0.0/0` for development

2. **Update Connection String**
   ```bash
   # In backend/.env, update MONGODB_URI to:
   MONGODB_URI=mongodb+srv://username:password@cluster0.jghg09h.mongodb.net/devget-learning?retryWrites=true&w=majority
   ```

3. **Check Firewall/VPN**
   - Disable VPN temporarily
   - Check if your firewall is blocking the connection

### Option 3: Use Docker MongoDB

1. **Install Docker**
   - Download from https://www.docker.com/products/docker-desktop

2. **Run MongoDB in Docker**
   ```bash
   # Pull and run MongoDB
   docker run --name mongodb -d -p 27017:27017 mongo:latest
   
   # Or with authentication
   docker run --name mongodb -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest
   ```

## 🚀 Backend Setup Steps

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # The .env file is already configured for local MongoDB
   # No changes needed if using local MongoDB
   ```

4. **Set up database with sample data**
   ```bash
   npm run setup-db
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Verify the server is running**
   ```bash
   # Open browser or use curl
   curl http://localhost:5000/health
   ```

## 🧪 Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 📋 Default Test Accounts

After running `npm run setup-db`, you'll have these test accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@devget.com | admin123 |
| Instructor | instructor@devget.com | instructor123 |
| Student | student@devget.com | student123 |

## 🔍 Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running**
   ```bash
   # Windows
   tasklist /fi "imagename eq mongod.exe"
   
   # macOS/Linux
   ps aux | grep mongod
   ```

2. **Check MongoDB logs**
   ```bash
   # Windows
   # Check Windows Event Viewer or MongoDB log files
   
   # macOS
   tail -f /usr/local/var/log/mongodb/mongo.log
   
   # Linux
   sudo tail -f /var/log/mongodb/mongod.log
   ```

3. **Test MongoDB connection**
   ```bash
   # Using MongoDB shell
   mongosh
   # or older versions
   mongo
   ```

### Port Issues

1. **Check if port 5000 is available**
   ```bash
   # Windows
   netstat -an | findstr :5000
   
   # macOS/Linux
   lsof -i :5000
   ```

2. **Change port if needed**
   ```bash
   # In backend/.env
   PORT=3001
   ```

### Permission Issues

1. **MongoDB data directory permissions**
   ```bash
   # macOS/Linux
   sudo chown -R $(whoami) /usr/local/var/mongodb
   sudo chown -R $(whoami) /usr/local/var/log/mongodb
   ```

## 🎯 Next Steps

Once the backend is running successfully:

1. **Test all endpoints** using the provided curl commands
2. **Connect your frontend** to the backend API
3. **Create courses** using the instructor account
4. **Test enrollment flow** with the student account

## 📞 Need Help?

If you're still having issues:

1. Check the console output for specific error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check firewall and network settings

The backend should now be running successfully on `http://localhost:5000`! 🎉