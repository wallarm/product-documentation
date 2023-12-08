# Weak JWTs Detection

Starting from Wallarm node version 4.4, Wallarm's [WAAP](link TBD) supports [Weak JWTs](../../attacks-vulns-list.md#weak-jwt) detection and it is enabled by default.

## Pre-configured trigger

New company accounts are featured by the pre-configured (default) **Weak JWT** trigger which, if a significant amount of incoming requests processed by the Wallarm node contains weak JWTs, records the corresponding [vulnerability](../vulnerabilities.md).

## Disabling and re-enabling weak JWTs detection

To disable weak JWTs detection, you can disable or delete the pre-configured **Weak JWT** trigger in Wallarm Console → **Triggers** section. To resume detection, re-enable or re-create the trigger.

Note that only one **Weak JWT** trigger can exist. If it is already presented, it will not be listed in the trigger creation dialog.

## Example

Here is the example of trigger enabling Weak JVTs detection.

![Example for trigger on weak JWTs](../../images/user-guides/triggers/trigger-example-weak-jwt.png)

**To test the trigger:**

1. Generate a JWT signed using a [compromised secret key](https://github.com/wallarm/jwt-secrets), e.g.:

    ```
    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiQWRtaW5pc3RyYXRvciJ9.p5DrumkF6oTBiUmdtDRT5YHqYL2D7p5YOp6quUrULYg
    ```
1. Generate some traffic with requests authenticated using a compromised JWT.
1. If a significant amount of incoming requests processed by the node 4.4 or above contains weak JWTs, Wallarm registers the vulnerability, e.g.:

    ![JWT vuln example](../../images/user-guides/vulnerabilities/weak-auth-vuln.png)
