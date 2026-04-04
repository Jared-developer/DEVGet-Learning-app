import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import SignIn from './pages/SignIn'
import DeveloperSignIn from './pages/DeveloperSignIn'
import DeveloperSignUp from './pages/DeveloperSignUp'
import Dashboard from './pages/Dashboard'
import CoursePage from './pages/CoursePage'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Resources from './pages/Resources'
import DeveloperConsole from './pages/DeveloperConsole'
import ProtectedRoute from './components/ProtectedRoute'
import InstructorDashboard from './components/InstructorDashboard'

function App() {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="min-h-screen bg-gray-50">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/about" element={<AboutUs />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/developer-console" element={<DeveloperConsole />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/developer-signin" element={<DeveloperSignIn />} />
                        <Route path="/developer-signup" element={<DeveloperSignUp />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/course/:courseId"
                            element={
                                <ProtectedRoute>
                                    <CoursePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/instructor/dashboard"
                            element={
                                <ProtectedRoute>
                                    <InstructorDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    )
}

export default App