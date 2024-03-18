# API Abuse Prevention Setup <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

This article describes how to enable and configure the [API Abuse Prevention](../about-wallarm/api-abuse-prevention.md) module to detect and mitigate malicious bots and to avoid blocking legitimate activities.

## Enabling

The API Abuse Prevention module in the disabled state is delivered with [all forms of the Wallarm node 4.2 and above](../installation/supported-deployment-options.md) including the CDN node.

To enable API Abuse Prevention:

1. Make sure that your traffic is filtered by the Wallarm node 4.2 or later.
1. Make sure your [subscription plan](subscription-plans.md#subscription-plans) includes **API Abuse Prevention**. To change the subscription plan, please send a request to [sales@wallarm.com](mailto:sales@wallarm.com).
1. In Wallarm Console → **API Abuse Prevention**, create or enable at least one [API Abuse profile](#creating-profiles).

    !!! info "Access to API Abuse Prevention settings"
        Only [administrators](../user-guides/settings/users.md#user-roles) of your company Wallarm account can access the **API Abuse Prevention** section. Contact your administrator if you do not have this access.

    ![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

## Creating profiles

API abuse profiles are used to configure how Wallarm's **API Abuse Prevention** detects and mitigates malicious bots. Each profile defines which applications should be protected from what type of bots, what should be the level of tolerance to that bots and what should be the reaction to their activities.

To create an API abuse profile:

1. In Wallarm Console → **API Abuse Prevention**, click **Create profile**.
1. Select applications to protect.
1. Select [tolerance](../about-wallarm/api-abuse-prevention.md#tolerance) level.
1. If necessary, in the **Protect from** section, limit the [types of bots](../about-wallarm/api-abuse-prevention.md#automated-threats-blocked-by-api-abuse-prevention) to protect from.
1. Select the appropriate [reaction to malicious bots](../about-wallarm/api-abuse-prevention.md#reaction-to-malicious-bots).
1. If reaction is to add to deny- or graylist, set the time during which the IP will be in the list. Default value is `Add for a day`. 
1. Set name and optionally description.

    ![API Abuse prevention profile](../images/about-wallarm-waf/abi-abuse-prevention/create-api-abuse-prevention.png)

    Once the API abuse profile is configured, the module will start the [traffic analysis and blocking supported automated threats](../about-wallarm/api-abuse-prevention.md#how-api-abuse-prevention-works).

## Exceptions for source IPs

To mark some IPs as associated with legitimate bots or crawlers to avoid blocking them by API Abuse Prevention, use the **Exception list**.

You add IP address or range to the exception list and specify target application: this causes that any requests from these addresses to the target application will not lead to marking these addresses as malicious bots and they will not be added to [deny-](../user-guides/ip-lists/overview.md) or [graylist](../user-guides/ip-lists/overview.md) by API Abuse Prevention.

There are two ways of adding IP addresses to the exception list:

* From the **API Abuse Prevention** section → **Exception list** tab via **Add exception**. Here, besides IPs and subnets, you can add locations and source types that should be ignored by API Abuse Prevention.

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-inside.png)

* From the **Attacks** section: use `api_abuse` search key or select `API Abuse` from the **Type** filter, then expand the required event and click **Add to exception list**.

    ![API Abuse prevention - adding items from inside exception list](../images/about-wallarm-waf/abi-abuse-prevention/exception-list-add-from-event.png)

When the IP address is added to the exception list, the address is automatically removed from [deny-](../user-guides/ip-lists/overview.md) or [graylist](../user-guides/ip-lists/overview.md), but only if it was added there by API Abuse Prevention itself (has a `Bot` reason).

!!! info "Blocking other attack types from IP"
    If an IP from the exception list produces other [attack types](../attacks-vulns-list.md), like brute force or input validation attacks and others, Wallarm blocks such requests.

By default, the IP is added to the exception list forever. You can change this and set time when the address should be removed from the exception list. You can also remove address from exceptions immediately at any moment.

The **Exception list** tab provides the historical data - you can view items that were presented in the list within the selected period of time in past.

## Exceptions for target URLs and specific requests

In addition to marking good bots' IPs via [exception list](#exceptions-for-source-ips), you can disable bot protection both for URLs that the requests target and for the particular request types, for example, for the requests containing specific headers.

To do that, Wallarm provides the **Set API Abuse Prevention mode** rule (supported by nodes version 4.8 and above).

**Creating and applying the rule**

To disable bot protection for specific URL or request type:

1. Proceed to Wallarm Console → **Rules** → **Add rule**.
1. In **If request is**, [describe](../user-guides/rules/rules.md#uri-constructor) the requests and/or URLs to apply the rule to.

    To specify the URL, if you use the [**API Discovery**](../../api-discovery/overview.md) module and have your endpoints discovered, you can also quickly create the rule for the endpoint using its menu.

1. In **Then**, choose **Set API Abuse Prevention mode** and set:

    * **Default** - for the described scope (specific URL or request), the protection from bots will work in a usual way defined by common API Abuse Prevention [profiles](#creating-profiles).
    * **Do not check for bot activity** - for the described URL and/or request type, the check for bot activity will not be performed.

1. Optionally, in the comment, specify the reason of creating the rule for this URL/request type.

Note that you can temporarily disable the exception for the URL and/or request type without deleting the rule: to do that, select the **Default** mode. You can go back to **Do not check for bot activity** at any moment later.

**Rule examples**

**Marking legitimate bot by its request headers**

Suppose your application is integrated with the Klaviyo marketing automation tool having multiple IPs that send requests. So we set not to check for automated (bot) activities in GET requests from the `Klaviyo/1.0` user agent for specific URIs:

![Do not check for bot activity for requests with specific headers](../../images/user-guides/rules/api-abuse-url-request.png)

**Disabling protection from bots for testing endpoint**

Let's say you have the endpoint that belongs to your application. The application should be protected from bot activities but the testing endpoint should be an exception. Also, you have your API inventory discovered the [**API Discovery**](../../api-discovery/overview.md) module. 

In this case it is easier to create rule from the **API Discovery** list of endpoints. Go there, find your endpoint and initiate rule creation from its page:

![Creating Set API Abuse Prevention mode for API Discovery endpoint](../../images/user-guides/rules/api-abuse-url.png)

## Disabling and deleting profiles

Disabled profiles are the ones that the **API Abuse Prevention** module does not use during traffic analysis but that are still displayed in the profile list. You can re-enable disabled profiles at any moment. If there are no enabled profiles, the module does not block malicious bots.

Deleted profiles are the ones that cannot be restored and that the **API Abuse Prevention** module does not use during traffic analysis.

You can find **Disable** and **Delete** options in the profile menu.
