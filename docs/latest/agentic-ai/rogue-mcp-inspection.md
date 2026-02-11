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

<div>
  <script async src="https://js.storylane.io/js/v2/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(60.70% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/uw9kwraim34e?embed=inline" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

### Requirements

* [Postman Desktop Agent](https://learning.postman.com/docs/getting-started/basics/about-postman-agent/#postman-desktop-agent) locally installed and running on your computer and connected to Postman - needed to run MCP inspection on your computer right from the Postman interface.

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
        `WALLARM_API_TOKEN` is not required for the Rogue MCP Inspection but is needed for using the [other tools](#other-tools) of Wallarm's MCP server.

### 2. Ask to inspect for rogue MCP

With Wallarm's MCP server in place, tell Postman's AI Agent to check for rogue MCP. The check will take about couple of minutes.

### 3. Learn the result

Postman's AI Agent will give you an answer with the test results and suggested mitigation measures in case if any security issues were found.

## Other tools

Besides Rogue MCP Inspection, **Wallarm Rogue MCP** Wallarm's MCP server provides other tools for security testing, such as [API Security Testing via Postman](../vulnerability-detection/api-security-testing-via-postman/overview.md)—safe, passive testing of Postman collections for auth gaps, data leaks, and design-level issues.