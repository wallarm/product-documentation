# Blocking in API Sessions <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

As Wallarm's API Sessions aim to provide full visibility into user sessions within your traffic, this visibility includes information about Wallarm intervention into session's traffic flow, particularly, request that were by different reasons defined as part of attack, marked as such and, if configured, blocked.

This includes requests marked as part of attack/blocked by different [tools for attack detection](../about-wallarm/protecting-against-attacks.md#tools-for-attack-detection):

* [Input validation attacks](../attacks-vulns-list.md#attack-types) (SQL injection, cross‑site scripting, remote code execution, path traversal and others) found by [basic set of detectors](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors). Such requests are handled in accordance with the [filtration mode](../admin-en/configure-wallarm-mode.md) for the target endpoint.
* Requests [filtered by IP](../user-guides/ip-lists/overview.md) - source is in the IP Denylist or Graylist, put there for specific time or forever:

    * Manually by security specialist
    * Automatically by [custom rule](../user-guides/rules/rules.md) or [mitigation control](../about-wallarm/mitigation-controls-overview.md)
    * Automatically by [API Abuse Prevention](../api-abuse-prevention/overview.md)

* Requests [filtered by session](#blocking-sessions) itself - session the request is grouped into in in the Session Denylist, put there for specific time or forever:

    * Manually by security specialist
    * Automatically by [mitigation control](../about-wallarm/mitigation-controls-overview.md)

## Blocking sessions

Wallarm can block the entire user session by putting it in the Session Denylist for specific time or forever. While session is in the list, its request are blocked:

* All requests (**All applications** option, default)
* Only session requests targeting specific [application(s)](../user-guides/settings/applications.md), others will not be blocked

### Manual blocking

To manually block the session:

1. In Wallarm Console go to **API Sessions**.
1. Expand the session details.
1. Click **Add to denylist**.
1. In the **Add session to Denylist** dialog, if necessary, select [applications](../user-guides/settings/applications.md) or leave the default **All applications** option.
1. Set time for session to stay in Denylist.
1. Optionally, type the reason of adding the session to Denylist.

    ![!API Sessions - add session to denylist](../images/api-sessions/api-sessions-add-session-to-denylist.png)

1. Click **Add**. The session obtains the **Blocked** status, the corresponding record appears in the Wallarm Console → **IP & Session Lists** → **Session lists** → **Denylist**. All further requests of the session will now be blocked.

To unblock the session, in Wallarm Console, do one of the following:

* Go to **API Sessions**, blocked session details, click **Unblock the session**.
* Go to **IP & Session Lists** → **Session lists** → **Denylist**, from the record menu, select **Delete session**.

Note that Session Denylist by default is in **Now** state and displays sessions that are blocked now. However you can select specific date range, than the list will also display sessions that were in the list in that period but now are not in the list and thus are not blocked.

![!IP & Session Lists - Session Denylist](../images/api-sessions/api-sessions-denylist.png)

Such historical records will contain information on when they were removed from Denylist and by whom. For any record (current and historical), you can view the corresponding session details, by selecting **View session details** from the record menu.

### Automatic blocking

The session can be blocked automatically by [mitigation control](../about-wallarm/mitigation-controls-overview.md). In that case, in **API Sessions**, it will obtain the **Blocked** status, in session details, blocked requests will be highlighted, from request details you can click link to the corresponding blocking record in Session Denylist, there, in the **Added by** column you will see the name and link to the mitigation control that put session in the list.

Click this link to view the details on mitigation control configuration and adjust if necessary.

Automatic blocking may be not forever, in that case, at specified moment, the session will be automatically unblocked. Historical record will remain in Session Denylist.

## Viewing all blocked requests

As we mentioned in the introduction of this article, there can be different reasons of request blocking within a session. Whatever reason was, Wallarm provides a clear picture of all attacks (not obligatory blocked) and blocks within the session.

Consider the following:

* [Long sessions](exploring.md#multi-day-sessions) are split into one-day parts, no parts older than 7 days are stored and displayed.
* Detected attacks are listed in session details, left panel. Click filter mark in attack type to see in session details only the requests related to this attack type.
* Not all request that are defined as part of attack, are blocked. Distinguish those that were blocked by red background highlight.
* Expand blocked request details to see information about attack and a reason of blocking.
* If reason of blocking is IP Denylist or Session Denylist, you can click link to navigate to corresponding records there; in the list itself, you'll see the reason of being in this list and link to this reason (for example, to [mitigation control](../about-wallarm/mitigation-controls-overview.md)).
* Even in the currently **Blocked** session, there can be unblocked requests (as session was not always blocked).
* Even in the session that is not currently blocked, there can be blocked requests (different reasons, discussed in the introduction of this article), including blocked by session if session was blocked at some period in past.
