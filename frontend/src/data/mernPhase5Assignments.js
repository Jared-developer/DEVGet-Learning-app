// MERN Stack Bootcamp - Phase 5 Assignments
// Professional Polish: Advanced Topics & Career Readiness (Weeks 15-16)

// Week 15 End of Module Assignment
export const phase5Week15Assignment = {
    title: 'Week 15 Assignment: Performance Optimization & Testing',
    description: 'Optimize an existing application and add comprehensive testing',
    dueDate: 'End of Week 15',
    points: 100,
    tasks: [
        {
            id: 1,
            title: 'Performance Optimization',
            description: 'Implement performance best practices',
            points: 40,
            requirements: [
                'Implement code splitting with React.lazy()',
                'Add Suspense boundaries with loading fallbacks',
                'Optimize images (compression, lazy loading)',
                'Implement memoization with useMemo and useCallback',
                'Add React.memo to prevent unnecessary re-renders',
                'Optimize bundle size (analyze with webpack-bundle-analyzer)',
                'Implement service worker for caching',
                'Add performance monitoring (Lighthouse score > 90)'
            ]
        },
        {
            id: 2,
            title: 'Backend Testing',
            description: 'Write comprehensive backend tests',
            points: 30,
            requirements: [
                'Set up Jest and Supertest',
                'Write unit tests for utility functions',
                'Write integration tests for API endpoints',
                'Test authentication middleware',
                'Test error handling',
                'Achieve >80% code coverage',
                'Add test scripts to package.json',
                'Set up CI/CD to run tests automatically'
            ]
        },
        {
            id: 3,
            title: 'Frontend Testing',
            description: 'Write frontend component tests',
            points: 30,
            requirements: [
                'Set up React Testing Library',
                'Write unit tests for utility functions',
                'Write component tests for key components',
                'Test user interactions (clicks, form submissions)',
                'Test conditional rendering',
                'Mock API calls in tests',
                'Achieve >70% code coverage',
                'Add test scripts to package.json'
            ]
        }
    ],
    submissionGuidelines: [
        'Submit GitHub repository URL',
        'Include test coverage reports',
        'Document optimization improvements (before/after metrics)',
        'Include Lighthouse performance scores',
        'Add testing documentation in README',
        'Show CI/CD pipeline configuration'
    ],
    rubric: {
        excellent: '90-100 points: Excellent optimization, comprehensive tests, >85% coverage, CI/CD configured',
        good: '80-89 points: Good optimization, solid test coverage, minor gaps',
        satisfactory: '70-79 points: Basic optimization, some tests present',
        needsImprovement: 'Below 70: Minimal optimization or testing'
    },
    resources: [
        'React Performance: https://react.dev/learn/render-and-commit',
        'Jest Documentation: https://jestjs.io/docs/getting-started',
        'React Testing Library: https://testing-library.com/docs/react-testing-library/intro/',
        'Supertest: https://www.npmjs.com/package/supertest',
        'Lighthouse: https://developers.google.com/web/tools/lighthouse'
    ],
    hints: [
        'Use React DevTools Profiler to identify performance bottlenecks',
        'Lazy load routes for better initial load time',
        'Use CDN for static assets',
        'Implement pagination instead of loading all data',
        'Write tests for critical user flows first',
        'Use test.each() for testing multiple scenarios'
    ]
};

// Week 16 Final Capstone Project
export const phase5Week16Assignment = {
    title: 'Week 16 Assignment: Final Capstone Project',
    description: 'Build a complete full-stack application of your choice demonstrating all learned skills',
    dueDate: 'End of Week 16',
    points: 200,
    tasks: [
        {
            id: 1,
            title: 'Project Planning',
            description: 'Plan and design your application',
            points: 20,
            requirements: [
                'Choose a project idea (get instructor approval)',
                'Create user stories and requirements document',
                'Design database schema',
                'Create wireframes for all pages',
                'Plan API endpoints',
                'Set up project timeline',
                'Create GitHub repository with project board'
            ]
        },
        {
            id: 2,
            title: 'Backend Development',
            description: 'Build robust backend API',
            points: 50,
            requirements: [
                'Implement at least 3 data models with relationships',
                'Create RESTful API with full CRUD operations',
                'Implement JWT authentication',
                'Add role-based authorization (user, admin)',
                'Implement input validation and error handling',
                'Add API documentation (Swagger or Postman)',
                'Write backend tests (>70% coverage)',
                'Implement at least one advanced feature (search, filtering, pagination)'
            ]
        },
        {
            id: 3,
            title: 'Frontend Development',
            description: 'Build polished React frontend',
            points: 60,
            requirements: [
                'Implement at least 8 pages/views',
                'Create reusable component library',
                'Implement authentication flow (login, register, logout)',
                'Add protected routes',
                'Implement full CRUD operations',
                'Add form validation',
                'Implement responsive design',
                'Add loading states and error handling',
                'Use Context API or Redux for state management',
                'Implement at least one advanced feature (real-time updates, file upload, etc.)'
            ]
        },
        {
            id: 4,
            title: 'Professional Polish',
            description: 'Add professional touches',
            points: 40,
            requirements: [
                'Implement consistent UI/UX design',
                'Add animations and transitions',
                'Optimize performance (Lighthouse score >85)',
                'Add SEO meta tags',
                'Implement error boundaries',
                'Add toast notifications',
                'Create comprehensive README with screenshots',
                'Add environment variable documentation',
                'Include setup and deployment instructions'
            ]
        },
        {
            id: 5,
            title: 'Deployment & Documentation',
            description: 'Deploy and document your application',
            points: 30,
            requirements: [
                'Deploy backend to Render, Railway, or Heroku',
                'Deploy frontend to Netlify or Vercel',
                'Set up environment variables in production',
                'Configure CORS properly',
                'Add custom domain (optional)',
                'Create video demo (3-5 minutes)',
                'Write comprehensive README',
                'Document all features and technologies used',
                'Include API documentation',
                'Add troubleshooting guide'
            ]
        }
    ],
    projectIdeas: [
        'Task Management System (like Trello)',
        'Recipe Sharing Platform',
        'Fitness Tracker',
        'Event Management System',
        'Job Board',
        'Real Estate Listing Platform',
        'Learning Management System',
        'Expense Tracker',
        'Social Networking Site',
        'E-Learning Platform',
        'Booking System (hotels, appointments, etc.)',
        'Inventory Management System'
    ],
    submissionGuidelines: [
        'Submit both frontend and backend repository URLs',
        'Include live demo links',
        'Submit video demo (YouTube or Loom)',
        'Include comprehensive README files',
        'Add project presentation slides',
        'Document all features and technologies',
        'Include screenshots and GIFs',
        'Add setup and deployment instructions'
    ],
    rubric: {
        excellent: '180-200 points: Outstanding project, all requirements exceeded, production-ready, excellent documentation',
        good: '160-179 points: Strong project, all requirements met, good quality, well documented',
        satisfactory: '140-159 points: Solid project, most requirements met, functional, basic documentation',
        needsImprovement: 'Below 140: Incomplete project, missing requirements, poor quality'
    },
    evaluationCriteria: {
        functionality: '40% - Does it work? Are all features implemented?',
        codeQuality: '25% - Is the code clean, organized, and following best practices?',
        design: '15% - Is the UI/UX professional and user-friendly?',
        documentation: '10% - Is the project well documented?',
        innovation: '10% - Does it show creativity and problem-solving?'
    },
    resources: [
        'Project Ideas: https://github.com/florinpop17/app-ideas',
        'Deployment Guides: https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/',
        'README Template: https://github.com/othneildrew/Best-README-Template',
        'Swagger Documentation: https://swagger.io/docs/'
    ],
    hints: [
        'Start with MVP (Minimum Viable Product) and add features incrementally',
        'Commit frequently with meaningful messages',
        'Test features as you build them',
        'Get feedback early and often',
        'Focus on one feature at a time',
        'Don\'t try to build everything - focus on quality over quantity',
        'Document as you go, not at the end',
        'Plan for deployment from the beginning'
    ],
    presentationGuidelines: [
        'Prepare 5-7 minute presentation',
        'Demonstrate key features',
        'Explain technical challenges and solutions',
        'Discuss what you learned',
        'Show code highlights',
        'Discuss future improvements',
        'Be prepared for Q&A'
    ]
};

// Portfolio Project Checklist
export const portfolioChecklist = {
    title: 'Portfolio Project Checklist',
    description: 'Use this checklist to ensure your capstone project is portfolio-ready',
    categories: [
        {
            name: 'Code Quality',
            items: [
                'Code is clean and well-organized',
                'Consistent naming conventions',
                'No console.logs in production',
                'No commented-out code',
                'Proper error handling throughout',
                'Environment variables used for sensitive data',
                'Code is DRY (Don\'t Repeat Yourself)',
                'Functions are small and focused'
            ]
        },
        {
            name: 'Functionality',
            items: [
                'All features work without errors',
                'Forms validate properly',
                'Authentication works correctly',
                'CRUD operations function properly',
                'No broken links',
                'Images load correctly',
                'Responsive on all devices',
                'Works in multiple browsers'
            ]
        },
        {
            name: 'User Experience',
            items: [
                'Loading states for async operations',
                'Error messages are user-friendly',
                'Success feedback for actions',
                'Intuitive navigation',
                'Consistent design throughout',
                'Accessible (keyboard navigation, screen readers)',
                'Fast load times',
                'Smooth animations'
            ]
        },
        {
            name: 'Documentation',
            items: [
                'README includes project description',
                'Setup instructions are clear',
                'All dependencies listed',
                'Environment variables documented',
                'API endpoints documented',
                'Screenshots included',
                'Live demo link works',
                'Video demo available'
            ]
        },
        {
            name: 'Deployment',
            items: [
                'Frontend deployed and accessible',
                'Backend deployed and accessible',
                'Database hosted (MongoDB Atlas)',
                'Environment variables configured',
                'CORS configured properly',
                'HTTPS enabled',
                'Custom domain (optional)',
                'No deployment errors'
            ]
        },
        {
            name: 'Security',
            items: [
                'Passwords hashed',
                'JWT tokens used properly',
                'Input sanitized',
                'SQL injection prevented',
                'XSS attacks prevented',
                'CORS configured',
                'Rate limiting implemented',
                'Sensitive data not exposed'
            ]
        }
    ]
};
