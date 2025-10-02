# Addressing Wallarm Node Issues Alerted by OWASP Dashboard

When Wallarm nodes are not updated or face synchronization issues with the Cloud, error messages appear on the [OWASP dashboard](../user-guides/dashboards/owasp-api-top-ten.md) in the **API8:2023 Security Misconfiguration** section indicating problems that can impact infrastructure security. This article describes how to address these issues.

## Wallarm node is outdated

Outdated nodes may lack important security updates, allowing malicious traffic to bypass defenses. Synchronization issues can disrupt the nodes' functionality, preventing them from receiving vital security policies from the Cloud. These issues are primarily related to the **OWASP API8 (Security Misconfiguration)** threat, where a missing security solution in any part of the application stack can make the system vulnerable. To prevent this, the dashboard alerts you to node operation issues, e.g.:

![OWASP dash with node issues](../images/user-guides/dashboard/owasp-dashboard-node-issues.png)

To maintain a secure environment, it is crucial to regularly update Wallarm nodes and address synchronization problems. If your Wallarm node version is [at or approaching its end-of-life](../updating-migrating/versioning-policy.md#version-list), it is recommended to upgrade your node to the latest version.

## Wallarm node and Cloud have synchronization issues

If you encounter issues with Wallarm Cloud synchronization, make sure that the [corresponding settings](../admin-en/configure-cloud-node-synchronization-en.md) are correct.

If you need assistance in resolving synchronization or other issues or any other requests, you can seek help from the [Wallarm support team](mailto:support@wallarm.com). Provide them with the following [logs](../admin-en/configure-logging.md) for analysis:

* Logs from `/opt/wallarm/var/log/wallarm/wcli-out.log` to check for any problems with the `syncnode` script
* Logs from the `/var/log/syslog` or `/var/log/messages` directory (depending on the deployment option) to provide additional details about the synchronization issue

### custom_ruleset and proton.db

The important files to be updated during Cloud-node synchronization, are [`custom_ruleset`](../user-guides/rules/rules.md#ruleset-lifecycle) and [`proton.db`](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors). Search for them in your OS, they can be located in `/opt/wallarm/etc/wallarm` or another folder depending on the self-hosted node [installation method](../installation/supported-deployment-options.md).

```
-rw-r--r--    1 wallarm  wallarm      93774 Aug 20 07:40 custom_ruleset
-rw-r--r--    1 wallarm  wallarm        406 Jul 29 20:09 libproton.json
-rw-r-----    1 wallarm  wallarm        680 Aug 20 07:40 node.yaml
-rw-r--r--    1 wallarm  wallarm       1675 Aug 20 07:40 private.key
-rw-r--r--    1 wallarm  wallarm     363659 Aug 20 13:01 proton.db
-rw-r--r--    1 wallarm  wallarm          6 Jul 29 20:11 version
```

The mentioned and other files must have correct group (second column with `wallarm`), this group should be the same as the one running NGINX's workers (check with `ps aux|grep nginx`)

### custom_ruleset version

Problems with [`custom_ruleset`](../user-guides/rules/rules.md#ruleset-lifecycle) synchronization can be caused by inconsistency between min custom ruleset version set for you by Wallarm support group and the node version:

1. Get your custom ruleset version via node's [statistics service](../admin-en/configure-statistics-service.md#usage) - `custom_ruleset_ver`. For example:

    ```
    curl -s http://127.0.0.8/wallarm-status | jq -c '{custom_ruleset_ver}'
    ```

1. Get your Wallarm node version, for example via Wallarm Console → **Nodes** → your node details, bottom of the window.
1. Get your settings via Wallarm [API](../api/overview.md), `/v2/client/{clientid}/rules/settings`. For example:

    ```
    curl -X GET "https://us1.api.wallarm.com/v2/client/<client_id>/rules/settings"  \
         -H "accept: application/json" \
         -H 'X-WallarmAPI-Token: <TOKEN>'
    ```

## Node uuid and/or secret cannot be detected

You can see the following message in **just created or updated** node logs "Can't detect node uuid and/or secret, please add node to cloud first."

On node creation and update, it is registered in a Cloud. The mentioned message may mean that this registration was not successful which will prevent node and Cloud from syncing (only [basic](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors) detection in a [monitoring](../admin-en/configure-wallarm-mode.md) mode, no [rules](../user-guides/rules/rules.md), [mitigation controls](../about-wallarm/mitigation-controls-overview.md) or [lists](../user-guides/ip-lists/overview.md) will come from Cloud, no monitoring results will arrive to Cloud).

**Node registered**

The quickest way to make sure the node was registered successfully is to check its presence in Wallarm Console → [**Nodes**](../user-guides/nodes/nodes.md) section. The further syncing status can also be checked here.

To generally resolve "not registered node" issues, contact the [Wallarm support team](https://support.wallarm.com/).

**When you do not need to worry**

Sometimes, the "Can't detect node uuid and/or secret, please add node to cloud first" message can appear BEFORE the node registration process is finished and you see in the log:

```
YYYY-MM-DD HH:MM:SS* INFO syncnodeXXXXX: Triggers result: 1 success, 0 skipped, 0 errors
```

Thus, if registration errors go BEFORE this message, you can ignore them - they will disappear after registration.
