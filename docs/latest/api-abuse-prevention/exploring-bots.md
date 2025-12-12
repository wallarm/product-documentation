[link-attacks]:                 ../user-guides/events/check-attack.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# Exploring Bot Activity <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Abuse Prevention](../api-abuse-prevention/overview.md) identifies malicious bot activity based on ML algorithms. Such attacks are impossible to analyze based on a single blocked request. Therefore, it is essential that the Wallarm platform offers a wide range of tools to investigate bot activity from different angles.

## API abuse dashboards

API Abuse Prevention conveniently visualizes the data on bot activities for the last 30 days at the **API Abuse Prevention** section → **Statistics** tab. Using timeline diagram you can easily identify spikes in bot activity. The additional **Top Attackers** and **Top Targets** widgets allow you to determine the most active bots and the most attacked APIs and applications. You can drill down to investigate these bot activities at the **Attacks** tab in one click on the dashboard element.

You can also analyze bot behaviors at the **Behavioral patterns** in the bottom. Get detailed information on each detector and how they acted together to determine bot actions. This widget and the counters of [deny- or graylisted](setup.md#creating-profiles) IPs at the top right will link you to the **IP Lists** [history](../user-guides/ip-lists/overview.md#ip-list-history) where you can check when and for what period of time the bot's IP was placed to the blocking list.

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

If no bot activities were detected, the **Legitimate traffic** state is displayed:

![API abuse prevention statistics - no bots detected](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics-nobots.png)

Note that bot detection relies on the traffic - if there is no sufficient amount of one, API Abuse Prevention notifies about that with the **Insufficient data to build statistics** message. You can [check](setup.md#per-profile-traffic) the per-profile traffic on the **Profiles** tab.

## Attacks

You can explore attacks performed by bots in Wallarm Console → **Attacks** section. Use the `api_abuse`, `account_takeover`, `scraping` and `security_crawlers` search keys or select the appropriate options from the **Type** filter.

![API Abuse events](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

Note that:

* Even if the bot IP is placed into the denylist by API Abuse Prevention, by default, Wallarm collects and [displays](../user-guides/ip-lists/overview.md#requests-from-denylisted-ips) statistics regarding blocked requests originating from it.
* The detailed information on the bot attack is stored for 31 days: while the attack itself may remain in the **Attacks** section for a longer time, after 31 days, if you expand it, no detector values or heatmaps will be presented - `Not enough data` message will be displayed instead.

**Detector values**

Pay your attention to the list of triggered [detectors](overview.md#how-api-abuse-prevention-works) and their values showing how big the deviation from normal behavior is for particular anomalies. On the figure above, for example, they are **Query abuse** with the value `326` when normal is `< 10`, **Request interval** with the value `0.05` when normal is `> 1` and others.

**Heatmaps**

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

## Verifying API abuse detection accuracy with API Sessions

--8<-- "../include/bot-attack-full-context.md"
