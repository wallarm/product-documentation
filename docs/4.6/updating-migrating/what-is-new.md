# What is new in Wallarm node 4.6

The new minor version of the Wallarm node has been released! It features an important API rate limiting function to prevent DoS, brute force, and API overuse attacks. Learn all released changes from this document.

## All-in-one installer

Now, when installing and upgrading Wallarm node as a dynamic module for NGINX in various environments, you can use the **all-in-one installer** designed to streamline and standardize the process of installation. This installer automatically identifies your operating system’s and NGINX versions, and install all the necessary dependencies.

The installer simplifies the process by automatically performing the following actions:

1. Checking your OS and NGINX version.
1. Adding Wallarm repositories for the detected OS and NGINX version.
1. Installing Wallarm packages from these repositories.
1. Connecting the installed Wallarm module to your NGINX.
1. Connecting the filtering node to Wallarm Cloud using the provided token.

[See details on how to deploy the node with all-in-one installer →](../installation/nginx/all-in-one.md)

## Rate limits

The lack of proper rate limiting has been a significant problem for API security, as attackers can launch high-volume requests causing a denial of service (DoS) or overload the system, which hurts legitimate users.

With Wallarm's rate limiting feature supported since Wallarm node 4.6, security teams can effectively manage the service's load, ensuring that the service remains available and secure for legitimate users. This feature offers various connection limits based on request and session parameters, including traditional IP-based rate limiting, JSON fields, base64 encoded data, cookies, XML fields, and more.

For example, you can limit API connections for each user, preventing them from making thousands of requests per minute. This would put a heavy load on your servers and could cause the service to crash. By implementing rate limiting, you can protect your servers from overload and ensure that all users have fair access to the API.

You can configure rate limits easily in the Wallarm Console UI → **Rules** → **Set rate limit** by specifying the rate limit scope, rate, burst, delay, and response code for your particular use case.

[Guide on rate limit configuration →](../user-guides/rules/rate-limiting.md)

## Removal of the email-password based node registration

With the release of Wallarm node 4.6, email-password based registration of Wallarm nodes in the Cloud has been removed. This method was deprecated with the release of version 4.0, and most customers have already migrated to a new registration method. If you have not done so yet, it is now mandatory to switch to the token-based node registration method to continue with Wallarm node 4.6 and above.

Nodes of version 4.6 and above can only be registered using tokens, which ensures a more secure and faster connection to the Wallarm Cloud. Instructions for migrating to the token-based node registration method are provided in each migration guide to help with the transition.

Changes in node registration methods also result in some updates in node types. [Read more](older-versions/what-is-new.md#unified-registration-of-nodes-in-the-wallarm-cloud-by-tokens)

## New blocking page

The sample blocking page `/usr/share/nginx/html/wallarm_blocked.html` has been updated. In the new node version, it has new layout and supports the logo and support email customization.
    
New blocking page with the new layout looks as follows by default:

![Wallarm blocking page](../images/configuration-guides/blocking-page-provided-by-wallarm-36.png)

[More details on the blocking page setup →](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page)

## Changes in the statistics service parameters

The Wallarm statistics service returns the new `rate_limit` parameters with the [Wallarm rate limiting](#rate-limits) module data. New parameters cover rejected and delayed requests, as well as indicate any problems with the module's operation.

[Details on the statistics service →](../admin-en/configure-statistics-service.md)

## New NGINX directives

Although the [rate limiting rule](#rate-limits) is the recommended method for setting up the feature, you can also configure rate limits using the new NGINX directives:

* [`wallarm_rate_limit`](../admin-en/configure-parameters-en.md#wallarm_rate_limit)
* [`wallarm_rate_limit_enabled`](../admin-en/configure-parameters-en.md#wallarm_rate_limit_enabled)
* [`wallarm_rate_limit_log_level`](../admin-en/configure-parameters-en.md#wallarm_rate_limit_log_level)
* [`wallarm_rate_limit_status_code`](../admin-en/configure-parameters-en.md#wallarm_rate_limit_status_code)
* [`wallarm_rate_limit_shm_size`](../admin-en/configure-parameters-en.md#wallarm_rate_limit_shm_size)

## Easy grouping for node instances

Now you can easily group node instances using one [**API token**](../user-guides/settings/api-tokens.md) with the `Deploy` role for their installation together with the `WALLARM_LABELS` variable and its `group` label. 

For example: 

```bash
docker run -d -e WALLARM_API_TOKEN='<API TOKEN WITH DEPLOY ROLE>' -e NGINX_BACKEND='example.com' -e WALLARM_API_HOST='us1.api.wallarm.com' -e WALLARM_LABELS='group=<GROUP>' -p 80:80 wallarm/node:4.6.2-1
```
...will place node instance into the `<GROUP>` instance group (existing, or, if does not exist, it will be created).

## When upgrading node 3.6 and lower

If upgrading from the version 3.6 or lower, learn all changes from the [separate list](older-versions/what-is-new.md).

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm nodes of version 4.x to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (3.6 and lower). Changes available in Wallarm node 4.6 simplify the node configuration and improve traffic filtration. Please note that some settings of node 4.6 are **incompatible** with the nodes of older versions.

## Upgrade process

1. Review [recommendations for the module upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [Module for NGINX, NGINX Plus](nginx-modules.md)
      * [Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Kong Ingress controller with integrated Wallarm modules](kong-ingress-controller.md)
      * [Sidecar](sidecar-proxy.md)
      * [Cloud node image](cloud-image.md)
      * [CDN node](cdn-node.md)
      * [Multi-tenant node](multi-tenant.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
