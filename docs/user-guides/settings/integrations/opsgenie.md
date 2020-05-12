# OpsGenie Notifications

You can set up Wallarm to send notifications to OpsGenie for the following events:

* [Vulnerability](../../../glossary-en.md#vulnerability) detected
* [Hit](../../../glossary-en.md#hit) detected

## Setting up Notifications

1. Add new **API integration** in OpsGenie Dashboard.
2. Copy the API key that was generated upon integration creation in OpsGenie to your clipboard.
3. Go to your Wallarm account → **Settings** → **Integrations** in the [EU](https://my.wallarm.com/settings/integrations/) or [US](https://us1.my.wallarm.com/settings/integrations/) cloud.
4. Click the **OpsGenie** block or click the **Add integration** button and choose **OpsGenie**.

    ![!Adding integration via the button](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)
5. Paste the API key that you copied before into the **API key** field.
6. Enter the integration name and select the event types you want to be notified of.
7. Click **Create**.

## Disabling Notifications

--8<-- "../include/integrations/disable-integration.md"

## Removing Integration

--8<-- "../include/integrations/remove-integration.md"

!!! info "See also"
    * [Email reports and notifications](email.md)
    * [Slack notifications](slack.md)
    * [Telegram reports and notifications](telegram.md)
    * [InsightConnect notifications](insightconnect.md)
    * [PagerDuty notifications](pagerduty.md)
    * [Splunk notifications](splunk.md)
    * [Sumo Logic notifications](sumologic.md)