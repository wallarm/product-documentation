# Trigger examples

Learn real examples of [Wallarm triggers](triggers.md) to better understand this feature and configure triggers appropriately.

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
