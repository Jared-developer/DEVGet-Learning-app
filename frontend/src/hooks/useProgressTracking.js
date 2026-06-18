import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export const useProgressTracking = (courseDbId) => {
    const { user } = useAuth()
    const [courseProgress, setCourseProgress] = useState(null)
    const [lessonProgress, setLessonProgress] = useState({})
    const [loading, setLoading] = useState(false)

    // Load course progress
    const loadCourseProgress = async () => {
        if (!user || !courseDbId) return

        try {
            const { data, error } = await supabase
                .from('course_progress')
                .select('*')
                .eq('user_id', user.id)
                .eq('course_id', courseDbId)
                .maybeSingle()

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading course progress:', error)
                return
            }

            setCourseProgress(data)
        } catch (error) {
            console.error('Error loading course progress:', error)
        }
    }

    // Load lesson progress
    const loadLessonProgress = async () => {
        if (!user || !courseDbId) return

        try {
            const { data, error } = await supabase
                .from('lesson_progress')
                .select('*')
                .eq('user_id', user.id)
                .eq('course_id', courseDbId)

            if (error) {
                console.error('Error loading lesson progress:', error)
                return
            }

            // Convert array to object for easier lookup
            const progressMap = {}
            data?.forEach(progress => {
                progressMap[progress.lesson_id] = progress
            })
            setLessonProgress(progressMap)
        } catch (error) {
            console.error('Error loading lesson progress:', error)
        }
    }

    // Mark lesson as completed
    const markLessonComplete = async (lessonId, lessonTitle, lessonType = 'video', quizScore = null) => {
        if (!user || !courseDbId) return

        setLoading(true)
        try {
            const progressData = {
                user_id: user.id,
                course_id: courseDbId,
                lesson_id: lessonId,
                lesson_title: lessonTitle,
                lesson_type: lessonType,
                status: 'completed',
                completion_date: new Date().toISOString(),
                quiz_score: quizScore
            }

            const { data, error } = await supabase
                .from('lesson_progress')
                .upsert(progressData, {
                    onConflict: 'user_id,course_id,lesson_id'
                })
                .select()

            if (error) throw error

            // Update local state
            setLessonProgress(prev => ({
                ...prev,
                [lessonId]: data[0]
            }))

            // Reload course progress to get updated totals
            await loadCourseProgress()

            return true
        } catch (error) {
            console.error('Error marking lesson complete:', error)
            return false
        } finally {
            setLoading(false)
        }
    }

    // Mark lesson as in progress
    const markLessonInProgress = async (lessonId, lessonTitle, lessonType = 'video') => {
        if (!user || !courseDbId) return

        try {
            // Only mark as in progress if not already completed
            const currentProgress = lessonProgress[lessonId]
            if (currentProgress?.status === 'completed') return

            const progressData = {
                user_id: user.id,
                course_id: courseDbId,
                lesson_id: lessonId,
                lesson_title: lessonTitle,
                lesson_type: lessonType,
                status: 'in_progress'
            }

            const { data, error } = await supabase
                .from('lesson_progress')
                .upsert(progressData, {
                    onConflict: 'user_id,course_id,lesson_id'
                })
                .select()

            if (error) throw error

            // Update local state
            setLessonProgress(prev => ({
                ...prev,
                [lessonId]: data[0]
            }))
        } catch (error) {
            console.error('Error marking lesson in progress:', error)
        }
    }

    // Update time spent on lesson
    const updateTimeSpent = async (lessonId, timeSpent) => {
        if (!user || !courseDbId || !lessonProgress[lessonId]) return

        try {
            const { error } = await supabase
                .from('lesson_progress')
                .update({ time_spent: timeSpent })
                .eq('user_id', user.id)
                .eq('course_id', courseDbId)
                .eq('lesson_id', lessonId)

            if (error) throw error

            // Update local state
            setLessonProgress(prev => ({
                ...prev,
                [lessonId]: {
                    ...prev[lessonId],
                    time_spent: timeSpent
                }
            }))
        } catch (error) {
            console.error('Error updating time spent:', error)
        }
    }

    // Get lesson status
    const getLessonStatus = (lessonId) => {
        return lessonProgress[lessonId]?.status || 'not_started'
    }

    // Check if lesson is completed
    const isLessonCompleted = (lessonId) => {
        return getLessonStatus(lessonId) === 'completed'
    }

    // Get quiz score for lesson
    const getQuizScore = (lessonId) => {
        return lessonProgress[lessonId]?.quiz_score || null
    }

    // Get progress statistics
    const getProgressStats = () => {
        if (!courseProgress) {
            const totalLessons = Object.keys(lessonProgress).length
            const completedLessons = Object.values(lessonProgress).filter(p => p.status === 'completed').length
            const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
            
            return {
                totalLessons,
                completedLessons,
                progressPercentage,
                inProgress: Object.values(lessonProgress).filter(p => p.status === 'in_progress').length
            }
        }

        return {
            totalLessons: courseProgress.total_lessons || 0,
            completedLessons: courseProgress.completed_lessons || 0,
            progressPercentage: courseProgress.progress_percentage || 0,
            inProgress: Object.values(lessonProgress).filter(p => p.status === 'in_progress').length
        }
    }

    // Initialize progress tracking when component mounts
    useEffect(() => {
        if (user && courseDbId) {
            loadCourseProgress()
            loadLessonProgress()
        }
    }, [user, courseDbId])

    return {
        courseProgress,
        lessonProgress,
        loading,
        markLessonComplete,
        markLessonInProgress,
        updateTimeSpent,
        getLessonStatus,
        isLessonCompleted,
        getQuizScore,
        getProgressStats,
        refreshProgress: () => {
            loadCourseProgress()
            loadLessonProgress()
        }
    }
}