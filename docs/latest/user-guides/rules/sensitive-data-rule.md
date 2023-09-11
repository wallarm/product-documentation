[img-masking]:      ../../images/user-guides/rules/sensitive-data-rule.png

# Rules for Data Masking

The Wallarm node sends the following data to the Wallarm Cloud:

* Serialized requests with attacks
* Wallarm system counters
* System statistics: CPU load, RAM usage, etc.
* Wallarm system statistics: number of processed NGINX requests, Tarantool statistics, etc.
* Information on the nature of the traffic that Wallarm needs to correctly detect application structure

Some data should not be transferred outside of the server on which it is processed. Typically, this category includes authorization (cookies, tokens, passwords), personal data and payment credentials.

Wallarm Node supports data masking in requests. This rule cuts the original value of the specified request point before sending the request to the postanalytics module and Wallarm Cloud. This method ensures that sensitive data cannot leak outside the trusted environment.

It can affect the display of attacks, active attack (threat) verification, and the detection of brute force attacks.

## Creating and applying the rule

--8<-- "../include/waf/features/rules/rule-creation-options.md"

## Example: Masking of a Cookie Value

**If** the following conditions take place:

* the application is accessible at the domain *example.com*
* the application uses a *PHPSESSID* cookie for user authentication
* security policies deny access to this information for employees using Wallarm

**Then**, to create a data masking rule for this cookie, the following actions should be performed:

1. Go to the *Rules* tab
1. Find the branch for `example.com/**/*.*` and click *Add rule*
1. Choose *Mask sensitive data*
1. Select the *Header* parameter and enter its value `COOKIE`; select the *cookie* parameter and enter its value `PHPSESSID` after *in this part of request*

    --8<-- "../include/waf/features/rules/request-part-reference.md"

1. Click *Create*

![Marking sensitive data][img-masking]
