# WAAP/WAF

Wallarm's WAAP is a next-gen WAF (Web Application Firewall) supporting multiple API protocols, such as REST, SOAP, GraphQL and others and implying a deep packet inspection to provide a full coverage of [OWASP Top 10](https://owasp.org/www-project-top-ten/) and more. This article provides an overview of WAAP elements and tuning possibilities.

![Attack by protocols](../images/user-guides/dashboard/api-protocols.png)

## General principles

Although oriented on the traffic processing in a cloud (cloud native WAAP), the solution supports a wide range of [deployment options](../installation/supported-deployment-options.md) enabling you to seamlessly integrate the platform with your environment without its modification.

With WAAP, you immediately obtain [protection by default](#protection-by-default) without creating rules or performing complex investigations. However, WAAP also provides comprehensive tools for [further tuning](#protection-fine-tuning) the security measures for your applications and API - you can use these tools later.

Wallarm's WAAP functions are provided within the Cloud Native WAAP [subscription plan](../about-wallarm/subscription-plans.md).

## Protection by default

Once you register your company account in the [US](https://us1.my.wallarm.com/signup) or [EU](https://my.wallarm.com/signup) Wallarm Cloud and [deploy](../installation/supported-deployment-options.md) the Wallarm protecting node connected to this account, the node will immediately [start acting](protecting-against-attacks.md#tools-for-attack-detection).

![!Arch scheme1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

The measures that the node will take when finding attacks depend on the selected [**filtration mode**](../admin-en/configure-wallarm-mode.md): on enabling the node, you can set it either for just `monitoring` and reporting in case of occurring attacks or to `block` the attacks once they occur.

Being as simple as that in its root, the filtration mode defines how the node will react. However, it is more than that: you have a lot of [configuration possibilities](../admin-en/configure-wallarm-mode.md) to fine-tune the mode to correspond to your API structure and protection needs.

## Protection fine-tuning

As soon as you have your WAAP monitoring/protection working, you can fine-tune it by configuring:

* [Protection from multi-attack perpetrators](../admin-en/configuration-guides/protecting-with-thresholds.md)
* [DDoS protection](../admin-en/configuration-guides/protecting-against-ddos.md)
* [Brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Forced browsing protection](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [Manual BOLA protection](../admin-en/configuration-guides/protecting-against-bola-trigger.md)
* [Filtering by IP](../user-guides/ip-lists/overview.md)
* Rate limiting
* Your own attack detectors
* Virtual patches
* Request parsers
* Response headers
* Rules for data masking
* Ignoring certain attack types
* Ignoring attack signs in the binary data
* The `overlimit_res` attack detection
