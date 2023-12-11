# WAAP/WAF

In Wallarm platform, WAAP (Web Application & API Protection) is a core protecting functionality provided by default and a set of tools for fine-tuning this protection. This article provides an overview of WAAP elements and tuning possibilities.

## Cloud native WAAP

Wallarm's WAAP is a next-gen WAF (Web Application Firewall) supporting multiple API protocols, such as REST, SOAP, GraphQL and others and implying a deep packet inspection to provide a full coverage of [OWASP Top 10](https://owasp.org/www-project-top-ten/) and more.

![Attack by protocols](../images/user-guides/dashboard/api-protocols.png)

Although oriented on the traffic processing in a cloud (cloud native WAAP), the solution supports a wide range of [deployment options](../installation/supported-deployment-options.md) enabling you to seamlessly integrate the platform with your environment without its modification.

With WAAP, you immediately obtain [protection by default](#protection-by-default) without creating rules or performing complex investigations. However, WAAP also provides comprehensive tools for [further tuning](#protection-fine-tuning) the security measures for your applications and API - you can use these tools later.

Wallarm's WAAP functions are provided within the Cloud Native WAAP [subscription plan](../about-wallarm/subscription-plans.md).

## Protection by default

Once you register your company account in the [US](https://us1.my.wallarm.com/signup) or [EU](https://my.wallarm.com/signup) Wallarm Cloud and [deploy](../installation/supported-deployment-options.md) the Wallarm protecting node connected to this account, the node will immediately start acting.

![!Arch scheme1](../images/about-wallarm-waf/overview/filtering-node-cloud.png)

For protection the node will use two built-in attack [protection libraries](protecting-against-attacks.md#tools-for-attack-detection) - libproton and libdetection. Using them together reliably detects signs of attacks and reduces the number of false positives. The node applies the libraries sequentially:

1. **libproton** - to detect signs of the attacks of different types
1. **libdetection** - for additional validation of the found attack signs to confirm or dismiss them

Regular updates of both libraries from Wallarm and using double-check approach ensures no attack types will be missed and the level of false positives stays low.

The measures that the node will take when finding attacks depend on the selected **filtration mode**: on enabling the node, you can set it either for just `monitoring` and reporting in case of occurring attacks or to `block` the attacks once they occur.

Being as simple as that in its root, the filtration mode defines how the node will react. However, it is more than that: you have a lot of [configuration possibilities](../admin-en/configure-wallarm-mode.md) to fine-tune the mode to correspond to your API structure and protection needs.

## Protection fine-tuning

As soon as you have your WAAP monitoring/protection working, you can fine-tune it by configuring:

* Restrictions by IP
* Brute force protection
* Rate limiting
* BOLA protection
* Week JWT detection
* Malicious payloads/attacks/hits thresholds
* Your own attack detectors
* Virtual patches
* Request parsers
* Response headers
* Rules for data masking
* Ignoring certain attack types
* Ignoring attack signs in the binary data
* The `overlimit_res` attack detection
