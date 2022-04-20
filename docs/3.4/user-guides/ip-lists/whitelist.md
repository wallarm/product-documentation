# IP address whitelist

**Whitelist** is a list of trusted IP addresses that are allowed to access your applications even if requests originated from them contain attack signs. Since the whitelist has the highest priority among other lists, the filtering node in any [filtration mode](../../admin-en/configure-wallarm-mode.md) will not block requests originated from whitelisted IP addresses.

In the Wallarm Console → **IP lists** → **Whitelist**, you can manage whitelisted IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![!IP whitelist](../../images/user-guides/ip-lists/whitelist-apps.png)

!!! warning "IP whitelisting support"
    * IP whitelisting for specific applications is supported starting with the regular (client) and multi-tenant Wallarm node of version 3.2.
    * If the Wallarm node 3.2 or higher operating in the `monitoring` mode detects the attack originated from the whitelisted IP, it uploads the attack data to the Wallarm Cloud. Uploaded data is displayed in the **Events** section of Wallarm Console.
    
    If you are using the regular (client) or [multi-tenant node](../../waf-installation/multi-tenant/overview.md) of version 3.0 or lower, please perform the following steps before IP address whitelist setup:

    1. [Update deployed modules](../../updating-migrating/general-recommendations.md).

        During the module upgrade, please ensure that Wallarm node processes requests originated from whitelisted IP addresses as expected or adjust filtration mode settings to the released changes.

    2. If the Wallarm node version is 2.18 or lower, [migrate current IP blacklists and whitelists to a new IP lists scheme](../../updating-migrating/migrate-ip-lists-to-node-3.md).

## Examples of IP whitelist usage

* To search for vulnerabilities in the system, you can use [Wallarm Vulnerability Scanner](../../about-wallarm-waf/detecting-vulnerabilities.md#vulnerability-scanner). The Scanner sends malicious requests to your application addresses and analyzes application responses. If Scanner IP addresses are not whitelisted, the filtering node can block requests sent by Scanner. To allow Wallarm components to seamlessly scan your resources for vulnerabilities, it is necessary to whitelist Scanner IP addresses.

    Starting with Wallarm node 3.0, Wallarm automatically whitelists Scanner IP addresses.
* If you use other trusted tools that originate potentially malicious requests, it is necessary to manually add source IPs of these tools to the whitelist.

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"