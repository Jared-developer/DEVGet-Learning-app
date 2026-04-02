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
