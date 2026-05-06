---
name: new-feature-page
description: "Create a new feature documentation page: determine section/filename, write in docs/latest/, create 6.x/7.x wrappers, add nav entries. Accepts PRs, Jira tickets, Confluence pages, or verbal descriptions as input."
---

# Prompt

You are writing a new feature documentation page for Wallarm product docs.

## Input

The author provides one or more of:
- **Feature description**: what the feature does, how it works
- **PR link(s)**: GitHub PR with the implementation — read the PR description and diff
- **Jira/Confluence link(s)**: ticket or spec with feature details
- **Use cases**: how and when users use this feature
- **Context from the author**: any additional guidance on tone, depth, audience, or emphasis

The author does NOT need to specify section, filename, or nav position — you determine all of that yourself based on the content and the existing repository structure.

## Steps

### Phase 1: Research

1. **Read the source material** the author provided (PRs, tickets, descriptions).
2. **Read reference files**:
   - `.doc-agent/glossary.md` — verify all terms match approved terminology
   - `.doc-agent/style-guide.md` — follow writing conventions
3. **Determine placement**:
   - Browse existing sections in `docs/latest/` to find the best fit
   - Read existing pages in the candidate section to match tone, depth, and structure
   - Check if related pages already exist that should cross-link to the new page
4. **Determine filename**: lowercase with hyphens, descriptive of the content (e.g., `mcp-discovery.md`, `web-antibot.md`)
5. **Determine subscription badge**: check if the feature requires a specific subscription plan by looking at sibling pages in the same section. If they have a badge, the new page likely needs one too.
6. **Determine version requirements**: extract minimum NGINX Node and Native Node versions from the source material if applicable.

### Phase 2: Write the page

7. **Write the page** in `docs/latest/<section>/<filename>` using this structure:

```markdown
# Feature Name <subscription-badge-if-needed>

<1-3 sentence intro: what the feature does and why it matters>

## Requirements

* The [Plan Name](../about-wallarm/subscription-plans.md#core-subscription-plans) subscription plan
* [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) X.Y.Z or higher, or [Native Node](../installation/nginx-native-node-internals.md#native-node) A.B.C or higher
* <additional requirements>

## How <feature> works

<Mechanism explanation. Include screenshots if available, otherwise leave TODO.>

![Description](../images/<section>/filename.png)

## <Feature-specific sections>

### Configuration

| Parameter | Description |
|---|---|
| **Param** | Description. |

### Example

<Concrete scenario with specific values.>

## <Additional sections as needed>
```

Adapt the template to the feature — not every page needs all sections. A simple feature may skip Configuration or Example. A complex feature may have multiple sub-sections.

### Phase 3: Integrate into the site

8. **Create wrappers**:
   - `docs/7.x/<section>/<filename>` with content: `--8<-- "latest/<section>/<filename>"`
   - `docs/6.x/<section>/<filename>` with content: `--8<-- "latest/<section>/<filename>"`
   - Create parent directories if they do not exist

9. **Update navigation** in both `mkdocs-7.x.yml` and `mkdocs-6.x.yml`:
   - Find the correct section in the `nav:` block by looking at where sibling pages are listed
   - Add the page entry in the right position
   - Match indentation of surrounding entries
   - For `mkdocs-7.x.yml` the path prefix is `7.x/`, for `mkdocs-6.x.yml` it is `6.x/`

10. **Update related pages** if needed:
    - Add a link from the section's overview/landing page
    - Add a cross-reference from related feature pages
    - If relevant, mention in `updating-migrating/what-is-new.md`

## Style rules

- American English, no contractions
- Present tense, active voice, second person
- Imperative for instructions
- Subscription badge: `<a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>`
- Cross-references: relative paths only
- Placeholders: `<UPPERCASE_WITH_UNDERSCORES>`
- Check glossary for every Wallarm term: "NGINX Node" not "Nginx Node", "Wallarm Console" not "portal"
- No marketing language — state facts
- Sentences: 15-20 words average
- Bold for UI elements: **Save**, **Configure**
- `Code` for parameters, values, commands
- Admonitions: `!!! info ""` for tips, `!!! warning` for critical info

## Do NOT

- Invent features not in the source material
- Use full URLs to docs.wallarm.com
- Skip the Requirements section
- Place images in `docs/` — use root `images/` folder
- Use contractions, passive voice, or marketing language
- Use "blacklist"/"whitelist" — use "denylist"/"allowlist"
- Ask the author to specify section, filename, or nav position — determine it yourself
- Forget to create wrappers in both 6.x/ and 7.x/
- Forget to add nav entries in both mkdocs config files
