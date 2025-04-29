# Cloud-Native WAAP

Wallarm Cloud-Native WAAP (Web Application & API Protection) provides advanced protection for applications and APIs in any customer environment. Wallarm's WAAP supports multiple API protocols, such as REST, SOAP, GraphQL, and others, and implies a deep packet inspection to fully cover [OWASP Top 10](https://owasp.org/www-project-top-ten/) and more. WAAP provides high accuracy in detecting [various threats](../attacks-vulns-list.md), including 0-days, and a low number of [false positives](../about-wallarm/protecting-against-attacks.md#false-positives). This allows you to quickly and effectively protect your infrastructure.

![Attack by protocols](../images/user-guides/dashboard/api-protocols.png)

## General principles

Traffic is handled by two components: Wallarm filtering nodes and Wallarm Cloud. Wallarm filtering nodes are deployed in the customer's infrastructure and are responsible for analyzing traffic and blocking attacks. The collected attack statistics are sent to Wallarm Cloud for statistical analysis and event processing. Wallarm Cloud is also responsible for centralized management and integration with other security tools.

![!Arch scheme1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

Wallarm supports various [deployment options](../installation/supported-deployment-options.md), including public cloud, on-premises, full SaaS deployment, and integrating with Kubernetes, Gateway APIs, Security Edges, etc. Wallarm filtering nodes can be deployed either [in-line](../installation/inline/overview.md) or [out-of-band](../installation/oob/overview.md), depending on your needs and infrastructure. Flexible security policy configuration options allow you to quickly switch between monitoring and blocking [modes](../admin-en/configure-wallarm-mode.md), eliminating fear of blocking legitimate traffic.

## Protection measures

Wallarm WAAP provides a wide range of security measures to protect your applications from all types of threats, including but not limited to:

* Up-to-date stamps against XSS, SQLi, RCE, etc. 
* Virtual patching
* Custom detectors creating
* [L7 DDoS Protection](../admin-en/configuration-guides/protecting-against-ddos.md)
* [Protection from multi-attack perpetrators](../admin-en/configuration-guides/protecting-with-thresholds.md)
* Rate limiting
* [Brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Forced browsing protection](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA protection](../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [Filtering by geo-locations and source types](../user-guides/ip-lists/overview.md)
* Malicious IPs feeds

## Additional capabilities

In addition to protecting applications, Wallarm Cloud Native WAAP provides flexible [reporting](../user-guides/dashboards/owasp-api-top-ten.md) capabilities and [integration](../user-guides/settings/integrations/integrations-intro.md) with other applications allow you to quickly learn about emerging threats and respond to them on time.

Advanced API protection and analysis capabilities can easily [be added](../about-wallarm/subscription-plans.md) as needed.
