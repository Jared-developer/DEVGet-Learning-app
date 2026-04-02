// AI/ML Course - Week Projects

export const week1Project = {
    title: 'Week 1 Project: Python Data Analysis Tool',
    videoUrl: 'https://www.youtube.com/embed/rfscVS0vtbw',
    notes: `# Week 1 Project: Python Data Analysis Tool

## Project Overview

Build a command-line data analysis tool that reads CSV files and provides statistical insights.

## Objectives

- Apply Python fundamentals
- Work with file I/O
- Implement data structures
- Create reusable functions

## Requirements

### 1. File Reading
- Read CSV files
- Handle file errors gracefully
- Support different delimiters

### 2. Data Analysis Features
- Calculate mean, median, mode
- Find min, max, range
- Count unique values
- Detect missing data

### 3. User Interface
- Command-line menu
- Clear output formatting
- Error handling

### 4. Code Quality
- Use functions for modularity
- Add docstrings
- Follow PEP 8 style guide

## Deliverables

1. Python script (\`data_analyzer.py\`)
2. Sample CSV file for testing
3. README with usage instructions
4. Comments explaining your code

## Bonus Challenges

- Add data visualization with matplotlib
- Export results to JSON
- Support multiple file formats
- Create summary statistics report`,
    codeSnippet: `import csv
import statistics
from collections import Counter

class DataAnalyzer:
    def __init__(self, filename):
        """Initialize the analyzer with a CSV file."""
        self.filename = filename
        self.data = []
        self.headers = []
        
    def load_data(self):
        """Load data from CSV file."""
        try:
            with open(self.filename, 'r') as file:
                reader = csv.DictReader(file)
                self.headers = reader.fieldnames
                self.data = list(reader)
            print(f"Loaded {len(self.data)} rows")
            return True
        except FileNotFoundError:
            print(f"Error: File '{self.filename}' not found")
            return False
        except Exception as e:
            print(f"Error loading file: {e}")
            return False
    
    def get_column_data(self, column):
        """Extract numeric data from a column."""
        values = []
        for row in self.data:
            try:
                values.append(float(row[column]))
            except (ValueError, KeyError):
                continue
        return values
    
    def analyze_column(self, column):
        """Perform statistical analysis on a column."""
        values = self.get_column_data(column)
        
        if not values:
            print(f"No numeric data in column '{column}'")
            return
        
        print(f"Analysis for '{column}':")
        print(f"  Count: {len(values)}")
        print(f"  Mean: {statistics.mean(values):.2f}")
        print(f"  Median: {statistics.median(values):.2f}")
        print(f"  Std Dev: {statistics.stdev(values):.2f}")
        print(f"  Min: {min(values):.2f}")
        print(f"  Max: {max(values):.2f}")
        print(f"  Range: {max(values) - min(values):.2f}")
    
    def show_menu(self):
        """Display interactive menu."""
        while True:
            print("Data Analysis Menu:")
            print("1. Show columns")
            print("2. Analyze column")
            print("3. Show sample data")
            print("4. Exit")
            
            choice = input("Enter choice: ")
            
            if choice == '1':
                print(f"Columns: {', '.join(self.headers)}")
            elif choice == '2':
                col = input("Enter column name: ")
                self.analyze_column(col)
            elif choice == '3':
                for i, row in enumerate(self.data[:5]):
                    print(f"Row {i+1}: {row}")
            elif choice == '4':
                break

# Usage
if __name__ == "__main__":
    analyzer = DataAnalyzer('data.csv')
    if analyzer.load_data():
        analyzer.show_menu()`
};

export const week2Project = {
    title: 'Week 2 Project: Sales Data Dashboard',
    videoUrl: 'https://www.youtube.com/embed/UO98lJQ3QGI',
    notes: `# Week 2 Project: Sales Data Dashboard

## Project Overview

Create a sales analytics dashboard using NumPy and Pandas to analyze business data.

## Objectives

- Master NumPy array operations
- Apply Pandas for data manipulation
- Perform time series analysis
- Generate business insights

## Requirements

### 1. Data Loading & Cleaning
- Load sales data from CSV
- Handle missing values
- Convert data types
- Remove duplicates

### 2. Analysis Features
- Monthly sales trends
- Top products by revenue
- Customer segmentation
- Regional performance

### 3. Calculations
- Total revenue
- Average order value
- Growth rates
- Product rankings

### 4. Output
- Summary statistics table
- Export results to CSV
- Print formatted reports

## Dataset Structure

Expected columns:
- Date
- Product
- Quantity
- Price
- Customer
- Region

## Deliverables

1. Jupyter notebook or Python script
2. Sample dataset (or use provided)
3. Analysis report
4. Visualizations (optional)

## Bonus Challenges

- Add seasonal analysis
- Implement customer lifetime value
- Create pivot tables
- Build interactive plots with Plotly`,
    codeSnippet: `import pandas as pd
import numpy as np
from datetime import datetime

# Load data
df = pd.read_csv('sales_data.csv')

# Data cleaning
df['Date'] = pd.to_datetime(df['Date'])
df['Revenue'] = df['Quantity'] * df['Price']
df = df.dropna()

print("=== Sales Dashboard ===")
print(f"Data Period: {df['Date'].min()} to {df['Date'].max()}")
print(f"Total Records: {len(df)}")

# 1. Overall Metrics
print("Overall Metrics:")
print(f"  Total Revenue: $" + f"{df['Revenue'].sum():,.2f}")
print(f"  Average Order Value: $" + f"{df['Revenue'].mean():.2f}")
print(f"  Total Orders: {len(df)}")
print(f"  Unique Customers: {df['Customer'].nunique()}")

# 2. Monthly Trends
df['Month'] = df['Date'].dt.to_period('M')
monthly_sales = df.groupby('Month')['Revenue'].agg(['sum', 'count', 'mean'])
monthly_sales.columns = ['Total Revenue', 'Orders', 'Avg Order Value']

print("Monthly Sales:")
print(monthly_sales)

# Calculate growth rate
monthly_sales['Growth %'] = monthly_sales['Total Revenue'].pct_change() * 100
print(f"Average Monthly Growth: {monthly_sales['Growth %'].mean():.2f}%")

# 3. Top Products
top_products = df.groupby('Product').agg({
    'Revenue': 'sum',
    'Quantity': 'sum'
}).sort_values('Revenue', ascending = False).head(10)

print("Top 10 Products by Revenue:")
print(top_products)

# 4. Regional Performance
regional_sales = df.groupby('Region').agg({
    'Revenue': ['sum', 'mean'],
    'Customer': 'nunique'
})
regional_sales.columns = ['Total Revenue', 'Avg Order', 'Customers']

print("Regional Performance:")
print(regional_sales)

# 5. Customer Analysis
customer_stats = df.groupby('Customer').agg({
    'Revenue': 'sum',
    'Date': 'count'
})
customer_stats.columns = ['Total Spent', 'Orders']
customer_stats['Avg Order'] = customer_stats['Total Spent'] / customer_stats['Orders']

# Top customers
top_customers = customer_stats.sort_values('Total Spent', ascending = False).head(10)
print("Top 10 Customers:")
print(top_customers)

# 6. Export results
monthly_sales.to_csv('monthly_report.csv')
top_products.to_csv('top_products.csv')
print("Reports exported successfully!")`
};

export const week3Project = {
    title: 'Week 3 Project: Exploratory Data Analysis Report',
    videoUrl: 'https://www.youtube.com/embed/xi0vhXFPegw',
    notes: `# Week 3 Project: Exploratory Data Analysis Report

## Project Overview

Conduct comprehensive EDA on a real - world dataset and create a professional analysis report.

## Objectives

    - Apply EDA techniques
        - Create meaningful visualizations
            - Identify patterns and insights
                - Communicate findings effectively

## Requirements

### 1. Data Understanding
    - Load and inspect dataset
        - Understand variable types
            - Check data quality
                - Document findings

### 2. Univariate Analysis
    - Distribution of each variable
        - Summary statistics
            - Identify outliers
                - Visualize with histograms, box plots

### 3. Bivariate Analysis
    - Relationships between variables
        - Correlation analysis
            - Scatter plots
                - Cross - tabulations

### 4. Multivariate Analysis
    - Multiple variable relationships
        - Pair plots
            - Heatmaps
            - Feature interactions

### 5. Data Quality
    - Missing value analysis
        - Outlier detection
            - Data type issues
- Recommendations for cleaning

## Suggested Datasets

    - Titanic(Kaggle)
    - House Prices(Kaggle)
        - Iris Dataset
            - Your own dataset

## Deliverables

1. Jupyter Notebook with analysis
2. PDF report with key findings
3. Visualizations(at least 10)
4. Data quality assessment
5. Recommendations for modeling

## Report Structure

1. Executive Summary
2. Data Overview
3. Univariate Analysis
4. Bivariate Analysis
5. Key Insights
6. Recommendations
7. Appendix

## Bonus Challenges

    - Interactive visualizations with Plotly
    - Statistical hypothesis tests
        - Feature engineering suggestions
            - Automated EDA with pandas - profiling`,
    codeSnippet: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
sns.set_style('whitegrid')
plt.rcParams['figure.figsize'] = (12, 6)

# Load dataset(example: Titanic)
df = pd.read_csv('titanic.csv')

print("=== EXPLORATORY DATA ANALYSIS REPORT ===")

# 1. DATA OVERVIEW
print("1. Dataset Overview:")
print(f"   Shape: {df.shape}")
print(f"   Columns: {df.columns.tolist()}")
print(df.info())
print(df.describe())

# 2. MISSING VALUES
print("2. Missing Values:")
missing = df.isnull().sum()
missing_pct = (missing / len(df)) * 100
missing_df = pd.DataFrame({
    'Missing': missing,
    'Percentage': missing_pct
}).sort_values('Missing', ascending = False)
print(missing_df[missing_df['Missing'] > 0])

# Visualize missing data
plt.figure(figsize = (10, 6))
sns.heatmap(df.isnull(), cbar = False, yticklabels = False)
plt.title('Missing Data Heatmap')
plt.show()

# 3. UNIVARIATE ANALYSIS
print("3. Univariate Analysis:")

# Numerical variables
numerical_cols = df.select_dtypes(include = [np.number]).columns

for col in numerical_cols:
    fig, axes = plt.subplots(1, 2, figsize = (12, 4))
    
    # Histogram
axes[0].hist(df[col].dropna(), bins = 30, edgecolor = 'black')
axes[0].set_title(f'{col} Distribution')
axes[0].set_xlabel(col)
    
    # Box plot
axes[1].boxplot(df[col].dropna())
axes[1].set_title(f'{col} Box Plot')
axes[1].set_ylabel(col)

plt.tight_layout()
plt.show()

# Categorical variables
categorical_cols = df.select_dtypes(include = ['object']).columns

for col in categorical_cols:
    plt.figure(figsize = (10, 6))
df[col].value_counts().plot(kind = 'bar')
plt.title(f'{col} Distribution')
plt.xlabel(col)
plt.ylabel('Count')
plt.xticks(rotation = 45)
plt.show()

# 4. BIVARIATE ANALYSIS
print("4. Bivariate Analysis:")

# Correlation matrix
correlation = df[numerical_cols].corr()
plt.figure(figsize = (10, 8))
sns.heatmap(correlation, annot = True, cmap = 'coolwarm', center = 0)
plt.title('Correlation Heatmap')
plt.show()

# Pair plot(sample of variables)
sns.pairplot(df[numerical_cols[: 4]])
plt.show()

# 5. KEY INSIGHTS
print("5. Key Insights:")
print("   - [Add your insights here]")
print("   - [Patterns discovered]")
print("   - [Anomalies found]")

# 6. RECOMMENDATIONS
print("6. Recommendations:")
print("   - [Data cleaning steps]")
print("   - [Feature engineering ideas]")
print("   - [Modeling suggestions]")`
};

export const week4Project = {
    title: 'Week 4 Project: House Price Prediction Model',
    videoUrl: 'https://www.youtube.com/embed/Wqmtf9SA_kk',
    notes: `# Week 4 Project: House Price Prediction Model

## Project Overview

Build a complete regression model to predict house prices using real estate data.

## Objectives

- Apply regression algorithms
    - Perform feature engineering
        - Evaluate model performance
            - Compare multiple models

## Requirements

### 1. Data Preparation
    - Load house price dataset
        - Handle missing values
            - Encode categorical variables
                - Feature scaling

### 2. Feature Engineering
    - Create new features
        - Handle outliers
            - Select important features
                - Transform skewed features

### 3. Model Building
    - Train multiple regression models:
- Linear Regression
    - Ridge Regression
        - Lasso Regression
            - Polynomial Regression
                - Use cross - validation
                    - Tune hyperparameters

### 4. Model Evaluation
    - Calculate MSE, RMSE, MAE, R²
- Compare model performance
    - Analyze residuals
        - Feature importance

### 5. Predictions
    - Make predictions on test set
        - Visualize predictions vs actual
            - Identify prediction errors

## Dataset

Use Kaggle's House Prices dataset or similar:
    - Features: Square footage, bedrooms, location, age, etc.
- Target: Sale price

## Deliverables

1. Jupyter Notebook with complete pipeline
2. Model comparison report
3. Best model saved(pickle)
4. Predictions on test set
5. README with instructions

## Evaluation Criteria

    - Data preprocessing quality
        - Feature engineering creativity
            - Model performance(R² > 0.80)
                - Code organization
                    - Documentation

## Bonus Challenges

    - Ensemble methods(stacking)
        - Feature selection techniques
            - Handle categorical variables creatively
                - Deploy model with Flask API`,
    codeSnippet: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
    from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.preprocessing import PolynomialFeatures
    from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import matplotlib.pyplot as plt

# Load data
df = pd.read_csv('house_prices.csv')

# Feature engineering
df['age'] = 2024 - df['year_built']
df['total_sqft'] = df['sqft_living'] + df['sqft_lot']
df['price_per_sqft'] = df['price'] / df['sqft_living']

# Handle missing values
df = df.fillna(df.median())

# Select features
features = ['sqft_living', 'bedrooms', 'bathrooms', 'age', 'total_sqft']
X = df[features]
y = df['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size = 0.2, random_state = 42
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Dictionary to store results
results = {}

# 1. Linear Regression
lr = LinearRegression()
lr.fit(X_train_scaled, y_train)
y_pred_lr = lr.predict(X_test_scaled)

results['Linear Regression'] = {
    'RMSE': np.sqrt(mean_squared_error(y_test, y_pred_lr)),
    'MAE': mean_absolute_error(y_test, y_pred_lr),
    'R2': r2_score(y_test, y_pred_lr)
}

# 2. Ridge Regression
ridge = Ridge(alpha = 10)
ridge.fit(X_train_scaled, y_train)
y_pred_ridge = ridge.predict(X_test_scaled)

results['Ridge'] = {
    'RMSE': np.sqrt(mean_squared_error(y_test, y_pred_ridge)),
    'MAE': mean_absolute_error(y_test, y_pred_ridge),
    'R2': r2_score(y_test, y_pred_ridge)
}

# 3. Lasso Regression
lasso = Lasso(alpha = 100)
lasso.fit(X_train_scaled, y_train)
y_pred_lasso = lasso.predict(X_test_scaled)

results['Lasso'] = {
    'RMSE': np.sqrt(mean_squared_error(y_test, y_pred_lasso)),
    'MAE': mean_absolute_error(y_test, y_pred_lasso),
    'R2': r2_score(y_test, y_pred_lasso)
}

# 4. Polynomial Regression
poly = PolynomialFeatures(degree = 2)
X_train_poly = poly.fit_transform(X_train_scaled)
X_test_poly = poly.transform(X_test_scaled)

poly_model = Ridge(alpha = 10)
poly_model.fit(X_train_poly, y_train)
y_pred_poly = poly_model.predict(X_test_poly)

results['Polynomial'] = {
    'RMSE': np.sqrt(mean_squared_error(y_test, y_pred_poly)),
    'MAE': mean_absolute_error(y_test, y_pred_poly),
    'R2': r2_score(y_test, y_pred_poly)
}

# Print results
print("=== MODEL COMPARISON ===")
results_df = pd.DataFrame(results).T
print(results_df)

# Visualize predictions
best_model = ridge
y_pred_best = y_pred_ridge

plt.figure(figsize = (10, 6))
plt.scatter(y_test, y_pred_best, alpha = 0.5)
plt.plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], 'r--', lw = 2)
plt.xlabel('Actual Price')
plt.ylabel('Predicted Price')
plt.title('Actual vs Predicted House Prices')
plt.show()

# Feature importance
feature_importance = pd.DataFrame({
    'Feature': features,
    'Coefficient': best_model.coef_
}).sort_values('Coefficient', key = abs, ascending = False)

print("Feature Importance:")
print(feature_importance)`
};

export const week5Project = {
    title: 'Week 5 Project: Customer Churn Prediction',
    videoUrl: 'https://www.youtube.com/embed/6xO7kVZcY_s',
    notes: `# Week 5 Project: Customer Churn Prediction

## Project Overview

Build a classification model to predict customer churn for a telecommunications company.

## Objectives

    - Apply classification algorithms
        - Handle imbalanced data
            - Optimize model performance
                - Provide business insights

## Requirements

### 1. Data Preparation
    - Load customer data
        - Handle missing values
            - Encode categorical variables
                - Feature scaling

### 2. Exploratory Analysis
    - Churn rate analysis
        - Feature distributions
            - Correlation with churn
            - Customer segmentation

### 3. Model Building
Train and compare:
- Logistic Regression
    - Decision Tree
        - Random Forest
            - KNN
            - SVM

### 4. Handle Imbalanced Data
    - Try SMOTE
        - Class weights
            - Undersampling
            - Compare approaches

### 5. Model Evaluation
    - Confusion matrix
        - Precision, Recall, F1 - Score
        - ROC - AUC curve
            - Feature importance

### 6. Business Insights
    - Key churn indicators
        - Customer segments at risk
            - Retention recommendations

## Dataset Features

    - Customer demographics
        - Service usage
            - Contract details
                - Payment information
                    - Support interactions

## Deliverables

1. Complete analysis notebook
2. Best model(saved)
3. Business insights report
4. Churn risk scoring system
5. Recommendations document

## Success Metrics

    - F1 - Score > 0.75
    - AUC > 0.85
    - Actionable insights
        - Clear documentation

## Bonus Challenges

    - Build customer lifetime value model
        - Create retention strategy
            - Develop early warning system
                - Interactive dashboard`,
    codeSnippet: `import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
    from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
    from sklearn.tree import DecisionTreeClassifier
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.metrics import(
        classification_report, confusion_matrix,
        roc_auc_score, roc_curve
    )
from imblearn.over_sampling import SMOTE
import matplotlib.pyplot as plt
import seaborn as sns

# Load data
df = pd.read_csv('customer_churn.csv')

# Encode categorical variables
le = LabelEncoder()
categorical_cols = df.select_dtypes(include = ['object']).columns

for col in categorical_cols:
    if col != 'Churn':
        df[col] = le.fit_transform(df[col])

# Prepare features and target
X = df.drop('Churn', axis = 1)
y = df['Churn'].map({ 'Yes': 1, 'No': 0 })

print(f"Churn Rate: {y.mean():.2%}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size = 0.2, random_state = 42, stratify = y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Handle imbalanced data with SMOTE
smote = SMOTE(random_state = 42)
X_train_balanced, y_train_balanced = smote.fit_resample(X_train_scaled, y_train)

print(f"Original training set: {len(y_train)}")
print(f"Balanced training set: {len(y_train_balanced)}")

# Train models
models = {
    'Logistic Regression': LogisticRegression(max_iter = 1000),
    'Decision Tree': DecisionTreeClassifier(max_depth = 5, random_state = 42),
    'Random Forest': RandomForestClassifier(n_estimators = 100, random_state = 42)
}

results = {}

for name, model in models.items():
    # Train
model.fit(X_train_balanced, y_train_balanced)
    
    # Predict
y_pred = model.predict(X_test_scaled)
y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    # Evaluate
results[name] = {
    'AUC': roc_auc_score(y_test, y_pred_proba),
    'Report': classification_report(y_test, y_pred, output_dict = True)
}

print(f"=== {name} ===")
print(classification_report(y_test, y_pred))
    
    # Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize = (6, 4))
sns.heatmap(cm, annot = True, fmt = 'd', cmap = 'Blues')
plt.title(f'{name} - Confusion Matrix')
plt.ylabel('Actual')
plt.xlabel('Predicted')
plt.show()

# ROC Curves
plt.figure(figsize = (10, 6))
for name, model in models.items():
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
fpr, tpr, _ = roc_curve(y_test, y_pred_proba)
auc = results[name]['AUC']
plt.plot(fpr, tpr, label = f'{name} (AUC={auc:.3f})')

plt.plot([0, 1], [0, 1], 'k--', label = 'Random')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curves')
plt.legend()
plt.grid(True)
plt.show()

# Feature Importance(Random Forest)
rf = models['Random Forest']
feature_importance = pd.DataFrame({
    'Feature': X.columns,
    'Importance': rf.feature_importances_
}).sort_values('Importance', ascending = False)

print("Top 10 Churn Indicators:")
print(feature_importance.head(10))

plt.figure(figsize = (10, 6))
plt.barh(feature_importance['Feature'][: 10], feature_importance['Importance'][: 10])
plt.xlabel('Importance')
plt.title('Top 10 Features for Churn Prediction')
plt.gca().invert_yaxis()
plt.show()`
};

export const week6Project = {
    title: 'Week 6 Project: Multi-Class Image Classification',
    videoUrl: 'https://www.youtube.com/embed/jztwpsIzEGc',
    notes: `# Week 6 Project: Multi - Class Image Classification

## Project Overview

Build an end - to - end machine learning pipeline for classifying images into multiple categories.

## Objectives

    - Apply advanced classification techniques
        - Implement complete ML pipeline
            - Optimize model performance
                - Deploy production - ready model

## Requirements

### 1. Data Pipeline
    - Load and preprocess images
        - Data augmentation
            - Train / validation / test split
                - Batch processing

### 2. Feature Engineering
    - Extract image features
        - Dimensionality reduction(PCA)
            - Feature scaling
                - Handle high - dimensional data

### 3. Model Development
Build and compare:
- Random Forest
    - SVM with different kernels
        - Gradient Boosting(XGBoost)
            - Ensemble methods(Voting / Stacking)

### 4. Hyperparameter Tuning
    - Grid Search or Random Search
        - Cross - validation
        - Learning curves
            - Validation strategy

### 5. Model Evaluation
    - Multi - class metrics
- Confusion matrix
    - Per - class performance
- Error analysis

### 6. Production Pipeline
    - Model serialization
        - Prediction API
            - Performance monitoring
                - Documentation

## Suggested Datasets

    - MNIST(digits)
    - Fashion - MNIST
    - CIFAR - 10
    - Custom dataset

## Deliverables

1. Complete ML pipeline notebook
2. Trained models(saved)
3. Model comparison report
4. Prediction script
5. API endpoint(Flask / FastAPI)
6. Documentation

## Evaluation Criteria

    - Overall accuracy > 85 %
        - Balanced per - class performance
- Code quality and organization
    - Documentation completeness
        - Deployment readiness

## Bonus Challenges

    - Implement CNN from scratch
        - Transfer learning with pre - trained models
            - Real - time prediction system
                - Model interpretability(LIME / SHAP)
                    - A / B testing framework`,
    codeSnippet: `import numpy as np
from sklearn.datasets import load_digits
    from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
    from sklearn.decomposition import PCA
    from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.svm import SVC
import xgboost as xgb
from sklearn.metrics import(
        classification_report, confusion_matrix,
        accuracy_score, ConfusionMatrixDisplay
    )
import matplotlib.pyplot as plt
import pickle

# Load dataset(MNIST digits)
digits = load_digits()
X, y = digits.data, digits.target

print(f"Dataset shape: {X.shape}")
print(f"Number of classes: {len(np.unique(y))}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size = 0.2, random_state = 42, stratify = y
)

# Feature scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Dimensionality reduction(optional)
pca = PCA(n_components = 0.95)  # Keep 95 % variance
X_train_pca = pca.fit_transform(X_train_scaled)
X_test_pca = pca.transform(X_test_scaled)

print(f"PCA components: {pca.n_components_}")

# 1. Random Forest
print("Training Random Forest...")
rf = RandomForestClassifier(n_estimators = 100, random_state = 42, n_jobs = -1)
rf.fit(X_train_pca, y_train)
y_pred_rf = rf.predict(X_test_pca)
print(f"RF Accuracy: {accuracy_score(y_test, y_pred_rf):.4f}")

# 2. SVM with hyperparameter tuning
print("Training SVM with Grid Search...")
param_grid = {
    'C': [0.1, 1, 10],
    'gamma': ['scale', 0.001, 0.01],
    'kernel': ['rbf']
}

svm = GridSearchCV(SVC(), param_grid, cv = 3, n_jobs = -1, verbose = 1)
svm.fit(X_train_pca, y_train)
y_pred_svm = svm.predict(X_test_pca)

print(f"Best SVM params: {svm.best_params_}")
print(f"SVM Accuracy: {accuracy_score(y_test, y_pred_svm):.4f}")

# 3. XGBoost
print("Training XGBoost...")
xgb_model = xgb.XGBClassifier(
    n_estimators = 100,
    learning_rate = 0.1,
    max_depth = 5,
    random_state = 42
)
xgb_model.fit(X_train_pca, y_train)
y_pred_xgb = xgb_model.predict(X_test_pca)
print(f"XGBoost Accuracy: {accuracy_score(y_test, y_pred_xgb):.4f}")

# 4. Ensemble(Voting)
print("Training Ensemble...")
voting = VotingClassifier(
    estimators = [
        ('rf', rf),
        ('svm', svm.best_estimator_),
        ('xgb', xgb_model)
    ],
    voting = 'soft'
)
voting.fit(X_train_pca, y_train)
y_pred_ensemble = voting.predict(X_test_pca)
print(f"Ensemble Accuracy: {accuracy_score(y_test, y_pred_ensemble):.4f}")

# Detailed evaluation of best model
print("=== Best Model Performance ===")
print(classification_report(y_test, y_pred_ensemble))

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred_ensemble)
disp = ConfusionMatrixDisplay(confusion_matrix = cm)
disp.plot(cmap = 'Blues')
plt.title('Confusion Matrix - Ensemble Model')
plt.show()

# Per - class accuracy
class_accuracy = cm.diagonal() / cm.sum(axis = 1)
for i, acc in enumerate(class_accuracy):
    print(f"Class {i} Accuracy: {acc:.4f}")

# Save best model
with open('digit_classifier.pkl', 'wb') as f:
pickle.dump({
    'model': voting,
    'scaler': scaler,
    'pca': pca
}, f)

print("Model saved successfully!")

# Prediction function
    def predict_digit(image):
"""Predict digit from image array."""
image_scaled = scaler.transform(image.reshape(1, -1))
image_pca = pca.transform(image_scaled)
prediction = voting.predict(image_pca)
probabilities = voting.predict_proba(image_pca)
return prediction[0], probabilities[0]

# Test prediction
sample_idx = 0
sample_image = X_test[sample_idx]
pred, probs = predict_digit(sample_image)

print(f"Predicted: {pred}, Actual: {y_test.iloc[sample_idx]}")
print(f"Confidence: {probs[pred]:.2%}")`
};
