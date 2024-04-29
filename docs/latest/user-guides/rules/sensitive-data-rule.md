[img-masking]:              ../../images/user-guides/rules/sensitive-data-rule.png
[rule-creation-options]:    ../../user-guides/events/analyze-attack.md#analyze-requests-in-an-event
[request-processing]:       ../../user-guides/rules/request-processing.md
[api-discovery-enable-link]:        ../../api-discovery/setup.md#enable

# Masking Sensitive Data

It is crucial that sensitive data in your requests remains secure within your infrastructure and is not transmitted to any third-party service including [Wallarm Cloud](../../about-wallarm/overview.md#how-wallarm-works). This goal is achieved using the [shared responsibility model](../../about-wallarm/shared-responsibility.md): from its side, Wallarm transmits no data except the one about malicious requests, which makes exposure of sensitive data highly unlikely - from your side, masking of sensitive data is expected which additionally guarantees that protected information fields will never leave your security perimeter.

Wallarm provides the **Mask sensitive data** [rule](../rules/rules.md) to configure data masking. The Wallarm node sends the following data to the Wallarm Cloud:

* Serialized requests with attacks
* Wallarm system counters
* System statistics: CPU load, RAM usage, etc.
* Wallarm system statistics: number of processed NGINX requests, Tarantool statistics, etc.
* Information on the nature of the traffic that Wallarm needs to correctly detect application structure

The **Mask sensitive data** rule cuts the original value of the specified request point before sending the request to the postanalytics module and Wallarm Cloud. This method ensures that sensitive data cannot leak outside the trusted environment.

It can affect the display of attacks, active attack (threat) verification, and the detection of brute force attacks.

## Creating and applying rule

To set and apply data mask:

--8<-- "../include/rule-creation-initial-step.md"
1. In **If request is**, [describe](rules.md#configuring) the scope to apply the rule to.
1. In **Then**, choose **Mask sensitive data**.
1. In **In this part of request**, specify [request points](request-processing.md) for which its original value should be cut.
1. Wait for the [rule compilation and uploading to the filtering node to complete](rules.md#ruleset-lifecycle).

## Example: masking of a cookie value

Let us say your application accessible at the `example.com` domain uses the `PHPSESSID` cookie for user authentication and you want to deny access to this information for employees using Wallarm.

To do so, set the **Mask sensitive data** rule as displayed on the screenshot.

--8<-- "../include/waf/features/rules/request-part-reference.md"

![Marking sensitive data][img-masking]
