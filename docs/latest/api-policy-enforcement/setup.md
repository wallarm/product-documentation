# API Policy Enforcement Setup

This article describes how to enable and cofigure your API protection based on your [uploaded API specification](overview.md).

## Step 1: Set specfication upload parameters

1. Navigate to the **API Specifications** section in [US Cloud](https://us1.my.wallarm.com/api-specifications/) or [EU Cloud](https://my.wallarm.com/api-specifications/).
1. Click **Upload specification**.
1. At the **Specificaton upload**, select from where to upload: your local machine or URL. For URLs, via the header fields you can specify a token for authentication.
1. Select a specification to upload. It must be in the OpenAPI 3.0 JSON or YAML format.
1. If uploading from URL, decide on whether you need to **Regularly update the specification** (selected by default). This will update the specification every hour.
1. Set specification name and add an optional description.

    ![Upload specification](../images/api-policies-enforcement/specificaton-upload.png)

## Step 2: Set actions for violations of policies

1. Click the **API specification-based policy enforcement** tab.

    !!! info "Rogue API detection"
        Besides policy enforcement, specifications may be used by [API Discovery](../about-wallarm/api-discovery.md) module for the [rogue API detection](../about-wallarm/api-discovery.md#shadow-orphan-and-zombie-apis). The tab is displayed if API Discovery is enabled. It is not related to policy enforcement.

1. Select **Use for API specification-based policy enforcement**. Options are displayed.
1. Specify **URI** to activate policy violation actions only for requests sent to certain endpoints.

    * URI can be configured via the [URI constructor](../user-guides/rules/add-rule.md#uri-constructor) or [advanced edit form](../user-guides/rules/add-rule.md#advanced-edit-form).
    * If left empty, policy violation actions will be applied to all endpoints that the filtering node protects.

1. Set how the system should react if requests violate your specification.

    ![Specification - use for API policy enforcement](../images/api-policies-enforcement/specification-use-for-api-policies-enforcement.png)

    Details on possible violations:

    --8<-- "../include/api-policies-enforcement/api-policies-violations.md"

## Step 3: Upload specification

Click **Upload**. This starts upload.

As uploading is finished, the policies are starting to be applied to the requests. Relults are [displayed](viewing-events.md) in the **Events** tab.
