import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'
import {
    Key,
    Code,
    Copy,
    Check,
    Eye,
    EyeOff,
    RefreshCw,
    Trash2,
    AlertCircle,
    CheckCircle,
    FileText,
    Terminal,
    Book,
    Lock
} from 'lucide-react'

const DeveloperConsole = () => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [copiedCode, setCopiedCode] = useState(null)
    const [apiKey, setApiKey] = useState(null)
    const [showApiKey, setShowApiKey] = useState(false)
    const [generatingKey, setGeneratingKey] = useState(false)
    const [loadingKey, setLoadingKey] = useState(false)

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text)
        setCopiedCode(id)
        setTimeout(() => setCopiedCode(null), 2000)
    }

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
            navigate('/developer-signin?redirect=/developer-console')
            return
        }

        setGeneratingKey(true)
        try {
            const newKey = 'devget_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('')

            const { error: updateError } = await supabase
                .from('api_keys')
                .update({ is_active: false })
                .eq('user_id', user.id)

            if (updateError && updateError.code !== 'PGRST116') {
                console.error('Error deactivating old keys:', updateError)
            }

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-medium mb-6">
                            <Terminal className="h-4 w-4 mr-2" />
                            Developer Tools
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                            Developer <span className="text-accent-400">Console</span>
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Access API keys, documentation, and integrate DEVGet Learning into your applications
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {!user ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                            <Lock className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h2>
                            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                Access to the Developer Console requires authentication. Sign in to generate API keys and access our developer tools.
                            </p>
                            <Link
                                to="/developer-signin?redirect=/developer-console"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-accent-600 text-white rounded-xl font-semibold hover:bg-accent-700 transition-all shadow-lg"
                            >
                                Sign In to Continue
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content - API Key Management */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* API Key Management */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-accent-600 to-primary-600 p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                <Key className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">API Key Management</h3>
                                                <p className="text-white/90 text-sm">Generate and manage your API access keys</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8">
                                        {loadingKey ? (
                                            <div className="text-center py-8">
                                                <RefreshCw className="h-8 w-8 text-gray-400 mx-auto mb-2 animate-spin" />
                                                <p className="text-sm text-gray-600">Loading your API key...</p>
                                            </div>
                                        ) : apiKey ? (
                                            <div className="space-y-4">
                                                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                                    <div className="flex items-start gap-3">
                                                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-green-900 mb-1">Active API Key</h4>
                                                            <p className="text-sm text-green-700">Your API key is active and ready to use</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm font-medium text-gray-700">Your API Key</span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setShowApiKey(!showApiKey)}
                                                                className="text-gray-600 hover:text-gray-700 p-1"
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
                                                    <code className="text-sm text-gray-900 break-all font-mono">
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
                                                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Revoke Key
                                                    </button>
                                                </div>

                                                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                                    <div className="flex items-start gap-3">
                                                        <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                        <div>
                                                            <h4 className="font-medium text-yellow-900 mb-1">Security Warning</h4>
                                                            <p className="text-sm text-yellow-700">
                                                                Keep your API key secure. Never share it publicly or commit it to version control.
                                                                Regenerating will invalidate the old key immediately.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <Key className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                                <h4 className="text-lg font-bold text-gray-900 mb-2">No API Key Generated</h4>
                                                <p className="text-sm text-gray-600 mb-6">Generate your first API key to start integrating with our platform</p>
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

                                {/* Quick Start Guide */}
                                {apiKey && (
                                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                        <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                    <Code className="h-6 w-6 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white">Quick Start Guide</h3>
                                                    <p className="text-white/90 text-sm">Learn how to use your API key</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-8 space-y-6">
                                            {/* JavaScript Example */}
                                            <section>
                                                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                                    <Code className="h-5 w-5 mr-2 text-yellow-600" />
                                                    JavaScript / Node.js
                                                </h4>
                                                <div className="bg-gray-900 rounded-xl overflow-hidden">
                                                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                                                        <span className="text-sm text-white font-medium">example.js</span>
                                                        <button
                                                            onClick={() => copyToClipboard(`const apiKey = '${apiKey}';\n\nfetch('https://api.devgetlearning.com/v1/courses', {\n  headers: {\n    'Authorization': \`Bearer \${apiKey}\`,\n    'Content-Type': 'application/json'\n  }\n})\n  .then(response => response.json())\n  .then(data => console.log(data))\n  .catch(error => console.error('Error:', error));`, 'js-example')}
                                                            className="text-gray-300 hover:text-white p-1"
                                                        >
                                                            {copiedCode === 'js-example' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                    <pre className="p-4 overflow-x-auto text-sm">
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
                                                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                                    <Code className="h-5 w-5 mr-2 text-blue-600" />
                                                    Python
                                                </h4>
                                                <div className="bg-gray-900 rounded-xl overflow-hidden">
                                                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                                                        <span className="text-sm text-white font-medium">example.py</span>
                                                        <button
                                                            onClick={() => copyToClipboard(`import requests\n\napi_key = '${apiKey}'\nheaders = {\n    'Authorization': f'Bearer {api_key}',\n    'Content-Type': 'application/json'\n}\n\nresponse = requests.get(\n    'https://api.devgetlearning.com/v1/courses',\n    headers=headers\n)\n\nif response.status_code == 200:\n    data = response.json()\n    print(data)\nelse:\n    print(f'Error: {response.status_code}')`, 'py-example')}
                                                            className="text-gray-300 hover:text-white p-1"
                                                        >
                                                            {copiedCode === 'py-example' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                                        </button>
                                                    </div>
                                                    <pre className="p-4 overflow-x-auto text-sm">
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
                                        </div>
                                    </div>
                                )}

                                {/* API Documentation */}
                                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                    <div className="bg-gradient-to-r from-accent-600 to-accent-700 p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-white">API Documentation</h3>
                                                <p className="text-white/90 text-sm">Complete API reference and endpoints</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        {/* Base URL */}
                                        <section>
                                            <h4 className="text-xl font-bold text-gray-900 mb-3">Base URL</h4>
                                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                                <code className="text-sm text-gray-900">https://api.devgetlearning.com/v1</code>
                                            </div>
                                        </section>

                                        {/* Authentication */}
                                        <section>
                                            <h4 className="text-xl font-bold text-gray-900 mb-3">Authentication</h4>
                                            <p className="text-gray-600 mb-4">
                                                All API requests require authentication using your API key in the Authorization header:
                                            </p>
                                            <div className="bg-gray-900 rounded-xl overflow-hidden">
                                                <pre className="p-4 overflow-x-auto text-sm">
                                                    <code className="text-green-400">Authorization: Bearer YOUR_API_KEY</code>
                                                </pre>
                                            </div>
                                        </section>

                                        {/* Endpoints */}
                                        <section>
                                            <h4 className="text-xl font-bold text-gray-900 mb-4">Available Endpoints</h4>

                                            {/* GET /courses */}
                                            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">GET</span>
                                                        <code className="text-sm font-mono text-gray-900">/courses</code>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-600 mb-3">Retrieve a list of all available courses.</p>
                                                    <div className="bg-gray-900 rounded-lg p-4">
                                                        <pre className="text-xs text-gray-300 overflow-x-auto"><code>{`{
  "courses": [
    {
      "id": "mern-stack",
      "title": "MERN Stack Development",
      "description": "Full-stack web development...",
      "duration": "16 weeks",
      "level": "Intermediate"
    }
  ]
}`}</code></pre>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* GET /courses/:id */}
                                            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">GET</span>
                                                        <code className="text-sm font-mono text-gray-900">/courses/:id</code>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-600 mb-3">Get detailed information about a specific course.</p>
                                                    <div className="mb-3">
                                                        <span className="text-sm font-semibold text-gray-700">Parameters:</span>
                                                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                                            <li><code className="bg-gray-100 px-2 py-1 rounded">id</code> - Course identifier</li>
                                                        </ul>
                                                    </div>
                                                    <div className="bg-gray-900 rounded-lg p-4">
                                                        <pre className="text-xs text-gray-300 overflow-x-auto"><code>{`{
  "id": "mern-stack",
  "title": "MERN Stack Development",
  "phases": [...],
  "instructors": [...],
  "enrolled_students": 150
}`}</code></pre>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* GET /students/:id/progress */}
                                            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold">GET</span>
                                                        <code className="text-sm font-mono text-gray-900">/students/:id/progress</code>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-600 mb-3">Track student progress across courses.</p>
                                                    <div className="mb-3">
                                                        <span className="text-sm font-semibold text-gray-700">Parameters:</span>
                                                        <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                                            <li><code className="bg-gray-100 px-2 py-1 rounded">id</code> - Student identifier</li>
                                                        </ul>
                                                    </div>
                                                    <div className="bg-gray-900 rounded-lg p-4">
                                                        <pre className="text-xs text-gray-300 overflow-x-auto"><code>{`{
  "student_id": "user123",
  "courses": [
    {
      "course_id": "mern-stack",
      "progress": 65,
      "completed_lessons": 12,
      "total_lessons": 18
    }
  ]
}`}</code></pre>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* POST /enrollments */}
                                            <div className="mb-6 border border-gray-200 rounded-xl overflow-hidden">
                                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">POST</span>
                                                        <code className="text-sm font-mono text-gray-900">/enrollments</code>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-600 mb-3">Enroll a student in a course.</p>
                                                    <div className="mb-3">
                                                        <span className="text-sm font-semibold text-gray-700">Request Body:</span>
                                                        <div className="bg-gray-900 rounded-lg p-4 mt-2">
                                                            <pre className="text-xs text-gray-300 overflow-x-auto"><code>{`{
  "student_id": "user123",
  "course_id": "mern-stack"
}`}</code></pre>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-900 rounded-lg p-4">
                                                        <pre className="text-xs text-gray-300 overflow-x-auto"><code>{`{
  "success": true,
  "enrollment_id": "enr_abc123",
  "message": "Successfully enrolled"
}`}</code></pre>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        {/* Rate Limits */}
                                        <section>
                                            <h4 className="text-xl font-bold text-gray-900 mb-3">Rate Limits</h4>
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                                                <p className="text-sm text-yellow-800">
                                                    <strong>Standard Rate:</strong> 1,000 requests per hour<br />
                                                    <strong>Note:</strong> All features are free for educational purposes. Contact us if you need higher limits.
                                                </p>
                                            </div>
                                        </section>

                                        {/* Error Codes */}
                                        <section>
                                            <h4 className="text-xl font-bold text-gray-900 mb-3">Error Codes</h4>
                                            <div className="space-y-3">
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <code className="text-sm font-bold text-red-600">400</code>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Bad Request</p>
                                                        <p className="text-sm text-gray-600">Invalid request parameters</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <code className="text-sm font-bold text-red-600">401</code>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Unauthorized</p>
                                                        <p className="text-sm text-gray-600">Invalid or missing API key</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <code className="text-sm font-bold text-red-600">404</code>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Not Found</p>
                                                        <p className="text-sm text-gray-600">Resource does not exist</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <code className="text-sm font-bold text-red-600">429</code>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Too Many Requests</p>
                                                        <p className="text-sm text-gray-600">Rate limit exceeded</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <code className="text-sm font-bold text-red-600">500</code>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Internal Server Error</p>
                                                        <p className="text-sm text-gray-600">Something went wrong on our end</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Quick Links */}
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <Book className="h-5 w-5 mr-2 text-accent-600" />
                                        Documentation
                                    </h3>
                                    <div className="space-y-3">
                                        <a
                                            href="#"
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <FileText className="h-5 w-5 text-accent-600" />
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">API Reference</div>
                                                <div className="text-xs text-gray-600">Complete API documentation</div>
                                            </div>
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <Code className="h-5 w-5 text-accent-600" />
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">Code Examples</div>
                                                <div className="text-xs text-gray-600">Sample implementations</div>
                                            </div>
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <Terminal className="h-5 w-5 text-accent-600" />
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">CLI Tools</div>
                                                <div className="text-xs text-gray-600">Command line utilities</div>
                                            </div>
                                        </a>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-accent-600 to-primary-600 rounded-2xl shadow-lg p-6 text-white">
                                    <h3 className="text-lg font-bold mb-2">Need Help?</h3>
                                    <p className="text-white/90 text-sm mb-4">
                                        Our developer support team is here to help you integrate our API.
                                    </p>
                                    <Link
                                        to="/contact"
                                        className="inline-block bg-white text-accent-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm"
                                    >
                                        Contact Support
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default DeveloperConsole
