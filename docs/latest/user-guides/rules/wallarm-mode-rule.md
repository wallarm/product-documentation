[link-wallarm-mode-override]:       ../../admin-en/configure-parameters-en.md#wallarm_mode_allow_override

[img-mode-rule]:        ../../images/user-guides/rules/wallarm-mode-rule-with-safe-blocking.png

# Filtration mode rule

The filtration mode allows you to enable and disable the blocking of requests to various parts of a web application. One of the [options to configure the filtration mode](../../admin-en/configure-wallarm-mode.md) is to create the **Set filtration mode** rule for specific requests.

The filtration mode can take one of the following values:

* **Default**: the system will work in accordance with the parameters specified in the local node configuration files.
* **Disable**: the analysis and filtration of requests are disabled completely.
* **Monitoring**: the requests are analyzed and displayed in the interface but they are not blocked even if they are originated from [denylisted](../ip-lists/denylist.md) IPs.
* **Safe blocking**: malicious requests are blocked only if they are originated from [graylisted IPs](../ip-lists/graylist.md).
* **Blocking**: malicious requests are blocked and displayed in the interface.

To implement this rule, the local node configuration must permit [centralized management of the operation mode][link-wallarm-mode-override].

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

## Generating the rule for certain applications automatically

Specifying filtration mode on a per-application basis during [application configuration](../settings/applications.md) results in the automatically generated **Set filtration mode** rule. This rule has the following priority among other filtration mode setup options:

* A higher priority than the mode set in the local configuration files unless the [`wallarm_mode_allow_override` directive sets another behavior](../../admin-en/configure-wallarm-mode.md#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override).
* A higher priority than the [default instance of a rule](#default-instance-of-rule).
* A lower priority than the custom rules configured for specific paths of the selected application (if any).

## API calls to create the rule

To create the filtration mode rule, you can [call the Wallarm API directly](../../api/overview.md) besides using the Wallarm Console UI. Below is the example of the corresponding API call.

The following request will create the rule setting the node to filter traffic going to the [application](../settings/applications.md) with ID `3` in the monitoring mode.

--8<-- "../include/api-request-examples/create-filtration-mode-rule-for-app.md"
