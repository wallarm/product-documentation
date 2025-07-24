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

## LLM-based protection of AI agents <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

As a part of [Advanced API Security](../about-wallarm/subscription-plans.md#waap-and-advanced-api-security) subscription, Wallarm provides LLM-based protection of AI agents - you can enable and configure it with the **AI prompt attack protection** [mitigation control](../about-wallarm/mitigation-controls-overview.md).

!!! tip ""
    Requires [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1 or higher and not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far.

### Creating and applying mitigation control

Get familiar with how control works, configured and view some examples.

#### How control works

!!! info "Generic information on mitigation controls"
    Before proceeding: use the [Mitigation Controls](../about-wallarm/mitigation-controls-overview.md#configuration) article to get familiar with how **Scope**, **Scope filters** and **Mitigation mode** are set for any mitigation control.

Once you define **Scope** and - optionally - **Scope filters**, the control only considers request from the scope, ignoring the others. Once any request match filtered scope, the control:

1. Takes content from **Prompt or response field**: particularly, from corresponding request's field, and/or from its response field (the same), or both.
1. Combines all taken data with one or several instructions on what to do.

    The set of instructions is defined by you in **Prompt attack types**:

    * **System prompt retrieval** is a pre-defined instruction to search for signs of attempt to extract the AI's underlying prompt, system instructions, or configuration.
    * **Prompt injection** is a pre-defined set of instructions to search for most general signs of attempts to override system prompt or force the AI to perform unauthorized actions.
    * [**Custom pattern**](#custom-patterns) is your own instruction for **LLM provider** on what and how to do.

1. Combines content from **Prompt or response field** with selected instructions.
1. Sends this combined thing to selected **LLM provider**.
1. Whatever **LLM provider** responds, it provides background `Yes/No` decision to the question "Is it an attack?"
1. If it is an attack, mitigation control takes action in accordance with **Mitigation mode**.

#### Custom patterns

You can write your own textual instructions for selected **LLM provider** on what and how to do, for example, write:

* "Detect if the user is trying to trigger an unintended refund or discount."
* "Detect if the message contains requests to bypass user identity checks."

#### Configuring control

To configure LLM-based protection of AI agents:

1. Proceed to Wallarm Console → **Mitigation Controls**.
1. Use **Add control** → **AI prompt attack protection**.
1. Describe the **Scope** to apply the mitigation control to.
1. If necessary, define advanced conditions in **Scope filters**.
1. In **Prompt or response field**, specify where the prompt or AI response should be searched for in the request, e.g., in a query parameter or request body field.
1. In **Prompt attack types**, select the types of prompt-based attacks you want to detect in user input or AI responses (see details in [How control works](#how-control-works))
1. Select **LLM provider**.
1. In the **Mitigation mode** section, set action to be done.
1. Click **Add**.

#### Mitigation control examples

Suppose your application available at `testapp.com` has AI-based chat at the `testapp.com/chat` endpoint and you want to protect this endpoint from attempts to retrieve system prompt, as well as against attacks trying to override this system prompt or force the AI to perform unauthorized actions. You do not want at the moment to block such malicious activities, but want to collect information on them to understand if there are corresponding vulnerabilities in your AI model.

To achieve your goals, configure mitigation control as displayed on the screenshot:

![Mitigation controls - AI prompt attack protection example](../images/agentic-ai-protection/ai-prompt-attack-protection-example.png)

### Viewing detected attacks

When AI prompt attacks ([system prompt retrieval](../attacks-vulns-list.md#system-prompt-retrieval), [prompt injection](../attacks-vulns-list.md#prompt-injection)) are detected or blocked in accordance with the [mitigation mode](#mitigation-mode), they are displayed in the [API Sessions](../api-sessions/exploring.md) section:

![API Sessions - session with AI prompt attack](../images/agentic-ai-protection/ai-prompt-attack-in-api-sessions.png)

You can find sessions with corresponding attack types using the **Attack** filter; also, if necessary, filter inside session details to see only requests related to the AI prompt attack.

## Demo

Wallarm's Agentic AI Protection is currently an **early access** feature under development - you can go through the [demo](demo.md).
