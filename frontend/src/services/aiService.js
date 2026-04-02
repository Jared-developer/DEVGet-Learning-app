import { supabase } from '../lib/supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class AIService {
    async getAuthToken() {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token;
    }

    async sendMessage(message, courseId, conversationId) {
        const token = await this.getAuthToken();

        const response = await fetch(`${API_BASE_URL}/api/ai-assistant/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                message,
                courseId,
                conversationId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Failed to send message');
            error.response = { status: response.status, data };
            throw error;
        }

        return data;
    }

    async getSuggestions(courseId, lessonTitle) {
        const token = await this.getAuthToken();

        const response = await fetch(`${API_BASE_URL}/api/ai-assistant/suggestions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                courseId,
                lessonTitle
            })
        });

        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || 'Failed to get suggestions');
            error.response = { status: response.status, data };
            throw error;
        }

        return data;
    }

    async getConversations(courseId) {
        const token = await this.getAuthToken();

        const response = await fetch(`${API_BASE_URL}/api/ai-assistant/conversations?courseId=${courseId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get conversations');
        }

        return response.json();
    }
}

export default new AIService();