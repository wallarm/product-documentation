# Using API Specifications

With **API Specifications** you can upload your own API specifications to Wallarm. This article gives an information on how to use **API Specifications**.

See also the **API Specifications** [general overview](../about-wallarm/api-specifications.md).

## Access API Specifications

By default, the section is disabled - contact the [Wallarm support team](mailto:support@wallarm.com) to enable.

After enabling, the **API Specifications** section is available to the users of all [roles](../user-guides/settings/users.md#user-roles). Users of the following roles can add, remove, and change comparison settings:

* Administrator
* Global administrator

## Use with API Discovery to find shadow API

With [**API Discovery**](../about-wallarm/api-discovery.md) in use, at the **API Specifications** section, upload your API specification. As soon as your specification is uploaded, its endpoint list is compared with what was automatically detected by API Discovery and shadow APIs are highlighted.

![!API Discovery - API Specifications](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

When uploading your specification, set:

* Application(s) and host(s) - only endpoints related to the selected applications/hosts will be compared. If you select **Compare with all current and future discovered applications hosts**, all hosts (of the selected applications) known now and all hosts that will be discovered in future will be included into comparison.

    You can change comparison settings at any moment later - after this the comparison will be re-done providing new results.

* From where to upload: your local machine or URL. For URLs, via the header fields you can specify a token for authentication.
* Whether the comparison should be performed once after specification upload or every hour (the **Perform regular comparison** option is selected by default). Hourly comparison allows finding additional shadow APIs as API Discovery discovers more endpoints. Specification uploaded from URL is updated before each comparison.

    ![!API Discovery - API Specifications - uploading API specification to find shadow API](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

    Note that you can re-start comparison at any moment manually via specification menu → **Restart comparison**.

In **API Discovery** section, found shadow APIs obtain the shadow API mark in the **Issues** column. You can use the **Compare to...** filter to highlight shadow APIs for the selected specification comparisons, and **Other → Shadow API** filter to see only shadow APIs.

![!API Discovery - highlighting and filtering shadow API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-shadow.png)

In the details of the endpoint that was defined as Shadow API, the uploaded specifications in which it is absent are listed in the **Specification conflicts** section (there may be several).

A tab with shadow APIs is displayed among the riskiest endpoints at the [API Discovery Dashboard](../user-guides/dashboards/api-discovery.md).

## Download previously uploaded specifications

You can download the previously uploaded specification via **API Specifications** → specification details window → **Download specification**.
