[integration-pane-img]:         ../../../images/user-guides/settings/integrations/integration-panel.png
[add-integration-img]:          ../../../images/user-guides/settings/integrations/add-integration-button.png
[disable-button]:               ../../../images/user-guides/settings/integrations/disable-button.png

[email-notifications]:          ./email.md
[slack-notifications]:          ./slack.md
[telegram-notifications]:       ./telegram.md
[ms-teams-notifications]:       ./microsoft-teams.md
[opsgenie-notifications]:       ./opsgenie.md
[insightconnect-notifications]: ./insightconnect.md
[pagerduty-notifications]:      ./pagerduty.md
[splunk-notifications]:         ./splunk.md
[sumologic-notifications]:      ./sumologic.md
[webhook-notifications]:      ./webhook.md
[account]:                      ../account.md

# Integrations Overview

The **Settings** → **Integrations** tab allows you to integrate with different systems to get scheduled reports and instant notifications through them:

* Scheduled reports can be sent on a daily, weekly, or monthly basis. Reports include detailed information about vulnerabilities, attacks, and incidents detected in your system over the selected period.
* Notifications are sent when vulnerabilities, hits, scope changes, or system related events are detected in your system. Notifications include brief details of detected activity.

!!! info "Administrator access"
    The integration setup is available only for users with the **Administrator** role.

## Integration types

The systems available for integration are grouped in the following blocks: **Email and messengers**, **Incident management and SIEM systems** and **Other systems**.

![!Integrations Overview][integration-pane-img]

### Email and messengers

* **Personal email** — the reports and notifications that are sent to the email indicated upon registration. You can also configure these notifications on the [**Profile**][account] tab.
* [Email report][email-notifications]
* [Slack][slack-notifications]
* [Telegram][telegram-notifications]
* [Microsoft Teams][ms-teams-notifications]

### Incident management and SIEM systems

* [Opsgenie][opsgenie-notifications]
* [InsightConnect][insightconnect-notifications]
* [PagerDuty][pagerduty-notifications]
* [Splunk][splunk-notifications]
* [Sumo Logic][sumologic-notifications]

### Other systems

* [Webhook][webhook-notifications] to integrate with any system that accepts incoming webhooks via HTTPS protocol. For example:
    * With Fluentd configured to forward logs to [IBM QRadar](webhook-examples/fluentd-qradar.md), [Splunk Enterprise](webhook-examples/fluentd-splunk.md), [ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
    * With Logstash configured to forward logs to [IBM QRadar](webhook-examples/logstash-qradar.md), [Splunk Enterprise](webhook-examples/logstash-splunk.md), [ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)

## Adding an integration

To add a new integration, click the icon of the unconfigured system on the **All** tab or click the **Add integration** button and select the required system. Further steps are described in the selected system instructions.

![!Adding Integrations][add-integration-img]

The number of integrations with one system is not limited. For example: to send security reports to 3 Slack channels, you can create 3 different integrations with Slack.

## Filtering integrations

To filter displayed integrations, you can use the tabs:

* **All** with enabled, disabled, and not yet configured integrations
* **Enabled** with active configured integrations
* **Disabled** with disabled configured integrations

![!Filtering Integrations][disable-button]

!!! info "Advanced notifications setup"
    For advanced notification setup, you can use [triggers](../../triggers/triggers.md).

## Unavailability of integrated systems and incorrect integration parameters

Notifications to the system are sent via requests. If the system is unavailable or integration parameters are configured incorrectly, the error code is returned in the response to the request.

If the system responds to Wallarm request with any code other than `2xx`, Wallarm resends the request with the interval until the `2xx` code is received:

* The first cycle intervals: 1, 3, 5, 10, 10 seconds
* The second cycle intervals: 0, 1, 3, 5, 30 seconds
* The third cycle intervals:  1, 1, 3, 5, 10, 30 minutes

If the percentage of unsuccessful requests reaches 60% in 12 hours, the integration is automatically disabled. If you receive system notifications, messages about automatically disabled integration will be sent to the [configured system](#integration-types).

You can identify incorrectness of integration parameters by **testing** the integration. The appropriate button is available in the integration setup window. If the test request failed, Wallarm Console would display the appropriate message.

## Demo videos

<div class="video-wrapper">
  <iframe width="1280" height="720" src="https://www.youtube.com/embed/DVfoXYuBy-Y" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>