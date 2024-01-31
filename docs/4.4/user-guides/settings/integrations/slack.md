# Slack

You can set up Wallarm to send notifications to your Slack channel when the following events are triggered:

--8<-- "../include/integrations/events-for-integrations-4.6.md"

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

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
