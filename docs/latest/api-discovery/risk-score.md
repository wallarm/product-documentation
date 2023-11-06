# Endpoint Risk Score <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md) automatically calculates a **risk score** for each endpoint in your API inventory. The risk score allows you to understand which endpoints are most likely to be an attack target and therefore should be the focus of your security efforts.

## Risc score factors

The risk score is made up of various factors, each having its weight when calculating the final risk score. By default, the highest weight from all criteria is used as endpoint risk score.

| Factor | Description | Default weight |
| --- | --- | --- |
| Active vulnerabilities | [Active vulnerabilities](../about-wallarm/detecting-vulnerabilities.md)  may result in unauthorized data access or corruption. | 9 |
| Potentially vulnerable to BOLA | Presence of the [variable path parts](exploring.md#variability-in-endpoints), such as user IDs, e.g. `/api/articles/author/{parameter_X}`. Attackers can manipulate object IDs and, in case of insufficient request authentication, either read or modify the object sensitive data ([BOLA attacks](../admin-en/configuration-guides/protecting-against-bola.md)). | 6 |
| Parameters with sensitive data | Rather than directly attacking APIs, attackers can steal [sensitive data](overview.md#sensitive-data-detection) and use it to seamlessly reach your resources. | 8 |
| Number of query and body parameters | A large number of parameters increasing the number of attack directions. | 6 |
| Accepts XML / JSON objects | XML or JSON objects passed in the endpoint request may be used by the attackers to transfer malicious XML external entities and injections to the server. | 6 |
| Allows uploading files to the server | Endpoints are frequently targeted by [Remote Code Execution (RCE)](../attacks-vulns-list.md#remote-code-execution-rce) attacks, where files with malicious code are uploaded to a server. To secure these endpoints, uploaded file extensions and contents should be properly validated as recommended by the [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html). | 6 |

To adapt risk score estimation under your understanding of importance of factors, you can [configure](#customizing-risk-score-calculation) the weight of each factor in risk score calculation and calculation method.

## Risk score levels

Risk score may be from `1` (lowest) to `10` (highest):

| Value | Risk level | Color |
| --------- | ----------- | --------- |
| 1 to 3 | Low | Gray |
| 4 to 7 | Medium | Orange |
| 8 to 10 | High | Red |

* `1` means no risk factors for this endpoint.
* Risk score is not displayed (`N/A`) for the unused endpoints.
* Sort by risk score in the **Risk** column.
* Filter `High`, `Medium` or `Low` using the **Risk score** filter.

To understand what caused the risk score for the endpoint and how to reduce the risk, go to the endpoint details:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score.png)

You can also get summary on APIs by their risk score levels in **Dashboards** → [**API Discovery** dashboard](dashboard.md) → **API risk score summary** and **API endpoints by risk** sections.

## Customizing risk score calculation

You can configure the weight of each factor in risk score calculation and calculation method.

To change how risk score is calculated: 

1. Click the **Configure API Discovery** button in the **API Discovery** section.
1. Switch to the **Risk scoring** tab.
1. Select calculation method: highest or average weight.
1. If necessary, disable factors you do not want to affect a risk score.
1. Set weight for the remaining.

    ![API Discovery - Risk score setup](../images/about-wallarm-waf/api-discovery/api-discovery-risk-score-setup.png)

1. Save changes. Wallarm will re-calculate the risk score for your endpoints in accordance with the new settings in several minutes.
