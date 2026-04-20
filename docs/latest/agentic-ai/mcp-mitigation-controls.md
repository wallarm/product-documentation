# MCP Mitigation Controls <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is an open standard for connecting AI agents to external data sources and tools. MCP servers expose **tools** (invocable functions), **resources** (data/files), and **prompts** (parametrized templates) through a stateful, session-based HTTP protocol.

While MCP enables powerful AI agent integrations, it also introduces new attack surfaces: unauthorized tool access, confused deputy attacks, and schema manipulation.

Since MCP operates over standard HTTP with JSON-RPC payloads, Wallarm's [built-in attack detection](../about-wallarm/protecting-against-attacks.md) — including SQL injection, path traversal, XSS, and other [OWASP threats](../attacks-vulns-list.md) — applies to MCP traffic automatically, with no additional configuration required.

On top of that, Wallarm provides three dedicated **MCP mitigation controls** to address MCP-specific threats:

* [**ACL Policy**](#acl-policy) - Controls who can access specific MCP methods and primitives
* [**Request Verification**](#request-verification) - Validates that session context parameters (e.g., JWT scopes) contain expected values
* [**Tool Input Schema Enforcement**](#tool-input-schema-enforcement) - Validates MCP tool call arguments against the schema automatically learned from the server's `tools/list` response

These controls appear in Wallarm Console under **Mitigation Controls** → **AI Protection** tab.

## Requirements

* The [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) subscription plan
* [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.12.0 or higher or [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.23.0 or higher
* MCP protocol enabled in [API Discovery settings](../api-discovery/setup.md#general-api-discovery-settings)

## How MCP protection works

The Wallarm node automatically detects MCP traffic by recognizing JSON-RPC 2.0 requests with MCP-specific methods. Once MCP traffic is identified, you can create mitigation controls that define protection policies. Each control is scoped to a specific MCP server URI and can target specific MCP methods and primitives.

The node analyzes MCP responses to capture `tools/list` data and maintain an up-to-date tool schema for each server. The captured schema is uploaded to the Wallarm Cloud and distributed to all nodes in the cluster, so every node has access to up-to-date tool definitions — this is used by the [Tool Input Schema Enforcement](#tool-input-schema-enforcement) control.

When creating a mitigation control, the **MCP server** URI and **primitives** fields offer autocomplete suggestions based on data from [API Discovery](../agentic-ai/agentic-ai-discovery.md#mcp-server-discovery).

Optionally, you can configure [MCP session context parameters](../api-sessions/mcp-sessions.md#mcp-session-configuration) to extract user and role information from MCP requests. This is required for user- and role-based [ACL policies](#acl-policy).

## Creating MCP mitigation controls

To create an MCP mitigation control:

1. Go to Wallarm Console → **Mitigation Controls**.
1. Switch to the **AI Protection** tab.
1. Click **Add control**.
1. Select the desired control type: **ACL policy**, **Request verification**, or **Tool input schema enforcement**.
1. Configure the control as described below.
1. Click **Add**.

!!! info "Generic information on mitigation controls"
    Before proceeding: use the [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) article to get familiar with how **Scope** and **Mitigation mode** are set for any mitigation control.

## Common configuration

All three MCP mitigation controls share the following configuration sections:

### Scope (MCP server)

Defines which MCP server the control applies to. Select an MCP server from the dropdown (populated from [API Discovery](mcp-discovery.md)) or enter a URI manually.

### MCP parameters

Available for ACL Policy and Request Verification controls. Define which MCP methods and primitives the control applies to:

* **Methods** — MCP protocol methods such as `tools/call`, `resources/read`, `prompts/get`, `notifications/initialized`, etc. Supports wildcards (e.g., `resources/*`).
* **Primitives** — Names of specific MCP entities targeted by the selected methods. For `tools/call`, these are tool names (e.g., `get_user_profile`). For `resources/read`, these are resource URIs (e.g., `data://config`). For `prompts/get`, these are prompt names.

If no methods or primitives are specified, the control applies to all methods and primitives on the MCP server.

## ACL Policy

The ACL Policy controls who can access specific MCP methods and primitives based on the identity or network properties of the request source.

**Use case:** Restrict access to sensitive MCP tools to specific users, roles, IP addresses, or geographic locations. For example, allow only users with the `admin` role to call the `delete_account` tool, or block access to all MCP tools from specific countries.

### Configuration

| Parameter | Description |
|---|---|
| **MCP server** | Full URI of the MCP server to protect. |
| **MCP methods** | Array of MCP methods the policy applies to. Supports wildcards. |
| **Primitives** | Array of tool names, resource URIs, or prompt names the policy applies to. |
| **Access policy mode** | **Allow** — only requests matching the specified access objects are permitted; all other requests are blocked with a `403` response. Use this to create an allowlist of trusted identities or networks. **Deny** — requests matching the specified access objects are blocked with a `403` response; all other requests are permitted. Use this to block specific actors from accessing the defined scope. |
| **Access objects** | One or more conditions defining who the policy targets: **IP Address**, **Country**, **User Name**, or **User Role**. Multiple object types can be combined — all specified conditions must match for the policy to apply. |

!!! info "User and role in MCP sessions"
    To use ACL by user or role, the user and role information must be present in the MCP session context. Configure user and role extraction in [MCP Session Configuration](../api-sessions/mcp-sessions.md#mcp-session-configuration).

### Reaction

When a request matches the ACL policy conditions (Deny mode) or does not match them (Allow mode), the request is blocked with an HTTP `403 Forbidden` response. An **ACL Violation** attack is registered in Wallarm Console.

## Request Verification

The Request Verification control validates that specific session context parameters contain expected values before allowing an MCP request to proceed. This is designed primarily for enforcing JWT scope requirements in MCP environments.

**Use case:** Ensure that all `tools/call` requests to the `profile_read` tool carry a JWT token with the `profile:read` scope. This prevents the [confused deputy problem](https://en.wikipedia.org/wiki/Confused_deputy_problem) — where an AI agent calls a tool on behalf of a user who lacks the required permissions.

### Configuration

| Parameter | Description |
|---|---|
| **MCP server** | Full URI of the MCP server to protect. Supports wildcards. |
| **MCP methods** | Array of MCP methods the control applies to. Supports wildcards. |
| **Primitives** | Array of primitive IDs the control applies to. |
| **Verification parameters** | One or more rules, each defining: a **call point** (the location in the request to check, e.g., a specific JWT claim), an **operator** (`AND` — all listed values must be present, or `OR` — at least one value must be present), and an array of **expected values**. |
| **Scope verification** | Optional. Points to the `scope` claim inside the JWT token. The JWT `scope` claim is a space-separated string of permissions (e.g., `"read:profile is:developer data:read"`). Scope verification parses this string into individual values and checks them against the expected values using the selected operator. This parameter works exclusively with the JWT `scope` claim. |
| **Mode** | **Monitoring** — log attack only. **Blocking** — block the request and return a `403 Forbidden` response. |

!!! tip "JWT token location"
    The JWT token is typically located in the `Authorization` header as a Bearer token. The call point should point to the `scope` claim inside the JWT payload. Only exported [session context parameters](../api-sessions/setup.md) can be used, since only their values are available to the Wallarm node.

### Attack type

When verification fails, an **MCP Request Verification Failure** attack is registered.

## Tool Input Schema Enforcement

The Tool Input Schema Enforcement control automatically validates that MCP `tools/call` requests conform to the input schema published by the MCP server via its `tools/list` response. This is a **zero-configuration** schema enforcement — no spec upload is required.

**Use case:** Protect MCP servers from injection attacks and malformed tool calls without manually defining schemas. The schema is learned automatically from the MCP server's own tool discovery response.

### How it works

1. The Wallarm node captures `tools/list` responses from the MCP server to learn the expected schema for each tool, including parameter names, types, and required fields.
2. When a `tools/call` request arrives, the node validates:
    * Whether the called tool exists in the schema.
    * Whether the request arguments match the expected types.
    * Whether any unknown parameters are present.
3. If validation fails, the configured action (monitor or block) is applied.

The schema is maintained per MCP server — schemas of different MCP servers do not interfere with each other.

### Configuration

| Parameter | Description |
|---|---|
| **MCP server** | Full URI of the MCP server to protect. |
| **Tools** | Select which tools to enforce the schema for. If set to **All**, all tools reported by `tools/list` are validated. You can also select specific tools. |
| **Allow tools undefined in the schema** | When enabled (default), tool calls to tools not listed in the `tools/list` response are allowed. When disabled, calls to unknown tools are treated as violations. |
| **Mode** | **Monitoring** — log attack only. **Blocking** — block the request and return a `403 Forbidden` response. |

### Attack type

When a violation is detected, an **Invalid Tool Call** attack is registered. This includes:

* Calls to tools not present in the `tools/list` response (if "Allow tools undefined in the schema" is disabled)
* Arguments with types that do not match the schema
* Unknown arguments not defined in the tool's input schema

## Viewing detected attacks

Attacks detected by MCP mitigation controls are displayed in Wallarm Console → **API Sessions** → **MCP Sessions** tab. Each session shows the MCP server, requested primitives, and individual requests with their MCP method and primitive name.

In the request details, the attack type and back-link to the mitigation control that triggered detection are displayed.
