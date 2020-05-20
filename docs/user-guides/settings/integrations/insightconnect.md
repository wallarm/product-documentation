# InsightConnect Notifications

You can set up Wallarm to send notifications to InsightConnect for the following events:

--8<-- "../include/integrations/advanced-events-for-integrations.md"

## Setting up Notifications

First, generate and copy an API key as follows:

1. Open the InsightConnect's UI → **Settings** → **API Keys** page and click **New User Key**, enter an API key name (e.g. `Wallarm API`) and click **Generate**.
2. Copy the generated API key.
3. Go to your Wallarm account → **Settings** → **Integrations** in the [EU](https://my.wallarm.com/settings/integrations/) or [US](https://us1.my.wallarm.com/settings/integrations/) cloud and click **insightConnect**.
4. Paste the API key that you copied before into the **API Key** field.

Secondly, generate and copy an API URL as follows:

1. Go back to the InsightConnect's UI, open the **Automation** → **Workflows** page and create a new page for the Wallarm notification.
2. When asked to choose a trigger, choose the **API Trigger**.
3. Copy the generated URL.
4. Go back to **insightConnect** configuration on your Wallarm account and paste the API URL that you copied before into the **API URL** field.

Thirdly, finish the setup:

1. Input **Integration name**.
2. Select the event types you want to be notified of.
3. Click **Create** to save the integration.

![!Adding integration via the button](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

## Disabling Notifications

--8<-- "../include/integrations/disable-integration.md"

## Removing Integration

--8<-- "../include/integrations/remove-integration.md"

!!! info "See also"
    * [Email reports and notifications](email.md)
    * [Slack notifications](slack.md)
    * [Telegram reports and notifications](telegram.md)
    * [OpsGenie notifications](opsgenie.md)
    * [PagerDuty notifications](pagerduty.md)
    * [Splunk notifications](splunk.md)
    * [Sumo Logic notifications](sumologic.md)
