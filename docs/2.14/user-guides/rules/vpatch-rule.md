[img-vpatch-example1]:      ../../images/user-guides/rules/vpatch-rule-1.png
[img-vpatch-example2]:      ../../images/user-guides/rules/vpatch-rule-2.png

# Virtual Patching

A virtual patch allows blocking malicious requests even in monitoring mode or when a request does not seem to contain any known attack vectors.

Virtual patches are especially useful in cases when it is impossible to fix a critical vulnerability in the code or install the necessary security updates quickly.

If attack types are selected, the request will be blocked only if the filter node detects an attack of one of the listed types in the corresponding parameter.

If the setting *Any request* is selected, the system will block the requests with the defined parameter, even if it does not contain an attack vector.


## Example: Blocking SQLi Attack in the GET Parameter `id`

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
1. Select the *GET* parameter and enter its value `id` after *in this part of request*
1. Click *Create*

![!Virtual patch for a certain request type][img-vpatch-example1]


## Example: Block All Requests With the GET Parameter `refresh`

**If** the following conditions take place:

* the application is accessible at the domain *example.com*
* the application crashes upon processing the GET parameter `refresh`
* attempts at vulnerability exploitation must be blocked

**Then**, to create a virtual patch

1. Go to the *Rules* tab
1. Find the branch `example.com/**/*.*` and click *Add rule*
1. Choose *Create a virtual patch*
1. Choose *Any request*
1. Select the *GET* parameter and enter its value `refresh` after *in this part of request*
1. Click *Create*

![!Virtual patch for any request type][img-vpatch-example2]
