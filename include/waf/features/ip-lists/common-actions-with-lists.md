## Adding an object to the list

To add an IP address, subnet, or group of IP addresses to the list:

1. Click the **Add object** button.
2. Specify an IP address or group of IP addresses in one of the following ways:

    * Input a single **IP address** or a **subnet**
        
        !!! info "Supported subnet masks"
            Maximum supported subnet mask is `/32` for IPv6 addresses and `/12` for IPv4 addresses.
    
    * Select a **country** (geolocation) to add all IP addresses registered in this country
    * Select a **source** to add all IP addresses that belong to this source:
        * **Tor** for IP addresses of the Tor network
        * **Proxy** for IP addresses of public or web proxy servers
        * **VPN** for IP addresses of virtual private networks
        * **AWS** for IP addresses registered in Amazon AWS
        * **Azure** for IP addresses registered in Microsoft Azure
        * **GCP** for IP addresses registered in Google Cloud Platform
3. Select the period for which an IP address or a group of IP addresses should be added to the list. The minimum value is 5 minutes, the maximum value is forever.
4. Specify the reason for adding an IP address or a group of IP addresses to the list.
5. Confirm adding an IP address or a group of IP addresses to the list.

!!! warning "Application selector"
    The form for adding an IP address to the list may display the application selector. Please note that this application selector does not work if you use Wallarm node 3.0 or lower. To configure access by IP address to a specific application, please [upgrade](/updating-migrating/general-recommendations/) the installed modules to the latest version first (recommended).

![!Add IP to the list (without app)](../../images/user-guides/ip-lists/add-ip-to-list-without-app.png)

## Analyzing objects added to the list

The Wallarm Console displays the following data on each object added to the list:

* **Object** - IP address, subnet, country or IP source added to the list.
* **Application** - application to which access configuration of the object is applied. Since applying the [object access configuration to specific applications is limited](overview.md#known-caveats-of-ip-lists-configuration), this column always displays the value **All**.
* **Source** - source of a single IP address or subnet:
    * Country (geolocation) where a single IP address or subnet is registered
    * Data center where a single IP address or subnet is registered: **AWS** for Amazon, **GCP** for Google Cloud Platform, **Azure** for Microsoft Azure
    * **Tor** for IP address of the Tor network
    * **Proxy** for IP address of public or web proxy servers
    * **VPN** for IP addresses of virtual private networks
* **Reason** - reason for adding an IP address or a group of IP addresses to the list. The reason is manually specified when adding objects to the list or automatically generated when IPs are added to the list by [triggers](../triggers/triggers.md).
* **Adding date** - date and time when an object was added to the list.
* **Remove** - time period after which an object will be deleted from the list.

## Filtering the list

You can filter the objects in the list by:

* IP address or subnet specified in the search string
* Period for which you want to get a status of the list
* Country in which an IP address or a subnet is registered
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
