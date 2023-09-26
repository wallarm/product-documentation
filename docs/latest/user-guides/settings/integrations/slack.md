[img-select-integration]:     ../../images/user-guides/settings/integrations/select-integration.png

# Slack

You can set up Wallarm to send notifications to your Slack channel(s). If you want to send notifications to several different Slack channels or accounts, create several Slack integrations - one for each account/channel.

## Setting up integration

1. Open the **Integrations** section.
2. Click the **Slack** block or click the **Add integration** button and choose **Slack**.
3. Enter an integration name.
4. Open [Webhook settings in Slack](https://my.slack.com/services/new/incoming-webhook/) and add a new Webhook choosing the channel to post messages to.
5. Copy the provided Webhook URL and paste the value to the **Webhook URL** field in Wallarm UI.
6. Choose event types to trigger notifications.

      ![Slack integration](../../../images/user-guides/settings/integrations/add-slack-integration.png)

      Details on available events:
      
      --8<-- "../include/integrations/events-for-integrations.md"

      !!! info "No events selected"
          If no events are selected, no notifications will be sent.

7. [Test the integration](#testing-integration) and make sure the settings are correct.
8. Click **Add integration**.

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

--8<-- "../include/integrations/integrations-trigger-setup.md"
