* [Hits](../../../glossary-en.md#hit) detected except for:

    * Experimental hits detected based on the [custom regular expression](../../rules/regex-rule.md). Non-experimental hits trigger notifications.
    * Hits not saved in the [sample](../../events/grouping-sampling.md#sampling-of-hits).

* System related:
    * [User](../../../user-guides/settings/users.md) changes (newly created, deleted, role change)
    * [Integration](integrations-intro.md) changes (disabled, deleted)
    * [Application](../../../user-guides/settings/applications.md) changes (newly created, deleted, name change)
* [Vulnerabilities](../../../glossary-en.md#vulnerability) detected, all by default or only for the selected risk level(s) - high, medium or low.
* [Rules](../../../user-guides/rules/rules.md) and [triggers](../../../user-guides/triggers/triggers.md) changed (creating, updating, or deleting the rule or trigger)
* [Scope (exposed assets)](../../scanner.md) changed: updates in hosts, services, and domains
* (Requires [AASM Enterprise](../../../api-attack-surface/setup.md#enabling)) [Security issues](../../../api-attack-surface/security-issues.md) detected, all or only for the selected [risk level(s)](../../../api-attack-surface/security-issues.md#issue-risk-level):
    * Critical risk
    * High risk
    * Medium risk
    * Low risk
    * Info risk
* On an hourly basis, you can get a notification with the number of requests processed during the previous hour