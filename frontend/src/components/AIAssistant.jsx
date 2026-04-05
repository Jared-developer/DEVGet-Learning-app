import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import aiService from '../services/aiService';
import {
    MessageCircle,
    X,
    Send,
    Bot,
    User,
    Minimize2,
    Maximize2,
    Lightbulb,
    Loader,
    Sparkles
} from 'lucide-react';

const AIAssistant = ({ courseId, lessonTitle }) => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [isAdvancedCourse, setIsAdvancedCourse] = useState(true); // Assume true initially
    const [accessError, setAccessError] = useState(null);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load suggestions when component mounts or lesson changes
    useEffect(() => {
        if (isOpen && courseId) {
            loadSuggestions();
        }
    }, [isOpen, courseId, lessonTitle]);

    // Initialize conversation with welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            if (!courseId) {
                const noCourseMessage = {
                    id: Date.now(),
                    type: 'ai',
                    content: `👋 Hi! I'm Get.AI, your learning assistant.\n\nTo use me, please open a Pro course (MERN Stack, AI & Machine Learning, or Agentic AI). I'll provide personalized help with course concepts and answer your questions!`,
                    timestamp: new Date()
                };
                setMessages([noCourseMessage]);
            } else if (!isAdvancedCourse && accessError) {
                const restrictionMessage = {
                    id: Date.now(),
                    type: 'ai',
                    content: `🔒 ${accessError}\n\nGet.AI assistant provides personalized help with course concepts, answers your questions, and guides you through challenging topics. Upgrade to Pro to unlock this feature!`,
                    timestamp: new Date()
                };
                setMessages([restrictionMessage]);
            } else {
                const welcomeMessage = {
                    id: Date.now(),
                    type: 'ai',
                    content: `Hi! I'm Get.AI, your learning assistant for this course. I'm here to help you understand course concepts and answer your questions. What would you like to learn about?`,
                    timestamp: new Date()
                };
                setMessages([welcomeMessage]);
            }
        }
    }, [isOpen, isAdvancedCourse, accessError, courseId]);

    const loadSuggestions = async () => {
        try {
            const data = await aiService.getSuggestions(courseId, lessonTitle);
            setSuggestions(data.data.suggestions || []);
            setIsAdvancedCourse(true);
            setAccessError(null);
        } catch (error) {
            console.error('Failed to load suggestions:', error);
            if (error.response?.status === 403) {
                setIsAdvancedCourse(false);
                setAccessError(error.response?.data?.message || 'Get.AI is only available for Pro courses');
            }
        }
    };

    const sendMessage = async (messageText = inputMessage) => {
        if (!messageText.trim() || isLoading) return;

        // Check if courseId is provided
        if (!courseId) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: "Please open a course to use Get.AI assistant. The AI assistant provides course-specific help and is available in Pro courses.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            return;
        }

        // Check if user has access
        if (!isAdvancedCourse) {
            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: "🔒 Get.AI assistant is only available for Pro courses. Please upgrade your plan to access AI assistance!",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            return;
        }

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: messageText.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Build conversation history for context
            const conversationHistory = messages.map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            const data = await aiService.sendMessage(
                messageText.trim(),
                courseId,
                conversationHistory
            );

            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: data.data.response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            let errorContent = "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";

            if (error.response?.status === 403) {
                errorContent = "🔒 " + (error.response?.data?.message || "Get.AI is only available for Pro courses. Please upgrade to continue!");
                setIsAdvancedCourse(false);
            }

            const errorMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: errorContent,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        sendMessage(suggestion);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const toggleAssistant = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setIsMinimized(false);
        }
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={toggleAssistant}
                    className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-r from-accent-600 to-accent-700 text-white p-3 sm:p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 group"
                    title="Get.AI Assistant"
                >
                    <div className="relative">
                        <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
                        <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                    </div>
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-success-500 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center animate-pulse">
                        AI
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl border border-primary-200 z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[85vh] sm:h-[500px]'
                    } w-full sm:w-96`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-3 sm:p-4 border-b border-primary-200 bg-gradient-to-r from-accent-600 to-accent-700 text-white rounded-t-2xl">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="relative">
                                <Bot className="h-5 w-5 sm:h-6 sm:w-6" />
                                <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 absolute -top-1 -right-1 text-yellow-300 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base">Get.AI</h3>
                                <p className="text-xs opacity-90">Your Learning Assistant</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                            <button
                                onClick={toggleMinimize}
                                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
                                title={isMinimized ? 'Maximize' : 'Minimize'}
                            >
                                {isMinimized ? (
                                    <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                ) : (
                                    <Minimize2 className="h-4 w-4 sm:h-5 sm:w-5" />
                                )}
                            </button>
                            <button
                                onClick={toggleAssistant}
                                className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
                                title="Close"
                            >
                                <X className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4" style={{ height: 'calc(100% - 180px)' }}>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-start space-x-2 max-w-[90%] sm:max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                                            }`}>
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-accent-100 text-accent-600'
                                                }`}>
                                                {message.type === 'user' ? (
                                                    <User className="h-4 w-4" />
                                                ) : (
                                                    <Bot className="h-4 w-4" />
                                                )}
                                            </div>
                                            <div className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${message.type === 'user'
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-primary-50 text-primary-900 border border-primary-200'
                                                }`}>
                                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
                                                <p className={`text-xs mt-1.5 ${message.type === 'user' ? 'text-primary-200' : 'text-primary-500'
                                                    }`}>
                                                    {formatTime(message.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="flex items-start space-x-2">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-100 text-accent-600 flex items-center justify-center">
                                                <Bot className="h-4 w-4" />
                                            </div>
                                            <div className="bg-primary-50 text-primary-900 border border-primary-200 rounded-2xl px-4 py-2.5">
                                                <div className="flex items-center space-x-2">
                                                    <Loader className="h-4 w-4 animate-spin" />
                                                    <span className="text-sm">Thinking...</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggestions */}
                            {suggestions.length > 0 && messages.length <= 1 && (
                                <div className="px-3 sm:px-4 pb-2 border-t border-primary-100">
                                    <div className="flex items-center space-x-2 mb-2 pt-2">
                                        <Lightbulb className="h-4 w-4 text-warning-600" />
                                        <span className="text-xs font-medium text-primary-600">Suggested questions:</span>
                                    </div>
                                    <div className="space-y-2">
                                        {suggestions.slice(0, 3).map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="w-full text-left text-xs sm:text-sm p-2.5 sm:p-3 bg-primary-50 hover:bg-primary-100 active:bg-primary-200 rounded-lg border border-primary-200 transition-colors break-words touch-manipulation"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Input */}
                            <div className="p-3 sm:p-4 border-t border-primary-200 bg-white">
                                {!isAdvancedCourse && accessError ? (
                                    <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-2">
                                            <span className="text-2xl">🔒</span>
                                            <span className="font-semibold text-accent-700 text-sm">Pro Feature</span>
                                        </div>
                                        <p className="text-xs text-primary-600 mb-3">
                                            Upgrade to Pro to unlock Get.AI assistant
                                        </p>
                                        <a
                                            href="/pricing"
                                            className="inline-block bg-accent-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-accent-700 transition-colors touch-manipulation"
                                        >
                                            View Plans
                                        </a>
                                    </div>
                                ) : (
                                    <div className="flex items-end space-x-2">
                                        <textarea
                                            ref={inputRef}
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Ask me anything..."
                                            rows="1"
                                            className="flex-1 px-3 py-2.5 sm:py-3 border border-primary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm resize-none max-h-24 overflow-y-auto"
                                            disabled={isLoading}
                                            style={{ minHeight: '42px' }}
                                        />
                                        <button
                                            onClick={() => sendMessage()}
                                            disabled={!inputMessage.trim() || isLoading}
                                            className="p-3 bg-accent-600 text-white rounded-xl hover:bg-accent-700 active:bg-accent-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 touch-manipulation"
                                        >
                                            <Send className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default AIAssistant;