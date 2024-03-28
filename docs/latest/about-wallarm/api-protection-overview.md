# Wallarm API Protection <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm offers a basic set of protections for your APIs as part of the Cloud-Native WAAP subscription. These include support for all API protocols and their inspection for attacks, protection against L7 DDoS, etc. At the same time, modern applications and APIs are subject to additional risks and require advanced protection measures.

As part of Advanced API Security, you get a set of additional capabilities that allow you to protect your APIs from sophisticated attacks:

<!--
* API Specification Enforcement -->
* [BOLA Protection](#automatic-bola-protection) provides automatic protection against BOLA attacks that were marked as #1 threat in OWASP API Top-10. Wallarm automatically discovers vulnerable endpoints and protects them against enumeration.
* [API Abuse Prevention](#api-abuse-prevention) protects your application and APIs against different types of automated threats. Based on behavioral analysis Wallarm can easily identify and block malicious bots such as  Scrappers, Security Crawlers, etc.  
* [Credential Stuffing Detection](#credential-stuffing-detection) provides one more layer of protection against Account Takeover attacks. Wallarm allows you to recognize even a single use of compromised credentials, which is important to identify low and slow Credential Stuffing attacks.
<!--* GraphQL API Protection protects your GraphQL APIs against specialized attacks that exploit protocol specific such as batching, nesting queries, introspection, etc. It can prevent Resource Exhaustion, Denial of Service (DoS), Excessive Information Exposure and other attacks.-->
<!--
Diagram for API Protection bundle of Wallarm products, being prepared by Iskandar-->

## Automatic BOLA Protection

Use Wallarm's API Discovery module to discover endpoints vulnerable to broken object level authorization (BOLA) threat and automatically protect from attacks trying to exploit this vulnerability.

![BOLA trigger](../../images/user-guides/bola-protection/trigger-enabled-state.png)

Automatic BOLA protection serves as a great extension or replacement to the [manually created](../admin-en/configuration-guides/protecting-against-bola-trigger.md) BOLA protection rules. You can configure automatic BOLA protection to make Wallarm's behavior match your organization security profile.

[Proceed to detailed description and configuration →](../admin-en/configuration-guides/protecting-against-bola.md)

## API Abuse Prevention

The **API Abuse Prevention** delivers detection and mitigation of bots performing API abuse like credential stuffing, fake account creation, content scraping and other malicious actions targeted at your APIs.

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

**API Abuse Prevention** uses the complex bot detection model that involves ML-based methods as well as statistical and mathematical anomaly search methods and cases of direct abuse. The module self-learns the normal traffic profile and identifies dramatically different behavior as anomalies.

[Proceed to detailed description and configuration →](api-abuse-prevention.md)

## Credential Stuffing Detection

Wallarm's **Credential Stuffing Detection** collects and displays real-time information about attempts to use compromised or weak credentials to access your applications and enables instant notifications about such attempts. It also forms downloadable list of all compromised or weak credentials providing access to your applications.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

To identify compromised and weak passwords, Wallarm uses a comprehensive database of more than **850 million records** collected from the public [HIBP](https://haveibeenpwned.com/) compromised credentials database.

[Proceed to detailed description and configuration →](credential-stuffing.md)
