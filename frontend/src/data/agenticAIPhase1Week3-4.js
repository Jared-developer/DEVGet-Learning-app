// Week 3: Tool Integration & Function Calling
export const week3Lesson1 = {
    title: 'Understanding Tool Use and Function Calling',
    videoUrl: 'https://www.youtube.com/watch?v=qw_O8W0Kpe4',
    notes: `# Understanding Tool Use and Function Calling

## What are Tools in AI Agents?

Tools are external capabilities that extend an agent's abilities beyond text generation:
- **APIs**: Access external data and services
- **Databases**: Query and store information
- **Code Execution**: Run calculations and scripts
- **Web Search**: Find current information
- **File Operations**: Read and write files

## Function Calling Basics

Function calling allows LLMs to:
1. Recognize when a tool is needed
2. Extract parameters from user input
3. Format tool calls correctly
4. Process tool results
5. Incorporate results into responses

## Tool Definition Structure

Tools are defined with:
- **Name**: Unique identifier
- **Description**: What the tool does
- **Parameters**: Required inputs with types
- **Return Type**: Expected output format`,
    codeSnippet: `# Tool Integration Example

import anthropic
from typing import Dict, Any

def define_weather_tool():
    """Define a weather lookup tool"""
    return {
        "name": "get_weather",
        "description": "Get current weather for a city",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "City name"
                },
                "units": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "Temperature units"
                }
            },
            "required": ["city"]
        }
    }

def get_weather(city: str, units: str = "celsius") -> Dict:
    """Mock weather function"""
    return {
        "city": city,
        "temperature": 22,
        "units": units,
        "condition": "Sunny"
    }

# Using tools with Claude
client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-3-sonnet-20240229",
    max_tokens=1024,
    tools=[define_weather_tool()],
    messages=[{
        "role": "user",
        "content": "What's the weather in Tokyo?"
    }]
)
`
};

export const week3Lesson2 = {
    title: 'Building Custom Tools for Your Agent',
    videoUrl: 'https://www.youtube.com/watch?v=dA1cHGACXCo',
    notes: `# Building Custom Tools for Your Agent

## Tool Design Principles

### 1. Single Responsibility
Each tool should do one thing well

### 2. Clear Interface
Well-defined inputs and outputs

### 3. Error Handling
Graceful failure with helpful messages

### 4. Documentation
Clear descriptions for the LLM

## Common Tool Patterns

### Data Retrieval Tools
- Database queries
- API calls
- File reading
- Web scraping

### Data Processing Tools
- Calculations
- Transformations
- Validations
- Formatting

### Action Tools
- Sending emails
- Creating files
- Updating databases
- Making API calls`,
    codeSnippet: `# Custom Tool Implementation

from typing import List, Dict
import json

class ToolRegistry:
    """Manage agent tools"""
    
    def __init__(self):
        self.tools = {}
    
    def register(self, name: str, func, schema: Dict):
        """Register a new tool"""
        self.tools[name] = {
            "function": func,
            "schema": schema
        }
    
    def get_schemas(self) -> List[Dict]:
        """Get all tool schemas for LLM"""
        return [tool["schema"] for tool in self.tools.values()]
    
    def execute(self, name: str, **kwargs) -> Any:
        """Execute a tool by name"""
        if name not in self.tools:
            raise ValueError(f"Tool {name} not found")
        return self.tools[name]["function"](**kwargs)

# Example tools
def calculator(expression: str) -> float:
    """Safe calculator"""
    try:
        return eval(expression, {"__builtins__": {}})
    except Exception as e:
        return f"Error: {str(e)}"

def search_database(query: str) -> List[Dict]:
    """Mock database search"""
    return [
        {"id": 1, "title": "Result 1"},
        {"id": 2, "title": "Result 2"}
    ]

# Register tools
registry = ToolRegistry()
registry.register("calculator", calculator, {
    "name": "calculator",
    "description": "Perform mathematical calculations",
    "input_schema": {
        "type": "object",
        "properties": {
            "expression": {"type": "string"}
        },
        "required": ["expression"]
    }
})
`
};

export const week3Lesson3 = {
    title: 'Advanced Tool Orchestration',
    videoUrl: 'https://www.youtube.com/watch?v=wd7TZ4w1mSw',
    notes: `# Advanced Tool Orchestration

## Multi-Tool Workflows

Agents often need to use multiple tools in sequence:
1. Search for information
2. Process the results
3. Store or return data

## Tool Chaining

Connect tool outputs to inputs:
- Output of Tool A → Input of Tool B
- Conditional execution based on results
- Parallel tool execution when possible

## Error Recovery

Handle tool failures gracefully:
- Retry with exponential backoff
- Fallback to alternative tools
- Inform user of limitations
- Log errors for debugging

## Performance Optimization

- Cache tool results
- Batch similar operations
- Use async for parallel calls
- Set appropriate timeouts`,
    codeSnippet: `# Advanced Tool Orchestration

import asyncio
from typing import List, Dict, Any

class ToolOrchestrator:
    """Orchestrate multiple tool calls"""
    
    def __init__(self, tools: Dict):
        self.tools = tools
        self.cache = {}
    
    async def execute_parallel(self, tool_calls: List[Dict]) -> List[Any]:
        """Execute multiple tools in parallel"""
        tasks = [
            self._execute_single(call)
            for call in tool_calls
        ]
        return await asyncio.gather(*tasks, return_exceptions=True)
    
    async def _execute_single(self, call: Dict) -> Any:
        """Execute a single tool call with caching"""
        cache_key = f"{call['name']}:{json.dumps(call['params'])}"
        
        if cache_key in self.cache:
            return self.cache[cache_key]
        
        try:
            result = await self.tools[call['name']](**call['params'])
            self.cache[cache_key] = result
            return result
        except Exception as e:
            return {"error": str(e)}
    
    async def execute_chain(self, chain: List[Dict]) -> Any:
        """Execute tools in sequence, passing results"""
        result = None
        for step in chain:
            if result:
                step['params']['previous_result'] = result
            result = await self._execute_single(step)
        return result

# Example usage
async def main():
    orchestrator = ToolOrchestrator(tools)
    
    # Parallel execution
    results = await orchestrator.execute_parallel([
        {"name": "weather", "params": {"city": "Tokyo"}},
        {"name": "weather", "params": {"city": "NYC"}}
    ])
    
    print(results)

asyncio.run(main())
`
};

export const week3Quiz = {
    title: 'Week 3 Quiz: Tool Integration',
    questions: [
        {
            id: 1,
            question: 'What is the primary purpose of tools in AI agents?',
            options: [
                'To make agents slower',
                'To extend agent capabilities beyond text generation',
                'To replace the LLM',
                'To store data only'
            ],
            correctAnswer: 1,
            explanation: 'Tools extend agent capabilities by providing access to external data, APIs, and actions.'
        },
        {
            id: 2,
            question: 'What information is required to define a tool?',
            options: [
                'Only the name',
                'Name, description, parameters, and return type',
                'Just the function code',
                'Only the description'
            ],
            correctAnswer: 1,
            explanation: 'A complete tool definition includes name, description, input schema, and expected output.'
        },
        {
            id: 3,
            question: 'What is tool chaining?',
            options: [
                'Using multiple tools at once',
                'Connecting tool outputs to inputs in sequence',
                'Storing tools in a database',
                'Deleting tools'
            ],
            correctAnswer: 1,
            explanation: 'Tool chaining connects the output of one tool to the input of another in a workflow.'
        },
        {
            id: 4,
            question: 'Why is caching important for tool execution?',
            options: [
                'It makes tools slower',
                'It improves performance by avoiding redundant calls',
                'It is not important',
                'It only works with databases'
            ],
            correctAnswer: 1,
            explanation: 'Caching prevents redundant tool calls, improving performance and reducing API costs.'
        },
        {
            id: 5,
            question: 'What is a best practice for tool error handling?',
            options: [
                'Ignore all errors',
                'Crash the agent',
                'Retry with exponential backoff and provide fallbacks',
                'Never use try-catch blocks'
            ],
            correctAnswer: 2,
            explanation: 'Proper error handling includes retries, fallbacks, and informative error messages.'
        }
    ]
};

// Week 4: Memory Systems & Agent Architectures
export const week4Lesson1 = {
    title: 'Memory Systems for Stateful Agents',
    videoUrl: 'https://www.youtube.com/watch?v=Cwq91cj2Pnc',
    notes: `# Memory Systems for Stateful Agents

## Why Agents Need Memory

Memory enables agents to:
- Maintain conversation context
- Learn from past interactions
- Track task progress
- Store user preferences
- Build knowledge over time

## Types of Agent Memory

### 1. Short-Term Memory
- Current conversation
- Recent context
- Active task state
- Temporary data

### 2. Long-Term Memory
- User preferences
- Historical interactions
- Learned patterns
- Persistent knowledge

### 3. Working Memory
- Current task context
- Intermediate results
- Tool outputs
- Decision history

## Memory Storage Options

### In-Memory (RAM)
- Fast access
- Lost on restart
- Limited capacity
- Good for sessions

### Database Storage
- Persistent
- Scalable
- Queryable
- Slower access

### Vector Databases
- Semantic search
- Similarity matching
- Efficient retrieval
- AI-optimized`,
    codeSnippet: `# Memory System Implementation

from typing import List, Dict, Optional
from datetime import datetime
import json

class AgentMemory:
    """Comprehensive memory system for agents"""
    
    def __init__(self, max_short_term: int = 50):
        self.short_term: List[Dict] = []
        self.long_term: Dict = {}
        self.working: Dict = {}
        self.max_short_term = max_short_term
    
    def add_to_short_term(self, message: Dict):
        """Add to short-term memory"""
        message['timestamp'] = datetime.now().isoformat()
        self.short_term.append(message)
        
        # Maintain size limit
        if len(self.short_term) > self.max_short_term:
            # Move old messages to long-term
            old = self.short_term.pop(0)
            self._archive_to_long_term(old)
    
    def _archive_to_long_term(self, message: Dict):
        """Archive message to long-term memory"""
        date_key = message['timestamp'][:10]
        if date_key not in self.long_term:
            self.long_term[date_key] = []
        self.long_term[date_key].append(message)
    
    def get_context(self, n: int = 10) -> List[Dict]:
        """Get recent context for LLM"""
        return self.short_term[-n:]
    
    def search_long_term(self, query: str) -> List[Dict]:
        """Search long-term memory"""
        results = []
        for date, messages in self.long_term.items():
            for msg in messages:
                if query.lower() in msg.get('content', '').lower():
                    results.append(msg)
        return results
    
    def save_to_file(self, filename: str):
        """Persist memory to disk"""
        data = {
            'short_term': self.short_term,
            'long_term': self.long_term,
            'working': self.working
        }
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
    
    def load_from_file(self, filename: str):
        """Load memory from disk"""
        with open(filename, 'r') as f:
            data = json.load(f)
        self.short_term = data.get('short_term', [])
        self.long_term = data.get('long_term', {})
        self.working = data.get('working', {})

# Usage
memory = AgentMemory()
memory.add_to_short_term({
    "role": "user",
    "content": "Hello, I'm working on a Python project"
})
memory.add_to_short_term({
    "role": "assistant",
    "content": "Great! How can I help with your Python project?"
})
`
};

export const week4Lesson2 = {
    title: 'Agent Architecture Patterns',
    videoUrl: 'https://www.youtube.com/watch?v=sal78ACtGTc',
    notes: `# Agent Architecture Patterns

## Common Agent Architectures

### 1. ReAct (Reasoning + Acting)
- Think about the problem
- Decide on an action
- Execute the action
- Observe the result
- Repeat until done

### 2. Plan-and-Execute
- Create a complete plan upfront
- Execute steps sequentially
- Adjust plan if needed
- Good for complex tasks

### 3. Reflexion
- Execute task
- Reflect on results
- Learn from mistakes
- Improve next attempt

### 4. Multi-Agent Systems
- Multiple specialized agents
- Agents communicate
- Divide and conquer
- Collaborative problem-solving

## Choosing an Architecture

Consider:
- Task complexity
- Need for planning
- Error tolerance
- Performance requirements
- Resource constraints`,
    codeSnippet: `# ReAct Agent Implementation

import anthropic
from typing import Dict, List, Optional

class ReActAgent:
    """ReAct (Reasoning + Acting) agent"""
    
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.tools = {}
        self.history = []
    
    def register_tool(self, name: str, func, description: str):
        """Register a tool"""
        self.tools[name] = {
            "function": func,
            "description": description
        }
    
    def think(self, observation: str) -> str:
        """Reasoning step"""
        prompt = f"""
        Observation: {observation}
        
        Think step by step:
        1. What do I know?
        2. What do I need to find out?
        3. What action should I take?
        
        Provide your reasoning:
        """
        
        response = self.client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=500,
            messages=[{"role": "user", "content": prompt}]
        )
        
        return response.content[0].text
    
    def act(self, reasoning: str) -> Dict:
        """Action step"""
        # Determine which tool to use based on reasoning
        prompt = f"""
        Based on this reasoning: {reasoning}
        
        Which tool should I use? Choose from: {list(self.tools.keys())}
        Respond with just the tool name and parameters in JSON format.
        """
        
        response = self.client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=200,
            messages=[{"role": "user", "content": prompt}]
        )
        
        # Parse tool call and execute
        # (simplified for example)
        return {"action": "tool_executed", "result": "success"}
    
    def run(self, task: str, max_iterations: int = 5):
        """Run ReAct loop"""
        observation = f"Task: {task}"
        
        for i in range(max_iterations):
            # Think
            reasoning = self.think(observation)
            self.history.append({"step": "think", "content": reasoning})
            
            # Act
            action_result = self.act(reasoning)
            self.history.append({"step": "act", "content": action_result})
            
            # Check if done
            if "complete" in str(action_result).lower():
                break
            
            # Update observation
            observation = f"Previous result: {action_result}"
        
        return self.history

# Usage
agent = ReActAgent("your-api-key")
agent.register_tool("search", lambda q: f"Results for {q}", "Search the web")
result = agent.run("Find information about AI agents")
`
};

export const week4Lesson3 = {
    title: 'Building Production-Ready Agents',
    videoUrl: 'https://www.youtube.com/watch?v=sgnrL7yo1Tw',
    notes: `# Building Production-Ready Agents

## Production Considerations

### 1. Reliability
- Error handling
- Retry logic
- Fallback strategies
- Health checks

### 2. Performance
- Response time optimization
- Caching strategies
- Async operations
- Resource management

### 3. Security
- API key management
- Input validation
- Output sanitization
- Access control

### 4. Monitoring
- Logging
- Metrics collection
- Error tracking
- Performance monitoring

### 5. Scalability
- Horizontal scaling
- Load balancing
- Queue management
- Resource limits

## Best Practices

### Code Organization
- Modular design
- Clear interfaces
- Comprehensive tests
- Documentation

### Deployment
- Environment management
- Configuration handling
- Version control
- CI/CD pipelines`,
    codeSnippet: `# Production-Ready Agent

import logging
import os
from typing import Optional
from dataclasses import dataclass
import anthropic
from tenacity import retry, stop_after_attempt, wait_exponential

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class AgentConfig:
    """Agent configuration"""
    api_key: str
    model: str = "claude-3-sonnet-20240229"
    max_tokens: int = 1024
    temperature: float = 0.7
    max_retries: int = 3
    timeout: int = 30

class ProductionAgent:
    """Production-ready AI agent"""
    
    def __init__(self, config: AgentConfig):
        self.config = config
        self.client = anthropic.Anthropic(api_key=config.api_key)
        self.metrics = {"requests": 0, "errors": 0, "successes": 0}
    
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10)
    )
    async def generate(self, prompt: str) -> Optional[str]:
        """Generate response with retry logic"""
        try:
            self.metrics["requests"] += 1
            logger.info(f"Processing request: {prompt[:50]}...")
            
            response = await self.client.messages.create(
                model=self.config.model,
                max_tokens=self.config.max_tokens,
                temperature=self.config.temperature,
                messages=[{"role": "user", "content": prompt}]
            )
            
            self.metrics["successes"] += 1
            logger.info("Request successful")
            return response.content[0].text
            
        except Exception as e:
            self.metrics["errors"] += 1
            logger.error(f"Error processing request: {e}")
            raise
    
    def get_metrics(self) -> dict:
        """Get agent metrics"""
        return self.metrics.copy()
    
    def health_check(self) -> bool:
        """Check agent health"""
        try:
            # Simple health check
            return self.client is not None
        except:
            return False

# Usage
config = AgentConfig(api_key=os.getenv("ANTHROPIC_API_KEY"))
agent = ProductionAgent(config)

# Check health
if agent.health_check():
    logger.info("Agent is healthy")
`
};

export const week4Quiz = {
    title: 'Week 4 Quiz: Memory & Architecture',
    questions: [
        {
            id: 1,
            question: 'What are the three main types of agent memory?',
            options: [
                'Fast, slow, and medium',
                'Short-term, long-term, and working memory',
                'RAM, disk, and cloud',
                'User, system, and assistant'
            ],
            correctAnswer: 1,
            explanation: 'Agents use short-term (current context), long-term (persistent), and working memory (active task).'
        },
        {
            id: 2,
            question: 'What does ReAct stand for in agent architecture?',
            options: [
                'React to events',
                'Reasoning + Acting',
                'Real-time action',
                'Recursive acting'
            ],
            correctAnswer: 1,
            explanation: 'ReAct combines reasoning (thinking) with acting (tool use) in an iterative loop.'
        },
        {
            id: 3,
            question: 'Why is retry logic important in production agents?',
            options: [
                'To make agents slower',
                'To handle transient failures and improve reliability',
                'It is not important',
                'To increase costs'
            ],
            correctAnswer: 1,
            explanation: 'Retry logic with exponential backoff handles temporary failures, improving reliability.'
        },
        {
            id: 4,
            question: 'What is the purpose of vector databases in agent memory?',
            options: [
                'To store images only',
                'To enable semantic search and similarity matching',
                'To replace all other databases',
                'To slow down queries'
            ],
            correctAnswer: 1,
            explanation: 'Vector databases enable semantic search, allowing agents to find relevant information by meaning.'
        },
        {
            id: 5,
            question: 'What should production agents include for monitoring?',
            options: [
                'Nothing, monitoring is optional',
                'Logging, metrics, error tracking, and performance monitoring',
                'Only error logs',
                'Just user feedback'
            ],
            correctAnswer: 1,
            explanation: 'Comprehensive monitoring includes logging, metrics, error tracking, and performance data.'
        }
    ]
};
