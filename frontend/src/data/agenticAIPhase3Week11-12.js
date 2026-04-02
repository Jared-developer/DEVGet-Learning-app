// Agentic AI Development - Phase 3 Weeks 11-12
// Multi-Agent Systems and Graph Workflows

// Week 11: Multi-Agent Systems with CrewAI & AutoGen
export const week11Lesson1 = {
    title: 'CrewAI Multi-Agent Collaboration',
    videoUrl: 'https://example.com/week11-lesson1',
    notes: `# CrewAI Multi-Agent Collaboration

## CrewAI Architecture

| Component | Purpose | Key Feature |
|-----------|---------|-------------|
| Agent | Individual role | Specialized expertise |
| Task | Work unit | Clear deliverable |
| Crew | Team | Coordinated execution |
| Process | Workflow | Sequential/Hierarchical |

## Multi-Agent Patterns

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│              CREWAI COLLABORATION PATTERNS                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  SEQUENTIAL PROCESS                                          │
│  ┌──────┐    ┌──────┐    ┌──────┐    ┌──────┐             │
│  │Agent1│───▶│Agent2│───▶│Agent3│───▶│Agent4│             │
│  └──────┘    └──────┘    └──────┘    └──────┘             │
│                                                              │
│  HIERARCHICAL PROCESS                                        │
│           ┌──────────┐                                       │
│           │ Manager  │                                       │
│           └────┬─────┘                                       │
│                │                                             │
│       ┌────────┼────────┐                                   │
│       ▼        ▼        ▼                                   │
│   ┌──────┐┌──────┐┌──────┐                                 │
│   │Agent1││Agent2││Agent3│                                 │
│   └──────┘└──────┘└──────┘                                 │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Agent Roles

- **Researcher**: Gathers information
- **Writer**: Creates content
- **Editor**: Reviews and refines
- **Critic**: Provides feedback
- **Manager**: Coordinates team`,
    codeSnippet: `# crewai_multiagent.py
from crewai import Agent, Task, Crew, Process
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-opus-20260217")

# Create specialized agents
researcher = Agent(
    role="Senior Research Analyst",
    goal="Find accurate information",
    backstory="Veteran researcher",
    llm=llm,
    verbose=True
)

writer = Agent(
    role="Content Writer",
    goal="Create engaging content",
    backstory="Award-winning writer",
    llm=llm
)

# Create tasks
research_task = Task(
    description="Research AI trends 2026",
    agent=researcher
)

writing_task = Task(
    description="Write blog post",
    agent=writer,
    context=[research_task]
)

# Create crew
crew = Crew(
    agents=[researcher, writer],
    tasks=[research_task, writing_task],
    process=Process.sequential
)

result = crew.kickoff()
print(result)`
};

export const week11Lesson2 = {
    title: 'Microsoft AutoGen Conversational Agents',
    videoUrl: 'https://example.com/week11-lesson2',
    notes: `# Microsoft AutoGen Conversational Agents

## AutoGen Features

- **Group Chat**: Multiple agents discuss
- **Code Execution**: Run Python safely
- **Human-in-Loop**: Optional human input
- **Nested Chats**: Sub-conversations

## Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  AUTOGEN GROUP CHAT                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│              ┌──────────────────┐                           │
│              │  GroupChatManager│                           │
│              └────────┬─────────┘                           │
│                       │                                     │
│         ┌─────────────┼─────────────┐                      │
│         │             │             │                      │
│         ▼             ▼             ▼                      │
│    ┌────────┐   ┌────────┐   ┌────────┐                  │
│    │Engineer│   │  QA    │   │DevOps  │                  │
│    └────────┘   └────────┘   └────────┘                  │
│         │             │             │                      │
│         └─────────────┼─────────────┘                      │
│                       ▼                                     │
│                 ┌──────────┐                               │
│                 │UserProxy │                               │
│                 │(Executor)│                               │
│                 └──────────┘                               │
└─────────────────────────────────────────────────────────────┘
\`\`\``,

    codeSnippet: `# autogen_multiagent.py
import autogen

config_list = [{
    "model": "claude-3-opus-20260217",
    "api_key": "your-key",
    "api_type": "anthropic"
}]

# Create agents
engineer = autogen.AssistantAgent(
    name="Engineer",
    system_message="Senior software engineer",
    llm_config={"config_list": config_list}
)

qa = autogen.AssistantAgent(
    name="QA",
    system_message="Quality assurance engineer",
    llm_config={"config_list": config_list}
)

user_proxy = autogen.UserProxyAgent(
    name="UserProxy",
    human_input_mode="NEVER",
    code_execution_config={"executor": "local"}
)

# Create group chat
groupchat = autogen.GroupChat(
    agents=[user_proxy, engineer, qa],
    messages=[],
    max_round=10
)

manager = autogen.GroupChatManager(
    groupchat=groupchat,
    llm_config={"config_list": config_list}
)

# Start collaboration
user_proxy.initiate_chat(
    manager,
    message="Build a rate limiter with tests"
)`
};

export const week11Project = {
    title: 'Week 11 Project: Multi-Agent System',
    videoUrl: 'https://example.com/week11-project',
    notes: `# Week 11 Project: Multi-Agent System

## Build a Content Creation Team

Create a multi-agent system with:
- Researcher agent
- Writer agent  
- Editor agent
- Critic agent

## Requirements

1. Use CrewAI or AutoGen
2. Implement sequential workflow
3. Add task dependencies
4. Include quality checks

## Deliverables

- Working multi-agent system
- Test with 3 different topics
- Performance metrics
- Documentation`,
    codeSnippet: `# project_multiagent.py
from crewai import Agent, Task, Crew, Process

class ContentTeam:
    def __init__(self):
        # TODO: Create agents
        self.researcher = None
        self.writer = None
        self.editor = None
    
    def create_content(self, topic: str):
        # TODO: Create tasks
        # TODO: Build crew
        # TODO: Execute
        pass

# Test
team = ContentTeam()
result = team.create_content("AI in Healthcare")`
};

export const week11Quiz = {
    title: 'Week 11 Quiz: Multi-Agent Systems',
    questions: [
        {
            id: 1,
            question: 'What is the main advantage of CrewAI hierarchical process?',
            options: [
                'Faster execution',
                'Manager coordinates and delegates',
                'Uses less memory',
                'Requires fewer agents'
            ],
            correctAnswer: 1,
            explanation: 'Hierarchical process has a manager agent that coordinates and delegates tasks to specialist agents.'
        },
        {
            id: 2,
            question: 'What does AutoGen UserProxy do?',
            options: [
                'Manages the group chat',
                'Executes code and represents user',
                'Writes documentation',
                'Deploys the application'
            ],
            correctAnswer: 1,
            explanation: 'UserProxy executes code and can represent the user in the conversation.'
        },
        {
            id: 3,
            question: 'When should you use sequential vs hierarchical process?',
            options: [
                'Always use sequential',
                'Sequential for linear workflows, hierarchical for complex coordination',
                'Always use hierarchical',
                'They are the same'
            ],
            correctAnswer: 1,
            explanation: 'Sequential works for linear workflows, while hierarchical is better when complex coordination is needed.'
        }
    ]
};

// Week 12: Graph-Based Workflows with LangGraph
export const week12Lesson1 = {
    title: 'LangGraph Stateful Workflows',
    videoUrl: 'https://example.com/week12-lesson1',
    notes: `# LangGraph Stateful Workflows

## LangGraph Key Concepts

| Concept | Purpose | Example |
|---------|---------|---------|
| State | Shared data | Messages, context |
| Node | Processing step | Agent action |
| Edge | Transition | Next step |
| Conditional Edge | Branching | Route based on state |

## Graph Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  LANGGRAPH WORKFLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│                    ┌──────────┐                             │
│                    │  START   │                             │
│                    └────┬─────┘                             │
│                         │                                   │
│                         ▼                                   │
│                  ┌──────────────┐                           │
│                  │  Classify    │                           │
│                  │   Intent     │                           │
│                  └──────┬───────┘                           │
│                         │                                   │
│              ┌──────────┼──────────┐                        │
│              │          │          │                        │
│              ▼          ▼          ▼                        │
│         ┌────────┐ ┌────────┐ ┌────────┐                  │
│         │Fetch   │ │Search  │ │Escalate│                  │
│         │Context │ │Solution│ │Human   │                  │
│         └───┬────┘ └───┬────┘ └───┬────┘                  │
│             │          │          │                        │
│             └──────────┼──────────┘                        │
│                        ▼                                    │
│                  ┌──────────┐                              │
│                  │ Generate │                              │
│                  │ Response │                              │
│                  └────┬─────┘                              │
│                       │                                    │
│                       ▼                                    │
│                   ┌──────┐                                │
│                   │ END  │                                │
│                   └──────┘                                │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Features

- **Cycles**: Loops for iterative refinement
- **Persistence**: Save/restore state
- **Branching**: Conditional routing
- **Checkpoints**: Resume from any point`,

    codeSnippet: `# langgraph_workflow.py
from typing import TypedDict
from langgraph.graph import StateGraph, END
from langchain_anthropic import ChatAnthropic

# Define state
class AgentState(TypedDict):
    messages: list
    next_step: str
    context: dict

llm = ChatAnthropic(model="claude-3-opus-20260217")

# Define nodes
def classify_intent(state):
    # Classify user intent
    return {"next_step": "search"}

def search_solution(state):
    # Search for solution
    return {"context": {"solution": "..."}}

def generate_response(state):
    # Generate final response
    return {"messages": [...]}

# Build graph
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("classify", classify_intent)
workflow.add_node("search", search_solution)
workflow.add_node("generate", generate_response)

# Add edges
workflow.set_entry_point("classify")
workflow.add_edge("classify", "search")
workflow.add_edge("search", "generate")
workflow.add_edge("generate", END)

# Compile
app = workflow.compile()

# Run
result = app.invoke({
    "messages": [{"role": "user", "content": "Help"}],
    "next_step": "",
    "context": {}
})`
};

export const week12Lesson2 = {
    title: 'Advanced Graph Patterns with Cycles',
    videoUrl: 'https://example.com/week12-lesson2',
    notes: `# Advanced Graph Patterns with Cycles

## Iterative Refinement Pattern

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│              ITERATIVE REFINEMENT GRAPH                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐           │
│    │  Draft   │───▶│  Review  │───▶│ Evaluate │           │
│    └──────────┘    └──────────┘    └────┬─────┘           │
│         ▲                                │                  │
│         │                                │                  │
│         │          ┌──────────┐          │                  │
│         └──────────│  Revise  │◀─────────┘                  │
│                    └──────────┘                             │
│                         │                                   │
│                         ▼                                   │
│                    ┌──────────┐                             │
│                    │ Finalize │                             │
│                    └──────────┘                             │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Use Cases

- **Customer Support**: Route → Fetch → Respond
- **Research**: Plan → Research → Analyze → Write → Review (cycle)
- **Code Generation**: Generate → Test → Fix (cycle) → Deploy
- **Content Creation**: Draft → Review → Revise (cycle) → Publish

## Conditional Routing

Route based on state:
- Quality score
- User intent
- Error conditions
- Iteration count`,
    codeSnippet: `# advanced_graph.py
from langgraph.graph import StateGraph, END

class ResearchState(TypedDict):
    topic: str
    draft: str
    score: float
    iteration: int

def draft_report(state):
    # Create draft
    return {"draft": "...", "iteration": state["iteration"] + 1}

def review_draft(state):
    # Review and score
    return {"score": 8.5}

def should_revise(state):
    # Conditional routing
    if state["score"] < 7.0:
        return "revise"
    return "finalize"

def revise_report(state):
    # Improve draft
    return {"draft": "improved..."}

def finalize(state):
    return {"draft": "final"}

# Build graph with cycle
workflow = StateGraph(ResearchState)
workflow.add_node("draft", draft_report)
workflow.add_node("review", review_draft)
workflow.add_node("revise", revise_report)
workflow.add_node("finalize", finalize)

workflow.set_entry_point("draft")
workflow.add_edge("draft", "review")

# Conditional edge
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
    title: 'Week 12 Project: Graph-Based Agent System',
    videoUrl: 'https://example.com/week12-project',
    notes: `# Week 12 Project: Graph-Based Agent System

## Build a Customer Support System

Create a LangGraph-based support system with:
- Intent classification
- Context fetching
- Solution search
- Response generation
- Escalation handling

## Requirements

1. Use LangGraph StateGraph
2. Implement conditional routing
3. Add state persistence
4. Include error handling
5. Support multiple intents

## Deliverables

- Working graph-based system
- State management
- Test cases for each path
- Performance metrics
- Documentation

## Bonus

- Add iterative refinement cycle
- Implement human-in-the-loop
- Add conversation memory`,
    codeSnippet: `# project_graph_agent.py
from langgraph.graph import StateGraph, END
from typing import TypedDict

class SupportState(TypedDict):
    messages: list
    intent: str
    context: dict
    solution: str

class SupportGraph:
    def __init__(self):
        self.graph = self._build_graph()
        self.app = self.graph.compile()
    
    def _build_graph(self):
        workflow = StateGraph(SupportState)
        
        # TODO: Add nodes
        # workflow.add_node("classify", self.classify)
        # workflow.add_node("fetch", self.fetch_context)
        # workflow.add_node("search", self.search_solution)
        # workflow.add_node("generate", self.generate_response)
        
        # TODO: Add edges and conditional routing
        
        return workflow
    
    def classify(self, state):
        # TODO: Implement
        pass
    
    def process(self, user_input: str):
        # TODO: Run graph
        pass

# Test
support = SupportGraph()
result = support.process("I can't login")`
};

export const week12Quiz = {
    title: 'Week 12 Quiz: Graph Workflows',
    questions: [
        {
            id: 1,
            question: 'What is the main advantage of LangGraph over simple chains?',
            options: [
                'Faster execution',
                'Supports cycles and complex state management',
                'Uses less memory',
                'Easier to write'
            ],
            correctAnswer: 1,
            explanation: 'LangGraph supports cycles, conditional branching, and complex state management unlike simple chains.'
        },
        {
            id: 2,
            question: 'What does a conditional edge do?',
            options: [
                'Always goes to the same node',
                'Routes based on state conditions',
                'Ends the graph',
                'Starts a new graph'
            ],
            correctAnswer: 1,
            explanation: 'Conditional edges route to different nodes based on the current state.'
        },
        {
            id: 3,
            question: 'When should you use cycles in a graph?',
            options: [
                'Never',
                'For iterative refinement and self-correction',
                'Always',
                'Only for errors'
            ],
            correctAnswer: 1,
            explanation: 'Cycles are useful for iterative refinement, allowing the agent to improve its output through multiple passes.'
        },
        {
            id: 4,
            question: 'What is state persistence in LangGraph?',
            options: [
                'Saving memory',
                'Ability to save and resume workflow state',
                'Faster execution',
                'Error handling'
            ],
            correctAnswer: 1,
            explanation: 'State persistence allows saving the workflow state and resuming from any checkpoint.'
        }
    ]
};
