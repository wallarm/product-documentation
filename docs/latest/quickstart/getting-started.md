# Getting Started with the Wallarm Platform

Wallarm delivers all-in-one API security, identifying and protecting your APIs from vulnerabilities and malicious activities. Whether you are evaluating Wallarm or ready to secure production environments, you can choose the most convenient way to begin.

## Ways to get started with Wallarm

Depending on your goals, you can start with one of the following options:

* [Security Edge Free Tier](#security-edge-free-tier) — includes most capabilities of Advanced API Security Free Tier and optional AASM Freemium features. Get 500K free requests per month and explore most Wallarm's core functionality for free.

    A built-in welcome wizard lets you test Wallarm protection using demo traffic before moving to production.

* [API Attack Surface Management (AASM) Freemium](#aasm-freemium-know-your-api-with-zero-deployment) — instantly discover your external hosts and APIs without any deployment. Simply provide your business email, and Wallarm will start scanning your company domain automatically.
* [Playground](#learn-wallarm-in-playground) — explore Wallarm in a hosted demo environment before creating an account.
* [Guided trial](#guided-trial) — request a personalized walkthrough and onboarding assistance from the Wallarm team.

## Security Edge Free Tier

Every new account created in the Wallarm Console is automatically enrolled in the [Security Edge Free Tier](../about-wallarm/subscription-plans.md#security-edge-free-tier), which gives you **500 thousand requests per month** for free. This tier includes most **Advanced API Security capabilities** and **optional AASM Freemium** features.

When you sign up, Wallarm automatically provisions an account and launches a built-in **Welcome Wizard** that lets you quickly experience how Wallarm protects APIs using demo traffic.

### Self-signup

To register with Wallarm yourself:

1. Choose your [Wallarm Cloud](../about-wallarm/overview.md#cloud):

    || US Cloud | EU Cloud |
    | -- | -------- | -------- |
    | **Signup link** | https://us1.my.wallarm.com/signup | https://my.wallarm.com/signup |
    | **Physical location** | USA | Netherlands |
    | **Wallarm Console URL** | https://us1.my.wallarm.com/ | https://my.wallarm.com/ |
    | **Wallarm API Endpoint** | `https://us1.api.wallarm.com/` | `https://api.wallarm.com/` |
    
1. Follow the signup link and input requested data about yourself and your company.
1. Select whether you want to immediately start **discovering your external APIs and security issues** (nothing needs to be deployed, see details [below](#know-your-api-with-zero-deployment)).

    Visit the Wallarm Console's [**API Attack Surface**](../api-attack-surface/overview.md) section later to see how Wallarm detects APIs and their security issues. This activates the Core (freemium) version, and scanning of the used email's domain starts immediately.

### Welcome wizard

After registration, the **Welcome to Wallarm** wizard is launched automatically. It is equipped with a ready-to-use demo Wallarm Node that lets you observe how Wallarm protects APIs in just 5 minutes.

![Self-signup - Welcome Wizard](../images/waf-installation/quickstart/welcome-wizard.png)

In the wizard, you can:

1. Choose the destination for demo traffic — the Wallarm demo API or your own API.
1. Send sample legitimate traffic through the Demo Node to observe how it appears in [API Sessions](../api-sessions/overview.md).
1. Simulate attacks and see them detected in real time.
1. Switch to [blocking mode](../admin-en/configure-wallarm-mode.md) to watch malicious requests being blocked.

Once the Welcome Wizard is completed, you can continue with one of the following options:

* [Switch DNS to Security Edge inline](../installation/security-edge/free-tier.md) to start you traffic analysis for free within Security Edge Free Tier subscription. This will switch Wallarm to Security Edge **setup wizard**.
* [Configure Security Edge connector](../installation/security-edge/free-tier.md) to start you traffic analysis for free within Security Edge Free Tier subscription. This will switch Wallarm to Security Edge **setup wizard**.
* Deploy [hybrid node locally](../installation/supported-deployment-options.md) for full control over your traffic and data.

!!! info "Demo Node"
    The Demo Node does not process real traffic and is not shown in your Wallarm Console. It is managed by Wallarm and provided only for demo testing.

## AASM Freemium: know your API with zero deployment

Knowing the full list of your organization's external APIs is the first step in mitigating potential security risks as unmonitored or undocumented APIs can become potential entry points for malicious attacks.

Subscribe to Wallarm's [API Attack Surface Management (AASM)](../api-attack-surface/overview.md) to immediately discover all your external hosts and their APIs without deployment and get the information about how well your hosts are protected and what [security issues](../api-attack-surface/security-issues.md) (vulnerabilities) they have.

![AASM](../images/api-attack-surface/aasm.png)

To start, do one of the following:

* [Activate AASM on the Wallarm's official site](https://www.wallarm.com/product/aasm?utm_source=wallarm_docs&utm_campaign=getting_started_guide).
* Activate the feature immediately during [self-signup](#self-signup-and-security-edge-free-tier).    
* Contact [sales@wallarm.com](mailto:sales@wallarm.com)

## Learn Wallarm in Playground

To explore Wallarm even before signing up and deploying any components to your environment, use [Wallarm Playground](https://playground.wallarm.com/?utm_source=wallarm_docs_quickstart).

In Playground, you can access the Wallarm Console view like it is filled with real data. Wallarm Console is the major Wallarm platform component that displays data on processed traffic and allows the platform fine-tuning. So, with Playground you can learn and try out how the product works, and get some useful examples of its usage in the read-only mode.

![Playground](../images/playground.png)

To try the Wallarm solution capabilities on your traffic, [create a Security Edge Free tier account](#self-signup-and-security-edge-free-tier).

## Guided trial

You can opt for a guided trial where our Sales Engineer team will assist you during the entire onboarding process. They will demonstrate the product's value over a 2-week period and help you deploy Wallarm filtering instances to filter your traffic.

To request this trial, please email us at [sales@wallarm.com](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.).
