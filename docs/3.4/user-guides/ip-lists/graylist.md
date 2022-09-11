# IP address graylist

**Graylist** is a list of IP addresses that are allowed to access your applications only if requests originated from them do not contain signs of the following attacks:

* [Input validation attacks](../../about-wallarm-waf/protecting-against-attacks.md#input-validation-attacks)
* [Attacks of the vpatch type](../rules/vpatch-rule.md)
* [Attacks detected based on regular expressions](../rules/regex-rule.md)

The Wallarm node blocks requests with malicious payloads that originated from graylisted IP addresses only in the safe blocking [mode](../../admin-en/configure-wallarm-mode.md). If there are no malicious payloads in requests, the filtering node forwards them to your applications. Behavior of the filtering node may differ if graylisted IP addresses are also allowlisted, [more about list priorities](overview.md#algorithm-of-ip-lists-processing).

In the Wallarm Console → **IP lists** → **Graylist**, you can manage graylisted IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![!IP graylist](../../images/user-guides/ip-lists/graylist.png)

!!! warning "IP graylisting support"
    IP graylisting for specific applications is supported starting with the regular (client) and multi-tenant Wallarm node of version 3.2.
    
    If you are using the regular (client) or [multi-tenant node](../../waf-installation/multi-tenant/overview.md) of version 3.0 or lower, please perform the following steps before IP address graylist setup

    1. [Update deployed modules](../../updating-migrating/general-recommendations.md) up to the latest version.
    2. If the Wallarm node version is 2.18 or lower, [migrate current IP denylists and allowlists to a new IP lists scheme](../../updating-migrating/migrate-ip-lists-to-node-3.md).

!!! info "Old name of the list"
    The old name of the IP address graylist is "IP address greylist".

## Examples of IP graylist usage

* Graylist IP addresses from which several consecutive attacks were originated.

    An attack may include several requests originated from one IP address and containing malicious payloads of different types. One of the methods to block most of the malicious requests and allow legitimate requests originated from this IP address is to graylist this IP. You can configure automatic source IP graylisting by configuring the threshold for source IP graylisting and appropriate reaction in the [trigger](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).

    Source IP graylisting can significantly reduce the number of [false positives](../../about-wallarm-waf/protecting-against-attacks.md#false-positives).
* Graylist IP addresses, countries, regions, data centers, networks (for example, Tor) that usually produce harmful traffic. The Wallarm node will allow legitimate requests produced by graylisted objects and block malicious requests.

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"

!!! warning "Re-adding deleted IP address"
    After manually deleting the IP address added to the list by the [trigger](../triggers/triggers.md), the trigger will run again only after half of the previous time the IP address was in the list.
    
    For example:

    1. IP address was automatically added to the graylist for 1 hour because 4 different attack vectors were received from this IP address in 3 hours (as it is configured in the [trigger](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)).
    2. User deleted this IP address from the graylist via Wallarm Console.
    3. If 4 different attack vectors are sent from this IP address within 30 minutes, then this IP address will not be added to the graylist.
