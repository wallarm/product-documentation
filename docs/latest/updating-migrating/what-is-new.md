# What is new in Wallarm node 4.8

The new minor version of the Wallarm node has been released! It features logging of blocked requests from denylisted sources in the **Events** section. Learn all released changes from this document.

## Logging of blocked requests from denylisted sources

Starting from the release 4.8, the Wallarm platform now logs requests that have been blocked when their source is found in the denylist. It allows you to gain a better understanding of attack profiles and ensures that no blocked activity goes unnoticed.

We have introduced new [search tags and filters](../../user-guides/search-and-filters/use-search.md#search-by-attack-type) within the **Events** section to effortlessly access such events:

* Utilize the `blocked_source` search to identify requests that were blocked due to manual denylisting of IP addresses, subnets, countries, VPNs, and more.
* Employ the `multiple_payloads` search to pinpoint requests blocked by the **Number of malicious payloads** trigger. This trigger is designed to denylist sources that originate malicious requests containing multiple payloads, a common characteristic of multi-attack perpetrators.
* Additionally, the `api_abuse`, `brute`, `dirbust`, and `bola` search tags now encompass requests whose sources were automatically added to the denylist by the relevant Wallarm triggers for their respective attack types.

## Updated structure for the `wallarm_custom_ruleset_id` Prometheus metric

The Prometheus metric `wallarm_custom_ruleset_id` has been enhanced with the addition of a `format` attribute. This new attribute represents the custom ruleset format. Meanwhile, the principal value continues to be the custom ruleset build version. Here is an example of the updated `wallarm_custom_ruleset_id` value:

```
wallarm_custom_ruleset_id{format="51"} 386
```

[More details on configuring Wallarm node metrics](../admin-en/configure-statistics-service.md)

## When upgrading node 3.6 and lower

If upgrading from the version 3.6 or lower, learn all changes from the [separate list](older-versions/what-is-new.md).

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm nodes of version 4.x to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (3.6 and lower). Changes available in Wallarm node 4.8 simplify the node configuration and improve traffic filtration. Please note that some settings of node 4.8 are **incompatible** with the nodes of older versions.

## Upgrade process

1. Review [recommendations for the module upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [Module for NGINX, NGINX Plus](nginx-modules.md)
      * [Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Kong Ingress controller with integrated Wallarm modules](kong-ingress-controller.md)
      * [Sidecar proxy](sidecar-proxy.md)
      * [Cloud node image](cloud-image.md)
      * [CDN node](cdn-node.md)
      * [Multi-tenant node](multi-tenant.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
