[link-request-processing]:      request-processing.md
[link-rules-compiling]:         compiling.md


# Rules Overview

On the **Rules** tab you may review and change the rules for handling requests. Rules are used to fine-tune the behavior of the system during the analysis of requests and their further processing in the post-analysis module as well as in the Wallarm Cloud.

For a better understanding of how the traffic processing rules are applied, it is advisable to learn how the filter node [analyzes the requests][link-request-processing].

One important thing about making changes to the rules is that these changes don't take effect immediately. It may take some time to [compile the rules][link-rules-compiling] and download them into filter nodes.

## What you can do with rules

Using rules, you can provide the multiple protections measures for your applications and APIs, and also fine tune how attacks are detected, how the Wallarm nodes and some Wallarm components work:

* [Apply a virtual patch](../../user-guides/rules/vpatch-rule.md)
* [Create your own detection rule](../../user-guides/rules/regex-rule.md)
* [Mask sensitive data](../../user-guides/rules/sensitive-data-rule.md)
* Fine tune request processing by [managing request parsers](../../user-guides/rules/request-processing.md#managing-parsers) and [changing server response headers](../../user-guides/rules/request-processing.md#changing-server-response-headers)
* Fine tune attack detection by setting to [ignore certain attack types](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-types) and to [ignore certain attack signs in the binary data](../../about-wallarm/protecting-against-attacks.md#ignoring-certain-attack-signs-in-the-binary-data)

## Terminology

#### Point

A point is an HTTP request parameter. A parameter can be described with a sequence of filters applied for request processing, e.g., headers, body, URL, Base64, etc. This sequence is also called the *point*.

Request processing filters are also called parsers.


#### Rule Branch

The set of HTTP request parameters and their conditions is called the *branch*. If the conditions are fulfilled, the rules related to this branch will be applied.

For example, the rule branch `example.com/**/*.*` describes the conditions matching all requests to any URL of the domain `example.com`.


#### Endpoint (Endpoint Branch)
A branch without nested rule branches is called an *endpoint branch*. Ideally, an application endpoint corresponds to one business function of the protected application. For instance, such business function as authorization can be an endpoint rule branch of `example.com/login.php`.


#### Rule
A request processing setting for the filter node, the post-analysis module, or the cloud is called a *rule*.

Processing rules are linked to the branches or endpoints. A rule is applied to a request only if the request matches all the conditions described in the branch.
