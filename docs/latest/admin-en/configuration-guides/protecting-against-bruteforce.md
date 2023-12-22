# Brute Force Protection

Brute‑force attack is one of the attack types that is not detected by Wallarm out-of-the-box, its detection should be properly configured as this guide describes.

[Regular brute‑force attacks](../../attacks-vulns-list.md#brute-force-attack) include password brute‑forcing, session identifier brute‑forcing, credential stuffing. These attacks are characterized by a large number of requests with different forced parameter values sent to a typical URI for a limited timeframe.

Note that:

* Brute-force protection described in this article is one of the ways for the load control provided by Wallarm - alternatively, you can apply [rate limiting](../../user-guides/rules/rate-limiting.md).
* Besides brute force protection, in a similar way, you can configure protection against [forced browsing](protecting-against-forcedbrowsing.md).

## Configuring

To configure brute-force protection:

1. Open Wallarm Console → **Triggers** and open the window for trigger creation.
1. Select the **Brute force** condition.
1. Set the threshold for the number of requests originated from the same IP address for a period of time.
1. To activate the trigger only for requests sent to certain endpoints, specify the **URI** filter:
    
    * Besides entering specific URIs, you can [configure patterns](../../user-guides/rules/add-rule.md) using wildcards and regular expressions.

        ![Brute force trigger example](../../images/user-guides/triggers/trigger-example6.png)

    * If you configure password brute‑forcing protection, then specify the URI used for authentication.
    * If using nested URIs, consider [trigger processing priorities](#trigger-processing-priorities).
    * If the URI is not specified, the trigger will be activated at any endpoint with the request number exceeding the threshold.

1. If required, set other trigger filters:

    * **Application** the requests are addressed to.
    * One or more **IP** the requests are sent from.

1. Select trigger reactions:

    * **Mark as brute force**. Requests received after the threshold exceedance will be marked as the brute‑force attack and displayed in the **Attacks** section of Wallarm Console.
    * **Denylist IP address** and the period for IP address blocking to add IP addresses of malicious request sources to the [denylist](../../user-guides/ip-lists/denylist.md). The Wallarm node will block all requests originated from the denylisted IP after the threshold was exceeded.
    * **Graylist IP address** and the period to [graylist](../../user-guides/ip-lists/graylist.md) IP addresses of malicious request sources. The Wallarm node will block requests originated from the graylisted IPs only if requests contain [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [the `vpatch`](../../user-guides/rules/vpatch-rule.md) or [custom](../../user-guides/rules/regex-rule.md) attack signs. Brute‑force attacks originated from graylisted IPs are not blocked.

1. Save the trigger and wait for the [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) (usually it takes 2-4 minutes).

You can configure several triggers for brute-force protection.

## Testing

1. Send the number of requests that exceeds the configured threshold to the protected URI. For example, 50 requests to `example.com/api/v1/login`:

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://example.com/api/v1/login ; done
    ```
1. If the trigger reaction is **Denylist IP address**, open Wallarm Console → **IP lists** → **Denylist** and check that source IP address is blocked.

    If the trigger reaction is **Graylist IP address**, check the section **IP lists** → **Graylist** of Wallarm Console.
1. Open the section **Attacks** and check that requests are displayed in the list as a brute‑force attack.

    ![Brute-force attack in the interface](../../images/user-guides/events/brute-force-attack.png)

    The number of displayed requests corresponds to the number of requests sent after the trigger threshold was exceeded ([more details on detecting behavioral attacks](../../about-wallarm/protecting-against-attacks.md#behavioral-attacks)). If this number is higher than 5, request sampling is applied and request details are displayed only for the first 5 hits ([more details on requests sampling](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    To search for brute-force attacks, you can use the `brute` filter. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

## Trigger processing priorities
            
If nested URIs are specified in the triggers with identical conditions, requests to lower nesting level URI will be counted only in the trigger with the filter by the lower nesting level URI. Same for 404 response codes.

Triggers without URI in the conditions are considered to be the higher nesting level one.

**Example:**

* The first trigger with the **Brute force** condition has no filter by the URI (requests to any application or its part are counted by this trigger).
* The second trigger with the **Brute force** condition has the filter by the URI `example.com/api`.

Requests to `example.com/api` are counted only by the second trigger with the filter by `example.com/api`.

## Requirements and restrictions

**Requirements**

To protect resources from brute force attacks, real clients' IP addresses are required. If the filtering node is deployed behind a proxy server or load balancer, [configure](../using-proxy-or-balancer-en.md) displaying real clients' IP addresses.

**Restrictions**

If the filtering node is deployed behind a proxy server or load balancer, [configure](../using-proxy-or-balancer-en.md) displaying real clients' IP addresses.

When searching for brute‑force attack signs, Wallarm nodes analyze only HTTP requests that do not contain signs of other attack types.
