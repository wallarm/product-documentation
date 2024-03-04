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

The **Integrations** section of Wallarm Console allows you to integrate with different systems to get scheduled reports and instant notifications through them:

* Scheduled reports can be sent on a daily, weekly, or monthly basis. Reports include detailed information about vulnerabilities, attacks, and incidents detected in your system over the selected period.
* On an hourly basis, you can get a notification with the number of requests processed during the previous hour.
* You can receive instant notification for each detected vulnerability, hit, system-related event, and scope change.

!!! info "Administrator access"
    The integration setup is available only for users with the **Administrator** role.

## Integration types

The systems available for integration are grouped by types as follows:

![Integrations Overview][integration-pane-img]

### Email and messengers

* **Personal email** — the reports and notifications that are sent to the email indicated upon registration. You can also configure these notifications in [**Settings** → **Profile**][account].
* [Email report][email-notifications]
* [Slack][slack-notifications]
* [Telegram][telegram-notifications]
* [Microsoft Teams][ms-teams-notifications]

### Incident and task management systems

* [Opsgenie][opsgenie-notifications]
* [PagerDuty][pagerduty-notifications]
* [Jira][jira-notifications]
* [ServiceNow][servicenow-notifications]

### SIEM and SOAR systems

* [Sumo Logic][sumologic-notifications]
* [Splunk][splunk-notifications]
* [InsightConnect][insightconnect-notifications]
* [Microsoft Sentinel][sentinel-notifications]

### Log management systems

* [Datadog][datadog-notifications]

### Data collectors

* [Fluentd][fluentd-notifications]
* [Logstash][logstash-notifications]
* [AWS S3][aws-s3-notifications]

### Universal systems

* [Webhook][webhook-notifications] to integrate with any system that accepts incoming webhooks via HTTPS protocol, e.g.:
    * With Fluentd configured to forward logs to [IBM QRadar](webhook-examples/fluentd-qradar.md), [Splunk Enterprise](webhook-examples/fluentd-splunk.md), [ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md), [Datadog](webhook-examples/fluentd-logstash-datadog.md)
    * With Logstash configured to forward logs to [IBM QRadar](webhook-examples/logstash-qradar.md), [Splunk Enterprise](webhook-examples/logstash-splunk.md), [ArcSight Logger](webhook-examples/logstash-arcsight-logger.md), [Datadog](webhook-examples/fluentd-logstash-datadog.md)

### Monitoring systems

Each Wallarm node is distributed with the `collectd` service that [collects metrics on the processed traffic](../../../admin-en/monitoring/intro.md). Using the `collectd` utilities and plugins, you can send metrics to third-party monitoring systems and databases, e.g.:

* [InfluxDB](../../../admin-en/monitoring/network-plugin-influxdb.md) with further visualization in Grafana or another system
* [Graphite](../../../admin-en/monitoring/write-plugin-graphite.md) with further visualization in Grafana or another system
* [Nagios](../../../admin-en/monitoring/collectd-nagios.md)
* [Zabbix](../../../admin-en/monitoring/collectd-zabbix.md)

Configuration for sending metrics to third-party monitoring systems and databases is performed on the node side. The listed systems are not displayed in the Wallarm Console UI.

### Other systems

If there is no system you are looking for, [let us know](mailto:support@wallarm.com). We will check the technical possibility of integration with the requested system and contact you.

## Adding an integration

To add a new integration:

* Click the icon of the unconfigured system on the **All** tab, or
* Click the **Add integration** button in the required system group and select the system. Further steps are described in the selected system instructions.

The number of integrations with one system is not limited. For example: to send security reports to 3 Slack channels, you can create 3 different integrations with Slack.

--8<-- "../include/cloud-ip-by-request.md"

!!! info "Advanced notifications setup"
    For advanced notification setup, you can use [triggers](../../triggers/triggers.md).

## Filtering integrations

To filter displayed integrations, you can use the tabs:

* **All** with enabled, disabled, and not yet configured integrations
* **Enabled** with active configured integrations
* **Disabled** with disabled configured integrations

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