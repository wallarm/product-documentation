# Agentic AI Protection

[Wallarm API Security](../about-wallarm/api-security-overview.md) — the API protection product of [Wallarm AI Control Platform](../about-wallarm/overview.md) — delivers API-first security for AI systems. It protects AI agents, AI proxies, and APIs with AI features by preventing injection attacks and data leakage, controlling costs, and ensuring secure, compliant operations.

AI systems face risks that traditional API security tools were not designed for: **prompt injection** and **jailbreaks** that manipulate model behavior, **agent abuse** that drives credential stuffing and cost overruns, and **shadow AI** agents deployed without security oversight. Wallarm API Security addresses these threats at the application layer; for runtime governance of AI workloads themselves (AWS-only), see [Wallarm AI Hypervisor](../ai-hypervisor/overview.md).

![Agentic AI in work - schema](../images/agentic-ai-protection/agentic-ai-schema.png)

## Common attacks on AI Agents

Common attacks on AI Agents include:

* Jailbreaks:

    * Retrieval of hidden system prompts and instructions for exploitation.
    * Injection of encrypted prompt commands to bypass content filters.
    * Invocation of restricted APIs by an agent for unauthorized operations.

* Attacks on Agent APIs:

    * Attacks and exploits tools used by agents using common API attacks.
    * Sensitive data leaks through internal APIs.
    * Weak authentication and misconfiguration exploitation.

* Bots and Agent Abuse:

    * Automated bot attacks including low-and-slow attacks and DDoS.
    * Usage abuse and credits overages, including license abuse.
    * Automated account takeover attacks.
    * Mass prompt injection.

* Rogues and shadow AI Agents:

    * Agents deployed by shadow IT lack proper security hardening, leaving backdoors for attackers.
    * Cross-tenant data leaks by unauthorized agents in shared environments.
    * Exploitation of unprotected shadow agents risks credit theft and massive infra bills.

See detailed description of Wallarm's Agentic AI Protection of the official site [here](https://www.wallarm.com/solutions/s-protect-agentic-ai).

## How protection works

Wallarm's protection against attacks on AI Agents works in a few simple steps:

1. You deploy Wallarm [filtering node](../about-wallarm/api-security-overview.md#how-wallarm-api-security-works) using the [appropriate deployment option](../installation/supported-deployment-options.md).
1. Optionally, you enable [automatic discovery](agentic-ai-discovery.md) of AI/LLM endpoints in your API inventory by enabling and Wallarm's [API Discovery](../api-discovery/overview.md).
1. In Wallarm Console, you create one or several [AI payload inspection](../agentic-ai/ai-payload-inspection.md) mitigation controls defining how to detect [AI-agent attacks](../attacks-vulns-list.md#attack-types) and mitigate them.
1. For MCP servers, you configure [MCP mitigation controls](mcp-mitigation-controls.md) to enforce access policies, validate request parameters, and ensure tool calls conform to the published schema.
1. Wallarm automatically detects attacks and [performs action](../agentic-ai/ai-payload-inspection.md#mitigation-mode) (just register an attack or perform blocking by IP or session).
1. Detected and blocked attacks are displayed in [API Sessions](../api-sessions/overview.md). In the malicious request details, the back-link to the policy that caused detection and/or blocking is presented.

![API Sessions - session with detected malicious AI payload](../images/agentic-ai/api-sessions-system-prompt-retrieval.png)

## OWASP Top 10 coverage

The controls described above map to two OWASP frameworks that address risks in AI agent and MCP deployments:

* [**OWASP Top 10 for Agentic Applications (2026)**](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) — the ten most critical risks for autonomous AI systems that plan, decide, and act across tools and steps.
* [**OWASP MCP Top 10 (2025)**](https://owasp.org/www-project-mcp-top-10/) — the first OWASP framework dedicated to the [Model Context Protocol](https://modelcontextprotocol.io/), covering risks specific to MCP servers, tools, and context handling.

The tables below describe how Wallarm helps address each risk. Full coverage of any framework relies on defense in depth: several items also depend on organizational and development-side practices — secret rotation, dependency vetting, agent and memory design — that a runtime security platform addresses in combination with those practices, not alone.

### OWASP Top 10 for Agentic Applications (2026)

| OWASP risk | How Wallarm helps | Primary controls |
|---|---|---|
| **ASI01 — Agent Goal Hijacking** | Detects direct and indirect prompt injection, jailbreaks, and system prompt retrieval in agent inputs and responses before they alter the agent's goal. | [AI payload inspection](ai-payload-inspection.md) |
| **ASI02 — Tool Misuse and Exploitation** | Restricts which tools a caller may invoke and with what arguments, blocks calls with unknown or wrong-typed arguments, and flags attempts to drive tools toward unauthorized actions (payment bypass, identity bypass). | [MCP mitigation controls](mcp-mitigation-controls.md) (ACL policy, tool input schema enforcement), [AI payload inspection](ai-payload-inspection.md) |
| **ASI03 — Identity and Privilege Abuse** | Enforces access by user, role, IP, and country at the MCP layer; verifies JWT scope on sensitive tool calls; detects broken object-level authorization (BOLA) and authentication attacks on agent APIs. | [MCP mitigation controls](mcp-mitigation-controls.md) (ACL policy, request verification), [Core API protection](../about-wallarm/protecting-against-attacks.md) |
| **ASI04 — Agentic Supply Chain Vulnerabilities** | Protects the APIs and MCP servers agents depend on from exploitation; AI Hypervisor inventories model providers and dependencies, builds an AI-SBOM with CVE enrichment, and surfaces unsanctioned components. | [Core API protection](../about-wallarm/protecting-against-attacks.md), [AI Hypervisor](../ai-hypervisor/supply-chain.md) |
| **ASI05 — Unexpected Code Execution (RCE)** | Automatically detects RCE, command injection, and template injection in payloads, including JSON-RPC; schema enforcement blocks malformed tool arguments that carry injected code. | [Core API protection](../about-wallarm/protecting-against-attacks.md), [MCP mitigation controls](mcp-mitigation-controls.md) (tool input schema enforcement) |
| **ASI06 — Memory & Context Poisoning** | Detects malicious or manipulative content in inputs and responses at the API layer before it can persist into agent memory or context. | [AI payload inspection](ai-payload-inspection.md) |
| **ASI07 — Insecure Inter-Agent Communication** | Secures the APIs and MCP channels agents use to communicate (authentication-attack detection, ACL, schema enforcement); AI Hypervisor observes and attributes agent-to-agent calls across service hops. | [MCP mitigation controls](mcp-mitigation-controls.md), [Core API protection](../about-wallarm/protecting-against-attacks.md), [AI Hypervisor](../ai-hypervisor/overview.md) |
| **ASI08 — Cascading Failures** | Rate limiting, DoS protection, and bot and agent-abuse controls bound runaway loops and request floods; AI Hypervisor enforcement can terminate misbehaving sessions at the kernel level. | [Rate limiting](../user-guides/rules/rate-limiting.md), [DoS protection](../api-protection/dos-protection.md), [AI Hypervisor](../ai-hypervisor/enforcement.md) |
| **ASI09 — Human-Agent Trust Exploitation** | Custom AI payload inspection detects social-engineering and manipulation attempts in prompts (for example, coercing an agent or operator into bypassing policy) and content misuse. | [AI payload inspection](ai-payload-inspection.md) |
| **ASI10 — Rogue Agents** | API Discovery and agentic AI discovery surface unknown and shadow agents; AI Hypervisor detects shadow AI, monitors behavior, and enforces against drifting agents; bot and agent-abuse controls limit automated abuse. | [API Discovery](../api-discovery/overview.md), [AI Hypervisor](../ai-hypervisor/shadow-ai.md) |

### OWASP MCP Top 10 (2025)

| OWASP risk | How Wallarm helps | Primary controls |
|---|---|---|
| **MCP01 — Token Mismanagement & Secret Exposure** | Custom AI payload inspection detects leaked credentials, tokens, and private keys in prompts, tool arguments, and responses (high-entropy and keyword analysis); API Discovery flags sensitive-data exposure. Secret storage and rotation remain a deployment responsibility. | [AI payload inspection](ai-payload-inspection.md), [API Discovery](../api-discovery/overview.md) |
| **MCP02 — Privilege Escalation via Scope Creep** | ACL policy constrains which MCP methods and primitives each user or role may call; request verification enforces the JWT scope expected for each tool. | [MCP mitigation controls](mcp-mitigation-controls.md) (ACL policy, request verification) |
| **MCP03 — Tool Poisoning** | Tool input schema enforcement validates `tools/call` arguments against the schema learned from `tools/list`, blocking unknown tools and unexpected arguments; AI payload inspection detects manipulative content in tool inputs and outputs. | [MCP mitigation controls](mcp-mitigation-controls.md) (tool input schema enforcement), [AI payload inspection](ai-payload-inspection.md) |
| **MCP04 — Software Supply Chain Attacks & Dependency Tampering** | Core API protection shields MCP server endpoints from exploitation; AI Hypervisor builds an AI-SBOM with CVE enrichment and surfaces unsanctioned dependencies and providers. | [Core API protection](../about-wallarm/protecting-against-attacks.md), [AI Hypervisor](../ai-hypervisor/supply-chain.md) |
| **MCP05 — Command Injection & Execution** | Standard attacks (SQL injection, command injection, path traversal, RCE) are detected automatically over MCP's HTTP and JSON-RPC payloads; schema enforcement rejects malformed arguments. | [Core API protection](../about-wallarm/protecting-against-attacks.md), [MCP mitigation controls](mcp-mitigation-controls.md) (tool input schema enforcement) |
| **MCP06 — Intent Flow Subversion** | Detects prompt injection, instruction override, and system prompt retrieval embedded in the context an MCP agent reads and obeys. | [AI payload inspection](ai-payload-inspection.md) |
| **MCP07 — Insufficient Authentication & Authorization** | ACL policy and request verification enforce identity, role, and scope at the MCP layer; core protection detects authentication and authorization attacks on the underlying API. | [MCP mitigation controls](mcp-mitigation-controls.md) (ACL policy, request verification), [Core API protection](../about-wallarm/protecting-against-attacks.md) |
| **MCP08 — Lack of Audit and Telemetry** | MCP Sessions records every MCP method, primitive, and request, with the triggering control linked from each detected attack; AI Hypervisor adds full session replay and per-user attribution. | [MCP Sessions](../api-sessions/mcp-sessions.md), [AI Hypervisor](../ai-hypervisor/overview.md) |
| **MCP09 — Shadow MCP Servers** | API Discovery inventories MCP servers from live traffic (MCP discovery is on by default), surfacing instances deployed outside governance; AI Hypervisor flags shadow AI assets. | [API Discovery](../api-discovery/overview.md), [AI Hypervisor](../ai-hypervisor/shadow-ai.md) |
| **MCP10 — Context Injection & Over-Sharing** | ACL policy and request verification limit cross-user and cross-tenant access to MCP primitives; custom AI payload inspection detects PII harvesting and context-exfiltration attempts; AI Hypervisor records PII data flows. | [MCP mitigation controls](mcp-mitigation-controls.md), [AI payload inspection](ai-payload-inspection.md), [AI Hypervisor](../ai-hypervisor/compliance.md) |

## Demo

[Explore the Agentic AI attack mitigation demo →](https://rsa-demo-playground.darkmatter.wallarm.tools/)

![Wallarm against attacks on Agentic AI - demo](../images/agentic-ai-protection/agentic-ai-wallarm-demo.png)

This demo demonstrates the following cases:

* Exploit BOLA through the agent
* System prompt retrieval and business logic abuse
* Identity impersonation and tool misuse

On completing any of the scenarios, Wallarm detects the attack and mitigates them in the correspondence with the mitigation mode - you obtain a link to the [**API Sessions**](../api-sessions/overview.md) section of Wallarm Playground, where you can explore the session and the attack inside it.
