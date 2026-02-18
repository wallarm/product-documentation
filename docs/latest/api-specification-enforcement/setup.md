[waf-mode-instr]:   ../admin-en/configure-wallarm-mode.md

# API Specification Enforcement Setup <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to enable and configure your API protection based on your [uploaded API specification](overview.md).

## Step 1: Upload specification

You can upload only specifications in the OpenAPI 3.0, 3.1 (JSON or YAML formats):

1. In the **API Specifications** section in [US Cloud](https://us1.my.wallarm.com/api-specifications/) or [EU Cloud](https://my.wallarm.com/api-specifications/), click **Upload specification**.

    !!! tip ""
        OAS 3.1 requires [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.6.1 or higher and not supported by [Native Node](../installation/nginx-native-node-internals.md#native-node) so far.

1. Set specification upload parameters and start uploading.

    ![Upload specification](../images/api-specification-enforcement/specificaton-upload.png)

Specification file is checked for correspondence to the API specification syntax, and if not valid, is not uploaded. Note that you will not be able to start configuring API specification enforcement, until the specification file is successfully uploaded.

If you select to upload specification from URI and select the **Regularly update the specification** (every hour) option, there may be errors during regular update: URI can be unavailable or updated specification file may not correspond to the API specification syntax. To get notifications on such errors, in your configured [**Integrations**](../user-guides/settings/integrations/integrations-intro.md), select the **System related** events—notifications about specification upload errors is included into this category.

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

    ![Specification - use for applying security policies](../images/api-specification-enforcement/specification-use-for-api-policies-enforcement.png)

    Details on possible violations:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

    When using the specification for setting security policies for the first time, it is recommended to set `Monitor` as a reaction to make sure that the specification is applied to the necessary endpoints and detects real errors.

## Disabling

API Specification Enforcement's work is based on uploaded specification or several specifications each having the **Use for API specification enforcement** option selected. Consider that unchecking this option for some specification or deleting this specification will result in stopping protection based on this specification.

Also, in some cases that may be necessary to disable the API Specification Enforcement functionality only for some parts of your API. This can be done:

* For [all-in-one installer](../installation/nginx/all-in-one.md) deployments, for any `server` section where API Specification Enforcement is used by means of the [`wallarm_enable_apifw`](../admin-en/configure-parameters-en.md#wallarm_enable_apifw) NGINX directive set to `off`.
* For NGINX-based Docker image, by means of the `WALLARM_APIFW_ENABLE` [environment variable](../admin-en/installation-docker-en.md#run-the-container-passing-the-environment-variables) set to `false`.
* For NGINX Ingress Controller, by means of the [`controller.wallarm.apifirewall`](../admin-en/configure-kubernetes-en.md#controllerwallarmapifirewall) values group with `enable` set to `false`.