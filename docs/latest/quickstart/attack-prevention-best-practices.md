# Best Practices for Attack Prevention with Wallarm

This article prioritizes practical implementation and highlights the most crucial and recommended Wallarm's attack prevention capabilities to ensure your system achieves the highest level of security.

Basic attacks, such as SQL injection, cross-site scripting, remote code execution, and Path Traversal, are automatically prevented for all types of requests, including binary files like SVG, JPEG, PNG, GIF, PDF, etc. However, to effectively counter specific threats like DoS attacks and API abuse, custom configuration is necessary. The focus of this article is on these specific settings.

## Check and enhance the coverage of OWASP API top threats

The OWASP API Security Top 10 is a gold standard for the evaluation of security risk in APIs. To help you measure your API's security posture against these API threats, Wallarm offers the [dashboards](../user-guides/dashboards/owasp-api-top-ten.md) that provide clear visibility and metrics for mitigation of the top threats of both the 2019 and 2023 versions.

These dashboards help you to assess the overall security state and proactively address discovered security issues by setting up appropriate security controls.

## Enable brute-force mitigation

Mitigate brute-force attacks by limiting the number of access attempts to authorization pages or password reset forms from a single IP address. You can do this by configuring a [specific trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md).

## Enable forced browsing mitigation

Forced browsing is an attack where an attacker tries to find and use hidden resources, like directories and files with information about the application. These hidden files can give attackers information they can use to carry out other types of attacks. You can prevent such malicious activities by defining limits for unsuccessful attempts to reach specific resources via the [specific trigger](../admin-en/configuration-guides/protecting-against-bruteforce.md).

## Set rate limits

Without a proper limit on how often APIs can be used, they can be hit by attacks that overload the system, like DoS and brute force attacks, or API overuse. By using the [**Set rate limit** rule](../user-guides/rules/rate-limiting.md), you can specify the maximum number of connections that can be made to a particular scope, while also ensuring that incoming requests are evenly distributed.

## Activate BOLA protection

The Broken Object Level Authorization (BOLA) vulnerability allows an attacker to access an object by its identifier via an API request and either read or modify its data bypassing an authorization mechanism. To prevent BOLA attacks, you can either manually specify vulnerable endpoints and set limits for connections to them, or turn on Wallarm to automatically identify and protect vulnerable endpoints. [Learn more](../admin-en/configuration-guides/protecting-against-bola.md)

## Employ API abuse prevention

[Set up API abuse profiles](../user-guides/api-abuse-prevention.md) to stop and block bots performing API abuse like account takeover, scraping, security crawlers and other automated malicious actions targeted at your APIs.

## Create custom attack detection rules

In certain scenarios, it may be beneficial to manually add an [attack detection signature or create a virtual patch](../user-guides/rules/regex-rule.md). Wallarm, while not relying on regular expressions for attack detection, does allow users to include additional signatures based on regular expressions.

During the rule configuration process, you have the ability to specify the [applications](../user-guides/settings/applications.md) or endpoints to which this rule will be applied. For example, you can target a staging or production environment according to conditions in the rule.

## Control traffic filtering modes and processing exclusions

Implement security measures gradually using our [flexible options for managing filtering modes](../admin-en/configure-wallarm-mode.md) and customizing processing to suit your applications. For example, enable the monitoring mode for specific nodes, applications, or parts of an application.

## Establish a trust zone

When introducing new security measures, the uninterrupted operation of crucial business applications must remain a top priority. To ensure trusted resources are not unnecessarily processed by the Wallarm platform, you have the option to allocate them to the [IP allowlist](../user-guides/ip-lists/allowlist.md).

Traffic originating by the allowlisted resources is not analyzed or logged by default, therefore its use should be considered and applied cautiously.

<!-- Monitor mode is generally recommended in that case and it can be set up for individual applications or sources.??? -->

## Set up the denylist

You can safeguard your applications from untrusted sources by incorporating them into a [denylist](../user-guides/ip-lists/denylist.md), blocking traffic from suspicious regions or sources such as VPNs, Proxy servers, or Tor networks.

Wallarm also allows for [automatic denylisting of IPs displaying malicious behavior](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour), such as multiple attacks from the same IP within a short duration (often referred to as multi-attack perpetrators).

While in blocking mode, Wallarm nodes automatically filters out harmful requests, allowing only legitimate ones. However, you can enhance your security by denylisting sources linked to malicious activities. This effectively blocks suspicious IPs, mitigating the risk of threats like Denial of Service (DDoS) attacks and freeing up your security team to tackle more complex issues.

## Export attack information to your SIEM/SOAR systems

Wallarm offers seamless integration with [various SIEM/SOAR systems](../user-guides/settings/integrations/integrations-intro.md) such as Sumo Logic, Splunk and others enabling you to effortlessly export all attack information to your SOC center for centralized management.

Wallarm integrations together with the [triggers](../user-guides/triggers/triggers.md) functionality provides you with a great tool to set up reports and real-time notifications on specific attacks, denylisted IPs, and overall ongoing attack volume.

<!-- ???? не рекламируем серый список??? -->

## Layered defense strategy

In creating robust and dependable security measures for your applications, it is crucial to adopt a layered defense strategy. This involves implementing a suite of complementary protective measures that together form a resilient defense-in-depth security posture. Besides the measures offered by the Wallarm security platform, we recommend the following practices:

* Utilize L3 DDoS protection from your cloud service provider. L3 DDoS protection operates at the network level and helps mitigate distributed denial-of-service attacks. Most cloud service providers offer L3 protection as part of their services.
* Follow secure configuration recommendations for your web servers or API gateways. For instance, make sure to adhere to the secure configuration guidelines if you are using [NGINX](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html) or [Kong](https://konghq.com/learning-center/api-gateway/secure-api-gateway).

By incorporating these additional practices along with the [Wallarm L7 DDoS protection measures](../admin-en/configuration-guides/protecting-against-ddos.md#l7-ddos-protection-with-wallarm), you can significantly enhance the overall security of your applications.

<!-- ## Manage Multiple Applications and Tenants ??? как будто сюда не относистя

If your organization uses multiple applications or separate tenants, you'll likely find the Wallarm platform useful for easy management. It allows you to view events and statistics separately for each application and configure specific triggers or rules per application. If you need you can create isolated environment for each tenant with separate access controls.  -->
