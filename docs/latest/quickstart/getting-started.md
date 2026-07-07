# Getting Started with Wallarm

[Wallarm AI Control Platform](../about-wallarm/overview.md) is an AI and API security platform with four products, each with its own onboarding path:

* **[Wallarm API Security](#wallarm-api-security)** — start self-service: explore the Playground and sign up for the Security Edge Free Tier (500K requests/month).
* **[Wallarm Infrastructure Discovery](#wallarm-infrastructure-discovery)** (AWS-only) — subscribe through AWS Marketplace.
* **[Wallarm AI Hypervisor](#wallarm-ai-hypervisor)** (AWS-only) — separate onboarding flow through Sales.
* **Wallarm API Security Testing** — enabled by default for every Wallarm account; covered in the [Wallarm API Security](#wallarm-api-security) section below.

Need help choosing or want a personalized walkthrough? [Talk to Sales](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.)

## Wallarm API Security

Wallarm API Security delivers discovery and protection for your APIs: internal services, partner-facing endpoints, third-party integrations, and the APIs consumed by AI workloads. It blocks the OWASP API Top 10, automated abuse, account takeover, AI-targeted attacks, and attacks against Model Context Protocol (MCP) servers across REST, GraphQL, gRPC, SOAP, and WebSocket — and continuously discovers, inventories, and risk-scores every endpoint in your environment.

You can start in one of the following ways:

* [Playground](#playground) — explore Wallarm Console with realistic data; no signup required.
* [Security Edge Free Tier](#security-edge-free-tier) — create a free account, get 500K requests per month for free, with Wallarm API Security Testing enabled by default and optional AASM Freemium.

### Playground

The [Wallarm Playground](https://tour.playground.wallarm.com/?utm_source=wallarm_docs_quickstart) gives you a read-only view of Wallarm Console filled with realistic production-like data — discovered API inventory, attacks blocked, vulnerabilities detected, dashboards, integrations — so you can see how the product works without deploying anything or creating an account.

![Playground](../images/playground.png)

To try Wallarm on your own traffic, [create a Security Edge Free Tier account](#security-edge-free-tier).

### Security Edge Free Tier

Every new account created in the Wallarm Console is automatically enrolled in the [Security Edge Free Tier](../about-wallarm/subscription-plans.md#security-edge-free-tier), which gives you **500 thousand requests per month** for free. The tier includes:

* **Wallarm API Security** core capabilities — API protection, attack detection, custom rules, integrations.
* **[Wallarm API Security Testing](../vulnerability-detection/security-testing-overview.md)** — proactively finds vulnerabilities in your applications and APIs before attackers do. Enabled by default. Includes optional **[AASM Freemium](../api-attack-surface/overview.md)** for agentless discovery of your external hosts and APIs.
* **[Wallarm Infrastructure Discovery](../infrastructure-discovery/overview.md)** (AWS-only) — cross-account AWS asset and shadow AI discovery, with findings from native AWS security services on a single relationship graph. Procured separately through AWS Marketplace.

When you sign up, Wallarm automatically provisions an account and launches a built-in **Welcome Wizard** that lets you experience how Wallarm protects APIs using demo traffic.

#### Self-signup

To register with Wallarm yourself:

1. Choose your [Wallarm Cloud](../about-wallarm/api-security-overview.md#cloud):

    | | US Cloud | EU Cloud |
    | -- | --- | --- |
    | **Signup link** | https://us1.my.wallarm.com/signup | https://my.wallarm.com/signup |
    | **Physical location** | USA | Netherlands |
    | **Wallarm Console URL** | https://us1.my.wallarm.com/ | https://my.wallarm.com/ |
    | **Wallarm API Endpoint** | https://us1.api.wallarm.com/ | https://api.wallarm.com/ |

1. Follow the signup link and input the requested data about yourself and your company.
1. Choose whether to enable **AASM Freemium** (external API discovery) at this step. AASM activates immediately and scans your company domain. If you skip this, you can add a domain later from the [API Attack Surface](../api-attack-surface/overview.md) section of Wallarm Console.

#### Welcome wizard

After registration, the **Welcome to Wallarm** wizard launches automatically. It is equipped with a ready-to-use demo Wallarm Node that lets you observe how Wallarm protects APIs in just 5 minutes.

![Self-signup - Welcome Wizard](../images/waf-installation/quickstart/welcome-wizard.png)

In the wizard, you can:

1. Choose the destination for demo traffic — the Wallarm demo API or your own API.
1. Send sample legitimate traffic through the Demo Node to observe how it appears in [API Sessions](../api-sessions/overview.md).
1. Simulate attacks and see them detected in real time.
1. Switch to [blocking mode](../admin-en/configure-wallarm-mode.md) to watch malicious requests being blocked.

Once the Welcome Wizard is completed, continue with one of:

* **Switch DNS to Security Edge inline** for free traffic analysis within the Security Edge Free Tier. This launches the [Security Edge quick setup wizard](../installation/security-edge/free-tier.md#quick-setup-wizard).
* **Configure a Security Edge connector** for free traffic analysis within the Security Edge Free Tier.
* **[Deploy a hybrid node locally](../installation/supported-deployment-options.md)** for full control over your traffic and data.
* **Set up [Wallarm Infrastructure Discovery](../infrastructure-discovery/overview.md)** (AWS-only) to start cross-account AWS asset and shadow AI discovery. No node deployment required — you can configure this directly from Wallarm Console without going through the Welcome Wizard.

!!! info "Demo Node"
    The Demo Node does not process real traffic and is not shown in your Wallarm Console. It is managed by Wallarm and provided only for demo testing.

## Wallarm Infrastructure Discovery

Wallarm Infrastructure Discovery is available on **AWS only**. It maps every AWS workload across all your accounts via cross-account IAM role assumption, surfaces shadow AI within minutes of deployment, and makes findings from native AWS security services (Security Hub, GuardDuty, Inspector, Macie, IAM Access Analyzer) actionable on a single relationship graph.

How to get access:

* **New Wallarm customers** — subscribe to Infrastructure Discovery on the [AWS Marketplace listing](https://aws.amazon.com/marketplace/pp/prodview-kvqg6s3jjelv6) (free tier and paid plans are described there). After subscribing, click **Set up your account** on the listing to register with Wallarm, fill in the sign-up form, and watch your inbox — Wallarm sends a confirmation email with Console credentials and next steps.
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
