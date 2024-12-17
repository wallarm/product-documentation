# Sensitive Business Flows <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

With the [sensitive business flow](sbf.md) capability, Wallarm's [API Discovery](overview.md) can automatically identify endpoints that are critical to specific business flows and functions, such as authentication, account management, billing, and similar critical capabilities. Learn from this article how to use the sensitive business flow functionality.

## Addressed issues

The abuse of the sensitive business flows is ranked six ([API6](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)) among OWASP API Top 10 risks. Wallarm allows clearly identify the endpoints tied to such flows to:

* Regularly monitor and audit these endpoints for vulnerabilities or breaches.
* Prioritize them for development, maintenance, and security efforts.
* Implement stronger security measures (e.g., encryption, authentication, access controls, and rate limits).
* Easily produce audit trails and evidence of data protection measures.

## Automatic tagging

On finding a new endpoint, API Discovery automatically checks if it potentially belongs to one or several sensitive business flows:

--8<-- "../include/default-sbf.md"

Automatic checking is performed based on the keywords from the endpoint URL, for example, `payment`, `subscription` `purchase`, etc. for the **Billing** flow or `auth`, `token`, `login`, etc. for **Authentication**. If matches are found, the endpoint is automatically assigned to the corresponding flow(s).

If necessary, later you can manually adjust the list of assigned business flows as described in the section below.

## Tagging endpoints manually

To adjust the results of [automatic tagging](#automatic-tagging), you can manually edit the list of sensitive business flow the endpoint belongs to. You can also manually tag endpoints that do not directly fall under the keyword list.

To edit the list of flows the endpoint belongs to, in Wallarm Console, go to API Discovery, then for your endpoint, in the **Business flow & sensitive data**, select one or several flows from the list.

![API Discovery - Sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

You can do the same in the endpoint details.

## Business flows in Sessions

Wallarm's [API Sessions](../api-sessions/overview.md) are used to provide you with the full sequence of user activities and thus give more visibility into the logic of malicious actors. If session's requests affect the endpoints that in API Discovery were tagged as important for some sensitive business flows, such session will be automatically [tagged](../api-sessions/exploring.md#sensitive-business-flows) as affecting this business flow as well.

Once sessions are assigned with the sensitive business flow tags, it becomes possible to filter them by a specific business flow which makes it easier to select the sessions that are most important to analyze.

![!API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-no-select.png)

## Filtering by business flow

Once endpoints are assigned with the sensitive business flow tags, it becomes possible to filter all discovered endpoint by a specific business flow (the **Business flow** filter) which makes it easier on protecting the most critical business capabilities.

![API Discovery - Filtering by sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)
