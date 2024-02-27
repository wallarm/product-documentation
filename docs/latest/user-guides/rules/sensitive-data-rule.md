[img-masking]:              ../../images/user-guides/rules/sensitive-data-rule.png
[rule-creation-options]:    ../../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[request-processing]:       ../../user-guides/rules/request-processing.md

# Masking Sensitive Data

Some data should not be transferred outside of the server on which it is processed. Typically, this category includes authorization (cookies, tokens, passwords), personal data and payment credentials. To avoid such data exposure Wallarm provides an ability to mask sensitive data. How to configure this masking is described in this article.

Wallarm provides the **Mask sensitive data** rule to configure data masking. The Wallarm node sends the following data to the Wallarm Cloud:

* Serialized requests with attacks
* Wallarm system counters
* System statistics: CPU load, RAM usage, etc.
* Wallarm system statistics: number of processed NGINX requests, Tarantool statistics, etc.
* Information on the nature of the traffic that Wallarm needs to correctly detect application structure

The **Mask sensitive data** rule cuts the original value of the specified request point before sending the request to the postanalytics module and Wallarm Cloud. This method ensures that sensitive data cannot leak outside the trusted environment.

It can affect the display of attacks, active attack (threat) verification, and the detection of brute force attacks.

## Creating and applying rule

To set and apply data mask:

1. Proceed to Wallarm Console → **Rules** → **Add rule**.
1. In **If request is**, [describe](rules.md#branch-description) the scope to apply the rule to.
1. In **Then**, choose **Mask sensitive data**.
1. In **In this part of request**, specify [request points](request-processing.md) for which its original value should be cut.
1. Wait for the [rule compilation to complete](rules.md#ruleset-lifecycle).

## Example: masking of a cookie value

Let us say your application accessible at the `example.com` domain uses the `PHPSESSID` cookie for user authentication and you want to deny access to this information for employees using Wallarm.

To do so, set the **Mask sensitive data** rule as displayed on the screenshot.

--8<-- "../include/waf/features/rules/request-part-reference.md"

![Marking sensitive data][img-masking]

<!-- ### Masking of sensitive data

As with any third-party service, it's important for a Wallarm client to understand what client data is sent to Wallarm, and be assured that sensitive data will never reach Wallarm Cloud. Wallarm clients with PCI DSS, GDPR and other requirements are recommended to mask sensitive data using special rules.

The only data transmitted from filtering nodes to the Wallarm Cloud that may include any sensitive details is information about detected malicious requests. It is highly unlikely that a malicious request would contain any sensitive data. However, the recommended approach is mask HTTP request fields which may contain PII or credit card details, such as `token`, `password`, `api_key`, `email`, `cc_number`, etc. Using this approach will guarantee that specified information fields will never leave your security perimeter.

You can apply a special rule called **Mask sensitive data** to specify what fields (in the request URI, headers or body) should be omitted when sending attack information from a filtering node to the Wallarm Cloud. For additional information about masking the data, please see the [document](../user-guides/rules/sensitive-data-rule.md) or contact [Wallarm support team](mailto:request@wallarm.com). -->
