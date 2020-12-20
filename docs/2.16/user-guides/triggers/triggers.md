# Working with triggers

## What are triggers

Triggers are tools that are used to set up custom notifications and reactions to events. Using triggers, you can:

* Receive alerts on major events via the tools you use for your day-to-day workflow, for example via corporate messengers or incident management systems.
* Block IP addresses from which a certain number of requests or attack vectors were sent.
* Identify brute‑force and dirbust attacks by the number of requests sent to the application addresses.

You can configure all the trigger components:

* **Condition**: system event to be notified about. For example: getting a certain amount of attacks, blacklisted IP address, and new user added to the account.
* **Filters**: condition details. For example: attack types.
* **Reaction**: action that should be performed if the specified condition and filters are met. For example: sending the notification to Slack or another system configured as the [integration](../settings/integrations/integrations-intro.md), blocking IP address, or marking requests as the brute‑force attack.

Triggers are configured in the **Triggers** section of the Wallarm Console. The section is available only for users with the **Administrator** [role](../settings/users.md).

![!Section to configure triggers](../../images/user-guides/triggers/triggers-section.png)

!!! info "Default trigger"
    The trigger **Block IPs with high count of attack vectors** is created for all clients by default.

    [More details about default trigger and other trigger examples →](trigger-examples.md)

## Creating triggers

1. Click the **Create trigger** button.
2. [Choose](#step-1-choosing-a-condition) conditions.
3. [Add](#step-2-adding-filters) filters.
4. [Add](#step-3-adding-reactions) reactions.
5. [Save](#step-4-saving-the-trigger) the trigger.

### Step 1: Choosing a condition

A condition is a system event to be notified about. The following conditions are available for notification:

* Number of requests
* Number of [attack vectors](../../glossary-en.md#attack-vector)
* Number of [attacks](../../glossary-en.md#attack)
* Number of [hits](../../glossary-en.md#hit)
* Number of incidents
* Blacklisted IP
* User added

![!Available conditions](../../images/user-guides/triggers/trigger-conditions.png)

Choose a condition in the Wallarm Console interface and set the lower threshold for the reaction, if the setting is available.

### Step 2: Adding filters

Filters are used for condition detailing. For example, you can set up reactions to attacks of certain types, such as brute-force attacks, SQL injections and others.

The following filters are available:

* **URL** (only for the number of requests): full URL to which the request was sent. URL format is `host:port/path` for any `port` value. For example: `example.com:80/login` or `255.255.255.255:80/login`.

    !!! warning "Compatibility with other filters"
        This filter can be used with all available filters except **Counter name**.
* **Counter name** (only for the number of requests): counter name created in the [rule defining a counter](../rules/define-counters.md). More details about this filter usage are described in the [trigger example](trigger-examples.md#mark-requests-as-bruteforce-or-dirbust-attack-if-31-or-more-requests-were-sent-to-the-protected-resource).

    !!! warning "Compatibility with other filters"
        This filter can be used with all available filters except **URL**.
* **Type** is a [type](../../attacks-vulns-list.md) of attack detected in the request or a type of vulnerability the request is directed to.
* **Application** is the [application](../settings/applications.md) that receives the request or in which an incident is detected.
* **IP** is the IP address from which the request is sent.
* **Domain** is the domain that receives the request or in which an incident is detected.
* **Response status** is the response code returned to the request.
* **Target** is an application architecture part that the attack is directed at or in which the incident is detected. It can take the following values: `Server`, `Client`, `Database`.
* **User's role** is the role of the added user. It can take the following values: `Deploy`, `Analyst`, `Admin`.

Choose one or more filters in the Wallarm Console interface and set values for them.

![!Available filters](../../images/user-guides/triggers/trigger-filters.png)

### Step 3: Adding reactions

A reaction is an action that should be performed if the specified condition and filters are met. The set of available reactions depends on the selected condition. Reactions can be of the following types:

* Mark the requests as brute‑force or forced browsing (dirbust) attack. Requests will be marked as attacks in the events list but will not be blocked. To block requests, you can add an additional reaction: blacklist IP address.
* Add IP to the blacklist.
* Send a notification to the messenger, SIEM system or Webhook URL configured in the [integrations](../settings/integrations/integrations-intro.md).

Choose one or more reactions in the Wallarm Console interface. Reactions available for the condition are located at **Number of attacks**:

![!Choosing an integration](../../images/user-guides/triggers/select-integration.png)

### Step 4: Saving the trigger

1. Click the **Create** button in the trigger creation model window.
2. Specify the trigger's name and description (if required) and click the **Done** button.

If the trigger name and description are not specified, then the trigger is created with the name `New trigger by <username>, <creation_date>` and an empty description.

## Disabling and deleting triggers

* To temporarily stop sending notifications and reactions to events, you can disable the trigger. A disabled trigger will be displayed in the lists with **All** and **Disabled** triggers. To re‑enable sending notifications and reactions to events, the **Enable** option is used.
* To permanently stop sending notifications and reactions to events, you can delete the trigger. Deleting a trigger cannot be undone. The trigger will be permanently removed from the trigger list.

To disable or delete the trigger, please select an appropriate option from the trigger menu and confirm the action if required.

![!Disabling a trigger](../../images/user-guides/triggers/disable-delete-trigger.png)

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/ODHh-die9tY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>
