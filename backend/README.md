# DEVGet Learning Backend API

A comprehensive Node.js/Express backend for the DEVGet Learning platform, providing authentication, course management, enrollment tracking, and progress monitoring.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Profile management, preferences, and admin controls
- **Course Management**: CRUD operations for courses, modules, and lessons
- **Enrollment System**: Course enrollment, progress tracking, and completion
- **Progress Analytics**: Detailed learning analytics and streak tracking
- **Security**: Rate limiting, input validation, and security headers
- **Database**: MongoDB with Mongoose ODM

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/devget-learning
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890",
  "experienceLevel": "beginner",
  "learningGoals": "Learn web development"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "experienceLevel": "intermediate"
}
```

### Course Endpoints

#### Get All Courses
```http
GET /courses?category=basics&level=beginner&page=1&limit=10
```

#### Get Single Course
```http
GET /courses/:id
```

#### Create Course (Instructor/Admin)
```http
POST /courses
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "JavaScript Fundamentals",
  "description": "Learn JavaScript from scratch",
  "category": "basics",
  "level": "beginner",
  "duration": "8 weeks"
}
```

### Enrollment Endpoints

#### Enroll in Course
```http
POST /enrollments
Authorization: Bearer <token>
Content-Type: application/json

{
  "courseId": "course_id_here"
}
```

#### Get User Enrollments
```http
GET /enrollments
Authorization: Bearer <token>
```

#### Update Progress
```http
PUT /enrollments/:id/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "lessonId": "lesson_id_here",
  "timeSpent": 30,
  "score": 85
}
```

### Progress Endpoints

#### Get Overall Progress
```http
GET /progress
Authorization: Bearer <token>
```

#### Get Course Progress
```http
GET /progress/course/:courseId
Authorization: Bearer <token>
```

#### Get Learning Streak
```http
GET /progress/streak
Authorization: Bearer <token>
```

### User Endpoints

#### Get Dashboard Data
```http
GET /users/dashboard
Authorization: Bearer <token>
```

#### Update Preferences
```http
PUT /users/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailNotifications": true,
  "courseUpdates": true,
  "marketingEmails": false
}
```

## 🗄️ Database Models

### User Model
- Personal information (name, email, phone)
- Authentication (password, tokens)
- Profile (bio, experience level, learning goals)
- Preferences (notifications, settings)
- Role-based access (student, instructor, admin)

### Course Model
- Course details (title, description, category, level)
- Modules and lessons structure
- Instructor information
- Publishing status and settings
- Enrollment and rating statistics

### Enrollment Model
- Student-course relationship
- Progress tracking (completed lessons, time spent)
- Current lesson position
- Notes and bookmarks
- Completion status and certificates

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevent API abuse
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Secure cross-origin requests
- **Security Headers**: Helmet.js for security headers

## 🚦 Error Handling

The API uses consistent error response format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Project Structure

```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Global error handler
├── models/
│   ├── User.js              # User model
│   ├── Course.js            # Course model
│   └── Enrollment.js        # Enrollment model
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management routes
│   ├── courses.js           # Course management routes
│   ├── enrollments.js       # Enrollment routes
│   └── progress.js          # Progress tracking routes
├── uploads/                 # File upload directory
├── .env                     # Environment variables
├── .env.example             # Environment template
├── server.js                # Main server file
└── package.json             # Dependencies and scripts
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/devget-learning` |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | `900000` (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | `100` |

## 🚀 Deployment

### Production Setup

1. **Set environment variables**
   ```bash
   NODE_ENV=production
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

2. **Install production dependencies**
   ```bash
   npm ci --only=production
   ```

3. **Start the server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📈 Monitoring

The API includes health check endpoint:

```http
GET /health
```

Response:
```json
{
  "status": "success",
  "message": "DEVGet Learning API is running",
  "timestamp": "2026-03-15T10:30:00.000Z",
  "environment": "development"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run tests and ensure they pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.