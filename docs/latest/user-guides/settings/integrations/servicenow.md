# ServiceNow

[ServiceNow](https://www.servicenow.com/) is a cloud-based platform that provides a range of IT service management (ITSM) and business process automation solutions for enterprises. You can set up Wallarm to create trouble tickets in ServiceNow.

## Requirements

ServiceNow is a platform to help companies manage digital workflows for enterprise operations. Your company needs an owned ServiceNow [instance and workflow apps built within it](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html) to integrate these apps with Wallarm.

## Setting up integration

In ServiceNow UI:

1. Get name of your [ServiceNow instance](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html).
1. Get username and password to access the instance.
1. Enable OAuth authentication and get client ID and secret as described [here](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html).

In Wallarm UI:

1. Open Wallarm Console → **Integrations** → **ServiceNow**.
1. Enter an integration name.
1. Enter the ServiceNow instance name.
1. Enter username and password to access the specified instance.
1. Enter OAuth authentication data: client ID and secret.
1. Choose event types to trigger notifications.

    ![ServiceNow integration](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

    Details on available events:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the target system, and the notification format.

    This will send the test notifications with the prefix `[Test message]`.

1. Click **Add integration**.

--8<-- "../include/cloud-ip-by-request.md"

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
