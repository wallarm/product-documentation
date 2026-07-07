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

    * Attacks against the tools used by agents, carried out via common API attacks.
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

See a detailed description of Wallarm's Agentic AI Protection on the official site [here](https://www.wallarm.com/solutions/s-protect-agentic-ai).

## How protection works

Wallarm's protection against attacks on AI Agents works in a few simple steps:

1. You deploy Wallarm [filtering node](../about-wallarm/api-security-overview.md#how-wallarm-api-security-works) using the [appropriate deployment option](../installation/supported-deployment-options.md).
1. Optionally, you enable Wallarm's [API Discovery](../api-discovery/overview.md) to automatically discover AI/LLM endpoints in your API inventory.
1. In Wallarm Console, you create one or several [AI payload inspection](../agentic-ai/ai-payload-inspection.md) mitigation controls defining how to detect [AI-agent attacks](../attacks-vulns-list.md#attack-types) and mitigate them.
1. For MCP servers, you configure [MCP mitigation controls](mcp-mitigation-controls.md) to enforce access policies, validate request parameters, and ensure tool calls conform to the published schema.
1. Wallarm automatically detects attacks and [performs an action](../agentic-ai/ai-payload-inspection.md#mitigation-mode) (just register an attack or perform blocking by IP or session).
1. Detected and blocked attacks are displayed in [API Sessions](../api-sessions/overview.md). In the malicious request details, the back-link to the policy that caused detection and/or blocking is presented.

![API Sessions - session with detected malicious AI payload](../images/agentic-ai/api-sessions-system-prompt-retrieval.png)

## OWASP Top 10 coverage

The controls described above map to two OWASP frameworks that address risks in AI agent and MCP deployments:

* [**OWASP Top 10 for Agentic Applications (2026)**](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) — the ten most critical risks for autonomous AI systems that plan, decide, and act across tools and steps.
* [**OWASP MCP Top 10 (2025)**](https://owasp.org/www-project-mcp-top-10/) — the first OWASP framework dedicated to the [Model Context Protocol](https://modelcontextprotocol.io/), covering risks specific to MCP servers, tools, and context handling.

The tables below show how Wallarm addresses each risk. Some risks fall outside that layer and are marked as such in the tables. These model-side and supply-chain risks — tool poisoning, dependency tampering, and context over-sharing — depend on secure development practices that complement the controls below.

### OWASP Top 10 for Agentic Applications (2026)

| OWASP risk | How Wallarm helps |
|---|---|
| **ASI01 — Agent Goal Hijacking** | Wallarm inspects incoming requests for injection — including content hidden in nested fields — and watches session behavior for actions that drift from the agent's intended goal. Read more: [Attack detection](../about-wallarm/protecting-against-attacks.md), [Behavioral abuse detection](../api-protection/business-logic-abuse-detection.md). |
| **ASI02 — Tool Misuse and Exploitation** | Wallarm restricts which tools each caller may invoke and with what arguments, and analyzes call sequences to catch legitimate tools being used in abusive or out-of-sequence ways. Read more: [MCP protection](mcp-mitigation-controls.md), [Behavioral abuse detection](../api-protection/business-logic-abuse-detection.md). |
| **ASI03 — Identity and Privilege Abuse** | Wallarm enforces identity-, role-, and scope-based access, and detects enumeration, credential abuse, and privilege escalation that let an agent act beyond its entitlements. Read more: [Access-abuse protection](../api-protection/enumeration-attack-protection.md), [Behavioral abuse detection](../api-protection/business-logic-abuse-detection.md). |
| **ASI04 — Agentic Supply Chain Vulnerabilities** | Wallarm proactively tests the exposed APIs and MCP servers agents rely on for known vulnerabilities and misconfigurations so they can be fixed before exploitation; on AWS it also inventories AI dependencies with CVE enrichment. Read more: [Proactive vulnerability detection](../vulnerability-detection/security-testing-overview.md), [AI dependency inventory (AWS)](../ai-hypervisor/supply-chain.md). |
| **ASI05 — Unexpected Code Execution (RCE)** | Wallarm automatically detects remote-code-execution, command-injection, and template-injection attempts in traffic — including JSON-RPC — and rejects malformed arguments that try to smuggle in code. Read more: [Attack detection](../about-wallarm/protecting-against-attacks.md), [MCP protection](mcp-mitigation-controls.md). |
| **ASI06 — Memory & Context Poisoning** | Wallarm blocks injected content arriving in requests before it can reach an agent; poisoning of persistent memory or the model's context is addressed at the runtime layer (AWS) and through secure agent design. Read more: [Attack detection](../about-wallarm/protecting-against-attacks.md), [Runtime AI governance (AWS)](../ai-hypervisor/overview.md). |
| **ASI07 — Insecure Inter-Agent Communication** | Wallarm secures the APIs and MCP channels agents use to talk to each other, checking authentication, access, and message structure; on AWS it also maps and attributes agent-to-agent calls across services. Read more: [MCP protection](mcp-mitigation-controls.md), [Runtime AI governance (AWS)](../ai-hypervisor/overview.md). |
| **ASI08 — Cascading Failures** | Wallarm caps request volume and runaway loops and can cut off a misbehaving session before failures spread; on AWS, enforcement can terminate sessions at the kernel level. Read more: [Rate and resource controls](../api-protection/dos-protection.md), [Runtime enforcement (AWS)](../ai-hypervisor/enforcement.md). |
| **ASI09 — Human-Agent Trust Exploitation** | Wallarm flags attempts to skip required approval or verification steps and keeps a full session trail to investigate suspicious approvals; manipulating the human or model directly sits largely outside API-layer protection. Read more: [Behavioral abuse detection](../api-protection/business-logic-abuse-detection.md), [Session visibility](../api-sessions/overview.md). |
| **ASI10 — Rogue Agents** | Wallarm surfaces unknown and undocumented agents and limits automated abuse; on AWS, runtime governance detects shadow AI and alerts when an agent drifts from its declared behavior. Read more: [Undocumented and shadow assets](../api-discovery/rogue-api.md), [Shadow AI detection (AWS)](../ai-hypervisor/shadow-ai.md). |

### OWASP MCP Top 10 (2025)

| OWASP risk | How Wallarm helps |
|---|---|
| **MCP01 — Token Mismanagement & Secret Exposure** | Wallarm surfaces servers and endpoints that expose credentials, tokens, or sensitive data and flags missing authentication, so secrets can be locked down before they are abused. Read more: [Sensitive data detection](../api-discovery/sensitive-data.md), [Leaked secrets in your attack surface](../api-attack-surface/security-issues.md). |
| **MCP02 — Privilege Escalation via Scope Creep** | Wallarm enforces fine-grained access to MCP methods and tools and validates that each caller's token carries only the permissions it should, catching scope that quietly widens over time. Read more: [MCP protection](mcp-mitigation-controls.md), [MCP session visibility](../api-sessions/mcp-sessions.md). |
| **MCP03 — Tool Poisoning** | Tool poisoning is a supply-chain and model-side attack that manipulates the model rather than the API, so it falls outside Wallarm's API-layer protection and is addressed through development-side controls. |
| **MCP04 — Software Supply Chain Attacks & Dependency Tampering** | Wallarm proactively tests your exposed APIs and MCP servers for known vulnerabilities and misconfigurations so they can be fixed before exploitation, and on AWS inventories AI dependencies with CVE enrichment. Read more: [Proactive vulnerability detection](../vulnerability-detection/security-testing-overview.md), [AI dependency inventory (AWS)](../ai-hypervisor/supply-chain.md). |
| **MCP05 — Command Injection & Execution** | Wallarm inspects every MCP request — including JSON-RPC and nested fields — for injection and code-execution attempts and rejects calls that do not match the expected tool schema. Read more: [Attack detection](../about-wallarm/protecting-against-attacks.md), [MCP protection](mcp-mitigation-controls.md). |
| **MCP06 — Intent Flow Subversion** | Wallarm records the full sequence of MCP calls within a session, making it possible to spot flows where an agent is steered toward actions outside its task, and constrains which methods and tools each caller can reach. Read more: [MCP session visibility](../api-sessions/mcp-sessions.md), [MCP protection](mcp-mitigation-controls.md). |
| **MCP07 — Insufficient Authentication & Authorization** | Wallarm reveals where authentication is missing or weak, enforces identity-, role-, and scope-based access at the MCP layer, and detects enumeration, credential abuse, and cross-tenant access attempts. Read more: [Access-abuse protection](../api-protection/enumeration-attack-protection.md), [MCP protection](mcp-mitigation-controls.md). |
| **MCP08 — Lack of Audit and Telemetry** | Every MCP method, tool, and request is recorded with the reason it was flagged, giving full session-level forensics; on AWS, runtime governance adds replay and per-user attribution. Read more: [MCP session visibility](../api-sessions/mcp-sessions.md), [Runtime AI governance (AWS)](../ai-hypervisor/overview.md). |
| **MCP09 — Shadow MCP Servers** | Wallarm continuously inventories MCP servers from live traffic and surfaces undocumented or deprecated ones deployed outside governance; on AWS, runtime discovery also flags shadow AI assets. Read more: [Undocumented and shadow assets](../api-discovery/rogue-api.md), [Shadow AI detection (AWS)](../ai-hypervisor/shadow-ai.md). |
| **MCP10 — Context Injection & Over-Sharing** | Wallarm limits cross-user and cross-tenant access to MCP resources and flags sensitive data moving through them; over-sharing inside the model's context window sits outside API-layer protection. Read more: [Sensitive data detection](../api-discovery/sensitive-data.md), [PII flow records (AWS)](../ai-hypervisor/compliance.md). |

## Demo

[Explore the Agentic AI attack mitigation demo →](https://rsa-demo-playground.darkmatter.wallarm.tools/)

![Wallarm against attacks on Agentic AI - demo](../images/agentic-ai-protection/agentic-ai-wallarm-demo.png)

This demo shows the following cases:

* Exploit BOLA through the agent
* System prompt retrieval and business logic abuse
* Identity impersonation and tool misuse

On completing any of the scenarios, Wallarm detects the attack and mitigates it in accordance with the mitigation mode - you obtain a link to the [**API Sessions**](../api-sessions/overview.md) section of Wallarm Playground, where you can explore the session and the attack inside it.
