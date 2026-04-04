import re

with open('frontend/src/data/courseContent.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match project entries
# Matches from opening brace before type: 'project' to its closing brace and comma
pattern = r',?\s*\{\s*id:\s*\d+(?:\.\d+)?,\s*title:[^}]*?type:\s*[\'"]project[\'"][^}]*?instructions:\s*`[^`]*`\s*\}'

# Remove all matches
cleaned = re.sub(pattern, '', content, flags=re.DOTALL)

# Clean up any double commas or trailing commas before closing brackets
cleaned = re.sub(r',\s*,', ',', cleaned)
cleaned = re.sub(r',\s*\]', ']', cleaned)

with open('frontend/src/data/courseContent.js', 'w', encoding='utf-8') as f:
    f.write(cleaned)

print("Removed all mini-project entries")
