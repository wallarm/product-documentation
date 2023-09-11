# IP address denylist

**Denylist** is a list of IP addresses that are not allowed to access your applications. In the `safe_blocking` and `block` [filtration modes](../../admin-en/configure-wallarm-mode.md), the filtering node blocks all requests originated from denylisted IP addresses (if IPs are not duplicated in the [allowlist](allowlist.md)).

In the Wallarm Console → **IP lists** → **Denylist**, you can manage blocked IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![IP denylist](../../images/user-guides/ip-lists/denylist-apps.png)

!!! info "Old name of the list"
    The old name of the IP address denylist is "IP address blacklist".

## Examples of IP denylist usage

* Block IP addresses from which several consecutive attacks were originated.

    An attack may include several requests originated from one IP address and containing malicious payloads of different types. One of the methods to block such attacks is to block requests origin. You can configure automatic source IP blocking by configuring the threshold for source IP blocking and appropriate reaction in the [trigger](../triggers/trigger-examples.md#denylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).
* Block behavioral-based attacks.

    The Wallarm filtering node can block most harmful traffic request-by-request if a malicious payload is detected. However, for behavioral‑based attacks when every single request is legitimate (e.g. login attempts with username/password pairs) blocking by origin might be necessary.

    By default, automatic blocking of behavioral attacks source is disabled. [Instructions on configuring brute force protection →](../../admin-en/configuration-guides/protecting-against-bruteforce.md#configuration-steps)

## Adding an object to the list

!!! info "Adding an IP address to the list on the multi-tenant node"
    If you have installed the [multi-tenant node](../../installation/multi-tenant/overview.md), please firstly switch to the [account of a tenant](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) for which the IP address is added to the list.

To add an IP address, subnet, or group of IP addresses to the list:

1. Open Wallarm Console → **IP lists** → **Allowlist** and click the **Add object** button.
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
3. Select the applications to which you allow or restrict access for the specified IP addresses.
4. Select the period for which an IP address or a group of IP addresses should be added to the list. The minimum value is 5 minutes, the maximum value is forever.
5. Specify the reason for adding an IP address or a group of IP addresses to the list.

![Add IP to the list (with app)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"
