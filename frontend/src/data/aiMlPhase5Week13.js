// AI/ML Phase 5 - Week 13: MLOps and Model Deployment

export const week13Lesson1 = {
    title: 'Introduction to MLOps',
    videoUrl: 'https://www.youtube.com/embed/ZVWg18AXXuE',
    notes: `# Introduction to MLOps

## What is MLOps?

MLOps (Machine Learning Operations) is the practice of combining machine learning, DevOps, and data engineering to deploy and maintain ML models in production.

## The ML Lifecycle in Production

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│                    ML LIFECYCLE IN PRODUCTION                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│   Data Collection ──► Data Validation ──► Model Training        │
│         ▲                                    │                   │
│         │                                    ▼                   │
│   Monitoring ◄──── Deployment ◄──── Model Evaluation             │
│         │                                    │                   │
│         └──────────── Feedback Loop ─────────┘                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Key MLOps Components

### 1. Data Management
- Data collection and validation
- Data versioning and lineage
- Feature engineering and storage
- Data quality monitoring

### 2. Model Development
- Experiment tracking
- Model versioning
- Hyperparameter tuning
- Model validation

### 3. Model Deployment
- Model packaging and containerization
- Deployment strategies (A/B testing, canary)
- Infrastructure provisioning
- API development

### 4. Model Monitoring
- Performance monitoring
- Data drift detection
- Model retraining triggers
- Alerting and notifications`,
    codeSnippet: `# MLOps Fundamentals Example

import numpy as np
import pandas as pd
import joblib
import json
from datetime import datetime
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

print("="*60)
print("MLOps FUNDAMENTALS")
print("="*60)

# Model Persistence Example
def demonstrate_model_persistence():
    """Show different ways to save and load models"""
    
    # Train a simple model
    data = load_breast_cancer()
    X, y = data.data, data.target
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    print("="*50)
    print("MODEL PERSISTENCE DEMONSTRATION")
    print("="*50)
    print(f"Model trained with {len(X_train)} samples")
    print(f"Initial accuracy: {accuracy_score(y_test, model.predict(X_test)):.4f}")
    
    # Method 1: Joblib (recommended for scikit-learn)
    joblib.dump(model, 'model.joblib')
    loaded_model = joblib.load('model.joblib')
    print("\\n1. Joblib:")
    print(f"   Model saved and loaded successfully")
    print(f"   Accuracy: {accuracy_score(y_test, loaded_model.predict(X_test)):.4f}")
    
    return model

model = demonstrate_model_persistence()
print("\\nMLOps model persistence demonstration complete!")`
};

export const week13Lesson2 = {
    title: 'Model Serving with APIs',
    videoUrl: 'https://www.youtube.com/embed/nhKtvjSFJsw',
    notes: `# Model Serving with APIs

## Why Serve Models via APIs?

- **Scalability**: Handle multiple concurrent requests
- **Language Agnostic**: Any client can consume the API
- **Versioning**: Easy to manage different model versions
- **Monitoring**: Track usage and performance
- **Security**: Control access and authentication

## REST API Design for ML Models

### Essential Endpoints

1. **Health Check**: \`/health\`
   - Check if the service is running
   - Verify model is loaded

2. **Prediction**: \`/predict\`
   - Single prediction endpoint
   - Input validation
   - Error handling

3. **Batch Prediction**: \`/batch_predict\`
   - Multiple predictions at once
   - More efficient for bulk processing

4. **Model Info**: \`/model/info\`
   - Model metadata
   - Version information
   - Feature requirements

### API Best Practices

- **Input Validation**: Validate all incoming data
- **Error Handling**: Return meaningful error messages
- **Logging**: Log requests and responses
- **Rate Limiting**: Prevent abuse
- **Authentication**: Secure your endpoints
- **Documentation**: Use OpenAPI/Swagger`,
    codeSnippet: `# Model Serving API with FastAPI

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
from typing import List
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="ML Model API",
    description="Production ML model serving API",
    version="1.0.0"
)

# Load model at startup
model = None

@app.on_event("startup")
async def load_model():
    global model
    try:
        model = joblib.load("model/trained_model.pkl")
        logger.info("Model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load model: {e}")
        raise

# Request/Response models
class PredictionRequest(BaseModel):
    features: List[float]
    model_version: str = "1.0"

class PredictionResponse(BaseModel):
    prediction: float
    probability: List[float]
    model_version: str
    timestamp: str

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }

# Prediction endpoint
@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    try:
        features = np.array(request.features).reshape(1, -1)
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0].tolist()
        
        return PredictionResponse(
            prediction=float(prediction),
            probability=probabilities,
            model_version=request.model_version,
            timestamp=datetime.now().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

print("Model serving API ready!")`
};

export const week13Lesson3 = {
    title: 'Docker for ML Models',
    videoUrl: 'https://www.youtube.com/embed/3c-iBn73dDE',
    notes: `# Docker for ML Models

## Why Docker for ML?

- **Consistency**: Same environment across dev, test, and production
- **Portability**: Run anywhere Docker is supported
- **Isolation**: Dependencies don't conflict
- **Scalability**: Easy to scale with orchestration tools
- **Reproducibility**: Exact same environment every time

## Docker Concepts for ML

### Images vs Containers
- **Image**: Blueprint/template (like a class)
- **Container**: Running instance (like an object)

### Key Components
- **Dockerfile**: Instructions to build image
- **Base Image**: Starting point (e.g., python:3.9-slim)
- **Layers**: Each instruction creates a layer
- **Registry**: Store and share images (Docker Hub)

## Dockerfile Best Practices for ML

### 1. Choose Appropriate Base Image
- \`python:3.9-slim\`: Smaller size, good for production
- \`python:3.9\`: Full Python, good for development
- \`tensorflow/tensorflow\`: Pre-installed TensorFlow
- \`pytorch/pytorch\`: Pre-installed PyTorch

### 2. Optimize Layer Caching
- Copy requirements.txt first
- Install dependencies before copying code
- Use .dockerignore to exclude unnecessary files

### 3. Security Considerations
- Don't run as root user
- Use specific versions, not 'latest'
- Scan images for vulnerabilities
- Keep images updated`,
    codeSnippet: `# Docker Configuration for ML Models

# Dockerfile for ML Model Serving
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \\
    build-essential \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
numpy==1.24.3
scikit-learn==1.3.0
pandas==2.0.3
joblib==1.3.2
pydantic==2.4.2

# Docker Commands Cheat Sheet

# Build image
docker build -t ml-model-api .

# Run container
docker run -p 8000:8000 ml-model-api

# Run with environment variables
docker run -p 8000:8000 -e MODEL_PATH=/app/model.pkl ml-model-api

# Run in background
docker run -d -p 8000:8000 --name ml-api ml-model-api

# View logs
docker logs ml-api

# Stop container
docker stop ml-api

print("Docker configuration for ML models complete!")`
};

export const week13Lesson4 = {
    title: 'Model Monitoring and Observability',
    videoUrl: 'https://www.youtube.com/embed/QcevzK9ZuDg',
    notes: `# Model Monitoring and Observability

## Why Monitor ML Models?

### Model Degradation Issues
- **Data Drift**: Input data distribution changes
- **Concept Drift**: Relationship between features and target changes
- **Performance Decay**: Model accuracy decreases over time
- **Infrastructure Issues**: Latency, availability, errors

### Business Impact
- Poor user experience
- Revenue loss
- Compliance violations
- Brand reputation damage

## Types of Monitoring

### 1. Data Quality Monitoring
- **Missing Values**: Track percentage of missing data
- **Data Types**: Ensure correct data types
- **Value Ranges**: Monitor for outliers and anomalies
- **Schema Changes**: Detect structural changes

### 2. Data Drift Detection
- **Statistical Tests**: KS test, Chi-square test
- **Distribution Comparison**: Compare training vs production data
- **Feature Drift**: Monitor individual feature distributions
- **Multivariate Drift**: Detect complex distribution changes

### 3. Model Performance Monitoring
- **Accuracy Metrics**: Track prediction accuracy over time
- **Business Metrics**: Monitor business KPIs
- **Prediction Distribution**: Monitor output distribution
- **Confidence Scores**: Track model uncertainty

### 4. Infrastructure Monitoring
- **Latency**: Response time monitoring
- **Throughput**: Requests per second
- **Error Rates**: Failed predictions
- **Resource Usage**: CPU, memory, disk usage`,
    codeSnippet: `# Model Monitoring System

import numpy as np
import pandas as pd
from scipy import stats
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import logging
from datetime import datetime
from typing import Dict, List

class ModelMonitor:
    """Comprehensive model monitoring system"""
    
    def __init__(self, reference_data: pd.DataFrame, model_name: str):
        self.reference_data = reference_data
        self.model_name = model_name
        self.monitoring_data = []
        self.alerts = []
        
        # Calculate reference statistics
        self.reference_stats = self._calculate_statistics(reference_data)
        
        # Set up logging
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(f"ModelMonitor_{model_name}")
    
    def _calculate_statistics(self, data: pd.DataFrame) -> Dict:
        """Calculate statistical properties of the data"""
        stats_dict = {}
        
        for column in data.columns:
            if data[column].dtype in ['int64', 'float64']:
                stats_dict[column] = {
                    'mean': data[column].mean(),
                    'std': data[column].std(),
                    'min': data[column].min(),
                    'max': data[column].max(),
                    'percentiles': data[column].quantile([0.25, 0.5, 0.75]).to_dict()
                }
        
        return stats_dict
    
    def detect_data_drift(self, current_data: pd.DataFrame, threshold: float = 0.05) -> Dict:
        """Detect data drift using statistical tests"""
        drift_results = {}
        
        for column in self.reference_data.columns:
            if column not in current_data.columns:
                drift_results[column] = {'status': 'missing_column', 'p_value': None}
                continue
            
            if self.reference_data[column].dtype in ['int64', 'float64']:
                # Kolmogorov-Smirnov test for numerical features
                statistic, p_value = stats.ks_2samp(
                    self.reference_data[column].dropna(),
                    current_data[column].dropna()
                )
                drift_detected = p_value < threshold
            
            drift_results[column] = {
                'status': 'drift_detected' if drift_detected else 'no_drift',
                'p_value': p_value,
                'statistic': statistic
            }
        
        return drift_results

print("Model monitoring system ready!")`
};

export const week13Quiz = {
    title: 'Week 13 Quiz: MLOps and Model Deployment',
    questions: [
        {
            id: 1,
            question: 'What is the primary purpose of MLOps?',
            options: [
                'To replace data scientists',
                'To combine ML, DevOps, and data engineering for production ML',
                'To create better machine learning algorithms',
                'To reduce the cost of computing resources'
            ],
            correctAnswer: 1,
            explanation: 'MLOps combines machine learning, DevOps, and data engineering practices to deploy and maintain ML models in production environments effectively.'
        },
        {
            id: 2,
            question: 'Which is NOT a key component of the ML lifecycle in production?',
            options: [
                'Data collection and validation',
                'Model training and evaluation',
                'Manual code reviews',
                'Monitoring and feedback loops'
            ],
            correctAnswer: 2,
            explanation: 'While code reviews are important in software development, they are not a core component of the ML production lifecycle, which focuses on data, models, deployment, and monitoring.'
        },
        {
            id: 3,
            question: 'What is the recommended method for persisting scikit-learn models?',
            options: [
                'Pickle',
                'JSON',
                'Joblib',
                'CSV files'
            ],
            correctAnswer: 2,
            explanation: 'Joblib is the recommended method for persisting scikit-learn models as it is more efficient for NumPy arrays and provides better performance.'
        },
        {
            id: 4,
            question: 'Which Docker base image is typically best for production ML deployments?',
            options: [
                'ubuntu:latest',
                'python:3.9',
                'python:3.9-slim',
                'alpine:latest'
            ],
            correctAnswer: 2,
            explanation: 'python:3.9-slim provides a good balance of functionality and size for production ML deployments, containing Python with fewer unnecessary packages.'
        },
        {
            id: 5,
            question: 'What is data drift in ML monitoring?',
            options: [
                'When the model code changes',
                'When input data distribution changes over time',
                'When the server hardware fails',
                'When the API response time increases'
            ],
            correctAnswer: 1,
            explanation: 'Data drift occurs when the statistical properties of the input data change over time, which can negatively impact model performance.'
        }
    ]
};