# Types and core logic of IP lists

In the **IP lists** section of the Wallarm Console, you can control access to your applications by whitelisting, blacklisting, and greylisting IP addresses.

* **Whitelist** is a list of trusted IP addresses that are allowed to access your applications even if requests originated from them contain attack signs.
* **Blacklist** is a list of IP addresses that are not allowed to access your applications. WAF node blocks all requests originated from blacklisted IP addresses.
* **Greylist** is a list of IP addresses that are allowed to access your applications only if requests originated from them do not contain attack signs.

<!-- IP lists screen (DOCS-1269) -->

!!! warning "IP lists support"
    Controlling access to your applications by whitelisted, blacklisted and greylisted IP addresses is supported starting with the regular (client) WAF node of version 3.0.

    * If you have already deployed the [partner WAF node](../../partner-waf-node/overview.md) of version 2.18 or lower, we recommend to skip updating modules till [WAF node 3.2](../../updating-migrating/versioning-policy.md#version-list) is released. In WAF node 3.2, IP lists will be fully supported by the partner WAF node. At present, the partner WAF node still supports only [blacklist of IP addresses](/2.18/admin-en/configure-ip-blocking-en/).
    * If you have already deployed the regular (client) WAF node of version 2.18 or lower, before setting up IP lists, please [update deployed modules](../../updating-migrating/general-recommendations.md) and [migrate current IP blacklists and whitelists to a new IP lists scheme](../../updating-migrating/migrate-ip-lists-to-node-3.md).

## Algorithm of IP lists processing

In any [filtering mode](../../admin-en/configure-wallarm-mode.md), the WAF node inspects whether source IPs of incoming requests matches entries of IP lists as follows:

* Request filtering is **disabled** or performed in **monitoring mode**:

    1. If a source IP of an incoming request is added to the whitelist, the WAF node forwards an incoming request to your application. If an IP address is not in the list, the next step is performed.
    2. If a source IP of an incoming request is added to the blacklist, the WAF node blocks an incoming request. If an IP address is not in the list, the next step is performed.
    3. If a source IP of an incoming request is neither in the blacklist nor in the whitelist, the WAF node forwards an incoming request to your application event if it contains attack signs.
* Request filtering is performed in **safe blocking mode**:

    1. If a source IP of an incoming request is added to the whitelist, the WAF node forwards an incoming request to your application. If an IP address is not in the list, the next step is performed.
    2. If a source IP of an incoming request is added to the blacklist, the WAF node blocks an incoming request. If an IP address is not in the list, the next step is performed.
    3. If a source IP of an incoming request is added to the greylist and an incoming request contains attack signs, the WAF node blocks an incoming request. If an incoming request does not contain attack signs, the WAF node forwards it to your application. If an IP address is not in the list, the next step is performed.
    4. If a source IP of an incoming request is not in any of the lists, the WAF node forwards an incoming request to your application event if it contains attack signs.
* Request filtering is performed in **blocking mode**:

    1. If a source IP of an incoming request is added to the whitelist, the WAF node forwards an incoming request to your application. If an IP address is not in the list, the next step is performed.
    2. If a source IP of an incoming request is added to the blacklist, the WAF node blocks an incoming request. If an IP address is not in the list, the next step is performed.
    3. If a source IP of an incoming request is neither in the blacklist nor in the whitelist and an incoming request contains attack signs, the WAF node blocks it. If an incoming request does not contain attack signs, the WAF node forwards it to your application.

WAF node analyzes IP lists starting with whitelists, continuing with blacklists, and ending with greylists. For example, if an IP address is added to both whitelist and blacklist, the WAF node considers this IP address as a trusted source and forwards all requests originated from it to your applications regardless of whether an incoming request contains attack signs.

## IP lists configuration

To configure IP lists:

1. IF WAF node is located behind a load balancer or CDN, please make sure to configure your WAF node to properly report end-user IP addresses:

    * [Instructions for NGINX-based WAF nodes](../../admin-en/using-proxy-or-balancer-en.md) (including AWS / GCP / Yandex.Cloud images, Docker node container, and Kubernetes sidecars)
    * [Instructions for the WAF nodes deployed as the Wallarm Kubernetes Ingress controller](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
2. Add request sources to IP lists:

    * [Whitelist](whitelist.md)
    * [Blacklist](blacklist.md)
    * [Greylist](greylist.md)

!!! warning "Using additional traffic filtering facilities"
    Note that if you use additional facilities (software or hardware) to automatically filter and block traffic, it is recommended that you configure a whitelist with the IP addresses for the [Wallarm Scanner](../../about-wallarm-waf/detecting-vulnerabilities.md#vulnerability-scanner). This will allow Wallarm components to seamlessly scan your resources for vulnerabilities.

    * [Scanner IP address registered in Wallarm EU Cloud](../../admin-en/scanner-address-en.md)
    * [Scanner IP address registered in Wallarm US Cloud](../../admin-en/scanner-address-us-en.md)

## Known caveats of IP lists configuration

* Applying access configuration of certain IP to a specific application is not supported. You can apply all IP lists either to all your applications (by default) or to a specific application. To apply IP lists to a specific application, you can move the parameter `disable_acl on` to an appropriate block of [NGINX](../../admin-en/configure-parameters-en.md#disable_acl) or [Envoy](../../admin-en/configuration-guides/envoy/fine-tuning.md#basic-settings) configuration file.
* If the WAF has the trigger configured to automatically block an IP address (for example, [trigger to add IP addresses to the blacklist](../triggers/trigger-examples.md#blacklist-ip-if-4-or-more-attack-vectors-were-detected-in-1-hour)), the system will block the IP for all application instances in a Wallarm account. Similarly for other methods of changing any of the IP lists.
* If you have deployed the [partner WAF node](../../partner-waf-node/overview.md), IP lists will not be supported till [WAF node 3.2](../../updating-migrating/versioning-policy.md#version-list) is released. At present, the partner WAF node still supports only the [blacklist of IP addresses](/2.18/admin-en/configure-ip-blocking-en/).
