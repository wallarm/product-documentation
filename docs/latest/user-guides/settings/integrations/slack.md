# Slack

You can set up Wallarm to send notifications to your Slack channel(s). If you want to send notifications to several different Slack channels or accounts, create several Slack integrations - one for each account/channel.

Wallarm can send notifications to Slack when the following events are triggered:

--8<-- "../include/integrations/events-for-integrations.md"

## Setting up integration

1. Open the **Integrations** section.
2. Click the **Slack** block or click the **Add integration** button and choose **Slack**.
3. Enter an integration name.
4. Open [Webhook settings in Slack](https://my.slack.com/services/new/incoming-webhook/) and add a new Webhook choosing the channel to post messages to.
5. Copy the provided Webhook URL and paste the value to the **Webhook URL** field in Wallarm UI.
6. Choose event types to trigger notifications. If the events are not chosen, then notifications will not be sent.
7. [Test the integration](#testing-integration) and make sure the settings are correct.
8. Click **Add integration**.

      ![Slack integration](../../../images/user-guides/settings/integrations/add-slack-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-basic-data.md"

Test Slack message from the user **wallarm**:

```
[Test message] [Test partner] Network perimeter has changed

Notification type: new_scope_object_ips

New IP addresses were discovered in the network perimeter:
8.8.8.8

Client: TestCompany
Cloud: EU
```

## Setting up additional alerts

1. Open the **Triggers** section.
1. Click **Create trigger**.
1. [Choose](#step-1-choosing-a-condition) conditions.
1. [Add](#step-2-adding-filters) filters.
1. [Add](#step-3-adding-reactions) reactions.
1. [Save](#step-4-saving-the-trigger) the trigger.

--8<-- "../include/integrations/integrations-trigger-setup.md"
