# Shadow, Orphan, Zombie API <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The [API Discovery](overview.md) module automatically identifies shadow, orphan and zombie APIs by comparing your uploaded specification to the live traffic.

|Rogue API type | What is it? |
|--|--|
| [Shadow API](#shadow-api) | An undocumented API that exists within an organization's infrastructure without proper authorization or oversight.|
| [Orphan API](#orphan-api) | A documented API that does not receive traffic. |
| [Zombie API](#zombie-api) | Deprecated APIs that everyone assumes have been disabled but actually they are still in use. |

![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## Monitor rogue APIs on hourly basis

You can upload your specification to perform immediate comparison of its content with endpoints revealed by API Discovery up to the moment. But two things can change in time:

* Your actual API inventory (changes will be revealed by API Discovery)
* Your own specification (new versions can arrive)

So to set up a constant monitoring of rogue API, you have an option of comparison **on the hourly basis**. To use the option, specification must be uploaded from URL. The specification itself will be updated before each comparison.

To set up monitoring rogue APIs on hourly basis:

1. Navigate to the **API Specifications** section in the [US](https://us1.my.wallarm.com/api-specifications) or [EU](https://my.wallarm.com/api-specifications) Cloud.
1. Click **Upload specification**.
1. Select a specification to upload. It must be in the OpenAPI 3.0 JSON or YAML format.
1. Set comparison parameters:

    * Application(s) and host(s) - only endpoints related to the selected applications/hosts will be compared. If you select **Compare with all current and future discovered applications hosts**, all hosts (of the selected applications) known now and all hosts that will be discovered in future will be included into comparison.

        You can change comparison settings at any moment later - after this the comparison will be re‑done providing new results.

    * Select uploading from URL. If necessary, you can specify a token for authentication.
    * Leave the **Perform regular comparison** option selected (it is by default).

    ![API Discovery - API Specifications - uploading API specification to find rogue APIs](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

1. Start uploading.

As uploading is finished, the number of rogue (shadow, orphan and zombie) APIs will be displayed for each specification in the list of **API Specifications**.

![API Specifications section](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

Also rogue APIs will be displayed in the **API Discovery** section. Use the **Rogue APIs** filter to see only shadow, orphan and/or zombie APIs related to the selected comparisons and filter out the remaining endpoints.

![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

In the details of such endpoints, in the **Specification conflicts** section, the specification(s) with the help of which shadow/zombie/orphan was detected will be indicated.

Shadow APIs are also displayed among the riskiest endpoints at the [API Discovery Dashboard](dashboard.md).

## Find rogue APIs by one-time comparison

You can upload your specification to perform immediate one-time comparison of its content with endpoints revealed by API Discovery up to the moment. To do so, in the comparison settings, select to upload from local machine or deselect the **Perform regular comparison** option for specification uploaded from URL.

Consider the following:

* You can re‑start comparison at any moment via specification menu → **Restart comparison**.
* You can download the previously uploaded specification via **API Specifications** → specification details window → **Download specification**.

## Specification versions and zombie APIs

Unlike shadow and orphan APIs, zombie APIs require comparison of different specification versions:

* In case of [hourly automatic comparison](#monitor-rogue-apis-on-hourly-basis), just put new version to the URL where you host your specification - it will be processed by an hourly schedule or immediately if you select **Restart comparison** from the specification menu.
* In case when regular comparison is not used:

    * If uploading from URL, change this URL to the new one or put new content to the same URL.
    * If uploading from the local machine, open the specification dialog in the Wallarm Console, then upload a new file or the same one with new content.

    Then save specification, and from its menu, select **Restart comparison**.

## Working with multiple specifications

In case you use several separate specifications to describe different aspects of your API, you can upload several or all of them to Wallarm.

In the **API Discovery** section, use the **Compare to...** filter to select specification comparisons - only for them the rogue APIs will be highlighted by the special marks in the **Issues** column.

![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## Getting notified

To get immediate notifications about newly discovered rogue APIs to your [SIEM, SOAR, log management system or messenger](../user-guides/settings/integrations/integrations-intro.md), in the **Triggers** section of Wallarm Console, configure one or more triggers with the **Rogue API detected** condition.

You can get messages about newly discovered shadow, orphan or zombie APIs or about all of them. You can also narrow notifications by application or host that you want to monitor and by the specification used for their detection.

**How notifications come**
    
* Each new found rogue API causes 1 notification message
* If you already got notification about some rogue API, it is not be sent again, no matter how many times the comparison is run
* If you update settings of the uploaded specification, notifications about all **orphan** APIs are re-sent (this does not apply to shadow or zombie APIs)

**Trigger example: notification about newly discovered shadow endpoints in Slack**

In this example, if API Discovery finds new endpoints that are not listed in the `Specification-01` (shadow APIs), the notification about this is sent to your configured Slack channel.

![Rogue API detected trigger](../images/user-guides/triggers/trigger-example-rogue-api.png)

**To test the trigger:**

1. Go to Wallarm Console → **Integrations** in the [US](https://us1.my.wallarm.com/integrations/) or [EU](https://my.wallarm.com/integrations/) cloud, and configure [integration with Slack](../user-guides/settings/integrations/slack.md).
1. In the **API Discovery** section, filter endpoints by API host of your choice, then download results as a specification and name it `Specification-01`.
1. In the **API Specifications** section, upload `Specification-01` for comparison.
1. In the **Triggers** section, create a trigger as shown above.
1. Delete some endpoint from your local `Specification-01` file.
1. In the **API Specifications**, re-upload your `Specification-01` for comparison.
1. Check that your endpoint obtained the shadow API mark in the **Issues** column.
1. Check messages in your Slack channel like:

    ```
    [wallarm] A new shadow endpoint has been discovered in your API

    Notification type: api_comparison_result

    The new GET example.com/users shadow endpoint has been discovered in your API.

        Client: Client-01
        Cloud: US

        Details:

          application: Application-01
          api_host: example.com
          endpoint_path: /users
          http_method: GET
          type_of_endpoint: shadow
          link: https://my.wallarm.com/api-discovery?instance=1802&method=GET&q=example.com%2Fusers
          specification_name: Specification-01
    ```

## Rogue API types and risks

### Shadow API

**Shadow API** refers to an undocumented API that exists within an organization's infrastructure without proper authorization or oversight.

The shadow APIs put businesses at risk, as attackers can exploit them to gain access to critical systems, steal valuable data, or disrupt operations, further compounded by the fact that APIs often act as gatekeepers to critical data and that a range of OWASP API vulnerabilities can be exploited to bypass API security.

In terms of your uploaded API [specifications](#upload-specifications-and-set-comparison-parameters), shadow API is an endpoint presented in actual traffic (detected by API Discovery) and not presented in your specification.

As you find shadow APIs with Wallarm, you can update your specifications to include missing endpoints and further perform monitoring and security activities towards your API inventory in its full view.

### Orphan API

**Orphan API** refers to a documented API that does not receive traffic.

The presence of orphan APIs can be a reason for a verification process which involves:

* Inspecting the Wallarm traffic checking settings to understand whether the traffic is truly not being received, or if it is simply not visible to the Wallarm nodes because they were deployed in such a way that not all traffic passes through them (this may be incorrect traffic routing, or another Web Gateway is presented that was forgotten to put the node on, and so on).
* Determining whether certain applications should not receive any traffic at these specific endpoints or it is some kind of misconfiguration.
* Making decision on obsolete endpoints: used in previous application versions and not used in the current - should they be deleted from the specification to reduce security check effort.

### Zombie API

**Zombie API** refers to deprecated APIs that everyone assumes have been disabled but actually they are still in use.

Zombie API risks are similar to the rest of undocumented (shadow) API but may be worse as the reason for disabling is often the insecure designs that are easier to crack.

In terms of your uploaded API specifications, zombie API is an endpoint presented in the previous version of your specification, not presented in the current version (that is, there was an intention of deletion of this endpoint) but still presented in actual traffic (detected by API Discovery).

Finding zombie API with Wallarm may be the reason to re‑check API configuration of you applications to actually disable such endpoints.
