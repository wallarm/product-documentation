[whitelist-scanner-addresses]: ../user-guides/ip-lists/whitelist.md

# Best practices for configuring the Active threat verification feature

## What is the Active threat verification feature

One method Wallarm uses to [detect vulnerabilities](../about-wallarm-waf/detecting-vulnerabilities.md) is **Active threat verification**.

**Active threat verification** with the main component **Attack rechecker** lets you turn attackers into penetration testers and discover possible security issues from their activity as they probe your apps/APIs for vulnerabilities. The module **Attack rechecker** finds possible vulnerabilities by probing application endpoints using real attack data from the traffic.

By default **Active threat verification** is disabled. To enable the module, [know how to control the Attack rechecker](#know-how-to-control-the-attack-rechecker).

## How the Active threat verification feature works

--8<-- "../include/how-attack-rechecker-works.md"

## Potential risks from the Attack rechecker activity

* In rare cases when a legitimate request is detected by Wallarm as an attack, the request will be replayed by **Attack rechecker**. If the request is not idempotent (for example, an authenticated request creating a new object in the application), then the **Attack rechecker** requests may create many new unwanted objects in the user account or perform other unexpected operations.

    To minimize the risk of the described situation, **Attack rechecker** will automatically strip the following HTTP headers from the replayed requests:

    * `Cookie`
    * `Authorization: Basic`
    * `Viewstate`
* In cases when the application uses a non-standard authentication method or does not require authenticating the requests, **Attack rechecker** may replay any request from the traffic and harm the system. For example: repeat 100 and more money transactions or orders. To minimize the risk of the described situation, it is recommended to [use testing or staging environments for attack replaying](#optional-configure-attack-rechecker-request-rewriting-rules-run-tests-against-a-copy-of-the-application) and [mask non-standard request authentication parameters](#configure-proper-data-masking-rules).

## Attack rechecker configuration best practices

### Configure proper data masking rules

If your application uses non-standard types of authentication (for example, request string token or custom HTTP request header or JSON attribute in POST body), then you should configure a proper [data masking rule](../user-guides/rules/sensitive-data-rule.md) to prevent the filtering nodes from sending the information to the Wallarm Cloud. In this case, the replayed **Attack rechecker** requests will be not authorized by the application and not cause any harm to the system.

### Know how to control the Attack rechecker

The global on/off switch of the **Attack rechecker** module is located in the Wallarm Console → [**Scanner** section](../user-guides/scanner/configure-scanner-modules.md). By default this module is disabled.

### Configure proper notification and escalation rules for detected security incidents

Wallarm provides [integrations with third-party messaging and incident management services](../user-guides/settings/integrations/integrations-intro.md) like Slack, Telegram, PagerDuty, Opsgenie and others. It is highly recommended to configure your Wallarm Cloud instance to use the integrations to dispatch notifications about discovered security incidents to your information security team.

### Know how to handle potential leaks of sensitive data from filtering nodes to the Wallarm Cloud

If you discover that your filtering nodes have dispatched some detected false positive requests with included sensitive information such as authentication tokens or username/password credentials to the Wallarm Cloud, you can ask the [Wallarm technical support](mailto:support@wallarm.com) to delete the requests from the Wallarm Cloud storage. Also, you can configure proper [data masking rules](../user-guides/rules/sensitive-data-rule.md). It is not possible to modify already stored data.

### Optional: Enable/disable Attack rechecker tests for specific applications, domains or URLs

If some application endpoints are not idempotent and don’t use any request authentication mechanism (for example, the self-registration of a new customer account) it is recommended to disable the **Attack rechecker** feature for the specific endpoints. Wallarm provides the customers with the ability to control which specific customer applications, domains or URLs should have the **Attack rechecker** scanner enabled or disabled by using the [rule **Disable/Enable active threat verification**](../user-guides/rules/change-request-for-active-verification.md#rewriting-the-request-before-attack-replaying).

### Optional: Configure Attack rechecker request rewriting rules (run tests against a copy of the application)

If you want to run checks against the copy of the application and completely avoid scanning the production application, then it is possible to create a [rule](../user-guides/rules/change-request-for-active-verification.md) which instructs the **Attack rechecker** to modify certain elements in replayed attack requests.
