# Groq AI Integration Setup Guide

This guide will help you set up Groq Cloud's open-source AI models for the Get.AI assistant feature.

## What is Groq?

Groq provides ultra-fast inference for open-source LLMs like Llama 3.1, Mixtral, and Gemma. It's perfect for educational platforms because:
- **Fast**: Lightning-fast response times
- **Free Tier**: Generous free tier for development
- **Open Source Models**: Uses models like Llama 3.1 70B
- **Cost-Effective**: Much cheaper than proprietary APIs

## Setup Steps

### 1. Get Your Groq API Key

1. Visit [Groq Cloud Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (starts with `gsk_...`)

### 2. Configure Backend

1. Add your Groq API key to `backend/.env`:
```env
GROQ_API_KEY=gsk_your_api_key_here
```

2. Install the Groq SDK:
```bash
cd backend
npm install
```

### 3. Test the Integration

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. The AI assistant will now use Groq's Llama 3.1 70B model

### 4. Verify It's Working

1. Sign in to your app
2. Enroll in a Pro course (MERN Stack, AI/ML, or Agentic AI)
3. Open the AI assistant (chat icon in bottom right)
4. Ask a question related to the course
5. You should get an intelligent, context-aware response

## Features

### Course-Aware AI

The AI assistant understands the scope of each course:

- **MERN Stack**: MongoDB, Express, React, Node.js topics
- **AI & Machine Learning**: ML algorithms, neural networks, TensorFlow/PyTorch
- **Agentic AI**: Autonomous agents, LangChain, multi-agent systems
- **HTML/CSS/JavaScript**: Web development fundamentals
- **Python**: Python programming and libraries

### Conversation Context

The AI maintains conversation history, so it can:
- Remember previous questions in the chat
- Provide follow-up answers
- Build on previous explanations

### Smart Suggestions

The AI generates contextual question suggestions based on:
- Current lesson title
- Course content
- Common student questions

## Model Information

**Current Model**: `llama-3.1-70b-versatile`
- 70 billion parameters
- Excellent for educational content
- Fast inference on Groq hardware
- Supports long context windows

## Rate Limits

Groq Free Tier:
- 30 requests per minute
- 14,400 requests per day
- Sufficient for development and small deployments

For production with many users, consider:
- Groq Pro plan
- Implementing request queuing
- Caching common responses

## Troubleshooting

### "AI service is not configured"
- Check that `GROQ_API_KEY` is set in `backend/.env`
- Restart the backend server after adding the key

### "AI service authentication failed"
- Verify your API key is correct
- Check if the key is still valid in Groq Console
- Ensure the key starts with `gsk_`

### "AI service is currently busy"
- You've hit the rate limit
- Wait a moment and try again
- Consider upgrading to Groq Pro for higher limits

### Slow Responses
- Groq is typically very fast (< 1 second)
- Check your internet connection
- Verify backend server is running properly

## Cost Estimation

### Free Tier (Development)
- **Cost**: $0
- **Limit**: 14,400 requests/day
- **Best for**: Development, testing, small deployments

### Groq Pro (Production)
- **Cost**: Pay-as-you-go pricing
- **Limit**: Much higher rate limits
- **Best for**: Production with many users

### Estimated Usage
- Average conversation: 5-10 messages
- Average message cost: ~$0.0001 (very low)
- 1000 conversations/month: ~$0.50-$1.00

## Alternative Models

You can change the model in `backend/routes/ai-assistant.js`:

```javascript
model: 'llama-3.1-70b-versatile', // Current
// model: 'llama-3.1-8b-instant',  // Faster, less capable
// model: 'mixtral-8x7b-32768',    // Good balance
// model: 'gemma-7b-it',           // Lightweight
```

## Security Best Practices

1. **Never commit API keys**: Keep `.env` in `.gitignore`
2. **Use environment variables**: Don't hardcode keys
3. **Rotate keys regularly**: Generate new keys periodically
4. **Monitor usage**: Check Groq Console for unusual activity
5. **Implement rate limiting**: Protect against abuse

## Next Steps

1. Get your Groq API key
2. Add it to `backend/.env`
3. Install dependencies with `npm install`
4. Start the backend server
5. Test the AI assistant in a Pro course

## Support

- **Groq Documentation**: https://console.groq.com/docs
- **Groq Discord**: Join for community support
- **GitHub Issues**: Report bugs in your repository

## Benefits for Students

With Groq-powered AI, students get:
- ✅ Instant, intelligent answers
- ✅ Course-specific guidance
- ✅ Code examples and explanations
- ✅ 24/7 learning support
- ✅ Personalized help based on their course

This makes your learning platform more valuable and engaging!
