# Sumo Logic Notifications

You can set up Wallarm to send notifications to Sumo Logic for the following events:

--8<-- "../include/integrations/advanced-events-for-integrations.md"

## Setting up Notifications

Perform the following actions in the Sumo Logic interface:

1. Configure a Hosted Collector following the [instructions](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector).
2. Configure an HTTP Logs & Metrics Source following the [instructions](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source).
3. Copy the provided **HTTP Source Address (URL)**.

Perform the following actions in your Wallarm account:

1. Go to your Wallarm account → **Settings** → **Integrations** in the [EU](https://my.wallarm.com/settings/integrations/) or [US](https://us1.my.wallarm.com/settings/integrations/) cloud.
2. Click the **Sumo Logic** block or click the **Add integration** button and choose **Sumo Logic**.

      ![!Adding integration via the button](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)
3. Paste the copied value of HTTP Source Address (URL) to the **HTTP Source Address (URL)** field.
4. Enter the integration name and select the event types you want to be notified of.
5. Click **Create**.

Now notifications for events of the selected types will appear in Sumo Logic.

## Disabling Notifications

--8<-- "../include/integrations/disable-integration.md"

## Removing Integration

--8<-- "../include/integrations/remove-integration.md"

!!! info "See also"
    * [Email reports and notifications](email.md)
    * [Slack notifications](slack.md)
    * [Telegram reports and notifications](telegram.md)
    * [OpsGenie notifications](opsgenie.md)
    * [InsightConnect notifications](insightconnect.md)
    * [PagerDuty notifications](pagerduty.md)
    * [Splunk notifications](splunk.md)
