# Datadog

You can set up Wallarm to send notifications of detected events directly to the Datadog Logs service by creating an appropriate integration via [Datadog API key](https://docs.datadoghq.com/account_management/api-app-keys/) in Wallarm Console.

You can choose the following events to be sent to Datadog:

--8<-- "../include/integrations/advanced-events-for-integrations-4.6.md"

## Setting up integration

1. Open the Datadog UI → **Organization Settings** → **API Keys** and generate the API key for the integration with Wallarm.
1. Open Wallarm Console → **Integrations** and proceed to the **Datadog** integration setup.
1. Enter an integration name.
1. Paste the Datadog API key to the **API key** field.
1. Select the [Datadog region](https://docs.datadoghq.com/getting_started/site/).
1. Choose event types to trigger notifications. If the events are not chosen, then notifications will not be sent.
1. [Test the integration](#testing-integration) and make sure the settings are correct.
1. Click **Add integration**.

![Datadog integration](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-advanced-data.md"

The test Datadog log:

![The test Datadog log](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

To find the Wallarm logs among other records, you can use the `source:wallarm_cloud` search tag in the Datadog Logs service.

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"