[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png

# Virtual Patching

A virtual patch allows blocking malicious requests even in the monitoring and safe blocking modes or when a request does not seem to contain any known attack vectors. The only requests virtual patches do not block are the ones originating from the [allowlisted](../ip-lists/overview.md) IPs.

Virtual patches are especially useful in cases when it is impossible to fix a critical vulnerability in the code or install the necessary security updates quickly.

If attack types are selected, the request will be blocked only if the filter node detects an attack of one of the listed types in the corresponding parameter.

If the setting *Any request* is selected, the system will block the requests with the defined parameter, even if it does not contain an attack vector.

## Creating and applying the rule

--8<-- "../include/waf/features/rules/rule-creation-options.md"

## Example: Blocking SQLi Attack in the Query String Parameter `id`

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


## Example: Block All Requests With the Query String Parameter `refresh`

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

## API calls to create the rule

To create the virtual patch rule, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below are some examples of the corresponding API calls.

**Create the virtual patch to block all requests sent to `/my/api/*`**

--8<-- "../include/api-request-examples/create-rule-en.md"

**Create the virtual patch for a specific application instance ID to block all requests sent to `/my/api/*`**

An application should be [configured](../settings/applications.md) before sending this request. Specify an ID of an existing application in `action.point[instance].value`.

--8<-- "../include/api-request-examples/create-rule-for-app-id.md"
