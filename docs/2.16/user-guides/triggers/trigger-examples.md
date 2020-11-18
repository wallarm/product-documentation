# Trigger examples

## Blacklist IP if 4 or more attack vectors were detected in 3 hours (default trigger)

The trigger **Block IPs with high count of attack vectors** is created for all clients by default. If 4 or more different attack vectors were sent to the protected resource from one IP address, this IP address will be blacklisted for 1 hour.

![!Default trigger](../../images/user-guides/triggers/trigger-example-default.png)

You can perform all available trigger actions: edit, disable, delete, or copy the trigger.

## Slack notification if 2 or more SQLi hits were detected in one minute

If 2 or more SQLi [hits](../../glossary-en.md#hit) were sent to the protected resource, notification about this event will be sent to the Slack channel.

![!Example of a trigger sending the notification to Slack](../../images/user-guides/triggers/trigger-example1.png)

Slack notification from the user **wallarm**:

```
Please make attention! Notification about SQLi hits is triggered: The number of hits for the sqli type in 1 minute exceeds 1
```

* `Notification about SQLi hits` is the trigger name

## Slack and email notification if new user is added to the account

If a new user with the **Administrator** or **Analyst** role is added to the company account in the Wallarm Console, notification about this event will be sent to the email address specified in the integration and to the Slack channel.

![!Example of a trigger sending the notification to Slack and by email](../../images/user-guides/triggers/trigger-example2.png)

* Email:

    ![!Email about new user added](../../images/user-guides/triggers/trigger-email-example.png)

* Slack notification from the user **wallarm**:

    ```
    Please make attention! Added user is triggered: New user user@example.com was created by John Smith. New user role is Analyst.
    ```

    * `Added user` is the trigger name
    * `user@example.com` if the email address of the added user
    * `Analyst` is the role of the added user
    * `John Smith` is the user who added a new user

## OpsGenie notification if 2 or more incidents were detected in one second

If 2 or more incidents with the application server or database were detected in one second, the notification about this event will be sent to OpsGenie.

![!Example of a trigger sending the data to Splunk](../../images/user-guides/triggers/trigger-example3.png)

OpsGenie notification:

```
Please make attention! Notification about incidents is triggered: The number of incidents for the server, database in 1 second exceeds 1
```

* `Notification about incidents` is the trigger name
