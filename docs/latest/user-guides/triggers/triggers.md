# Working with Triggers

Triggers are tools that are used to set up custom notifications and reactions to events. Using triggers, you can provide the following protections measures for your applications and APIs:

* [Protection from multi-attack perpetrators](../../admin-en/configuration-guides/protecting-with-thresholds.md)
* [Brute force protection](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Forced browsing protection](../../admin-en/configuration-guides/protecting-against-forcedbrowsing.md)
* [BOLA protection](../../admin-en/configuration-guides/protecting-against-bola-trigger.md)

Using triggers you can also set up extended alerts for different [integrations](../../user-guides/settings/integrations/integrations-intro.md).

You can configure all the trigger components:

* **Condition**: system event to be notified about. For example: getting a certain amount of attacks, denylisted IP address, and new user added to the account.
* **Filters**: condition details. For example: attack types.
* **Reaction**: action that should be performed if the specified condition and filters are met. For example: sending the notification to Slack or another system configured as the [integration](../settings/integrations/integrations-intro.md), blocking IP address, or marking requests as the brute‑force attack.

Triggers are configured in the **Triggers** section of Wallarm Console. The section is available only for users with the **Administrator** [role](../settings/users.md).

![Section to configure triggers](../../images/user-guides/triggers/triggers-section.png)

## Creating triggers

1. Click the **Create trigger** button.
2. [Choose](#step-1-choosing-a-condition) conditions.
3. [Add](#step-2-adding-filters) filters.
4. [Add](#step-3-adding-reactions) reactions.
5. [Save](#step-4-saving-the-trigger) the trigger.

### Step 1: Choosing a condition

A condition is a system event to be notified about. The following conditions are available for notification:

* [Brute force](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [Forced browsing](../../admin-en/configuration-guides/protecting-against-bruteforce.md)
* [BOLA](../../admin-en/configuration-guides/protecting-against-bola.md)
* [Weak JWT](../../about-wallarm/detecting-vulnerabilities.md#weak-jwts-detection)
* Number of [attack vectors (malicious payloads)](../../glossary-en.md#malicious-payload) (experimental payloads based on [custom regular expressions](../rules/regex-rule.md) are not counted)
* Number of [attacks](../../glossary-en.md#attack) (experimental attacks based on [custom regular expressions](../rules/regex-rule.md) are not counted)
* Number of [hits](../../glossary-en.md#hit) except for:

    * Experimental hits detected based on the [custom regular expression](../rules/regex-rule.md). Non-experimental hits are counted.
    * Hits not saved in the [sample](../events/analyze-attack.md#sampling-of-hits).
* Number of incidents
* Denylisted IP
* [Changes in API inventory](../../api-discovery/overview.md#tracking-changes-in-api)
* Hits from the same IP, except for the ones of the Brute force, Forced browsing, BOLA (IDOR), Resource overlimit, Data bomb and Virtual patch attack types
* User added

![Available conditions](../../images/user-guides/triggers/trigger-conditions.png)

Choose a condition in the Wallarm Console interface and set the lower threshold for the reaction, if the setting is available.

### Step 2: Adding filters

Filters are used for condition detailing. For example, you can set up reactions to attacks of certain types, such as brute-force attacks, SQL injections and others.

The following filters are available:

* **URI** (only for the conditions **Brute force**, **Forced browsing** and **BOLA**): full URI to which the request was sent. URI can be configured via the [URI constructor](../../user-guides/rules/add-rule.md#uri-constructor) or [advanced edit form](../../user-guides/rules/add-rule.md#advanced-edit-form).
* **Type** is a [type](../../attacks-vulns-list.md) of attack detected in the request or a type of vulnerability the request is directed to.
* **Application** is the [application](../settings/applications.md) that receives the request.
* **IP** is an IP address from which the request is sent.

    The filter expects only single IPs, it does not allow subnets, locations and source types.
* **Domain** is the domain that receives the request.
* **Response status** is the response code returned to the request.
* **Target** is an application architecture part that the attack is directed at or in which the incident is detected. It can take the following values: `Server`, `Client`, `Database`.
* **User's role** is the role of the added user. It can take the following values: `Deploy`, `Analyst`, `Admin`.

Choose one or more filters in the Wallarm Console interface and set values for them.

![Available filters](../../images/user-guides/triggers/trigger-filters.png)

### Step 3: Adding reactions

A reaction is an action that should be performed if the specified condition and filters are met. The set of available reactions depends on the selected condition. Reactions can be of the following types:

* [Mark the requests as brute‑force or forced browsing attack](../../admin-en/configuration-guides/protecting-against-bruteforce.md). Requests will be marked as attacks in the events list but will not be blocked. To block requests, you can add an additional reaction: [denylist](../ip-lists/overview.md) IP address.
* [Mark the requests as BOLA attack](../../admin-en/configuration-guides/protecting-against-bola.md). Requests will be marked as attacks in the events list but will not be blocked. To block requests, you can add an additional reaction: [denylist](../ip-lists/overview.md) IP address.
* [Record the JWT vulnerability](../../about-wallarm/detecting-vulnerabilities.md#weak-jwts-detection).
* Add IP to the [denylist](../ip-lists/overview.md).
* Add IP to the [graylist](../ip-lists/overview.md).
* Send a notification to the SIEM system or Webhook URL configured in the [integrations](../settings/integrations/integrations-intro.md).
* Send a notification to the messenger configured in the [integrations](../settings/integrations/integrations-intro.md).

    !!! warning "Notifying about denylisted IPs via the messengers"
        Triggers allow sending notifications on denylisted IPs only to the SIEM systems or Webhook URL. Messengers are not available for the **Denylisted IP** trigger condition.
* [Group next hits into one attack](../../admin-en/configuration-guides/protecting-with-thresholds.md) if the trigger condition is **Hits from the same IP**.

    The [**Mark as false positive**](../events/false-attack.md#mark-an-attack-as-a-false-positive) button and the [active verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) option will be unavailable for these attacks.

Choose one or more reactions in the Wallarm Console interface. Reactions available for the condition are located at **Number of attacks**:

![Choosing an integration](../../images/user-guides/triggers/select-integration.png)

### Step 4: Saving the trigger

1. Click the **Create** button in the trigger creation modal dialog.
2. Specify the trigger's name and description (if required) and click the **Done** button.

If the trigger name and description are not specified, then the trigger is created with the name `New trigger by <username>, <creation_date>` and an empty description.

## Pre-configured triggers (default triggers)

New company accounts are featured by the following pre-configured triggers (default triggers):

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

## Disabling and deleting triggers

* To temporarily stop sending notifications and reactions to events, you can disable the trigger. A disabled trigger will be displayed in the lists with **All** and **Disabled** triggers. To re‑enable sending notifications and reactions to events, the **Enable** option is used.
* To permanently stop sending notifications and reactions to events, you can delete the trigger. Deleting a trigger cannot be undone. The trigger will be permanently removed from the trigger list.

To disable or delete the trigger, please select an appropriate option from the trigger menu and confirm the action if required.

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/ODHh-die9tY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->
