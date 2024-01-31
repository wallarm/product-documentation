The **API Discovery** Wallarm dashboard summarizes data about your API collected by the [**API Discovery**][apid-overview] module. It provides a comprehensive overview of your API inventory based on the metrics:

* Number of endpoints by risk level
* The [top risky][apid-risk-score] endpoints among the whole API inventory and among the newly discovered endpoints in the last 7 days

    The top risky endpoints are most likely to be an attack target due to active vulnerabilities, endpoints being [new][apid-track-changes] or [shadow][apid-rogue], and other risk factors. Each risky endpoint is provided with the number of targeting hits.

* Number of identified [rogue][apid-rogue] (shadow, zombie and orphan) APIs      
* Changes of your API in the last 7 days by type (new, changed, unused APIs)
* Total number of discovered endpoints and how many of them are external and internal
* Sensitive data in API by groups (personal, finance, etc.) and by types
* API inventory: number of endpoints by the API host and the application

![API Discovery widget][img-api-discovery-widget]

The dashboard can uncover anomalies, such as risky frequently-used endpoints or high volume of sensitive data your API transfers. Additionally, it draws attention to the changes in API that you always need to check to exclude security risks. This helps you implement security controls to prevent endpoints from being targets of attacks.

Click elements of the widget to go to the **API Discovery** section and view filtered data. If clicking hit number, you will be addresses to the [attack list][check-attack] with the attack data for the last 7 days.