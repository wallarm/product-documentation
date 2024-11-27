# Sensitive Business Flows <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm's [API Discovery](overview.md) allows marking specific endpoints as the key ones for some sensitive business flows, such as authentication or account management, billing or SMS gateways functioning, and others. Learn from this article how to use the sensitive business flow functionality.

## Addressed issues

The abuse of the sensitive business flows is ranked six ([API6](https://owasp.org/API-Security/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows/)) among OWASP API Top 10 risks. Wallarm allows clearly identify the endpoints tied to such flows to:

* Regularly monitor and audit these endpoints for vulnerabilities or breaches.
* Prioritize them for development, maintenance, and security efforts.
* Implement stronger security measures (e.g., encryption, authentication, access controls, and rate limits).
* Easily produce audit trails and evidence of data protection measures.

## Marking endpoints manually

To mark an endpoint as belonging to the sensitive business flow, in Wallarm Console, go to API Discovery, then for your endpoint, in the **Business flow & sensitive data**, select one or several flows from the list.

![API Discovery - Sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf.png)

You can do the same in the endpoint details.

The endpoint can belong to:

* **Admin** (administrative) flows - endpoints related to applications' administrative functions and activities. Such endpoints are usually targeted by attackers in order to access functionality intended for privileged users only (BFLA), escalate privileges and gaining control over the system.
* **Auth** (authentication) flows - endpoints critical to access control, as they verify user identity and manage permissions. As the entry point to the app, they are often the first target for attackers seeking to bypass security, gain unauthorized access, and take over accounts.
* **Acc create** (account creation) and **Acc mgmt** (account management) flows - the key administrative flows relating to your applications.
* **Billing** flows - sensitive due to usage and possible breach of critical personal financial data and susceptible to fraud.
* **SMS GW** (SMS gateway) flows - endpoints sensitive because attackers can exploit them in SMS pumping attacks, flooding them with messages to inflate costs. Since these endpoints are connected to API gateways and payment systems, this can lead to financial loss and system overload.
* **AI** (artificial intelligence) flows - related to the systems that use ML models, neural networks, chatbots or systems that in turn access some paid third-party AI services, such as OpenAI.

## Filtering by business flow

Once endpoints are marked with the business flow tags, you can quickly get the list of endpoints belonging to specific business flow to analyze their current state and data.

To do that, use the **Business flow** filter.


![API Discovery - Filtering by sensitive business flows](../images/about-wallarm-waf/api-discovery/api-discovery-sbf-filter.png)
