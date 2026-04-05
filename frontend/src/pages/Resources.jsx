import { useState } from 'react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import {
    Book,
    ExternalLink,
    TrendingUp,
    Github,
    Newspaper,
    Code,
    Database,
    Zap,
    CheckCircle,
    Award,
    Users,
    Bookmark,
    Clock
} from 'lucide-react'

const Resources = () => {
    const [activeSection, setActiveSection] = useState('tutorials')

    const sections = [
        { id: 'tutorials', label: 'Tutorials & Guides', icon: <Book className="h-4 w-4" /> },
        { id: 'articles', label: 'Articles & Blogs', icon: <Newspaper className="h-4 w-4" /> },
        { id: 'tools', label: 'Recommended Tools', icon: <Zap className="h-4 w-4" /> },
        { id: 'community', label: 'Community Resources', icon: <Users className="h-4 w-4" /> }
    ]

    const tutorials = [
        {
            title: 'Getting Started with React',
            description: 'Learn the fundamentals of React and build your first component',
            url: 'https://react.dev/learn',
            level: 'Beginner',
            duration: '2 hours',
            icon: <Code className="h-6 w-6" />
        },
        {
            title: 'Node.js Best Practices',
            description: 'Master Node.js development with industry-standard practices',
            url: 'https://github.com/goldbergyoni/nodebestpractices',
            level: 'Intermediate',
            duration: '4 hours',
            icon: <CheckCircle className="h-6 w-6" />
        },
        {
            title: 'MongoDB University',
            description: 'Free courses on MongoDB from basics to advanced topics',
            url: 'https://learn.mongodb.com/',
            level: 'All Levels',
            duration: 'Self-paced',
            icon: <Database className="h-6 w-6" />
        },
        {
            title: 'Machine Learning Crash Course',
            description: 'Google\'s fast-paced introduction to machine learning',
            url: 'https://developers.google.com/machine-learning/crash-course',
            level: 'Intermediate',
            duration: '15 hours',
            icon: <TrendingUp className="h-6 w-6" />
        }
    ]

    const articles = [
        {
            title: 'The State of JavaScript 2024',
            description: 'Annual survey results and trends in the JavaScript ecosystem',
            url: 'https://stateofjs.com/',
            category: 'Industry Trends',
            readTime: '10 min'
        },
        {
            title: 'Clean Code Principles',
            description: 'Essential principles for writing maintainable and scalable code',
            url: 'https://github.com/ryanmcdermott/clean-code-javascript',
            category: 'Best Practices',
            readTime: '15 min'
        },
        {
            title: 'Web Performance Optimization',
            description: 'Techniques to make your web applications faster',
            url: 'https://web.dev/performance/',
            category: 'Performance',
            readTime: '20 min'
        },
        {
            title: 'AI Ethics and Responsible AI',
            description: 'Understanding ethical considerations in AI development',
            url: 'https://ai.google/responsibility/principles/',
            category: 'AI/ML',
            readTime: '12 min'
        }
    ]

    const tools = [
        {
            name: 'VS Code',
            description: 'Powerful, lightweight code editor with extensive extensions',
            url: 'https://code.visualstudio.com/',
            category: 'Editor',
            free: true
        },
        {
            name: 'Postman',
            description: 'API development and testing platform',
            url: 'https://www.postman.com/',
            category: 'API Testing',
            free: true
        },
        {
            name: 'GitHub',
            description: 'Version control and collaboration platform',
            url: 'https://github.com/',
            category: 'Version Control',
            free: true
        },
        {
            name: 'Figma',
            description: 'Collaborative interface design tool',
            url: 'https://www.figma.com/',
            category: 'Design',
            free: true
        },
        {
            name: 'Docker',
            description: 'Containerization platform for consistent development environments',
            url: 'https://www.docker.com/',
            category: 'DevOps',
            free: true
        },
        {
            name: 'Vercel',
            description: 'Platform for frontend deployment and hosting',
            url: 'https://vercel.com/',
            category: 'Deployment',
            free: true
        }
    ]

    const communityResources = [
        {
            name: 'Stack Overflow',
            description: 'Q&A community for developers',
            url: 'https://stackoverflow.com/',
            icon: <Users className="h-6 w-6" />
        },
        {
            name: 'Dev.to',
            description: 'Community of software developers sharing knowledge',
            url: 'https://dev.to/',
            icon: <Newspaper className="h-6 w-6" />
        },
        {
            name: 'GitHub Discussions',
            description: 'Collaborative communication forum for open source projects',
            url: 'https://github.com/discussions',
            icon: <Github className="h-6 w-6" />
        },
        {
            name: 'freeCodeCamp',
            description: 'Learn to code with free tutorials and projects',
            url: 'https://www.freecodecamp.org/',
            icon: <Award className="h-6 w-6" />
        }
    ]

    return (
        <div className="min-h-screen bg-white">
            <Navigation currentPage="resources" />

            {/* Hero Section */}
            <section className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-r from-accent-600 via-accent-500 to-primary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                        <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Everything you need to succeed
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 px-2">
                        Developer <span className="text-warning-300">Resources</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                        Curated collection of tutorials, tools, and articles to accelerate your learning journey
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
                        <div className="bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/20">
                            <div className="text-xl sm:text-2xl font-bold">100+</div>
                            <div className="text-xs sm:text-sm text-white/80">Resources</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/20">
                            <div className="text-xl sm:text-2xl font-bold">Free</div>
                            <div className="text-xs sm:text-sm text-white/80">Access</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/20">
                            <div className="text-xl sm:text-2xl font-bold">24/7</div>
                            <div className="text-xs sm:text-sm text-white/80">Available</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Navigation */}
            <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-md">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative">
                    {/* Scroll indicator gradient on left */}
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 sm:hidden"></div>
                    {/* Scroll indicator gradient on right */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 sm:hidden"></div>

                    <nav className="flex overflow-x-auto py-3 sm:py-4 gap-2 sm:gap-3 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all transform active:scale-95 sm:hover:scale-105 flex-shrink-0 ${activeSection === section.id
                                    ? 'bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 active:bg-gray-200 sm:hover:bg-gray-200'
                                    }`}
                            >
                                <span className="flex-shrink-0">{section.icon}</span>
                                <span className="hidden min-[400px]:inline">{section.label}</span>
                                <span className="min-[400px]:hidden">{section.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    {/* Tutorials & Guides */}
                    {activeSection === 'tutorials' && (
                        <div className="space-y-6 sm:space-y-8">
                            <div className="text-center mb-6 sm:mb-8 px-4">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Tutorials & Guides</h2>
                                <p className="text-base sm:text-lg text-gray-600">Hand-picked tutorials to enhance your skills</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {tutorials.map((tutorial, index) => (
                                    <a
                                        key={index}
                                        href={tutorial.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-accent-500 hover:shadow-xl transition-all group transform hover:scale-105"
                                    >
                                        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent-500 to-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                                                {tutorial.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
                                                    {tutorial.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{tutorial.description}</p>
                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    <span className="px-2 sm:px-3 py-1 bg-accent-100 text-accent-700 rounded-full font-medium">{tutorial.level}</span>
                                                    <span className="text-gray-500 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {tutorial.duration}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-accent-600 text-xs sm:text-sm font-medium">
                                            Start Learning
                                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Articles & Blogs */}
                    {activeSection === 'articles' && (
                        <div className="space-y-6 sm:space-y-8">
                            <div className="text-center mb-6 sm:mb-8 px-4">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Articles & Blogs</h2>
                                <p className="text-base sm:text-lg text-gray-600">Stay updated with the latest in tech</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {articles.map((article, index) => (
                                    <a
                                        key={index}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-accent-500 hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                                            <span className="px-2 sm:px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                                                {article.category}
                                            </span>
                                            <span className="text-gray-500 text-xs flex items-center gap-1 flex-shrink-0">
                                                <Clock className="h-3 w-3" />
                                                {article.readTime}
                                            </span>
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{article.description}</p>
                                        <div className="flex items-center text-accent-600 text-xs sm:text-sm font-medium">
                                            Read Article
                                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recommended Tools */}
                    {activeSection === 'tools' && (
                        <div className="space-y-6 sm:space-y-8">
                            <div className="text-center mb-6 sm:mb-8 px-4">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Recommended Tools</h2>
                                <p className="text-base sm:text-lg text-gray-600">Essential tools for modern development</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {tools.map((tool, index) => (
                                    <a
                                        key={index}
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-accent-500 hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                                            <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                                {tool.category}
                                            </span>
                                            {tool.free && (
                                                <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex-shrink-0">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-1">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{tool.description}</p>
                                        <div className="flex items-center text-accent-600 text-xs sm:text-sm font-medium">
                                            Visit Website
                                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Community Resources */}
                    {activeSection === 'community' && (
                        <div className="space-y-6 sm:space-y-8">
                            <div className="text-center mb-6 sm:mb-8 px-4">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Community Resources</h2>
                                <p className="text-base sm:text-lg text-gray-600">Connect with fellow developers worldwide</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {communityResources.map((resource, index) => (
                                    <a
                                        key={index}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-accent-500 hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-start gap-3 sm:gap-4">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-accent-500 to-primary-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                                {resource.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-accent-600 transition-colors line-clamp-1">
                                                    {resource.name}
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{resource.description}</p>
                                                <div className="flex items-center text-accent-600 text-xs sm:text-sm font-medium">
                                                    Join Community
                                                    <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Resources
