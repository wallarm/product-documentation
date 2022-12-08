# API Abuse Prevention <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The **API Abuse Prevention** module of the Wallarm platform delivers detection and mitigation of bots performing API abuse like credential stuffing, fake account creation, content scraping and other malicious actions targeted at your APIs.

## Automated threats blocked by API Abuse Prevention

The **API Abuse Prevention** module detects the following automated threats by default:

* API abuse targeted at server response time increase or server unavailability. Usually, it is achieved by malicious traffic spikes.
* [Credential stuffing](https://owasp.org/www-community/attacks/Credential_stuffing) is the automated injection of stolen user credentials into website login forms, in order to fraudulently gain access to user accounts.
* [Fake account creation](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-019_Account_Creation) and [Spamming](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-017_Spamming) are creation of fake accounts or confirmation of fake content (e.g. feedback). Usually, it does not result in service unavailability but slows down or degrades regular business processes, e.g.:

    * Processing of real user requests by the support team
    * Collecting real user statistics by the marketing team
* [Scalping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-005_Scalping) is characterized by bots making online store products unavailable for real customers, e.g. by reserving all items so that they become out of stock but do not make any profit.
* [Vulnerability scanning](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-014_Vulnerability_Scanning) is characterized by service vulnerability search.
* [Scraping](https://owasp.org/www-project-automated-threats-to-web-applications/assets/oats/EN/OAT-011_Scraping) is collecting accessible data and/or processed output from the application that may result in private or non-free content becoming available for any user.
* [Broken Object Level Authorization (BOLA)](../attacks-vulns-list.md#broken-object-level-authorization-bola). Attackers can exploit API endpoints that are vulnerable to broken object level authorization by manipulating the ID of an object that is sent within the request. This may lead to unauthorized access to sensitive data.

## How API Abuse Prevention works?

The **API Abuse Prevention** module uses the complex bot detection model that involves ML-based methods as well as statistical and mathematical anomaly search methods and cases of direct abuse. The module self-learns the normal traffic profile and identifies dramatically different behavior as anomalies.

For the module to identify anomaly traffic as originating from malicious bots, the module relies on many metrics, e.g.:

* Rate of anomaly API endpoint calls per interval
* Rate of API calls originating from an IP per interval
* Rate of unique API endpoints requested by an IP
* Response codes
* Request headers, etc

If the metrics point to [bot attack signs](#automated-threats-blocked-by-api-abuse-prevention), the module [denylists or graylists](#reaction-to-malicious-bots) the source of the anomaly traffic for 1 hour. The metrics value is reflected in the confidence rate of each bot's IP in the Wallarm Console UI.

The solution deeply observes traffic anomalies before attributing them as malicious bot actions and blocking their origins. Since metric collection and analysis take some time, the module does not block malicious bots in real-time once the first malicious request originated but significantly reduces abnormal activity on average.

## Activating API Abuse Prevention

The **API Abuse Prevention** module in the disabled state is delivered with [all forms of the Wallarm node 4.2 and above](../admin-en/supported-platforms.md) including the CDN node.

To activate API Abuse Prevention:

1. Make sure that your traffic is filtered by the Wallarm node 4.2 or later.
1. Add the **API Abuse Prevention** [module](../about-wallarm/subscription-plans.md#modules) to your subscription. To add the module, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. In Wallarm Console → **API Abuse Prevention**, create or enable at least one [API Abuse profile](../user-guides/api-abuse-prevention.md).

    !!! info "Access to API Abuse Prevention settings"
        Only [administrators](../user-guides/settings/users.md#user-roles) of your company Wallarm account can access the **API Abuse Prevention** section. Contact your administrator if you do not have this access.

    ![!API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

## Accuracy

You can configure how strictly the signs of a malicious bot are monitored and thus control the number of false positive detections. This is set with the **Accuracy** parameter within [API Abuse profiles](../user-guides/api-abuse-prevention.md#creating-api-abuse-profile).

There are three available levels:

* **Low** - detects 100% of bot requests, but may block some legitimate requests due to false positives.
* **Normal** - optimizes rules to prevent most malicious bots' requests from reaching APIs, while avoiding excessive false positives. This is a default value.
* **High** - no legitimate requests will be dropped but the risk of malicious bot’s requests reaching the API is higher.

## Reaction to malicious bots

You can configure API Abuse Prevention to react to malicious bots in one of the following ways:

* **Add to denylist**: Wallarm will [denylist](../user-guides/ip-lists/denylist.md) bots' IPs and block all traffic these IPs produce.
* **Add to graylist**: this reaction allows you to try the API Abuse Prevention functionality avoiding bots' blocking.

    Wallarm will register bots' attacks and put bots' IPs to the [graylists](../user-guides/ip-lists/denylist.md) but will not block traffic these IPs produce.

    If you use filtering node in the safe blocking [mode](../admin-en/configure-wallarm-mode.md), some attacks originating from graylisted IPs will be blocked. [Read more](../user-guides/ip-lists/graylist.md)

## Exploring malicious bots and their attacks

You can explore the bots' activity in the Wallarm Console UI as follows:

* Explore malicious bots in the **IP lists** section
* View API abuse performed by bots in the **Events** section

[Learn how to explore the bots' activity →](../user-guides/api-abuse-prevention.md#exploring-blocked-malicious-bots-and-their-attacks)
