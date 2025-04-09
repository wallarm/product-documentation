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
* Advanced rate limiting

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

## Configuring

Perform configuring in the **Security controls** → **Mitigation Controls** section of Wallarm Console. You can also access some mitigation control settings for other places in the system, for example, from API Sessions.

Before configuring, get familiar with the idea of [branches](#mitigation-control-branches) and check what already exists. 

In general, configuring any mitigation control includes 2 steps:

1. Set conditions (when all met → action)
1. Set action (mitigation mode)

### Conditions

When all conditions are met, mitigation control performs its action. Conditions include:

* **Scope** is where request targets (URI + extras), see details [here](../user-guides/rules/rules.md#configuring)
* **Other settings** of mitigation control that define whether it will or will not take action, for example, for GraphQL API protection they are policy positions—control will act only if any of them is violated by request; or, for enumeration protection, they are multiple parameters of requests—control will act only if all specified parameters/values are met.

For specifying conditions, you can use [regular expressions](#regex).

### Action

When all conditions are met, mitigation control performs its action. The required action is selected in the **Mitigation mode** section:

* **Monitoring** - the attack is registered and displayed in Attacks or [API Sessions](../api-sessions/overview.md).
* **Blocking** - the attack is registered and blocked real-time or by  placing source IP(s) into [denylist](../user-guides/ip-lists/overview.md) for the selected period of time.
* **Inherited** - this means, mitigation control's settings will not work—instead, its [parent control](#mitigation-control-branches)'s settings will work. This mode makes sense when you want temporarily pause activity of mitigation control without deleting it. If there is no parent control, such mitigation control will not do anything.
* **Disabled** - this stops any [parent control](#mitigation-control-branches) effect starting from current endpoint to all branches down. Settings of such controls are not important, they are not applied as well (until re-enabled).

### Regex

For specifying mitigation control [conditions](#conditions), you can use regular expressions.

The **Scope** section uses PIRE regular expression library. See details on usage [here](../user-guides/rules/rules.md#condition-type-regex-).

Some mitigation controls, for example, enumeration control, allow specifying advanced conditions using PCRE. Use the following operators to involve regular expression:

| Operator | Description |
| --- | --- |
| ~ (Aa)  | Find something by case insensitive regexp. |
| !~ (Aa) | Exclude something by case insensitive regexp. |
| ~       | Find something by case sensitive regexp. |
| !~      | Exclude something by case sensitive regexp. |
