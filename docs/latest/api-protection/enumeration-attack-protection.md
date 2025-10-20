# Enumeration Attack Protection <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;"></a>

Wallarm allows protecting your APIs from the [enumeration attacks](../attacks-vulns-list.md#enumeration-attacks) preventing the reveal of information highly valuable for malicious actors. By identifying valid usernames, email addresses, or system resources, attackers can significantly narrow their focus for subsequent attacks. This reconnaissance phase allows attackers to understand the target system better, potentially uncovering vulnerabilities and enabling the planning of more sophisticated and targeted attacks, ultimately increasing the likelihood of a successful breach.

Requires [NGINX Node](../installation/nginx-native-node-internals.md#nginx-node) 6.0.1 or [Native Node](../installation/nginx-native-node-internals.md#native-node) 0.14.1 or higher.

## Mitigation controls

Wallarm provides several [mitigation controls](../about-wallarm/mitigation-controls-overview.md) to configure protection from enumeration. When selecting which control to use, consider the following:

<table>
  <tr>
    <th>Control</th>
    <th>Specifics</th>
    <th>Enumerates</th>
    <th>Attack</th>
  </tr>
  <tr>
    <td><b>Brute force protection</b></td>
    <td rowspan="3">Counts the number of unique values seen for each parameter within a specified timeframe.</td>
    <td><code>password</code></td>
    <td><code>Brute force</code></td>
  </tr>
  <tr>
    <td><b>BOLA protection</b></td>
    <td><code>object ID</code>, <code>user ID</code></td>
    <td><code>BOLA</code></td>
  </tr>
  <tr>
    <td><b>Enumeration attack protection</b></td>
    <td>Any parameter</td>
    <td><code>Enum</code></td>
  </tr>
  <tr>
    <td><b>Forced browsing protection</b></td>
    <td>Counts the number of unique endpoints accessed in a configured timeframe.</td>
    <td><code>URL</code>s</td>
    <td><code>Forced browsing</code></td>
  </tr>
</table>

Thus: 

* If you want to prevent enumeration of your non-public URLs, use the **Forced browsing protection** control.
* To prevent enumeration of any parameters you can use the **Enumeration attack protection** control (this is all-in-one solution).
* If you want to specifically highlight the attempts to get valid passwords by trying variants, use the **Brute force protection** control.
* If you want to specifically highlight the attempts to enumerate valid user or object ID - the **BOLA protection** control.

!!! info "Predecessors"
    Mitigation controls are sophisticated tools available in the [Advanced API Security](../about-wallarm/subscription-plans.md#core-subscription-plans) subscription. In [Cloud Native WAAP](../about-wallarm/subscription-plans.md#core-subscription-plans) subscription, [brute force protection](../admin-en/configuration-guides/protecting-against-bruteforce.md), [forced browsing protection](../admin-en/configuration-guides/protecting-against-forcedbrowsing.md), and [BOLA protection](../admin-en/configuration-guides/protecting-against-bola-trigger.md) is configured with triggers.

## Default protection

Wallarm provides [default](../about-wallarm/mitigation-controls-overview.md#default-controls)  mitigation controls for enumeration protection. You can duplicate or edit default controls or disable them.

<!--You can **reset default control to its default configuration** at any time.-->

--8<-- "../include/mc-subject-to-change.md"

### Brute force

**Brute force protection** [default](#default-protection) mitigation controls provide generic configuration to detect attempts of enumeration of passwords, OTPs, and authentication codes and enabled for all traffic in the `Monitoring` [mode](../about-wallarm/mitigation-controls-overview.md#mitigation-mode).

To review brute force default controls, in Wallarm Console → **Security Controls** → **Mitigation Controls**, in **Brute force protection** section check controls with the `Default` label.

Editing allows you to customize a default control based on the specific needs of the application, traffic patterns, or business context. For example, you can adjust thresholds.

### BOLA

**BOLA protection** [default](#default-protection) mitigation controls provide generic configuration to detect attempts of enumeration of user IDs, object IDs, and filenames, and enabled for all traffic in the `Monitoring` [mode](../about-wallarm/mitigation-controls-overview.md#mitigation-mode).

To review BOLA default controls, in Wallarm Console → **Security Controls** → **Mitigation Controls**, in **BOLA protection** section check controls with the `Default` label.

Editing allows you to customize a default control based on the specific needs of the application, traffic patterns, or business context. For example, you can adjust thresholds or parameters tracked for enumeration.

### Generic enumeration

**Enumeration attack protection** [default](#default-protection) mitigation controls provide generic configuration to detect attempts of enumeration: 

* User/email enumeration
* SSRF (Server-Side Request Forgery) enumeration
* User-agent rotation

It is enabled for all traffic in the `Monitoring` [mode](../about-wallarm/mitigation-controls-overview.md#mitigation-mode).

To review generic enumeration default controls, in Wallarm Console → **Security Controls** → **Mitigation Controls**, in **Enumeration attack protection** section check controls with the `Default` label.

Editing allows you to customize a default control based on the specific needs of the application, traffic patterns, or business context. For example, you can adjust thresholds or parameters tracked for enumeration.

### Forced browsing

**Forced browsing protection** [default](#default-protection) mitigation controls provide generic configuration to detect attempts of enumeration of your non-public URLs, and enabled for all traffic in the `Monitoring` [mode](../about-wallarm/mitigation-controls-overview.md#mitigation-mode).

To review forced browsing default controls, in Wallarm Console → **Security Controls** → **Mitigation Controls**, in **Forced browsing protection** section check controls with the `Default` label.

Editing allows you to customize a default control based on the specific needs of the application, traffic patterns, or business context. For example, you can adjust thresholds or **Scope**.

## Creating and applying mitigation control

To create and apply a new mitigation control:

1. Proceed to Wallarm Console → **Mitigation Controls**.
1. Click **Add control**.
1. In the **Add control** dialog, select the type of enumeration control you want to create:

  * **Brute force protection**
  * **BOLA protection**
  * **Forced browsing protection**
  * Generic **Enumeration attack protection**

    ![Creating mitigation control](../images/user-guides/mitigation-controls/mc-create.png)

1. [Configure](#configuration) your control.
1. Click **Add**. The created control is displayed in the list. It immediately goes into action and performs in accordance with the selected **Mitigation mode**.

    You can temporarily turn off the control right after creation or at any moment later using the **On/Off** switcher.

## Configuration

Configure enumeration protection fulfilling the following steps:

* Define **Scope** to apply control to (endpoints, only specific requests).
* Select **Enumerated parameters** - ones to be tracked for enumeration attempts.
* Set **Enumeration threshold** - control will act if threshold is exceeded.
* If scope does not cover all your needs, set **Scope filters**.
* Set action in **Mitigation mode**.

Note that you can use [regular expressions](#regular-expressions) to set scope and advanced conditions and select parameters tracked for enumeration.

### Scope

**Scope** defines which requests the control applies to (based on URI and other parameters). It’s configured the same way as request conditions in rules. See details [here](../user-guides/rules/rules.md#configuring).

If you leave the **Scope** section blank, mitigation control is applied to **all traffic** and **all applications**; such controls are inherited by all [branches](../about-wallarm/mitigation-controls-overview.md#mitigation-control-branches).

### Scope filters 

If [Scope](#scope) does not cover all your needs, you can define other conditions that requests must meet to be covered by the protection mechanism.

As conditions, you can use values or value patters of:

* Built-in parameters of requests - elements of meta information presented in each request handled by Wallarm filtering node.
* **Session context parameters** - quickly select parameters from the list of ones, that were [defined as important](../api-sessions/setup.md#session-context) in **API Sessions**. Use the **Add custom** option in this section to add as filters the parameters that are currently not presented in **API Sessions**. If you do so, these parameters will be added to **API Sessions**' context parameters as well (hidden, meaning you will see these parameters in session details if they are presented in requests, but you will not see them in API Session [context parameter configuration](../api-sessions/setup.md#session-context)).

!!! info "Performance note"
    As **Scope** settings are less demanding from the productivity perspective, it is always recommended to use them if it is enough for your goals, and only use **Scope filters** for the complex conditioning.

### Enumerated parameters

In the **Enumerated parameters** section, you need to select parameters that will be monitored for enumeration. Select set of parameters to be monitored via exact or or [regex](#regular-expressions) match (only one approach can be used within single mitigation control).

For exact match, you can use the **Add custom** option to add as tracked for enumeration the parameters that are currently [not presented](../api-sessions/setup.md#session-context) in **API Sessions**. If you do so, these parameters will be added to **API Sessions**' context parameters as well (hidden, meaning you will see these parameters in session details if they are presented in requests, but you will not see them in API Session [context parameter configuration](../api-sessions/setup.md#session-context)).

If for regex you specify both **Filter by parameter name** and **Filter by parameter value**, they combine (`AND` operator), for example `(?i)id` for name and `\d*` for value will catch the `userId` parameter but only count requests having combination of digits as a parameter values.

When some request meets [scope](#scope) and [advanced filters](#scope-filters) and **contains** unique value for the parameter monitored for enumeration, this parameter's counter gets `+1`.

### Enumeration threshold

**Brute force, BOLA and generic enumeration protection**

These kinds of protection count the number of unique values seen for each [enumerated parameter](#enumerated-parameters) within a specified timeframe. Each parameter listed in the **Enumerated parameters** section is tracked independently.

Once threshold is reached by any of parameters, Wallarm performs action in accordance with the [Mitigation mode](#mitigation-mode).

**Forced browsing protection**

This protection counts the number of unique endpoints accessed in a configured timeframe (in seconds). Once threshold is reached, Wallarm performs action in accordance with the [Mitigation mode](#mitigation-mode).

### Mitigation mode

When any of the counters exceeds the threshold, the selected action is performed:

* **Monitoring** - the attack is registered, requests that are the part of this attack are marked in [API Sessions](../api-sessions/overview.md) as belonging to `Brute force`, `Forced browsing`, `BOLA` or generic `Enum` attack but the requests are not blocked.
* **Blocking** → **Block IP address** - the attack is registered, requests that are the part of this attack are marked in API Sessions as belonging to this attack, all source IPs of these requests are placed into [IP Denylist](../user-guides/ip-lists/overview.md) for the selected period of time.
* **Blocking** → **Block session** - the attack is registered, the session that requests belong to is placed into [Session Denylist](../api-sessions/blocking.md#blocking-sessions) for the selected period of time.

### Regular expressions

The **Scope** section uses [PIRE](../user-guides/rules/rules.md#condition-type-regex) regular expression library, while advanced conditions use [PCRE](https://www.pcre.org/). Use the following operators to involve regular expression:

| Operator | Description |
| --- | --- |
| ~ (Aa)  | Find something by case insensitive regexp. |
| !~ (Aa) | Exclude something by case insensitive regexp. |
| ~       | Find something by case sensitive regexp. |
| !~      | Exclude something by case sensitive regexp. |

## Example

Let us say your e-commerce `E-APPC` application stores information about each user's orders under `/users/*/orders`. You want to prevent malicious actors from getting the list of IDs of that orders. Such list can be obtained via a script trying different combinations of digits. To prevent this, for routes storing orders under each user account, you can set a counter `more than 2 unique values` `in minute` - if exceeded, the activity should be marked as attempt to enumerate object's (user order's) IDs (BOLA attack) and source IP should be blocked for 1 hour.

To achieve that, configure the **BOLA protection** mitigation control as displayed on the screenshot:

![BOLA protection mitigation control - example](../images/user-guides/mitigation-controls/mc-bola-example-01.png)

In this example, the `\d*` regex in parameter values stands for `zero or more digits` - the attempt to enumerate object ID composed of digits.

<!-- ## Testing

To test the mitigation control described in the [Example](#example) section, TBD. -->

## Viewing detected attacks

When enumeration attacks are detected or blocked in accordance with the [mitigation mode](#mitigation-mode), they are displayed in the [API Sessions](../api-sessions/exploring.md) section:

![Enumeration attack (brute force) in API Sessions](../images/user-guides/mitigation-controls/mc-found-attack-in-api-sessions.png)

You can find sessions with corresponding attack types using the **Attack** filter; also, if necessary, filter inside session details to see only requests related to the enumeration attack.

Note that enumeration mitigation controls described in this article base their traffic analysis and corresponding actions entirely on [API sessions](../api-sessions/overview.md) which significantly improve their work: if previously you had several nodes and, for example, a brute force [rule](../user-guides/rules/rules.md), your network load balancer could separate attack requests into different nodes and for each node the brute force counter worked separately. This could lead to missing some brute force attacks. The improved approach of mitigation control in this example is that it relies on session, no matter which node the traffic went through.

Because of that, the attacks found by these mitigation controls are displayed exclusively in the **API Sessions** section (and not displayed in the [**Attacks**](../user-guides/events/check-attack.md) section).
