### Step 1: Choosing a condition

The following conditions are available for notification:

* Number of [attacks](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) or incidents per time interval (day, hour, etc.) exceeds the set number

    !!! info "What is not counted"
        * For attacks: 
            * The experimental attacks based on the [custom regular expressions](../../../user-guides/rules/regex-rule.md).
        * For hits:
            * The experimental hits based on the [custom regular expressions](../../../user-guides/rules/regex-rule.md).
            * Hits not saved in the [sample](../../events/grouping-sampling.md/#sampling-of-hits).

* Denylisted IP
* [Changes in API](../../about-wallarm/api-discovery.md#tracking-changes-in-api)
* User added

### Step 2: Adding filters

Filters are used for condition detailing. The following filters are available:

* **Type** is a [type](../../attacks-vulns-list.md) of attack detected in the request or a type of vulnerability the request is directed to.
* **Application** is the [application](../settings/applications.md) that receives the request or in which an incident is detected.
* **IP** is an IP address from which the request is sent.

    The filter expects only single IPs, it does not allow subnets, locations and source types.
* **Domain** is the domain that receives the request or in which an incident is detected.
* **Response status** is the response code returned to the request.
* **Target** is an application architecture part that the attack is directed at or in which the incident is detected. It can take the following values: `Server`, `Client`, `Database`.

Choose one or more filters in the Wallarm Console interface and set values for them.

### Step 3: Selecting integration

At this step you select the integration through which the selected alert should be sent. You can select several integrations simultaneously.

![Choosing an integration](../../images/user-guides/triggers/select-integration.png)

### Step 4: Saving the trigger

1. Click the **Create** button in the trigger creation modal dialog.
2. Optionally, specify the trigger's name and description and click the **Done** button.

If the trigger name and description are not specified, then the trigger is created with the name `New trigger by <username>, <creation_date>` and an empty description.