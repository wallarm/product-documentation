# Telegram Reports and Notifications

You can set up Wallarm to send notifications to Telegram

Notifications can be set up on the following events:

--8<-- "../include/integrations/events-for-integrations.md"

You can also schedule a full report delivery on a daily, weekly, or monthly basis.

## Setting up Reports and Notifications

1. Open the **Settings** → **Integrations** tab.
2. Click the **Telegram** block or click the **Add integration** button and choose **Telegram**.

    ![!Adding integration via the button](../../../images/user-guides/settings/add-integration-button.png)
3. Click **Open bot**.

    !!! info
        If clicking the *Open bot* button did not open the Telegram chat with the bot, try using the [link](tg://resolve?domain=WallarmBot).
4. In the new Telegram chat with the bot, click `/start`. The Wallarm bot will create a unique link.
5. Click the created link. Click **Authorize**.
6. Set the notification events and the report recurrence.
7. Click **Save**.

The selected notifications and reports will now be sent to Telegram.

You can also add @WallarmBot to any of your chats. The notifications will be sent to the chat as well.

## Disabling Reports and Notifications

--8<-- "../include/integrations/disable-integration.md"

## Removing Integration

--8<-- "../include/integrations/remove-integration.md"

!!! info "See also"
    * [Email reports and notifications](email.md)
    * [Slack notifications](slack.md)
    * [OpsGenie notifications](opsgenie.md)
    * [InsightConnect notifications](insightconnect.md)
    * [PagerDuty notifications](pagerduty.md)
    * [Splunk notifications](splunk.md)
    * [Sumo Logic notifications](sumologic.md)