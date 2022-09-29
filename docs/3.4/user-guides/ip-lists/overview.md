# Types and core logic of IP lists

In the **IP lists** section of Wallarm Console, you can control access to your applications by allowlisting, denylisting, and graylisting IP addresses.

* **Allowlist** is a list of trusted IP addresses that are allowed to access your applications even if requests originated from them contain attack signs.
* **Denylist** is a list of IP addresses that are not allowed to access your applications. Filtering node blocks all requests originated from denylisted IP addresses.
* **Graylist** is a list of IP addresses that are allowed to access your applications only if requests originated from them do not contain attack signs.

![!All IP lists](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

!!! warning "IP list support"
    Controlling access to your applications by allowlisted, denylisted and graylisted IP addresses is supported starting with the regular (client) and multi-tenant Wallarm node of version 3.2.
    
    If you are using the regular (client) or [multi-tenant node](../../waf-installation/multi-tenant/overview.md) of version 3.0 or lower, please perform the following steps before IP address list setup:

    1. [Update deployed modules](../../updating-migrating/general-recommendations.md).
    2. If the Wallarm node version is 2.18 or lower, [migrate current IP denylists and allowlists to a new IP lists scheme](../../updating-migrating/migrate-ip-lists-to-node-3.md).

## Algorithm of IP lists processing

!!! warning "Changes in IP list processing in the `off` and `monitoring` filtration modes"
    If you have upgraded the Wallarm modules from version 3.0 or lower up to 3.4, you can see the following differences in IP list logic:

    * Wallarm node analyzes request source only in the `safe_blocking` and `block` modes now.
    * If the Wallarm node operating in the `off` or `monitoring` mode detects the request originated from the [denylisted](denylist.md) IP, it does not block this request.
    * If the Wallarm node operating in the `monitoring` mode detects the attack originated from the [allowlisted](allowlist.md) IP, it uploads the attack data to the Wallarm Cloud. Uploaded data is displayed in the **Events** section of Wallarm Console.

    If required, you can adjust the filtration mode settings to these changes. [Details on filtration mode configuration](../../admin-en/configure-wallarm-mode.md)

The filtering node inspects whether source IPs of incoming requests matches entries of IP lists only in the **safe blocking** and **blocking** [modes](../../admin-en/configure-wallarm-mode.md):

* Request filtering is performed in **safe blocking mode**:

    1. If a source IP of an incoming request is added to the allowlist, the filtering node forwards an incoming request to your application. If an IP address is not in the list, the next step is performed.
    2. If a source IP of an incoming request is added to the denylist, the filtering node blocks an incoming request. If an IP address is not in the list, the next step is performed.
    3. If a source IP of an incoming request is added to the graylist and an incoming request contains attack signs, the filtering node blocks an incoming request. If an incoming request does not contain attack signs, the filtering node forwards it to your application. If an IP address is not in the list, the next step is performed.
    4. If a source IP of an incoming request is not in any of the lists, the filtering node forwards an incoming request to your application even if it contains attack signs.
* Request filtering is performed in **blocking mode**:

    1. If a source IP of an incoming request is added to the allowlist, the filtering node forwards an incoming request to your application. If an IP address is not in the list, the next step is performed.
    2. If a source IP of an incoming request is added to the denylist, the filtering node blocks an incoming request. If an IP address is not in the list, the next step is performed.
    3. If a source IP of an incoming request is neither in the denylist nor in the allowlist and an incoming request contains attack signs, the filtering node blocks it. If an incoming request does not contain attack signs, the filtering node forwards it to your application.

The filtering node analyzes IP lists starting with allowlists, continuing with denylists, and ending with graylists. For example, if an IP address is added to both allowlist and denylist, the filtering node considers this IP address as a trusted source and forwards all requests originated from it to your applications regardless of whether an incoming request contains attack signs.

## IP lists configuration

To configure IP lists:

1. If Wallarm node is located behind a load balancer or CDN, please make sure to configure your Wallarm node to properly report end-user IP addresses:

    * [Instructions for NGINX-based Wallarm nodes](../../admin-en/using-proxy-or-balancer-en.md) (including AWS / GCP images, Docker node container, and Kubernetes sidecars)
    * [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
2. Add request sources to IP lists:

    * [Allowlist](allowlist.md)
    * [Denylist](denylist.md)
    * [Graylist](graylist.md)

!!! warning "Using additional traffic filtering facilities"
    Note that if you use additional facilities (software or hardware) to automatically filter and block traffic, it is recommended that you configure an allowlist with the IP addresses for the [Wallarm Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner). This will allow Wallarm components to seamlessly scan your resources for vulnerabilities.

    * [Scanner IP address registered in Wallarm EU Cloud](../../admin-en/scanner-address-eu-cloud.md)
    * [Scanner IP address registered in Wallarm US Cloud](../../admin-en/scanner-address-us-cloud.md)
