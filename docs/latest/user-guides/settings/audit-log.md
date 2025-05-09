# User Activity Log

On the **Settings** → **Activity log** tab of Wallarm Console, you can check the history of user actions in the Wallarm system. The logs include information about creating, updating and deleting the following objects:

* Domains from the network perimeter
* Services (ports) from the network perimeter
* Domains and associated IP addresses from the network perimeter
* [Two‑factor authentication](account.md#enabling-two-factor-authentication)
* [API tokens](api-tokens.md)
* [Users](users.md)
* Traffic processing [rules](../rules/rules.md)
* [Custom ruleset backups](../rules/rules.md#backup-and-restore)
* [Wallarm nodes](../nodes/nodes.md)
* [Triggers](../triggers/triggers.md)
* [Integrations](integrations/integrations-intro.md)
* [Blocked IP address](../ip-lists/overview.md)
* [Hit sampling](../events/grouping-sampling.md#sampling-of-hits)
* Records in [IP lists](../ip-lists/overview.md)
* [Applications](applications.md)

The logs also include information on the following actions and objects:

* Changes in Wallarm general settings ([general filtration mode](../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console), [limit request processing time and response to it](../rules/configure-overlimit-res-detection.md#general-configuration), [logout management](users.md#logout-management) settings)
* [Vulnerability marked as the false positive](../vulnerabilities.md#vulnerability-lifecycle)
* [Rechecked attack](../../vulnerability-detection/threat-replay-testing/overview.md)

![Activity log](../../images/user-guides/settings/audit-log.png)

**To filter the activity log records**, you can use the following parameters:

* Action type
* Type of the object on which the action was performed
* Case sensitive data on the user performed the action

      If the action was performed by the Wallarm technical support team, the username is `Technical support`. This value cannot be used to sort the activity log records.

* Range of dates you are interested in

Activity Log provides details for each event, such as name and particular type (not just "rule" but "Set filtration mode" rule) of object, parameter values (old and new) and so on.

You can use the search field to find records with specific details (enter specific object name, IP address, rule or trigger type etc.)
