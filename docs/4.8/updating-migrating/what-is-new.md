# What is new in Wallarm node 4.8

The new version of the Wallarm node has been released! It features logging of blocked requests from denylisted sources in the **Attacks** section. Learn all released changes from this document.

## Collecting statistics on blocked requests from denylisted sources

Starting from the release 4.8, the Wallarm NGINX‑based filtering nodes now collect statistics on requests that have been blocked when their source is found in the denylist, enhancing your ability to evaluate attack strength. This includes access to the blocked request statistics and their samples, helping you minimize unnoticed activity. You can find this data in the Wallarm Console UI's **Attacks** section.

When using automatic IP blocking (e.g., with the brute force trigger configured), now you can analyze both the initial triggering requests and the samples of subsequent blocked requests. For requests blocked due to manual denylisting of their sources, the new functionality enhances visibility into blocked source actions.

We have introduced new [search tags and filters](../user-guides/search-and-filters/use-search.md#search-by-attack-type) within the **Attacks** section to effortlessly access the newly introduced data:

* Utilize the `blocked_source` search to identify requests that were blocked due to manual denylisting of IP addresses, subnets, countries, VPNs, and more.
* Employ the `multiple_payloads` search to pinpoint requests blocked by the **Number of malicious payloads** trigger. This trigger is designed to denylist sources that originate malicious requests containing multiple payloads, a common characteristic of multi-attack perpetrators.
* Additionally, the `api_abuse`, `brute`, `dirbust`, and `bola` search tags now encompass requests whose sources were automatically added to the denylist by the relevant Wallarm triggers for their respective attack types.

This change introduces the new configuration parameters which by default are set to `on` to enable the functionality but can be switched to `off` to disable it:

* The [`wallarm_acl_export_enable`](../admin-en/configure-parameters-en.md#wallarm_acl_export_enable) NGINX directive.
* The [`controller.config.wallarm-acl-export-enable`](../admin-en/configure-kubernetes-en.md#global-controller-settings) value for the NGINX Ingress controller chart.
* The [`config.wallarm.aclExportEnable`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmaclexportenable) chart value and [`sidecar.wallarm.io/wallarm-acl-export-enable`](../installation/kubernetes/sidecar-proxy/pod-annotations.md) pod's annotation for the Sidecar Controller solution.

## Wallarm NGINX Ingress Controller for ARM64

We now support ARM64 processors with the Wallarm NGINX Ingress Controller. As ARM64 gains traction in server solutions, we are staying up-to-date to meet our customers' needs. This enables enhanced security for API environments, covering both x86 and ARM64 architectures, providing flexibility and protection.

In the deployment guide, we have provided the corresponding [Helm chart configuration examples](../admin-en/installation-kubernetes-en.md#arm64-deployment).

## Excluding specific URLs and requests from bot checks

The API Abuse Prevention module is now more flexible. You can pick specific URLs and requests that should not be checked for malicious bot actions using the [**Set API Abuse Prevention mode** rule](../api-abuse-prevention/setup.md##disabling-and-deleting-profiles). This is helpful for avoiding false positives and for times when you are testing your applications and need to turn off bot checks on some parts. For example, if you are using Klaviyo for marketing, you can set up the rule so it does not check the `Klaviyo/1.0` GET requests, allowing it to work smoothly without unnecessary blocks.

## NGINX-based Docker image verification with official signature

Beginning with release 4.8, Wallarm is now signing its [official NGINX‑based Docker image](https://hub.docker.com/r/wallarm/node) with its official public key.

This means you can now easily [verify](../integrations-devsecops/verify-docker-image-signature.md) the authenticity of the image, enhancing security by guarding against compromised images and supply chain attacks.

## Updated structure for the `wallarm_custom_ruleset_id` Prometheus metric

The Prometheus metric `wallarm_custom_ruleset_id` has been enhanced with the addition of a `format` attribute. This new attribute represents the custom ruleset format. Meanwhile, the principal value continues to be the custom ruleset build version. Here is an example of the updated `wallarm_custom_ruleset_id` value:

```
wallarm_custom_ruleset_id{format="51"} 386
```

[More details on configuring Wallarm node metrics](../admin-en/configure-statistics-service.md)

## API tokens support by Sidecar Controller

Now, during [Sidecar controller deployment](../installation/kubernetes/sidecar-proxy/deployment.md), you can use [API tokens](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) to create filtering nodes and connect them to the Cloud during solution deployment. With API tokens, you can control the lifetime of your tokens and enhance node organization in the UI by setting a node group name.

Node group names are set using the `config.wallarm.api.nodeGroup` parameter in **values.yaml**, with `defaultSidecarGroup` as the default name. Optionally, you can control the names of node groups based on the applications' pods using the `sidecar.wallarm.io/wallarm-node-group` annotation.

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
