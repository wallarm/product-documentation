* [Hits](../../../glossary-en.md#hit) detected except for:

    * Experimental hits detected based on the [custom regular expression](../../rules/regex-rule.md). Non-experimental hits trigger notifications.
    * Hits not saved in the [sample](../../../user-guides/events/analyze-attack.md#sampling-of-hits).

    Optionally include the `headers` object with hit headers in hit logs. If disabled, headers are not included in the logs.

* System related:
    * [User](../../../user-guides/settings/users.md) changes (newly created, deleted, role change)
    * [Integration](integrations-intro.md) changes (disabled, deleted)
    * [Application](../../../user-guides/settings/applications.md) changes (newly created, deleted, name change)
    * Errors during regular update of specifications used for [rogue API detection](../../../api-discovery/rogue-api.md#step-1-upload-specification) or [API specification enforcement](../../../api-specification-enforcement/setup.md#step-1-upload-specification)
* [Vulnerabilities](../../../glossary-en.md#vulnerability) detected, all by default or only for the selected risk level(s) - high, medium or low.
* [Rules](../../../user-guides/rules/rules.md) and [triggers](../../../user-guides/triggers/triggers.md) changed (creating, updating, or deleting the rule or trigger)
* On an hourly basis, you can get a notification with the number of requests processed during the previous hour