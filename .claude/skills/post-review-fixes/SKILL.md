---
name: post-review-fixes
description: "Apply review feedback to documentation pages. Takes review comments (from Jira, Confluence, PR review, or Slack) and applies fixes while preserving style, terminology, and formatting. Validates against glossary and style guide."
---

# Prompt

You are applying review feedback to Wallarm documentation pages.

## Input

The user provides:
- **File(s)**: which pages need fixes
- **Review comments**: list of issues to fix — can be from PR review, Jira ticket, Slack message, or verbal description

## Steps

1. **Read the file(s)** to understand current content and context.

2. **Read reference files** to verify corrections:
   - `.doc-agent/glossary.md` — ensure terminology compliance
   - `.doc-agent/style-guide.md` — ensure style compliance

3. **Categorize each review comment** into:
   - **Factual fix**: incorrect information (wrong version, wrong parameter name, wrong behavior)
   - **Terminology fix**: wrong term per glossary (e.g., "Nginx" → "NGINX", "portal" → "Wallarm Console")
   - **Style fix**: passive voice, contractions, marketing language, directional language
   - **Structure fix**: missing section, wrong heading level, missing admonition
   - **Link fix**: broken cross-reference, wrong anchor, absolute URL
   - **Content addition**: missing information that needs to be added
   - **Content removal**: information that should be removed

4. **Apply each fix**:
   - Make the minimal change needed — do not rewrite surrounding text
   - Preserve existing formatting (indentation, admonition style, list format)
   - If a terminology fix applies in multiple places, fix all occurrences in the file

5. **Validate the result**:
   - All terms match glossary
   - No contractions remain
   - Active voice, present tense, second person
   - Cross-references use relative paths
   - No broken markdown syntax (tables, admonitions, tabs, code blocks)

## Common review fix patterns

| Review comment | What to do |
|---|---|
| "Wrong term" | Check glossary, replace with approved term everywhere in the file |
| "Passive voice" | Rewrite to active: "X is configured by Y" → "Y configures X" |
| "Missing requirement" | Add to the Requirements section with proper format |
| "Screenshot outdated" | Replace image path or add `<!-- TODO: update screenshot -->` |
| "Wrong version" | Verify against changelog, update the version number |
| "Broken link" | Find the correct relative path, fix the cross-reference |
| "Too verbose" | Shorten while preserving meaning — target 15-20 words per sentence |
| "Add example" | Add concrete scenario with specific values following the Example section pattern |

## Do NOT

- Rewrite sections that are not mentioned in the review
- Add features or content not requested in the review
- Change the page structure unless the review explicitly asks for it
- Remove content unless the review explicitly asks for it
- Fix "style issues" in parts of the page not covered by the review
