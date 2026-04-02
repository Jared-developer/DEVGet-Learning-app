// AI/ML Phase 4 - Week 9-10: CNNs and NLP

// Week 9: Convolutional Neural Networks (CNNs)

export const week9Lesson1 = {
    title: 'Introduction to CNNs',
    videoUrl: 'https://www.youtube.com/embed/YRhxdVk_sIs',
    notes: `# Introduction to Convolutional Neural Networks

## What are CNNs?

Convolutional Neural Networks are specialized neural networks designed for processing grid-like data, especially images.

## Why CNNs for Images?

### Problems with Regular Neural Networks for Images
- Too many parameters (28×28 image = 784 weights per neuron)
- No spatial structure understanding
- Not translation invariant
- Computationally expensive

### CNN Advantages
- **Local Connectivity**: Neurons connect to local regions
- **Parameter Sharing**: Same filter applied everywhere
- **Translation Invariance**: Detect features anywhere in image
- **Hierarchical Learning**: Edges → Textures → Parts → Objects

## CNN Architecture

Typical CNN structure:
\`\`\`
Input → Conv → ReLU → Pool → Conv → ReLU → Pool → Flatten → Dense → Output
\`\`\`

## Key Components

1. **Convolutional Layers**: Extract features
2. **Activation Functions**: Add non-linearity (ReLU)
3. **Pooling Layers**: Downsample, reduce dimensions
4. **Fully Connected Layers**: Classification

## Applications

- Image Classification
- Object Detection
- Face Recognition
- Medical Image Analysis
- Self-Driving Cars
- Image Segmentation`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist

# Load MNIST
(X_train, y_train), (X_test, y_test) = mnist.load_data()

# Reshape for CNN (add channel dimension)
X_train_cnn = X_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
X_test_cnn = X_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0

print(f"Training data shape: {X_train_cnn.shape}")
print(f"Test data shape: {X_test_cnn.shape}")

# Simple CNN
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.MaxPooling2D((2, 2)),
    layers.Flatten(),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

print("CNN Architecture:")
model.summary()

# Train
history = model.fit(X_train_cnn, y_train,
                   epochs=5,
                   batch_size=128,
                   validation_split=0.2,
                   verbose=1)

# Evaluate
test_loss, test_acc = model.evaluate(X_test_cnn, y_test, verbose=0)
print(f"Test Accuracy: {test_acc:.4f}")`
};

export const week9Lesson2 = {
    title: 'Convolution Operation',
    videoUrl: 'https://www.youtube.com/embed/KuXjwB4LzSA',
    notes: `# Understanding Convolution

## What is Convolution?

Convolution slides a filter (kernel) over an image to produce a feature map.

## Mathematical Operation

For each position, compute element-wise multiplication and sum:

**Output[i,j] = Σ Σ Input[i+m, j+n] × Filter[m, n]**

## Filter/Kernel

Small matrix (e.g., 3×3, 5×5) that detects specific features:
- Edge detection
- Blur
- Sharpen
- Pattern recognition

## Stride

Step size when sliding the filter:
- Stride = 1: Move one pixel at a time
- Stride = 2: Move two pixels (faster, smaller output)

## Padding

Add borders to maintain spatial dimensions:
- **Valid**: No padding (output smaller)
- **Same**: Pad to keep same size

## Output Size Formula

**Output = (Input - Filter + 2×Padding) / Stride + 1**

Example: 28×28 input, 3×3 filter, stride=1, padding=0
Output = (28 - 3 + 0) / 1 + 1 = 26×26

## Multiple Filters

Each filter learns different features:
- Filter 1: Vertical edges
- Filter 2: Horizontal edges  
- Filter 3: Diagonal patterns
- etc.

Output has depth = number of filters`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from scipy import signal

# Simple image
image = np.array([
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 0],
    [1, 2, 3, 4, 5]
])

# Different filters
filters = {
    'Vertical Edge': np.array([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]),
    'Horizontal Edge': np.array([[-1, -2, -1], [0, 0, 0], [1, 2, 1]]),
    'Blur': np.ones((3, 3)) / 9,
    'Sharpen': np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
}

fig, axes = plt.subplots(2, 3, figsize=(15, 10))
axes = axes.ravel()

axes[0].imshow(image, cmap='gray')
axes[0].set_title('Original Image')
axes[0].axis('off')

for idx, (name, kernel) in enumerate(filters.items(), 1):
    filtered = signal.correlate2d(image, kernel, mode='valid')
    axes[idx].imshow(filtered, cmap='gray')
    axes[idx].set_title(f'{name} Filter')
    axes[idx].axis('off')

plt.tight_layout()
plt.show()`
};

export const week9Lesson3 = {
    title: 'Pooling Layers',
    videoUrl: 'https://www.youtube.com/embed/8oOgPUO-TBY',
    notes: `# Pooling Layers

## Purpose of Pooling

- Reduce spatial dimensions
- Decrease parameters and computation
- Make features more robust
- Provide translation invariance

## Max Pooling

Takes maximum value in each region:

\`\`\`
Input (4×4):        Max Pool 2×2:
[1  3  2  4]        [7  9]
[5  7  8  9]   →    [6  8]
[2  6  1  3]
[4  5  7  8]
\`\`\`

Most common, preserves strongest features.

## Average Pooling

Takes average value in each region:
- Smoother downsampling
- Less common than max pooling
- Used in some architectures

## Global Pooling

Reduces entire feature map to single value:
- **Global Max Pooling**: Max of entire map
- **Global Average Pooling**: Average of entire map
- Often used before final classification layer

## Pooling Parameters

- **Pool Size**: Typically 2×2
- **Stride**: Usually same as pool size
- **Padding**: Rarely used with pooling

## Benefits

- Reduces overfitting
- Computational efficiency
- Larger receptive field
- Translation invariance`,
    codeSnippet: `from tensorflow.keras import layers
import numpy as np

# Create sample feature map
feature_map = np.random.rand(1, 8, 8, 32)  # 8x8 with 32 channels

# Max Pooling
max_pool = layers.MaxPooling2D(pool_size=(2, 2))
max_pooled = max_pool(feature_map)
print(f"After Max Pooling: {max_pooled.shape}")

# Average Pooling
avg_pool = layers.AveragePooling2D(pool_size=(2, 2))
avg_pooled = avg_pool(feature_map)
print(f"After Average Pooling: {avg_pooled.shape}")

# Global Average Pooling
global_avg = layers.GlobalAveragePooling2D()
global_pooled = global_avg(feature_map)
print(f"After Global Average Pooling: {global_pooled.shape}")`
};

export const week9Lesson4 = {
    title: 'Building CNNs for MNIST',
    videoUrl: 'https://www.youtube.com/embed/FmpDIaiMIeA',
    notes: `# Building CNNs for MNIST

## CNN Architecture for MNIST

\`\`\`
Input (28×28×1)
  ↓
Conv2D (32 filters, 3×3) + ReLU
  ↓
MaxPooling (2×2)
  ↓
Conv2D (64 filters, 3×3) + ReLU
  ↓
MaxPooling (2×2)
  ↓
Flatten
  ↓
Dense (128) + ReLU
  ↓
Dropout (0.5)
  ↓
Dense (10) + Softmax
\`\`\`

## Design Principles

1. **Start with small filters**: 3×3 or 5×5
2. **Increase depth gradually**: 32 → 64 → 128
3. **Pool after convolutions**: Reduce dimensions
4. **Add dropout**: Prevent overfitting
5. **End with dense layers**: Classification

## Batch Normalization

Normalize activations between layers:
- Faster training
- Higher learning rates
- Regularization effect

## Data Augmentation

Generate variations of training images:
- Rotation
- Shifting
- Zooming
- Flipping

Improves generalization!`,
    codeSnippet: `from tensorflow.keras.datasets import mnist
from tensorflow.keras import models, layers
from tensorflow.keras.utils import to_categorical
import numpy as np

# Load and preprocess
(X_train, y_train), (X_test, y_test) = mnist.load_data()
X_train = X_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
X_test = X_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0
y_train = to_categorical(y_train, 10)
y_test = to_categorical(y_test, 10)

# Build CNN
model = models.Sequential([
    layers.Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=(28, 28, 1)),
    layers.BatchNormalization(),
    layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Dropout(0.25),
    
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Dropout(0.25),
    
    layers.Flatten(),
    layers.Dense(256, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

history = model.fit(X_train, y_train,
                   epochs=10,
                   batch_size=128,
                   validation_split=0.2)

test_loss, test_acc = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {test_acc:.4f}")`
};

export const week9Lesson5 = {
    title: 'Transfer Learning',
    videoUrl: 'https://www.youtube.com/embed/yofjFQddwHE',
    notes: `# Transfer Learning

## What is Transfer Learning?

Using a pre-trained model as a starting point for a new task.

## Why Transfer Learning?

- **Less data needed**: Leverage learned features
- **Faster training**: Start from good weights
- **Better performance**: Especially with small datasets
- **Proven architectures**: Use state-of-the-art models

## Pre-trained Models

Popular models trained on ImageNet (1.4M images, 1000 classes):
- VGG16/VGG19
- ResNet50/ResNet101
- InceptionV3
- MobileNet
- EfficientNet

## Transfer Learning Strategies

### 1. Feature Extraction
- Freeze pre-trained layers
- Add new classifier on top
- Train only new layers
- Fast, works with small data

### 2. Fine-Tuning
- Unfreeze some layers
- Train with low learning rate
- Adjust to new domain
- Better performance, needs more data

## Implementation Steps

1. Load pre-trained model without top layers
2. Freeze base model weights
3. Add custom classifier
4. Train new layers
5. Optionally unfreeze and fine-tune

## When to Use

- **Small dataset**: Feature extraction
- **Similar domain**: Fine-tune top layers
- **Different domain**: Fine-tune more layers
- **Large dataset**: Train from scratch or fine-tune all`,
    codeSnippet: `from tensorflow.keras.applications import VGG16
from tensorflow.keras import models, layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Load pre-trained VGG16 without top layers
base_model = VGG16(weights='imagenet',
                   include_top=False,
                   input_shape=(224, 224, 3))

# Freeze base model
base_model.trainable = False

# Add custom classifier
model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')  # 10 classes
])

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

print("Transfer Learning Model:")
model.summary()
print(f"Trainable params: {model.trainable_params}")
print(f"Non-trainable params: {model.non_trainable_params}")

# Fine-tuning (optional)
# Unfreeze last few layers
base_model.trainable = True
for layer in base_model.layers[:-4]:
    layer.trainable = False

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

print("After unfreezing:")
print(f"Trainable params: {model.trainable_params}")`
};

export const week9Lesson6 = {
    title: 'Advanced CNN Architectures',
    videoUrl: 'https://www.youtube.com/embed/DAOcjicFr1Y',
    notes: `# Advanced CNN Architectures

## Evolution of CNNs

### LeNet-5 (1998)
- First successful CNN
- Handwritten digit recognition
- 7 layers

### AlexNet (2012)
- Won ImageNet competition
- 8 layers, 60M parameters
- ReLU activation
- Dropout regularization

### VGG (2014)
- Very deep (16-19 layers)
- Small 3×3 filters throughout
- Simple, uniform architecture

### ResNet (2015)
- Residual connections (skip connections)
- Solves vanishing gradient
- 50-152 layers possible
- Identity shortcuts

### Inception (2014)
- Multiple filter sizes in parallel
- 1×1 convolutions for dimension reduction
- Efficient computation

### MobileNet (2017)
- Depthwise separable convolutions
- Designed for mobile devices
- Fewer parameters, faster

## Key Innovations

### Residual Connections
\`\`\`
x → Conv → ReLU → Conv → (+) → ReLU
↓__________________________|
\`\`\`
Allows training very deep networks

### Batch Normalization
- Normalize layer inputs
- Faster training
- Higher learning rates

### 1×1 Convolutions
- Dimension reduction
- Add non-linearity
- Efficient computation

## Choosing Architecture

- **Accuracy priority**: ResNet, EfficientNet
- **Speed priority**: MobileNet, SqueezeNet
- **Simple baseline**: VGG
- **Mobile deployment**: MobileNet
- **Custom task**: Start with transfer learning`,
    codeSnippet: `from tensorflow.keras import layers, models

# Simple Residual Block
def residual_block(x, filters):
    # Main path
    fx = layers.Conv2D(filters, (3, 3), padding='same')(x)
    fx = layers.BatchNormalization()(fx)
    fx = layers.Activation('relu')(fx)
    fx = layers.Conv2D(filters, (3, 3), padding='same')(fx)
    fx = layers.BatchNormalization()(fx)
    
    # Skip connection
    out = layers.Add()([x, fx])
    out = layers.Activation('relu')(out)
    return out

# Build ResNet-like model
inputs = layers.Input(shape=(32, 32, 3))
x = layers.Conv2D(64, (3, 3), padding='same')(inputs)
x = layers.BatchNormalization()(x)
x = layers.Activation('relu')(x)

# Add residual blocks
x = residual_block(x, 64)
x = residual_block(x, 64)

x = layers.GlobalAveragePooling2D()(x)
outputs = layers.Dense(10, activation='softmax')(x)

model = models.Model(inputs, outputs)
print("ResNet-like Architecture:")
model.summary()`
};

export const week9Quiz = {
    title: 'Week 9 Quiz: Convolutional Neural Networks',
    questions: [
        {
            id: 1,
            question: 'What is the main advantage of CNNs over regular neural networks for image processing?',
            options: [
                'They are always faster',
                'They use parameter sharing and local connectivity',
                'They require less data',
                'They are easier to train'
            ],
            correctAnswer: 1,
            explanation: 'CNNs use parameter sharing (same filter applied everywhere) and local connectivity (neurons connect to local regions), making them efficient and effective for spatial data like images.'
        },
        {
            id: 2,
            question: 'What does a convolutional layer do?',
            options: [
                'Reduces image size',
                'Applies filters to extract features',
                'Classifies the image',
                'Normalizes pixel values'
            ],
            correctAnswer: 1,
            explanation: 'Convolutional layers apply learnable filters to the input to extract features like edges, textures, and patterns.'
        },
        {
            id: 3,
            question: 'What is the purpose of pooling layers in CNNs?',
            options: [
                'To increase image resolution',
                'To add more parameters',
                'To reduce spatial dimensions and provide translation invariance',
                'To apply activation functions'
            ],
            correctAnswer: 2,
            explanation: 'Pooling layers downsample feature maps, reducing spatial dimensions, decreasing parameters, and providing translation invariance.'
        },
        {
            id: 4,
            question: 'In a 3×3 convolution with stride 1 and no padding, what happens to a 28×28 input?',
            options: [
                'Becomes 28×28',
                'Becomes 26×26',
                'Becomes 30×30',
                'Becomes 14×14'
            ],
            correctAnswer: 1,
            explanation: 'Output size = (28 - 3) / 1 + 1 = 26. The output is smaller because we lose border pixels without padding.'
        },
        {
            id: 5,
            question: 'What does "same" padding mean in a convolutional layer?',
            options: [
                'No padding is added',
                'Padding is added to keep output size same as input',
                'All filters are the same size',
                'Stride equals filter size'
            ],
            correctAnswer: 1,
            explanation: '"Same" padding adds zeros around the input so that the output spatial dimensions match the input dimensions (with stride=1).'
        },
        {
            id: 6,
            question: 'What is transfer learning in the context of CNNs?',
            options: [
                'Transferring data between layers',
                'Using a pre-trained model as starting point for a new task',
                'Moving models between computers',
                'Converting models to different formats'
            ],
            correctAnswer: 1,
            explanation: 'Transfer learning uses a model pre-trained on a large dataset as a starting point, leveraging learned features for a new task with less data.'
        },
        {
            id: 7,
            question: 'What innovation did ResNet introduce to enable very deep networks?',
            options: [
                'Larger filters',
                'More pooling layers',
                'Residual connections (skip connections)',
                'Dropout layers'
            ],
            correctAnswer: 2,
            explanation: 'ResNet introduced residual connections that skip layers, allowing gradients to flow directly and enabling training of very deep networks (100+ layers).'
        },
        {
            id: 8,
            question: 'What is data augmentation in CNNs?',
            options: [
                'Adding more layers to the network',
                'Creating variations of training images through transformations',
                'Increasing image resolution',
                'Adding more training data from external sources'
            ],
            correctAnswer: 1,
            explanation: 'Data augmentation creates variations of existing images through transformations (rotation, flipping, zooming) to increase training data diversity and reduce overfitting.'
        },
        {
            id: 9,
            question: 'Why is batch normalization useful in CNNs?',
            options: [
                'It reduces the number of parameters',
                'It normalizes inputs and speeds up training',
                'It replaces activation functions',
                'It eliminates the need for pooling'
            ],
            correctAnswer: 1,
            explanation: 'Batch normalization normalizes layer inputs, allowing higher learning rates, faster training, and acting as a regularizer.'
        },
        {
            id: 10,
            question: 'What is the purpose of Global Average Pooling?',
            options: [
                'To increase spatial dimensions',
                'To reduce each feature map to a single value',
                'To add more channels',
                'To apply convolution'
            ],
            correctAnswer: 1,
            explanation: 'Global Average Pooling reduces each feature map to a single value by averaging all spatial locations, often used before the final classification layer.'
        }
    ]
};


export const week9Project = {
    title: 'Week 9 Project: Image Classification with CNNs',
    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
    notes: `# Week 9 Project: Image Classification with CNNs

## Project Overview

Build a complete image classification system using CNNs on the CIFAR-10 dataset.

## Objectives

- Build CNN from scratch
- Apply data augmentation
- Use transfer learning
- Compare architectures
- Deploy best model

## Requirements

### 1. Data Preparation
- Load CIFAR-10 dataset (10 classes, 60k images)
- Normalize and preprocess
- Create train/val/test splits
- Implement data augmentation

### 2. Baseline CNN
- Build simple CNN (2-3 conv layers)
- Train and evaluate
- Establish baseline performance

### 3. Improved CNN
- Deeper architecture (4-5 conv blocks)
- Add batch normalization
- Add dropout
- Compare with baseline

### 4. Transfer Learning
- Use pre-trained model (VGG16/ResNet)
- Feature extraction approach
- Fine-tuning approach
- Compare performance

### 5. Optimization
- Hyperparameter tuning
- Learning rate scheduling
- Early stopping
- Model checkpointing

### 6. Evaluation
- Test set performance
- Confusion matrix
- Per-class accuracy
- Visualize predictions

## Deliverables

1. Complete Jupyter notebook
2. Multiple trained models
3. Performance comparison report
4. Visualizations
5. Best model saved
6. README with instructions

## Evaluation Criteria

- Test accuracy > 75%
- Multiple architectures tested
- Transfer learning implemented
- Data augmentation applied
- Clear documentation

## Bonus Challenges

- Achieve >85% accuracy
- Implement custom architecture
- Ensemble multiple models
- Grad-CAM visualization
- Deploy with web interface`,
    codeSnippet: `from tensorflow.keras.datasets import cifar10
from tensorflow.keras import models, layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import VGG16
import numpy as np
import matplotlib.pyplot as plt

# Load CIFAR-10
(X_train, y_train), (X_test, y_test) = cifar10.load_data()
class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck']

# Normalize
X_train = X_train.astype('float32') / 255.0
X_test = X_test.astype('float32') / 255.0

# Build custom CNN
def create_cnn():
    model = models.Sequential([
        layers.Conv2D(32, (3, 3), activation='relu', padding='same', input_shape=(32, 32, 3)),
        layers.BatchNormalization(),
        layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.2),
        
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.3),
        
        layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        layers.Dropout(0.4),
        
        layers.Flatten(),
        layers.Dense(256, activation='relu'),
        layers.BatchNormalization(),
        layers.Dropout(0.5),
        layers.Dense(10, activation='softmax')
    ])
    return model

# Data augmentation
datagen = ImageDataGenerator(
    rotation_range=15,
    width_shift_range=0.1,
    height_shift_range=0.1,
    horizontal_flip=True
)

# Train custom CNN
cnn_model = create_cnn()
cnn_model.compile(optimizer='adam',
                  loss='sparse_categorical_crossentropy',
                  metrics=['accuracy'])

history = cnn_model.fit(datagen.flow(X_train, y_train, batch_size=64),
                       epochs=50,
                       validation_data=(X_test, y_test))

# Transfer learning with VGG16
base_model = VGG16(weights='imagenet', include_top=False, input_shape=(32, 32, 3))
base_model.trainable = False

transfer_model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(256, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

transfer_model.compile(optimizer='adam',
                      loss='sparse_categorical_crossentropy',
                      metrics=['accuracy'])

# Compare models
print("Custom CNN Test Accuracy:", cnn_model.evaluate(X_test, y_test)[1])
print("Transfer Learning Test Accuracy:", transfer_model.evaluate(X_test, y_test)[1])`
};

// Week 10: Natural Language Processing with RNNs

export const week10Lesson1 = {
    title: 'Introduction to NLP',
    videoUrl: 'https://www.youtube.com/embed/fNxaJsNG3-s',
    notes: `# Introduction to Natural Language Processing

## What is NLP?

Natural Language Processing enables computers to understand, interpret, and generate human language.

## NLP Tasks

### Text Classification
- Sentiment analysis
- Spam detection
- Topic categorization

### Named Entity Recognition
- Identify people, places, organizations
- Extract structured information

### Machine Translation
- Translate between languages
- Google Translate, DeepL

### Text Generation
- Chatbots
- Story generation
- Code completion

### Question Answering
- Search engines
- Virtual assistants

## Challenges in NLP

- **Ambiguity**: Words have multiple meanings
- **Context**: Meaning depends on context
- **Sarcasm**: Difficult to detect
- **Language variety**: Slang, dialects
- **Grammar**: Complex rules

## NLP Pipeline

1. **Text Preprocessing**: Clean and normalize
2. **Tokenization**: Split into words/tokens
3. **Representation**: Convert to numbers
4. **Model**: Process with ML/DL
5. **Output**: Generate predictions`,
    codeSnippet: `import re
import string
from collections import Counter

# Sample texts
texts = [
    "I love this movie! It's fantastic!",
    "Terrible product. Very disappointed.",
    "The weather is nice today.",
]

# Basic text preprocessing
def preprocess_text(text):
    # Lowercase
    text = text.lower()
    # Remove URLs
    text = re.sub(r'http\\S+|www\\S+', '', text)
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Remove extra whitespace
    text = ' '.join(text.split())
    return text

# Process texts
processed = [preprocess_text(t) for t in texts]
print("Processed texts:")
for orig, proc in zip(texts, processed):
    print(f"Original: {orig}")
    print(f"Processed: {proc}")
    print()

# Tokenization
tokens = [text.split() for text in processed]
print("Tokens:", tokens)

# Vocabulary
all_words = [word for text_tokens in tokens for word in text_tokens]
vocab = Counter(all_words)
print(f"Vocabulary size: {len(vocab)}")
print(f"Most common: {vocab.most_common(5)}")`
};

export const week10Lesson2 = {
    title: 'Text Preprocessing',
    videoUrl: 'https://www.youtube.com/embed/fNxaJsNG3-s',
    notes: `# Text Preprocessing

## Why Preprocess?

- Remove noise
- Standardize format
- Reduce vocabulary size
- Improve model performance

## Common Steps

### 1. Lowercasing
Convert all text to lowercase for consistency.

### 2. Remove Special Characters
- URLs
- Email addresses
- HTML tags
- Special symbols

### 3. Remove Punctuation
Keep only alphanumeric characters.

### 4. Tokenization
Split text into words or subwords.

### 5. Remove Stop Words
Common words with little meaning:
- the, is, at, which, on

### 6. Stemming/Lemmatization
- **Stemming**: running → run (crude)
- **Lemmatization**: better → good (proper)

### 7. Handle Numbers
- Remove completely
- Replace with placeholder
- Keep if important

## Text Representation

### Bag of Words (BoW)
Count word occurrences, ignore order.

### TF-IDF
Weight words by importance:
- TF: Term Frequency
- IDF: Inverse Document Frequency

### Word Embeddings
Dense vectors capturing meaning.`,
    codeSnippet: `import re
import string
import nltk
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

# Download required NLTK data
# nltk.download('stopwords')
# nltk.download('punkt')

# Sample texts
texts = [
    "I love this movie! It's absolutely fantastic!!!",
    "This product is terrible. Very disappointed with quality.",
    "The weather today is nice and sunny.",
    "Check out our website at www.example.com for more info!"
]

def advanced_preprocess(text):
    # Lowercase
    text = text.lower()
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    return text

# Preprocess texts
processed_texts = [advanced_preprocess(t) for t in texts]

print("Text Preprocessing Results:")
for i, (orig, proc) in enumerate(zip(texts, processed_texts)):
    print(f"\nText {i+1}:")
    print(f"  Original: {orig}")
    print(f"  Processed: {proc}")

# Bag of Words
bow_vectorizer = CountVectorizer()
bow_matrix = bow_vectorizer.fit_transform(processed_texts)

print(f"\nBag of Words:")
print(f"Vocabulary: {bow_vectorizer.get_feature_names_out()}")
print(f"Matrix shape: {bow_matrix.shape}")

# TF-IDF
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(processed_texts)

print(f"\nTF-IDF:")
print(f"Matrix shape: {tfidf_matrix.shape}")
print(f"Sample TF-IDF values: {tfidf_matrix[0].toarray()}")`
};

export const week10Lesson3 = {
    title: 'Word Embeddings',
    videoUrl: 'https://www.youtube.com/embed/ERibwqs9p38',
    notes: `# Word Embeddings

## What are Word Embeddings?

Dense vector representations of words that capture semantic meaning and relationships.

## Problems with Traditional Methods

### One-Hot Encoding
- Sparse vectors (mostly zeros)
- No semantic relationships
- Vocabulary size = vector dimension

### Bag of Words
- Ignores word order
- No semantic similarity
- High dimensionality

## Word Embeddings Advantages

- **Dense representations**: Typically 50-300 dimensions
- **Semantic relationships**: Similar words have similar vectors
- **Arithmetic properties**: king - man + woman ≈ queen
- **Transfer learning**: Pre-trained embeddings available

## Popular Embedding Methods

### Word2Vec (2013)
- Skip-gram: Predict context from word
- CBOW: Predict word from context
- Fast training, good quality

### GloVe (2014)
- Global Vectors for Word Representation
- Uses global word co-occurrence statistics
- Good performance on analogies

### FastText (2016)
- Extension of Word2Vec
- Uses subword information
- Handles out-of-vocabulary words

## Embedding Properties

### Semantic Similarity
Words with similar meanings have similar vectors:
- dog ≈ puppy ≈ canine

### Analogies
Vector arithmetic captures relationships:
- Paris - France + Italy ≈ Rome
- bigger - big + small ≈ smaller

### Clustering
Related words cluster together in vector space.

## Using Pre-trained Embeddings

Popular pre-trained embeddings:
- Word2Vec (Google)
- GloVe (Stanford)
- FastText (Facebook)`,
    codeSnippet: `import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA

# Simulate word embeddings (in practice, use pre-trained)
np.random.seed(42)

# Create sample vocabulary
words = ['king', 'queen', 'man', 'woman', 'prince', 'princess',
         'dog', 'puppy', 'cat', 'kitten', 'car', 'vehicle']

# Generate embeddings with some structure
embeddings = {}
for word in words:
    embeddings[word] = np.random.randn(50)

# Add some semantic structure
# Royalty cluster
royal_base = np.random.randn(50)
embeddings['king'] = royal_base + np.random.randn(50) * 0.3
embeddings['queen'] = royal_base + np.random.randn(50) * 0.3
embeddings['prince'] = royal_base + np.random.randn(50) * 0.3
embeddings['princess'] = royal_base + np.random.randn(50) * 0.3

# Gender relationships
gender_diff = np.random.randn(50)
embeddings['queen'] = embeddings['king'] + gender_diff
embeddings['woman'] = embeddings['man'] + gender_diff
embeddings['princess'] = embeddings['prince'] + gender_diff

# Animals cluster
animal_base = np.random.randn(50)
embeddings['dog'] = animal_base + np.random.randn(50) * 0.3
embeddings['puppy'] = animal_base + np.random.randn(50) * 0.3
embeddings['cat'] = animal_base + np.random.randn(50) * 0.3
embeddings['kitten'] = animal_base + np.random.randn(50) * 0.3

def cosine_sim(word1, word2):
    vec1 = embeddings[word1].reshape(1, -1)
    vec2 = embeddings[word2].reshape(1, -1)
    return cosine_similarity(vec1, vec2)[0][0]

# Test semantic similarity
print("Semantic Similarity:")
print(f"king - queen: {cosine_sim('king', 'queen'):.3f}")
print(f"dog - puppy: {cosine_sim('dog', 'puppy'):.3f}")
print(f"king - dog: {cosine_sim('king', 'dog'):.3f}")

# Visualize embeddings
embedding_matrix = np.array([embeddings[word] for word in words])
pca = PCA(n_components=2)
embeddings_2d = pca.fit_transform(embedding_matrix)

plt.figure(figsize=(10, 8))
plt.scatter(embeddings_2d[:, 0], embeddings_2d[:, 1])
for i, word in enumerate(words):
    plt.annotate(word, (embeddings_2d[i, 0], embeddings_2d[i, 1]))
plt.title('Word Embeddings Visualization (2D PCA)')
plt.xlabel('First Principal Component')
plt.ylabel('Second Principal Component')
plt.grid(True, alpha=0.3)
plt.show()

# Analogy example: king - man + woman ≈ queen
def analogy(a, b, c):
    """Find word d such that a:b :: c:d"""
    target = embeddings[a] - embeddings[b] + embeddings[c]
    best_word = None
    best_sim = -1
    
    for word in words:
        if word not in [a, b, c]:
            sim = cosine_similarity(target.reshape(1, -1), 
                                  embeddings[word].reshape(1, -1))[0][0]
            if sim > best_sim:
                best_sim = sim
                best_word = word
    
    return best_word, best_sim

result, similarity = analogy('king', 'man', 'woman')
print(f"\\nAnalogy: king - man + woman ≈ {result} (similarity: {similarity:.3f})")`
};

export const week10Lesson4 = {
    title: 'RNNs and LSTMs',
    videoUrl: 'https://www.youtube.com/embed/WCUNPb-5EYI',
    notes: `# Recurrent Neural Networks (RNNs)

## Why RNNs for Sequences?

Traditional neural networks:
- Fixed input/output size
- No memory of previous inputs
- Can't handle variable-length sequences

RNNs:
- Process sequences step by step
- Maintain hidden state (memory)
- Share parameters across time steps

## RNN Architecture

\`\`\`
x₁ → [RNN] → h₁ → y₁
      ↓
x₂ → [RNN] → h₂ → y₂
      ↓
x₃ → [RNN] → h₃ → y₃
\`\`\`

Hidden state: **h_t = f(W_h × h_{t-1} + W_x × x_t + b)**

## RNN Types

### Many-to-One
- Sequence → Single output
- Example: Sentiment analysis

### One-to-Many
- Single input → Sequence
- Example: Image captioning

### Many-to-Many
- Sequence → Sequence
- Example: Machine translation

## Problems with Vanilla RNNs

### Vanishing Gradient
- Gradients become very small
- Can't learn long-term dependencies
- Information from early steps is lost

### Exploding Gradient
- Gradients become very large
- Unstable training
- Solution: Gradient clipping

## Long Short-Term Memory (LSTM)

LSTM solves vanishing gradient with gates:

### Forget Gate
Decides what information to discard from cell state.

### Input Gate
Decides what new information to store.

### Output Gate
Decides what parts of cell state to output.

### Cell State
Long-term memory that flows through network.

## LSTM Advantages

- Learn long-term dependencies
- Better gradient flow
- More stable training
- State-of-the-art for many sequence tasks

## Bidirectional RNNs

Process sequence in both directions:
- Forward: left to right
- Backward: right to left
- Combine both for final output

Better context understanding!`,
    codeSnippet: `from tensorflow.keras import layers, models
from tensorflow.keras.datasets import imdb
from tensorflow.keras.preprocessing.sequence import pad_sequences
import numpy as np

# Load IMDB dataset for sentiment analysis
max_features = 10000
max_len = 200

(X_train, y_train), (X_test, y_test) = imdb.load_data(num_words=max_features)

# Pad sequences
X_train = pad_sequences(X_train, maxlen=max_len)
X_test = pad_sequences(X_test, maxlen=max_len)

print(f"Training data shape: {X_train.shape}")
print(f"Test data shape: {X_test.shape}")

# Simple RNN model
def create_rnn_model():
    model = models.Sequential([
        layers.Embedding(max_features, 128, input_length=max_len),
        layers.SimpleRNN(64, return_sequences=True),
        layers.SimpleRNN(32),
        layers.Dense(16, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')
    ])
    return model

# LSTM model
def create_lstm_model():
    model = models.Sequential([
        layers.Embedding(max_features, 128, input_length=max_len),
        layers.LSTM(64, return_sequences=True),
        layers.LSTM(32),
        layers.Dense(16, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')
    ])
    return model

# Bidirectional LSTM
def create_bidirectional_model():
    model = models.Sequential([
        layers.Embedding(max_features, 128, input_length=max_len),
        layers.Bidirectional(layers.LSTM(64, return_sequences=True)),
        layers.Bidirectional(layers.LSTM(32)),
        layers.Dense(16, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')
    ])
    return model

# Create models
rnn_model = create_rnn_model()
lstm_model = create_lstm_model()
bi_lstm_model = create_bidirectional_model()

# Compile models
for model in [rnn_model, lstm_model, bi_lstm_model]:
    model.compile(optimizer='adam',
                  loss='binary_crossentropy',
                  metrics=['accuracy'])

print("RNN Model:")
rnn_model.summary()

print("\\nLSTM Model:")
lstm_model.summary()

print("\\nBidirectional LSTM Model:")
bi_lstm_model.summary()

# Train LSTM model (example)
history = lstm_model.fit(X_train, y_train,
                        epochs=3,
                        batch_size=64,
                        validation_split=0.2,
                        verbose=1)

# Evaluate
test_loss, test_acc = lstm_model.evaluate(X_test, y_test, verbose=0)
print(f"\\nLSTM Test Accuracy: {test_acc:.4f}")`
};

export const week10Lesson5 = {
    title: 'Sentiment Analysis Project',
    videoUrl: 'https://www.youtube.com/embed/QpzMWQvxXWk',
    notes: `# Sentiment Analysis with RNNs

## Project Overview

Build a sentiment analysis system that classifies movie reviews as positive or negative.

## Dataset: IMDB Movie Reviews

- 50,000 movie reviews
- Binary classification (positive/negative)
- Balanced dataset (25k each)
- Variable length sequences

## Implementation Steps

### 1. Data Preprocessing
- Load IMDB dataset
- Limit vocabulary size
- Pad sequences to fixed length
- Split train/validation/test

### 2. Text Representation
- Word indices (integer encoding)
- Embedding layer (learnable)
- Or use pre-trained embeddings

### 3. Model Architecture
- Embedding layer
- LSTM/GRU layers
- Dense layers for classification
- Dropout for regularization

### 4. Training
- Binary crossentropy loss
- Adam optimizer
- Monitor validation accuracy
- Early stopping

### 5. Evaluation
- Test set accuracy
- Confusion matrix
- Sample predictions
- Error analysis

## Model Variations

### Simple LSTM
Single LSTM layer with dense output.

### Stacked LSTM
Multiple LSTM layers for deeper learning.

### Bidirectional LSTM
Process text in both directions.

### CNN-LSTM Hybrid
CNN for local features, LSTM for sequences.

## Hyperparameter Tuning

- Embedding dimension
- LSTM units
- Number of layers
- Dropout rate
- Learning rate
- Batch size

## Deployment Considerations

- Model size optimization
- Inference speed
- Real-time predictions
- API integration`,
    codeSnippet: `from tensorflow.keras.datasets import imdb
from tensorflow.keras import models, layers
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping
import numpy as np
import matplotlib.pyplot as plt

# Load data
max_features = 10000
max_len = 500

(X_train, y_train), (X_test, y_test) = imdb.load_data(num_words=max_features)

# Pad sequences
X_train = pad_sequences(X_train, maxlen=max_len, padding='post', truncating='post')
X_test = pad_sequences(X_test, maxlen=max_len, padding='post', truncating='post')

print(f"Training samples: {len(X_train)}")
print(f"Test samples: {len(X_test)}")
print(f"Average review length: {np.mean([len(x) for x in X_train]):.1f}")

# Build sentiment analysis model
def create_sentiment_model():
    model = models.Sequential([
        # Embedding layer
        layers.Embedding(max_features, 128, input_length=max_len),
        
        # LSTM layers
        layers.LSTM(64, return_sequences=True, dropout=0.2, recurrent_dropout=0.2),
        layers.LSTM(32, dropout=0.2, recurrent_dropout=0.2),
        
        # Dense layers
        layers.Dense(32, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')
    ])
    return model

# Create and compile model
model = create_sentiment_model()
model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

print("Model Architecture:")
model.summary()

# Train model
early_stopping = EarlyStopping(patience=3, restore_best_weights=True)

history = model.fit(X_train, y_train,
                   epochs=10,
                   batch_size=64,
                   validation_split=0.2,
                   callbacks=[early_stopping],
                   verbose=1)

# Evaluate
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {test_acc:.4f}")

# Plot training history
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Training Loss')
plt.plot(history.history['val_loss'], label='Validation Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.title('Model Loss')
plt.legend()

plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.title('Model Accuracy')
plt.legend()

plt.tight_layout()
plt.show()

# Test on sample reviews
def predict_sentiment(text, model, word_index, max_len=500):
    # Convert text to sequence
    words = text.lower().split()
    sequence = [word_index.get(word, 0) for word in words]
    sequence = pad_sequences([sequence], maxlen=max_len)
    
    # Predict
    prediction = model.predict(sequence)[0][0]
    sentiment = "Positive" if prediction > 0.5 else "Negative"
    confidence = prediction if prediction > 0.5 else 1 - prediction
    
    return sentiment, confidence

# Get word index
word_index = imdb.get_word_index()

# Test samples
test_reviews = [
    "This movie was absolutely fantastic! Great acting and plot.",
    "Terrible movie. Waste of time. Very disappointed.",
    "It was okay, nothing special but not bad either."
]

print("\\nSample Predictions:")
for review in test_reviews:
    sentiment, confidence = predict_sentiment(review, model, word_index)
    print(f"Review: {review}")
    print(f"Prediction: {sentiment} (confidence: {confidence:.3f})\\n")`
};

export const week10Lesson6 = {
    title: 'Sequence-to-Sequence Models',
    videoUrl: 'https://www.youtube.com/embed/G5RY_SUJih4',
    notes: `# Sequence-to-Sequence Models

## What are Seq2Seq Models?

Models that transform one sequence into another sequence, potentially of different lengths.

## Applications

### Machine Translation
- English → French
- Variable input/output lengths
- Preserve meaning across languages

### Text Summarization
- Long document → Short summary
- Extract key information
- Maintain coherence

### Chatbots
- User message → Bot response
- Context understanding
- Natural conversation

### Code Generation
- Natural language → Code
- Documentation → Implementation

## Encoder-Decoder Architecture

### Encoder
- Processes input sequence
- Creates fixed-size context vector
- Captures input information

### Decoder
- Generates output sequence
- Uses context vector
- Produces one token at a time

### Training
- Teacher forcing: Use true previous output
- Faster convergence
- Exposure bias problem

### Inference
- Autoregressive generation
- Use model's own predictions
- Beam search for better results

## Attention Mechanism

### Problem with Basic Seq2Seq
- Fixed-size context vector bottleneck
- Information loss for long sequences
- Poor performance on long inputs

### Attention Solution
- Decoder can "attend" to all encoder states
- Weighted combination of encoder outputs
- Dynamic context for each output step

### Benefits
- Better long sequence handling
- Interpretable alignments
- State-of-the-art performance

## Modern Improvements

### Transformer Architecture
- Self-attention mechanism
- Parallel processing
- Better than RNN-based models

### BERT and GPT
- Pre-trained language models
- Transfer learning for NLP
- State-of-the-art results`,
    codeSnippet: `from tensorflow.keras import layers, models, Input, Model
import numpy as np

# Simple Seq2Seq example for character-level translation
def create_seq2seq_model(input_vocab_size, output_vocab_size, latent_dim=256):
    # Encoder
    encoder_inputs = Input(shape=(None,))
    encoder_embedding = layers.Embedding(input_vocab_size, latent_dim)(encoder_inputs)
    encoder_lstm = layers.LSTM(latent_dim, return_state=True)
    encoder_outputs, state_h, state_c = encoder_lstm(encoder_embedding)
    encoder_states = [state_h, state_c]
    
    # Decoder
    decoder_inputs = Input(shape=(None,))
    decoder_embedding = layers.Embedding(output_vocab_size, latent_dim)(decoder_inputs)
    decoder_lstm = layers.LSTM(latent_dim, return_sequences=True, return_state=True)
    decoder_outputs, _, _ = decoder_lstm(decoder_embedding, initial_state=encoder_states)
    decoder_dense = layers.Dense(output_vocab_size, activation='softmax')
    decoder_outputs = decoder_dense(decoder_outputs)
    
    # Model
    model = Model([encoder_inputs, decoder_inputs], decoder_outputs)
    return model

# Attention mechanism example
class AttentionLayer(layers.Layer):
    def __init__(self, units):
        super(AttentionLayer, self).__init__()
        self.W1 = layers.Dense(units)
        self.W2 = layers.Dense(units)
        self.V = layers.Dense(1)
    
    def call(self, query, values):
        # query: decoder hidden state
        # values: encoder outputs
        
        # Expand query to match values shape
        query_with_time_axis = tf.expand_dims(query, 1)
        
        # Calculate attention scores
        score = self.V(tf.nn.tanh(
            self.W1(query_with_time_axis) + self.W2(values)))
        
        # Attention weights
        attention_weights = tf.nn.softmax(score, axis=1)
        
        # Context vector
        context_vector = attention_weights * values
        context_vector = tf.reduce_sum(context_vector, axis=1)
        
        return context_vector, attention_weights

# Example: Simple character-level seq2seq
def prepare_data():
    # Sample data: English to "Pig Latin" translation
    input_texts = ['hello', 'world', 'machine', 'learning']
    target_texts = ['ello-hay', 'orld-way', 'achine-may', 'earning-lay']
    
    # Create character mappings
    input_chars = set(''.join(input_texts))
    target_chars = set(''.join(target_texts))
    
    input_char_to_idx = {char: i for i, char in enumerate(sorted(input_chars))}
    target_char_to_idx = {char: i for i, char in enumerate(sorted(target_chars))}
    
    return input_texts, target_texts, input_char_to_idx, target_char_to_idx

# Prepare sample data
input_texts, target_texts, input_char_to_idx, target_char_to_idx = prepare_data()

print("Sample Seq2Seq Data:")
for inp, tgt in zip(input_texts, target_texts):
    print(f"Input: {inp} → Target: {tgt}")

print(f"\\nInput vocabulary size: {len(input_char_to_idx)}")
print(f"Target vocabulary size: {len(target_char_to_idx)}")

# Create model
model = create_seq2seq_model(
    input_vocab_size=len(input_char_to_idx),
    output_vocab_size=len(target_char_to_idx),
    latent_dim=128
)

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
print("\\nSeq2Seq Model Architecture:")
model.summary()

# Beam search example (conceptual)
def beam_search(model, input_seq, beam_width=3, max_length=10):
    """
    Beam search for better sequence generation
    """
    # Initialize beam with start token
    beams = [([], 0.0)]  # (sequence, score)
    
    for _ in range(max_length):
        candidates = []
        
        for seq, score in beams:
            if len(seq) > 0 and seq[-1] == '<END>':
                candidates.append((seq, score))
                continue
            
            # Get next token probabilities (simplified)
            # In practice, use model.predict()
            next_probs = np.random.rand(len(target_char_to_idx))
            
            # Add top candidates
            for i, prob in enumerate(next_probs):
                new_seq = seq + [i]
                new_score = score + np.log(prob)
                candidates.append((new_seq, new_score))
        
        # Keep top beam_width candidates
        beams = sorted(candidates, key=lambda x: x[1], reverse=True)[:beam_width]
    
    return beams[0][0]  # Return best sequence

print("\\nBeam search helps generate better sequences by exploring multiple paths!")`
};

export const week10Quiz = {
    title: 'Week 10 Quiz: NLP with RNNs',
    questions: [
        {
            id: 1,
            question: 'What is the main advantage of RNNs over traditional neural networks for text processing?',
            options: [
                'They are faster to train',
                'They can handle variable-length sequences and maintain memory',
                'They require less data',
                'They are more interpretable'
            ],
            correctAnswer: 1,
            explanation: 'RNNs can process variable-length sequences and maintain a hidden state that acts as memory, allowing them to capture sequential dependencies in text.'
        },
        {
            id: 2,
            question: 'What problem do word embeddings solve compared to one-hot encoding?',
            options: [
                'They are faster to compute',
                'They capture semantic relationships and are more compact',
                'They work with any vocabulary size',
                'They eliminate the need for preprocessing'
            ],
            correctAnswer: 1,
            explanation: 'Word embeddings create dense vector representations that capture semantic relationships between words, unlike sparse one-hot vectors that treat all words as equally different.'
        },
        {
            id: 3,
            question: 'What is the vanishing gradient problem in RNNs?',
            options: [
                'Gradients become too large during training',
                'Gradients become very small, making it hard to learn long-term dependencies',
                'The model forgets recent inputs',
                'Training becomes too slow'
            ],
            correctAnswer: 1,
            explanation: 'The vanishing gradient problem occurs when gradients become exponentially smaller as they propagate back through time, making it difficult for RNNs to learn long-term dependencies.'
        },
        {
            id: 4,
            question: 'How do LSTMs solve the vanishing gradient problem?',
            options: [
                'By using larger learning rates',
                'By using gates to control information flow and maintain cell state',
                'By reducing the number of layers',
                'By using different activation functions'
            ],
            correctAnswer: 1,
            explanation: 'LSTMs use forget, input, and output gates to control information flow, along with a cell state that can maintain information over long sequences, solving the vanishing gradient problem.'
        },
        {
            id: 5,
            question: 'What does TF-IDF measure?',
            options: [
                'The frequency of words in a document',
                'The importance of a word in a document relative to a collection of documents',
                'The similarity between two documents',
                'The length of a document'
            ],
            correctAnswer: 1,
            explanation: 'TF-IDF (Term Frequency-Inverse Document Frequency) measures how important a word is to a document in a collection, balancing word frequency with rarity across the corpus.'
        },
        {
            id: 6,
            question: 'What is the purpose of padding in sequence processing?',
            options: [
                'To make sequences longer',
                'To make all sequences the same length for batch processing',
                'To add more information to sequences',
                'To remove noise from sequences'
            ],
            correctAnswer: 1,
            explanation: 'Padding adds special tokens (usually zeros) to make all sequences in a batch the same length, enabling efficient batch processing in neural networks.'
        },
        {
            id: 7,
            question: 'What advantage do bidirectional RNNs have over unidirectional ones?',
            options: [
                'They train faster',
                'They can access both past and future context',
                'They use less memory',
                'They work better with short sequences'
            ],
            correctAnswer: 1,
            explanation: 'Bidirectional RNNs process sequences in both forward and backward directions, allowing them to access both past and future context when making predictions.'
        },
        {
            id: 8,
            question: 'In sentiment analysis, what type of RNN architecture is typically used?',
            options: [
                'Many-to-many',
                'Many-to-one',
                'One-to-many',
                'One-to-one'
            ],
            correctAnswer: 1,
            explanation: 'Sentiment analysis uses many-to-one architecture where a sequence of words (input) is mapped to a single sentiment label (output).'
        },
        {
            id: 9,
            question: 'What is the encoder-decoder architecture used for?',
            options: [
                'Image classification',
                'Sequence-to-sequence tasks like translation',
                'Clustering',
                'Dimensionality reduction'
            ],
            correctAnswer: 1,
            explanation: 'Encoder-decoder architecture is used for sequence-to-sequence tasks where input and output sequences can have different lengths, such as machine translation or text summarization.'
        },
        {
            id: 10,
            question: 'What problem does the attention mechanism solve in seq2seq models?',
            options: [
                'Slow training speed',
                'The bottleneck of fixed-size context vectors for long sequences',
                'Overfitting',
                'Memory usage'
            ],
            correctAnswer: 1,
            explanation: 'Attention mechanism allows the decoder to access all encoder hidden states rather than just a fixed-size context vector, solving the information bottleneck problem for long sequences.'
        }
    ]
};

export const week10Project = {
    title: 'Week 10 Project: Advanced Sentiment Analysis System',
    videoUrl: 'https://www.youtube.com/embed/QpzMWQvxXWk',
    notes: `# Week 10 Project: Advanced Sentiment Analysis System

## Project Overview

Build a comprehensive sentiment analysis system that can classify text sentiment and provide confidence scores, with multiple model architectures and deployment capabilities.

## Objectives

- Implement multiple RNN architectures
- Compare model performance
- Build preprocessing pipeline
- Create evaluation framework
- Deploy model for real-time inference

## Requirements

### 1. Data Preparation
- Use IMDB movie reviews dataset
- Implement comprehensive text preprocessing
- Create train/validation/test splits
- Handle class imbalance if present

### 2. Multiple Model Architectures
Build and compare:
- Simple RNN baseline
- LSTM model
- Bidirectional LSTM
- GRU model
- CNN-LSTM hybrid

### 3. Advanced Features
- Pre-trained word embeddings (GloVe/Word2Vec)
- Attention mechanism implementation
- Ensemble methods
- Cross-validation

### 4. Evaluation Framework
- Accuracy, precision, recall, F1-score
- Confusion matrix analysis
- ROC curves and AUC
- Error analysis with sample predictions

### 5. Model Optimization
- Hyperparameter tuning
- Learning rate scheduling
- Early stopping
- Model checkpointing

### 6. Deployment
- Save best model
- Create prediction API
- Build simple web interface
- Real-time sentiment prediction

## Deliverables

1. Complete Jupyter notebook with analysis
2. Multiple trained models with comparisons
3. Preprocessing pipeline module
4. Evaluation report with visualizations
5. Deployment code (Flask/FastAPI)
6. Web interface for testing
7. Documentation and README

## Evaluation Criteria

- Test accuracy > 88%
- Multiple architectures implemented
- Proper evaluation methodology
- Clear visualizations and analysis
- Working deployment
- Professional documentation

## Bonus Challenges

- Implement attention visualization
- Multi-class sentiment (positive/negative/neutral)
- Real-time Twitter sentiment analysis
- Aspect-based sentiment analysis
- Model interpretability with LIME/SHAP
- Docker containerization`,
    codeSnippet: `import numpy as np
import pandas as pd
from tensorflow.keras.datasets import imdb
from tensorflow.keras import models, layers
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Project configuration
MAX_FEATURES = 10000
MAX_LEN = 500
EMBEDDING_DIM = 128

class SentimentAnalyzer:
    def __init__(self, max_features=MAX_FEATURES, max_len=MAX_LEN):
        self.max_features = max_features
        self.max_len = max_len
        self.models = {}
        self.histories = {}
        
    def load_data(self):
        """Load and preprocess IMDB dataset"""
        (X_train, y_train), (X_test, y_test) = imdb.load_data(num_words=self.max_features)
        
        # Pad sequences
        X_train = pad_sequences(X_train, maxlen=self.max_len)
        X_test = pad_sequences(X_test, maxlen=self.max_len)
        
        self.X_train, self.y_train = X_train, y_train
        self.X_test, self.y_test = X_test, y_test
        
        print(f"Training samples: {len(X_train)}")
        print(f"Test samples: {len(X_test)}")
        
    def create_simple_rnn(self):
        """Simple RNN baseline"""
        model = models.Sequential([
            layers.Embedding(self.max_features, EMBEDDING_DIM, input_length=self.max_len),
            layers.SimpleRNN(64),
            layers.Dense(32, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(1, activation='sigmoid')
        ])
        return model
    
    def create_lstm(self):
        """LSTM model"""
        model = models.Sequential([
            layers.Embedding(self.max_features, EMBEDDING_DIM, input_length=self.max_len),
            layers.LSTM(64, dropout=0.2, recurrent_dropout=0.2),
            layers.Dense(32, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(1, activation='sigmoid')
        ])
        return model
    
    def create_bidirectional_lstm(self):
        """Bidirectional LSTM"""
        model = models.Sequential([
            layers.Embedding(self.max_features, EMBEDDING_DIM, input_length=self.max_len),
            layers.Bidirectional(layers.LSTM(64, dropout=0.2, recurrent_dropout=0.2)),
            layers.Dense(32, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(1, activation='sigmoid')
        ])
        return model
    
    def create_cnn_lstm(self):
        """CNN-LSTM hybrid"""
        model = models.Sequential([
            layers.Embedding(self.max_features, EMBEDDING_DIM, input_length=self.max_len),
            layers.Conv1D(64, 5, activation='relu'),
            layers.MaxPooling1D(5),
            layers.LSTM(64, dropout=0.2, recurrent_dropout=0.2),
            layers.Dense(32, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(1, activation='sigmoid')
        ])
        return model
    
    def train_model(self, model_name, model, epochs=10):
        """Train a model with callbacks"""
        model.compile(optimizer='adam',
                     loss='binary_crossentropy',
                     metrics=['accuracy'])
        
        callbacks = [
            EarlyStopping(patience=3, restore_best_weights=True),
            ModelCheckpoint(f'{model_name}_best.h5', save_best_only=True)
        ]
        
        history = model.fit(self.X_train, self.y_train,
                           epochs=epochs,
                           batch_size=64,
                           validation_split=0.2,
                           callbacks=callbacks,
                           verbose=1)
        
        self.models[model_name] = model
        self.histories[model_name] = history
        
        return model, history
    
    def evaluate_models(self):
        """Evaluate all trained models"""
        results = {}
        
        for name, model in self.models.items():
            test_loss, test_acc = model.evaluate(self.X_test, self.y_test, verbose=0)
            y_pred = (model.predict(self.X_test) > 0.5).astype(int)
            
            results[name] = {
                'accuracy': test_acc,
                'loss': test_loss,
                'predictions': y_pred
            }
            
            print(f"{name} - Test Accuracy: {test_acc:.4f}")
        
        return results
    
    def plot_training_history(self):
        """Plot training history for all models"""
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        axes = axes.ravel()
        
        for idx, (name, history) in enumerate(self.histories.items()):
            if idx < 4:
                axes[idx].plot(history.history['accuracy'], label='Train')
                axes[idx].plot(history.history['val_accuracy'], label='Validation')
                axes[idx].set_title(f'{name} - Accuracy')
                axes[idx].set_xlabel('Epoch')
                axes[idx].set_ylabel('Accuracy')
                axes[idx].legend()
                axes[idx].grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.show()

# Usage example
analyzer = SentimentAnalyzer()
analyzer.load_data()

# Train multiple models
models_to_train = {
    'Simple_RNN': analyzer.create_simple_rnn(),
    'LSTM': analyzer.create_lstm(),
    'Bidirectional_LSTM': analyzer.create_bidirectional_lstm(),
    'CNN_LSTM': analyzer.create_cnn_lstm()
}

print("Training multiple models...")
for name, model in models_to_train.items():
    print(f"\\nTraining {name}...")
    analyzer.train_model(name, model, epochs=5)

# Evaluate all models
results = analyzer.evaluate_models()

# Plot training history
analyzer.plot_training_history()

print("\\nProject complete! All models trained and evaluated.")`
};