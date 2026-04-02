// Agentic AI Development - Final Capstone Project
// End-to-End Multi-Agent System

export const finalProject = {
    title: 'Capstone Project: Production Multi-Agent System',
    videoUrl: 'https://example.com/final-project',
    notes: `# Capstone Project: Production Multi-Agent System

## Project Overview

Build a complete, production-ready multi-agent system that demonstrates all concepts learned throughout the course.

## Project Options

Choose one of the following projects:

### Option 1: AI-Powered Research Assistant
Build a multi-agent system that can:
- Research topics across multiple sources
- Synthesize information
- Generate comprehensive reports
- Fact-check and validate claims
- Cite sources properly

### Option 2: Customer Support Automation
Create an intelligent support system with:
- Intent classification
- Context-aware responses
- Knowledge base integration
- Escalation to human agents
- Conversation memory
- Multi-language support

### Option 3: Code Review & Development Assistant
Develop an agent system that:
- Reviews code for bugs and improvements
- Suggests optimizations
- Writes tests automatically
- Generates documentation
- Refactors code
- Explains complex code

## Technical Requirements

1. **Multi-Agent Architecture**
   - At least 3 specialized agents
   - Clear role separation
   - Effective coordination

2. **Advanced Reasoning**
   - Use Plan-and-Execute or ToT
   - Implement error recovery
   - Self-correction capabilities

3. **Tool Integration**
   - Minimum 5 custom tools
   - API integrations
   - Database interactions

4. **State Management**
   - Persistent conversation history
   - Context tracking
   - Session management

5. **Production Quality**
   - Error handling
   - Logging and monitoring
   - Rate limiting
   - Security best practices
   - Unit tests (80%+ coverage)

## Deliverables

1. **Source Code**
   - Well-organized repository
   - Clear folder structure
   - Configuration files

2. **Documentation**
   - README with setup instructions
   - Architecture diagram
   - API documentation
   - Usage examples

3. **Demo Video** (5-10 minutes)
   - System walkthrough
   - Key features demonstration
   - Technical highlights

4. **Presentation** (10-15 slides)
   - Problem statement
   - Solution architecture
   - Technical decisions
   - Results and metrics
   - Future improvements

## Evaluation Criteria

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Functionality | 30% | Does it work as intended? |
| Code Quality | 20% | Clean, maintainable code |
| Architecture | 20% | Well-designed system |
| Innovation | 15% | Creative solutions |
| Documentation | 10% | Clear and complete |
| Presentation | 5% | Effective communication |

## Timeline

- **Week 1-2**: Planning and design
- **Week 3-4**: Core implementation
- **Week 5**: Testing and refinement
- **Week 6**: Documentation and presentation

## Bonus Features

- Web interface (React/Next.js)
- Real-time streaming responses
- Multi-modal capabilities (images, audio)
- Deployment to cloud (AWS/GCP/Azure)
- CI/CD pipeline
- Performance benchmarks`,
    codeSnippet: `# final_project_template.py
"""
Agentic AI Capstone Project Template

This template provides a starting structure for your final project.
Customize and extend based on your chosen project option.
"""

from pydantic_ai import Agent
from typing import List, Dict, Optional
import asyncio
from datetime import datetime

class MultiAgentSystem:
    """
    Main orchestrator for the multi-agent system.
    """
    
    def __init__(self):
        self.agents = {}
        self.tools = {}
        self.state = {}
        self.history = []
        
        # Initialize agents
        self._setup_agents()
        
        # Initialize tools
        self._setup_tools()
    
    def _setup_agents(self):
        """Initialize all specialized agents."""
        
        # Coordinator Agent
        self.agents['coordinator'] = Agent(
            "claude-3-opus-20260217",
            system_prompt="""You are the coordinator agent.
            You delegate tasks to specialist agents and synthesize results."""
        )
        
        # Specialist Agent 1
        self.agents['specialist1'] = Agent(
            "claude-3-sonnet-20260317",
            system_prompt="You are a specialist in..."
        )
        
        # Specialist Agent 2
        self.agents['specialist2'] = Agent(
            "claude-3-sonnet-20260317",
            system_prompt="You are a specialist in..."
        )
        
        # TODO: Add more agents as needed
    
    def _setup_tools(self):
        """Initialize all tools."""
        # TODO: Implement your custom tools
        pass
    
    async def process_request(self, user_input: str) -> Dict:
        """
        Main entry point for processing user requests.
        
        Args:
            user_input: User's request
            
        Returns:
            Dict containing response and metadata
        """
        
        # Step 1: Coordinator analyzes request
        plan = await self.agents['coordinator'].run(
            f"Analyze this request and create a plan: {user_input}"
        )
        
        # Step 2: Execute plan with specialist agents
        results = await self._execute_plan(plan)
        
        # Step 3: Synthesize results
        final_response = await self._synthesize_results(results)
        
        # Step 4: Update history
        self._update_history(user_input, final_response)
        
        return {
            'response': final_response,
            'timestamp': datetime.now().isoformat(),
            'agents_used': list(results.keys())
        }
    
    async def _execute_plan(self, plan) -> Dict:
        """Execute the plan using specialist agents."""
        # TODO: Implement plan execution
        results = {}
        return results
    
    async def _synthesize_results(self, results: Dict) -> str:
        """Synthesize results from multiple agents."""
        # TODO: Implement result synthesis
        return "Synthesized response"
    
    def _update_history(self, input_text: str, response: str):
        """Update conversation history."""
        self.history.append({
            'input': input_text,
            'response': response,
            'timestamp': datetime.now().isoformat()
        })

# Main execution
async def main():
    """Main function to run the system."""
    
    system = MultiAgentSystem()
    
    # Example usage
    result = await system.process_request(
        "Your test query here"
    )
    
    print(f"Response: {result['response']}")
    print(f"Agents used: {result['agents_used']}")

if __name__ == "__main__":
    asyncio.run(main())`
};

export const finalProjectRubric = {
    title: 'Final Project Grading Rubric',
    categories: [
        {
            name: 'Functionality',
            weight: 30,
            criteria: [
                'System works as intended',
                'All requirements met',
                'Handles edge cases',
                'Error recovery works'
            ]
        },
        {
            name: 'Code Quality',
            weight: 20,
            criteria: [
                'Clean, readable code',
                'Proper error handling',
                'Good naming conventions',
                'DRY principles followed'
            ]
        },
        {
            name: 'Architecture',
            weight: 20,
            criteria: [
                'Well-designed system',
                'Clear separation of concerns',
                'Scalable design',
                'Proper use of patterns'
            ]
        },
        {
            name: 'Innovation',
            weight: 15,
            criteria: [
                'Creative solutions',
                'Novel approaches',
                'Advanced features',
                'Problem-solving skills'
            ]
        },
        {
            name: 'Documentation',
            weight: 10,
            criteria: [
                'Clear README',
                'Code comments',
                'API documentation',
                'Usage examples'
            ]
        },
        {
            name: 'Presentation',
            weight: 5,
            criteria: [
                'Clear communication',
                'Good demo',
                'Professional slides',
                'Time management'
            ]
        }
    ]
};
