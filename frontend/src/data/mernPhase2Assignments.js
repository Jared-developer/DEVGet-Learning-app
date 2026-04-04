// MERN Stack Bootcamp - Phase 2 Assignments
// Backend Development: Node.js, Express, MongoDB & Auth (Weeks 3-6)

// Week 3 End of Module Assignment
export const phase2Week3Assignment = {
    title: 'Week 3 Assignment: File-Based REST API',
    description: 'Build a RESTful API using Node.js and Express that stores data in JSON files',
    dueDate: 'End of Week 3',
    points: 100,
    tasks: [
        {
            id: 1,
            title: 'Project Setup',
            description: 'Initialize a Node.js project with Express',
            points: 15,
            requirements: [
                'Create a new project folder and initialize with npm init',
                'Install Express and nodemon as dependencies',
                'Create a .gitignore file (include node_modules)',
                'Set up package.json scripts: "start" and "dev" (using nodemon)',
                'Create a basic Express server on port 3000'
            ]
        },
        {
            id: 2,
            title: 'File System Data Storage',
            description: 'Implement file-based data storage using fs module',
            points: 25,
            requirements: [
                'Create a data.json file to store an array of books',
                'Each book should have: id, title, author, year, genre',
                'Create helper functions: readData() and writeData()',
                'Use fs/promises for async file operations',
                'Handle file read/write errors properly'
            ]
        },
        {
            id: 3,
            title: 'REST API Endpoints',
            description: 'Implement CRUD operations for books',
            points: 45,
            requirements: [
                'GET /api/books - Return all books',
                'GET /api/books/:id - Return a single book by ID',
                'POST /api/books - Add a new book (generate unique ID)',
                'PUT /api/books/:id - Update an existing book',
                'DELETE /api/books/:id - Delete a book',
                'Use express.json() middleware to parse JSON bodies',
                'Return appropriate HTTP status codes (200, 201, 404, 500)'
            ]
        },
        {
            id: 4,
            title: 'Error Handling & Validation',
            description: 'Add proper error handling and input validation',
            points: 15,
            requirements: [
                'Validate required fields (title, author) in POST/PUT requests',
                'Return 404 if book ID not found',
                'Return 400 for invalid input',
                'Use try-catch blocks for async operations',
                'Create a custom error handling middleware'
            ]
        }
    ],
    submissionGuidelines: [
        'Submit your GitHub repository URL',
        'Include a README.md with API documentation',
        'List all endpoints with example requests/responses',
        'Include instructions on how to run the server',
        'Test all endpoints using Postman or Thunder Client'
    ],
    rubric: {
        excellent: '90-100 points: All endpoints work perfectly, excellent error handling, clean code structure',
        good: '80-89 points: All CRUD operations work, good error handling, minor issues',
        satisfactory: '70-79 points: Basic CRUD works, some error handling missing',
        needsImprovement: 'Below 70: Major endpoints missing or not working'
    },
    resources: [
        'Express.js Guide: https://expressjs.com/en/guide/routing.html',
        'Node.js fs module: https://nodejs.org/api/fs.html',
        'REST API Best Practices: https://restfulapi.net/',
        'HTTP Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status'
    ],
    hints: [
        'Test each endpoint as you build it using Postman',
        'Use Date.now() to generate unique IDs',
        'Remember to write the entire array back to the file after modifications',
        'Use app.use(express.json()) before defining routes',
        'Start with GET endpoints before moving to POST/PUT/DELETE'
    ]
};

// Week 4-5 End of Module Assignment
export const phase2Week4Assignment = {
    title: 'Week 4-5 Assignment: MongoDB Blog API',
    description: 'Build a full-featured blog API using Express, MongoDB, and Mongoose',
    dueDate: 'End of Week 5',
    points: 150,
    tasks: [
        {
            id: 1,
            title: 'MongoDB Setup & Connection',
            description: 'Set up MongoDB Atlas and connect to your Express app',
            points: 20,
            requirements: [
                'Create a free MongoDB Atlas account',
                'Create a new cluster and database',
                'Install mongoose package',
                'Create a .env file with MONGODB_URI',
                'Establish database connection in your app',
                'Add connection success/error logging'
            ]
        },
        {
            id: 2,
            title: 'Mongoose Models',
            description: 'Create Mongoose schemas and models',
            points: 30,
            requirements: [
                'Create a User model (username, email, password, createdAt)',
                'Create a Post model (title, content, author ref, tags array, createdAt, updatedAt)',
                'Add validation rules (required fields, email format, min/max lengths)',
                'Create a Comment model (content, author ref, post ref, createdAt)',
                'Use proper data types and schema options',
                'Add timestamps option to schemas'
            ]
        },
        {
            id: 3,
            title: 'Blog Post CRUD Operations',
            description: 'Implement complete CRUD for blog posts',
            points: 50,
            requirements: [
                'POST /api/posts - Create a new post',
                'GET /api/posts - Get all posts (with pagination)',
                'GET /api/posts/:id - Get single post with populated author',
                'PUT /api/posts/:id - Update a post',
                'DELETE /api/posts/:id - Delete a post',
                'GET /api/posts/search?q=keyword - Search posts by title/content',
                'Implement query filters (by tag, by author)',
                'Add sorting options (newest, oldest, most commented)'
            ]
        },
        {
            id: 4,
            title: 'Comments System',
            description: 'Add commenting functionality to posts',
            points: 30,
            requirements: [
                'POST /api/posts/:id/comments - Add comment to a post',
                'GET /api/posts/:id/comments - Get all comments for a post',
                'DELETE /api/comments/:id - Delete a comment',
                'Populate author information in comments',
                'Add comment count to post responses'
            ]
        },
        {
            id: 5,
            title: 'Error Handling & Validation',
            description: 'Implement robust error handling',
            points: 20,
            requirements: [
                'Handle Mongoose validation errors',
                'Handle duplicate key errors',
                'Handle cast errors (invalid ObjectId)',
                'Create custom error handler middleware',
                'Return consistent error response format',
                'Add request validation middleware'
            ]
        }
    ],
    submissionGuidelines: [
        'Submit your GitHub repository URL',
        'Include a comprehensive README.md with API documentation',
        'Provide example requests and responses for all endpoints',
        'Include .env.example file (without actual credentials)',
        'Add Postman collection export (optional but recommended)',
        'Ensure the app runs without errors'
    ],
    rubric: {
        excellent: '135-150 points: All features work flawlessly, excellent code organization, comprehensive error handling',
        good: '120-134 points: All major features work, good structure, minor bugs',
        satisfactory: '105-119 points: Core CRUD works, basic error handling, some features incomplete',
        needsImprovement: 'Below 105: Major features missing or broken'
    },
    resources: [
        'Mongoose Documentation: https://mongoosejs.com/docs/guide.html',
        'MongoDB Atlas: https://www.mongodb.com/cloud/atlas',
        'Mongoose Validation: https://mongoosejs.com/docs/validation.html',
        'Population: https://mongoosejs.com/docs/populate.html'
    ],
    hints: [
        'Start with User and Post models before adding Comments',
        'Test database connection before building routes',
        'Use Mongoose middleware for timestamps',
        'Implement pagination using .skip() and .limit()',
        'Use .populate() to include author details in responses',
        'Consider using express-async-handler to reduce try-catch boilerplate'
    ],
    bonusChallenge: {
        description: 'Add like/unlike functionality for posts',
        points: 15,
        requirements: [
            'Add likes array to Post model (array of user IDs)',
            'POST /api/posts/:id/like - Toggle like on a post',
            'GET /api/posts/:id/likes - Get like count',
            'Prevent duplicate likes from same user'
        ]
    }
};

// Week 6 End of Module Assignment
export const phase2Week6Assignment = {
    title: 'Week 6 Assignment: Secure Authentication System',
    description: 'Implement JWT-based authentication with password hashing and protected routes',
    dueDate: 'End of Week 6',
    points: 100,
    tasks: [
        {
            id: 1,
            title: 'User Registration',
            description: 'Implement secure user registration',
            points: 25,
            requirements: [
                'POST /api/auth/register endpoint',
                'Hash passwords using bcrypt (salt rounds: 10)',
                'Validate email format and uniqueness',
                'Validate password strength (min 8 characters)',
                'Return user object (without password) and JWT token',
                'Handle duplicate email errors gracefully'
            ]
        },
        {
            id: 2,
            title: 'User Login',
            description: 'Implement login with JWT generation',
            points: 25,
            requirements: [
                'POST /api/auth/login endpoint',
                'Compare password with hashed password using bcrypt',
                'Generate JWT token with user ID and email in payload',
                'Set token expiration (e.g., 7 days)',
                'Return user object and token',
                'Return 401 for invalid credentials'
            ]
        },
        {
            id: 3,
            title: 'Protected Routes Middleware',
            description: 'Create authentication middleware',
            points: 30,
            requirements: [
                'Create auth middleware to verify JWT tokens',
                'Extract token from Authorization header (Bearer token)',
                'Verify token using jwt.verify()',
                'Attach decoded user to req.user',
                'Return 401 if token is missing or invalid',
                'Handle expired tokens appropriately'
            ]
        },
        {
            id: 4,
            title: 'Protected Endpoints',
            description: 'Secure existing endpoints with authentication',
            points: 20,
            requirements: [
                'GET /api/auth/me - Get current user profile (protected)',
                'Protect POST /api/posts (only authenticated users can create)',
                'Protect PUT /api/posts/:id (only post author can update)',
                'Protect DELETE /api/posts/:id (only post author can delete)',
                'Add authorization checks (user owns the resource)'
            ]
        }
    ],
    submissionGuidelines: [
        'Submit your GitHub repository URL',
        'Update README.md with authentication flow documentation',
        'Include example requests with Authorization headers',
        'Never commit .env file with actual secrets',
        'Test all protected routes with and without tokens',
        'Demonstrate authorization (user can only edit their own posts)'
    ],
    rubric: {
        excellent: '90-100 points: Perfect authentication flow, secure implementation, excellent error handling',
        good: '80-89 points: Auth works correctly, good security practices, minor issues',
        satisfactory: '70-79 points: Basic auth works, some security concerns',
        needsImprovement: 'Below 70: Major security issues or broken authentication'
    },
    resources: [
        'bcrypt Documentation: https://www.npmjs.com/package/bcrypt',
        'jsonwebtoken: https://www.npmjs.com/package/jsonwebtoken',
        'JWT.io: https://jwt.io/',
        'Express Middleware: https://expressjs.com/en/guide/using-middleware.html'
    ],
    hints: [
        'Store JWT_SECRET in .env file',
        'Never store passwords in plain text',
        'Use bcrypt.compare() for password verification, not manual comparison',
        'Token format in header: "Bearer <token>"',
        'Test protected routes in Postman by adding Authorization header',
        'Consider using express-async-handler for cleaner async route handlers'
    ],
    securityChecklist: [
        'Passwords are hashed with bcrypt',
        'JWT secret is stored in environment variables',
        'Tokens have expiration dates',
        'Passwords are never returned in API responses',
        'Authorization checks prevent users from modifying others\' data',
        'Input validation prevents injection attacks'
    ]
};
