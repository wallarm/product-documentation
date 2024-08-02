# API Attack Surface Management  <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

Wallarm's **API Attack Surface Management** (**AASM**) is an agentless detection solution tailored for the API ecosystem, designed to discover all external hosts with their APIs, evaluate their protection against Web and API-based attacks, identify missing WAF/WAAP solutions, and eliminate API leaks.

API Attack Surface Management includes:

* [API Attack Surface Discovery](api-surface.md)
* [API Leaks Detection](api-leaks.md)

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
* Wallarm checks public resources for published (leaked) data related to specified domains.
* At specified domains, Wallarm searches for revealed (leaked) sensitive data.
* Wallarm lists leaks found for specified domains.

## Enabling and setup

To use AASM, the Wallarm's [API Attack Surface](../about-wallarm/subscription-plans.md#api-attack-surface) subscription plan should be active for your company. Refer to the administrator of your Wallarm account. If you are an administrator, contact [sales@wallarm.com](mailto:sales@wallarm.com) or get pricing information and activate AASM on the Wallarm's official site [here](https://www.wallarm.com/product/aasm).

When activating via Wallarm's website, scanning of the used email's domain starts immediately while you negotiate sales team. After activation, you can add additional domains to the scope.

Once subscription is activated, to configure domain detection and API leaks remediation, in Wallarm Console → AASM → **API Attack Surface** or **API Leaks** section, click **Configure**. Add your domains to the scope, check the scanning status.

![AASM - configuring scope](../images/api-attack-surface/aasm-scope.png)

Wallarm will list all subdomains and show API leaks related to them if there are any. Note that domains are automatically re-scanned daily - new subdomains will be added automatically, previously listed but not found during re-scan will remain in the list.

You can re-start, pause or continue scanning for any domain manually at **Configure** → **Status**.
