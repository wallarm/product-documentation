# API Abuse Prevention <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Abuse Prevention** module of the Wallarm platform delivers detection and mitigation of bots performing API abuse like credential stuffing, fake account creation, content scraping and other malicious actions targeted at your APIs.

## Automated threats blocked by API Abuse Prevention

The **API Abuse Prevention** module detects the following bot types by default:

* [Suspicious API activity](../attacks-vulns-list.md#suspicious-api-activity)
* [Account takeover](../attacks-vulns-list.md#account-takeover)
* [Security crawlers](../attacks-vulns-list.md#security-crawlers)
* [Scraping](../attacks-vulns-list.md#scraping)
* [Unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) (requires [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.3.0 or higher and not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far)

During the [API abuse profile setup](../api-abuse-prevention/setup.md#creating-profiles), you can configure the **API Abuse Prevention** module to protect from all types of bots or limit protection only for specific threats.

## How API Abuse Prevention works?

The **API Abuse Prevention** module uses the complex bot detection model that involves ML-based methods as well as statistical and mathematical anomaly search methods and cases of direct abuse. The module self-learns the normal traffic profile and identifies dramatically different behavior as anomalies.

API Abuse Prevention uses multiple detectors to identify the malicious bots [within their sessions](../api-sessions/overview.md#api-sessions-and-api-abuse-prevention). The module provides statistics on what detectors were involved in marking the ones.

The following detectors may be involved:

* **Bad user-agent** analyzing the `User-Agent` headers included in requests. This detector checks for specific signatures, including those belonging to crawlers, scrapers, and security checkers.
* **Authentication abuse** analyzing the ratio of authentication requests against a predetermined threshold and the number of requests per interval to identify anomalous behavior. The detector also incorporates the total volume of authentication requests for an application in order to avoid false positives.
* **Request uniqueness** analyzing the number of unique endpoints visited during a session. If a client consistently visits a low percentage of unique endpoints, such as 10% or less, it is likely that it is a bot rather than a human user.
* **Suspicious behavior score** analyzing usual and unusual business logic API requests taken during a session. 
* **Business logic score** analyzing usage of the critical or sensitive API endpoints within the context of your application behavior.
* **Request rate** analyzing the number of requests made in a specific time interval. If an API client consistently makes a high percentage of requests over a certain threshold, it is likely that it is a bot rather than a human user.
* **Request interval** analyzing the time intervals between consecutive requests to find lacks the randomness which is the sign of bot behavior.
* **Query abuse** analyzing a volume of requests that exceed a predefined threshold as an anomaly. Clients that exceed a threshold for queries that vary a parameter are also considered anomalies. Moreover, the detector compares client query patterns to normal behavior to identify bot activity.
* **Outdated browser** analyzing the browser and platform used in requests. If a client is using an outdated or unsupported browser or platform, it is likely that it is a bot rather than a human user.
* **Wide scope** analyzing breadth of IP activity to behaviorally identify crawler-like bots.
* **IP rotation** analyzing requests for being a part of the [account takeover](../attacks-vulns-list.md#account-takeover) attacks where the attackers utilize a pool of IP addresses.
* **Session rotation** analyzing requests for being a part of the [account takeover](../attacks-vulns-list.md#account-takeover) attacks where the attackers exploit a pool of sessions.
* **Persistent ATO** analyzing requests for being a part of the [account takeover](../attacks-vulns-list.md#account-takeover) attacks that occur gradually over an extended period.
* **Credential stuffing** analyzing requests for being a part of the [account takeover](../attacks-vulns-list.md#account-takeover) attacks that involve repeated login attempts with different credentials while maintaining stable request attributes ([credential stuffing](../attacks-vulns-list.md#credential-stuffing)).
* **Low-frequency credential stuffing** analyzing requests for being a part of the [account takeover](../attacks-vulns-list.md#account-takeover) attacks that are characterized by isolated or minimal authentication attempts ([credential stuffing](../attacks-vulns-list.md#credential-stuffing)) without subsequent API interaction: attackers purposefully restrict login attempts per session or client to evade detection.
* **Response time anomaly** identifying abnormal patterns in the latency of API responses that may signal automated abuse or backend exploitation attempts (marked as [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) attack, being variant of it).
* **Excessive request consumption** identifying clients that send abnormally large request payloads to the API, potentially indicating abuse or misuse of backend processing resources (marked as [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) attack, being variant of it).
* **Excessive response consumption** flagging suspicious sessions based on the total volume of response data transferred over their lifetime. Unlike detectors focused on individual requests, this detector aggregates response sizes across [an entire session](../api-sessions/overview.md) to identify slow-drip or distributed scraping attacks (marked as [unrestricted resource consumption](../attacks-vulns-list.md#unrestricted-resource-consumption) attack, being variant of it).

!!! info "Confidence"
    As a result of detectors' work, every [detected](../api-abuse-prevention/exploring-bots.md) bot obtain **confidence percentage**: how sure we are that this is a bot. In each bot type, detectors have different relative importance / number of votes. Thus, the confidence percentage is the votes gained out of all possible votes in this bot type (provided by detectors that worked).

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics-detectors.png)

If one or several detectors point to [bot attack signs](#automated-threats-blocked-by-api-abuse-prevention), the module denylists or graylists the source of the anomaly traffic for 1 hour. Wallarm counts bot IPs that were deny- and graylisted within 30 days and displays how many percents these amounts increased or decreased compared to the previous 30 day period.

The solution deeply observes traffic anomalies before attributing them as malicious bot actions and blocking their origins. Since metric collection and analysis take some time, the module does not block malicious bots in real-time once the first malicious request originated but significantly reduces abnormal activity on average.

## Setup

To start malicious bot detection and mitigation with the **API Abuse Prevention** module, create and configure one or more [API abuse profiles](../api-abuse-prevention/setup.md#creating-profiles).

To make the API Abuse Prevention functionality more precise, it is recommended to enable [JA3 fingerprinting](../admin-en/enabling-ja3.md) for better identification of the the unauthenticated traffic when combining requests into [sessions](../api-sessions/overview.md).
