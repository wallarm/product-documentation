# ServiceNow

You can set up Wallarm to create trouble tickets in [ServiceNow](https://www.servicenow.com/) when the following events are triggered:

--8<-- "../include/integrations/events-for-integrations-mail.md"

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
1. Select event types to trigger notifications. If nothing is selected, ServiceNow trouble tickets will not be created.
1. [Test the integration](#testing-integration) and make sure the settings are correct.
1. Click **Add integration**.

![ServiceNow integration](../../../images/user-guides/settings/integrations/add-servicenow-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-basic-data.md"

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"