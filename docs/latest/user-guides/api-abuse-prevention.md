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
1. Select to [add bots in denylist or graylist](../about-wallarm/api-abuse-prevention.md#reaction-to-malicious-bots).
1. Set name and optionally description.

    ![!API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

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

![!Denylisted bot IPs](../images/about-wallarm-waf/abi-abuse-prevention/denylisted-bot-ips.png)

If denylisted or graylisted IP actually does not belong to a malicious bot, you can either delete the IP from the list or [allowlist](../user-guides/ip-lists/allowlist.md) it. Wallarm does not block any requests originating from allowlisted IPs including malicious ones.

You can also explore bot API abuse attacks performed by bots in Wallarm Console → **Events** section. Use `api_abuse` search key or select `API Abuse` from the **Type** filter.


![!API Abuse events](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-events.png)

Bot information is visualized in three bubble plots. In all plots, the bigger the bubble, the closer it to red color and to the right upper corner - the more reasons to consider this IP to be a bot.

On the plots, you can also compare you current bot (**this bot**) with the other bots that attacked the same application within the past 24 hours. If too many bots did that, only 30 most suspicious will be displayed.

The bubble plots:

* **Bot performance** displays intensity of bot activities, including:

    * Bubble size: request non-uniqueness, the more the IP requested the same (not unique) API endpoints, the larger the size is.
    * Color: scheduled requests, the more the IP requested API endpoints due to the schedule (the same time intervals), the closer the color is to the red.
    * Horizontally: the more RPS (requests per second), the farther the bubble is to the right.
    * Vertically: the higher the request rate (how fast the IP sends the requests), the higher the bubble is on the graph. Comparing to RPS: IP can send 3 requests per second (which is not a lot), but do that within 3 milliseconds (which is very fast).

* **Bot behavior** displays different aspects of the bot behavior, including:

    * Bubble size: business logic score, the more often among all your API endpoints the IP requested critical or sensitive ones, the larger the size is.
    * Color: suspicious behavior score, the more often among all your API endpoints the IP requested the ones that were unusual for normal user to be interested in your application, the closer the color is to the red.
    * Horizontally: the more RPS (requests per second), the farther the bubble is to the right.
    * Vertically: the more bot detectors made "this is a bot" decision, the higher the bubble is on the graph.

* **Bot scope** displays bot relation to its targets, including:

    * Bubble size: the more different API endpoints the IP requested, the larger the size is.
    * Color: the more requests with unsafe method the IP requested, the closer the color is to the red.
    * Horizontally: the more RPS (requests per second), the farther the bubble is to the right.
    * Vertically: the more error responses (4XX, 5XX) from the origin server, the higher the bubble is on the graph.

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
