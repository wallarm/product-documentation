# API Abuse Prevention Exceptions <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to fine tune [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) by marking legitimate bots and disabling bot protection for particular target URLs and request types.

These features extend the basic API Abuse Prevention [configuration via profiles](api-abuse-prevention.md#creating-profiles).

## Exceptions for legitimate automation

To mark some IPs as associated with legitimate bots or crawlers to avoid blocking them by API Abuse Prevention, use the **Exception list**.

You add IP address or range to the exception list and specify target application: this causes that any requests from these addresses to the target application will not lead to marking these addresses as malicious bots and they will not be added to [deny-](../user-guides/ip-lists/overview.md) or [graylist](../user-guides/ip-lists/overview.md) by API Abuse Prevention.

There are two ways of adding IP addresses to the exception list:

* From the **API Abuse Prevention** section → **Exception list** tab via **Add exception**. Here, besides IPs and subnets, you can add locations and source types that should be ignored by API Abuse Prevention.

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

* From the **Attacks** section: use the `api_abuse`, `account_takeover`, `scraping` and `security_crawlers` search keys or select the appropriate options from the **Type** filter, then expand the required event and click **Add to exception list**.

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

When the IP address is added to the exception list, the address is automatically removed from [deny-](../user-guides/ip-lists/overview.md) or [graylist](../user-guides/ip-lists/overview.md), but only if it was added there by API Abuse Prevention itself (has a `Bot` reason).

!!! info "Blocking other attack types from IP"
    If an IP from the exception list produces other [attack types](../attacks-vulns-list.md), like brute force or input validation attacks and others, Wallarm blocks such requests.

By default, the IP is added to the exception list forever. You can change this and set time when the address should be removed from the exception list. You can also remove address from exceptions immediately at any moment.

The **Exception list** tab provides the historical data - you can view items that were presented in the list within the selected period of time in past.

## Exceptions for target URLs and specific requests

In addition to marking good bots' IPs via [exception list](#exceptions-for-legitimate-automation), you can disable bot protection both for URLs that the requests target and for the particular request types, for example, for the requests containing specific headers.

To do that, Wallarm provides the **Set API Abuse Prevention mode** rule (supported by nodes version 4.8 and above).

**Creating and applying the rule**

To disable bot protection for specific URL or request type:

1. Proceed to Wallarm Console → **Rules** → **Add rule**.
1. In **If request is**, [describe](../user-guides/rules/rules.md#uri-constructor) the requests and/or URLs to apply the rule to.

    To specify the URL, if you use the [**API Discovery**](../api-discovery/overview.md) module and have your endpoints discovered, you can also quickly create the rule for the endpoint using its menu.

1. In **Then**, choose **Set API Abuse Prevention mode** and set:

    * **Default** - for the described scope (specific URL or request), the protection from bots will work in a usual way defined by common API Abuse Prevention [profiles](api-abuse-prevention.md#creating-profiles).
    * **Do not check for bot activity** - for the described URL and/or request type, the check for bot activity will not be performed.

1. Optionally, in the comment, specify the reason of creating the rule for this URL/request type.

Note that you can temporarily disable the exception for the URL and/or request type without deleting the rule: to do that, select the **Default** mode. You can go back to **Do not check for bot activity** at any moment later.

**Rule examples**

**Marking legitimate bot by its request headers**

Suppose your application is integrated with the Klaviyo marketing automation tool having multiple IPs that send requests. So we set not to check for automated (bot) activities in GET requests from the `Klaviyo/1.0` user agent for specific URIs:

![Do not check for bot activity for requests with specific headers](../images/user-guides/rules/api-abuse-url-request.png)

**Disabling protection from bots for testing endpoint**

Let's say you have the endpoint that belongs to your application. The application should be protected from bot activities but the testing endpoint should be an exception. Also, you have your API inventory discovered the [**API Discovery**](../api-discovery/overview.md) module. 

In this case it is easier to create rule from the **API Discovery** list of endpoints. Go there, find your endpoint and initiate rule creation from its page:

![Creating Set API Abuse Prevention mode for API Discovery endpoint](../images/user-guides/rules/api-abuse-url.png)

## Disabling and deleting profiles

Disabled profiles are the ones that the **API Abuse Prevention** module does not use during traffic analysis but that are still displayed in the profile list. You can re-enable disabled profiles at any moment. If there are no enabled profiles, the module does not block malicious bots.

Deleted profiles are the ones that cannot be restored and that the **API Abuse Prevention** module does not use during traffic analysis.

You can find **Disable** and **Delete** options in the profile menu.
