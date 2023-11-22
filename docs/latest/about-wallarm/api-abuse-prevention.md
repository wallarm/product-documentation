# API Abuse Prevention <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Abuse Prevention** module of the Wallarm platform delivers detection and mitigation of bots performing API abuse like credential stuffing, fake account creation, content scraping and other malicious actions targeted at your APIs.

## Automated threats blocked by API Abuse Prevention

The **API Abuse Prevention** module detects the following bot types by default:

* [API abuse](../attacks-vulns-list.md#api-abuse)
* [Account takeover](../attacks-vulns-list.md#api-abuse-account-takeover)
* [Security crawlers](../attacks-vulns-list.md#api-abuse-security-crawlers)
* [Scraping](../attacks-vulns-list.md#api-abuse-scraping)

During the [API abuse profile setup](../user-guides/api-abuse-prevention.md#creating-api-abuse-profile), you can configure the **API Abuse Prevention** module to protect from all types of bots or limit protection only for specific threats.

## How API Abuse Prevention works?

The **API Abuse Prevention** module uses the complex bot detection model that involves ML-based methods as well as statistical and mathematical anomaly search methods and cases of direct abuse. The module self-learns the normal traffic profile and identifies dramatically different behavior as anomalies.

API Abuse Prevention uses multiple detectors to identify the malicious bots. The module provides statistics on what detectors were involved in marking the ones.

The following detectors may be involved:

* **Request interval** analyzing the time intervals between consecutive requests to find lacks the randomness which is the sign of bot behavior.
* **Request uniqueness** analyzing the number of unique endpoints visited during a session. If a client consistently visits a low percentage of unique endpoints, such as 10% or less, it is likely that it is a bot rather than a human user.
* **Request rate** analyzing the number of requests made in a specific time interval. If an API client consistently makes a high percentage of requests over a certain threshold, it is likely that it is a bot rather than a human user.
* **Bad user-agent** analyzing the `User-Agent` headers included in requests. This detector checks for specific signatures, including those belonging to crawlers, scrapers, and security checkers.
* **Outdated browser** analyzing the browser and platform used in requests. If a client is using an outdated or unsupported browser or platform, it is likely that it is a bot rather than a human user.
* **Suspicious behavior score** analyzing usual and unusual business logic API requests taken during a session. 
* **Business logic score** analyzing usage of the critical or sensitive API endpoints within the context of your application behavior.
* **Wide scope** analyzing breadth of IP activity to behaviorally identify crawler-like bots.

!!! info "Confidence"
    As a result of detectors' work, every [detected](../user-guides/api-abuse-prevention.md#exploring-blocked-malicious-bots-and-their-attacks) bot obtain **confidence percentage**: how sure we are that this is a bot. In each bot type, detectors have different relative importance / number of votes. Thus, the confidence percentage is the votes gained out of all possible votes in this bot type (provided by detectors that worked).

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

If one or several detectors point to [bot attack signs](#automated-threats-blocked-by-api-abuse-prevention), the module [denylists or graylists](#reaction-to-malicious-bots) the source of the anomaly traffic for 1 hour. Wallarm counts bot IPs that were deny- and graylisted within 30 days and displays how many percents these amounts increased or decreased compared to the previous 30 day period.

The solution deeply observes traffic anomalies before attributing them as malicious bot actions and blocking their origins. Since metric collection and analysis take some time, the module does not block malicious bots in real-time once the first malicious request originated but significantly reduces abnormal activity on average.

## Activating API Abuse Prevention

The **API Abuse Prevention** module in the disabled state is delivered with [all forms of the Wallarm node 4.2 and above](../installation/supported-deployment-options.md) including the CDN node.

To activate API Abuse Prevention:

1. Make sure that your traffic is filtered by the Wallarm node 4.2 or later.
1. Make sure your [subscription plan](subscription-plans.md#subscription-plans) includes **API Abuse Prevention**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. In Wallarm Console → **API Abuse Prevention**, create or enable at least one [API Abuse profile](../user-guides/api-abuse-prevention.md).

    !!! info "Access to API Abuse Prevention settings"
        Only [administrators](../user-guides/settings/users.md#user-roles) of your company Wallarm account can access the **API Abuse Prevention** section. Contact your administrator if you do not have this access.

    ![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

## Tolerance

You can configure how strictly the signs of a malicious bot are monitored and thus control the number of false positive detections. This is set with the **Tolerance** parameter within [API Abuse profiles](../user-guides/api-abuse-prevention.md#creating-api-abuse-profile).

There are three available levels:

* **Low** tolerance to bots means LESS bots access your applications, but this may block some legitimate requests due to false positives.
* **Normal** tolerance uses optimal rules to avoid many false positives and prevent most malicious bot requests from reaching APIs.
* **High** tolerance to bots means MORE bots access your applications, but then no legitimate requests will be dropped.

## Reaction to malicious bots

You can configure API Abuse Prevention to react to malicious bots in one of the following ways:

* **Add to denylist**: Wallarm will [denylist](../user-guides/ip-lists/denylist.md) bots' IPs for the selected time (default value is `Add for a day` - 24 hours) and block all traffic these IPs produce.
* **Add to graylist**: Wallarm will [graylist](../user-guides/ip-lists/graylist.md) bots' IPs for the selected time (default value is `Add for a day` - 24 hours) and block only requests originating from these IPs and containing the signs of the following attacks:

    * [Input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
    * [Attacks of the vpatch type](../user-guides/rules/vpatch-rule.md)
    * [Attacks detected based on regular expressions](../user-guides/rules/regex-rule.md)

* **Only monitor**: Wallarm will display the detected bot activity in the [**Attacks**](../user-guides/events/check-attack.md) section but will add the bot's IP neither to deny- nor to graylist. 

    From such events details, you can quickly block the bot with the **Add source IP to denylist** button. The IP is added to the denylist forever, but in the **IP Lists** section you can delete it or change the time of staying in the list.

## Exploring malicious bots and their attacks

You can explore the bots' activity in the Wallarm Console UI as follows:

* Explore malicious bots in the **IP lists** section
* View API abuse performed by bots in the **Attacks** section

[Learn how to explore the bots' activity →](../user-guides/api-abuse-prevention.md#exploring-blocked-malicious-bots-and-their-attacks)

## Exception list

An exception list is a list of IP addresses, subnets, locations and source types that are known to be associated with legitimate bots or crawlers, and are therefore exempt from being blocked or restricted by the API Abuse Prevention module.

You can add IP addresses to the exception list in advance or if they have already been mistakenly flagged as being associated with malicious bot activity. [Learn how to work with exception list →](../user-guides/api-abuse-prevention.md#working-with-exception-list)

![API Abuse prevention - Exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list.png)

## Disabling bot protection for specific URLs and requests

In addition to marking good bots' IPs via [exception list](#exception-list), you can disable bot protection both for URLs that the requests target and for the particular request types, for example, for the requests containing specific headers.

This may help to avoid false positive detections and may be also helpful in case of testing your applications when you may need to temporarily disable bot protection for some of their endpoints.

Note that comparing to other API Abuse Prevention configuration, this ability is configured **not** within the API Abuse [profile](../user-guides/api-abuse-prevention.md), but separately - with the help of the [**Set API Abuse Prevention mode**](../user-guides/rules/api-abuse-url.md) rule.
