// AI/ML Phase 1 Notes - Weeks 1-3: Foundation

// Week 1: Introduction to AI/ML & Python Basics

export const week1Lesson1 = {
    title: 'What is AI, ML, and Deep Learning?',
    videoUrl: 'https://www.youtube.com/embed/7CqJlxBYj-M',
    notes: `# Welcome to AI/ML - Understanding the Fundamentals

## What is Artificial Intelligence (AI)?

**Definition:** The broad field of creating machines that can perform tasks that typically require human intelligence.

### Real-world AI Examples:
- Virtual assistants (Siri, Alexa, Google Assistant)
- Recommendation systems (Netflix, Amazon, Spotify)
- Autonomous vehicles (Tesla, Waymo)
- Game playing (AlphaGo, Chess engines)
- Medical diagnosis systems
- Fraud detection in banking

## What is Machine Learning (ML)?

**Definition:** A subset of AI where computers learn from data without being explicitly programmed for every task.

### Traditional Programming vs Machine Learning:

**Traditional Programming:**
\`\`\`
Data + Rules ——————→ Answers
\`\`\`

**Machine Learning:**
\`\`\`
Data + Answers ——————→ Rules
\`\`\`

## What is Deep Learning (DL)?

**Definition:** A subset of ML using neural networks with multiple layers (deep neural networks) to learn from vast amounts of data.

### The Relationship Hierarchy:

\`\`\`
┌─────────────────────────┐
│   Artificial            │
│   Intelligence          │
│  ┌─────────────────┐    │
│  │   Machine       │    │
│  │   Learning      │    │
│  │ ┌───────────┐   │    │
│  │ │   Deep    │   │    │
│  │ │  Learning │   │    │
│  │ └───────────┘   │    │
│  └─────────────────┘    │
└─────────────────────────┘
\`\`\`

## Types of Machine Learning

### 1. Supervised Learning
- Model learns from labeled data
- Example: Predicting house prices from features
- Common algorithms: Linear Regression, Decision Trees, Neural Networks

### 2. Unsupervised Learning
- Model finds patterns in unlabeled data
- Example: Grouping customers by purchasing behavior
- Common algorithms: K-Means, PCA, Hierarchical Clustering

### 3. Reinforcement Learning
- Model learns through trial and error
- Example: Game playing AI, robotics
- Common algorithms: Q-Learning, Deep Q-Networks

## Why Learn AI/ML?

✅ High demand in job market
✅ Solve real-world problems
✅ Automate complex tasks
✅ Make data-driven decisions
✅ Build intelligent applications
✅ Competitive salaries

## Course Structure Overview

**16 weeks of intensive learning:**
- Video lectures and detailed notes
- Hands-on coding assignments
- Weekly quizzes
- Real-world projects
- Capstone project`,
    codeSnippet: `# Check your Python installation
python --version

# Check pip (Python package manager)
pip --version

# Install essential libraries
pip install numpy pandas matplotlib seaborn scikit-learn

# Verify installations
python -c "import numpy; print('NumPy:', numpy.__version__)"
python -c "import pandas; print('Pandas:', pandas.__version__)"
python -c "import sklearn; print('scikit-learn:', sklearn.__version__)"`
};


export const week1Lesson2 = {
    title: 'Setting Up Development Environment',
    videoUrl: 'https://www.youtube.com/embed/5mDYijMfSzs',
    notes: `# Development Environment Setup

## Installing Anaconda

Anaconda is a distribution of Python that comes with pre-installed data science packages.

### Installation Steps:
1. Visit anaconda.com/download
2. Choose your operating system
3. Download and run the installer
4. Follow installation wizard

### Verify Installation:
\`\`\`bash
conda --version
python --version
\`\`\`

## Jupyter Notebook

An interactive environment for writing and running Python code with rich text formatting.

### Starting Jupyter:
\`\`\`bash
jupyter notebook
\`\`\`

### Jupyter Interface:
- Code cells: Write and execute Python code
- Markdown cells: Add formatted text, equations
- Output cells: View results, plots, tables

### Keyboard Shortcuts:
- \`Shift + Enter\`: Run cell and move to next
- \`Ctrl + Enter\`: Run cell and stay
- \`A\`: Insert cell above
- \`B\`: Insert cell below
- \`DD\`: Delete cell
- \`M\`: Convert to Markdown
- \`Y\`: Convert to Code

## Essential VS Code Extensions

If using VS Code instead of Jupyter:
- Python
- Jupyter
- Pylance
- Python Indent
- autoDocstring`,
    codeSnippet: `# Create a new conda environment
conda create -n ml-env python=3.10

# Activate the environment
conda activate ml-env

# Install packages in the environment
conda install numpy pandas matplotlib seaborn jupyter

# Or use pip
pip install numpy pandas matplotlib seaborn jupyter scikit-learn

# Launch Jupyter Notebook
jupyter notebook

# Launch JupyterLab (modern interface)
jupyter lab`
};


export const week1Lesson3 = {
    title: 'Python Basics - Data Types & Operations',
    videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8',
    notes: `# Python Basics for AI/ML

## Data Types

### Numbers
- **int**: Whole numbers (42, -10, 0)
- **float**: Decimal numbers (3.14, -0.5)
- **complex**: Complex numbers (3+4j)

### Strings
- Text data enclosed in quotes
- Single or double quotes: 'hello' or "hello"
- Multi-line strings: """text"""

### Booleans
- True or False
- Used for logical operations

### None
- Represents absence of value
- Similar to null in other languages

## Basic Operations

### Arithmetic
- Addition: \`+\`
- Subtraction: \`-\`
- Multiplication: \`*\`
- Division: \`/\`
- Integer Division: \`//\`
- Modulus: \`%\`
- Exponentiation: \`**\`

### Comparison
- Equal: \`==\`
- Not equal: \`!=\`
- Greater than: \`>\`
- Less than: \`<\`
- Greater or equal: \`>=\`
- Less or equal: \`<=\`

### Logical
- AND: \`and\`
- OR: \`or\`
- NOT: \`not\``,
    codeSnippet: `# Numbers
integer_num = 42
float_num = 3.14159
complex_num = 3 + 4j

# Strings
name = "AI Engineer"
multiline = """This is a
multi-line string"""

# Booleans
is_learning = True
is_bored = False

# None
unknown = None

# Arithmetic
sum_result = 10 + 5        # 15
difference = 10 - 5        # 5
product = 10 * 5           # 50
quotient = 10 / 3          # 3.333...
integer_div = 10 // 3      # 3
remainder = 10 % 3         # 1
power = 2 ** 3             # 8

# Comparisons
is_equal = (5 == 5)        # True
not_equal = (5 != 3)       # True
greater = (5 > 3)          # True

# Logical operations
and_op = True and False    # False
or_op = True or False      # True
not_op = not True          # False

# Type checking
print(type(42))            # <class 'int'>
print(type(3.14))          # <class 'float'>
print(type("hello"))       # <class 'str'>`
};


export const week1Lesson4 = {
    title: 'Python Data Structures',
    videoUrl: 'https://www.youtube.com/embed/W8KRzm-HUcc',
    notes: `# Python Data Structures

## Lists (Ordered, Mutable)

Lists are ordered collections that can be modified.

### Key Features:
- Ordered: Items maintain their position
- Mutable: Can be changed after creation
- Allow duplicates
- Can contain mixed types

### Common Operations:
- Access by index: \`list[0]\`
- Slicing: \`list[1:3]\`
- Append: \`list.append(item)\`
- Insert: \`list.insert(index, item)\`
- Remove: \`list.remove(item)\`
- Pop: \`list.pop()\`

## Tuples (Ordered, Immutable)

Tuples are like lists but cannot be modified.

### Key Features:
- Ordered
- Immutable: Cannot be changed
- Faster than lists
- Used for fixed data

## Dictionaries (Key-Value Pairs)

Dictionaries store data as key-value pairs.

### Key Features:
- Unordered (Python 3.7+ maintains insertion order)
- Keys must be unique
- Fast lookup by key
- Mutable

## Sets (Unordered, Unique)

Sets store unique elements.

### Key Features:
- Unordered
- No duplicates
- Fast membership testing
- Mathematical set operations`,
    codeSnippet: `# Lists
fruits = ["apple", "banana", "orange"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]

# List operations
fruits.append("grape")        # Add to end
fruits.insert(1, "mango")     # Insert at index
fruits.remove("banana")       # Remove by value
popped = fruits.pop()         # Remove last
sliced = fruits[1:3]          # Get sublist
length = len(fruits)          # List length

# List comprehension
squares = [x**2 for x in range(10)]
evens = [x for x in range(20) if x % 2 == 0]

# Tuples
coordinates = (10, 20)
rgb_colors = (255, 128, 0)
single_item = (42,)  # Note the comma

# Tuple unpacking
x, y = coordinates

# Dictionaries
student = {
    "name": "Alice",
    "age": 25,
    "courses": ["AI", "ML", "Python"]
}

# Dictionary operations
student["grade"] = "A"           # Add new key
age = student.get("age")         # Safe access
keys = student.keys()            # Get all keys
values = student.values()        # Get all values

# Dictionary comprehension
squares_dict = {x: x**2 for x in range(5)}

# Sets
unique_numbers = {1, 2, 3, 4, 5}
unique_numbers.add(6)
unique_numbers.remove(1)

# Set operations
set1 = {1, 2, 3}
set2 = {3, 4, 5}
union = set1 | set2              # {1, 2, 3, 4, 5}
intersection = set1 & set2       # {3}
difference = set1 - set2         # {1, 2}`
};


export const week1Lesson5 = {
    title: 'Control Flow & Functions',
    videoUrl: 'https://www.youtube.com/embed/DZwmZ8Usvnk',
    notes: `# Control Flow and Functions

## If-Else Statements

Control the flow of your program based on conditions.

### Syntax:
\`\`\`python
if condition:
    # code block
elif another_condition:
    # code block
else:
    # code block
\`\`\`

### Ternary Operator:
\`\`\`python
result = value_if_true if condition else value_if_false
\`\`\`

## Loops

### For Loop
Iterate over sequences (lists, strings, ranges).

### While Loop
Repeat while condition is true.

### Loop Control:
- \`break\`: Exit loop
- \`continue\`: Skip to next iteration
- \`pass\`: Do nothing (placeholder)

## Functions

Functions are reusable blocks of code.

### Benefits:
- Code reusability
- Better organization
- Easier testing
- Abstraction

### Function Components:
- **def**: Keyword to define function
- **Parameters**: Input values
- **Return**: Output value
- **Docstring**: Documentation`,
    codeSnippet: `# If-Else
temperature = 25

if temperature > 30:
    print("It's hot!")
elif temperature > 20:
    print("It's warm")
else:
    print("It's cold!")

# Ternary operator
status = "Adult" if age >= 18 else "Minor"

# For loop
for i in range(5):
    print(f"Iteration {i}")

# For loop with list
fruits = ["apple", "banana", "orange"]
for fruit in fruits:
    print(f"I like {fruit}")

# Enumerate (get index and value)
for index, fruit in enumerate(fruits):
    print(f"{index}: {fruit}")

# While loop
count = 0
while count < 5:
    print(f"Count: {count}")
    count += 1

# Break and continue
for i in range(10):
    if i == 3:
        continue  # Skip 3
    if i == 8:
        break     # Stop at 8
    print(i)

# Functions
def greet(name):
    """Greet a person by name"""
    return f"Hello, {name}!"

# Function with default parameters
def power(base, exponent=2):
    """Calculate base raised to exponent"""
    return base ** exponent

# Multiple returns
def get_stats(numbers):
    """Return min, max, and average"""
    return min(numbers), max(numbers), sum(numbers)/len(numbers)

# Lambda functions (anonymous)
square = lambda x: x**2
add = lambda x, y: x + y

# Using functions
result = greet("AI Student")
squared = power(5)           # Uses default exponent=2
cubed = power(5, 3)          # Override exponent
minimum, maximum, avg = get_stats([1, 2, 3, 4, 5])`
};


export const week1Lesson6 = {
    title: 'Object-Oriented Programming in Python',
    videoUrl: 'https://www.youtube.com/embed/JeznW_7DlB0',
    notes: `# Object-Oriented Programming (OOP)

## What is OOP?

A programming paradigm based on the concept of "objects" that contain data and code.

## Key Concepts

### 1. Class
Blueprint for creating objects.

### 2. Object
Instance of a class.

### 3. Attributes
Variables that belong to a class/object.

### 4. Methods
Functions that belong to a class.

### 5. Encapsulation
Bundling data and methods together.

### 6. Inheritance
Creating new classes from existing ones.

### 7. Polymorphism
Same method name, different implementations.

## Why OOP?

✅ Code reusability
✅ Better organization
✅ Easier maintenance
✅ Real-world modeling
✅ Abstraction`,
    codeSnippet: `# Define a class
class Student:
    # Class variable (shared by all instances)
    school = "AI Academy"
    
    # Constructor (initializer)
    def __init__(self, name, age):
        self.name = name    # Instance variable
        self.age = age
        self.courses = []
    
    # Instance method
    def enroll(self, course):
        self.courses.append(course)
        print(f"{self.name} enrolled in {course}")
    
    def display_info(self):
        return f"Name: {self.name}, Age: {self.age}, Courses: {self.courses}"
    
    # Static method (doesn't use instance)
    @staticmethod
    def is_valid_age(age):
        return 0 < age < 100
    
    # Class method (uses class, not instance)
    @classmethod
    def change_school(cls, new_school):
        cls.school = new_school

# Create objects (instances)
student1 = Student("Alice", 25)
student2 = Student("Bob", 30)

# Use methods
student1.enroll("AI-101")
student1.enroll("ML-201")
print(student1.display_info())

# Access class variable
print(Student.school)

# Inheritance
class GraduateStudent(Student):
    def __init__(self, name, age, thesis_topic):
        super().__init__(name, age)  # Call parent constructor
        self.thesis_topic = thesis_topic
    
    def display_info(self):
        base_info = super().display_info()
        return f"{base_info}, Thesis: {self.thesis_topic}"

# Create graduate student
grad = GraduateStudent("Charlie", 28, "Deep Learning")
grad.enroll("PhD-501")
print(grad.display_info())`
};


export const week1Quiz = {
    title: 'Week 1 Quiz: Python Fundamentals',
    questions: [
        {
            question: 'What is the main difference between Machine Learning and traditional programming?',
            options: [
                'ML uses more memory',
                'ML learns patterns from data instead of explicit rules',
                'ML is faster than traditional programming',
                'ML only works with numbers'
            ],
            correctAnswer: 1,
            explanation: 'Machine Learning learns patterns from data (Data + Answers → Rules), while traditional programming uses explicit rules (Data + Rules → Answers).'
        },
        {
            question: 'Which of the following is an example of supervised learning?',
            options: [
                'Grouping customers by behavior',
                'Predicting house prices from features',
                'Finding patterns in unlabeled data',
                'Game playing AI'
            ],
            correctAnswer: 1,
            explanation: 'Predicting house prices is supervised learning because it uses labeled data (houses with known prices) to train the model.'
        },
        {
            question: 'What is the correct way to create a list in Python?',
            options: [
                '{1, 2, 3}',
                '(1, 2, 3)',
                '[1, 2, 3]',
                '<1, 2, 3>'
            ],
            correctAnswer: 2,
            explanation: 'Lists in Python are created using square brackets []. Curly braces {} create sets or dictionaries, and parentheses () create tuples.'
        },
        {
            question: 'What will be the output of: print(10 // 3)?',
            options: [
                '3.333',
                '3',
                '4',
                '3.0'
            ],
            correctAnswer: 1,
            explanation: 'The // operator performs integer division (floor division), which returns only the whole number part: 10 // 3 = 3.'
        },
        {
            question: 'Which data structure would you use to store unique elements?',
            options: [
                'List',
                'Tuple',
                'Dictionary',
                'Set'
            ],
            correctAnswer: 3,
            explanation: 'Sets automatically store only unique elements and remove duplicates, making them perfect for storing unique values.'
        }
    ]
};


// Week 2: Data Manipulation with NumPy and Pandas

export const week2Lesson1 = {
    title: 'Introduction to NumPy',
    videoUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI',
    notes: `# NumPy - Numerical Python

## What is NumPy?

NumPy is the fundamental package for scientific computing in Python. It provides support for large, multi-dimensional arrays and matrices.

## Why NumPy for AI/ML?

✅ **Performance**: Up to 50x faster than Python lists
✅ **Memory efficiency**: Contiguous memory allocation
✅ **Convenience**: Built-in mathematical functions
✅ **Foundation**: Base for pandas, scikit-learn, TensorFlow

## NumPy Arrays vs Python Lists

### Python Lists:
- Flexible but slow
- Can contain mixed types
- No vectorized operations

### NumPy Arrays:
- Fast and memory efficient
- Homogeneous (same type)
- Vectorized operations
- Broadcasting support

## Key Features

### 1. N-dimensional arrays
Create and manipulate multi-dimensional data.

### 2. Vectorization
Perform operations on entire arrays without loops.

### 3. Broadcasting
Automatic array shape matching for operations.

### 4. Mathematical functions
Built-in functions for linear algebra, statistics, etc.`,
    codeSnippet: `import numpy as np

# Check version
print(f"NumPy version: {np.__version__}")

# Create arrays
arr1 = np.array([1, 2, 3, 4, 5])
arr2 = np.array([[1, 2, 3], [4, 5, 6]])

# Special arrays
zeros = np.zeros((3, 4))        # 3x4 array of zeros
ones = np.ones((2, 3))          # 2x3 array of ones
full = np.full((3, 3), 7)       # 3x3 array filled with 7
identity = np.eye(4)            # 4x4 identity matrix
random = np.random.random((3, 3))  # Random values [0, 1)

# Range arrays
range_arr = np.arange(0, 10, 2)    # [0, 2, 4, 6, 8]
linspace = np.linspace(0, 1, 5)    # [0, 0.25, 0.5, 0.75, 1]

# Array attributes
print(f"Shape: {arr2.shape}")      # (2, 3)
print(f"Dimensions: {arr2.ndim}")  # 2
print(f"Size: {arr2.size}")        # 6
print(f"Data type: {arr2.dtype}")  # int64

# Vectorized operations (no loops needed!)
a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

print(a + b)      # [6, 8, 10, 12]
print(a * b)      # [5, 12, 21, 32]
print(a ** 2)     # [1, 4, 9, 16]
print(np.sqrt(a)) # [1, 1.41, 1.73, 2]`
};


export const week2Lesson2 = {
    title: 'NumPy Array Operations',
    videoUrl: 'https://www.youtube.com/embed/GB9ByFAIAH4',
    notes: `# NumPy Array Operations

## Indexing and Slicing

Access and modify array elements efficiently.

### Basic Indexing:
- Single element: \`arr[0]\`
- 2D element: \`arr[row, col]\`
- Negative indexing: \`arr[-1]\` (last element)

### Slicing:
- Range: \`arr[start:end]\`
- Step: \`arr[start:end:step]\`
- All elements: \`arr[:]\`

### Boolean Indexing:
Filter arrays using conditions.

## Array Operations

### Element-wise Operations:
Operations applied to each element.

### Aggregation Functions:
- sum(), mean(), median()
- min(), max()
- std(), var()

### Axis Operations:
- axis=0: Along columns
- axis=1: Along rows

## Reshaping Arrays

Change array dimensions without changing data.

### Methods:
- reshape(): Return new shape
- resize(): Modify in place
- flatten(): Convert to 1D
- transpose(): Swap dimensions`,
    codeSnippet: `import numpy as np

# Create 2D array
arr = np.array([[1, 2, 3, 4],
                [5, 6, 7, 8],
                [9, 10, 11, 12]])

# Indexing
print(arr[0, 0])      # 1 (first element)
print(arr[1, 2])      # 7
print(arr[-1, -1])    # 12 (last element)

# Slicing
print(arr[0, :])      # [1 2 3 4] (first row)
print(arr[:, 0])      # [1 5 9] (first column)
print(arr[0:2, 1:3])  # [[2 3], [6 7]] (subarray)

# Boolean indexing
mask = arr > 5
print(arr[mask])      # [6 7 8 9 10 11 12]

# Fancy indexing
indices = [0, 2]
print(arr[indices, :])  # Rows 0 and 2

# Statistical operations
matrix = np.array([[1, 2, 3],
                   [4, 5, 6],
                   [7, 8, 9]])

print(f"Sum: {np.sum(matrix)}")           # 45
print(f"Mean: {np.mean(matrix)}")         # 5.0
print(f"Std: {np.std(matrix)}")           # 2.58
print(f"Min: {np.min(matrix)}")           # 1
print(f"Max: {np.max(matrix)}")           # 9

# Axis operations
print(f"Column sums: {np.sum(matrix, axis=0)}")   # [12 15 18]
print(f"Row means: {np.mean(matrix, axis=1)}")    # [2 5 8]

# Reshaping
arr = np.arange(12)
print(f"Original: {arr}")

reshaped = arr.reshape(3, 4)
print(f"Reshaped (3x4):\\n{reshaped}")

transposed = reshaped.T
print(f"Transposed:\\n{transposed}")

flattened = reshaped.flatten()
print(f"Flattened: {flattened}")`
};


export const week2Lesson3 = {
    title: 'Introduction to Pandas',
    videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg',
    notes: `# Pandas - Data Analysis Library

## What is Pandas?

Pandas is built on top of NumPy and provides high-level data structures and functions for data manipulation and analysis.

## Why Pandas?

✅ Easy data manipulation
✅ Handle missing data
✅ Read/write various formats (CSV, Excel, SQL)
✅ Time series functionality
✅ Data alignment and merging
✅ Group by operations

## Core Data Structures

### 1. Series (1D)
- Labeled array
- Can hold any data type
- Like a column in a spreadsheet

### 2. DataFrame (2D)
- Labeled 2D structure
- Like a spreadsheet or SQL table
- Columns can have different types

## Key Features

### Data Selection:
- loc: Label-based indexing
- iloc: Integer-based indexing
- Boolean indexing

### Data Cleaning:
- Handle missing values
- Remove duplicates
- Data type conversion

### Data Transformation:
- Apply functions
- Group and aggregate
- Merge and join`,
    codeSnippet: `import pandas as pd
import numpy as np

# Check version
print(f"Pandas version: {pd.__version__}")

# Create Series
s1 = pd.Series([1, 3, 5, np.nan, 6, 8])
print("Series:")
print(s1)

# Series with custom index
s2 = pd.Series([10, 20, 30, 40],
               index=['a', 'b', 'c', 'd'])
print("\\nSeries with index:")
print(s2)

# Create DataFrame from dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'Age': [25, 30, 35, 28],
    'City': ['New York', 'Paris', 'London', 'Tokyo'],
    'Salary': [70000, 80000, 90000, 75000]
}

df = pd.DataFrame(data)
print("\\nDataFrame:")
print(df)

# DataFrame attributes
print(f"\\nShape: {df.shape}")
print(f"Columns: {df.columns.tolist()}")
print(f"Data types:\\n{df.dtypes}")

# Basic statistics
print("\\nStatistical summary:")
print(df.describe())

# First/last rows
print("\\nFirst 2 rows:")
print(df.head(2))

# Column selection
print("\\nNames column:")
print(df['Name'])

# Multiple columns
print("\\nName and Age:")
print(df[['Name', 'Age']])`
};


export const week2Lesson4 = {
    title: 'Pandas Data Manipulation',
    videoUrl: 'https://www.youtube.com/embed/tcRGa2soc-c',
    notes: `# Pandas Data Manipulation

## Data Selection

### loc vs iloc

**loc**: Label-based indexing
- Use column/row names
- Inclusive of end point

**iloc**: Integer-based indexing
- Use integer positions
- Exclusive of end point

### Boolean Indexing

Filter data based on conditions.

## Data Cleaning

### Missing Values:
- Check: \`isnull()\`, \`notnull()\`
- Drop: \`dropna()\`
- Fill: \`fillna()\`

### Duplicates:
- Check: \`duplicated()\`
- Remove: \`drop_duplicates()\`

## Data Transformation

### Apply Functions:
- \`apply()\`: Apply function to rows/columns
- \`map()\`: Apply function to Series
- \`applymap()\`: Apply function to DataFrame

### String Operations:
- \`str.upper()\`, \`str.lower()\`
- \`str.contains()\`, \`str.replace()\`

### Date Operations:
- \`pd.to_datetime()\`
- \`dt.year\`, \`dt.month\`, \`dt.day\``,
    codeSnippet: `import pandas as pd
import numpy as np

# Create sample data
df = pd.DataFrame({
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'Age': [25, 30, 35, 28, 32],
    'City': ['NYC', 'Paris', 'London', 'Tokyo', 'Sydney'],
    'Salary': [70000, 80000, 90000, 75000, 85000]
})

# loc - label-based
print("First row (loc[0]):")
print(df.loc[0])

print("\\nRows 0-2, Name and Age:")
print(df.loc[0:2, ['Name', 'Age']])

# iloc - integer-based
print("\\nFirst 3 rows (iloc[0:3]):")
print(df.iloc[0:3])

# Boolean indexing
print("\\nEmployees older than 30:")
print(df[df['Age'] > 30])

print("\\nEmployees in NYC or London with high salary:")
condition = (df['City'].isin(['NYC', 'London'])) & (df['Salary'] > 75000)
print(df[condition])

# Query method
print("\\nUsing query:")
print(df.query('Age > 30 and Salary < 90000'))

# Handling missing values
messy_data = pd.DataFrame({
    'Name': ['Alice', 'Bob', None, 'Diana'],
    'Age': [25, None, 35, 28],
    'Salary': [70000, 80000, None, 75000]
})

print("\\nMissing values:")
print(messy_data.isnull().sum())

# Fill missing values
filled = messy_data.copy()
filled['Name'].fillna('Unknown', inplace=True)
filled['Age'].fillna(messy_data['Age'].mean(), inplace=True)
filled['Salary'].fillna(messy_data['Salary'].median(), inplace=True)

print("\\nAfter filling:")
print(filled)

# Apply functions
df['Bonus'] = df['Salary'] * 0.1
df['Name_Length'] = df['Name'].apply(len)
df['Name_Upper'] = df['Name'].str.upper()

print("\\nWith new columns:")
print(df)`
};


export const week2Lesson5 = {
    title: 'Pandas Grouping and Aggregation',
    videoUrl: 'https://www.youtube.com/embed/txMdrV1Ut64',
    notes: `# Grouping and Aggregation

## GroupBy Operations

Split-Apply-Combine strategy for data analysis.

### Process:
1. **Split**: Divide data into groups
2. **Apply**: Apply function to each group
3. **Combine**: Combine results

## Aggregation Functions

### Common Aggregations:
- sum(), mean(), median()
- count(), size()
- min(), max()
- std(), var()

### Multiple Aggregations:
Use \`agg()\` to apply multiple functions.

## Pivot Tables

Reshape data for analysis.

### Features:
- Summarize data
- Multiple dimensions
- Flexible aggregation

## Merging DataFrames

Combine multiple DataFrames.

### Join Types:
- **Inner**: Only matching rows
- **Left**: All from left, matching from right
- **Right**: All from right, matching from left
- **Outer**: All rows from both`,
    codeSnippet: `import pandas as pd
import numpy as np

# Create sales data
np.random.seed(42)
sales_data = pd.DataFrame({
    'Product': np.random.choice(['A', 'B', 'C'], 20),
    'Region': np.random.choice(['North', 'South', 'East', 'West'], 20),
    'Sales': np.random.randint(100, 1000, 20),
    'Quantity': np.random.randint(1, 20, 20)
})

print("Sales Data:")
print(sales_data.head())

# Group by single column
product_group = sales_data.groupby('Product')
print("\\nProduct Statistics:")
print(product_group['Sales'].agg(['mean', 'sum', 'count', 'max']))

# Group by multiple columns
region_product = sales_data.groupby(['Region', 'Product'])
print("\\nRegion-Product Mean Sales:")
print(region_product['Sales'].mean())

# Multiple aggregations
agg_data = sales_data.groupby('Region').agg({
    'Sales': ['sum', 'mean', 'max'],
    'Quantity': ['sum', 'mean']
})
print("\\nMultiple aggregations:")
print(agg_data)

# Pivot table
pivot = pd.pivot_table(sales_data,
                       values='Sales',
                       index='Region',
                       columns='Product',
                       aggfunc='sum',
                       fill_value=0)
print("\\nPivot Table:")
print(pivot)

# Merging DataFrames
df1 = pd.DataFrame({
    'ID': [1, 2, 3, 4],
    'Name': ['Alice', 'Bob', 'Charlie', 'Diana']
})

df2 = pd.DataFrame({
    'ID': [1, 2, 3, 5],
    'City': ['NYC', 'Paris', 'London', 'Tokyo']
})

# Inner join
inner = pd.merge(df1, df2, on='ID', how='inner')
print("\\nInner Join:")
print(inner)

# Left join
left = pd.merge(df1, df2, on='ID', how='left')
print("\\nLeft Join:")
print(left)

# Outer join
outer = pd.merge(df1, df2, on='ID', how='outer')
print("\\nOuter Join:")
print(outer)`
};


export const week2Quiz = {
    title: 'Week 2 Quiz: NumPy and Pandas',
    questions: [
        {
            question: 'What is the main advantage of NumPy arrays over Python lists?',
            options: [
                'They can store more data',
                'They are faster and more memory efficient',
                'They are easier to create',
                'They can store mixed data types'
            ],
            correctAnswer: 1,
            explanation: 'NumPy arrays are significantly faster (up to 50x) and more memory efficient than Python lists due to contiguous memory allocation and vectorized operations.'
        },
        {
            question: 'What does the reshape() function do in NumPy?',
            options: [
                'Changes the data type of array elements',
                'Sorts the array elements',
                'Changes the dimensions of an array without changing data',
                'Removes duplicate elements'
            ],
            correctAnswer: 2,
            explanation: 'reshape() changes the dimensions/shape of an array without modifying the actual data. For example, a 1D array of 12 elements can be reshaped to 3x4 or 2x6.'
        },
        {
            question: 'In Pandas, what is the difference between loc and iloc?',
            options: [
                'loc is faster than iloc',
                'loc uses labels, iloc uses integer positions',
                'loc is for rows, iloc is for columns',
                'There is no difference'
            ],
            correctAnswer: 1,
            explanation: 'loc uses label-based indexing (column/row names), while iloc uses integer-based indexing (positions). For example, df.loc[0] uses label 0, df.iloc[0] uses position 0.'
        },
        {
            question: 'Which Pandas method would you use to remove rows with missing values?',
            options: [
                'remove_na()',
                'dropna()',
                'delete_missing()',
                'fillna()'
            ],
            correctAnswer: 1,
            explanation: 'dropna() removes rows (or columns) that contain missing values. fillna() is used to fill missing values, not remove them.'
        },
        {
            question: 'What does the groupby() operation in Pandas do?',
            options: [
                'Sorts the DataFrame',
                'Splits data into groups based on criteria',
                'Removes duplicate rows',
                'Merges two DataFrames'
            ],
            correctAnswer: 1,
            explanation: 'groupby() splits data into groups based on specified criteria, allowing you to apply aggregation functions to each group separately (split-apply-combine strategy).'
        }
    ]
};


// Week 3: Data Preprocessing & Exploratory Data Analysis

export const week3Lesson1 = {
    title: 'The Machine Learning Lifecycle',
    videoUrl: 'https://www.youtube.com/embed/nKW8Ndu7Mjw',
    notes: `# The Machine Learning Lifecycle

## ML Workflow Overview

\`\`\`
┌─────────────────────────────────────┐
│     ML Lifecycle Overview           │
├─────────────────────────────────────┤
│ Step 1: Problem Definition          │
│ Step 2: Data Collection             │
│ Step 3: Data Preprocessing & EDA ◄──│ YOU ARE HERE
│ Step 4: Feature Engineering         │
│ Step 5: Model Selection & Training  │
│ Step 6: Model Evaluation            │
│ Step 7: Model Deployment            │
│ Step 8: Monitoring & Maintenance    │
└─────────────────────────────────────┘
\`\`\`

## Why Data Preprocessing?

✅ Real-world data is messy
✅ ML models have requirements
✅ Better data = Better models
✅ "Garbage in, garbage out"

## Common Data Issues

### 1. Missing Values
- Incomplete data collection
- Data corruption
- Human error

### 2. Outliers
- Measurement errors
- Data entry mistakes
- Rare but valid observations

### 3. Inconsistent Data
- Different formats
- Different scales
- Different units

### 4. Duplicate Data
- Multiple entries
- Data merging issues

### 5. Incorrect Data Types
- Numbers stored as strings
- Dates in wrong format

## Data Quality Dimensions

### Accuracy
Is the data correct?

### Completeness
Is all required data present?

### Consistency
Is data uniform across sources?

### Timeliness
Is data up-to-date?

### Validity
Does data conform to rules?`,
    codeSnippet: `import pandas as pd
import numpy as np

# Create messy dataset
messy_data = pd.DataFrame({
    'ID': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    'Age': [25, -5, 30, 35, None, 28, 200, 32, 29, 31],
    'Salary': [50000, 60000, None, 75000, 80000, 90000, -1000, 85000, 70000, 65000],
    'Department': ['IT', 'HR', 'IT', None, 'HR', 'FINANCE', 'IT', 'HR', 'MArketing', 'it'],
    'Experience': [2, 30, 5, 8, 3, 10, 25, 6, 4, 7],
    'City': ['NYC', 'LA', 'NYC', 'Chicago', 'LA', 'NYC', 'Houston', 'NYC', 'LA', 'Chicago']
})

print("Original Messy Data:")
print(messy_data)

# Check data types
print("\\nData Types:")
print(messy_data.dtypes)

# Basic statistics
print("\\nBasic Statistics:")
print(messy_data.describe())

# Check for issues
print("\\nMissing Values:")
print(messy_data.isnull().sum())

print("\\nDuplicate Rows:")
print(messy_data.duplicated().sum())

# Identify outliers (simple method)
print("\\nPotential Outliers:")
print(f"Age < 0 or > 100: {len(messy_data[(messy_data['Age'] < 0) | (messy_data['Age'] > 100)])}")
print(f"Salary < 0: {len(messy_data[messy_data['Salary'] < 0])}")
print(f"Experience > 50: {len(messy_data[messy_data['Experience'] > 50])}")`
};


export const week3Lesson2 = {
    title: 'Handling Missing Values and Outliers',
    videoUrl: 'https://www.youtube.com/embed/EYq3gzYAHaE',
    notes: `# Handling Missing Values and Outliers

## Missing Values

### Types of Missing Data:

**MCAR** (Missing Completely At Random)
- No pattern to missing data
- Safe to delete

**MAR** (Missing At Random)
- Missing depends on other variables
- Can be imputed

**MNAR** (Missing Not At Random)
- Missing has a pattern
- Requires careful handling

### Strategies:

**1. Deletion**
- Drop rows: \`dropna()\`
- Drop columns: \`dropna(axis=1)\`
- Use when: < 5% missing

**2. Imputation**
- Mean/Median: For numeric data
- Mode: For categorical data
- Forward/Backward fill: For time series
- Interpolation: For ordered data

## Outliers

### Detection Methods:

**1. Visual Methods**
- Box plots
- Scatter plots
- Histograms

**2. Statistical Methods**
- Z-score: > 3 standard deviations
- IQR: Outside 1.5 * IQR range

### Handling Strategies:

**1. Capping (Winsorization)**
- Cap at threshold values

**2. Removal**
- Delete outlier rows

**3. Transformation**
- Log transform
- Square root transform`,
    codeSnippet: `import pandas as pd
import numpy as np
from scipy import stats

# Missing Values Example
df = pd.DataFrame({
    'A': [1, 2, None, 4, 5],
    'B': [None, 2, 3, 4, 5],
    'C': [1, 2, 3, 4, 5]
})

print("Original Data:")
print(df)

# Check missing values
print("\\nMissing values:")
print(df.isnull().sum())
print(f"\\nPercentage: {(df.isnull().sum() / len(df)) * 100}%")

# Strategy 1: Drop rows
df_drop = df.dropna()
print(f"\\nAfter dropping rows: {df_drop.shape}")

# Strategy 2: Fill with statistics
df_fill = df.copy()
df_fill['A'].fillna(df['A'].median(), inplace=True)
df_fill['B'].fillna(df['B'].mean(), inplace=True)
print("\\nAfter filling:")
print(df_fill)

# Outliers Example
np.random.seed(42)
normal_data = np.random.normal(100, 20, 1000)
outliers = np.array([200, 250, 300, 20, 10])
data = np.concatenate([normal_data, outliers])

df_outliers = pd.DataFrame({'Value': data})

# Method 1: Z-Score
z_scores = np.abs(stats.zscore(df_outliers))
outliers_z = df_outliers[(z_scores > 3).all(axis=1)]
print(f"\\nOutliers (Z-score > 3): {len(outliers_z)}")

# Method 2: IQR
Q1 = df_outliers['Value'].quantile(0.25)
Q3 = df_outliers['Value'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers_iqr = df_outliers[(df_outliers['Value'] < lower_bound) | 
                           (df_outliers['Value'] > upper_bound)]
print(f"Outliers (IQR method): {len(outliers_iqr)}")
print(f"Bounds: [{lower_bound:.2f}, {upper_bound:.2f}]")

# Handling: Capping
df_capped = df_outliers.copy()
df_capped['Value'] = df_capped['Value'].clip(lower_bound, upper_bound)
print(f"\\nAfter capping: Min={df_capped['Value'].min():.2f}, Max={df_capped['Value'].max():.2f}")`
};


export const week3Lesson3 = {
    title: 'Feature Scaling and Encoding',
    videoUrl: 'https://www.youtube.com/embed/mnKm3YP56PY',
    notes: `# Feature Scaling and Encoding

## Why Feature Scaling?

ML algorithms perform better when features are on similar scales.

### Algorithms that need scaling:
- K-Nearest Neighbors
- Support Vector Machines
- Neural Networks
- Linear/Logistic Regression (with regularization)

### Algorithms that don't need scaling:
- Decision Trees
- Random Forests
- Gradient Boosting

## Scaling Methods

### 1. Standardization (Z-score)
- Mean = 0, Std = 1
- Formula: (x - mean) / std
- Use when: Data is normally distributed

### 2. Min-Max Normalization
- Range: [0, 1]
- Formula: (x - min) / (max - min)
- Use when: Need bounded range

### 3. Robust Scaling
- Uses median and IQR
- Less affected by outliers
- Use when: Data has outliers

## Categorical Encoding

### 1. Label Encoding
- Convert categories to numbers
- Use for: Ordinal data (Low, Medium, High)

### 2. One-Hot Encoding
- Create binary columns
- Use for: Nominal data (Red, Blue, Green)

### 3. Binary Encoding
- Encode as binary digits
- Use for: High cardinality features`,
    codeSnippet: `import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler, LabelEncoder

# Create sample data
df = pd.DataFrame({
    'Age': [25, 30, 35, 40, 45],
    'Salary': [50000, 60000, 75000, 90000, 100000],
    'Experience': [2, 5, 8, 12, 15],
    'Department': ['IT', 'HR', 'IT', 'Finance', 'HR'],
    'Level': ['Junior', 'Mid', 'Senior', 'Senior', 'Lead']
})

print("Original Data:")
print(df)

# Standardization
scaler_standard = StandardScaler()
df_standard = df.copy()
df_standard[['Age', 'Salary', 'Experience']] = scaler_standard.fit_transform(
    df[['Age', 'Salary', 'Experience']]
)
print("\\nStandardized:")
print(df_standard[['Age', 'Salary', 'Experience']].describe())

# Min-Max Scaling
scaler_minmax = MinMaxScaler()
df_minmax = df.copy()
df_minmax[['Age', 'Salary', 'Experience']] = scaler_minmax.fit_transform(
    df[['Age', 'Salary', 'Experience']]
)
print("\\nMin-Max Scaled:")
print(df_minmax[['Age', 'Salary', 'Experience']].describe())

# Robust Scaling
scaler_robust = RobustScaler()
df_robust = df.copy()
df_robust[['Age', 'Salary', 'Experience']] = scaler_robust.fit_transform(
    df[['Age', 'Salary', 'Experience']]
)
print("\\nRobust Scaled:")
print(df_robust[['Age', 'Salary', 'Experience']].describe())

# Label Encoding
le = LabelEncoder()
df['Department_Encoded'] = le.fit_transform(df['Department'])
print("\\nLabel Encoded Department:")
print(df[['Department', 'Department_Encoded']])

# One-Hot Encoding
df_onehot = pd.get_dummies(df, columns=['Department', 'Level'])
print("\\nOne-Hot Encoded:")
print(df_onehot.columns.tolist())
print(df_onehot.head())`
};


export const week3Lesson4 = {
    title: 'Data Visualization for EDA',
    videoUrl: 'https://www.youtube.com/embed/0P7QnIQDBJY',
    notes: `# Data Visualization for EDA

## Why Visualize Data?

✅ Understand data distribution
✅ Identify patterns and trends
✅ Detect outliers and anomalies
✅ Discover relationships
✅ Communicate insights

## Types of Plots

### Univariate Analysis (Single Variable)

**Histogram**
- Show distribution
- Identify skewness

**Box Plot**
- Show quartiles
- Identify outliers

**Bar Chart**
- Compare categories
- Show frequencies

### Bivariate Analysis (Two Variables)

**Scatter Plot**
- Show relationship
- Identify correlation

**Line Plot**
- Show trends over time
- Compare multiple series

**Heatmap**
- Show correlation matrix
- Identify strong relationships

### Multivariate Analysis (Multiple Variables)

**Pair Plot**
- Multiple scatter plots
- Overview of relationships

**Facet Grid**
- Multiple plots by category
- Compare subgroups

## Visualization Libraries

### Matplotlib
- Low-level control
- Highly customizable

### Seaborn
- Built on Matplotlib
- Statistical plots
- Beautiful defaults

### Plotly
- Interactive plots
- Web-based visualizations`,
    codeSnippet: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
sns.set_style("whitegrid")

# Create sample data
np.random.seed(42)
df = pd.DataFrame({
    'Age': np.random.randint(20, 60, 100),
    'Salary': np.random.randint(30000, 150000, 100),
    'Experience': np.random.randint(0, 30, 100),
    'Department': np.random.choice(['IT', 'HR', 'Finance', 'Marketing'], 100)
})

# Histogram
plt.figure(figsize=(10, 4))
plt.subplot(1, 2, 1)
plt.hist(df['Age'], bins=20, edgecolor='black')
plt.title('Age Distribution')
plt.xlabel('Age')
plt.ylabel('Frequency')

# Box plot
plt.subplot(1, 2, 2)
sns.boxplot(y=df['Salary'])
plt.title('Salary Box Plot')
plt.tight_layout()
plt.show()

# Scatter plot
plt.figure(figsize=(8, 6))
plt.scatter(df['Experience'], df['Salary'], alpha=0.5)
plt.title('Experience vs Salary')
plt.xlabel('Experience (years)')
plt.ylabel('Salary ($)')
plt.show()

# Bar chart
plt.figure(figsize=(8, 5))
df['Department'].value_counts().plot(kind='bar')
plt.title('Employees by Department')
plt.xlabel('Department')
plt.ylabel('Count')
plt.xticks(rotation=45)
plt.show()

# Correlation heatmap
plt.figure(figsize=(8, 6))
correlation = df[['Age', 'Salary', 'Experience']].corr()
sns.heatmap(correlation, annot=True, cmap='coolwarm', center=0)
plt.title('Correlation Matrix')
plt.show()

# Pair plot
sns.pairplot(df, hue='Department')
plt.suptitle('Pair Plot by Department', y=1.02)
plt.show()`
};


export const week3Lesson5 = {
    title: 'Complete EDA Project: Titanic Dataset',
    videoUrl: 'https://www.youtube.com/watch?v=8yZWvRYV7oI',
    notes: `# Complete EDA: Titanic Dataset

## Dataset Overview

The Titanic dataset contains information about passengers on the Titanic, including whether they survived.

### Features:
- **survived**: 0 = No, 1 = Yes
- **pclass**: Passenger class (1, 2, 3)
- **sex**: Male or Female
- **age**: Age in years
- **sibsp**: # of siblings/spouses aboard
- **parch**: # of parents/children aboard
- **fare**: Passenger fare
- **embarked**: Port (C, Q, S)

## EDA Process

### 1. Initial Exploration
- Load data
- Check shape and types
- View first/last rows
- Get basic statistics

### 2. Data Quality Check
- Missing values
- Duplicates
- Data types
- Value ranges

### 3. Univariate Analysis
- Distribution of each feature
- Summary statistics
- Identify outliers

### 4. Bivariate Analysis
- Survival rate by feature
- Correlations
- Relationships

### 5. Multivariate Analysis
- Multiple features together
- Complex patterns
- Interactions

### 6. Key Insights
- What affects survival?
- Which features are important?
- Any surprising patterns?`,
    codeSnippet: `import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Load Titanic dataset
titanic = sns.load_dataset('titanic')

print("="*60)
print("TITANIC DATASET EDA")
print("="*60)

# 1. Initial Exploration
print("\\n1. DATASET OVERVIEW")
print(f"Shape: {titanic.shape}")
print(f"\\nFirst 5 rows:")
print(titanic.head())
print(f"\\nData types:")
print(titanic.dtypes)

# 2. Data Quality
print("\\n2. DATA QUALITY")
print(f"Missing values:")
print(titanic.isnull().sum())
print(f"\\nDuplicates: {titanic.duplicated().sum()}")

# 3. Target Variable
print("\\n3. SURVIVAL ANALYSIS")
survival_rate = titanic['survived'].mean()
print(f"Overall survival rate: {survival_rate:.2%}")
print(f"\\nSurvival counts:")
print(titanic['survived'].value_counts())

# 4. Feature Analysis
print("\\n4. KEY INSIGHTS")

# By Sex
print("\\nSurvival by Sex:")
print(titanic.groupby('sex')['survived'].mean())

# By Class
print("\\nSurvival by Class:")
print(titanic.groupby('pclass')['survived'].mean())

# By Age
print("\\nAge Statistics by Survival:")
print(titanic.groupby('survived')['age'].describe())

# 5. Visualizations
fig, axes = plt.subplots(2, 2, figsize=(15, 10))

# Survival by class and sex
sns.barplot(x='pclass', y='survived', hue='sex', data=titanic, ax=axes[0,0])
axes[0,0].set_title('Survival Rate by Class and Sex')

# Age distribution
titanic[titanic['survived']==1]['age'].hist(alpha=0.5, label='Survived', bins=20, ax=axes[0,1])
titanic[titanic['survived']==0]['age'].hist(alpha=0.5, label='Died', bins=20, ax=axes[0,1])
axes[0,1].set_title('Age Distribution by Survival')
axes[0,1].legend()

# Fare by survival
sns.boxplot(x='survived', y='fare', data=titanic[titanic['fare'] < 300], ax=axes[1,0])
axes[1,0].set_title('Fare Distribution by Survival')

# Correlation
numeric_cols = ['survived', 'pclass', 'age', 'sibsp', 'parch', 'fare']
sns.heatmap(titanic[numeric_cols].corr(), annot=True, cmap='coolwarm', ax=axes[1,1])
axes[1,1].set_title('Feature Correlations')

plt.tight_layout()
plt.show()

print("\\n" + "="*60)
print("KEY FINDINGS:")
print("• Women had higher survival rate than men")
print("• Higher class passengers survived more")
print("• Children had better survival chances")
print("• Higher fare correlated with survival")
print("="*60)`
};


export const week3Quiz = {
    title: 'Week 3 Quiz: Data Preprocessing & EDA',
    questions: [
        {
            question: 'Which method is best for handling missing values when less than 5% of data is missing?',
            options: [
                'Always fill with mean',
                'Always fill with mode',
                'Drop the rows with missing values',
                'Create a new category for missing'
            ],
            correctAnswer: 2,
            explanation: 'When less than 5% of data is missing, dropping rows is often the simplest and most effective approach as it has minimal impact on the dataset size.'
        },
        {
            question: 'What is the IQR (Interquartile Range) method used for?',
            options: [
                'Filling missing values',
                'Detecting outliers',
                'Scaling features',
                'Encoding categories'
            ],
            correctAnswer: 1,
            explanation: 'IQR method is used to detect outliers. Values outside the range [Q1 - 1.5*IQR, Q3 + 1.5*IQR] are considered outliers.'
        },
        {
            question: 'Which scaling method transforms data to have mean=0 and std=1?',
            options: [
                'Min-Max Scaling',
                'Robust Scaling',
                'Standardization (Z-score)',
                'Normalization'
            ],
            correctAnswer: 2,
            explanation: 'Standardization (Z-score normalization) transforms data to have mean=0 and standard deviation=1 using the formula: (x - mean) / std.'
        },
        {
            question: 'When should you use One-Hot Encoding instead of Label Encoding?',
            options: [
                'For ordinal categorical data',
                'For nominal categorical data',
                'For numerical data',
                'For time series data'
            ],
            correctAnswer: 1,
            explanation: 'One-Hot Encoding should be used for nominal (non-ordinal) categorical data where there is no inherent order (e.g., colors, cities). Label Encoding is for ordinal data with natural order.'
        },
        {
            question: 'What is the primary purpose of Exploratory Data Analysis (EDA)?',
            options: [
                'To train machine learning models',
                'To understand data patterns and relationships',
                'To deploy models to production',
                'To write documentation'
            ],
            correctAnswer: 1,
            explanation: 'EDA is the process of analyzing datasets to understand their main characteristics, identify patterns, detect anomalies, and discover relationships between variables.'
        }
    ]
};
