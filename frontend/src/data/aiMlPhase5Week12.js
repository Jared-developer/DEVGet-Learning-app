// AI/ML Phase 5 - Week 12: MLOps and Production Deployment

export const week12Lesson1 = {
    title: 'Introduction to MLOps',
    videoUrl: 'https://www.youtube.com/embed/ZVWg18AXXuE',
    notes: `# Introduction to MLOps

## What is MLOps?

**Machine Learning Operations (MLOps)** is a set of practices that combines Machine Learning, DevOps, and Data Engineering to deploy and maintain ML systems in production reliably and efficiently.

## Why MLOps?

### Traditional ML Challenges
- **Model Drift**: Performance degrades over time
- **Reproducibility**: Hard to recreate results
- **Scalability**: Difficulty serving models at scale
- **Monitoring**: No visibility into model performance
- **Collaboration**: Silos between teams

### MLOps Solutions
- **Automated Pipelines**: CI/CD for ML models
- **Version Control**: Track models, data, and code
- **Monitoring**: Real-time performance tracking
- **Reproducibility**: Consistent environments
- **Collaboration**: Unified workflows

## MLOps Lifecycle

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
- Alerting and notifications

## MLOps Principles

### Automation
- Automate repetitive tasks
- Reduce manual errors
- Ensure consistency
- Enable rapid iteration

### Reproducibility
- Version everything (code, data, models)
- Use consistent environments
- Document processes
- Enable rollbacks

### Monitoring
- Track model performance
- Monitor data quality
- Detect anomalies
- Measure business impact

### Collaboration
- Cross-functional teams
- Shared tools and processes
- Clear communication
- Knowledge sharing`,
    codeSnippet: `# MLOps Pipeline Example with MLflow

import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd
import numpy as np

# Set up MLflow tracking
mlflow.set_tracking_uri("http://localhost:5000")
mlflow.set_experiment("production-model-training")

def train_model(data_path, model_params):
    """Train model with MLflow tracking"""
    
    with mlflow.start_run():
        # Load and prepare data
        data = pd.read_csv(data_path)
        X = data.drop('target', axis=1)
        y = data['target']
        
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Log parameters
        mlflow.log_params(model_params)
        mlflow.log_param("data_path", data_path)
        mlflow.log_param("train_size", len(X_train))
        mlflow.log_param("test_size", len(X_test))
        
        # Train model
        model = RandomForestClassifier(**model_params)
        model.fit(X_train, y_train)
        
        # Evaluate model
        train_accuracy = accuracy_score(y_train, model.predict(X_train))
        test_accuracy = accuracy_score(y_test, model.predict(X_test))
        
        # Log metrics
        mlflow.log_metric("train_accuracy", train_accuracy)
        mlflow.log_metric("test_accuracy", test_accuracy)
        
        # Log model
        mlflow.sklearn.log_model(
            model, 
            "model",
            registered_model_name="production-classifier"
        )
        
        # Log artifacts
        report = classification_report(y_test, model.predict(X_test))
        with open("classification_report.txt", "w") as f:
            f.write(report)
        mlflow.log_artifact("classification_report.txt")
        
        print(f"Model trained with test accuracy: {test_accuracy:.3f}")
        return model

# Example usage
if __name__ == "__main__":
    # Model parameters
    params = {
        "n_estimators": 100,
        "max_depth": 10,
        "random_state": 42
    }
    
    # Train model
    model = train_model("data/training_data.csv", params)
    
    print("MLOps pipeline setup complete!")`
};

export const week12Lesson2 = {
    title: 'Model Versioning and Experiment Tracking',
    videoUrl: 'https://www.youtube.com/embed/x3cxvsUFVZA',
    notes: `# Model Versioning and Experiment Tracking

## Why Version Control for ML?

### Traditional Software vs ML
- **Code**: Changes to algorithms and logic
- **Data**: Different datasets, preprocessing steps
- **Models**: Various architectures and parameters
- **Environment**: Dependencies and configurations

### Challenges Without Versioning
- Cannot reproduce results
- Lost track of best performing models
- Difficult to collaborate
- No audit trail for compliance

## Experiment Tracking

### What to Track
- **Hyperparameters**: Learning rate, batch size, epochs
- **Metrics**: Accuracy, loss, F1-score, AUC
- **Artifacts**: Models, plots, logs, datasets
- **Environment**: Dependencies, hardware specs
- **Code**: Git commit hash, branch

### MLflow Tracking Components

#### Experiments
- Group related runs together
- Organize by project or model type
- Compare different approaches

#### Runs
- Individual training execution
- Contains parameters, metrics, artifacts
- Unique identifier for reproducibility

#### Models
- Trained model artifacts
- Metadata and lineage
- Deployment-ready packages

## Model Registry

### Model Lifecycle Stages
- **None**: Newly registered model
- **Staging**: Model under testing
- **Production**: Currently serving model
- **Archived**: Deprecated model

### Model Versioning
- Semantic versioning (1.0.0, 1.1.0, 2.0.0)
- Automatic version increment
- Model lineage tracking
- Rollback capabilities

## Data Versioning

### Why Version Data?
- Data changes over time
- Different preprocessing steps
- Feature engineering variations
- Compliance and audit requirements

### Data Versioning Tools
- **DVC (Data Version Control)**
- **Pachyderm**
- **Delta Lake**
- **Git LFS** (for smaller datasets)

## Best Practices

### Naming Conventions
- Consistent experiment names
- Descriptive run names
- Clear model naming scheme
- Organized artifact structure

### Metadata Management
- Document data sources
- Track feature engineering steps
- Record model assumptions
- Maintain change logs

### Reproducibility
- Pin dependency versions
- Use containerization
- Set random seeds
- Document hardware specs`,
    codeSnippet: `# Comprehensive Experiment Tracking with MLflow

import mlflow
import mlflow.tensorflow
import mlflow.pytorch
from mlflow.tracking import MlflowClient
import pandas as pd
from datetime import datetime
import json

class ExperimentTracker:
    def __init__(self, tracking_uri="http://localhost:5000"):
        mlflow.set_tracking_uri(tracking_uri)
        self.client = MlflowClient()
    
    def create_experiment(self, name, description=""):
        """Create a new experiment"""
        try:
            experiment_id = mlflow.create_experiment(
                name=name,
                tags={"description": description, "created": datetime.now().isoformat()}
            )
            print(f"Created experiment: {name} (ID: {experiment_id})")
            return experiment_id
        except Exception as e:
            print(f"Experiment {name} already exists")
            return mlflow.get_experiment_by_name(name).experiment_id
    
    def log_experiment(self, experiment_name, run_name, params, metrics, artifacts=None):
        """Log a complete experiment run"""
        mlflow.set_experiment(experiment_name)
        
        with mlflow.start_run(run_name=run_name):
            # Log parameters
            for key, value in params.items():
                mlflow.log_param(key, value)
            
            # Log metrics
            for key, value in metrics.items():
                if isinstance(value, dict):
                    # Handle nested metrics
                    for sub_key, sub_value in value.items():
                        mlflow.log_metric(f"{key}_{sub_key}", sub_value)
                else:
                    mlflow.log_metric(key, value)
            
            return mlflow.active_run().info.run_id

# Advanced model versioning
class ModelVersionManager:
    def __init__(self, tracking_uri="http://localhost:5000"):
        mlflow.set_tracking_uri(tracking_uri)
        self.client = MlflowClient()
    
    def register_model(self, model, model_name, run_id, framework="sklearn"):
        """Register a model in the model registry"""
        model_uri = f"runs:/{run_id}/model"
        
        if framework == "tensorflow":
            mlflow.tensorflow.log_model(model, "model")
        elif framework == "pytorch":
            mlflow.pytorch.log_model(model, "model")
        else:
            mlflow.sklearn.log_model(model, "model")
        
        # Register model
        model_version = mlflow.register_model(model_uri, model_name)
        print(f"Registered model {model_name} version {model_version.version}")
        return model_version
    
    def promote_model(self, model_name, version, stage):
        """Promote model to different stage"""
        self.client.transition_model_version_stage(
            name=model_name,
            version=version,
            stage=stage
        )
        print(f"Promoted {model_name} v{version} to {stage}")

print("Experiment tracking and versioning setup complete!")`
};

export const week12Lesson3 = {
    title: 'Model Deployment Strategies',
    videoUrl: 'https://www.youtube.com/embed/nhKtvjSFJsw',
    notes: `# Model Deployment Strategies

## Deployment Patterns

### 1. Batch Inference
- **Use Case**: Periodic predictions on large datasets
- **Examples**: Monthly customer segmentation, daily fraud detection
- **Advantages**: Simple, cost-effective, handles large volumes
- **Disadvantages**: Not real-time, delayed insights

### 2. Real-time Inference
- **Use Case**: Immediate predictions for user interactions
- **Examples**: Recommendation systems, fraud detection, chatbots
- **Advantages**: Instant results, better user experience
- **Disadvantages**: Higher complexity, latency requirements

### 3. Streaming Inference
- **Use Case**: Continuous processing of data streams
- **Examples**: IoT sensor monitoring, real-time analytics
- **Advantages**: Low latency, handles continuous data
- **Disadvantages**: Complex infrastructure, state management

## Deployment Strategies

### Blue-Green Deployment
- **Concept**: Two identical production environments
- **Process**: Deploy to inactive environment, switch traffic
- **Advantages**: Zero downtime, easy rollback
- **Disadvantages**: Double infrastructure cost

### Canary Deployment
- **Concept**: Gradual rollout to subset of users
- **Process**: Route small percentage of traffic to new model
- **Advantages**: Risk mitigation, gradual validation
- **Disadvantages**: Complex routing, monitoring overhead

### A/B Testing
- **Concept**: Compare two model versions simultaneously
- **Process**: Split traffic between models, measure performance
- **Advantages**: Data-driven decisions, business impact measurement
- **Disadvantages**: Requires statistical analysis, longer validation

### Shadow Deployment
- **Concept**: New model processes requests without affecting users
- **Process**: Duplicate traffic to new model, compare results
- **Advantages**: Safe testing, real traffic validation
- **Disadvantages**: Double compute cost, complex setup

## Infrastructure Options

### Cloud Platforms
- **AWS**: SageMaker, Lambda, ECS, EKS
- **Google Cloud**: AI Platform, Cloud Run, GKE
- **Azure**: ML Studio, Container Instances, AKS
- **Advantages**: Managed services, auto-scaling, global reach
- **Disadvantages**: Vendor lock-in, cost at scale

### On-Premises
- **Use Cases**: Data privacy, compliance, cost control
- **Technologies**: Kubernetes, Docker, bare metal
- **Advantages**: Full control, data sovereignty
- **Disadvantages**: Infrastructure management, scaling challenges

### Edge Deployment
- **Use Cases**: Low latency, offline capability, privacy
- **Technologies**: TensorFlow Lite, ONNX Runtime, mobile SDKs
- **Advantages**: Reduced latency, works offline
- **Disadvantages**: Limited compute, model size constraints`,
    codeSnippet: `# Model Deployment with FastAPI and Docker

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
from typing import List, Dict, Any
import logging
import time
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
model_metadata = {}

@app.on_event("startup")
async def load_model():
    global model, model_metadata
    try:
        model = joblib.load("model/trained_model.pkl")
        with open("model/metadata.json", "r") as f:
            import json
            model_metadata = json.load(f)
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
    processing_time_ms: float

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "timestamp": datetime.now().isoformat()
    }

# Single prediction endpoint
@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    start_time = time.time()
    
    try:
        # Validate input
        if len(request.features) != model_metadata.get("n_features", 0):
            raise HTTPException(
                status_code=400,
                detail=f"Expected {model_metadata.get('n_features', 0)} features"
            )
        
        # Make prediction
        features = np.array(request.features).reshape(1, -1)
        prediction = model.predict(features)[0]
        probabilities = model.predict_proba(features)[0].tolist()
        
        processing_time = (time.time() - start_time) * 1000
        
        return PredictionResponse(
            prediction=float(prediction),
            probability=probabilities,
            model_version=request.model_version,
            timestamp=datetime.now().isoformat(),
            processing_time_ms=processing_time
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)`
};

export const week12Lesson4 = {
    title: 'Model Monitoring and Maintenance',
    videoUrl: 'https://www.youtube.com/embed/QcevzK9ZuDg',
    notes: `# Model Monitoring and Maintenance

## Why Monitor ML Models?

### Model Degradation
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
- **Resource Usage**: CPU, memory, disk usage

## Monitoring Metrics

### Data Drift Metrics
- **Population Stability Index (PSI)**
- **Kullback-Leibler Divergence**
- **Jensen-Shannon Distance**
- **Wasserstein Distance**

### Model Performance Metrics
- **Accuracy, Precision, Recall, F1-score**
- **AUC-ROC, AUC-PR**
- **Mean Absolute Error (MAE)**
- **Root Mean Square Error (RMSE)**

### Business Metrics
- **Conversion Rate**
- **Revenue Impact**
- **Customer Satisfaction**
- **Cost per Prediction**

## Alerting and Response

### Alert Types
- **Threshold-based**: Metric exceeds predefined threshold
- **Anomaly-based**: Statistical anomaly detection
- **Trend-based**: Gradual degradation over time
- **Composite**: Multiple conditions combined

### Response Actions
- **Automatic Rollback**: Revert to previous model version
- **Traffic Routing**: Redirect to backup model
- **Model Retraining**: Trigger automated retraining
- **Human Intervention**: Alert data science team

## Model Retraining Strategies

### Scheduled Retraining
- **Periodic**: Weekly, monthly, quarterly
- **Advantages**: Predictable, simple to implement
- **Disadvantages**: May retrain unnecessarily or too late

### Triggered Retraining
- **Performance-based**: When accuracy drops below threshold
- **Data-based**: When significant drift detected
- **Time-based**: After certain time period
- **Event-based**: Business events or external factors

### Continuous Learning
- **Online Learning**: Update model with each new sample
- **Mini-batch Learning**: Update with small batches
- **Advantages**: Always up-to-date
- **Disadvantages**: Complex, potential instability`,
    codeSnippet: `# Comprehensive Model Monitoring System

import numpy as np
import pandas as pd
from scipy import stats
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import logging
from datetime import datetime, timedelta
import json
from typing import Dict, List, Optional

class ModelMonitor:
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
            else:
                stats_dict[column] = {
                    'unique_values': data[column].nunique(),
                    'most_common': data[column].mode().iloc[0] if not data[column].empty else None,
                    'value_counts': data[column].value_counts().to_dict()
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
            else:
                # Chi-square test for categorical features
                ref_counts = self.reference_data[column].value_counts()
                curr_counts = current_data[column].value_counts()
                
                # Align categories
                all_categories = set(ref_counts.index) | set(curr_counts.index)
                ref_aligned = [ref_counts.get(cat, 0) for cat in all_categories]
                curr_aligned = [curr_counts.get(cat, 0) for cat in all_categories]
                
                if sum(curr_aligned) > 0:
                    statistic, p_value = stats.chisquare(curr_aligned, ref_aligned)
                    drift_detected = p_value < threshold
                else:
                    statistic, p_value = 0, 1
                    drift_detected = False
            
            drift_results[column] = {
                'status': 'drift_detected' if drift_detected else 'no_drift',
                'p_value': p_value,
                'statistic': statistic
            }
        
        return drift_results
    
    def monitor_model_performance(self, predictions: np.array, actuals: np.array, 
                                timestamp: datetime = None) -> Dict:
        """Monitor model performance metrics"""
        if timestamp is None:
            timestamp = datetime.now()
        
        # Calculate metrics
        metrics = {
            'accuracy': accuracy_score(actuals, predictions),
            'precision': precision_score(actuals, predictions, average='weighted'),
            'recall': recall_score(actuals, predictions, average='weighted'),
            'f1_score': f1_score(actuals, predictions, average='weighted'),
            'timestamp': timestamp.isoformat(),
            'sample_size': len(predictions)
        }
        
        # Store monitoring data
        self.monitoring_data.append(metrics)
        
        # Check for performance degradation
        if len(self.monitoring_data) > 1:
            recent_accuracy = np.mean([m['accuracy'] for m in self.monitoring_data[-5:]])
            baseline_accuracy = np.mean([m['accuracy'] for m in self.monitoring_data[:5]])
            
            if recent_accuracy < baseline_accuracy * 0.95:  # 5% degradation threshold
                alert = {
                    'type': 'performance_degradation',
                    'message': f'Model accuracy dropped from {baseline_accuracy:.3f} to {recent_accuracy:.3f}',
                    'timestamp': timestamp.isoformat(),
                    'severity': 'high'
                }
                self.alerts.append(alert)
                self.logger.warning(alert['message'])
        
        return metrics

# Example usage
if __name__ == "__main__":
    # Create sample reference data
    np.random.seed(42)
    reference_data = pd.DataFrame({
        'feature1': np.random.normal(0, 1, 1000),
        'feature2': np.random.normal(5, 2, 1000),
        'category': np.random.choice(['A', 'B', 'C'], 1000)
    })
    
    # Initialize monitor
    monitor = ModelMonitor(reference_data, "customer_churn_model")
    
    # Simulate current data with drift
    current_data = pd.DataFrame({
        'feature1': np.random.normal(0.5, 1.2, 500),  # Slight drift
        'feature2': np.random.normal(5.2, 2.1, 500),  # Slight drift
        'category': np.random.choice(['A', 'B', 'C', 'D'], 500)  # New category
    })
    
    # Detect drift
    drift_results = monitor.detect_data_drift(current_data)
    print("Drift Detection Results:")
    for feature, result in drift_results.items():
        print(f"  {feature}: {result['status']} (p-value: {result['p_value']:.4f})")
    
    print("Model monitoring system ready!")`
};

export const week12Lesson5 = {
    title: 'MLOps Tools and Platforms',
    videoUrl: 'https://www.youtube.com/embed/6gdrwFMaEZ0',
    notes: `# MLOps Tools and Platforms

## MLOps Tool Categories

### 1. Experiment Tracking
- **MLflow**: Open-source ML lifecycle management
- **Weights & Biases**: Experiment tracking and visualization
- **Neptune**: Metadata management for ML
- **Comet**: ML experiment management
- **TensorBoard**: TensorFlow's visualization toolkit

### 2. Model Development
- **Jupyter Notebooks**: Interactive development
- **Google Colab**: Cloud-based notebooks
- **Databricks**: Unified analytics platform
- **Amazon SageMaker Studio**: Integrated ML IDE
- **Azure ML Studio**: Microsoft's ML platform

### 3. Data Management
- **DVC (Data Version Control)**: Git for data
- **Pachyderm**: Data versioning and pipelines
- **Delta Lake**: Data lake with ACID transactions
- **Apache Airflow**: Workflow orchestration
- **Prefect**: Modern workflow orchestration

### 4. Model Serving
- **TensorFlow Serving**: High-performance model serving
- **TorchServe**: PyTorch model serving
- **MLflow Models**: Multi-framework serving
- **Seldon Core**: Kubernetes-native ML deployments
- **KServe**: Serverless ML inference

### 5. Monitoring and Observability
- **Evidently**: ML model monitoring
- **Whylabs**: Data and ML monitoring
- **Arize**: ML observability platform
- **Fiddler**: Model performance management
- **Aporia**: ML monitoring and explainability

## Cloud Platforms

### Amazon Web Services (AWS)
- **SageMaker**: End-to-end ML platform
- **Lambda**: Serverless computing
- **ECS/EKS**: Container orchestration
- **S3**: Data storage
- **CloudWatch**: Monitoring and logging

### Google Cloud Platform (GCP)
- **Vertex AI**: Unified ML platform
- **Cloud Run**: Serverless containers
- **GKE**: Kubernetes engine
- **BigQuery**: Data warehouse
- **Cloud Monitoring**: Observability

### Microsoft Azure
- **Azure ML**: ML platform
- **Container Instances**: Serverless containers
- **AKS**: Azure Kubernetes Service
- **Blob Storage**: Object storage
- **Application Insights**: Monitoring

## Open Source vs Commercial

### Open Source Advantages
- **Cost**: Free to use
- **Flexibility**: Customizable
- **Community**: Large user base
- **Transparency**: Open development
- **No Vendor Lock-in**: Portable

### Commercial Advantages
- **Support**: Professional support
- **Features**: Advanced capabilities
- **Integration**: Seamless tool integration
- **Security**: Enterprise-grade security
- **Compliance**: Regulatory compliance

## Tool Selection Criteria

### Technical Requirements
- **Scalability**: Handle growing data and models
- **Performance**: Low latency, high throughput
- **Integration**: Work with existing stack
- **Flexibility**: Support multiple frameworks
- **Reliability**: High availability and durability

### Business Requirements
- **Cost**: Total cost of ownership
- **Time to Market**: Speed of deployment
- **Team Skills**: Learning curve
- **Compliance**: Regulatory requirements
- **Vendor Support**: Available support options`,
    codeSnippet: `# MLOps Platform Setup with Docker Compose

# docker-compose.yml
version: '3.8'

services:
  # MLflow Tracking Server
  mlflow:
    image: python:3.9-slim
    container_name: mlflow-server
    ports:
      - "5000:5000"
    volumes:
      - ./mlflow:/mlflow
      - ./models:/models
    environment:
      - MLFLOW_BACKEND_STORE_URI=sqlite:///mlflow/mlflow.db
      - MLFLOW_DEFAULT_ARTIFACT_ROOT=/models
    command: >
      bash -c "pip install mlflow psycopg2-binary &&
               mlflow server --host 0.0.0.0 --port 5000 
               --backend-store-uri sqlite:///mlflow/mlflow.db 
               --default-artifact-root /models"
    networks:
      - mlops-network

  # PostgreSQL for metadata
  postgres:
    image: postgres:13
    container_name: mlops-postgres
    environment:
      - POSTGRES_DB=mlops
      - POSTGRES_USER=mlops
      - POSTGRES_PASSWORD=mlops123
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - mlops-network

  # Model serving API
  model-api:
    build: ./model-api
    container_name: model-api
    ports:
      - "8000:8000"
    environment:
      - MLFLOW_TRACKING_URI=http://mlflow:5000
      - REDIS_URL=redis://redis:6379
    depends_on:
      - mlflow
    networks:
      - mlops-network

volumes:
  postgres_data:

networks:
  mlops-network:
    driver: bridge

print("MLOps platform configuration complete!")`
};

export const week12Lesson6 = {
    title: 'Capstone Project: End-to-End MLOps Pipeline',
    videoUrl: 'https://www.youtube.com/embed/YWjFPiHOH0s',
    notes: `# Capstone Project: End-to-End MLOps Pipeline

## Project Overview

Build a complete MLOps pipeline that demonstrates all aspects of machine learning operations, from data ingestion to model monitoring in production.

## Project Objectives

- Implement a full MLOps workflow
- Deploy models to production environment
- Set up monitoring and alerting systems
- Demonstrate CI/CD for ML models
- Handle model versioning and rollbacks
- Monitor data drift and model performance

## Project Requirements

### 1. Problem Statement
Choose one of the following business problems:
- **Customer Churn Prediction**: Predict which customers will churn
- **Fraud Detection**: Identify fraudulent transactions
- **Demand Forecasting**: Predict product demand
- **Recommendation System**: Recommend products to users
- **Sentiment Analysis**: Analyze customer sentiment

### 2. Data Pipeline
- **Data Sources**: Multiple data sources (databases, APIs, files)
- **Data Validation**: Quality checks and schema validation
- **Data Processing**: ETL pipeline with error handling
- **Data Versioning**: Track data changes over time
- **Feature Store**: Centralized feature management

### 3. Model Development
- **Experiment Tracking**: Track all experiments with MLflow
- **Model Versioning**: Version control for models
- **Hyperparameter Tuning**: Automated hyperparameter optimization
- **Model Validation**: Cross-validation and holdout testing
- **Model Registry**: Centralized model management

### 4. Model Deployment
- **Containerization**: Docker containers for models
- **API Development**: REST API for model serving
- **Load Balancing**: Handle multiple requests
- **Auto-scaling**: Scale based on demand
- **Blue-Green Deployment**: Zero-downtime deployments

### 5. Monitoring and Alerting
- **Performance Monitoring**: Track model accuracy over time
- **Data Drift Detection**: Monitor input data distribution
- **Infrastructure Monitoring**: System health and performance
- **Alerting System**: Automated alerts for issues
- **Dashboard**: Real-time monitoring dashboard

### 6. CI/CD Pipeline
- **Automated Testing**: Unit tests, integration tests
- **Model Validation**: Automated model quality checks
- **Deployment Automation**: Automated deployment pipeline
- **Rollback Capability**: Automatic rollback on failures
- **Environment Management**: Dev, staging, production environments

## Technical Stack

### Core Technologies
- **Python**: Primary programming language
- **Docker**: Containerization
- **Kubernetes**: Container orchestration
- **MLflow**: Experiment tracking and model registry
- **Apache Airflow**: Workflow orchestration
- **FastAPI**: API development
- **PostgreSQL**: Metadata storage
- **Redis**: Caching and message queuing

### Cloud Platform (Choose One)
- **AWS**: SageMaker, ECS, RDS, S3
- **GCP**: Vertex AI, GKE, Cloud SQL, Cloud Storage
- **Azure**: ML Studio, AKS, SQL Database, Blob Storage

### Monitoring Stack
- **Prometheus**: Metrics collection
- **Grafana**: Visualization and dashboards
- **Evidently**: ML model monitoring
- **ELK Stack**: Logging and analysis

## Deliverables

### 1. Complete MLOps Pipeline
- Working end-to-end pipeline
- Automated data processing
- Model training and deployment
- Monitoring and alerting

### 2. Documentation
- Architecture documentation
- API documentation
- Deployment guide
- User manual
- Troubleshooting guide

### 3. Code Repository
- Clean, well-structured code
- Comprehensive tests
- CI/CD configuration
- Docker configurations
- Kubernetes manifests

### 4. Monitoring Dashboard
- Real-time model performance
- Data quality metrics
- Infrastructure health
- Business KPIs
- Alert status

### 5. Presentation
- Problem statement and solution
- Architecture overview
- Demo of the pipeline
- Results and insights
- Lessons learned

## Evaluation Criteria

### Technical Implementation (40%)
- **Completeness**: All components implemented
- **Quality**: Clean, maintainable code
- **Performance**: Efficient and scalable
- **Reliability**: Robust error handling
- **Security**: Secure implementation

### MLOps Best Practices (30%)
- **Automation**: Minimal manual intervention
- **Reproducibility**: Consistent results
- **Monitoring**: Comprehensive monitoring
- **Versioning**: Proper version control
- **Documentation**: Clear documentation

### Business Value (20%)
- **Problem Solving**: Addresses real business need
- **Impact**: Measurable business impact
- **Usability**: User-friendly interface
- **Scalability**: Can handle growth
- **Cost Efficiency**: Optimized resource usage

### Innovation (10%)
- **Creative Solutions**: Novel approaches
- **Advanced Features**: Beyond basic requirements
- **Technology Usage**: Effective tool usage
- **Problem Complexity**: Challenging problem tackled

## Project Timeline (4 Weeks)

### Week 1: Setup and Data Pipeline
- Project setup and environment configuration
- Data pipeline development
- Data validation and quality checks
- Initial data exploration and analysis

### Week 2: Model Development and Training
- Feature engineering and selection
- Model development and experimentation
- Hyperparameter tuning and optimization
- Model validation and testing

### Week 3: Deployment and Infrastructure
- Model containerization and API development
- Kubernetes deployment configuration
- CI/CD pipeline setup
- Infrastructure monitoring setup

### Week 4: Monitoring and Finalization
- Model monitoring implementation
- Dashboard development
- Testing and bug fixes
- Documentation and presentation preparation

## Success Metrics

### Technical Metrics
- **Pipeline Success Rate**: >95% successful runs
- **API Response Time**: <200ms average
- **Model Accuracy**: Meets business requirements
- **System Uptime**: >99.9% availability
- **Test Coverage**: >80% code coverage

### Business Metrics
- **Time to Deploy**: <1 hour for new models
- **Mean Time to Recovery**: <15 minutes
- **Cost per Prediction**: Optimized costs
- **User Satisfaction**: Positive feedback
- **ROI**: Demonstrable return on investment`,
    codeSnippet: `# Complete MLOps Capstone Project Structure

# Project Structure
mlops-capstone/
├── data/
│   ├── raw/
│   ├── processed/
│   └── external/
├── models/
│   ├── experiments/
│   ├── production/
│   └── archived/
├── src/
│   ├── data/
│   │   ├── extract.py
│   │   ├── transform.py
│   │   └── validate.py
│   ├── models/
│   │   ├── train.py
│   │   ├── evaluate.py
│   │   └── predict.py
│   ├── api/
│   │   ├── main.py
│   │   ├── models.py
│   │   └── utils.py
│   └── monitoring/
│       ├── drift_detector.py
│       ├── performance_monitor.py
│       └── alerting.py
├── infrastructure/
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.training
│   │   └── docker-compose.yml
│   ├── kubernetes/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── ingress.yaml
│   └── terraform/
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── pipelines/
│   ├── airflow/
│   │   ├── dags/
│   │   └── plugins/
│   └── github-actions/
│       ├── ci.yml
│       └── cd.yml
├── monitoring/
│   ├── grafana/
│   │   └── dashboards/
│   ├── prometheus/
│   │   └── config/
│   └── evidently/
│       └── reports/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── deployment.md
├── requirements.txt
├── setup.py
├── README.md
└── .gitignore

# Example Implementation: Customer Churn Prediction Pipeline

# src/data/extract.py
import pandas as pd
import psycopg2
from sqlalchemy import create_engine
import logging

class DataExtractor:
    def __init__(self, db_config):
        self.db_config = db_config
        self.logger = logging.getLogger(__name__)
    
    def extract_customer_data(self, start_date, end_date):
        """Extract customer data from database"""
        query = """
        SELECT 
            customer_id,
            age,
            gender,
            tenure,
            monthly_charges,
            total_charges,
            contract_type,
            payment_method,
            churn_label
        FROM customers 
        WHERE created_date BETWEEN %s AND %s
        """
        
        engine = create_engine(self.db_config['connection_string'])
        df = pd.read_sql(query, engine, params=[start_date, end_date])
        
        self.logger.info(f"Extracted {len(df)} customer records")
        return df

# src/models/train.py
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report
import joblib

class ModelTrainer:
    def __init__(self, experiment_name="customer-churn"):
        mlflow.set_experiment(experiment_name)
        self.model = None
    
    def train(self, X, y, hyperparameters=None):
        """Train model with hyperparameter tuning"""
        
        with mlflow.start_run():
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Hyperparameter tuning
            if hyperparameters:
                model = RandomForestClassifier(random_state=42)
                grid_search = GridSearchCV(
                    model, hyperparameters, cv=5, scoring='f1'
                )
                grid_search.fit(X_train, y_train)
                self.model = grid_search.best_estimator_
                
                # Log best parameters
                mlflow.log_params(grid_search.best_params_)
            else:
                self.model = RandomForestClassifier(random_state=42)
                self.model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            
            # Log metrics
            mlflow.log_metric("accuracy", accuracy)
            mlflow.log_metric("train_size", len(X_train))
            mlflow.log_metric("test_size", len(X_test))
            
            # Log model
            mlflow.sklearn.log_model(
                self.model, 
                "model",
                registered_model_name="churn-predictor"
            )
            
            return self.model, accuracy

print("Complete MLOps capstone project structure ready!")`
};

export const week12Quiz = {
    title: 'Week 12 Quiz: MLOps and Production Deployment',
    questions: [
        {
            id: 1,
            question: 'What does MLOps stand for?',
            options: [
                'Machine Learning Operations',
                'Model Learning Optimization',
                'Multi-Level Operations',
                'Machine Logic Operations'
            ],
            correctAnswer: 0,
            explanation: 'MLOps stands for Machine Learning Operations, which combines ML, DevOps, and Data Engineering practices to deploy and maintain ML systems in production.'
        },
        {
            id: 2,
            question: 'Which deployment strategy involves running two identical production environments?',
            options: [
                'Canary deployment',
                'A/B testing',
                'Blue-Green deployment',
                'Shadow deployment'
            ],
            correctAnswer: 2,
            explanation: 'Blue-Green deployment uses two identical production environments (blue and green), allowing zero-downtime deployments by switching traffic between them.'
        },
        {
            id: 3,
            question: 'What is data drift in machine learning?',
            options: [
                'When model accuracy decreases over time',
                'When input data distribution changes from training data',
                'When the model becomes too complex',
                'When training data is corrupted'
            ],
            correctAnswer: 1,
            explanation: 'Data drift occurs when the statistical distribution of input data in production differs from the training data distribution, which can degrade model performance.'
        },
        {
            id: 4,
            question: 'Which tool is commonly used for ML experiment tracking?',
            options: [
                'Docker',
                'Kubernetes',
                'MLflow',
                'Terraform'
            ],
            correctAnswer: 2,
            explanation: 'MLflow is a popular open-source platform for managing the ML lifecycle, including experiment tracking, model versioning, and deployment.'
        },
        {
            id: 5,
            question: 'What is the purpose of model monitoring in production?',
            options: [
                'To train new models',
                'To detect performance degradation and data drift',
                'To store model artifacts',
                'To version control code'
            ],
            correctAnswer: 1,
            explanation: 'Model monitoring in production helps detect performance degradation, data drift, and other issues that could affect model reliability and accuracy.'
        },
        {
            id: 6,
            question: 'Which metric is commonly used to detect data drift?',
            options: [
                'Accuracy',
                'F1-score',
                'Population Stability Index (PSI)',
                'Mean Squared Error'
            ],
            correctAnswer: 2,
            explanation: 'Population Stability Index (PSI) is a statistical measure commonly used to detect changes in data distribution between training and production data.'
        },
        {
            id: 7,
            question: 'What is the main advantage of containerizing ML models?',
            options: [
                'Faster training',
                'Better accuracy',
                'Consistent deployment environment',
                'Reduced model size'
            ],
            correctAnswer: 2,
            explanation: 'Containerization ensures consistent deployment environments across different systems, making models portable and reducing deployment issues.'
        },
        {
            id: 8,
            question: 'In MLOps, what does CI/CD stand for?',
            options: [
                'Continuous Integration/Continuous Deployment',
                'Code Integration/Code Deployment',
                'Container Integration/Container Deployment',
                'Continuous Improvement/Continuous Development'
            ],
            correctAnswer: 0,
            explanation: 'CI/CD stands for Continuous Integration/Continuous Deployment, which automates the process of integrating code changes and deploying them to production.'
        },
        {
            id: 9,
            question: 'What is the purpose of a model registry?',
            options: [
                'To store training data',
                'To manage model versions and metadata',
                'To monitor model performance',
                'To deploy models to production'
            ],
            correctAnswer: 1,
            explanation: 'A model registry is a centralized repository for managing model versions, metadata, and lifecycle stages (staging, production, archived).'
        },
        {
            id: 10,
            question: 'Which retraining strategy updates the model continuously with new data?',
            options: [
                'Scheduled retraining',
                'Triggered retraining',
                'Online learning',
                'Batch retraining'
            ],
            correctAnswer: 2,
            explanation: 'Online learning continuously updates the model with new data samples as they arrive, keeping the model always up-to-date with the latest patterns.'
        }
    ]
};

export const week12Project = {
    title: 'Week 12 Capstone Project: Complete MLOps Pipeline',
    videoUrl: 'https://www.youtube.com/embed/YWjFPiHOH0s',
    notes: `# Week 12 Capstone Project: Complete MLOps Pipeline

This is your final capstone project where you'll build a complete end-to-end MLOps pipeline demonstrating all the concepts learned throughout the course.

## Project Deliverables

1. **Complete MLOps Pipeline**: Working end-to-end system
2. **Production Deployment**: Models deployed to cloud platform
3. **Monitoring Dashboard**: Real-time monitoring and alerting
4. **Documentation**: Comprehensive project documentation
5. **Presentation**: Demo and technical presentation

## Success Criteria

- All pipeline components working correctly
- Models deployed and serving predictions
- Monitoring system detecting drift and performance issues
- Clean, well-documented code
- Professional presentation of results

## Timeline: 4 Weeks

This capstone project represents the culmination of your AI/ML learning journey, demonstrating your ability to build production-ready machine learning systems.`,
    codeSnippet: `# Final Project Checklist

## Week 1: Setup and Data Pipeline ✓
- [ ] Project repository created
- [ ] Data pipeline implemented
- [ ] Data validation and quality checks
- [ ] Initial EDA and feature engineering

## Week 2: Model Development ✓
- [ ] Multiple models trained and compared
- [ ] Hyperparameter tuning completed
- [ ] Model validation and testing
- [ ] Best model selected

## Week 3: Deployment and Infrastructure ✓
- [ ] Model containerized with Docker
- [ ] API developed and tested
- [ ] Kubernetes deployment configured
- [ ] CI/CD pipeline implemented

## Week 4: Monitoring and Finalization ✓
- [ ] Monitoring system implemented
- [ ] Dashboard created
- [ ] Documentation completed
- [ ] Presentation prepared

## Final Submission Requirements
1. GitHub repository with complete code
2. Live deployed application
3. Monitoring dashboard
4. Technical documentation
5. 10-minute presentation video

print("MLOps Capstone Project - Ready to build the future of AI!")`
};