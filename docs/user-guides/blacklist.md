[link-ip-blocking]:     ../admin-en/configure-ip-blocking-en.md

[img-blacklist]:        ../images/user-guides/blacklist/blacklist.png

# IP Address Blacklist

Wallarm can block most harmful traffic request-by-request if a malicious payload is detected. However, for behavioral-based attacks when every single request by itself is legitimate (e.g. login attempts with username/password pairs), blocking by origin is necessary.

Wallarm can block bots and behavioral-based attacks, such as application abuse, brute-force, and forced browsing, by automatically adding IPs to the blacklist. Administrators can also manually add IP addresses and subnets for blocking.

![!Blacklist tab overview][img-blacklist]

The blacklist is available at the *Blacklist* tab where users can

* Review the list of blocked IP addresses and the reasons they were blocked;
* Instantly unblock any IP address or set the time to unblock;
* Add an IP address or a whole subnet to the blacklist.

!!! warning "Enable on Wallarm Node"
    For the blacklisting to take effect, you must enable it on Wallarm Node.
    
    [More...][link-ip-blocking]


## Review the Active Blacklist

By default, Wallarm will show the list of all IPs that are currently blacklisted. The same view is available by clicking the *Now* filter.

For every element of a blacklist entry, Wallarm shows:

* *IP*: the blocked IP address. There may also be a country code in small-sized grey font. 
* *Reason*: automatically generated or manually inserted reason for blacklisting.
* *Application*: the application that is protected by the blacklist.
* *Blocked*: the date and time of the blocking.
* *Unblock*: a time period after which the blocking will expire.

Clicking a row will expand the history data for the selected IP address. 

It is possible to instantly unblock an IP address or change the duration of the ban with the contextual buttons.

## Review Blocking History

Select one of the filters above the table of the blocked entries. 

### Filter by Blocking Date

The filter *Day* displays the blocking history for the last 24 hours. 

You can also select a custom time filter to specify the time range of the events to be displayed.

Both blocking and unblocking events that occurred during the time range will be displayed.

### Filter by Application

Select an application to see its blocking entries. Alternatively, blocking entries for all applications can be viewed by selecting the *All apps* option.

### Filter by IP Address

In the search field, enter the IP address to filter the list.

## Block Manually

To start blocking:

1. Click the *Now* button and the *Add IP or subnet* button.
2. Enter a value in the field *IP, range, or subnet*.
3. Pick a date or use the slider to specify the blocking time.
4. Choose whether to block IPs for all applications or for a selected application.
5. Optionally, provide a comment on the blocking reason.
6. Click *Add to blacklist*.

The minimum blocking time period is 60 minutes.

Entering an IP address with a subnet mask will list every blocked IP address in the expanded table. For example, entering `a.b.c.0/24` will expand the table to list 256 IP addresses.

## Extending the Blocking Time

One can extend the blocking time for the IP address by locating it in the list of currently blocked IPs and changing the ban time.

Filters can be useful when there is a large number of entries in the list. 

## Unblocking IPs

Click *Unblock* on the entry with a blocked IP to remove it from the blacklist.

## Exporting Blacklist Entries

To export the blocking data, click *Export list*.

Wallarm will export a CSV file based on the date range currently selected in the UI with the following fields:

* *ID*: the blocking record number.
* *Application*: the application ID.
* *Type*: the action type (*blocked* or *unblocked*).
* *Time*: the date and time of the action.
* *Country*: the blocked IP address's country.
* *Reason*: automatically generated or manually inserted reason for blacklisting.
