[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png
[img-regex-example1]:       ../../images/user-guides/rules/regex-rule-1.png
[rule-creation-options]:    ../../user-guides/events/check-attack.md#attack-analysis_1
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md

# Virtual Patching

In cases when it is impossible to fix a critical [vulnerability](../../user-guides/vulnerabilities.md) in the code of your application or install the necessary updates quickly, you can create a virtual patch to block all or specific requests to the endpoints that may allow exploiting these vulnerabilities. Virtual patch will block requests even in the monitoring and safe blocking [modes](../../admin-en/configure-wallarm-mode.md), except the ones originating from the [allowlisted](../ip-lists/overview.md) IPs.

Wallarm provides the following [rules](../../user-guides/rules/rules.md) to create virtual patch:

* **Create a virtual patch** rule - allows creating virtual patch that blocks requests containing in its selected part one of the [known](../../attacks-vulns-list.md) attack signs, such as SQLi, SSTi, RCE etc. Also, you can select **Any request** to block specific requests without any attack signs.
* **Create regexp-based attack indicator** rule with **Virtual patch** option selected - allows creating virtual patch that blocks requests containing your own attack signs or your own reason for blocking (see [example](#blocking-all-requests-with-incorrect-x-authentication-header)) that are described with the regular expressions. Details on working with rule based on regular expression are described [here](../../user-guides/rules/regex-rule.md).

## Creating and applying the rule

--8<-- "../include/rule-creation-initial-step.md"
1. Choose **Mitigation controls** →

    * **Virtual patch** or
    * **Custom attack detector** (with **Virtual patch** option - see [details](../../user-guides/rules/regex-rule.md))

1. In **If request is**, [describe](rules.md#configuring) the scope to apply the rule to.
1. For the common **Create a virtual patch** rule, set whether to block any request or only the ones containing specific attack signs (**Any request** vs. **Selected**).
1. In **In this part of request**, specify request points for which you wish to set the rule. Wallarm will restrict requests that have the same values for the selected request parameters.

    All available points are described [here](request-processing.md), you can choose those matching your particular use case.

1. Wait for the [rule compilation and uploading to the filtering node to complete](rules.md#ruleset-lifecycle).

## Rule examples

### Blocking specific requests for selected endpoint

Let us say your application online purchase section accessible at the `example.com/purchase` endpoint crashes upon processing the `refresh` query string parameter. Before the bug is fixed, you need to block requests leading to the crash.

To do so, set the **Create a virtual patch** rule as displayed on the screenshot:

![Virtual patch for any request type][img-vpatch-example2]

### Blocking exploitation attempts for discovered but not yet fixed vulnerability

Let us say your application accessible at the `example.com` domain has discovered but not yet fixed vulnerability: the application's `id` parameter is vulnerable to SQL injection attacks. Meanwhile, Wallarm filtering node is set to monitoring mode and yet you need to immediately block the vulnerability exploitation attempts.

To do so, set the **Create a virtual patch** rule as displayed on the screenshot:

![Virtual patch for a certain request type][img-vpatch-example1]

### Blocking all requests with incorrect `X-AUTHENTICATION` header

--8<-- "../include/waf/features/rules/rule-vpatch-regex.md"

## API calls for virtual patches

To create virtual patches, you can call the Wallarm API directly. Consider the examples:

* [Create the virtual patch to block all requests sent to `/my/api/*`](../../api/request-examples.md#create-the-virtual-patch-to-block-all-requests-sent-to-myapi)
* [Create the virtual patch for a specific application instance ID to block all requests sent to `/my/api/*`](../../api/request-examples.md#create-the-virtual-patch-for-a-specific-application-instance-id-to-block-all-requests-sent-to-myapi)
