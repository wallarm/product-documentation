[link-cloud-node-synchronization]: ../admin-en/configure-cloud-node-synchronization-en.md
[img-rules-create-backup]:      ../images/user-guides/rules/rules-create-backup.png

# Mitigation Controls <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Mitigation controls extend Wallarm's [attack protection](protecting-against-attacks.md#tools-for-attack-detection) with additional security measures and allow fine-tuning of the Wallarm behavior.

## What you can do with mitigation controls

Using mitigation controls, you can enable and configure:

* [Real-time blocking mode](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode)
* [GraphQL API protection](../api-protection/graphql-rule.md)
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md)
* [BOLA enumeration protection](../api-protection/enumeration-attack-protection.md)
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md)
* [Brute force protection](../api-protection/enumeration-attack-protection.md)
* [DoS protection](../api-protection/dos-protection.md)
* [Business logic abuse detection](../api-protection/business-logic-abuse-detection.md)
* [AI payload inspection](../agentic-ai/ai-payload-inspection.md)
* [File upload restriction policy](../api-protection/file-upload-restriction.md)

## Mitigation control branches

Mitigation controls are automatically grouped into nested branches by endpoint URIs and other conditions. This builds a tree-like structure in which mitigation control effects are inherited down. Principles:

* All branches inherit [all traffic](#scope) mitigation controls.
* In a branch, child endpoints inherit mitigation control effects from the parent.
* Distinct has priority over inherited.
* Directly specified has priority over regex.
* Case sensitive has priority over insensitive.

## Enabling

Mitigation controls require 

* The [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) subscription plan
* (most controls) [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1 or [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.14.1

If you have all of this and still, in Wallarm Console, do not see the **Security controls** → **Mitigation Controls** section, contact the [Wallarm support team](https://support.wallarm.com/) to enable them.

## Creating and applying mitigation control

To create and apply a new mitigation control:

1. Proceed to Wallarm Console → **Mitigation Controls**.
1. Click **Add control**.
1. In the **Add control** dialog, select the type of control you want to create.

    ![Creating mitigation control](../images/user-guides/mitigation-controls/mc-create.png)

1. [Configure](#configuration) your control.
1. Click **Add**. The created control is displayed in the list. It immediately goes into action and performs in accordance with the selected **Mitigation mode**.

    You can temporarily turn off the control right after creation or at any moment later using the **On/Off** switcher.

## Configuration

Perform configuring in the **Security controls** → **Mitigation Controls** section of Wallarm Console. You can also access some mitigation control settings from other places in the system, for example, from API Sessions.

![Mitigation Controls page in UI](../images/user-guides/mitigation-controls/mc-main-page.png)

Before configuring, get familiar with the idea of [branches](#mitigation-control-branches) and check what already exists. 

In general, configuring any mitigation control includes the following steps:

1. Optionally, set custom **Title**.
1. Set conditions (when all met → action).
1. Set action (mitigation mode).

### Scope

**Scope** defines which requests the control applies to (based on URI and other parameters). It’s configured the same way as request conditions in rules. See details [here](../user-guides/rules/rules.md#configuring).

If you leave the **Scope** section blank, mitigation control is applied to **all traffic** and **all applications**; such controls are inherited by all [branches](#mitigation-control-branches).

### Advanced conditions

Besides [Scope](#scope), mitigation control may include other conditions that define whether it will or will not take action, for example:

* For [GraphQL API protection](../api-protection/graphql-rule.md) they are policy positions - control will act only if any of them is violated by request.
* For [Enumeration attack protection](../api-protection/enumeration-attack-protection.md), they are multiple parameters of requests - control will act only if all specified parameters/values are met.

For some controls, like [Enumeration attack protection](../api-protection/enumeration-attack-protection.md) or [DoS protection](../api-protection/dos-protection.md), in the **Scope filters** section, you can use the **session context parameters** to quickly select parameters from the list of ones, that were [defined as important](../api-sessions/setup.md#session-context) in **API Sessions**. Use the **Add custom** option in this section to add as filters the parameters that are currently not presented in **API Sessions**. If you do so, these parameters will be added to **API Sessions**' context parameters as well (hidden, meaning you will see these parameters in session details if they are presented in requests, but you will not see them in API Session [context parameter configuration](../api-sessions/setup.md#session-context)).

For specifying advanced conditions, you can use [regular expressions](#regular-expressions).

### Mitigation mode

When all conditions are met, mitigation control performs its action. The required action is selected in the **Mitigation mode** section:

| Mitigation mode | Description |
| --- | --- |
| **Inherited** | Mode is inherited from the [all-traffic **Real-time blocking mode**](../admin-en/configure-wallarm-mode.md#general-filtration-mode) and the [configuration](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive) of the Wallarm node. |
| **Monitoring** | Only registers detected attacks; no blocking is performed. Registered attacks are displayed in **API Sessions**, in the corresponding [session details](../api-sessions/exploring.md#specific-activities-within-session). <br> For some controls, in this mode, you can also select additional option of adding source IP in the [Graylist](../user-guides/ip-lists/overview.md). |
| **Blocking** | Registers and blocks attacks. [Blocking methods](../about-wallarm/protecting-against-attacks.md#attack-handling-process) vary by control type: real-time blocking, [IP-based blocking](../user-guides/ip-lists/overview.md), or [session-based blocking](../api-sessions/blocking.md#blocking-sessions). |
| **Excluding** | Stops this type of mitigation control for the [specified scope](#mitigation-control-branches). See details in [Excluding mode vs. disabling](#excluding-mode-vs-disabling). |
| **Safe blocking** | Registers attacks but blocks them only if the originating IP is [graylisted](../user-guides/ip-lists/overview.md). |

The list of available modes may vary depending on the particular control.

### Excluding mode vs. disabling

You can use **On/Off** switcher to temporarily disable mitigation control and re-enable it when necessary. Consider the example below to understand the difference between disabled mitigation control and the one enabled in Excluding mitigation mode:

* Consider the fact that controls [work in branches](#mitigation-control-branches).
* Let's say you have [DoS protection](../api-protection/dos-protection.md) control set for `example.com` (50 request in minute) and control of the same type for child `example.com/login` (10 request in minute). This will result in restriction of 50 request in minute for all addresses under `example.com`, except addresses under `example.com/login` where it will be stricter - 10 request in minute.
* If you disable (switcher to **Off**) rate abuse protection control for `example.com/login`, it will stop doing anything (as if you deleted it) - restriction for all scope will be defined by parent control (50 request in minute).
* If you re-enable rate abuse protection control for `example.com/login` and set its mitigation mode to **Excluding**, it will stop rate abuse protection for this branch - restriction for all `example.com` will be 50 request in minute, except `example.com/login` where there will be no restriction of rate abuse protection type at all.

### Regular expressions

For specifying different mitigation control parameters, like **Scope**, **Scope filters**, and others, you can use regular expressions:

* The **Scope** section uses PIRE regular expression library. See details on usage [here](../user-guides/rules/rules.md#condition-type-regex).
* Other sections use [PCRE](https://www.pcre.org/). Use the following operators to involve regular expression:

    | Operator | Description |
    | --- | --- |
    | ~ (Aa)  | Find something by case insensitive regexp. |
    | !~ (Aa) | Exclude something by case insensitive regexp. |
    | ~       | Find something by case sensitive regexp. |
    | !~      | Exclude something by case sensitive regexp. |

## Default controls

Wallarm provides a set of **default mitigation controls** that, when enabled, significantly enhance the detection capabilities of the Wallarm platform. These controls are pre-configured to offer robust protection against a variety of common attack patterns. The current default mitigation controls include:

* [GraphQL protection](../api-protection/graphql-rule.md)
* [BOLA (Broken Object Level Authorization) enumeration protection](../api-protection/enumeration-attack-protection.md#bola) for user IDs, object IDs, and filenames
* [Brute force protection](../api-protection/enumeration-attack-protection.md#brute-force) for passwords, OTPs, and authentication codes
* [Forced browsing protection](../api-protection/enumeration-attack-protection.md#forced-browsing) (404 probing)
* [Enumeration attack protection](../api-protection/enumeration-attack-protection.md#generic-enumeration), including:
    
    * User/email enumeration
    * SSRF (Server-Side Request Forgery) enumeration
    * User-agent rotation

All controls from the default set have the `Default` label. Such controls: 

* Added by Wallarm automatically and enabled (`On`) for the new clients, disabled (`Off`) for the rest.

    !!! info "Absence of default controls"
        If you do not see any default controls, except [obligatory](#obligatory_default_controls) ones, and do want to explore and try them, contact the [Wallarm support team](https://support.wallarm.com/) to get them.

* All are initially applied to [all traffic](#scope) (changeable).
* All initially use `Monitoring` [mitigation mode](#mitigation-mode) (changeable).
* Cannot be deleted.
* Can be disabled/re-enabled and edited like all others. Editing allows you to customize any default control based on the specific needs of the application, traffic patterns, or business context. For example, you may adjust default thresholds or exclude specific endpoints via the **Scope filters** section.
<!--* Can be **reset to its default configuration** at any time.-->

![Default mitigation controls](../images/user-guides/mitigation-controls/mc-defaults.png)

--8<-- "../include/mc-subject-to-change.md"

<a name="obligatory_default_controls"></a>**Obligatory default controls**

* All traffic [Real-time blocking mode](../admin-en/configure-wallarm-mode.md#conditioned-filtration-mode) control
* [Overlimit res](../user-guides/rules/configure-overlimit-res-detection.md) <!--this is a general setting, not MC-->

## Ruleset lifecycle

All created mitigation controls and [rules](../user-guides/rules/rules.md) form a custom ruleset. The Wallarm node relies on the custom ruleset during incoming requests analysis.

Changes of rules and mitigation controls do NOT take effect instantly. Changes are applied to the request analysis process only after the custom ruleset **building** and **uploading to the filtering node** are finished.

--8<-- "../include/custom-ruleset.md"

## Migrating between tenants

If you have [multiple tenants](../installation/multi-tenant/overview.md), you can [migrate](../installation/multi-tenant/overview.md#migrating-rules) (copy) mitigation controls between them **along with other rules**.
