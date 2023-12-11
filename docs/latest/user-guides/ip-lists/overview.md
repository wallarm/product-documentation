# Restrictions by IP

In the **IP lists** section of Wallarm Console, you can control access to your applications by allowlisting, denylisting, and graylisting IP addresses.

* **Allowlist** is a list of trusted IP addresses that are allowed to access your applications even if requests originated from them contain attack signs.
* **Denylist** is a list of IP addresses that are not allowed to access your applications. Filtering node blocks all requests originated from denylisted IP addresses.
* **Graylist** is a list of IP addresses that are allowed to access your applications only if requests originated from them do not contain attack signs.

![All IP lists](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

## IP lists vs load balancers and CDNs

If Wallarm node is located behind a load balancer or CDN, please make sure to configure your Wallarm node to properly report end-user IP addresses:

* [Instructions for NGINX-based Wallarm nodes](../../admin-en/using-proxy-or-balancer-en.md) (including AWS / GCP images and Docker node container)
* [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## How allowlist, denylist, and graylist work together

The filtering node employs different approaches based on the selected operation [mode](../../admin-en/configure-wallarm-mode.md) to analyze IP lists. In certain modes, it assesses all three types of IP lists, namely allowlists, denylists, and graylists. However, in other modes, it focuses on only specific IP lists.

The image provided below visually represents the priorities and combinations of IP lists in each operation mode, highlighting which lists are considered in each case:

![IP list priorities](../../images/user-guides/ip-lists/ip-lists-priorities.png)

This means that:

* In any mode, if IP is found in the earlier list, the next one is not considered.
* Denylisted IPs are blocked even when the node is in `off` or `Monitoring` mode.
* Graylist is only considered in `Safe blocking` mode.

!!! warning "Exceptions"
    If [`wallarm_acl_access_phase off`](../../admin-en/configure-parameters-en.md#wallarm_acl_access_phase), the Wallarm node does not analyze the denylist in the `off` mode and does not block requests from denylisted IPs in the `Monitoring` mode.

## Listing IPs, subnets, locations, and source types

Use **Add object** to add the following into any of IP list:

* **IP or subnet** - the supported maximum subnet mask is `/32` for IPv6 addresses and `/12` for IPv4 addresses.

* **Location** (country or region) to add all IP addresses registered in this country or region
* **Source type** to add all IP addresses that belong to this type, e.g. Tor, AWS, VPN and others.

    Note that **Malicious IPs** source type covers IP addresses that are well-known for malicious activity, as mentioned in public sources, and verified by expert analysis. We pull this data from a combination of the following resources:

    * [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
    * [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
    * [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
    * [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
    * [www.blocklist.de](https://www.blocklist.de/en/export.html)
    * [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
    * [IPsum](https://github.com/stamparm/ipsum)

## Limiting by target application

When adding object to a list, by default it will process all requests from the listed IP. But you can limit that by target applications: select one or several applications and only requests from the listed IP to that applications will be processed.

## IP lists over time

When adding object to a list, you specify time for which it is added. The minimum time is 5 minutes, default is 1 hour, the maximum is forever. On expiration, the object is automatically deleted from the list.

Thus, IP lists have not only the current state, but also the states back in time and they differ. Choose specific dates to examine the IP list content, and the system will return a detailed **History** of its changes, including the exact timing and method of addition, be it manual or automated. The report also provides data on the individuals responsible for the changes and the reasons behind each inclusion. Such insights help in maintaining an audit trail for compliance and reporting.

![IP List history](../../images/user-guides/ip-lists/ip-list-history.png)

Switch back to the **Now** tab to get the current state of the IP list, allowing you to view the objects presently included in the list.

You can change the time the object should stay in the list - to do this, in its menu, click **Change time period** and make adjustments.

## Automatic listing

You can enable Wallarm to denylist or graylist IP addresses automatically if they produce some suspicious traffic. This can be done for:

* [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [BOLA Protection](../../admin-en/configuration-guides/protecting-against-bola.md)
* Exceeded threshold for malicious payloads
* [API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works)

Note that if you manually delete an automatically listed IP, if new malicious activity is detected it will be automatically added again but:

* **Not before** half of the previous time period

    For example, if IP address was automatically denylisted for 4 hours due to BOLA attack from it and you delete it from denylist, it will not be re-added within next 2 hours, even if attacks occur.

* For **API Abuse Prevention** - immediately

## Events from denylisted IPs

You can access a list of events originating from any IP address currently on the denylist or previously listed, by clicking on the IP address of interest. This will redirect you to the Events section, where the [relevant event list](../events/analyze-attack.md#analyze-requests-from-denylisted-ips) is displayed.

![Img](../../images/user-guides/events/denylisted-ip-events.png)

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-allow-apps.md"
