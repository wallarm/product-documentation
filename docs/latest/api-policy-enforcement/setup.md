# API Policy Enforcement Setup

This article describes how to enable and configure your API protection based on your [uploaded API specification](overview.md).

## Step 1: Set specification upload parameters

1. At the **API Specifications** section in [US Cloud](https://us1.my.wallarm.com/api-specifications/) or [EU Cloud](https://my.wallarm.com/api-specifications/), click **Upload specification**.
1. Select from where to upload: your local machine or URL. For URLs, via the header fields you can specify a token for authentication. The specification must be in the OpenAPI 3.0 JSON or YAML format.
1. If uploading from URL, decide on whether you need to **Regularly update the specification** (selected by default). This will update the specification every hour.

    ![Upload specification](../images/api-policies-enforcement/specificaton-upload.png)

1. Initiate uploading.

## Step 2: Set actions for violations of policies

1. Click the **API specification-based policy enforcement** tab.

    !!! info "Rogue API detection"
        * Besides policy enforcement, specifications may be used by [API Discovery](../api-discovery/overview.md) module for the [rogue API detection](../api-discovery/rogue-api.md). The tab is displayed if API Discovery is enabled.
        * Before using the specification for policy enforcement, it is recommended to use it for searching the rogue (shadow, zombie and orphan) APIs using API Discovery. This way you will be able to understand how much your specification differs from the actual requests of your clients.

1. Select **Use for API specification-based policy enforcement**. Options are displayed.
1. Specify host or endpoint for which you want to activate policy violation actions.

    * This field is required.
    * Note that if you incorrectly specify to which endpoints the uploaded specification should be applied, there will be many [false positive](../about-wallarm/protecting-against-attacks.md#false-positives) events.
    * If you have several specifications that apply to the same host, but to different endpoints (for example `domain.com/v1/api/users/` and `domain.com/v1/api/orders/`), you **must** indicate to which endpoints the specification should be applied.
    * If you add a specification to a host, and then add another specification to individual endpoints of this host, both specifications will be applied to these endpoints.
    * The value can be configured via the [URI constructor](../user-guides/rules/add-rule.md#uri-constructor) or [advanced edit form](../user-guides/rules/add-rule.md#advanced-edit-form).

1. Set how the system should react if requests violate your specification.

    ![Specification - use for API policy enforcement](../images/api-policies-enforcement/specification-use-for-api-policies-enforcement.png)

    Details on possible violations:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

    When using the specification for API policy enforcement for the first time, it is recommended to set `Monitor` as a reaction to make sure that the specification is applied to the necessary endpoints and detects real errors.
