import { Link } from 'react-router-dom'
import { Heart, Users, Globe, Target, BookOpen, ArrowRight, GraduationCap, Sparkles, Rocket, Eye } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const AboutUs = () => {
    const offerings = [
        {
            icon: <GraduationCap className="h-6 w-6" />,
            title: "Scholarship-Based Access",
            description: "100% free education through our scholarship program"
        },
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: "Comprehensive Curriculum",
            description: "From basics to advanced AI/ML and full-stack development"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Community Support",
            description: "Connect with peers, mentors, and industry professionals"
        },
        {
            icon: <Heart className="h-6 w-6" />,
            title: "Youth Empowerment",
            description: "Supporting underserved youth across Africa to achieve their dreams"
        }
    ]

    const impact = [
        {
            icon: <GraduationCap className="h-8 w-8" />,
            title: "Scholarship-Based",
            description: "Every student receives a full scholarship covering all courses and materials",
            gradient: "from-accent-500 to-accent-600"
        },
        {
            icon: <Globe className="h-8 w-8" />,
            title: "Africa-Focused",
            description: "An award winning project prioritizing underserved communities across the African continent",
            gradient: "from-primary-500 to-primary-700"
        },
        {
            icon: <Heart className="h-8 w-8" />,
            title: "Multi-Disciplinary Team",
            description: "Built by a multi-disciplinary team, creating opportunities for all",
            gradient: "from-success-500 to-success-600"
        }
    ]

    const values = [
        {
            icon: <Target className="h-6 w-6" />,
            title: "Accessibility",
            description: "Breaking down financial barriers to quality Tech & AI education"
        },
        {
            icon: <Sparkles className="h-6 w-6" />,
            title: "Excellence",
            description: "Delivering world-class curriculum and learning experiences"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Community",
            description: "Building a supportive network of learners and mentors"
        },
        {
            icon: <Rocket className="h-6 w-6" />,
            title: "Innovation",
            description: "Embracing cutting-edge technologies and teaching methods"
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Navigation currentPage="about" />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-accent-600 via-accent-500 to-primary-600">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8">
                        <GraduationCap className="h-4 w-4" />
                        Scholarship-Based Learning
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        Empowering <span className="text-warning-300">African Youth</span>
                        <br />Through Free Tech & AI Education
                    </h1>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                        An award winning project providing free tech and AI education to underserved communities across Africa
                    </p>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                        <Heart className="h-5 w-5 text-white" />
                        <span className="text-white font-semibold">All courses are completely free through our scholarship program</span>
                    </div>
                </div>
            </section>

            {/* Vision Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-accent-50 via-primary-50 to-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-600 to-primary-600 rounded-full text-white text-sm font-medium mb-6">
                            <Eye className="h-4 w-4" />
                            Our Vision
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                            A Future Where Every African Youth
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-600 via-accent-500 to-primary-600">
                                Has Access to Tech & AI Education
                            </span>
                        </h2>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-accent-100">
                            <p className="text-xl text-gray-700 leading-relaxed mb-6">
                                We envision a future where geographical location and economic status are no longer barriers to world-class Tech & AI education. As an award winning project, we're committed to providing free tech and AI education to underserved communities across Africa, ensuring every young person has the opportunity to learn, grow, and become a leader in the global technology industry.
                            </p>
                            <p className="text-xl text-gray-700 leading-relaxed mb-6">
                                Through DEVGet Learning, we're building a movement that transforms lives, communities, and entire nations by empowering the next generation with the skills, knowledge, and confidence to shape the digital future of Africa and beyond.
                            </p>
                            <div className="flex items-center gap-4 pt-6 border-t border-accent-200">
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-primary-600 rounded-full flex items-center justify-center">
                                    <Rocket className="h-8 w-8 text-white" />
                                </div>
                                <p className="text-lg font-semibold text-gray-900">
                                    Building Africa's tech future, one student at a time
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-100 rounded-full text-accent-700 text-sm font-medium mb-6">
                                <GraduationCap className="h-4 w-4" />
                                Scholarship Program
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Breaking Barriers Through Scholarships
                            </h2>
                            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                                We believe that financial constraints should never limit a young person's potential. As an award winning project, DEVGet Learning operates on a 100% scholarship basis - every student receives full access to all courses, materials, and resources at absolutely no cost.
                            </p>
                            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                                Our scholarship program is designed to reach underserved communities across Africa, providing them with the same quality Tech & AI education available to students anywhere in the world.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Through partnerships, donations, and community support, we're creating opportunities for the next generation of African tech leaders to develop the skills they need to excel in the global digital economy.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-accent-500 to-primary-600 rounded-2xl p-8 text-white shadow-xl">
                            <h3 className="text-2xl font-bold mb-6">What Your Scholarship Includes</h3>
                            <div className="space-y-4">
                                {offerings.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                                            <p className="text-white/90 text-sm">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/20">
                                <p className="text-sm text-white/90 italic">
                                    "Education is the most powerful weapon which you can use to change the world." - Nelson Mandela
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => {
                            const gradients = [
                                'from-accent-500 to-accent-600',
                                'from-primary-500 to-primary-700',
                                'from-success-500 to-success-600',
                                'from-warning-500 to-warning-600'
                            ]
                            return (
                                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:scale-105 transform duration-300">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${gradients[index]} rounded-lg flex items-center justify-center text-white mb-4`}>
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Impact</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Together, we're building a brighter future for African youth
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {impact.map((item, index) => (
                            <div key={index} className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all text-center">
                                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-4 text-white`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Donate CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-success-600 to-accent-600">
                <div className="max-w-4xl mx-auto text-center">
                    <Heart className="h-16 w-16 text-white mx-auto mb-6 animate-pulse" />
                    <h2 className="text-4xl font-bold text-white mb-4">Support Our Scholarship Program</h2>
                    <p className="text-xl text-white/90 mb-4 max-w-2xl mx-auto">
                        Your donation directly funds scholarships for underserved youth in Africa, giving them access to world-class Tech & AI education.
                    </p>
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                        Every contribution helps us provide free courses, learning materials, and mentorship to students who need it most. Together, we can transform lives and build Africa's tech future.
                    </p>
                    <a
                        href="https://wa.me/265994790967?text=Hi%2C%20I%20would%20like%20to%20support%20DEVGet%20Learning%27s%20scholarship%20program%20with%20a%20donation.%20How%20can%20I%20help%3F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent-600 rounded-xl text-lg font-semibold hover:bg-gray-50 hover:scale-105 transition-all shadow-xl transform duration-300"
                    >
                        <Heart className="h-5 w-5" />
                        Donate to Scholarships
                    </a>
                    <p className="text-sm text-white/80 mt-6">
                        100% of donations go directly to student scholarships and educational resources
                    </p>
                </div>
            </section>
            {/* Get Started Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-accent-50">
                <div className="max-w-4xl mx-auto text-center">
                    <GraduationCap className="h-16 w-16 text-accent-600 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Apply for a Scholarship Today</h2>
                    <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
                        Our scholarship program is open to all motivated youth across Africa who are passionate about learning Tech & AI. As an award winning project, we're committed to breaking down barriers to quality education.
                    </p>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        No application fees. No tuition costs. No hidden charges. Just your commitment to learning and growing.
                    </p>
                    <div className="bg-accent-50 border border-accent-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Scholarship Benefits Include:</h3>
                        <ul className="text-left space-y-2 text-gray-700">
                            <li className="flex items-start gap-2">
                                <span className="text-accent-600 mt-1">✓</span>
                                <span>Full access to all courses (MERN Stack, AI/ML, Agentic AI, and more)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-600 mt-1">✓</span>
                                <span>Learning materials, assignments, and projects</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-600 mt-1">✓</span>
                                <span>Mentorship and community support</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-600 mt-1">✓</span>
                                <span>Certificates upon course completion</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-accent-600 mt-1">✓</span>
                                <span>Career guidance and job placement support</span>
                            </li>
                        </ul>
                    </div>
                    <Link
                        to="/#admissions"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-600 to-primary-600 text-white rounded-xl text-lg font-semibold hover:from-accent-700 hover:to-primary-700 hover:scale-105 transition-all shadow-lg transform duration-300"
                    >
                        <GraduationCap className="h-5 w-5" />
                        Apply for Scholarship Now
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">
                        Applications are reviewed on a rolling basis. Start your journey today!
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default AboutUs
