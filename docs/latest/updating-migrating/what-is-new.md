# What is new in Wallarm node 4.4

The new minor version of the Wallarm node has been released! Wallarm node 4.4 has new features making attack mitigation even more powerful and usable including JWT strength check and double-validation of SQLi attacks.

## Checking JSON Web Token strength

[JSON Web Token (JWT)](https://jwt.io/) is a popular authentication standard used to exchange data between resources like APIs securely. JWT compromisation is a common aim of attackers as breaking authentication mechanisms provides them full access to web applications and APIs. The weaker JWTs, the higher chance for it to be compromised.

Starting from version 4.4, you can enable Wallarm to detect the following JWT weaknesses:

* Unencrypted JWTs
* JWTs signed using compromised secret keys

To enable, use the [**Weak JWT** trigger](../user-guides/triggers/trigger-examples.md#detect-weak-jwts).

## Enhanced attack analysis with the libdetection library

Attack analysis performed by Wallarm has been enhanced by involving an additional attack validation layer. Wallarm node 4.4 and above are distributed with the libdetection library enabled by default. This library performs secondary fully grammar-based validation of all [SQLi](../attacks-vulns-list.md#sql-injection) attacks reducing the number of false positives detected among SQL injections.

!!! warning "Memory consumption increase"
    With the **libdetection** library enabled, the amount of memory consumed by NGINX/Envoy and Wallarm processes may increase by about 10%.

[Details on how Wallarm detects attacks →](../about-wallarm/protecting-against-attacks.md)

## Supported installation options

We have added support for Ubuntu 22.04 LTS (jammy).

[See the full list of supported installation options →](../admin-en/supported-platforms.md)

## When upgrading node 3.6 and lower

If upgrading from the version 3.6 or lower, learn all changes from the [separate list](older-versions/what-is-new.md).

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm nodes of version 4.x to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (3.6 and lower). Changes available in Wallarm node 4.4 simplify the node configuration and improve traffic filtration. Please note that some settings of node 4.4 are **incompatible** with the nodes of older versions.

## Upgrade process

1. Review [recommendations for the module upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [Module for NGINX, NGINX Plus](nginx-modules.md)
      * [Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
      * [Upgrading the CDN node](cdn-node.md)
      * [Multi-tenant node](multi-tenant.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
