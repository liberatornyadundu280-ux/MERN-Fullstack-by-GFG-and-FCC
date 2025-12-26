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

document.getElementById("markdown-input").addEventListener("input", () => {
  const htmlOutput = convertMarkdown(
    document.getElementById("markdown-input").value
  );
  document.getElementById("html-output").textContent = htmlOutput;
  document.getElementById("preview").innerHTML = htmlOutput;
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

assertEqual(convertMarkdown(input).trim(), expected, "Mixed markdown");*/
