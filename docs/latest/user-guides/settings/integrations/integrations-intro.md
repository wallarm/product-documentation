[integration-pane-img]:         ../../../images/user-guides/settings/integrations/integration-panel.png

[email-notifications]:          ./email.md
[slack-notifications]:          ./slack.md
[telegram-notifications]:       ./telegram.md
[ms-teams-notifications]:       ./microsoft-teams.md
[opsgenie-notifications]:       ./opsgenie.md
[insightconnect-notifications]: ./insightconnect.md
[sentinel-notifications]:       ./azure-sentinel.md
[pagerduty-notifications]:      ./pagerduty.md
[jira-notifications]:           ./jira.md
[servicenow-notifications]:     ./servicenow.md
[splunk-notifications]:         ./splunk.md
[sumologic-notifications]:      ./sumologic.md
[datadog-notifications]:        ./datadog.md
[fluentd-notifications]:        ./fluentd.md
[logstash-notifications]:       ./logstash.md
[aws-s3-notifications]:         ./amazon-s3.md
[webhook-notifications]:        ./webhook.md
[account]:                      ../account.md

# Integrations Overview

Integrate Wallarm with different systems to get scheduled reports and instant notifications through them:

* Scheduled reports can be sent on a daily, weekly, or monthly basis. Reports include detailed information about vulnerabilities, attacks, and incidents detected in your system over the selected period.
* On an hourly basis, you can get a notification with the number of requests processed during the previous hour.
* You can receive instant notification for each detected vulnerability, hit, system-related event, and scope change.

## Integrate with ...

A number of systems are available for integration with Wallarm

<link rel="stylesheet" href="/supported-platforms.css?v=1" />

### Email and messengers

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../email/">
            <img class="non-zoomable" src="../../../../images/integration-icons/email.svg" />
            <h3>Email</h3>
            <p>Get notifications to the email indicated upon registration and additional emails</p>
        </a>
        <a class="do-card" href="../slack/">
            <img class="non-zoomable" src="../../../../images/integration-icons/slack.png" />
            <h3>Slack</h3>
            <p>Send notifications to the selected Slack channel</p>
        </a>
        <a class="do-card" href="../telegram/">
            <img class="non-zoomable" src="../../../../images/integration-icons/telegram.png" />
            <h3>Telegram</h3>
            <p>Add Wallarm bot to Telegram and send notifications to it</p>
        </a>
        <a class="do-card" href="../microsoft-teams/">
            <img class="non-zoomable" src="../../../../images/integration-icons/msteams.svg" />
            <h3>Microsoft Teams</h3>
            <p>Send notifications to the selected Microsoft Teams channel</p>
        </a>
    </div>
</div>

### Incident and task management systems

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../opsigenie/">
            <img class="non-zoomable" src="../../../../images/integration-icons/opsigenie.svg" />
            <h3>Opsigenie</h3>
            <p>Integrate via Opsigenie API</p>
        </a>
        <a class="do-card" href="../pagerduty/">
            <img class="non-zoomable" src="../../../../images/integration-icons/pagerduty.png" />
            <h3>PagerDuty</h3>
            <p>Send incidents to PagerDuty</p>
        </a>
        <a class="do-card" href="../jira/">
            <img class="non-zoomable" src="../../../../images/integration-icons/jira.png" />
            <h3>Jira</h3>
            <p>Set up Wallarm to create issues in Jira</p>
        </a>
        <a class="do-card" href="../servicenow/">
            <img class="non-zoomable" src="../../../../images/integration-icons/servicenow.svg" />
            <h3>ServiceNow</h3>
            <p>Set up Wallarm to create trouble tickets in ServiceNow</p>
        </a>
    </div>
</div>

### SIEM and SOAR systems

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../sumologic/">
            <img class="non-zoomable" src="../../../../images/integration-icons/sumologic.svg" />
            <h3>Sumo Logic</h3>
            <p>Send messages to Sumo Logic</p>
        </a>
        <a class="do-card" href="../splunk/">
            <img class="non-zoomable" src="../../../../images/integration-icons/splunk.png" />
            <h3>Splunk</h3>
            <p>Send alerts to Splunk</p>
        </a>
        <a class="do-card" href="../insightconnect/">
            <img class="non-zoomable" src="../../../../images/integration-icons/insightconnect.svg" />
            <h3>InsightConnect</h3>
            <p>Send notifications to InsightConnect</p>
        </a>
        <a class="do-card" href="../azure-sentinel/">
            <img class="non-zoomable" src="../../../../images/integration-icons/mssentinel.png" />
            <h3>Microsoft Sentinel</h3>
            <p>Log events in Microsoft Azure Sentinel</p>
        </a>
    </div>
</div>

### Log management systems

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../datadog/">
            <img class="non-zoomable" src="../../../../images/integration-icons/datadog.png" />
            <h3>Datadog</h3>
            <p>Send events to Datadog Logs service</p>
        </a>
    </div>
</div>

### Data collectors

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../fluentd/">
            <img class="non-zoomable" src="../../../../images/integration-icons/fluentd.png" />
            <h3>Fluentd</h3>
            <p>Send notifications of detected events to Fluentd</p>
        </a>
        <a class="do-card" href="../logstash/">
            <img class="non-zoomable" src="../../../../images/integration-icons/logstash.png" />
            <h3>Logstash</h3>
            <p>Send notifications of detected events to Logstash</p>
        </a>
        <a class="do-card" href="../amazon-s3/">
            <img class="non-zoomable" src="../../../../images/integration-icons/awss3.svg" />
            <h3>AWS S3</h3>
            <p>Set up Wallarm to send files with the information about detected hits to your Amazon S3 bucket</p>
        </a>
    </div>
</div>

### Universal integrations

<div class="do-section">
    <div class="do-main">
        <a class="do-card" href="../webhook/">
            <img class="non-zoomable" src="../../../../images/integration-icons/webhook.svg" />
            <h3>Webhook</h3>
            <p>Send instant notifications to any system that accepts incoming webhooks via HTTPS protocol</p>
        </a>
    </div>
</div>

### Monitoring systems

Each Wallarm node is distributed with the `collectd` service that [collects metrics on the processed traffic](../../../admin-en/monitoring/intro.md). Using the `collectd` utilities and plugins, you can send metrics to third-party monitoring systems and databases, e.g.:

* [InfluxDB](../../../admin-en/monitoring/network-plugin-influxdb.md) with further visualization in Grafana or another system
* [Graphite](../../../admin-en/monitoring/write-plugin-graphite.md) with further visualization in Grafana or another system
* [Nagios](../../../admin-en/monitoring/collectd-nagios.md)
* [Zabbix](../../../admin-en/monitoring/collectd-zabbix.md)

Configuration for sending metrics to third-party monitoring systems and databases is performed on the node side. The listed systems are not displayed in the Wallarm Console UI.

### Other systems

If there is no system you are looking for, [let us know](mailto:support@wallarm.com). We will check the technical possibility of integration with the requested system and contact you.

## Manage integrations

Use the **Integrations** section of Wallarm Console.

!!! info "Administrator access"
    The integration setup is available only for users with the **Administrator** role.

![Integrations](../../../images/user-guides/settings/integrations/integration-panel.png)

* Click integration card to set or change parameters, test before saving, temporarily disable and then re-enable the integration.
* The number of integrations with one system is not limited. For example: to send security reports to 3 Slack channels, you can create 3 different integrations with Slack.

--8<-- "../include/cloud-ip-by-request.md"

## Common and additional alerts

Common events to trigger notifications are set in the integration dialog:

* System related:
    * [User](../../../user-guides/settings/users.md) changes (newly created, deleted, role change)
    * [Integration](integrations-intro.md) changes (disabled, deleted)
    * [Application](../../../user-guides/settings/applications.md) changes (newly created, deleted, name change)
* [Vulnerabilities](../../../glossary-en.md#vulnerability) detected, all by default or only for the selected risk level(s):
    * High risk
    * Medium risk
    * Low risk
* [Rules](../../../user-guides/rules/intro.md) and [triggers](../../../user-guides/triggers/triggers.md) changed (creating, updating, or deleting the rule or trigger)

    !!! info "Email integrations"
        Rule and trigger events are not available in email integrations.

* [Scope (exposed assets)](../../scanner.md) changed: updates in hosts, services, and domains

For your integration, you can add and fine tune the additional alerts [via Wallarm triggers](../../../user-guides/triggers/triggers.md).

## Unavailability of integrated systems and incorrect integration parameters

Notifications to the system are sent via requests. If the system is unavailable or integration parameters are configured incorrectly, the error code is returned in the response to the request.

If the system responds to Wallarm request with any code other than `2xx`, Wallarm resends the request with the interval until the `2xx` code is received:

* The first cycle intervals: 1, 3, 5, 10, 10 seconds
* The second cycle intervals: 0, 1, 3, 5, 30 seconds
* The third cycle intervals:  1, 1, 3, 5, 10, 30 minutes

If the percentage of unsuccessful requests reaches 60% in 12 hours, the integration is automatically disabled. If you receive system notifications, messages about automatically disabled integration will be sent to the [configured system](#integration-types).

You can identify incorrectness of integration parameters by **testing** the integration. The appropriate button is available in the integration setup window. If the test request failed, Wallarm Console would display the appropriate message.

<!-- ## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div> -->

<script src="/supported-platforms.js?v=1"></script>
