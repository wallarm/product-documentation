# API Attack Surface Discovery <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

The **API Attack Surface Discovery** component of the Wallarm's [API Attack Surface Management (AASM)](overview.md) scans your selected domains to discover all their external hosts and their APIs, evaluate their protection against Web and API-based attacks, and identify missing WAF/WAAP solutions. It works simply by subscribing in Wallarm - you do not need to deploy anything. This article gives an overview of the component.

![API Attack Surface Discovery](../images/api-attack-surface/aasm-api-surface.png)

## Issues addressed by API Attack Surface Discovery

Knowing the full list of your organization's external APIs is the first step in mitigating potential security risks as unmonitored or undocumented APIs can become potential entry points for malicious attacks.

The **API Attack Surface Discovery** Wallarm component helps to solve these issues by providing the following:

* Automatic detection of external subdomain/hosts for your selected domains.
* Automatic detection of found hosts' APIs.

    The following **API types** (protocols) can be detected: JSON-API, GraphQL, XML-RPC, JSON-RPC, OData, gRPC, WebSocket, SOAP, WebDav, HTML WEB.

    HTML WEB — an HTML Web page designed for human access with browsers. It can be a static HTML Web page or a single HTML page of an application that, in turn, may access some API.

* Automatic protection level evaluation for found hosts.
* Overall score for protection of the entire API surface.
* Asset summaries by security vendor, data center, and location.

    As one host may have more than one IP address, the assets statics by data centers and geo location is evaluated per IP address basis and not per-host basis. Due to the usage of CDNs the assets' location may be not representative.

* Automatic detection of security issues for found hosts.

You get all this simply by subscribing to the component in Wallarm - you do not need to deploy anything and get the analyzed data immediately.

## Define your domains to search for subdomain/hosts

You can define a list of your **root domains** which you want to search for subdomains/hosts as follows:

1. In the **API Attack Surface** or **API Leaks** section, click **Configure**.
1. At the **Scope** tab, add your domains.

    Wallarm will start searching for subdomains and [leaked credentials](api-leaks.md) published under the domain. The search progress and results will be displayed at the **Status** tab.

![AASM - configuring scope](../images/api-attack-surface/aasm-scope.png)

Note that domains are automatically re-scanned daily - new subdomains will be added automatically, previously listed but not found during re-scan will remain in the list.

You can re-start, pause or continue scanning for any domain manually at **Configure** → **Status**.

## Protection score

Wallarm automatically tests your found subdomains/hosts for the resistance against attacks on web and API services and assigns the protection score and grade. You can sort and filter hosts by protection score.

Also, the overall protection score is calculated for the entire Attack Surface. The overall score is calculated as the average score for all hosts identified on the network perimeter. The following hosts are excluded from the evaluation:

* hosts without Web/API services
* hosts which score was not evaluated due to service misconfiguration, errors or explicitly denied access

![API surface - protection score](../images/api-attack-surface/aasm-api-surface-protection-score.png)