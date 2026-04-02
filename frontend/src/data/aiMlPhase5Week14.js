// AI/ML Phase 5 - Week 14: Responsible AI & Ethics

export const week14Lesson1 = {
    title: 'AI Ethics and Bias',
    videoUrl: 'https://www.youtube.com/embed/59bMh59JQDo',
    notes: `# AI Ethics and Bias

## What is AI Ethics?

AI Ethics is the branch of ethics that examines the moral implications of artificial intelligence systems and their impact on society, individuals, and organizations.

## Types of Bias in AI

### 1. Historical Bias
- Bias present in training data due to past discrimination
- Example: Hiring algorithms trained on historical data reflecting gender bias
- Perpetuates existing societal inequalities

### 2. Representation Bias
- Occurs when certain groups are underrepresented in training data
- Example: Facial recognition systems performing poorly on darker skin tones
- Leads to unequal performance across different demographics

### 3. Measurement Bias
- Differences in data quality across groups
- Example: Different quality of medical data across socioeconomic groups
- Results in models that work better for some populations

### 4. Aggregation Bias
- Assuming one model fits all subgroups
- Example: Using same diabetes risk model for all ethnicities
- Ignores important group-specific differences

### 5. Evaluation Bias
- Using inappropriate benchmarks or metrics
- Example: Evaluating language models only on English text
- Fails to capture performance for all intended users

## Consequences of Biased AI

### Individual Impact
- Unfair treatment in hiring, lending, healthcare
- Reduced opportunities and access to services
- Psychological harm and discrimination

### Societal Impact
- Reinforcement of existing inequalities
- Erosion of trust in AI systems
- Legal and regulatory challenges
- Economic disparities

## Ethical Principles for AI

### 1. Fairness
- Equal treatment across different groups
- Non-discrimination in outcomes
- Procedural fairness in decision-making

### 2. Transparency
- Explainable AI decisions
- Clear communication about AI capabilities
- Open about limitations and uncertainties

### 3. Accountability
- Clear responsibility for AI decisions
- Mechanisms for redress and appeal
- Regular auditing and monitoring

### 4. Privacy
- Protection of personal data
- Consent for data usage
- Data minimization principles

### 5. Human Agency
- Meaningful human control over AI systems
- Preservation of human decision-making authority
- Right to human review of automated decisions`,
    codeSnippet: `# AI Bias Detection and Mitigation

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder
import warnings
warnings.filterwarnings('ignore')

print("="*60)
print("AI BIAS DETECTION AND MITIGATION")
print("="*60)

# Create synthetic dataset with potential bias
def create_biased_dataset():
    """Create a synthetic hiring dataset with gender bias"""
    np.random.seed(42)
    n_samples = 1000
    
    # Generate features
    data = {
        'experience_years': np.random.normal(5, 3, n_samples),
        'education_score': np.random.normal(75, 15, n_samples),
        'interview_score': np.random.normal(70, 20, n_samples),
        'gender': np.random.choice(['Male', 'Female'], n_samples, p=[0.6, 0.4])
    }
    
    df = pd.DataFrame(data)
    
    # Introduce bias: historically, males were hired more often
    # This creates a biased target variable
    hire_probability = 0.3 + 0.01 * df['experience_years'] + 0.005 * df['education_score']
    
    # Add gender bias (males have higher probability)
    gender_bias = np.where(df['gender'] == 'Male', 0.2, -0.1)
    hire_probability += gender_bias
    
    # Ensure probabilities are between 0 and 1
    hire_probability = np.clip(hire_probability, 0, 1)
    
    # Generate binary hiring decisions
    df['hired'] = np.random.binomial(1, hire_probability, n_samples)
    
    return df

# Bias detection functions
def detect_demographic_parity(y_true, y_pred, sensitive_attr):
    """Detect bias using demographic parity"""
    results = {}
    
    for group in sensitive_attr.unique():
        mask = sensitive_attr == group
        group_positive_rate = y_pred[mask].mean()
        results[group] = group_positive_rate
    
    return results

def detect_equalized_odds(y_true, y_pred, sensitive_attr):
    """Detect bias using equalized odds"""
    results = {}
    
    for group in sensitive_attr.unique():
        mask = sensitive_attr == group
        group_y_true = y_true[mask]
        group_y_pred = y_pred[mask]
        
        # True Positive Rate
        tpr = group_y_pred[group_y_true == 1].mean() if (group_y_true == 1).sum() > 0 else 0
        # False Positive Rate  
        fpr = group_y_pred[group_y_true == 0].mean() if (group_y_true == 0).sum() > 0 else 0
        
        results[group] = {'TPR': tpr, 'FPR': fpr}
    
    return results

# Create and analyze biased dataset
df = create_biased_dataset()

print("Dataset Overview:")
print(f"Total samples: {len(df)}")
print(f"Gender distribution: {df['gender'].value_counts().to_dict()}")
print(f"Overall hiring rate: {df['hired'].mean():.3f}")
print(f"Hiring rate by gender:")
for gender in df['gender'].unique():
    rate = df[df['gender'] == gender]['hired'].mean()
    print(f"  {gender}: {rate:.3f}")

print("\\nBias detected in historical data!")
print("Males have higher hiring rate despite similar qualifications")`
};

export const week14Lesson2 = {
    title: 'Fairness Metrics and Evaluation',
    videoUrl: 'https://www.youtube.com/embed/jIXIuYdnyyk',
    notes: `# Fairness Metrics and Evaluation

## Understanding Fairness in ML

Fairness in machine learning is not a single concept but encompasses multiple definitions and metrics, often with trade-offs between them.

## Key Fairness Metrics

### 1. Demographic Parity (Statistical Parity)
- **Definition**: Equal positive prediction rates across groups
- **Formula**: P(Ŷ = 1 | A = 0) = P(Ŷ = 1 | A = 1)
- **Use Case**: When equal representation in outcomes is desired
- **Example**: Equal loan approval rates for different ethnic groups

### 2. Equalized Odds
- **Definition**: Equal true positive and false positive rates across groups
- **Formula**: P(Ŷ = 1 | Y = y, A = 0) = P(Ŷ = 1 | Y = y, A = 1) for y ∈ {0,1}
- **Use Case**: When accuracy should be consistent across groups
- **Example**: Medical diagnosis accuracy should be equal across demographics

### 3. Equal Opportunity
- **Definition**: Equal true positive rates across groups
- **Formula**: P(Ŷ = 1 | Y = 1, A = 0) = P(Ŷ = 1 | Y = 1, A = 1)
- **Use Case**: When false negatives are particularly harmful
- **Example**: Equal detection rates for fraud across customer segments

### 4. Calibration
- **Definition**: Predicted probabilities reflect actual outcomes equally across groups
- **Formula**: P(Y = 1 | Ŷ = s, A = 0) = P(Y = 1 | Ŷ = s, A = 1) for all scores s
- **Use Case**: When probability estimates need to be reliable
- **Example**: Risk assessment tools should be equally calibrated

### 5. Individual Fairness
- **Definition**: Similar individuals should receive similar predictions
- **Formula**: d(f(x₁), f(x₂)) ≤ L × d(x₁, x₂)
- **Use Case**: When treating similar cases similarly is important
- **Example**: Similar job candidates should get similar hiring scores

## Fairness-Accuracy Trade-offs

### The Impossibility Theorem
- Perfect fairness across all metrics is often impossible
- Trade-offs must be made based on context and values
- Different stakeholders may prioritize different fairness criteria

### Choosing the Right Metric
1. **Consider the Domain**: Healthcare vs. hiring vs. criminal justice
2. **Identify Stakeholders**: Who is affected by the decisions?
3. **Understand Consequences**: What are the costs of different types of errors?
4. **Legal Requirements**: What does regulation require?
5. **Social Values**: What does society consider fair?

## Measuring Fairness in Practice

### Data Requirements
- Protected attributes (race, gender, age, etc.)
- Ground truth labels
- Model predictions
- Sufficient sample sizes for each group

### Statistical Tests
- Chi-square tests for independence
- Two-proportion z-tests
- Permutation tests
- Confidence intervals for fairness metrics

### Visualization Techniques
- Confusion matrices by group
- ROC curves by demographic
- Calibration plots
- Fairness dashboards`,
    codeSnippet: `# Fairness Metrics Implementation

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import confusion_matrix, roc_curve, auc
from sklearn.calibration import calibration_curve

class FairnessEvaluator:
    """Comprehensive fairness evaluation toolkit"""
    
    def __init__(self, y_true, y_pred, y_prob, sensitive_attr):
        self.y_true = y_true
        self.y_pred = y_pred
        self.y_prob = y_prob
        self.sensitive_attr = sensitive_attr
        self.groups = sensitive_attr.unique()
    
    def demographic_parity(self):
        """Calculate demographic parity difference"""
        rates = {}
        for group in self.groups:
            mask = self.sensitive_attr == group
            rates[group] = self.y_pred[mask].mean()
        
        # Calculate maximum difference
        max_diff = max(rates.values()) - min(rates.values())
        return rates, max_diff
    
    def equalized_odds(self):
        """Calculate equalized odds metrics"""
        results = {}
        
        for group in self.groups:
            mask = self.sensitive_attr == group
            tn, fp, fn, tp = confusion_matrix(
                self.y_true[mask], 
                self.y_pred[mask]
            ).ravel()
            
            tpr = tp / (tp + fn) if (tp + fn) > 0 else 0
            fpr = fp / (fp + tn) if (fp + tn) > 0 else 0
            
            results[group] = {'TPR': tpr, 'FPR': fpr}
        
        return results
    
    def equal_opportunity(self):
        """Calculate equal opportunity metric"""
        tpr_by_group = {}
        
        for group in self.groups:
            mask = self.sensitive_attr == group
            positive_mask = (self.y_true[mask] == 1)
            
            if positive_mask.sum() > 0:
                tpr = self.y_pred[mask][positive_mask].mean()
            else:
                tpr = 0
            
            tpr_by_group[group] = tpr
        
        max_diff = max(tpr_by_group.values()) - min(tpr_by_group.values())
        return tpr_by_group, max_diff
    
    def calibration_by_group(self, n_bins=10):
        """Calculate calibration metrics by group"""
        calibration_results = {}
        
        for group in self.groups:
            mask = self.sensitive_attr == group
            
            if mask.sum() > 0:
                fraction_pos, mean_pred = calibration_curve(
                    self.y_true[mask], 
                    self.y_prob[mask], 
                    n_bins=n_bins
                )
                
                # Calculate calibration error
                cal_error = np.mean(np.abs(fraction_pos - mean_pred))
                
                calibration_results[group] = {
                    'fraction_positive': fraction_pos,
                    'mean_predicted': mean_pred,
                    'calibration_error': cal_error
                }
        
        return calibration_results
    
    def generate_fairness_report(self):
        """Generate comprehensive fairness report"""
        print("="*60)
        print("FAIRNESS EVALUATION REPORT")
        print("="*60)
        
        # Demographic Parity
        dp_rates, dp_diff = self.demographic_parity()
        print(f"\\n1. DEMOGRAPHIC PARITY")
        print(f"   Positive rates by group:")
        for group, rate in dp_rates.items():
            print(f"     {group}: {rate:.3f}")
        print(f"   Maximum difference: {dp_diff:.3f}")
        print(f"   Fair threshold (≤0.1): {'✓' if dp_diff <= 0.1 else '✗'}")
        
        # Equal Opportunity
        eo_rates, eo_diff = self.equal_opportunity()
        print(f"\\n2. EQUAL OPPORTUNITY")
        print(f"   True positive rates by group:")
        for group, rate in eo_rates.items():
            print(f"     {group}: {rate:.3f}")
        print(f"   Maximum difference: {eo_diff:.3f}")
        print(f"   Fair threshold (≤0.1): {'✓' if eo_diff <= 0.1 else '✗'}")
        
        # Equalized Odds
        eq_odds = self.equalized_odds()
        print(f"\\n3. EQUALIZED ODDS")
        for group, metrics in eq_odds.items():
            print(f"   {group}: TPR={metrics['TPR']:.3f}, FPR={metrics['FPR']:.3f}")
        
        # Calibration
        calibration = self.calibration_by_group()
        print(f"\\n4. CALIBRATION")
        for group, cal_data in calibration.items():
            print(f"   {group}: Calibration error = {cal_data['calibration_error']:.3f}")

# Example usage
print("Fairness metrics implementation ready!")
print("Use FairnessEvaluator to assess model fairness across groups")`
};

export const week14Lesson3 = {
    title: 'Explainable AI (XAI)',
    videoUrl: 'https://www.youtube.com/embed/B-c8tIgchu0',
    notes: `# Explainable AI (XAI)

## What is Explainable AI?

Explainable AI (XAI) refers to methods and techniques that make AI model decisions transparent, interpretable, and understandable to humans.

## Why Do We Need Explainable AI?

### 1. Trust and Adoption
- Users need to understand AI decisions to trust them
- Builds confidence in AI systems
- Facilitates human-AI collaboration

### 2. Regulatory Compliance
- GDPR "right to explanation"
- Fair Credit Reporting Act requirements
- Medical device regulations
- Financial services compliance

### 3. Debugging and Improvement
- Identify model errors and biases
- Understand feature importance
- Guide model refinement
- Detect data quality issues

### 4. Ethical Responsibility
- Ensure fair and unbiased decisions
- Enable accountability
- Support human oversight
- Maintain human agency

## Types of Explainability

### 1. Global Explainability
- **Definition**: Understanding the overall model behavior
- **Methods**: Feature importance, partial dependence plots
- **Use Case**: Understanding what the model learned overall
- **Example**: "Credit scores are primarily based on payment history"

### 2. Local Explainability
- **Definition**: Understanding individual predictions
- **Methods**: LIME, SHAP, counterfactuals
- **Use Case**: Explaining specific decisions
- **Example**: "This loan was denied due to high debt-to-income ratio"

### 3. Intrinsic Interpretability
- **Definition**: Models that are inherently interpretable
- **Examples**: Linear regression, decision trees, rule-based systems
- **Pros**: Direct understanding of model logic
- **Cons**: May sacrifice accuracy for interpretability

### 4. Post-hoc Explainability
- **Definition**: Explanations added after model training
- **Examples**: LIME, SHAP, attention mechanisms
- **Pros**: Can be applied to any model
- **Cons**: May not reflect true model reasoning

## Popular XAI Techniques

### 1. LIME (Local Interpretable Model-agnostic Explanations)
- Explains individual predictions
- Creates local linear approximations
- Works with any model type
- Provides feature importance for specific instances

### 2. SHAP (SHapley Additive exPlanations)
- Based on game theory (Shapley values)
- Provides both local and global explanations
- Satisfies important mathematical properties
- Widely adopted in industry

### 3. Permutation Importance
- Measures feature importance by shuffling values
- Model-agnostic approach
- Shows impact of each feature on performance
- Easy to understand and implement

### 4. Partial Dependence Plots (PDP)
- Shows relationship between features and predictions
- Marginalizes over other features
- Helps understand feature effects
- Can reveal non-linear relationships

### 5. Counterfactual Explanations
- Shows what would need to change for different outcome
- Actionable insights for users
- Helps understand decision boundaries
- Useful for recourse and fairness

## Challenges in XAI

### 1. Accuracy vs. Interpretability Trade-off
- More complex models often more accurate but less interpretable
- Need to balance performance with explainability
- Context-dependent decisions

### 2. Explanation Quality
- Explanations may not reflect true model reasoning
- Risk of misleading or incorrect explanations
- Difficulty in validating explanation accuracy

### 3. User Understanding
- Different users need different types of explanations
- Technical vs. non-technical audiences
- Cultural and domain-specific considerations

### 4. Computational Cost
- Generating explanations can be expensive
- Real-time explanation requirements
- Scalability challenges`,
    codeSnippet: `# Explainable AI Implementation

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.datasets import load_breast_cancer
from sklearn.inspection import permutation_importance, partial_dependence
import shap
import lime
import lime.lime_tabular

print("="*60)
print("EXPLAINABLE AI (XAI) TECHNIQUES")
print("="*60)

# Load and prepare data
data = load_breast_cancer()
X, y = data.data, data.target
feature_names = data.feature_names

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print(f"Model accuracy: {model.score(X_test, y_test):.3f}")

# 1. Feature Importance (Global Explanation)
def analyze_feature_importance():
    """Analyze global feature importance"""
    print("\\n" + "="*50)
    print("1. FEATURE IMPORTANCE ANALYSIS")
    print("="*50)
    
    # Built-in feature importance
    importance = model.feature_importances_
    
    # Create importance dataframe
    importance_df = pd.DataFrame({
        'feature': feature_names,
        'importance': importance
    }).sort_values('importance', ascending=False)
    
    print("Top 10 Most Important Features:")
    for i, (_, row) in enumerate(importance_df.head(10).iterrows()):
        print(f"{i+1:2d}. {row['feature'][:30]:<30} {row['importance']:.4f}")
    
    return importance_df

# 2. Permutation Importance
def analyze_permutation_importance():
    """Analyze permutation-based feature importance"""
    print("\\n" + "="*50)
    print("2. PERMUTATION IMPORTANCE")
    print("="*50)
    
    # Calculate permutation importance
    perm_importance = permutation_importance(
        model, X_test, y_test, n_repeats=10, random_state=42
    )
    
    # Create importance dataframe
    perm_df = pd.DataFrame({
        'feature': feature_names,
        'importance_mean': perm_importance.importances_mean,
        'importance_std': perm_importance.importances_std
    }).sort_values('importance_mean', ascending=False)
    
    print("Top 10 Features by Permutation Importance:")
    for i, (_, row) in enumerate(perm_df.head(10).iterrows()):
        print(f"{i+1:2d}. {row['feature'][:30]:<30} {row['importance_mean']:.4f} ± {row['importance_std']:.4f}")
    
    return perm_df

# 3. SHAP Explanations
def analyze_shap_explanations():
    """Generate SHAP explanations"""
    print("\\n" + "="*50)
    print("3. SHAP EXPLANATIONS")
    print("="*50)
    
    # Create SHAP explainer
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X_test[:100])  # Analyze first 100 samples
    
    # For binary classification, use class 1 SHAP values
    if len(shap_values) == 2:
        shap_values_class1 = shap_values[1]
    else:
        shap_values_class1 = shap_values
    
    # Global feature importance from SHAP
    feature_importance = np.abs(shap_values_class1).mean(0)
    
    # Create importance dataframe
    shap_df = pd.DataFrame({
        'feature': feature_names,
        'shap_importance': feature_importance
    }).sort_values('shap_importance', ascending=False)
    
    print("Top 10 Features by SHAP Importance:")
    for i, (_, row) in enumerate(shap_df.head(10).iterrows()):
        print(f"{i+1:2d}. {row['feature'][:30]:<30} {row['shap_importance']:.4f}")
    
    # Local explanation for first sample
    print(f"\\nLocal SHAP explanation for first test sample:")
    print(f"Prediction: {'Malignant' if model.predict(X_test[:1])[0] == 0 else 'Benign'}")
    print(f"Prediction probability: {model.predict_proba(X_test[:1])[0].max():.3f}")
    
    # Show top contributing features for this sample
    sample_shap = shap_values_class1[0]
    sample_contributions = list(zip(feature_names, sample_shap))
    sample_contributions.sort(key=lambda x: abs(x[1]), reverse=True)
    
    print("Top 5 contributing features:")
    for i, (feature, contribution) in enumerate(sample_contributions[:5]):
        direction = "towards malignant" if contribution < 0 else "towards benign"
        print(f"{i+1}. {feature[:25]:<25} {contribution:+.4f} ({direction})")
    
    return shap_df

# 4. LIME Explanations
def analyze_lime_explanations():
    """Generate LIME explanations"""
    print("\\n" + "="*50)
    print("4. LIME EXPLANATIONS")
    print("="*50)
    
    # Create LIME explainer
    explainer = lime.lime_tabular.LimeTabularExplainer(
        X_train,
        feature_names=feature_names,
        class_names=['Malignant', 'Benign'],
        mode='classification'
    )
    
    # Explain first test sample
    explanation = explainer.explain_instance(
        X_test[0], 
        model.predict_proba, 
        num_features=10
    )
    
    print("LIME explanation for first test sample:")
    print(f"Prediction: {'Malignant' if model.predict(X_test[:1])[0] == 0 else 'Benign'}")
    print(f"Prediction probability: {model.predict_proba(X_test[:1])[0].max():.3f}")
    
    print("\\nTop contributing features (LIME):")
    for i, (feature, weight) in enumerate(explanation.as_list()[:5]):
        direction = "towards malignant" if weight < 0 else "towards benign"
        print(f"{i+1}. {feature:<40} {weight:+.4f} ({direction})")

# Run all analyses
importance_df = analyze_feature_importance()
perm_df = analyze_permutation_importance()
shap_df = analyze_shap_explanations()
analyze_lime_explanations()

print("\\n" + "="*60)
print("XAI ANALYSIS COMPLETE")
print("="*60)
print("Multiple explanation methods provide different perspectives on model behavior")
print("Use combination of techniques for comprehensive understanding")`
};

export const week14Lesson4 = {
    title: 'Privacy and Security in AI',
    videoUrl: 'https://www.youtube.com/embed/4zrU54VIK6k',
    notes: `# Privacy and Security in AI

## Privacy Challenges in AI

### 1. Data Collection and Consent
- **Informed Consent**: Users must understand how their data will be used
- **Purpose Limitation**: Data should only be used for stated purposes
- **Data Minimization**: Collect only necessary data
- **Consent Withdrawal**: Users should be able to revoke consent

### 2. Data Storage and Processing
- **Secure Storage**: Encryption at rest and in transit
- **Access Controls**: Role-based access to sensitive data
- **Data Retention**: Clear policies on how long data is kept
- **Cross-border Transfers**: Compliance with international regulations

### 3. Model Training Privacy
- **Training Data Exposure**: Models may memorize training examples
- **Inference Attacks**: Attackers can infer training data properties
- **Model Inversion**: Reconstructing training data from model outputs
- **Membership Inference**: Determining if data was used in training

## Privacy-Preserving Techniques

### 1. Differential Privacy
- **Definition**: Mathematical framework for privacy protection
- **Mechanism**: Add calibrated noise to data or model outputs
- **Guarantee**: Limits information leakage about individuals
- **Trade-off**: Privacy vs. utility balance

### 2. Federated Learning
- **Concept**: Train models without centralizing data
- **Process**: Models trained locally, only updates shared
- **Benefits**: Data stays on user devices
- **Challenges**: Communication overhead, heterogeneous data

### 3. Homomorphic Encryption
- **Capability**: Compute on encrypted data
- **Use Case**: Cloud computing without data exposure
- **Limitation**: Computational overhead
- **Applications**: Secure multi-party computation

### 4. Secure Multi-party Computation (SMC)
- **Goal**: Multiple parties compute jointly without revealing inputs
- **Techniques**: Secret sharing, garbled circuits
- **Applications**: Collaborative ML without data sharing
- **Example**: Banks training fraud detection together

## Security Threats in AI

### 1. Adversarial Attacks
- **Evasion Attacks**: Fool models at inference time
- **Poisoning Attacks**: Corrupt training data
- **Model Extraction**: Steal model functionality
- **Backdoor Attacks**: Hidden triggers in models

### 2. Data Poisoning
- **Label Flipping**: Change labels in training data
- **Feature Poisoning**: Modify input features
- **Availability Attacks**: Degrade model performance
- **Targeted Attacks**: Cause specific misclassifications

### 3. Model Inversion and Extraction
- **Model Inversion**: Reconstruct training data
- **Model Extraction**: Steal model parameters
- **API Abuse**: Extract model through queries
- **Intellectual Property Theft**: Unauthorized model copying

## Regulatory Landscape

### 1. GDPR (General Data Protection Regulation)
- **Right to Explanation**: Understand automated decisions
- **Data Portability**: Move data between services
- **Right to be Forgotten**: Delete personal data
- **Privacy by Design**: Build privacy into systems

### 2. CCPA (California Consumer Privacy Act)
- **Right to Know**: What data is collected
- **Right to Delete**: Remove personal information
- **Right to Opt-out**: Stop sale of personal data
- **Non-discrimination**: Equal service regardless of privacy choices

### 3. Sector-Specific Regulations
- **HIPAA**: Healthcare data protection
- **FERPA**: Educational records privacy
- **FCRA**: Fair credit reporting
- **SOX**: Financial data integrity

## Best Practices for AI Privacy and Security

### 1. Privacy by Design
- Proactive rather than reactive measures
- Privacy as the default setting
- Full functionality with privacy protection
- End-to-end security throughout system lifecycle

### 2. Data Governance
- Clear data classification schemes
- Regular privacy impact assessments
- Data lineage tracking
- Automated compliance monitoring

### 3. Technical Safeguards
- Encryption of data at rest and in transit
- Regular security audits and penetration testing
- Anomaly detection for unusual access patterns
- Secure development lifecycle practices

### 4. Organizational Measures
- Privacy training for all staff
- Clear incident response procedures
- Regular policy updates
- Third-party vendor assessments`,
    codeSnippet: `# Privacy-Preserving AI Techniques

import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import hashlib
import random

print("="*60)
print("PRIVACY-PRESERVING AI TECHNIQUES")
print("="*60)

# 1. Differential Privacy Implementation
class DifferentialPrivacy:
    """Simple differential privacy implementation"""
    
    def __init__(self, epsilon=1.0):
        self.epsilon = epsilon  # Privacy budget
    
    def add_laplace_noise(self, value, sensitivity=1.0):
        """Add Laplace noise for differential privacy"""
        scale = sensitivity / self.epsilon
        noise = np.random.laplace(0, scale)
        return value + noise
    
    def private_mean(self, data, sensitivity=None):
        """Calculate differentially private mean"""
        if sensitivity is None:
            sensitivity = (np.max(data) - np.min(data)) / len(data)
        
        true_mean = np.mean(data)
        private_mean = self.add_laplace_noise(true_mean, sensitivity)
        return private_mean
    
    def private_count(self, data, condition):
        """Calculate differentially private count"""
        true_count = np.sum(condition(data))
        private_count = self.add_laplace_noise(true_count, sensitivity=1.0)
        return max(0, private_count)  # Ensure non-negative

# 2. Data Anonymization Techniques
class DataAnonymizer:
    """Data anonymization and pseudonymization"""
    
    def __init__(self, salt="privacy_salt"):
        self.salt = salt
    
    def hash_identifier(self, identifier):
        """Hash personal identifiers"""
        combined = str(identifier) + self.salt
        return hashlib.sha256(combined.encode()).hexdigest()[:16]
    
    def k_anonymity(self, df, quasi_identifiers, k=3):
        """Implement k-anonymity by generalization"""
        anonymized_df = df.copy()
        
        for col in quasi_identifiers:
            if df[col].dtype in ['int64', 'float64']:
                # Numerical generalization - create bins
                anonymized_df[col] = pd.cut(df[col], bins=k, labels=False)
            else:
                # Categorical generalization - group rare categories
                value_counts = df[col].value_counts()
                rare_categories = value_counts[value_counts < k].index
                anonymized_df[col] = df[col].replace(rare_categories, 'Other')
        
        return anonymized_df
    
    def add_synthetic_noise(self, df, noise_level=0.1):
        """Add synthetic noise to numerical columns"""
        noisy_df = df.copy()
        
        for col in df.select_dtypes(include=[np.number]).columns:
            std = df[col].std()
            noise = np.random.normal(0, std * noise_level, len(df))
            noisy_df[col] = df[col] + noise
        
        return noisy_df

# 3. Federated Learning Simulation
class FederatedLearningSimulator:
    """Simulate federated learning process"""
    
    def __init__(self, n_clients=5):
        self.n_clients = n_clients
        self.global_model = None
        self.client_models = []
    
    def distribute_data(self, X, y):
        """Distribute data among clients"""
        n_samples = len(X)
        indices = np.random.permutation(n_samples)
        
        client_data = []
        samples_per_client = n_samples // self.n_clients
        
        for i in range(self.n_clients):
            start_idx = i * samples_per_client
            if i == self.n_clients - 1:  # Last client gets remaining samples
                end_idx = n_samples
            else:
                end_idx = (i + 1) * samples_per_client
            
            client_indices = indices[start_idx:end_idx]
            client_X = X[client_indices]
            client_y = y[client_indices]
            client_data.append((client_X, client_y))
        
        return client_data
    
    def train_local_models(self, client_data):
        """Train models locally on each client"""
        self.client_models = []
        
        for i, (X_client, y_client) in enumerate(client_data):
            model = RandomForestClassifier(n_estimators=50, random_state=i)
            model.fit(X_client, y_client)
            self.client_models.append(model)
            print(f"Client {i+1}: Trained on {len(X_client)} samples")
    
    def aggregate_models(self, X_test, y_test):
        """Aggregate client models (simple ensemble)"""
        if not self.client_models:
            raise ValueError("No client models to aggregate")
        
        # Simple ensemble - majority voting
        predictions = []
        for model in self.client_models:
            pred = model.predict(X_test)
            predictions.append(pred)
        
        # Majority vote
        predictions = np.array(predictions)
        ensemble_pred = []
        
        for i in range(len(X_test)):
            votes = predictions[:, i]
            ensemble_pred.append(np.bincount(votes).argmax())
        
        accuracy = accuracy_score(y_test, ensemble_pred)
        return ensemble_pred, accuracy

# Demonstration
print("\\n1. DIFFERENTIAL PRIVACY DEMO")
print("-" * 40)

# Generate sample data
np.random.seed(42)
sensitive_data = np.random.normal(50, 15, 1000)  # e.g., ages

dp = DifferentialPrivacy(epsilon=1.0)
true_mean = np.mean(sensitive_data)
private_mean = dp.private_mean(sensitive_data)

print(f"True mean: {true_mean:.2f}")
print(f"Private mean (ε=1.0): {private_mean:.2f}")
print(f"Noise added: {abs(true_mean - private_mean):.2f}")

print("\\n2. DATA ANONYMIZATION DEMO")
print("-" * 40)

# Create sample dataset
sample_data = pd.DataFrame({
    'user_id': [f'user_{i}' for i in range(100)],
    'age': np.random.randint(18, 80, 100),
    'income': np.random.normal(50000, 20000, 100),
    'city': np.random.choice(['NYC', 'LA', 'Chicago', 'Houston', 'Phoenix'], 100)
})

anonymizer = DataAnonymizer()

# Hash user IDs
sample_data['hashed_id'] = sample_data['user_id'].apply(anonymizer.hash_identifier)

# Apply k-anonymity
k_anon_data = anonymizer.k_anonymity(sample_data, ['age', 'city'], k=5)

print("Original data sample:")
print(sample_data[['user_id', 'age', 'city']].head())
print("\\nAnonymized data sample:")
print(k_anon_data[['hashed_id', 'age', 'city']].head())

print("\\n3. FEDERATED LEARNING DEMO")
print("-" * 40)

# Generate classification dataset
X, y = make_classification(n_samples=1000, n_features=20, n_classes=2, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Centralized learning baseline
centralized_model = RandomForestClassifier(n_estimators=100, random_state=42)
centralized_model.fit(X_train, y_train)
centralized_accuracy = centralized_model.score(X_test, y_test)

# Federated learning
fl_sim = FederatedLearningSimulator(n_clients=5)
client_data = fl_sim.distribute_data(X_train, y_train)
fl_sim.train_local_models(client_data)
_, federated_accuracy = fl_sim.aggregate_models(X_test, y_test)

print(f"Centralized learning accuracy: {centralized_accuracy:.3f}")
print(f"Federated learning accuracy: {federated_accuracy:.3f}")
print(f"Privacy preserved: Data never left client devices!")

print("\\n" + "="*60)
print("PRIVACY-PRESERVING AI DEMO COMPLETE")
print("="*60)`
};

export const week14Quiz = {
    title: 'Week 14 Quiz: Responsible AI & Ethics',
    questions: [
        {
            id: 1,
            question: 'Which type of bias occurs when certain groups are underrepresented in training data?',
            options: [
                'Historical bias',
                'Representation bias',
                'Measurement bias',
                'Aggregation bias'
            ],
            correctAnswer: 1,
            explanation: 'Representation bias occurs when certain groups are underrepresented in training data, leading to models that perform poorly for those underrepresented groups.'
        },
        {
            id: 2,
            question: 'What does demographic parity measure in fairness evaluation?',
            options: [
                'Equal accuracy across groups',
                'Equal positive prediction rates across groups',
                'Equal true positive rates across groups',
                'Equal calibration across groups'
            ],
            correctAnswer: 1,
            explanation: 'Demographic parity measures whether different groups receive positive predictions at equal rates, regardless of the actual ground truth.'
        },
        {
            id: 3,
            question: 'Which XAI technique is based on game theory and Shapley values?',
            options: [
                'LIME',
                'Permutation importance',
                'SHAP',
                'Partial dependence plots'
            ],
            correctAnswer: 2,
            explanation: 'SHAP (SHapley Additive exPlanations) is based on game theory and uses Shapley values to fairly distribute the contribution of each feature to a prediction.'
        },
        {
            id: 4,
            question: 'What is the main goal of differential privacy?',
            options: [
                'To encrypt all data',
                'To limit information leakage about individuals',
                'To remove all personal identifiers',
                'To prevent unauthorized access'
            ],
            correctAnswer: 1,
            explanation: 'Differential privacy aims to limit information leakage about individuals by adding calibrated noise to data or model outputs while preserving overall utility.'
        },
        {
            id: 5,
            question: 'In federated learning, what is shared between clients?',
            options: [
                'Raw training data',
                'Personal information',
                'Model updates/parameters',
                'Individual predictions'
            ],
            correctAnswer: 2,
            explanation: 'In federated learning, only model updates or parameters are shared between clients, while the raw training data remains on each client device, preserving privacy.'
        }
    ]
};