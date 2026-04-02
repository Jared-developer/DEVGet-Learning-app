// Agentic AI Development - Phase 3 Notes (Weeks 9-12)
// Advanced Frameworks, Reasoning, and Multi-Agent Systems

// Week 9: Agent Frameworks Deep Dive
export const week9Lesson1 = {
    title: 'Framework Landscape in 2026',
    videoUrl: 'https://www.youtube.com/watch?v=DjuXACWYkkU',
    notes: `# Framework Landscape in 2026

## Agent Framework Ecosystem 2026

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                    AGENT FRAMEWORK ECOSYSTEM 2026                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │   LangChain    │  │   LlamaIndex   │  │   Smolagents   │         │
│  │                │  │                │  │                │         │
│  │ • Most mature  │  │ • RAG-first    │  │ • Lightweight  │         │
│  │ • Largest      │  │ • Data-centric │  │ • Code-first   │         │
│  │   ecosystem    │  │ • Agentic RAG  │  │ • HF native    │         │
│  └────────────────┘  └────────────────┘  └────────────────┘         │
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │
│  │   Pydantic-AI  │  │   CrewAI       │  │   AutoGen      │         │
│  │                │  │                │  │                │         │
│  │ • Type-safe    │  │ • Role-based   │  │ • Microsoft    │         │
│  │ • Production   │  │ • Multi-agent  │  │ • Conversational│        │
│  │ • Minimalist   │  │ • Task-driven  │  │ • Code exec    │         │
│  └────────────────┘  └────────────────┘  └────────────────┘         │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

## Framework Comparison

| Framework | Best For | Key Feature |
|-----------|----------|-------------|
| LangChain | Complex pipelines | LCEL, vast ecosystem |
| LlamaIndex | RAG-heavy apps | Agentic RAG, data connectors |
| Smolagents | Lightweight agents | Code-first, HF native |
| Pydantic-AI | Type-safe production | Validation, minimal |
| CrewAI | Role-based teams | Hierarchical, task-driven |
| AutoGen | Conversational | Code execution, Microsoft |
| LangGraph | Stateful workflows | Cycles, persistence |

## LangChain v0.5+ (Latest 2026)

LangChain has evolved significantly with improved typing, streaming, and agent capabilities.`,
    codeSnippet: `# langchain_advanced.py
from langchain.agents import create_agent
from langchain.tools import tool
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import SystemMessage
from langchain.memory import ConversationSummaryMemory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Initialize with Claude Opus 4.6
llm = ChatAnthropic(
    model="claude-3-opus-20260217",
    temperature=0.3,
    max_tokens=4096,
    streaming=True
)

# Define typed tools
@tool
def web_search(query: str) -> str:
    """Search the web for current information."""
    return f"Search results for: {query}"

@tool
def calculate(expression: str) -> float:
    """Calculate mathematical expressions safely."""
    import ast, operator
    allowed_ops = {
        ast.Add: operator.add,
        ast.Sub: operator.sub,
        ast.Mult: operator.mul,
        ast.Div: operator.truediv,
    }
    tree = ast.parse(expression, mode='eval')
    return eval(tree.body)

# Create advanced agent with memory
class AdvancedAgent:
    def __init__(self):
        self.tools = [web_search, calculate]
        self.memory = ConversationSummaryMemory(
            llm=llm,
            max_token_limit=2000,
            return_messages=True
        )
    
    async def run(self, input_text: str):
        """Run agent with memory."""
        response = await self.chain.ainvoke({"input": input_text})
        self.memory.save_context(
            {"input": input_text},
            {"output": response}
        )
        return response`
};

export const week9Lesson2 = {
    title: 'LlamaIndex Agentic RAG',
    videoUrl: 'https://www.youtube.com/watch?v=ZP_5ZdTjpQ4',
    notes: `# LlamaIndex Agentic RAG (Latest)

LlamaIndex has become the go-to for RAG-heavy agent workflows.

## Key Features

- **Hierarchical Node Parsing**: Better chunking strategies
- **Metadata Extraction**: Automatic title, keyword, summary extraction
- **Specialized Query Engines**: Different engines for different tasks
- **Agentic Tools**: Query engines as agent tools

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│              LLAMAINDEX AGENTIC RAG SYSTEM                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Document   │───▶│  Ingestion   │───▶│   Vector     │  │
│  │   Loader     │    │   Pipeline   │    │   Store      │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                             │                               │
│                             ▼                               │
│                    ┌──────────────────┐                     │
│                    │  Query Engines   │                     │
│                    │  • Summary       │                     │
│                    │  • Detail Search │                     │
│                    │  • Sub-Question  │                     │
│                    └──────────────────┘                     │
│                             │                               │
│                             ▼                               │
│                    ┌──────────────────┐                     │
│                    │   ReAct Agent    │                     │
│                    │  with Tools      │                     │
│                    └──────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
\`\`\``,

    codeSnippet: `# llama_index_agentic.py
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.llms.anthropic import Claude

# Setup
Settings.llm = Claude(model="claude-3-opus-20260217")

# Load documents
documents = SimpleDirectoryReader("./documents").load_data()
index = VectorStoreIndex.from_documents(documents)

# Create agent
agent = ReActAgent.from_tools(
    tools=[summary_tool, detail_tool],
    llm=Settings.llm
)

response = agent.chat("Compare Q3 findings")
print(response)`
};

export const week9Quiz = {
    title: 'Week 9 Quiz: Agent Frameworks',
    questions: [
        {
            id: 1,
            question: 'Which framework is best for RAG-heavy applications?',
            options: [
                'LangChain',
                'LlamaIndex',
                'CrewAI',
                'AutoGen'
            ],
            correctAnswer: 1,
            explanation: 'LlamaIndex is specifically designed for RAG-heavy applications with agentic RAG capabilities.'
        },
        {
            id: 2,
            question: 'What is the key feature of LangChain Expression Language (LCEL)?',
            options: [
                'Type safety',
                'Composable pipelines',
                'Code execution',
                'Role-based agents'
            ],
            correctAnswer: 1,
            explanation: 'LCEL enables composable, chainable pipelines for complex agent workflows.'
        },
        {
            id: 3,
            question: 'Which framework is best for type-safe production agents?',
            options: [
                'LangChain',
                'Smolagents',
                'Pydantic-AI',
                'CrewAI'
            ],
            correctAnswer: 2,
            explanation: 'Pydantic-AI provides type-safe, validated agent development for production use.'
        }
    ]
};


// Week 10: Advanced Reasoning & Planning
export const week10Lesson1 = {
    title: 'Reasoning Patterns for Agents',
    videoUrl: 'https://example.com/week10-lesson1',
    notes: `# Reasoning Patterns for Agents

## Reasoning Patterns Comparison

| Pattern | Strength | Use Case |
|---------|----------|----------|
| ReAct | Simple, interpretable | Basic tasks |
| Plan-and-Execute | Structured, robust | Multi-step tasks |
| Tree-of-Thoughts (ToT) | Explores alternatives | Creative problem-solving |
| Reflexion | Self-correcting | Iterative tasks, debugging |
| Chain-of-Thought (CoT) | Explicit reasoning | Transparency needed |

## Plan-and-Execute Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  PLAN-AND-EXECUTE PATTERN                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │ PLANNER  │───▶│ EXECUTOR │───▶│ EVALUATOR│             │
│  │          │    │          │    │          │             │
│  │ Creates  │    │ Runs     │    │ Checks   │             │
│  │ Steps    │    │ Actions  │    │ Results  │             │
│  └──────────┘    └──────────┘    └──────────┘             │
│       │                                │                    │
│       │          ┌──────────┐          │                    │
│       └─────────▶│REPLANNER │◀─────────┘                    │
│                  │          │                               │
│                  │ Adapts   │                               │
│                  │ on Fail  │                               │
│                  └──────────┘                               │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Concepts

**Plan-and-Execute**: Break complex tasks into steps, execute sequentially, adapt on failure

**Tree-of-Thoughts**: Explore multiple reasoning paths, evaluate each, select best

**Reflexion**: Self-evaluate, learn from mistakes, improve iteratively`,
    codeSnippet: `# plan_and_execute.py
from pydantic_ai import Agent
from pydantic import BaseModel
from typing import List

class PlanStep(BaseModel):
    step_number: int
    description: str
    tool_needed: str = None

class ExecutionPlan(BaseModel):
    goal: str
    steps: List[PlanStep]

class PlanAndExecuteAgent:
    def __init__(self):
        self.planner = Agent(
            "claude-3-opus-20260217",
            result_type=ExecutionPlan,
            system_prompt="Create detailed executable plans"
        )
        
        self.executor = Agent(
            "claude-3-sonnet-20260317",
            system_prompt="Execute individual plan steps"
        )
    
    async def run(self, task: str) -> str:
        # Phase 1: Planning
        plan = await self.planner.run(task)
        
        # Phase 2: Execution
        results = {}
        for step in plan.data.steps:
            result = await self._execute_step(step, results)
            results[step.step_number] = result
            
            if not result.success:
                # Replan on failure
                await self._replan(task, step, result)
        
        return self._synthesize(results)
    
    async def _execute_step(self, step, previous):
        return await self.executor.run(
            f"Step: {step.description}\\n"
            f"Previous: {previous}"
        )`
};

export const week10Lesson2 = {
    title: 'Tree-of-Thoughts & Reflexion',
    videoUrl: 'https://example.com/week10-lesson2',
    notes: `# Tree-of-Thoughts & Reflexion

## Tree-of-Thoughts (ToT)

Explores multiple reasoning paths simultaneously, evaluates each branch, and selects the best solution.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  TREE-OF-THOUGHTS SEARCH                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                      ┌─────────┐                            │
│                      │  Root   │                            │
│                      │ Problem │                            │
│                      └────┬────┘                            │
│                           │                                 │
│          ┌────────────────┼────────────────┐               │
│          ▼                ▼                ▼               │
│     ┌────────┐      ┌────────┐      ┌────────┐            │
│     │Thought1│      │Thought2│      │Thought3│            │
│     │Score:8 │      │Score:6 │      │Score:9 │            │
│     └───┬────┘      └────────┘      └───┬────┘            │
│         │                                │                 │
│    ┌────┴────┐                      ┌────┴────┐           │
│    ▼         ▼                      ▼         ▼           │
│  ┌───┐    ┌───┐                  ┌───┐    ┌───┐          │
│  │ A │    │ B │                  │ C │    │ D │          │
│  └───┘    └───┘                  └───┘    └───┘          │
│                                                            │
│  Explore best branches, prune low-scoring paths           │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Reflexion Pattern

Self-correcting agent that learns from failures.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    REFLEXION CYCLE                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │  ACTOR   │───▶│EVALUATOR │───▶│ REFLECTOR│             │
│  │          │    │          │    │          │             │
│  │ Attempts │    │ Judges   │    │ Learns   │             │
│  │ Solution │    │ Quality  │    │ Lessons  │             │
│  └──────────┘    └──────────┘    └──────────┘             │
│       ▲                                │                    │
│       │                                │                    │
│       └────────────────────────────────┘                    │
│              Iterate with Memory                            │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## When to Use Each

- **ToT**: Complex problems with multiple valid approaches
- **Reflexion**: Tasks requiring iterative refinement (coding, writing)
- **Plan-and-Execute**: Multi-step workflows with dependencies`,
    codeSnippet: `# tree_of_thoughts.py
from pydantic_ai import Agent
from typing import List

class ThoughtNode:
    def __init__(self, thought: str, parent=None):
        self.thought = thought
        self.parent = parent
        self.children = []
        self.score = 0.0
        self.depth = parent.depth + 1 if parent else 0

class TreeOfThoughtsAgent:
    def __init__(self, branching_factor=3, max_depth=5):
        self.branching_factor = branching_factor
        self.max_depth = max_depth
        
        self.generator = Agent(
            "claude-3-opus-20260217",
            system_prompt="Generate possible reasoning steps"
        )
        
        self.evaluator = Agent(
            "claude-3-sonnet-20260317",
            system_prompt="Rate thought quality (0-10)"
        )
    
    async def search(self, problem: str) -> ThoughtNode:
        """BFS/DFS search through thought tree."""
        root = ThoughtNode("Start")
        
        # Generate candidates
        candidates = await self.generate_thoughts(problem, [])
        
        # Evaluate and explore best
        best_node = None
        best_score = -1
        
        for thought in candidates:
            score = await self.evaluate_thought(problem, [], thought)
            node = ThoughtNode(thought)
            node.score = score
            
            if score > 7.0:  # Promising path
                child = await self.search_deeper(problem, [thought])
                if child.score > best_score:
                    best_node = child
                    best_score = child.score
        
        return best_node
    
    async def solve(self, problem: str) -> str:
        best_path = await self.search(problem)
        return self.synthesize(best_path)`
};

export const week10Project = {
    title: 'Week 10 Project: Build a Reasoning Agent',
    videoUrl: 'https://example.com/week10-project',
    notes: `# Week 10 Project: Build a Reasoning Agent

## Project Overview

Build an agent that uses advanced reasoning patterns to solve complex problems.

## Requirements

1. Implement Plan-and-Execute pattern
2. Add Reflexion for self-correction
3. Handle multi-step reasoning tasks
4. Include error recovery and replanning

## Deliverables

- Working agent with reasoning patterns
- Test cases demonstrating each pattern
- Documentation of design decisions
- Performance comparison of patterns

## Evaluation Criteria

- Correctness of reasoning
- Ability to recover from errors
- Code quality and documentation
- Creative use of patterns`,
    codeSnippet: `# project_reasoning_agent.py
"""
Week 10 Project: Advanced Reasoning Agent

Implement an agent that can:
1. Plan complex multi-step tasks
2. Execute with error handling
3. Self-correct using reflexion
4. Compare reasoning strategies
"""

from pydantic_ai import Agent
from typing import List, Dict
import asyncio

class ReasoningAgent:
    def __init__(self):
        # TODO: Initialize planner, executor, reflector
        pass
    
    async def solve_with_planning(self, problem: str):
        """Use plan-and-execute pattern."""
        # TODO: Implement
        pass
    
    async def solve_with_reflexion(self, problem: str):
        """Use reflexion pattern."""
        # TODO: Implement
        pass
    
    async def compare_strategies(self, problem: str):
        """Compare different reasoning approaches."""
        # TODO: Implement
        pass

# Test cases
async def main():
    agent = ReasoningAgent()
    
    # Test 1: Multi-step planning
    result1 = await agent.solve_with_planning(
        "Plan a 3-day trip to Paris with $1000 budget"
    )
    
    # Test 2: Self-correction
    result2 = await agent.solve_with_reflexion(
        "Write a Python function with edge cases"
    )
    
    # Test 3: Strategy comparison
    comparison = await agent.compare_strategies(
        "Optimize database query performance"
    )

if __name__ == "__main__":
    asyncio.run(main())`
};

export const week10Quiz = {
    title: 'Week 10 Quiz: Advanced Reasoning',
    questions: [
        {
            id: 1,
            question: 'What is the main advantage of Plan-and-Execute over simple ReAct?',
            options: [
                'It is faster',
                'It creates a structured plan before execution',
                'It uses less memory',
                'It requires fewer API calls'
            ],
            correctAnswer: 1,
            explanation: 'Plan-and-Execute creates a structured plan upfront, making it more robust for complex multi-step tasks.'
        },
        {
            id: 2,
            question: 'When should you use Tree-of-Thoughts?',
            options: [
                'For simple linear tasks',
                'When exploring multiple solution paths is beneficial',
                'Only for mathematical problems',
                'When speed is the priority'
            ],
            correctAnswer: 1,
            explanation: 'ToT is ideal when you need to explore multiple reasoning paths and select the best one.'
        },
        {
            id: 3,
            question: 'What does Reflexion enable agents to do?',
            options: [
                'Run faster',
                'Use fewer tokens',
                'Learn from mistakes and self-correct',
                'Execute code'
            ],
            correctAnswer: 2,
            explanation: 'Reflexion allows agents to evaluate their own performance, learn from failures, and improve iteratively.'
        },
        {
            id: 4,
            question: 'In Plan-and-Execute, what happens when a step fails?',
            options: [
                'The agent stops completely',
                'It skips to the next step',
                'The replanner adapts the plan',
                'It restarts from the beginning'
            ],
            correctAnswer: 2,
            explanation: 'The replanner component adapts the plan when steps fail, allowing recovery and continuation.'
        },
        {
            id: 5,
            question: 'What is the key difference between ToT and simple branching?',
            options: [
                'ToT is faster',
                'ToT evaluates and scores each branch',
                'ToT uses less memory',
                'ToT only works with GPT-4'
            ],
            correctAnswer: 1,
            explanation: 'ToT evaluates and scores each reasoning branch, allowing intelligent exploration of the solution space.'
        }
    ]
};


// Week 11: Multi-Agent Systems
export const week11Lesson1 = {
    title: 'CrewAI Multi-Agent Collaboration',
    videoUrl: 'https://example.com/week11-lesson1',
    notes: `# CrewAI Multi-Agent Collaboration

## CrewAI Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  CREWAI MULTI-AGENT SYSTEM                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │  RESEARCHER  │───▶│    WRITER    │───▶│    EDITOR    │  │
│  │              │    │              │    │              │  │
│  │ • Finds info │    │ • Creates    │    │ • Reviews    │  │
│  │ • Analyzes   │    │   content    │    │ • Polishes   │  │
│  │ • Delegates  │    │ • Structures │    │ • Approves   │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│                                                              │
│  Process Types:                                              │
│  • Sequential: Tasks run in order                           │
│  • Hierarchical: Manager delegates                          │
│  • Consensus: Agents vote on decisions                      │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Concepts

**Role-Based Agents**: Each agent has a specific role, goal, and backstory

**Task Dependencies**: Tasks can depend on outputs from previous tasks

**Delegation**: Agents can delegate subtasks to other agents

**Process Types**:
- Sequential: Linear workflow
- Hierarchical: Manager coordinates
- Consensus: Democratic decision-making`,
    codeSnippet: `# crewai_system.py
from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-opus-20260217")

# Create specialized agents
researcher = Agent(
    role="Senior Research Analyst",
    goal="Find and analyze relevant information",
    backstory="Expert researcher with deep analysis skills",
    llm=llm,
    verbose=True,
    allow_delegation=True
)

writer = Agent(
    role="Content Strategist",
    goal="Create engaging content from research",
    backstory="Award-winning writer",
    llm=llm,
    verbose=True
)

editor = Agent(
    role="Senior Editor",
    goal="Ensure quality and accuracy",
    backstory="Meticulous editor",
    llm=llm,
    verbose=True
)

# Create tasks
research_task = Task(
    description="Research AI trends for 2026",
    expected_output="Comprehensive research brief",
    agent=researcher
)

writing_task = Task(
    description="Write blog post from research",
    expected_output="1500-word blog post",
    agent=writer,
    context=[research_task]  # Depends on research
)

editing_task = Task(
    description="Edit and polish the content",
    expected_output="Final polished content",
    agent=editor,
    context=[writing_task]
)

# Create crew
crew = Crew(
    agents=[researcher, writer, editor],
    tasks=[research_task, writing_task, editing_task],
    process=Process.sequential,
    verbose=True
)

# Execute
result = crew.kickoff()
print(result)`
};

export const week11Lesson2 = {
    title: 'AutoGen Conversational Agents',
    videoUrl: 'https://example.com/week11-lesson2',
    notes: `# AutoGen Conversational Agents

## AutoGen Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  AUTOGEN GROUP CHAT                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              ┌──────────────────────┐                       │
│              │   GROUP CHAT         │                       │
│              │   MANAGER            │                       │
│              └──────────┬───────────┘                       │
│                         │                                   │
│         ┌───────────────┼───────────────┐                  │
│         ▼               ▼               ▼                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐           │
│  │  ENGINEER  │  │     QA     │  │   DEVOPS   │           │
│  │            │  │            │  │            │           │
│  │ Writes     │  │ Tests      │  │ Deploys    │           │
│  │ Code       │  │ Code       │  │ Code       │           │
│  └────────────┘  └────────────┘  └────────────┘           │
│         │               │               │                  │
│         └───────────────┼───────────────┘                  │
│                         ▼                                   │
│                  ┌────────────┐                             │
│                  │ USER PROXY │                             │
│                  │ (Executor) │                             │
│                  └────────────┘                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Features

**Code Execution**: Agents can write and execute code

**Group Chat**: Multiple agents collaborate in conversation

**Human-in-the-Loop**: Optional human input at key points

**Nested Chats**: Agents can spawn sub-conversations`,
    codeSnippet: `# autogen_system.py
import autogen
from autogen import AssistantAgent, UserProxyAgent, GroupChat

config_list = [{
    "model": "claude-3-opus-20260217",
    "api_key": "your-key",
    "api_type": "anthropic"
}]

llm_config = {"config_list": config_list}

# Create agents
engineer = AssistantAgent(
    name="Engineer",
    system_message="You write clean, efficient code",
    llm_config=llm_config
)

qa = AssistantAgent(
    name="QA",
    system_message="You write tests and find bugs",
    llm_config=llm_config
)

devops = AssistantAgent(
    name="DevOps",
    system_message="You handle deployment",
    llm_config=llm_config
)

user_proxy = UserProxyAgent(
    name="UserProxy",
    human_input_mode="NEVER",
    code_execution_config={"executor": "local"}
)

# Create group chat
groupchat = GroupChat(
    agents=[user_proxy, engineer, qa, devops],
    messages=[],
    max_round=20
)

manager = autogen.GroupChatManager(
    groupchat=groupchat,
    llm_config=llm_config
)

# Start collaboration
user_proxy.initiate_chat(
    manager,
    message="Build a rate limiter with tests"
)`
};

export const week11Project = {
    title: 'Week 11 Project: Multi-Agent Content System',
    videoUrl: 'https://example.com/week11-project',
    notes: `# Week 11 Project: Multi-Agent Content System

## Project Overview

Build a multi-agent system that collaborates to create high-quality content.

## Requirements

1. Implement at least 3 specialized agents
2. Use either CrewAI or AutoGen framework
3. Include task dependencies
4. Add quality control mechanisms

## Agent Roles

- **Researcher**: Gathers information
- **Writer**: Creates content
- **Editor**: Reviews and improves
- **SEO Specialist**: Optimizes for search
- **Fact Checker**: Verifies accuracy

## Deliverables

- Working multi-agent system
- Sample outputs from the system
- Documentation of agent interactions
- Performance metrics

## Bonus Challenges

- Add hierarchical management
- Implement agent voting/consensus
- Include human-in-the-loop review
- Add memory across sessions`,
    codeSnippet: `# project_multiagent.py
"""
Week 11 Project: Multi-Agent Content System

Build a collaborative agent system for content creation.
"""

from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic

class ContentCreationCrew:
    def __init__(self):
        self.llm = ChatAnthropic(
            model="claude-3-opus-20260217"
        )
        self._create_agents()
    
    def _create_agents(self):
        """Create specialized agents."""
        # TODO: Implement researcher agent
        self.researcher = None
        
        # TODO: Implement writer agent
        self.writer = None
        
        # TODO: Implement editor agent
        self.editor = None
        
        # TODO: Implement SEO specialist
        self.seo_specialist = None
    
    def create_content(self, topic: str):
        """Create content collaboratively."""
        # TODO: Define tasks
        tasks = []
        
        # TODO: Create crew
        crew = Crew(
            agents=[],
            tasks=tasks,
            process=Process.sequential
        )
        
        # TODO: Execute
        result = crew.kickoff()
        return result

# Test
if __name__ == "__main__":
    system = ContentCreationCrew()
    result = system.create_content(
        "The Future of AI Agents in Enterprise"
    )
    print(result)`
};

export const week11Quiz = {
    title: 'Week 11 Quiz: Multi-Agent Systems',
    questions: [
        {
            id: 1,
            question: 'What is the main advantage of multi-agent systems?',
            options: [
                'They are faster',
                'Specialized agents can focus on specific tasks',
                'They use less memory',
                'They are easier to build'
            ],
            correctAnswer: 1,
            explanation: 'Multi-agent systems allow specialization, where each agent focuses on what it does best.'
        },
        {
            id: 2,
            question: 'In CrewAI, what does "allow_delegation" enable?',
            options: [
                'Faster execution',
                'Agents can assign subtasks to other agents',
                'Automatic error handling',
                'Code execution'
            ],
            correctAnswer: 1,
            explanation: 'allow_delegation lets agents delegate subtasks to other agents in the crew.'
        },
        {
            id: 3,
            question: 'What is unique about AutoGen compared to other frameworks?',
            options: [
                'It only works with GPT-4',
                'It includes code execution capabilities',
                'It is the fastest framework',
                'It requires no configuration'
            ],
            correctAnswer: 1,
            explanation: 'AutoGen has built-in code execution, allowing agents to write and run code.'
        },
        {
            id: 4,
            question: 'What is a hierarchical process in CrewAI?',
            options: [
                'All agents work simultaneously',
                'A manager agent delegates tasks',
                'Tasks run in random order',
                'Only one agent works at a time'
            ],
            correctAnswer: 1,
            explanation: 'In hierarchical mode, a manager agent coordinates and delegates tasks to other agents.'
        },
        {
            id: 5,
            question: 'What is the purpose of task context in CrewAI?',
            options: [
                'To make tasks run faster',
                'To define task dependencies and pass outputs',
                'To reduce token usage',
                'To enable code execution'
            ],
            correctAnswer: 1,
            explanation: 'Task context defines dependencies, allowing tasks to use outputs from previous tasks.'
        }
    ]
};

// Week 12: LangGraph Workflows
export const week12Lesson1 = {
    title: 'Graph-Based Workflows with LangGraph',
    videoUrl: 'https://example.com/week12-lesson1',
    notes: `# Graph-Based Workflows with LangGraph

## LangGraph Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  LANGGRAPH STATE MACHINE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌──────────┐                             │
│                    │  START   │                             │
│                    └────┬─────┘                             │
│                         │                                   │
│                         ▼                                   │
│                  ┌──────────────┐                           │
│                  │   CLASSIFY   │                           │
│                  └──────┬───────┘                           │
│                         │                                   │
│          ┌──────────────┼──────────────┐                   │
│          ▼              ▼              ▼                   │
│    ┌─────────┐    ┌─────────┐    ┌─────────┐              │
│    │ SEARCH  │    │ ANALYZE │    │ESCALATE │              │
│    └────┬────┘    └────┬────┘    └────┬────┘              │
│         │              │              │                    │
│         └──────────────┼──────────────┘                    │
│                        ▼                                   │
│                  ┌──────────┐                              │
│                  │ RESPOND  │                              │
│                  └────┬─────┘                              │
│                       │                                    │
│                       ▼                                    │
│                  ┌──────────┐                              │
│                  │   END    │                              │
│                  └──────────┘                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Features

**State Management**: Persistent state across nodes

**Conditional Edges**: Dynamic routing based on state

**Cycles**: Support for iterative workflows

**Checkpointing**: Save and resume workflows

**Human-in-the-Loop**: Pause for human input`,
    codeSnippet: `# langgraph_workflow.py
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END
from langgraph.checkpoint import MemorySaver
from langchain_anthropic import ChatAnthropic

# Define state
class AgentState(TypedDict):
    messages: list
    next_step: str
    iteration: int
    context: dict

# Create graph
workflow = StateGraph(AgentState)

# Define nodes
def classify(state: AgentState):
    """Classify user intent."""
    llm = ChatAnthropic(model="claude-3-opus-20260217")
    response = llm.invoke(state["messages"])
    return {
        **state,
        "next_step": "search"  # Determine next step
    }

def search(state: AgentState):
    """Search for information."""
    # Search logic
    return {
        **state,
        "context": {"results": "..."}
    }

def respond(state: AgentState):
    """Generate response."""
    llm = ChatAnthropic(model="claude-3-opus-20260217")
    response = llm.invoke(state["messages"])
    return {
        **state,
        "messages": state["messages"] + [response]
    }

# Add nodes
workflow.add_node("classify", classify)
workflow.add_node("search", search)
workflow.add_node("respond", respond)

# Add edges
workflow.set_entry_point("classify")
workflow.add_edge("classify", "search")
workflow.add_edge("search", "respond")
workflow.add_edge("respond", END)

# Compile with checkpointing
memory = MemorySaver()
app = workflow.compile(checkpointer=memory)

# Run
result = app.invoke(
    {"messages": [{"role": "user", "content": "Help me"}]},
    config={"configurable": {"thread_id": "1"}}
)`
};

export const week12Lesson2 = {
    title: 'Advanced LangGraph Patterns',
    videoUrl: 'https://example.com/week12-lesson2',
    notes: `# Advanced LangGraph Patterns

## Cycles and Iteration

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  ITERATIVE WORKFLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │  DRAFT   │───▶│  REVIEW  │───▶│  REVISE  │             │
│  └──────────┘    └────┬─────┘    └────┬─────┘             │
│                       │                │                    │
│                       │  Score < 7     │                    │
│                       │                │                    │
│                       │                └────────┐           │
│                       │                         │           │
│                       │  Score >= 7             ▼           │
│                       │              ┌──────────────┐       │
│                       └─────────────▶│   FINALIZE   │       │
│                                      └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Conditional Routing

Route to different nodes based on state conditions.

## Parallel Execution

Execute multiple nodes simultaneously.

## Sub-Graphs

Nest graphs within graphs for modularity.`,
    codeSnippet: `# advanced_langgraph.py
from langgraph.graph import StateGraph, END

class ResearchState(TypedDict):
    draft: str
    review: dict
    iteration: int

workflow = StateGraph(ResearchState)

def draft(state):
    """Create draft."""
    return {"draft": "...", "iteration": state["iteration"] + 1}

def review(state):
    """Review draft."""
    score = 8  # Evaluate quality
    return {"review": {"score": score}}

def should_revise(state) -> str:
    """Decide if revision needed."""
    if state["review"]["score"] < 7:
        return "revise"
    return "finalize"

def revise(state):
    """Revise based on feedback."""
    return {"draft": "improved..."}

def finalize(state):
    """Finalize output."""
    return state

# Build graph with cycle
workflow.add_node("draft", draft)
workflow.add_node("review", review)
workflow.add_node("revise", revise)
workflow.add_node("finalize", finalize)

workflow.set_entry_point("draft")
workflow.add_edge("draft", "review")

# Conditional edge with cycle
workflow.add_conditional_edges(
    "review",
    should_revise,
    {
        "revise": "revise",
        "finalize": "finalize"
    }
)

# Cycle back
workflow.add_edge("revise", "review")
workflow.add_edge("finalize", END)

app = workflow.compile()`
};

export const week12Project = {
    title: 'Week 12 Project: Customer Support Agent',
    videoUrl: 'https://example.com/week12-project',
    notes: `# Week 12 Project: Customer Support Agent

## Project Overview

Build a stateful customer support agent using LangGraph with routing, memory, and escalation.

## Requirements

1. Classify customer inquiries
2. Route to appropriate handlers
3. Maintain conversation state
4. Escalate complex issues
5. Include feedback loop

## Features to Implement

- Intent classification
- Knowledge base search
- User data retrieval
- Ticket creation
- Human escalation
- Conversation memory

## Deliverables

- Complete LangGraph workflow
- Test cases for different scenarios
- State persistence implementation
- Documentation

## Evaluation Criteria

- Correct routing logic
- State management
- Error handling
- Code quality`,
    codeSnippet: `# project_support_agent.py
"""
Week 12 Project: Customer Support Agent

Build a stateful support agent with LangGraph.
"""

from typing import TypedDict
from langgraph.graph import StateGraph, END
from langgraph.checkpoint import MemorySaver

class SupportState(TypedDict):
    messages: list
    intent: str
    user_data: dict
    ticket_id: str
    escalated: bool

class CustomerSupportAgent:
    def __init__(self):
        self.graph = self._build_graph()
        self.memory = MemorySaver()
        self.app = self.graph.compile(
            checkpointer=self.memory
        )
    
    def _build_graph(self):
        """Build the support workflow."""
        workflow = StateGraph(SupportState)
        
        # TODO: Add nodes
        # - classify_intent
        # - fetch_user_data
        # - search_kb
        # - create_ticket
        # - escalate
        # - respond
        
        # TODO: Add edges and routing
        
        return workflow
    
    async def handle_inquiry(self, message: str, user_id: str):
        """Handle customer inquiry."""
        # TODO: Implement
        pass

# Test
if __name__ == "__main__":
    agent = CustomerSupportAgent()
    
    # Test cases
    test_cases = [
        "I can't log into my account",
        "How do I reset my password?",
        "I want a refund for my purchase",
        "The app keeps crashing"
    ]
    
    for case in test_cases:
        result = agent.handle_inquiry(case, "user123")
        print(f"Input: {case}")
        print(f"Output: {result}\\n")`
};

export const week12Quiz = {
    title: 'Week 12 Quiz: LangGraph Workflows',
    questions: [
        {
            id: 1,
            question: 'What is the main advantage of LangGraph over simple chains?',
            options: [
                'It is faster',
                'It supports cycles and complex state management',
                'It uses less memory',
                'It only works with Claude'
            ],
            correctAnswer: 1,
            explanation: 'LangGraph supports cycles, conditional routing, and persistent state, enabling complex workflows.'
        },
        {
            id: 2,
            question: 'What does checkpointing in LangGraph enable?',
            options: [
                'Faster execution',
                'Saving and resuming workflows',
                'Parallel processing',
                'Code execution'
            ],
            correctAnswer: 1,
            explanation: 'Checkpointing allows you to save workflow state and resume from where you left off.'
        },
        {
            id: 3,
            question: 'What is a conditional edge in LangGraph?',
            options: [
                'An edge that always executes',
                'An edge that routes based on state conditions',
                'An edge that runs in parallel',
                'An edge that never executes'
            ],
            correctAnswer: 1,
            explanation: 'Conditional edges route to different nodes based on the current state.'
        },
        {
            id: 4,
            question: 'When would you use a cycle in a LangGraph workflow?',
            options: [
                'Never, cycles are not allowed',
                'For iterative refinement or retry logic',
                'Only for error handling',
                'To make it run faster'
            ],
            correctAnswer: 1,
            explanation: 'Cycles enable iterative workflows like draft-review-revise loops.'
        },
        {
            id: 5,
            question: 'What is the purpose of StateGraph in LangGraph?',
            options: [
                'To execute code',
                'To define the workflow structure and state schema',
                'To store data permanently',
                'To handle errors'
            ],
            correctAnswer: 1,
            explanation: 'StateGraph defines the workflow structure, nodes, edges, and state schema.'
        }
    ]
};
