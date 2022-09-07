# API Abuse Prevention

The **API Abuse Prevention** module of Wallarm API Security delivers detection and mitigation of bots performing API abuse like credential stuffing, fake account creation, content scraping and other malicious actions targeted at your APIs.

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

If the metrics point to [bot attack signs](#automated-threats-blocked-by-api-abuse-prevention), the module [denylists](#exploring-blocked-malicious-bots) the source of the anomaly traffic for 1 hour.

The solution deeply observes traffic anomalies before attributing them as malicious bot actions and blocking their origins. Since metric collection and analysis take some time, the module does not block malicious bots in real-time once the first malicious request originated but significantly reduces abnormal activity on average.

## Activating API Abuse Prevention

The **API Abuse Prevention** module in the disabled state is delivered with [all forms of the Wallarm node 4.2](../admin-en/supported-platforms.md) including the CDN node.

To activate API Abuse Prevention:

1. Make sure that your traffic is filtered by the Wallarm node 4.2 or later.

    For the **API Abuse Prevention** activation, running Wallarm node 4.2 or later is necessary since the module is delivered with the node packages and uses these packages as well.
1. Add the subscription plan for the **API Abuse Prevention** [module](../about-wallarm-waf/subscription-plans.md#modules). To add the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. Enable API Abuse Prevention for the required [applications](../user-guides/settings/applications.md) by creating the API Abuse profile in Wallarm Console → **API Abuse Prevention**.

    ![!API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

    The profile should only point to applications you want to protect from malicious bots, no specific configuration is required.

    !!! info "Access to API Abuse Prevention settings"
        Only administrators of your company Wallarm account can access the **API Abuse Prevention** section. Contact your administrator if you do not have this access.

Once the bot protection profile is configured, the module will start the [traffic analysis and blocking supported automated threats](#automated-threats-blocked-by-api-abuse-prevention).

## Exploring blocked malicious bots

The **API Abuse Prevention** module blocks bots by adding them to the [denylist](../user-guides/ip-lists/denylist.md) for 1 hour. You can explore blocked bot's IPs in Wallarm Console → **IP lists** → **Denylist**.

![!Denylisted bot IPs](../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)

If denylisted IP actually does not belong to a malicious bot, you can either delete the IP from the denylist or [allowlist](../user-guides/ip-lists/allowlist.md) it. Wallarm does not block any requests originating from allowlisted IPs including malicious ones.