# Exploring Bot Activity <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Abuse Prevention](../api-abuse-prevention/overview.md) identifies malicious bot activity based on ML algorithms. Such attacks are impossible to analyze based on a single blocked request. Therefore, it is essential that the Wallarm platform offers a wide range of tools to investigate bot activity from different angles.
 
<!--## Blocked bots in IP Lists

The **API Abuse Prevention** module blocks bots by adding them to the [denylist](../user-guides/ip-lists/overview.md) or [graylist](../user-guides/ip-lists/overview.md) for 1 hour.

You can explore blocked bot's IPs in Wallarm Console → **IP lists** → **Denylist** or **Graylist**. Explore IPs added with the `Bot` **Reason**.

![Denylisted bot IPs](../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)

!!! info "Confidence"
    As a result of [detectors' work](../api-abuse-prevention/overview.md#how-api-abuse-prevention-works), every detected bot obtain **confidence percentage**: how sure we are that this is a bot. In each bot type, detectors have different relative importance / number of votes. Thus, the confidence percentage is the votes gained out of all possible votes in this bot type (provided by detectors that worked).

You can interfere in the bot protection process. If denylisted or graylisted IP actually is not used by a malicious bot, you can either delete the IP from the list or [allowlist](../user-guides/ip-lists/overview.md) it. Wallarm does not block any requests originating from allowlisted IPs including malicious ones.
-->
## Statistics

API Abuse Prevention conveniently visualizes the data on bot activities for the last 30 days at the **Statistics** tab. This includes:

* **Bot activity**: general number of bot attacks and attacks by [bot type](../about-wallarm/api-abuse-prevention.md#automated-threats-blocked-by-api-abuse-prevention) for the period.
* **Top attackers**: IPs of attackers with most attacks for the period.
* **Top targets**: API hosts or paths most attacked during the period.

    Click in any section to switch to the corresponding [**Attacks**](#attacks).

* **Summary for period**: number of IPs, [deny- or graylisted](../user-guides/api-abuse-prevention.md#creating-profiles) within the period as bots with information of how many detectors identified the bot. Click to switch to **IP Lists** [history](../user-guides/ip-lists/overview.md#ip-list-history).

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

## Attacks

You can explore attacks performed by bots in Wallarm Console → **Attacks** section. Use the `api_abuse`, `account_takeover`, `scraping` and `security_crawlers` search keys or select the appropriate options from the **Type** filter.

![API Abuse events](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

Bot information is visualized in three heatmaps. In all heatmaps, the bigger the bubble, the closer it to red color and to the right upper corner - the more reasons to consider this IP to be a bot.

On the heatmaps, you can also compare you current bot (**this bot**) with the other bots that attacked the same application within the past 24 hours. If too many bots did that, only 30 most suspicious will be displayed.

The heatmaps:

* **Performance** visualizes the performance of the current and other detected bots including their request non-uniqueness, scheduled requests, RPS, and request interval.
* **Behavior** visualizes the suspicious behavior score of the current and other detected bots including their degree of suspicious behavior, amount of requests to critical or sensitive endpoints, RPS and the number of bot detectors that detected them as bots.
* **HTTP errors** visualizes the API errors caused by bot activities including the number of different endpoints they target, the number of unsafe requests they make, their RPS, and the number of error response codes they receive.

<!--Each heatmap includes detailed description of its bubble size, color and position meaning (use **Show more**). You can zoom in heatmap by drawing rectangular around required area.

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
| VARY | The segment is marked as VARY if it is impossible to attribute it to other categories. A variable part of the URL path. | - | -->

## Bot attacks in API sessions

You can easily validate detected malicious bot activity by switching from **Attacks** to [**API Sessions**](../api-sessions.md) with the **Explore the Session** button. This button is available only for attacks for which there are saved sessions (see session retention period in [limitations](../api-sessions.md#limitations) for API Sessions). Within a session, you can analyze the sequence of requests that matches the malicious pattern and find out why it was blocked. If necessary, you can view all requests within a given session to understand the full context of the behavior of the selected actor.

![API Abuse attack in API Sessions](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-in-sessions.png)

Expand the session details to identify which sequence of requests was flagged as malicious bot activity. If necessary, you can expand request details, view its content and immediately use the **Add source IP to denylist** or **Add to exception list** options.

You can switch back to the **Attacks** section using **Explore the attack**.
