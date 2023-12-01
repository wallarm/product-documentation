# Types and core logic of IP lists

In the **IP lists** section of Wallarm Console, you can control access to your applications by allowlisting, denylisting, and graylisting IP addresses.

* **Allowlist** is a list of trusted IP addresses that are allowed to access your applications even if requests originated from them contain attack signs.
* **Denylist** is a list of IP addresses that are not allowed to access your applications. Filtering node blocks all requests originated from denylisted IP addresses.
* **Graylist** is a list of IP addresses that are allowed to access your applications only if requests originated from them do not contain attack signs.

![All IP lists](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

## Algorithm of IP lists processing

The filtering node employs different approaches based on the selected operation [mode](../../admin-en/configure-wallarm-mode.md) to analyze IP lists. In certain modes, it assesses all three types of IP lists, namely allowlists, denylists, and graylists. However, in other modes, it focuses on only specific IP lists.

The image provided below visually represents the priorities and combinations of IP lists in each operation mode, highlighting which lists are considered in each case:

![IP list priorities](../../images/user-guides/ip-lists/ip-lists-priorities.png)

## IP lists configuration

To configure IP lists:

1. If Wallarm node is located behind a load balancer or CDN, please make sure to configure your Wallarm node to properly report end-user IP addresses:

    * [Instructions for NGINX-based Wallarm nodes](../../admin-en/using-proxy-or-balancer-en.md) (including AWS / GCP images and Docker node container)
    * [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
2. Add request sources to IP lists:

    * [Allowlist](allowlist.md)
    * [Denylist](denylist.md)
    * [Graylist](graylist.md)

!!! warning "Using additional traffic filtering facilities"
    Note that if you use additional facilities (software or hardware) to automatically filter and block traffic, it is recommended that you configure an allowlist with the IP addresses for the [Wallarm Scanner](../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner). This will allow Wallarm components to seamlessly scan your resources for vulnerabilities.

    See the list of Scanner addresses for US and EU Clouds [here](../../admin-en/scanner-addresses.md).
