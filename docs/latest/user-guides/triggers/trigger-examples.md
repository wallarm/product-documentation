# Trigger examples

## Blacklist IP if 4 or more attack vectors were detected in 1 hour (default trigger)

The trigger **Block IPs with high count of attack vectors** is created for all clients by default. If 4 or more different attack vectors were sent to the protected resource from one IP address, this IP address will be blacklisted for 1 hour.

![!Default trigger](../../images/user-guides/triggers/trigger-example-default.png)

You can perform all available trigger actions: edit, disable, delete, or copy the trigger.

**To test the trigger:**

1. Send the following requests to the protected resource:

    ```bash
    curl http://localhost/instructions.php/etc/passwd
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    There are 3 attack vectors in these requests: [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal).
2. Open the Wallarm Console → **Blacklist** and check that IP address from which the requests were originated is blocked for 1 hour.
3. Open the section **Events** and check that requests are displayed in the list as the [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal) attacks.

    ![!Three attack vectors in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    To search for attacks, you can use the filters, for example: `sqli` for the [SQLi](../../attacks-vulns-list.md#sql-injection) attacks, `xss` for the [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) attacks, `ptrav` for the [Path Traversal](../../attacks-vulns-list.md#path-traversal) attacks. All filters are described in the [instructions on search using](../../user-guides/search-and-filters/use-search.md).

## Mark requests as a brute‑force or dirbust attack if 31 or more requests were sent to the protected resource

### With the filter by the counter name

If 31 or more requests were sent to `https://example.com/api/frontend/login` in 30 seconds, these requests will be marked as [brute‑force attack](../../attacks-vulns-list.md#bruteforce-attack) and the IP address from which requests were originated will be added to the blacklist.

The request URL `https://example.com/api/frontend/login` is specified in the rule **Tag requests as a brute-force attack**.

![!Brute force trigger with counter](../../images/user-guides/triggers/trigger-example6.png)

To mark requests as the dirbust (forced browsing) attack, it is required to use the rule **Tag requests as a forced browsing attack**.

[Details on configuration of brute force protection and trigger testing →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

### With the filter by URL

If 31 or more requests were sent to `example.com:8888/api/frontend/login` in 30 seconds:

* These requests will be marked as [brute‑force attack](../../attacks-vulns-list.md#bruteforce-attack) and the IP address from which requests were originated will be added to the blacklist.
* If the code 404 was returned in the response to all requests, these requests will be marked as [dirbust (forced browsing) attack](../../attacks-vulns-list.md#forced-browsing) and the IP address from which requests were originated will be added to the blacklist.

!!! info "URL value format"
    The format of the URL filter value is `host:port/path`. The scheme should be omitted. The `port` value must contain a non‑standard port (to specify 80 or 443 port, please configure the URL via the **Counter name** filter).

![!Brute force / dirbust trigger](../../images/user-guides/triggers/trigger-example5.png)

[Details on configuration of brute force protection and trigger testing →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## Slack notification if 2 or more SQLi hits were detected in one minute

If 2 or more SQLi [hits](../../glossary-en.md#hit) were sent to the protected resource, then a notification about this event will be sent to the Slack channel.

![!Example of a trigger sending the notification to Slack](../../images/user-guides/triggers/trigger-example1.png)

**To test the trigger:**

1. Send the following requests to the protected resource:

    ```bash
    curl http://localhost/data/UNION%20SELECT
    curl http://localhost/?id=or+1=1--a-
    ```
2. Open the Wallarm Console → **Events** and check that 3 [SQLi](../../attacks-vulns-list.md#sql-injection) attacks are displayed in the list of events. The attack was detected in the second request twice, before and after the parser [`percent`](../rules/request-processing.md#percent) was applied.

    ![!3 SQLi hits in the Wallarm Console](../../images/user-guides/triggers/test-3-sqli-hits.png)
3. Open the Slack channel and check that the following notification from the user **wallarm** received:

    ```
    Please make attention! Notification about SQLi hits is triggered: The number of hits for the sqli type in 1 minute exceeds 1
    ```

    * `Notification about SQLi hits` is the trigger name

## Slack and email notification if new user is added to the account

If a new user with the **Administrator** or **Analyst** role is added to the company account in the Wallarm Console, notification about this event will be sent to the email address specified in the integration and to the Slack channel.

![!Example of a trigger sending the notification to Slack and by email](../../images/user-guides/triggers/trigger-example2.png)

**To test the trigger:**

1. Open the Wallarm Console → **Settings** → **Users** and add a new user. For example:

    ![!Added user](../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. Open your email Inbox and check that the following message received:

    ![!Email about new user added](../../images/user-guides/triggers/test-new-user-email-message.png)
3. Open the Slack channel and check that the following notification from the user **wallarm** received:

    ```
    Please make attention! Added user is triggered: New user johnsmith@example.com was created by John Doe. New user role is Analyst.
    ```

    * `Added user` is the trigger name
    * `johnsmith@example.com` if the email address of the added user
    * `Analyst` is the role of the added user
    * `John Doe` is the user who added a new user

## Opsgenie notification if 2 or more incidents were detected in one second

If 2 or more incidents with the application server or database were detected in one second, the notification about this event will be sent to Opsgenie.

![!Example of a trigger sending the data to Splunk](../../images/user-guides/triggers/trigger-example3.png)

**To test the trigger**, it is required to send the attack exploiting an active vulnerability to the protected resource. The Wallarm Console → **Vulnerabilities** section displays active vulnerabilities detected in your applications and the examples of attacks that exploit these vulnerabilities.

If the attack example is sent to the protected resource, Wallarm will record the incident. Two or more recorded incidents will trigger sending the following notification to Opsgenie:

```
Please make attention! Notification about incidents is triggered: The number of incidents for the server, database in 1 second exceeds 1
```

* `Notification about incidents` is the trigger name

!!! info "Protecting the resource from active vulnerability exploitation"
    To protect the resource from active vulnerability exploitation, we recommend to patch the vulnerability in a timely manner. If the vulnerability cannot be patched on the application side, please configure a [virtual patch](../rules/vpatch-rule.md) to block attacks exploiting this vulnerability.

## Notification to Webhook URL if IP address was added to the blacklist

If an IP address was added to the blacklist, the webhook about this event will be sent to Webhook URL.

![!Example of trigger for blacklisted IP](../../images/user-guides/triggers/trigger-example4.png)

**To test the trigger:**

1. Open the Wallarm Console → **Blacklist** and add the IP address to the blacklist. For example:

    ![!Adding IP to the blacklist](../../images/user-guides/triggers/test-ip-blocking.png)
2. Check that the following webhook was sent to the Webhook URL:

    ```
    {
        "summary": "Please make attention! Notification about blacklisted IP is triggered: IP 1.1.1.1 was blocked until 2020-11-10 11:48:22 +0300"
    }
    ```

    * `Notification about blacklisted IP` is the trigger name
