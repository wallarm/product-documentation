[link-attacks]:                 ../user-guides/events/check-attack.md
[link-incidents]:               ../user-guides/events/check-incident.md
[link-sessions]:                ../api-sessions/overview.md
[link-api-abuse-prevention]:    ../api-abuse-prevention/overview.md
[img-api-sessions-api-abuse]:   ../images/api-sessions/api-sessions-api-abuse.png

# Exploring API Sessions <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

As soon as Wallarm's [API Sessions](overview.md) identified user sessions related to your applications, you can explore them in the **API Sessions** section of Wallarm Console. Learn from this article how to go through the discovered data.

## Full context of threat actor activities

--8<-- "../include/request-full-context.md"

## Activities within specific time

You can investigate what happened within the specified time interval. To do so, set the date/time filter. Only sessions with the requests that took place at specified time will be displayed - only requests from that time interval will be displayed within each session.

![!API Sessions - activities within specific time](../images/api-sessions/api-sessions-timeframe.png)

Hint: use the [link to your session](#sharing-session-information) in your own browser and **then** set time interval to see only requests from the selected session within the selected time.

## Specific activities within session

The session may contain a lot of requests of different types (POST, GET, etc.), with different response codes, from different IPs, legitimate and malicious with the different attack types.

In session details, you can see a comprehensive statistics providing information on its request distribution by different criteria. You can apply in-session filters (one or several) to see only specific requests.

![!API Sessions - filters inside session](../images/api-sessions/api-sessions-inline-filters.png)

Note that is-session filters communicate with general filters of the **API Sessions** section: 

* Any session opened after general filters applied will share these filters (inside the session, you can click **Show all requests** to cancel that).
* Use the **Apply filters** button to apply general filters within your current session.

## Inspecting affected endpoints

Use the **API Discovery insights** in the session request details to inspect the affected endpoints. You can immediately get information whether the endpoint is at risk, whether this risk is caused by the endpoint being [rogue](../api-discovery/rogue-api.md) (specifically, shadow or zombie APIs) and how well and by what measures it is protected.

![!API Sessions - APID endpoint insights](../images/api-sessions/api-sessions-apid-insight.png)

Click **Explore in API Discovery** to switch to the endpoint information in the [**API Discovery**](../api-discovery/overview.md) section.

## Identifying performance issues

Use the **Time,ms** and **Size,bytes** columns in the session request details to compare presented data with the average expected values. Significantly exceeded values signal about possible performance issues and bottlenecks and the possibility to optimize the user experience.

## Sessions by users and roles

If you [configured](setup.md#users-and-roles) API Sessions to obtain information on users and their roles, you can filter sessions by users and roles.

![!API Sessions - user and user role display](../images/api-sessions/api-sessions-user-role-display.png)

## Verifying API abuse detection accuracy

--8<-- "../include/bot-attack-full-context.md"

## Sharing session information

If you found suspicious behavior in the session and would like to share insights with colleagues and store the session for further analysis, use the **Copy link** or **Download CSV** in the session details.

![!API Sessions - sharing session information](../images/api-sessions/api-sessions-share.png)
