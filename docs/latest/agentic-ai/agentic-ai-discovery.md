# Agentic AI Discovery

Wallarm's API Discovery [automatically identifies](../api-discovery/sbf.md#automatic-tagging) your APIs that are related to ML models, neural networks, chatbots or systems that in turn access some paid third-party AI services, such as OpenAI. You can also mark some endpoints as belonging to AI/LLM manually. In this article, automatic and manual AI discovery is described.

## Automatic tagging of AI/LLM

API Discovery automatically tags endpoints as belonging to **AI/LLM** sensitive business flow - on discovering a new endpoint, it checks whether this endpoint potentially belongs to this sensitive business flow, and, if so, marks it with the **AI/LLM** tag.

![Agentic AI endpoints in API Discovery](../images/agentic-ai-protection/agentic-ai-in-api-discovery.png)

<!--Automatic checks are conducted using keywords from the endpoint URL. For AI/LLM, keywords like `TBD`, `TBD` automatically associate the endpoint with the **AI/LLM** flow. If matches are detected, the endpoint is automatically assigned to the appropriate flow.-->

The automatic tagging discovers most of the **AI/LLM** endpoints. However, it is also possible to manually mark an endpoint as AI/LLM as described in the section below.

## Tagging AI/LLM endpoints manually

To adjust the results of [automatic tagging](#automatic-tagging-of-aillm), you can manually add or remove the **AI/LLM** tag to the required endpoints.

To do that, in Wallarm Console, go to API Discovery, then for your endpoint, in the **Business flow & sensitive data**, select `AI/LLM`.

## Viewing AI/LLM endpoints

Once endpoints are assigned with the **AI/LLM** sensitive business flow tag, you can select to show only them. To do that, set the **Business flow** filter to `AI/LLM`.

## Creating custom protection policies for AI/LLM endpoints (under development)

You can create generic protection rules right from the details page of your AI/LLM endpoint. Also, from here, you can create (**under development**) custom protection policies for AI/LLM specifically.

## MCP server discovery

In addition to tagging AI/LLM endpoints, API Discovery detects [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) servers in your traffic. To enable MCP discovery, select the **MCP** protocol in **API Discovery** → **Configure** → **Settings** (see [API Discovery Setup](../api-discovery/setup.md#general-api-discovery-settings)). MCP discovery is disabled by default.

![API Discovery, MCP Discovery enabled in Settings](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-configure-settings-mcp-highlight.png)

The Wallarm node identifies MCP traffic by detecting JSON-RPC 2.0 requests with MCP-specific methods combined with the `MCP-Protocol-Version` header. Once detected, the endpoint is added to the API inventory with the **MCP** protocol label.

![Discovered MCP Servers](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-mcp-servers.png)

For each discovered MCP server, Wallarm captures three MCP primitive types are:

* **Tools** — invocable functions exposed by the MCP server (e.g., `get_user_profile`, `create_lead`)
* **Resources** — data and files available for reading (e.g., `crm://legal/nda`)
* **Prompts** — parametrized templates for common workflows (e.g., `account_research_prompt`)

Service methods such as `initialize`, `ping`, `resources/subscribe`, `completion/complete`, and `logging/setLevel` are automatically filtered out and do not appear as discovered primitives.

For each discovered MCP server, the API Discovery UI displays:

* MCP server version
* Primitive name and description
* Tool parameter types and descriptions (in the Schema tab)
* Resource MIME types
* Request counters for the last 7 days

Discovered MCP servers can then be used as a scope when creating [MCP mitigation controls](mcp-mitigation-controls.md). When you create a mitigation control, the MCP server URI and primitives offer autocomplete suggestions based on API Discovery data.

## MCP Sessions

When MCP servers are discovered, Wallarm automatically:

1. Creates an [MCP Session Configuration](../api-sessions/mcp-sessions.md#mcp-session-configuration) for the discovered server with default session identification rules (extracting session ID from the `Mcp-Session-Id` header).
2. Starts grouping MCP requests into sessions, displayed in a dedicated **MCP Sessions** tab in Wallarm Console → **API Sessions**.

![Discovered API Sessions](../images/api-sessions/mcp-sessions.png)

You can customize the auto-created session configuration to extract additional parameters such as user identity and role. See [MCP Session Configuration](../api-sessions/mcp-sessions.md#mcp-session-configuration) for details.

## AI/LLM business flows in Sessions

Wallarm's [API Sessions](../api-sessions/overview.md) are used to provide you with the full sequence of user activities and thus give more visibility into the logic of malicious actors. If session's requests affect the endpoints that in API Discovery were tagged as **AI/LLM**, such session will be automatically tagged as affecting the **AI/LLM** business flow as well.

Once sessions are assigned with the **AI/LLM** sensitive business flow tag, it becomes possible to select only the sessions touching AI/LLM endpoints. To do that, set the **Business flow** filter to `AI/LLM`.

![API sessions touching Agentic AI endpoints](../images/agentic-ai-protection/agentic-ai-in-api-sessions.png)
