# API Discovery Dashboard <a href="../../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../../images/api-security-tag.svg" style="border: none;"></a>

The API Discovery Wallarm dashboard summarizies data about your API collected by the [API Discovery](../../about-wallarm/api-discovery.md) module during the current month:

* Number of endpoints by risk level
* Riskiest endpoints
* Changes of your API in the last 30 days by type (new, changed, removed APIs)
* Number of discovered endpoints, including external and internal
* Sensitive data in API by groups (personal, finance, etc.) and by types
* API usage: number of endpoints by the API host or the application

Using this information, you can reveal the [riskiest] endpoints to implement appropriate security controls before endpoint vulnerabilitiies can be exploited by attackers.

The dashboard also allows to reveal possible anomalies in the number of sensitive data your API transfers and analyze the structure of your API regarding how many endpoints relate to the different hosts and applications.

Additionally, it draws attention to the changes in API that you always need to check to exclude security risks. 

![!API Discovery widget](../../images/user-guides/dashboard/api-discovery-widget.png)

Click elements of the widget to go to the **API Discovery** section and view filtered data. If clicking hit number, you will be addresses to the [event list](events/check-attack.md) with the corresponding hit data.
