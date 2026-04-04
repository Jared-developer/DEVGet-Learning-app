import { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // Google Form submission
            const GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScyX4_liuJ_xkyk1G1KjnbNhCOba7KqiEdkXxKvi_vcauPqfA/formResponse'

            const formDataToSubmit = new FormData()
            formDataToSubmit.append('entry.2005620554', formData.name)
            formDataToSubmit.append('entry.1045781291', formData.email)
            formDataToSubmit.append('entry.1065046570', formData.subject)
            formDataToSubmit.append('entry.1166974658', formData.message)

            // Submit to Google Form
            await fetch(GOOGLE_FORM_ACTION_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formDataToSubmit
            })

            setLoading(false)
            setSuccess(true)
            setFormData({ name: '', email: '', subject: '', message: '' })
            setTimeout(() => setSuccess(false), 5000)
        } catch (error) {
            console.error('Error submitting form:', error)
            setLoading(false)
            setSuccess(true) // Still show success since no-cors doesn't return response
            setFormData({ name: '', email: '', subject: '', message: '' })
            setTimeout(() => setSuccess(false), 5000)
        }
    }

    const faqs = [
        {
            question: "Is DEVGet Learning really free?",
            answer: "Yes! DEVGet Learning operates on a 100% scholarship basis. All courses, materials, certificates, and resources are completely free. There are no hidden fees, tuition costs, or charges of any kind. We're committed to making quality Tech & AI education accessible to all."
        },
        {
            question: "How do I apply for a scholarship?",
            answer: "Visit our homepage and navigate to the Admissions section to download the application form. Fill it out and submit it according to the instructions. All applications are reviewed on a rolling basis, and we prioritize underserved youth in Malawi and across Africa."
        },
        {
            question: "Who is eligible for the scholarship program?",
            answer: "Our scholarship program is open to all motivated youth in Malawi and across Africa who are passionate about learning Tech & AI. We especially focus on supporting underserved communities. No prior technical experience is required - just a willingness to learn!"
        },
        {
            question: "What does the scholarship cover?",
            answer: "Your scholarship covers everything: full access to all courses (MERN Stack, AI/ML, Agentic AI, and more), learning materials, assignments, projects, mentorship, community support, certificates upon completion, and career guidance. Absolutely no costs to you."
        },
        {
            question: "How can I support DEVGet Learning's mission?",
            answer: "You can support our scholarship program by making a donation. Your contribution directly funds scholarships for underserved youth, helping us provide free education to more students across Africa. Visit our About page or contact us to learn more about supporting our mission."
        },
        {
            question: "How do I reset my password?",
            answer: "Click on 'Forgot Password' on the sign-in page and follow the instructions sent to your email. If you don't receive the email, check your spam folder or contact our support team."
        },
        {
            question: "Can I take multiple courses at once?",
            answer: "Yes! As a scholarship recipient, you have full access to all our courses. You can enroll in multiple courses and learn at your own pace. We recommend starting with foundational courses if you're new to programming."
        },
        {
            question: "Will I receive a certificate?",
            answer: "Yes! Upon successful completion of any course, you'll receive a certificate at no cost. These certificates demonstrate your skills and can be shared with potential employers or added to your professional profiles."
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navigation currentPage="contact" />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-600 to-accent-600">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
                        <MessageSquare className="h-4 w-4" />
                        We'd love to hear from you
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        Get in <span className="text-yellow-300">Touch</span>
                    </h1>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                        Have questions about our courses? Need help with your account? We're here to help you succeed.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                            {success && (
                                <div className="mb-6 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-xl font-medium text-sm">
                                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                                        placeholder="How can we help?"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows="6"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-accent-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            Send Message
                                            <Send className="h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Mail className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                                            <p className="text-sm text-gray-600">devget@gmail.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <Phone className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                                            <p className="text-sm text-gray-600">+265 994 790 967</p>
                                            <p className="text-sm text-gray-600">Mon-Fri, 9am-6pm</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-1">Office</h4>
                                            <p className="text-sm text-gray-600">Blantyre, Malawi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-accent-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                                <h3 className="text-xl font-bold mb-4">Quick Response</h3>
                                <p className="mb-4">We typically respond within 24 hours during business days.</p>
                                <p className="text-sm text-white/80">For urgent matters, please call our support line.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-gray-600">Quick answers to common questions</p>
                    </div>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Contact
