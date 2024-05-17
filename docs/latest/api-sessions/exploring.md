# Exploring API Sessions <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

As soon as the [API Sessions](overview.md) discovers your user sessions, you can explore them in the **API Sessions** section of Wallarm Console. Learn from this article how to go through the discovered data.

## Viewing monitored API sessions

In the **API Sessions** section, you can view the list of the sessions automatically monitored due to the applied [configuration](setup.md). Expand session to see the included requests and statistical summary.

![!API Sessions section - monitored sessions](../images/api-sessions/api-sessions.png)

The session information includes:

* Request sequence inside the session.
* Response codes and attack types statistics.
* Information on user's IP(s).
* Request details.

You can use search and filters. In search, fuzzy terms (`*` and `?`) are acceptable. The search will be performed on the endpoints that were accessed in the sessions.

## Inspecting sessions with requests to shadow APIs

You can [get a list of shadow API endpoints](../api-discovery/rogue-api.md#viewing-found-rogue-apis) using the **API Discovery** module. Then, in **API Sessions**, use search to get the list of sessions with requests to these endpoints.

## Analyzing session performance issues

You can analyze session performance issues by expanding the session and then sorting its requests by the **Response time** column.
