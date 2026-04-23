# Doc Agent Setup

## 1. Create Slack App

1. Go to https://api.slack.com/apps → **Create New App** → **From scratch**
2. Name: `DocBot`, Workspace: your workspace
3. **OAuth & Permissions** → add Bot Token Scopes:
   - `chat:write` (post messages)
   - `app_mentions:read` (react to @DocBot)
4. **Install to Workspace** → copy **Bot User OAuth Token** (`xoxb-...`)
5. **Basic Information** → copy **Signing Secret**
6. Don't set Event Subscriptions URL yet — do it after deploy (step 3)

## 2. Create AWS Secrets

```bash
aws secretsmanager create-secret --name doc-agent/jira-token \
    --secret-string "your-jira-api-token"

aws secretsmanager create-secret --name doc-agent/gitlab-token \
    --secret-string "your-gitlab-personal-access-token"

aws secretsmanager create-secret --name doc-agent/claude-key \
    --secret-string "your-anthropic-api-key"

aws secretsmanager create-secret --name doc-agent/slack-signing-secret \
    --secret-string "your-slack-signing-secret"

aws secretsmanager create-secret --name doc-agent/slack-bot-token \
    --secret-string "xoxb-your-slack-bot-token"
```

## 3. Deploy

```bash
cd doc-agent
sam build
sam deploy --guided \
    --parameter-overrides \
        JiraApiTokenArn=arn:aws:secretsmanager:REGION:ACCOUNT:secret:doc-agent/jira-token-XXXX \
        GitLabTokenArn=arn:aws:secretsmanager:REGION:ACCOUNT:secret:doc-agent/gitlab-token-XXXX \
        ClaudeApiKeyArn=arn:aws:secretsmanager:REGION:ACCOUNT:secret:doc-agent/claude-key-XXXX \
        SlackSigningSecretArn=arn:aws:secretsmanager:REGION:ACCOUNT:secret:doc-agent/slack-signing-secret-XXXX \
        SlackBotTokenArn=arn:aws:secretsmanager:REGION:ACCOUNT:secret:doc-agent/slack-bot-token-XXXX \
        JiraUserEmail=you@wallarm.com
```

After deploy, grab the `SlackEventUrl` from outputs.

## 4. Connect Slack

1. Back in Slack app settings → **Event Subscriptions** → Enable
2. **Request URL**: paste the `SlackEventUrl` from deploy output
3. Slack will send a challenge request — Lambda handles it automatically
4. **Subscribe to bot events** → add `app_mention`
5. Save Changes
6. **Invite the bot** to your channel: `/invite @DocBot`

## 5. Use it

In any channel where DocBot is invited:

```
@DocBot PROD-3059
```

DocBot will:
1. Reply: "Беру в работу PROD-3059..."
2. Fetch Jira ticket, linked MRs, Confluence pages
3. Run Claude to generate/update documentation
4. Create a GitLab MR
5. Reply with MR link

## Manual invoke (without Slack)

```bash
aws lambda invoke --function-name <WorkerFunctionName> \
    --payload '{"issue_key": "PROD-3059"}' \
    response.json
cat response.json
```
