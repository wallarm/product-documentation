# Addressing Wallarm Node Issues Alerted by OWASP Dashboard

When Wallarm nodes are not updated or face synchronization issues with the Cloud, error messages appear on the [OWASP dashboard](../user-guides/dashboards/owasp-api-top-ten.md) indicating problems that can impact infrastructure security. This article describes how to address these issues.

## Wallarm node is outdated

Outdated nodes may lack important security updates, allowing malicious traffic to bypass defenses. Synchronization issues can disrupt the nodes' functionality, preventing them from receiving vital security policies from the Cloud. These issues are primarily related to the **OWASP API8 (Security Misconfiguration)** threat, where a missing security solution in any part of the application stack can make the system vulnerable. To prevent this, the dashboard alerts you to node operation issues, e.g.:

![OWASP dash with node issues](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

To maintain a secure environment, it is crucial to regularly update Wallarm nodes and address synchronization problems. If your Wallarm node version is [at or approaching its end-of-life](../updating-migrating/versioning-policy.md#version-list), it is recommended to upgrade your node to the latest version.

## Wallarm node and Cloud have synchronization issues

If you encounter issues with Wallarm Cloud synchronization, make sure that the [corresponding settings](../admin-en/configure-cloud-node-synchronization-en.md) are correct.

If you need assistance in resolving synchronization or other issues or any other requests, you can seek help from the [Wallarm support team](mailto:support@wallarm.com). Provide them with the following [logs](../admin-en/configure-logging.md) for analysis:

* Logs from `/opt/wallarm/var/log/wallarm/wcli-out.log` to check for any problems with the `syncnode` script
* Logs from the `/var/log/syslog` or `/var/log/messages` directory (depending on the deployment option) to provide additional details about the synchronization issue

## Node uuid and/or secret cannot be detected

You can see the following message in **just created or updated** node logs "Can't detect node uuid and/or secret, please add node to cloud first."

On node creation and update, it is registered in a Cloud. The mentioned message may mean that this registration was not successful which will prevent node and Cloud from syncing (only [basic](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) detection in a [monitoring](../admin-en/configure-wallarm-mode.md) mode, no [rules](../user-guides/rules/rules.md) or [lists](../user-guides/ip-lists/overview.md) will come from Cloud, no monitoring results will arrive to Cloud).

**Node registered**

The quickest way to make sure the node was registered successfully is to check its presence in Wallarm Console → [**Nodes**](../user-guides/nodes/nodes.md) section. The further syncing status can also be checked here.

To generally resolve "not registered node" issues, contact the [Wallarm support team](https://support.wallarm.com/).

**When you do not need to worry**

Sometimes, the "Can't detect node uuid and/or secret, please add node to cloud first" message can appear BEFORE the node registration process is finished and you see in the log:

```
YYYY-MM-DD HH:MM:SS* INFO syncnodeXXXXX: Triggers result: 1 success, 0 skipped, 0 errors
```

Thus, if registration errors go BEFORE this message, you can ignore them - they will disappear after registration.
