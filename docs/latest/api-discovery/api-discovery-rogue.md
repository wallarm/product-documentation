# Shadow, orphan, and zombie API

## Overview

API Discovery allows uncovering rogue (shadow, orphan and zombie) APIs.

A **shadow API** refers to an undocumented API that exists within an organization's infrastructure without proper authorization or oversight. They put businesses at risk, as attackers can exploit them to gain access to critical systems, steal valuable data, or disrupt operations, further compounded by the fact that APIs often act as gatekeepers to critical data and that a range of OWASP API vulnerabilities can be exploited to bypass API security.

In terms of your uploaded API [specifications](../user-guides/api-specifications.md), shadow API is an endpoint presented in actual traffic (detected by API Discovery) and not presented in your specification.

As you find shadow APIs with Wallarm, you can update your specifications to include missing endpoints and further perform monitoring and security activities towards your API inventory in its full view.

An **orphan API** refers to a documented API that does not receive traffic. The presence of orphan APIs can be a reason for a verification process. This involves:

* Inspecting the Wallarm traffic checking settings to understand whether the traffic is truly not being received, or if it is simply not visible to the Wallarm nodes because they were deployed in such a way that not all traffic passes through them (this may be incorrect traffic routing, or another Web Gateway is presented that was forgotten to put the node on, and so on).
* Determining whether certain applications should not receive any traffic at these specific endpoints or it is some kind of misconfiguration.
* Making decision on obsolete endpoints: used in previous application versions and not used in the current - should they be deleted from the specification to reduce security check effort.

A **zombie API** refers to deprecated APIs that everyone assumes have been disabled but actually they are still in use. Their risks are similar to the rest of undocumented (shadow) API but may be worse as the reason for disabling is often the insecure designs that are easier to crack.

In terms of your uploaded API specifications, zombie API is an endpoint presented in the previous version of your specification, not presented in the current version (that is, there was an intention of delection of this endpoint) but still presented in actual traffic (detected by API Discovery).

Finding zombie API with Wallarm may be the reason to re-check API configuration of you applications to actually disable such endpoints.

The API Discovery module automatically uncovers shadow, orphan, and zombie APIs by comparing the discovered API inventory with customers' provided specifications. You upload your API specifications in the [**API Specifications**](../user-guides/api-specifications.md) section and the module automatically highlights shadow, orphan, and zombie endpoints.

![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

* [Learn how to upload specifications for comparison to find rogue APIs →](../user-guides/api-specifications.md#revealing-shadow-orphan-and-zombie-api)
* [Learn how to display found rogue APIs in the API Discovery section →](api-discovery-use.md#displaying-shadow-and-orphan-api)

## Upload specifications and set comparison parameters

In the **API Specifications** section of the Wallarm Console UI, you can keep your API specifications which Wallarm uses to uncover the rogue (shadow, orphan and zombie) APIs. This article gives an information on how to use this section.

**Administrators** and **Global administrators** can add, remove and download specifications and change settings of the rogue API detection. Users of other [roles](../user-guides/settings/users.md#user-roles) can only view the list of uploaded specifications.

### Revealing shadow, orphan and zombie API

With [**API Discovery**](../about-wallarm/api-discovery.md) in use, your API specifications uploaded at the **API Specifications** section may be compared with what was automatically detected by API Discovery. As the result of this comparison, Wallarm [finds and shows rogue (shadow, orphan and zombie) APIs](../about-wallarm/api-discovery.md#shadow-orphan-and-zombie-apis).

To perform comparison:

1. Navigate to the **API Specifications** section and click **Upload specification**.
1. Select a specification to upload. It must be in the OpenAPI 3.0 JSON or YAML format.
1. Set comparison parameters:

    * Application(s) and host(s) - only endpoints related to the selected applications/hosts will be compared. If you select **Compare with all current and future discovered applications hosts**, all hosts (of the selected applications) known now and all hosts that will be discovered in future will be included into comparison.

        You can change comparison settings at any moment later - after this the comparison will be re-done providing new results.

    * From where to upload: your local machine or URL. For URLs, via the header fields you can specify a token for authentication.
    * Whether the comparison should be performed once after specification upload or every hour (the **Perform regular comparison** option is selected by default). Hourly comparison allows finding additional rogue APIs as API Discovery discovers more endpoints. Specification uploaded from URL is updated before each comparison.

    ![API Discovery - API Specifications - uploading API specification to find rogue APIs](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

    Note that you can re-start comparison at any moment manually via specification menu → **Restart comparison**.

1. Start uploading.

    As uploading is finished, the number of rogue (shadow, orphan and zombie) APIs will be displayed for each specification in the list of **API Specifications**. Also rogue APIs will be [displayed](api-discovery.md#displaying-shadow-orphan-and-zombie-api) in the **API Discovery** section.

    ![API Specifications section](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

### Download previously uploaded specifications

You can download the previously uploaded specification via **API Specifications** → specification details window → **Download specification**.

## View found shadow, orphan, and zombie API

The **API Discovery** module automatically uncovers rogue (shadow, orphan and zombie) APIs by comparing the actual registered traffic with the [customers' provided specifications](../user-guides/api-specifications.md). To display [rogue APIs](../about-wallarm/api-discovery.md#shadow-orphan-and-zombie-apis) among endpoints discovered by Wallarm:

* Use the **Compare to...** filter to select specification comparisons - only for them the rogue APIs will be highlighted by the special marks in the **Issues** column.

    ![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

* Use the **Rogue APIs** filter to see only shadow, orphan and/or zombie APIs related to the selected comparisons and filter out the remaining endpoints.

The endpoint is defined as shadow or orphan API as the result of the comparison of the actual traffic with some specifications (there may be several). They will be listed in the endpoint details, in the **Specification conflicts** section. The endpoint is defined as zombie as the result of comparison of the previos and current specification versions and actual traffic.

Shadow APIs are also displayed among the riskiest endpoints at the [API Discovery Dashboard](../user-guides/dashboards/api-discovery.md).
