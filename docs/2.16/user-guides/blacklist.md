[link-ip-blocking]:     ../admin-en/configure-ip-blocking-en.md
[doc-apps-link]:        settings/applications.md

[img-blacklist]:        ../images/user-guides/blacklist/blacklist.png
[img-blacklist-add]:        ../images/user-guides/blacklist/ip-blacklisting.png
[img-blacklist-change-time]: ../images/user-guides/blacklist/blacklist-contextual-change-time.png
[img-blacklist-unblock]: ../images/user-guides/blacklist/blacklist-contextual-unblock.png

# IP Address Blacklist

Wallarm can block most harmful traffic request-by-request if a malicious payload is detected. However, for behavioral‑based attacks when every single request is legitimate (e.g. login attempts with username/password pairs), then blocking by origin is necessary.

Wallarm can block bots and behavioral‑based attacks, such as application abuse, brute-force, and forced browsing, by automatically adding IPs to the blacklist. Administrators can also manually add IP addresses and subnets for blocking.

![!Blacklist tab overview][img-blacklist]

The blacklist is available in the **Blacklist** section of your Wallarm account. The section allows you to:

* Review the list of blocked IP addresses and the reasons they were blocked
* Instantly unblock any IP address or set the time to unblock
* Add an IP address or a whole subnet to the blacklist

!!! warning "Enable on Wallarm Node"
    For the blacklisting to take effect, you must enable it on Wallarm Node.
    
    [More...][link-ip-blocking]


## Review the Active Blacklist

By default, the **Blacklist** section is opened on the **Now** tab with the currently blacklisted IP addresses.

For each element of a blacklist entry, Wallarm shows:

* **IP/Source**: the blocked IP address. The following information is also displayed if it was found in the Wallarm databases:
    * The country in which the IP address is registered
    * Which data center the given IP addresses belong to: the **AWS** tag for Amazon, the **GCP** tag for Google, the **Azure** tag for Microsoft data centers, and **DC** for other data centers
    * The **Tor** tag if the attack's source is the Tor network
    * The **VPN** tag if IP address belongs to VPN
    * The **Public proxy** or **Web proxy** tag if the request was sent from the public or web proxy server
* **Reason**: automatically generated or manually inserted reason for blacklisting.
* **Application**: the application that is protected by the blacklist.
* **Block time**: the date and time of the blocking.
* **Unblock**: a time period after which the blocking will expire.

### Filtering the Active Blacklist

You can filter the list of currently blocked IP addresses by:

* IP address specified in the **Search by IP** field
* [Application][doc-apps-link] for which IP address is blocked

### Changing the Blocking Time

One can extend the blocking time for the currently blocked IP address via the **Change blocking time** menu.

![!Change blocking time][img-blacklist-change-time]

### Unblocking IPs

To unblock IP addresses, use **Unblock** on the entry with a blocked IP or select several IP addresses and click **Unblock**.

![!Unblock IP][img-blacklist-unblock]

!!! warning "Repeated blocking of unblocked IP address"
    After manually unblocking the automatically blocked IP address, this IP address will be repeatedly blocked after half of the previous blocking time.

    For example:

    1. IP address was automatically blocked for 1 hour because 4 different attack vectors were received from this IP address in 3 hours (as it is configured in the [default trigger](triggers/trigger-examples.md#blacklist-ip-if-4-or-more-attack-vectors-were-detected-in-3-hours-default-trigger)).
    2. User unblocked this IP address via the Wallarm Console.
    3. If 4 different attack vectors are sent from this IP address within 30 minutes of the IP address unblocking, then this IP address will not be added to the blacklist.

## Review Blocking History

To review the blocking history, choose the period for which you want to get data in the **Choose date** field. By default, the history includes all IP addresses and applications.

You can filter the history by:

* IP address specified in the **Search by IP** field
* [Application][doc-apps-link] for which IP address is blocked

## Block Manually

To start blocking IP addresses:

1. Click the **Block IP or Subnet** button.
2. Enter a value in the field **IP, range, or subnet**.

    !!! info "Subnet mask"
        Entering an IP address with a subnet mask will list every blocked IP address in the expanded table. For example, entering `a.b.c.0/24` will expand the table to list 256 IP addresses.
3. Choose whether to block IPs for all applications or for a specific application.
4. Pick a date or use the calendar to specify the blocking time. The minimum blocking time period is 60 minutes.
5. Provide a comment on the blocking reason.
6. Click **Add to blacklist**.

![!Adding to blacklist][img-blacklist-add]

## Exporting Blacklist Entries

To export the blocking data, use the **Export list** button.

Wallarm will export a CSV file based on the date range currently selected in the UI with the following fields:

* **IP**: IP address
* **Application**: ID of the application for which IP address is blocked
* **Type**: the action type (**block** or **unblock**)
* **Time**: the date and time of the action
* **Country**: the blocked IP address' country
* **Reason**: automatically generated or manually inserted reason for blacklisting
