// Agentic AI Development - Phase 4 Weeks 13-14
// Production, Evaluation, and Deployment

// Week 13: Agent Evaluation & Observability
export const week13Lesson1 = {
    title: 'The Challenge of Evaluating Agents',
    videoUrl: 'https://example.com/week13-lesson1',
    notes: `# The Challenge of Evaluating Agents

## Agent Evaluation Dimensions

| Dimension | Metrics | Tools |
|-----------|---------|-------|
| Task Success | Goal completion, success rate | LangSmith, custom |
| Reasoning Quality | Logic correctness, plan efficiency | LLM-as-Judge |
| Cost Efficiency | Token usage, API calls | LangSmith, Helicone |
| Latency | First token, total duration | Prometheus |
| Grounding | Source citation, factuality | RAGAs, custom |
| Safety | Harmful outputs, prompt injection | Guardrails AI |
| User Experience | Satisfaction, clarity | User feedback |

## Evaluation Framework

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│              COMPREHENSIVE AGENT EVALUATION                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   OFFLINE    │    │   ONLINE     │    │  CONTINUOUS  │  │
│  │  EVALUATION  │    │  EVALUATION  │    │  MONITORING  │  │
│  │              │    │              │    │              │  │
│  │ • Test suite │    │ • A/B tests  │    │ • Metrics    │  │
│  │ • Benchmarks │    │ • User votes │    │ • Alerts     │  │
│  │ • LLM judge  │    │ • Analytics  │    │ • Dashboards │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Challenges

- **Non-determinism**: Same input → different outputs
- **Multi-step**: Hard to attribute success/failure
- **Tool usage**: External dependencies
- **Context-dependent**: Performance varies by domain`,
    codeSnippet: `# langsmith_evaluation.py
from langsmith import Client, traceable
from langsmith.evaluation import evaluate
from langchain_anthropic import ChatAnthropic

client = Client()

@traceable(name="agent_executor")
async def run_agent(input_query: str):
    """Execute agent with automatic tracing."""
    llm = ChatAnthropic(model="claude-3-opus-20260217")
    
    # Agent execution
    result = await llm.ainvoke([
        {"role": "user", "content": input_query}
    ])
    
    return {
        "input": input_query,
        "output": result.content
    }

# Create evaluation dataset
dataset = client.create_dataset(
    "agent_test_cases",
    description="Test cases for evaluation"
)

# Add test cases
test_cases = [
    {
        "input": "What's the weather in Tokyo?",
        "expected_tools": ["weather_api"]
    }
]

for case in test_cases:
    client.create_example(
        inputs={"question": case["input"]},
        outputs={"expected": case},
        dataset_id=dataset.id
    )

# Run evaluation
experiment = evaluate(
    target_function=run_agent,
    data=dataset.name,
    experiment_prefix="agent-v1"
)`
};

export const week13Lesson2 = {
    title: 'LangSmith & Observability Tools',
    videoUrl: 'https://example.com/week13-lesson2',
    notes: `# LangSmith & Observability Tools

## Observability Tools Comparison (2026)

| Tool | Primary Use | Key Features | Pricing |
|------|-------------|--------------|---------|
| LangSmith | Full observability | Traces, evaluations, datasets | Free tier, $0.03/1K traces |
| Helicone | API observability | OpenAI proxy, caching | Free tier, $0.01/1K requests |
| Arize AI | ML observability | Drift detection, explainability | Custom enterprise |
| Weights & Biases | Experiment tracking | Visualizations, sweeps | Free tier, team plans |
| Phoenix | LLM observability | Open-source, tracing | Free |

## LangSmith Features

- **Tracing**: Automatic trace capture
- **Datasets**: Test case management
- **Evaluators**: Custom and built-in
- **Monitoring**: Real-time dashboards
- **Debugging**: Step-by-step inspection

## Tracing Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    LANGSMITH TRACING                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Your App ──▶ LangSmith SDK ──▶ LangSmith Cloud            │
│                                                              │
│  Captures:                                                   │
│  • Input/Output                                             │
│  • Latency                                                  │
│  • Token usage                                              │
│  • Tool calls                                               │
│  • Errors                                                   │
└─────────────────────────────────────────────────────────────┘
\`\`\``,
    codeSnippet: `# langsmith_observability.py
import os
from langsmith import Client
from langchain_anthropic import ChatAnthropic
from langchain.callbacks.tracers import LangChainTracer

# Setup LangSmith
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_API_KEY"] = "your-key"
os.environ["LANGCHAIN_PROJECT"] = "agent-production"

client = Client()

# Automatic tracing
llm = ChatAnthropic(
    model="claude-3-opus-20260217",
    callbacks=[LangChainTracer()]
)

# All calls are automatically traced
response = llm.invoke("Explain quantum computing")

# Custom evaluators
def correctness_evaluator(run, example):
    """Custom evaluator for correctness."""
    score = 0.0
    
    # Check if output contains key terms
    if "quantum" in run.outputs["output"].lower():
        score += 0.5
    
    return {"score": score}

# Register evaluator
client.create_evaluator(
    name="correctness",
    evaluator_type="custom",
    evaluator=correctness_evaluator
)`
};


export const week13Quiz = {
    title: 'Week 13 Quiz: Evaluation & Observability',
    questions: [
        {
            id: 1,
            question: 'What is the main challenge in evaluating agents?',
            options: [
                'They are too slow',
                'Non-deterministic outputs and multi-step reasoning',
                'They use too many tokens',
                'They are too expensive'
            ],
            correctAnswer: 1,
            explanation: 'Agents produce non-deterministic outputs and involve multi-step reasoning, making evaluation complex.'
        },
        {
            id: 2,
            question: 'What does LangSmith provide for agent development?',
            options: [
                'Only code generation',
                'Tracing, evaluation, and monitoring',
                'Just API keys',
                'Only documentation'
            ],
            correctAnswer: 1,
            explanation: 'LangSmith provides comprehensive tracing, evaluation datasets, and monitoring for agent systems.'
        },
        {
            id: 3,
            question: 'What is "LLM-as-Judge" evaluation?',
            options: [
                'Using humans to judge',
                'Using an LLM to evaluate agent outputs',
                'Automated unit tests',
                'Performance benchmarks'
            ],
            correctAnswer: 1,
            explanation: 'LLM-as-Judge uses another LLM to evaluate the quality and correctness of agent outputs.'
        },
        {
            id: 4,
            question: 'Why is observability important for production agents?',
            options: [
                'It makes them faster',
                'To debug issues, monitor performance, and improve quality',
                'It reduces costs',
                'It is not important'
            ],
            correctAnswer: 1,
            explanation: 'Observability enables debugging, performance monitoring, and continuous improvement of agent systems.'
        }
    ]
};

// Week 14: Production Deployment & Security
export const week14Lesson1 = {
    title: 'Deploying Agents to Production',
    videoUrl: 'https://example.com/week14-lesson1',
    notes: `# Deploying Agents to Production

## Deployment Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│              PRODUCTION AGENT ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐             │
│  │  Client  │───▶│   API    │───▶│  Agent   │             │
│  │  (Web)   │    │ Gateway  │    │  Service │             │
│  └──────────┘    └──────────┘    └─────┬────┘             │
│                         │                │                  │
│                         ▼                ▼                  │
│                  ┌──────────┐    ┌──────────┐             │
│                  │  Cache   │    │  Vector  │             │
│                  │  (Redis) │    │   DB     │             │
│                  └──────────┘    └──────────┘             │
│                                                             │
│                         ▼                                   │
│                  ┌──────────┐                              │
│                  │   LLM    │                              │
│                  │   API    │                              │
│                  └──────────┘                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Deployment Options

| Platform | Pros | Cons | Best For |
|----------|------|------|----------|
| AWS Lambda | Serverless, auto-scale | Cold starts | Sporadic usage |
| AWS ECS/Fargate | Container-based, flexible | More complex | Steady traffic |
| Kubernetes | Full control, portable | High complexity | Large scale |
| Modal | AI-optimized, simple | Vendor lock-in | ML workloads |
| Railway/Render | Easy deployment | Limited control | Prototypes |

## Key Considerations

1. **Latency**: Streaming responses, caching
2. **Cost**: Token usage, API calls
3. **Scalability**: Load balancing, queuing
4. **Reliability**: Error handling, retries
5. **Security**: API keys, rate limiting`,
    codeSnippet: `# production_agent_api.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from pydantic_ai import Agent
import redis
import asyncio
from typing import Optional

app = FastAPI(title="Production Agent API")

# Redis for caching
redis_client = redis.Redis(
    host='localhost',
    port=6379,
    decode_responses=True
)

# Agent instance
agent = Agent(
    "claude-3-opus-20260217",
    system_prompt="You are a helpful assistant"
)

class QueryRequest(BaseModel):
    query: str
    user_id: str
    session_id: Optional[str] = None

class QueryResponse(BaseModel):
    response: str
    session_id: str
    tokens_used: int

@app.post("/query", response_model=QueryResponse)
async def query_agent(
    request: QueryRequest,
    background_tasks: BackgroundTasks
):
    """Process agent query with caching."""
    
    # Check cache
    cache_key = f"query:{request.query}"
    cached = redis_client.get(cache_key)
    
    if cached:
        return QueryResponse(
            response=cached,
            session_id=request.session_id or "cached",
            tokens_used=0
        )
    
    try:
        # Run agent
        result = await agent.run(request.query)
        
        # Cache result (5 min TTL)
        redis_client.setex(
            cache_key,
            300,
            result.data
        )
        
        # Log async
        background_tasks.add_task(
            log_query,
            request.user_id,
            request.query,
            result.data
        )
        
        return QueryResponse(
            response=result.data,
            session_id=request.session_id or "new",
            tokens_used=result.usage().total_tokens
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

async def log_query(user_id, query, response):
    """Log query for analytics."""
    # Implement logging
    pass

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

# Run with: uvicorn production_agent_api:app --reload`
};

export const week14Lesson2 = {
    title: 'Security & Safety for Production Agents',
    videoUrl: 'https://example.com/week14-lesson2',
    notes: `# Security & Safety for Production Agents

## Security Threats

| Threat | Description | Mitigation |
|--------|-------------|------------|
| Prompt Injection | Malicious prompts override instructions | Input validation, guardrails |
| Data Leakage | Exposing sensitive information | Output filtering, PII detection |
| Jailbreaking | Bypassing safety constraints | Constitutional AI, monitoring |
| Tool Misuse | Unauthorized tool access | Permission system, sandboxing |
| DoS Attacks | Resource exhaustion | Rate limiting, quotas |

## Defense Layers

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                  SECURITY DEFENSE LAYERS                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Input Validation                                   │
│  ┌────────────────────────────────────────────────┐         │
│  │ • Sanitize inputs                              │         │
│  │ • Detect injection attempts                    │         │
│  │ • Rate limiting                                │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Layer 2: Guardrails                                         │
│  ┌────────────────────────────────────────────────┐         │
│  │ • Content filtering                            │         │
│  │ • Topic restrictions                           │         │
│  │ • Toxicity detection                           │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Layer 3: Output Validation                                  │
│  ┌────────────────────────────────────────────────┐         │
│  │ • PII detection                                │         │
│  │ • Fact checking                                │         │
│  │ • Safety scoring                               │         │
│  └────────────────────────────────────────────────┘         │
│                                                              │
│  Layer 4: Monitoring                                         │
│  ┌────────────────────────────────────────────────┐         │
│  │ • Anomaly detection                            │         │
│  │ • Audit logging                                │         │
│  │ • Alert system                                 │         │
│  └────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Best Practices

1. **Principle of Least Privilege**: Minimal tool access
2. **Defense in Depth**: Multiple security layers
3. **Fail Secure**: Safe defaults on errors
4. **Audit Everything**: Comprehensive logging
5. **Regular Updates**: Keep dependencies current`,
    codeSnippet: `# security_guardrails.py
from guardrails import Guard
from guardrails.validators import (
    ToxicLanguage,
    PIIDetector,
    RestrictToTopic
)
from pydantic_ai import Agent
import re

class SecureAgent:
    def __init__(self):
        self.agent = Agent("claude-3-opus-20260217")
        
        # Setup guardrails
        self.guard = Guard.from_string(
            validators=[
                ToxicLanguage(threshold=0.5, on_fail="exception"),
                PIIDetector(pii_entities=["EMAIL", "PHONE"], on_fail="filter"),
                RestrictToTopic(valid_topics=["technology", "science"])
            ]
        )
    
    def sanitize_input(self, user_input: str) -> str:
        """Sanitize user input."""
        # Remove potential injection patterns
        sanitized = re.sub(r'(ignore|disregard).*previous', '', user_input, flags=re.IGNORECASE)
        
        # Limit length
        return sanitized[:1000]
    
    def detect_pii(self, text: str) -> bool:
        """Detect PII in output."""
        patterns = [
            r'\b\d{3}-\d{2}-\d{4}\b',  # SSN
            r'\b\d{16}\b',  # Credit card
            r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'  # Email
        ]
        
        for pattern in patterns:
            if re.search(pattern, text):
                return True
        return False
    
    async def run_secure(self, user_input: str) -> str:
        """Run agent with security checks."""
        
        # 1. Sanitize input
        clean_input = self.sanitize_input(user_input)
        
        # 2. Validate with guardrails
        try:
            validated = self.guard.validate(clean_input)
        except Exception as e:
            return "Input rejected by security filters"
        
        # 3. Run agent
        result = await self.agent.run(validated)
        
        # 4. Check output for PII
        if self.detect_pii(result.data):
            return "Response contained sensitive information and was filtered"
        
        # 5. Final guardrail check
        try:
            final = self.guard.validate(result.data)
            return final
        except:
            return "Response rejected by safety filters"

# Usage
secure_agent = SecureAgent()
response = await secure_agent.run_secure("User query here")`
};

export const week14Project = {
    title: 'Week 14 Project: Deploy Production Agent',
    videoUrl: 'https://example.com/week14-project',
    notes: `# Week 14 Project: Deploy Production Agent

## Project Goal

Deploy a production-ready agent system with proper security, monitoring, and scalability.

## Requirements

1. **API Service**
   - FastAPI or Flask
   - RESTful endpoints
   - Authentication (JWT)
   - Rate limiting

2. **Security**
   - Input validation
   - Output filtering
   - Guardrails implementation
   - API key management

3. **Caching**
   - Redis for response caching
   - Cache invalidation strategy
   - TTL configuration

4. **Monitoring**
   - LangSmith integration
   - Metrics collection
   - Error tracking
   - Performance dashboards

5. **Deployment**
   - Docker containerization
   - Cloud deployment (AWS/GCP/Azure)
   - CI/CD pipeline
   - Health checks

## Deliverables

1. **Source Code**
   - API implementation
   - Security middleware
   - Deployment configs
   - Tests (80%+ coverage)

2. **Documentation**
   - API documentation (OpenAPI/Swagger)
   - Deployment guide
   - Security considerations
   - Monitoring setup

3. **Deployment**
   - Live deployed instance
   - Public API endpoint
   - Monitoring dashboard
   - Load test results

4. **Presentation**
   - Architecture overview
   - Security measures
   - Performance metrics
   - Lessons learned

## Evaluation Criteria

- Functionality: 25%
- Security: 25%
- Performance: 20%
- Documentation: 15%
- Deployment: 15%`,
    codeSnippet: `# project_deployment_template.py
"""
Week 14 Project: Production Agent Deployment

Deploy a secure, scalable agent API with monitoring.
"""

from fastapi import FastAPI, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis
from prometheus_client import Counter, Histogram
import time

app = FastAPI(
    title="Production Agent API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Metrics
request_count = Counter('agent_requests_total', 'Total requests')
request_duration = Histogram('agent_request_duration_seconds', 'Request duration')

# Security
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify JWT token."""
    # TODO: Implement JWT verification
    if credentials.credentials != "valid-token":
        raise HTTPException(status_code=401, detail="Invalid token")
    return credentials.credentials

class AgentRequest(BaseModel):
    query: str
    max_tokens: int = 1000

class AgentResponse(BaseModel):
    response: str
    tokens_used: int
    cached: bool

@app.post("/agent/query", response_model=AgentResponse)
async def query_agent(
    request: AgentRequest,
    token: str = Depends(verify_token)
):
    """
    Query the agent with security and caching.
    
    TODO:
    1. Implement rate limiting
    2. Add input validation
    3. Integrate caching
    4. Add monitoring
    5. Implement agent logic
    """
    start_time = time.time()
    request_count.inc()
    
    try:
        # Your implementation here
        response = "Agent response"
        
        duration = time.time() - start_time
        request_duration.observe(duration)
        
        return AgentResponse(
            response=response,
            tokens_used=100,
            cached=False
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}

# Run: uvicorn project_deployment_template:app --reload`
};

export const week14Quiz = {
    title: 'Week 14 Quiz: Production & Security',
    questions: [
        {
            id: 1,
            question: 'What is the main purpose of caching in production agents?',
            options: [
                'To make code cleaner',
                'To reduce latency and API costs',
                'To improve security',
                'To add more features'
            ],
            correctAnswer: 1,
            explanation: 'Caching reduces latency by serving repeated queries faster and reduces API costs by avoiding redundant LLM calls.'
        },
        {
            id: 2,
            question: 'What is prompt injection?',
            options: [
                'Adding prompts to code',
                'Malicious inputs that override agent instructions',
                'A deployment technique',
                'A caching strategy'
            ],
            correctAnswer: 1,
            explanation: 'Prompt injection is when malicious inputs attempt to override or bypass the agent\'s original instructions.'
        },
        {
            id: 3,
            question: 'Why is rate limiting important for production APIs?',
            options: [
                'To make the API slower',
                'To prevent abuse and manage costs',
                'To improve accuracy',
                'To add complexity'
            ],
            correctAnswer: 1,
            explanation: 'Rate limiting prevents abuse, protects against DoS attacks, and helps manage API costs.'
        },
        {
            id: 4,
            question: 'What should you do if an agent output contains PII?',
            options: [
                'Return it anyway',
                'Filter or redact the sensitive information',
                'Ignore it',
                'Log it publicly'
            ],
            correctAnswer: 1,
            explanation: 'PII should be filtered or redacted from outputs to protect user privacy and comply with regulations.'
        },
        {
            id: 5,
            question: 'What is the principle of least privilege?',
            options: [
                'Give maximum access to all tools',
                'Grant only the minimum necessary permissions',
                'Remove all security',
                'Use the cheapest model'
            ],
            correctAnswer: 1,
            explanation: 'Least privilege means granting only the minimum permissions necessary for the agent to function, reducing security risks.'
        }
    ]
};
