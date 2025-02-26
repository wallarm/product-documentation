# Wallarm solution deployment and maintenance best practices

This article formulates best practices for deployment and maintenance of the Wallarm solution.

## Understand the power of NGINX

The majority of Wallarm filtering node deployment options use NGINX as the reverse proxy server (the foundation for the Wallarm module), which provides a large range of functionality, modules, and performance/security guides. The following is a collection of helpful Internet articles:

* [Awesome NGINX](https://github.com/agile6v/awesome-nginx)
* [NGINX: Basics and Best Practices slide show](https://www.slideshare.net/Nginx/nginx-basics-and-best-practices-103340015)
* [How to optimize NGINX configuration](https://www.digitalocean.com/community/tutorials/how-to-optimize-nginx-configuration)
* [3 quick steps to optimize the performance of your NGINX server](https://www.techrepublic.com/article/3-quick-steps-to-optimize-the-performance-of-your-nginx-server/)
* [How to Build a Tough NGINX Server in 15 Steps](https://www.upguard.com/blog/how-to-build-a-tough-nginx-server-in-15-steps)
* [How to Tune and Optimize Performance of NGINX Web Server](https://hostadvice.com/how-to/how-to-tune-and-optimize-performance-of-nginx-web-server/)
* [Powerful ways to supercharge your NGINX server and improve its performance](https://www.freecodecamp.org/news/powerful-ways-to-supercharge-your-nginx-server-and-improve-its-performance-a8afdbfde64d/)
* [TLS Deployment Best Practices](https://www.linode.com/docs/guides/tls-deployment-best-practices-for-nginx/)
* [NGINX Web Server Security and Hardening Guide](https://geekflare.com/nginx-webserver-security-hardening-guide/)
* [NGINX Tuning For Best Performance](https://github.com/denji/nginx-tuning)
* [Top 25 NGINX Web Server Best Security Practices](https://www.cyberciti.biz/tips/linux-unix-bsd-nginx-webserver-security.html)

## Follow recommended onboarding steps

1. Learn about available [Wallarm node deployment options](../installation/supported-deployment-options.md).
2. Learn about available options to [separately manage the Wallarm node configuration for your environments](../installation/multi-tenant/overview.md#issues-addressed-by-multitenancy) (if necessary).
3. Deploy Wallarm filtering nodes in your non-production environments with the [operation mode](../admin-en/configure-wallarm-mode.md) set to `monitoring`.
4. Learn about how to operate, scale and monitor the Wallarm solution, and confirm the stability of the new network component.
5. Deploy Wallarm filtering nodes in your production environment with the [operation mode](../admin-en/configure-wallarm-mode.md) set to `monitoring`.
6. Implement proper configuration management and [monitoring processes](#enable-proper-monitoring-of-the-filtering-nodes) for the new Wallarm component.
7. Keep the traffic flowing via the filtering nodes in all your environments (including testing and production) for 7‑14 days to give the Wallarm cloud-based backend some time to learn about your application.
8. Enable Wallarm `block` [mode](../admin-en/configure-wallarm-mode.md) in all your non-production environments and use automated or manual tests to confirm that the protected application is working as expected.
9. Enable Wallarm `block` [mode](../admin-en/configure-wallarm-mode.md) in the production environment and use available methods to confirm that the application is working as expected.

## Deploy the filtering nodes not just in the production environment but also in testing and staging

The majority of Wallarm service contracts do not limit the number of Wallarm nodes deployed by the customer, so there is no reason to not deploy the filtering nodes across all your environments, including development, testing, staging, etc.

By deploying and using the filtering nodes in all stages of your software development and/or service operation activities you have a better chance of properly testing the whole data flow and minimizing the risk of any unexpected situations in your critical production environment.

## Enable the libdetection library

Analyzing requests with the [**libdetection** library](protecting-against-attacks.md#library-libdetection) significantly improves the filtering node ability to detect SQLi attacks. It is highly recommended for all Wallarm customers to [upgrade](/updating-migrating/general-recommendations/) to the latest version of the filtering node software and keep the **libdetection** library enabled.

* In the filtering node version 4.4 and higher **libdetection** is enabled by default.
* In the lower versions it is recommended to enable it using the [approach](protecting-against-attacks.md#managing-libdetection-mode) for your deployment option.

## Configure proper reporting of end-user IP addresses

For Wallarm filtering nodes located behind a load balancer or CDN please make sure to configure your filtering nodes to properly report end-user IP addresses (otherwise the [IP list functionality](../user-guides/ip-lists/overview.md), [Threat Replay Testing](detecting-vulnerabilities.md#threat-replay-testing), and some other features will not work):

* [Instructions for NGINX-based Wallarm nodes](../admin-en/using-proxy-or-balancer-en.md) (including AWS / GCP images and Docker node container)
* [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Enable proper monitoring of the filtering nodes

It is highly recommended to enable proper monitoring of Wallarm filtering nodes.

The method for setting up the filtering node monitoring depends on its deployment option:

* [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
* [Instructions for the NGINX-based Docker image](../admin-en/installation-docker-en.md#monitoring-configuration)

## Implement proper redundancy and automatic failover functionality

Like with every other critical component in your production environment, Wallarm nodes should be architected, deployed, and operated with the proper level of redundancy and automatic failover. You should have **at least two active Wallarm filtering nodes** handling critical end-user requests. The following articles provide relevant information about the topic:

* [Instructions for NGINX-based Wallarm nodes](../admin-en/configure-backup-en.md) (including AWS / GCP images, Docker node container, and Kubernetes sidecars)
* [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)

## Learn how to use IP address allowlist, denylist, and graylist

In addition to blocking individual malicious requests, Wallarm filtering nodes can also block individual end-user IP addresses. Rules for IPs blocking are configured using allowlists, denylists and graylists.

[More details on using IP lists →](../user-guides/ip-lists/overview.md)

## Learn how to perform gradual rollout of Wallarm configuration changes

* Use standard DevOps change management and gradual rollout policies for low-level configuration changes for Wallarm filtering nodes in all form-factors.
* For traffic filtration rules, use a different set of application [IDs](../admin-en/configure-parameters-en.md#wallarm_application) or `Host` request headers.
* For the [Create regexp-based attack indicator](../user-guides/rules/regex-rule.md#creating-and-applying-rule) rule, in addition to the above‑mentioned ability to be associated with a specific application ID, it can be enabled in monitoring mode (**Experimental** checkbox) even when the Wallarm node is running in blocking mode.
* The [Set filtration mode](../admin-en/configure-wallarm-mode.md#endpoint-targeted-filtration-rules-in-wallarm-console) rule allows the control of the Wallarm node operation mode (`monitoring`, `safe_blocking` or `block`) from Wallarm Console, similar to the [`wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode) setting in the NGINX configuration (depending on the [`wallarm_mode_allow_override`](../admin-en/configure-parameters-en.md#wallarm_mode_allow_override) setting).

## Configure available integrations to receive notifications from the system

Wallarm provides convenient [native integrations](../user-guides/settings/integrations/integrations-intro.md) with Slack, Telegram, PagerDuty, Opsgenie and other systems to quickly send you different security notifications generated by the platform, for example:

* Newly discovered security vulnerabilities
* Changes in the company network perimeter
* Users newly added to the company account via Wallarm Console, etc

You can also use the [Triggers](../user-guides/triggers/triggers.md) functionality to set up custom alerts about different events happening in the system.

## Learn the power of the Triggers functionality

Depending on your specific environment we recommend you configure the following [triggers](../user-guides/triggers/triggers.md):

* Monitoring for the increased level of malicious requests detected by the Wallarm nodes. This trigger may signal one of the following potential problems:

    * You are under attack and the Wallarm node is successfully blocking malicious requests. You may consider reviewing the detected attacks and manually denylist (block) reported attacker IP addresses.
    * You have an increased level of false positive attacks detected by the Wallarm nodes. You may consider escalating this to the [Wallarm technical support team](mailto:support@wallarm.com) or manually [mark the requests as false positives](../user-guides/events/check-attack.md#false-positives).
    * If you have the [denylisting trigger](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour) active but still receive alerts about an increased level of attacks, then the alert may signal that the trigger is not working as expected.

    [See the configured trigger example →](../user-guides/triggers/trigger-examples.md#slack-notification-if-2-or-more-sqli-hits-are-detected-in-one-minute)
* Notify that a new user was added to your company account in Wallarm Console

    [See the configured trigger example →](../user-guides/triggers/trigger-examples.md#slack-and-email-notification-if-new-user-is-added-to-the-account)
* Mark the requests as the brute-force or forced browsing attack and block the IP addresses the requests were originated from

    [Instructions on configuring brute force protection →](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* Notify that new IP addresses were blocked

    [See the configured trigger example →](../user-guides/triggers/trigger-examples.md#notification-to-webhook-url-if-ip-address-is-added-to-the-denylist)
* Automatically add IP addresses to the [graylist](../user-guides/ip-lists/overview.md) used in the [safe blocking](../admin-en/configure-wallarm-mode.md) mode.

To optimize traffic processing and attack uploading, Wallarm [pre-configures](../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers) some triggers.

## Enable SAML SSO for your account in Wallarm Console

You can use a SAML SSO provider like G Suite, Okta, or OneLogin to centralize the authentication of users in your Wallarm Console account.

Please reach out to your Wallarm account manager or the technical support team to enable SAML SSO for your account, and after that follow [these instructions](../admin-en/configuration-guides/sso/intro.md) to perform the SAML SSO configuration.

## Use the Wallarm Terraform provider for Wallarm Cloud configuration management

[Wallarm's official Terraform provider](../admin-en/managing/terraform-provider.md) allows you to manage your Wallarm Cloud configuration (users, applications, rules, integrations, etc) using the modern Infrastructure as Code (IaC) approach.

## Have a plan to promptly update to newly released Wallarm node versions

Wallarm is constantly working to improve the filtering node software, with new releases available about once a quarter. Please read [this document](../updating-migrating/general-recommendations.md) for information about the recommended approach to perform the upgrades, with associated risks and relevant upgrade procedures.

## Learn known caveats

* All Wallarm nodes connected to the same Wallarm account will receive the same set of default and custom rules for traffic filtering. You still can apply different rules for different applications by using proper application IDs or unique HTTP request parameters like headers, query string parameters, etc.
* If you have the trigger configured to automatically block an IP address ([trigger example](../user-guides/triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)), the system will block the IP for all applications in a Wallarm account.

## Follow the best practices for Threat Replay Testing <a href="../subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;margin-bottom: -4px;"></a>

One method Wallarm uses to [detect vulnerabilities](../about-wallarm/detecting-vulnerabilities.md) is **Threat Replay Testing**.

**Threat Replay Testing** lets you turn attackers into penetration testers and discover possible security issues from their activity as they probe your apps/APIs for vulnerabilities. This module finds possible vulnerabilities by probing application endpoints using real attack data from the traffic. By default this method is disabled.

[Learn the best practices for the **Threat Replay Testing** module configuration →](../vulnerability-detection/threat-replay-testing/setup.md)
