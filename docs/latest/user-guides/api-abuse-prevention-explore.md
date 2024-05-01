# Exploring Detected Bots <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to view the information about malicious bots detected by the [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) module and attacks performed by these bots.
 
## Blocked bots in IP Lists

The **API Abuse Prevention** module blocks bots by adding them to the [denylist](../user-guides/ip-lists/overview.md) or [graylist](../user-guides/ip-lists/overview.md) for 1 hour.

You can explore blocked bot's IPs in Wallarm Console → **IP lists** → **Denylist** or **Graylist**. Explore IPs added with the `Bot` **Reason**.

![Denylisted bot IPs](../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)

!!! info "Confidence"
    As a result of [detectors' work](../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works), every detected bot obtain **confidence percentage**: how sure we are that this is a bot. In each bot type, detectors have different relative importance / number of votes. Thus, the confidence percentage is the votes gained out of all possible votes in this bot type (provided by detectors that worked).

You can interfere in the bot protection process. If denylisted or graylisted IP actually is not used by a malicious bot, you can either delete the IP from the list or [allowlist](../user-guides/ip-lists/overview.md) it. Wallarm does not block any requests originating from allowlisted IPs including malicious ones.

## Bot attacks

You can explore attacks performed by bots in Wallarm Console → **Attacks** section. Use the `api_abuse`, `account_takeover`, `scraping` and `security_crawlers` search keys or select the appropriate options from the **Type** filter.

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
