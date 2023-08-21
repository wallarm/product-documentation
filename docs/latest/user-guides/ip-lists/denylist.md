# IP address denylist

**Denylist** is a list of IP addresses that are not allowed to access your applications even if originating legitimate requests. The filtering node in any [mode](../../admin-en/configure-wallarm-mode.md) blocks all requests originated from denylisted IP addresses (unless IPs are duplicated in the [allowlist](allowlist.md)).

In the Wallarm Console → **IP lists** → **Denylist**, you can manage blocked IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![!IP denylist](../../images/user-guides/ip-lists/denylist-apps.png)

!!! info "Old name of the list"
    The old name of the IP address denylist is "IP address blacklist".

## Examples of IP denylist usage

* Block IP addresses from which several consecutive attacks originated.

    An attack may include several requests originating from one IP address and containing malicious payloads of different types. One of the methods to block such attacks is to block requests origin. You can configure automatic source IP blocking by configuring the threshold for source IP blocking and appropriate reaction in the [trigger](../triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).
* Block behavioral-based attacks.

    The Wallarm filtering node can block most harmful traffic request-by-request if a malicious payload is detected. However, for behavioral‑based attacks when every single request is legitimate (e.g. login attempts with username/password pairs) blocking by origin might be necessary.

    By default, automatic blocking of behavioral attack sources is disabled. [Instructions on configuring brute force protection →](../../admin-en/configuration-guides/protecting-against-bruteforce.md#configuration-steps)

## Adding an object to the list

You can both enable Wallarm to denylist IP addresses **automatically if they produce some suspicious traffic** as well as denylist objects **manually**.

!!! info "Adding an IP address to the list on the multi-tenant node"
    If you have installed the [multi-tenant node](../../installation/multi-tenant/overview.md), please firstly switch to the [account of a tenant](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) for which the IP address is added to the list.

### Automatic denylist population (recommended)

The [triggers](../../user-guides/triggers/triggers.md) functionality enables automatic denylisting of IPs by the following conditions:

* Malicious requests of the following types: [`Brute force`, `Forced browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.md), [`BOLA`](../../admin-en/configuration-guides/protecting-against-bola.md).
* `Number of malicious payloads` produced by an IP.

Triggers having the `Denylist IP address` reaction to the listed events automatically denylist IPs for a specified timeframe. You can configure triggers in Wallarm Console → **Triggers**.

### Manual denylist population

To add an IP address, subnet, or group of IP addresses to the list:

1. Open Wallarm Console → **IP lists** → **Denylist** and click the **Add object** button.
1. From the drop-down list, select the list to add the new object to.
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
        * **Malicious IPs** for IP addresses that are well-known for malicious activity, as mentioned in public sources, and verified by expert analysis
3. Select the applications to which you allow or restrict access for the specified IP addresses.
4. Select the period for which an IP address or a group of IP addresses should be added to the list. The minimum value is 5 minutes, the maximum value is forever.
5. Specify the reason for adding an IP address or a group of IP addresses to the list.

![!Add IP to the list (with app)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

### Automatic bots' IPs denylisting

--8<-- "../include/waf/features/ip-lists/autopopulation-by-antibot.md"

## Getting notifications on the denylisted IPs

You can get notifications about newly denylisted IPs via the messengers or SIEM systems you use every day. To enable notifications, configure the appropriate [trigger](../triggers/triggers.md), e.g.:

![!Example of trigger for denylisted IP](../../images/user-guides/triggers/trigger-example4.png)

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"
