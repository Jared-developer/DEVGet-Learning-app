// MERN Stack Bootcamp - Phase 3 Detailed Notes
// Frontend Development: React.js from Zero to Hero (Weeks 7-11)

export const phase3Week7Lesson1 = {
  title: 'What is React?',
  videoUrl: 'https://www.youtube.com/embed/Tn6-PIqc4UM',
  notes: `# 7.1 What is React?

**Definition**: React is a JavaScript library for building user interfaces. It's not a framework (like Angular); it's a library focused solely on the "View" layer.

## The Component Model
Everything in React is a component. A component is a reusable piece of code that returns HTML (via JSX).

## The Virtual DOM
React keeps a lightweight copy of the real DOM. When state changes, React updates the Virtual DOM, compares it to the previous version (diffing), and then efficiently updates only the necessary parts of the real DOM (reconciliation).`,
  codeSnippet: `// Simple React Component
function Welcome() {
  return <h1>Hello, React!</h1>;
}

// Component with props
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Using components
function App() {
  return (
    <div>
      <Welcome />
      <Greeting name="Alice" />
      <Greeting name="Bob" />
    </div>
  );
}`
};

export const phase3Week7Lesson2 = {
  title: 'Setting Up React with Vite',
  videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8',
  notes: `# 7.2 Setting Up a React Project

## Vite (Recommended over Create React App)
Vite is faster and more modern than CRA.

## Project Structure
- **public/**: Static assets (images, favicon)
- **src/**: Your application code
  - **assets/**: Images, fonts, etc.
  - **components/**: Reusable components
  - **pages/**: Page-level components
  - **App.jsx**: Main component
  - **main.jsx**: Entry point`,
  codeSnippet: `# Create new React project with Vite
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev

# Project will run on http://localhost:5173`
};

export const phase3Week7Lesson3 = {
  title: 'JSX & Components',
  videoUrl: 'https://www.youtube.com/embed/7fPXI_MnBOY',
  notes: `# 7.3 JSX (JavaScript XML)

JSX looks like HTML but it's actually JavaScript. It gets transpiled to React.createElement() calls.

## Rules of JSX:
1. Return a single root element
2. Use className instead of class
3. Close every tag
4. Use curly braces {} for JavaScript expressions`,
  codeSnippet: `function Greeting() {
  const name = "Alice";
  const isLoggedIn = true;
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
      {isLoggedIn ? <p>Welcome back!</p> : <p>Please sign in</p>}
      <img src="/images/avatar.png" alt="Avatar" className="avatar" />
    </div>
  );
}

// Fragment shorthand (no extra div)
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}`
};

export const phase3Week7Lesson4 = {
  title: 'Props & Component Communication',
  videoUrl: 'https://www.youtube.com/embed/m7OWXtbiXX8',
  notes: `# 7.4 Components & Props

## Functional Components
Components are just functions that return JSX.

## Props are Read-Only
Never modify props inside a component. Props are for passing data down.

## Children Prop
Special prop for passing content between opening and closing tags.`,
  codeSnippet: `// Component with props
const Welcome = ({ name, age }) => {
  return <h1>Hello, {name}! You are {age} years old.</h1>;
};

// Children prop
const Card = ({ children, title }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

// Usage
function App() {
  return (
    <div>
      <Welcome name="Alice" age={25} />
      <Card title="Profile">
        <p>This is the card content</p>
        <button>Click me</button>
      </Card>
    </div>
  );
}`
};

export const phase3Week7Lesson5 = {
  title: 'State with useState',
  videoUrl: 'https://www.youtube.com/embed/O6P86uwfdR0',
  notes: `# 7.5 State with useState

State is data that can change over time. When state changes, the component re-renders.

## Important Rules of Hooks
1. Only call hooks at the top level
2. Only call hooks from React function components
3. State updates are asynchronous`,
  codeSnippet: `import { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);
  };
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={increment}>Click me</button>
    </div>
  );
};

// Functional update (when new state depends on old state)
const handleClick = () => {
  setCount(prevCount => prevCount + 1);
  setCount(prevCount => prevCount + 1); // Adds 2
};`
};

export const phase3Week7Lesson6 = {
  title: 'Lists and Keys',
  videoUrl: 'https://www.youtube.com/embed/0sasRxl35_8',
  notes: `# 7.6 Lists and Keys

When rendering lists, React needs a unique key prop to identify items efficiently.

## Why Keys Matter
Keys help React identify which items have changed, been added, or removed.

## Don't Use Index as Key
If the list order changes, using indexes can cause bugs.`,
  codeSnippet: `const TodoList = ({ todos }) => {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          {todo.text}
        </li>
      ))}
    </ul>
  );
};

// Usage
const todos = [
  { id: 1, text: 'Learn React' },
  { id: 2, text: 'Build a project' },
  { id: 3, text: 'Deploy app' }
];

<TodoList todos={todos} />`
};

export const phase3Week8Lesson1 = {
  title: 'useEffect Hook',
  videoUrl: 'https://www.youtube.com/embed/0ZJgIjIuY7U',
  notes: `# 8.1 The useEffect Hook

useEffect lets you perform side effects in function components:
- Fetching data
- Directly manipulating the DOM
- Setting up subscriptions/timers

## Effect Dependency Array
Controls when the effect runs.`,
  codeSnippet: `import { useState, useEffect } from 'react';

const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Runs ONLY ONCE after mount
  useEffect(() => {
    console.log('Component mounted');
    
    return () => {
      console.log('Component unmounted');
    };
  }, []);
  
  // Runs when userId changes
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await fetch(\`/api/users/\${userId}\`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    };
    
    fetchUser();
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  return <div>{user?.name}</div>;
};`
};

export const phase3Week8Lesson2 = {
  title: 'Conditional Rendering',
  videoUrl: 'https://www.youtube.com/embed/4oCVDkb_EIs',
  notes: `# 8.2 Conditional Rendering

Multiple ways to conditionally render content in React.

## Methods:
1. If/else statements
2. Ternary operator
3. Logical && operator
4. Switch statements`,
  codeSnippet: `const Greeting = ({ isLoggedIn, hasNotifications }) => {
  // 1. If/else (outside JSX)
  if (!isLoggedIn) {
    return <LoginButton />;
  }
  
  return (
    <div>
      {/* 2. Ternary operator */}
      <h2>Welcome {isLoggedIn ? 'back!' : 'guest!'}</h2>
      
      {/* 3. Logical && */}
      {hasNotifications && <div>You have new messages!</div>}
      
      {/* 4. Null to render nothing */}
      {hasNotifications > 10 ? <Alert /> : null}
    </div>
  );
};`
};

export const phase3Week8Lesson3 = {
  title: 'Forms in React',
  videoUrl: 'https://www.youtube.com/embed/IkMND33x0qQ',
  notes: `# 8.3 Forms in React

## Controlled Components
React state becomes the "single source of truth" for form inputs.

## Benefits:
- Easy validation
- Conditional enabling/disabling
- Enforce input formats
- Dynamic forms`,
  codeSnippet: `const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};`
};

export const phase3Week8Lesson4 = {
  title: 'Lifting State Up',
  videoUrl: 'https://www.youtube.com/embed/8yo44xN7-nQ',
  notes: `# 8.4 Lifting State Up

When multiple components need to share the same state, "lift" the state up to their closest common ancestor.

## Pattern:
1. Move state to parent component
2. Pass state down as props
3. Pass update functions down as props`,
  codeSnippet: `const ParentComponent = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  
  return (
    <div>
      <ItemList onSelectItem={setSelectedItem} />
      <ItemDetails itemId={selectedItem} />
    </div>
  );
};

const ItemList = ({ onSelectItem }) => {
  const items = ['Item 1', 'Item 2', 'Item 3'];
  
  return (
    <ul>
      {items.map(item => (
        <li key={item} onClick={() => onSelectItem(item)}>
          {item}
        </li>
      ))}
    </ul>
  );
};

const ItemDetails = ({ itemId }) => {
  if (!itemId) return <p>Select an item</p>;
  return <p>Showing details for: {itemId}</p>;
};`
};

export const phase3Week9Lesson1 = {
  title: 'useRef Hook',
  videoUrl: 'https://www.youtube.com/embed/t2ypzz6gJm0',
  notes: `# 9.1 useRef Hook

Creates a mutable reference that persists across re-renders. It doesn't cause re-renders when changed.

## Use Cases:
- Accessing DOM elements
- Storing mutable values
- Keeping previous values`,
  codeSnippet: `import { useRef } from 'react';

const TextInputWithFocus = () => {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
};

// Storing previous value
const Counter = () => {
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();
  
  useEffect(() => {
    prevCountRef.current = count;
  });
  
  return <div>Now: {count}, Before: {prevCountRef.current}</div>;
};`
};

export const phase3Week9Lesson2 = {
  title: 'useMemo & useCallback',
  videoUrl: 'https://www.youtube.com/embed/THL1OPn72vo',
  notes: `# 9.2 useMemo & useCallback

Performance optimization hooks to prevent unnecessary re-computations.

## useMemo
Memoizes a computed value.

## useCallback
Memoizes a function.`,
  codeSnippet: `import { useMemo, useCallback } from 'react';

const ExpensiveComponent = ({ items, onItemClick }) => {
  // useMemo: memoizes a computed value
  const totalPrice = useMemo(() => {
    console.log('Calculating total...');
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);
  
  // useCallback: memoizes a function
  const handleClick = useCallback((id) => {
    console.log('Item clicked:', id);
    onItemClick(id);
  }, [onItemClick]);
  
  return (
    <div>
      <h3>Total: {totalPrice}</h3>
      {items.map(item => (
        <button key={item.id} onClick={() => handleClick(item.id)}>
          {item.name}
        </button>
      ))}
    </div>
  );
};`
};

export const phase3Week9Lesson3 = {
  title: 'React Router Setup',
  videoUrl: 'https://www.youtube.com/embed/Ul3y1LXxzdU',
  notes: `# 9.3 React Router v6

React Router enables navigation between different pages in your React app.

## Installation
npm install react-router-dom

## Key Components:
- BrowserRouter: Wraps your app
- Routes: Container for Route components
- Route: Defines a route
- Link/NavLink: Navigation links`,
  codeSnippet: `import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <NavLink 
          to="/contact"
          className={({ isActive }) => isActive ? 'active-link' : ''}
        >
          Contact
        </NavLink>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}`
};

export const phase3Week9Lesson4 = {
  title: 'React Router Hooks',
  videoUrl: 'https://www.youtube.com/embed/0cSVuySEB0A',
  notes: `# 9.4 React Router Hooks

Hooks for accessing router functionality.

## useParams
Get URL parameters.

## useNavigate
Programmatic navigation.

## useLocation
Get current location info.`,
  codeSnippet: `import { useParams, useNavigate, useLocation } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const goBack = () => {
    navigate(-1);
  };
  
  const goToProducts = () => {
    navigate('/products', { state: { fromProduct: id } });
  };
  
  return (
    <div>
      <h2>Product ID: {id}</h2>
      <p>Current path: {location.pathname}</p>
      <button onClick={goBack}>Back</button>
      <button onClick={goToProducts}>All Products</button>
    </div>
  );
};`
};

export const phase3Week10Lesson1 = {
  title: 'Context API',
  videoUrl: 'https://www.youtube.com/embed/5LrDIWkK_Bc',
  notes: `# 10.1 Context API

Context provides a way to pass data through the component tree without prop drilling.

## Steps:
1. Create Context
2. Create Provider Component
3. Create custom hook for easy access
4. Wrap app with Provider
5. Use context in any component`,
  codeSnippet: `import { createContext, useState, useContext } from 'react';

// 1. Create Context
const AuthContext = createContext();

// 2. Create Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };
  
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };
  
  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};`
};

export const phase3Week10Lesson2 = {
  title: 'Styling in React',
  videoUrl: 'https://www.youtube.com/embed/j5P9FHiBVNo',
  notes: `# 10.2 Styling Options

## CSS Modules
Scoped CSS by default.

## Styled Components
CSS-in-JS library.

## Tailwind CSS
Utility-first CSS framework.`,
  codeSnippet: `// CSS Modules
import styles from './Button.module.css';
const Button = () => <button className={styles.button}>Click</button>;

// Styled Components
import styled from 'styled-components';
const StyledButton = styled.button\`
  background-color: blue;
  color: white;
  padding: 10px 20px;
\`;

// Tailwind CSS
const Button = ({ primary }) => (
  <button className={\`
    px-4 py-2 rounded font-semibold text-white
    \${primary ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500'}
  \`}>
    Click me
  </button>
);`
};

export const phase3Week11Lesson1 = {
  title: 'Setting up Axios',
  videoUrl: 'https://www.youtube.com/embed/6LyagkoRWYA',
  notes: `# 11.1 Setting up Axios

Axios is a promise-based HTTP client for making API requests.

## Features:
- Automatic JSON transformation
- Request/Response interceptors
- Better error handling than fetch`,
  codeSnippet: `import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;`
};

export const phase3Week11Lesson2 = {
  title: 'Authentication Flow',
  videoUrl: 'https://www.youtube.com/embed/X3qyxo_UTR4',
  notes: `# 11.2 Authentication Flow

Complete authentication implementation with React and backend API.

## Flow:
1. User submits login form
2. Send credentials to backend
3. Receive JWT token
4. Store token in localStorage
5. Add token to all subsequent requests
6. Redirect to dashboard`,
  codeSnippet: `import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};`
};

export const phase3Week11Lesson3 = {
  title: 'Protected Routes',
  videoUrl: 'https://www.youtube.com/embed/2k8NleFjG7I',
  notes: `# 11.3 Protected Routes

Protect routes that require authentication.

## Implementation:
1. Create ProtectedRoute component
2. Check authentication status
3. Redirect to login if not authenticated
4. Render children if authenticated`,
  codeSnippet: `import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Usage in App.jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route 
    path="/dashboard" 
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } 
  />
</Routes>`
};

export const phase3Week11Lesson4 = {
  title: 'CRUD Operations',
  videoUrl: 'https://www.youtube.com/embed/T3NHNuD60h4',
  notes: `# 11.4 CRUD Operations with API

Implementing Create, Read, Update, Delete operations.

## Pattern:
1. Create service functions
2. Use in components with useState/useEffect
3. Handle loading and error states
4. Update UI after operations`,
  codeSnippet: `import api from './api';

export const taskService = {
  async getTasks() {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  async updateTask(id, taskData) {
    const response = await api.put(\`/tasks/\${id}\`, taskData);
    return response.data;
  },
  
  async deleteTask(id) {
    await api.delete(\`/tasks/\${id}\`);
  }
};

// Usage in component
const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadTasks();
  }, []);
  
  const loadTasks = async () => {
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    await taskService.deleteTask(id);
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <span>{task.description}</span>
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};`
};


// Week 7 Quiz
export const phase3Week7Quiz = {
  title: 'Week 7 Quiz: React Basics',
  questions: [
    {
      id: 1,
      question: 'What is React?',
      options: [
        'A JavaScript library for building user interfaces',
        'A database',
        'A backend framework',
        'A CSS framework'
      ],
      correctAnswer: 0,
      explanation: 'React is a JavaScript library developed by Facebook for building user interfaces, especially single-page applications.'
    },
    {
      id: 2,
      question: 'What is JSX?',
      options: [
        'A JavaScript extension',
        'A syntax extension for JavaScript that looks like HTML',
        'A new programming language',
        'A CSS preprocessor'
      ],
      correctAnswer: 1,
      explanation: 'JSX is a syntax extension that allows you to write HTML-like code in JavaScript files.'
    },
    {
      id: 3,
      question: 'What are props in React?',
      options: [
        'Properties passed from parent to child components',
        'State variables',
        'CSS properties',
        'HTML attributes'
      ],
      correctAnswer: 0,
      explanation: 'Props (properties) are read-only data passed from parent components to child components.'
    },
    {
      id: 4,
      question: 'Which hook is used to manage state in functional components?',
      options: [
        'useEffect',
        'useState',
        'useContext',
        'useReducer'
      ],
      correctAnswer: 1,
      explanation: 'useState is the hook used to add state to functional components.'
    },
    {
      id: 5,
      question: 'Why do we need keys in React lists?',
      options: [
        'For styling',
        'To help React identify which items have changed',
        'For security',
        'They are optional'
      ],
      correctAnswer: 1,
      explanation: 'Keys help React identify which items have changed, been added, or removed, improving performance.'
    }
  ]
};

// Week 8 Quiz
export const phase3Week8Quiz = {
  title: 'Week 8 Quiz: React Hooks & Forms',
  questions: [
    {
      id: 1,
      question: 'What is the purpose of useEffect?',
      options: [
        'To manage state',
        'To perform side effects in functional components',
        'To create context',
        'To handle forms'
      ],
      correctAnswer: 1,
      explanation: 'useEffect is used to perform side effects like data fetching, subscriptions, or DOM manipulation.'
    },
    {
      id: 2,
      question: 'When does useEffect run by default?',
      options: [
        'Only on mount',
        'Only on unmount',
        'After every render',
        'Never'
      ],
      correctAnswer: 2,
      explanation: 'By default, useEffect runs after every render. You can control this with the dependency array.'
    },
    {
      id: 3,
      question: 'How do you prevent useEffect from running on every render?',
      options: [
        'Use an empty dependency array []',
        'Use useCallback',
        'Use useMemo',
        'You cannot prevent it'
      ],
      correctAnswer: 0,
      explanation: 'An empty dependency array [] makes useEffect run only once on mount.'
    },
    {
      id: 4,
      question: 'What is controlled component in React?',
      options: [
        'A component controlled by props',
        'A form element whose value is controlled by React state',
        'A component with no state',
        'A parent component'
      ],
      correctAnswer: 1,
      explanation: 'A controlled component is a form element whose value is controlled by React state.'
    },
    {
      id: 5,
      question: 'What does "lifting state up" mean?',
      options: [
        'Moving state to a parent component',
        'Increasing state value',
        'Using global state',
        'Removing state'
      ],
      correctAnswer: 0,
      explanation: 'Lifting state up means moving state to a common parent component to share it between children.'
    }
  ]
};

// Week 9-10 Quiz
export const phase3Week9Quiz = {
  title: 'Week 9-10 Quiz: Advanced Hooks & Routing',
  questions: [
    {
      id: 1,
      question: 'What is useRef used for?',
      options: [
        'Managing state',
        'Accessing DOM elements and persisting values',
        'Routing',
        'Context management'
      ],
      correctAnswer: 1,
      explanation: 'useRef is used to access DOM elements directly and persist values without causing re-renders.'
    },
    {
      id: 2,
      question: 'What does useMemo do?',
      options: [
        'Memoizes a value to avoid expensive recalculations',
        'Manages state',
        'Handles side effects',
        'Creates context'
      ],
      correctAnswer: 0,
      explanation: 'useMemo memoizes a computed value, recalculating only when dependencies change.'
    },
    {
      id: 3,
      question: 'What is React Router used for?',
      options: [
        'State management',
        'Navigation and routing in React applications',
        'API calls',
        'Form handling'
      ],
      correctAnswer: 1,
      explanation: 'React Router enables navigation and routing in single-page React applications.'
    },
    {
      id: 4,
      question: 'Which component is used to define routes in React Router v6?',
      options: [
        '<Router>',
        '<Route>',
        '<Routes>',
        '<Link>'
      ],
      correctAnswer: 2,
      explanation: 'In React Router v6, <Routes> is used as a container for <Route> components.'
    },
    {
      id: 5,
      question: 'What is the Context API used for?',
      options: [
        'Routing',
        'Sharing state across components without prop drilling',
        'Making API calls',
        'Styling components'
      ],
      correctAnswer: 1,
      explanation: 'Context API allows you to share state across components without passing props through every level.'
    }
  ]
};

// Week 11 Quiz
export const phase3Week11Quiz = {
  title: 'Week 11 Quiz: API Integration & Auth',
  questions: [
    {
      id: 1,
      question: 'What is Axios?',
      options: [
        'A state management library',
        'An HTTP client for making API requests',
        'A routing library',
        'A testing framework'
      ],
      correctAnswer: 1,
      explanation: 'Axios is a promise-based HTTP client for making API requests from the browser or Node.js.'
    },
    {
      id: 2,
      question: 'Which Axios method is used to send data to a server?',
      options: [
        'axios.get()',
        'axios.post()',
        'axios.fetch()',
        'axios.send()'
      ],
      correctAnswer: 1,
      explanation: 'axios.post() is used to send data to a server, typically for creating new resources.'
    },
    {
      id: 3,
      question: 'Where should you store authentication tokens in React?',
      options: [
        'Component state',
        'Context or localStorage',
        'Props',
        'CSS variables'
      ],
      correctAnswer: 1,
      explanation: 'Tokens are typically stored in Context for app-wide access or localStorage for persistence.'
    },
    {
      id: 4,
      question: 'What is a protected route?',
      options: [
        'A route with HTTPS',
        'A route that requires authentication',
        'A route with validation',
        'A private API endpoint'
      ],
      correctAnswer: 1,
      explanation: 'A protected route requires authentication and redirects unauthenticated users to login.'
    },
    {
      id: 5,
      question: 'What HTTP status code indicates successful resource creation?',
      options: [
        '200',
        '201',
        '204',
        '400'
      ],
      correctAnswer: 1,
      explanation: '201 Created indicates that a new resource was successfully created.'
    }
  ]
};
