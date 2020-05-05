# Slack Notifications

You can set up Wallarm to send notifications to your Slack channel.

Notifications can be set up for the following events:

--8<-- "../include/integrations/events-for-integrations.md"

## Setting up Notifications

1. Open the **Settings** → **Integrations** tab.
2. Click the **Slack** block or click the **Add integration** button and choose **Slack**.

      ![!Adding integration via the button](../../../images/user-guides/settings/add-integration-button.png)
3. Go to the [WebHooks](https://my.slack.com/services/new/incoming-webhook/) page.
4. Select the Slack channel that will receive notifications. Click **Add Incoming WebHooks integration**.
5. Copy the link and put it in Wallarm into the **WebHook link** field.
6. Enter the integration name and select the event types you want to be notified of.
7. Click **Create**.

## Disabling Notifications

--8<-- "../include/integrations/disable-integration.md"

## Removing Integration

--8<-- "../include/integrations/remove-integration.md"

!!! info "See also"
    * [Email reports and notifications](email.md)
    * [Telegram reports and notifications](telegram.md)
    * [OpsGenie notifications](opsgenie.md)
    * [InsightConnect notifications](insightconnect.md)
    * [PagerDuty notifications](pagerduty.md)
    * [Splunk notifications](splunk.md)
    * [Sumo Logic notifications](sumologic.md)
