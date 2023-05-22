# API Discovery <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

# Uploading Your API Specifications

In the **API Specifications** section of the Wallarm Console UI, you can keep your API specifications which Wallarm users to uncover shadow APIs. This article gives an information on how to use this section.

## Access API Specifications

The **API Specifications** section is included into the **WAAP + Advanced API Security** [subscription plan](../about-wallarm/subscription-plans.md#subscription-plans).

It is available to the users of all [roles](../user-guides/settings/users.md#user-roles). Users of the following roles can add, remove, and change comparison settings:

* Administrator
* Global administrator

## Revealing shadow API

With [**API Discovery**](../about-wallarm/api-discovery.md) in use, your API specifications uploaded at the **API Specifications** section may be compared with what was automatically detected by API Discovery. As the result of this comparison, Wallarm [finds and shows **shadow APIs**](../about-wallarm/api-discovery.md#shadow-api) - endpoints discovered by Wallarm, but absent in your specification (missing endpoints).

To perform comparison:

1. Navigate to the **API Specifications** section and click **Upload specification**.
1. Select specification to upload. It must be in the OpenAPI 3.0 JSON or YAML format.
1. Set comparison parameters:

    * Application(s) and host(s) - only endpoints related to the selected applications/hosts will be compared. If you select **Compare with all current and future discovered applications hosts**, all hosts (of the selected applications) known now and all hosts that will be discovered in future will be included into comparison.

        You can change comparison settings at any moment later - after this the comparison will be re-done providing new results.

    * From where to upload: your local machine or URL. For URLs, via the header fields you can specify a token for authentication.
    * Whether the comparison should be performed once after specification upload or every hour (the **Perform regular comparison** option is selected by default). Hourly comparison allows finding additional shadow APIs as API Discovery discovers more endpoints. Specification uploaded from URL is updated before each comparison.

    ![!API Discovery - API Specifications - uploading API specification to find shadow API](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

    Note that you can re-start comparison at any moment manually via specification menu → **Restart comparison**.

1. Start uploading.

    As uploading is finished, the number of shadow APIs will be displayed for each specification in the list of **API Specifications** as well as the overall number of found unique shadow APIs. Also shadow APIs will be displayed in the **API Discovery** section.

    ![!API Specifications section](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

## Download previously uploaded specifications

You can download the previously uploaded specification via **API Specifications** → specification details window → **Download specification**.
