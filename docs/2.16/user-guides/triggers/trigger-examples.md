# Trigger examples

## Blacklist IP if 4 or more attack vectors were detected in 3 hours (default trigger)

The trigger **Block IPs with high count of attack vectors** is created for all clients by default. If 4 or more different attack vectors were sent to the protected resource from one IP address, this IP address will be blacklisted for 1 hour.

![!Default trigger](../../images/user-guides/triggers/trigger-example-default.png)

You can perform all available trigger actions: edit, disable, delete, or copy the trigger.

## Mark requests as a brute‑force or dirbust attack if 31 or more requests were sent to the protected resource

### With the filter by the counter name

If 31 or more requests were sent to `https://example.com/api/frontend/login` in 30 seconds, these requests will be marked as [brute‑force attack](../../attacks-vulns-list.md#bruteforce-attack) and the IP address from which requests were originated will be added to the blacklist.

The request URL `https://example.com/api/frontend/login` is specified in the rule **Define brute-force attacks counter**.

![!Brute force trigger with counter](../../images/user-guides/triggers/trigger-example6.png)

To mark requests as the dirbust (forced browsing) attack, it is required to use the rule **Define forced browsing attacks counter**.

[Details on configuration of brute force protection →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

### With the filter by URL

If 31 or more requests were sent to `example.com:8888/api/frontend/login` in 30 seconds:

* These requests will be marked as [brute‑force attack](../../attacks-vulns-list.md#bruteforce-attack) and the IP address from which requests were originated will be added to the blacklist.
* If the code 404 was returned in the response to all requests, these requests will be marked as [dirbust (forced browsing) attack](../../attacks-vulns-list.md#forced-browsing) and the IP address from which requests were originated will be added to the blacklist.

!!! info "URL value format"
    The format of the URL filter value is `host:port/path`. The scheme should be omitted. `port` accepts any value except for 80 and 443.

![!Brute force / dirbust trigger](../../images/user-guides/triggers/trigger-example5.png)

[Details on configuration of brute force protection →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## Slack notification if 2 or more SQLi hits were detected in one minute

If 2 or more SQLi [hits](../../glossary-en.md#hit) were sent to the protected resource, then a notification about this event will be sent to the Slack channel.

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

## Notification to Webhook URL if IP address was added to the blacklist

If an IP address was added to the blacklist, the webhook about this event will be sent to Webhook URL.

![!Example of trigger for blacklisted IP](../../images/user-guides/triggers/trigger-example4.png)

Webhook:

```
{
    "summary": "Please make attention! Notification about blacklisted IP is triggered: IP 1.1.1.1 was blocked until 2020-11-10 11:48:22 +0300"
}
```

* `Notification about blacklisted IP` is the trigger name