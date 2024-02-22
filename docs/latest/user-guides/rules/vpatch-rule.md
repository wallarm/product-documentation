[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png
[rule-creation-options]:    ../../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[request-processing]:       ../../user-guides/rules/request-processing.md

# Virtual Patching

A virtual patch allows blocking malicious requests even in the monitoring and safe blocking modes or when a request does not seem to contain any known attack vectors. The only requests virtual patches do not block are the ones originating from the [allowlisted](../ip-lists/overview.md) IPs.

Virtual patches are especially useful in cases when it is impossible to fix a critical vulnerability in the code or install the necessary security updates quickly.

If attack types are selected, the request will be blocked only if the filter node detects an attack of one of the listed types in the corresponding parameter.

If the setting *Any request* is selected, the system will block the requests with the defined parameter, even if it does not contain an attack vector.

## Creating and applying the rule

--8<-- "../include/waf/features/rules/rule-creation-options.md"

## Rule examples

### Blocking SQLi attack in `id` query string parameter

**If** the following conditions take place:

* the application is accessible at the domain *example.com*
* the application's parameter *id* is vulnerable to SQL injection attacks
* the filter node is set to monitoring mode
* attempts at vulnerability exploitation must be blocked

**Then**, to create a virtual patch

1. Go to the *Rules* tab
1. Find the branch `example.com/**/*.*` and click *Add rule*
1. Choose *Create a virtual patch*
1. Choose *SQLi* as the type of attack
1. Select the *QUERY* parameter and enter its value `id` after *in this part of request*

    --8<-- "../include/waf/features/rules/request-part-reference.md"

1. Click *Create*

![Virtual patch for a certain request type][img-vpatch-example1]


### Blocking all requests with `refresh` query string parameter

**If** the following conditions take place:

* the application is accessible at the domain *example.com*
* the application crashes upon processing the query string parameter `refresh`
* attempts at vulnerability exploitation must be blocked

**Then**, to create a virtual patch

1. Go to the *Rules* tab
1. Find the branch `example.com/**/*.*` and click *Add rule*
1. Choose *Create a virtual patch*
1. Choose *Any request*
1. Select the *QUERY* parameter and enter its value `refresh` after *in this part of request*

    --8<-- "../include/waf/features/rules/request-part-reference.md"

1. Click *Create*

![Virtual patch for any request type][img-vpatch-example2]

## API calls for virtual patches

To create virtual patches, you can call the Wallarm API directly. Consider the examples:

* [Create the virtual patch to block all requests sent to `/my/api/*`](../../api/request-examples.md#create-the-virtual-patch-to-block-all-requests-sent-to-myapi)
* [Create the virtual patch for a specific application instance ID to block all requests sent to `/my/api/*`](../../api/request-examples.md#create-the-virtual-patch-for-a-specific-application-instance-id-to-block-all-requests-sent-to-myapi)
