// Agentic AI Development - Phase 5 Weeks 15-16
// Industry Applications & Capstone Project

// Week 15: Industry Applications & Real-World Use Cases
export const week15Lesson1 = {
    title: 'Agents in Enterprise: BFSI & Healthcare',
    videoUrl: 'https://example.com/week15-lesson1',
    notes: `# Agents in Enterprise: BFSI & Healthcare

## Banking, Financial Services & Insurance (BFSI)

| Use Case | Agent Type | Value |
|----------|------------|-------|
| Customer Support | Multi-agent | 24/7 support, reduced costs |
| Fraud Detection | Reasoning agent | Real-time analysis |
| Document Processing | RAG agent | Automated underwriting |
| Compliance | Tool-enabled | Regulatory monitoring |
| Investment Research | Research agent | Market analysis |

## Healthcare Applications

| Use Case | Agent Type | Value |
|----------|------------|-------|
| Clinical Documentation | Summarization | Reduced admin time |
| Diagnosis Support | Reasoning + RAG | Improved accuracy |
| Patient Triage | Classification | Faster care |
| Drug Discovery | Research agent | Accelerated R&D |
| Insurance Claims | Document agent | Automated processing |

## Architecture Example: Banking Support Agent

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│              BANKING SUPPORT AGENT SYSTEM                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Customer Query                                              │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────┐                                           │
│  │  Classifier  │                                           │
│  │    Agent     │                                           │
│  └──────┬───────┘                                           │
│         │                                                    │
│    ┌────┼────┬────────┬────────┐                           │
│    ▼    ▼    ▼        ▼        ▼                           │
│  ┌───┐┌───┐┌────┐  ┌────┐  ┌────┐                         │
│  │Acc││Txn││Loan│  │Card│  │Esc │                         │
│  │nt ││   ││    │  │    │  │ale │                         │
│  └───┘└───┘└────┘  └────┘  └────┘                         │
│    │    │    │        │        │                           │
│    └────┴────┴────────┴────────┘                           │
│              │                                              │
│              ▼                                              │
│        ┌──────────┐                                         │
│        │Synthesizer│                                        │
│        └──────────┘                                         │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Key Considerations

**Compliance & Regulations**
- GDPR, HIPAA, SOC 2
- Data residency requirements
- Audit trails
- Explainability

**Security**
- PHI/PII protection
- Access controls
- Encryption at rest/transit
- Regular audits

**Accuracy Requirements**
- High stakes decisions
- Human-in-the-loop
- Confidence thresholds
- Fallback mechanisms`,
    codeSnippet: `# banking_support_agent.py
from pydantic_ai import Agent
from typing import Literal
from pydantic import BaseModel

class BankingQuery(BaseModel):
    query: str
    customer_id: str
    category: Literal["account", "transaction", "loan", "card", "other"]

class BankingSupportSystem:
    def __init__(self):
        # Classifier agent
        self.classifier = Agent(
            "claude-3-sonnet-20260317",
            system_prompt="Classify banking queries into categories"
        )
        
        # Specialist agents
        self.account_agent = Agent(
            "claude-3-opus-20260217",
            system_prompt="""You are an account specialist.
            Help with balance inquiries, account settings, statements."""
        )
        
        self.transaction_agent = Agent(
            "claude-3-opus-20260217",
            system_prompt="""You are a transaction specialist.
            Help with payment issues, transfers, transaction history."""
        )
        
        self.loan_agent = Agent(
            "claude-3-opus-20260217",
            system_prompt="""You are a loan specialist.
            Help with loan applications, payments, refinancing."""
        )
    
    async def classify_query(self, query: str) -> str:
        """Classify the customer query."""
        result = await self.classifier.run(
            f"Classify this banking query: {query}\\n"
            f"Categories: account, transaction, loan, card, other"
        )
        return result.data.lower()
    
    async def route_to_specialist(
        self,
        category: str,
        query: str,
        customer_id: str
    ) -> str:
        """Route to appropriate specialist agent."""
        
        # Get customer context (simplified)
        context = f"Customer ID: {customer_id}"
        
        if category == "account":
            agent = self.account_agent
        elif category == "transaction":
            agent = self.transaction_agent
        elif category == "loan":
            agent = self.loan_agent
        else:
            # Escalate to human
            return "Escalating to human agent..."
        
        result = await agent.run(
            f"Context: {context}\\n"
            f"Query: {query}"
        )
        
        return result.data
    
    async def process_query(self, query: BankingQuery) -> str:
        """Main entry point."""
        
        # 1. Classify
        category = await self.classify_query(query.query)
        
        # 2. Route to specialist
        response = await self.route_to_specialist(
            category,
            query.query,
            query.customer_id
        )
        
        # 3. Log for compliance
        self.log_interaction(query, response)
        
        return response
    
    def log_interaction(self, query, response):
        """Log for audit trail."""
        # Implement compliance logging
        pass

# Usage
system = BankingSupportSystem()
response = await system.process_query(
    BankingQuery(
        query="What's my account balance?",
        customer_id="CUST123",
        category="account"
    )
)`
};

export const week15Lesson2 = {
    title: 'E-commerce, Customer Service & Content Creation',
    videoUrl: 'https://example.com/week15-lesson2',
    notes: `# E-commerce, Customer Service & Content Creation

## E-commerce Applications

| Use Case | Implementation | Impact |
|----------|----------------|--------|
| Product Recommendations | RAG + personalization | +25% conversion |
| Customer Support | Multi-agent chatbot | -40% support costs |
| Inventory Management | Predictive agent | -30% stockouts |
| Dynamic Pricing | Reasoning agent | +15% revenue |
| Content Generation | Creative agent | 10x faster |

## Customer Service Automation

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│           CUSTOMER SERVICE AGENT WORKFLOW                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Customer Message                                            │
│       │                                                      │
│       ▼                                                      │
│  ┌──────────────┐                                           │
│  │   Intent     │                                           │
│  │ Detection    │                                           │
│  └──────┬───────┘                                           │
│         │                                                    │
│    ┌────┴────┐                                              │
│    ▼         ▼                                              │
│  Simple   Complex                                           │
│    │         │                                              │
│    ▼         ▼                                              │
│  ┌───┐   ┌──────┐                                          │
│  │FAQ│   │Agent │                                          │
│  │Bot│   │System│                                          │
│  └─┬─┘   └───┬──┘                                          │
│    │         │                                              │
│    │    ┌────┴────┐                                        │
│    │    ▼         ▼                                        │
│    │  Solved   Escalate                                    │
│    │    │         │                                        │
│    └────┴─────────┘                                        │
│          │                                                  │
│          ▼                                                  │
│     Response + CSAT                                         │
└─────────────────────────────────────────────────────────────┘
\`\`\`

## Content Creation Agents

**Blog Post Generation**
- Research → Outline → Draft → Edit → Publish

**Social Media Management**
- Trend analysis → Content ideas → Post creation → Scheduling

**Product Descriptions**
- Features extraction → Benefit highlighting → SEO optimization

## Success Metrics

- **Resolution Rate**: % solved without human
- **CSAT**: Customer satisfaction score
- **AHT**: Average handling time
- **FCR**: First contact resolution
- **Cost per interaction**`,
    codeSnippet: `# ecommerce_agent.py
from pydantic_ai import Agent
from typing import List, Dict

class EcommerceAgent:
    def __init__(self):
        self.support_agent = Agent(
            "claude-3-opus-20260217",
            system_prompt="""You are an e-commerce support agent.
            Help customers with orders, returns, products."""
        )
        
        self.product_agent = Agent(
            "claude-3-sonnet-20260317",
            system_prompt="""You recommend products based on needs.
            Use customer preferences and purchase history."""
        )
    
    async def handle_support(
        self,
        query: str,
        order_id: str = None
    ) -> Dict:
        """Handle customer support query."""
        
        # Check if simple FAQ
        if self.is_faq(query):
            return {
                "response": self.get_faq_answer(query),
                "type": "faq",
                "escalated": False
            }
        
        # Use agent for complex queries
        context = ""
        if order_id:
            context = f"Order: {self.get_order_details(order_id)}"
        
        result = await self.support_agent.run(
            f"{context}\\nQuery: {query}"
        )
        
        # Check if needs escalation
        if self.needs_escalation(result.data):
            return {
                "response": "Connecting you with a specialist...",
                "type": "escalation",
                "escalated": True
            }
        
        return {
            "response": result.data,
            "type": "agent",
            "escalated": False
        }
    
    async def recommend_products(
        self,
        customer_id: str,
        query: str
    ) -> List[Dict]:
        """Recommend products."""
        
        # Get customer history
        history = self.get_purchase_history(customer_id)
        
        result = await self.product_agent.run(
            f"Customer history: {history}\\n"
            f"Looking for: {query}\\n"
            f"Recommend 3-5 products with reasons."
        )
        
        return self.parse_recommendations(result.data)
    
    def is_faq(self, query: str) -> bool:
        """Check if query is FAQ."""
        faq_keywords = ["shipping", "return policy", "hours"]
        return any(kw in query.lower() for kw in faq_keywords)
    
    def get_faq_answer(self, query: str) -> str:
        """Get FAQ answer."""
        # Implement FAQ lookup
        return "FAQ answer"
    
    def needs_escalation(self, response: str) -> bool:
        """Check if needs human escalation."""
        escalation_signals = [
            "refund",
            "complaint",
            "legal",
            "urgent"
        ]
        return any(sig in response.lower() for sig in escalation_signals)
    
    def get_order_details(self, order_id: str) -> str:
        """Fetch order details."""
        return f"Order {order_id} details"
    
    def get_purchase_history(self, customer_id: str) -> str:
        """Get customer purchase history."""
        return "Purchase history"
    
    def parse_recommendations(self, text: str) -> List[Dict]:
        """Parse product recommendations."""
        return []

# Usage
agent = EcommerceAgent()

# Support
response = await agent.handle_support(
    "Where is my order?",
    order_id="ORD123"
)

# Recommendations
products = await agent.recommend_products(
    "CUST456",
    "laptop for programming"
)`
};

export const week15Quiz = {
    title: 'Week 15 Quiz: Industry Applications',
    questions: [
        {
            id: 1,
            question: 'Why is explainability important in healthcare AI agents?',
            options: [
                'It makes them faster',
                'Regulatory requirements and trust',
                'It reduces costs',
                'It is not important'
            ],
            correctAnswer: 1,
            explanation: 'Healthcare requires explainability for regulatory compliance (like HIPAA) and to build trust with medical professionals.'
        },
        {
            id: 2,
            question: 'What is the main benefit of multi-agent systems in banking?',
            options: [
                'Lower costs only',
                'Specialized expertise for different banking services',
                'Faster processing only',
                'Better UI'
            ],
            correctAnswer: 1,
            explanation: 'Multi-agent systems allow specialized agents for different banking services (accounts, loans, cards), improving accuracy and service quality.'
        },
        {
            id: 3,
            question: 'When should a customer service agent escalate to a human?',
            options: [
                'Never',
                'For complex issues, complaints, or when confidence is low',
                'Always',
                'Only on weekends'
            ],
            correctAnswer: 1,
            explanation: 'Escalation should occur for complex issues, complaints, legal matters, or when the agent\'s confidence is below threshold.'
        }
    ]
};

// Week 16: Final Capstone Project
export const week16Capstone = {
    title: 'Final Capstone Project: End-to-End Agent System',
    videoUrl: 'https://example.com/week16-capstone',
    notes: `# Final Capstone Project

## Project Overview

Build a complete, production-ready multi-agent system demonstrating all course concepts.

## Project Options

### Option 1: AI Research Assistant
- Multi-agent research system
- Web search + academic papers
- Synthesis and report generation
- Citation management
- Fact-checking

### Option 2: Enterprise Customer Support
- Multi-channel support (chat, email)
- Intent classification
- Knowledge base RAG
- Escalation logic
- Analytics dashboard

### Option 3: Content Creation Platform
- Multi-agent content pipeline
- Research → Outline → Draft → Edit
- SEO optimization
- Multi-format output
- Quality scoring

## Technical Requirements

**1. Architecture (30 points)**
- Multi-agent system (3+ agents)
- Clear separation of concerns
- Scalable design
- Proper error handling

**2. Implementation (25 points)**
- Advanced reasoning patterns
- Tool integration (5+ tools)
- Memory/state management
- Streaming responses

**3. Production Quality (20 points)**
- Security (auth, rate limiting)
- Monitoring (LangSmith/similar)
- Caching strategy
- API documentation

**4. Testing (10 points)**
- Unit tests (80%+ coverage)
- Integration tests
- Load testing
- Evaluation metrics

**5. Deployment (10 points)**
- Cloud deployment
- CI/CD pipeline
- Health checks
- Scalability

**6. Documentation (5 points)**
- README with setup
- Architecture diagram
- API docs
- Usage examples

## Deliverables

1. **Source Code** (GitHub repo)
   - Clean, documented code
   - Configuration files
   - Tests

2. **Live Demo**
   - Deployed application
   - Public URL
   - Demo video (10 min)

3. **Documentation**
   - Technical documentation
   - Architecture decisions
   - Performance metrics
   - Future improvements

4. **Presentation** (15 min)
   - Problem & solution
   - Architecture overview
   - Technical highlights
   - Demo
   - Results & learnings

## Evaluation Rubric

| Category | Weight | Criteria |
|----------|--------|----------|
| Functionality | 30% | Works as intended, meets requirements |
| Architecture | 20% | Well-designed, scalable, maintainable |
| Code Quality | 15% | Clean, tested, documented |
| Innovation | 15% | Creative solutions, advanced features |
| Production | 10% | Deployed, monitored, secure |
| Documentation | 5% | Clear, complete, professional |
| Presentation | 5% | Clear communication, good demo |

## Timeline

**Week 1-2**: Planning & Design
- Requirements analysis
- Architecture design
- Technology selection
- Project setup

**Week 3-4**: Core Implementation
- Agent system
- Tool integration
- Basic functionality

**Week 5**: Advanced Features
- Reasoning patterns
- Memory systems
- Optimization

**Week 6**: Production & Polish
- Security hardening
- Monitoring setup
- Testing
- Documentation

**Week 7**: Deployment & Presentation
- Cloud deployment
- Final testing
- Demo video
- Presentation prep

## Bonus Features (+10 points each)

- Web UI (React/Next.js)
- Real-time collaboration
- Multi-modal (images/audio)
- Advanced analytics
- Mobile app
- API marketplace integration`,
    codeSnippet: `# capstone_project_template.py
"""
Agentic AI Capstone Project

Complete multi-agent system with production features.
"""

from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from pydantic_ai import Agent
from typing import List, Dict, Optional
import redis
from prometheus_client import Counter, Histogram
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Metrics
requests_total = Counter('requests_total', 'Total requests')
request_duration = Histogram('request_duration_seconds', 'Request duration')

app = FastAPI(
    title="Capstone Agent System",
    description="Production multi-agent system",
    version="1.0.0"
)

class MultiAgentSystem:
    """
    Main orchestrator for the multi-agent system.
    
    TODO: Implement your chosen project option
    """
    
    def __init__(self):
        self.cache = redis.Redis(host='localhost', port=6379)
        self.agents = self._initialize_agents()
        self.tools = self._initialize_tools()
    
    def _initialize_agents(self) -> Dict[str, Agent]:
        """Initialize all agents."""
        return {
            "coordinator": Agent(
                "claude-3-opus-20260217",
                system_prompt="Coordinate multi-agent tasks"
            ),
            "specialist1": Agent(
                "claude-3-sonnet-20260317",
                system_prompt="Specialist agent 1"
            ),
            # Add more agents
        }
    
    def _initialize_tools(self) -> Dict:
        """Initialize tools."""
        return {
            # Add your tools
        }
    
    async def process(self, request: Dict) -> Dict:
        """
        Main processing pipeline.
        
        TODO: Implement your agent workflow
        """
        requests_total.inc()
        
        # 1. Validate input
        # 2. Check cache
        # 3. Route to appropriate agent(s)
        # 4. Execute with tools
        # 5. Synthesize results
        # 6. Cache response
        # 7. Return result
        
        return {"response": "Implement your logic"}

# Initialize system
system = MultiAgentSystem()

class QueryRequest(BaseModel):
    query: str
    user_id: str
    options: Optional[Dict] = None

class QueryResponse(BaseModel):
    response: str
    metadata: Dict

@app.post("/query", response_model=QueryResponse)
async def query(request: QueryRequest):
    """Main query endpoint."""
    try:
        result = await system.process(request.dict())
        return QueryResponse(
            response=result["response"],
            metadata=result.get("metadata", {})
        )
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    """Health check."""
    return {"status": "healthy"}

@app.get("/metrics")
async def metrics():
    """Prometheus metrics."""
    # Return metrics
    pass

# Run: uvicorn capstone_project_template:app --reload`
};

export const week16FinalPresentation = {
    title: 'Final Presentation Guidelines',
    videoUrl: 'https://example.com/week16-presentation',
    notes: `# Final Presentation Guidelines

## Presentation Structure (15 minutes)

### 1. Introduction (2 min)
- Problem statement
- Why it matters
- Your solution overview

### 2. Architecture (3 min)
- System diagram
- Agent roles
- Data flow
- Technology stack

### 3. Technical Deep Dive (4 min)
- Key technical decisions
- Interesting challenges solved
- Advanced features
- Code highlights

### 4. Live Demo (4 min)
- Real-world scenarios
- Show key features
- Highlight agent interactions
- Performance metrics

### 5. Results & Learnings (2 min)
- Metrics and outcomes
- What worked well
- Challenges faced
- Future improvements

## Presentation Tips

**Do:**
- Practice timing
- Use visuals/diagrams
- Show real examples
- Be enthusiastic
- Explain trade-offs

**Don't:**
- Read slides
- Show too much code
- Go over time
- Skip the demo
- Ignore questions

## Demo Best Practices

1. **Prepare scenarios** - Have 2-3 prepared examples
2. **Have backup** - Record video in case of issues
3. **Show variety** - Different use cases
4. **Highlight features** - Point out key capabilities
5. **Be ready for questions** - Anticipate technical questions

## Slide Deck Structure

1. Title slide
2. Problem & motivation
3. Solution overview
4. Architecture diagram
5. Technical highlights (2-3 slides)
6. Demo
7. Results & metrics
8. Learnings
9. Future work
10. Thank you + Q&A

## Evaluation Criteria

- **Clarity**: Easy to understand
- **Technical depth**: Shows mastery
- **Demo quality**: Works smoothly
- **Time management**: Stays within 15 min
- **Q&A**: Handles questions well`,
    codeSnippet: `# presentation_checklist.md

## Pre-Presentation Checklist

### Technical
- [ ] Code deployed and running
- [ ] Demo scenarios tested
- [ ] Backup video recorded
- [ ] Metrics dashboard ready
- [ ] API endpoints working

### Presentation
- [ ] Slides completed
- [ ] Practiced timing (under 15 min)
- [ ] Architecture diagram clear
- [ ] Code snippets readable
- [ ] Demo flow smooth

### Documentation
- [ ] README updated
- [ ] API docs complete
- [ ] Architecture documented
- [ ] Setup instructions clear
- [ ] GitHub repo clean

### Backup Plans
- [ ] Video demo ready
- [ ] Screenshots prepared
- [ ] Offline slides available
- [ ] Printed notes (optional)

## Day-of Checklist

- [ ] Arrive early
- [ ] Test equipment
- [ ] Open all tabs/apps
- [ ] Close unnecessary apps
- [ ] Silence notifications
- [ ] Have water ready
- [ ] Relax and breathe!`
};

export const week16Quiz = {
    title: 'Week 16 Quiz: Course Review',
    questions: [
        {
            id: 1,
            question: 'What is the most important factor for production agent systems?',
            options: [
                'Using the latest model',
                'Reliability, security, and monitoring',
                'Having the most features',
                'Being the fastest'
            ],
            correctAnswer: 1,
            explanation: 'Production systems must prioritize reliability, security, and monitoring to ensure safe and effective operation.'
        },
        {
            id: 2,
            question: 'What makes a good capstone project?',
            options: [
                'Using every possible technology',
                'Solving a real problem with clean implementation',
                'Having the most code',
                'Using only one agent'
            ],
            correctAnswer: 1,
            explanation: 'A good capstone solves a real problem with clean, well-documented implementation that demonstrates course concepts.'
        },
        {
            id: 3,
            question: 'What should you do if your demo fails during presentation?',
            options: [
                'Panic and give up',
                'Switch to backup video and continue confidently',
                'Skip the demo entirely',
                'Restart your computer'
            ],
            correctAnswer: 1,
            explanation: 'Always have a backup video demo ready and continue confidently if technical issues occur.'
        }
    ]
};
