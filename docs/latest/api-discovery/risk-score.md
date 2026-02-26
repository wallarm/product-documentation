# Endpoint Risk Score <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

[API Discovery](overview.md) automatically calculates a **risk score** for each endpoint in your API inventory. The risk score allows you to understand which endpoints are most likely to be an attack target and therefore should be the focus of your security efforts.

## Risk score factors

The risk score is made up of various factors, each having its own weight when calculating the final risk score. By default, the highest weight from all factors is used as endpoint risk score.

| Factor | Description | Default weight |
| --- | --- | --- |
| Active vulnerabilities (security issues) | [Active vulnerabilities](../about-wallarm/detecting-vulnerabilities.md)  may result in unauthorized data access or corruption. | 9 |
| Parameters with sensitive data | Rather than directly attacking APIs, attackers can steal [sensitive data](overview.md#sensitive-data-detection) and use it to seamlessly reach your resources. | 8 |
| Number of query and body parameters | A large number of parameters increases the number of attack directions. | 6 |
| Accepts XML / JSON objects<sup>*</sup> | XML or JSON objects passed in requests may be used by attackers to transfer malicious XML external entities and injections to the server. | 6 |
| Allows uploading files to the server | Endpoints are frequently targeted by [Remote Code Execution (RCE)](../attacks-vulns-list.md#remote-code-execution-rce) attacks, where files with malicious code are uploaded to a server. To secure these endpoints, uploaded file extensions and contents should be properly validated as recommended by the [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html). | 6 |

<small><sup>*</sup> This risk factor is not accounted for GraphQL and SOAP since any API request of this type accepts XML / JSON object.</small>

## Risk score levels

Risk score may be from `1` (lowest) to `10` (highest):

| Value | Risk level | Color |
| --------- | ----------- | --------- |
| 1 to 3 | Low | Gray |
| 4 to 7 | Medium | Orange |
| 8 to 10 | High | Red |

* `1` means no risk factors for this endpoint.
* Sort by risk score in the **Risk** column.
* Filter `High`, `Medium` or `Low` using the **Risk score** filter.

To understand what caused the risk score for the endpoint and how to reduce the risk, go to the endpoint details:

![API Discovery - Risk score](../images/about-wallarm-waf/api-discovery-2.0/api-discovery-risk-score-details.png)

[Security issues](../api-attack-surface/security-issues.md) (vulnerabilities) are one of the most important factors contributing to an endpoint's risk score. In endpoint details, click the vulnerability name to open its full description in the **Security Issues** section. There you can learn mitigation methods and apply them.
