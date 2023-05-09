# OWASP API Security Top 10 2023 Dasboard

The [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) is a gold standard for the evaluation of security risk in APIs. As the project [updates](https://owasp.org/www-project-api-security/announcements/2023/02/api-top10-2023rc) its list of top threats to consider 2023 security changes, Wallarm has already prepared a dashboard to help you measure your API's security posture against the latest API threats.

With OWASP API Security Top 10 dashboard you can assess the overall security state and proactively address discovered security issues by setting up appropriate security controls.

![!OWASP API Top 10 2023](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash.png)

## Estimating threat coverage

--8<-- "../include/waf/features/owasp-dashboards/estimating-threat-coverage.md"

![!OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-2023-dash-details.png)

## Wallarm security controls

Wallarm security platform provides full-fledged protection against OWASP API Security Top 10 2023 by the following security controls:

| OWASP API Top 10 threat | Wallarm security controls |
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
