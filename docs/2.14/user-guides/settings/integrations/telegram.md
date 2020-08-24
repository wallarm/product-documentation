# Telegram

You can set up Wallarm to send scheduled reports and instant notifications to Telegram.

* Scheduled reports can be sent on a daily, weekly, or monthly basis. Reports include detailed information about vulnerabilities, attacks, and incidents detected in your system over the selected period.
* Notifications include brief details of triggered events:
    --8<-- "../include/integrations/events-for-integrations.md"

## Setting up integration

1. Open the **Settings** → **Integrations** tab.
2. Click the **Telegram** block or click the **Add integration** button and choose **Telegram**.
3. Add [@WallarmBot](https://t.me/WallarmBot) to the Telegram group receiving Wallarm notifications and follow the authentication link.
4. After redirection to Wallarm UI, authenticate WallarmBot.
5. Enter an integration name.
6. Choose the frequency of sending security reports. If the frequency is not chosen, then reports will not be sent.
7. Choose event types to trigger notifications. If the events are not chosen, then notifications will not be sent.
8. Click **Add integration**.

    ![!Telegram integration](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

You can also start the chat with [@WallarmBot](https://t.me/WallarmBot) directly. WallarmBot will send reports and notifications as well.

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
