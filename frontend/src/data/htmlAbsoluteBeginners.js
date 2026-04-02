export const htmlAbsoluteBeginners = {
    title: "HTML for Absolute Beginners: Your First Step into Web Development",
    description: "Welcome! You're about to learn HTML, the skeleton of every webpage you've ever seen. It's the easiest and most rewarding place to start your journey into web development. No prior experience is needed.",

    sections: [
        {
            id: "what-is-html",
            title: "1. What is HTML?",
            content: `
HTML stands for **HyperText Markup Language**.

It is **not a programming language** (like Python or JavaScript). Programming languages create logic and functionality. HTML is a **markup language**.

Its job is to **structure content**. It tells the web browser (like Chrome, Safari, or Firefox) what the different parts of a page are. For example:

- "This text is a heading."
- "This block of text is a paragraph."
- "This is an image."
- "This text is a link to another page."

Think of it like a **web architect**. You use HTML to draw the blueprints for a house, defining where the walls, roof, doors, and windows go. CSS (Cascading Style Sheets) is the interior decorator that adds colors, fonts, and layout, and JavaScript is the electricity that makes things interactive.
      `
        },

        {
            id: "workspace-setup",
            title: "2. Setting Up Your Workspace",
            content: `
You need two things to start writing HTML:

### A Text Editor
This is where you'll write your code. Don't use a word processor like Microsoft Word (it adds invisible formatting). Use a plain text editor.

**Beginner-friendly:** Visual Studio Code (VS Code) is the industry standard and completely free. Download it from code.visualstudio.com.

**Alternatives:** Sublime Text, Atom, or even Notepad (on Windows) or TextEdit (on Mac, set to plain text mode).

### A Web Browser
You already have one! Chrome or Firefox are the best for development because they have excellent built-in developer tools to help you inspect and debug your code.
      `
        },

        {
            id: "html-structure",
            title: "3. The Structure of an HTML Document",
            content: `
Every HTML document follows the same basic structure. It's like a universal template.

Let's look at the code and then break it down:
      `,
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is my first paragraph.</p>
</body>
</html>`,
            explanation: `
### Line-by-Line Explanation:

- **\`<!DOCTYPE html>\`**: This is a declaration. It tells the browser, "Hey, this is an HTML5 document." It must always be the very first line.

- **\`<html lang="en">\`**: This is the root element. It wraps all the content on the page. The \`lang="en"\` attribute specifies the language (English) for accessibility and search engines.

- **\`<head>\`**: This is the head section. It contains metadata—information about the webpage that isn't directly displayed on the page itself. This includes the page title, links to CSS files, and character set.

- **\`<meta charset="UTF-8">\`**: Specifies the character encoding. UTF-8 includes almost all characters from all languages, preventing weird symbols from appearing.

- **\`<meta name="viewport" ...>\`**: This is crucial for making your site look good on mobile devices. It controls the viewport's size and scale.

- **\`<title>\`**: This sets the title that appears on the browser tab. This is displayed to the user.

- **\`<body>\`**: This is the body section. Everything that you see on the actual webpage—text, images, buttons, links—goes inside the \`<body>\` tags.

- **\`</html>\`**: The closing tag for the root element.

**The Golden Rule:** Every HTML document must have this basic skeleton.
      `
        },

        {
            id: "core-concepts",
            title: "4. Core Concepts: Elements, Tags, and Attributes",
            content: `
### Tags
The building blocks. They are keywords surrounded by angle brackets. Most tags come in pairs: an opening tag \`<p>\` and a closing tag \`</p>\`. The closing tag has a forward slash \`/\`.

### Elements
The combination of an opening tag, the content inside, and the closing tag.
\`\`\`html
<p>This is a paragraph element.</p>
\`\`\`

### Attributes
Provide extra information about an element. They are placed inside the opening tag. They usually come in name/value pairs like \`name="value"\`. A common example is the \`href\` attribute for links.
      `,
            code: `<a href="https://www.example.com">Click here to visit Example.com</a>`,
            explanation: `
- \`a\` is the tag.
- \`href\` is an attribute (specifying the link destination).
- \`https://www.example.com\` is the value of the attribute.
- \`Click here to visit Example.com\` is the content.
      `
        },

        {
            id: "essential-elements",
            title: "5. Essential HTML Elements",
            content: "These are the tags you'll use 90% of the time.",
            subsections: [
                {
                    title: "Headings & Paragraphs",
                    content: "Headings range from `<h1>` (most important) to `<h6>` (least important). Use them to structure your content hierarchy, like an outline.",
                    code: `<h1>Main Title of the Page</h1>
<h2>Section Title</h2>
<h3>Sub-section Title</h3>

<p>This is a regular paragraph of text. It will wrap to the next line when it reaches the edge of the browser window.</p>

<p>This is another paragraph. Browsers automatically add a small amount of space between paragraphs.</p>`
                },
                {
                    title: "Links (Anchors)",
                    content: "Links are what make the web, 'the web'. Use the `<a>` tag (anchor) with the `href` attribute.",
                    code: `<!-- Absolute link (goes to an external website) -->
<a href="https://www.google.com">Visit Google</a>

<!-- Relative link (links to another page within your own website) -->
<a href="about.html">About Us</a>

<!-- Open link in a new tab -->
<a href="https://www.wikipedia.org" target="_blank">Wikipedia (opens in new tab)</a>`
                },
                {
                    title: "Images",
                    content: "Images are self-closing tags (they don't have a closing tag). Use the `<img>` tag with `src` (source) and `alt` (alternative text) attributes.",
                    code: `<!-- 'src' is the path to the image file -->
<!-- 'alt' is critical for accessibility and displays if the image fails to load -->
<img src="images/my-photo.jpg" alt="A description of the photo for screen readers">

<!-- You can also link to an image from the web -->
<img src="https://placehold.co/600x400" alt="A placeholder image">`,
                    note: "Always, always, always include alt text. It's crucial for users with screen readers and for SEO (Search Engine Optimization)."
                },
                {
                    title: "Lists",
                    content: "There are two main types of lists: unordered (bulleted) and ordered (numbered). List items are always wrapped in `<li>` tags.",
                    code: `<!-- Unordered List -->
<ul>
    <li>Apples</li>
    <li>Bananas</li>
    <li>Milk</li>
</ul>

<!-- Ordered List -->
<ol>
    <li>Wake up</li>
    <li>Brush teeth</li>
    <li>Drink coffee</li>
</ol>`
                },
                {
                    title: "Divs & Spans (Containers)",
                    content: `These are generic container elements that don't have any inherent visual style. They are used to group other elements together so you can style them with CSS or manipulate them with JavaScript.

- **\`<div>\`**: A block-level container. It will take up the full width available and start on a new line. Think of it as a big, invisible box.
- **\`<span>\`**: An inline container. It only takes up as much width as necessary and does not start on a new line. Use it to style a small part of text.`,
                    code: `<div class="card">
    <h2>A Card Title</h2>
    <p>This is some text inside a card. The <span class="highlight">word 'card'</span> is inside a span.</p>
</div>`
                }
            ]
        },

        {
            id: "first-webpage",
            title: "6. Building Your First Webpage",
            content: `
Let's put everything together! Open your text editor, create a new file called \`index.html\`, and type the following:
      `,
            code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Awesome Recipe</title>
</head>
<body>
    <h1>My Favorite Pancake Recipe</h1>
    
    <img src="https://placehold.co/800x400" alt="Delicious pancakes with syrup">
    
    <h2>Ingredients</h2>
    <ul>
        <li>1 cup all-purpose flour</li>
        <li>2 tablespoons sugar</li>
        <li>1 teaspoon baking powder</li>
        <li>1 cup milk</li>
        <li>1 egg</li>
    </ul>
    
    <h2>Instructions</h2>
    <ol>
        <li>Mix all dry ingredients in a bowl.</li>
        <li>Add milk and egg. Stir until just combined.</li>
        <li>Pour batter onto a hot, lightly oiled pan.</li>
        <li>Cook until bubbles form on the surface, then flip and cook until golden brown.</li>
    </ol>
    
    <p>For more great recipes, visit <a href="https://www.allrecipes.com" target="_blank">AllRecipes.com</a>.</p>
</body>
</html>`,
            steps: [
                "Save the file.",
                "Navigate to where you saved index.html on your computer.",
                "Double-click the file. It will open in your default web browser."
            ],
            conclusion: "Congratulations! You've built your first webpage."
        },

        {
            id: "next-steps",
            title: "7. Next Steps & Resources",
            content: `
You've learned the fundamentals! Here's where to go next:

### Continue Learning

- **Learn CSS**: Your page works, but it looks plain. CSS will let you add colors, fonts, layout (like Flexbox and Grid), and make it look professional.

- **Learn Semantic HTML**: You used \`<div>\` and \`<span>\`, but there are more meaningful tags like \`<article>\`, \`<section>\`, \`<nav>\`, \`<header>\`, and \`<footer>\`. These improve accessibility and SEO.

- **Start Using Developer Tools**: Right-click on any webpage and select "Inspect". This opens the browser's DevTools. You can see the HTML structure, experiment with CSS live, and debug your code.

### Great Resources for Learning More

- **MDN Web Docs (Mozilla Developer Network)**: The definitive, most accurate documentation for HTML, CSS, and JavaScript. It's not just for beginners; it's for everyone.

- **freeCodeCamp**: Offers an excellent, interactive, and free curriculum. Their "Responsive Web Design" course is a perfect next step.

- **W3Schools**: A great reference with simple explanations and "Try it Yourself" editors.

### Keep Practicing

Your journey has just begun. Keep practicing by building small projects—a personal bio page, a list of your favorite movies, or a simple blog layout. The more you build, the more natural it will become.

**Happy coding!**
      `
        }
    ],

    keyTakeaways: [
        "HTML is a markup language that structures web content",
        "Every HTML document has a standard structure with <!DOCTYPE>, <html>, <head>, and <body>",
        "Tags create elements, and attributes provide additional information",
        "Essential elements include headings, paragraphs, links, images, and lists",
        "Always include alt text for images for accessibility",
        "Practice by building simple projects to reinforce your learning"
    ],

    practiceExercises: [
        {
            title: "Personal Bio Page",
            description: "Create a simple webpage about yourself with a heading, paragraph, image, and links to your social media."
        },
        {
            title: "Favorite Movies List",
            description: "Build a page with an ordered list of your top 5 movies, including images and descriptions for each."
        },
        {
            title: "Recipe Collection",
            description: "Create multiple recipe pages and link them together using anchor tags."
        },
        {
            title: "Simple Blog Layout",
            description: "Design a basic blog structure with multiple articles, each containing headings, paragraphs, and images."
        }
    ]
};
