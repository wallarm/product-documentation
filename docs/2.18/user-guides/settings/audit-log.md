# User activity log

## Activity log overview

On the **Settings** → **Activity log** tab of Wallarm Console, you can check the history of user actions in the Wallarm system. The logs include information about creating, updating and deleting the following objects:

* IP address or subnet from the [network perimeter](../scanner/check-scope.md)
* Domains from the network perimeter
* Services (ports) from the network perimeter
* Domains and associated IP addresses from the network perimeter
* [Two‑factor authentication](account.md#enabling-two-factor-authentication)
* [Users](users.md)
* Traffic processing [rules](../rules/intro.md)
* [Cloud nodes](../nodes/cloud-node.md)
* [Triggers](../triggers/triggers.md)
* [Integrations](integrations/integrations-intro.md)
* [Blocked IP address](../blacklist.md)
* [Hit sampling](../events/analyze-attack.md#sampling-of-hits)

The logs also include information on the following actions and objects:

* [Vulnerability marked as the false positive](../vulnerabilities/false-vuln.md)
* [Rechecked attack](../events/verify-attack.md)

![!Activity log](../../images/user-guides/settings/audit-log.png)

## Filter the activity log records

The following parameters can be used to filter the activity log records:

* Case sensitive data on the user performed the action

      If the action was performed by the Wallarm technical support team, the username is `Technical support`. This value cannot be used to sort the activity log records.
* Action type
* Name of the object on which the action was performed
* Date when the action was performed
