# Disabling bot protection for specific URLs

The [**API Abuse Prevention**](../../about-wallarm/api-abuse-prevention.md) module of the Wallarm platform detects and mitigates malicious bots. What applications are being protected, from which bot types, and with what level of tolerance is configured by one or more [API abuse profiles](../../user-guides/api-abuse-prevention.md). Additionally, you can disable bot protection for specific URLs using the **Set API Abuse Prevention mode** rule described in this article.

!!! info "Rule support in different node versions"
    This feature is only supported by nodes version 4.8 and above.

Note that this rule is different from the [exception list](../../about-wallarm/api-abuse-prevention.md#exception-list) of API Abuse Prevention: the exception lists sets **source** URLs, and the **Set API Abuse Prevention mode** rule - **target** URLs not to be checked.

## Creating and applying the rule

To disable bot protection for specific URL:

1. Proceed to Wallarm Console → **Rules** → **Add rule**.
1. In **If request is**, [describe](add-rule.md#branch-description) the scope to apply the rule to.

    If you use the [**API Discovery**](../../about-wallarm/api-discovery.md) module and have your endpoints discovered, you can also quickly create the rule for the endpoint using its menu.

1. In **Then**, choose **Set API Abuse Prevention mode** and set:

    * **Default** - for the described scope (specific URL or more), the protection from bots will work in a usual way defined by common API Abuse Prevention [profiles](../../user-guides/api-abuse-prevention.md).
    * **Do not check for bot activity** - for the described scope, the check for bot activity will not be performed.

1. Optionally, in the comment, specify the reason of creating the rule for this URL.

## Rule examples

### Specific endpoint in your API inventory should not be checked for bot activities

Let's say you have your API inventory discovered the [**API Discovery**](../../about-wallarm/api-discovery.md) module and you have the endpoint that belongs to your application. The application should be protected from bot activities but the testing endpoint should be an exception.

General protection is configured by API Abuse profile, exception for the endpoint is set via the **Set API Abuse Prevention mode** rule set to **Do not check for bot activity**.

In this case it is easier to create rule from the **API Discovery** list of endpoints. Go there, find your endpoint and initiate rule creation from its page:

![!Creating Set API Abuse Prevention mode for API Discovery endpoint](../../images/user-guides/rules/api-abuse-url.png)

Note that you can temporarily disable the exception for the endpoint without deleting the rule by selecting the **Default** mode. You can go back to **Do not check for bot activity** at any moment later.

### Set of URLs should not be checked for bot activities

Let's say you need to stop checking bot activities for the set of URLs defined with the help of [regular expression](add-rule.md#condition-type-regex). Go to the **Rules** section and create the **Set API Abuse Prevention mode** rule:

![!Creating Set API Abuse Prevention mode for set of URLs with regular expression](../../images/user-guides/rules/api-abuse-url-regex.png)
