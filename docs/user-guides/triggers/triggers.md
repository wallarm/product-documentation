# What are Triggers

Triggers is a tool to set up custom notifications and reactions to events. Using triggers, you can receive alerts on major events via tools you use for your day-to-day workflow, for example via corporate messengers or incident management systems.

To reduce the amount of noise, you can also configure the parameters of events to be notified about. The following events are available for setup:
* [attacks](../../glossary-en.md#attack),
* [incidents](../../glossary-en.md#security-incident),
* [hits](../../glossary-en.md#hit),
* users added to the account.

To receive notifications an reports, you can use Slack, email, Sumo Logic and other [integrations](../settings/integrations/integrations-intro.md).

**Trigger Examples**

* Send the notification to Slack if at least one brute-force attack was detected in a second

    ![!Example of a trigger sending the notification to Slack](../../images/user-guides/triggers/trigger-example1.png)

* Send notifications to Slack and by email if the *Analyst* or *Admin* user was added to the account

    ![!Example of a trigger sending the notification to Slack and by email](../../images/user-guides/triggers/trigger-example2.png)

* Send the data to Splunk if at least one incident with application server or database was detected in a second

    ![!Example of a trigger sending the data to Splunk](../../images/user-guides/triggers/trigger-example3.png)

!!! info "See also"
    * [Creating Triggers](create-trigger.md)
    * [Disabling Triggers](disable-trigger.md)
    * [Deleting Triggers](delete-trigger.md)
