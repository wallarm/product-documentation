# API Discovery <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

# Uploading Your API Specifications

In the **API Specifications** section of the Wallarm Console UI, you can keep your API specifications which Wallarm users to uncover shadow APIs. This article gives an information on how to use this section.

## Access API Specifications

The **API Specifications** section is included into the **WAAP + Advanced API Security** [subscription plan](../about-wallarm/subscription-plans.md#subscription-plans).

It is available to the users of all [roles](../user-guides/settings/users.md#user-roles). Users of the following roles can add, remove, and change comparison settings:

* Administrator
* Global administrator

## Revealing shadow API

With [**API Discovery**](../about-wallarm/api-discovery.md) in use, your API specifications uploaded at the **API Specifications** section may be compared with what was automatically detected by API Discovery. As the result of this comparison, Wallarm [finds and shows **shadow APIs**](../user-guides/api-discovery.md#finding-shadow-api) - endpoints discovered by Wallarm, but absent in your specification (missing endpoints).

To perform comparison:

1. Navigate to the **API Specifications** section and click **Upload specification**.
1. Select specification to upload. It must be in the OpenAPI 3.0 JSON or JAML format.
1. Set comparison parameters and start uploading.

    As uploading is finished, the number of shadow APIs will be displayed for each specification in the list of **API Specifications** as well as the overall number of found unique shadow APIs. Also shadow APIs will be displayed in the **API Discovery** section.

    ![!API Discovery - API Specifications](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

## Download previously uploaded specifications

You can download the previously uploaded specification via **API Specifications** → specification details window → **Download specification**.
