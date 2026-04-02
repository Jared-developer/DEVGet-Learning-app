import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import {
    FileText,
    Book,
    ExternalLink,
    Copy,
    Check,
    LinkIcon,
    Star,
    TrendingUp,
    Youtube,
    Github,
    Newspaper,
    Code,
    Database,
    Zap,
    CheckCircle,
    BarChart3,
    AlertCircle,
    Menu,
    X,
    Lightbulb,
    Award,
    Users,
    Bookmark,
    Key,
    RefreshCw,
    Eye,
    EyeOff,
    Trash2,
    Heart,
    Clock
} from 'lucide-react'

const Resources = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [copiedCode, setCopiedCode] = useState(null)
    const [activeSection, setActiveSection] = useState('api')
    const [apiKey, setApiKey] = useState(null)
    const [showApiKey, setShowApiKey] = useState(false)
    const [generatingKey, setGeneratingKey] = useState(false)
    const [loadingKey, setLoadingKey] = useState(false)

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopiedCode(id)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    // Load existing API key
    useEffect(() => {
        if (user) {
            loadApiKey()
        }
    }, [user])

    const loadApiKey = async () => {
        if (!user) return

        setLoadingKey(true)
        try {
            const { data, error } = await supabase
                .from('api_keys')
                .select('key, created_at')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .single()

            if (error) {
                // Table might not exist or no key found
                if (error.code === 'PGRST116' || error.code === '42P01') {
                    console.log('API keys table not set up yet')
                }
                return
            }

            if (data) {
                setApiKey(data.key)
            }
        } catch (error) {
            console.log('Error loading API key:', error.message)
        } finally {
            setLoadingKey(false)
        }
    }

    const generateApiKey = async () => {
        if (!user) {
            navigate('/signin')
            return
        }

        setGeneratingKey(true)
        try {
            // Generate a random API key
            const newKey = 'devget_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')

            // Deactivate old keys
            const { error: updateError } = await supabase
                .from('api_keys')
                .update({ is_active: false })
                .eq('user_id', user.id)

            if (updateError && updateError.code !== 'PGRST116') {
                console.error('Error deactivating old keys:', updateError)
            }

            // Insert new key
            const { error } = await supabase
                .from('api_keys')
                .insert([{
                    user_id: user.id,
                    key: newKey,
                    is_active: true
                }])

            if (error) {
                if (error.code === '42P01') {
                    alert('API keys feature is not set up yet. Please contact your administrator.')
                    return
                }
                throw error
            }

            setApiKey(newKey)
            setShowApiKey(true)
        } catch (error) {
            console.error('Error generating API key:', error)
            alert('Failed to generate API key. Please try again.')
        } finally {
            setGeneratingKey(false)
        }
    }

    const revokeApiKey = async () => {
        if (!confirm('Are you sure you want to revoke your API key? This action cannot be undone.')) {
            return
        }

        try {
            const { error } = await supabase
                .from('api_keys')
                .update({ is_active: false })
                .eq('user_id', user.id)

            if (error) {
                if (error.code === '42P01') {
                    alert('API keys feature is not set up yet.')
                    return
                }
                throw error
            }

            setApiKey(null)
            setShowApiKey(false)
        } catch (error) {
            console.error('Error revoking API key:', error)
            alert('Failed to revoke API key. Please try again.')
        }
    }

    const sections = [
        { id: 'api', label: 'API Documentation', icon: <FileText className="h-4 w-4" /> },
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
            <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-r from-accent-600 via-accent-500 to-primary-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                        <Bookmark className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        Everything you need to succeed
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 px-2">
                        Developer <span className="text-warning-300">Resources</span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                        Curated collection of documentation, tutorials, tools, and articles to accelerate your learning journey
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
                        <div className="bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/20">
                            <div className="text-xl sm:text-2xl font-bold">5+</div>
                            <div className="text-xs sm:text-sm text-white/80">Courses</div>
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
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <nav className="flex overflow-x-auto py-3 sm:py-4 gap-2 sm:gap-3 scrollbar-hide">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm whitespace-nowrap transition-all transform hover:scale-105 ${activeSection === section.id
                                    ? 'bg-gradient-to-r from-accent-600 to-primary-600 text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <span className="flex-shrink-0">{section.icon}</span>
                                <span className="hidden xs:inline sm:inline">{section.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-6 sm:py-8 md:py-12 lg:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
                    {/* API Documentation */}
                    {activeSection === 'api' && (
                        <div className="space-y-4 sm:space-y-6">
                            {/* API Key Management */}
                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-accent-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-accent-600 to-primary-600 p-4 sm:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Key className="h-5 w-5 sm:h-7 sm:w-7 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-lg sm:text-2xl font-bold text-white truncate">API Key Management</h3>
                                            <p className="text-white/90 text-xs sm:text-sm">Generate and manage your API access keys</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 md:p-8">
                                    {!user ? (
                                        <div className="text-center py-8">
                                            <Key className="h-16 w-16 text-primary-300 mx-auto mb-4" />
                                            <h4 className="text-lg font-display font-bold text-primary-900 mb-2">Sign in to Generate API Key</h4>
                                            <p className="text-sm text-primary-600 mb-6">You need to be signed in to generate and manage API keys</p>
                                            <Link
                                                to="/signin?redirect=/resources"
                                                className="inline-block bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-700 transition-all"
                                            >
                                                Sign In
                                            </Link>
                                        </div>
                                    ) : loadingKey ? (
                                        <div className="text-center py-8">
                                            <RefreshCw className="h-8 w-8 text-primary-400 mx-auto mb-2 animate-spin" />
                                            <p className="text-sm text-primary-600">Loading your API key...</p>
                                        </div>
                                    ) : apiKey ? (
                                        <div className="space-y-4">
                                            <div className="bg-success-50 border border-success-200 rounded-xl p-4">
                                                <div className="flex items-start gap-3">
                                                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        <h4 className="font-medium text-success-900 mb-1">Active API Key</h4>
                                                        <p className="text-xs sm:text-sm text-success-700">Your API key is active and ready to use</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs sm:text-sm font-medium text-primary-700">Your API Key</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setShowApiKey(!showApiKey)}
                                                            className="text-primary-600 hover:text-primary-700 p-1"
                                                            title={showApiKey ? 'Hide' : 'Show'}
                                                        >
                                                            {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                        </button>
                                                        <button
                                                            onClick={() => copyToClipboard(apiKey, 'api-key')}
                                                            className="text-accent-600 hover:text-accent-700 p-1"
                                                            title="Copy"
                                                        >
                                                            {copiedCode === 'api-key' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <code className="text-xs sm:text-sm text-primary-900 break-all font-mono">
                                                    {showApiKey ? apiKey : '••••••••••••••••••••••••••••••••'}
                                                </code>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button
                                                    onClick={generateApiKey}
                                                    disabled={generatingKey}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-accent-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-accent-700 transition-all disabled:opacity-50"
                                                >
                                                    <RefreshCw className={`h-4 w-4 ${generatingKey ? 'animate-spin' : ''}`} />
                                                    Regenerate Key
                                                </button>
                                                <button
                                                    onClick={revokeApiKey}
                                                    className="flex-1 flex items-center justify-center gap-2 bg-error-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-error-700 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Revoke Key
                                                </button>
                                            </div>

                                            <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle className="h-5 w-5 text-warning-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium text-warning-900 mb-1">Security Warning</h4>
                                                        <p className="text-xs sm:text-sm text-warning-700">
                                                            Keep your API key secure. Never share it publicly or commit it to version control.
                                                            Regenerating will invalidate the old key immediately.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Key className="h-16 w-16 text-primary-300 mx-auto mb-4" />
                                            <h4 className="text-lg font-display font-bold text-primary-900 mb-2">No API Key Generated</h4>
                                            <p className="text-sm text-primary-600 mb-6">Generate your first API key to start integrating with our platform</p>
                                            <button
                                                onClick={generateApiKey}
                                                disabled={generatingKey}
                                                className="inline-flex items-center gap-2 bg-accent-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-accent-700 transition-all disabled:opacity-50"
                                            >
                                                {generatingKey ? (
                                                    <>
                                                        <RefreshCw className="h-5 w-5 animate-spin" />
                                                        Generating...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Key className="h-5 w-5" />
                                                        Generate API Key
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Quick Start Guide - How to Use Your API Key */}
                            {user && apiKey && (
                                <div className="bg-white rounded-2xl shadow-lg border border-primary-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-4 sm:p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                <Code className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl sm:text-2xl font-display font-bold text-white">Quick Start Guide</h3>
                                                <p className="text-white/90 text-sm sm:text-base">Learn how to use your API key in different languages</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-6 md:p-8 space-y-6">
                                        {/* JavaScript/Node.js Example */}
                                        <section>
                                            <h4 className="text-lg sm:text-xl font-display font-bold text-primary-900 mb-3 flex items-center">
                                                <Code className="h-5 w-5 mr-2 text-yellow-600" />
                                                JavaScript / Node.js
                                            </h4>
                                            <div className="bg-primary-900 rounded-xl overflow-hidden">
                                                <div className="flex items-center justify-between px-4 py-2 bg-primary-800">
                                                    <span className="text-xs sm:text-sm text-white font-medium">example.js</span>
                                                    <button
                                                        onClick={() => copyToClipboard(`const apiKey = '${apiKey}';\n\nfetch('https://api.devgetlearning.com/v1/courses', {\n  headers: {\n    'Authorization': \`Bearer \${apiKey}\`,\n    'Content-Type': 'application/json'\n  }\n})\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error('Error:', error));`, 'js-example')}
                                                        className="text-primary-300 hover:text-white p-1"
                                                    >
                                                        {copiedCode === 'js-example' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                <pre className="p-4 overflow-x-auto text-xs sm:text-sm">
                                                    <code className="text-gray-300">{`const apiKey = '${showApiKey ? apiKey : 'YOUR_API_KEY'}';

fetch('https://api.devgetlearning.com/v1/courses', {
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`}</code>
                                                </pre>
                                            </div>
                                        </section>

                                        {/* Python Example */}
                                        <section>
                                            <h4 className="text-lg sm:text-xl font-display font-bold text-primary-900 mb-3 flex items-center">
                                                <Code className="h-5 w-5 mr-2 text-blue-600" />
                                                Python
                                            </h4>
                                            <div className="bg-primary-900 rounded-xl overflow-hidden">
                                                <div className="flex items-center justify-between px-4 py-2 bg-primary-800">
                                                    <span className="text-xs sm:text-sm text-white font-medium">example.py</span>
                                                    <button
                                                        onClick={() => copyToClipboard(`import requests\n\napi_key = '${apiKey}'\nheaders = {\n    'Authorization': f'Bearer {api_key}',\n    'Content-Type': 'application/json'\n}\n\nresponse = requests.get(\n    'https://api.devgetlearning.com/v1/courses',\n    headers=headers\n)\n\nif response.status_code == 200:\n    data = response.json()\n    print(data)\nelse:\n    print(f'Error: {response.status_code}')`, 'py-example')}
                                                        className="text-primary-300 hover:text-white p-1"
                                                    >
                                                        {copiedCode === 'py-example' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                <pre className="p-4 overflow-x-auto text-xs sm:text-sm">
                                                    <code className="text-gray-300">{`import requests

api_key = '${showApiKey ? apiKey : 'YOUR_API_KEY'}'
headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.devgetlearning.com/v1/courses',
    headers=headers
)

if response.status_code == 200:
    data = response.json()
    print(data)
else:
    print(f'Error: {response.status_code}')`}</code>
                                                </pre>
                                            </div>
                                        </section>

                                        {/* cURL Example */}
                                        <section>
                                            <h4 className="text-lg sm:text-xl font-display font-bold text-primary-900 mb-3 flex items-center">
                                                <Code className="h-5 w-5 mr-2 text-green-600" />
                                                cURL (Command Line)
                                            </h4>
                                            <div className="bg-primary-900 rounded-xl overflow-hidden">
                                                <div className="flex items-center justify-between px-4 py-2 bg-primary-800">
                                                    <span className="text-xs sm:text-sm text-white font-medium">Terminal</span>
                                                    <button
                                                        onClick={() => copyToClipboard(`curl -H "Authorization: Bearer ${apiKey}" \\\n     -H "Content-Type: application/json" \\\n     https://api.devgetlearning.com/v1/courses`, 'curl-example')}
                                                        className="text-primary-300 hover:text-white p-1"
                                                    >
                                                        {copiedCode === 'curl-example' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                <pre className="p-4 overflow-x-auto text-xs sm:text-sm">
                                                    <code className="text-gray-300">{`curl -H "Authorization: Bearer ${showApiKey ? apiKey : 'YOUR_API_KEY'}" \\
     -H "Content-Type: application/json" \\
     https://api.devgetlearning.com/v1/courses`}</code>
                                                </pre>
                                            </div>
                                        </section>

                                        {/* Best Practices */}
                                        <section>
                                            <h4 className="text-lg sm:text-xl font-display font-bold text-primary-900 mb-3 flex items-center">
                                                <Lightbulb className="h-5 w-5 mr-2 text-accent-600" />
                                                Best Practices
                                            </h4>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                                                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-primary-900 text-sm sm:text-base">Use Environment Variables</p>
                                                        <p className="text-xs sm:text-sm text-primary-600">Store your API key in environment variables, never hardcode it in your source code.</p>
                                                        <code className="text-xs bg-primary-100 px-2 py-1 rounded mt-1 inline-block">process.env.API_KEY</code>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                                                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-primary-900 text-sm sm:text-base">Keep Keys Secure</p>
                                                        <p className="text-xs sm:text-sm text-primary-600">Never commit API keys to version control. Add them to .gitignore.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                                                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-primary-900 text-sm sm:text-base">Handle Errors Gracefully</p>
                                                        <p className="text-xs sm:text-sm text-primary-600">Always implement proper error handling for API requests.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                                                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-primary-900 text-sm sm:text-base">Respect Rate Limits</p>
                                                        <p className="text-xs sm:text-sm text-primary-600">Monitor your API usage and implement rate limiting in your application.</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg">
                                                    <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-primary-900 text-sm sm:text-base">Regenerate if Compromised</p>
                                                        <p className="text-xs sm:text-sm text-primary-600">If you suspect your key has been exposed, regenerate it immediately.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}

                            {/* API Integration Documentation */}
                            <div className="bg-white rounded-2xl shadow-lg border border-primary-200 overflow-hidden">
                                <div className="bg-gradient-to-r from-accent-600 to-accent-700 p-4 sm:p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">API Integration Documentation</h3>
                                            <p className="text-white/90 text-sm sm:text-base">Complete guide to integrating with our platform API</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6 md:p-8 space-y-6">
                                    {/* Getting Started */}
                                    <section>
                                        <h4 className="text-lg sm:text-xl font-display font-bold text-primary-900 mb-3 flex items-center">
                                            <Zap className="h-5 w-5 mr-2 text-accent-600" />
                                            Getting Started
                                        </h4>
                                        <p className="text-sm sm:text-base text-primary-600 mb-4">
                                            Our API allows you to programmatically access course data, manage enrollments, and track student progress.
                                        </p>
                                        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs sm:text-sm font-medium text-primary-700">Base URL</span>
                                                <button
                                                    onClick={() => copyToClipboard('https://api.devgetlearning.com/v1', 'base-url')}
                                                    className="text-accent-600 hover:text-accent-700 p-1"
                                                >
                                                    {copiedCode === 'base-url' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <code className="text-xs sm:text-sm text-primary-900 break-all">https://api.devgetlearning.com/v1</code>
                                        </div>
                                    </section>

                                    {/* Authentication */}
                                    <section>
                                        <h4 className="text-lg sm:text-xl font-display font-bold text-primary-900 mb-3 flex items-center">
                                            <CheckCircle className="h-5 w-5 mr-2 text-accent-600" />
                                            Authentication
                                        </h4>
                                        <div className="bg-primary-900 rounded-xl overflow-hidden">
                                            <div className="flex items-center justify-between px-4 py-2 bg-primary-800">
                                                <span className="text-xs sm:text-sm text-white font-medium">Request Header</span>
                                                <button
                                                    onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth-header')}
                                                    className="text-primary-300 hover:text-white p-1"
                                                >
                                                    {copiedCode === 'auth-header' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            <pre className="p-4 overflow-x-auto text-xs sm:text-sm">
                                                <code className="text-green-400">Authorization: Bearer YOUR_API_KEY</code>
                                            </pre>
                                        </div>
                                    </section>

                                    {/* Rate Limits */}
                                    <section>
                                        <h4 className="text-lg sm:text-xl font-display font-bold text-primary-900 mb-3 flex items-center">
                                            <BarChart3 className="h-5 w-5 mr-2 text-accent-600" />
                                            Rate Limits
                                        </h4>
                                        <div className="bg-warning-50 border border-warning-200 rounded-xl p-4">
                                            <p className="text-sm sm:text-base text-warning-800">
                                                <strong>Standard Rate:</strong> 1,000 requests/hour<br />
                                                <strong>Note:</strong> All features are free for students. Contact us if you need higher limits.
                                            </p>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    )}

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
                                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-accent-500 hover:shadow-xl transition-all group transform hover:scale-105 duration-300"
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
                                            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-accent-600 transition-colors flex-shrink-0" />
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
                            <div className="space-y-3 sm:space-y-4">
                                {articles.map((article, index) => (
                                    <a
                                        key={index}
                                        href={article.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-accent-500 hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                                                    <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-accent-500 to-primary-600 text-white rounded-full text-xs font-medium shadow-sm">
                                                        {article.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {article.readTime} read
                                                    </span>
                                                </div>
                                                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-accent-600 transition-colors line-clamp-2">
                                                    {article.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{article.description}</p>
                                            </div>
                                            <ExternalLink className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-accent-600 transition-colors flex-shrink-0" />
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
                                        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-accent-500 hover:shadow-xl transition-all group transform hover:scale-105 duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                                            <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-accent-600 transition-colors line-clamp-1">
                                                {tool.name}
                                            </h3>
                                            {tool.free && (
                                                <span className="px-2 sm:px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium shadow-sm flex-shrink-0">
                                                    Free
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">{tool.description}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">{tool.category}</span>
                                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-accent-600 transition-colors" />
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Community Resources */}
                    {activeSection === 'community' && (
                        <div className="space-y-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Community Resources</h2>
                                <p className="text-lg text-gray-600">Connect with fellow developers worldwide</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {communityResources.map((resource, index) => (
                                    <a
                                        key={index}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-accent-500 hover:shadow-xl transition-all group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-accent-500 to-primary-600 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                                                {resource.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-accent-600 transition-colors">
                                                    {resource.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-primary-600">{resource.description}</p>
                                            </div>
                                            <ExternalLink className="h-5 w-5 text-primary-400 group-hover:text-accent-600 transition-colors flex-shrink-0" />
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
