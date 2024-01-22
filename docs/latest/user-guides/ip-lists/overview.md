# Filtering by IP

In the **IP lists** section of Wallarm Console, you can control access to your applications by allowlisting, denylisting, and graylisting of IP addresses, geographical locations, data centers or source types.

* **Allowlist** is a list of trusted sources that bypass Wallarm protection and access your applications without any checks.
* **Denylist** is a list of sources that cannot access your applications - all requests from them will be blocked.
* **Graylist** is a list of suspicious sources which attacks ([input validation](../../attacks-vulns-list.md#input-validation-attacks), [vpatch](../rules/vpatch-rule.md), and [detected based on regular expressions](../rules/regex-rule.md)) will be blocked in `Safe blocking` [mode](../../admin-en/configure-wallarm-mode.md). In any other mode, all sources in Graylist are ignored.

![All IP lists](../../images/user-guides/ip-lists/ip-lists-home-apps.png)

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

## Configuring IP lists

Steps:

1. Decide which list to use depending on your purpose.
1. Select [which object to add](#select-object): IP, subnet, location, source type.
1. [Select time](#select-time-to-stay-in-list) for which the object will stay in a list (it is usually not forever).
1. [Limit by target application](#limit-by-target-application) (not all requests, but only targeting specific application).

### Select object

Use **Add object** to add the following into any of IP lists:

* **IP or subnet** - the supported maximum subnet mask is `/32` for IPv6 addresses and `/12` for IPv4 addresses.

* **Location** (country or region) to add all IP addresses registered in this country or region
* **Source type** to add all IP addresses that belong to this type. Available types are:

    * Search Engines
    * Datacenters (AWS, GCP, Oracle, etc.)
    * Anonymous sources (Tor, Proxy, VPN)
    * [Malicious IPs](#malicious-ip-feeds)

![Add object to IP list](../../images/user-guides/ip-lists/add-ip-to-list.png)

!!! info "Automatic population of IP lists"
    Note that besides adding objects manually, you can use [automatic list population](#automatic-listing), which is **preferable**.

### Select time to stay in list

When adding object to a list, you specify time for which it is added. The minimum time is 5 minutes, default is 1 hour, the maximum is forever. On expiration, the object is automatically deleted from the list.

You can change the specified time at any moment later - to do this, in the object's menu, click **Change time period** and make adjustments.

Setting this time along with manual objects adding and deleting leads to changes of IP lists in time. You can [view the historical states](#ip-list-history) of all lists.

### Limit by target application

When adding object to a list, by default all requests from the listed IP will be processed. But you can limit that by target [applications](../../user-guides/settings/applications.md): select one or several applications and only requests from the listed IP to that applications will be processed.

## Malicious IP feeds

When adding the **Malicious IPs** [source type](#select-object) to one of the IP lists, note that this will include all IP addresses that are well-known for malicious activity, as mentioned in public sources, and verified by expert analysis. We pull this data from a combination of the following resources:

* [Collective Intelligence Network Security](http://cinsscore.com/list/ci-badguys.txt)
* [Proofpoint Emerging Threats Rules](https://rules.emergingthreats.net/blockrules/compromised-ips.txt)
* [DigitalSide Threat-Intel Repository](http://osint.digitalside.it/Threat-Intel/lists/latestips.txt)
* [GreenSnow](https://blocklist.greensnow.co/greensnow.txt)
* [www.blocklist.de](https://www.blocklist.de/en/export.html)
* [NGINX ultimate bad bot blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/blob/master/_generator_lists/bad-ip-addresses.list)
* [IPsum](https://github.com/stamparm/ipsum)

## IP list history

IP lists have not only the current state, but also the states [back in time](#select-time-to-stay-in-list) and they differ. Choose specific dates to examine the IP list content, and the system will return a detailed **History** of its changes, including the exact timing and method of addition, be it manual or automated. The report also provides data on the individuals responsible for the changes and the reasons behind each inclusion. Such insights help in maintaining an audit trail for compliance and reporting.

![IP List history](../../images/user-guides/ip-lists/ip-list-history.png)

Switch back to the **Now** tab to get the current state of the IP list, allowing you to view the objects presently included in the list.

## Automatic listing

You can enable Wallarm to denylist or graylist IP addresses automatically if they produce some suspicious traffic. This can be done for:

* [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [BOLA Protection](../../admin-en/configuration-guides/protecting-against-bola.md)
* [Exceeded threshold for malicious payloads](../../admin-en/configuration-guides/protecting-with-thresholds.md)
* [API Abuse Prevention](../../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works)

Note that if you manually delete an automatically listed IP, if new malicious activity is detected it will be automatically added again but:

* **Not before** half of the previous time period

    For example, if IP address was automatically denylisted for 4 hours due to BOLA attack from it and you delete it from denylist, it will not be re-added within next 2 hours, even if attacks occur.

* For **API Abuse Prevention** - immediately

## Getting notifications on the denylisted IPs

You can get notifications about newly denylisted IPs via the messengers or SIEM systems you use every day. To enable notifications, in **Triggers** section, configure one or several triggers with the **Denylisted IP** condition, e.g.:

![Example of trigger for denylisted IP](../../images/user-guides/triggers/trigger-example4.png)

**To test the trigger:**

1. Go to Wallarm Console → **Integrations** in the [US](https://us1.my.wallarm.com/integrations/) or [EU](https://my.wallarm.com/integrations/) cloud, and configure [integration with Slack](../../user-guides/settings/integrations/slack.md).
1. In **Triggers**, create trigger as shown above.
1. Go to **IP Lists** → **Denylist** and add the `1.1.1.1` IP with the "It is a malicious bot" reason.
1. Check messages in your Slack channel like:
    ```
    [wallarm] New IP address has been denylisted
    
    Notification type: ip_blocked

    IP address 1.1.1.1 has been denylisted until 2024-01-19 15:02:16 +0300 
    for the reason "It is a malicious bot". You can review denylisted IP addresses
    in the "IP lists → Denylist" section of Wallarm Console.

    This notification was triggered by the "Notify about new denylisted IPs" trigger.
    The IP is blocked for the application default.

    Client: Your Company
    Cloud: EU
    ```

## Configuring nodes behind load balancers and CDNs to work with IP lists

If Wallarm node is located behind a load balancer or CDN, please make sure to configure your Wallarm node to properly report end-user IP addresses:

* [Instructions for NGINX-based Wallarm nodes](../../admin-en/using-proxy-or-balancer-en.md) (including AWS / GCP images and Docker node container)
* [Instructions for the filtering nodes deployed as the Wallarm Kubernetes Ingress controller](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)

## Managing lists via API

You can get any IP list content, populate it with objects and delete objects from it by [calling the Wallarm API](../../api/request-examples.md#api-calls-to-get-populate-and-delete-ip-list-objects) directly.
