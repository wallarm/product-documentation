# Best Practices for Attack Prevention with Wallarm

This article will show you how to use Wallarm, a unique platform that is like having two guards in one, for attack prevention. It not only protects websites like other tools (known as WAAP), but it also specifically safeguards your system's APIs, making sure all the technical parts of your online space are safe.

With so many threats we have online, it is crucial to have a strong shield. Wallarm can stop common threats such as SQL injection, cross-site scripting, remote code execution, and Path Traversal all on its own. But for some sneaky dangers and specialized use-cases like protection against DoS-attack, account takeover, API abuse, a few adjustments might be needed. We will walk you through those steps, ensuring you get the best protection possible. Whether you are a seasoned security expert or just embarking on your cybersecurity journey, this article will provide valuable insights to bolster your security strategy.

## Manage multiple applications and tenants

If your organization uses multiple applications or separate tenants, you will likely find the Wallarm platform useful for easy management. It allows you to view events and statistics separately [for each application](../user-guides/settings/applications.md) and configure specific triggers or rules per application. If you need, you can create isolated environment [for each tenant](../installation/multi-tenant/overview.md) with separate access controls. 

## Establish a trust zone

When introducing new security measures, the uninterrupted operation of crucial business applications must remain a top priority. To ensure trusted resources are not unnecessarily processed by the Wallarm platform, you have the option to allocate them to the [IP allowlist](../user-guides/ip-lists/allowlist.md).

Traffic originating by the allowlisted resources is not analyzed or logged by default. This means that data from bypassed requests will not be available for review. Therefore its use should be applied cautiously.

For URLs that require unrestricted traffic or for which you wish to conduct manual oversight, consider [setting the Wallarm node to monitoring mode](../admin-en/configure-wallarm-mode.md). This will capture and log any malicious activities targeting these URLs. You can subsequently review these events through the Wallarm Console UI, monitor anomalies, and, if necessary, take manual actions such as blocking specific IPs.

## Control traffic filtering modes and processing exceptions

Implement security measures gradually using our flexible options for managing filtering modes and customizing processing to suit your applications. For example, enable the monitoring mode for [specific nodes, applications](../admin-en/configure-wallarm-mode.md#specifying-the-filtration-mode-in-the-wallarm_mode-directive), or [parts of an application](../user-guides/rules/wallarm-mode-rule.md#example-disabling-request-blocking-during-user-registration).

If required, except [detectors tailored for specific request elements](../user-guides/rules/ignore-attack-types.md).

## Set up the denylist

You can safeguard your applications from untrusted sources by incorporating them into a [denylist](../user-guides/ip-lists/denylist.md), blocking traffic from suspicious regions or sources such as VPNs, Proxy servers, or Tor networks.

## Block multi-attack perpetrators

When Wallarm is in blocking mode, it automatically blocks all requests with malicious payloads, letting only legitimate requests through. If multiple malicious activities from one IP address are detected in a short time (often referred to as multi-attack perpetrators), consider [blocking the attacker entirely using a specific trigger](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) that automatically places them on the denylist.

## Enable brute-force mitigation

Mitigate brute-force attacks by limiting the number of access attempts to authorization pages or password reset forms from a single IP address. You can do this by configuring a [specific trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md).

## Enable forced browsing mitigation

Forced browsing is an attack where an attacker tries to find and use hidden resources, like directories and files with information about the application. These hidden files can give attackers information they can use to carry out other types of attacks. You can prevent such malicious activities by defining limits for unsuccessful attempts to reach specific resources via the [specific trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md).

## Set rate limits

Without a proper limit on how often APIs can be used, they can be hit by attacks that overload the system, like DoS and brute force attacks, or API overuse. By using the [**Set rate limit** rule](../user-guides/rules/rate-limiting.md), you can specify the maximum number of connections that can be made to a particular scope, while also ensuring that incoming requests are evenly distributed.

## Activate BOLA protection

The Broken Object Level Authorization (BOLA) vulnerability allows an attacker to access an object by its identifier via an API request and either read or modify its data bypassing an authorization mechanism. To prevent BOLA attacks, you can either manually specify vulnerable endpoints and set limits for connections to them, or turn on Wallarm to automatically identify and protect vulnerable endpoints. [Learn more](../admin-en/configuration-guides/protecting-against-bola.md)

## Employ API Abuse Prevention

[Set up API abuse profiles](../user-guides/api-abuse-prevention.md) to stop and block bots performing API abuse like account takeover, scraping, security crawlers and other automated malicious actions targeted at your APIs.

## Enable credential stuffing detection

Enable [credential stuffing detection](../about-wallarm/credential-stuffing.md) to have a real-time information about attempts to use compromised or weak credentials to access your applications and a full downloadable list of all compromised or weak credentials providing access to your applications.

## Create custom attack detection rules

In certain scenarios, it may be beneficial to manually add an [attack detection signature or create a virtual patch](../user-guides/rules/regex-rule.md). Wallarm, while not relying on regular expressions for attack detection, does allow users to include additional signatures based on regular expressions.

## Mask sensitive data

The Wallarm node sends attack information to the Wallarm Cloud. Certain data, like authorization (cookies, tokens, passwords), personal data, and payment credentials, should remain within the server where it is processed. [Create a data masking rule](../user-guides/rules/sensitive-data-rule.md) to cut the original value of specific request points before sending them to the Wallarm Cloud, ensuring sensitive data stays within your trusted environment.

## Seamless SIEM/SOAR integration & Instant alerts for critical events

Wallarm offers seamless integration with [various SIEM/SOAR systems](../user-guides/settings/integrations/integrations-intro.md) such as Sumo Logic, Splunk and others enabling you to effortlessly export all attack information to your SOC center for centralized management.

Wallarm integrations together with the [triggers](../user-guides/triggers/triggers.md) functionality provides you with a great tool to set up reports and real-time notifications on specific attacks, denylisted IPs, and overall ongoing attack volume.

## Layered defense strategy

In creating robust and dependable security measures for your applications, it is crucial to adopt a layered defense strategy. This involves implementing a suite of complementary protective measures that together form a resilient defense-in-depth security posture. Besides the measures offered by the Wallarm security platform, we recommend the following practices:

* Utilize L3 DDoS protection from your cloud service provider. L3 DDoS protection operates at the network level and helps mitigate distributed denial-of-service attacks. Most cloud service providers offer L3 protection as part of their services.
* Follow secure configuration recommendations for your web servers or API gateways. For instance, make sure to adhere to the secure configuration guidelines if you are using [NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html) or [Kong](https://konghq.com/learning-center/api-gateway/secure-api-gateway).

By incorporating these additional practices along with the [Wallarm L7 DDoS protection measures](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm), you can significantly enhance the overall security of your applications.

## Check and enhance the coverage of OWASP API top threats

The OWASP API Security Top 10 is a gold standard for the evaluation of security risk in APIs. To help you measure your API's security posture against these API threats, Wallarm offers the [dashboards](../user-guides/dashboards/owasp-api-top-ten.md) that provide clear visibility and metrics for mitigation of the top threats of both the 2019 and 2023 versions.

These dashboards help you to assess the overall security state and proactively address discovered security issues by setting up appropriate security controls.
