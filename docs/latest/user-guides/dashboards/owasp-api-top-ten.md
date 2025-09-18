# OWASP API 2023 Dashboard

The [OWASP API Security Top 10](https://owasp.org/www-project-api-security/) is a gold standard for the evaluation of security risk in APIs. To help you measure your API's security posture against these API threats, Wallarm offers the dashboard that provides clear visibility and metrics for threat mitigation.

Covering the [OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/), the dashboard allows you to assess the overall security state and proactively implement security controls to address identified issues.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/qgq0xmld3wzb" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Threat assessment

Wallarm estimates the risk for each API threat based on applied **security controls** and discovered vulnerabilities:

* **Red** - it happens if there are no security controls applied or your APIs have active high risk vulnerabilities.
* **Yellow** - it happens if security controls are only partially applied or your APIs have active medium or low risk vulnerabilities.
* **Green** indicates that your APIs are protected and do not have open vulnerabilities.

## Wallarm security controls for OWASP API 2023

Wallarm security platform provides full-fledged protection against OWASP API Security Top 10 2023 by the following security controls:

| OWASP API Top 10 threat 2023 | Wallarm security controls |
| ----------------------- | ------------------------ |
| [API1:2023 Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md) | <ul><li>[BOLA](../../attacks-vulns-list.md#broken-object-level-authorization-bola) mitigation with [method available](../../admin-en/configuration-guides/protecting-against-bola-trigger.md#configuration-method) in your subscription plan (mitigation controls or triggers)</li></ul> |
| [API2:2023 Broken Authentication](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa2-broken-authentication.md) | <ul><li>[Brute force](../../attacks-vulns-list.md#brute-force-attack) mitigation with [method available](../../admin-en/configuration-guides/protecting-against-bruteforce.md#configuration-method) in your subscription plan (mitigation controls or triggers) to protect authentication endpoints</li></ul> |
| [API3:2023 Broken Object Property Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa3-broken-object-property-level-authorization.md) | <ul><li>Enabled [Detecting Security Issues](../../api-attack-surface/security-issues.md) to detect vulnerabilities</li><li>[BOLA](../../attacks-vulns-list.md#broken-object-level-authorization-bola) mitigation with [method available](../../admin-en/configuration-guides/protecting-against-bola-trigger.md#configuration-method) in your subscription plan (mitigation controls or triggers)</li></ul> |
| [API4:2023 Unrestricted Resource Consumption](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa4-unrestricted-resource-consumption.md) | <ul><li>[DoS protection](../../api-protection/dos-protection.md) to prevent unrestricted resource consumption</li><li>[Brute force](../../attacks-vulns-list.md#brute-force-attack) mitigation with [method available](../../admin-en/configuration-guides/protecting-against-bruteforce.md#configuration-method) in your subscription plan (mitigation controls or triggers) to prevent brute force attacks which often lead to DoS, making the API unresponsive or even unavailable</li></ul> |
| [API5:2023 Broken Function Level Authorization](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa5-broken-function-level-authorization.md) | <ul><li>[Forced browsing](../../attacks-vulns-list.md#forced-browsing) mitigation with [method available](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md#configuration-method) in your subscription plan (mitigation controls or triggers) to mitigate forced browsing attempts that are also a way for this threat exploitation</li><li>[File upload restriction policies](../../api-protection/file-upload-restriction.md) applied with [method available](../../api-protection/file-upload-restriction.md#configuration-method) in your subscription plan (mitigation controls or rules)</li></ul> |
| [API6:2023 Unrestricted Access to Sensitive Business Flows](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa6-unrestricted-access-to-sensitive-business-flows.md) | <ul><li>[API Abuse Prevention](../../api-abuse-prevention/overview.md) mitigating malicious bot actions</li></ul> |
| [API7:2023 Server Side Request Forgery](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa7-server-side-request-forgery.md) | <ul><li>Enabled [Detecting Security Issues](../../api-attack-surface/security-issues.md) to detect vulnerabilities</li><li>[Filtering node](../../about-wallarm/overview.md#how-wallarm-works) acting in the appropriate [mode](../../admin-en/configure-wallarm-mode.md)</li></ul> |
| [API8:2023 Security Misconfiguration](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa8-security-misconfiguration.md) | <ul><li>Wallarm node self-checks to keep node versions and security policies up to date (see [how to address the issues](../../faq/node-issues-on-owasp-dashboards.md))</li></ul> |
| [API9:2023 Improper Inventory Management](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa9-improper-inventory-management.md) | <ul><li>[API Discovery](../../api-discovery/overview.md) to automatically discover actual API inventory based on real traffic</li></ul> |
| [API10:2023 Unsafe Consumption of APIs](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xaa-unsafe-consumption-of-apis.md) | <ul><li>Enabled [Detecting Security Issues](../../api-attack-surface/security-issues.md) to detect vulnerabilities</li></ul> |
