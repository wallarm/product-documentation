# API Abuse Prevention profile management <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

In the **API Abuse Prevention** section of Wallarm Console you can manage API abuse profiles that are required for configuration of the [**API Abuse Prevention**](../about-wallarm/api-abuse-prevention.md) module.

The section is only available to the users of the following [roles](../user-guides/settings/users.md#user-roles):

* **Administrator** or **Analyst** for the regular accounts.
* **Global Administrator** or **Global Analyst** for the accounts with the multitenancy feature.

## Creating API abuse profile

To create an API abuse profile:

1. In Wallarm Console → **API Abuse Prevention**, click **Create profile**.
1. Select applications to protect.
1. Select [tolerance](../about-wallarm/api-abuse-prevention.md#tolerance) level.
1. If necessary, in the **Protect from** section, limit the [types of bots](../about-wallarm/api-abuse-prevention.md#automated-threats-blocked-by-api-abuse-prevention) to protect from.
1. Select the appropriate [reaction to malicious bots](../about-wallarm/api-abuse-prevention.md#reaction-to-malicious-bots).
1. If reaction is to add to deny- or graylist, set the time during which the IP will be in the list. Default value is `Add for a day`. 
1. Set name and optionally description.

    ![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

    Once the API abuse profile is configured, the module will start the [traffic analysis and blocking supported automated threats](../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works).

## Disabling API abuse profile

Disabled profiles are the ones that the **API Abuse Prevention** module does not use during traffic analysis but that are still displayed in the profile list. You can re-enable disabled profiles at any moment. If there are no enabled profiles, the module does not block malicious bots.

You can disable the profile by using the corresponding **Disable** option.

## Deleting API abuse profile

Deleted profiles are the ones that cannot be restored and that the **API Abuse Prevention** module does not use during traffic analysis.

You can delete the profile by using the corresponding **Delete** option.

## Exploring blocked malicious bots and their attacks

The **API Abuse Prevention** module blocks bots by adding them to the [denylist](../user-guides/ip-lists/denylist.md) or [graylist](../user-guides/ip-lists/graylist.md) for 1 hour.

You can explore blocked bot's IPs in Wallarm Console → **IP lists** → **Denylist** or **Graylist**. Explore IPs added with the `Bot` **Reason**.

![Denylisted bot IPs](../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)

!!! info "Confidence"
    As a result of [detectors' work](../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works), every detected bot obtain **confidence percentage**: how sure we are that this is a bot. In each bot type, detectors have different relative importance / number of votes. Thus, the confidence percentage is the votes gained out of all possible votes in this bot type (provided by detectors that worked).

You can interfere in the bot protection process. If denylisted or graylisted IP actually is not used by a malicious bot, you can either delete the IP from the list or [allowlist](../user-guides/ip-lists/allowlist.md) it. Wallarm does not block any requests originating from allowlisted IPs including malicious ones.

You can also explore bot API abuse attacks performed by bots in Wallarm Console → **Attacks** section. Use the `api_abuse`, `account_takeover`, `scraping` and `security_crawlers` search keys or select the appropriate options from the **Type** filter.

![API Abuse events](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

Bot information is visualized in three heatmaps. In all heatmaps, the bigger the bubble, the closer it to red color and to the right upper corner - the more reasons to consider this IP to be a bot.

On the heatmaps, you can also compare you current bot (**this bot**) with the other bots that attacked the same application within the past 24 hours. If too many bots did that, only 30 most suspicious will be displayed.

The heatmaps:

* **Performance** visualizes the performance of the current and other detected bots including their request non-uniqueness, scheduled requests, RPS, and request interval.
* **Behavior** visualizes the suspicious behavior score of the current and other detected bots including their degree of suspicious behavior, amount of requests to critical or sensitive endpoints, RPS and the number of bot detectors that detected them as bots.
* **HTTP errors** visualizes the API errors caused by bot activities including the number of different endpoints they target, the number of unsafe requests they make, their RPS, and the number of error response codes they receive.

Each heatmap includes detailed description of its bubble size, color and position meaning (use **Show more**). You can zoom in heatmap by drawing rectangular around required area.

The **API Abuse Prevention** module compiles client traffic into URL patterns. The URL pattern may have the following segments:

| Segment | Contains | Example |
|---|---|---|
| SENSITIVE | URL parts that provide access to the application's critical functions or resources, such as the admin panel. They should be kept confidential and restricted to authorized personnel to prevent potential security breaches. | `wp-admin` |
| IDENTIFIER | Various identifiers like numeric identifiers, UUIDs, etc. | - |
| STATIC | The folders that contain static files of different kinds. | `images`, `js`, `css` |
| FILE | Static file names. | `image.png` |
| QUERY | Query parameters. | - |
| AUTH | Content related to the authentication/authorization endpoints. | - |
| LANGUAGE | Language-related parts. | `en`, `fr` |
| HEALTHCHECK | Content related to the health check endpoints. | - |
| VARY | The segment is marked as VARY if it is impossible to attribute it to other categories. A variable part of the URL path. | - |

## Working with exception list

To mark some IPs as associated with legitimate bots or crawlers to avoid blocking them by API Abuse Prevention, use the [**Exception list**](../about-wallarm/api-abuse-prevention.md#exception-list).

You add IP address or range to the exception list and specify target application: this causes that any requests from these addresses to the target application will not lead to marking these addresses as malicious bots and they will not be added to [deny-](../user-guides/ip-lists/denylist.md) or [graylist](../user-guides/ip-lists/graylist.md) by API Abuse Prevention.

There are two ways of adding IP addresses to the exception list:

* From the **API Abuse Prevention** section → **Exception list** tab via **Add exception**. Here, besides IPs and subnets, you can add locations and source types that should be ignored by API Abuse Prevention.

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

* From the **Attacks** section: use the `api_abuse`, `account_takeover`, `scraping` and `security_crawlers` search keys or select the appropriate options from the **Type** filter, then expand the required event and click **Add to exception list**.

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

When the IP address is added to the exception list, the address is automatically removed from [deny-](../user-guides/ip-lists/denylist.md) or [graylist](../user-guides/ip-lists/graylist.md), but only if it was added there by API Abuse Prevention itself (has a `Bot` reason).

!!! info "Blocking other attack types from IP"
    If an IP from the exception list produces other [attack types](../attacks-vulns-list.md), like brute force or input validation attacks and others, Wallarm blocks such requests.

By default, the IP is added to the exception list forever. You can change this and set time when the address should be removed from the exception list. You can also remove address from exceptions immediately at any moment.

The **Exception list** tab provides the historical data - you can view items that were presented in the list within the selected period of time in past.
