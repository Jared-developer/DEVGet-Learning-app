// AI/ML Phase 3 - Week 7-8: Unsupervised Learning

// Week 7: Clustering & Dimensionality Reduction

export const week7Lesson1 = {
    title: 'Introduction to Unsupervised Learning',
    videoUrl: 'https://www.youtube.com/embed/IUn8k5zSI6g',
    notes: `# Introduction to Unsupervised Learning

## What is Unsupervised Learning?

Learning from unlabeled data to discover hidden patterns, structures, or relationships without predefined outputs.

## Key Differences from Supervised Learning

| Supervised | Unsupervised |
|-----------|--------------|
| Labeled data | Unlabeled data |
| Predict outcomes | Discover patterns |
| Classification/Regression | Clustering/Dimensionality Reduction |
| Known targets | Unknown structure |

## Types of Unsupervised Learning

### 1. Clustering
Group similar data points together
- Customer segmentation
- Document categorization
- Image compression
- Anomaly detection

### 2. Dimensionality Reduction
Reduce number of features while preserving information
- Data visualization
- Feature extraction
- Noise reduction
- Computational efficiency

### 3. Association Rule Learning
Discover relationships between variables
- Market basket analysis
- Recommendation systems

## Common Algorithms

### Clustering:
- K-Means
- Hierarchical Clustering
- DBSCAN
- Gaussian Mixture Models

### Dimensionality Reduction:
- PCA (Principal Component Analysis)
- t-SNE
- UMAP
- Autoencoders

## Applications

- Customer segmentation
- Anomaly detection
- Data compression
- Feature engineering
- Exploratory data analysis
- Recommendation systems`,
    codeSnippet: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import make_blobs, make_moons
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA

# Generate sample data for clustering
X_blobs, y_blobs = make_blobs(
    n_samples=300,
    centers=4,
    cluster_std=0.60,
    random_state=42
)

# Visualize data
plt.figure(figsize=(12, 5))

plt.subplot(1, 2, 1)
plt.scatter(X_blobs[:, 0], X_blobs[:, 1], alpha=0.6)
plt.title('Unlabeled Data')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')

# Apply K-Means clustering
kmeans = KMeans(n_clusters=4, random_state=42)
clusters = kmeans.fit_predict(X_blobs)

plt.subplot(1, 2, 2)
plt.scatter(X_blobs[:, 0], X_blobs[:, 1], c=clusters, cmap='viridis', alpha=0.6)
plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
            marker='X', s=200, c='red', edgecolors='black', label='Centroids')
plt.title('K-Means Clustering Result')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.legend()
plt.tight_layout()
plt.show()

# Example: Dimensionality Reduction
from sklearn.datasets import load_digits

digits = load_digits()
X_digits = digits.data  # 64 features (8x8 images)

print(f"Original shape: {X_digits.shape}")

# Apply PCA
pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X_digits)

print(f"Reduced shape: {X_reduced.shape}")
print(f"Explained variance: {pca.explained_variance_ratio_.sum():.2%}")

# Visualize
plt.figure(figsize=(10, 6))
scatter = plt.scatter(X_reduced[:, 0], X_reduced[:, 1], 
                     c=digits.target, cmap='tab10', alpha=0.6)
plt.colorbar(scatter)
plt.title('Digits Dataset - PCA Visualization')
plt.xlabel('First Principal Component')
plt.ylabel('Second Principal Component')
plt.show()`
};

export const week7Lesson2 = {
    title: 'K-Means Clustering',
    videoUrl: 'https://www.youtube.com/embed/4b5d3muPQmA',
    notes: `# K-Means Clustering

## Algorithm Overview

K-Means partitions data into K clusters by minimizing within-cluster variance.

## How K-Means Works

1. **Initialize**: Randomly select K centroids
2. **Assign**: Assign each point to nearest centroid
3. **Update**: Recalculate centroids as mean of assigned points
4. **Repeat**: Steps 2-3 until convergence

## Mathematical Formulation

Minimize: J = Σ Σ ||xi - μk||²

Where:
- xi = data point
- μk = centroid of cluster k
- Goal: Minimize sum of squared distances

## Choosing K

### Elbow Method
- Plot inertia vs K
- Look for "elbow" point
- Trade-off between fit and complexity

### Silhouette Score
- Measures cluster quality
- Range: -1 to 1
- Higher is better

### Domain Knowledge
- Business requirements
- Interpretability
- Practical constraints

## Advantages

- Simple and fast
- Scales well to large datasets
- Works well with spherical clusters
- Easy to interpret

## Limitations

- Must specify K beforehand
- Sensitive to initialization
- Assumes spherical clusters
- Affected by outliers
- Only finds linear boundaries

## Best Practices

1. Scale features before clustering
2. Try multiple random initializations
3. Use elbow method to find K
4. Validate with silhouette score
5. Consider domain knowledge`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

# Generate sample data
X, y_true = make_blobs(n_samples=300, centers=4, 
                       cluster_std=0.60, random_state=42)

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Elbow Method - Find optimal K
inertias = []
silhouette_scores = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouette_scores.append(silhouette_score(X_scaled, kmeans.labels_))

# Plot Elbow Curve
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].plot(K_range, inertias, 'bo-')
axes[0].set_xlabel('Number of Clusters (K)')
axes[0].set_ylabel('Inertia')
axes[0].set_title('Elbow Method')
axes[0].grid(True)

axes[1].plot(K_range, silhouette_scores, 'ro-')
axes[1].set_xlabel('Number of Clusters (K)')
axes[1].set_ylabel('Silhouette Score')
axes[1].set_title('Silhouette Analysis')
axes[1].grid(True)

plt.tight_layout()
plt.show()

# Train final model with optimal K
optimal_k = 4
kmeans = KMeans(n_clusters=optimal_k, random_state=42, n_init=10)
clusters = kmeans.fit_predict(X_scaled)

print(f"Optimal K: {optimal_k}")
print(f"Inertia: {kmeans.inertia_:.2f}")
print(f"Silhouette Score: {silhouette_score(X_scaled, clusters):.3f}")

# Visualize clusters
plt.figure(figsize=(10, 6))
scatter = plt.scatter(X[:, 0], X[:, 1], c=clusters, cmap='viridis', alpha=0.6)
centers = scaler.inverse_transform(kmeans.cluster_centers_)
plt.scatter(centers[:, 0], centers[:, 1], 
           marker='X', s=300, c='red', edgecolors='black', 
           linewidths=2, label='Centroids')
plt.title(f'K-Means Clustering (K={optimal_k})')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.colorbar(scatter, label='Cluster')
plt.legend()
plt.show()

# Cluster statistics
for i in range(optimal_k):
    cluster_points = X[clusters == i]
    print(f"Cluster {i}: {len(cluster_points)} points")
    print(f"  Center: {centers[i]}")
    print(f"  Std: {cluster_points.std(axis=0)}")`
};

export const week7Lesson3 = {
    title: 'Hierarchical Clustering',
    videoUrl: 'https://www.youtube.com/embed/7xHsRkOdVwo',
    notes: `# Hierarchical Clustering

## Overview

Builds a hierarchy of clusters without specifying K beforehand.

## Types

### 1. Agglomerative (Bottom-Up)
- Start: Each point is a cluster
- Merge closest clusters iteratively
- Stop: Single cluster or desired K

### 2. Divisive (Top-Down)
- Start: All points in one cluster
- Split clusters iteratively
- Less common, more complex

## Linkage Methods

### Single Linkage
- Distance = minimum distance between clusters
- Can create long chains
- Sensitive to outliers

### Complete Linkage
- Distance = maximum distance between clusters
- Creates compact clusters
- Less sensitive to outliers

### Average Linkage
- Distance = average of all pairs
- Balanced approach
- Most commonly used

### Ward's Method
- Minimizes within-cluster variance
- Creates equal-sized clusters
- Often best choice

## Dendrogram

Visual representation of clustering hierarchy:
- Y-axis: Distance/dissimilarity
- X-axis: Data points
- Horizontal lines: Merges
- Cut height determines K

## Advantages

- No need to specify K beforehand
- Produces dendrogram for visualization
- Works with any distance metric
- Deterministic results

## Disadvantages

- Computationally expensive (O(n³))
- Not suitable for large datasets
- Cannot undo merges
- Sensitive to noise and outliers

## When to Use

- Small to medium datasets
- Need to explore different K values
- Want hierarchical structure
- Dendrogram visualization needed`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import AgglomerativeClustering
from sklearn.datasets import make_blobs
from scipy.cluster.hierarchy import dendrogram, linkage
from scipy.spatial.distance import pdist

# Generate sample data
X, y = make_blobs(n_samples=50, centers=3, 
                  cluster_std=0.60, random_state=42)

# Compute linkage matrix for dendrogram
linkage_matrix = linkage(X, method='ward')

# Plot dendrogram
plt.figure(figsize=(12, 6))
dendrogram(linkage_matrix)
plt.title('Hierarchical Clustering Dendrogram (Ward)')
plt.xlabel('Sample Index')
plt.ylabel('Distance')
plt.axhline(y=7, color='r', linestyle='--', label='Cut Height')
plt.legend()
plt.show()

# Compare different linkage methods
linkage_methods = ['single', 'complete', 'average', 'ward']
fig, axes = plt.subplots(2, 2, figsize=(14, 12))
axes = axes.ravel()

for idx, method in enumerate(linkage_methods):
    # Perform clustering
    clustering = AgglomerativeClustering(
        n_clusters=3,
        linkage=method
    )
    labels = clustering.fit_predict(X)
    
    # Plot results
    axes[idx].scatter(X[:, 0], X[:, 1], c=labels, cmap='viridis', alpha=0.6)
    axes[idx].set_title(f'{method.capitalize()} Linkage')
    axes[idx].set_xlabel('Feature 1')
    axes[idx].set_ylabel('Feature 2')

plt.tight_layout()
plt.show()

# Detailed analysis with Ward linkage
ward = AgglomerativeClustering(n_clusters=3, linkage='ward')
labels = ward.fit_predict(X)

# Cluster statistics
print("Cluster Statistics:")
for i in range(3):
    cluster_points = X[labels == i]
    print(f"Cluster {i}:")
    print(f"  Size: {len(cluster_points)}")
    print(f"  Center: {cluster_points.mean(axis=0)}")
    print(f"  Std: {cluster_points.std(axis=0)}")

# Distance matrix visualization
from scipy.spatial.distance import squareform

distances = pdist(X, metric='euclidean')
distance_matrix = squareform(distances)

plt.figure(figsize=(10, 8))
plt.imshow(distance_matrix, cmap='viridis', aspect='auto')
plt.colorbar(label='Distance')
plt.title('Pairwise Distance Matrix')
plt.xlabel('Sample Index')
plt.ylabel('Sample Index')
plt.show()`
};

export const week7Lesson4 = {
    title: 'DBSCAN Clustering',
    videoUrl: 'https://www.youtube.com/embed/RDZUdRSDOok',
    notes: `# DBSCAN (Density-Based Spatial Clustering)

## Overview

DBSCAN groups points that are closely packed together, marking outliers as noise.

## Key Concepts

### Core Points
- Has at least minPts neighbors within epsilon radius
- Forms the interior of clusters

### Border Points
- Within epsilon of a core point
- Has fewer than minPts neighbors
- On cluster edges

### Noise Points
- Neither core nor border
- Outliers or anomalies

## Parameters

### Epsilon (ε)
- Maximum distance between neighbors
- Defines neighborhood radius
- Too small: Many noise points
- Too large: Clusters merge

### MinPts
- Minimum points to form dense region
- Typically: 2 × dimensions
- Higher values: Denser clusters required

## Algorithm Steps

1. Pick random unvisited point
2. Find all points within epsilon
3. If enough neighbors (≥ minPts):
   - Create cluster
   - Expand cluster recursively
4. Else: Mark as noise
5. Repeat until all points visited

## Advantages

- No need to specify K
- Finds arbitrarily shaped clusters
- Robust to outliers
- Identifies noise points
- Works well with spatial data

## Disadvantages

- Sensitive to parameters (ε, minPts)
- Struggles with varying densities
- Not suitable for high dimensions
- Can be slow on large datasets

## When to Use

- Unknown number of clusters
- Non-spherical cluster shapes
- Presence of outliers
- Spatial or geographic data
- Need to identify noise`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import DBSCAN
from sklearn.datasets import make_moons, make_blobs
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors

# Generate non-spherical data
X_moons, _ = make_moons(n_samples=300, noise=0.05, random_state=42)

# Add some noise points
np.random.seed(42)
noise = np.random.uniform(low=-1, high=2, size=(20, 2))
X = np.vstack([X_moons, noise])

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Find optimal epsilon using k-distance graph
k = 4  # minPts - 1
neighbors = NearestNeighbors(n_neighbors=k)
neighbors.fit(X_scaled)
distances, indices = neighbors.kneighbors(X_scaled)

# Sort and plot k-distances
distances = np.sort(distances[:, k-1], axis=0)
plt.figure(figsize=(10, 6))
plt.plot(distances)
plt.xlabel('Points sorted by distance')
plt.ylabel(f'{k}-th Nearest Neighbor Distance')
plt.title('K-Distance Graph for Epsilon Selection')
plt.axhline(y=0.3, color='r', linestyle='--', label='Suggested ε')
plt.legend()
plt.grid(True)
plt.show()

# Apply DBSCAN
dbscan = DBSCAN(eps=0.3, min_samples=5)
labels = dbscan.fit_predict(X_scaled)

# Count clusters and noise
n_clusters = len(set(labels)) - (1 if -1 in labels else 0)
n_noise = list(labels).count(-1)

print(f"Number of clusters: {n_clusters}")
print(f"Number of noise points: {n_noise}")
print(f"Core samples: {len(dbscan.core_sample_indices_)}")

# Visualize results
plt.figure(figsize=(12, 5))

# Original data
plt.subplot(1, 2, 1)
plt.scatter(X[:, 0], X[:, 1], alpha=0.6)
plt.title('Original Data')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')

# DBSCAN results
plt.subplot(1, 2, 2)
unique_labels = set(labels)
colors = plt.cm.Spectral(np.linspace(0, 1, len(unique_labels)))

for label, color in zip(unique_labels, colors):
    if label == -1:
        # Noise points in black
        color = 'black'
        marker = 'x'
        label_name = 'Noise'
    else:
        marker = 'o'
        label_name = f'Cluster {label}'
    
    mask = labels == label
    plt.scatter(X[mask, 0], X[mask, 1], 
               c=[color], marker=marker, 
               alpha=0.6, label=label_name)

plt.title(f'DBSCAN Clustering (ε=0.3, minPts=5)')
plt.xlabel('Feature 1')
plt.ylabel('Feature 2')
plt.legend()
plt.tight_layout()
plt.show()

# Compare with K-Means
from sklearn.cluster import KMeans

kmeans = KMeans(n_clusters=2, random_state=42)
kmeans_labels = kmeans.fit_predict(X_scaled)

plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.scatter(X[:, 0], X[:, 1], c=kmeans_labels, cmap='viridis', alpha=0.6)
plt.title('K-Means (K=2)')

plt.subplot(1, 2, 2)
for label in set(labels):
    mask = labels == label
    if label == -1:
        plt.scatter(X[mask, 0], X[mask, 1], c='black', marker='x', alpha=0.6)
    else:
        plt.scatter(X[mask, 0], X[mask, 1], alpha=0.6)
plt.title('DBSCAN')
plt.tight_layout()
plt.show()`
};

export const week7Lesson5 = {
    title: 'Principal Component Analysis (PCA)',
    videoUrl: 'https://www.youtube.com/embed/FgakZw6K1QQ',
    notes: `# Principal Component Analysis (PCA)

## What is PCA?

PCA is a dimensionality reduction technique that transforms data into a new coordinate system where the greatest variance lies on the first coordinates (principal components).

## Key Concepts

### Principal Components
- New orthogonal axes
- Ordered by variance explained
- Linear combinations of original features
- First PC captures most variance

### Variance Explained
- How much information each PC retains
- Cumulative variance helps choose components
- Typically keep 95% of variance

### Eigenvalues & Eigenvectors
- Eigenvectors: Direction of PCs
- Eigenvalues: Variance along PCs
- Larger eigenvalue = more important PC

## How PCA Works

1. **Standardize** data (mean=0, std=1)
2. **Compute** covariance matrix
3. **Calculate** eigenvalues and eigenvectors
4. **Sort** by eigenvalues (descending)
5. **Select** top k eigenvectors
6. **Transform** data to new space

## Applications

- **Visualization**: Reduce to 2D/3D
- **Noise Reduction**: Remove low-variance components
- **Feature Extraction**: Create new features
- **Compression**: Reduce storage
- **Preprocessing**: For other ML algorithms

## Advantages

- Reduces dimensionality
- Removes correlated features
- Improves visualization
- Can speed up algorithms
- Reduces overfitting

## Limitations

- Linear transformation only
- Assumes high variance = important
- Components hard to interpret
- Sensitive to scaling
- May lose information

## Best Practices

1. Always scale features first
2. Check explained variance
3. Plot scree plot
4. Keep 95%+ variance
5. Validate on downstream task`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_iris, load_digits

# Load Iris dataset
iris = load_iris()
X = iris.data
y = iris.target

# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Apply PCA
pca = PCA()
X_pca = pca.fit_transform(X_scaled)

# Explained variance
explained_var = pca.explained_variance_ratio_
cumulative_var = np.cumsum(explained_var)

print("Explained Variance by Component:")
for i, var in enumerate(explained_var):
    print(f"  PC{i+1}: {var:.4f} ({var*100:.2f}%)")
print(f"Cumulative: {cumulative_var}")

# Scree Plot
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

axes[0].bar(range(1, len(explained_var)+1), explained_var)
axes[0].set_xlabel('Principal Component')
axes[0].set_ylabel('Explained Variance Ratio')
axes[0].set_title('Scree Plot')
axes[0].grid(True)

axes[1].plot(range(1, len(cumulative_var)+1), cumulative_var, 'bo-')
axes[1].axhline(y=0.95, color='r', linestyle='--', label='95% threshold')
axes[1].set_xlabel('Number of Components')
axes[1].set_ylabel('Cumulative Explained Variance')
axes[1].set_title('Cumulative Variance Explained')
axes[1].legend()
axes[1].grid(True)

plt.tight_layout()
plt.show()

# Visualize in 2D
pca_2d = PCA(n_components=2)
X_2d = pca_2d.fit_transform(X_scaled)

plt.figure(figsize=(10, 6))
scatter = plt.scatter(X_2d[:, 0], X_2d[:, 1], c=y, cmap='viridis', alpha=0.6)
plt.xlabel(f'PC1 ({pca_2d.explained_variance_ratio_[0]:.2%} variance)')
plt.ylabel(f'PC2 ({pca_2d.explained_variance_ratio_[1]:.2%} variance)')
plt.title('Iris Dataset - PCA Projection')
plt.colorbar(scatter, label='Species')
plt.grid(True)
plt.show()

# Component loadings (feature importance)
loadings = pca_2d.components_.T * np.sqrt(pca_2d.explained_variance_)
loading_df = pd.DataFrame(
    loadings,
    columns=['PC1', 'PC2'],
    index=iris.feature_names
)

print("Feature Loadings:")
print(loading_df)

# Biplot
fig, ax = plt.subplots(figsize=(10, 8))
ax.scatter(X_2d[:, 0], X_2d[:, 1], c=y, cmap='viridis', alpha=0.5)

# Plot feature vectors
for i, feature in enumerate(iris.feature_names):
    ax.arrow(0, 0, loadings[i, 0]*3, loadings[i, 1]*3,
            head_width=0.1, head_length=0.1, fc='red', ec='red')
    ax.text(loadings[i, 0]*3.2, loadings[i, 1]*3.2, feature, 
           fontsize=10, ha='center')

ax.set_xlabel('PC1')
ax.set_ylabel('PC2')
ax.set_title('PCA Biplot')
ax.grid(True)
plt.show()

# Reconstruction
pca_reduced = PCA(n_components=2)
X_reduced = pca_reduced.fit_transform(X_scaled)
X_reconstructed = pca_reduced.inverse_transform(X_reduced)

# Calculate reconstruction error
mse = np.mean((X_scaled - X_reconstructed) ** 2)
print(f"Reconstruction MSE: {mse:.4f}")`
};

export const week7Lesson6 = {
    title: 't-SNE and Advanced Visualization',
    videoUrl: 'https://www.youtube.com/embed/NEaUSP4YerM',
    notes: `# t-SNE (t-Distributed Stochastic Neighbor Embedding)

## What is t-SNE?

A non-linear dimensionality reduction technique primarily used for visualization of high-dimensional data.

## How t-SNE Works

1. **Compute** pairwise similarities in high-dimensional space
2. **Define** similar distribution in low-dimensional space
3. **Minimize** divergence between distributions
4. **Iteratively** adjust points to preserve local structure

## Key Parameters

### Perplexity
- Balance between local and global structure
- Typical range: 5-50
- Higher = more global structure
- Lower = more local structure

### Learning Rate
- Step size for optimization
- Typical range: 10-1000
- Too high: Unstable
- Too low: Slow convergence

### Iterations
- Number of optimization steps
- Minimum: 250
- Recommended: 1000+

## PCA vs t-SNE

| PCA | t-SNE |
|-----|-------|
| Linear | Non-linear |
| Global structure | Local structure |
| Fast | Slow |
| Deterministic | Stochastic |
| Preserves distances | Preserves neighbors |

## Advantages

- Excellent for visualization
- Reveals cluster structure
- Handles non-linear relationships
- Works well with complex data

## Limitations

- Computationally expensive
- Non-deterministic (different runs vary)
- Cannot transform new data
- Distances not meaningful
- Requires parameter tuning

## Best Practices

1. Apply PCA first (to ~50 dimensions)
2. Try multiple perplexity values
3. Run multiple times
4. Use for visualization only
5. Don't interpret distances
6. Check convergence`,
    codeSnippet: `import numpy as np
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from sklearn.datasets import load_digits
import time

# Load digits dataset
digits = load_digits()
X = digits.data
y = digits.target

print(f"Original shape: {X.shape}")

# Standardize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Apply PCA first (recommended for t-SNE)
pca = PCA(n_components=50)
X_pca = pca.fit_transform(X_scaled)
print(f"After PCA: {X_pca.shape}")
print(f"Variance retained: {pca.explained_variance_ratio_.sum():.2%}")

# Compare different perplexity values
perplexities = [5, 30, 50]
fig, axes = plt.subplots(1, 3, figsize=(18, 5))

for idx, perplexity in enumerate(perplexities):
    print(f"Running t-SNE with perplexity={perplexity}...")
    start = time.time()
    
    tsne = TSNE(
        n_components=2,
        perplexity=perplexity,
        learning_rate=200,
        n_iter=1000,
        random_state=42
    )
    X_tsne = tsne.fit_transform(X_pca)
    
    elapsed = time.time() - start
    print(f"  Completed in {elapsed:.2f}s")
    
    # Plot
    scatter = axes[idx].scatter(X_tsne[:, 0], X_tsne[:, 1], 
                               c=y, cmap='tab10', alpha=0.6, s=10)
    axes[idx].set_title(f'Perplexity = {perplexity}')
    axes[idx].set_xlabel('t-SNE 1')
    axes[idx].set_ylabel('t-SNE 2')

plt.colorbar(scatter, ax=axes, label='Digit')
plt.tight_layout()
plt.show()

# Compare PCA vs t-SNE
fig, axes = plt.subplots(1, 2, figsize=(14, 6))

# PCA
pca_2d = PCA(n_components=2)
X_pca_2d = pca_2d.fit_transform(X_scaled)

axes[0].scatter(X_pca_2d[:, 0], X_pca_2d[:, 1], c=y, cmap='tab10', alpha=0.6, s=10)
axes[0].set_title('PCA (Linear)')
axes[0].set_xlabel('PC1')
axes[0].set_ylabel('PC2')

# t-SNE
tsne = TSNE(n_components=2, perplexity=30, random_state=42)
X_tsne = tsne.fit_transform(X_pca)

axes[1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=y, cmap='tab10', alpha=0.6, s=10)
axes[1].set_title('t-SNE (Non-linear)')
axes[1].set_xlabel('t-SNE 1')
axes[1].set_ylabel('t-SNE 2')

plt.tight_layout()
plt.show()

# Visualize specific digits
fig, axes = plt.subplots(2, 5, figsize=(15, 6))
axes = axes.ravel()

for digit in range(10):
    mask = y == digit
    axes[digit].scatter(X_tsne[mask, 0], X_tsne[mask, 1], 
                       alpha=0.6, s=10, label=f'Digit {digit}')
    axes[digit].set_title(f'Digit {digit}')
    axes[digit].set_xticks([])
    axes[digit].set_yticks([])

plt.suptitle('t-SNE: Individual Digit Clusters')
plt.tight_layout()
plt.show()

# Show sample images from clusters
n_samples = 5
fig, axes = plt.subplots(10, n_samples, figsize=(10, 20))

for digit in range(10):
    digit_indices = np.where(y == digit)[0]
    sample_indices = np.random.choice(digit_indices, n_samples, replace=False)
    
    for i, idx in enumerate(sample_indices):
        axes[digit, i].imshow(X[idx].reshape(8, 8), cmap='gray')
        axes[digit, i].axis('off')
        if i == 0:
            axes[digit, i].set_ylabel(f'Digit {digit}', rotation=0, 
                                     labelpad=30, fontsize=12)

plt.suptitle('Sample Images from Each Digit Class')
plt.tight_layout()
plt.show()`
};

export const week7Quiz = {
    title: 'Week 7 Quiz: Clustering & Dimensionality Reduction',
    questions: [
        {
            id: 1,
            question: 'What is the main difference between supervised and unsupervised learning?',
            options: [
                'Supervised learning is faster',
                'Unsupervised learning works with unlabeled data',
                'Supervised learning requires more data',
                'There is no difference'
            ],
            correctAnswer: 1,
            explanation: 'Unsupervised learning discovers patterns in unlabeled data without predefined outputs, while supervised learning uses labeled data to predict outcomes.'
        },
        {
            id: 2,
            question: 'In K-Means clustering, what does K represent?',
            options: [
                'The number of features',
                'The number of clusters',
                'The number of iterations',
                'The distance metric'
            ],
            correctAnswer: 1,
            explanation: 'K represents the number of clusters that the algorithm will partition the data into.'
        },
        {
            id: 3,
            question: 'What is the Elbow Method used for in K-Means?',
            options: [
                'To scale features',
                'To determine the optimal number of clusters',
                'To initialize centroids',
                'To calculate distances'
            ],
            correctAnswer: 1,
            explanation: 'The Elbow Method plots inertia vs K to help identify the optimal number of clusters by looking for an "elbow" point where adding more clusters provides diminishing returns.'
        },
        {
            id: 4,
            question: 'What type of clusters does DBSCAN excel at finding?',
            options: [
                'Only spherical clusters',
                'Arbitrarily shaped clusters and can identify outliers',
                'Hierarchical clusters',
                'Linear clusters only'
            ],
            correctAnswer: 1,
            explanation: 'DBSCAN is density-based and can find clusters of arbitrary shapes while also identifying outliers as noise points.'
        },
        {
            id: 5,
            question: 'What are the two main parameters in DBSCAN?',
            options: [
                'K and distance',
                'Epsilon (ε) and MinPts',
                'Mean and variance',
                'Alpha and beta'
            ],
            correctAnswer: 1,
            explanation: 'DBSCAN requires epsilon (ε) which defines the neighborhood radius, and MinPts which is the minimum number of points needed to form a dense region.'
        },
        {
            id: 6,
            question: 'What does PCA stand for and what does it do?',
            options: [
                'Principal Component Analysis - reduces dimensionality while preserving variance',
                'Primary Cluster Analysis - groups similar data',
                'Predictive Classification Algorithm - predicts classes',
                'Polynomial Curve Approximation - fits curves'
            ],
            correctAnswer: 0,
            explanation: 'PCA (Principal Component Analysis) is a dimensionality reduction technique that transforms data into principal components ordered by the amount of variance they explain.'
        },
        {
            id: 7,
            question: 'Why should you standardize features before applying PCA?',
            options: [
                'To make computation faster',
                'Features with larger scales would dominate the principal components',
                'It is not necessary',
                'To remove outliers'
            ],
            correctAnswer: 1,
            explanation: 'PCA is sensitive to feature scales. Without standardization, features with larger ranges would dominate the principal components, leading to biased results.'
        },
        {
            id: 8,
            question: 'What is the main advantage of t-SNE over PCA?',
            options: [
                't-SNE is faster',
                't-SNE can capture non-linear relationships and is better for visualization',
                't-SNE works with more features',
                't-SNE is deterministic'
            ],
            correctAnswer: 1,
            explanation: 't-SNE is a non-linear technique that excels at preserving local structure and revealing cluster patterns in visualizations, unlike the linear PCA.'
        },
        {
            id: 9,
            question: 'What does the perplexity parameter control in t-SNE?',
            options: [
                'The number of dimensions',
                'The balance between local and global structure',
                'The learning rate',
                'The number of clusters'
            ],
            correctAnswer: 1,
            explanation: 'Perplexity balances attention between local and global aspects of the data. Lower values focus on local structure, higher values consider more global structure.'
        },
        {
            id: 10,
            question: 'Which clustering algorithm does NOT require specifying the number of clusters beforehand?',
            options: [
                'K-Means',
                'DBSCAN',
                'Both require K',
                'Neither requires K'
            ],
            correctAnswer: 1,
            explanation: 'DBSCAN automatically determines the number of clusters based on the density of points, while K-Means requires you to specify K beforehand.'
        }
    ]
};

export const week7Project = {
    title: 'Week 7 Project: Customer Segmentation Analysis',
    videoUrl: 'https://www.youtube.com/embed/iwUli5gIcU0',
    notes: `# Week 7 Project: Customer Segmentation Analysis

## Project Overview

Perform comprehensive customer segmentation using multiple clustering techniques and dimensionality reduction.

## Objectives

- Apply various clustering algorithms
- Compare clustering results
- Use dimensionality reduction for visualization
- Provide actionable business insights

## Requirements

### 1. Data Preparation
- Load customer dataset
- Handle missing values
- Feature engineering
- Standardization

### 2. Exploratory Analysis
- Customer demographics
- Purchase behavior
- Feature correlations
- Distribution analysis

### 3. Clustering Analysis
Apply and compare:
- K-Means (with elbow method)
- Hierarchical Clustering (with dendrogram)
- DBSCAN
- Evaluate with silhouette score

### 4. Dimensionality Reduction
- Apply PCA for feature reduction
- Use t-SNE for visualization
- Compare 2D projections
- Interpret components

### 5. Segment Profiling
- Characterize each segment
- Size and demographics
- Behavioral patterns
- Value analysis

### 6. Business Recommendations
- Marketing strategies per segment
- Product recommendations
- Retention strategies
- Growth opportunities

## Dataset Features

Suggested features:
- Customer ID
- Age, Gender, Income
- Purchase frequency
- Average order value
- Product categories
- Tenure
- Engagement metrics

## Deliverables

1. Complete analysis notebook
2. Cluster comparison report
3. Segment profiles document
4. Visualization dashboard
5. Business recommendations
6. Presentation slides

## Evaluation Criteria

- Multiple clustering methods applied
- Proper evaluation metrics
- Clear visualizations
- Actionable insights
- Professional documentation

## Bonus Challenges

- Predict segment for new customers
- Time-based segment evolution
- RFM analysis integration
- Interactive dashboard with Plotly`,
    codeSnippet: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, DBSCAN, AgglomerativeClustering
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.metrics import silhouette_score

# Load customer data
df = pd.read_csv('customer_data.csv')

# Feature engineering
df['avg_order_value'] = df['total_spent'] / df['num_orders']
df['days_since_last_purchase'] = (pd.Timestamp.now() - pd.to_datetime(df['last_purchase'])).dt.days

# Select features for clustering
features = ['age', 'income', 'num_orders', 'total_spent', 
           'avg_order_value', 'days_since_last_purchase']
X = df[features]

# Handle missing values
X = X.fillna(X.median())

# Standardize
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 1. K-Means with Elbow Method
inertias = []
silhouette_scores = []
K_range = range(2, 11)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouette_scores.append(silhouette_score(X_scaled, kmeans.labels_))

# Plot elbow
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
axes[0].plot(K_range, inertias, 'bo-')
axes[0].set_title('Elbow Method')
axes[0].set_xlabel('K')
axes[0].set_ylabel('Inertia')

axes[1].plot(K_range, silhouette_scores, 'ro-')
axes[1].set_title('Silhouette Score')
axes[1].set_xlabel('K')
axes[1].set_ylabel('Score')
plt.show()

# Apply K-Means with optimal K
optimal_k = 4
kmeans = KMeans(n_clusters=optimal_k, random_state=42)
df['kmeans_cluster'] = kmeans.fit_predict(X_scaled)

# 2. Hierarchical Clustering
hierarchical = AgglomerativeClustering(n_clusters=optimal_k)
df['hierarchical_cluster'] = hierarchical.fit_predict(X_scaled)

# 3. DBSCAN
dbscan = DBSCAN(eps=0.5, min_samples=5)
df['dbscan_cluster'] = dbscan.fit_predict(X_scaled)

# Compare clustering methods
print("Clustering Comparison:")
print(f"K-Means Silhouette: {silhouette_score(X_scaled, df['kmeans_cluster']):.3f}")
print(f"Hierarchical Silhouette: {silhouette_score(X_scaled, df['hierarchical_cluster']):.3f}")

# 4. Dimensionality Reduction
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

tsne = TSNE(n_components=2, random_state=42)
X_tsne = tsne.fit_transform(X_scaled)

# Visualize clusters
fig, axes = plt.subplots(2, 2, figsize=(14, 12))

axes[0, 0].scatter(X_pca[:, 0], X_pca[:, 1], c=df['kmeans_cluster'], cmap='viridis')
axes[0, 0].set_title('K-Means (PCA)')

axes[0, 1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=df['kmeans_cluster'], cmap='viridis')
axes[0, 1].set_title('K-Means (t-SNE)')

axes[1, 0].scatter(X_pca[:, 0], X_pca[:, 1], c=df['hierarchical_cluster'], cmap='viridis')
axes[1, 0].set_title('Hierarchical (PCA)')

axes[1, 1].scatter(X_tsne[:, 0], X_tsne[:, 1], c=df['hierarchical_cluster'], cmap='viridis')
axes[1, 1].set_title('Hierarchical (t-SNE)')

plt.tight_layout()
plt.show()

# 5. Segment Profiling
print("Segment Profiles (K-Means):")
for cluster in range(optimal_k):
    cluster_data = df[df['kmeans_cluster'] == cluster]
    print(f"Cluster {cluster} (n={len(cluster_data)}):")
    print(cluster_data[features].describe())
    print()

# Segment characteristics
segment_summary = df.groupby('kmeans_cluster')[features].mean()
print("Segment Summary:")
print(segment_summary)

# Visualize segment profiles
segment_summary_normalized = (segment_summary - segment_summary.min()) / (segment_summary.max() - segment_summary.min())

plt.figure(figsize=(12, 6))
sns.heatmap(segment_summary_normalized.T, annot=True, fmt='.2f', cmap='YlOrRd')
plt.title('Customer Segment Profiles (Normalized)')
plt.xlabel('Cluster')
plt.ylabel('Feature')
plt.show()

# Export results
df.to_csv('customer_segments.csv', index=False)
segment_summary.to_csv('segment_profiles.csv')
print("Results exported!")`
};
