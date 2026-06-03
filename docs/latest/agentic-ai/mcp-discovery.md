# MCP Server Discovery <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" class="non-zoomable" style="border: none;"></a>

Wallarm's [API Discovery](../api-discovery/overview.md) detects [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) servers in your traffic, captures their primitives, and displays them in the API inventory alongside your REST, GraphQL, SOAP, and gRPC endpoints.

## Requirements

MCP discovery is enabled by default when API Discovery is active — no additional configuration is needed.

* The [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) subscription plan
* [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.12.0 or higher, or [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.25.0 or higher

## How MCP detection works

The Wallarm node identifies MCP traffic by detecting JSON-RPC 2.0 requests with MCP-specific methods. Once detected, the MCP server is added to the **MCP Servers** tab in API Discovery.

![Discovered MCP Servers](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-mcp-servers.png)

The node automatically enables 100% response parsing for discovered MCP endpoints to ensure complete schema capture. The captured schema is uploaded to the Wallarm Cloud.

![Schema of discovered MCP primitive](../images/about-wallarm-waf/api-discovery-2.0/mcp-server-schema.png)

## Discovered primitives

For each discovered MCP server, Wallarm captures three MCP primitive types from `tools/list`, `resources/list`, and `prompts/list` responses:

* **Tools** — invocable functions exposed by the MCP server (e.g., `get_user_profile`, `create_lead`)
* **Resources** — data and files available for reading (e.g., `crm://legal/nda`)
* **Prompts** — parametrized templates for common workflows (e.g., `account_research_prompt`)

For each discovered MCP server, the API Discovery UI displays:

* MCP server version
* Primitive name and description
* Tool parameter types and descriptions (in the Schema tab)
* Resource MIME types
* Request counters for the last 7 days

See [Exploring API Inventory and MCP Servers → MCP primitive details](../api-discovery/exploring.md#mcp-primitive-details) for more information on what is displayed for each primitive type.

## Using discovered MCP servers for protection

Discovered MCP servers can be used as a scope when creating [MCP mitigation controls](mcp-mitigation-controls.md) — ACL policies, request verification rules, and tool input schema enforcement. When you create a mitigation control, the MCP server URI and primitives offer autocomplete suggestions based on API Discovery data.

## Auto-created MCP Session Configuration

Within 30 minutes of discovering an MCP server, Wallarm automatically creates an [MCP Session Configuration](../api-sessions/mcp-sessions.md#mcp-session-configuration) for it with default session identification rules (extracting session ID from the `MCP-SESSION-ID` header). This enables [MCP Sessions](../api-sessions/mcp-sessions.md) — grouping MCP requests into logical sessions visible in the **MCP Sessions** tab.

You can customize the auto-created session configuration to extract additional parameters such as user identity and role. See [MCP Session Configuration](../api-sessions/mcp-sessions.md#mcp-session-configuration) for details.
