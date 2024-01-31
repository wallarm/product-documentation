# Telegram

You can set up Wallarm to send scheduled reports and instant notifications to Telegram.

* Scheduled reports can be sent on a daily, weekly, or monthly basis. Reports include detailed information about vulnerabilities, attacks, and incidents detected in your system over the selected period.
* Notifications include brief details of triggered events:
    --8<-- "../include/integrations/events-for-integrations-4.6.md"

## Setting up integration

1. Open the **Integrations** section.
2. Click the **Telegram** block or click the **Add integration** button and choose **Telegram**.
3. Add [@WallarmUSBot](https://t.me/WallarmUSBot) (if you are using the Wallarm US Cloud) or [@WallarmBot](https://t.me/WallarmBot) (if you are using the Wallarm EU Cloud) to the Telegram group receiving Wallarm notifications and follow the authentication link.
4. After redirection to Wallarm UI, authenticate the bot.
5. Enter an integration name.
6. Choose the frequency of sending security reports. If the frequency is not chosen, then reports will not be sent.
7. Choose event types to trigger notifications. If the events are not chosen, then notifications will not be sent.
8. [Test the integration](#testing-integration) and make sure the settings are correct.
9. Click **Add integration**.

    ![Telegram integration](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

You can also start the chat with [@WallarmUSBot](https://t.me/WallarmUSBot) or [@WallarmBot](https://t.me/WallarmBot) directly. The bot will send reports and notifications as well.

## Testing integration

--8<-- "../include/integrations/test-integration-basic-data.md"

The integration with Telegram can be tested only if this integration is already created. Test Telegram message:

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
