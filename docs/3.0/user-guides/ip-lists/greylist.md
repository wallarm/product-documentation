# IP address greylist

**Greylist** is a list of IP addresses that are allowed to access your applications only if requests originated from them do not contain signs of the following attacks:

* [Input validation attacks](../../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks)
* [Attacks of the vpatch type](../rules/vpatch-rule.md)
* [Attacks detected based on regular expressions](../rules/regex-rule.md)

The Wallarm node blocks requests with malicious payloads that originated from greylisted IP addresses only in the safe blocking [mode](../../admin-en/configure-wallarm-mode.md). If there are no malicious payloads in requests, the filtering node forwards them to your applications. Behavior of the filtering node may differ if greylisted IP addresses are also whitelisted, [more about list priorities](overview.md#algorithm-of-ip-lists-processing).

In the Wallarm Console → **IP lists** → **Greylist**, you can manage greylisted IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![!IP greylist](../../images/user-guides/ip-lists/greylist.png)

!!! warning "IP greylisting support"
    IP greylisting is supported starting with the regular (client) Wallarm node of version 3.0.

    * If you have already deployed the [partner node](../../partner-waf-node/overview.md) of version 2.18 or lower, we recommend to skip updating modules till [Wallarm node 3.2](../../updating-migrating/versioning-policy.md#version-list) is released. In Wallarm node 3.2, IP lists will be fully supported by the partner node. At present, the partner node still supports only [blacklist of IP addresses](/2.18/admin-en/configure-ip-blocking-en/).
    * If you have already deployed the regular (client) Wallarm node of version 2.18 or lower, before setting up IP lists, please [update deployed modules](../../updating-migrating/general-recommendations.md) and [migrate current IP blacklists and whitelists to a new IP lists scheme](../../updating-migrating/migrate-ip-lists-to-node-3.md).

## Examples of IP greylist usage

* Greylist IP addresses from which several consecutive attacks were originated.

    An attack may include several requests originated from one IP address and containing malicious payloads of different types. One of the methods to block most of the malicious requests and allow legitimate requests originated from this IP address is to greylist this IP. You can configure automatic source IP greylisting by configuring the threshold for source IP greylisting and appropriate reaction in the [trigger](../triggers/trigger-examples.md#greylist-ip-if-4-or-more-attack-vectors-are-detected-in-1-hour).

    Source IP greylisting can significantly reduce the number of [false positives](../../about-wallarm-waf/protecting-against-attacks.md#false-positives).
* Greylist IP addresses, countries, data centers, networks (for example, Tor) that usually produce harmful traffic. The Wallarm node will allow legitimate requests produced by greylisted objects and block malicious requests.

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists.md"

!!! warning "Re-adding deleted IP address"
    After manually deleting the IP address added to the list by the [trigger](../triggers/triggers.md), the trigger will run again only after half of the previous time the IP address was in the list.
    
    For example:

    1. IP address was automatically added to the greylist for 1 hour because 4 different attack vectors were received from this IP address in 3 hours (as it is configured in the [trigger](../triggers/trigger-examples.md#greylist-ip-if-4-or-more-attack-vectors-are-detected-in-1-hour)).
    2. User deleted this IP address from the greylist via the Wallarm Console.
    3. If 4 different attack vectors are sent from this IP address within 30 minutes, then this IP address will not be added to the greylist.
