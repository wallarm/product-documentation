# Addressing Wallarm node issues alerted by OWASP dashboards

When Wallarm nodes are not updated or face synchronization issues with the Cloud, error messages appear on the [OWASP dashboards](../user-guides/dashboards/owasp-api-top-ten.md) indicating problems that can impact infrastructure security. This article describes how to address these issues.

Outdated nodes may lack important security updates, allowing malicious traffic to bypass defenses. Synchronization issues can disrupt the nodes' functionality, preventing them from receiving vital security policies from the Cloud. These issues are primarily related to the **OWASP API7 (Security Misconfiguration)** threat, where a missing security solution in any part of the application stack can make the system vulnerable. To prevent this, the dashboard alerts you to node operation issues, e.g.:

![OWASP dash with node issues](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

To maintain a secure environment, it is crucial to regularly update Wallarm nodes and address synchronization problems. Here are instructions on how to handle the error messages:

1. If your Wallarm node version is [at or approaching its end-of-life](../updating-migrating/versioning-policy.md#version-list), it is recommended to upgrade your node to the latest version.
1. If you encounter issues with Wallarm Cloud synchronization, make sure that the [corresponding settings](../admin-en/configure-cloud-node-synchronization-en.md) are correct.

If you need assistance in resolving synchronization or other issues or any other requests, you can seek help from the [Wallarm support team](mailto:support@wallarm.com). Provide them with the following [logs](../admin-en/configure-logging.md) for analysis:

* Logs from `/var/log/wallarm/syncnode.log` or `/opt/wallarm/var/log/wallarm/syncnode-out.log` [depending on a node installation method](../admin-en/configure-logging.md) to check for any problems with the `syncnode` script
* Logs from the `/var/log/syslog` or `/var/log/messages` directory (depending on the deployment option) to provide additional details about the synchronization issue
