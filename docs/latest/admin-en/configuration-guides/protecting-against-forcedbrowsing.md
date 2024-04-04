# Protection Against Forced Browsing

A forced browsing attack is one of the attack types not detected by Wallarm out-of-the-box, its detection should be appropriately configured as this guide describes.

[Forced browsing](../../attacks-vulns-list.md#forced-browsing) attacks are characterized by a large number of response codes 404 returned to requests to different URIs for a limited timeframe. 
    
This attack aims to enumerate and access hidden resources (e.g. directories and files containing information on application components). The forced browsing attack type usually allows attackers to collect information about the application and perform other attack types by exploiting this information.

Note that besides protection from forced browsing, you can configure protection against [brute-force attacks](protecting-against-bruteforce.md) similarly.

## Configuring

Consider the example below to learn how to configure forced browsing protection.

Let us say you own the online `book-sale` application. You want to prevent malicious actors from trying names of hidden directories and files under its `book-sale-example.com` domain (forced browsing attack). To provide this protection, for your domain, you can limit number of 404 responses per time interval, and set to block IPs exceeding this limit:

To provide this protection:

1. Open Wallarm Console → **Triggers** and open the window for trigger creation.
1. Select the **Forced browsing** condition.
1. Set the threshold for the number of 404 response codes returned to the requests having the same origin IP requests to 30 per 30 seconds.

    Note that these are the example values - when configuring trigger for your own traffic, you should define a threshold considering a legitimate usage statistics.

1. Set the **URI** filter as displayed on the screenshot, including:

    * `**` [wildcard](../../user-guides/rules/rules.md#using-wildcards) in the path meaning "any number of components". They will cover all the addresses under the `book-sale-example.com`.

        ![Forced browsing trigger example](../../images/user-guides/triggers/trigger-example5.png)

    * Besides configuring the pattern we need in this example, you can enter specific URIs (for example, URI of your resource file directory) or set trigger to work at any endpoint by not specifying any URI.
    * If using nested URIs, consider [trigger processing priorities](../../user-guides/triggers/triggers.md#trigger-processing-priorities).

1. Do not use in this case: 

    * The **Application** filter, but be aware that you can use it to set triggers only to react to the requests targeting domains or specific endpoints of selected applications.
    * The **IP** filter, but be aware that you can use it to set triggers only to react to specific IPs originating requests.

1. Select the **Denylist IP address** - `Block for 4 hour` trigger reaction. Wallarm will put origin IP to the [denylist](../../user-guides/ip-lists/overview.md) after the threshold is exceeded and block all further requests from it.
1. Select the **Mark as forced browsing** trigger reaction. Requests received after exceeding the threshold will be marked as the forced browsing attack and displayed in the **Attacks** section of Wallarm Console. Sometimes, you can use this reaction alone to have information about the attack but not to block anything.
1. Save the trigger and wait for the [Cloud and node synchronization completion](../configure-cloud-node-synchronization-en.md) (usually, it takes 2-4 minutes).

You can configure several triggers for forced browsing protection.

## Testing

!!! info "Testing in your environment"
    To test the **Forced browsing** trigger in your environment, in the trigger and the requests below, replace the domain with any public one (e.g. `example.com`).

To test the trigger described in the [Configuring](#configuring) section:

1. Send the number of requests that exceeds the configured threshold to the protected URI. For example, 50 requests to `https://book-sale-example.com/config.json` (matches `https://book-sale-example.com/**.**`):

    ```bash
    for (( i=0 ; $i<51 ; i++ )) ; do curl https://book-sale-example.com/config.json ; done
    ```
2. If the trigger reaction is **Denylist IP address**, open Wallarm Console → **IP lists** → **Denylist** and check that source IP address is blocked.

    If the trigger reaction is **Graylist IP address**, check the section **IP lists** → **Graylist** of Wallarm Console.
3. Open the section **Attacks** and check that requests are displayed in the list as a forced browsing attack.

    ![Forced browsing attack in the interface](../../images/user-guides/events/forced-browsing-attack.png)

    The number of displayed requests corresponds to the number of requests sent after exceeding the trigger threshold ([more details on detecting behavioral attacks](../../attacks-vulns-list.md#behavioral-attacks)). If this number is higher than 5, request sampling is applied and request details are displayed only for the first 5 hits ([more details on requests sampling](../../user-guides/events/analyze-attack.md#sampling-of-hits)).

    To search for forced browsing attacks, you can use the `dirbust` filter. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

## Requirements and restrictions

**Requirements**

To protect resources from forced browsing attacks, real clients' IP addresses are required. If the filtering node is deployed behind a proxy server or load balancer, [configure](../using-proxy-or-balancer-en.md) displaying real clients' IP addresses.

**Restrictions**

When searching for forced browsing attack signs, Wallarm nodes analyze only HTTP requests that do not contain signs of other attack types.
