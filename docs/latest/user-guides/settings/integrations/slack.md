# Slack

You can set up Wallarm to send notifications to your Slack channel(s). If you want to send notifications to several different Slack channels or accounts, create several Slack integrations.

## Setting up integration

1. Open the **Integrations** section.
1. Click the **Slack** block or click the **Add integration** button and choose **Slack**.
1. Enter an integration name.
1. Open [Webhook settings in Slack](https://my.slack.com/services/new/incoming-webhook/) and add a new Webhook choosing the channel to post messages to.
1. Copy the provided Webhook URL and paste the value to the **Webhook URL** field in Wallarm UI.
1. Choose event types to trigger notifications.

    ![Slack integration](../../../images/user-guides/settings/integrations/add-slack-integration.png)

    Details on available events:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

    This will send a test notification with the prefix `[Test message]`:

    ```
    [Test message] [Test partner] Network perimeter has changed

    Notification type: new_scope_object_ips

    New IP addresses were discovered in the network perimeter:
    8.8.8.8

    Client: TestCompany
    Cloud: EU
    ```

1. Click **Add integration**.

## Setting up additional alerts

--8<-- "../include/integrations/integrations-trigger-setup.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
