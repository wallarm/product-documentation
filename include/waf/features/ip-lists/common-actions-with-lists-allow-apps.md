[access-wallarm-api-docs]: ../../api/overview.md#your-own-client
[application-docs]:        ../settings/applications.md

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

## Reviewing the history of IP list changes

When you choose specific dates to examine the IP list content, the system returns a detailed history of its changes, including the exact timing and method of addition, be it manual or automated. The report also provides data on the individuals responsible for the changes and the reasons behind each inclusion. Such insights help in maintaining an audit trail for compliance and reporting.

![IP List history](../../images/user-guides/ip-lists/ip-list-history.png)

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

## API calls to get, populate and delete IP list objects

To get, populate and delete IP list objects, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below are some examples of the corresponding API calls.

### API request parameters

Parameters to be passed in the API requests to read and change IP lists:

--8<-- "../include/api-request-examples/ip-list-request-params.md"

### Add to the list the entries from the `.csv` file

To add to the list the IPs or subnets from the `.csv` file, use the following bash script:

--8<-- "../include/api-request-examples/add-ips-to-lists-from-file.md"

### Add to the list a single IP or subnet

--8<-- "../include/api-request-examples/add-some-ips-to-lists.md"

### Add to the list multiple countries

--8<-- "../include/api-request-examples/add-some-countries-to-lists.md"

### Add to the list multiple proxy services

--8<-- "../include/api-request-examples/add-some-proxies-to-lists.md"

### Delete an object from the IP list

Objects are deleted from IP lists by their IDs.

To get an object ID, request the IP list contents and copy `objects.id` of the required object from a response:

--8<-- "../include/api-request-examples/get-ip-list-contents.md"

Having the object ID, send the following request to delete it from the list:

--8<-- "../include/api-request-examples/delete-object-from-ip-list.md"

You can delete multiple objects at once passing their IDs as an array in the deletion request.