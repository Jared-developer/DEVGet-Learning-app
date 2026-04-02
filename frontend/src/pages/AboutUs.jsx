import { Link } from 'react-router-dom'
import { Heart, Users, Globe, Target, BookOpen, ArrowRight, GraduationCap, Sparkles, Rocket, Eye } from 'lucide-react'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

const AboutUs = () => {
    const offerings = [
        {
            icon: <Globe className="h-6 w-6" />,
            title: "100% Free Access",
            description: "All courses are completely free for students"
        },
        {
            icon: <BookOpen className="h-6 w-6" />,
            title: "Comprehensive Curriculum",
            description: "From basics to advanced AI/ML and full-stack development"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Community Support",
            description: "Connect with peers and mentors"
        },
        {
            icon: <Heart className="h-6 w-6" />,
            title: "Scholarship Program",
            description: "Supporting underserved youth across Africa"
        }
    ]

    const impact = [
        {
            icon: <Users className="h-8 w-8" />,
            title: "Free for All",
            description: "Every student gets full access to all courses at no cost",
            gradient: "from-accent-500 to-accent-600"
        },
        {
            icon: <Globe className="h-8 w-8" />,
            title: "Malawi Focus",
            description: "Prioritizing underserved youth in Malawi and across Africa",
            gradient: "from-primary-500 to-primary-700"
        },
        {
            icon: <Heart className="h-8 w-8" />,
            title: "Youth-Led",
            description: "Built by young people, for young people",
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
                        <Target className="h-4 w-4" />
                        Our Mission
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
                        Empowering <span className="text-warning-300">African Youth</span>
                        <br />Through Tech & AI Education
                    </h1>
                    <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                        DEVGet Learning is a youth-led project dedicated to providing free, world-class Tech & AI education to underserved youth in Malawi and across Africa
                    </p>
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
                                We envision a future where geographical location and economic status are no longer barriers to world-class Tech & AI education. A future where every young person in Africa has the opportunity to learn, grow, and become a leader in the global technology industry.
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
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Breaking Barriers to Tech & AI Education
                            </h2>
                            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                                We believe that every young person, regardless of their economic background, deserves access to quality Tech & AI education. Our mission is to bridge the digital divide and empower the next generation of African tech leaders.
                            </p>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Through scholarships and free access to comprehensive courses, we're creating opportunities for youth in Malawi and across Africa to develop the skills they need to excel in the global tech industry.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-accent-500 to-primary-600 rounded-2xl p-8 text-white shadow-xl">
                            <h3 className="text-2xl font-bold mb-6">What We Offer</h3>
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
                    <h2 className="text-4xl font-bold text-white mb-4">Support Our Mission</h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Your donation helps us provide free Tech & AI education to underserved youth in Africa. Every contribution makes a difference.
                    </p>
                    <a
                        href="https://wa.me/265994790967?text=Hi%2C%20I%20would%20like%20to%20support%20DEVGet%20Learning%20with%20a%20donation.%20How%20can%20I%20help%3F"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent-600 rounded-xl text-lg font-semibold hover:bg-gray-50 hover:scale-105 transition-all shadow-xl transform duration-300"
                    >
                        <Heart className="h-5 w-5" />
                        Make a Donation
                    </a>
                </div>
            </section>
            {/* Get Started Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-accent-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join our community and start your journey to becoming a skilled developer today - completely free!
                    </p>
                    <Link
                        to="/signin"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent-600 to-primary-600 text-white rounded-xl text-lg font-semibold hover:from-accent-700 hover:to-primary-700 hover:scale-105 transition-all shadow-lg transform duration-300"
                    >
                        <GraduationCap className="h-5 w-5" />
                        Get Started Free
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default AboutUs
