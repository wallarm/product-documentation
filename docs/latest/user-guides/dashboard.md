# Dashboard

Wallarm automatically collects metrics on processed traffic and represents them on the widgets in the **Dashboard** section of Wallarm Console. The dashboard allows any user to analyze malicious and legitimate traffic trends and get application vulnerability status for a period of time.

Metrics are presented in the following widgets:

* Statistics for the current month and the speed of request encountering
* Normal and malicious traffic
* Attack types
* API protocols
* Attack sources
* Attack targets
* Vulnerability Scanner

You can filter widget data by [applications](settings/applications.md) and time period. By default, widgets represent statistics on all applications for the last month.

Any widget allows to open the [event list](events/check-attack.md) the statistics have been collected on.

!!! info "Getting started with Wallarm"
    If you registered the Wallarm account in the US [Cloud](../about-wallarm-waf/overview.md#cloud), you would be able to explore core Wallarm features in the **Playground** mode with read-only access to the Wallarm Console sections. Use it to try out major features of the Wallarm platform without having to deploy any components to your environment. 
    
    The Dashboard section also includes the **Get started** button for new users. When you click the button, you will get a list of helpful product discovery options with the following among them:
    
    * The **Onboarding tour** option will provide you with deployment options supported by Wallarm and links to relevant deployment instructions.
    * The **Wallarm Playground** option will forward you to the Wallarm Console playground mode with read-only access to its sections. This option is available only for users of the US Cloud.

## Statistics for the current month and the speed of request encountering

The widget displays the following data:

* Monthly request quota specified in the [subscription plan](../about-wallarm-waf/subscription-plans.md)
* The number of detected [hits](../about-wallarm-waf/protecting-against-attacks.md#hit) and [blocked](../admin-en/configure-wallarm-mode.md) ones during the current month
* The real-time speed at which requests and hits are encountered

![!Current month statistics](../images/user-guides/dashboard/current-month-stats.png)

## Normal and malicious traffic

The widget displays the following data:

* The amount of traffic
* The number of requests, [hits](../glossary-en.md#hit), and [incidents](../glossary-en.md#security-incident)
* The estimated cost of attacks for the attacker: the value considers the approximate cost of IP address renting and an attack duration

![!Normal and malicious traffic](../images/user-guides/dashboard/traffic-stats.png)

## Attack types

This widget displays the [top types of detected attacks](../attacks-vulns-list.md) that makes patterns of malicious traffic and attacker behavior visible.

Using this data, you can analyze the vulnerability of your services to different attack types and take appropriate measures to improve service security.

![!Attack types](../images/user-guides/dashboard/attack-types.png)

## API protocols

This widget displays statistics on API protocols used by attackers. Wallarm can identify the following API protocols:

* GraphQL
* gRPC
* WebSocket
* REST API
* SOAP
* XML-RPC
* JSON-RPC
* WebDAV

The **API protocols** widget enables you to identify protocols being attacked most often and makes API protocols implemented in your infrastructure visible.

You can identify the vulnerability of your services to certain protocol exploitation based by analyzing the corresponding typical attacks.

![!Attack types](../images/user-guides/dashboard/api-protocols.png)

## Attack sources

This widget displays the statistics on the attack source groups:

* Location of attack sources
* Source types, e.g. Tor, Proxy, VPN, etc.
* Service providers, e.g. AWS, GCP, etc.

This data can help to define abusive attack sources and enable the blocking of requests originating from them by using grey or black [lists of IP addresses](ip-lists/overview.md).

You can view data on each source group on separate tabs.

![!Attack sources](../images/user-guides/dashboard/attack-sources.png)

## Attack targets

This widget displays domains and [applications](settings/applications.md) being attacked the most. The following metrics are displayed for each object:

* The number of detected incidents
* The number of detected hits
* Trends: change in the hit number for a selected period and for the same previous period. For example: if you check the statistics for the last month, the trend displays the difference in the hits number between the last and previous months as a percentage

You can view data on domains and applications on separate tabs.

![!Attack targets](../images/user-guides/dashboard/attack-targets.png)

## Vulnerability Scanner

The Scanner widget shows statistics on vulnerabilities detected in [public assets](scanner/check-scope.md):

* The number of vulnerabilities of all risk levels detected over the selected period
* The number of active vulnerabilities of all risk levels at the end of the selected period
* Changes in the number of vulnerabilities of all risk levels for the selected period

![!Scanner widget](../images/user-guides/dashboard/dashboard-scanner.png)

----------

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/6KBn59aGFxQ" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>