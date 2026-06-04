[link-deployment-se]:           ../installation/security-edge/overview.md
[link-deployment-hybrid]:       ../installation/supported-deployment-options.md

# Wallarm API Security <a href="../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../images/api-security-tag.svg" style="border: none;" class="non-zoomable"></a>

Wallarm API Security is the module of [Wallarm AI Control Platform](overview.md) that protects your APIs — internal services, partner-facing endpoints, third-party integrations, and the APIs consumed by AI workloads. It detects and blocks the OWASP API Top 10, automated abuse, account takeover, AI-targeted attacks, and attacks against MCP servers across REST, GraphQL, gRPC, SOAP, and WebSocket — and continuously discovers, inventories, and risk-scores every API endpoint in your environment.

The module groups two functional areas, both available in this section:

* **[API Discovery](../api-discovery/overview.md)** — endpoint inventory, risk scoring, sensitive data detection, and detection of [rogue endpoints](../api-discovery/rogue-api.md) including shadow and zombie APIs.
* **[API Protection](api-protection-overview.md)** — inline mitigation of attacks and abuse: BOLA, bot abuse, credential stuffing, GraphQL-specific attacks, brute force, L7 DDoS, and more.

## How Wallarm API Security works

Wallarm API Security is primarily built upon two main components: the Wallarm filtering node and the Wallarm Cloud.

![!Arch scheme1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

### Filtering node

Positioned between the Internet and your APIs, the Wallarm filtering node:

* Analyzes the company's entire network traffic and mitigates malicious requests.
* Collects the network traffic metrics and uploads the metrics to the Wallarm Cloud.
* Downloads resource-specific security rules you defined in the Wallarm Cloud and applies them during the traffic analysis.
* Detects sensitive data in your requests, ensuring it remains secure within your infrastructure and is not transmitted to the Cloud as to a third-party service.

You can set up the Wallarm filtering node within [your own network or opt for Wallarm Security Edge](../installation/supported-deployment-options.md).

### Cloud

The Wallarm Cloud does the following:

* Processes the metrics that the filtering node uploads.
* Compiles custom resource-specific security rules.
* Scans the company's exposed assets to detect vulnerabilities.
* Builds API structure based on the traffic metrics received from the filtering node.
* Houses the Wallarm Console UI, your command center for navigating and configuring the Wallarm platform, ensuring you have a comprehensive view of all security insights.

Wallarm offers cloud instances in the US, Europe, and the Middle East, enabling you to select the best fit considering your data storage preferences and regional service operation requirements.

[Proceed to signup on the US Wallarm Cloud](https://us1.my.wallarm.com/signup)

[Proceed to signup on the EU Wallarm Cloud](https://my.wallarm.com/signup)

[Proceed to signup on the ME Wallarm Cloud](https://me1.my.wallarm.com/signup)

## Where Wallarm API Security works

The [described](#how-wallarm-api-security-works) Wallarm API Security components — filtering node and Cloud — can be deployed in one of two forms:

--8<-- "../include/deployment-forms.md"

See details on [shared responsibility](shared-responsibility.md) for each deployment form.
