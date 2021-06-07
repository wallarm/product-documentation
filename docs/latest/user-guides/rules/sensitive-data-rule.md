[img-masking]:      ../../images/user-guides/rules/sensitive-data-rule.png

# Rules for Data Masking

The WAF node sends the following data to the Wallarm Cloud:

* Serialized requests with attacks
* Wallarm system counters
* System statistics: CPU load, RAM usage, etc.
* Wallarm system statistics: number of processed NGINX requests, Tarantool statistics, etc.
* Information on the nature of the traffic that Wallarm needs to correctly detect application structure

Some data should not be transferred outside of the server on which it is processed. Typically, this category includes authorization (cookies, tokens, passwords), personal data and payment credentials.

WAF Node supports data masking in requests. The real values will be replaced by `*` and will not be accessible either in the Wallarm Cloud or in the local post-analysis module. This method ensures that the protected data cannot leak outside the trusted environment.

It can affect the display of attacks, active attack (threat) verification, and the detection of brute force attacks.

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
1. Click *Create*

![!Marking sensitive data][img-masking]
