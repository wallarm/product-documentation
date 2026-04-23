# PROD-3059 Flow Example

## 1. Trigger

Jira Automation rule fires when PROD-3059 status changes to "Implementing".
Sends POST to `https://<api-gw>.execute-api.eu-west-1.amazonaws.com/prod/webhook/jira`

## 2. Lambda receives webhook

```
handler.lambda_handler() →
  verify_jira_webhook()     ✓ signature valid
  parse_jira_event()        → issue_key: "PROD-3059"
  detect_task_type()        → issue_type: "Epic" → task_type: "new-feature"
```

Since task_type is "new-feature" (not maintenance), Lambda launches ECS Fargate task.

## 3. Context gathering

```
gather_context("PROD-3059") →

  1. fetch_jira_issue("PROD-3059")
     → summary: "[API Discovery] Filter API entries w/o authentication"
     → components: ["API Discovery"]
     → description: Full spec with auth headers table
     → linked MR: https://gl.wallarm.com/wallarm-node/meganode/-/merge_requests/902
     → linked Confluence: https://wallarm.atlassian.net/wiki/spaces/CLOUD/pages/6140624904

  2. fetch_mr_diff("meganode!902")
     → title: "PROD-3059: upgrade API Discovery client"
     → diffs: [changes to auth detection logic, new API fields...]

  3. fetch_confluence_page(6140624904)
     → title: "API entry authentication parameters"
     → body: Technical proposal with data model, UI mockups...
```

## 4. Prompt construction

`build_new_feature_prompt()` assembles everything into a single prompt:

```
You are a technical writer for Wallarm...

## Jira Ticket: PROD-3059
Summary: [API Discovery] Filter API entries w/o authentication (Authentication flow MVP)
Components: API Discovery

### Description
- Filter API entries w/o any well-known authentication header
- Filter API entries with authentication
- Filter API entries with multiple Authentication types
- Display the corresponding authentication flow
- Show if auth is present but is not working
- Custom authentication (only parameter key and context)

### Authentication headers table
| Header          | Value pattern | Authentication flow |
| x-api-key       |               | API key             |
| authorization   | Bearer ...    | Bearer              |
| ...             | ...           | ...                 |

## Product Code Changes (GitLab MR)
[diffs showing new auth_flow field, filter parameters, etc.]

## Product Specification (Confluence)
[Technical proposal with data model details]

## Your Task
1. READ existing docs in docs/latest/api-discovery/
2. Update exploring.md: add Authentication filter, add auth flow to endpoint details
3. Update overview.md: mention authentication detection capability
4. Update what-is-new.md if relevant
```

## 5. Claude agent executes

Running in the cloned docs repo, Claude:

1. **Reads** `docs/latest/api-discovery/exploring.md` — understands filter and details structure
2. **Reads** `docs/latest/api-discovery/overview.md` — understands capabilities list
3. **Edits** `exploring.md`:
   - Adds "Authentication" filter description in the Filtering section
   - Adds authentication flow display in REST/GraphQL endpoint details
   - Adds broken authentication indicator
   - Adds custom authentication configuration
4. **Edits** `overview.md`:
   - Adds authentication detection to the "Issues addressed" / capabilities list
5. **Edits** `what-is-new.md`:
   - Adds entry about new authentication flow feature

## 6. MR creation

```
git checkout -b doc-agent/prod-3059
git add -A
git commit -m "docs(PROD-3059): [API Discovery] Filter API entries w/o authentication"
git push origin doc-agent/prod-3059
→ Creates MR: "[Doc Agent] PROD-3059: Filter API entries w/o authentication"
```

## 7. PM reviews

PM (Akhmed Kadymov) receives notification, opens the MR, and:
- Reviews the generated content
- Adjusts wording, adds screenshots
- Approves or requests changes
- Merges when ready
