// AI/ML Phase 2 Notes - Weeks 4-7: Core Machine Learning

// Week 4: Supervised Learning - Regression

export const week4Lesson1 = {
    title: 'Introduction to Supervised Learning',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    notes: `# Introduction to Supervised Learning

## What is Supervised Learning?

Supervised learning is a type of machine learning where the model learns from labeled data - data that includes both input features and the correct output (label).

## Key Concepts

### Training Data
- **Features (X)**: Input variables used to make predictions
- **Labels (y)**: The correct output we want to predict
- **Training Set**: Data used to train the model
- **Test Set**: Data used to evaluate the model

### The Learning Process

\`\`\`
1. Feed training data (X, y) to the model
2. Model learns patterns and relationships
3. Model makes predictions on new data
4. Evaluate predictions against actual values
5. Adjust model to improve accuracy
\`\`\`

## Types of Supervised Learning

### 1. Regression
- Predict continuous values
- Examples: House prices, temperature, stock prices
- Output: Real numbers

### 2. Classification
- Predict discrete categories
- Examples: Spam/not spam, disease diagnosis
- Output: Class labels

## Common Algorithms

### Regression Algorithms:
- Linear Regression
- Polynomial Regression
- Ridge/Lasso Regression
- Support Vector Regression

### Classification Algorithms:
- Logistic Regression
- Decision Trees
- Random Forests
- Support Vector Machines
- Neural Networks

## The ML Workflow

\`\`\`
Data Collection → Data Preprocessing → Feature Selection
     ↓
Model Selection → Training → Evaluation
     ↓
Hyperparameter Tuning → Deployment
\`\`\``,
    codeSnippet: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Example: Preparing data for supervised learning

# Create sample dataset
np.random.seed(42)
X = np.random.randn(100, 3)  # 100 samples, 3 features
y = 2*X[:, 0] + 3*X[:, 1] - X[:, 2] + np.random.randn(100)*0.1

# Split into training and test sets
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Training set: {X_train.shape}")
print(f"Test set: {X_test.shape}")

# Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print(f"Original feature means: {X_train.mean(axis=0)}")
print(f"Scaled feature means: {X_train_scaled.mean(axis=0)}")
print(f"Scaled feature stds: {X_train_scaled.std(axis=0)}")`
};

export const week4Lesson2 = {
    title: 'Linear Regression - Theory',
    videoUrl: 'https://www.youtube.com/embed/7ArmBVF2dCs',
    notes: `# Linear Regression

## What is Linear Regression?

Linear regression is a supervised learning algorithm used to predict a continuous target variable based on one or more input features.

## Simple Linear Regression

Predicts target using one feature:

**Formula:** \`y = mx + b\`

Where:
- y = predicted value
- m = slope (weight)
- x = input feature
- b = intercept (bias)

## Multiple Linear Regression

Predicts target using multiple features:

**Formula:** \`y = w₁x₁ + w₂x₂ + ... + wₙxₙ + b\`

Or in vector form: \`y = w·X + b\`

## Key Assumptions

1. **Linearity**: Relationship between X and y is linear
2. **Independence**: Observations are independent
3. **Homoscedasticity**: Constant variance of errors
4. **Normality**: Errors are normally distributed
5. **No multicollinearity**: Features aren't highly correlated

## Cost Function (Mean Squared Error)

Measures how well the model fits the data:

**MSE = (1/n) Σ(yᵢ - ŷᵢ)²**

Where:
- yᵢ = actual value
- ŷᵢ = predicted value
- n = number of samples

## Goal

Find weights (w) and bias (b) that minimize the cost function.`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Generate sample data
np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 2.5 * X + 5 + np.random.randn(100, 1) * 2

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Make predictions
y_pred = model.predict(X)

# Model parameters
print(f"Slope (m): {model.coef_[0][0]:.2f}")
print(f"Intercept (b): {model.intercept_[0]:.2f}")

# Evaluate model
mse = mean_squared_error(y, y_pred)
r2 = r2_score(y, y_pred)

print(f"Mean Squared Error: {mse:.2f}")
print(f"R² Score: {r2:.2f}")

# Visualize
plt.figure(figsize=(10, 6))
plt.scatter(X, y, alpha=0.5, label='Actual')
plt.plot(X, y_pred, color='red', linewidth=2, label='Predicted')
plt.xlabel('X')
plt.ylabel('y')
plt.title('Linear Regression')
plt.legend()
plt.show()

# Make a prediction
new_X = np.array([[7.5]])
prediction = model.predict(new_X)
print(f"Prediction for X=7.5: {prediction[0][0]:.2f}")`
};

export const week4Lesson3 = {
    title: 'Implementing Linear Regression',
    videoUrl: 'https://www.youtube.com/embed/1-OGRohmH2s',
    notes: `# Implementing Linear Regression

## Using Scikit-Learn

Scikit-learn provides a simple and efficient implementation of linear regression.

## Steps to Build a Model

1. **Import libraries**
2. **Load and prepare data**
3. **Split into train/test sets**
4. **Create and train model**
5. **Make predictions**
6. **Evaluate performance**

## Evaluation Metrics

### Mean Squared Error (MSE)
Average of squared differences between predictions and actual values.

### Root Mean Squared Error (RMSE)
Square root of MSE, in same units as target variable.

### R² Score (Coefficient of Determination)
Proportion of variance explained by the model (0 to 1, higher is better).

### Mean Absolute Error (MAE)
Average of absolute differences, less sensitive to outliers than MSE.`,
    codeSnippet: `import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import matplotlib.pyplot as plt

# Generate sample data
np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 2.5 * X + 5 + np.random.randn(100, 1) * 2

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
y_pred = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
rmse = np.sqrt(mse)
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Model Coefficients:")
print(f"  Slope: {model.coef_[0][0]:.2f}")
print(f"  Intercept: {model.intercept_[0]:.2f}")
print(f"Performance Metrics:")
print(f"  MSE: {mse:.2f}")
print(f"  RMSE: {rmse:.2f}")
print(f"  MAE: {mae:.2f}")
print(f"  R² Score: {r2:.4f}")

# Visualize
plt.scatter(X_test, y_test, alpha=0.5, label='Actual')
plt.plot(X_test, y_pred, 'r-', linewidth=2, label='Predicted')
plt.xlabel('X')
plt.ylabel('y')
plt.legend()
plt.show()`
};

export const week4Lesson4 = {
    title: 'Gradient Descent',
    videoUrl: 'https://www.youtube.com/embed/sDv4f4s2SB8',
    notes: `# Gradient Descent

## What is Gradient Descent?

Gradient descent is an optimization algorithm used to minimize the cost function by iteratively adjusting model parameters.

## How It Works

1. Start with random parameter values
2. Calculate the cost function
3. Compute gradients (derivatives)
4. Update parameters in the direction that reduces cost
5. Repeat until convergence

## The Update Rule

**w = w - α * ∂J/∂w**

Where:
- w = parameter (weight)
- α = learning rate
- ∂J/∂w = gradient (partial derivative of cost)

## Learning Rate (α)

Controls the step size in each iteration:
- Too small: Slow convergence
- Too large: May overshoot minimum
- Typical values: 0.001 to 0.1

## Types of Gradient Descent

### 1. Batch Gradient Descent
- Uses entire dataset for each update
- Slow but stable
- Guaranteed to converge to global minimum (for convex functions)

### 2. Stochastic Gradient Descent (SGD)
- Uses one sample at a time
- Fast but noisy
- Can escape local minima

### 3. Mini-Batch Gradient Descent
- Uses small batches of data
- Balance between batch and SGD
- Most commonly used in practice`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt

# Generate sample data
np.random.seed(42)
X = 2 * np.random.rand(100, 1)
y = 4 + 3 * X + np.random.randn(100, 1)

# Add bias term
X_b = np.c_[np.ones((100, 1)), X]

# Gradient Descent implementation
def gradient_descent(X, y, learning_rate=0.01, iterations=1000):
    m = len(y)
    theta = np.random.randn(2, 1)  # Random initialization
    cost_history = []
    
    for i in range(iterations):
        # Predictions
        predictions = X.dot(theta)
        
        # Calculate error
        errors = predictions - y
        
        # Calculate gradients
        gradients = (2/m) * X.T.dot(errors)
        
        # Update parameters
        theta = theta - learning_rate * gradients
        
        # Calculate cost
        cost = (1/m) * np.sum(errors**2)
        cost_history.append(cost)
    
    return theta, cost_history

# Train model
theta, cost_history = gradient_descent(X_b, y, learning_rate=0.1, iterations=1000)

print(f"Learned parameters:")
print(f"  Intercept: {theta[0][0]:.2f}")
print(f"  Slope: {theta[1][0]:.2f}")

# Plot cost history
plt.figure(figsize=(10, 6))
plt.plot(cost_history)
plt.xlabel('Iteration')
plt.ylabel('Cost')
plt.title('Cost Function over Iterations')
plt.show()

# Make predictions
X_new = np.array([[0], [2]])
X_new_b = np.c_[np.ones((2, 1)), X_new]
y_predict = X_new_b.dot(theta)

# Visualize
plt.scatter(X, y)
plt.plot(X_new, y_predict, 'r-', linewidth=2)
plt.xlabel('X')
plt.ylabel('y')
plt.show()`
};

export const week4Lesson5 = {
    title: 'Polynomial Regression',
    videoUrl: 'https://www.youtube.com/embed/Toet3EiSFcM',
    notes: `# Polynomial Regression

## What is Polynomial Regression?

Polynomial regression extends linear regression by adding polynomial terms to capture non-linear relationships.

## Formula

**y = w₀ + w₁x + w₂x² + w₃x³ + ... + wₙxⁿ**

Where n is the degree of the polynomial.

## When to Use

- Data shows curved patterns
- Linear regression underfits
- Relationship is non-linear but smooth

## Polynomial Features

Transform features to include polynomial terms:

For feature x:
- Degree 1: x
- Degree 2: x, x²
- Degree 3: x, x², x³

For features x₁, x₂ with degree 2:
- x₁, x₂, x₁², x₁x₂, x₂²

## Choosing the Degree

- **Too low**: Underfitting (high bias)
- **Too high**: Overfitting (high variance)
- Use cross-validation to find optimal degree

## Regularization

Important for polynomial regression to prevent overfitting:
- Ridge Regression (L2)
- Lasso Regression (L1)`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# Generate non-linear data
np.random.seed(42)
X = np.sort(np.random.rand(100, 1) * 10, axis=0)
y = 0.5 * X**2 - 3 * X + 5 + np.random.randn(100, 1) * 5

# Try different polynomial degrees
degrees = [1, 2, 3, 5, 10]
plt.figure(figsize=(15, 10))

for i, degree in enumerate(degrees, 1):
    # Create polynomial features
    poly_features = PolynomialFeatures(degree=degree, include_bias=False)
    X_poly = poly_features.fit_transform(X)
    
    # Train model
    model = LinearRegression()
    model.fit(X_poly, y)
    
    # Make predictions
    X_test = np.linspace(0, 10, 100).reshape(-1, 1)
    X_test_poly = poly_features.transform(X_test)
    y_pred = model.predict(X_test_poly)
    
    # Calculate R² score
    y_train_pred = model.predict(X_poly)
    r2 = r2_score(y, y_train_pred)
    
    # Plot
    plt.subplot(2, 3, i)
    plt.scatter(X, y, alpha=0.5)
    plt.plot(X_test, y_pred, 'r-', linewidth=2)
    plt.title(f'Degree {degree} (R²={r2:.3f})')
    plt.xlabel('X')
    plt.ylabel('y')

plt.tight_layout()
plt.show()

# Best practice: Use degree 2 for this data
poly_features = PolynomialFeatures(degree=2)
X_poly = poly_features.fit_transform(X)
model = LinearRegression()
model.fit(X_poly, y)

print(f"Polynomial features: {poly_features.get_feature_names_out()}")
print(f"Coefficients: {model.coef_[0]}")
print(f"R² Score: {r2_score(y, model.predict(X_poly)):.4f}")`
};

export const week4Lesson6 = {
    title: 'Regularization Techniques',
    videoUrl: 'https://www.youtube.com/embed/Q81RR3yKn30',
    notes: `# Regularization Techniques

## What is Regularization?

Regularization adds a penalty term to the cost function to prevent overfitting by constraining model complexity.

## The Overfitting Problem

- Model learns training data too well
- Captures noise instead of patterns
- Poor performance on new data

## Ridge Regression (L2 Regularization)

Adds squared magnitude of coefficients to cost function:

**Cost = MSE + α Σw²**

- Shrinks coefficients toward zero
- Keeps all features
- α controls regularization strength

## Lasso Regression (L1 Regularization)

Adds absolute magnitude of coefficients:

**Cost = MSE + α Σ|w|**

- Can shrink coefficients to exactly zero
- Performs feature selection
- Creates sparse models

## Elastic Net

Combines L1 and L2:

**Cost = MSE + α₁ Σ|w| + α₂ Σw²**

- Benefits of both Ridge and Lasso
- More stable than Lasso

## Choosing Regularization Strength (α)

- α = 0: No regularization (standard regression)
- Small α: Slight regularization
- Large α: Strong regularization
- Use cross-validation to find optimal α`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import Ridge, Lasso, ElasticNet, LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

# Generate data with noise
np.random.seed(42)
X = np.sort(np.random.rand(100, 1) * 10, axis=0)
y = 0.5 * X**2 - 3 * X + 5 + np.random.randn(100, 1) * 10

# Create polynomial features (degree 10 - prone to overfitting)
poly = PolynomialFeatures(degree=10)
X_poly = poly.fit_transform(X)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X_poly, y, test_size=0.2, random_state=42
)

# Train different models
models = {
    'Linear': LinearRegression(),
    'Ridge (α=1)': Ridge(alpha=1),
    'Ridge (α=10)': Ridge(alpha=10),
    'Lasso (α=0.1)': Lasso(alpha=0.1),
    'ElasticNet': ElasticNet(alpha=0.1, l1_ratio=0.5)
}

results = {}
for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    results[name] = mse
    print(f"{name:20} - MSE: {mse:.2f}")

# Visualize coefficient magnitudes
plt.figure(figsize=(12, 6))
for i, (name, model) in enumerate(models.items(), 1):
    plt.subplot(2, 3, i)
    plt.bar(range(len(model.coef_[0])), np.abs(model.coef_[0]))
    plt.title(f'{name}')
    plt.xlabel('Feature')
    plt.ylabel('|Coefficient|')
    plt.yscale('log')

plt.tight_layout()
plt.show()

# Cross-validation for optimal alpha
from sklearn.linear_model import RidgeCV
alphas = [0.001, 0.01, 0.1, 1, 10, 100]
ridge_cv = RidgeCV(alphas=alphas, cv=5)
ridge_cv.fit(X_train, y_train)
print(f"Optimal alpha: {ridge_cv.alpha_}")`
};

export const week4Lesson7 = {
    title: 'Model Evaluation and Validation',
    videoUrl: 'https://www.youtube.com/embed/fSytzGwwBVw',
    notes: `# Model Evaluation and Validation

## Why Evaluate Models?

- Assess performance on unseen data
- Compare different models
- Detect overfitting/underfitting
- Ensure model generalizes well

## Train-Test Split

Split data into:
- **Training set** (70-80%): Train the model
- **Test set** (20-30%): Evaluate performance

## Cross-Validation

More robust evaluation method:

### K-Fold Cross-Validation
1. Split data into K folds
2. Train on K-1 folds, test on 1 fold
3. Repeat K times
4. Average the results

Benefits:
- Uses all data for training and testing
- Reduces variance in performance estimates
- Better for small datasets

## Regression Metrics

### Mean Squared Error (MSE)
- Average squared difference
- Penalizes large errors heavily
- Same units as y²

### Root Mean Squared Error (RMSE)
- Square root of MSE
- Same units as y
- Easier to interpret

### Mean Absolute Error (MAE)
- Average absolute difference
- Less sensitive to outliers
- Same units as y

### R² Score
- Proportion of variance explained
- Range: 0 to 1 (can be negative)
- 1 = perfect fit, 0 = no better than mean

## Bias-Variance Tradeoff

### High Bias (Underfitting)
- Model too simple
- Poor training and test performance
- Solution: Increase complexity

### High Variance (Overfitting)
- Model too complex
- Good training, poor test performance
- Solution: Regularization, more data`,
    codeSnippet: `import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score, KFold
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt

# Generate data
np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 2.5 * X + 5 + np.random.randn(100, 1) * 2

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predictions
y_train_pred = model.predict(X_train)
y_test_pred = model.predict(X_test)

# Evaluate on training set
print("Training Set Performance:")
print(f"  MSE: {mean_squared_error(y_train, y_train_pred):.2f}")
print(f"  RMSE: {np.sqrt(mean_squared_error(y_train, y_train_pred)):.2f}")
print(f"  MAE: {mean_absolute_error(y_train, y_train_pred):.2f}")
print(f"  R²: {r2_score(y_train, y_train_pred):.4f}")

# Evaluate on test set
print("Test Set Performance:")
print(f"  MSE: {mean_squared_error(y_test, y_test_pred):.2f}")
print(f"  RMSE: {np.sqrt(mean_squared_error(y_test, y_test_pred)):.2f}")
print(f"  MAE: {mean_absolute_error(y_test, y_test_pred):.2f}")
print(f"  R²: {r2_score(y_test, y_test_pred):.4f}")

# K-Fold Cross-Validation
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(
    model, X, y.ravel(), 
    cv=kfold, 
    scoring='r2'
)

print(f"Cross-Validation R² Scores: {cv_scores}")
print(f"Mean CV R²: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# Compare models with different complexities
degrees = [1, 2, 3, 5, 10]
train_scores = []
test_scores = []

for degree in degrees:
    poly = PolynomialFeatures(degree=degree)
    X_poly = poly.fit_transform(X)
    X_train_poly, X_test_poly, y_train, y_test = train_test_split(
        X_poly, y, test_size=0.2, random_state=42
    )
    
    model = Ridge(alpha=1)
    model.fit(X_train_poly, y_train)
    
    train_scores.append(r2_score(y_train, model.predict(X_train_poly)))
    test_scores.append(r2_score(y_test, model.predict(X_test_poly)))

# Plot learning curves
plt.figure(figsize=(10, 6))
plt.plot(degrees, train_scores, 'o-', label='Training Score')
plt.plot(degrees, test_scores, 's-', label='Test Score')
plt.xlabel('Polynomial Degree')
plt.ylabel('R² Score')
plt.title('Model Complexity vs Performance')
plt.legend()
plt.grid(True)
plt.show()`
};

export const week4Quiz = {
    title: 'Week 4 Quiz: Supervised Learning & Regression',
    questions: [
        {
            id: 1,
            question: 'What is the main difference between regression and classification?',
            options: [
                'Regression predicts continuous values, classification predicts categories',
                'Regression is faster than classification',
                'Classification uses more data than regression',
                'There is no difference'
            ],
            correctAnswer: 0,
            explanation: 'Regression predicts continuous numerical values (e.g., prices, temperatures), while classification predicts discrete categories or classes (e.g., spam/not spam).'
        },
        {
            id: 2,
            question: 'In linear regression, what does the cost function (MSE) measure?',
            options: [
                'The speed of the algorithm',
                'The average squared difference between predictions and actual values',
                'The number of features in the dataset',
                'The correlation between features'
            ],
            correctAnswer: 1,
            explanation: 'Mean Squared Error (MSE) measures the average of the squared differences between predicted and actual values, indicating how well the model fits the data.'
        },
        {
            id: 3,
            question: 'What is the purpose of gradient descent?',
            options: [
                'To split data into training and test sets',
                'To minimize the cost function by adjusting parameters',
                'To add more features to the dataset',
                'To remove outliers from data'
            ],
            correctAnswer: 1,
            explanation: 'Gradient descent is an optimization algorithm that iteratively adjusts model parameters to minimize the cost function and improve model performance.'
        },
        {
            id: 4,
            question: 'What happens if the learning rate in gradient descent is too large?',
            options: [
                'The algorithm converges faster',
                'The algorithm may overshoot the minimum and fail to converge',
                'The model becomes more accurate',
                'Nothing changes'
            ],
            correctAnswer: 1,
            explanation: 'A learning rate that is too large can cause the algorithm to take steps that are too big, potentially overshooting the minimum and preventing convergence.'
        },
        {
            id: 5,
            question: 'When should you use polynomial regression instead of linear regression?',
            options: [
                'When you have more than 100 data points',
                'When the relationship between variables is non-linear',
                'When you want faster training',
                'When you have categorical features'
            ],
            correctAnswer: 1,
            explanation: 'Polynomial regression is used when the relationship between features and target is non-linear, as it can capture curved patterns that linear regression cannot.'
        },
        {
            id: 6,
            question: 'What is the main purpose of regularization in regression?',
            options: [
                'To speed up training',
                'To prevent overfitting by penalizing large coefficients',
                'To add more features',
                'To remove missing values'
            ],
            correctAnswer: 1,
            explanation: 'Regularization adds a penalty term to the cost function to constrain model complexity and prevent overfitting by discouraging large coefficient values.'
        },
        {
            id: 7,
            question: 'What is the key difference between Ridge (L2) and Lasso (L1) regularization?',
            options: [
                'Ridge is faster than Lasso',
                'Lasso can shrink coefficients to exactly zero, performing feature selection',
                'Ridge requires more data than Lasso',
                'There is no difference'
            ],
            correctAnswer: 1,
            explanation: 'Lasso (L1) can shrink coefficients to exactly zero, effectively performing feature selection, while Ridge (L2) only shrinks coefficients toward zero but keeps all features.'
        },
        {
            id: 8,
            question: 'What does an R² score of 0.85 indicate?',
            options: [
                'The model is 85% accurate',
                'The model explains 85% of the variance in the target variable',
                'There are 85% errors in predictions',
                'The model needs 85% more data'
            ],
            correctAnswer: 1,
            explanation: 'R² (coefficient of determination) represents the proportion of variance in the dependent variable that is explained by the model. 0.85 means 85% of the variance is explained.'
        },
        {
            id: 9,
            question: 'Why is cross-validation better than a single train-test split?',
            options: [
                'It trains the model faster',
                'It uses all data for both training and testing, providing more reliable performance estimates',
                'It requires less data',
                'It automatically selects the best features'
            ],
            correctAnswer: 1,
            explanation: 'Cross-validation uses all data for both training and testing across multiple folds, providing more robust and reliable performance estimates than a single split.'
        },
        {
            id: 10,
            question: 'What indicates overfitting in a regression model?',
            options: [
                'High training error and high test error',
                'Low training error but high test error',
                'High training error but low test error',
                'Low training error and low test error'
            ],
            correctAnswer: 1,
            explanation: 'Overfitting occurs when a model performs very well on training data (low error) but poorly on test data (high error), indicating it has memorized the training data rather than learning generalizable patterns.'
        }
    ]
};
