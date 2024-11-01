[api-discovery-enable-link]:    ../../api-discovery/setup.md#enable

# Limiting Request Processing Time

The Wallarm node spends limited time on a single incoming request processing and if the time limit is exceeded, marks the request as the [resource overlimit (`overlimit_res`)](../../attacks-vulns-list.md#resource-overlimit) attack. You can customize the time limit allocated for a single request processing and node behavior when the limit is exceeded.

Limiting the request processing time prevents the bypass attacks aimed at the Wallarm nodes. In some cases, the requests marked as `overlimit_res` can indicate insufficient resources allocated for the Wallarm node modules resulting in long request processing.

## Responding to resource overlimit attacks

Starting from node version 5.1.0, all requests that exceed the configured processing time limits are listed in the **Attacks** section under the `overlimit_res` keyword. The following information will help you determine if the default node behavior in response to these requests is appropriate or if adjustments are needed:

* Does this endpoint deal with the large data (files, etc.) and thus needs more time?

    * If **yes**, increase time limit [for this endpoint specifically](#specific-endpoint-configuration). This will reduce the unprocessed part of request and thus lower the risk of attacks hidden there.
    * If **no**, the endpoint might be under attack, investigate its protection and activities related to it in [**API Discovery**](../../api-discovery/overview.md), [**API Sessions**](../../api-sessions.md), and [**Attacks**](../../user-guides/events/check-attack.md). Adjust protection as described [here](../../user-guides/events/check-attack.md#responding-to-attacks).

* Does this endpoint experience `overlimit_res` problem together with **a lot of other** endpoints? If **yes**, consider [allocating more resources](../../admin-en/configuration-guides/allocate-resources-for-node.md) for the Wallarm node modules which will decrease the request processing time or check the correctness of general configuration.

* Does this endpoint immediately affect user experience and satisfaction?

    * If **yes**, do not change the default **not blocking** behavior. Legitimate traffic will definitely not be blocked, and you will still receive the information about problems as `overlimit_res` in **Attacks**.
    * If **no**, [for this endpoint specifically](#specific-endpoint-configuration), consider changing response to **Block**.

The presence of the `overlimit_res` attacks on endpoints is generally normal but should stay within expected limits. High volumes suggest it may be worth performing analysis and actions described above.

## General configuration

In Wallarm Console → **Settings** → **General** → **Limit request processing time**, you can check the general configuration for request processing time limit. This configuration affects all endpoints unless overridden by [specific endpoint configuration](#specific-endpoint-configuration).

By default, this is: 

* **1,000 milliseconds** on a single incoming request processing.
* Response to exceeding is **Interrupt Wallarm processing and bypass** which means Wallarm: 

    * Stops request processing.
    * Marks the request as the `overlimit_res` attack and displays it in **Attacks**. If the processed request part contains other [attack types](../../attacks-vulns-list.md), the attacks of the corresponding types will be displayed as well.
    * Allows original request to reach the application (protection bypass).<!-- Note that the application has the risk to be exploited by the attacks included in both processed and unprocessed request parts. The default general configuration and [adjusting for specific endpoints](#specific-endpoint-configuration) minimizes this risk.-->

![Limit request processing time - General configuration](../../images/user-guides/rules/fine-tune-overlimit-detection-generic.png)

You can change the general configuration by adjusting time limit and changing the response.

!!! warning "Risk of protection bypass or running out of system memory"
    * It is recommended to change the default node behavior only in the strictly [specific locations](#specific-endpoint-configuration) where it is really necessary, e.g. where the upload of the large files is performed, and where there is no risk of protection bypass and vulnerability exploit.
    * The high time limit can trigger memory exhaustion.

Changing the response to **Block request** means that Wallarm: 

* Stops request processing.
* Marks the request as the `overlimit_res` attack and displays it in **Attacks**. If the processed request part contains other [attack types](../../attacks-vulns-list.md), the attacks of the corresponding types will be displayed as well.
* Blocks request. Note that the legitimate requests have the risk to be blocked. Keeping the default general configuration and setting for blocking [only for specific endpoints](#specific-endpoint-configuration) minimizes this risk.

!!! info "Filtration mode required for blocking"
    Note that blocking will only work when the node is in the **blocking** filtration [mode](../../admin-en/configure-wallarm-mode.md) or **safe blocking** for the requests originating from the [graylisted](../ip-lists/overview.md) IP addresses.

## Specific endpoint configuration

The [default general configuration](#general-configuration) is well tested average approach and is never recommended to be changed. However, you can reach even better balance providing both protection and not blocking the legitimate traffic. Do this by adjusting time limit **specifically** for the endpoints with processing time out of average and **specifically** changing response to **blocking** where it is not immediately risky.

The **Limit request processing time** [rule](../../user-guides/rules/rules.md) enables you to override the [general](#general-configuration) or parent configuration by setting it different for specific endpoint. You can:

* Set custom limit on a single request processing
* Change system response (descriptions of each are [above](#general-configuration))

To set specific endpoint configuration for request processing time limit:

--8<-- "../include/rule-creation-initial-step.md"
1. In **If request is**, [describe](rules.md#configuring) the scope to apply the rule to.
1. In **Then**, choose **Limit request processing time** and set parameters.

## Rule example

Let us say you have the default general configuration of **1,000 milliseconds** and **Interrupt Wallarm processing and bypass** response, and you have many `overlimit_res` attacks for the `https://example.com/upload`. The investigation shows that the endpoint is used for the large file uploading and the legitimate requests are marked as `overlimit_res` attacks because of exceeding the processing time.

To reduce the number of unnecessary `overlimit_res` notifications and lower the chance of malicious payloads hiding in the unprocessed part of the request, for this endpoint specifically, we need to increase the time for request processing.

To do so, set the **Limit request processing time** rule as displayed on the screenshot.

![The "Register and display in the events" rule example](../../images/user-guides/rules/fine-tune-overlimit-detection-example.png)
