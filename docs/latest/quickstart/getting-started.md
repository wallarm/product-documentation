# Getting Started with Wallarm

[Wallarm AI Control Platform](../about-wallarm/overview.md) is an AI and API security platform with four products, each with its own onboarding path:

* **[Wallarm API Security](#wallarm-api-security)** — start self-service: explore the Playground and sign up for a Wallarm account.
* **[Wallarm Infrastructure Discovery](#wallarm-infrastructure-discovery)** (AWS-only) — subscribe through AWS Marketplace.
* **[Wallarm AI Hypervisor](#wallarm-ai-hypervisor)** (AWS-only) — separate onboarding flow through Sales.
* **[Wallarm API Security Testing](../about-wallarm/detecting-vulnerabilities.md)** — no separate onboarding: it is included with every Wallarm account. Passive vulnerability detection runs by default, and you can enable AASM during [signup](#wallarm-account).

Need help choosing or want a personalized walkthrough? [Talk to Sales](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.)

## Wallarm API Security

Wallarm API Security delivers discovery and protection for your APIs: internal services, partner-facing endpoints, third-party integrations, and the APIs consumed by AI workloads. It blocks the OWASP API Top 10, automated abuse, account takeover, AI-targeted attacks, and attacks against Model Context Protocol (MCP) servers across REST, GraphQL, gRPC, SOAP, and WebSocket — and continuously discovers, inventories, and risk-scores every endpoint in your environment.

You can start in one of the following ways:

* [Playground](#playground) — explore Wallarm Console with realistic data; no signup required.
* [Wallarm account](#wallarm-account) — register with Wallarm and start protecting your own traffic, with Wallarm API Security Testing (passive detection enabled by default, plus optional AASM).

### Playground

The [Wallarm Playground](https://playground.wallarm.com/?utm_source=wallarm_docs_quickstart) gives you a read-only view of Wallarm Console filled with realistic production-like data — discovered API inventory, attacks blocked, vulnerabilities detected, dashboards, integrations — so you can see how the product works without deploying anything or creating an account.

![Playground](../images/playground.png)

To try Wallarm on your own traffic, [create a Wallarm account](#wallarm-account).

### Wallarm account

Every new account created in the Wallarm Console includes:

* **Wallarm API Security** core capabilities — API protection, attack detection, custom rules, integrations.
* **[Wallarm API Security Testing](../about-wallarm/detecting-vulnerabilities.md)** — proactively finds vulnerabilities in your applications and APIs through passive detection (enabled by default) and optional **[AASM](../api-attack-surface/overview.md)** for agentless discovery of your external hosts and APIs.
* **[Wallarm Infrastructure Discovery](../infrastructure-discovery/overview.md)** (AWS-only) — cross-account AWS asset and shadow AI discovery, with findings from native AWS security services on a single relationship graph. Procured separately through AWS Marketplace.

## Wallarm Infrastructure Discovery

Wallarm Infrastructure Discovery is available on **AWS only**. It maps every AWS workload across all your accounts via cross-account IAM role assumption, surfaces shadow AI within minutes of deployment, and makes findings from native AWS security services (Security Hub, GuardDuty, Inspector, Macie, IAM Access Analyzer) actionable on a single relationship graph.

How to get access:

* **New Wallarm customers** — subscribe to Infrastructure Discovery on the [AWS Marketplace listing](https://aws.amazon.com/marketplace/pp/prodview-kvqg6s3jjelv6) (all available plans are described there). After subscribing, click **Set up your account** on the listing to register with Wallarm, fill in the sign-up form, and watch your inbox — Wallarm sends a confirmation email with Console credentials and next steps.
* **Existing Wallarm customers** — if you already have an active Wallarm subscription, contact [Wallarm Sales](mailto:sales@wallarm.com) to add Infrastructure Discovery to your account.

See the [Infrastructure Discovery overview and setup flow](../infrastructure-discovery/overview.md) for the full sign-up details.

## Wallarm AI Hypervisor

Wallarm AI Hypervisor is available on **AWS only** and deploys on Amazon EKS. It is the runtime governance layer for every LLM call, agent action, and MCP tool invocation running in your Kubernetes cluster on AWS.

AI Hypervisor follows a separate onboarding flow with the Wallarm team. To get access, contact [Wallarm Sales](mailto:sales@wallarm.com).

See the [AI Hypervisor overview](../ai-hypervisor/overview.md) for what the product covers.

## Talk to Sales

For any of the following, the Wallarm team is here to help:

* Guided onboarding or a personalized walkthrough — for any Wallarm product
* Access to Wallarm AI Hypervisor
* Adding Wallarm Infrastructure Discovery to an existing Wallarm subscription, or adjusting plan limits
* Custom deployment requirements, pricing, or enterprise-scale planning
* Choosing the right product mix for your environment

Send a [request for a guided Wallarm trial](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.).
