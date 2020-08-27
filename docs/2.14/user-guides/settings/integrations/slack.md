# Slack

You can set up Wallarm to send notifications to your Slack channel when the following events are triggered:

--8<-- "../include/integrations/events-for-integrations.md"

## Setting up integration

1. Open the **Settings** → **Integrations** tab.
2. Click the **Slack** block or click the **Add integration** button and choose **Slack**.
3. Enter an integration name.
4. Open [Webhook settings in Slack](https://my.slack.com/services/new/incoming-webhook/) and add a new Webhook choosing the channel to post messages to.
5. Copy the provided Webhook URL and paste the value to the **Webhook URL** field in Wallarm UI.
6. Choose event types to trigger notifications. If the events are not chosen, then notifications will not be sent.
7. Click **Add integration**.

      ![!Slack integration](../../../images/user-guides/settings/integrations/add-slack-integration.png)

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
