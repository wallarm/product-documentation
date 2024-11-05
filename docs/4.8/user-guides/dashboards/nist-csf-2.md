# NIST CSF 2.0 Dashboard (Beta)

The [NIST cybersecurity framework (CSF)](https://www.nist.gov/cyberframework), created by the National Institute of Standards and Technology, defines key pillars for an effective security strategy. Wallarm's services align with the most of NIST pillars, ensuring comprehensive protection for our customers. Our dashboard demonstrates this alignment and assists in configuring the platform's features.

<div>
  <script src="https://js.storylane.io/js/v1/storylane.js"></script>
  <div class="sl-embed" style="position:relative;padding-bottom:calc(54.13% + 25px);width:100%;height:0;transform:scale(1)">
    <iframe loading="lazy" class="sl-demo" src="https://wallarm.storylane.io/demo/4rynq5qejumh" name="sl-embed" allow="fullscreen" allowfullscreen style="position:absolute;top:0;left:0;width:100%!important;height:100%!important;border:1px solid rgba(63,95,172,0.35);box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);border-radius:10px;box-sizing:border-box;"></iframe>
  </div>
</div>

## Identify

Wallarm provides the tools designed to understand your company's business landscape, resources, and potential security vulnerabilities. These tools illuminate your attack surface and assist in ranking assets according to their risk scores:

* [API attack surface management](../../api-attack-surface/overview.md) is a set of capabilities that allows you to enumerate, assess, and manage the public attack surface presented by your APIs.
* [API Discovery](../../api-discovery/overview.md) crafts a precise inventory of your application's REST API based on real-time usage, effectively identifying zombie, orphan, and shadow APIs.
* [API risk scoring](../../api-discovery/risk-score.md): Wallarm automatically assigns risk scores for your API endpoints based on factors like data exposure and vulnerability presence, but also provides customization by letting you adjust the significance of these factors.

## Protect

Wallarm provides robust protection against a wide range of known and emerging threats:

* [Application and API Protection (WAAP)](../../about-wallarm/waap-overview.md) offers advanced security for applications and APIs across environments. It supports various API protocols including REST, SOAP, GraphQL, and more, utilizing deep packet inspection to address the OWASP Top 10 and beyond.
* API Threat Prevention focuses on stopping unauthorized access and misuse of APIs by [blocking malicious bots](../../api-abuse-prevention/overview.md), protecting against credential stuffing and fake account creation, and allowing access only to legitimate users.

## Detect

To identify anomalies, indicators of compromise, and other potential adverse events, Wallarm emphasizes consistent monitoring of assets as follows:

* [Vulnerability detection](../../about-wallarm/detecting-vulnerabilities.md): Wallarm uses real Internet traffic to proactively identify and report security vulnerabilities. By analyzing attacker attempts and conducting exploitation tests, it uncovers both immediate and potential weaknesses, enabling real-time security monitoring.
* [API leaks](../../api-attack-surface/security-issues.md): Wallarm's API Leaks module scans public repositories to identify exposed API tokens. Upon detecting leaks, Wallarm alerts you, allowing prompt analysis and action.
* [OpenAPI Security Testing](../../fast/openapi-security-testing.md) automates API security checks within the software development lifecycle by seamlessly integrating with CI/CD pipelines via Docker. It creates test requests to expose vulnerabilities in endpoints, as defined in your OpenAPI specification, allowing you to address security issues before the API goes into production.

## Respond

Wallarm's arsenal equips you to aptly respond to identified security threats:

* [Active blocking](../../admin-en/configure-wallarm-mode.md) to prevent malicious activities from reaching your APIs.
* API risk management: Wallarm enables streamlined management of detected vulnerabilities by enabling you to swiftly [update vulnerability statuses](../vulnerabilities.md#vulnerability-lifecycle) for better security oversight.
* [Integrations and alerts](../settings/integrations/integrations-intro.md) allowing you to craft and route security alerts to your SIEM, SOAR, and other systems.
