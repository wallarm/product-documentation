# Using Rules for Fine Tuning of Node Work

Using [rules](intro.md), you can fine tune how Wallarm nodes work. This article describes how create such rules and configure them.

You can: 

* [Set the filtration mode](#set-filtration-mode)
* [Limit the request processing time](#limit-request-processing-time)
* [Mask sensitive data](#mask-sensitive-data)

## Set filtration mode

The filtration mode allows you to enable and disable the blocking of requests to various parts of a web application.

To set a filtration mode, create a *Set filtration mode* rule and select the appropriate mode.

The filtration mode can take one of the following [values](../../admin-en/configure-wallarm-mode.md#available-filtration-modes):

* **Default**: the system will work in accordance with the parameters specified in the NGINX configuration files.
* **Disable**: analysis and filtration of requests are turned off, except for requests originating from IPs on the [denylist](../ip-lists/overview.md). Requests from denylisted IPs are blocked (but not shown in the interface).
* **Monitoring**: requests are analyzed and displayed in the interface, but they are not blocked unless they originate from denylisted IPs. Requests from denylisted IPs are blocked (but not shown in the interface).
* **Safe blocking**: malicious requests are blocked only if they are originated from [graylisted IPs](../ip-lists/overview.md).
* **Blocking**: malicious requests are blocked and displayed in the interface.

To implement this rule, the NGINX configuration files must permit [centralized management of the operation mode][link-wallarm-mode-override].

**Creating and applying the rule**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

**Default instance of rule**

Wallarm automatically creates the instance of the `Set filtration mode` rule on the [default](../../user-guides/rules/view.md#default-rules) level. The system sets its value on the basis of [general filtration mode](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) setting.

This instance of the rule cannot be deleted. To change its value, modify [general filtration mode](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) setting of the system.

As all the other default rules, the `Set filtration mode` default rule is [inherited](../../user-guides/rules/view.md) by all branches.

**Example: Disabling Request Blocking During User Registration**

**If** the following conditions take place:

* new user registration is available at *example.com/signup*
* it is better to overlook an attack than to lose a customer

**Then**, to create a rule disabling blocking during user registration

1. Go to the *Rules* tab
1. Find the branch for `example.com/signup`, and click *Add rule*
1. Choose *Set filtration mode*
1. Choose operation mode *monitoring*
1. Click *Create*

![Setting traffic filtration mode][img-mode-rule]

**API calls to create the rule**

To create the filtration mode rule, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below is the example of the corresponding API call.

The following request will create the rule setting the node to filter traffic going to the [application](../settings/applications.md) with ID `3` in the monitoring mode.

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"

## Limit request processing time

The Wallarm node spends limited time on a single incoming request processing and if the time limit is exceeded, marks the request as the [resource overlimiting (`overlimit_res`)](../../attacks-vulns-list.md#overlimiting-of-computational-resources) attack. The **Fine-tune the overlimit_res attack detection** rule enables you to customize the time limit allocated for a single request processing and default node behavior when the limit is exceeded.

Limiting the request processing time prevents the bypass attacks aimed at the Wallarm nodes. In some cases, the requests marked as `overlimit_res` can indicate insufficient resources allocated for the Wallarm node modules resulting in long request processing.

**Default node behavior**

The Wallarm node is configured to spend no more than **1,000 milliseconds** on a single incoming request processing by default.

If the time limit is exceeded, the Wallarm node:

1. Stops request processing.
1. Marks the request as the `overlimit_res` attack and uploads attack details to the Wallarm Cloud.

    If the processed request part also contains other [attack types](../../attacks-vulns-list.md), the Wallarm node uploads details on them to the Cloud as well.

    Attacks of the corresponding types will be displayed in the [event list](../events/check-attack.md) in Wallarm Console.
1. <a name="request-blocking"></a>In the **monitoring** [mode](../../admin-en/configure-wallarm-mode.md), the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.

    In the **safe blocking** mode, the node blocks the request if it originates from the [graylisted](../ip-lists/overview.md) IP address. Otherwise, the node forwards the original request to the application address. The application has the risk to be exploited by the attacks included in both processed and unprocessed request parts.

    In the **block** mode, the node blocks the request.

!!! info "Request processing in the "Disabled" mode"
    In the **disabled** [mode](../../admin-en/configure-wallarm-mode.md), the node does not analyze incoming traffic and, consequently, does not catch the attacks aimed at resource overlimiting.

**Changing the default node behavior**

!!! warning "Risk of protection bypass or running out of system memory"
    * It is recommended to change the default node behavior only in the strictly specific locations where it is really necessary, e.g. where the upload of the large files is performed, and where there is no risk of protection bypass and vulnerability exploit.
    * The high time limit and/or continuation of request processing after the limit is exceeded can trigger memory exhaustion or out-of-time request processing.

The **Fine-tune the overlimit_res attack detection** rule enables you to change the default node behavior as follows:

* Set custom limit on a single request processing
* Stop or continue the request processing when the time limit is exceeded

    If the node continues request processing after the time limit has been exceeded, it uploads data on detected attacks to the Cloud only after the request processing is fully completed.

    If the rule is set to stop processing, the node stops the request processing once the time limit is exceeded. It then forwards the request unless it is set to record an attack and is in blocking mode. In that case, the node blocks the request and logs the `overlimit_res` attack.
* Register the `overlimit_res` attack when the request processing time limit is exceeded or not

    If the node is configured to register the attack, it either [blocks the request or forwards it to the application address](#request-blocking) depending on the filtration mode.

    If the node is not configured to register the attack and the request does not contain other attack types, the node forwards the original request to the application address. If the request contains other attack types, the node either blocks the request or forwards it to the application address depending on the filtration mode

The rule DOES NOT allow to:

* Set the blocking mode for the `overlimit_res` attacks separately from other configurations. If the **Register and display in the events** option is chosen, the node either blocks the `overlimit_res` attack or forwards it to the application address depending on the [filtration mode](../../admin-en/configure-wallarm-mode.md) set for the corresponding endpoint.

**Rule example**

* The rule increases the time limit for processing each POST request to `https://example.com/upload` up to 1,020 milliseconds. The specified endpoint performs large file uploading.
* Other parameters of the node behavior remain default - if the node processes the request longer than 1,020 milliseconds, it stops the request processing and registers the `overlimit_res` attack.

![The "Register and display in the events" rule example](../../images/user-guides/rules/fine-tune-overlimit-detection-example.png)

[img-masking]:      ../../images/user-guides/rules/sensitive-data-rule.png

## Mask sensitive data

The Wallarm node sends the following data to the Wallarm Cloud:

* Serialized requests with attacks
* Wallarm system counters
* System statistics: CPU load, RAM usage, etc.
* Wallarm system statistics: number of processed NGINX requests, Tarantool statistics, etc.
* Information on the nature of the traffic that Wallarm needs to correctly detect application structure

Some data should not be transferred outside of the server on which it is processed. Typically, this category includes authorization (cookies, tokens, passwords), personal data and payment credentials.

Wallarm Node supports data masking in requests. This rule cuts the original value of the specified request point before sending the request to the postanalytics module and Wallarm Cloud. This method ensures that sensitive data cannot leak outside the trusted environment.

It can affect the display of attacks, active attack (threat) verification, and the detection of brute force attacks.

**Creating and applying the rule**

--8<-- "../include/waf/features/rules/rule-creation-options.md"

**Example: Masking of a Cookie Value**

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
