[img-masking]:              ../../images/user-guides/rules/sensitive-data-rule.png
[rule-creation-options]:    ../../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[request-processing]:       ../../user-guides/rules/request-processing.md

# Masking Sensitive Data

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

<!-- ### Masking of sensitive data

As with any third-party service, it's important for a Wallarm client to understand what client data is sent to Wallarm, and be assured that sensitive data will never reach Wallarm Cloud. Wallarm clients with PCI DSS, GDPR and other requirements are recommended to mask sensitive data using special rules.

The only data transmitted from filtering nodes to the Wallarm Cloud that may include any sensitive details is information about detected malicious requests. It is highly unlikely that a malicious request would contain any sensitive data. However, the recommended approach is mask HTTP request fields which may contain PII or credit card details, such as `token`, `password`, `api_key`, `email`, `cc_number`, etc. Using this approach will guarantee that specified information fields will never leave your security perimeter.

You can apply a special rule called **Mask sensitive data** to specify what fields (in the request URI, headers or body) should be omitted when sending attack information from a filtering node to the Wallarm Cloud. For additional information about masking the data, please see the [document](../user-guides/rules/sensitive-data-rule.md) or contact [Wallarm support team](mailto:request@wallarm.com). -->
