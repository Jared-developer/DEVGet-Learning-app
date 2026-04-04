// MERN Stack Bootcamp - Phase 4 Assignments
// The Complete MERN Stack: Building & Deploying a Full-Stack Application (Weeks 12-14)

// Week 12-13 End of Module Assignment
export const phase4Week12Assignment = {
    title: 'Week 12-13 Assignment: E-Commerce Platform',
    description: 'Build a complete e-commerce platform with products, cart, and checkout functionality',
    dueDate: 'End of Week 13',
    points: 200,
    tasks: [
        {
            id: 1,
            title: 'Backend - Product Management',
            description: 'Create product API with full CRUD operations',
            points: 40,
            requirements: [
                'Create Product model (name, description, price, category, stock, images)',
                'Implement GET /api/products (with pagination, filtering, sorting)',
                'Implement GET /api/products/:id',
                'Implement POST /api/products (admin only)',
                'Implement PUT /api/products/:id (admin only)',
                'Implement DELETE /api/products/:id (admin only)',
                'Add image upload functionality (multer or cloudinary)',
                'Implement search by product name'
            ]
        },
        {
            id: 2,
            title: 'Backend - Shopping Cart',
            description: 'Implement shopping cart functionality',
            points: 30,
            requirements: [
                'Create Cart model (user ref, items array with product ref and quantity)',
                'POST /api/cart/add - Add item to cart',
                'PUT /api/cart/update - Update item quantity',
                'DELETE /api/cart/remove/:productId - Remove item',
                'GET /api/cart - Get user cart with populated products',
                'Calculate total price',
                'Handle stock validation'
            ]
        },
        {
            id: 3,
            title: 'Backend - Order Management',
            description: 'Create order processing system',
            points: 30,
            requirements: [
                'Create Order model (user, items, total, status, shipping address)',
                'POST /api/orders - Create order from cart',
                'GET /api/orders - Get user orders',
                'GET /api/orders/:id - Get single order',
                'PUT /api/orders/:id/status - Update order status (admin)',
                'Clear cart after order creation',
                'Send order confirmation (console log or email)'
            ]
        },
        {
            id: 4,
            title: 'Frontend - Product Catalog',
            description: 'Build product browsing interface',
            points: 40,
            requirements: [
                'Create Products page with grid layout',
                'Display product cards (image, name, price)',
                'Implement category filter',
                'Implement price range filter',
                'Implement search functionality',
                'Add sorting (price, name, newest)',
                'Implement pagination',
                'Create Product Detail page with full information'
            ]
        },
        {
            id: 5,
            title: 'Frontend - Shopping Cart',
            description: 'Build shopping cart interface',
            points: 30,
            requirements: [
                'Create Cart page showing all items',
                'Display item details (image, name, price, quantity)',
                'Add quantity increment/decrement buttons',
                'Add remove item button',
                'Show cart total',
                'Add "Proceed to Checkout" button',
                'Show empty cart message when no items',
                'Update cart count in navigation'
            ]
        },
        {
            id: 6,
            title: 'Frontend - Checkout & Orders',
            description: 'Implement checkout flow and order history',
            points: 30,
            requirements: [
                'Create Checkout page with shipping form',
                'Validate shipping information',
                'Show order summary',
                'Implement place order functionality',
                'Create Orders page showing order history',
                'Display order details (items, total, status, date)',
                'Add order status badges (pending, shipped, delivered)',
                'Show success message after order placement'
            ]
        }
    ],
    submissionGuidelines: [
        'Submit both frontend and backend repository URLs',
        'Include comprehensive README files',
        'Document all API endpoints',
        'Include database schema diagrams',
        'Add sample product data seeder script',
        'Include .env.example files',
        'Deploy both frontend and backend',
        'Provide live demo link'
    ],
    rubric: {
        excellent: '180-200 points: All features work perfectly, excellent UX, clean architecture, deployed successfully',
        good: '160-179 points: All major features work, good UI, minor bugs',
        satisfactory: '140-159 points: Core functionality works, some features incomplete',
        needsImprovement: 'Below 140: Major features missing or broken'
    },
    resources: [
        'Multer for file uploads: https://www.npmjs.com/package/multer',
        'Cloudinary: https://cloudinary.com/documentation',
        'Stripe Payment Integration: https://stripe.com/docs',
        'React Context for Cart: https://react.dev/reference/react/useContext'
    ],
    hints: [
        'Use Context API for global cart state',
        'Implement optimistic UI updates for cart operations',
        'Add loading states for all async operations',
        'Validate stock availability before adding to cart',
        'Use MongoDB aggregation for complex queries',
        'Implement image optimization for better performance'
    ],
    bonusChallenge: {
        description: 'Add payment integration with Stripe',
        points: 20,
        requirements: [
            'Integrate Stripe payment gateway',
            'Create payment intent on backend',
            'Implement Stripe checkout on frontend',
            'Handle payment success/failure',
            'Update order status after payment'
        ]
    }
};

// Week 14 End of Module Assignment
export const phase4Week14Assignment = {
    title: 'Week 14 Assignment: Social Media Dashboard',
    description: 'Build a social media dashboard with posts, likes, comments, and real-time updates',
    dueDate: 'End of Week 14',
    points: 150,
    tasks: [
        {
            id: 1,
            title: 'Backend - Social Features',
            description: 'Implement social media backend functionality',
            points: 50,
            requirements: [
                'Extend User model (bio, avatar, followers, following)',
                'Implement POST /api/users/:id/follow - Follow user',
                'Implement POST /api/users/:id/unfollow - Unfollow user',
                'Implement GET /api/users/:id/followers',
                'Implement GET /api/users/:id/following',
                'Add likes array to Post model',
                'Implement POST /api/posts/:id/like - Toggle like',
                'Implement GET /api/feed - Get posts from followed users'
            ]
        },
        {
            id: 2,
            title: 'Frontend - User Profiles',
            description: 'Build user profile pages',
            points: 30,
            requirements: [
                'Create Profile page showing user info',
                'Display user posts',
                'Show follower/following counts',
                'Add follow/unfollow button',
                'Create Edit Profile page',
                'Implement avatar upload',
                'Show user statistics (post count, followers, following)'
            ]
        },
        {
            id: 3,
            title: 'Frontend - News Feed',
            description: 'Create social media feed',
            points: 40,
            requirements: [
                'Create Feed page showing posts from followed users',
                'Display post cards with author info, content, timestamp',
                'Add like button with count',
                'Add comment button with count',
                'Implement infinite scroll or pagination',
                'Show "No posts yet" message',
                'Add create post form at top of feed',
                'Update feed in real-time after creating post'
            ]
        },
        {
            id: 4,
            title: 'Frontend - Interactions',
            description: 'Implement social interactions',
            points: 30,
            requirements: [
                'Implement like/unlike functionality',
                'Show liked state (filled heart icon)',
                'Display comment section on post detail',
                'Add comment form',
                'Show all comments with author info',
                'Implement delete comment (own comments only)',
                'Add loading states for all interactions',
                'Show success/error notifications'
            ]
        }
    ],
    submissionGuidelines: [
        'Submit both frontend and backend repository URLs',
        'Include comprehensive README files',
        'Document all API endpoints',
        'Add sample users and posts seeder',
        'Include screenshots of all features',
        'Deploy both frontend and backend',
        'Provide live demo link'
    ],
    rubric: {
        excellent: '135-150 points: All features work perfectly, excellent UX, real-time updates, deployed',
        good: '120-134 points: All major features work, good UI, minor issues',
        satisfactory: '105-119 points: Core functionality works, some features incomplete',
        needsImprovement: 'Below 105: Major features missing or broken'
    },
    resources: [
        'Socket.io for real-time: https://socket.io/docs/v4/',
        'React Query: https://tanstack.com/query/latest',
        'Infinite Scroll: https://www.npmjs.com/package/react-infinite-scroll-component',
        'Image Upload: https://cloudinary.com/documentation'
    ],
    hints: [
        'Use React Query for efficient data fetching and caching',
        'Implement optimistic updates for likes',
        'Add debouncing for search functionality',
        'Use virtual scrolling for large lists',
        'Cache user data to reduce API calls',
        'Implement skeleton loaders for better UX'
    ],
    bonusChallenge: {
        description: 'Add real-time notifications with Socket.io',
        points: 20,
        requirements: [
            'Set up Socket.io on backend',
            'Implement real-time notifications for likes and comments',
            'Show notification badge in navigation',
            'Create notifications page',
            'Mark notifications as read'
        ]
    }
};
