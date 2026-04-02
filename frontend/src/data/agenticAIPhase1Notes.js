// Agentic AI Development - Phase 1 Notes (Weeks 1-4)
// Latest 2026 Tools & Frameworks

// Week 1: The AI Landscape & The Rise of Agents
export const week1Lesson1 = {
    title: 'What is Generative AI and the Evolution to Agents',
    videoUrl: 'https://www.youtube.com/embed/zjkBMFhNj_g',
    notes: `# What is Generative AI and the Evolution to Agents

## What is Generative AI?

Generative AI refers to artificial intelligence systems capable of creating new content—text, images, code, audio—by learning patterns from training data. Unlike traditional AI that classifies or predicts, generative AI produces.

## The Evolution of AI Capabilities

### From Simple to Sophisticated
- **Chatbots**: Respond to queries with pre-programmed responses
- **Assistants**: Use LLMs to understand and respond contextually  
- **Agents**: Autonomous systems that can reason, plan, and act

## The Core Concept of an Agent

An agent is an AI system that can:
- **Reason** about tasks using an LLM as its "brain"
- **Plan** sequences of actions to achieve goals
- **Act** by using tools (APIs, search, code execution)
- **Observe** results and adapt

## Latest LLM Models (2026)

| Model | Release | Key Feature |
|-------|---------|-------------|
| Claude Opus 4.6 | Feb 2026 | Hybrid reasoning, 1M token context, best for agents |
| Claude Sonnet 4.6 | Feb 2026 | Most capable Sonnet, optimized for coding & computer use |
| Claude Haiku 4.5 | Oct 2025 | Fastest, cost-efficient, matches Sonnet 4 performance |

**Important**: Claude Opus 4.6 has a knowledge cutoff of May 2025.

## Why Agents Matter

### Traditional Limitations
- Single-turn interactions
- No persistent memory
- Cannot perform actions
- Limited reasoning chains

### Agent Advantages
- Multi-step problem solving
- Tool integration
- Persistent context
- Autonomous operation
- Self-correction capabilities`,
    codeSnippet: `# Comparing Traditional vs Agentic Approaches

# Traditional Chatbot Approach
def traditional_chatbot(user_query):
    """Simple response generation"""
    response = llm.generate(user_query)
    return response

# Agentic Approach
class SimpleAgent:
    def __init__(self):
        self.memory = []
        self.tools = {
            'search': web_search_tool,
            'calculator': calculator_tool,
            'code_executor': code_execution_tool
        }
    
    def process_query(self, user_query):
        """Multi-step reasoning and action"""
        # 1. Analyze the query
        analysis = self.analyze_query(user_query)
        
        # 2. Plan actions
        plan = self.create_plan(analysis)
        
        # 3. Execute plan
        results = []
        for step in plan:
            if step.requires_tool:
                tool_result = self.use_tool(step.tool_name, step.parameters)
                results.append(tool_result)
            else:
                thought = self.reason(step.prompt, context=results)
                results.append(thought)
        
        # 4. Synthesize final response
        return self.synthesize_response(results, user_query)

# Example usage
agent = SimpleAgent()
response = agent.process_query("What's the weather in Tokyo?")
`
};

export const week1Lesson2 = {
    title: 'Claude\'s Agent Capabilities and Computer Use',
    videoUrl: 'https://www.youtube.com/embed/ODaHJzOyVCQ',
    notes: `# Claude's Agent Capabilities and Computer Use (2026)

## Claude's Evolution to Agentic AI

### New Capabilities in 2026
Claude models now include revolutionary agent features:

1. **Computer Use**: Control applications, navigate websites
2. **Code Execution**: Run Python in isolated sandboxes
3. **Memory**: Persistent context across sessions
4. **Cowork**: Agent capabilities for knowledge work
5. **Chrome Extension**: Read, click, and browse websites

## Computer Use Feature

### What It Can Do
- Take screenshots of your screen
- Move the mouse cursor
- Click on buttons and links
- Type text into forms
- Navigate between applications
- Scroll through web pages
- Fill out forms automatically

### Safety Measures
- Runs in isolated virtual machine
- Cannot access sensitive system files
- All actions are logged and reviewable
- User maintains control and oversight

## Code Execution Sandbox

### Features
- Secure Python environment
- Pre-installed common libraries
- File system access (sandboxed)
- Network access for API calls
- Real-time code execution
- Error handling and debugging`,
    codeSnippet: `# Working with Claude's Agent Capabilities

import anthropic
import asyncio

class ClaudeAgent:
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = "claude-3-opus-20260217"
        
    async def computer_use_task(self, instruction: str):
        """Use Claude's computer use capability"""
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=1024,
            tools=[{
                "type": "computer_20241022",
                "name": "computer",
                "display_width_px": 1920,
                "display_height_px": 1080
            }],
            messages=[{"role": "user", "content": instruction}]
        )
        return response

# Example usage
async def main():
    agent = ClaudeAgent("your-api-key")
    result = await agent.computer_use_task("Search for AI trends")
    print(result)

asyncio.run(main())
`
};

export const week1Lesson3 = {
    title: 'Understanding LLM Fundamentals for Agent Development',
    videoUrl: 'https://www.youtube.com/embed/LPZh9BOjkQs',
    notes: `# Understanding LLM Fundamentals for Agent Development

## How Large Language Models Work

### The Transformer Architecture
LLMs are built on the transformer architecture, which uses:
- **Self-attention mechanisms** to understand relationships
- **Parallel processing** for efficient training
- **Positional encoding** to understand word order
- **Layer normalization** for stable training

## Key Concepts for Agent Developers

### Tokens and Context Windows
- **Tokens**: Basic units of text
- **Context Window**: Maximum tokens processed at once
- **Claude Opus 4.6**: 1M token context window

### Model Capabilities

#### Strengths:
- Pattern recognition
- Reasoning and problem-solving
- Code generation
- Multi-language understanding

#### Limitations:
- **Hallucination**: Generating false information
- **Knowledge cutoff**: Limited to training data
- **No real-time info** without tools`,
    codeSnippet: `# Understanding LLM Behavior

import anthropic

class LLMAnalyzer:
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        
    def test_reasoning(self, prompt: str):
        """Test model reasoning capabilities"""
        response = self.client.messages.create(
            model="claude-3-opus-20260217",
            max_tokens=1000,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text

# Example
analyzer = LLMAnalyzer("your-api-key")
result = analyzer.test_reasoning("Explain step by step: 2+2")
print(result)
`
};

export const week1Lesson4 = {
    title: 'Hands-on: Exploring LLM Capabilities',
    videoUrl: 'https://www.youtube.com/embed/kCc8FmEb1Ow',
    notes: `# Hands-on: Exploring LLM Capabilities

## Interactive LLM Exploration

This lesson focuses on hands-on experimentation with different LLM models.

## Experiment 1: Prompt Styles

### Different Approaches
1. **Direct Questions**: "What is machine learning?"
2. **Role-based**: "As an expert, explain ML"
3. **Step-by-step**: "Explain ML in 3 steps"
4. **Contextual**: "I'm new to AI. What is ML?"

## Experiment 2: Reasoning Capabilities

### Chain-of-Thought Prompting
Test the model's ability to show reasoning step by step.

## Building Your LLM Intuition

### Key Observations
1. Response patterns
2. Confidence indicators
3. Reasoning quality
4. Consistency
5. Creativity vs accuracy`,
    codeSnippet: `# Interactive LLM Explorer

import anthropic
import time

class LLMExplorer:
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        
    def test_prompt_styles(self, question: str):
        """Test different prompt styles"""
        styles = {
            "direct": question,
            "role_based": f"As an expert, {question}",
            "step_by_step": f"{question} Explain step by step."
        }
        
        results = {}
        for style, prompt in styles.items():
            start = time.time()
            response = self.client.messages.create(
                model="claude-3-sonnet-20240229",
                max_tokens=500,
                messages=[{"role": "user", "content": prompt}]
            )
            results[style] = {
                "response": response.content[0].text,
                "time": time.time() - start
            }
        return results

# Usage
explorer = LLMExplorer("your-api-key")
results = explorer.test_prompt_styles("What is AI?")
`
};

export const week1Quiz = {
    title: 'Week 1 Quiz: AI Landscape and Agents',
    questions: [
        {
            id: 1,
            question: 'What is the main difference between traditional chatbots and AI agents?',
            options: [
                'Agents can only respond to text',
                'Agents can reason, plan, and act autonomously',
                'Chatbots are more advanced than agents',
                'There is no difference'
            ],
            correctAnswer: 1,
            explanation: 'AI agents can reason about tasks, plan sequences of actions, and act autonomously using tools.'
        },
        {
            id: 2,
            question: 'Which Claude model is best for complex agent development in 2026?',
            options: [
                'Claude Haiku 4.5',
                'Claude Sonnet 4.6',
                'Claude Opus 4.6',
                'All models are equal'
            ],
            correctAnswer: 2,
            explanation: 'Claude Opus 4.6 offers the best reasoning capabilities and 1M token context window.'
        },
        {
            id: 3,
            question: 'What is Claude\'s Computer Use feature?',
            options: [
                'A way to browse the internet',
                'The ability to control applications and navigate websites',
                'A text-only interface',
                'A programming language'
            ],
            correctAnswer: 1,
            explanation: 'Computer Use allows Claude to take screenshots, move the mouse, and interact with applications.'
        },
        {
            id: 4,
            question: 'What is a key limitation of LLMs that agents help address?',
            options: [
                'They are too fast',
                'They cannot access real-time information without tools',
                'They are too expensive',
                'They only work in English'
            ],
            correctAnswer: 1,
            explanation: 'LLMs have knowledge cutoffs. Agents solve this by using tools like web search and APIs.'
        },
        {
            id: 5,
            question: 'What does "hallucination" mean in the context of LLMs?',
            options: [
                'The model is dreaming',
                'The model generates false or made-up information',
                'The model is working correctly',
                'The model is too creative'
            ],
            correctAnswer: 1,
            explanation: 'Hallucination refers to when LLMs generate false information that sounds plausible.'
        }
    ]
};

// Week 2: Python for AI Engineers
export const week2Lesson1 = {
    title: 'Python Essentials for AI Development',
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
    notes: `# Python Essentials for AI Development

## Why Python for AI Agents?

Python dominates AI development because of:
- **Rich ecosystem**: Extensive libraries for AI/ML
- **Simplicity**: Easy to read and write
- **Community**: Large, active developer community
- **Integration**: Works well with APIs
- **Performance**: Fast enough for most AI applications

## Essential Python Concepts

### 1. Data Structures for Agent Memory

#### Lists for Sequential Data
- Store conversation history
- Maintain task queues
- Track action sequences

#### Dictionaries for Structured Data
- Store agent configuration
- Maintain tool definitions
- Cache API responses

### 2. Functions and Classes

#### Function Design Principles
- **Single Responsibility**: Each function does one thing
- **Pure Functions**: Predictable inputs/outputs
- **Error Handling**: Graceful failure management
- **Documentation**: Clear docstrings

### 3. Error Handling for Robust Agents

Agents must handle failures gracefully:
- Try-except blocks
- Custom exceptions
- Logging
- Retry logic

## Modern Python Features (2026)

### Type Hints
Improve code quality and IDE support

### Context Managers
Ensure proper cleanup of resources

### Dataclasses
Simplify data structure creation

### Async/Await
Handle multiple operations simultaneously`,
    codeSnippet: `# Python Essentials for AI Agents

import asyncio
import logging
from dataclasses import dataclass
from typing import Dict, List, Optional
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('AIAgent')

@dataclass
class AgentMessage:
    """Structured message for agent communication"""
    role: str
    content: str
    timestamp: datetime
    metadata: Optional[Dict] = None

class AgentMemory:
    """Memory management for AI agents"""
    
    def __init__(self, max_messages: int = 100):
        self.messages: List[AgentMessage] = []
        self.max_messages = max_messages
    
    def add_message(self, role: str, content: str):
        """Add a message to memory"""
        message = AgentMessage(
            role=role,
            content=content,
            timestamp=datetime.now()
        )
        self.messages.append(message)
        
        # Maintain memory limit
        if len(self.messages) > self.max_messages:
            self.messages = self.messages[-self.max_messages:]
        
        logger.info(f"Added {role} message")
    
    def get_recent(self, count: int = 10):
        """Get recent messages"""
        return self.messages[-count:]

# Example usage
memory = AgentMemory()
memory.add_message("user", "Hello")
memory.add_message("assistant", "Hi there!")
`
};

export const week2Lesson2 = {
    title: 'Async Programming for Concurrent Agent Operations',
    videoUrl: 'https://www.youtube.com/embed/t5Bo1Je9EmE',
    notes: `# Async Programming for Concurrent Agent Operations

## Why Async for AI Agents?

Agents often need to:
- Make multiple API calls simultaneously
- Process tasks in parallel
- Handle real-time events
- Manage long-running operations

## Understanding Async/Await

### Key Concepts
- **Coroutines**: Functions that can pause and resume
- **Event Loop**: Manages async task execution
- **Await**: Pause until operation completes
- **Gather**: Run multiple tasks concurrently

## Common Async Patterns

### 1. Parallel API Calls
Make multiple API requests at once

### 2. Task Queues
Process multiple tasks concurrently

### 3. Streaming Responses
Handle real-time data streams

### 4. Timeout Handling
Prevent operations from hanging`,
    codeSnippet: `# Async Programming for Agents

import asyncio
import aiohttp
from typing import List, Dict

class AsyncAgent:
    """Agent with async capabilities"""
    
    def __init__(self):
        self.session = None
    
    async def __aenter__(self):
        """Setup async context"""
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, *args):
        """Cleanup async context"""
        if self.session:
            await self.session.close()
    
    async def fetch_data(self, url: str) -> Dict:
        """Fetch data from URL"""
        async with self.session.get(url) as response:
            return await response.json()
    
    async def parallel_fetch(self, urls: List[str]):
        """Fetch multiple URLs in parallel"""
        tasks = [self.fetch_data(url) for url in urls]
        results = await asyncio.gather(*tasks)
        return results

# Example usage
async def main():
    urls = [
        "https://api.example.com/data1",
        "https://api.example.com/data2",
        "https://api.example.com/data3"
    ]
    
    async with AsyncAgent() as agent:
        results = await agent.parallel_fetch(urls)
        print(f"Fetched {len(results)} results")

# Run
asyncio.run(main())
`
};

export const week2Lesson3 = {
    title: 'Essential Libraries for AI Agents (2026)',
    videoUrl: 'https://www.youtube.com/embed/c3g-NrC-OXU',
    notes: `# Essential Libraries for AI Agents (2026)

## Core AI/ML Libraries

### 1. LLM Client Libraries

#### Anthropic SDK
- Official Claude API client
- Features: Streaming, function calling, computer use
- Best for: Claude-based agents

#### OpenAI SDK
- GPT-4 and GPT-3.5 access
- Function calling support
- Best for: OpenAI models

### 2. Agent Frameworks

#### LangChain
- Comprehensive agent framework
- Tool integration
- Memory management
- Chain composition

#### LlamaIndex
- Data indexing and retrieval
- RAG (Retrieval Augmented Generation)
- Document processing

### 3. Utility Libraries

#### Pydantic
- Data validation
- Type checking
- Settings management

#### Tenacity
- Retry logic
- Error handling
- Backoff strategies

### 4. Web and API Libraries

#### aiohttp
- Async HTTP client
- WebSocket support
- Session management

#### httpx
- Modern HTTP client
- Async and sync support
- HTTP/2 support`,
    codeSnippet: `# Essential Libraries Demo

import anthropic
from pydantic import BaseModel, Field
from tenacity import retry, stop_after_attempt, wait_exponential
import aiohttp
import asyncio

# Pydantic for data validation
class AgentConfig(BaseModel):
    """Agent configuration with validation"""
    name: str = Field(..., min_length=1)
    model: str = Field(default="claude-3-opus-20260217")
    max_tokens: int = Field(default=1024, gt=0, le=4096)
    temperature: float = Field(default=0.7, ge=0, le=1)

# Tenacity for retry logic
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
async def call_api_with_retry(url: str):
    """API call with automatic retry"""
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

# Anthropic SDK usage
class ClaudeAgent:
    def __init__(self, config: AgentConfig):
        self.config = config
        self.client = anthropic.Anthropic()
    
    async def generate(self, prompt: str):
        """Generate response with Claude"""
        response = await self.client.messages.create(
            model=self.config.model,
            max_tokens=self.config.max_tokens,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.content[0].text

# Example usage
async def main():
    config = AgentConfig(name="MyAgent")
    agent = ClaudeAgent(config)
    result = await agent.generate("Hello!")
    print(result)

asyncio.run(main())
`
};

export const week2Lesson4 = {
    title: 'Building Your First Simple Agent',
    videoUrl: 'https://www.youtube.com/embed/HSZ_uaif57o',
    notes: `# Building Your First Simple Agent

## Agent Architecture

### Core Components
1. **LLM Client**: Interface to language model
2. **Memory**: Store conversation history
3. **Tools**: External capabilities
4. **Orchestrator**: Coordinate components

## Step-by-Step Implementation

### 1. Setup
- Install required libraries
- Configure API keys
- Initialize components

### 2. Memory Management
- Store messages
- Retrieve context
- Manage limits

### 3. Tool Integration
- Define tool functions
- Register with agent
- Handle tool calls

### 4. Main Loop
- Receive user input
- Process with LLM
- Execute tools if needed
- Return response

## Best Practices

### Error Handling
- Catch API errors
- Validate inputs
- Log failures
- Provide fallbacks

### Testing
- Unit tests for components
- Integration tests
- Mock API calls
- Test edge cases`,
    codeSnippet: `# Simple Agent Implementation

import anthropic
from typing import List, Dict, Callable
import json

class SimpleAgent:
    """A basic AI agent with tools"""
    
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = "claude-3-sonnet-20240229"
        self.messages: List[Dict] = []
        self.tools: Dict[str, Callable] = {}
    
    def register_tool(self, name: str, func: Callable, description: str):
        """Register a tool function"""
        self.tools[name] = {
            "function": func,
            "description": description
        }
    
    def add_message(self, role: str, content: str):
        """Add message to history"""
        self.messages.append({
            "role": role,
            "content": content
        })
    
    def process(self, user_input: str) -> str:
        """Process user input and return response"""
        # Add user message
        self.add_message("user", user_input)
        
        # Get LLM response
        response = self.client.messages.create(
            model=self.model,
            max_tokens=1024,
            messages=self.messages
        )
        
        # Extract response
        assistant_message = response.content[0].text
        self.add_message("assistant", assistant_message)
        
        return assistant_message

# Example tools
def calculator(expression: str) -> float:
    """Simple calculator tool"""
    try:
        return eval(expression)
    except:
        return "Error in calculation"

def get_weather(city: str) -> str:
    """Mock weather tool"""
    return f"Weather in {city}: Sunny, 72°F"

# Usage
agent = SimpleAgent("your-api-key")
agent.register_tool("calculator", calculator, "Perform calculations")
agent.register_tool("weather", get_weather, "Get weather info")

response = agent.process("What is 25 * 4?")
print(response)
`
};

export const week2Quiz = {
    title: 'Week 2 Quiz: Python for AI Engineers',
    questions: [
        {
            id: 1,
            question: 'Why is Python preferred for AI agent development?',
            options: [
                'It is the fastest programming language',
                'It has a rich ecosystem of AI/ML libraries',
                'It only works with OpenAI',
                'It is the only language with async support'
            ],
            correctAnswer: 1,
            explanation: 'Python has extensive AI/ML libraries, making it ideal for agent development.'
        },
        {
            id: 2,
            question: 'What is the purpose of async/await in agent development?',
            options: [
                'To make code slower',
                'To handle multiple operations concurrently',
                'To replace all functions',
                'To avoid using APIs'
            ],
            correctAnswer: 1,
            explanation: 'Async/await allows agents to handle multiple operations simultaneously, improving efficiency.'
        },
        {
            id: 3,
            question: 'Which library is used for data validation in Python?',
            options: [
                'NumPy',
                'Pandas',
                'Pydantic',
                'Matplotlib'
            ],
            correctAnswer: 2,
            explanation: 'Pydantic provides data validation and settings management with type hints.'
        },
        {
            id: 4,
            question: 'What is the purpose of the tenacity library?',
            options: [
                'Data visualization',
                'Retry logic and error handling',
                'Web scraping',
                'Database management'
            ],
            correctAnswer: 1,
            explanation: 'Tenacity provides retry logic with exponential backoff for handling transient failures.'
        },
        {
            id: 5,
            question: 'What are the core components of a simple agent?',
            options: [
                'Only an LLM client',
                'LLM client, memory, tools, and orchestrator',
                'Just memory and tools',
                'Only tools'
            ],
            correctAnswer: 1,
            explanation: 'A complete agent needs an LLM client, memory, tools, and an orchestrator to coordinate them.'
        }
    ]
};

// Export all content
export const agenticAIPhase1Content = {
    week1: {
        lessons: [week1Lesson1, week1Lesson2, week1Lesson3, week1Lesson4],
        quiz: week1Quiz
    },
    week2: {
        lessons: [week2Lesson1, week2Lesson2, week2Lesson3, week2Lesson4],
        quiz: week2Quiz
    }
};
