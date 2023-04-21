# ServiceNow

You can set up Wallarm to create trouble tickets in ServiceNow when the following events are triggered:

* System related:
    * [User](../../../user-guides/settings/users.md) changes (newly created, deleted, role change)
    * [Integration](integrations-intro.md) changes (disabled, deleted)
    * [Application](../../../user-guides/settings/applications.md) changes (newly created, deleted, name change)
* [Vulnerabilities](../../../glossary-en.md#vulnerability) detected, all by default or only for the selected risk level(s):
    * High risk
    * Medium risk
    * Low risk
* [Scope (exposed assets)](../../scanner.md) changed: updates in hosts, services, and domains

## Setting up integration

In ServiceNow UI:

1. Get name of your ServiceNow instance.
1. Gen username and password to access the instance.
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

    ![!ServiceNow integration](../../../images/user-guides/settings/integrations/add-servicenow-integration-TBD.png)

## Testing integration

--8<-- "../include/integrations/test-integration-basic-data.md"

Test ServiceNow trouble ticket creation:

![!Test ServiceNow trouble ticket creation](../../../images/user-guides/settings/integrations/test-servicenow-trouble-ticket-creation-TBD.png)

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
