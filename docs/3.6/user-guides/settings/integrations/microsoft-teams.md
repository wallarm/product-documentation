# Microsoft Teams

You can set up Wallarm to send notifications to your Microsoft Teams channel when the following events are triggered:

--8<-- "../include/integrations/events-for-integrations-4.6.md"

## Setting up integration

1. Open the **Integrations** section.
2. Click the **Microsoft Teams** block or click the **Add integration** button and choose **Microsoft Teams**.
3. Enter an integration name.
4. Open the settings of the Microsoft Teams channel where you want to post notifications and configure a new Webhook by using the [instructions](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
5. Copy the provided Webhook URL and paste the value to the **Webhook URL** field in Wallarm Console.
6. Choose event types to trigger notifications. If the events are not chosen, then notifications will not be sent.
7. [Test the integration](#testing-integration) and make sure the settings are correct.
8. Click **Add integration**.

      ![MS Teams integration](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-basic-data.md"

Test Microsoft Teams message from the user **wallarm**:

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