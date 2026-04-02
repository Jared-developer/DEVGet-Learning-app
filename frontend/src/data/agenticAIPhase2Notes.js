// Agentic AI Development - Phase 2 Notes (Weeks 5-8)
// Building Core Agentic Capabilities

// Week 5: Introduction to Agentic AI & Architecture
export const week5Lesson1 = {
    title: 'Defining Agents vs. Simple LLM Workflows',
    videoUrl: 'https://www.youtube.com/watch?v=F8NKVhkZZWI',
    notes: `# Defining Agents vs. Simple LLM Workflows

## Characteristic Comparison

| Characteristic | Simple LLM Workflow | True Agent |
|---------------|---------------------|------------|
| Control Flow | Linear, predetermined | Dynamic, self-directed |
| Decision Making | Single pass | Iterative loop with feedback |
| Tool Usage | Fixed sequence | On-demand, context-aware |
| Adaptability | None | Self-corrects and refines |
| State Management | Stateless | Maintains and evolves state |

## The Agent Loop: Think → Act → Observe → Iterate

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     THE AGENT LOOP                          │
│                                                             │
│   ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌────────┐│
│   │  THINK  │───▶│   ACT   │───▶│ OBSERVE  │───▶│REFLECT││
│   │         │    │         │    │          │    │        ││
│   │ Analyze │    │ Execute │    │ Process  │    │ Update ││
│   │ Plan    │    │ Tool    │    │ Results  │    │ Memory ││
│   └─────────┘    └─────────┘    └──────────┘    └────────┘│
│        ▲                                            │      │
│        └────────────────────────────────────────────┘      │
│                    Iterate until goal met                   │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## The ReAct (Reason + Act) Pattern

Introduced by Yao et al. (2022), ReAct interleaves reasoning traces with action execution:

**Example Flow:**
- Thought: I need to find the current weather in Paris
- Action: search_weather[Paris]
- Observation: 18°C, partly cloudy, 65% humidity
- Thought: I now have the weather information
- Action: finish[The weather in Paris is 18°C and partly cloudy]`,
    codeSnippet: `# Building a Basic ReAct Agent
# Using Smolagents - Hugging Face's latest framework

from smolagents import CodeAgent, Tool, LiteLLMModel
import httpx

# Define tools
class WeatherTool(Tool):
    name = "weather"
    description = "Get current weather for a city"
    inputs = {"city": {"type": "string", "description": "City name"}}
    output_type = "string"
    
    def forward(self, city: str) -> str:
        # Using wttr.in for demo
        response = httpx.get(f"https://wttr.in/{city}?format=%C+%t")
        return response.text.strip()

class SearchTool(Tool):
    name = "search"
    description = "Search the web for information"
    inputs = {"query": {"type": "string", "description": "Search query"}}
    output_type = "string"
    
    def forward(self, query: str) -> str:
        return f"Search results for: {query}"

# Initialize model (using latest Claude Opus 4.6)
model = LiteLLMModel(
    model_id="anthropic/claude-3-opus-20260217",
    api_key="your-api-key"
)

# Create the agent
agent = CodeAgent(
    tools=[WeatherTool(), SearchTool()],
    model=model,
    max_steps=10,
    verbosity_level=2
)

# Run the agent
result = agent.run(
    "What's the weather in London and should I bring an umbrella?"
)
print(result)
`
};

export const week5Lesson2 = {
    title: 'Agent Architecture Patterns',
    videoUrl: 'https://www.youtube.com/watch?v=eBVi_sLaYsc',
    notes: `# Agent Architecture Patterns

## Tool Architecture

Tools are the "hands" of an agent—they allow interaction with the external world.

\`\`\`
┌─────────────────────────────────────────────────────┐
│                    TOOL DESIGN                       │
├─────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────┐  │
│  │               Tool Interface                   │  │
│  ├───────────────────────────────────────────────┤  │
│  │  • name: Unique identifier                    │  │
│  │  • description: Clear purpose for LLM         │  │
│  │  • input_schema: Parameters with types        │  │
│  │  • output_schema: Expected return format      │  │
│  │  • error_handling: Graceful failure           │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
\`\`\`

## Key Components

1. **LLM Brain**: The reasoning engine (Claude, GPT-4, etc.)
2. **Tool Registry**: Available actions the agent can take
3. **Memory System**: Short-term and long-term storage
4. **Orchestrator**: Coordinates the agent loop
5. **Guardrails**: Safety and validation checks`,
    codeSnippet: `# Agent Architecture Example

from typing import List, Dict, Callable
import anthropic

class AgentArchitecture:
    def __init__(self, api_key: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.tools: Dict[str, Callable] = {}
        self.memory: List[Dict] = []
        self.max_iterations = 10
    
    def register_tool(self, name: str, func: Callable, description: str):
        """Register a tool with the agent"""
        self.tools[name] = {
            "function": func,
            "description": description
        }
    
    def think(self, task: str) -> str:
        """Reasoning step"""
        messages = self.memory + [
            {"role": "user", "content": f"Task: {task}"}
        ]
        
        response = self.client.messages.create(
            model="claude-3-opus-20260217",
            max_tokens=1024,
            messages=messages
        )
        
        return response.content[0].text
    
    def act(self, action: str) -> str:
        """Execute an action"""
        # Parse and execute tool
        if action in self.tools:
            return self.tools[action]["function"]()
        return "Unknown action"
    
    def run(self, task: str):
        """Main agent loop"""
        for i in range(self.max_iterations):
            # Think
            thought = self.think(task)
            self.memory.append({"role": "assistant", "content": thought})
            
            # Check if done
            if "DONE" in thought:
                return thought
            
            # Act (simplified)
            # In real implementation, parse thought for tool calls
        
        return "Max iterations reached"
`
};

export const week5Quiz = {
    title: 'Week 5 Quiz: Agent Architecture',
    questions: [
        {
            id: 1,
            question: 'What is the main difference between a simple LLM workflow and a true agent?',
            options: [
                'Agents are faster',
                'Agents have dynamic, self-directed control flow with iterative feedback',
                'Agents only work with Claude',
                'Agents don\'t use LLMs'
            ],
            correctAnswer: 1,
            explanation: 'True agents have dynamic control flow and can iterate with feedback, unlike linear LLM workflows.'
        },
        {
            id: 2,
            question: 'What does ReAct stand for?',
            options: [
                'React to events',
                'Reasoning + Acting',
                'Real-time action',
                'Recursive acting'
            ],
            correctAnswer: 1,
            explanation: 'ReAct combines Reasoning (thinking) with Acting (tool use) in an iterative pattern.'
        },
        {
            id: 3,
            question: 'What are the four steps in the agent loop?',
            options: [
                'Start, Stop, Pause, Resume',
                'Think, Act, Observe, Reflect',
                'Input, Process, Output, Store',
                'Plan, Execute, Validate, Report'
            ],
            correctAnswer: 1,
            explanation: 'The agent loop consists of Think (analyze), Act (execute), Observe (process results), and Reflect (update memory).'
        },
        {
            id: 4,
            question: 'What is the purpose of tools in an agent system?',
            options: [
                'To make the agent slower',
                'To extend agent capabilities beyond text generation',
                'To replace the LLM',
                'To store data only'
            ],
            correctAnswer: 1,
            explanation: 'Tools allow agents to interact with external systems, APIs, and perform actions beyond text generation.'
        },
        {
            id: 5,
            question: 'Which component coordinates the agent loop?',
            options: [
                'The LLM',
                'The tools',
                'The orchestrator',
                'The memory'
            ],
            correctAnswer: 2,
            explanation: 'The orchestrator coordinates the agent loop, managing the flow between thinking, acting, and observing.'
        }
    ]
};

// Week 6: Empowering Agents with Tools
export const week6Lesson1 = {
    title: 'Tool Design and Implementation',
    videoUrl: 'https://www.youtube.com/watch?v=DWUdGhRrv2c',
    notes: `# Tool Design and Implementation

## Using Pydantic-AI for Type-Safe Tools (Latest 2026)

Pydantic-AI provides type-safe tool definitions with automatic validation.

## Tool Categories for Agents (2026)

| Category | Tools | Use Case |
|----------|-------|----------|
| Web | Brave Search, Tavily, Firecrawl | Real-time information retrieval |
| Code | Python interpreter, Jupyter | Data analysis, calculations |
| APIs | Slack, GitHub, Google Workspace | Business automation |
| File | Read/write, PDF, Excel | Document processing |
| Database | PostgreSQL, MongoDB, Vector DB | Data persistence |
| Computer Use | Mouse, keyboard, browser | Desktop automation (Claude feature) |

## Best Practices

1. **Clear Descriptions**: Help the LLM understand when to use the tool
2. **Type Safety**: Use Pydantic models for inputs/outputs
3. **Error Handling**: Graceful failures with helpful messages
4. **Validation**: Check inputs before execution
5. **Documentation**: Include examples in descriptions`,
    codeSnippet: `# Type-Safe Tools with Pydantic-AI

from pydantic_ai import Agent, RunContext
from pydantic import BaseModel
import httpx
from typing import Annotated

class WeatherInput(BaseModel):
    city: str
    units: str = "celsius"

class WeatherOutput(BaseModel):
    temperature: float
    condition: str
    humidity: int
    location: str

# Tool with proper validation
async def get_weather(
    ctx: RunContext,
    input_data: Annotated[WeatherInput, "City and units for weather"]
) -> WeatherOutput:
    """Fetch current weather for a location."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.openweathermap.org/data/2.5/weather",
                params={
                    "q": input_data.city,
                    "units": "metric" if input_data.units == "celsius" else "imperial",
                    "appid": "your-api-key"
                }
            )
            data = response.json()
            
            return WeatherOutput(
                temperature=data["main"]["temp"],
                condition=data["weather"][0]["description"],
                humidity=data["main"]["humidity"],
                location=data["name"]
            )
    except Exception as e:
        return WeatherOutput(
            temperature=0,
            condition=f"Error: {str(e)}",
            humidity=0,
            location=input_data.city
        )

# Create agent with tools
agent = Agent(
    "claude-3-opus-20260217",
    tools=[get_weather],
    system_prompt="You are a helpful assistant with access to weather data."
)

# Use the agent
result = agent.run_sync("What's the weather like in Tokyo?")
print(result)
`
};

export const week6Lesson2 = {
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
import json

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
    tools = {
        "weather": get_weather_tool(),
        "search": get_search_tool()
    }
    
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

export const week6Quiz = {
    title: 'Week 6 Quiz: Tool Integration',
    questions: [
        {
            id: 1,
            question: 'What is the benefit of using Pydantic for tool definitions?',
            options: [
                'It makes tools slower',
                'It provides type safety and automatic validation',
                'It only works with Python 2',
                'It replaces the LLM'
            ],
            correctAnswer: 1,
            explanation: 'Pydantic provides type-safe tool definitions with automatic input/output validation.'
        },
        {
            id: 2,
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
            id: 3,
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
            id: 4,
            question: 'What is a best practice for tool error handling?',
            options: [
                'Ignore all errors',
                'Crash the agent',
                'Retry with exponential backoff and provide fallbacks',
                'Never use try-catch blocks'
            ],
            correctAnswer: 2,
            explanation: 'Proper error handling includes retries, fallbacks, and informative error messages.'
        },
        {
            id: 5,
            question: 'Which tool category is used for real-time information retrieval?',
            options: [
                'Database tools',
                'Web tools (Brave Search, Tavily)',
                'File tools',
                'Code tools'
            ],
            correctAnswer: 1,
            explanation: 'Web tools like Brave Search and Tavily are used for real-time information retrieval.'
        }
    ]
};

// Week 7: Giving Agents Memory
export const week7Lesson1 = {
    title: 'Memory Architecture for Agents',
    videoUrl: 'https://www.youtube.com/watch?v=oUpEq_SfFRU',
    notes: `# Memory Architecture for Agents

## Types of Memory in Agentic Systems

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    MEMORY ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   SHORT-TERM MEMORY          LONG-TERM MEMORY                │
│   ┌──────────────────┐       ┌──────────────────┐           │
│   │ Session Context  │       │ Vector Database  │           │
│   │ Conversation     │       │ - Semantic       │           │
│   │ History          │       │   search         │           │
│   │ Current Task     │       │ - Episodic       │           │
│   │ State            │       │ - Procedural     │           │
│   └──────────────────┘       └──────────────────┘           │
│           │                          │                       │
│           └──────────┬───────────────┘                       │
│                      ▼                                       │
│           ┌─────────────────────┐                           │
│           │    Working Memory    │                           │
│           │  (Active context)    │                           │
│           └─────────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Memory Types

1. **Short-Term Memory**: Current session context, conversation history
2. **Long-Term Memory**: Persistent storage in vector databases
3. **Working Memory**: Active context being processed

## Vector Databases for Semantic Memory

Popular options in 2026:
- ChromaDB: Lightweight, persistent
- Pinecone: Cloud-native, scalable
- Weaviate: GraphQL interface
- Qdrant: High performance`,
    codeSnippet: `# Vector Database Memory with ChromaDB

import chromadb
from chromadb.utils import embedding_functions
import hashlib

class LongTermMemory:
    def __init__(self, collection_name: str = "agent_memory"):
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(path="./memory_db")
        
        # Use embedding function
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        
        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_fn
        )
    
    def store_memory(self, content: str, metadata: dict = None):
        """Store a memory with semantic search capability"""
        memory_id = hashlib.md5(content.encode()).hexdigest()
        
        self.collection.add(
            documents=[content],
            metadatas=[metadata or {}],
            ids=[memory_id]
        )
        return memory_id
    
    def retrieve_memories(self, query: str, n_results: int = 5) -> list:
        """Retrieve relevant memories based on semantic similarity"""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        return results['documents'][0] if results['documents'] else []
    
    def update_memory(self, memory_id: str, content: str):
        """Update an existing memory"""
        self.collection.update(
            ids=[memory_id],
            documents=[content]
        )
    
    def delete_memory(self, memory_id: str):
        """Remove a memory"""
        self.collection.delete(ids=[memory_id])

# Usage
memory = LongTermMemory()
memory.store_memory(
    "User prefers concise, bullet-point style answers",
    {"type": "preference", "user": "alice"}
)

relevant = memory.retrieve_memories("How should I format answers?")
print(relevant)
`
};

export const week7Lesson2 = {
    title: 'Conversation Memory with LangChain',
    videoUrl: 'https://www.youtube.com/watch?v=X550Zbz_ROE',
    notes: `# Conversation Memory with LangChain

## Conversation Buffer Memory

Maintains a sliding window of recent conversation exchanges.

## Memory Types in LangChain

1. **ConversationBufferMemory**: Stores all messages
2. **ConversationBufferWindowMemory**: Keeps last N exchanges
3. **ConversationSummaryMemory**: Summarizes old conversations
4. **VectorStoreMemory**: Semantic search over history

## Best Practices

- Use window memory for cost efficiency
- Implement memory pruning strategies
- Store important facts in long-term memory
- Clear memory when context switches`,
    codeSnippet: `# Conversation Memory Implementation

from langchain.memory import ConversationBufferWindowMemory
from langchain_anthropic import ChatAnthropic
from langchain.agents import create_react_agent, AgentExecutor
from langchain.tools import tool
from langchain.schema import SystemMessage

# Configure memory
memory = ConversationBufferWindowMemory(
    memory_key="chat_history",
    return_messages=True,
    k=10  # Keep last 10 exchanges
)

# Create model
model = ChatAnthropic(
    model="claude-3-opus-20260217",
    temperature=0.7,
    max_tokens=1024
)

# Define tools
@tool
def calculate(expression: str) -> str:
    """Calculate mathematical expressions"""
    try:
        return str(eval(expression))
    except:
        return "Invalid expression"

# Create agent with memory
agent = create_react_agent(
    llm=model,
    tools=[calculate],
    prompt=SystemMessage(content="You are a helpful assistant with memory.")
)

executor = AgentExecutor(
    agent=agent,
    tools=[calculate],
    memory=memory,
    verbose=True
)

# Run with memory
executor.invoke({"input": "My name is Sarah"})
executor.invoke({"input": "What's my name?"})  # Remembers Sarah!
`
};

export const week7Quiz = {
    title: 'Week 7 Quiz: Agent Memory',
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
            id: 3,
            question: 'What does ConversationBufferWindowMemory do?',
            options: [
                'Stores all messages forever',
                'Keeps the last N conversation exchanges',
                'Deletes all memory',
                'Only stores user messages'
            ],
            correctAnswer: 1,
            explanation: 'ConversationBufferWindowMemory maintains a sliding window of the most recent N exchanges.'
        },
        {
            id: 4,
            question: 'Which is a popular vector database for 2026?',
            options: [
                'MySQL',
                'ChromaDB',
                'Excel',
                'Notepad'
            ],
            correctAnswer: 1,
            explanation: 'ChromaDB is a popular lightweight, persistent vector database for semantic search.'
        },
        {
            id: 5,
            question: 'Why use memory pruning strategies?',
            options: [
                'To make agents slower',
                'To manage costs and context window limits',
                'To delete all data',
                'It is not necessary'
            ],
            correctAnswer: 1,
            explanation: 'Memory pruning helps manage API costs and stay within context window limits while retaining important information.'
        }
    ]
};

// Week 8: Agentic Retrieval-Augmented Generation (RAG)
export const week8Lesson1 = {
    title: 'Beyond Basic RAG: Agentic RAG Architecture',
    videoUrl: 'https://www.youtube.com/watch?v=u5Vcrwpzoz8',
    notes: `# Beyond Basic RAG: Agentic RAG Architecture

## Agentic RAG Workflow

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                     AGENTIC RAG WORKFLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   User Query: "What were the key points in last quarter's       │
│                sales report and how do they compare to Q2?"      │
│                                                                  │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 1. QUERY ANALYSIS (Agent Decision)                      │   │
│   │    → Multi-hop query                                     │   │
│   │    → Needs Q3 report + Q2 report                         │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 2. PLANNING (Agent Strategy)                            │   │
│   │    → Rewrite query: "Q3 sales report key points"        │   │
│   │    → Separate query: "Q2 sales report key points"       │   │
│   │    → Plan: Retrieve both, then compare                  │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 3. EXECUTION (Tool Use)                                 │   │
│   │    → Vector search for Q3 report                        │   │
│   │    → Vector search for Q2 report                        │   │
│   │    → Re-rank results                                     │   │
│   └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │ 4. SYNTHESIS (Agent Reasoning)                          │   │
│   │    → Compare documents                                   │   │
│   │    → Generate comparison analysis                        │   │
│   │    → Cite sources                                        │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Key Differences from Basic RAG

| Feature | Basic RAG | Agentic RAG |
|---------|-----------|-------------|
| Query Processing | Single pass | Multi-step analysis |
| Retrieval | One-shot | Iterative with refinement |
| Decision Making | Fixed | Dynamic based on results |
| Error Handling | None | Self-correction |
| Multi-hop | No | Yes |`,
    codeSnippet: `# Building Agentic RAG with LlamaIndex

from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    Settings
)
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.llms.anthropic import Claude
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

class AgenticRAG:
    def __init__(self, documents_dir: str):
        # Setup embedding model
        Settings.embed_model = HuggingFaceEmbedding(
            model_name="BAAI/bge-small-en-v1.5"
        )
        
        # Setup LLM (Claude Opus 4.6)
        Settings.llm = Claude(
            model="claude-3-opus-20260217",
            max_tokens=2048,
            temperature=0
        )
        
        # Load and index documents
        documents = SimpleDirectoryReader(documents_dir).load_data()
        self.index = VectorStoreIndex.from_documents(documents)
        
        # Create specialized query engines
        self.engines = self._create_specialized_engines()
        
        # Create agent
        self.agent = self._create_agent()
    
    def _create_specialized_engines(self):
        """Create different query engines for different retrieval strategies"""
        base_engine = self.index.as_query_engine()
        
        return {
            "summary": QueryEngineTool(
                query_engine=base_engine,
                metadata=ToolMetadata(
                    name="summary_tool",
                    description="Useful for summarizing document content"
                )
            ),
            "fact_check": QueryEngineTool(
                query_engine=base_engine,
                metadata=ToolMetadata(
                    name="fact_check_tool",
                    description="Useful for verifying facts and finding specific details"
                )
            )
        }
    
    def _create_agent(self):
        """Create a ReAct agent with multiple tools"""
        return ReActAgent.from_tools(
            tools=list(self.engines.values()),
            llm=Settings.llm,
            verbose=True,
            max_iterations=10
        )
    
    def query(self, question: str) -> str:
        """Process query with agentic reasoning"""
        response = self.agent.chat(question)
        return str(response)

# Usage
rag = AgenticRAG("./documents")
result = rag.query(
    "Compare the revenue growth from Q2 to Q3, and identify which "
    "product category showed the strongest performance."
)
print(result)
`
};

export const week8Lesson2 = {
    title: 'Query Rewriting and Self-Evaluation',
    videoUrl: 'https://www.youtube.com/watch?v=sVcwVQRHIc8',
    notes: `# Query Rewriting and Self-Evaluation

## Query Rewriting Techniques

Transform user queries to optimize retrieval:

1. **Simplification**: Remove unnecessary words
2. **Expansion**: Add relevant keywords
3. **Decomposition**: Break into sub-queries
4. **Specification**: Make more precise

## Self-Evaluation in Agentic RAG

Agents can evaluate their own retrieval results:

1. **Completeness Check**: Does the answer fully address the question?
2. **Relevance Score**: How relevant are the retrieved documents?
3. **Confidence Assessment**: How confident is the agent?
4. **Iterative Refinement**: Retry with improved queries if needed

## Benefits

- Higher quality answers
- Reduced hallucination
- Better source citation
- Adaptive retrieval strategy`,
    codeSnippet: `# Query Rewriting and Self-Evaluation

from pydantic_ai import Agent
from typing import List

class QueryRewritingAgent:
    def __init__(self):
        self.rewriter = Agent(
            "claude-3-opus-20260217",
            system_prompt="You are a query rewriting expert. "
                          "Rewrite user queries to optimize them for retrieval."
        )
    
    async def rewrite(self, query: str) -> List[str]:
        """Generate multiple query variations for better retrieval"""
        prompts = [
            f"Simplify this query: {query}",
            f"Expand this query with key terms: {query}",
            f"Create a more specific version: {query}",
            f"Break this into sub-queries: {query}"
        ]
        
        variations = []
        for prompt in prompts:
            result = await self.rewriter.run(prompt)
            variations.append(result.data)
        
        return variations
    
    async def decompose(self, query: str) -> List[str]:
        """Break complex queries into simpler sub-queries"""
        result = await self.rewriter.run(
            f"Break this complex query into 2-3 simple sub-queries: {query}\\n"
            f"Return only the sub-queries, one per line."
        )
        return [q.strip() for q in result.data.split('\\n') if q.strip()]

class SelfEvaluatingRAG:
    def __init__(self, rag_system):
        self.rag = rag_system
        self.evaluator = Agent(
            "claude-3-opus-20260217",
            system_prompt="Evaluate if a retrieval result sufficiently answers the question."
        )
    
    async def query_with_self_eval(self, question: str, max_attempts: int = 3):
        """Query with self-evaluation and iterative improvement"""
        for attempt in range(max_attempts):
            # Get initial answer
            result = await self.rag.query(question)
            
            # Self-evaluate
            eval_result = await self.evaluator.run(
                f"Question: {question}\\n"
                f"Answer: {result['answer']}\\n"
                f"Rate completeness (1-10). If less than 8, suggest what's missing."
            )
            
            if "8" in eval_result.data or "9" in eval_result.data or "10" in eval_result.data:
                return result
            
            # If not satisfied, refine query
            refinement = await self.evaluator.run(
                f"Based on missing: {eval_result.data}\\n"
                f"Rewrite the query to get missing information: {question}"
            )
            question = refinement.data
        
        return result

# Usage
rewriter = QueryRewritingAgent()
variations = await rewriter.rewrite("What is machine learning?")
print(variations)
`
};

export const week8Quiz = {
    title: 'Week 8 Quiz: Agentic RAG',
    questions: [
        {
            id: 1,
            question: 'What is the main advantage of Agentic RAG over basic RAG?',
            options: [
                'It is faster',
                'It uses multi-step analysis and iterative refinement',
                'It is cheaper',
                'It only works with Claude'
            ],
            correctAnswer: 1,
            explanation: 'Agentic RAG uses multi-step analysis, iterative refinement, and dynamic decision-making for better results.'
        },
        {
            id: 2,
            question: 'What is query rewriting?',
            options: [
                'Deleting queries',
                'Transforming queries to optimize retrieval',
                'Storing queries',
                'Ignoring queries'
            ],
            correctAnswer: 1,
            explanation: 'Query rewriting transforms user queries through simplification, expansion, or decomposition to improve retrieval.'
        },
        {
            id: 3,
            question: 'What does self-evaluation in RAG check for?',
            options: [
                'Only speed',
                'Completeness, relevance, and confidence of answers',
                'Only cost',
                'Nothing'
            ],
            correctAnswer: 1,
            explanation: 'Self-evaluation checks if answers are complete, relevant, and assesses confidence to enable iterative improvement.'
        },
        {
            id: 4,
            question: 'What is query decomposition?',
            options: [
                'Deleting queries',
                'Breaking complex queries into simpler sub-queries',
                'Making queries longer',
                'Encrypting queries'
            ],
            correctAnswer: 1,
            explanation: 'Query decomposition breaks complex multi-part questions into simpler sub-queries for better retrieval.'
        },
        {
            id: 5,
            question: 'Which tool is used for building Agentic RAG in 2026?',
            options: [
                'Microsoft Word',
                'LlamaIndex',
                'Photoshop',
                'Excel'
            ],
            correctAnswer: 1,
            explanation: 'LlamaIndex is a popular framework for building advanced RAG systems with agentic capabilities.'
        }
    ]
};

// Export all Phase 2 content
export const agenticAIPhase2Content = {
    week5: {
        lessons: [week5Lesson1, week5Lesson2],
        quiz: week5Quiz
    },
    week6: {
        lessons: [week6Lesson1, week6Lesson2],
        quiz: week6Quiz
    },
    week7: {
        lessons: [week7Lesson1, week7Lesson2],
        quiz: week7Quiz
    },
    week8: {
        lessons: [week8Lesson1, week8Lesson2],
        quiz: week8Quiz
    }
};
