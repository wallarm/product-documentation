# Exploring API Sessions <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Intro TBD.

## Viewing monitored API sessions

In the **API Sessions** section, you can view the list of the sessions automatically monitored due to the applied [configuration](setup.md). Expand session to see the included requests.

![!API Sessions section - monitored sessions](../images/api-sessions/api-sessions.png)

These options are:

* Search and filters.
* Viewing request sequence inside each session.
* Getting response codes and attack types statistics.
* Getting information on user's IP(s).
* Viewing request details.

You can use fuzzy terms (`*` and `?`) in the search. The search will be performed on the endpoints that were accessed in the sessions.

## Inspecting sessions with requests to shadow APIs

You can [get a list of shadow API endpoints](../user-guides/api-discovery.md#displaying-shadow-api) using the **API Discovery** module. Then, in **API Sessions**, use search to get the list of sessions with requests to these endpoints.

## Analyzing session performance issues

You can analyze session performance issues by expanding the session and then sorting its requests by the **Response time** column.
