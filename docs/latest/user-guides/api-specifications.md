# Using API Specifications

With **API Specifications** you can upload your own API specifications to Wallarm. This article gives an information on how to use **API Specifications**.

## Access API Specifications

The **API Specifications** section is available to the users of all [roles](../user-guides/settings/users.md#user-roles). Users of the following roles can add, remove, and change comparison settings:

* Administrator
* Global administrator

## Use with API Discovery to find shadow API

With [**API Discovery**](../about-wallarm/api-discovery.md) in use, your API specifications uploaded at the **API Specifications** section may be compared with what was automatically detected by API Discovery. As the result of this comparison, Wallarm [find and show **shadow APIs**](../user-guides/api-discovery.md#finding-shadow-api) - endpoints discovered by Wallarm, but absent in your specification (missing endpoints).

Number of shadow APIs will be displayed for each specification in the list of **API Specifications** as well as the overall number of found unique shadow APIs. Also shadow APIs will be displayed in the **API Discovery** itself.

![!API Discovery - API Specifications](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

## Download previously uploaded specifications

You can download the previously uploaded specification via **API Specifications** → specification details window → **Download specification**.
