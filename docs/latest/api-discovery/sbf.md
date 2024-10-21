# Sensitive Business Flows <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm's [API Discovery](overview.md) allows marking specific endpoints as the key ones for some sensitive business flows, such as authentication or account management, billing or SMS gateways functioning, and others. Learn from this article how to use the sensitive business flow functionality.

## Addressed issues

Not all API endpoints are equally important in terms of security and operational continuity. When you clearly identify which ones are tied to sensitive business processes, you can:

* Regularly monitor and audit these endpoints for vulnerabilities or breaches.
* Prioritize them for development, maintenance, and security efforts.
* Implement stronger security measures (e.g., encryption, authentication, access controls).
* Easily produce audit trails and evidence of data protection measures.

## Marking endpoints manually

To mark an endpoint as belonging to the sensitive business flow, in Wallarm Console, go to API Discovery, then for your endpoint, in the **Business flow & sensitive data**, select one or several flows from the list.

![API Discovery - Sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

You can do the same in the endpoint details.

The endpoint can belong to:

* **Admin** (administrative) flows - anything relating to your applications' administrative functions and activities.
* **Auth** (authentication) flows - sensitive as related to a user's credentials and data protection.
* **Acc create** (account creation) and **Acc mgmt** (account management) flows - the key administrative flows relating to your applications.
* **Billing** flows - sensitive due to usage and possible breach of critical personal financial data.
* **SMS GW** (SMS gateway) flows - sensitive due to direct communication with the end user.
* **AI** (artificial intelligence) flows - related to the systems that use ML models, neural networks, chatbots or systems that in turn access some third-party AI services, such as OpenAI.

## Filtering by business flow

Once endpoints are marked with the business flow tags, you can quickly get the list of endpoints belonging to specific business flow to analyze their current state and data.

To do that, use the **Business flow** filter.


![API Discovery - Filtering by sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)
