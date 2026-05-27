# AI Security Overview

As AI agents and large language models (LLMs) become integrated into enterprise applications, they introduce new attack surfaces that traditional security tools don't address. Wallarm provides comprehensive security for AI-powered systems, protecting AI agents, AI proxies, and APIs with AI features from emerging threats.

## The AI Security Challenge

AI systems face unique security risks:

* **Prompt injection attacks** - Malicious inputs that manipulate AI behavior, bypass content filters, or extract sensitive information
* **Jailbreaks** - Techniques to retrieve hidden system prompts or invoke restricted APIs
* **Agent abuse** - Automated attacks including credential stuffing, account takeover, and usage abuse leading to unexpected costs
* **Shadow AI** - Unmonitored AI agents deployed without proper security hardening

Traditional API security solutions lack the specialized detection capabilities needed to identify these AI-specific threats.

## Wallarm's AI Security Capabilities

Wallarm addresses AI security through two complementary capabilities:

### Discover AI Endpoints and MCP Servers

[AI Discovery](agentic-ai-discovery.md) automatically identifies APIs related to AI/LLM systems and MCP servers in your environment:

* Automatic tagging of AI/LLM endpoints in your [API inventory](../api-discovery/overview.md)
* [MCP server discovery](mcp-discovery.md) — automatic detection of MCP servers and their primitives (tools, resources, prompts)
* [MCP Sessions](../api-sessions/mcp-sessions.md) — dedicated view of AI agent interactions with MCP servers
* Visibility into which [API sessions](../api-sessions/overview.md) interact with AI endpoints
* Manual tagging for endpoints not automatically detected
* Filtering capabilities to focus on AI-related traffic

### Protect AI Systems

[AI Protection](agentic-ai-protection.md) (Early Access) defends your AI agents and LLM-powered APIs:

* Detection and blocking of prompt injection attacks
* Protection against jailbreak attempts
* Prevention of data leakage through AI systems
* Cost control by blocking abuse and unauthorized usage
* Custom protection policies for AI-specific threats
* [MCP mitigation controls](mcp-mitigation-controls.md) — ACL policies, request verification, and tool input schema enforcement for MCP servers

## How It Works

1. **Deploy** - Install Wallarm filtering node using your preferred [deployment option](../installation/supported-deployment-options.md)
2. **Discover** - Enable [API Discovery](../api-discovery/overview.md) to automatically identify AI/LLM endpoints and [MCP servers](mcp-discovery.md)
3. **Configure** - Create [AI payload inspection](ai-payload-inspection.md) and [MCP mitigation controls](mcp-mitigation-controls.md) for your AI systems
4. **Monitor** - View detected attacks in [API Sessions](../api-sessions/overview.md) and [MCP Sessions](../api-sessions/mcp-sessions.md)

## Getting Started

* Explore [AI Discovery](agentic-ai-discovery.md) to identify AI endpoints and MCP servers in your API inventory
* Learn about [AI Protection](agentic-ai-protection.md) capabilities and threat detection
* Set up [MCP Sessions](../api-sessions/mcp-sessions.md) to monitor AI agent interactions with MCP servers
* Configure [MCP Mitigation Controls](mcp-mitigation-controls.md) to protect MCP servers with access policies, request verification, and schema enforcement
