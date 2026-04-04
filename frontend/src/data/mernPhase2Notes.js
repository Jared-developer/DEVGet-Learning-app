// MERN Stack Bootcamp - Phase 2 Detailed Notes
// Backend Development: Node.js, Express, MongoDB & Auth (Weeks 3-6)

export const phase2Week3Lesson1 = {
  title: 'What is Node.js?',
  videoUrl: 'https://www.youtube.com/embed/TlB_eWDSMt4',
  notes: `# 3.1 What is Node.js?

**Definition**: Node.js is not a language; it's a JavaScript runtime environment built on Chrome's V8 engine.

## The Big Shift
Before Node, JavaScript only ran in the browser. Now, JavaScript can run on a server, read files, access databases, and act as a web server.

## The Event Loop
Node is single-threaded but uses an event loop for non-blocking I/O operations. This makes it incredibly efficient for I/O-heavy tasks (like API servers).

## CommonJS vs ES Modules
Node has two ways of handling modules (importing/exporting files).`,
  codeSnippet: `// CommonJS (Older, but still very common)
// --- file: math.js ---
const add = (a, b) => a + b;
module.exports = { add };

// --- file: index.js ---
const math = require('./math.js');
console.log(math.add(2, 3));

// ES Modules (Newer, standard for React and modern Node)
// --- file: math.js ---
export const add = (a, b) => a + b;

// --- file: index.js ---
import { add } from './math.js';
console.log(add(2, 3));

// Note: To use ES Modules, add "type": "module" to package.json`
};

export const phase2Week3Lesson2 = {
  title: 'NPM (Node Package Manager)',
  videoUrl: 'https://www.youtube.com/embed/P3aKRdUyr0s',
  notes: `# 3.2 NPM (Node Package Manager)

NPM is a giant library of code written by other developers that you can use in your projects.

- **package.json**: The manifest file of your project. Lists dependencies, scripts, and metadata.
- **node_modules**: The folder where all downloaded packages live. Never commit this to Git!`,
  codeSnippet: `# Start a new project (creates package.json)
npm init -y

# Install a package as a dependency
npm install express

# Install a package as a dev dependency
npm install --save-dev nodemon

# Uninstall a package
npm uninstall express`
};

export const phase2Week3Lesson3 = {
  title: 'File System Module (fs)',
  videoUrl: 'https://www.youtube.com/embed/U57kU311-nE',
  notes: `# 3.3 File System Module (fs)

Before databases, we can use files for storage. The \`fs\` module is built into Node.`,
  codeSnippet: `import fs from 'fs/promises'; // Using promise-based version

async function readData() {
  try {
    const data = await fs.readFile('./data.json', 'utf-8');
    const jsonData = JSON.parse(data);
    console.log(jsonData);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}

async function writeData(newData) {
  try {
    const jsonString = JSON.stringify(newData, null, 2);
    await fs.writeFile('./data.json', jsonString);
    console.log('Data saved!');
  } catch (error) {
    console.error('Error writing file:', error);
  }
}`
};

export const phase2Week3Lesson4 = {
  title: 'Creating a Basic HTTP Server',
  videoUrl: 'https://www.youtube.com/embed/VShtPwEkDD0',
  notes: `# 3.4 Creating a Basic HTTP Server

You don't need Express to create a server; Node has a built-in \`http\` module.`,
  codeSnippet: `import http from 'http';

const server = http.createServer((req, res) => {
  // req: incoming request object (url, headers, method)
  // res: outgoing response object
  
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Welcome to the homepage!');
  } else if (req.url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('About us');
  } else {
    res.writeHead(404);
    res.end('Page not found');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`Server running at http://localhost:\${PORT}/\`);
});`
};

export const phase2Week4Lesson1 = {
  title: 'Why Express?',
  videoUrl: 'https://www.youtube.com/embed/L72fhGm1tfE',
  notes: `# 4.1 Why Express?

The built-in \`http\` module is verbose and requires manual routing. Express is a minimalist web framework that sits on top of Node and simplifies server creation.`,
  codeSnippet: `import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Routes
app.get('/', (req, res) => {
  res.send('Hello World from Express!');
});

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'Alice' }]);
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
});`
};

export const phase2Week4Lesson2 = {
  title: 'RESTful API Design',
  videoUrl: 'https://www.youtube.com/embed/Q-BpqyOT3a8',
  notes: `# 4.2 RESTful API Design

REST is an architectural style for designing networked applications. It uses standard HTTP methods and status codes.

| Purpose | HTTP Method | URL Pattern | What it does |
|---------|-------------|-------------|--------------|
| Create | POST | /api/books | Add a new book |
| Read (All) | GET | /api/books | Get list of all books |
| Read (One) | GET | /api/books/:id | Get a specific book |
| Update (Full) | PUT | /api/books/:id | Replace an entire book |
| Update (Partial) | PATCH | /api/books/:id | Update part of a book |
| Delete | DELETE | /api/books/:id | Remove a book |`,
  codeSnippet: `// RESTful API Example
app.get('/api/books', (req, res) => {
  // Get all books
});

app.get('/api/books/:id', (req, res) => {
  // Get one book
});

app.post('/api/books', (req, res) => {
  // Create a book
});

app.put('/api/books/:id', (req, res) => {
  // Update a book
});

app.delete('/api/books/:id', (req, res) => {
  // Delete a book
});`
};

export const phase2Week5Lesson1 = {
  title: 'MongoDB & Mongoose ODM',
  videoUrl: 'https://www.youtube.com/embed/ofme2o29ngU',
  notes: `# 5.1 SQL vs NoSQL

**SQL (Relational)**: Tables, rows, columns. Strict schema. Good for complex transactions.

**NoSQL (Non-relational)**: Collections, documents (JSON-like). Flexible schema. Good for scalability.

MongoDB is a NoSQL database. Data is stored as BSON (similar to JSON).

## Mongoose
Mongoose is an ODM (Object Document Mapper). It provides a schema-based solution to model your data.`,
  codeSnippet: `import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;`
};

export const phase2Week5Lesson2 = {
  title: 'Mongoose Schemas & Models',
  videoUrl: 'https://www.youtube.com/embed/DZBGEVgL2eE',
  notes: `# Defining a Schema & Model

A Schema defines the structure of a document.`,
  codeSnippet: `import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    min: [1000, 'Year too old'],
    max: [2024, 'Year cannot be in the future']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Book = mongoose.model('Book', bookSchema);
export default Book;`
};

export const phase2Week6Lesson1 = {
  title: 'Password Hashing with bcrypt',
  videoUrl: 'https://www.youtube.com/embed/Ud5xKCYQTjM',
  notes: `# 6.1 Hashing Passwords with bcrypt

Never store plain text passwords. bcrypt hashes passwords with a salt.`,
  codeSnippet: `import bcrypt from 'bcrypt';

const saltRounds = 10;

async function hashPassword(plainPassword) {
  const hashed = await bcrypt.hash(plainPassword, saltRounds);
  return hashed;
}

async function comparePassword(plainPassword, hashedPassword) {
  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  return isMatch; // true or false
}`
};

export const phase2Week6Lesson2 = {
  title: 'JWT Authentication',
  videoUrl: 'https://www.youtube.com/embed/mbsmsi7l3r4',
  notes: `# 6.2 JWT (JSON Web Tokens)

JWT is an open standard for securely transmitting information between parties as a JSON object.

Structure: xxxxx.yyyyy.zzzzz (Header.Payload.Signature)`,
  codeSnippet: `import jwt from 'jsonwebtoken';

// Generate a token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Verify a token (middleware)
const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token failed' });
  }
};`
};


// Week 3 Quiz
export const phase2Week3Quiz = {
  title: 'Week 3 Quiz: Node.js Basics',
  questions: [
    {
      id: 1,
      question: 'What is Node.js?',
      options: [
        'A JavaScript framework',
        'A JavaScript runtime built on Chrome\'s V8 engine',
        'A database',
        'A web browser'
      ],
      correctAnswer: 1,
      explanation: 'Node.js is a JavaScript runtime environment that allows you to run JavaScript on the server side.'
    },
    {
      id: 2,
      question: 'Which command installs a package and saves it as a dependency?',
      options: [
        'npm install package',
        'npm install package --save',
        'npm install package --save-dev',
        'Both A and B'
      ],
      correctAnswer: 3,
      explanation: 'npm install package automatically saves it as a dependency in package.json (--save is now default).'
    },
    {
      id: 3,
      question: 'Which module is used to work with file system in Node.js?',
      options: [
        'http',
        'fs',
        'path',
        'file'
      ],
      correctAnswer: 1,
      explanation: 'The fs (File System) module provides methods to work with files and directories.'
    },
    {
      id: 4,
      question: 'What is the default port for HTTP?',
      options: [
        '80',
        '443',
        '3000',
        '8080'
      ],
      correctAnswer: 0,
      explanation: 'Port 80 is the default port for HTTP, while 443 is for HTTPS.'
    },
    {
      id: 5,
      question: 'Which method is used to create a server in Node.js?',
      options: [
        'http.createServer()',
        'http.server()',
        'server.create()',
        'node.createServer()'
      ],
      correctAnswer: 0,
      explanation: 'http.createServer() creates an HTTP server that listens for requests.'
    }
  ]
};

// Week 4-5 Quiz
export const phase2Week4Quiz = {
  title: 'Week 4-5 Quiz: Express.js & MongoDB',
  questions: [
    {
      id: 1,
      question: 'What is Express.js?',
      options: [
        'A database',
        'A web application framework for Node.js',
        'A front-end library',
        'A testing tool'
      ],
      correctAnswer: 1,
      explanation: 'Express.js is a minimal and flexible Node.js web application framework.'
    },
    {
      id: 2,
      question: 'Which HTTP method is used to retrieve data?',
      options: [
        'POST',
        'PUT',
        'GET',
        'DELETE'
      ],
      correctAnswer: 2,
      explanation: 'GET is used to retrieve data from a server without modifying it.'
    },
    {
      id: 3,
      question: 'What type of database is MongoDB?',
      options: [
        'SQL database',
        'NoSQL document database',
        'Graph database',
        'Key-value store'
      ],
      correctAnswer: 1,
      explanation: 'MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents.'
    },
    {
      id: 4,
      question: 'What is Mongoose?',
      options: [
        'A MongoDB driver',
        'An ODM (Object Data Modeling) library for MongoDB',
        'A database',
        'A web framework'
      ],
      correctAnswer: 1,
      explanation: 'Mongoose is an ODM library that provides schema-based modeling for MongoDB data.'
    },
    {
      id: 5,
      question: 'Which Express method is used to handle POST requests?',
      options: [
        'app.get()',
        'app.post()',
        'app.put()',
        'app.send()'
      ],
      correctAnswer: 1,
      explanation: 'app.post() is used to define routes that handle POST requests.'
    }
  ]
};

// Week 6 Quiz
export const phase2Week6Quiz = {
  title: 'Week 6 Quiz: Authentication & Security',
  questions: [
    {
      id: 1,
      question: 'What is bcrypt used for?',
      options: [
        'Encrypting data',
        'Hashing passwords',
        'Creating tokens',
        'Validating emails'
      ],
      correctAnswer: 1,
      explanation: 'bcrypt is used to hash passwords securely before storing them in a database.'
    },
    {
      id: 2,
      question: 'What does JWT stand for?',
      options: [
        'Java Web Token',
        'JSON Web Token',
        'JavaScript Web Tool',
        'Joint Web Technology'
      ],
      correctAnswer: 1,
      explanation: 'JWT stands for JSON Web Token, used for secure authentication and information exchange.'
    },
    {
      id: 3,
      question: 'Which part of a JWT contains the actual data?',
      options: [
        'Header',
        'Payload',
        'Signature',
        'Body'
      ],
      correctAnswer: 1,
      explanation: 'The payload contains the claims (data) you want to transmit.'
    },
    {
      id: 4,
      question: 'Should you store passwords in plain text?',
      options: [
        'Yes, for easy retrieval',
        'No, always hash them',
        'Only for development',
        'Yes, if the database is secure'
      ],
      correctAnswer: 1,
      explanation: 'Never store passwords in plain text. Always hash them using algorithms like bcrypt.'
    },
    {
      id: 5,
      question: 'Where should JWT tokens be stored on the client side?',
      options: [
        'localStorage',
        'sessionStorage',
        'httpOnly cookies',
        'All are acceptable depending on use case'
      ],
      correctAnswer: 3,
      explanation: 'Each storage method has trade-offs. httpOnly cookies are most secure against XSS, but localStorage/sessionStorage offer more flexibility.'
    }
  ]
};
