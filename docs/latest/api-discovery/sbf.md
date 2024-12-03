# Sensitive Business Flows <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm's [API Discovery](overview.md) automatically marks specific endpoints as the key ones for some sensitive business flows, such as authentication or account management, billing or SMS gateways functioning, and others. Learn from this article how to use the sensitive business flow functionality.

## Addressed issues

The abuse of the sensitive business flows is ranked six ([API6](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)) among OWASP API Top 10 risks. Wallarm allows clearly identify the endpoints tied to such flows to:

* Regularly monitor and audit these endpoints for vulnerabilities or breaches.
* Prioritize them for development, maintenance, and security efforts.
* Implement stronger security measures (e.g., encryption, authentication, access controls, and rate limits).
* Easily produce audit trails and evidence of data protection measures.

## Automatic marking

On finding a new endpoint, API Discovery automatically checks if it potentially belongs to one or several sensitive business flows:

--8<-- "../include/default-sbf.md"

Automatic checking is performed based on the keywords from the endpoint URL, for example, `payment`, `subscription` `purchase`, etc. for the **Billing** flow or `auth`, `token`, `login`, etc. for **Authentication**. If matches are found, the endpoint is automatically assigned to the corresponding flow(s).

If necessary, later you can manually adjust the list of assigned business flows as described in the section below.

## Marking endpoints manually

To adjust the results of [automatic marking](#automatic-marking), you can manually edit the list of sensitive business flow the endpoint belongs to. You can also manually mark endpoints that do not directly fall under the keyword list.

To edit the list of flows the endpoint belongs to, in Wallarm Console, go to API Discovery, then for your endpoint, in the **Business flow & sensitive data**, select one or several flows from the list.

![API Discovery - Sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

You can do the same in the endpoint details.

## Business flows in Sessions

Wallarm's [API Sessions](../api-sessions/overview.md) group requests of your applications' traffic into user sessions. If some of these requests target the endpoints that in API Discovery were marked as important for some sensitive business flows, such session will be [marked](../api-sessions/exploring.md#sensitive-business-flows) as affecting this business flow as well.

![!API Sessions - sensitive business flows](../images/api-sessions/api-sessions-sbf-no-select.png)

## Filtering by business flow

Once endpoints are marked with the business flow tags, you can quickly get the list of endpoints belonging to specific business flow to analyze their current state and data.

To do that, use the **Business flow** filter.


![API Discovery - Filtering by sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)
