# Opsgenie

You can set up Wallarm to send alerts to Opsgenie when the following events are triggered:

--8<-- "../include/integrations/events-for-integrations-4.6.md"

## Setting up integration

In [Opsgenie UI](https://app.opsgenie.com/teams/list):

1. Go to your team ➝ **Integrations**.
2. Click the **Add integration** button and choose **API**.
3. Enter the name for a new integration and click **Save Integration**.
4. Copy the provided API key.

In Wallarm UI:

1. Open the **Integrations** section.
2. Click the **Opsgenie** block or click the **Add integration** button and choose **Opsgenie**.
3. Enter an integration name.
4. Paste the copied API key to the **API key** field.
5. If using the [EU instance](https://docs.opsgenie.com/docs/european-service-region) of Opsgenie, select the appropriate Opsgenie API endpoint from the list. By default, the US instance endpoint is set.
6. Choose event types to trigger notifications. If the events are not chosen, then notifications will not be sent.
7. [Test the integration](#testing-integration) and make sure the settings are correct.
8. Click **Add integration**.

    ![Opsgenie integration](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-basic-data.md"

Test Opsgenie notification:

![Test Opsgenie message](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"