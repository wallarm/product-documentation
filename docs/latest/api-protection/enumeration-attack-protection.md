# Enumeration Attack Protection <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm allows protecting your APIs from the enumeration attacks.

Wallarm provides several [mitigation controls](../about-wallarm/mitigation-controls-overview.md) to configure this protection:

* Enhanced configuration for:

    * **Brute Force Protection**
    * **BOLA Protection**
    * **Enumeration Attack Protection**

* Configuration for:

    * **Forced Browsing Protection**
    * **Rate Limit**

## Enhanced configuration

In general, you make 4 steps:

1. Set counters (select parameters that will be monitored for enumeration)
1. Set conditions (when all met, one or several counters get `+1`)
1. Set threshold (any of counters should be no more than `x` within `time`, if violated → action)
1. Set action (mitigation mode, what to do, if threshold is acceded)

<!-- ### Example

Before going into details, consider the example below to learn how to configure enumeration attack protection with mitigation controls.

Let us say you want to TBD. To provide this protection, you can TBD:

1. Steps TBD.
-->
### Counters

In the **Enumerated parameters** section, you need to select parameters that will be monitored for enumeration. Select set of parameters to be monitored via exact or or [regex](#regex) match (only one approach can be used within single mitigation control).

When some request meet all [conditions] and **contains** parameter monitored for enumeration, this parameter's counter gets `+1`.

### Conditions

When all conditions are met, one or several counters get `+1`. Conditions include:

* **Scope** is where request targets (URI + extras), see details [here](../user-guides/rules/rules.md#configuring)
* **Advanced conditions** are other request peculiarities, including values or value patters of:

    * **Built-in parameters** meta information presented in each request handled by Wallarm filtering node.

        ??? info "Show built-in parameter descriptions"

            | Parameter | Description |
            |---|---|
            |Attacks| Description TBD |
            |IP| Description TBD |
            |Domain| Description TBD |
            |URI| Description TBD |
            |Request time| Description TBD |
            |Request size| Description TBD |
            |Response size| Description TBD |
            |Blocked| Description TBD |
            |Method| Description TBD |
            |User agent| Description TBD |

    * **Session context parameters** - quickly select parameters from the list of ones, that were [defined as important](../api-sessions/setup.md#session-context) in API Sessions.
    * **Custom parameters** - any other parameters of requests.

!!! info "Performance note"
    As **Scope** settings are less demanding from the productivity perspective, it is always recommended to use them if it is enough for your goals, and only use **Advanced conditions** for the complex conditioning.

### Threshold

You set enumeration threshold of number of **unique** request per time in seconds. If any of the counters exceed this value, action is performed.

### Action

When any of the counters exceeds the threshold, the selected action is performed:

* **Monitoring** - the attack is registered, requests that are the part of this attack are marked in [API Sessions](../api-sessions/overview.md) as belonging to `brute`, `dirbust` (forced browsing), `bola` or generic `enum` attack but the requests are not blocked.
* **Blocking** → **Block IP address** - the attack is registered, requests that are the part of this attack are marked in API Sessions as belonging to this attack, all source IPs of these requests are placed into [denylist](../user-guides/ip-lists/overview.md) for the selected period of time.

The required action is selected in the **Mitigation mode** section.

### Regex

The **Scope** section uses PIRE regular expression library, while advanced conditions use PCRE. Use the following operators to involve regular expression:

| Operator | Description |
| --- | --- |
| ~ (Aa)  | Find something by case insensitive regexp. |
| !~ (Aa) | Exclude something by case insensitive regexp. |
| ~       | Find something by case sensitive regexp. |
| !~      | Exclude something by case sensitive regexp. |

<!-- ## Testing

To test the mitigation control described in the [Example](#example) section, TBD. -->

## Configuration

Protection from some enumeration attacks do not require setting several [counters](#counters) (selecting parameters that will be monitored for enumeration):

* **Forced Browsing Protection**
* **Rate Limit**

Compared to [enhanced configuration](#enhanced-configuration), the **Enumerated parameters** section will be absent—the remaining settings will be the same.
