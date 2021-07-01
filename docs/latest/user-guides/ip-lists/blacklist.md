# IP addresses blacklist

**Blacklist** is a list of IP addresses that are not allowed to access your applications. In any [filtering mode](../../admin-en/configure-wallarm-mode.md), the WAF node blocks all requests originated from blacklisted IP addresses (if IPs are not duplicated in the [whitelist](whitelist.md)).

In the Wallarm Console → **IP lists** → **Blacklist**, you can manage blocked IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

<!-- Blacklist screenshot (DOCS-1269) -->

!!! warning "Using the blacklist with the partner WAF node"
    This document describes the IP blacklist configuration for the regular (client) WAF node 3.0. As for the partner WAF node, we recommend to skip updating modules up to 3.0 and keep using the [IP blacklist page available in version 2.18](/2.18/admin-en/configure-ip-blocking-en/).

## Examples of IP blacklist usage

* Block IP addresses from which several consecutive attacks were originated.

    An attack may include several requests originated from one IP address and containing malicious payloads of different types. One of the methods to block such attacks is to block requests origin. You can configure automatic source IP blocking by configuring the threshold for source IP blocking and appropriate reaction in the [trigger](../triggers/trigger-examples.md#blacklist-ip-if-4-or-more-attack-vectors-are-detected-in-1-hour).
* Block behavioral-based attacks.

    The WAF node can block most harmful traffic request-by-request if a malicious payload is detected. However, for behavioral‑based attacks when every single request is legitimate (e.g. login attempts with username/password pairs) blocking by origin might be necessary.

    By default, automatic blocking of behavioral attacks source is disabled. [Instructions on configuring brute force protection →](../../admin-en/configuration-guides/protecting-against-bruteforce.md#configuration-steps)

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists.md"

!!! warning "Re-adding deleted IP address"
    After manually deleting the IP address added to the list by the [trigger](../triggers/triggers.md), the trigger will run again only after half of the previous time the IP address was in the list.
    
    For example:

    1. IP address was automatically added to the greylist for 1 hour because 4 different attack vectors were received from this IP address in 3 hours (as it is configured in the [trigger](../triggers/trigger-examples.md#greylist-ip-if-4-or-more-attack-vectors-are-detected-in-1-hour)).
    2. User deleted this IP address from the greylist via the Wallarm Console.
    3. If 4 different attack vectors are sent from this IP address within 30 minutes, then this IP address will not be added to the greylist.

## Statistics on the blacklisted IP addresses

Using the data of the [WAF dashboard **Blacklist** section](../dashboard/waf.md#blacklisted-ip-addresses), you can analyze the statistics on blacklist changes and currently blocked objects.

![!Blacklisted IP addresses dashboard](../../images/user-guides/dashboard/waf-blacklist-stats.png)