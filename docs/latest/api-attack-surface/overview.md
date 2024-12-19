# API Attack Surface Management  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarm's **API Attack Surface Management** (**AASM**) is an agentless detection solution designed to discover all external hosts with their APIs, evaluate their protection against Web and API-based attacks, identify missing WAF/WAAP solutions, and detect the discovered endpoints' security issues.

API Attack Surface Management includes:

* [API Attack Surface Discovery (AASD)](api-surface.md)
* [Security Issues Detection](security-issues.md)

![AASM](../images/api-attack-surface/aasm.png)

## How it works

Work with API Attack Surface Management looks as follows:

* You buy subscription.
* You set your root domains to be scanned.
* For specified domains, Wallarm searches for subdomains/hosts and lists them.

    AASM system collects subdomains using various OSINT methods, such as passive DNS analysis, SSL/TLS certificate analysis, Certificate Transparency Logs analysis, via search engines and enumeration of the most frequently occurring subdomains.

* Wallarm identifies geolocation and data center for each host.
* Wallarm identifies exposed APIs on each host.
* Wallarm identifies security solutions (WAF/WAAP) protecting the host and evaluate their efficiency.
* Wallarm checks found domains/hosts for [security issues](security-issues.md).
* If found, security issues are listed and described for you to be able to solve them.

## Enabling and setup

To use AASM, the Wallarm's [API Attack Surface](../about-wallarm/subscription-plans.md#api-attack-surface) subscription plan should be active for your company. To activate, do one of the following:

* If you do not have Wallarm account yet, get pricing information and activate AASM on the Wallarm's official site [here](https://www.wallarm.com/product/aasm).

    When activating, scanning of the used email's domain starts immediately while you negotiate sales team. After activation, you can add additional domains to the scope.

* If you already have Wallarm account, contact [sales@wallarm.com](mailto:sales@wallarm.com).

Once subscription is activated, [select your domains](setup.md) for automatic host detection and searching for security issues related to these hosts.
