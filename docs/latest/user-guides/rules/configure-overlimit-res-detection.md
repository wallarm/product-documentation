# The `overlimit_res` attack detection fine‑tuning

The Wallarm node spends limited time on a single incoming request processing and if the time limit is exceeded, marks the request as the [resource overlimiting (`overlimit_res`)](../../attacks-vulns-list.md#resource-overlimit) attack. The **Fine-tune the overlimit_res attack detection** rule enables you to customize the time limit allocated for a single request processing and default node behavior when the limit is exceeded.

Limiting the request processing time prevents the bypass attacks aimed at the Wallarm nodes. In some cases, the requests marked as `overlimit_res` can indicate insufficient resources allocated for the Wallarm node modules resulting in long request processing.

## Default node behavior

The Wallarm node is configured to spend no more than **1,000 milliseconds** on a single incoming request processing by default.

If the time limit is exceeded, the Wallarm node:

1. Stops request processing.
1. Marks the request as the `overlimit_res` attack and uploads attack details to the Wallarm Cloud.

    If the processed request part also contains other [attack types](../../attacks-vulns-list.md), the Wallarm node uploads details on them to the Cloud as well.

    Attacks of the corresponding types will be displayed in the [event list](../events/check-attack.md) in Wallarm Console.
1. <a name="request-blocking"></a>In the **monitoring** [mode](../../admin-en/configure-wallarm-mode.md), the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.

    In the **safe blocking** mode, the node blocks the request if it originates from the [graylisted](../ip-lists/overview.md) IP address. Otherwise, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.

    In the **block** mode, the node blocks the request.

!!! info "Request processing in the "Disabled" mode"
    In the **disabled** [mode](../../admin-en/configure-wallarm-mode.md), the node does not analyze incoming traffic and, consequently, does not catch the attacks aimed at resource overlimiting.

## Changing the default node behavior

!!! warning "Risk of protection bypass or running out of system memory"
    * It is recommended to change the default node behavior only in the strictly specific locations where it is really necessary, e.g. where the upload of the large files is performed, and where there is no risk of protection bypass and vulnerability exploit.
    * The high time limit and/or continuation of request processing after the limit is exceeded can trigger memory exhaustion or out-of-time request processing.

The **Fine-tune the overlimit_res attack detection** rule enables you to change the default node behavior as follows:

* Set custom limit on a single request processing
* Stop or continue the request processing when the time limit is exceeded

    If the node continues request processing after the time limit has been exceeded, it uploads data on detected attacks to the Cloud only after the request processing is fully completed.

    If the rule is set to stop processing, the node stops the request processing once the time limit is exceeded. It then forwards the request unless it is set to record an attack and is in blocking mode. In that case, the node blocks the request and logs the `overlimit_res` attack.
* Register the `overlimit_res` attack when the request processing time limit is exceeded or not

    If the node is configured to register the attack, it either [blocks the request or forwards it to the application address](#request-blocking) depending on the filtration mode.

    If the node is not configured to register the attack and the request does not contain other attack types, the node forwards the original request to the application address. If the request contains other attack types, the node either blocks the request or forwards it to the application address depending on the filtration mode

The rule DOES NOT allow to:

* Set the blocking mode for the `overlimit_res` attacks separately from other configurations. If the **Register and display in the events** option is chosen, the node either blocks the `overlimit_res` attack or forwards it to the application address depending on the [filtration mode](../../admin-en/configure-wallarm-mode.md) set for the corresponding endpoint.

## Rule example

* The rule increases the time limit for processing each POST request to `https://example.com/upload` up to 1,020 milliseconds. The specified endpoint performs large file uploading.
* Other parameters of the node behavior remain default - if the node processes the request longer than 1,020 milliseconds, it stops the request processing and registers the `overlimit_res` attack.

![The "Register and display in the events" rule example](../../images/user-guides/rules/fine-tune-overlimit-detection-example.png)
