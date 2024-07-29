# API Attack Surface Discovery <a href="../../about-wallarm/subscription-plans/#api-attack-surface"><img src="../../images/api-attack-surface-tag.svg" style="border: none;"></a>

The **API Attack Surface Discovery** component of the Wallarm's [API Attack Surface Management (AASM)](overview.md) scans your selected domains to discover all their external hosts with Web Apps & APIs. It works simply by subscribing in Wallarm - you do not need to deploy anything. This article gives an overview of the component.

![API Attack Surface Discovery](../../images/api-attack-surface/aasm-api-surface.png)

## Issues addressed by API Attack Surface Discovery

Knowing the full list of your organization's external APIs is the first step in mitigating potential security risks as unmonitored or undocumented APIs can become potential entry points for malicious attacks.

Knowing API surface helps ensure compliance with industry regulations regarding data sharing and third-party integrations and improves an audit and optimization readiness.

The **API Attack Surface Discovery** Wallarm component helps to solve these issues by providing the following:

* Automatic detection of external subdomain/hosts for your selected domains.
* Automatic detection of found hosts' APIs.

    The following **API types** (protocols) can be detected: JSON-API, GraphQL, XML-RPC, JSON-RPC, OData, gRPC, WebSocket, SOAP, WebDav, HTML WEB.

* Automatic protection level evaluation for found hosts.
* Generic protection level evaluation for the entire API surface.
* Asset summaries by security vendor, data center, and location.
* Automatic detection of security issues for found hosts.

You get all this simply by subscribing to the component in Wallarm - you do not need to deploy anything and get the analyzed data immediately.

## Define your domains to search for subdomain/hosts

You can define a list of your **target domains** which you want to search for subdomains/hosts as follows:

1. In the **API Attack Surface** or **API Leaks** section, click **Configure**.
1. At the **Scope** tab, add your domains. You can use the names of domains, found by the [API Discovery](../api-discovery/overview.md) module (if enabled) or by [Wallarm's Scanner](../user-guides/scanner.md).

    Wallarm will start searching for subdomains and [leaked credentials](api-leaks.md) published under the domain. The search progress and results will be displayed at the **Status** tab.

![AASM - configuring scope](../../images/api-attack-surface/aasm-scope.png)

Note that domains are automatically re-scanned daily - new subdomains will be added automatically, previously listed but not found during re-scan will be deleted.

You can re-start, pause or continue scanning for any domain manually at **Configure** → **Status**.

## Protection score

Wallarm automatically tests your found subdomains/hosts for the resistance against attacks on web and API services and assigns the protection score and grade. You can sort and filter hosts by protection score.

Also, the average protection score is calculated for all hosts identified on the network perimeter.

![API surface - protection score](../../images/api-attack-surface/aasm-api-surface-protection-score.png)