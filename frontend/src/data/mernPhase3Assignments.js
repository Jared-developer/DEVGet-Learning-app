// MERN Stack Bootcamp - Phase 3 Assignments
// Frontend Development: React.js from Zero to Hero (Weeks 7-11)

// Week 7 End of Module Assignment
export const phase3Week7Assignment = {
    title: 'Week 7 Assignment: React Component Library',
    description: 'Build a reusable component library with props, state, and event handling',
    dueDate: 'End of Week 7',
    points: 100,
    tasks: [
        {
            id: 1,
            title: 'Project Setup',
            description: 'Set up a React project using Vite',
            points: 10,
            requirements: [
                'Create a new React project with Vite',
                'Clean up default files and create a clean structure',
                'Set up a components folder',
                'Initialize Git and make first commit',
                'Create a README.md with project description'
            ]
        },
        {
            id: 2,
            title: 'Reusable Components',
            description: 'Create reusable UI components with props',
            points: 40,
            requirements: [
                'Create a Button component with props (text, onClick, variant)',
                'Create a Card component with props (title, content, image)',
                'Create an Input component with props (label, value, onChange, type)',
                'Create an Alert component with props (message, type: success/error/warning)',
                'All components should accept className prop for custom styling',
                'Use PropTypes or TypeScript for prop validation'
            ]
        },
        {
            id: 3,
            title: 'Stateful Components',
            description: 'Build components with useState hook',
            points: 30,
            requirements: [
                'Create a Counter component with increment/decrement buttons',
                'Create a Toggle component (show/hide content)',
                'Create a Form component with controlled inputs (name, email)',
                'Display form data below the form in real-time',
                'Add form validation (required fields, email format)',
                'Clear form after submission'
            ]
        },
        {
            id: 4,
            title: 'Component Showcase',
            description: 'Create a demo page showcasing all components',
            points: 20,
            requirements: [
                'Create an App component that displays all your components',
                'Add section headings for each component type',
                'Show multiple variants of each component',
                'Add basic CSS styling to make it presentable',
                'Ensure responsive design (mobile-friendly)'
            ]
        }
    ],
    submissionGuidelines: [
        'Submit your GitHub repository URL',
        'Include a README.md with component documentation',
        'List all components with their props',
        'Include screenshots of your component library',
        'Ensure the app runs with npm run dev',
        'Deploy to Netlify or Vercel (bonus)'
    ],
    rubric: {
        excellent: '90-100 points: All components work perfectly, clean code, excellent prop handling, great UI',
        good: '80-89 points: All components work, good structure, minor styling issues',
        satisfactory: '70-79 points: Most components work, basic functionality present',
        needsImprovement: 'Below 70: Missing components or major functionality issues'
    },
    resources: [
        'React Documentation: https://react.dev/',
        'Vite Guide: https://vitejs.dev/guide/',
        'React Props: https://react.dev/learn/passing-props-to-a-component',
        'useState Hook: https://react.dev/reference/react/useState'
    ],
    hints: [
        'Start with simple components before adding complexity',
        'Test each component individually before combining',
        'Use destructuring for props',
        'Keep components small and focused on one task',
        'Use meaningful prop names'
    ]
};

// Week 8-9 End of Module Assignment
export const phase3Week8Assignment = {
    title: 'Week 8-9 Assignment: Movie Search App',
    description: 'Build a movie search application using React hooks, routing, and external API',
    dueDate: 'End of Week 9',
    points: 150,
    tasks: [
        {
            id: 1,
            title: 'Project Setup & Routing',
            description: 'Set up React Router and basic navigation',
            points: 20,
            requirements: [
                'Install and configure React Router',
                'Create routes: Home, Search, Favorites, Movie Detail',
                'Create a Navigation component with links',
                'Add active link styling',
                'Implement 404 Not Found page'
            ]
        },
        {
            id: 2,
            title: 'API Integration',
            description: 'Integrate with OMDB or TMDB API',
            points: 40,
            requirements: [
                'Sign up for free API key (OMDB or TMDB)',
                'Create an API service file with fetch functions',
                'Implement search movies by title',
                'Implement get movie details by ID',
                'Handle loading states',
                'Handle API errors gracefully'
            ]
        },
        {
            id: 3,
            title: 'Search Functionality',
            description: 'Build the movie search feature',
            points: 40,
            requirements: [
                'Create a search form with input and submit button',
                'Display search results in a grid layout',
                'Show movie poster, title, and year',
                'Implement debounced search (search as you type)',
                'Add loading spinner during API calls',
                'Display "No results found" message when appropriate',
                'Make movie cards clickable to view details'
            ]
        },
        {
            id: 4,
            title: 'Movie Details Page',
            description: 'Create detailed movie view',
            points: 30,
            requirements: [
                'Display full movie information (plot, cast, rating, etc.)',
                'Show larger poster image',
                'Add "Add to Favorites" button',
                'Use useParams to get movie ID from URL',
                'Add back button to return to search',
                'Handle loading and error states'
            ]
        },
        {
            id: 5,
            title: 'Favorites Feature',
            description: 'Implement favorites with localStorage',
            points: 20,
            requirements: [
                'Store favorites in localStorage',
                'Create Favorites page to display saved movies',
                'Add/remove movies from favorites',
                'Show favorite count in navigation',
                'Persist favorites across page refreshes',
                'Add "Remove from Favorites" button'
            ]
        }
    ],
    submissionGuidelines: [
        'Submit your GitHub repository URL',
        'Include .env.example with API key placeholder',
        'Never commit actual API keys',
        'Include comprehensive README with setup instructions',
        'Add screenshots of all pages',
        'Deploy to Netlify or Vercel'
    ],
    rubric: {
        excellent: '135-150 points: All features work flawlessly, excellent UX, clean code, great error handling',
        good: '120-134 points: All major features work, good UI, minor bugs',
        satisfactory: '105-119 points: Core search works, basic favorites, some features incomplete',
        needsImprovement: 'Below 105: Major features missing or broken'
    },
    resources: [
        'OMDB API: http://www.omdbapi.com/',
        'TMDB API: https://www.themoviedb.org/settings/api',
        'React Router: https://reactrouter.com/',
        'useEffect Hook: https://react.dev/reference/react/useEffect',
        'localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'
    ],
    hints: [
        'Store API key in .env file as VITE_API_KEY',
        'Use useEffect to fetch data when component mounts',
        'Implement debouncing with setTimeout',
        'Use optional chaining (?.) for API response data',
        'Test with different search terms',
        'Handle cases where poster image is not available'
    ],
    bonusChallenge: {
        description: 'Add advanced filtering and sorting',
        points: 15,
        requirements: [
            'Add filter by year range',
            'Add filter by genre',
            'Add sort by rating/year/title',
            'Implement pagination for search results'
        ]
    }
};

// Week 10-11 End of Module Assignment
export const phase3Week10Assignment = {
    title: 'Week 10-11 Assignment: Full-Stack Blog Application',
    description: 'Build a complete blog application connecting React frontend to your Express/MongoDB backend',
    dueDate: 'End of Week 11',
    points: 150,
    tasks: [
        {
            id: 1,
            title: 'Authentication UI',
            description: 'Build login and registration pages',
            points: 30,
            requirements: [
                'Create Login page with email and password fields',
                'Create Register page with username, email, password fields',
                'Implement form validation',
                'Show loading state during API calls',
                'Display error messages from backend',
                'Redirect to dashboard after successful login',
                'Store JWT token in localStorage'
            ]
        },
        {
            id: 2,
            title: 'Protected Routes & Context',
            description: 'Implement authentication context and protected routes',
            points: 30,
            requirements: [
                'Create AuthContext with login, logout, and user state',
                'Wrap app with AuthProvider',
                'Create ProtectedRoute component',
                'Redirect to login if not authenticated',
                'Add logout functionality',
                'Persist auth state across page refreshes',
                'Add loading state while checking auth'
            ]
        },
        {
            id: 3,
            title: 'Blog Posts CRUD',
            description: 'Implement full CRUD for blog posts',
            points: 50,
            requirements: [
                'Create Posts List page (display all posts)',
                'Create Post Detail page (single post view)',
                'Create New Post page (form to create post)',
                'Create Edit Post page (form to update post)',
                'Implement delete post with confirmation',
                'Show author information for each post',
                'Add loading and error states',
                'Include pagination or infinite scroll'
            ]
        },
        {
            id: 4,
            title: 'Comments Feature',
            description: 'Add commenting functionality',
            points: 25,
            requirements: [
                'Display comments on post detail page',
                'Add comment form (authenticated users only)',
                'Submit new comments',
                'Delete own comments',
                'Show comment author and timestamp',
                'Real-time comment count update'
            ]
        },
        {
            id: 5,
            title: 'User Experience & Styling',
            description: 'Polish the UI and add responsive design',
            points: 15,
            requirements: [
                'Add consistent styling across all pages',
                'Implement responsive design (mobile, tablet, desktop)',
                'Add navigation with user menu',
                'Show user avatar/initials',
                'Add loading skeletons',
                'Implement toast notifications for success/error messages'
            ]
        }
    ],
    submissionGuidelines: [
        'Submit both frontend and backend GitHub repository URLs',
        'Include comprehensive README for both repos',
        'Document all API endpoints used',
        'Include .env.example files',
        'Add setup and run instructions',
        'Deploy frontend and backend (Netlify + Render/Railway)',
        'Include live demo link'
    ],
    rubric: {
        excellent: '135-150 points: Full-stack app works perfectly, excellent UX, clean code, deployed successfully',
        good: '120-134 points: All CRUD works, auth functional, good UI, minor issues',
        satisfactory: '105-119 points: Basic CRUD works, auth present, some features incomplete',
        needsImprovement: 'Below 105: Major features missing or broken'
    },
    resources: [
        'Axios Documentation: https://axios-http.com/docs/intro',
        'React Context: https://react.dev/reference/react/useContext',
        'JWT Authentication: https://jwt.io/introduction',
        'React Router Protected Routes: https://reactrouter.com/en/main/start/tutorial'
    ],
    hints: [
        'Set up axios interceptors for adding auth token to requests',
        'Handle 401 errors by redirecting to login',
        'Use useNavigate for programmatic navigation',
        'Test auth flow thoroughly (login, logout, token expiration)',
        'Use environment variables for API base URL',
        'Implement optimistic UI updates for better UX'
    ],
    securityReminders: [
        'Never store sensitive data in localStorage except JWT',
        'Always validate user input on frontend and backend',
        'Use HTTPS in production',
        'Implement CORS properly on backend',
        'Set appropriate token expiration times'
    ]
};
