# Opsgenie

You can set up Wallarm to send alerts to Opsgenie.

## Setting up integration

In [Opsgenie UI](https://app.opsgenie.com/teams/list):

1. Go to your team ➝ **Integrations**.
2. Click the **Add integration** button and choose **API**.
3. Enter the name for a new integration and click **Save Integration**.
4. Copy the provided API key.

In Wallarm UI:

1. Open the **Integrations** section.
1. Click the **Opsgenie** block or click the **Add integration** button and choose **Opsgenie**.
1. Enter an integration name.
1. Paste the copied API key to the **API key** field.
1. If using the [EU instance](https://docs.opsgenie.com/docs/european-service-region) of Opsgenie, select the appropriate Opsgenie API endpoint from the list. By default, the US instance endpoint is set.
1. Choose event types to trigger notifications.

    ![Opsgenie integration](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

    Details on available events:
      
    --8<-- "../include/integrations/events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

    This will send the test notifications with the prefix `[Test message]`:

    ![Test Opsgenie message](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

1. Click **Add integration**.

## Setting up additional alerts

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
