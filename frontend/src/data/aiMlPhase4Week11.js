// AI/ML Phase 4 - Week 11: Advanced Deep Learning and Transformers

// Week 11: Transformers and Modern NLP

export const week11Lesson1 = {
    title: 'Introduction to Transformers',
    videoUrl: 'https://www.youtube.com/embed/iDulhoQ2pro',
    notes: `# Introduction to Transformers

## What are Transformers?

Revolutionary neural network architecture that uses self-attention mechanisms to process sequences in parallel, replacing RNNs and CNNs for many NLP tasks.

## Key Innovation: Self-Attention

Unlike RNNs that process sequences step-by-step, Transformers can:
- Process all positions simultaneously
- Capture long-range dependencies efficiently
- Parallelize computation for faster training

## Problems with RNNs

- Sequential processing (slow)
- Vanishing gradients for long sequences
- Limited parallelization
- Difficulty capturing long-range dependencies

## Transformer Advantages

- **Parallelization**: Process entire sequence at once
- **Long-range dependencies**: Direct connections between any positions
- **Faster training**: No sequential bottleneck
- **Better performance**: State-of-the-art results

## Architecture Overview

\`\`\`
Input → Embedding → Positional Encoding
  ↓
Multi-Head Self-Attention
  ↓
Add & Norm
  ↓
Feed Forward Network
  ↓
Add & Norm
  ↓
Output
\`\`\`

## Applications

- Machine Translation (Google Translate)
- Text Summarization
- Question Answering
- Language Generation (GPT)
- Code Generation (GitHub Copilot)`,
    codeSnippet: `import numpy as np
import tensorflow as tf
from tensorflow.keras import layers

# Simple self-attention mechanism
def scaled_dot_product_attention(q, k, v, mask=None):
    """
    Calculate attention weights and apply to values
    q, k, v: query, key, value matrices
    """
    # Calculate attention scores
    matmul_qk = tf.matmul(q, k, transpose_b=True)
    
    # Scale by sqrt(d_k)
    dk = tf.cast(tf.shape(k)[-1], tf.float32)
    scaled_attention_logits = matmul_qk / tf.math.sqrt(dk)
    
    # Apply mask if provided
    if mask is not None:
        scaled_attention_logits += (mask * -1e9)
    
    # Softmax to get attention weights
    attention_weights = tf.nn.softmax(scaled_attention_logits, axis=-1)
    
    # Apply attention to values
    output = tf.matmul(attention_weights, v)
    
    return output, attention_weights

# Example usage
seq_len = 10
d_model = 64

# Create sample query, key, value matrices
q = tf.random.normal((1, seq_len, d_model))
k = tf.random.normal((1, seq_len, d_model))
v = tf.random.normal((1, seq_len, d_model))

# Apply attention
output, weights = scaled_dot_product_attention(q, k, v)

print(f"Input shape: {q.shape}")
print(f"Output shape: {output.shape}")
print(f"Attention weights shape: {weights.shape}")
print(f"Attention weights sum (should be 1): {tf.reduce_sum(weights[0, 0, :])}")`
};

export const week11Lesson2 = {
    title: 'Self-Attention Mechanism',
    videoUrl: 'https://www.youtube.com/embed/iDulhoQ2pro',
    notes: `# Self-Attention Mechanism

## What is Self-Attention?

A mechanism that allows each position in a sequence to attend to all positions in the same sequence, capturing relationships between words regardless of distance.

## Query, Key, Value (QKV)

### Query (Q)
- "What am I looking for?"
- Represents the current position asking questions

### Key (K)
- "What do I contain?"
- Represents what each position offers

### Value (V)
- "What information do I provide?"
- The actual content to be retrieved

## Attention Formula

**Attention(Q,K,V) = softmax(QK^T/√d_k)V**

### Steps:
1. Compute attention scores: QK^T
2. Scale by √d_k (prevents vanishing gradients)
3. Apply softmax (normalize to probabilities)
4. Weight the values: multiply by V

## Multi-Head Attention

Instead of single attention, use multiple "heads":
- Each head learns different relationships
- Parallel processing of different aspects
- Concatenate and project results

### Benefits:
- Capture different types of relationships
- More expressive power
- Better performance

## Positional Encoding

Since Transformers don't have inherent sequence order:
- Add positional information to embeddings
- Sinusoidal encoding for different frequencies
- Allows model to understand word positions

## Self-Attention vs RNN

### RNN:
- Sequential processing
- Limited context window
- Vanishing gradients

### Self-Attention:
- Parallel processing
- Global context access
- Direct connections between any positions`,
    codeSnippet: `import tensorflow as tf
from tensorflow.keras import layers
import numpy as np

class MultiHeadAttention(layers.Layer):
    def __init__(self, d_model, num_heads):
        super(MultiHeadAttention, self).__init__()
        self.num_heads = num_heads
        self.d_model = d_model
        
        assert d_model % self.num_heads == 0
        
        self.depth = d_model // self.num_heads
        
        self.wq = layers.Dense(d_model)
        self.wk = layers.Dense(d_model)
        self.wv = layers.Dense(d_model)
        
        self.dense = layers.Dense(d_model)
    
    def split_heads(self, x, batch_size):
        """Split the last dimension into (num_heads, depth)"""
        x = tf.reshape(x, (batch_size, -1, self.num_heads, self.depth))
        return tf.transpose(x, perm=[0, 2, 1, 3])
    
    def call(self, v, k, q, mask=None):
        batch_size = tf.shape(q)[0]
        
        # Linear transformations
        q = self.wq(q)  # (batch_size, seq_len, d_model)
        k = self.wk(k)
        v = self.wv(v)
        
        # Split into multiple heads
        q = self.split_heads(q, batch_size)  # (batch_size, num_heads, seq_len, depth)
        k = self.split_heads(k, batch_size)
        v = self.split_heads(v, batch_size)
        
        # Apply attention
        scaled_attention, attention_weights = scaled_dot_product_attention(q, k, v, mask)
        
        # Concatenate heads
        scaled_attention = tf.transpose(scaled_attention, perm=[0, 2, 1, 3])
        concat_attention = tf.reshape(scaled_attention, (batch_size, -1, self.d_model))
        
        # Final linear layer
        output = self.dense(concat_attention)
        
        return output, attention_weights

# Positional encoding
def get_angles(pos, i, d_model):
    angle_rates = 1 / np.power(10000, (2 * (i//2)) / np.float32(d_model))
    return pos * angle_rates

def positional_encoding(position, d_model):
    angle_rads = get_angles(np.arange(position)[:, np.newaxis],
                           np.arange(d_model)[np.newaxis, :],
                           d_model)
    
    # Apply sin to even indices
    angle_rads[:, 0::2] = np.sin(angle_rads[:, 0::2])
    
    # Apply cos to odd indices
    angle_rads[:, 1::2] = np.cos(angle_rads[:, 1::2])
    
    pos_encoding = angle_rads[np.newaxis, ...]
    
    return tf.cast(pos_encoding, dtype=tf.float32)

# Example usage
d_model = 128
num_heads = 8
seq_len = 50

# Create multi-head attention layer
mha = MultiHeadAttention(d_model, num_heads)

# Sample input
x = tf.random.normal((1, seq_len, d_model))

# Apply multi-head attention (self-attention)
output, weights = mha(x, x, x)

print(f"Input shape: {x.shape}")
print(f"Output shape: {output.shape}")
print(f"Attention weights shape: {weights.shape}")

# Add positional encoding
pos_encoding = positional_encoding(seq_len, d_model)
x_with_pos = x + pos_encoding

print(f"With positional encoding: {x_with_pos.shape}")`
};

export const week11Lesson3 = {
    title: 'BERT and Pre-trained Models',
    videoUrl: 'https://www.youtube.com/embed/xI0HHN5XKDo',
    notes: `# BERT and Pre-trained Language Models

## What is BERT?

**Bidirectional Encoder Representations from Transformers**
- Pre-trained on massive text corpus
- Bidirectional context understanding
- Fine-tunable for downstream tasks

## Pre-training vs Fine-tuning

### Pre-training
- Train on large unlabeled text (Wikipedia, books)
- Learn general language understanding
- Expensive, done once by research labs

### Fine-tuning
- Adapt pre-trained model to specific task
- Use smaller labeled dataset
- Fast and efficient

## BERT Architecture

- Stack of Transformer encoder layers
- Bidirectional attention (sees full context)
- Two pre-training objectives:
  - Masked Language Modeling (MLM)
  - Next Sentence Prediction (NSP)

## Masked Language Modeling

- Randomly mask 15% of tokens
- Predict masked tokens using context
- Forces model to understand bidirectional context

Example:
- Input: "The cat [MASK] on the mat"
- Target: "sat"

## BERT Variants

### BERT-Base
- 12 layers, 768 hidden units
- 110M parameters
- Good for most tasks

### BERT-Large
- 24 layers, 1024 hidden units
- 340M parameters
- Better performance, more compute

### RoBERTa
- Optimized BERT training
- No NSP, longer sequences
- Better performance

### DistilBERT
- Smaller, faster BERT
- 60% fewer parameters
- 97% of BERT performance

## Using Pre-trained BERT

1. Load pre-trained weights
2. Add task-specific head
3. Fine-tune on target dataset
4. Evaluate performance

## Applications

- Text Classification
- Named Entity Recognition
- Question Answering
- Sentiment Analysis
- Text Similarity`,
    codeSnippet: `from transformers import BertTokenizer, BertForSequenceClassification
from transformers import Trainer, TrainingArguments
import torch
from torch.utils.data import Dataset

# Load pre-trained BERT
model_name = 'bert-base-uncased'
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertForSequenceClassification.from_pretrained(model_name, num_labels=2)

# Example: Sentiment Analysis with BERT
class SentimentDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        # Tokenize
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

# Sample data
texts = [
    "I love this movie! It's fantastic!",
    "Terrible film. Complete waste of time.",
    "Pretty good, would recommend.",
    "Boring and predictable plot."
]
labels = [1, 0, 1, 0]  # 1: positive, 0: negative

# Create dataset
dataset = SentimentDataset(texts, labels, tokenizer)

# Training arguments
training_args = TrainingArguments(
    output_dir='./bert-sentiment',
    num_train_epochs=3,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=100,
    weight_decay=0.01,
    logging_dir='./logs',
)

# Create trainer
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset,
    eval_dataset=dataset,
)

# Fine-tune BERT (commented out for demo)
# trainer.train()

# Inference example
def predict_sentiment(text):
    inputs = tokenizer(text, return_tensors='pt', truncation=True, padding=True)
    
    with torch.no_grad():
        outputs = model(**inputs)
        predictions = torch.nn.functional.softmax(outputs.logits, dim=-1)
        
    return predictions.numpy()[0]

# Test prediction
test_text = "This movie is amazing!"
probs = predict_sentiment(test_text)
print(f"Text: {test_text}")
print(f"Negative: {probs[0]:.3f}, Positive: {probs[1]:.3f}")

# Tokenization example
sample_text = "Hello, how are you today?"
tokens = tokenizer.tokenize(sample_text)
token_ids = tokenizer.convert_tokens_to_ids(tokens)

print(f"Original: {sample_text}")
print(f"Tokens: {tokens}")
print(f"Token IDs: {token_ids}")

# Special tokens
print(f"[CLS] token: {tokenizer.cls_token} (ID: {tokenizer.cls_token_id})")
print(f"[SEP] token: {tokenizer.sep_token} (ID: {tokenizer.sep_token_id})")
print(f"[MASK] token: {tokenizer.mask_token} (ID: {tokenizer.mask_token_id})")`
};

export const week11Lesson4 = {
    title: 'GPT and Text Generation',
    videoUrl: 'https://www.youtube.com/embed/kCc8FmEb1nY',
    notes: `# GPT and Text Generation

## What is GPT?

**Generative Pre-trained Transformer**
- Autoregressive language model
- Generates text one token at a time
- Trained to predict next word in sequence

## GPT vs BERT

### BERT (Encoder-only)
- Bidirectional context
- Good for understanding tasks
- Classification, NER, QA

### GPT (Decoder-only)
- Unidirectional (left-to-right)
- Good for generation tasks
- Text completion, creative writing

## GPT Architecture

- Stack of Transformer decoder layers
- Masked self-attention (can't see future tokens)
- Causal language modeling objective

## Training Objective

**Predict next token given previous tokens:**
- Input: "The cat sat on"
- Target: "the"
- Loss: Cross-entropy between prediction and target

## GPT Evolution

### GPT-1 (2018)
- 117M parameters
- Proof of concept for unsupervised pre-training

### GPT-2 (2019)
- 1.5B parameters
- "Too dangerous to release" initially
- Impressive text generation

### GPT-3 (2020)
- 175B parameters
- Few-shot learning capabilities
- Human-like text generation

### GPT-4 (2023)
- Multimodal (text + images)
- Even better reasoning
- ChatGPT and API

## Text Generation Strategies

### Greedy Decoding
- Always pick highest probability token
- Deterministic but repetitive

### Sampling
- Sample from probability distribution
- More diverse but potentially incoherent

### Top-k Sampling
- Sample from top k most likely tokens
- Balance between diversity and quality

### Top-p (Nucleus) Sampling
- Sample from smallest set with cumulative probability p
- Adaptive vocabulary size

### Temperature Scaling
- Control randomness in sampling
- Low temperature: Conservative
- High temperature: Creative

## Applications

- Creative writing
- Code generation
- Chatbots and assistants
- Content creation
- Language translation`,
    codeSnippet: `from transformers import GPT2LMHeadModel, GPT2Tokenizer
import torch
import torch.nn.functional as F

# Load pre-trained GPT-2
model_name = 'gpt2'
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
model = GPT2LMHeadModel.from_pretrained(model_name)

# Add padding token
tokenizer.pad_token = tokenizer.eos_token

def generate_text(prompt, max_length=100, temperature=1.0, top_k=50, top_p=0.95):
    """Generate text using GPT-2 with various sampling strategies"""
    
    # Encode prompt
    input_ids = tokenizer.encode(prompt, return_tensors='pt')
    
    # Generate
    with torch.no_grad():
        for _ in range(max_length - len(input_ids[0])):
            # Get model predictions
            outputs = model(input_ids)
            logits = outputs.logits[0, -1, :]  # Last token logits
            
            # Apply temperature
            logits = logits / temperature
            
            # Top-k filtering
            if top_k > 0:
                top_k_logits, top_k_indices = torch.topk(logits, top_k)
                logits = torch.full_like(logits, float('-inf'))
                logits[top_k_indices] = top_k_logits
            
            # Top-p filtering
            if top_p < 1.0:
                sorted_logits, sorted_indices = torch.sort(logits, descending=True)
                cumulative_probs = torch.cumsum(F.softmax(sorted_logits, dim=-1), dim=-1)
                
                # Remove tokens with cumulative probability above threshold
                sorted_indices_to_remove = cumulative_probs > top_p
                sorted_indices_to_remove[1:] = sorted_indices_to_remove[:-1].clone()
                sorted_indices_to_remove[0] = 0
                
                indices_to_remove = sorted_indices[sorted_indices_to_remove]
                logits[indices_to_remove] = float('-inf')
            
            # Sample next token
            probs = F.softmax(logits, dim=-1)
            next_token = torch.multinomial(probs, 1)
            
            # Add to sequence
            input_ids = torch.cat([input_ids, next_token.unsqueeze(0)], dim=-1)
            
            # Stop if EOS token
            if next_token.item() == tokenizer.eos_token_id:
                break
    
    # Decode generated text
    generated_text = tokenizer.decode(input_ids[0], skip_special_tokens=True)
    return generated_text

# Example generations with different parameters
prompt = "The future of artificial intelligence"

print("=== Greedy Decoding (temperature=0.1) ===")
greedy_text = generate_text(prompt, max_length=50, temperature=0.1)
print(greedy_text)

print("\\n=== Creative Sampling (temperature=1.5) ===")
creative_text = generate_text(prompt, max_length=50, temperature=1.5)
print(creative_text)

print("\\n=== Balanced Generation (temperature=0.8, top_p=0.9) ===")
balanced_text = generate_text(prompt, max_length=50, temperature=0.8, top_p=0.9)
print(balanced_text)

# Demonstrate different prompts
prompts = [
    "Once upon a time in a distant galaxy",
    "The recipe for happiness includes",
    "In the year 2050, technology will",
    "def fibonacci(n):"
]

print("\\n=== Various Prompts ===")
for p in prompts:
    generated = generate_text(p, max_length=30, temperature=0.8)
    print(f"Prompt: {p}")
    print(f"Generated: {generated}")
    print("-" * 50)

# Calculate perplexity (model confidence)
def calculate_perplexity(text):
    """Calculate perplexity of text under the model"""
    input_ids = tokenizer.encode(text, return_tensors='pt')
    
    with torch.no_grad():
        outputs = model(input_ids, labels=input_ids)
        loss = outputs.loss
        perplexity = torch.exp(loss)
    
    return perplexity.item()

sample_texts = [
    "The cat sat on the mat.",
    "Quantum mechanics is fascinating.",
    "Colorless green ideas sleep furiously."  # Nonsensical sentence
]

print("\\n=== Perplexity Analysis ===")
for text in sample_texts:
    ppl = calculate_perplexity(text)
    print(f"Text: {text}")
    print(f"Perplexity: {ppl:.2f}")
    print()`
};

export const week11Lesson5 = {
    title: 'Fine-tuning Transformers',
    videoUrl: 'https://www.youtube.com/embed/SWp95OEpXuE',
    notes: `# Fine-tuning Transformers

## What is Fine-tuning?

Adapting a pre-trained model to a specific task by training on task-specific data while leveraging learned representations.

## Why Fine-tune?

### Advantages
- **Transfer Learning**: Leverage pre-trained knowledge
- **Less Data**: Need smaller datasets than training from scratch
- **Faster Training**: Start from good initialization
- **Better Performance**: Often beats training from scratch

### When to Fine-tune
- Limited labeled data
- Domain-specific tasks
- Want state-of-the-art performance
- Have computational constraints

## Fine-tuning Strategies

### 1. Feature Extraction
- Freeze pre-trained layers
- Train only new classification head
- Fast, works with small data

### 2. Full Fine-tuning
- Update all model parameters
- Better performance but needs more data
- Risk of overfitting

### 3. Gradual Unfreezing
- Start with frozen layers
- Gradually unfreeze from top
- Balance between stability and adaptation

### 4. Layer-wise Learning Rates
- Different learning rates for different layers
- Lower rates for early layers
- Higher rates for task-specific layers

## Fine-tuning Best Practices

### Learning Rate
- Use smaller learning rates (1e-5 to 5e-5)
- Pre-trained weights are already good
- Avoid catastrophic forgetting

### Batch Size
- Smaller batches often work better
- 16-32 typical for most tasks
- Depends on GPU memory

### Epochs
- Few epochs usually sufficient (2-5)
- Monitor validation performance
- Early stopping to prevent overfitting

### Data Preprocessing
- Match pre-training format
- Proper tokenization
- Handle special tokens correctly

## Task-Specific Adaptations

### Text Classification
- Add classification head
- Pool sequence representation
- Fine-tune entire model

### Named Entity Recognition
- Token-level classification
- Use token representations
- Handle label alignment

### Question Answering
- Predict start/end positions
- Use span-based approach
- Special answer extraction

## Evaluation Metrics

### Classification
- Accuracy, F1-score
- Precision, Recall
- Confusion matrix

### Generation
- BLEU, ROUGE scores
- Perplexity
- Human evaluation

### Domain-Specific
- Task-relevant metrics
- Business objectives
- User satisfaction`,
    codeSnippet: `from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    TrainingArguments, Trainer, EarlyStoppingCallback
)
import torch
from torch.utils.data import Dataset
from sklearn.metrics import accuracy_score, f1_score
import numpy as np

# Custom dataset class
class TextClassificationDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_length=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length
    
    def __len__(self):
        return len(self.texts)
    
    def __getitem__(self, idx):
        text = str(self.texts[idx])
        label = self.labels[idx]
        
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )
        
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

# Fine-tuning pipeline
class TransformerFineTuner:
    def __init__(self, model_name, num_labels, max_length=128):
        self.model_name = model_name
        self.num_labels = num_labels
        self.max_length = max_length
        
        # Load tokenizer and model
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForSequenceClassification.from_pretrained(
            model_name, 
            num_labels=num_labels
        )
        
        # Add padding token if needed
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token
    
    def prepare_datasets(self, train_texts, train_labels, val_texts, val_labels):
        """Prepare training and validation datasets"""
        self.train_dataset = TextClassificationDataset(
            train_texts, train_labels, self.tokenizer, self.max_length
        )
        self.val_dataset = TextClassificationDataset(
            val_texts, val_labels, self.tokenizer, self.max_length
        )
    
    def compute_metrics(self, eval_pred):
        """Compute evaluation metrics"""
        predictions, labels = eval_pred
        predictions = np.argmax(predictions, axis=1)
        
        accuracy = accuracy_score(labels, predictions)
        f1 = f1_score(labels, predictions, average='weighted')
        
        return {
            'accuracy': accuracy,
            'f1': f1
        }
    
    def fine_tune(self, output_dir='./fine-tuned-model', 
                  learning_rate=2e-5, epochs=3, batch_size=16):
        """Fine-tune the model"""
        
        training_args = TrainingArguments(
            output_dir=output_dir,
            num_train_epochs=epochs,
            per_device_train_batch_size=batch_size,
            per_device_eval_batch_size=batch_size,
            warmup_steps=100,
            weight_decay=0.01,
            logging_dir=f'{output_dir}/logs',
            logging_steps=10,
            evaluation_strategy="epoch",
            save_strategy="epoch",
            load_best_model_at_end=True,
            metric_for_best_model="f1",
            learning_rate=learning_rate,
        )
        
        trainer = Trainer(
            model=self.model,
            args=training_args,
            train_dataset=self.train_dataset,
            eval_dataset=self.val_dataset,
            compute_metrics=self.compute_metrics,
            callbacks=[EarlyStoppingCallback(early_stopping_patience=2)]
        )
        
        # Train the model
        trainer.train()
        
        # Save the model
        trainer.save_model()
        self.tokenizer.save_pretrained(output_dir)
        
        return trainer
    
    def predict(self, texts):
        """Make predictions on new texts"""
        predictions = []
        
        for text in texts:
            inputs = self.tokenizer(
                text,
                return_tensors='pt',
                truncation=True,
                padding=True,
                max_length=self.max_length
            )
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits = outputs.logits
                predicted_class = torch.argmax(logits, dim=-1).item()
                confidence = torch.softmax(logits, dim=-1).max().item()
                
            predictions.append({
                'text': text,
                'predicted_class': predicted_class,
                'confidence': confidence
            })
        
        return predictions

# Example usage
if __name__ == "__main__":
    # Sample data (replace with your dataset)
    train_texts = [
        "I love this product! It's amazing!",
        "Terrible quality, waste of money.",
        "Pretty good, would recommend.",
        "Not bad, but could be better.",
        "Excellent service and fast delivery!"
    ]
    train_labels = [1, 0, 1, 0, 1]  # 1: positive, 0: negative
    
    val_texts = [
        "Great experience overall!",
        "Disappointed with the purchase."
    ]
    val_labels = [1, 0]
    
    # Initialize fine-tuner
    fine_tuner = TransformerFineTuner(
        model_name='distilbert-base-uncased',
        num_labels=2
    )
    
    # Prepare datasets
    fine_tuner.prepare_datasets(train_texts, train_labels, val_texts, val_labels)
    
    # Fine-tune (commented out for demo)
    # trainer = fine_tuner.fine_tune(epochs=2, batch_size=8)
    
    # Make predictions
    test_texts = [
        "This is fantastic!",
        "Really poor quality.",
        "It's okay, nothing special."
    ]
    
    # predictions = fine_tuner.predict(test_texts)
    # for pred in predictions:
    #     print(f"Text: {pred['text']}")
    #     print(f"Class: {pred['predicted_class']}, Confidence: {pred['confidence']:.3f}")
    #     print("-" * 50)
    
    print("Fine-tuning pipeline ready!")
    print("Uncomment the training and prediction code to run.")`
};

export const week11Lesson6 = {
    title: 'Modern NLP Applications',
    videoUrl: 'https://www.youtube.com/embed/ysaN7oQndaQ',
    notes: `# Modern NLP Applications

## Real-World Applications

### 1. Chatbots and Virtual Assistants
- Customer service automation
- Personal assistants (Siri, Alexa)
- Technical support bots
- Conversational AI

### 2. Content Generation
- Article writing
- Code generation (GitHub Copilot)
- Creative writing assistance
- Marketing copy generation

### 3. Language Translation
- Real-time translation
- Document translation
- Multilingual communication
- Cross-language search

### 4. Information Extraction
- Named Entity Recognition
- Relation extraction
- Knowledge graph construction
- Document understanding

### 5. Search and Recommendation
- Semantic search
- Question answering systems
- Content recommendation
- Personalized results

## Industry Applications

### Healthcare
- Medical record analysis
- Drug discovery literature review
- Clinical decision support
- Patient communication

### Finance
- Fraud detection in text
- Sentiment analysis for trading
- Regulatory compliance
- Risk assessment

### Legal
- Contract analysis
- Legal document search
- Case law research
- Compliance monitoring

### Education
- Automated essay scoring
- Personalized tutoring
- Language learning
- Educational content generation

## Technical Challenges

### Data Quality
- Noisy text data
- Inconsistent formatting
- Missing labels
- Bias in training data

### Scalability
- Large model inference
- Real-time processing
- Memory constraints
- Cost optimization

### Evaluation
- Subjective tasks
- Context-dependent quality
- Human evaluation costs
- Metric limitations

### Deployment
- Model serving infrastructure
- Latency requirements
- Version management
- Monitoring and maintenance

## Ethical Considerations

### Bias and Fairness
- Training data bias
- Demographic representation
- Fair treatment across groups
- Bias detection and mitigation

### Privacy
- Personal information in text
- Data anonymization
- Secure processing
- Compliance requirements

### Misinformation
- Generated fake content
- Fact-checking challenges
- Source verification
- Content moderation

## Future Trends

### Multimodal Models
- Text + images
- Text + audio
- Cross-modal understanding
- Unified representations

### Efficiency Improvements
- Model compression
- Efficient architectures
- Edge deployment
- Green AI initiatives

### Specialized Models
- Domain-specific models
- Task-specific optimization
- Few-shot learning
- Meta-learning approaches`,
    codeSnippet: `import streamlit as st
from transformers import pipeline
import requests
import json

# Modern NLP Application Demo
class NLPApplicationDemo:
    def __init__(self):
        # Initialize various NLP pipelines
        self.sentiment_analyzer = pipeline("sentiment-analysis")
        self.summarizer = pipeline("summarization")
        self.qa_pipeline = pipeline("question-answering")
        self.ner_pipeline = pipeline("ner", aggregation_strategy="simple")
        self.text_generator = pipeline("text-generation", model="gpt2")
    
    def analyze_sentiment(self, text):
        """Sentiment analysis"""
        result = self.sentiment_analyzer(text)
        return result[0]
    
    def summarize_text(self, text, max_length=130, min_length=30):
        """Text summarization"""
        if len(text.split()) < 50:
            return "Text too short for summarization"
        
        result = self.summarizer(text, max_length=max_length, min_length=min_length)
        return result[0]['summary_text']
    
    def answer_question(self, context, question):
        """Question answering"""
        result = self.qa_pipeline(question=question, context=context)
        return {
            'answer': result['answer'],
            'confidence': result['score'],
            'start': result['start'],
            'end': result['end']
        }
    
    def extract_entities(self, text):
        """Named Entity Recognition"""
        entities = self.ner_pipeline(text)
        return entities
    
    def generate_text(self, prompt, max_length=100):
        """Text generation"""
        result = self.text_generator(prompt, max_length=max_length, num_return_sequences=1)
        return result[0]['generated_text']
    
    def create_chatbot_response(self, user_input, context=""):
        """Simple chatbot logic"""
        # Analyze sentiment
        sentiment = self.analyze_sentiment(user_input)
        
        # Extract entities
        entities = self.extract_entities(user_input)
        
        # Generate response based on sentiment and entities
        if sentiment['label'] == 'NEGATIVE':
            response = "I understand you're having concerns. How can I help you better?"
        elif sentiment['label'] == 'POSITIVE':
            response = "That's great to hear! Is there anything else I can assist you with?"
        else:
            response = "I see. Could you provide more details about what you need?"
        
        return {
            'response': response,
            'sentiment': sentiment,
            'entities': entities
        }

# Streamlit Web Application
def create_nlp_app():
    st.title("🤖 Modern NLP Applications Demo")
    st.write("Explore various NLP capabilities powered by Transformers")
    
    # Initialize demo
    if 'nlp_demo' not in st.session_state:
        st.session_state.nlp_demo = NLPApplicationDemo()
    
    demo = st.session_state.nlp_demo
    
    # Sidebar for application selection
    app_choice = st.sidebar.selectbox(
        "Choose NLP Application",
        ["Sentiment Analysis", "Text Summarization", "Question Answering", 
         "Named Entity Recognition", "Text Generation", "Simple Chatbot"]
    )
    
    if app_choice == "Sentiment Analysis":
        st.header("📊 Sentiment Analysis")
        text_input = st.text_area("Enter text to analyze sentiment:")
        
        if st.button("Analyze Sentiment"):
            if text_input:
                result = demo.analyze_sentiment(text_input)
                st.write(f"**Sentiment:** {result['label']}")
                st.write(f"**Confidence:** {result['score']:.3f}")
    
    elif app_choice == "Text Summarization":
        st.header("📝 Text Summarization")
        text_input = st.text_area("Enter long text to summarize:", height=200)
        
        col1, col2 = st.columns(2)
        with col1:
            max_length = st.slider("Max summary length", 50, 200, 130)
        with col2:
            min_length = st.slider("Min summary length", 10, 100, 30)
        
        if st.button("Summarize"):
            if text_input:
                summary = demo.summarize_text(text_input, max_length, min_length)
                st.write("**Summary:**")
                st.write(summary)
    
    elif app_choice == "Question Answering":
        st.header("❓ Question Answering")
        context = st.text_area("Enter context/passage:", height=150)
        question = st.text_input("Enter your question:")
        
        if st.button("Get Answer"):
            if context and question:
                result = demo.answer_question(context, question)
                st.write(f"**Answer:** {result['answer']}")
                st.write(f"**Confidence:** {result['confidence']:.3f}")
    
    elif app_choice == "Named Entity Recognition":
        st.header("🏷️ Named Entity Recognition")
        text_input = st.text_area("Enter text to extract entities:")
        
        if st.button("Extract Entities"):
            if text_input:
                entities = demo.extract_entities(text_input)
                if entities:
                    st.write("**Extracted Entities:**")
                    for entity in entities:
                        st.write(f"- **{entity['word']}** ({entity['entity_group']}): {entity['score']:.3f}")
                else:
                    st.write("No entities found.")
    
    elif app_choice == "Text Generation":
        st.header("✍️ Text Generation")
        prompt = st.text_input("Enter prompt for text generation:")
        max_length = st.slider("Max generation length", 50, 200, 100)
        
        if st.button("Generate Text"):
            if prompt:
                generated = demo.generate_text(prompt, max_length)
                st.write("**Generated Text:**")
                st.write(generated)
    
    elif app_choice == "Simple Chatbot":
        st.header("💬 Simple Chatbot")
        
        # Initialize chat history
        if 'chat_history' not in st.session_state:
            st.session_state.chat_history = []
        
        # Display chat history
        for message in st.session_state.chat_history:
            if message['role'] == 'user':
                st.write(f"**You:** {message['content']}")
            else:
                st.write(f"**Bot:** {message['content']}")
        
        # User input
        user_input = st.text_input("Type your message:")
        
        if st.button("Send") and user_input:
            # Add user message to history
            st.session_state.chat_history.append({
                'role': 'user',
                'content': user_input
            })
            
            # Get bot response
            bot_response = demo.create_chatbot_response(user_input)
            
            # Add bot response to history
            st.session_state.chat_history.append({
                'role': 'bot',
                'content': bot_response['response']
            })
            
            # Show analysis
            st.write("**Analysis:**")
            st.write(f"Sentiment: {bot_response['sentiment']['label']} ({bot_response['sentiment']['score']:.3f})")
            if bot_response['entities']:
                st.write("Entities:", [e['word'] for e in bot_response['entities']])
            
            st.experimental_rerun()

# Production deployment considerations
class ProductionNLPService:
    """Example production-ready NLP service"""
    
    def __init__(self):
        self.models = {}
        self.load_models()
    
    def load_models(self):
        """Load and cache models"""
        # In production, use model caching and optimization
        pass
    
    def health_check(self):
        """Service health check"""
        return {"status": "healthy", "models_loaded": len(self.models)}
    
    def process_request(self, request_data):
        """Process NLP request with error handling"""
        try:
            task = request_data.get('task')
            text = request_data.get('text')
            
            if not task or not text:
                return {"error": "Missing required fields"}
            
            # Route to appropriate handler
            if task == 'sentiment':
                return self.analyze_sentiment(text)
            elif task == 'summarize':
                return self.summarize_text(text)
            # Add more tasks...
            
        except Exception as e:
            return {"error": str(e)}

# Run the Streamlit app
if __name__ == "__main__":
    # Uncomment to run Streamlit app
    # create_nlp_app()
    
    print("Modern NLP Applications Demo Ready!")
    print("Run with: streamlit run this_file.py")`
};

export const week11Quiz = {
    title: 'Week 11 Quiz: Transformers and Modern NLP',
    questions: [
        {
            id: 1,
            question: 'What is the key innovation that Transformers introduced to NLP?',
            options: [
                'Convolutional layers',
                'Self-attention mechanism',
                'Recurrent connections',
                'Pooling layers'
            ],
            correctAnswer: 1,
            explanation: 'Transformers introduced the self-attention mechanism, which allows the model to process all positions in a sequence simultaneously and capture long-range dependencies efficiently.'
        },
        {
            id: 2,
            question: 'What does the "self" in self-attention refer to?',
            options: [
                'The model learns by itself',
                'Each position attends to all positions in the same sequence',
                'The model is self-supervised',
                'The attention is applied to itself'
            ],
            correctAnswer: 1,
            explanation: 'Self-attention means each position in the sequence can attend to all positions in the same sequence, allowing the model to capture relationships between any two positions.'
        },
        {
            id: 3,
            question: 'What are the three components in the attention mechanism?',
            options: [
                'Input, Hidden, Output',
                'Encoder, Decoder, Attention',
                'Query, Key, Value',
                'Past, Present, Future'
            ],
            correctAnswer: 2,
            explanation: 'The attention mechanism uses Query (what we\'re looking for), Key (what each position contains), and Value (the actual information to retrieve).'
        },
        {
            id: 4,
            question: 'Why do Transformers need positional encoding?',
            options: [
                'To make the model faster',
                'To reduce overfitting',
                'To provide sequence order information since attention is permutation-invariant',
                'To handle variable-length sequences'
            ],
            correctAnswer: 2,
            explanation: 'Since self-attention is permutation-invariant (doesn\'t care about order), positional encoding is added to give the model information about the position of tokens in the sequence.'
        },
        {
            id: 5,
            question: 'What is the main difference between BERT and GPT?',
            options: [
                'BERT is larger than GPT',
                'BERT is bidirectional (encoder-only), GPT is unidirectional (decoder-only)',
                'BERT uses attention, GPT uses RNNs',
                'BERT is for classification, GPT is for translation'
            ],
            correctAnswer: 1,
            explanation: 'BERT uses bidirectional attention (can see the full context) and is encoder-only, while GPT uses unidirectional attention (can only see previous tokens) and is decoder-only for text generation.'
        },
        {
            id: 6,
            question: 'What is masked language modeling in BERT pre-training?',
            options: [
                'Hiding the entire input sequence',
                'Randomly masking 15% of tokens and predicting them',
                'Masking the output layer',
                'Using attention masks'
            ],
            correctAnswer: 1,
            explanation: 'Masked language modeling randomly masks about 15% of input tokens and trains the model to predict these masked tokens using bidirectional context.'
        },
        {
            id: 7,
            question: 'What is the advantage of multi-head attention?',
            options: [
                'It makes the model faster',
                'It allows the model to attend to different types of relationships simultaneously',
                'It reduces the number of parameters',
                'It eliminates the need for positional encoding'
            ],
            correctAnswer: 1,
            explanation: 'Multi-head attention allows the model to focus on different types of relationships (syntactic, semantic, etc.) in parallel, providing richer representations.'
        },
        {
            id: 8,
            question: 'What is fine-tuning in the context of pre-trained language models?',
            options: [
                'Adjusting hyperparameters',
                'Training a pre-trained model on a specific task with task-specific data',
                'Making the model smaller',
                'Improving the model architecture'
            ],
            correctAnswer: 1,
            explanation: 'Fine-tuning involves taking a pre-trained model and training it further on task-specific data to adapt it for a particular application.'
        },
        {
            id: 9,
            question: 'What is temperature in text generation?',
            options: [
                'The computational heat generated',
                'A parameter that controls randomness in sampling',
                'The training time required',
                'The model size'
            ],
            correctAnswer: 1,
            explanation: 'Temperature is a parameter that controls the randomness of text generation. Lower temperature makes output more deterministic, higher temperature makes it more creative/random.'
        },
        {
            id: 10,
            question: 'What is the main advantage of transfer learning with pre-trained language models?',
            options: [
                'Faster inference',
                'Smaller model size',
                'Better performance with less task-specific data',
                'Lower computational requirements'
            ],
            correctAnswer: 2,
            explanation: 'Transfer learning with pre-trained models allows achieving better performance on downstream tasks with much less task-specific training data by leveraging knowledge learned from large-scale pre-training.'
        }
    ]
};

export const week11Project = {
    title: 'Week 11 Project: Advanced NLP Application with Transformers',
    videoUrl: 'https://www.youtube.com/embed/ysaN7oQndaQ',
    notes: `# Week 11 Project: Advanced NLP Application with Transformers

## Project Overview

Build a comprehensive NLP application that demonstrates multiple Transformer-based capabilities including text classification, generation, and question answering.

## Objectives

- Implement multiple NLP tasks using pre-trained Transformers
- Fine-tune models for specific tasks
- Create a user-friendly web interface
- Deploy the application
- Compare different model architectures

## Requirements

### 1. Multi-Task NLP System
Build an application that supports:
- **Sentiment Analysis**: Classify text sentiment
- **Text Summarization**: Generate concise summaries
- **Question Answering**: Answer questions from context
- **Named Entity Recognition**: Extract entities
- **Text Generation**: Generate creative text
- **Language Translation**: Translate between languages

### 2. Model Implementation
- Use pre-trained models (BERT, GPT, T5)
- Fine-tune at least one model on custom data
- Compare different model architectures
- Implement efficient inference pipeline

### 3. Web Application
- Clean, intuitive user interface
- Real-time processing
- Multiple task selection
- Results visualization
- Performance metrics display

### 4. Advanced Features
- Batch processing capability
- Model comparison interface
- Confidence scores and explanations
- Export results functionality
- API endpoints for integration

### 5. Evaluation and Analysis
- Performance benchmarking
- Error analysis
- Model comparison report
- User experience evaluation

## Technical Stack

### Backend
- **Framework**: FastAPI or Flask
- **Models**: Hugging Face Transformers
- **Processing**: PyTorch/TensorFlow
- **Database**: SQLite for storing results

### Frontend
- **Framework**: Streamlit or React
- **Styling**: CSS/Bootstrap
- **Charts**: Plotly or Chart.js
- **UI Components**: Modern, responsive design

### Deployment
- **Containerization**: Docker
- **Cloud Platform**: AWS/GCP/Azure
- **API Documentation**: Swagger/OpenAPI
- **Monitoring**: Basic logging and metrics

## Deliverables

1. **Complete Application**
   - Working web interface
   - Multiple NLP capabilities
   - Responsive design

2. **Fine-tuned Models**
   - At least one custom fine-tuned model
   - Model comparison analysis
   - Performance evaluation

3. **Documentation**
   - Technical documentation
   - User guide
   - API documentation
   - Setup instructions

4. **Deployment Package**
   - Docker configuration
   - Cloud deployment scripts
   - Environment setup

5. **Analysis Report**
   - Model performance comparison
   - User testing results
   - Technical challenges and solutions

## Evaluation Criteria

### Functionality (40%)
- All required NLP tasks implemented
- Models work correctly
- Error handling and edge cases
- Performance optimization

### User Experience (25%)
- Intuitive interface design
- Responsive and fast
- Clear result presentation
- Good error messages

### Technical Quality (25%)
- Clean, well-structured code
- Proper model integration
- Efficient processing
- Good software practices

### Innovation (10%)
- Creative features
- Advanced implementations
- Novel applications
- Technical depth

## Bonus Challenges

### Advanced Features
- **Multi-modal**: Text + image processing
- **Real-time**: WebSocket-based live processing
- **Collaborative**: Multi-user features
- **Personalization**: User-specific model adaptation

### Technical Enhancements
- **Model Optimization**: Quantization, distillation
- **Scalability**: Load balancing, caching
- **Security**: Input validation, rate limiting
- **Analytics**: Usage tracking, A/B testing

### Domain Applications
- **Healthcare**: Medical text analysis
- **Legal**: Contract analysis
- **Finance**: Financial document processing
- **Education**: Automated essay scoring

## Getting Started

1. **Setup Environment**
   - Install required packages
   - Download pre-trained models
   - Configure development environment

2. **Implement Core Features**
   - Start with one NLP task
   - Add models incrementally
   - Test each component

3. **Build Interface**
   - Create basic UI
   - Add task selection
   - Implement result display

4. **Fine-tune Models**
   - Prepare custom dataset
   - Fine-tune selected model
   - Evaluate performance

5. **Deploy and Test**
   - Package application
   - Deploy to cloud
   - Conduct user testing

## Success Metrics

- **Accuracy**: >85% on test tasks
- **Speed**: <2 seconds response time
- **Usability**: Positive user feedback
- **Completeness**: All required features working
- **Documentation**: Clear and comprehensive`,
    codeSnippet: `# Advanced NLP Application with Transformers
# Main application structure

import streamlit as st
import torch
from transformers import (
    AutoTokenizer, AutoModelForSequenceClassification,
    AutoModelForQuestionAnswering, pipeline
)
import plotly.express as px
import pandas as pd
from datetime import datetime
import json

class AdvancedNLPApp:
    def __init__(self):
        self.models = {}
        self.tokenizers = {}
        self.pipelines = {}
        self.load_models()
    
    def load_models(self):
        """Load all required models and pipelines"""
        try:
            # Sentiment Analysis
            self.pipelines['sentiment'] = pipeline(
                "sentiment-analysis",
                model="cardiffnlp/twitter-roberta-base-sentiment-latest"
            )
            
            # Text Summarization
            self.pipelines['summarization'] = pipeline(
                "summarization",
                model="facebook/bart-large-cnn"
            )
            
            # Question Answering
            self.pipelines['qa'] = pipeline(
                "question-answering",
                model="deepset/roberta-base-squad2"
            )
            
            # Named Entity Recognition
            self.pipelines['ner'] = pipeline(
                "ner",
                model="dbmdz/bert-large-cased-finetuned-conll03-english",
                aggregation_strategy="simple"
            )
            
            # Text Generation
            self.pipelines['generation'] = pipeline(
                "text-generation",
                model="gpt2-medium"
            )
            
            # Translation
            self.pipelines['translation'] = pipeline(
                "translation_en_to_fr",
                model="Helsinki-NLP/opus-mt-en-fr"
            )
            
        except Exception as e:
            st.error(f"Error loading models: {str(e)}")
    
    def analyze_sentiment(self, text):
        """Advanced sentiment analysis with confidence scores"""
        try:
            results = self.pipelines['sentiment'](text)
            
            # Process results
            sentiment_data = []
            for result in results:
                sentiment_data.append({
                    'label': result['label'],
                    'score': result['score'],
                    'text': text[:100] + "..." if len(text) > 100 else text
                })
            
            return sentiment_data
        except Exception as e:
            return [{'error': str(e)}]
    
    def summarize_text(self, text, max_length=130, min_length=30):
        """Text summarization with customizable parameters"""
        try:
            if len(text.split()) < 50:
                return {"error": "Text too short for summarization (minimum 50 words)"}
            
            result = self.pipelines['summarization'](
                text,
                max_length=max_length,
                min_length=min_length,
                do_sample=False
            )
            
            return {
                'summary': result[0]['summary_text'],
                'original_length': len(text.split()),
                'summary_length': len(result[0]['summary_text'].split()),
                'compression_ratio': len(result[0]['summary_text'].split()) / len(text.split())
            }
        except Exception as e:
            return {'error': str(e)}
    
    def answer_question(self, context, question):
        """Question answering with confidence and context highlighting"""
        try:
            result = self.pipelines['qa'](question=question, context=context)
            
            return {
                'answer': result['answer'],
                'confidence': result['score'],
                'start_pos': result['start'],
                'end_pos': result['end'],
                'context_snippet': context[max(0, result['start']-50):result['end']+50]
            }
        except Exception as e:
            return {'error': str(e)}
    
    def extract_entities(self, text):
        """Named entity recognition with entity grouping"""
        try:
            entities = self.pipelines['ner'](text)
            
            # Group entities by type
            entity_groups = {}
            for entity in entities:
                entity_type = entity['entity_group']
                if entity_type not in entity_groups:
                    entity_groups[entity_type] = []
                
                entity_groups[entity_type].append({
                    'word': entity['word'],
                    'score': entity['score'],
                    'start': entity['start'],
                    'end': entity['end']
                })
            
            return {
                'entities': entities,
                'grouped_entities': entity_groups,
                'total_entities': len(entities)
            }
        except Exception as e:
            return {'error': str(e)}
    
    def generate_text(self, prompt, max_length=100, temperature=0.8, top_p=0.9):
        """Text generation with advanced parameters"""
        try:
            result = self.pipelines['generation'](
                prompt,
                max_length=max_length,
                temperature=temperature,
                top_p=top_p,
                num_return_sequences=1,
                pad_token_id=50256
            )
            
            generated_text = result[0]['generated_text']
            new_text = generated_text[len(prompt):].strip()
            
            return {
                'generated_text': generated_text,
                'new_text': new_text,
                'prompt': prompt,
                'parameters': {
                    'max_length': max_length,
                    'temperature': temperature,
                    'top_p': top_p
                }
            }
        except Exception as e:
            return {'error': str(e)}
    
    def translate_text(self, text, source_lang='en', target_lang='fr'):
        """Text translation with language detection"""
        try:
            result = self.pipelines['translation'](text)
            
            return {
                'original_text': text,
                'translated_text': result[0]['translation_text'],
                'source_language': source_lang,
                'target_language': target_lang,
                'confidence': result[0].get('score', 'N/A')
            }
        except Exception as e:
            return {'error': str(e)}

def create_advanced_nlp_interface():
    """Create the Streamlit interface"""
    st.set_page_config(
        page_title="Advanced NLP Application",
        page_icon="🤖",
        layout="wide"
    )
    
    st.title("🤖 Advanced NLP Application with Transformers")
    st.markdown("---")
    
    # Initialize the app
    if 'nlp_app' not in st.session_state:
        with st.spinner("Loading models... This may take a few minutes."):
            st.session_state.nlp_app = AdvancedNLPApp()
    
    app = st.session_state.nlp_app
    
    # Sidebar for task selection
    st.sidebar.title("🎯 NLP Tasks")
    task = st.sidebar.selectbox(
        "Select a task:",
        ["Sentiment Analysis", "Text Summarization", "Question Answering",
         "Named Entity Recognition", "Text Generation", "Translation"]
    )
    
    # Main interface based on selected task
    if task == "Sentiment Analysis":
        st.header("📊 Sentiment Analysis")
        
        col1, col2 = st.columns([2, 1])
        
        with col1:
            text_input = st.text_area(
                "Enter text to analyze:",
                height=150,
                placeholder="Type or paste your text here..."
            )
            
            if st.button("Analyze Sentiment", type="primary"):
                if text_input:
                    with st.spinner("Analyzing sentiment..."):
                        results = app.analyze_sentiment(text_input)
                    
                    if 'error' not in results[0]:
                        result = results[0]
                        
                        # Display results
                        st.success(f"**Sentiment:** {result['label']}")
                        st.info(f"**Confidence:** {result['score']:.3f}")
                        
                        # Visualization
                        fig = px.bar(
                            x=[result['label']],
                            y=[result['score']],
                            title="Sentiment Confidence",
                            color=[result['label']],
                            color_discrete_map={
                                'POSITIVE': 'green',
                                'NEGATIVE': 'red',
                                'NEUTRAL': 'gray'
                            }
                        )
                        st.plotly_chart(fig, use_container_width=True)
                    else:
                        st.error(f"Error: {results[0]['error']}")
        
        with col2:
            st.info("""
            **About Sentiment Analysis:**
            
            This tool uses a fine-tuned RoBERTa model to classify text sentiment as:
            - 🟢 Positive
            - 🔴 Negative  
            - ⚪ Neutral
            
            The confidence score indicates how certain the model is about its prediction.
            """)
    
    # Add other task implementations...
    elif task == "Text Summarization":
        st.header("📝 Text Summarization")
        # Implementation for summarization...
        
    elif task == "Question Answering":
        st.header("❓ Question Answering")
        # Implementation for QA...
    
    # Add footer
    st.markdown("---")
    st.markdown(
        "Built with 🤗 Transformers, Streamlit, and ❤️ | "
        f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M')}"
    )

# Run the application
if __name__ == "__main__":
    create_advanced_nlp_interface()
    
    # For production deployment
    # uvicorn main:app --host 0.0.0.0 --port 8000`
};