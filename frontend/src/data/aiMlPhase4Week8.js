// AI/ML Phase 4 - Week 8: Neural Networks & Deep Learning Fundamentals

export const week8Lesson1 = {
    title: 'Introduction to Deep Learning',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    notes: `# Introduction to Deep Learning

## What is Deep Learning?

Deep Learning is a subset of machine learning that uses neural networks with multiple layers (deep neural networks) to learn hierarchical representations of data.

## Why Deep Learning?

### Automatic Feature Extraction
- No need for manual feature engineering
- Networks learn features automatically
- Hierarchical feature learning

### Scalability
- Performance improves with more data
- Can handle massive datasets
- Parallel processing capabilities

### Flexibility
- Can handle various data types (images, text, audio)
- Adaptable to different tasks
- Transfer learning capabilities

### State-of-the-art
- Best performance on complex tasks
- Breakthrough results in vision, NLP, speech
- Continuous improvements

## Deep Learning vs Traditional ML

| Traditional ML | Deep Learning |
|---------------|---------------|
| Manual feature engineering | Automatic feature learning |
| Works with small data | Needs large data |
| Faster training | Slower training |
| More interpretable | Black box |
| Linear/simple patterns | Complex patterns |

## Applications

- Computer Vision (image classification, object detection)
- Natural Language Processing (translation, chatbots)
- Speech Recognition
- Autonomous Vehicles
- Medical Diagnosis
- Game Playing (AlphaGo)

## Neural Network Basics

A neural network consists of:
- **Input Layer**: Receives data
- **Hidden Layers**: Process information
- **Output Layer**: Produces predictions

Each layer contains neurons that:
1. Receive inputs
2. Apply weights
3. Add bias
4. Apply activation function
5. Pass to next layer`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Set random seeds
np.random.seed(42)
tf.random.set_seed(42)

print("Deep Learning with TensorFlow")
print(f"TensorFlow version: {tf.__version__}")
print(f"Keras version: {keras.__version__}")

# Simple example: XOR problem (non-linearly separable)
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

# Build a simple neural network
model = keras.Sequential([
    layers.Dense(4, activation='relu', input_shape=(2,)),
    layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

# Train
history = model.fit(X, y, epochs=1000, verbose=0)

# Predict
predictions = model.predict(X)
print("XOR Problem Results:")
for i in range(len(X)):
    print(f"Input: {X[i]} → Prediction: {predictions[i][0]:.4f}, Actual: {y[i][0]}")

# Plot training history
plt.plot(history.history['loss'])
plt.title('Model Loss Over Time')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.show()`
};

export const week8Lesson2 = {
    title: 'The Perceptron: Building Block',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    notes: `# The Perceptron

## What is a Perceptron?

The perceptron is the simplest form of a neural network, mimicking a biological neuron.

## Perceptron Structure

\`\`\`
Inputs → Weights → Sum → Activation → Output
\`\`\`

Components:
- **Inputs (x)**: Feature values
- **Weights (w)**: Learned parameters
- **Bias (b)**: Offset term
- **Activation**: Step function
- **Output**: Binary classification

## Mathematical Formula

**z = w₁x₁ + w₂x₂ + ... + wₙxₙ + b**

**output = activation(z)**

## Learning Algorithm

1. Initialize weights randomly
2. For each training example:
   - Calculate prediction
   - Compare with actual
   - Update weights if wrong
3. Repeat until convergence

## Weight Update Rule

**w = w + α(y - ŷ)x**

Where:
- α = learning rate
- y = actual label
- ŷ = predicted label
- x = input

## Limitations

- Can only learn linearly separable patterns
- Cannot solve XOR problem
- Single layer limitation

## Solution: Multi-Layer Networks

Multiple perceptrons in layers can learn non-linear patterns!`,
    codeSnippet: `import numpy as np

class Perceptron:
    def __init__(self, learning_rate=0.01, n_iterations=100):
        self.learning_rate = learning_rate
        self.n_iterations = n_iterations
        self.weights = None
        self.bias = None
    
    def activation(self, x):
        """Step activation function"""
        return np.where(x >= 0, 1, 0)
    
    def fit(self, X, y):
        n_samples, n_features = X.shape
        
        # Initialize parameters
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        # Training
        for _ in range(self.n_iterations):
            for idx, x_i in enumerate(X):
                linear_output = np.dot(x_i, self.weights) + self.bias
                y_predicted = self.activation(linear_output)
                
                # Update if prediction is wrong
                update = self.learning_rate * (y[idx] - y_predicted)
                self.weights += update * x_i
                self.bias += update
        
        return self
    
    def predict(self, X):
        linear_output = np.dot(X, self.weights) + self.bias
        return self.activation(linear_output)

# Test on AND gate
X_and = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y_and = np.array([0, 0, 0, 1])

perceptron = Perceptron(learning_rate=0.1, n_iterations=10)
perceptron.fit(X_and, y_and)
predictions = perceptron.predict(X_and)

print("AND Gate Results:")
for i in range(len(X_and)):
    print(f"Input: {X_and[i]} → Prediction: {predictions[i]}, Actual: {y_and[i]}")

print(f"Learned weights: {perceptron.weights}")
print(f"Learned bias: {perceptron.bias}")`
};

export const week8Lesson3 = {
    title: 'Activation Functions',
    videoUrl: 'https://www.youtube.com/embed/m0pIlLfpXWE',
    notes: `# Activation Functions

## Why Activation Functions?

Activation functions introduce non-linearity into neural networks, enabling them to learn complex patterns.

## Common Activation Functions

### 1. Sigmoid
**σ(x) = 1 / (1 + e^(-x))**

- Output range: (0, 1)
- Smooth gradient
- Used in output layer for binary classification
- **Problem**: Vanishing gradient

### 2. Tanh
**tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))**

- Output range: (-1, 1)
- Zero-centered
- Stronger gradients than sigmoid
- **Problem**: Still vanishing gradient

### 3. ReLU (Rectified Linear Unit)
**ReLU(x) = max(0, x)**

- Most popular for hidden layers
- Fast computation
- No vanishing gradient for positive values
- **Problem**: Dying ReLU (neurons can die)

### 4. Leaky ReLU
**LeakyReLU(x) = max(0.01x, x)**

- Fixes dying ReLU problem
- Small gradient for negative values
- Better than ReLU in some cases

### 5. ELU (Exponential Linear Unit)
**ELU(x) = x if x > 0 else α(e^x - 1)**

- Smooth everywhere
- Negative values push mean closer to zero
- Better learning characteristics

### 6. Softmax
**softmax(x_i) = e^(x_i) / Σe^(x_j)**

- Used in output layer for multi-class
- Outputs probability distribution
- Sum of outputs = 1

## Choosing Activation Functions

- **Hidden Layers**: ReLU (default), Leaky ReLU, ELU
- **Output Layer**: 
  - Binary classification: Sigmoid
  - Multi-class: Softmax
  - Regression: Linear (no activation)

## Vanishing Gradient Problem

- Occurs with sigmoid/tanh in deep networks
- Gradients become very small
- Early layers learn slowly
- **Solution**: Use ReLU variants`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def tanh(x):
    return np.tanh(x)

def relu(x):
    return np.maximum(0, x)

def leaky_relu(x, alpha=0.01):
    return np.where(x > 0, x, alpha * x)

def elu(x, alpha=1.0):
    return np.where(x > 0, x, alpha * (np.exp(x) - 1))

# Visualize activation functions
x = np.linspace(-5, 5, 100)

plt.figure(figsize=(15, 10))

# Sigmoid
plt.subplot(2, 3, 1)
plt.plot(x, sigmoid(x), 'b-', linewidth=2)
plt.title('Sigmoid')
plt.grid(True, alpha=0.3)
plt.axhline(y=0, color='k', linestyle='--', alpha=0.3)
plt.axvline(x=0, color='k', linestyle='--', alpha=0.3)

# Tanh
plt.subplot(2, 3, 2)
plt.plot(x, tanh(x), 'r-', linewidth=2)
plt.title('Tanh')
plt.grid(True, alpha=0.3)
plt.axhline(y=0, color='k', linestyle='--', alpha=0.3)
plt.axvline(x=0, color='k', linestyle='--', alpha=0.3)

# ReLU
plt.subplot(2, 3, 3)
plt.plot(x, relu(x), 'g-', linewidth=2)
plt.title('ReLU')
plt.grid(True, alpha=0.3)
plt.axhline(y=0, color='k', linestyle='--', alpha=0.3)
plt.axvline(x=0, color='k', linestyle='--', alpha=0.3)

# Leaky ReLU
plt.subplot(2, 3, 4)
plt.plot(x, leaky_relu(x), 'm-', linewidth=2)
plt.title('Leaky ReLU')
plt.grid(True, alpha=0.3)
plt.axhline(y=0, color='k', linestyle='--', alpha=0.3)
plt.axvline(x=0, color='k', linestyle='--', alpha=0.3)

# ELU
plt.subplot(2, 3, 5)
plt.plot(x, elu(x), 'c-', linewidth=2)
plt.title('ELU')
plt.grid(True, alpha=0.3)
plt.axhline(y=0, color='k', linestyle='--', alpha=0.3)
plt.axvline(x=0, color='k', linestyle='--', alpha=0.3)

# Derivatives
plt.subplot(2, 3, 6)
sigmoid_x = sigmoid(x)
plt.plot(x, sigmoid_x * (1 - sigmoid_x), 'b--', label='Sigmoid', alpha=0.7)
plt.plot(x, 1 - tanh(x)**2, 'r--', label='Tanh', alpha=0.7)
plt.plot(x, np.where(x > 0, 1, 0), 'g--', label='ReLU', alpha=0.7)
plt.title('Derivatives')
plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()`
};


export const week8Lesson4 = {
    title: 'Building Neural Networks with Keras',
    videoUrl: 'https://www.youtube.com/embed/wQ8BIBpya2k',
    notes: `# Building Neural Networks with Keras

## What is Keras?

Keras is a high-level neural networks API that makes building deep learning models easy and intuitive.

## Key Features

- **User-friendly**: Simple, consistent interface
- **Modular**: Easy to combine layers
- **Extensible**: Easy to add custom components
- **Multiple backends**: TensorFlow, PyTorch support

## Sequential Model

The simplest way to build a model - stack layers linearly.

\`\`\`python
model = Sequential([
    Dense(64, activation='relu', input_shape=(10,)),
    Dense(32, activation='relu'),
    Dense(1, activation='sigmoid')
])
\`\`\`

## Model Compilation

Configure the learning process:

\`\`\`python
model.compile(
    optimizer='adam',      # Optimization algorithm
    loss='binary_crossentropy',  # Loss function
    metrics=['accuracy']   # Metrics to track
)
\`\`\`

## Common Optimizers

- **SGD**: Stochastic Gradient Descent
- **Adam**: Adaptive Moment Estimation (most popular)
- **RMSprop**: Root Mean Square Propagation
- **Adagrad**: Adaptive Gradient

## Common Loss Functions

### Classification
- Binary: \`binary_crossentropy\`
- Multi-class: \`categorical_crossentropy\`
- Multi-class (integer labels): \`sparse_categorical_crossentropy\`

### Regression
- \`mean_squared_error\`
- \`mean_absolute_error\`
- \`huber\`

## Training the Model

\`\`\`python
history = model.fit(
    X_train, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2
)
\`\`\`

## Model Evaluation

\`\`\`python
test_loss, test_acc = model.evaluate(X_test, y_test)
predictions = model.predict(X_test)
\`\`\``,
    codeSnippet: `import numpy as np
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow import keras
from tensorflow.keras import layers, models
import matplotlib.pyplot as plt

# Generate synthetic data
X, y = make_moons(n_samples=1000, noise=0.2, random_state=42)

# Split and scale
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Build neural network
model = models.Sequential([
    layers.Dense(10, activation='relu', input_shape=(2,), name='hidden_1'),
    layers.Dense(8, activation='relu', name='hidden_2'),
    layers.Dense(1, activation='sigmoid', name='output')
])

# Compile
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

# Display architecture
print("Model Architecture:")
model.summary()

# Train
history = model.fit(
    X_train_scaled, y_train,
    epochs=50,
    batch_size=32,
    validation_split=0.2,
    verbose=0
)

# Plot training history
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epochs')
plt.ylabel('Loss')
plt.title('Loss Over Time')
plt.legend()
plt.grid(True, alpha=0.3)

plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epochs')
plt.ylabel('Accuracy')
plt.title('Accuracy Over Time')
plt.legend()
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# Evaluate
test_loss, test_acc = model.evaluate(X_test_scaled, y_test, verbose=0)
print(f"Test Accuracy: {test_acc:.4f}")

# Make predictions
predictions = model.predict(X_test_scaled[:5])
print("Sample predictions:")
for i in range(5):
    print(f"  Input: {X_test[i]} → Prediction: {predictions[i][0]:.4f}, Actual: {y_test[i]}")`
};

export const week8Lesson5 = {
    title: 'Forward and Backward Propagation',
    videoUrl: 'https://www.youtube.com/embed/Ilg3gGewQ5U',
    notes: `# Forward and Backward Propagation

## Forward Propagation

The process of computing predictions from input to output.

### Steps:

1. **Input Layer**: Receive input data
2. **Hidden Layers**: 
   - Compute: z = w·x + b
   - Apply activation: a = f(z)
3. **Output Layer**: Final prediction
4. **Loss Calculation**: Compare with actual

### Mathematical Flow:

\`\`\`
Layer 1: z₁ = W₁·x + b₁
         a₁ = f(z₁)

Layer 2: z₂ = W₂·a₁ + b₂
         a₂ = f(z₂)

Output:  ŷ = a₂
Loss:    L = loss_function(y, ŷ)
\`\`\`

## Backward Propagation

The process of computing gradients to update weights.

### Chain Rule

Backpropagation uses the chain rule to compute gradients:

**∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w**

### Steps:

1. **Compute output error**: ∂L/∂ŷ
2. **Propagate backward** through layers
3. **Calculate gradients** for each weight
4. **Update weights**: w = w - α·∂L/∂w

### Gradient Flow:

\`\`\`
Output Layer:
  ∂L/∂W₂ = ∂L/∂a₂ · ∂a₂/∂z₂ · ∂z₂/∂W₂

Hidden Layer:
  ∂L/∂W₁ = ∂L/∂a₂ · ∂a₂/∂z₂ · ∂z₂/∂a₁ · ∂a₁/∂z₁ · ∂z₁/∂W₁
\`\`\`

## Gradient Descent Update

**w_new = w_old - learning_rate × gradient**

### Learning Rate

- Too small: Slow convergence
- Too large: Overshooting, instability
- Typical values: 0.001 to 0.1

## Vanishing/Exploding Gradients

### Vanishing Gradients
- Gradients become very small
- Early layers learn slowly
- Common with sigmoid/tanh
- **Solution**: ReLU, batch normalization

### Exploding Gradients
- Gradients become very large
- Unstable training
- **Solution**: Gradient clipping, proper initialization

## Computational Graph

Neural networks can be viewed as computational graphs where:
- Nodes = operations
- Edges = data flow
- Forward pass = compute outputs
- Backward pass = compute gradients`,
    codeSnippet: `import numpy as np

def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    return x * (1 - x)

class SimpleNeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        # Initialize weights randomly
        self.W1 = np.random.randn(input_size, hidden_size)
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size)
        self.b2 = np.zeros((1, output_size))
    
    def forward(self, X):
        """Forward propagation"""
        # Layer 1
        self.z1 = np.dot(X, self.W1) + self.b1
        self.a1 = sigmoid(self.z1)
        
        # Layer 2
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        self.a2 = sigmoid(self.z2)
        
        return self.a2
    
    def backward(self, X, y, output, learning_rate=0.1):
        """Backward propagation"""
        m = X.shape[0]
        
        # Output layer gradients
        dz2 = output - y
        dW2 = np.dot(self.a1.T, dz2) / m
        db2 = np.sum(dz2, axis=0, keepdims=True) / m
        
        # Hidden layer gradients
        da1 = np.dot(dz2, self.W2.T)
        dz1 = da1 * sigmoid_derivative(self.a1)
        dW1 = np.dot(X.T, dz1) / m
        db1 = np.sum(dz1, axis=0, keepdims=True) / m
        
        # Update weights
        self.W2 -= learning_rate * dW2
        self.b2 -= learning_rate * db2
        self.W1 -= learning_rate * dW1
        self.b1 -= learning_rate * db1
    
    def train(self, X, y, epochs=1000):
        """Train the network"""
        losses = []
        
        for epoch in range(epochs):
            # Forward pass
            output = self.forward(X)
            
            # Calculate loss
            loss = np.mean((y - output) ** 2)
            losses.append(loss)
            
            # Backward pass
            self.backward(X, y, output)
            
            if epoch % 100 == 0:
                print(f"Epoch {epoch}, Loss: {loss:.4f}")
        
        return losses

# Example: XOR problem
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

# Create and train network
nn = SimpleNeuralNetwork(input_size=2, hidden_size=4, output_size=1)
losses = nn.train(X, y, epochs=5000)

# Test
predictions = nn.forward(X)
print("Final Predictions:")
for i in range(len(X)):
    print(f"Input: {X[i]} → Prediction: {predictions[i][0]:.4f}, Actual: {y[i][0]}")

# Plot loss
import matplotlib.pyplot as plt
plt.plot(losses)
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.title('Training Loss')
plt.grid(True, alpha=0.3)
plt.show()`
};

export const week8Lesson6 = {
    title: 'Deep Networks and MNIST',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    notes: `# Deep Neural Networks on MNIST

## MNIST Dataset

- 70,000 handwritten digit images (0-9)
- 28×28 pixels, grayscale
- 60,000 training, 10,000 test images
- Classic benchmark for image classification

## Building a Deep Network

### Architecture Design

\`\`\`
Input (784) → Dense(256) → Dense(128) → Dense(64) → Output(10)
\`\`\`

### Key Decisions:

1. **Number of layers**: Deeper = more complex patterns
2. **Layer sizes**: Gradually decrease
3. **Activation functions**: ReLU for hidden, softmax for output
4. **Regularization**: Dropout to prevent overfitting

## Data Preprocessing

1. **Normalization**: Scale pixels to [0, 1]
2. **Flattening**: Convert 28×28 to 784-dim vector
3. **One-hot encoding**: Convert labels to categorical

## Training Strategies

### Batch Size
- Small (32-64): Noisy gradients, better generalization
- Large (256-512): Stable gradients, faster training

### Epochs
- Monitor validation loss
- Stop when overfitting begins
- Use early stopping

### Learning Rate
- Start with 0.001 (Adam default)
- Use learning rate scheduling
- Reduce on plateau

## Evaluation Metrics

- **Accuracy**: Overall correctness
- **Per-class accuracy**: Performance on each digit
- **Confusion matrix**: Where model makes mistakes
- **Loss curves**: Training vs validation

## Common Issues

### Overfitting
- Training accuracy >> Test accuracy
- **Solutions**: Dropout, L2 regularization, more data

### Underfitting
- Low training and test accuracy
- **Solutions**: Deeper network, more neurons, train longer

### Slow Convergence
- Loss decreases slowly
- **Solutions**: Higher learning rate, better initialization`,
    codeSnippet: `from tensorflow.keras.datasets import mnist
from tensorflow.keras import models, layers
from tensorflow.keras.utils import to_categorical
import numpy as np
import matplotlib.pyplot as plt

# Load MNIST
(X_train, y_train), (X_test, y_test) = mnist.load_data()

print(f"Training data: {X_train.shape}")
print(f"Test data: {X_test.shape}")

# Visualize samples
fig, axes = plt.subplots(2, 5, figsize=(12, 5))
for i, ax in enumerate(axes.ravel()):
    ax.imshow(X_train[i], cmap='gray')
    ax.set_title(f'Label: {y_train[i]}')
    ax.axis('off')
plt.suptitle('Sample MNIST Digits')
plt.show()

# Preprocess
X_train_norm = X_train.astype('float32') / 255.0
X_test_norm = X_test.astype('float32') / 255.0

# Flatten
X_train_flat = X_train_norm.reshape(X_train_norm.shape[0], -1)
X_test_flat = X_test_norm.reshape(X_test_norm.shape[0], -1)

# One-hot encode labels
y_train_cat = to_categorical(y_train, 10)
y_test_cat = to_categorical(y_test, 10)

# Build deep network
model = models.Sequential([
    layers.Dense(256, activation='relu', input_shape=(784,)),
    layers.Dropout(0.2),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(64, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(10, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print("Model Architecture:")
model.summary()

# Train
history = model.fit(
    X_train_flat, y_train_cat,
    epochs=10,
    batch_size=128,
    validation_split=0.2,
    verbose=1
)

# Evaluate
test_loss, test_acc = model.evaluate(X_test_flat, y_test_cat, verbose=0)
print(f"Test Accuracy: {test_acc:.4f}")

# Predictions
predictions = model.predict(X_test_flat[:10])
predicted_classes = np.argmax(predictions, axis=1)

# Visualize predictions
fig, axes = plt.subplots(2, 5, figsize=(12, 5))
for i, ax in enumerate(axes.ravel()):
    ax.imshow(X_test[i], cmap='gray')
    true_label = y_test[i]
    pred_label = predicted_classes[i]
    color = 'green' if true_label == pred_label else 'red'
    ax.set_title(f'True: {true_label}, Pred: {pred_label}', color=color)
    ax.axis('off')
plt.suptitle('Predictions (Green=Correct, Red=Wrong)')
plt.show()`
};

export const week8Quiz = {
    title: 'Week 8 Quiz: Neural Networks Fundamentals',
    questions: [
        {
            id: 1,
            question: 'What is the main advantage of deep learning over traditional machine learning?',
            options: [
                'Always faster training',
                'Automatic feature extraction from raw data',
                'Requires less data',
                'Always more interpretable'
            ],
            correctAnswer: 1,
            explanation: 'Deep learning automatically learns hierarchical feature representations from raw data, eliminating the need for manual feature engineering.'
        },
        {
            id: 2,
            question: 'What is the purpose of an activation function in a neural network?',
            options: [
                'To speed up training',
                'To introduce non-linearity',
                'To reduce overfitting',
                'To normalize inputs'
            ],
            correctAnswer: 1,
            explanation: 'Activation functions introduce non-linearity, allowing neural networks to learn complex, non-linear patterns in data.'
        },
        {
            id: 3,
            question: 'Which activation function is most commonly used in hidden layers of modern deep networks?',
            options: [
                'Sigmoid',
                'Tanh',
                'ReLU',
                'Linear'
            ],
            correctAnswer: 2,
            explanation: 'ReLU (Rectified Linear Unit) is the most popular activation for hidden layers due to its simplicity, computational efficiency, and ability to avoid vanishing gradients.'
        },
        {
            id: 4,
            question: 'What problem does the vanishing gradient cause in deep networks?',
            options: [
                'Overfitting',
                'Early layers learn very slowly or not at all',
                'Model trains too fast',
                'Predictions become inaccurate'
            ],
            correctAnswer: 1,
            explanation: 'Vanishing gradients cause early layers to receive very small gradient updates, making them learn extremely slowly or not learn at all.'
        },
        {
            id: 5,
            question: 'In backpropagation, what mathematical principle is used to compute gradients?',
            options: [
                'Linear algebra',
                'Chain rule of calculus',
                'Probability theory',
                'Set theory'
            ],
            correctAnswer: 1,
            explanation: 'Backpropagation uses the chain rule of calculus to efficiently compute gradients of the loss with respect to all weights in the network.'
        },
        {
            id: 6,
            question: 'What does the learning rate control in gradient descent?',
            options: [
                'The number of epochs',
                'The size of weight updates',
                'The batch size',
                'The number of layers'
            ],
            correctAnswer: 1,
            explanation: 'The learning rate determines the step size of weight updates during gradient descent. Too large can cause instability, too small leads to slow convergence.'
        },
        {
            id: 7,
            question: 'Which loss function should you use for binary classification?',
            options: [
                'Mean Squared Error',
                'Binary Crossentropy',
                'Categorical Crossentropy',
                'Mean Absolute Error'
            ],
            correctAnswer: 1,
            explanation: 'Binary crossentropy is the appropriate loss function for binary classification problems, measuring the difference between predicted probabilities and true labels.'
        },
        {
            id: 8,
            question: 'What is the purpose of dropout in neural networks?',
            options: [
                'To speed up training',
                'To prevent overfitting by randomly dropping neurons during training',
                'To reduce the number of parameters',
                'To normalize activations'
            ],
            correctAnswer: 1,
            explanation: 'Dropout randomly deactivates neurons during training, forcing the network to learn robust features and preventing over-reliance on specific neurons, thus reducing overfitting.'
        },
        {
            id: 9,
            question: 'Why do we normalize input data before training a neural network?',
            options: [
                'To make training faster and more stable',
                'To reduce memory usage',
                'To increase accuracy',
                'It is not necessary'
            ],
            correctAnswer: 0,
            explanation: 'Normalizing inputs (e.g., scaling to [0,1] or standardizing) helps gradient descent converge faster and more stably by preventing features with large scales from dominating.'
        },
        {
            id: 10,
            question: 'What is the softmax activation function used for?',
            options: [
                'Binary classification',
                'Regression',
                'Multi-class classification output',
                'Hidden layers'
            ],
            correctAnswer: 2,
            explanation: 'Softmax converts raw scores into a probability distribution over multiple classes, making it ideal for multi-class classification output layers.'
        }
    ]
};

export const week8Project = {
    title: 'Week 8 Project: Handwritten Digit Classifier',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    notes: `# Week 8 Project: Handwritten Digit Classifier

## Project Overview

Build a complete deep neural network to classify handwritten digits from the MNIST dataset, experimenting with different architectures and hyperparameters.

## Objectives

- Build and train deep neural networks
- Experiment with network architectures
- Apply regularization techniques
- Evaluate and compare models
- Visualize results and insights

## Requirements

### 1. Data Preparation
- Load MNIST dataset
- Normalize pixel values
- Split into train/validation/test
- Visualize sample images

### 2. Baseline Model
- Build simple 2-layer network
- Train and evaluate
- Establish baseline performance

### 3. Deep Network
- Build deeper network (4+ layers)
- Experiment with layer sizes
- Compare with baseline

### 4. Regularization
- Add dropout layers
- Try L2 regularization
- Compare regularized vs non-regularized

### 5. Hyperparameter Tuning
- Experiment with:
  - Learning rates
  - Batch sizes
  - Number of epochs
  - Activation functions
  - Optimizer choices

### 6. Analysis
- Plot training curves
- Create confusion matrix
- Analyze misclassifications
- Visualize learned features

## Deliverables

1. Jupyter Notebook with complete pipeline
2. Multiple trained models
3. Performance comparison report
4. Visualizations (at least 5)
5. Analysis of results
6. README with findings

## Evaluation Criteria

- Test accuracy > 97%
- Multiple architectures tested
- Proper regularization applied
- Clear visualizations
- Insightful analysis
- Clean, documented code

## Bonus Challenges

- Implement custom training loop
- Add data augmentation
- Try different optimizers
- Ensemble multiple models
- Deploy model with simple web interface
- Test on your own handwritten digits`,
    codeSnippet: `from tensorflow.keras.datasets import mnist
from tensorflow.keras import models, layers
from tensorflow.keras.utils import to_categorical
from tensorflow.keras.callbacks import EarlyStopping
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, classification_report

# Load and preprocess data
(X_train, y_train), (X_test, y_test) = mnist.load_data()

X_train = X_train.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

X_train_flat = X_train.reshape(-1, 784)
X_test_flat = X_test.reshape(-1, 784)

y_train_cat = to_categorical(y_train, 10)
y_test_cat = to_categorical(y_test, 10)

# Function to create models
def create_model(architecture='baseline'):
    if architecture == 'baseline':
        model = models.Sequential([
            layers.Dense(128, activation='relu', input_shape=(784,)),
            layers.Dense(10, activation='softmax')
        ])
    elif architecture == 'deep':
        model = models.Sequential([
            layers.Dense(512, activation='relu', input_shape=(784,)),
            layers.Dropout(0.2),
            layers.Dense(256, activation='relu'),
            layers.Dropout(0.2),
            layers.Dense(128, activation='relu'),
            layers.Dropout(0.2),
            layers.Dense(64, activation='relu'),
            layers.Dense(10, activation='softmax')
        ])
    elif architecture == 'regularized':
        model = models.Sequential([
            layers.Dense(256, activation='relu', 
                        kernel_regularizer='l2', input_shape=(784,)),
            layers.Dropout(0.3),
            layers.Dense(128, activation='relu', kernel_regularizer='l2'),
            layers.Dropout(0.3),
            layers.Dense(10, activation='softmax')
        ])
    
    model.compile(
        optimizer='adam',
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    return model

# Train multiple models
models_dict = {}
histories = {}

for arch in ['baseline', 'deep', 'regularized']:
    print(f"Training {arch} model...")
    model = create_model(arch)
    
    history = model.fit(
        X_train_flat, y_train_cat,
        epochs=20,
        batch_size=128,
        validation_split=0.2,
        callbacks=[EarlyStopping(patience=3, restore_best_weights=True)],
        verbose=0
    )
    
    models_dict[arch] = model
    histories[arch] = history
    
    test_loss, test_acc = model.evaluate(X_test_flat, y_test_cat, verbose=0)
    print(f"{arch} - Test Accuracy: {test_acc:.4f}")

# Compare models
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

for arch, history in histories.items():
    axes[0].plot(history.history['loss'], label=f'{arch} train')
    axes[0].plot(history.history['val_loss'], label=f'{arch} val', linestyle='--')

axes[0].set_xlabel('Epoch')
axes[0].set_ylabel('Loss')
axes[0].set_title('Training Loss Comparison')
axes[0].legend()
axes[0].grid(True, alpha=0.3)

for arch, history in histories.items():
    axes[1].plot(history.history['accuracy'], label=f'{arch} train')
    axes[1].plot(history.history['val_accuracy'], label=f'{arch} val', linestyle='--')

axes[1].set_xlabel('Epoch')
axes[1].set_ylabel('Accuracy')
axes[1].set_title('Training Accuracy Comparison')
axes[1].legend()
axes[1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

# Confusion matrix for best model
best_model = models_dict['deep']
y_pred = best_model.predict(X_test_flat)
y_pred_classes = np.argmax(y_pred, axis=1)

cm = confusion_matrix(y_test, y_pred_classes)

plt.figure(figsize=(10, 8))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.title('Confusion Matrix - Deep Model')
plt.ylabel('True Label')
plt.xlabel('Predicted Label')
plt.show()

# Analyze misclassifications
misclassified = np.where(y_pred_classes != y_test)[0]
print(f"Total misclassifications: {len(misclassified)}")

# Show some misclassified examples
fig, axes = plt.subplots(2, 5, figsize=(12, 5))
for i, ax in enumerate(axes.ravel()):
    if i < len(misclassified):
        idx = misclassified[i]
        ax.imshow(X_test[idx], cmap='gray')
        ax.set_title(f'True: {y_test[idx]}, Pred: {y_pred_classes[idx]}')
        ax.axis('off')
plt.suptitle('Misclassified Examples')
plt.show()

print("Project complete! Analyze results and document findings.")`
};
