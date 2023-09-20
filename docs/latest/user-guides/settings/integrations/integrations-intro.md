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
    <div class="do-nested" data-for="email-and-messengers">
        <a class="do-card" href="email">
            <img class="non-zoomable" src="../../../../images/platform-icons/aws.svg" />
            <h3>Email</h3>
            <p>Intro text TBD</p>
        </a>
        <a class="do-card" href="slack-notifications">
            <h3>Slack</h3>
            <p>Intro text TBD</p>
        </a>
    </div>
</div>

### Old landing

<div class="do-section">
    <div class="do-main">
        <div id="email-and-messengers" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Email and messengers</h3>
            <p>Intro paragraph TBD</p>
        </div>
        <div id="incident-and-task-management-systems" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Incident and task management systems</h3>
            <p>Intro paragraph TBD</p>
        </div>
        <div id="siem-and-SOAR-systems" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>SIEM and SOAR systems</h3>
            <p>Intro paragraph TBD</p>
        </div>
        <div id="log-management-systems" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Log management systems</h3>
            <p>Intro paragraph TBD</p>
        </div>
        <div id="data-collectors" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Data collectors</h3>
            <p>Intro paragraph TBD</p>
        </div>
        <div id="universal-systems" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Universal systems</h3>
            <p>Intro paragraph TBD/p>
        </div>
        <div id="monitoring-systems" class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Monitoring systems</h3>
            <p>Intro paragraph TBD/p>
        </div>
    </div>
    <div class="do-nested" data-for="email-and-messengers">
        <div class="do-card">
            <img class="non-zoomable" src="../../images/platform-icons/aws.svg" />
            <h3>Email and messengers</h3>
            <p>Intro paragraph TBD</p>
        </div>
        <a class="do-card" href="../email/">
            <h3>Email</h3>
            <p>Intro text TBD</p>
        </a>
        <a class="do-card" href="slack-notifications">
            <h3>Slack</h3>
            <p>Intro text TBD</p>
        </a>
    </div>
</div>

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
