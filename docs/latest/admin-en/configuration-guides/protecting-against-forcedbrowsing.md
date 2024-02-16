# Protection Against Forced Browsing

Forced browsing attack is one of the attack types that is not detected by Wallarm out-of-the-box, its detection should be properly configured as this guide describes.

[Forced browsing](../../attacks-vulns-list.md#forced-browsing) attacks are characterized by a large number of response codes 404 returned to requests to different URIs for a limited timeframe. 
    
The aim of this attack is to enumerate and access hidden resources (e.g. directories and files containing information on application components). The forced browsing attack type usually allows attackers to collect the information about application and then perform other attack types by exploiting this information.

Note that besides protection from forced browsing, in a similar way, you can configure protection against [brute-force attacks](protecting-against-bruteforce.md).

## Configuring

To configure protection against forced browsing:

1. Open Wallarm Console → **Triggers** and open the window for trigger creation.
1. Select the **Forced browsing** condition.
1. Set the threshold for the number of the 404 response codes returned to the requests having the same origin IP requests.
1. If required, specify **URI** to activate the trigger only for requests sent to certain endpoints, for example:
    
    * Specify the URI of the resource file directory.
    * If using nested URIs, consider [trigger processing priorities](#trigger-processing-priorities).
    * If the URI is not specified, the trigger will be activated at any endpoint with the request number exceeding the threshold.

    URI can be configured via the [URI constructor](../../user-guides/rules/rules.md#uri-constructor) or [advanced edit form](../../user-guides/rules/rules.md#advanced-edit-form) in the trigger creation window.

1. If required, set other trigger filters:

    * **Application** the requests are addressed to.
    * One or more **IP** the requests are sent from.

1. Select trigger reactions:

    * **Mark as forced browsing**. Requests received after the threshold exceeding will be marked as the forced browsing attack and displayed in the **Attacks** section of Wallarm Console.
    * **Denylist IP address** and the period for IP address blocking to add IP addresses of malicious request sources to the [denylist](../../user-guides/ip-lists/overview.md). The Wallarm node will block all requests originated from the denylisted IP after the threshold was exceeded.
    * **Graylist IP address** and the period to [graylist](../../user-guides/ip-lists/overview.md) IP addresses of malicious request sources. The Wallarm node will block requests originated from the graylisted IPs only if requests contain [input validation](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [the `vpatch`](../../user-guides/rules/vpatch-rule.md) or [custom](../../user-guides/rules/regex-rule.md) attack signs. Brute‑force attacks originated from graylisted IPs are not blocked.

    ![Forced browsing trigger example](../../images/user-guides/triggers/trigger-example5.png)

1. Save the trigger and wait for the [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) (usually it takes 2-4 minutes).

You can configure several triggers for brute force protection.

## Testing

1. Send the number of requests that exceeds the configured threshold to the protected URI. For example, 31 requests to `https://example.com/config.json` (matches `https://example.com/**.**`):

    ```bash
    for (( i=0 ; $i<32 ; i++ )) ; do curl https://example.com/config.json ; done
    ```
2. If the trigger reaction is **Denylist IP address**, open Wallarm Console → **IP lists** → **Denylist** and check that source IP address is blocked.

    If the trigger reaction is **Graylist IP address**, check the section **IP lists** → **Graylist** of Wallarm Console.
3. Open the section **Attacks** and check that requests are displayed in the list as a forced browsing attack.

    ![Forced browsing attack in the interface](../../images/user-guides/events/forced-browsing-attack.png)

    The number of displayed requests corresponds to the number of requests sent after the trigger threshold was exceeded ([more details on detecting behavioral attacks](../../attacks-vulns-list.md#behavioral-attacks)). If this number is higher than 5, request sampling is applied and request details are displayed only for the first 5 hits ([more details on requests sampling](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    To search for the forced browsing attacks, you can use the `dirbust` filter. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

## Trigger processing priorities
            
--8<-- "../include/trigger-processing-priorities.md"

## Requirements and restrictions

**Requirements**

To protect resources from forced browsing attacks, real clients' IP addresses are required. If the filtering node is deployed behind a proxy server or load balancer, [configure](../using-proxy-or-balancer-en.md) displaying real clients' IP addresses.

**Restrictions**

When searching for forced browsing attack signs, Wallarm nodes analyze only HTTP requests that do not contain signs of other attack types.
