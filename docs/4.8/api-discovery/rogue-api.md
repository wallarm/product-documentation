# Shadow, Orphan, Zombie API <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

The [API Discovery](overview.md) module automatically identifies shadow, orphan and zombie APIs by comparing your uploaded specification to the live traffic.

|Rogue API type | What is it? |
|--|--|
| [Shadow API](#shadow-api) | An undocumented API that exists within an organization's infrastructure without proper authorization or oversight.|
| [Orphan API](#orphan-api) | A documented API that does not receive traffic. |
| [Zombie API](#zombie-api) | Deprecated APIs that everyone assumes have been disabled but actually they are still in use. |

![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

## Setup

To start finding the rogue APIs, you need to upload specification, select it to be used for rogue API detection and set detection parameters.

As both specification and API itself changes in time, consider the following:

* Comparison starts after first setup
* Comparison re-starts if any [changes in API](track-changes.md) are found
* Comparison re-starts if you save new settings for it
* Comparison re-starts if you pick new file (by name or full URI)
* Comparison re-starts if file uploaded from URI has changes and the **Regularly update the specification** (every hour) option is selected
* You can re‑start comparison at any moment via specification menu → **Restart comparison**.

Also, you can download the previously uploaded specification via **API Specifications** → specification details window → **Download specification**.

### Step 1: Upload specification

1. In the **API Specifications** section in [US Cloud](https://us1.my.wallarm.com/api-specifications/) or [EU Cloud](https://my.wallarm.com/api-specifications/), click **Upload specification**.
1. Set specification upload parameters and start uploading.

    ![Upload specification](../images/api-policies-enforcement/specificaton-upload.png)

Note that you will not be able to start configuring rogue API detection, until the specification file is successfully uploaded.

### Step 2: Set rogue API detection parameters

1. Click the **Rogue APIs detection** tab.
1. Select **Use for rogue APIs detection**.
1. Select **Applications** and **Hosts** - only endpoints related to the selected hosts will be searched for rogue APIs.

    ![API Discovery - API Specifications - uploading API specification to find rogue APIs](../images/about-wallarm-waf/api-discovery/api-discovery-specification-upload.png)

## Viewing found rogue APIs

As comparison is finished, the number of rogue (shadow, orphan and zombie) APIs will be displayed for each specification in the list of **API Specifications**.

![API Specifications section](../images/about-wallarm-waf/api-discovery/api-discovery-specifications.png)

Also rogue APIs will be displayed in the **API Discovery** section. Use the **Rogue APIs** filter to see only shadow, orphan and/or zombie APIs related to the selected comparisons and filter out the remaining endpoints.

![API Discovery - highlighting and filtering rogue API](../images/about-wallarm-waf/api-discovery/api-discovery-highlight-rogue.png)

In the details of such endpoints, in the **Specification conflicts** section, the specification(s) with the help of which shadow/zombie/orphan was detected will be indicated.

Shadow APIs are also displayed among the riskiest endpoints at the [API Discovery Dashboard](dashboard.md).

## Specification versions and zombie APIs

Unlike shadow and orphan APIs, [zombie APIs](#zombie-api) require comparison of different specification versions:

* If during [setup](#setup) the **Regularly update the specification** option was selected, just put new version to the URL where you host your specification - it will be processed by an hourly schedule or immediately if you select **Restart comparison** from the specification menu.
* If the **Regularly update the specification** option was not selected:

    * If uploading from URL and having a new content there, just click **Restart comparison**
    * If uploading from the local machine, open the specification dialog, select new file and save changes. File must have a different name.

All listed will consider the new content to be a next version of the specification. The versions will be compared and zombie API will be displayed.

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
