# Wallarm API Protection <a href="../subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm's API Protection is an advanced set of tools extending the out-of-the-box [WAAP/WAF](waap-overview.md) Wallarm protection for your application APIs in any environment.

Protecting application APIs from all currently existing types of threats is critical for ensuring security, data privacy, availability, compliance, intellectual property protection, trust building, risk management, and overall business resilience in today's interconnected digital ecosystems.

Wallarm's API Protection provides you with:

* [API Abuse Prevention](#api-abuse-prevention)
* [Automatic BOLA Protection](#automatic-bola-protection)
* [Credential Stuffing Detection](#credential-stuffing-detection)

## API Abuse Prevention

The **API Abuse Prevention** delivers detection and mitigation of bots performing API abuse like credential stuffing, fake account creation, content scraping and other malicious actions targeted at your APIs.

![API abuse prevention statistics](../images/about-wallarm-waf/abi-abuse-prevention/api-abuse-prevention-statistics.png)

**API Abuse Prevention** uses the complex bot detection model that involves ML-based methods as well as statistical and mathematical anomaly search methods and cases of direct abuse. The module self-learns the normal traffic profile and identifies dramatically different behavior as anomalies.

[Proceed to detailed description and configuration →](api-abuse-prevention.md)

## Automatic BOLA Protection

Use Wallarm's API Discovery module to discover endpoints vulnerable to broken object level authorization (BOLA) threat and automatically protect from attacks trying to exploit this vulnerability.

![BOLA trigger](../../images/user-guides/bola-protection/trigger-enabled-state.png)

Automatic BOLA protection serves as a great extension or replacement to the [manually created](../admin-en/configuration-guides/protecting-against-bola-trigger.md) BOLA protection rules. You can configure automatic BOLA protection to make Wallarm's behavior match your organization security profile.

[Proceed to detailed description and configuration →](../admin-en/configuration-guides/protecting-against-bola.md)

## Credential Stuffing Detection

Wallarm's **Credential Stuffing Detection** collects and displays real-time information about attempts to use compromised or weak credentials to access your applications and enables instant notifications about such attempts. It also forms downloadable list of all compromised or weak credentials providing access to your applications.

![Wallarm Console - Credential Stuffing](../images/about-wallarm-waf/credential-stuffing/credential-stuffing.png)

To identify compromised and weak passwords, Wallarm uses a comprehensive database of more than **850 million records** collected from the public [HIBP](https://haveibeenpwned.com/) compromised credentials database.

[Proceed to detailed description and configuration →](credential-stuffing.md)
