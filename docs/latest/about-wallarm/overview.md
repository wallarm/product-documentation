# Wallarm Platform Overview

The Wallarm platform is adept at safeguarding your APIs and cloud applications from vulnerabilities and malicious activities. In the digital landscape, many APIs and web applications unknowingly have vulnerabilities, potentially exposing sensitive business data to hackers. Wallarm stands against these risks, ensuring comprehensive protection for your infrastructure and business.

Wallarm seamlessly integrates API threat prevention with Web Application Firewall (WAF) capabilities, ensuring both APIs and web applications are protected given their unique security challenges. Wallarm's features encompass real-time malicious traffic mitigation, security vulnerability detection, API portfolio discovery, and security testing - all within multi‑cloud and cloud‑native environments.

## Threat prevention

Wallarm delivers robust protection against a wide range of known and emerging threats, covering those listed in the [OWASP Top 10](https://owasp.org/www-project-top-ten/) and [OWASP API Top 10](https://owasp.org/www-project-api-security/). Here is a snapshot of the threats Wallarm mitigates:

* Code injections like SQL and XSS injections, remote code execution, etc.
* Brute force and forced browsing - the Wallarm platform lets you set limits for login attempts and attempts aimed at reaching hidden directories.
* BOLA (Broken Object Level Authorization) - the Wallarm platform lets you limit access to endpoints with object IDs.
* DDoS prevention with personalized rate limiting.
* API abuse, which includes countering and blocking malicious bots that misuse APIs. This ranges from account takeovers to data scraping.
* Wallarm can also identify threats based on custom attack detection signatures or a virtual patch. Wallarm, while not relying on regular expressions for attack detection, does allow users to include additional signatures based on regular expressions.

Wallarm also provides geolocation restrictions. You can block traffic from untrusted sources like VPNs, Proxy servers, or Tor networks. Conversely, an allowlist lets trusted resources access your applications and APIs, ensuring uninterrupted business operations.

The Wallarm filtering node, designed to operate within your infrastructure or on a third-party service, analyzes and responds to all incoming traffic in real-time. Suspicious request data is processed locally and some of this data is uploaded to our Cloud for in-depth analysis. To examine detected and blocked threats, you can navigate to the **Events** section, here you can utilize diverse filters and sorting options to review detected and blocked attacks.

![!Events](../images/about-wallarm-waf/overview/events-with-attacks.png)

While the Wallarm filtering node defaults to monitoring mode, allowing a full view of detected threats and ensure uninterrupted traffic flow, you can also switch to the blocking mode. In this mode, Wallarm blocks all malicious activities before they reach your APIs. It is a common practice for our customers to try the product in the monitoring mode and customize the default behavior of Wallarm if needed. After configuring all the additional modules, they switch to the blocking mode.

[Guide on leveraging Wallarm for optimum attack prevention](../quickstart/attack-prevention-best-practices.md)

## Vulnerability discovery

A security vulnerability is an error caused by negligence or insufficient information during web application development. This error can result in risks such as unauthorized data access, allowing outsiders to read and change user data, or causing service disruptions and data corruption. Incoming internet traffic can be used to detect the vulnerabilities, which is what Wallarm does.

Wallarm [employs](detecting-vulnerabilities.md) two primary tools, **Active Threat Verification** and **Vulnerability Scanner** that make attackers help us find weak spots. They evaluate an application's or API's vulnerability based on its response to specific test requests designed to trigger potential weaknesses. The test requests are safe, they mimic the nature of attacks without carrying harmful or sensitive data.

* The Active Threat Verification module uses real attack data from traffic to probe application endpoints. After detecting initial threats, this tool creates varied test requests targeting the same endpoint. This strategy helps Wallarm uncover vulnerabilities that might be exploited in actual attacks. A significant advantage of this module is its ability to replay attacks in a staging environment, preventing potential issues in the production environment.
* The Vulnerability Scanner employs a set of safe test requests aimed at your company's public resources, which Wallarm auto-discovers. These requests are designed to detect common system weaknesses.

All detected vulnerabilities are uploaded to our Cloud and subsequently displayed within the **Vulnerabilities** section. Here you can see the discovered problems and then implement appropriate security fixes - we usually provide recommendations on them.

![!Events](../images/about-wallarm-waf/overview/vulnerabilities.png)

## API Discovery

Wallarm's [API Discovery module](api-discovery.md) crafts a precise inventory of your application's REST API based on real-time usage. By consistently analyzing live traffic, the module maintains an updated view of all APIs, sensitive data, and associated risks.

Within the Wallarm UI's **API Discovery** section, you can access this detailed portfolio. It showcases information on both internal and external APIs, their recent updates, request parameters and risk evaluations for each endpoint. Use the available filters and sorting options to, for instance, focus on endpoints handling sensitive data.

Additionally, you can [upload your API specifications to Wallarm](../user-guides/api-specifications.md). When uploaded, Wallarm identifies APIs in the specs that are not receiving traffic (orphan APIs) and those receiving traffic but missing from your specs (shadow APIs). This ensures every API is properly accounted for and managed.

![!APID](../images/about-wallarm-waf/overview/api-discovery.png)

## Security testing on CI/CD

[Wallarm's Framework for API Security Testing (FAST)](../fast/README.md) is designed to automatically detect vulnerabilities in web applications, such as SQL injections and XSS. FAST seamlessly integrates with your existing CI/CD process, enhancing software quality through automated security test generation and execution. It is a versatile tool beneficial for DevOps teams, security professionals, software developers, and QA engineers.

## Navigating the platform

The Wallarm Console UI serves as the central hub for managing most of Wallarm's platform settings. This user interface guides you through the platform, allowing you to oversee issues identified by Wallarm.

Beyond assessments of attacks, vulnerabilities, and API portfolios, the platform UI offers:

* [Dashboards](../user-guides/dashboards/threat-prevention.md): Informative displays like the OWASP dashboard help you gauge the impact of threats on your system.
* [Integrations & Notifications](../user-guides/settings/integrations/integrations-intro.md): Wallarm supports easy integration with numerous SIEM/SOAR systems, including Sumo Logic and Splunk. This enables smooth export of attack data to your SOC center for centralized oversight. Combined with the [triggers](../user-guides/triggers/triggers.md) feature, Wallarm makes it easy to set up reports and real-time notifications for specific attacks, blacklisted IPs, and overall attack metrics.
* [User management](../user-guides/settings/users.md): Invite your team to collaborate on traffic security, view Wallarm's findings, manage API specifications, apply custom configurations, and more. Users can be given roles ranging from read-only access to full administrative privileges.

![!Platform](../images/about-wallarm-waf/overview/navigating-platform.png)

## Wallarm platform components

Wallarm's platform is primarily built upon two main components: the Wallarm filtering node and the Wallarm Cloud.

=== "In-house filtering node"
    ![!Arch scheme1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)
=== "Filtering node running on a third-party service"
    ![!Arch scheme2](../images/waf-installation/quickstart/cdn-node-scheme.png)

### Filtering node

The Wallarm node component does the following:

* Analyzes the company's entire network traffic and mitigates malicious requests
* Collects the network traffic metrics and uploads the metrics to the Wallarm Cloud
* Downloads resource-specific security rules you defined in the Wallarm Cloud and applies them during the traffic analysis

You can set up the Wallarm filtering node within your own network or opt for a third-party hosted node via the [available deployment choices](../installation/supported-deployment-options.md).

### Cloud

The Wallarm Cloud does the following:

* Processes the metrics that the filtering node uploads
* Compiles custom resource-specific security rules
* Scans the company's exposed assets to detect vulnerabilities
* Builds API structure based on the traffic metrics received from the filtering node

Wallarm manages American and European cloud instances. Each Cloud is distinct regarding databases, API endpoints, client accounts, and more. A client linked to one Wallarm Cloud cannot access another. If you are utilizing both clouds, separate Wallarm Console and API endpoint accounts are necessary for each.

|| US Cloud | EU Cloud |
| -- | -------- | -------- |
| **Physical location** | USA | Netherlands |
| **Wallarm Console URL** | https://us1.my.wallarm.com/ | `https://us1.api.wallarm.com/` |
| **Wallarm API Endpoint** | https://my.wallarm.com/ | `https://api.wallarm.com/` |

### Masking of sensitive data

As with any third-party service, it’s important for a Wallarm client to understand what client data is sent to Wallarm, and be assured that sensitive data will never reach Wallarm Cloud. Wallarm clients with PCI DSS, GDPR and other requirements are recommended to mask sensitive data using special rules.

The only data transmitted from filtering nodes to the Wallarm Cloud that may include any sensitive details is information about detected malicious requests. It is highly unlikely that a malicious request would contain any sensitive data. However, the recommended approach is mask HTTP request fields which may contain PII or credit card details, such as `token`, `password`, `api_key`, `email`, `cc_number`, etc. Using this approach will guarantee that specified information fields will never leave your security perimeter.

You can apply a special rule called **Mask sensitive data** to specify what fields (in the request URI, headers or body) should be omitted when sending attack information from a filtering node to the Wallarm Cloud. For additional information about masking the data, please see the [document](../user-guides/rules/sensitive-data-rule.md) or contact [Wallarm support team](mailto:request@wallarm.com).

## Initiate traffic security

The filtering node handles and filters your incoming traffic. To activate Wallarm's traffic analysis, attack prevention, and vulnerability detection, deploy your first Wallarm node. You can either integrate it into your infrastructure or use a Wallarm node hosted by section.io.

[Choose a deployment option](../installation/supported-deployment-options.md)
