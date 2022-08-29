[link-wallarm-mode-override]:       ../../admin-en/configure-parameters-en.md#wallarm_mode_allow_override

[img-mode-rule]:        ../../images/user-guides/rules/wallarm-mode-rule-with-safe-blocking.png

# Filtration mode rule

The filtration mode allows you to enable and disable the blocking of requests to various parts of a web application.

To set a filtration mode, create a *Set filtration mode* rule and select the appropriate mode.

The filtration mode can take one of the following values:

* **Default**: the system will work in accordance with the parameters specified in the NGINX configuration files.
* **Disable**: the analysis and filtration of requests are disabled completely.
* **Monitorig**: the requests are analyzed and displayed in the interface but they are not blocked even if they are originated from [denylisted](../ip-lists/denylist.md) IPs.
* **Safe blocking**: malicious requests are blocked only if they are originated from [graylisted IPs](../ip-lists/graylist.md).
* **Blocking**: malicious requests are blocked and displayed in the interface.

To implement this rule, the NGINX configuration files must permit [centralized management of the operation mode][link-wallarm-mode-override].

!!! warning "Changes in the `off` and `monitoring` filtration mode logic"
    Starting with version 3.2, the logic of Wallarm node filtration modes has been changed as follows:

    * Wallarm node analyzes request source only in the `safe_blocking` and `block` modes now.
    * If the Wallarm node operating in the `off` or `monitoring` mode detects the request originated from the [denylisted](../ip-lists/denylist.md) IP, it does not block this request.
    * If the Wallarm node operating in the `monitoring` mode detects the attack originated from the [whitelisted](../ip-lists/whitelist.md) IP, it uploads the attack data to the Wallarm Cloud. Uploaded data is displayed in the **Events** section of Wallarm Console.

    During the [Wallarm module upgrade](../../updating-migrating/general-recommendations.md), please ensure that deployed Wallarm node processes requests as expected or adjust filtration mode settings to the released changes.

    If you have already updated modules, please adjust the filtration mode settings to changes released in version 3.2 (if necessary). [Details on filtration mode configuration](../../admin-en/configure-wallarm-mode.md)

## Creating and applying the rule

--8<-- "../include/waf/features/rules/rule-creation-options.md"

## Default instance of rule

Wallarm automatically creates the instance of the `Set filtration mode` rule on the [default](../../user-guides/rules/view.md#default-rules) level. The system sets its value on the basis of [general filtration mode](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) setting.

This instance of the rule cannot be deleted. To change its value, modify [general filtration mode](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) setting of the system.

As all the other default rules, the `Set filtration mode` default rule is [inherited](../../user-guides/rules/view.md) by all branches.

## Example: Disabling Request Blocking During User Registration

**If** the following conditions take place:

* new user registration is available at *example.com/signup*
* it is better to overlook an attack than to lose a customer

**Then**, to create a rule disabling blocking during user registration

1. Go to the *Rules* tab
1. Find the branch for `example.com/signup`, and click *Add rule*
1. Choose *Set filtration mode*
1. Choose operation mode *monitoring*
1. Click *Create*

![!Setting traffic filtration mode][img-mode-rule]
