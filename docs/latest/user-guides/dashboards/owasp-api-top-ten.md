# OWASP API Security Top 10 Dasboards

The [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) is a gold standard for the evaluation of security risk in APIs. To help you measure your API's security posture against these API threats, Wallarm offers the dashboards that provide clear visibility and metrics for threat mitigation.

The first dashboard covers the riskiest threats identified in the 2019 version of the OWASP API Security Top 10, while the second covers the riskiest threats of the [2023 version](https://owasp.org/www-project-api-security/announcements/2023/02/api-top10-2023rc).

By using these dashboards, you can assess the overall security state and proactively address discovered security issues by setting up appropriate security controls.

=== "OWASP API Top 10 2019 dashboard"
    ![!OWASP API Top 10 2019](../../images/user-guides/dashboard/owasp-api-top-ten-2019-dash.png)
=== "OWASP API Top 10 2023 dashboard"
    ![!OWASP API Top 10 2023](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Estimating threat coverage

Wallarm estimates the risk for each API threat based on **security control** status and discovered vulnerabilities:

* **Red** - it happens if there are no security controls applied or your APIs have active high risk vulnerabilities.
* **Yellow** - it happens if security controls are only partially applied or your APIs have active medium risk vulnerabilities.
* **Green** indicates that your APIs are low vulnerable to that threat and all security controls are applied.

For each OWASP API Top 10 threat you can find detailed info about the threat, available security controls, corresponding vulnerabilities, and investigate related attacks:

![!OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash-details.png)

## Wallarm security controls for 2019 threats

Wallarm security platform provides full-fledged protection against OWASP API Security Top 10 2019 by the following security controls:

| OWASP API Top 10 threat 2019 | Wallarm security controls |
| ----------------------- | ------------------------ |
| [API1:2019 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) | <ul><li>[Automatics BOLA mitigation](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)</li></ul> |
| [API2:2019 Broken User Authentication](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa2-broken-user-authentication.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks targeting authentication endpoints</li><li>[Weak JWT detection](../triggers/trigger-examples.md#detect-weak-jwts) trigger to discover weak authentication vulnerabilities based on requests with weak JWTs</li></ul> |
| [API3:2019 Excessive Data Exposure](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API4:2019 Lack of Resources & Rate Limiting](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa4-lack-of-resources-and-rate-limiting.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks which often lead to DoS, making the API unresponsive or even unavailable</li><li>[API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md) mitigating malicious bot actions which often lead to DoS, making the API unresponsive or even unavailable</li></ul> |
| [API5:2019 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li><li>[Forced browsing trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate forced browsing attempts that are also a way for this threat exploitation</li></ul> |
| [API6:2019 Mass Assignment](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa6-mass-assignment.md) | |
| [API7:2019 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa7-security-misconfiguration.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API9:2019 Improper Assets Management](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa9-improper-assets-management.md) | <ul><li>[API Discovery](../../about-wallarm/api-discovery.md) to automatically discover actual API inventory based on real traffic</li></ul> |
| [API10:2019 Insufficient Logging & Monitoring](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xaa-insufficient-logging-monitoring.md) | <ul><li>[Integrations with SIEMs, SOAPs, messengers, etc.](../settings/integrations/integrations-intro.md) to get timely notifications and reports on your API security status</li></ul> |

## Wallarm security controls for 2023 threats

Wallarm security platform provides full-fledged protection against OWASP API Security Top 10 2023 by the following security controls:

| OWASP API Top 10 threat 2023 | Wallarm security controls |
| ----------------------- | ------------------------ |
| [API1:2023 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa1-broken-object-level-authorization.md) | <ul><li>[Automatics BOLA mitigation](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)</li></ul> |
| [API2:2023 Broken User Authentication](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa2-broken-authentication.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks targeting authentication endpoints</li><li>[Weak JWT detection](../triggers/trigger-examples.md#detect-weak-jwts) trigger to discover weak authentication vulnerabilities based on requests with weak JWTs</li></ul> |
| [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa3-broken-object-property-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API4:2023 Unrestricted Resource Consumption](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa4-unrestricted-resource-consumption.md) | <ul><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks which often lead to DoS, making the API unresponsive or even unavailable</li></ul> |
| [API5:2023 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa5-broken-function-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li><li>[Forced browsing trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate forced browsing attempts that are also a way for this threat exploitation</li></ul> |
| [API6:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa6-server-side-request-forgery.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API7:2023 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa7-security-misconfiguration.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API8:2023 Lack of Protection from Automated Threats](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa8-lack-of-protection-from-automated-threats.md) | <ul><li>[API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md) mitigating malicious bot actions</li></ul> |
| [API9:2023 Improper Inventory Management](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa9-improper-assets-management.md) | <ul><li>[API Discovery](../../about-wallarm/api-discovery.md) to automatically discover actual API inventory based on real traffic</li></ul> |
| [API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xaa-unsafe-consumption-of-apis.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |

## Comparison of OWASP API Top 10 2019 and 2023

According to the OWASP project, the top security threats for 2023 are largely similar to those identified in 2019, with a few notable exceptions:

* Logging and monitoring, as well as injection attacks, are no longer in the top 10 API risks.
* Two new risks have been added to the list: server-side request forgery (SSRF) and lack of protection from automated threats.
* Mass assignment attacks are no longer listed as a separate threat, but instead included under the [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/2023/en/src/0xa3-broken-object-property-level-authorization.md) category.
