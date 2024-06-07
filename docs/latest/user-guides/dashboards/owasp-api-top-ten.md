# OWASP API Security Top 10 Dasboards

The [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) is a gold standard for the evaluation of security risk in APIs. To help you measure your API's security posture against these API threats, Wallarm offers the dashboards that provide clear visibility and metrics for threat mitigation.

The dashboards cover the OWASP API Security Top 10 risks of both the [2019](https://owasp.org/API-Security/editions/2019/en/0x00-header/) and [2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/) versions.

By using these dashboards, you can assess the overall security state and proactively address discovered security issues by setting up appropriate security controls.

=== "OWASP API Top 10 2019 dashboard"
    ![OWASP API Top 10 2019](../../images/user-guides/dashboard/owasp-api-top-ten-2019-dash.png)
=== "OWASP API Top 10 2023 dashboard"
    ![OWASP API Top 10 2023](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Threat assessment

Wallarm estimates the risk for each API threat based on applied **security controls** and discovered vulnerabilities:

* **Red** - it happens if there are no security controls applied or your APIs have active high risk vulnerabilities.
* **Yellow** - it happens if security controls are only partially applied or your APIs have active medium or low risk vulnerabilities.
* **Green** indicates that your APIs are protected and do not have open vulnerabilities.

For each OWASP API Top 10 threat you can find detailed info about the threat, available security controls, corresponding vulnerabilities, and investigate related attacks:

![OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash-details.png)

## Wallarm security controls for OWASP API 2019

Wallarm security platform provides full-fledged protection against OWASP API Security Top 10 2019 by the following security controls:

| OWASP API Top 10 threat 2019 | Wallarm security controls |
| ----------------------- | ------------------------ |
| [API1:2019 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa1-broken-object-level-authorization.md) | <ul><li>[Automatic BOLA mitigation](../../api-discovery/bola-protection.md) to automatically create triggers to protect vulnerable endpoints</li></ul> |
| [API2:2019 Broken User Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa2-broken-user-authentication.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks targeting authentication endpoints</li></ul> |
| [API3:2019 Excessive Data Exposure](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa3-excessive-data-exposure.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li></ul> |
| [API4:2019 Lack of Resources & Rate Limiting](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa4-lack-of-resources-and-rate-limiting.md) | <ul><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks which often lead to DoS, making the API unresponsive or even unavailable</li><li>[API Abuse Prevention](../../api-abuse-prevention/overview.md) mitigating malicious bot actions which often lead to DoS, making the API unresponsive or even unavailable</li></ul> |
| [API5:2019 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa5-broken-function-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>[Forced browsing trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate forced browsing attempts that are also a way for this threat exploitation</li></ul> |
| [API6:2019 Mass Assignment](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md) | <ul><li>Mass Assignment attacks are detected automatically, specific security controls are not required</li></ul> |
| [API7:2019 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa7-security-misconfiguration.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>Wallarm node self-checks to keep node versions and security policies up to date (see [how to address the issues](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa8-injection.md) | <ul><li>Malicious injections are detected automatically, specific security controls are not required</li></ul> |
| [API9:2019 Improper Assets Management](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa9-improper-assets-management.md) | <ul><li>[API Discovery](../../api-discovery/overview.md) to automatically discover actual API inventory based on real traffic</li></ul> |
| [API10:2019 Insufficient Logging & Monitoring](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xaa-insufficient-logging-monitoring.md) | <ul><li>[Integrations with SIEMs, SOAPs, messengers, etc.](../settings/integrations/integrations-intro.md) to get timely notifications and reports on your API security status</li></ul> |

## Wallarm security controls for OWASP API 2023

Wallarm security platform provides full-fledged protection against OWASP API Security Top 10 2023 by the following security controls:

| OWASP API Top 10 threat 2023 | Wallarm security controls |
| ----------------------- | ------------------------ |
| [API1:2023 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[Automatic BOLA mitigation](../../api-discovery/bola-protection.md) to automatically create triggers to protect vulnerable endpoints</li></ul> |
| [API2:2023 Broken Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks targeting authentication endpoints</li></ul> |
| [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li></ul> |
| [API4:2023 Unrestricted Resource Consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks which often lead to DoS, making the API unresponsive or even unavailable</li></ul> |
| [API5:2023 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>[Forced browsing trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate forced browsing attempts that are also a way for this threat exploitation</li></ul> |
| [API6:2023 Unrestricted Access to Sensitive Business Flows](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[API Abuse Prevention](../../api-abuse-prevention/overview.md) mitigating malicious bot actions</li></ul> |
| [API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li></ul> |
| [API8:2023 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>Wallarm node self-checks to keep node versions and security policies up to date (see [how to address the issues](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API9:2023 Improper Inventory Management](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[API Discovery](../../api-discovery/overview.md) to automatically discover actual API inventory based on real traffic</li></ul> |
| [API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li></ul> |

## Comparison of OWASP API Top 10 2019 and 2023

According to the OWASP project, the top security threats for 2023 are largely similar to those identified in 2019, with a few notable exceptions:

* The [API6:2019 Mass Assignment](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa6-mass-assignment.md) threat has been combined with [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md).
* The [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xa8-injection.md) threat is no longer listed separately and has been included in the new [API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) category.
* The [API10:2019 Insufficient Logging & Monitoring](https://github.com/OWASP/API-Security/blob/master/editions/2019/en/0xaa-insufficient-logging-monitoring.md) threat has been removed from the OWASP API Security Top 10.
* The list now includes two new API threats, namely [API6:2023 Unrestricted Access to Sensitive Business Flows](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md), which introduces automated threats, and [API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md), thereby underscoring the significance of these threats.
