# What is new in Wallarm node 4.2

The new minor version of the Wallarm node has been released! Wallarm node 4.2 has new features making attack mitigation even more powerful and usable including BOLA protection and dangerous JWT neutralization.

## Detection of the new attack type IDOR / BOLA

[Broken Object Level Authorization](https://github.com/OWASP/API-Security/blob/master/2019/en/src/0xa1-broken-object-level-authorization.md) (BOLA), also known as [Insecure Direct Object References](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/05-Authorization_Testing/04-Testing_for_Insecure_Direct_Object_References) (or IDOR), became one of the most common API vulnerabilities. When an application includes an IDOR / BOLA vulnerability, it has a strong probability of exposing sensitive information or data to attackers. All the attackers need to do is exchange the ID of their own resource in the API call with an ID of a resource belonging to another user. The absence of proper authorization checks enables attackers to access the specified resource. Thus, every API endpoint that receives an ID of an object and performs any type of action on the object can be an attack target.

To prevent exploitation of this vulnerability, Wallarm node 4.2 contains a [new trigger](../admin-en/configuration-guides/protecting-against-bola.md) which you can use to protect your endpoints from BOLA attacks. The trigger monitors the number of requests to a specified endpoint and creates a BOLA attack event when thresholds from the trigger are exceeded.

## Checking JSON Web Tokens for attacks

JSON Web Token (JWT) is one of the most popular authentication methods. This makes it a favorite tool to perform attacks (for example SQLi or RCE) that are very difficult to find because the data in the JWT is encoded and it can be located anywhere in the request.

Wallarm node 4.2 finds the JWT anywhere in the request, [decodes](../user-guides/rules/request-processing.md#jwt) it and blocks (in the appropriate [filtration mode](../admin-en/configure-wallarm-mode.md)) any attack attempts through this authentication method.

**For example**, an attacker can encode the malicious payload `or+1=1--a-<script>prompt(1)</script>` as a JWT payload part and send the request with this JWT in the `Authorization` header.

Wallarm node will decode received JWT and detect the mentioned payload pointing to the SQLi and XSS attack attempts. Attack attempts will be displayed in Wallarm Console:

![!JWT attack in the interface](../images/user-guides/events/jwt-attack.png)

## Blocking requests from blacklisted IPs in any filtration mode

Request source blacklisting enables you to define distrusted IP addresses for the node to block any requests from them in any mode. Wallarm node 4.0 and lower does not meet this standard blacklist behavior.

In Wallarm node 4.2, we improved the [blacklist logic](../user-guides/ip-lists/blacklist.md) to work as expected by default. Now, it blocks any requests originating from blacklisted IPs in any [filtration mode](../admin-en/configure-wallarm-mode.md).

The new behavior has been implemented by setting [`wallarm_acl_access_phase on`](../admin-en/configure-parameters-en.md#wallarm_acl_access_phase) by default.

## The CentOS 6.x (CloudLinux 6.x) and Debian 9.x distributions are no longer supported

Starting from Wallarm node 4.2, we do not publish Wallarm distributions for CentOS 6.x (CloudLinux 6.x) and Debian 9.x since these OS went EOL.

## Disabling IPv6 connections for the NGINX-based Wallarm Docker container

The NGINX-based Wallarm Docker image 4.2 and above supports the new environment variable `DISABLE_IPV6`. This variable enables you to prevent NGINX from IPv6 connection processing, so that it only can process IPv4 connections.

## Renamed `register-node` script log file

The `/var/log/wallarm/addnode_loop.log` [log file](../admin-en/configure-logging.md) in the Docker containers has been renamed to `/var/log/wallarm/registernode_loop.log`.

## When upgrading node 3.6

If upgrading from the version 3.6 or lower, please also learn [other changes available starting from the major Wallarm node 4.0 release](/4.0/updating-migrating/what-is-new/).

## When upgrading node 2.18

If upgrading Wallarm node 2.18 or lower, learn all changes from the [separate list](older-versions/what-is-new.md).

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm nodes of version 4.0 and 3.x to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (2.18 and lower). Changes available in Wallarm node 4.2 simplify the node configuration and improve traffic filtration. Please note that some settings of node 4.2 are **incompatible** with the nodes of older versions.

## Upgrade process

1. Review [recommendations for the module upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [Module for NGINX, NGINX Plus or Kong](nginx-modules.md)
      * [Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Cloud node image](cloud-image.md)
      * [Multi-tenant node](multi-tenant.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
