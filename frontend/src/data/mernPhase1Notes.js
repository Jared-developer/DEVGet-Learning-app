// MERN Stack Bootcamp - Phase 1 Detailed Notes
// The Foundation: Web Basics & JavaScript (Weeks 1-2)

export const phase1Week1Lesson1 = {
  title: 'How the Internet Works',
  videoUrl: 'https://www.youtube.com/embed/7_LPdttKXPc',
  notes: `# 1.1 How the Internet Works

## The Client-Server Model
- **Client**: Your browser (Chrome, Firefox) or mobile app. It requests data.
- **Server**: A remote computer (always on) that responds with data.
- **Request-Response Cycle**: You type a URL → Request travels to server → Server processes → Response travels back → Browser renders page.

## HTTP Protocol (HyperText Transfer Protocol)
The language clients and servers use to talk to each other.

### HTTP Methods (Verbs):
- **GET**: Retrieve data (e.g., view a webpage)
- **POST**: Send new data (e.g., submit a form)
- **PUT / PATCH**: Update data
- **DELETE**: Remove data

### HTTP Status Codes:
- **200 OK**: Success!
- **404 Not Found**: The page/resource doesn't exist
- **500 Internal Server Error**: The server crashed

## DNS (Domain Name System)
Think of it as the phonebook of the internet.
- You type google.com (human-friendly)
- DNS translates it to an IP address like 142.250.190.46 (computer-friendly) so the request knows where to go`,
  codeSnippet: `// Example HTTP Request
GET /api/users HTTP/1.1
Host: example.com
Accept: application/json

// Example HTTP Response
HTTP/1.1 200 OK
Content-Type: application/json

{
  "users": [
    { "id": 1, "name": "Alice" }
  ]
}`
};


export const phase1Week1Lesson2 = {
  title: 'Developer Setup & Git Basics',
  videoUrl: 'https://www.youtube.com/embed/RGOj5yH7evk',
  notes: `# 1.2 Developer Setup & Git

## VS Code Essentials
Extensions to install immediately:
- **Live Server**: Launches a local dev server with live reload
- **Prettier**: Auto-formats your code
- **Bracket Pair Colorizer**: Makes matching brackets easier to see
- **ES7+ React/Redux/React-Native snippets**: (Good for later)

## Git Basics (The Time Machine for Code)
- **Repository (Repo)**: A folder whose contents are tracked by Git

### Three States:
1. **Working Directory**: The files you are currently editing (red in VS Code)
2. **Staging Area** (git add): Files you've marked to be part of the next snapshot (green in VS Code)
3. **Repository** (git commit): The snapshot is permanently stored`,
  codeSnippet: `# 1. Initialize a repo (do this once per project)
git init

# 2. Check what files have changed
git status

# 3. Add a specific file to staging
git add index.html
# Or add all changes at once
git add .

# 4. Commit the snapshot with a message
git commit -m "Add initial HTML structure"

# 5. Connect to GitHub
git remote add origin https://github.com/yourusername/your-repo.git

# 6. Push your code to the cloud
git push -u origin main`
};


export const phase1Week1Lesson3 = {
  title: 'HTML5 Essentials',
  videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE',
  notes: `# 1.3 HTML5 Essentials

HTML is the **Skeleton** of a webpage.

## Semantic HTML (Why it matters)
Instead of using \`<div>\` for everything, use tags that describe the content. This helps with SEO and Accessibility.

### Common Semantic Tags:
- \`<header>\`: Introductory content
- \`<nav>\`: Navigation links
- \`<main>\`: The main content of the page (only one)
- \`<article>\`: A self-contained piece of content
- \`<section>\`: A thematic grouping of content
- \`<aside>\`: Sidebar content
- \`<footer>\`: Bottom of the page

## Forms & Validation
Forms are how users send data to your server.
- **action**: Where to send the data
- **method**: The HTTP method (usually GET or POST)
- **name**: The key name the server will use`,
  codeSnippet: `<form action="/submit-form" method="POST">
  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>
  
  <label for="password">Password:</label>
  <input type="password" id="password" name="password" minlength="8" required>
  
  <button type="submit">Register</button>
</form>`
};


export const phase1Week2Lesson1 = {
  title: 'Variables & Data Types',
  videoUrl: 'https://www.youtube.com/embed/9emXNzqCKyg',
  notes: `# 2.1 Variables & Data Types

JavaScript is the **Muscles and Brain** of a webpage. It makes things interactive.

## Declaring Variables
- \`let\`: Use when the value will change (reassignable)
- \`const\`: Use when the value should not be reassigned. **Default choice**
- \`var\`: Old way. Avoid using it (scope issues)

## Primitive Data Types
- **String**: Text (\`"Hello"\`, \`'World'\`, \`\\\`Template\\\`\`)
- **Number**: Integers and decimals (5, 3.14)
- **Boolean**: \`true\` or \`false\`
- **undefined**: Variable declared but not assigned a value
- **null**: Intentionally empty value

## Reference Data Types
- **Object**: Collections of key-value pairs
- **Array**: Ordered lists (technically objects)`,
  codeSnippet: `// Variables
let name = "Alice";        // Can be reassigned
const age = 25;            // Cannot be reassigned
var city = "NYC";          // Avoid using var

// Primitive Types
const greeting = "Hello";  // String
const count = 42;          // Number
const isActive = true;     // Boolean
let user;                  // undefined
const empty = null;        // null

// Reference Types
const person = {           // Object
  name: "Bob",
  age: 30
};

const colors = ["red", "green", "blue"]; // Array`
};


export const phase1Week2Lesson2 = {
  title: 'Modern JavaScript Syntax',
  videoUrl: 'https://www.youtube.com/embed/NCwa_xi0Uuc',
  notes: `# 2.2 Modern Syntax & Array Methods

## Template Literals
Easier string concatenation using backticks \\\` and \\\${}.

## Spread Operator (...)
"Spreads" the elements of an array or properties of an object.

## Destructuring
Easily extract values from arrays/objects.`,
  codeSnippet: `// Template Literals
const name = "Alice";
const age = 25;
// Old way:
// const greeting = "Hello, my name is " + name + " and I am " + age + " years old."
// New way:
const greeting = \`Hello, my name is \${name} and I am \${age} years old.\`;

// Spread Operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]

// Copying objects (important for React state!)
const user = { name: "Bob", age: 30 };
const updatedUser = { ...user, age: 31 };

// Object Destructuring
const person = { firstName: "John", lastName: "Doe", city: "NYC" };
const { firstName, city } = person;
console.log(firstName); // John

// Array Destructuring
const colors = ["red", "green", "blue"];
const [primary, secondary] = colors;
console.log(primary); // red`
};


export const phase1Week2Lesson3 = {
  title: 'Array Methods: map, filter, reduce',
  videoUrl: 'https://www.youtube.com/embed/rRgD1yVwIvE',
  notes: `# The "Big Three" Array Methods

These are used everywhere in React for rendering lists and managing state.

## 1. map()
Transforms every item in an array and returns a new array of the same length.

## 2. filter()
Creates a new array with only elements that pass a test.

## 3. reduce()
Iterates through an array and accumulates a single value. (Powerful but tricky).`,
  codeSnippet: `// 1. map() - Transform every item
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);
console.log(doubled); // [2, 4, 6, 8]

// Common React pattern
const names = ["Alice", "Bob", "Charlie"];
const nameListItems = names.map(name => \`<li>\${name}</li>\`);

// 2. filter() - Keep only items that pass a test
const ages = [15, 22, 18, 13, 40];
const adults = ages.filter(age => age >= 18);
console.log(adults); // [22, 18, 40]

// 3. reduce() - Accumulate a single value
const prices = [10, 20, 30];
const total = prices.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0); // Start accumulating from 0
console.log(total); // 60`
};


export const phase1Week2Lesson4 = {
  title: 'Asynchronous JavaScript',
  videoUrl: 'https://www.youtube.com/embed/PoRJizFvM7s',
  notes: `# 2.3 Asynchronous JavaScript

JavaScript is single-threaded. Async code prevents it from freezing while waiting for slow operations (like fetching data from the internet).

## Promises
A Promise is an object representing the eventual completion (or failure) of an asynchronous operation.

### Three States:
1. **Pending**
2. **Fulfilled** (Resolved)
3. **Rejected**

## Async/Await (Modern Way)
This is syntactic sugar over Promises, making async code look like synchronous code.

**Key Rule**: You can only use \`await\` inside a function marked with \`async\`.`,
  codeSnippet: `// Simulating fetching data from an API
function fetchUserData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, name: "John Doe" });
    }, 2000); // Takes 2 seconds
  });
}

// The old way: .then()
// fetchUserData().then(user => console.log(user));

// The modern way: async/await
async function displayUser() {
  console.log("Fetching user...");
  const user = await fetchUserData(); // Pauses here until Promise resolves
  console.log("User fetched:", user);
}

displayUser();
console.log("This runs immediately, not waiting for the user!");`
};


// Week 1 Quiz
export const phase1Week1Quiz = {
  title: 'Week 1 Quiz: Web Fundamentals & Setup',
  questions: [
    {
      id: 1,
      question: 'What does HTTP stand for?',
      options: [
        'HyperText Transfer Protocol',
        'High Transfer Text Protocol',
        'HyperText Transmission Process',
        'High Tech Transfer Protocol'
      ],
      correctAnswer: 0,
      explanation: 'HTTP stands for HyperText Transfer Protocol, which is the foundation of data communication on the web.'
    },
    {
      id: 2,
      question: 'Which Git command is used to save changes to the local repository?',
      options: [
        'git save',
        'git push',
        'git commit',
        'git add'
      ],
      correctAnswer: 2,
      explanation: 'git commit saves changes to the local repository with a message describing what was changed.'
    },
    {
      id: 3,
      question: 'What is the correct HTML5 doctype declaration?',
      options: [
        '<!DOCTYPE html5>',
        '<!DOCTYPE HTML>',
        '<!DOCTYPE html>',
        '<DOCTYPE html>'
      ],
      correctAnswer: 2,
      explanation: '<!DOCTYPE html> is the correct and simplified HTML5 doctype declaration.'
    },
    {
      id: 4,
      question: 'Which HTML tag is used for the largest heading?',
      options: [
        '<heading>',
        '<h6>',
        '<h1>',
        '<head>'
      ],
      correctAnswer: 2,
      explanation: '<h1> is used for the largest heading, with <h6> being the smallest.'
    },
    {
      id: 5,
      question: 'What does CSS stand for?',
      options: [
        'Computer Style Sheets',
        'Cascading Style Sheets',
        'Creative Style System',
        'Colorful Style Sheets'
      ],
      correctAnswer: 1,
      explanation: 'CSS stands for Cascading Style Sheets, used to style HTML elements.'
    }
  ]
};

// Week 2 Quiz
export const phase1Week2Quiz = {
  title: 'Week 2 Quiz: JavaScript Fundamentals',
  questions: [
    {
      id: 1,
      question: 'Which keyword is used to declare a block-scoped variable in JavaScript?',
      options: [
        'var',
        'let',
        'const',
        'Both let and const'
      ],
      correctAnswer: 3,
      explanation: 'Both let and const declare block-scoped variables. let allows reassignment, while const does not.'
    },
    {
      id: 2,
      question: 'What does the map() method do?',
      options: [
        'Filters array elements',
        'Creates a new array by transforming each element',
        'Reduces array to a single value',
        'Sorts the array'
      ],
      correctAnswer: 1,
      explanation: 'map() creates a new array by applying a function to each element of the original array.'
    },
    {
      id: 3,
      question: 'What is the output of: console.log(typeof null)?',
      options: [
        'null',
        'undefined',
        'object',
        'number'
      ],
      correctAnswer: 2,
      explanation: 'typeof null returns "object" - this is a known JavaScript quirk/bug that has been kept for backward compatibility.'
    },
    {
      id: 4,
      question: 'Which method is used to add elements to the end of an array?',
      options: [
        'push()',
        'pop()',
        'shift()',
        'unshift()'
      ],
      correctAnswer: 0,
      explanation: 'push() adds one or more elements to the end of an array and returns the new length.'
    },
    {
      id: 5,
      question: 'What keyword is used to handle errors in JavaScript?',
      options: [
        'catch',
        'try-catch',
        'error',
        'throw'
      ],
      correctAnswer: 1,
      explanation: 'try-catch blocks are used to handle errors. Code in try is executed, and if an error occurs, catch handles it.'
    }
  ]
};


// Week 1 End of Module Assignment
export const phase1Week1Assignment = {
  title: 'Week 1 Assignment: Personal Portfolio Landing Page',
  description: 'Create a personal portfolio landing page using HTML5 semantic tags and Git version control',
  dueDate: 'End of Week 1',
  points: 100,
  tasks: [
    {
      id: 1,
      title: 'Setup Git Repository',
      description: 'Initialize a Git repository and make your first commit',
      points: 15,
      requirements: [
        'Create a new folder called "portfolio-project"',
        'Initialize Git with git init',
        'Create a .gitignore file',
        'Make your first commit with message "Initial commit"',
        'Create a GitHub repository and push your code'
      ]
    },
    {
      id: 2,
      title: 'Create HTML Structure',
      description: 'Build a semantic HTML5 structure for your portfolio',
      points: 40,
      requirements: [
        'Create an index.html file with proper DOCTYPE and meta tags',
        'Use semantic tags: <header>, <nav>, <main>, <section>, <footer>',
        'Include a navigation menu with at least 3 links (Home, About, Contact)',
        'Create an "About Me" section with a brief introduction',
        'Add a "Skills" section listing at least 5 technical skills',
        'Include a "Contact" section with a form (name, email, message fields)',
        'All form inputs must have proper labels and validation attributes'
      ]
    },
    {
      id: 3,
      title: 'Content & Accessibility',
      description: 'Add meaningful content and ensure accessibility',
      points: 25,
      requirements: [
        'Add a profile photo or placeholder image with alt text',
        'Write a 2-3 paragraph bio about yourself',
        'Include at least 3 social media links (GitHub, LinkedIn, etc.)',
        'Ensure all images have descriptive alt attributes',
        'Use proper heading hierarchy (h1, h2, h3)',
        'Add a page title in the <title> tag'
      ]
    },
    {
      id: 4,
      title: 'Git Workflow',
      description: 'Demonstrate proper Git workflow with multiple commits',
      points: 20,
      requirements: [
        'Make at least 5 meaningful commits throughout the project',
        'Use descriptive commit messages (e.g., "Add navigation menu", "Create contact form")',
        'Push all commits to GitHub',
        'Include a README.md file with project description'
      ]
    }
  ],
  submissionGuidelines: [
    'Submit your GitHub repository URL',
    'Ensure your repository is public',
    'Your index.html should open and display correctly in a browser',
    'All HTML should be valid (test at validator.w3.org)',
    'Include a README.md with setup instructions'
  ],
  rubric: {
    excellent: '90-100 points: All requirements met, clean code, excellent commit history, creative design',
    good: '80-89 points: All requirements met, good code structure, adequate commits',
    satisfactory: '70-79 points: Most requirements met, basic functionality works',
    needsImprovement: 'Below 70: Missing requirements, poor code structure, or incomplete'
  },
  resources: [
    'HTML5 Semantic Elements: https://www.w3schools.com/html/html5_semantic_elements.asp',
    'Git Basics: https://git-scm.com/book/en/v2/Getting-Started-Git-Basics',
    'GitHub Guide: https://guides.github.com/activities/hello-world/',
    'HTML Validator: https://validator.w3.org/'
  ],
  hints: [
    'Start with the HTML structure before worrying about styling',
    'Commit after completing each major section',
    'Test your form validation by trying to submit empty fields',
    'Use meaningful class names even though we haven\'t learned CSS yet',
    'Don\'t forget to add alt text to all images for accessibility'
  ]
};


// Week 2 End of Module Assignment
export const phase1Week2Assignment = {
  title: 'Week 2 Assignment: Interactive Task Manager',
  description: 'Build an interactive task manager using vanilla JavaScript with array methods and DOM manipulation',
  dueDate: 'End of Week 2',
  points: 100,
  tasks: [
    {
      id: 1,
      title: 'HTML Structure & Form',
      description: 'Create the HTML structure for the task manager',
      points: 20,
      requirements: [
        'Create a form with input field for task name and "Add Task" button',
        'Add a container div to display the task list',
        'Include filter buttons: "All", "Active", "Completed"',
        'Add a "Clear Completed" button',
        'Use semantic HTML tags'
      ]
    },
    {
      id: 2,
      title: 'JavaScript Core Functionality',
      description: 'Implement task management using JavaScript',
      points: 40,
      requirements: [
        'Create an array to store tasks (each task should be an object with id, text, completed properties)',
        'Implement addTask() function that adds new tasks to the array',
        'Implement deleteTask() function to remove tasks',
        'Implement toggleTask() function to mark tasks as complete/incomplete',
        'Use array methods (map, filter) to manage and display tasks',
        'Generate unique IDs for each task (use Date.now() or a counter)'
      ]
    },
    {
      id: 3,
      title: 'DOM Manipulation',
      description: 'Dynamically update the UI based on task data',
      points: 25,
      requirements: [
        'Render tasks dynamically using JavaScript (not hardcoded HTML)',
        'Each task should have a checkbox, text, and delete button',
        'Update the DOM whenever the tasks array changes',
        'Add visual indication for completed tasks (strikethrough or different color)',
        'Display task count (e.g., "5 tasks remaining")',
        'Clear the input field after adding a task'
      ]
    },
    {
      id: 4,
      title: 'Filtering & Local Storage',
      description: 'Add filtering functionality and data persistence',
      points: 15,
      requirements: [
        'Implement filter functionality (All, Active, Completed)',
        'Save tasks to localStorage whenever the array changes',
        'Load tasks from localStorage when the page loads',
        'Implement "Clear Completed" button to remove all completed tasks',
        'Handle edge cases (empty input, no tasks to display)'
      ]
    }
  ],
  submissionGuidelines: [
    'Submit your GitHub repository URL',
    'Include index.html, script.js, and optional style.css',
    'Ensure the app works without errors in the browser console',
    'Test all functionality before submitting',
    'Include a README.md with features and how to use the app'
  ],
  rubric: {
    excellent: '90-100 points: All features work perfectly, clean code, excellent use of array methods, localStorage implemented',
    good: '80-89 points: Core functionality works, good code structure, minor bugs',
    satisfactory: '70-79 points: Basic add/delete works, some features missing',
    needsImprovement: 'Below 70: Major features missing or not working'
  },
  resources: [
    'Array Methods: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    'DOM Manipulation: https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model',
    'localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage',
    'Event Listeners: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener'
  ],
  hints: [
    'Start by getting add and display working before adding other features',
    'Use template literals to create HTML strings for tasks',
    'Remember to use event.preventDefault() on form submission',
    'Test localStorage in the browser DevTools (Application tab)',
    'Use arrow functions with array methods for cleaner code'
  ],
  bonusChallenge: {
    description: 'Add edit functionality to modify existing tasks',
    points: 10,
    requirements: [
      'Add an "Edit" button to each task',
      'Allow inline editing or use a prompt/modal',
      'Update the task text in the array and re-render',
      'Save changes to localStorage'
    ]
  }
};
