# Technical Documentation Style Guide

## Language and style

- **American English** — use standard American spelling and punctuation (Merriam-Webster)
- **Write objectively** — no emotive language, humor, jargon, exclamation marks, idioms, metaphors
- **Present simple tense** — "Clicking the number unfolds..." not "Clicking the number will unfold..."
- **Active voice** — "After you install the Node, test its operation" not "After the Node is installed, its operation can be tested"
- **Second person (you)** — "If you use the European cloud, pass the value" not "If the European cloud is used, the value should be passed"
- **First person (we)** — only for Wallarm recommendations: "We recommend..." or "Wallarm recommends..."
- **Imperative mood** for instructions — "Open the file and set the attribute" not "You should open the file"
- **Write positively** — avoid words like damage, fatal, kill, catastrophic
- **Shorter sentences** — 15-20 words average, effective for technical documentation
- **No contractions** — use "it is" not "it's", "do not" not "don't"
- **Avoid directional language** — "Select from these options" not "Select the options in the right sidebar"
- **Stay polite moderately** — use "please" only for expressing excuse, never "thank you"
- **Non-breaking hyphens and spaces** — use `‑` (non-breaking hyphen) and ` ` (non-breaking space) in compound words like "high‑risk" or "G Suite"

## Content structure

- **General to specific** — mention the subject area first, then details
- **State the purpose** — briefly describe what the instruction achieves at the beginning
- **Most common use case first** — in lists or examples
- **Explain new terms** — spell out on first use: "Coordinated Universal Time (UTC)", then "UTC"
- **Conditional clauses before instructions** — "For more information, see this documentation" not "See this documentation for more information"
- **Reuse content** — repeated text blocks go in `include/` directory
- **Relevant file names** — short, descriptive, lowercase with hyphens: `detecting-attacks.md`

## Highlighting

- **Bold** — UI element names the user clicks ("Press **Save**"), important text
- **`Code`** — anything user enters, code blocks, file/method/parameter/value names, CLI commands
- **Info admonition** — useful links, alternative steps, term definitions
- **Warning admonition** — critical info affecting instructions, security alerts, restrictions
- **→ symbol** — sequence of UI actions: "Go to Wallarm account → **Triggers**"
- **Avoid** — quotation marks and brackets for highlighting

## Titles and headers

- Brief but descriptive
- Put the described word/action first: "Configuration of filter node" not "Filter node configuration"
- Prefer noun form or gerund: "Creating an account"
- Step numbers in headers: "Step 1: Creating an account"
- **Capitalize** titles, section names, and H1. Lower-level headers are NOT capitalized.
- No punctuation in headings except colon after step number and question marks
- Use articles but do not start with one: "Creation of a rule" not "The creation of rule"
- Add introductory text between consecutive headings

## Lists

- Introduce with a complete sentence ending with colon or period
- All elements use the same grammatical structure
- **Bulleted lists**: capitalize first word; end with period if full sentences, no punctuation if short expressions
- **Numbered lists**: capitalize first word, end with period (or colon if followed by code block)

## Images

- Use `.png` extension
- Wide but not too long screenshots — include full interface width
- Avoid images when simple text suffices

## Code blocks

- Use `<UPPERCASE_WITH_UNDERSCORES>` for parameter placeholders: `<YOUR_UUID>`, `<YOUR_SECRET_KEY>`
- Proper code layout matching original
- Do NOT use non-breaking hyphens or spaces inside code blocks

## Links

- Informative link text: "follow the [Wallarm documentation](url)" not "[click here](url)"
- Exclude articles from link text
- Always include `http://` or `https://` in URLs

## Numbers

- Spell out numbers at sentence start, use numerals otherwise
- Commas for numbers over 3 digits: `999`, `1,000`, `150,000`
- Use `%` symbol, not "percent"
- Space between numeral and unit: `10 MB`, `100 RPS`
- Units: KB (kilobyte), MB (megabyte), GB (gigabyte), RPS (requests per second)

## Dates

- **Month-day-year** format: March 19, 2019
- Avoid MM/DD/YYYY or DD/MM/YYYY

## Sensitive data in examples

Use realistic but fake values:
- Domains: `api.example.com`, `example.com`, `api.company-x.com/users`
- IPs: `1.1.1.1`, `2.2.2.2`, `1.2.3.4`
- Usernames: John Doe, John Smith
- Emails: `johndoe@example.com`, `johnsmith@company.com`
- Tokens: use the example JWT from jwt.io
