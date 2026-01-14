const blockRules = [
  {
    name: "h3",
    pattern: /^###\s+(.*)$/,
    replace: "<h3>$1</h3>",
  },
  {
    name: "h2",
    pattern: /^##\s+(.*)$/,
    replace: "<h2>$1</h2>",
  },
  {
    name: "h1",
    pattern: /^#\s+(.*)$/,
    replace: "<h1>$1</h1>",
  },
  {
    name: "blockquote",
    pattern: /^>\s+(.*)$/,
    replace: "<blockquote>$1</blockquote>",
  },
  {
    name: "paragraph",
    pattern: /^(?!\s*$)(.*)/,
    replace: "<p>$1</p>",
  },
];

const inlineRules = [
  {
    name: "img",
    pattern: /\!\[(.*?)\]\((.*?)\)/g,
    replace: `<img alt="$1" src="$2">`,
  },
  {
    name: "link",
    pattern: /\[(.*?)\]\((.*?)\)/g,
    replace: `<a href="$2">$1</a>`,
  },
  {
    name: "bold",
    pattern: /(\*\*|__)(.*?)\1/g,
    replace: "<strong>$2</strong>",
  },
  {
    name: "italic",
    pattern: /(\*|_)(.*?)\1/g,
    replace: "<em>$2</em>",
  },
];

function parseLists(text) {
  const lines = text.split(/\r?\n/);
  const result = [];

  let i = 0;

  while (i < lines.length) {
    if (/^- /.test(lines[i])) {
      // Start list
      const items = [];

      while (i < lines.length && /^- /.test(lines[i])) {
        items.push(lines[i].replace(/^- /, ""));
        i++;
      }

      const listHTML =
        "<ul>\n" +
        items.map((item) => `<li>${item}</li>`).join("\n") +
        "\n</ul>";

      result.push(listHTML);
    } else {
      result.push(lines[i]);
      i++;
    }
  }

  return result.join("\n");
}

/* the function below will allow me to apply the block rule meaning 
i get to apply what affect the while line like headings when the function is called an argument is passed with with which contains 
the text that needs to be examined and eventually i will be using the block rules i defined above 
*/
function applyBlockRules(text) {
  const lines = text.split(/\r?\n/);
  const transformedLines = [];

  for (const line of lines) {
    let transformed = line;
    let matched = false;

    for (const rule of blockRules) {
      if (rule.pattern.test(line)) {
        transformed = line.replace(rule.pattern, rule.replace);
        matched = true;
        break; // only ONE block rule per line
      }
    }

    transformedLines.push(transformed);
  }

  return transformedLines.join("\n");
}

/*this function works simillar to the one above the difference it works with elemets that are applied inline ie itelic bold and so on
 */
function extractInlineCode(text) {
  const codeBlocks = [];
  let index = 0;

  const protectedText = text.replace(/`([^`]+)`/g, (_, code) => {
    const token = `@@CODE_${index}@@`;
    codeBlocks.push(code);
    index++;
    return token;
  });

  return { protectedText, codeBlocks };
}
function restoreInlineCode(text, codeBlocks) {
  let restored = text;

  codeBlocks.forEach((code, index) => {
    const token = `@@CODE_${index}@@`;
    restored = restored.replace(token, `<code>${code}</code>`);
  });

  return restored;
}

function applyInlineRules(text) {
  const { protectedText, codeBlocks } = extractInlineCode(text);

  let result = protectedText;
  inlineRules.forEach((rule) => {
    result = result.replace(rule.pattern, rule.replace);
  });

  return restoreInlineCode(result, codeBlocks);
}

function convertMarkdown(text) {
  let html = parseLists(text);
  html = applyBlockRules(html);
  html = applyInlineRules(html);
  return html;
}
let textarea = document.getElementById("markdown-input");
document.getElementById("markdown-input").addEventListener("input", () => {
  const htmlOutput = convertMarkdown(
    document.getElementById("markdown-input").value
  );
  document.getElementById("html-output").textContent = htmlOutput;
  document.getElementById("preview").innerHTML = htmlOutput;
  textarea.style.height = "auto";
  textarea.style.height = textarea.scrollHeight + "px";
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle-button");
  const themeMenu = document.getElementById("theme-menu");
  const body = document.body;
  const announcer = document.getElementById("aria-live-announcer");

  /**
   * Announces a message using the aria-live region.
   * @param {string} message - The message to be announced.
   */
  const announceThemeChange = (message) => {
    // 1. Clear the region (important for some screen readers to announce repeat messages)
    announcer.textContent = "";

    // 2. Wait a fraction of a second, then set the new content
    // This is a common pattern to force an announcement
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);

    // 3. Optional: Create a temporary visual popup for all users
    showTemporaryPopup(message);
  };

  /**
   * Visually displays a temporary, non-disruptive popup message.
   * @param {string} message - The message to display.
   */
  const showTemporaryPopup = (message) => {
    let popup = document.getElementById("theme-popup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "theme-popup";
      popup.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 20px;
                background-color: #333;
                color: white;
                border-radius: 5px;
                opacity: 0;
                transition: opacity 0.5s ease-in-out, transform 0.5s;
                transform: translateY(20px);
                z-index: 2000;
            `;
      document.body.appendChild(popup);
    }

    popup.textContent = message;

    // Show the popup
    popup.style.opacity = "1";
    popup.style.transform = "translateY(0)";

    // Hide the popup after 3 seconds
    setTimeout(() => {
      popup.style.opacity = "0";
      popup.style.transform = "translateY(20px)";
    }, 5000);
  };

  /**
   * Toggles the visibility of the theme menu and updates aria-expanded.
   */
  const toggleMenu = () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";

    // Update the ARIA attribute
    toggleButton.setAttribute("aria-expanded", String(!isExpanded));

    // Update the visual visibility
    if (isExpanded) {
      themeMenu.setAttribute("hidden", ""); // Hide the menu
    } else {
      themeMenu.removeAttribute("hidden"); // Show the menu
    }
  };

  /**
   * Applies the selected theme and announces the change.
   * @param {string} themeName - The name of the theme ('light', 'dark', or 'rainbow').
   */
  const applyTheme = (themeName) => {
    body.setAttribute("data-theme", themeName);
    toggleMenu(); // Close the menu after selection

    // Announce the change using the ARIA live region
    const announcementMessage = `Theme switched to ${themeName}.`;
    announceThemeChange(announcementMessage);
  };

  // --- EVENT LISTENERS ---

  // 1. Listener to toggle the menu (for the main button)
  toggleButton.addEventListener("click", toggleMenu);

  // 2. Listener for theme selection (event delegation on the menu)
  themeMenu.addEventListener("click", (event) => {
    const target = event.target;
    // Ensure the click was on one of the theme buttons
    if (target.matches("[data-theme]")) {
      const theme = target.getAttribute("data-theme");
      applyTheme(theme);
    }
  });

  // 3. Listener to close the menu when clicking outside (optional but helpful)
  document.addEventListener("click", (event) => {
    const isClickInside =
      toggleButton.contains(event.target) || themeMenu.contains(event.target);
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";

    if (!isClickInside && isExpanded) {
      toggleMenu();
    }
  });
});

/*// test cases to test

// this function is used to prove if the test cases are passed or not
function assertEqual(actual, expected, description) {
  if (actual === expected) {
    console.log(`PASS: ${description}`);
  } else {
    console.error(`FAIL: ${description}`);
    console.error("Expected:", expected);
    console.error("Actual:  ", actual);
  }
}

// running test cases for headings
assertEqual(convertMarkdown("# Heading"), "<h1>Heading</h1>", "H1 heading");

assertEqual(convertMarkdown("## Heading"), "<h2>Heading</h2>", "H2 heading");

assertEqual(convertMarkdown("### Heading"), "<h3>Heading</h3>", "H3 heading");

assertEqual(
  convertMarkdown("> quote"),
  "<blockquote>quote</blockquote>",
  "Blockquote"
);
assertEqual(
  convertMarkdown("**bold**"),
  "<p><strong>bold</strong></p>",
  "Bold text"
);

assertEqual(
  convertMarkdown("*italic*"),
  "<p><em>italic</em></p>",
  "Italic text"
);
assertEqual(
  convertMarkdown("> quote"),
  "<blockquote>quote</blockquote>",
  "Blockquote"
);
assertEqual(
  convertMarkdown("**bold**"),
  "<p><strong>bold</strong></p>",
  "Bold text"
);

assertEqual(
  convertMarkdown("- one\n- two\n- three"),
  "<ul>\n<li>one</li>\n<li>two</li>\n<li>three</li>\n</ul>",
  "Unordered list"
);

assertEqual(
  convertMarkdown("- **bold**\n- *italic*"),
  "<ul>\n<li><strong>bold</strong></li>\n<li><em>italic</em></li>\n</ul>",
  "Inline formatting in list items"
);

assertEqual(
  convertMarkdown("*italic*"),
  "<p><em>italic</em></p>",
  "Italic text"
);
assertEqual(
  convertMarkdown("[link](url)"),
  '<p><a href="url">link</a></p>',
  "Link"
);

assertEqual(
  convertMarkdown("![alt](img.png)"),
  '<p><img alt="alt" src="img.png"></p>',
  "Image"
);

const input = `
# Title
This is **bold** and \`*not italic*\`
> quote
`;

const expected = `
<h1>Title</h1>
<p>This is <strong>bold</strong> and <code>*not italic*</code></p>
<blockquote>quote</blockquote>
`.trim();

assertEqual(convertMarkdown(input).trim(), expected, "Mixed markdown");

# Markdown Converter Demo

This is a simple paragraph to test basic rendering.
It should not have large gaps in the preview.

## Text Formatting

You can write **bold text**, *italic text*, or even mix **bold and _italic_ together**.

Inline code should not be formatted: `**this is not bold**`

### Links and Images

Here is a link to [OpenAI](https://openai.com).

Here is an image example:
![Sample Image](me.jpg)

## Lists

- First list item
- Second list item with **bold**
- Third list item with *italic*

## Quotes

> This is a blockquote.
> It should stay grouped and readable.

## Mixed Content Test

This paragraph contains **bold**, *italic*, a [link](https://example.com),
and inline code like `console.log("Hello World");`.

Another paragraph right after it to confirm spacing is correct.

---

End of demo.
*/
