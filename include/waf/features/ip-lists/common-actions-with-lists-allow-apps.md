## Adding an object to the list

!!! info "Adding an IP address to the list on the multi-tenant node"
    If you have installed the [multi-tenant node](../../installation/multi-tenant/overview.md), please firstly switch to the [account of a tenant](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure) for which the IP address is added to the list.

To add an IP address, subnet, or group of IP addresses to the list:

1. Click the **Add object** button.
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

The Wallarm Console displays the following data on each object added to the list:

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
