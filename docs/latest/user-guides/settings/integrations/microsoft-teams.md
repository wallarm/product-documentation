# Microsoft Teams

[Microsoft Teams](https://www.microsoft.com/en-us/microsoft-teams/group-chat-software) is a collaboration and communication platform designed to facilitate teamwork and enable organizations to communicate, collaborate, and manage projects effectively, whether they are working in the office, remotely, or a combination of both. You can set up Wallarm to send notifications to your Microsoft Teams channel(s). If you want to send notifications to several different channels, create several Microsoft Teams integrations.

## Setting up integration

1. Open the **Integrations** section.
1. Click the **Microsoft Teams** block or click the **Add integration** button and choose **Microsoft Teams**.
1. Enter an integration name.
1. Open the settings of the Microsoft Teams channel where you want to post notifications and configure a new Webhook by using the [instructions](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
1. Copy the provided Webhook URL and paste the value to the **Webhook URL** field in Wallarm Console.
1. Choose event types to trigger notifications.

      ![MS Teams integration](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)
    
      Details on available events:
      
      --8<-- "../include/integrations/events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the target system, and the notification format.

      This will send the test notifications with the prefix `[Test message]`:

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

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
