# Control over Export to Cloud

You can have full visibility and control on which data is exported from Wallarm node to Cloud. This article describes how to achieve this.

## Overview

The following data is sent from Wallarm node to Cloud:

| Where to | What for | What data | How to control |
| ----- | ----- | ----- | ----- |
| Statistics | To [see](../user-guides/dashboards/threat-prevention.md) numbers of you traffic - normal vs. malicious.| Number of requests, their sources and targets. No sensitive data ever. ||
| **Attacks, Incidents** | To analyze security event and apply measures. | Full HTTP data of malicious request. | <ul><li>Sensitive data types<sup>*</sup></li><li>Limit data export rules<sup>*</sup></li><li>Data export allowlist<sup>*</sup></li><li>Mask sensitive data</li></ul>[Details...](#attacks-incidents) |
| **API Sessions** | To see full sequence of connected actions (session). | Request metadata + what you chose (context parameters). | <ul><li>Session context parameters (with hashing)</li></ul>[Details...](#api-sessions) |
| API Discovery ||||
| Security Issues ||||

<small><sup>*</sup> This feature is currently under construction, arriving soon.</small>

## Attacks, Incidents

**What the data from Wallarm node is sent for**: for you to have all necessary information for analysis of the security event.

**What data is sent and how to control**

* In [Attacks](../user-guides/events/check-attack.md), you see information on all malicious requests ([input validation](../attacks-vulns-list.md#attack-types) attacks) and malicious behavior ([behavioral](../attacks-vulns-list.md#attack-types) attacks) registered by Wallarm, except:

    * Incidents - displayed separately
    * Attacks displayed exclusively in API Sessions

* [Incidents](../user-guides/events/check-incident.md) are attacks that successfully exploited the [security issue](../about-wallarm/detecting-vulnerabilities.md) (vulnerability) previously [detected](../about-wallarm/detecting-vulnerabilities.md#detection-methods) by Wallarm. These attacks were detected, but not blocked by Wallarm due to the current settings (`monitoring` [filtration mode](../admin-en/configure-wallarm-mode.md) or others). Information on incident is the same as for attack plus link to security issue.
* For input validation attacks, full HTTP data of malicious request is sent.

To control:

* Sensitive data types (arriving soon): Wallarm's API Discovery can by default detect different types of sensitive data transferred by endpoints/parameters. You can modify the default rules, add your own, and **enable automatic masking** (not available yet) for found sensitive data.
* Limit data export rules (arriving soon): create rules of this type for your endpoints or applications to switch for them from full malicious request data to metadata only. When full export is disabled, the node sends only the request method, URI, IP address, HTTP status code, request time, and the `Host` header. The body, query parameters, and other headers are excluded from both requests and responses. "Keep headers" mode is available.
* Data export allowlist (arriving soon): only values of parameters you list here will be able to leave you security perimeter - the others will never do so.
* [Mask sensitive data](../user-guides/rules/sensitive-data-rule.md): create rules of this type for your endpoints or applications to set which request point values should be cut before sending - values will never leave your security perimeter.
* **Combining methods**: Wallarm never transmits parameter values except the ones of malicious requests. Even this can be disabled by **Limit data export** rules, and enabled only for specific endpoints. Even for enabled endpoints, only values of parameters added to **Data export allowlist** list will be exported. Examples:

    * No rules or settings - parameter values are exported only for input validation attacks.
    * TBD
    * Diagram TBD

## API Sessions

**What the data from Wallarm node is sent for**: for you to see full sequence of connected actions (session) targeting your applications.

**What data is sent and how to control**

* In [API Sessions](../api-sessions/overview.md), you see all requests (both legitimate and malicious) going through Wallarm Node to your applications.
* However, for each request, only its metadata is send by default (time, source IP, target endpoint, response code).
* Additionally, parameters used for [grouping](../api-sessions/setup.md#session-grouping) request into this session along with their values, will be displayed.
* As all that info may be non-informative enough, you add [extra parameters](../api-sessions/setup.md#session-context) to be displayed. With them, you'll be able to understand what is happening. They will be sent to the Cloud along with values.

To control:

* [Session context parameters](../api-sessions/setup.md#session-context): add only **parameters you really need**. Note that some mitigation controls rely on session data and need some parameter values, such controls can [themselves](../api-sessions/setup.md#mitigation-controls) add extra parameters to session.
* Use [hashing](../api-sessions/setup.md#data-protection) for the parameter values. Note that hashing will transform the actual value into unreadable - the presence of parameter and particular but unknown value will provide the limited information for the analysis.
