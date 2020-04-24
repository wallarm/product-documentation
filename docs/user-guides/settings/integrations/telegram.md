# Telegram Reports and Notifications

You can set up Wallarm to send notifications to Telegram

Notifications can be set up on the following events:

* System-related:
  - new user created;
  - integration settings changed.
* Vulnerability detected.
* Network perimeter changed.

You can also schedule a full report delivery on a daily, weekly, or monthly basis.

## Setting up Reports and Notifications

1. Open the *Settings* → *Integrations* tab.
2. Click the *Telegram* block or click the *Add integration* button and choose *Telegram*.

   ![!Adding integration via the button](../../../images/user-guides/settings/add-integration-button.png)
3. Click *Open bot*.
    !!! info
        If clicking the *Open bot* button did not open the Telegram chat with the bot, try using the [link](tg://resolve?domain=WallarmBot).
4. In the new Telegram chat with the bot, click `/start`. The Wallarm bot will create a unique link.
5. Click the created link. Click *Authorize*.
6. Set the notification events and the report recurrence.
7. Click *Save*.

The selected notifications and reports will now be sent to Telegram.

You can also add @WallarmBot to any of your chats. The notifications will be sent to the chat as well.

## Disabling Reports and Notifications

1. Go to your Wallarm account > *Settings* > *Integrations* by the link below:
      * https://my.wallarm.com/settings/integrations/ for the [EU cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
      * https://us1.my.wallarm.com/settings/integrations/ for the [US cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)
2. Select an integration and click *Disable*.
3. Click *Save*.

## Removing Integration

1. Go to your Wallarm account > *Settings* > *Integrations* by the link below:
      * https://my.wallarm.com/settings/integrations/ for the [EU cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
      * https://us1.my.wallarm.com/settings/integrations/ for the [US cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)
2. Select an integration and click *Remove*.
3. Click *Sure?*.

!!! info "See also"
    * [Email reports and notifications](email.md)
    * [Slack notifications](slack.md)
    * [OpsGenie notifications](opsgenie.md)
    * [PagerDuty notifications](pagerduty.md)
    * [Splunk notifications](splunk.md)
    * [Sumo Logic notifications](sumologic.md)