# Trigger examples

## Denylist IP if 4 or more attack vectors are detected in 1 hour (default trigger)

The trigger **Block IPs with high count of attack vectors** is created for all clients by default. If 4 or more different [malicious payloads](../../glossary-en.md#malicious-payload) are sent to the protected resource from one IP address, this IP address will be denylisted for 1 hour.

![Default trigger](../../images/user-guides/triggers/trigger-example-default.png)

You can perform all available trigger actions: edit, disable, delete, or copy the trigger.

**To test the trigger:**

1. Send the following requests to the protected resource:

    ```bash
    curl http://localhost/instructions.php/etc/passwd
    curl http://localhost/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    There are 3 attack vectors in these requests: [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal).
2. Open the Wallarm Console → **Denylist** and check that IP address from which the requests were originated is blocked for 1 hour.
3. Open the section **Events** and check that requests are displayed in the list as the [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal) attacks.

    ![Three attack vectors in UI](../../images/user-guides/triggers/test-3-attack-vectors-events-no-libdetection.png)

    To search for attacks, you can use the filters, for example: `sqli` for the [SQLi](../../attacks-vulns-list.md#sql-injection) attacks, `xss` for the [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) attacks, `ptrav` for the [Path Traversal](../../attacks-vulns-list.md#path-traversal) attacks. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

## Mark requests as a brute‑force attack if 31 or more requests are sent to the protected resource

To mark requests as a regular brute-force attack, the trigger with the condition **Brute force** should be configured.

If 31 or more requests are sent to `https://example.com/api/v1/login` in 30 seconds, these requests will be marked as [brute‑force attack](../../attacks-vulns-list.md#brute-force-attack) and the IP address from which requests were originated will be added to the denylist.

![Brute force trigger with counter](../../images/user-guides/triggers/trigger-example6.png)

[Details on configuration of brute force protection and trigger testing →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## Mark requests as a forced browsing attack if the 404 code is returned to 31 or more requests

To mark requests as a forced browsing attack, the trigger with the condition **Forced browsing** should be configured.

If the endpoint `https://example.com/**.**` returns 404 response code 31 or more times in 30 seconds, appropriate requests will be marked as a [forced browsing attack](../../attacks-vulns-list.md#forced-browsing) and a source IP address of these requests will be blocked.

Endpoint examples matching the URI value are `https://example.com/config.json`, `https://example.com/password.txt`.

![Forced browsing trigger](../../images/user-guides/triggers/trigger-example5.png)

[Details on configuration of brute force protection and trigger testing →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## Slack notification if 2 or more SQLi hits are detected in one minute

If 2 or more SQLi [hits](../../glossary-en.md#hit) are sent to the protected resource, then a notification about this event will be sent to the Slack channel.

![Example of a trigger sending the notification to Slack](../../images/user-guides/triggers/trigger-example1.png)

**To test the trigger:**

1. Send the following requests to the protected resource:

    ```bash
    curl http://localhost/data/UNION%20SELECT
    curl http://localhost/?id=or+1=1--a-
    ```
2. Open the Wallarm Console → **Events** and check that 3 [SQLi](../../attacks-vulns-list.md#sql-injection) attacks are displayed in the list of events. The attack was detected in the second request twice, before and after the parser [`percent`](../rules/request-processing.md#percent) was applied.

    ![3 SQLi hits in Wallarm Console](../../images/user-guides/triggers/test-3-sqli-hits.png)
3. Open the Slack channel and check that the following notification from the user **wallarm** received:

    ```
    [Wallarm] Trigger: The number of detected hits exceeded the threshold
    
    Notification type: attacks_exceeded
    
    The number of detected hits exceeded 1 in 1 minute.
    This notification was triggered by the "Notification about SQLi hits" trigger.
    
    Additional trigger’s clauses:
    Attack type: SQLi.
    
    View events:
    https://my.wallarm.com/search?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX
    
    Client: TestCompany
    Cloud: EU
    ```

    * `Notification about SQLi hits` is the trigger name
    * `TestCompany` is the name of your company account in Wallarm Console
    * `EU` is the Wallarm Cloud where your company account is registered

## Slack and email notification if new user is added to the account

If a new user with the **Administrator** or **Analyst** role is added to the company account in Wallarm Console, notification about this event will be sent to the email address specified in the integration and to the Slack channel.

![Example of a trigger sending the notification to Slack and by email](../../images/user-guides/triggers/trigger-example2.png)

**To test the trigger:**

1. Open the Wallarm Console → **Settings** → **Users** and add a new user. For example:

    ![Added user](../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. Open your email Inbox and check that the following message received:

    ![Email about new user added](../../images/user-guides/triggers/test-new-user-email-message.png)
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

## Opsgenie notification if 2 or more incidents are detected in one second

If 2 or more incidents with the application server or database are detected in one second, the notification about this event will be sent to Opsgenie.

![Example of a trigger sending the data to Splunk](../../images/user-guides/triggers/trigger-example3.png)

**To test the trigger**, it is required to send the attack exploiting an active vulnerability to the protected resource. The Wallarm Console → **Vulnerabilities** section displays active vulnerabilities detected in your applications and the examples of attacks that exploit these vulnerabilities.

If the attack example is sent to the protected resource, Wallarm will record the incident. Two or more recorded incidents will trigger sending the following notification to Opsgenie:

```
[Wallarm] Trigger: The number of incidents exceeded the threshold

Notification type: incidents_exceeded

The number of detected incidents exceeded 1 in 1 second.
This notification was triggered by the "Notification about incidents" trigger.

Additional trigger’s clauses:
Target: server, database.

View events:
https://my.wallarm.com/search?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Client: TestCompany
Cloud: EU
```

* `Notification about incidents` is the trigger name
* `TestCompany` is the name of your company account in Wallarm Console
* `EU` is the Wallarm Cloud where your company account is registered

!!! info "Protecting the resource from active vulnerability exploitation"
    To protect the resource from active vulnerability exploitation, we recommend to patch the vulnerability in a timely manner. If the vulnerability cannot be patched on the application side, please configure a [virtual patch](../rules/vpatch-rule.md) to block attacks exploiting this vulnerability.

## Notification to Webhook URL if IP address is added to the denylist

If an IP address was added to the denylist, the webhook about this event will be sent to Webhook URL.

![Example of trigger for denylisted IP](../../images/user-guides/triggers/trigger-example4.png)

**To test the trigger:**

1. Open the Wallarm Console → **Denylist** and add the IP address to the denylist. For example:

    ![Adding IP to the denylist](../../images/user-guides/triggers/test-ip-blocking.png)
2. Check that the following webhook was sent to the Webhook URL:

    ```
    [
        {
            "summary": "[Wallarm] Trigger: New IP address was denylisted",
            "description": "Notification type: ip_blocked\n\nIP address 1.1.1.1 was denylisted until 2021-06-10 02:27:15 +0300 for the reason Produces many attacks. You can review blocked IP addresses in the \"Denylist\" section of Wallarm Console.\nThis notification was triggered by the \"Notification about denylisted IP\" trigger. The IP is blocked for the application Application #8.\n\nClient: TestCompany\nCloud: EU\n",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "ip_blocked",
            "trigger_name": "Notification about denylisted IP",
            "application": "Application #8",
            "reason": "Produces many attacks",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `Notification about denylisted IP` is the trigger name
    * `TestCompany` is the name of your company account in Wallarm Console
    * `EU` is the Wallarm Cloud where your company account is registered

## Group hits originating from the same IP into one attack

If more than 100 [hits](../../about-wallarm/protecting-against-attacks.md#hit) from the same IP address are detected in an hour, the next hits from the same IP will be grouped into one attack in the [event list](../events/check-attack.md).

![Example of a trigger for hit grouping](../../images/user-guides/triggers/trigger-example-group-hits.png)

**To test the trigger**, send 101 or more hits as follows:

* All hits are sent in an hour
* The IP addresses of the hit sources are the same
* Hits have different attack types or parameters with malicious payloads or addresses the hits are sent to (so that the hits are not [grouped](../../about-wallarm/protecting-against-attacks.md#attack) into an attack by the basic method)
* Attack types are different from Brute force, Forced browsing, Resource overlimit, Data bomb and Virtual patch

Example:

* 10 hits are sent to `example.com`
* 50 hits are sent to `test.com`
* 60 hits are sent to `example-domain.com`

The first 100 hits will appear in the event list as individual hits. All of the following hits will be grouped into one attack, e.g.:

![Hits grouped by IP into one attack](../../images/user-guides/events/attack-from-grouped-hits.png)

The [**Mark as false positive**](../events/false-attack.md#mark-an-attack-as-a-false-positive) button and the [active verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) option will be unavailable for the attack.