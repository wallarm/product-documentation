# Types and core logic of IP lists

In the **IP lists** section of Wallarm Console, you can control access to your applications by whitelisting, blacklisting, and greylisting IP addresses.

* **Whitelist** is a list of trusted IP addresses that are allowed to access your applications even if requests originated from them contain attack signs.
* **Blacklist** is a list of IP addresses that are not allowed to access your applications. Filtering node blocks all requests originated from blacklisted IP addresses.
* **Greylist** is a list of IP addresses that are allowed to access your applications only if requests originated from them do not contain attack signs.

![!All IP lists](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

!!! warning "IP list support"
    Controlling access to your applications by whitelisted, blacklisted and greylisted IP addresses is supported starting with the regular (client) and partner Wallarm node of version 3.2.
    
    If you are using the regular (client) or [partner node](../../partner-waf-node/overview.md) of version 2.18 or lower, please perform the following steps before IP address list setup:

    1. [Update deployed modules](/updating-migrating/older-versions/what-is-new/).
    2. If the Wallarm node version is 2.18 or lower, [migrate current IP blacklists and whitelists to a new IP lists scheme](../../updating-migrating/migrate-ip-lists-to-node-3.md).

## Algorithm of IP lists processing

The filtering node inspects whether source IPs of incoming requests matches entries of IP lists only in the **safe blocking** and **blocking** [modes](../../admin-en/configure-wallarm-mode.md):

* Request filtering is performed in **safe blocking mode**:

    1. If a source IP of an incoming request is added to the whitelist, the filtering node forwards an incoming request to your application. If an IP address is not in the list, the next step is performed.
    2. If a source IP of an incoming request is added to the blacklist, the filtering node blocks an incoming request. If an IP address is not in the list, the next step is performed.
    3. If a source IP of an incoming request is added to the greylist and an incoming request contains attack signs, the filtering node blocks an incoming request. If an incoming request does not contain attack signs, the filtering node forwards it to your application. If an IP address is not in the list, the next step is performed.
    4. If a source IP of an incoming request is not in any of the lists, the filtering node forwards an incoming request to your application even if it contains attack signs.
* Request filtering is performed in **blocking mode**:

    1. If a source IP of an incoming request is added to the whitelist, the filtering node forwards an incoming request to your application. If an IP address is not in the list, the next step is performed.
    2. If a source IP of an incoming request is added to the blacklist, the filtering node blocks an incoming request. If an IP address is not in the list, the next step is performed.
    3. If a source IP of an incoming request is neither in the blacklist nor in the whitelist and an incoming request contains attack signs, the filtering node blocks it. If an incoming request does not contain attack signs, the filtering node forwards it to your application.

The filtering node analyzes IP lists starting with whitelists, continuing with blacklists, and ending with greylists. For example, if an IP address is added to both whitelist and blacklist, the filtering node considers this IP address as a trusted source and forwards all requests originated from it to your applications regardless of whether an incoming request contains attack signs.

## IP lists configuration

To configure IP lists:

1. If Wallarm node is located behind a load balancer or CDN, please make sure to configure your Wallarm node to properly report end-user IP addresses:

    * [Instructions for NGINX-based Wallarm nodes](../../admin-en/using-proxy-or-balancer-en.md) (including AWS / GCP / Yandex.Cloud images, Docker node container, and Kubernetes sidecars)
    * [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
2. Add request sources to IP lists:

    * [Whitelist](whitelist.md)
    * [Blacklist](blacklist.md)
    * [Greylist](greylist.md)

!!! warning "Using additional traffic filtering facilities"
    Note that if you use additional facilities (software or hardware) to automatically filter and block traffic, it is recommended that you configure a whitelist with the IP addresses for the [Wallarm Scanner](../../about-wallarm-waf/detecting-vulnerabilities.md#vulnerability-scanner). This will allow Wallarm components to seamlessly scan your resources for vulnerabilities.

    * [Scanner IP address registered in Wallarm EU Cloud](../../admin-en/scanner-address-eu-cloud.md)
    * [Scanner IP address registered in Wallarm US Cloud](../../admin-en/scanner-address-us-cloud.md)

## Known caveats of IP lists configuration

* If you have the trigger configured to automatically block an IP address (for example, [trigger to add IP addresses to the blacklist](../triggers/trigger-examples.md#blacklist-ip-if-4-or-more-attack-vectors-are-detected-in-1-hour)), the system will block the IP for all application instances in a Wallarm account.
