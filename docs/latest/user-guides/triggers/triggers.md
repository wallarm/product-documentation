# Working with Triggers

Triggers are tools used to set up Wallarm response to different events. Triggers combine a significant number of events the system can react to with a variety of possible reactions. This constructor-like process allows configuring complex behaviors that match your company unique security needs.

Triggers are configured in the **Triggers** section in the [US](https://us1.my.wallarm.com/triggers) or [EU](https://my.wallarm.com/triggers) Cloud. The section is available only for users with the **Administrator** [role](../settings/users.md).

![Section to configure triggers](../../images/user-guides/triggers/triggers-section.png)

## How it works

Each trigger consists of the following components that you can configure:

* **Condition**: an event that Wallarm should react to. For example: getting a certain amount of attacks, denylisted IP address, and new user added to the account.
* [**Filters**](#understanding-filters): the condition details. For example: if condition is "More than 10,000 attacks per day", then set the **Type** filter to "SQLi" and the **Response status** to "200" and for the trigger that will mean "Act if there were more than 10,000 SQLi attacks per day that got the 200 response".
* **Reaction**: an action that should be performed if the specified condition and filters are met. For example: sending the notification to Slack or another system configured as the [integration](../settings/integrations/integrations-intro.md), blocking IP address, or marking requests as the brute‑force attack.

## What you can do with triggers

Using triggers, you can:

* Provide the following protections measures for your applications and APIs:

    * [Protection from multi-attack perpetrators](../../admin-en/configuration-guides/protecting-with-thresholds.md)
    * [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
    * [Forced browsing protection](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
    * [BOLA protection](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)

* Set up extended alerts for different [integrations](../../user-guides/settings/integrations/integrations-intro.md).
* Optimize attacks and incidents representation by [grouping hits](../../user-guides/events/analyze-attack.md#grouping-of-hits).

## Understanding filters

Filters are used for [condition](#how-it-works) detailing. For example, you can set up reactions to attacks of certain types, such as brute-force attacks, SQL injections and others. You can add one or more filters in the Wallarm Console interface and set values for them.

![Available filters](../../images/user-guides/triggers/trigger-filters.png)

The following filters are available:

* **URI** (only for the conditions **Brute force**, **Forced browsing** and **BOLA**): full URI to which the request was sent. URI can be configured via the [URI constructor](../../user-guides/rules/rules.md#uri-constructor) or [advanced edit form](../../user-guides/rules/rules.md#advanced-edit-form).
* **Type** is a [type](../../attacks-vulns-list.md) of attack detected in the request or a type of vulnerability the request is directed to.
* **Application** is the [application](../settings/applications.md) that receives the request.
* **IP** is an IP address from which the request is sent.

    The filter expects only single IPs, it does not allow subnets, locations and source types.
* **Domain** is the domain that receives the request.
* **Response status** is the response code returned to the request.
* **Target** is an application architecture part that the attack is directed at or in which the incident is detected. It can take the following values: `Server`, `Client`, `Database`.
* **User's role** is the role of the added user. It can take the following values: `Deploy`, `Analyst`, `Admin`.

## Tips

* If the trigger name and description are not specified, then the trigger is created with the name `New trigger by <username>, <creation_date>` and an empty description.
* You can choose more than one filter and more than one reaction for your trigger.
* To temporarily stop trigger, you can disable it. A disabled trigger will be displayed in the lists with **All** and **Disabled** triggers. To re‑enable, use the **Enable** option.
* To permanently stop trigger, you can delete it. Deleting a trigger cannot be undone. The trigger will be permanently removed from the trigger list.

## Default triggers

New company accounts are featured by the following default (pre-configured) triggers:

* Group hits originating from the same IP into one attack

    The trigger groups all [hits](../../glossary-en.md#hit) sent from the same IP address into one attack in the event list. This optimizes the event list and enables faster attack analysis.

    This trigger is released when a single IP address originates more than 50 hits within 15 minutes. Only hits sent after exceeding the threshold are grouped into the attack.

    Hits can have different attack types, malicious payloads and URLs. These attack parameters will be marked with the `[multiple]` tag in the event list.

    Due to different parameter values of grouped hits, the [Mark as false positive](../events/false-attack.md#mark-an-attack-as-a-false-positive) button will be unavailable for the whole attack, but you still will be able to mark certain hits as false positives. [Active verification of the attack](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) will also be unavailable.
    
    The hits with the Brute force, Forced browsing, Resource overlimit, Data bomb, or Virtual patch attack types are not considered in this trigger.
* Graylist IP for 1 hour when it originates more than 3 different [malicious payloads](../../glossary-en.md#malicious-payload) within 1 hour

    [Graylist](../ip-lists/overview.md) is a list of suspicious IP addresses processed by the node as follows: if graylisted IP originates malicious requests, the node blocks them while allowing legitimate requests. In contrast to graylist, [denylist](../ip-lists/overview.md) points to IP addresses that are not allowed to reach your applications at all - the node blocks even legitimate traffic produced by denylisted sources. IP graylisting is one of the options aimed at the reduction of [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives).

    The trigger is released in any node filtration mode, so that it will graylist IPs regardless of the node mode.

    However, the node analyzes the graylist only in the **safe blocking** mode. To block malicious requests originating from graylisted IPs, switch the node [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) to safe blocking learning its features first.

    The hits with the Brute force, Forced browsing, Resource overlimit, Data bomb, or Virtual patch attack types are not considered in this trigger.
* Detect weak JWTs

    [JSON Web Token (JWT)](https://jwt.io/) is a popular authentication standard used to exchange data between resources like APIs securely. JWT compromisation is a common aim of attackers as breaking authentication mechanisms provides them full access to web applications and APIs. The weaker JWTs, the higher chance for it to be compromised.

    This trigger enables Wallarm to automatically detect weak JWTs in incoming requests and record corresponding [vulnerabilities](../vulnerabilities.md).

Triggers work on all traffic within a company account by default but you can change any trigger settings.
