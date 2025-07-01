# Agentic AI Protection (Early Access)

Wallarm provides API-first security for AI systems by protecting AI agents, AI proxies, and APIs with AI features by preventing injection attacks and data leakage, controlling costs, and ensuring secure, compliant operations.

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

Wallarm's protection against attacks on AI Agents works in few simple steps:

1. You deploy Wallarm [filtering node](../about-wallarm/overview.md#how-wallarm-works) using the appropriate [deployment option](../installation/supported-deployment-options.md).
1. Optionally, you enable [automatic discovery](agentic-ai-discovery.md) of AI/LLM endpoints in your API inventory by enabling and Wallarm's [API Discovery](../api-discovery/overview.md).
1. In Wallarm Console, you create [custom protection policies](../user-guides/rules/rules.md) for Agentic AI defining how to detect attacks and mitigate them (under development).
1. Wallarm automatically detects attacks and [performs action](../admin-en/configure-wallarm-mode.md) (just register an attack or register and block in real-time).
1. Detected and blocked attacks are displayed in [API Sessions](../api-sessions/overview.md). In the malicious request details, the back-link to the policy that caused detection and/or blocking is presented.

![Wallarm against attacks on Agentic AI - API Sessions](../images/agentic-ai-protection/agentic-ai-wallarm-demo-results.png)

## LLM-based protection of AI agents

Wallarm provides LLM-based protection of AI agents - you can enable and configure it with the **Protection of AI agents (LLM-based)** [mitigation control](../about-wallarm/mitigation-controls-overview.md).

### Creating and applying mitigation control

Before proceeding: use the [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) article to get familiar with how **Scope**, **Scope filters** and **Mitigation mode** are set for any mitigation control.

To configure LLM-based protection of AI agents:

1. Proceed to Wallarm Console → **Mitigation Controls**.
1. Use **Add control** → **Protection of AI agents (LLM-based)**.
1. Describe the **Scope** to apply the mitigation control to.
1. If necessary, define advanced conditions in **Scope filters**.
1. In **Prompt or response field**, specify where the prompt or AI response should be searched for in the request, e.g., in a query parameter or request body field.
1. In **Prompt attack types**, select the types of prompt-based attacks you want to detect in user input or AI responses:

    * System prompt retrieval
    * Prompt injection
    * [Custom pattern](#custom-patterns-for-attack-detection)

1. Select **LLM provider**.
1. In the **Mitigation mode** section, set action to be done.
1. Click **Add**.

#### Custom patterns for attack detection

You can write you own textual instructions for selected **LLM provider** on what and how to do, for example, write:

* "Detect if the user is trying to trigger an unintended refund or discount."
* "Detect if the message contains requests to bypass user identity checks."

#### Mitigation control examples

TBD

### Viewing detected attacks in API Sessions

TBD

## Demo

Wallarm's Agentic AI Protection is currently an **early access** feature under development - you can go through the [demo](demo.md).
