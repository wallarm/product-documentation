# Microsoft Sentinel

You can set up Wallarm to log the following events in [Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/):

* [Hits](../../../glossary-en.md#hit) detected except for:

    * Experimental hits detected based on the [custom regular expression](../../rules/regex-rule.md). Non-experimental hits trigger notifications.
    * Hits not saved in the [sample](../../events/analyze-attack.md#sampling-of-hits).
* System related:
    * [User](../../../user-guides/settings/users.md) changes (newly created, deleted, role change)
    * [Integration](integrations-intro.md) changes (disabled, deleted)
    * [Application](../../../user-guides/settings/applications.md) changes (newly created, deleted, name change)
* [Vulnerabilities](../../../glossary-en.md#vulnerability) detected, all by default or only for the selected risk level(s):
    * High risk
    * Medium risk
    * Low risk
* [Rules](../../../user-guides/rules/intro.md) and [triggers](../../../user-guides/triggers/triggers.md) changed (creating, updating, or deleting the rule or trigger)
* [Scope (exposed assets)](../../scanner.md) changed: updates in hosts, services, and domains

## Setting up integration

In the Microsoft UI:

1. [Run Microsoft Sentinel on a Workspace](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-).
1. Proceed to the Sentinel Workspace settings → **Agents** → **Log Analytics agent instructions** and copy the following data:

    * Workspace ID
    * Primary key

In the Wallarm Console UI:

1. Open the **Integrations** section.
1. Click the **Microsoft Sentinel** block or click the **Add integration** button and choose **Microsoft Sentinel**.
1. Enter an integration name.
1. Paste the copied Workspace ID and Primary key.
1. Choose event types to be logged in Microsoft Sentinel. If the events are not chosen, then logs will not be sent.
1. [Test the integration](#testing-integration) and make sure the settings are correct.
1. Click **Add integration**.

    ![!Sentinel integration](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-advanced-data.md"

You can find Wallarm logs in your Microsoft Workspace → **Logs** → **Custom Logs**, e.g. the test `create_user_CL` log in Microsoft Sentinel looks as follows:

![!Test Sentinel message](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

## Types of Wallarm logs

Overall, Wallarm can log in Sentinel the records of the following types:

| Event | Sentinel log type |
| ----- | ----------------- |
| New [hit](../../../glossary-en.md#hit) | `new_hits_CL` |
| New [user](../../../user-guides/settings/users.md) in a company account | `create_user_CL` |
| Deletion of a user from a company account | `delete_user_CL` |
| User role update | `update_user_CL` |
| Deletion of an [integration](integrations-intro.md) | `delete_integration_CL` |
| Disabling an integration | `disable_integration_CL` or `integration_broken_CL` if it was disabled due to incorrect settings |
| New [application](../../../user-guides/settings/applications.md) | `create_application_CL` |
| Deletion of an application | `delete_application_CL` |
| Application name update | `update_application_CL` |
| New [vulnerability](../../../glossary-en.md#vulnerability) of a high risk | `vuln_high_CL` |
| New vulnerability of a medium risk | `vuln_medium_CL` |
| New vulnerability of a low risk | `vuln_low_CL` |
| New [rule](../../../user-guides/rules/intro.md) | `rule_create_CL` |
| Deletion of a rule | `rule_delete_CL` |
| Changes of an existing rule | `rule_update_CL` |
| New [trigger](../../../user-guides/triggers/triggers.md) | `trigger_create_CL` |
| Deletion of a trigger | `trigger_delete_CL` |
| Changes of an existing trigger | `trigger_update_CL` |
| Updates in hosts, services, and domains in [exposed assets](../../scanner.md) | `scope_object_CL` |
| Changes in API inventory (if the corresponding [trigger](../../triggers/triggers.md) is active) | `api_structure_changed_CL` |
| Amount of attacks exceeds the threshold (if the corresponding [trigger](../../triggers/triggers.md) is active) | `attacks_exceeded_CL` |
| New denylisted IP (if the corresponding [trigger](../../triggers/triggers.md) is active) | `ip_blocked_CL` |

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
