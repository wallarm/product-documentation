# Trigger examples

Learn real examples of [Wallarm triggers](triggers.md) to better understand this feature and configure triggers appropriately.

## Graylist IP if 4 or more malicious payloads are detected in 1 hour

If 4 or more different malicious payloads are sent to the protected resource from one IP address, this IP address will be graylisted for 1 hour for all applications in a Wallarm account.

If you have recently created the Wallarm account, this [trigger is already created and enabled](triggers.md#pre-configured-triggers-default-triggers). You can edit, disable, delete, or copy this trigger as well as the manually created triggers.

![Graylisting trigger](../../images/user-guides/triggers/trigger-example-graylist.png)

**To test the trigger:**

1. Send the following requests to the protected resource:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    There are 4 malicious payloads of the [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal) types.
1. Open Wallarm Console → **IP lists** → **Graylist** and check that the IP address from which the requests originated is graylisted for 1 hour.
1. Open the section **Attacks** and check that the attacks are displayed in the list:

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    To search for attacks, you can use the filters, for example: `sqli` for the [SQLi](../../attacks-vulns-list.md#sql-injection) attacks, `xss` for the [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) attacks, `ptrav` for the [Path Traversal](../../attacks-vulns-list.md#path-traversal) attacks. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

The trigger is released in any node filtration mode, so that it will graylist IPs regardless of the node mode. However, the node analyzes the graylist only in the **safe blocking** mode. To block malicious requests originating from graylisted IPs, switch the node [mode](../../admin-en/configure-wallarm-mode.md#available-filtration-modes) to safe blocking learning its features first.

## Denylist IP if 4 or more malicious payloads are detected in 1 hour

If 4 or more different [malicious payloads](../../glossary-en.md#malicious-payload) are sent to the protected resource from one IP address, this IP address will be denylisted for 1 hour for all applications in a Wallarm account.

![Default trigger](../../images/user-guides/triggers/trigger-example-default.png)

**To test the trigger:**

1. Send the following requests to the protected resource:

    ```bash
    curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
    curl 'http://localhost/?id=1%27%20select%20version();'
    curl http://localhost/instructions.php/etc/passwd
    ```

    There are 4 malicious payloads of the [SQLi](../../attacks-vulns-list.md#sql-injection), [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss), and [Path Traversal](../../attacks-vulns-list.md#path-traversal) types.
2. Open Wallarm Console → **IP lists** → **Denylist** and check that the IP address from which the requests originated is blocked for 1 hour.
1. Open the section **Attacks** and check that the attacks are displayed in the list:

    ![Three malicious payloads in UI](../../images/user-guides/triggers/test-3-attack-vectors-events.png)

    To search for attacks, you can use the filters, for example: `sqli` for the [SQLi](../../attacks-vulns-list.md#sql-injection) attacks, `xss` for the [XSS](../../attacks-vulns-list.md#crosssite-scripting-xss) attacks, `ptrav` for the [Path Traversal](../../attacks-vulns-list.md#path-traversal) attacks. All filters are described in the [instructions on search use](../../user-guides/search-and-filters/use-search.md).

If an IP address was denylisted by this trigger, the filtering node would block all malicious and legitimate requests that originated from this IP. To allow legitimate requests, you can configure the [graylisting trigger](#graylist-ip-if-4-or-more-malicious-payloads-are-detected-in-1-hour).

## Mark requests as a brute‑force attack if 31 or more requests are sent to the protected resource

To mark requests as a regular brute-force attack, the trigger with the condition **Brute force** should be configured.

If 31 or more requests are sent to `https://example.com/api/v1/login` in 30 seconds, these requests will be marked as [brute‑force attack](../../attacks-vulns-list.md#bruteforce-attack) and the IP address from which the requests originated will be added to the denylist.

![Brute force trigger with counter](../../images/user-guides/triggers/trigger-example6.png)

[Details on configuration of brute force protection and trigger testing →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## Mark requests as a forced browsing attack if the 404 code is returned to 31 or more requests

To mark requests as a forced browsing attack, the trigger with the condition **Forced browsing** should be configured.

If the endpoint `https://example.com/**.**` returns 404 response code 31 or more times in 30 seconds, appropriate requests will be marked as a [forced browsing attack](../../attacks-vulns-list.md#forced-browsing) and a source IP address of these requests will be blocked.

Endpoint examples matching the URI value are `https://example.com/config.json`, `https://example.com/password.txt`.

![Forced browsing trigger](../../images/user-guides/triggers/trigger-example5.png)

[Details on configuration of brute force protection and trigger testing →](../../admin-en/configuration-guides/protecting-against-bruteforce.md)

## Detect weak JWTs

If a significant amount of incoming requests processed by the node 4.4 or above contains weak JWTs, record the corresponding [vulnerability](../vulnerabilities.md).

Weak JWTs are those that are:

* Unencrypted - there is no signing algorithm (the `alg` field is `none` or absent).
* Signed using compromised secret keys

If you have recently created the Wallarm account, this [trigger is already created and enabled](triggers.md#pre-configured-triggers-default-triggers). You can edit, disable, delete, or copy this trigger as well as the manually created triggers.

![Example for trigger on weak JWTs](../../images/user-guides/triggers/trigger-example-weak-jwt.png)

**To test the trigger:**

1. Generate a JWT signed using a [compromised secret key](https://github.com/wallarm/jwt-secrets), e.g.:

    ```
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW5pc3RyYXRvciJ9.p5DrumkF6oTBiUmdtDRT5YHqYL2D7p5YOp6quUrULYg
    ```
1. Generate some traffic with requests authenticated using a compromised JWT.
1. If a significant amount of incoming requests processed by the node 4.4 or above contains weak JWTs, Wallarm registers the vulnerability, e.g.:

    ![JWT vuln example](../../images/user-guides/vulnerabilities/weak-auth-vuln.png)

## Group hits originating from the same IP into one attack

If more than 50 [hits](../../about-wallarm/protecting-against-attacks.md#hit) from the same IP address are detected in 15 minutes, the next hits from the same IP will be grouped into one attack in the [event list](../events/check-attack.md).

If you have recently created the Wallarm account, this [trigger is already created and enabled](triggers.md#pre-configured-triggers-default-triggers). You can edit, disable, delete, or copy this trigger as well as the manually created triggers.

![Example of a trigger for hit grouping](../../images/user-guides/triggers/trigger-example-group-hits.png)

**To test the trigger**, send 51 or more hits as follows:

* All hits are sent in 15 minutes
* The IP addresses of the hit sources are the same
* Hits have different attack types or parameters with malicious payloads or addresses the hits are sent to (so that the hits are not [grouped](../../about-wallarm/protecting-against-attacks.md#attack) into an attack by the basic method)
* Attack types are different from Brute force, Forced browsing, Resource overlimit, Data bomb and Virtual patch

Example:

* 10 hits to `example.com`
* 20 hits to `test.com`
* 40 hits to `example-domain.com`

The first 50 hits will appear in the event list as individual hits. All of the following hits will be grouped into one attack, e.g.:

![Hits grouped by IP into one attack](../../images/user-guides/events/attack-from-grouped-hits.png)

The [**Mark as false positive**](../events/false-attack.md#mark-an-attack-as-a-false-positive) button and the [active verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) option will be unavailable for the attack.
