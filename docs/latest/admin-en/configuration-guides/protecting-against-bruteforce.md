# Brute Force Protection

Brute‑force attack is one of the attack types that is not detected by Wallarm out-of-the-box, its detection should be properly configured as this guide describes.

[Regular brute‑force attacks](../../attacks-vulns-list.md#brute-force-attack) include password brute‑forcing, session identifier brute‑forcing, credential stuffing. These attacks are characterized by a large number of requests with different forced parameter values sent to a typical URI for a limited timeframe.

Note that:

* Brute-force protection described in this article is one of the ways for the load control provided by Wallarm - alternatively, you can apply [rate limiting](../../user-guides/rules/rate-limiting.md). Use rate limiting for slowing down the incoming traffic and brute-force protection to completely block the attacker.
* Besides brute force protection, in a similar way, you can configure protection against [forced browsing](protecting-against-forcedbrowsing.md).

## Configuring

Consider the example below to learn how to configure brute-force protection.

Let us say you want to protect the authentication endpoints of your `rent-car` application from overload, and, considering server resources, the appropriate rate limit for that is 30 requests from the same IP per 30 seconds. The IPs exceeding this limit when targeting authentication endpoints, should be blocked for 1 hour - and again if they continue to push on the endpoints. Moreover, it will be useful to have information that brute‑force attack took place.

To provide this protection:

1. Open Wallarm Console → **Triggers** and open the window for trigger creation.
1. Select the **Brute force** condition.
1. Set the threshold 30 requests from the same IP per 30 seconds.
1. Set the **Application** filter to `rent-car` (application should be registered in Wallarm).
1. Set the **URI** filter as displayed on the screenshot, including:

    * `**` [wildcard](../../user-guides/rules/rules.md#using-wildcards) in the path meaning "any number of components"
    * `.*login*` [regular expression](../../user-guides/rules/rules.md#condition-type-regex) in the request part meaning "contains `login`"

        Combined, they cover, for example:
        `https://rent-car/users/login`
        `https://rentappc/usrs/us/p-login/sq`

        ![Brute force trigger example](../../images/user-guides/triggers/trigger-example6.png)
    
    * Besides configuring pattern that we need in this example, you can enter specific URIs or set trigger to work at any endpoint by not specifying any URI.
    * If using nested URIs, consider [trigger processing priorities](#trigger-processing-priorities).

1. Do not use the **IP** filter in this case, but be aware that your can use it to set trigger only to react to specific IPs originating requests.
1. Select the **Denylist IP address** - `Block for 1 hour` trigger reaction. The Wallarm node will block all requests originated from the [denylisted](../../user-guides/ip-lists/overview.md) IP after the threshold was exceeded.
1. Select the **Mark as brute force** trigger reaction. Requests received after exceeding the threshold will be marked as the brute‑force attack and displayed in the **Attacks** section of Wallarm Console. In some cases, you can use this reaction alone to have information about the attack, but not to block anything.
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

    The number of displayed requests corresponds to the number of requests sent after the trigger threshold was exceeded ([more details on detecting behavioral attacks](../../attacks-vulns-list.md#behavioral-attacks)). If this number is higher than 5, request sampling is applied and request details are displayed only for the first 5 hits ([more details on requests sampling](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    To search for brute-force attacks, you can use the `brute` filter. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

## Trigger processing priorities
            
--8<-- "../include/trigger-processing-priorities.md"

## Requirements and restrictions

**Requirements**

To protect resources from brute force attacks, real clients' IP addresses are required. If the filtering node is deployed behind a proxy server or load balancer, [configure](../using-proxy-or-balancer-en.md) displaying real clients' IP addresses.

**Restrictions**

When searching for brute‑force attack signs, Wallarm nodes analyze only HTTP requests that do not contain signs of other attack types.
