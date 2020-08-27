# What are Triggers

Triggers are tools that are used to set up custom notifications and reactions to events. Using triggers, you can receive alerts on major events via the tools you use for your day-to-day workflow, for example via corporate messengers or incident management systems.

To reduce the amount of noise, you can also configure the parameters of events to be notified about. The following events are available for setup:

* [Attacks](../../glossary-en.md#attack)
* [Incidents](../../glossary-en.md#security-incident)
* [Hits](../../glossary-en.md#hit)
* Users added to the account

To receive notifications and reports, you can use Slack, email, Sumo Logic and other [integrations](../settings/integrations/integrations-intro.md).

## Trigger examples

* Send a notification to Slack if at least one brute-force attack is detected in one second

    ![!Example of a trigger sending the notification to Slack](../../images/user-guides/triggers/trigger-example1.png)

* Send notifications to Slack and by email if an *Analyst* or *Admin* user is added to the account

    ![!Example of a trigger sending the notification to Slack and by email](../../images/user-guides/triggers/trigger-example2.png)

* Send the data to Splunk if at least one incident with the application server or database is detected in one second

    ![!Example of a trigger sending the data to Splunk](../../images/user-guides/triggers/trigger-example3.png)

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/ODHh-die9tY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>