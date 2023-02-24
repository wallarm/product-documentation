# OWASP API Security Top 10 Dasboard

The [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) is a gold standard for the evaluation of security risk in APIs. To help you measure your API's security posture against these top 10 threats, Wallarm offers the dashboard that provides clear visibility and metrics for threat mitigation.

By using the Wallarm dashboard, you can proactively address any vulnerabilities that may exist within your APIs and ensure that it remains secure and compliant.

![!OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-dash.png)

## Estimating threat coverage

Wallarm estimates each Top 10 threat coverage based on the real traffic coming to your APIs, active vulnerabilities and [Wallarm security control](#wallarm-security-controls) status:

* **Red** threat indicates that your APIs are critically vulnerable to that threat.

    It happens if malicous traffic of the corresponding type targets your APIs but no active Wallarm security controls are in place to mitigate the threats.
* **Yellow** threat indicates that your APIs are medium vulnerable to that threat.

    It happens if your APIs have active vulnerabilities of the corresponding type but Wallarm security controls are only partially applied leaving certain aspects of the APIs unprotected.
* **Green** threat indicates that your APIs are low vulnerable to that threat due to the application of all Wallarm security controls and the absence of the corresponding vulnerabilities within your APIs.

Each OWASP API Top 10 threat is provided with available security controls, corresponding vulnerabilities and the number of related attacks (if any):

![!OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-dash-details.png)

## Wallarm security controls

Wallarm effectively mitigates all OWASP API Security Top 10 threats. The dashboard highlights the available Wallarm measures against each threat as security controls:

| OWASP API Top 10 threat | Wallarm security controls |
| ----------------------- | ------------------------ |
| [API1:2019 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) | <ul><li>[Wallarm node deployment](../../admin-en/supported-platforms.md)<br>This component must be placed in your infrastructure for incoming traffic to be inspected for threats.</li><li>[Automatics BOLA mitigation](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery)</li></ul> |
| [API2:2019 Broken User Authentication](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa2-broken-user-authentication.md) | <ul><li>[Wallarm node deployment](../../admin-en/supported-platforms.md)<br>Once Wallarm node is deployed and active, it detects input validation attacks targeting authentication endpoints and if the [mode](../../admin-en/configure-wallarm-mode.md) is blocking, blocks them.</li><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks targeting authentication endpoints</li><li>[Weak JWT detection](../triggers/trigger-examples.md#detect-weak-jwts) trigger to discover weak authentication vulnerabilities based on requests with weak JWTs</li></ul> |
| [API3:2019 Excessive Data Exposure](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md) | <ul><li>[Wallarm node deployment](../../admin-en/supported-platforms.md)<br>Once Wallarm node is deployed and active, it detects attacks targeting [sensitive data exposure](../../attacks-vulns-list.md#information-exposure) and if the [mode](../../admin-en/configure-wallarm-mode.md) is blocking, blocks them.</li><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API4:2019 Lack of Resources & Rate Limiting](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa4-lack-of-resources-and-rate-limiting.md) | <ul><li>[Wallarm node deployment](../../admin-en/supported-platforms.md)</li><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks which often lead to DoS, making the API unresponsive or even unavailable</li><li>[API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md) mitigating malicious bot actions which often lead to DoS, making the API unresponsive or even unavailable</li></ul> |
| [API5:2019 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md) | <ul><li>[Wallarm node deployment](../../admin-en/supported-platforms.md)<br>Once Wallarm node is deployed and active, it detects the [Path Traversal](../../attacks-vulns-list.md#path-traversal) attacks and if the [mode](../../admin-en/configure-wallarm-mode.md) is blocking, blocks them.</li><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li><li>[Forced browsing trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate forced browsing attempts that are also a way for this threat exploitation</li></ul> |
| [API6:2019 Mass Assignment](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa6-mass-assignment.md) | <ul><li>[Wallarm node deployment](../../admin-en/supported-platforms.md)<br>Once Wallarm node is deployed and active, it detects the [Mass Assignments](../../attacks-vulns-list.md#mass-assignment) attempts and if the [mode](../../admin-en/configure-wallarm-mode.md) is blocking, blocks them.</li></ul> |
| [API7:2019 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa7-security-misconfiguration.md) | <ul><li>[Wallarm node deployment](../../admin-en/supported-platforms.md)<br>To secure APIs from this threat, Wallarm nodes should also be up-to-date.</li><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md) | <ul><li>[Wallarm node deployment](../../admin-en/supported-platforms.md)<br>Once Wallarm node is deployed and active, it detects malicious injection attempts such as SQLi, RCE, etc. and if the [mode](../../admin-en/configure-wallarm-mode.md) is blocking, blocks them.</li><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)</li></ul> |
| [API9:2019 Improper Assets Management](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa9-improper-assets-management.md) | <ul><li>[API Discovery](../../about-wallarm/api-discovery.md) to automatically discover actual API inventory based on real traffic</li></ul> |
| [API10:2019 Insufficient Logging & Monitoring](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xaa-insufficient-logging-monitoring.md) | <ul><li>[Integrations with SIEMs, SOAPs, messengers, etc.](../settings/integrations/integrations-intro.md) to get timely notifications and reports on your API security status</li></ul> |

Each top 10 threat card highlights the status of the corresponding security controls. You can proceed to the control configuration right from the cards.
