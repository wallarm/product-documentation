# OWASP API Security Top 10 Dasboard

The [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) is a gold standard for the evaluation of security risk in APIs. To help you measure your API's security posture against these API threats, Wallarm offers the dashboard that provides clear visibility and metrics for threat mitigation.

With OWASP API Security Top 10 dashboard you can assess the overall security state and proactively address discovered security issues by setting up appropriate security controls.

![!OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-dash.png)

## Threat assessment

Wallarm estimates the risk for each API threat based on applied [security control](#wallarm-security-controls) and discovered vulnerabilities:

* **Red** - it happens if there are no security controls applied or your APIs have active high risk vulnerabilities.
* **Yellow** - it happens if security controls are only partially applied or your APIs have active medium or low risk vulnerabilities.
* **Green** indicates that your APIs are protected and don’t have open vulnerabilities.

For each OWASP API Top 10 threat you can find detailed info about the threat, available security controls, corresponding vulnerabilities, and investigate related attacks:

![!OWASP API Top 10](../../images/user-guides/dashboard/owasp-api-top-ten-dash-details.png)

## Wallarm security controls

Wallarm security platform provides full-fledged protection against OWASP API Security Top 10 by the following security controls:

| OWASP API Top 10 threat | Wallarm security controls |
| ----------------------- | ------------------------ |
| [API1:2019 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) | <ul><li>[Automatics BOLA mitigation](../../admin-en/configuration-guides/protecting-against-bola.md#automatic-bola-protection-for-endpoints-discovered-by-api-discovery) to automatically create triggers to protect vulnerable endpoints</li></ul> |
| [API2:2019 Broken User Authentication](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa2-broken-user-authentication.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks targeting authentication endpoints</li><li>[Weak JWT detection](../triggers/trigger-examples.md#detect-weak-jwts) trigger to discover weak authentication vulnerabilities based on requests with weak JWTs</li></ul> |
| [API3:2019 Excessive Data Exposure](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa3-excessive-data-exposure.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li></ul> |
| [API4:2019 Lack of Resources & Rate Limiting](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa4-lack-of-resources-and-rate-limiting.md) | <ul><li>[Brute force trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate brute force attacks which often lead to DoS, making the API unresponsive or even unavailable</li><li>[API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md) mitigating malicious bot actions which often lead to DoS, making the API unresponsive or even unavailable</li></ul> |
| [API5:2019 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa5-broken-function-level-authorization.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li><li>[Forced browsing trigger](../../admin-en/configuration-guides/protecting-against-bruteforce.md) to mitigate forced browsing attempts that are also a way for this threat exploitation</li></ul> |
| [API6:2019 Mass Assignment](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa6-mass-assignment.md) | <ul><li>Mass Assignment attacks are detected automatically, specific security controls are not required</li></ul> |
| [API7:2019 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa7-security-misconfiguration.md) | <ul><li>[Vulnerability Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) to discover active vulnerabilities of the corresponding type</li></ul> |
| [API8:2019 Injection](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa8-injection.md) | <ul><li>Malicious injections are detected automatically, specific security controls are not required</li></ul> |
| [API9:2019 Improper Assets Management](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa9-improper-assets-management.md) | <ul><li>[API Discovery](../../about-wallarm/api-discovery.md) to automatically discover actual API inventory based on real traffic</li></ul> |
| [API10:2019 Insufficient Logging & Monitoring](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xaa-insufficient-logging-monitoring.md) | <ul><li>[Integrations with SIEMs, SOAPs, messengers, etc.](../settings/integrations/integrations-intro.md) to get timely notifications and reports on your API security status</li></ul> |
