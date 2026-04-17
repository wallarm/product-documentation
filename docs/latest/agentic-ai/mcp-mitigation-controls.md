# MCP Mitigation Controls <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) is an open standard for connecting AI agents to external data sources and tools. MCP servers expose **tools** (invocable functions), **resources** (data/files), and **prompts** (parametrized templates) through a stateful, session-based HTTP protocol.

While MCP enables powerful AI agent integrations, it also introduces new attack surfaces: unauthorized tool access, confused deputy attacks, and schema manipulation. Wallarm provides three dedicated **MCP mitigation controls** to protect MCP servers:

* [**ACL Policy**](#acl-policy) - Controls who can access specific MCP methods and primitives
* [**Request Verification**](#request-verification) - Validates that session context parameters (e.g., JWT scopes) contain expected values
* [**Tool Input Schema Enforcement**](#tool-input-schema-enforcement) - Validates MCP tool call arguments against the schema automatically learned from the server's `tools/list` response

These controls appear in Wallarm Console under **Mitigation Controls** → **AI Protection** tab.

## Requirements

* The [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) subscription plan
* [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.12.0 or higher or [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.23.0 or higher
* MCP protocol enabled in [API Discovery settings](../api-discovery/setup.md#general-api-discovery-settings)

## How MCP protection works

The Wallarm node automatically detects MCP traffic by recognizing JSON-RPC 2.0 requests with MCP-specific methods and the `MCP-Protocol-Version` header. Once MCP traffic is identified, you can create mitigation controls that define protection policies. Each control is scoped to a specific MCP server URI and can target specific MCP methods and primitives.

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

Defines which MCP server the control applies to. The scope is set as a full URI of the MCP server endpoint (e.g., `https://api.example.com/mcp`).

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
| **Access policy mode** | **Allow** — only the specified access objects can access the defined scope. **Deny** — the specified access objects are blocked from accessing the defined scope. |
| **Access objects** | One or more conditions defining who the policy targets: IP Address, Country, Location, User Name, or User Role. Multiple object types can be combined. |

!!! info "User and role in MCP sessions"
    To use ACL by user or role, the user and role information must be present in the MCP session context. The Wallarm node associates users with MCP sessions based on session context parameters.

### Attack type

When the ACL Policy blocks a request, an **ACL Violation** attack is registered.

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
| **Scope verification** | Optional. Allows marking a call point as a "scope" field — space-separated values in the field are treated as an array for matching purposes. For example, `read:profile is:developer data:read` is treated as `["read:profile", "is:developer", "data:read"]`. |
| **Mode** | **Monitoring** — log attack only. **Blocking** — block the request. |

!!! tip "Verification parameters"
    Only exported session context parameters can be used for verification, since only their values are available to the Wallarm node. You can configure session context parameters in [API Sessions settings](../api-sessions/setup.md).

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

The schema is maintained per MCP server — schemas of different MCP servers do not interfere with each other. When a schema change is detected (new tools added or removed), the control automatically switches to **Monitoring** mode for 15 minutes to avoid false positives during the transition.

### Configuration

| Parameter | Description |
|---|---|
| **MCP server** | Full URI of the MCP server. Must match an MCP server with an existing [MCP Session Configuration](#mcp-session-configuration). |
| **Tools** | Select which tools to enforce the schema for. If set to **All**, all tools reported by `tools/list` are validated. You can also select specific tools. |
| **Allow tools undefined in the schema** | When enabled (default), tool calls to tools not listed in the `tools/list` response are allowed. When disabled, calls to unknown tools are treated as violations. |
| **Mode** | **Monitoring** — log attack only. **Blocking** — block the request. |

### Attack type

When a violation is detected, an **Invalid Tool Call** attack is registered. This includes:

* Calls to tools not present in the `tools/list` response (if "Allow tools undefined in the schema" is disabled)
* Arguments with types that do not match the schema
* Unknown arguments not defined in the tool's input schema

## Viewing detected attacks

Attacks detected by MCP mitigation controls are displayed in Wallarm Console → **API Sessions** → **MCP Sessions** tab. Each session shows the MCP server, requested primitives, and individual requests with their MCP method and primitive name.

In the request details, the attack type and back-link to the mitigation control that triggered detection are displayed.

## AI Protection tab

MCP mitigation controls are displayed in a dedicated **AI Protection** tab within the Mitigation Controls section. The tab provides an MCP-oriented view with the following columns:

| Column | Description |
|---|---|
| **Title** | Name of the mitigation control. |
| **MCP Server** | The MCP server URI the control is applied to. |
| **Created by** | Who created the control. |
| **Updated** | When the control was last modified. |
| **Methods** | MCP methods the control targets (e.g., `tools/call`). |
| **Primitives** | MCP primitive names the control targets. |
| **Triggered** | Number of times the control was triggered in the last 7 days. Not applicable for ACL policies. |
| **Mode** | Current mode (Monitoring/Blocking for verification and schema enforcement; Allow/Deny for ACL). |
| **On/Off** | Toggle to enable or disable the control. |
