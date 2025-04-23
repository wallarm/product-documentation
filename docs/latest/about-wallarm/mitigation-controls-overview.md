[link-attack-detection-tools]:  protecting-against-attacks.md#tools-for-attack-detection
[link-sub-plans]:               subscription-plans.md#waap-and-advanced-api-security
[link-filtration-mode]:         ../admin-en/configure-wallarm-mode.md
[link-nodes]:                   overview.md#how-wallarm-works
[link-sessions]:                ../api-sessions/overview.md
[link-brute-force-protection]:  ../admin-en/configuration-guides/protecting-against-bruteforce.md

# Mitigation Controls

Mitigation controls extend Wallarm's [basic](protecting-against-attacks.md#tools-for-attack-detection) attack protection with additional security measures.

## What you can do with mitigation controls

Using mitigation controls, you can enable and configure:

* Real-time blocking mode
* GraphQL API protection
* Enumeration attack protection
* BOLA enumeration protection
* Forced browsing protection
* Brute force protection
* [Rate abuse protection](../api-protection/rate-abuse-protection.md)

## Difference between mitigation controls and rules

Mitigation controls may seem similar to [rules](../user-guides/rules/rules.md). Consider the differences:

--8<-- "../include/mitigation-controls-vs-rules.md"

## Mitigation control branches

Mitigation controls are automatically grouped into nested branches by endpoint URIs and other conditions. This builds a tree-like structure in which mitigation control effects are inherited down. Principles:

* All branches inherit [all traffic](#all-traffic-mitigation-controls) mitigation controls.
* In a branch, child endpoints inherit mitigation control effects from the parent.
* Distinct has priority over inherited.
* Directly specified has priority over regex.
* Case sensitive has priority over insensitive.

## All traffic mitigation controls

You can create mitigation controls with specified action but not linked to any endpoint - they are called **all traffic** controls. Such rules are applied to all endpoints.

To create all traffic mitigation control, follow the standard procedure but leave the **Scope** section blank. The new mitigation control not linked to any endpoint will be created.

Some all traffic mitigation controls are created automatically by different Wallarm modules and cannot be deleted or edited directly. For example, **Real-time blocking mode** for all traffic is created and set by configuring **Settings** → **General** → **Filtration mode**.

All traffic mitigation controls are inherited by all branches.

## Configuration

Perform configuring in the **Security controls** → **Mitigation Controls** section of Wallarm Console. You can also access some mitigation control settings for other places in the system, for example, from API Sessions.

Before configuring, get familiar with the idea of [branches](#mitigation-control-branches) and check what already exists. 

In general, configuring any mitigation control includes 2 steps:

1. Set conditions (when all met → action)
1. Set action (mitigation mode)

### Scope

**Scope** is where request targets (URI + extras), see details [here](../user-guides/rules/rules.md#configuring)

### Advanced conditions

Besides [Scope](#scope), mitigation control may include other conditions that define whether it will or will not take action, for example, for GraphQL API protection they are policy positions—control will act only if any of them is violated by request; or, for enumeration protection, they are multiple parameters of requests—control will act only if all specified parameters/values are met.

For specifying conditions, you can use [regular expressions](#regular-expressions).

### Mitigation mode

When all conditions are met, mitigation control performs its action. The required action is selected in the **Mitigation mode** section:

| Mitigation mode | Description |
| --- | --- |
| **Inherited** | Mode is inherited from the [global filtration mode setting](../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console) and the [configuration](../admin-en/configure-wallarm-mode.md#setting-wallarm_mode-directive) of the Wallarm node. |
| **Monitoring** | Only registers detected attacks; no blocking is performed. Registered attacks are displayed in **API Sessions**, in the corresponding [session details](../api-sessions/exploring.md#specific-activities-within-session). |
| **Blocking** | Registers and blocks attacks. [Blocking methods](../about-wallarm/protecting-against-attacks.md#attack-handling-process) vary by control type: real-time blocking, [IP-based blocking](../user-guides/ip-lists/overview.md), or session-based blocking<sup>*</sup>. |
| **Disabled** | Mitigation control is temporarily turned off and is not applied. |
| **Excluding** | Disables this type of mitigation control for the [specified scope](#mitigation-control-branches). |
| **Safe blocking** | Registers attacks but blocks them only if the originating IP is [graylisted](../user-guides/ip-lists/overview.md). |

<small><sup>*</sup> The session-based blocking is not supported so far.</small>

The list of available modes may vary depending on the particular control.

### Regular expressions

For specifying mitigation control [conditions](#conditions), you can use regular expressions.

The **Scope** section uses PIRE regular expression library. See details on usage [here](../user-guides/rules/rules.md#condition-type-regex-).

Some mitigation controls, for example, enumeration control, allow specifying advanced conditions using PCRE. Use the following operators to involve regular expression:

| Operator | Description |
| --- | --- |
| ~ (Aa)  | Find something by case insensitive regexp. |
| !~ (Aa) | Exclude something by case insensitive regexp. |
| ~       | Find something by case sensitive regexp. |
| !~      | Exclude something by case sensitive regexp. |
