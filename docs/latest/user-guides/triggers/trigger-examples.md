# Trigger examples

Learn real examples of [Wallarm triggers](triggers.md) to better understand this feature and configure triggers appropriately.

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
