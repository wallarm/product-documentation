[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

# IP address graylist

**Graylist** is a list of suspicious IP addresses processed by the node only in the **safe blocking** [filtration mode](../../admin-en/configure-wallarm-mode.md) as follows: if graylisted IP originates malicious requests, the node blocks them while allowing legitimate requests.

Malicious requests originating from graylisted IPs are those containing the signs of the following attacks:

* [Input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
* [Attacks of the vpatch type](../rules/vpatch-rule.md)
* [Attacks detected based on regular expressions](../rules/regex-rule.md)

In contrast to graylist, [denylist](../ip-lists/overview.md) points to IP addresses that are not allowed to reach your applications at all - the node blocks even legitimate traffic produced by denylisted sources. IP graylisting is one of the options aimed at the reduction of [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives).

Behavior of the filtering node may differ if graylisted IP addresses are also allowlisted, [more about list priorities](overview.md#algorithm-of-ip-lists-processing).

In Wallarm Console → **IP lists** → **Graylist**, you can manage graylisted IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![IP graylist](../../images/user-guides/ip-lists/graylist.png)

!!! info "Old name of the list"
    The old name of the IP address graylist is "IP address greylist".

## Examples of IP graylist usage

* Graylist IP addresses from which several consecutive attacks originated.

    An attack may include several requests originating from one IP address and containing malicious payloads of different types. One of the methods to block most of the malicious requests and allow legitimate requests originated from this IP address is to graylist this IP. You can [configure automatic source IP graylisting](../../admin-en/configuration-guides/protecting-with-thresholds.md) by configuring the threshold for source IP blocking and appropriate reaction.

    Source IP graylisting can significantly reduce the number of [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives).
* Graylist IP addresses, countries, regions, data centers, networks (for example, Tor) that usually produce harmful traffic. The Wallarm node will allow legitimate requests produced by graylisted objects and block malicious requests.

## Adding an object to the list

You can both enable Wallarm to graylist IP addresses **automatically if they produce some suspicious traffic** as well as graylist objects **manually**.

!!! info "Adding an IP address to the list on the multi-tenant node"
    If you have installed the [multi-tenant node](../../installation/multi-tenant/overview.md), please first switch to the [account of a tenant](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) for which the IP address is added to the list.

    Triggers for automatic IP graylisting also should be configured on the tenant levels.

### Automatic graylist population (recommended)

The [triggers](../../user-guides/triggers/triggers.md) functionality enables automatic graylisting of IPs by the following conditions:

* Malicious requests of the following types: [`Brute force`, `Forced browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.md), [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md).
* `Number of malicious payloads` produced by an IP.
* New company accounts are featured with the [pre-configured (default) trigger](../../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers) graylisting an IP when it originates more than 3 different malicious payloads within 1 hour.

Triggers having the `Graylist IP address` reaction to the listed events automatically graylist IPs for a specified timeframe. You can configure triggers in Wallarm Console → **Triggers**.

### Manual graylist population

To add an IP address, subnet, or group of IP addresses to the list manually:

1. Open Wallarm Console → **IP lists** → **Graylist** and click **Add object**.
2. Specify an IP address or group of IP addresses in one of the following ways:

    * Input a single **IP address** or a **subnet**

        !!! info "Supported subnet masks"
            The supported maximum subnet mask is `/32` for IPv6 addresses and `/12` for IPv4 addresses.
    
    * Select a **country** or a **region** (geolocation) to add all IP addresses registered in this country or region
    * Select the **source type** to add all IP addresses that belong to this type, e.g.:
        * **Tor** for IP addresses of the Tor network
        * **Proxy** for IP addresses of public or web proxy servers
        * **Search Engine Spiders** for IP addresses of search engine spiders
        * **VPN** for IP addresses of virtual private networks
        * **AWS** for IP addresses registered in Amazon AWS
        * **Malicious IPs** for IP addresses that are well-known for malicious activity, as mentioned in public sources, and verified by expert analysis.  We pull this data from a combination of the following resources:
        
            * [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
            * [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
            * [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
            * [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
            * [www.blocklist.de](https://www.blocklist.de/en/export.html)
            * [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
            * [IPsum](https://github.com/stamparm/ipsum)

3. Select the applications to which you allow or restrict access for the specified IP addresses.
4. Select the period for which an IP address or a group of IP addresses should be added to the list. The minimum value is 5 minutes, the maximum value is forever.
5. Specify the reason for adding an IP address or a group of IP addresses to the list.

![Add IP to the list (with app)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### Automatic bots' IPs graylisting

--8<-- "../include/waf/features/ip-lists/autopopulation-by-antibot.md"

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"
