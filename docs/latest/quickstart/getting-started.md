# Getting Started with the Wallarm Platform

Wallarm delivers all-in-one API security, identifying and protecting your APIs from vulnerabilities and malicious activities. To help you begin using the platform, we offer a demo, immediate API discovery, and Free Tier protection upon registration, a Playground for exploration prior to signing up, and access to expert support for a seamless experience.

## Self-signup, demo, immediate API discovery, and Security Edge Free Tier

When signing up with Wallarm, you will create an account in the Wallarm Console, which serves as the central hub for navigating and configuring the Wallarm platform. The Console UI is hosted on the [Wallarm Cloud](../about-wallarm/overview.md#cloud).

Every new account is automatically enrolled in the [Security Edge Free Tier](../about-wallarm/subscription-plans.md#security-edge-free-tier), which gives you **500 thousand requests per month** for free.

1. Choose your Wallarm Cloud:

    || US Cloud | EU Cloud |
    | -- | -------- | -------- |
    | **Signup link** | https://us1.my.wallarm.com/signup | https://my.wallarm.com/signup |
    | **Physical location** | USA | Netherlands |
    | **Wallarm Console URL** | https://us1.my.wallarm.com/ | https://my.wallarm.com/ |
    | **Wallarm API Endpoint** | `https://us1.api.wallarm.com/` | `https://api.wallarm.com/` |
1. Follow the signup link and input requested data about yourself and your company.
1. Select whether you want to immediately start **discovering your external APIs and security issues** (nothing needs to be deployed, see details [below](#know-your-api-with-zero-deployment)).

    Visit the Wallarm Console's [**API Attack Surface**](../api-attack-surface/overview.md) section later to see how Wallarm detects APIs and their security issues. For demo purposes, the `wallarm.com` domain is added to the API Attack Surface configuration. You will see its data. Fill free to add and see your own domains.

    Scanning your domains will start immediately and will continue for free while you negotiating Wallarm's sales team.

1. From the suggested list, select one or many goals you want to focus on with Wallarm.
1. From the suggested list, select one or many security tools you are already using.
1. Finish registration.

    **Welcome to Wallarm** wizard is displayed. It is equipped with the ready-to-use demo Wallarm filtering node which allows you to see within 5 minutes how Wallarm protects APIs.

    ![Self-signup - Welcome Wizard](../images/waf-installation/quickstart/welcome-wizard.png)

1. Choose demo traffic destination - Wallarm demo API or your own API.
1. Click for Wallarm to run pre-generated traffic through the demo Node.
1. See [**API Sessions**](../api-sessions/overview.md) displaying all the requests organized into session.
1. Click for Wallarm to run sample attacks, then check **API Sessions** displaying them detected.
1. Switch to [blocking mode](../admin-en/configure-wallarm-mode.md) and re-run malicious traffic to see how requests were blocked.
1. Finish the demo and select one of the available options to continue with Wallarm:

    * [Switch DNS to Security Edge inline](../installation/security-edge/free-tier.md) to start you traffic analysis for free within [Security Edge Free Tier](../about-wallarm/subscription-plans.md#security-edge-free-tier) subscription.
    * [Configure Security Edge connector](../installation/security-edge/free-tier.md) to start you traffic analysis for free within [Security Edge Free Tier](../about-wallarm/subscription-plans.md#security-edge-free-tier) subscription.
    * Deploy [hybrid node locally](../installation/supported-deployment-options.md) for full control over your traffic and data.

## Know your API with zero deployment

Knowing the full list of your organization's external APIs is the first step in mitigating potential security risks as unmonitored or undocumented APIs can become potential entry points for malicious attacks.

Subscribe to Wallarm's [API Attack Surface Management (AASM)](../api-attack-surface/overview.md) to immediately discover all your external hosts and their APIs and get:

* List of your external hosts.
* Protection score of your hosts - Wallarm will automatically test your found subdomains/hosts for the resistance against attacks on web and API services and evaluate their protection level.
* Leaked credentials info for your hosts - Wallarm will actively scan your selected domains and public sources for the leaks of the credential data (API tokens and keys, passwords, client secrets, usernames, emails and others).

You get all this simply by subscribing to the component in Wallarm - to get your information, you do not need to deploy anything.

To start, do one of the following:

* Activate the feature immediately during [self-signup](#self-signup-and-security-edge-free-tier) in the **Welcome to Wallarm** wizard.
    
    When using this option, for demo purposes, the `wallarm.com` domain is added to the [**API Attack Surface**](../api-attack-surface/overview.md) configuration. You will see its data in **API Attack Surface** in Wallarm Console. Fill free to add and see your own domains.

    Scanning your domains will start immediately and will continue for free while you negotiating Wallarm's sales team.
    
* Get pricing information and activate AASM on the Wallarm's official site [here](https://www.wallarm.com/product/aasm).
* Contact [sales@wallarm.com](mailto:sales@wallarm.com)

## Learn Wallarm in Playground

To explore Wallarm even before signing up and deploying any components to your environment, use [Wallarm Playground](https://playground.wallarm.com/?utm_source=wallarm_docs_quickstart).

In Playground, you can access the Wallarm Console view like it is filled with real data. Wallarm Console is the major Wallarm platform component that displays data on processed traffic and allows the platform fine-tuning. So, with Playground you can learn and try out how the product works, and get some useful examples of its usage in the read-only mode.

![Playground](../images/playground.png)

To try the Wallarm solution capabilities on your traffic, [create a Security Edge Free tier account](#self-signup-and-security-edge-free-tier).

## Guided trial

You can opt for a guided trial where our Sales Engineer team will assist you during the entire onboarding process. They will demonstrate the product's value over a 2-week period and help you deploy Wallarm filtering instances to filter your traffic.

To request this trial, please email us at [sales@wallarm.com](mailto:sales@wallarm.com?subject=Request%20for%20a%20Guided%20Wallarm%20Trial&body=Hello%20Wallarm%20Sales%20Engineer%20Team%2C%0A%0AI'm%20writing%20to%20request%20a%20guided%20Wallarm%20trial.%20I%20would%20be%20happy%20to%20schedule%20a%20call%20with%20you%20to%20discuss%20my%20requirements%20in%20detail.%0A%0AThank%20you%20for%20your%20time%20and%20assistance.).
