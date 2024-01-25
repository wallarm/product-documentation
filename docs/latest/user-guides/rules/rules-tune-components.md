# Using Rules for Fine Tuning Wallarm Components

Using [rules](intro.md), you can fine tune of how the specific Wallarm components work. This article describes how create such rules and configure them.

You can change the following components/their features:

* [Active Threat Verification: set mode globally and for specific endpoints](#active-threat-verification-set-mode-globally-and-for-specific-endpoints)
* [Active Threat Verification: rewrite requests before attack replaying](#active-threat-verification-rewrite-requests-before-attack-replaying)
* [API Abuse Prevention: set mode for specific target URLs](api-abuse-url.md)

## Active Threat Verification: set mode globally and for specific endpoints

[Wallarm's Active Threat Verification](overview.md) module can be enabled either globally, affecting all endpoints where the filtering node is set up, or individually for specific endpoints. This article provides instructions on managing the module's behavior.

**Enabling the module globally**

Active Threat Verification is disabled by default. To enable it globally:

1. Ensure you have an active **Advanced API Security** [subscription plan](../../about-wallarm/subscription-plans.md#subscription-plans). The module is only available under this plan.

    If you are on a different plan, please contact our [sales team](mailto:sales@wallarm.com) to transition to the required one.
1. Proceed to Wallarm Console → **Vulnerabilities** → **Configure** by following the link for the [US Cloud](https://us1.my.wallarm.com/vulnerabilities/active?configure=true) or [EU Cloud](https://my.wallarm.com/vulnerabilities/active?configure=true), and toggle on the **Active threat verification** switch.

This action enables the module for all resources where the filtering node is configured.

![!Vuln scan settings](../../images/user-guides/vulnerabilities/vuln-scan-settings.png)

**Controlling the module mode for specific endpoints**

Once the module is [globally enabled](#enabling-the-module-globally), you can customize its behavior for specific endpoints using the corresponding rule. Here is how:

1. Proceed to Wallarm Console → **Rules** → create the **Set mode of active threat verification** rule.
1. Fill in the rule creation form following the instructions:

    * **If request is** [specifies](../../user-guides/rules/add-rule.md#branch-description) the endpoints to apply the rule to.
    * **Disable / Enable** sets the mode of the module for attacks sent to the specified endpoints.

    Use the **Enable** setting to make exceptions for a rule that disables the module (e.g., enabling for `https://example.com/module/user/create` while it is disabled for `https://example.com/module/user/*`).
1. Wait for the [custom ruleset compilation to complete](../../user-guides/rules/compiling.md).

**Enabling the module for specific endpoints**

To enable the module for specific endpoints only:

1. Enable the module globally in Wallarm Console → **Vulnerabilities** → **Configure**.
1. Disable the module for all endpoints by creating the **Set mode of active threat verification** rule and leaving the **If request is** section empty.
1. Create **Set mode of active threat verification** rules to enable the module for specific hosts, applications, or endpoints by describing them in the **If request is rule** section.

Here is how the rule looks when disabling the module for all endpoints:

![!Example of the rule "Set mode of active threat verification"](../../images/user-guides/rules/disable-atv-for-all-endpoints.png)

If the rule mentioned above is already active, the following rule would enable the module for `https://example.com/module/user/create`:

![!Example of the rule "Set mode of active threat verification"](../../images/user-guides/rules/disable-active-threat-verification-deeper-path-example.png)

Alternatively, you can disable the module by applying a rule for the URL and then enable it for specific endpoints related to that URL.

**Disabling the module for specific endpoints**

For endpoints without a staging environment, especially those that are non-idempotent or lack an authentication mechanism, it is recommended to disable attack replay. Without these safeguards, the module might inadvertently repeat harmful actions, such as processing monetary transactions multiple times or repeatedly creating new accounts.

To disable the module for specific endpoints:

1. Enable the module globally in Wallarm Console → **Vulnerabilities** → **Configure**.
1. Disable the module for the required endpoints using the **Set mode of active threat verification** rule. Describe these endpoints in the **If request is** rule section.

Consider a non-idempotent endpoint like POST `https://example.com/api/purchase` on an online shopping platform that handles actions such as deducting inventory and charging user accounts. If this action is accidentally repeated by the module, it could lead to such consequences as multiple charges for a single item. Therefore, for such endpoints in a production environment, it is recommended to disable attack replay. For such an endpoint, the rule would look like this:

![!Example of the rule "Set mode of active threat verification"](../../images/user-guides/rules/disable-atv-for-non-indemponent-end.png)

## Active Threat Verification: rewrite requests before attack replaying

You can modify the requests used by the [Wallarm's Active Threat Verification](overview.md) module for attack replay. This can be particularly useful when replacing original authentication data with test data or conducting attack replays on alternative addresses. This guide provides instructions on how to achieve this.

By default, the module retains the original request data, except for [stripping specific authentication parameters](overview.md#test-request-security). The **Rewrite attack before active verification** rule is used to modify the original request elements before generating test attack set based on them. The following elements can be modified:

* Header with the request authentication data to replace [original authentication data with test data](#replacing-original-authentication-data-with-test-data).
* Header `HOST`. For example, the header `HOST` could be modified to replay the attack on [staging or test environment](#modifying-the-application-address-for-attack-replaying).
* Path to [rewrite the application address used for the attack replaying](#modifying-the-application-address-for-attack-replaying).

!!! warning "Modification of any original request element"
    The rule allows modifying of only headers (`header`) and paths (`uri`) of the original requests. Other request elements cannot be modified or added.

**Creating and applying the rule**

To create and apply the **Rewrite attack before active verification** rule:

1. Proceed to Wallarm Console → **Rules** → create the **Rewrite attack before active verification** rule.
1. Fill in the rule creation form following the instructions:

      * **If request is** [specifies](../../user-guides/rules/add-rule.md#branch-description) the endpoints to apply the rule to.
      * **Rules** sets the new value for the parameter selected in the **Part of request** field. A set value will be used when replaying the attack.

        The value must be decoded and set using the [template language Liquid](https://shopify.github.io/liquid/) as follows: placed in double curly braces `{{}}` and single quotes `''`. For example: `{{'example.com'}}`.

        To replace the path of the original request (`uri`), you should pass the full value of the new path.

      * **Part of request** points to the original request element that should be modified before replaying the attack. Ensure this element is present in original requests as original values will be substituted.

        !!! warning "Possible values"
            The only acceptable values for the **Part of request** field are `header` and `uri`. No other values are permitted.

1. Wait for the [rule compilation to complete](../../user-guides/rules/compiling.md).

To set several conditions for the original request modification or to replace the values of several request elements, you may create several rules.

**Rule examples**

**Replacing original authentication data with test data**

Your application's APIs might require authentication. However, since the module [strips](overview.md#test-request-security) this data before replaying attacks, vulnerabilities may go undetected. To address this, consider creating specific authentication parameters for active threat verification when this data is passed in request headers. This approach not only grants the necessary access but also lets you control and secure the replay process.

To furnish the replayed requests with necessary authentication details, you may add test values for these parameters using the **Rewrite attack before active verification** rule. For example: API key, token, password or other parameters.

For instance, the following is the rule to ensure attacks replayed on example.com carry the value `PHPSESSID=mntdtbgt87j3auaq60iori2i63; security=low` in the `COOKIE` header. The format of the header value is {`{'PHPSESSID=mntdtbgt87j3auaq60iori2i63; security=low'}}`.

![Example of the rule modifying COOKIE](../../images/user-guides/rules/rewrite-request-example-cookie.png)

**Modifying the application address for attack replaying**

By default, replayed attacks are sent to the application address and path passed in the original request. You may replace the original address and path with other values that will be used when replaying the attack. Values are replaced using the **Rewrite attack before active verification** rule in the following way:

* Replace the original value of the header `HOST` with a different application instance address. For example, a separate application instance could be a staging or test environment.
* Replace the path of the original request with the path to the test environment or staging, or to the path to the target server to bypass the proxy server when replaying the attack.

To replace both the value of the `HOST` header and the path of the original request, you will need to create two separate rules with the action type **Rewrite attack before active verification**.

For instance, the following rule sets the module for replay attacks originally sent to `example.com` on the test environment `example-test.env.srv.loc`. The format of the address is `{{'example-test.env.srv.loc'}}`.

![Example of the rule modyfying HOST](../../images/user-guides/rules/rewrite-request-example-host.png)
