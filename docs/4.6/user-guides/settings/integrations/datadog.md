# Datadog

[Datadog](https://www.datadoghq.com/) is a popular cloud-based monitoring and analytics platform that provides comprehensive visibility into the performance, availability, and security of modern applications. You can set up Wallarm to send notifications of detected events directly to the Datadog Logs service by creating an appropriate integration via [Datadog API key](https://docs.datadoghq.com/account_management/api-app-keys/) in Wallarm Console.

## Setting up integration

1. Open the Datadog UI → **Organization Settings** → **API Keys** and generate the API key for the integration with Wallarm.
1. Open Wallarm Console → **Integrations** and proceed to the **Datadog** integration setup.
1. Enter an integration name.
1. Paste the Datadog API key to the **API key** field.
1. Select the [Datadog region](https://docs.datadoghq.com/getting_started/site/).
1. Choose event types to trigger notifications.

    ![Datadog integration](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

    Details on available events:

    --8<-- "../include/integrations/advanced-events-for-integrations-4.6.md"

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

    The test Datadog log:

    ![The test Datadog log](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

    To find the Wallarm logs among other records, you can use the `source:wallarm_cloud` search tag in the Datadog Logs service.

1. Click **Add integration**.

## Setting up additional alerts

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
