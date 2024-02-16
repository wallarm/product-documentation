# Microsoft Sentinel

[Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/) is a solution provided by Microsoft as part of its Azure cloud platform to help organizations monitor, detect, investigate, and respond to security threats and incidents across their entire cloud and on-premises environments. You can set up Wallarm to log events in Microsoft Sentinel.

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
1. Optionally, specify the Azure Sentinel table for Wallarm events. If it does not exist, it will be auto-created. 

    Without a name, separate tables are created for each event type.
1. Choose event types to trigger notifications.

    ![Sentinel integration](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    Details on available events:

    --8<-- "../include/integrations/advanced-events-for-integrations-4.6.md"

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

    You can find Wallarm logs in your Microsoft Workspace → **Logs** → **Custom Logs**, e.g. the test `create_user_CL` log in Microsoft Sentinel looks as follows:

    ![Test Sentinel message](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

    !!! info "Delay in sending data to new workspaces"
        Creating a Workspace on Sentinel for Wallarm integration can take up to 1 hour for all services to function. This delay can result in errors during integration testing and usage. If all integration settings are correct but errors continue to appear, please try again after 1 hour.

1. Click **Add integration**.

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

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
