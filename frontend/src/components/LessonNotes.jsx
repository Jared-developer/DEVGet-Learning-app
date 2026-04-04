import { useState } from 'react'
import { AlertCircle, Info, Lightbulb, AlertTriangle, CheckCircle, Copy, Check } from 'lucide-react'

const LessonNotes = ({ lesson, onQuizAnswer, quizAnswers, onSubmitQuiz, showQuizResults, quizScore }) => {
    const [copiedCode, setCopiedCode] = useState(null)

    const copyCode = (code, id) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(id)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    if (!lesson) return null

    // Get content from either 'content' or 'notes' property
    const lessonContent = lesson.content || lesson.notes || ''

    // Enhanced markdown parser
    const renderContent = (content) => {
        const lines = content.split('\n')
        const elements = []
        let i = 0
        let inList = false

        const renderTextWithFormatting = (text) => {
            // Handle bold text
            const parts = text.split('**')
            return parts.map((part, idx) =>
                idx % 2 === 0 ? part : <strong key={idx} className="font-bold text-gray-900">{part}</strong>
            )
        }

        while (i < lines.length) {
            const line = lines[i]

            // Skip empty lines but close lists
            if (!line.trim()) {
                if (inList) {
                    inList = false
                }
                i++
                continue
            }

            // Headers
            if (line.startsWith('# ')) {
                if (inList) inList = false
                elements.push(
                    <h1 key={`h1-${i}`} className="text-3xl font-bold text-gray-900 mt-8 mb-4 border-b-2 border-gray-200 pb-2">
                        {line.substring(2)}
                    </h1>
                )
                i++
                continue
            }
            if (line.startsWith('## ')) {
                if (inList) inList = false
                elements.push(
                    <h2 key={`h2-${i}`} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
                        {line.substring(3)}
                    </h2>
                )
                i++
                continue
            }
            if (line.startsWith('### ')) {
                if (inList) inList = false
                elements.push(
                    <h3 key={`h3-${i}`} className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                        {line.substring(4)}
                    </h3>
                )
                i++
                continue
            }

            // List items
            if (line.trim().startsWith('- ')) {
                const listItems = []
                const startIdx = i

                while (i < lines.length && lines[i].trim().startsWith('- ')) {
                    const itemText = lines[i].trim().substring(2)
                    listItems.push(
                        <li key={`li-${i}`} className="text-gray-700 mb-2">
                            {renderTextWithFormatting(itemText)}
                        </li>
                    )
                    i++
                }

                elements.push(
                    <ul key={`ul-${startIdx}`} className="list-disc list-inside space-y-1 my-3 ml-4">
                        {listItems}
                    </ul>
                )
                continue
            }

            // Code blocks
            if (line.trim().startsWith('```')) {
                if (inList) inList = false
                const codeLines = []
                const language = line.trim().substring(3).trim()
                i++ // Skip opening ```

                while (i < lines.length && !lines[i].trim().startsWith('```')) {
                    codeLines.push(lines[i])
                    i++
                }
                i++ // Skip closing ```

                const code = codeLines.join('\n')
                elements.push(
                    <div key={`code-${i}`} className="bg-gray-900 rounded-xl overflow-hidden my-4">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                            <span className="text-sm text-gray-400">{language || 'code'}</span>
                            <button
                                onClick={() => copyCode(code, `code-${i}`)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                {copiedCode === `code-${i}` ? (
                                    <Check className="h-4 w-4" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <pre className="p-4 overflow-x-auto">
                            <code className="text-sm text-gray-300 whitespace-pre">{code}</code>
                        </pre>
                    </div>
                )
                continue
            }

            // Regular paragraph with bold support
            if (inList) inList = false
            elements.push(
                <p key={`p-${i}`} className="text-gray-700 leading-relaxed my-3">
                    {renderTextWithFormatting(line)}
                </p>
            )
            i++
        }

        return elements
    }

    return (
        <div className="space-y-6">
            {/* Lesson Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{lesson.title}</h1>
                {lesson.duration && (
                    <p className="text-gray-600">Duration: {lesson.duration}</p>
                )}
            </div>

            {/* Video Section */}
            {lesson.videoUrl && (
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-lg">
                    <div className="aspect-video">
                        <iframe
                            src={lesson.videoUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Content Sections */}
            {lessonContent && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="prose max-w-none">
                        {renderContent(lessonContent)}
                    </div>
                </div>
            )}

            {/* Code Snippet Section (if exists separately) */}
            {lesson.codeSnippet && (
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                        <span className="text-sm text-gray-400">Code Example</span>
                        <button
                            onClick={() => copyCode(lesson.codeSnippet, 'snippet')}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {copiedCode === 'snippet' ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                        <code className="text-sm text-gray-300 whitespace-pre">{lesson.codeSnippet}</code>
                    </pre>
                </div>
            )}

            {/* Quiz Section */}
            {lesson.questions && lesson.questions.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mt-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz</h2>

                    {showQuizResults && (
                        <div className={`mb-6 p-4 rounded-xl ${quizScore.percentage >= 70
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                            }`}>
                            <div className="flex items-center gap-3">
                                {quizScore.percentage >= 70 ? (
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                ) : (
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                )}
                                <div>
                                    <div className={`font-bold ${quizScore.percentage >= 70 ? 'text-green-900' : 'text-red-900'
                                        }`}>
                                        Score: {quizScore.score}/{quizScore.total} ({quizScore.percentage}%)
                                    </div>
                                    <div className={`text-sm ${quizScore.percentage >= 70 ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {quizScore.percentage >= 70
                                            ? 'Great job! You passed the quiz.'
                                            : 'Keep practicing. You need 70% to pass.'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {lesson.questions.map((question, qIdx) => (
                            <div key={qIdx} className="border border-gray-200 rounded-xl p-4">
                                <div className="font-semibold text-gray-900 mb-4">
                                    {qIdx + 1}. {question.question}
                                </div>
                                <div className="space-y-2">
                                    {question.options.map((option, oIdx) => {
                                        const isSelected = quizAnswers[qIdx] === oIdx
                                        const isCorrect = question.correctAnswer === oIdx
                                        const showResult = showQuizResults

                                        return (
                                            <button
                                                key={oIdx}
                                                onClick={() => !showQuizResults && onQuizAnswer(qIdx, oIdx)}
                                                disabled={showQuizResults}
                                                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${showResult && isCorrect
                                                    ? 'border-green-500 bg-green-50'
                                                    : showResult && isSelected && !isCorrect
                                                        ? 'border-red-500 bg-red-50'
                                                        : isSelected
                                                            ? 'border-accent-500 bg-accent-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${showResult && isCorrect
                                                        ? 'border-green-500 bg-green-500'
                                                        : showResult && isSelected && !isCorrect
                                                            ? 'border-red-500 bg-red-500'
                                                            : isSelected
                                                                ? 'border-accent-500 bg-accent-500'
                                                                : 'border-gray-300'
                                                        }`}>
                                                        {(showResult && isCorrect) || (isSelected && !showResult) ? (
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        ) : null}
                                                    </div>
                                                    <span className="text-gray-700">{option}</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                                {showQuizResults && question.explanation && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
                                        <span className="font-semibold">Explanation:</span> {question.explanation}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {!showQuizResults && (
                        <button
                            onClick={onSubmitQuiz}
                            disabled={Object.keys(quizAnswers).length !== lesson.questions.length}
                            className="mt-6 w-full px-6 py-3 bg-accent-600 text-white rounded-lg font-semibold hover:bg-accent-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Quiz
                        </button>
                    )}
                </div>
            )}

            {/* Assignment Section */}
            {(lesson.type === 'assignment' || lesson.assignment) && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8 mt-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-purple-900">{lesson.title}</h2>
                            {lesson.dueDate && (
                                <p className="text-purple-700 text-sm">Due: {lesson.dueDate}</p>
                            )}
                        </div>
                    </div>

                    {lesson.description && (
                        <div className="bg-white rounded-xl p-4 mb-6">
                            <p className="text-gray-700 leading-relaxed">{lesson.description}</p>
                            {lesson.points && (
                                <p className="text-purple-700 font-semibold mt-2">Total Points: {lesson.points}</p>
                            )}
                        </div>
                    )}

                    {lesson.tasks && lesson.tasks.length > 0 && (
                        <div className="space-y-4 mb-6">
                            <h3 className="text-xl font-bold text-purple-900">Tasks</h3>
                            {lesson.tasks.map((task, idx) => (
                                <div key={task.id || idx} className="bg-white rounded-xl p-5 border border-purple-100">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <span className="text-purple-700 font-bold">{idx + 1}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-1">{task.title}</h4>
                                            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                                            {task.points && (
                                                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                                    {task.points} points
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {task.requirements && task.requirements.length > 0 && (
                                        <div className="ml-11 mt-3">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Requirements:</p>
                                            <ul className="space-y-1">
                                                {task.requirements.map((req, rIdx) => (
                                                    <li key={rIdx} className="text-sm text-gray-600 flex items-start gap-2">
                                                        <span className="text-purple-500 mt-1">•</span>
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {lesson.submissionGuidelines && lesson.submissionGuidelines.length > 0 && (
                        <div className="bg-blue-50 rounded-xl p-5 mb-6 border border-blue-200">
                            <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <Info className="h-5 w-5" />
                                Submission Guidelines
                            </h3>
                            <ul className="space-y-2">
                                {lesson.submissionGuidelines.map((guideline, idx) => (
                                    <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                        <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span>{guideline}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lesson.rubric && (
                        <div className="bg-green-50 rounded-xl p-5 mb-6 border border-green-200">
                            <h3 className="text-lg font-bold text-green-900 mb-3">Grading Rubric</h3>
                            <div className="space-y-2">
                                {Object.entries(lesson.rubric).map(([key, value]) => (
                                    <div key={key} className="text-sm">
                                        <span className="font-semibold text-green-800 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                                        <span className="text-green-700">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {lesson.hints && lesson.hints.length > 0 && (
                        <div className="bg-yellow-50 rounded-xl p-5 mb-6 border border-yellow-200">
                            <h3 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
                                <Lightbulb className="h-5 w-5" />
                                Helpful Hints
                            </h3>
                            <ul className="space-y-2">
                                {lesson.hints.map((hint, idx) => (
                                    <li key={idx} className="text-sm text-yellow-800 flex items-start gap-2">
                                        <span className="text-yellow-600 mt-1">💡</span>
                                        <span>{hint}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lesson.resources && lesson.resources.length > 0 && (
                        <div className="bg-indigo-50 rounded-xl p-5 mb-6 border border-indigo-200">
                            <h3 className="text-lg font-bold text-indigo-900 mb-3">Resources</h3>
                            <ul className="space-y-2">
                                {lesson.resources.map((resource, idx) => (
                                    <li key={idx} className="text-sm text-indigo-700">
                                        <a href={resource.split(': ')[1]} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {resource}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {lesson.bonusChallenge && (
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-5 mb-6 border-2 border-orange-300">
                            <h3 className="text-lg font-bold text-orange-900 mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5" />
                                Bonus Challenge
                            </h3>
                            <p className="text-orange-800 mb-2">{lesson.bonusChallenge.description}</p>
                            {lesson.bonusChallenge.points && (
                                <span className="inline-block px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-xs font-bold">
                                    +{lesson.bonusChallenge.points} bonus points
                                </span>
                            )}
                            {lesson.bonusChallenge.requirements && (
                                <ul className="mt-3 space-y-1">
                                    {lesson.bonusChallenge.requirements.map((req, idx) => (
                                        <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                                            <span className="text-orange-500 mt-1">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    <button className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        Submit Assignment
                    </button>
                </div>
            )}
        </div>
    )
}

export default LessonNotes
