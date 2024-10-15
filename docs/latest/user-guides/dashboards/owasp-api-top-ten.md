# OWASP API 2023 Dashboard

The [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) is a gold standard for the evaluation of security risk in APIs. To help you measure your API's security posture against these API threats, Wallarm offers the dashboard that provides clear visibility and metrics for threat mitigation.

Covering the [OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/), the dashboard allows you to assess the overall security state and proactively implement security controls to address identified issues.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/qgq0xmld3wzb" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

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
