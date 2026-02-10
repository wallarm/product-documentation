# Rogue MCP Inspection

Wallarm allows you to audit every installed local MCP server to expose supply-chain risks, excessive privileges, and unrestricted system access to get clear visibility into what AI agents can actually do at your environment.

## Access via Postman

You can access Rogue MCP Inspection via **Wallarm Rogue MCP** Wallarm's MCP server, which is easily accessible via Postman. Scenario:

1. In Postman, you add **Wallarm Rogue MCP** MCP server to your Workspace.
1. With Postman's AI Agent, you just ask to inspect you local machine for the rogue MCP.
1. Agent spends 2 minutes learning your PC and responds with the report covering:

    * This is what can be misused by MCPs on your computer
    * This is how to fix that

This feature is free.

### 1. Add  Wallarm's MCP server

1. In Postman, access its AI Agent.
1. In AI Agent panel, click **Configure** ("gear"), and select **Configure MCP servers**.
1. In displayed **MCP Servers** tab, click **Add** ("plus") and do one of the following:

    * Select **Wallarm Rogue MCP** from the list of the featured MCP servers
    * Or just click Edit config and save the following to it:

        ```json
        {
            "mcpServers": {
                "Wallarm Rogue MCP": {
                    "command": "npx",
                    "args": [
                        "-y",
                        "rogue-mcp@latest"
                    ],
                    "env": {
                        "WALLARM_API_TOKEN": "YOUR_WALLARM_API_TOKEN"
                    }
                }
            }
        }
        ```

    !!! info "WALLARM_API_TOKEN"
        `WALLARM_API_TOKEN` is not required for the Rogue MCP Inspection but is needed for using the additional functions of Wallarm's MCP server.

### 2. Ask to inspect for rogue MCP

With Wallarm's MCP server in place, tell Postman's AI Agent to check for rogue MCP. The check will take about couple of minutes.

### 3. Learn the result

Postman's AI Agent will give you an answer with the test results and suggested mitigation measures in case if any security issues were found.