# IP address allowlist

**Allowlist** is a list of trusted IP addresses that are allowed to access your applications even if requests originated from them contain attack signs. Since the allowlist has the highest priority among other lists, the filtering node in any [filtration mode](../../admin-en/configure-wallarm-mode.md) will not block requests originated from allowlisted IP addresses.

In the Wallarm Console → **IP lists** → **Allowlist**, you can manage allowlisted IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![IP allowlist](../../images/user-guides/ip-lists/allowlist-apps.png)

!!! info "Old name of the list"
    The old name of the IP address allowlist is "IP address whitelist".

## Examples of IP allowlist usage

If you use other trusted tools that originate potentially malicious requests, it is necessary to manually add source IPs of these tools to the allowlist.

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
        * **Malicious IPs** for IP addresses that are well-known for malicious activity, as mentioned in public sources, and verified by expert analysis. We pull this data from a combination of the following resources:
        
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

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"