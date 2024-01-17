# API Policy Enforcement Setup

This article describes how to enable and configure your API protection based on your [uploaded API specification](overview.md).

## Step 1: Upload specification

1. In the **API Specifications** section in [US Cloud](https://us1.my.wallarm.com/api-specifications/) or [EU Cloud](https://my.wallarm.com/api-specifications/), click **Upload specification**.
1. Set specification upload parameters and start uploading.

    ![Upload specification](../images/api-policies-enforcement/specificaton-upload.png)

Note that you will not be able to start configuring API policy enforcement based on the specification, until its file is successfully uploaded.

## Step 2: Set actions for violations of policies

1. Click the **API specification-based policy enforcement** tab.

    !!! info "Rogue API detection"
        * Besides policy enforcement, specifications may be used by [API Discovery](../api-discovery/overview.md) module for the [rogue API detection](../api-discovery/rogue-api.md). The tab is displayed if API Discovery is enabled.
        * Before using the specification for policy enforcement, it is recommended to use it for searching the rogue (shadow, zombie and orphan) APIs using API Discovery. This way you will be able to understand how much your specification differs from the actual requests of your clients - these differences will most probably cause blocking related requests after policy enforcement.

1. Select **Use for API specification-based policy enforcement**.
1. Specify host or endpoint for which you want to activate policy violation actions.

    * Note that if you incorrectly specify to which endpoints the uploaded specification should be applied, there will be many [false positive](../about-wallarm/protecting-against-attacks.md#false-positives) events.
    * If you have several specifications that apply to the same host, but to different endpoints (for example `domain.com/v1/api/users/` and `domain.com/v1/api/orders/`), you **must** indicate to which endpoints the specification should be applied.
    * If you add a specification to a host, and then add another specification to individual endpoints of this host, both specifications will be applied to these endpoints.
    * The value can be configured via the [URI constructor](../user-guides/rules/add-rule.md#uri-constructor) or [advanced edit form](../user-guides/rules/add-rule.md#advanced-edit-form).

1. Set how the system should react if requests violate your specification.

    ![Specification - use for API policy enforcement](../images/api-policies-enforcement/specification-use-for-api-policies-enforcement.png)

    Details on possible violations:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

    When using the specification for API policy enforcement for the first time, it is recommended to set `Monitor` as a reaction to make sure that the specification is applied to the necessary endpoints and detects real errors.

## Step 3: Configure specific cases or disable

You need additional configuration when using API Policy Enforcement with the NGINX-based Wallarm nodes installed with:

* [All-in-one installer](../installation/nginx/all-in-one.md)
* [Docker image](../admin-en/installation-docker-en.md) - only when you [mount](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file) your own custom configuration file

The following snippet must be added in each `server` section where Wallarm module is used. 

```
location ~ ^/wallarm-apifw(.*)$ {
    wallarm_mode off;
    proxy_pass http://127.0.0.1:8088$1;
    error_page 404 431         = @wallarm-apifw-fallback;
    error_page 500 502 503 504 = @wallarm-apifw-fallback;
}
location @wallarm-apifw-fallback {
    wallarm_mode off;
    return 500 "API FW fallback";
}
```

**Disabling**

In some cases that may be necessary to disable the API Policy Enforcement functionality for some parts of your API. This can be done:

* For NGINX [package deployments](../installation/supported-deployment-options.md#packages) including ones via [All-in-One Installer](../installation/nginx/all-in-one.md), for any `server` section where Wallarm module is used by means of the [`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINX directive set to `off`.
* For For NGINX-based Docker image, by means of the `WALLARM_APIFW_ENABLE` [environment variable](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) set to `false`.
* For NGINX Ingress Controller, by means of the [`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) values group with `enable` set to `false`.
