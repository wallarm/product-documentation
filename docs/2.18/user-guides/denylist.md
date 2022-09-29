[link-ip-blocking]:     ../admin-en/configure-ip-blocking-en.md
[doc-apps-link]:        settings/applications.md

[img-denylist]:        ../images/user-guides/denylist/denylist.png
[img-denylist-add]:        ../images/user-guides/denylist/ip-denylisting.png
[img-denylist-change-time]: ../images/user-guides/denylist/denylist-contextual-change-time.png
[img-denylist-unblock]: ../images/user-guides/denylist/denylist-contextual-unblock.png

# IP Address Denylist

Wallarm can block most harmful traffic request-by-request if a malicious payload is detected. However, for behavioral‑based attacks when every single request is legitimate (e.g. login attempts with username/password pairs) blocking by origin might be necessary.

Wallarm can block bots and behavioral‑based attacks, such as application abuse, brute-force, and forced browsing, by automatically adding IPs to the denylist. Administrators can also manually add IP addresses for blocking.

![!Denylist tab overview][img-denylist]

The denylist is available in the **Denylist** section of your Wallarm account. The section allows you to:

* Review the list of blocked IP addresses and the reasons they were blocked
* Instantly unblock any IP address or set the time to unblock
* Add an IP address to the denylist

!!! warning "Enable IP address denylisting on the filtering node"
    For the denylisting to take effect, please enable it on the filtering node.
    
    * [Instructions for the regular filtering node][link-ip-blocking]
    * To enable IP address denylisting on the [multi-tenant node](../installation/multi-tenant/overview.md), please send a request to the [Wallarm technical support](mailto:support@wallarm.com).

!!! info "Old name of the list"
    The old name of the IP address denylist is "IP address blacklist".

## Review the Active Denylist

By default, the **Denylist** section is opened on the **Now** tab with the currently denylisted IP addresses.

For each element of a denylist entry, Wallarm shows:

* **IP/Source**: the blocked IP address. The following information is also displayed if it was found in the Wallarm databases:
    * The country or region in which the IP address is registered
    * Which data center the given IP addresses belong to: the **AWS** tag for Amazon, the **GCP** tag for Google, the **Azure** tag for Microsoft data centers, and **DC** for other data centers
    * The **Tor** tag if the attack's source is the Tor network
    * The **VPN** tag if IP address belongs to VPN
    * The **Public proxy** or **Web proxy** tag if the request was sent from the public or web proxy server
* **Reason**: automatically generated or manually inserted reason for denylisting.
* **Application**: the application that is protected by the denylist.
* **Block time**: the date and time of the blocking.
* **Unblock**: a time period after which the blocking will expire.

### Filtering the Active Denylist

You can filter the list of currently blocked IP addresses by:

* IP address specified in the **Search by IP** field
* [Application][doc-apps-link] for which IP address is blocked

### Changing the Blocking Time

One can extend the blocking time for the currently blocked IP address via the **Change blocking time** menu.

![!Change blocking time][img-denylist-change-time]

### Unblocking IPs

To unblock IP addresses, use **Unblock** on the entry with a blocked IP or select several IP addresses and click **Unblock**.

![!Unblock IP][img-denylist-unblock]

!!! warning "Repeated blocking of unblocked IP address"
    After manually unblocking the automatically blocked IP address, this IP address will be repeatedly blocked after half of the previous blocking time.

    For example:

    1. IP address was automatically blocked for 1 hour because 4 different attack vectors were received from this IP address in 3 hours (as it is configured in the [default trigger](triggers/trigger-examples.md#denylist-ip-if-4-or-more-attack-vectors-are-detected-in-3-hours-default-trigger)).
    2. User unblocked this IP address via Wallarm Console.
    3. If 4 different attack vectors are sent from this IP address within 30 minutes of the IP address unblocking, then this IP address will not be added to the denylist.

## Review Blocking History

To review the blocking history, choose the period for which you want to get data in the **Choose date** field. By default, the history includes all IP addresses and applications.

You can filter the history by:

* IP address specified in the **Search by IP** field
* [Application][doc-apps-link] for which IP address is blocked

## Block Manually

!!! info "Blocking the IP address on the multi-tenant node"
    If you have installed the [multi-tenant node](../installation/multi-tenant/overview.md), please switch to the [account of a tenant](../installation/multi-tenant/configure-accounts.md#tenant-account-structure) for which the IP address is blocked before adding the IP address to the denylist.

To start blocking IP addresses:

1. Click the **Add object** button.
2. Enter a value in the field **IP**.
3. Pick a date or use the calendar to specify the blocking time. The minimum blocking time period is 60 minutes.
4. Provide a comment on the blocking reason.
5. Click **Add to denylist**.

!!! warning "Blocking the IP address for a specific application"
    By default, the requests to any application are blocked if they are originated from the denylisted IP address. Application selector is not used when adding the IP address to the denylist.

    You can select the application the IP denylist is applied to. To select the application, please set the directive [`wallarm_acl`](../admin-en/configure-parameters-en.md#wallarm_acl) inside the required server or location block in the NGINX configuration file.

![!Adding to denylist][img-denylist-add]
