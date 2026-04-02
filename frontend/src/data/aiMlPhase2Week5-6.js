// AI/ML Phase 2 - Week 5-6: Classification Algorithms

// Week 5: Classification Algorithms

export const week5Lesson1 = {
    title: 'Introduction to Classification',
    videoUrl: 'https://www.youtube.com/embed/yIYKR4sgzI8',
    notes: `# Introduction to Classification

## What is Classification?

Classification is a supervised learning task where the goal is to predict discrete class labels for input data.

## Key Concepts

### Binary Classification
- Two possible classes (0 or 1, Yes or No, True or False)
- Examples: Spam detection, disease diagnosis, fraud detection

### Multi-class Classification
- More than two classes
- Examples: Digit recognition (0-9), image classification, sentiment analysis

### Multi-label Classification
- Multiple labels can be assigned to each instance
- Examples: Movie genres, article tags

## Classification vs Regression

| Classification | Regression |
|---------------|-----------|
| Predicts categories | Predicts continuous values |
| Output: Discrete | Output: Continuous |
| Example: Cat/Dog | Example: House price |

## Common Classification Algorithms

1. **Logistic Regression**
2. **K-Nearest Neighbors (KNN)**
3. **Decision Trees**
4. **Random Forests**
5. **Support Vector Machines (SVM)**
6. **Naive Bayes**
7. **Neural Networks**

## Classification Metrics

- **Accuracy**: Percentage of correct predictions
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1-Score**: Harmonic mean of precision and recall
- **Confusion Matrix**: Table showing prediction results`,
    codeSnippet: `import numpy as np
import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Load iris dataset (classic classification dataset)
iris = load_iris()
X = iris.data
y = iris.target

print(f"Dataset shape: {X.shape}")
print(f"Classes: {iris.target_names}")
print(f"Features: {iris.feature_names}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")
print(f"Class distribution: {np.bincount(y_train)}")`
};

export const week5Lesson2 = {
    title: 'Logistic Regression',
    videoUrl: 'https://www.youtube.com/embed/yIYKR4sgzI8',
    notes: `# Logistic Regression

## What is Logistic Regression?

Despite its name, logistic regression is a classification algorithm that predicts the probability of an instance belonging to a class.

## The Sigmoid Function

Logistic regression uses the sigmoid (logistic) function to map predictions to probabilities:

**σ(z) = 1 / (1 + e^(-z))**

Where z = w·X + b

Properties:
- Output range: 0 to 1
- S-shaped curve
- Threshold typically at 0.5

## Binary Classification

For binary classification:
- If σ(z) ≥ 0.5 → Class 1
- If σ(z) < 0.5 → Class 0

## Cost Function

Uses log loss (cross-entropy):

**J(w) = -1/m Σ[y·log(ŷ) + (1-y)·log(1-ŷ)]**

## Multi-class Classification

Two approaches:
1. **One-vs-Rest (OvR)**: Train one classifier per class
2. **Softmax Regression**: Generalization for multiple classes

## Advantages

- Simple and interpretable
- Probabilistic output
- Works well for linearly separable data
- Fast training and prediction

## Limitations

- Assumes linear decision boundary
- May underfit complex data
- Sensitive to outliers`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Load breast cancer dataset
data = load_breast_cancer()
X, y = data.data, data.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train model
model = LogisticRegression(max_iter=10000)
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)
y_pred_proba = model.predict_proba(X_test)

# Evaluate
accuracy = accuracy_score(y_test, y_pred)
print(f"Accuracy: {accuracy:.4f}")
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=data.target_names))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.show()

# Probability predictions
print(f"Sample probabilities: {y_pred_proba[:5]}")`
};

export const week5Lesson3 = {
    title: 'K-Nearest Neighbors (KNN)',
    videoUrl: 'https://www.youtube.com/embed/HVXime0nQeI',
    notes: `# K-Nearest Neighbors (KNN)

## How KNN Works

KNN is a simple, instance-based learning algorithm that classifies data points based on their nearest neighbors.

## Algorithm Steps

1. Choose the number K of neighbors
2. Calculate distance to all training samples
3. Find K nearest neighbors
4. For classification: Vote by majority class
5. For regression: Average of K neighbors

## Distance Metrics

### Euclidean Distance (most common)
d = √(Σ(xi - yi)²)

### Manhattan Distance
d = Σ|xi - yi|

### Minkowski Distance
Generalization of Euclidean and Manhattan

## Choosing K

- **Small K**: More sensitive to noise, complex boundaries
- **Large K**: Smoother boundaries, may miss patterns
- **Rule of thumb**: K = √n (where n is number of samples)
- Use cross-validation to find optimal K

## Advantages

- Simple to understand and implement
- No training phase (lazy learning)
- Works well with small datasets
- Naturally handles multi-class problems

## Disadvantages

- Slow prediction for large datasets
- Sensitive to feature scaling
- Curse of dimensionality
- Requires choosing K
- Memory intensive`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Split and scale
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Try different K values
k_values = range(1, 31)
train_scores = []
test_scores = []

for k in k_values:
    knn = KNeighborsClassifier(n_neighbors=k)
    knn.fit(X_train_scaled, y_train)
    
    train_scores.append(knn.score(X_train_scaled, y_train))
    test_scores.append(knn.score(X_test_scaled, y_test))

# Plot results
plt.figure(figsize=(10, 6))
plt.plot(k_values, train_scores, label='Training Accuracy')
plt.plot(k_values, test_scores, label='Test Accuracy')
plt.xlabel('K Value')
plt.ylabel('Accuracy')
plt.title('KNN: K Value vs Accuracy')
plt.legend()
plt.grid(True)
plt.show()

# Train with optimal K
optimal_k = 5
knn = KNeighborsClassifier(n_neighbors=optimal_k)
knn.fit(X_train_scaled, y_train)

# Evaluate
y_pred = knn.predict(X_test_scaled)
print(f"Optimal K: {optimal_k}")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred, target_names=iris.target_names))`
};

export const week5Lesson4 = {
    title: 'Decision Trees',
    videoUrl: 'https://www.youtube.com/embed/7VeUPuFGJHk',
    notes: `# Decision Trees

## What are Decision Trees?

Decision trees are tree-structured models that make decisions by asking a series of questions about features.

## Tree Structure

- **Root Node**: Top of tree, first decision
- **Internal Nodes**: Decision points
- **Branches**: Outcomes of decisions
- **Leaf Nodes**: Final predictions

## How Trees Split Data

### Information Gain (ID3, C4.5)
Measures reduction in entropy after split

**Entropy**: H(S) = -Σ p(c)·log₂(p(c))

### Gini Impurity (CART)
Measures probability of incorrect classification

**Gini**: G = 1 - Σ p(c)²

Lower values = purer nodes

## Building a Tree

1. Start with all data at root
2. Find best feature to split on
3. Split data based on feature
4. Repeat recursively for each branch
5. Stop when:
   - All samples in node are same class
   - Maximum depth reached
   - Minimum samples per node reached

## Hyperparameters

- **max_depth**: Maximum tree depth
- **min_samples_split**: Minimum samples to split
- **min_samples_leaf**: Minimum samples in leaf
- **max_features**: Features to consider for split

## Advantages

- Easy to understand and visualize
- Requires little data preparation
- Handles numerical and categorical data
- Non-parametric (no assumptions about data)

## Disadvantages

- Prone to overfitting
- Unstable (small changes → different tree)
- Biased toward dominant classes
- Can create complex trees`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# Load data
iris = load_iris()
X, y = iris.data, iris.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create decision tree
tree = DecisionTreeClassifier(
    max_depth=3,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)

tree.fit(X_train, y_train)

# Predictions
y_pred = tree.predict(X_test)

# Evaluate
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred, target_names=iris.target_names))

# Visualize tree
plt.figure(figsize=(20, 10))
plot_tree(
    tree,
    feature_names=iris.feature_names,
    class_names=iris.target_names,
    filled=True,
    rounded=True,
    fontsize=10
)
plt.title('Decision Tree Visualization')
plt.show()

# Feature importance
importances = tree.feature_importances_
for i, importance in enumerate(importances):
    print(f"{iris.feature_names[i]}: {importance:.4f}")`
};

export const week5Lesson5 = {
    title: 'Random Forests',
    videoUrl: 'https://www.youtube.com/embed/J4Wdy0Wc_xQ',
    notes: `# Random Forests

## What are Random Forests?

Random Forests are ensemble learning methods that combine multiple decision trees to create a more robust and accurate model.

## Ensemble Learning

Combines predictions from multiple models:
- **Bagging**: Bootstrap Aggregating
- **Boosting**: Sequential learning
- **Stacking**: Meta-learning

## How Random Forests Work

1. Create multiple bootstrap samples from training data
2. Train a decision tree on each sample
3. For each tree, use random subset of features
4. Make predictions by voting (classification) or averaging (regression)

## Bootstrap Sampling

- Sample with replacement
- Each tree sees different data
- Reduces overfitting
- Increases diversity

## Random Feature Selection

- Each split considers random subset of features
- Typically √n features for classification
- Decorrelates trees
- Improves generalization

## Out-of-Bag (OOB) Error

- Samples not used in bootstrap (~37%)
- Used for validation
- No need for separate validation set

## Hyperparameters

- **n_estimators**: Number of trees
- **max_depth**: Maximum tree depth
- **max_features**: Features per split
- **min_samples_split**: Minimum samples to split
- **bootstrap**: Use bootstrap sampling

## Advantages

- Reduces overfitting compared to single tree
- Handles large datasets well
- Provides feature importance
- Works well out-of-the-box
- Robust to outliers and noise

## Disadvantages

- Less interpretable than single tree
- Slower training and prediction
- Larger memory footprint
- Can overfit noisy datasets`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt

# Load data
data = load_breast_cancer()
X, y = data.data, data.target

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create Random Forest
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

rf.fit(X_train, y_train)

# Predictions
y_pred = rf.predict(X_test)

# Evaluate
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred, target_names=data.target_names))

# Cross-validation
cv_scores = cross_val_score(rf, X, y, cv=5)
print(f"CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# Feature importance
importances = rf.feature_importances_
indices = np.argsort(importances)[::-1]

plt.figure(figsize=(12, 6))
plt.title('Feature Importances')
plt.bar(range(10), importances[indices[:10]])
plt.xticks(range(10), [data.feature_names[i] for i in indices[:10]], rotation=45)
plt.tight_layout()
plt.show()

# OOB Score
rf_oob = RandomForestClassifier(n_estimators=100, oob_score=True, random_state=42)
rf_oob.fit(X_train, y_train)
print(f"OOB Score: {rf_oob.oob_score_:.4f}")`
};

export const week5Lesson6 = {
    title: 'Support Vector Machines (SVM)',
    videoUrl: 'https://www.youtube.com/embed/efR1C6CvhmE',
    notes: `# Support Vector Machines (SVM)

## What are SVMs?

SVMs are powerful classifiers that find the optimal hyperplane to separate classes with maximum margin.

## Key Concepts

### Hyperplane
- Decision boundary separating classes
- In 2D: Line
- In 3D: Plane
- In n-D: Hyperplane

### Support Vectors
- Data points closest to hyperplane
- Define the margin
- Critical for model

### Margin
- Distance between hyperplane and nearest points
- Goal: Maximize margin
- Larger margin = better generalization

## Linear SVM

For linearly separable data:
- Find hyperplane: w·x + b = 0
- Maximize margin: 2/||w||
- Subject to: yi(w·xi + b) ≥ 1

## Soft Margin SVM

For non-linearly separable data:
- Allow some misclassifications
- Introduce slack variables (ξ)
- C parameter controls trade-off

**Large C**: Hard margin, less tolerance
**Small C**: Soft margin, more tolerance

## Kernel Trick

Transform data to higher dimensions where it's linearly separable

### Common Kernels

1. **Linear**: K(x, y) = x·y
2. **Polynomial**: K(x, y) = (x·y + c)^d
3. **RBF (Gaussian)**: K(x, y) = exp(-γ||x-y||²)
4. **Sigmoid**: K(x, y) = tanh(γx·y + c)

## Hyperparameters

- **C**: Regularization parameter
- **kernel**: Kernel type
- **gamma**: Kernel coefficient (RBF, poly, sigmoid)
- **degree**: Polynomial degree

## Advantages

- Effective in high dimensions
- Memory efficient (uses support vectors)
- Versatile (different kernels)
- Works well with clear margin

## Disadvantages

- Slow for large datasets
- Sensitive to feature scaling
- Difficult to interpret
- Choosing right kernel is tricky`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import matplotlib.pyplot as plt

# Load data
data = load_breast_cancer()
X, y = data.data, data.target

# Split and scale (IMPORTANT for SVM!)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Try different kernels
kernels = ['linear', 'rbf', 'poly']
for kernel in kernels:
    svm = SVC(kernel=kernel, random_state=42)
    svm.fit(X_train_scaled, y_train)
    y_pred = svm.predict(X_test_scaled)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"{kernel.upper()} Kernel Accuracy: {accuracy:.4f}")

# Hyperparameter tuning with GridSearch
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.001, 0.01, 0.1],
    'kernel': ['rbf']
}

grid_search = GridSearchCV(SVC(), param_grid, cv=5, n_jobs=-1, verbose=1)
grid_search.fit(X_train_scaled, y_train)

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.4f}")

# Evaluate best model
best_svm = grid_search.best_estimator_
y_pred = best_svm.predict(X_test_scaled)
print(f"Test Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(classification_report(y_test, y_pred, target_names=data.target_names))`
};

export const week5Quiz = {
    title: 'Week 5 Quiz: Classification Algorithms',
    questions: [
        {
            id: 1,
            question: 'What is the main difference between classification and regression?',
            options: [
                'Classification predicts discrete categories, regression predicts continuous values',
                'Classification is faster than regression',
                'Regression uses more features than classification',
                'There is no difference'
            ],
            correctAnswer: 0,
            explanation: 'Classification predicts discrete class labels (categories), while regression predicts continuous numerical values.'
        },
        {
            id: 2,
            question: 'What does the sigmoid function in logistic regression output?',
            options: [
                'A class label',
                'A probability between 0 and 1',
                'A distance metric',
                'Feature importance'
            ],
            correctAnswer: 1,
            explanation: 'The sigmoid function maps any input to a value between 0 and 1, representing the probability of belonging to a class.'
        },
        {
            id: 3,
            question: 'In KNN, what happens if K is too small?',
            options: [
                'The model becomes more stable',
                'The model becomes sensitive to noise and may overfit',
                'Training becomes faster',
                'Accuracy always improves'
            ],
            correctAnswer: 1,
            explanation: 'A small K value makes the model sensitive to noise and outliers, potentially leading to overfitting with complex decision boundaries.'
        },
        {
            id: 4,
            question: 'What metric does a decision tree use to decide how to split data?',
            options: [
                'Mean Squared Error only',
                'Information Gain or Gini Impurity',
                'Euclidean Distance',
                'Correlation coefficient'
            ],
            correctAnswer: 1,
            explanation: 'Decision trees use Information Gain (based on entropy) or Gini Impurity to determine the best feature and threshold for splitting data.'
        },
        {
            id: 5,
            question: 'How does a Random Forest reduce overfitting compared to a single decision tree?',
            options: [
                'By using fewer features',
                'By combining predictions from multiple trees trained on different data subsets',
                'By always using maximum depth',
                'By removing all outliers'
            ],
            correctAnswer: 1,
            explanation: 'Random Forests use ensemble learning with bootstrap sampling and random feature selection, combining multiple trees to reduce overfitting and improve generalization.'
        },
        {
            id: 6,
            question: 'What is the purpose of the margin in Support Vector Machines?',
            options: [
                'To speed up training',
                'To maximize the distance between the decision boundary and the nearest data points',
                'To reduce the number of features',
                'To handle missing values'
            ],
            correctAnswer: 1,
            explanation: 'SVM aims to maximize the margin (distance) between the hyperplane and the nearest data points (support vectors) for better generalization.'
        },
        {
            id: 7,
            question: 'Why is feature scaling important for KNN and SVM?',
            options: [
                'It makes training faster',
                'Features with larger scales can dominate distance calculations',
                'It removes outliers',
                'It is not important'
            ],
            correctAnswer: 1,
            explanation: 'Both KNN and SVM use distance metrics. Without scaling, features with larger ranges will dominate the distance calculations, leading to poor performance.'
        },
        {
            id: 8,
            question: 'What does the C parameter control in SVM?',
            options: [
                'The number of support vectors',
                'The trade-off between margin size and classification errors',
                'The kernel type',
                'The learning rate'
            ],
            correctAnswer: 1,
            explanation: 'The C parameter controls the regularization strength, balancing between maximizing the margin and minimizing classification errors.'
        },
        {
            id: 9,
            question: 'What is bootstrap sampling in Random Forests?',
            options: [
                'Removing outliers from data',
                'Sampling with replacement to create different training sets',
                'Selecting the best features',
                'Pruning decision trees'
            ],
            correctAnswer: 1,
            explanation: 'Bootstrap sampling creates multiple training sets by sampling with replacement, allowing each tree to train on different data and increasing diversity.'
        },
        {
            id: 10,
            question: 'Which algorithm is considered "lazy learning"?',
            options: [
                'Logistic Regression',
                'Decision Trees',
                'K-Nearest Neighbors',
                'Random Forests'
            ],
            correctAnswer: 2,
            explanation: 'KNN is lazy learning because it does not build a model during training; it simply stores the data and makes predictions by finding nearest neighbors at prediction time.'
        }
    ]
};


// Week 6: Advanced Classification & Model Evaluation

export const week6Lesson1 = {
    title: 'Naive Bayes Classifier',
    videoUrl: 'https://www.youtube.com/embed/O2L2Uv9pdDA',
    notes: `# Naive Bayes Classifier

## What is Naive Bayes?

A probabilistic classifier based on Bayes' Theorem with the "naive" assumption that features are independent.

## Bayes' Theorem

**P(A|B) = P(B|A) × P(A) / P(B)**

For classification:

**P(class|features) = P(features|class) × P(class) / P(features)**

## The "Naive" Assumption

Assumes all features are independent given the class:

**P(x₁, x₂, ..., xₙ|class) = P(x₁|class) × P(x₂|class) × ... × P(xₙ|class)**

This simplifies calculations but rarely holds in reality.

## Types of Naive Bayes

### 1. Gaussian Naive Bayes
- For continuous features
- Assumes normal distribution
- Use case: Real-valued features

### 2. Multinomial Naive Bayes
- For discrete counts
- Use case: Text classification, word counts

### 3. Bernoulli Naive Bayes
- For binary features
- Use case: Document classification (word present/absent)

## Advantages

- Fast training and prediction
- Works well with small datasets
- Handles high-dimensional data
- Good for text classification
- Probabilistic predictions

## Disadvantages

- Independence assumption rarely true
- Zero probability problem
- Sensitive to irrelevant features
- Can be outperformed by other algorithms`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_iris, fetch_20newsgroups
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import GaussianNB, MultinomialNB
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics import accuracy_score, classification_report

# Example 1: Gaussian Naive Bayes for numerical data
iris = load_iris()
X, y = iris.data, iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

gnb = GaussianNB()
gnb.fit(X_train, y_train)
y_pred = gnb.predict(X_test)

print("Gaussian Naive Bayes:")
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")

# Example 2: Multinomial Naive Bayes for text
categories = ['alt.atheism', 'soc.religion.christian', 'comp.graphics', 'sci.med']
newsgroups = fetch_20newsgroups(subset='train', categories=categories)

# Convert text to word counts
vectorizer = CountVectorizer()
X_text = vectorizer.fit_transform(newsgroups.data)
y_text = newsgroups.target

X_train_text, X_test_text, y_train_text, y_test_text = train_test_split(
    X_text, y_text, test_size=0.2, random_state=42
)

mnb = MultinomialNB()
mnb.fit(X_train_text, y_train_text)
y_pred_text = mnb.predict(X_test_text)

print("Multinomial Naive Bayes (Text):")
print(f"Accuracy: {accuracy_score(y_test_text, y_pred_text):.4f}")

# Predict probabilities
sample_text = ["God is love", "Computer graphics are amazing"]
sample_vec = vectorizer.transform(sample_text)
probs = mnb.predict_proba(sample_vec)
print(f"Prediction probabilities: {probs}")`
};

export const week6Lesson2 = {
    title: 'Confusion Matrix & Metrics',
    videoUrl: 'https://www.youtube.com/embed/Kdsp6soqA7o',
    notes: `# Confusion Matrix & Classification Metrics

## Confusion Matrix

A table showing actual vs predicted classifications:

|                | Predicted Positive | Predicted Negative |
|----------------|-------------------|-------------------|
| Actual Positive| True Positive (TP) | False Negative (FN)|
| Actual Negative| False Positive (FP)| True Negative (TN) |

## Key Metrics

### Accuracy
**Accuracy = (TP + TN) / (TP + TN + FP + FN)**

- Overall correctness
- Can be misleading with imbalanced data

### Precision
**Precision = TP / (TP + FP)**

- Of predicted positives, how many are correct?
- Important when false positives are costly

### Recall (Sensitivity, True Positive Rate)
**Recall = TP / (TP + FN)**

- Of actual positives, how many did we find?
- Important when false negatives are costly

### F1-Score
**F1 = 2 × (Precision × Recall) / (Precision + Recall)**

- Harmonic mean of precision and recall
- Balances both metrics
- Good for imbalanced datasets

### Specificity (True Negative Rate)
**Specificity = TN / (TN + FP)**

- Of actual negatives, how many did we correctly identify?

## When to Use Which Metric?

### Use Precision when:
- False positives are costly
- Example: Spam detection (don't want to mark important emails as spam)

### Use Recall when:
- False negatives are costly
- Example: Disease detection (don't want to miss sick patients)

### Use F1-Score when:
- Need balance between precision and recall
- Dealing with imbalanced classes

## Multi-class Metrics

- **Macro Average**: Average metrics across classes (equal weight)
- **Weighted Average**: Weighted by class support
- **Micro Average**: Calculate globally`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    confusion_matrix, classification_report,
    accuracy_score, precision_score, recall_score, f1_score,
    ConfusionMatrixDisplay
)
import matplotlib.pyplot as plt

# Load data
data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
y_pred = rf.predict(X_test)

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("Confusion Matrix:")
print(cm)

# Visualize confusion matrix
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=data.target_names)
disp.plot(cmap='Blues')
plt.title('Confusion Matrix')
plt.show()

# Calculate metrics manually
tn, fp, fn, tp = cm.ravel()
print(f"True Positives: {tp}")
print(f"True Negatives: {tn}")
print(f"False Positives: {fp}")
print(f"False Negatives: {fn}")

# Metrics
accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)

print(f"Accuracy: {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall: {recall:.4f}")
print(f"F1-Score: {f1:.4f}")

# Detailed classification report
print("Classification Report:")
print(classification_report(y_test, y_pred, target_names=data.target_names))`
};

export const week6Lesson3 = {
    title: 'ROC Curve & AUC',
    videoUrl: 'https://www.youtube.com/embed/4jRBRDbJemM',
    notes: `# ROC Curve & AUC

## ROC Curve (Receiver Operating Characteristic)

A plot showing the trade-off between True Positive Rate (TPR) and False Positive Rate (FPR) at various threshold settings.

### Axes

- **X-axis**: False Positive Rate (FPR) = FP / (FP + TN)
- **Y-axis**: True Positive Rate (TPR) = TP / (TP + FN) = Recall

### How It Works

1. Model outputs probabilities
2. Try different thresholds (0 to 1)
3. Calculate TPR and FPR for each threshold
4. Plot the curve

## AUC (Area Under the Curve)

Measures the entire area under the ROC curve.

### Interpretation

- **AUC = 1.0**: Perfect classifier
- **AUC = 0.9-1.0**: Excellent
- **AUC = 0.8-0.9**: Good
- **AUC = 0.7-0.8**: Fair
- **AUC = 0.6-0.7**: Poor
- **AUC = 0.5**: Random guessing
- **AUC < 0.5**: Worse than random

## Advantages of ROC/AUC

- Threshold-independent
- Works well with imbalanced datasets
- Easy to compare models
- Probabilistic interpretation

## When to Use

- Binary classification
- When you need to choose optimal threshold
- Comparing multiple models
- Imbalanced datasets

## Precision-Recall Curve

Alternative to ROC for highly imbalanced datasets:
- X-axis: Recall
- Y-axis: Precision
- Better for rare positive class`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    roc_curve, roc_auc_score, auc,
    precision_recall_curve, average_precision_score,
    RocCurveDisplay, PrecisionRecallDisplay
)
import matplotlib.pyplot as plt

# Load data
data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train models
rf = RandomForestClassifier(n_estimators=100, random_state=42)
lr = LogisticRegression(max_iter=10000)

rf.fit(X_train, y_train)
lr.fit(X_train, y_train)

# Get probability predictions
y_pred_proba_rf = rf.predict_proba(X_test)[:, 1]
y_pred_proba_lr = lr.predict_proba(X_test)[:, 1]

# Calculate ROC curves
fpr_rf, tpr_rf, thresholds_rf = roc_curve(y_test, y_pred_proba_rf)
fpr_lr, tpr_lr, thresholds_lr = roc_curve(y_test, y_pred_proba_lr)

# Calculate AUC
auc_rf = roc_auc_score(y_test, y_pred_proba_rf)
auc_lr = roc_auc_score(y_test, y_pred_proba_lr)

# Plot ROC curves
plt.figure(figsize=(10, 6))
plt.plot(fpr_rf, tpr_rf, label=f'Random Forest (AUC = {auc_rf:.3f})')
plt.plot(fpr_lr, tpr_lr, label=f'Logistic Regression (AUC = {auc_lr:.3f})')
plt.plot([0, 1], [0, 1], 'k--', label='Random Guessing')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curves')
plt.legend()
plt.grid(True)
plt.show()

# Precision-Recall curve
precision_rf, recall_rf, _ = precision_recall_curve(y_test, y_pred_proba_rf)
ap_rf = average_precision_score(y_test, y_pred_proba_rf)

plt.figure(figsize=(10, 6))
plt.plot(recall_rf, precision_rf, label=f'Random Forest (AP = {ap_rf:.3f})')
plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title('Precision-Recall Curve')
plt.legend()
plt.grid(True)
plt.show()

print(f"Random Forest AUC: {auc_rf:.4f}")
print(f"Logistic Regression AUC: {auc_lr:.4f}")`
};

export const week6Lesson4 = {
    title: 'Handling Imbalanced Data',
    videoUrl: 'https://www.youtube.com/embed/X9MZtvvQDR4',
    notes: `# Handling Imbalanced Data

## What is Imbalanced Data?

When one class significantly outnumbers the other(s).

Examples:
- Fraud detection: 99.9% legitimate, 0.1% fraud
- Disease diagnosis: 95% healthy, 5% sick
- Spam detection: 90% ham, 10% spam

## Problems with Imbalanced Data

- Model biased toward majority class
- High accuracy but poor performance on minority class
- Misleading evaluation metrics
- Difficulty learning minority patterns

## Techniques to Handle Imbalance

### 1. Resampling

#### Oversampling (Increase minority class)
- **Random Oversampling**: Duplicate minority samples
- **SMOTE**: Synthetic Minority Over-sampling Technique
  - Creates synthetic samples
  - Interpolates between minority samples

#### Undersampling (Decrease majority class)
- **Random Undersampling**: Remove majority samples
- **Tomek Links**: Remove borderline majority samples
- **NearMiss**: Select majority samples close to minority

### 2. Class Weights

Assign higher weights to minority class:
- Penalizes misclassification of minority more
- Available in most sklearn classifiers
- \`class_weight='balanced'\`

### 3. Ensemble Methods

- **Balanced Random Forest**: Bootstrap with balanced samples
- **EasyEnsemble**: Multiple balanced subsets
- **BalancedBaggingClassifier**

### 4. Anomaly Detection

Treat minority class as anomalies:
- One-Class SVM
- Isolation Forest
- Local Outlier Factor

### 5. Evaluation Metrics

Use appropriate metrics:
- Precision, Recall, F1-Score
- ROC-AUC
- Precision-Recall AUC
- Avoid accuracy alone

## Best Practices

1. Try multiple techniques
2. Use stratified splits
3. Focus on minority class performance
4. Consider domain-specific costs
5. Combine techniques (e.g., SMOTE + undersampling)`,
    codeSnippet: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE, RandomOverSampler
from imblearn.under_sampling import RandomUnderSampler
from imblearn.combine import SMOTETomek
from collections import Counter

# Create imbalanced dataset
X, y = make_classification(
    n_samples=1000,
    n_features=20,
    n_classes=2,
    weights=[0.95, 0.05],  # 95% class 0, 5% class 1
    random_state=42
)

print(f"Original class distribution: {Counter(y)}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# 1. Baseline (no resampling)
rf_baseline = RandomForestClassifier(random_state=42)
rf_baseline.fit(X_train, y_train)
y_pred_baseline = rf_baseline.predict(X_test)

print("Baseline (No Resampling):")
print(classification_report(y_test, y_pred_baseline))

# 2. SMOTE (Oversampling)
smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)
print(f"After SMOTE: {Counter(y_train_smote)}")

rf_smote = RandomForestClassifier(random_state=42)
rf_smote.fit(X_train_smote, y_train_smote)
y_pred_smote = rf_smote.predict(X_test)

print("With SMOTE:")
print(classification_report(y_test, y_pred_smote))

# 3. Class Weights
rf_weighted = RandomForestClassifier(class_weight='balanced', random_state=42)
rf_weighted.fit(X_train, y_train)
y_pred_weighted = rf_weighted.predict(X_test)

print("With Class Weights:")
print(classification_report(y_test, y_pred_weighted))

# 4. Combined SMOTE + Tomek
smote_tomek = SMOTETomek(random_state=42)
X_train_combined, y_train_combined = smote_tomek.fit_resample(X_train, y_train)
print(f"After SMOTE+Tomek: {Counter(y_train_combined)}")

rf_combined = RandomForestClassifier(random_state=42)
rf_combined.fit(X_train_combined, y_train_combined)
y_pred_combined = rf_combined.predict(X_test)

print("With SMOTE+Tomek:")
print(classification_report(y_test, y_pred_combined))`
};

export const week6Lesson5 = {
    title: 'Hyperparameter Tuning',
    videoUrl: 'https://www.youtube.com/embed/5nYqK-HaoKY',
    notes: `# Hyperparameter Tuning

## What are Hyperparameters?

Parameters set before training that control the learning process (not learned from data).

Examples:
- Learning rate
- Number of trees in Random Forest
- K in KNN
- C and gamma in SVM

## Why Tune Hyperparameters?

- Default values may not be optimal
- Can significantly improve performance
- Different datasets need different settings
- Balance between bias and variance

## Tuning Methods

### 1. Grid Search

Exhaustive search over specified parameter grid:

**Pros:**
- Guaranteed to find best combination in grid
- Simple to understand

**Cons:**
- Computationally expensive
- Exponential growth with parameters
- May miss optimal values between grid points

### 2. Random Search

Random combinations from parameter distributions:

**Pros:**
- More efficient than grid search
- Can explore wider range
- Often finds good solutions faster

**Cons:**
- No guarantee of finding best
- May need many iterations

### 3. Bayesian Optimization

Uses probabilistic model to guide search:

**Pros:**
- More efficient than random search
- Learns from previous evaluations
- Good for expensive models

**Cons:**
- More complex
- Requires additional libraries

### 4. Halving Search

Successively halves candidates:

**Pros:**
- Much faster than grid search
- Focuses resources on promising candidates

**Cons:**
- May eliminate good candidates early

## Cross-Validation

Essential for hyperparameter tuning:
- Prevents overfitting to validation set
- More reliable performance estimates
- Typically use 5 or 10 folds

## Best Practices

1. Start with random search for exploration
2. Use grid search for fine-tuning
3. Always use cross-validation
4. Consider computational budget
5. Use stratified splits for classification
6. Log all experiments
7. Understand parameter effects`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import (
    train_test_split, GridSearchCV, RandomizedSearchCV,
    cross_val_score
)
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from scipy.stats import randint, uniform
import time

# Load data
data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 1. Grid Search
print("Grid Search:")
param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4]
}

grid_search = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=5,
    scoring='f1',
    n_jobs=-1,
    verbose=1
)

start = time.time()
grid_search.fit(X_train, y_train)
grid_time = time.time() - start

print(f"Best parameters: {grid_search.best_params_}")
print(f"Best CV score: {grid_search.best_score_:.4f}")
print(f"Time taken: {grid_time:.2f}s")

# 2. Random Search
print("Random Search:")
param_dist = {
    'n_estimators': randint(50, 300),
    'max_depth': [5, 10, 15, 20, None],
    'min_samples_split': randint(2, 20),
    'min_samples_leaf': randint(1, 10),
    'max_features': ['sqrt', 'log2', None]
}

random_search = RandomizedSearchCV(
    RandomForestClassifier(random_state=42),
    param_dist,
    n_iter=50,  # Number of random combinations
    cv=5,
    scoring='f1',
    n_jobs=-1,
    random_state=42,
    verbose=1
)

start = time.time()
random_search.fit(X_train, y_train)
random_time = time.time() - start

print(f"Best parameters: {random_search.best_params_}")
print(f"Best CV score: {random_search.best_score_:.4f}")
print(f"Time taken: {random_time:.2f}s")

# Compare on test set
grid_score = grid_search.score(X_test, y_test)
random_score = random_search.score(X_test, y_test)

print(f"Grid Search test score: {grid_score:.4f}")
print(f"Random Search test score: {random_score:.4f}")

# 3. Nested Cross-Validation (for unbiased estimate)
nested_scores = cross_val_score(
    grid_search,
    X, y,
    cv=5,
    scoring='f1'
)
print(f"Nested CV score: {nested_scores.mean():.4f} (+/- {nested_scores.std():.4f})")`
};

export const week6Lesson6 = {
    title: 'Ensemble Methods Deep Dive',
    videoUrl: 'https://www.youtube.com/embed/Un9zObFjBH0',
    notes: `# Ensemble Methods Deep Dive

## What are Ensemble Methods?

Combine multiple models to create a stronger predictor than any individual model.

**Wisdom of the Crowd**: Multiple weak learners → Strong learner

## Types of Ensemble Methods

### 1. Bagging (Bootstrap Aggregating)

**How it works:**
- Create multiple bootstrap samples
- Train model on each sample
- Aggregate predictions (vote/average)

**Examples:**
- Random Forest
- Bagged Decision Trees

**Advantages:**
- Reduces variance
- Prevents overfitting
- Parallel training

### 2. Boosting

**How it works:**
- Train models sequentially
- Each model focuses on previous errors
- Weighted combination of models

**Examples:**
- AdaBoost
- Gradient Boosting
- XGBoost
- LightGBM
- CatBoost

**Advantages:**
- Reduces bias and variance
- Often best performance
- Handles complex patterns

**Disadvantages:**
- Prone to overfitting
- Sensitive to noise
- Sequential (slower)

### 3. Stacking

**How it works:**
- Train multiple diverse models (base learners)
- Use predictions as features for meta-learner
- Meta-learner makes final prediction

**Advantages:**
- Combines strengths of different algorithms
- Can achieve best performance

**Disadvantages:**
- Complex to implement
- Risk of overfitting
- Computationally expensive

## Gradient Boosting

Most popular boosting algorithm:

1. Start with simple model (often decision stump)
2. Calculate residuals (errors)
3. Train new model to predict residuals
4. Add to ensemble with learning rate
5. Repeat

**Key Parameters:**
- **n_estimators**: Number of boosting stages
- **learning_rate**: Shrinks contribution of each tree
- **max_depth**: Tree complexity
- **subsample**: Fraction of samples per tree

## XGBoost

Optimized gradient boosting:
- Regularization (L1, L2)
- Parallel processing
- Tree pruning
- Built-in cross-validation
- Handles missing values

## When to Use What?

- **Random Forest**: Good default, robust
- **Gradient Boosting**: Maximum performance
- **XGBoost**: Large datasets, competitions
- **Stacking**: When you need best possible performance`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import (
    RandomForestClassifier, GradientBoostingClassifier,
    AdaBoostClassifier, VotingClassifier, StackingClassifier
)
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report
import xgboost as xgb

# Load data
data = load_breast_cancer()
X, y = data.data, data.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 1. Random Forest (Bagging)
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
rf_score = rf.score(X_test, y_test)
print(f"Random Forest: {rf_score:.4f}")

# 2. AdaBoost
ada = AdaBoostClassifier(n_estimators=100, random_state=42)
ada.fit(X_train, y_train)
ada_score = ada.score(X_test, y_test)
print(f"AdaBoost: {ada_score:.4f}")

# 3. Gradient Boosting
gb = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=3,
    random_state=42
)
gb.fit(X_train, y_train)
gb_score = gb.score(X_test, y_test)
print(f"Gradient Boosting: {gb_score:.4f}")

# 4. XGBoost
xgb_model = xgb.XGBClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=3,
    random_state=42
)
xgb_model.fit(X_train, y_train)
xgb_score = xgb_model.score(X_test, y_test)
print(f"XGBoost: {xgb_score:.4f}")

# 5. Voting Classifier (Ensemble of ensembles!)
voting = VotingClassifier(
    estimators=[
        ('rf', rf),
        ('gb', gb),
        ('xgb', xgb_model)
    ],
    voting='soft'  # Use probability predictions
)
voting.fit(X_train, y_train)
voting_score = voting.score(X_test, y_test)
print(f"Voting Classifier: {voting_score:.4f}")

# 6. Stacking
base_learners = [
    ('rf', RandomForestClassifier(n_estimators=50, random_state=42)),
    ('gb', GradientBoostingClassifier(n_estimators=50, random_state=42)),
    ('svc', SVC(probability=True, random_state=42))
]

stacking = StackingClassifier(
    estimators=base_learners,
    final_estimator=LogisticRegression(),
    cv=5
)
stacking.fit(X_train, y_train)
stacking_score = stacking.score(X_test, y_test)
print(f"Stacking: {stacking_score:.4f}")

# Compare all models
print("Summary:")
print(f"Random Forest:      {rf_score:.4f}")
print(f"AdaBoost:          {ada_score:.4f}")
print(f"Gradient Boosting: {gb_score:.4f}")
print(f"XGBoost:           {xgb_score:.4f}")
print(f"Voting:            {voting_score:.4f}")
print(f"Stacking:          {stacking_score:.4f}")`
};

export const week6Quiz = {
    title: 'Week 6 Quiz: Advanced Classification',
    questions: [
        {
            id: 1,
            question: 'What assumption does Naive Bayes make about features?',
            options: [
                'Features are correlated',
                'Features are independent given the class',
                'Features are normally distributed',
                'Features have equal importance'
            ],
            correctAnswer: 1,
            explanation: 'Naive Bayes assumes that all features are conditionally independent given the class label, which is the "naive" assumption that simplifies calculations.'
        },
        {
            id: 2,
            question: 'In a confusion matrix, what does a False Positive represent?',
            options: [
                'Correctly predicted positive',
                'Incorrectly predicted as positive when actually negative',
                'Incorrectly predicted as negative when actually positive',
                'Correctly predicted negative'
            ],
            correctAnswer: 1,
            explanation: 'A False Positive (Type I error) occurs when the model predicts positive but the actual class is negative.'
        },
        {
            id: 3,
            question: 'What does an AUC (Area Under ROC Curve) of 0.5 indicate?',
            options: [
                'Perfect classifier',
                'Good classifier',
                'Random guessing',
                'Worst possible classifier'
            ],
            correctAnswer: 2,
            explanation: 'An AUC of 0.5 indicates the model performs no better than random guessing, as the ROC curve would be a diagonal line.'
        },
        {
            id: 4,
            question: 'Which metric is most appropriate for highly imbalanced datasets?',
            options: [
                'Accuracy',
                'F1-Score or AUC',
                'Mean Squared Error',
                'R² Score'
            ],
            correctAnswer: 1,
            explanation: 'F1-Score balances precision and recall, and AUC is threshold-independent, making them better choices than accuracy for imbalanced datasets.'
        },
        {
            id: 5,
            question: 'What does SMOTE do to handle imbalanced data?',
            options: [
                'Removes majority class samples',
                'Creates synthetic minority class samples by interpolation',
                'Assigns higher weights to minority class',
                'Duplicates all samples'
            ],
            correctAnswer: 1,
            explanation: 'SMOTE (Synthetic Minority Over-sampling Technique) creates synthetic samples by interpolating between existing minority class samples.'
        },
        {
            id: 6,
            question: 'What is the main advantage of Random Search over Grid Search?',
            options: [
                'Always finds the best parameters',
                'More efficient and can explore wider parameter space',
                'Requires less memory',
                'Works only with tree-based models'
            ],
            correctAnswer: 1,
            explanation: 'Random Search is more efficient as it samples random combinations and can explore a wider parameter space in less time than exhaustive Grid Search.'
        },
        {
            id: 7,
            question: 'What is the key difference between Bagging and Boosting?',
            options: [
                'Bagging uses decision trees, Boosting uses neural networks',
                'Bagging trains models in parallel, Boosting trains sequentially focusing on errors',
                'Bagging is always better than Boosting',
                'There is no difference'
            ],
            correctAnswer: 1,
            explanation: 'Bagging trains models independently in parallel on bootstrap samples, while Boosting trains models sequentially where each model focuses on correcting previous errors.'
        },
        {
            id: 8,
            question: 'What does the learning rate control in Gradient Boosting?',
            options: [
                'The number of trees',
                'The contribution of each tree to the final prediction',
                'The depth of each tree',
                'The training speed'
            ],
            correctAnswer: 1,
            explanation: 'The learning rate (shrinkage) controls how much each tree contributes to the final prediction, with smaller values requiring more trees but often improving generalization.'
        },
        {
            id: 9,
            question: 'When should you use Precision as your primary metric?',
            options: [
                'When false negatives are very costly',
                'When false positives are very costly',
                'When classes are balanced',
                'Always'
            ],
            correctAnswer: 1,
            explanation: 'Precision is important when false positives are costly (e.g., spam detection where you don\'t want to mark important emails as spam).'
        },
        {
            id: 10,
            question: 'What is Stacking in ensemble learning?',
            options: [
                'Training multiple models and averaging their predictions',
                'Training models sequentially on errors',
                'Using predictions from base models as features for a meta-learner',
                'Combining only tree-based models'
            ],
            correctAnswer: 2,
            explanation: 'Stacking trains multiple diverse base models, then uses their predictions as input features for a meta-learner that makes the final prediction.'
        }
    ]
};
