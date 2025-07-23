# Sensitive Business Flows <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

With the sensitive business flow capability, Wallarm's [API Discovery](overview.md) can automatically identify endpoints that are critical to specific business flows and functions, such as authentication, account management, billing, utilizing AI, and similar critical capabilities. Learn from this article how to use the sensitive business flow functionality.

## Addressed issues

The abuse of the sensitive business flows ranks sixth ([API6](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)) among OWASP API Top 10 risks. Protecting these sensitive business flows ensures business continuity, prevents leaking of sensitive data, reputation risks, and financial damage.

WIth the sensitive business flows capability, Wallarm highlights health of the business-critical functions and helps to:

* Regularly monitor and audit endpoints related to sensitive business flows for vulnerabilities or breaches.
* Prioritize them for development, maintenance, and security efforts.
* Implement stronger security measures (e.g., encryption, authentication, access controls, and rate limits).
* Easily produce audit trails and evidence of data protection measures.

## Automatic tagging

For your convenience, API Discovery tags endpoints as belonging to sensitive business flows automatically - on discovering a new endpoint, it checks whether this endpoint potentially belongs to one or more sensitive business flows:

--8<-- "../include/default-sbf.md"

Automatic checks are conducted using keywords from the endpoint URL (REST) or operation name (GraphQL). For example, keywords like `payment`, `subscription`, or `purchase` automatically associate the endpoint with the **Billing** flow, while keywords such as `auth`, `token`, or `login` link it to the **Authentication** flow. If matches are detected, the endpoint is automatically assigned to the appropriate flow.

The automatic tagging discovers most of the sensitive business flows. However, it is also possible to manually adjust the list of assigned business flows as described in the section below.

## Tagging endpoints manually

To adjust the results of [automatic tagging](#automatic-tagging), you can manually edit the list of sensitive business flow the endpoint belongs to. You can also manually tag endpoints that do not directly fall under the keyword list.

To edit the list of flows the endpoint belongs to, in Wallarm Console, go to API Discovery, then for your endpoint, in the **Business flow**, select one or several flows from the list.

![API Discovery - Sensitive business flows](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-sbf.png)

<!--## Business flows in Sessions

Wallarm's [API Sessions](../api-sessions/overview.md) are used to provide you with the full sequence of user activities and thus give more visibility into the logic of malicious actors. If session's requests affect the endpoints that in API Discovery were tagged as important for some sensitive business flows, such session will be automatically [tagged](../api-sessions/exploring.md#sensitive-business-flows) as affecting this business flow as well.

Once sessions are assigned with the sensitive business flow tags, it becomes possible to filter them by a specific business flow which makes it easier to select the sessions that are most important to analyze.

![!API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-no-select.png)
-->
## Filtering by business flow

Once endpoints are assigned with the sensitive business flow tags, it becomes possible to filter all discovered endpoint by a specific business flow (the **Business flow** filter) which makes it easier on protecting the most critical business capabilities.

![API Discovery - Filtering by sensitive business flows](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-sbf-filter.png)
