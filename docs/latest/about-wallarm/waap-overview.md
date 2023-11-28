# WAAP/WAF

In Wallarm platform, WAAP (Web Application & API Protection) is a core protecting functionality provided by default and a set of tools for fine-tuning this protection. This article provides an overview of WAAP elements and tuning possibilities.

## Cloud native WAAP

Wallarm's WAAP is a next-gen WAF (Web Application Firewall) supporting multiple API protocols, such as REST, SOAP, GraphQL and [others](../user-guides/search-and-filters/use-search.md#search-hits-by-api-protocols) and implying a deep packet inspection to provide a full coverage of [OWASP Top 10](https://owasp.org/www-project-top-ten/).

![Attack by protocols](../images/user-guides/dashboard/api-protocols.png)

Although oriented on the traffic processing in a cloud (cloud native WAAP), the solution supports a wide range of [deployment options](../installation/supported-deployment-options.md) enabling you to seamlessly integrate the platform with your environment without its modification.

Wallarm's WAAP functions are provided within the Cloud Native WAAP [subscription plan](../about-wallarm/subscription-plans.md).

Go deeper into Wallarm's WAAP peculiarities reading its [overview](https://www.wallarm.com/product/wallarm-waap) at the Wallarm official site.

## Protection by default

To get monitoring or protection:

1. Register account in the [US](https://us1.my.wallarm.com/signup) or [EU](https://my.wallarm.com/signup) Wallarm Cloud.
1. [Deploy](../installation/supported-deployment-options.md) your node connected to the account.
1. Set node's [filtration mode](../admin-en/configure-wallarm-mode.md).

As soon as you did so, the node will immediately start acting. It will use the following tools by default:

* Library **libproton** - a primary tool for detecting malicious requests. The library uses the component **proton.db** which determines different attack type signs as token sequences, for example: `union select` for the [SQL injection attack type](https://www.wallarm.com/what/structured-query-language-injection-sqli-part-1). If the request contains a token sequence matching the sequence from **proton.db**, this request is considered to be an attack of the corresponding type.

    Wallarm regularly updates **proton.db** with token sequences for new attack types and for already described attack types.

* Library **libdetection** - additionally validates attacks detected by the library **libproton** as follows:

    * If **libdetection** confirms the attack signs detected by **libproton**, the attack is blocked (if the filtering node is working in the `block` mode) and uploaded to the Wallarm Cloud.
    * If **libdetection** does not confirm the attack signs detected by **libproton**, the request is considered legitimate, the attack is not uploaded to the Wallarm Cloud and is not blocked (if the filtering node is working in the `block` mode).
    
    See details on **libdetection** [here](protecting-against-attacks.md#library-libdetection).

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
