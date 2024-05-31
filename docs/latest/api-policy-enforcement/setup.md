[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API Specification Enforcement Setup <a href="../../about-wallarm/subscription-plans/#waap-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to enable and configure your API protection based on your [uploaded API specification](overview.md).

## Step 1: Upload specification

1. In the **API Specifications** section in [US Cloud](https://us1.my.wallarm.com/api-specifications/) or [EU Cloud](https://my.wallarm.com/api-specifications/), click **Upload specification**.
1. Set specification upload parameters and start uploading.

    ![Upload specification](../images/api-policies-enforcement/specificaton-upload.png)

Note that you will not be able to start configuring API specification enforcement, until the specification file is successfully uploaded.

## Step 2: Set actions for violations of policies

1. Click the **API specification enforcement** tab.

    !!! info "Rogue API detection"
        * Besides applying security policies, specifications may be used by [API Discovery](../api-discovery/overview.md) module for the [rogue API detection](../api-discovery/rogue-api.md). The tab is displayed if API Discovery is enabled.
        * Before using the specification for applying security policies, it is recommended to use it for searching the rogue (shadow, zombie and orphan) APIs using API Discovery. This way you will be able to understand how much your specification differs from the actual requests of your clients - these differences will most probably cause blocking related requests after applying security policies.

1. Select **Use for API specification enforcement**.
1. Specify host or endpoint for which you want to activate policy violation actions.

    * Note that if you incorrectly specify to which endpoints the uploaded specification should be applied, there will be many [false positive](../about-wallarm/protecting-against-attacks.md#false-positives) events.
    * If you have several specifications that apply to the same host, but to different endpoints (for example `domain.com/v1/api/users/` and `domain.com/v1/api/orders/`), you **must** indicate to which endpoints the specification should be applied.
    * If you add a specification to a host, and then add another specification to individual endpoints of this host, both specifications will be applied to these endpoints.
    * The value can be configured via the [URI constructor](../user-guides/rules/rules.md#uri-constructor) or [advanced edit form](../user-guides/rules/rules.md#advanced-edit-form).

1. Set how the system should react if requests violate your specification.

    ![Specification - use for applying security policies](../images/api-policies-enforcement/specification-use-for-api-policies-enforcement.png)

    Details on possible violations:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

    When using the specification for setting security policies for the first time, it is recommended to set `Monitor` as a reaction to make sure that the specification is applied to the necessary endpoints and detects real errors.

## Step 3: Configure specific cases or disable

You need additional configuration when using API Specification Enforcement with the NGINX-based Wallarm nodes installed with:

* [All-in-one installer](../installation/nginx/all-in-one.md)
* [Docker image](../admin-en/installation-docker-en.md) - only when you [mount](../admin-en/installation-docker-en.md#run-the-container-mounting-the-configuration-file) your own custom configuration file

You need to:

1. Add the following snippet in the NGINX configuration files, in each `server` section where API Specification Enforcement should run:

    ```
    location ~ ^/wallarm-apifw(.*)$ {
        wallarm_mode off;
        proxy_pass http://127.0.0.1:8088$1;
        error_page 404 431         = @wallarm-apifw-fallback;
        error_page 500 502 503 504 = @wallarm-apifw-fallback;
        
        allow 127.0.0.0/8;
        deny all;
    }
    location @wallarm-apifw-fallback {
        wallarm_mode off;
        return 500 "API FW fallback";
    }
    ```

1. As API Specification Enforcement does not support [gRPC](https://en.wikipedia.org/wiki/GRPC), if some of your nodes or locations/servers use gRPC, disable API Specification Enforcement for them as described below.

**Disabling**

In some cases that may be necessary to disable the API Specification Enforcement functionality for some parts of your API. This can be done:

* For NGINX [package deployments](../installation/supported-deployment-options.md#packages) including ones via [all-in-one installer](../installation/nginx/all-in-one.md), for any `server` section where API Specification Enforcement is used by means of the [`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINX directive set to `off`.
* For NGINX-based Docker image, by means of the `WALLARM_APIFW_ENABLE` [environment variable](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) set to `false`.
* For NGINX Ingress Controller, by means of the [`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) values group with `enable` set to `false`.

## Troubleshooting

After installation of the Wallarm node version 4.10.4 or later, in Docker or NGINX log files, you may obtain the following error messages related to API Specification Enforcement, like:

```
2024/04/26 15:12:53 [error] 42#42: *15 Please modify your Nginx configuration in order to enable OpenAPI Enforcement
Put the next snippet into 'server' block with server_name '<SERVER_NAME>':
== begin of the config snippet ===

<CONFIG_SNIPPET>

== end of the config snippet ===
, client: 127.0.0.1, server: <SERVER_NAME>, request: "GET / HTTP/1.1", host: "127.0.0.1"```
```

If you get this message:

* Ignore it if you do not intend to use API Specification Enforcement
* To properly configure API Specification Enforcement and/or remove error messages, place `<CONFIG_SNIPPET>` described in [Step 3](#step-3-configure-specific-cases-or-disable) into `server` section(s) with mentioned `<SERVER_NAME>`.
