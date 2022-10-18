# IP address graylist

**Graylist** is a list of suspicious IP addresses processed by the node only in the **safe blocking** [filtration mode](../../admin-en/configure-wallarm-mode.md) as follows: if graylisted IP originates malicious requests, the node blocks them while allowing legitimate requests.

Malicious requests originating from graylisted IPs are those containing the signs of the following attacks:

* [Input validation attacks](../../about-wallarm/protecting-against-attacks.md#input-validation-attacks)
* [Attacks of the vpatch type](../rules/vpatch-rule.md)
* [Attacks detected based on regular expressions](../rules/regex-rule.md)

In contrast to graylist, [denylist](../ip-lists/denylist.md) points to IP addresses that are not allowed to reach your applications at all - the node blocks even legitimate traffic produced by denylisted sources. IP graylisting is one of the options aimed at the reduction of [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives).

Behavior of the filtering node may differ if graylisted IP addresses are also allowlisted, [more about list priorities](overview.md#algorithm-of-ip-lists-processing).

In Wallarm Console → **IP lists** → **Graylist**, you can manage graylisted IP addresses as follows:

--8<-- "../include/waf/features/ip-lists/common-actions-with-lists-overview.md"

![!IP graylist](../../images/user-guides/ip-lists/graylist.png)

!!! info "Old name of the list"
    The old name of the IP address graylist is "IP address greylist".

## Examples of IP graylist usage

* Graylist IP addresses from which several consecutive attacks were originated.

    An attack may include several requests originated from one IP address and containing malicious payloads of different types. One of the methods to block most of the malicious requests and allow legitimate requests originated from this IP address is to graylist this IP. You can configure automatic source IP graylisting by configuring the threshold for source IP graylisting and appropriate reaction in the [trigger](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).

    Source IP graylisting can significantly reduce the number of [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives).
* Graylist IP addresses, countries, regions, data centers, networks (for example, Tor) that usually produce harmful traffic. The Wallarm node will allow legitimate requests produced by graylisted objects and block malicious requests.

## Adding an object to the list

You can both enable Wallarm to graylist IP addresses **automatically if they produce some suspicious traffic** as well as graylist objects **manually**.

!!! info "Adding an IP address to the list on the multi-tenant node"
    If you have installed the [multi-tenant node](../../installation/multi-tenant/overview.md), please first switch to the [account of a tenant](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) for which the IP address is added to the list.

    Triggers for automatic IP graylisting also should be configured on the tenant levels.

### Automatic graylist population (recommended)

The [triggers](../../user-guides/triggers/triggers.md) functionality enables automatic graylisting of IPs by the following conditions:

* Malicious requests of the following types: [`Brute force`, `Forced browsing`](../../admin-en/configuration-guides/protecting-against-bruteforce.md).
* `Number of malicious payloads` produced by an IP.
* New company accounts are featured with the [pre-configured (default) trigger](../../user-guides/triggers/triggers.md#pre-configured-triggers-default-triggers) graylisting an IP when it originates more than 3 different malicious payloads within 1 hour.

Triggers having the `Graylist IP address` reaction to the listed events automatically graylist IPs for a specified timeframe. You can configure triggers in Wallarm Console → **Triggers**.

### Manual graylist population

To add an IP address, subnet, or group of IP addresses to the list manually:

1. Open Wallarm Console → **IP lists** → **Graylist** and click **Add object**.
1. From the drop-down list, select the list to add the new object to.
2. Specify an IP address or group of IP addresses in one of the following ways:

    * Input a single **IP address** or a **subnet**

        !!! info "Supported subnet masks"
            The supported maximum subnet mask is `/32` for IPv6 addresses and `/12` for IPv4 addresses.
    
    * Select a **country** or a **region** (geolocation) to add all IP addresses registered in this country or region
    * Select the **source type** to add all IP addresses that belong to this type, e.g.:
        * **Tor** for IP addresses of the Tor network
        * **Proxy** for IP addresses of public or web proxy servers
        * **Search Engine Spiders** for IP addresses of search engine spiders
        * **VPN** for IP addresses of virtual private networks
        * **AWS** for IP addresses registered in Amazon AWS
3. Select the applications to which you allow or restrict access for the specified IP addresses.
4. Select the period for which an IP address or a group of IP addresses should be added to the list. The minimum value is 5 minutes, the maximum value is forever.
5. Specify the reason for adding an IP address or a group of IP addresses to the list.
6. Confirm adding an IP address or a group of IP addresses to the list.

![!Add IP to the list (with app)](../../images/user-guides/ip-lists/add-ip-to-list-app.png)

## Analyzing objects added to the list

Wallarm Console displays the following data on each object added to the list:

* **Object** - IP address, subnet, country/region or IP source added to the list.
* **Application** - application to which access configuration of the object is applied.
* **Source** - source of a single IP address or subnet:
    * The country/region where a single IP address or subnet is registered (if it was found in the databases like IP2Location or others)
    * The source type, like **Public proxy**, **Web proxy**, **Tor** or the cloud platform the IP registered in, etc (if it was found in the databases like IP2Location or others)
* **Reason** - reason for adding an IP address or a group of IP addresses to the list. The reason is manually specified when adding objects to the list or automatically generated when IPs are added to the list by [triggers](../triggers/triggers.md).
* **Adding date** - date and time when an object was added to the list.
* **Remove** - time period after which an object will be deleted from the list.

## Filtering the list

You can filter the objects in the list by:

* IP address or subnet specified in the search string
* Period for which you want to get a status of the list
* Country/region in which an IP address or a subnet is registered
* Source to which an IP address or a subnet belongs

## Changing the time that an object is on the list

To change the time that an IP address is on the list:

1. Select an object from the list.
2. In the selected object menu, click **Change time period**.
3. Select a new date for removing an object from the list and confirm the action.

## Deleting an object from the list

To delete an object from the list:

1. Select one or several objects from the list.
2. Click **Delete**.

!!! warning "Re-adding deleted IP address"
    After manually deleting the IP address added to the list by the [trigger](../triggers/triggers.md), the trigger will run again only after half of the previous time the IP address was in the list.
    
    For example:

    1. IP address was automatically added to the graylist for 1 hour because 4 different attack vectors were received from this IP address in 3 hours (as it is configured in the [trigger](../triggers/trigger-examples.md#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour)).
    2. User deleted this IP address from the graylist via Wallarm Console.
    3. If 4 different attack vectors are sent from this IP address within 30 minutes, then this IP address will not be added to the graylist.
