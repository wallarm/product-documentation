[link-scanner-intro]:       intro.md
[link-scanner-settings]:    configure-scanner.md
[link-support]:             mailto:support@wallarm.com
[link-reserved-domains]:    reserved-domains.md

[img-check-scope]:      ../../images/user-guides/scanner/check-scope.png
[img-scope-element]:    ../../images/user-guides/scanner/scope-element.png
[img-disable-association]:      ../../images/user-guides/scanner/disable-association.png

# Working with the Scope

You can see information on the company's public resources on the *Scanner*
tab of the Wallarm interface.

![!Scanner tab][img-check-scope]

The Wallarm scanner discovers the scope.

## Scanner Settings Overview

In the *Scanner* block, the following data is shown:
* current scanner settings
* time of the last scan

To learn more about configuring the scanner, see the [“Scanner settings”][link-scanner-settings] page.

## Scope Overview

In the *Scope* block of the *Scanner* tab, the elements are shown in three columns: *Domains*, *IPs*, and *Services*. The total number of elements of a certain type is shown near the column name in a small grey font.

If Wallarm can determine which data center the given IP address belongs to, then the corresponding tag will be displayed to the right of the element or group of elements: the **AWS** tag for Amazon, the **GCP** tag for Google, the **Azure** tag for Microsoft data centers, and **DC** for other data centers.

!!! info
    By default, the scope scanning starts with the domain of the email address that was specified upon Wallarm account creation.

The elements' names displayed in bold font correspond with the group of observed resources. The number of resources the certain group contains is shown in small grey font near its name. Click the group name to expand the list of the resources it contains.

Use the search field to find elements by their names. You can also search for substrings. For example, the query `domain.com` displays all domains that have “domain.com” as a substring: “a.domain.com”, “b.domain.com” and their associations.

Click one of the buttons on the bar to filter elements by their status:
* *All elements*: display all of the resources within the scope.
* *New*: display the newly discovered resources that have not been viewed yet.
* *Disabled*: display the resources for which scanning is disabled.

## Check the Resource Associations

Click one of the scope elements. The Wallarm interface will display the selected element's associations.

![!Scope element with its associations][img-scope-element]

The resources' domain, IP address, and port are interdependent.

A domain always has a higher priority than an IP address, and an IP address always has priority over a port.

When you disable the scanning of or delete a resource with a lower priority, the resource with a higher priority remains active.

For example, when you disable the scanning of a domain, the system will also disable the scanning of the IP address and ports that depend on that domain.

When you delete an IP address, the system will also delete the associated ports, but keep the domain active, because a domain may have more than one IP address.

You can disable the resources' connections to manage each resource independently.


#### Disable and Enable the Resource Connection

You can disable the resources' interconnection to manage each resource's scanning settings independently.

To disable the resources' interconnection:
1. Select one resource from the resource pair you need to disconnect from each other;
2. Click the switch next to the resource paired with the current one.

![!Disable the resource connection][img-disable-association]

!!! info "Determining the current resource"
    The name of the current resource is shown in bold. The web-interface also displays its discovery date.

To enable resource interconnection, follow the same steps as when you were disabling the interconnection.

### Disable Resource Scanning

You can disable scanning for any of the resources within the scope. In so
doing, the resource you selected will remain in the system as detectable, but
will not be scanned for vulnerabilities.

1. Click one of the scope elements.
2. Click the switch next to the selected element.

### Delete a Resource from the Scope

You can delete any resource from the scope. The purpose of this operation
is to delete an accidentally added resource.

1. Select the desired resources by clicking the checkboxes next to their names.
2. Click *Delete element(s)*.

!!! warning "Recovering the deleted resources"
    The deleted resources will not be discovered in future scannings. If you have deleted the resource by mistake, contact the [Wallarm support team][link-support].

### Add a Domain or an IP Address

You can manually add a domain or an IP address.

Click *Add domain or IP*. In the window that appears, enter the new domain or IP and click *Add*. 

After the new domain or IP address is added, the scanner will launch the scanning procedure to search for elements connected with the resource and will add them to the scope.

!!! warning "Reserved domains"
    Reserved domains and subdomains can only be added to the scope by a certain client. Wallarm reserves domain for a client on request. You cannot add a domain that is reserved by another client to your scope.
    
    To see detailed information about reserved domains, proceed to this [link][link-reserved-domains].

### Limit Scanning Speed

You can limit the speed of domain or IP address scanning. The total speed of sending requests by the scanner will not exceed the specified value.

1. Select one of the scope elements of the following types: *Domain*, *IP*.
2. Click the *Set RPS limits* button or the current limit value.
3. Fill in the *Domain RPS* field for the domain or the *IP RPS* field for the IP address.
    1. You can also limit the RPS for each of the domain's dependent IP addresses. To set this limit, enter the desired value in the *RPS per IP* field.
4. Click *Save*.

To return to the default settings, use an empty value or enter `0`.

!!! info "See also"
    * [Scanner overview][link-scanner-intro]
    * [Scanner settings][link-scanner-settings]

## Notifications about changes in the exposed asset list

Wallarm can send you notifications about changes in the exposed asset list: newly discovered exposed assets, disabled and deleted ones.

To get the notifications, configure appropriate [native integrations](../settings/integrations/integrations-intro.md) with the messengers or SOAR systems (e.g. PagerDuty, Opsgenie, Slack, Telegram).
