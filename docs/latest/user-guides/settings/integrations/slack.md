# Slack

[Slack](https://slack.com/) is a widely used cloud-based team collaboration and messaging platform. It is designed to facilitate communication and collaboration within organizations by providing a centralized space for teams to exchange messages, share files, and integrate with other tools and services. You can set up Wallarm to send notifications to your Slack channel(s). If you want to send notifications to several different Slack channels or accounts, create several Slack integrations.

## Setting up integration

1. Open the **Integrations** section.
1. Click the **Slack** block or click the **Add integration** button and choose **Slack**.
1. Enter an integration name.
1. Open [Webhook settings in Slack](https://my.slack.com/services/incoming-webhook/) and add a new Webhook choosing the channel to post messages to.
1. Copy the provided Webhook URL and paste the value to the **Webhook URL** field in Wallarm UI.
1. Choose event types to trigger notifications.

    ![Slack integration](../../../images/user-guides/settings/integrations/add-slack-integration.png)

    Details on available events:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

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

--8<-- "../include/integrations/integrations-trigger-setup.md"

### Example: Slack notification if 2 or more SQLi hits are detected in one minute

If 2 or more SQLi [hits](../../../glossary-en.md#hit) are sent to the protected resource, then a notification about this event will be sent to the Slack channel.

![Example of a trigger sending the notification to Slack](../../../images/user-guides/triggers/trigger-example1.png)

**To test the trigger:**

Send the following requests to the protected resource:

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```
Open the Slack channel and check that the following notification from the user **wallarm** received:

```
[Wallarm] Trigger: The number of detected hits exceeded the threshold

Notification type: attacks_exceeded

The number of detected hits exceeded 1 in 1 minute.
This notification was triggered by the "Notification about SQLi hits" trigger.

Additional trigger’s clauses:
Attack type: SQLi.

View events:
https://my.wallarm.com/attacks?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Client: TestCompany
Cloud: EU
```

* `Notification about SQLi hits` is the trigger name
* `TestCompany` is the name of your company account in Wallarm Console
* `EU` is the Wallarm Cloud where your company account is registered

### Example: Slack and email notification if new user is added to the account

If a new user with the **Administrator** or **Analyst** role is added to the company account in Wallarm Console, notification about this event will be sent to the email address specified in the integration and to the Slack channel.

![Example of a trigger sending the notification to Slack and by email](../../../images/user-guides/triggers/trigger-example2.png)

**To test the trigger:**

1. Open the Wallarm Console → **Settings** → **Users** and add a new user. For example:

    ![Added user](../../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. Open your email Inbox and check that the following message received:

    ![Email about new user added](../../../images/user-guides/triggers/test-new-user-email-message.png)
3. Open the Slack channel and check that the following notification from the user **wallarm** received:

    ```
    [Wallarm] Trigger: New user was added to the company account
    
    Notification type: create_user
    
    A new user John Smith <johnsmith@example.com> with the role Analyst was added to the company account by John Doe <johndoe@example.com>.
    This notification was triggered by the "Added user" trigger.

    Client: TestCompany
    Cloud: EU
    ```

    * `John Smith` and `johnsmith@example.com` is information about the added user
    * `Analyst` is the role of the added user
    * `John Doe` and `johndoe@example.com` is information about the user who added a new user
    * `Added user` is the trigger name
    * `TestCompany` is the name of your company account in Wallarm Console
    * `EU` is the Wallarm Cloud where your company account is registered

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
