# IP addresses whitelist

**Whitelist** is a list of trusted IP addresses that are allowed to access your applications even if requests originated from them contain attack signs. Since the whitelist has the highest priority among other lists, the WAF node in any [filtering mode](../../admin-en/configure-wallarm-mode.md) will not block requests originated from whitelisted IP addresses.

In the Wallarm Console → **IP lists** → **Whitelist**, you can manage whitelisted IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

<!-- screen with whitelist (DOCS-1269) -->

!!! warning "IP whitelisting support"
    IP whitelisting is supported starting with the regular (client) WAF node of version 3.0.

    * If you have already deployed the [partner WAF node](../../partner-waf-node/overview.md) of version 2.18 or lower, we recommend to skip updating modules till [WAF node 3.2](../../updating-migrating/versioning-policy.md#version-list) is released. In WAF node 3.2, IP lists will be fully supported by the partner WAF node. At present, the partner WAF node still supports only [blacklist of IP addresses](/2.18/admin-en/configure-ip-blocking-en/).
    * If you have already deployed the regular (client) WAF node of version 2.18 or lower, before setting up IP lists, please [update deployed modules](../../updating-migrating/general-recommendations.md) and [migrate current IP blacklists and whitelists to a new IP lists scheme](../../updating-migrating/migrate-ip-lists-to-node-3.md).

## Examples of IP whitelist usage

* To search for vulnerabilities in the system, you can use [Wallarm Vulnerability Scanner](../../about-wallarm-waf/detecting-vulnerabilities.md#vulnerability-scanner). The Scanner sends malicious requests to your application addresses and analyzes application responses. If Scanner IP addresses are not whitelisted, the WAF node can block requests sent by Scanner. To allow Wallarm components to seamlessly scan your resources for vulnerabilities, it is necessary to whitelist Scanner IP addresses.

    Starting with WAF node 3.0, Wallarm automatically whitelists Scanner IP addresses.
* If you use other trusted tools that originate potentially malicious requests, it is necessary to manually add source IPs of these tools to the whitelist.

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists.md"