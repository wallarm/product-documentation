# API Discovery Dashboard <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

The **API Discovery** Wallarm dashboard summarizies data about your API collected by the [API Discovery](../../about-wallarm/api-discovery.md) module. It provides a comprehensive overview of your API inventory based on the metrics:

* Number of endpoints by risk level
* The [top risky](../../about-wallarm/api-discovery.md#endpoint-risk-score) endpoints among the whole API inventory and among the newly discovered endpoints in the last 7 days

    The top risky endpoints are most likely to be an attack target due to active vulnerabilities, endpoints being [new](../../about-wallarm/api-discovery.md#tracking-changes-in-api) or [shadow](../../about-wallarm/api-discovery.md#shadow-orphan-and-zombie-apis), and other risk factors. Each risky endpoint is provided with the number of targeting hits.
            
* Changes of your API in the last 7 days by type (new, changed, unused APIs)
* Total number of discovered endpoints and how many of them are external and internal
* Sensitive data in API by groups (personal, finance, etc.) and by types
* API inventory: number of endpoints by the API host and the application

![API Discovery widget](../../images/user-guides/dashboard/api-discovery-widget.png)

The dashboard can uncover anomalies, such as risky frequently-used endpoints or high volume of sensitive data your API transfers. Additionally, it draws attention to the changes in API that you always need to check to exclude security risks. This helps you implement security controls to prevent endpoints from being targets of attacks.

Click elements of the widget to go to the **API Discovery** section and view filtered data. If clicking hit number, you will be addresses to the [event list](../events/check-attack.md) with the attack data for the last 7 days.