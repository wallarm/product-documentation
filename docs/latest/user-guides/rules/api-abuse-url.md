# Disabling bot protection for specific URLs and requests

The [**API Abuse Prevention**](../../about-wallarm/api-abuse-prevention.md) module of the Wallarm platform identifies and counters bots based on the [profiles](../../user-guides/api-abuse-prevention.md) that set the specific applications to be protected, the types of bots targeted, the tolerance level, etc. Additionally, the **Set API Abuse Prevention mode** rule mentioned in this article allows you to turn off bot protection for particular URLs and requests.

As rule's [URI constructor](../../user-guides/rules/rules.md#uri-constructor) includes both URL and request elements like headers, you can use the rule to disable bot protection both for URLs that the requests target and for the particular request types, for example, for the requests containing specific headers.

!!! info "Rule support in different node versions"
    This feature is only supported by nodes version 4.8 and above.

## Creating and applying the rule

To disable bot protection for specific URL or request type:

1. Proceed to Wallarm Console → **Rules** → **Add rule**.
1. In **If request is**, [describe](../../user-guides/rules/rules.md#uri-constructor) the requests and/or URLs to apply the rule to.

    To specify the URL, if you use the [**API Discovery**](../../api-discovery/overview.md) module and have your endpoints discovered, you can also quickly create the rule for the endpoint using its menu.

1. In **Then**, choose **Set API Abuse Prevention mode** and set:

    * **Default** - for the described scope (specific URL or request), the protection from bots will work in a usual way defined by common API Abuse Prevention [profiles](../../user-guides/api-abuse-prevention.md).
    * **Do not check for bot activity** - for the described URL and/or request type, the check for bot activity will not be performed.

1. Optionally, in the comment, specify the reason of creating the rule for this URL/request type.

Note that you can temporarily disable the exception for the URL and/or request type without deleting the rule: to do that, select the **Default** mode. You can go back to **Do not check for bot activity** at any moment later.

## Rule examples

### Marking legitimate bot by its request headers

Suppose your application is integrated with the Klaviyo marketing automation tool having multiple IPs that send requests. So we set not to check for automated (bot) activities in GET requests from the `Klaviyo/1.0` user agent for specific URIs:

![Do not check for bot activity for requests with specific headers](../../images/user-guides/rules/api-abuse-url-request.png)

### Disabling protection from bots for testing endpoint

Let's say you have the endpoint that belongs to your application. The application should be protected from bot activities but the testing endpoint should be an exception. Also, you have your API inventory discovered the [**API Discovery**](../../api-discovery/overview.md) module. 

In this case it is easier to create rule from the **API Discovery** list of endpoints. Go there, find your endpoint and initiate rule creation from its page:

![Creating Set API Abuse Prevention mode for API Discovery endpoint](../../images/user-guides/rules/api-abuse-url.png)
