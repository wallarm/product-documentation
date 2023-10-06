# What is new in Wallarm node 4.8

The new version of the Wallarm node has been released! It features logging of blocked requests from denylisted sources in the **Events** section. Learn all released changes from this document.

## Collecting statistics on blocked requests from denylisted sources

Starting from the release 4.8, the Wallarm NGINX‑based filtering nodes now collect statistics on requests that have been blocked when their source is found in the denylist, enhancing your ability to evaluate attack strength. This includes access to the blocked request statistics and their samples, helping you minimize unnoticed activity. You can find this data in the Wallarm Console UI's **Events** section.

When using automatic IP blocking (e.g., with the brute force trigger configured), now you can analyze both the initial triggering requests and the samples of subsequent blocked requests. For requests blocked due to manual denylisting of their sources, the new functionality enhances visibility into blocked source actions.

We have introduced new [search tags and filters](../user-guides/search-and-filters/use-search.md#search-by-attack-type) within the **Events** section to effortlessly access the newly introduced data:

* Utilize the `blocked_source` search to identify requests that were blocked due to manual denylisting of IP addresses, subnets, countries, VPNs, and more.
* Employ the `multiple_payloads` search to pinpoint requests blocked by the **Number of malicious payloads** trigger. This trigger is designed to denylist sources that originate malicious requests containing multiple payloads, a common characteristic of multi-attack perpetrators.
* Additionally, the `api_abuse`, `brute`, `dirbust`, and `bola` search tags now encompass requests whose sources were automatically added to the denylist by the relevant Wallarm triggers for their respective attack types.

This change introduces the new [`wallarm_acl_export_enable`](../admin-en/configure-parameters-en.md#wallarm_acl_export_enable) NGINX directive, which by default is set to `on` to enable the functionality but can be switched to `off` to disable it.

<!-- controller.config.wallarm-acl-export-enable: “off” -->
<!-- to say that only 10 requests (sample) are uploaded to the cloud?? -->

## NGINX-based Docker image verification with official signature

Beginning with release 4.8, Wallarm is now signing its [official NGINX‑based Docker image](https://hub.docker.com/r/wallarm/node) with its official public key.

This means you can now easily [verify](../integrations-devsecops/verify-docker-image-signature.md) the authenticity of the image, enhancing security by guarding against compromised images and supply chain attacks.

## Updated structure for the `wallarm_custom_ruleset_id` Prometheus metric

The Prometheus metric `wallarm_custom_ruleset_id` has been enhanced with the addition of a `format` attribute. This new attribute represents the custom ruleset format. Meanwhile, the principal value continues to be the custom ruleset build version. Here is an example of the updated `wallarm_custom_ruleset_id` value:

```
wallarm_custom_ruleset_id{format="51"} 386
```

[More details on configuring Wallarm node metrics](../admin-en/configure-statistics-service.md)

## When upgrading node 3.6 and lower

If upgrading from the version 3.6 or lower, learn all changes from the [separate list](older-versions/what-is-new.md).

## Which Wallarm nodes are recommended to be upgraded?

* Client and multi-tenant Wallarm nodes of version 4.4 and 4.6 to stay up to date with Wallarm releases and prevent [installed module deprecation](versioning-policy.md#version-support).
* Client and multi-tenant Wallarm nodes of the [unsupported](versioning-policy.md#version-list) versions (4.2 and lower). Changes available in Wallarm node 4.8 simplify the node configuration and improve traffic filtration. Please note that some settings of node 4.8 are **incompatible** with the nodes of older versions.

## Upgrade process

1. Review [recommendations for the module upgrade](general-recommendations.md).
2. Upgrade installed modules following the instructions for your Wallarm node deployment option:

      * [All-in-one installer](all-in-one.md)
      * [Individual packages for NGINX, NGINX Plus, NGINX Distributive](nginx-modules.md)
      * [Docker container with the modules for NGINX or Envoy](docker-container.md)
      * [NGINX Ingress controller with integrated Wallarm modules](ingress-controller.md)
      * [Kong Ingress controller with integrated Wallarm modules](kong-ingress-controller.md)
      * [Sidecar](sidecar-proxy.md)
      * [Cloud node image](cloud-image.md)
      * [CDN node](cdn-node.md)
      * [Multi-tenant node](multi-tenant.md)

----------

[Other updates in Wallarm products and components →](https://changelog.wallarm.com/)
