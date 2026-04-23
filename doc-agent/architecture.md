# Doc Agent Architecture

## System diagram

```mermaid
flowchart TB
    subgraph Slack
        User["👤 User: @DocBot PROD-3059"]
    end

    subgraph AWS["AWS (us-west-1)"]
        APIGW["API Gateway\n/slack/events"]
        Receiver["Lambda: SlackReceiver\n(10s timeout, 256MB)"]
        Worker["Lambda: Worker\n(15min timeout, 2GB, Docker)"]
        Secrets["Secrets Manager\n• Jira token\n• GitHub token\n• Claude API key\n• Slack tokens"]
    end

    subgraph External["External Services"]
        JiraAPI["Jira API\n(read ticket)"]
        ConfAPI["Confluence API\n(read specs)"]
        ClaudeAPI["Claude API\n(generate docs)"]
        GitHubAPI["GitHub API\n(push + create PR)"]
    end

    subgraph Repo["GitHub: wallarm/product-docs-en"]
        Branch["Branch: doc-agent/prod-3059"]
        PR["Pull Request"]
        Netlify["Netlify Preview Build"]
    end

    User -->|"POST webhook"| APIGW
    APIGW --> Receiver
    Receiver -->|"verify signature"| Slack
    Receiver -->|"async invoke"| Worker
    Receiver -->|"'Working on PROD-3059...'"| Slack

    Worker -->|"read secrets"| Secrets
    Worker -->|"GET /issue/PROD-3059"| JiraAPI
    Worker -->|"GET /pages/{id}"| ConfAPI
    Worker -->|"claude -p {prompt}"| ClaudeAPI
    Worker -->|"git push"| Branch
    Worker -->|"POST /pulls"| GitHubAPI
    GitHubAPI --> PR
    PR -->|"auto"| Netlify
    Worker -->|"'Done! PR: url'"| Slack

    style AWS fill:#f5f5f5,stroke:#333
    style External fill:#fff3e0,stroke:#e65100
    style Repo fill:#e8f5e9,stroke:#2e7d32
    style Slack fill:#e3f2fd,stroke:#1565c0
```

## Sequence diagram

```mermaid
sequenceDiagram
    actor User
    participant Slack
    participant Receiver as Lambda: SlackReceiver
    participant Worker as Lambda: Worker
    participant Jira as Jira API
    participant Confluence as Confluence API
    participant Claude as Claude CLI
    participant GitHub as GitHub API

    User->>Slack: @DocBot PROD-3059
    Slack->>Receiver: POST /slack/events
    Receiver->>Receiver: Verify Slack signature
    Receiver->>Slack: "Working on PROD-3059..."
    Receiver->>Worker: Async invoke (issue_key, channel, thread_ts)
    Receiver-->>Slack: 200 OK

    Worker->>Jira: GET /issue/PROD-3059
    Jira-->>Worker: ticket description, links
    Worker->>Confluence: GET /pages/{id}
    Confluence-->>Worker: product spec

    Worker->>Slack: "Context gathered. Running Claude..."
    Worker->>GitHub: git clone product-docs-en
    Worker->>Claude: claude -p "{prompt}" --max-turns 30

    Note over Claude: Reads CLAUDE.md, style-guide, glossary<br/>Reads existing docs<br/>Edits/creates files

    Claude-->>Worker: changes in repo

    Worker->>GitHub: git push doc-agent/prod-3059
    Worker->>GitHub: POST /repos/.../pulls
    GitHub-->>Worker: PR URL

    Worker->>Slack: "Done! PR created: {url}"

    Note over GitHub: Netlify auto-builds preview

    actor PM as PM
    PM->>GitHub: Review PR, edit, merge
```

## How to export

1. Copy a diagram block above
2. Paste into https://mermaid.live
3. Export as PNG or SVG
4. Or paste into Confluence — it renders Mermaid natively with the Mermaid plugin
