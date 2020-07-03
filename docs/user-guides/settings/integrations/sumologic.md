# Sumo Logic

You can set up Wallarm to send messages to Sumo Logic when the following events are triggered:

--8<-- "../include/integrations/advanced-events-for-integrations.md"

## Setting up integration

In Sumo Logic UI:

1. Configure a Hosted Collector following the [instructions](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector).
2. Configure an HTTP Logs & Metrics Source following the [instructions](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source).
3. Copy the provided **HTTP Source Address (URL)**.

In Wallarm UI:

1. Open the **Settings** → **Integrations** tab.
2. Click the **Sumo Logic** block or click the **Add integration** button and choose **Sumo Logic**.
3. Enter an integration name.
4. Paste the copied value of HTTP Source Address (URL) to the **HTTP Source Address (URL)** field.
5. Choose event types to trigger sending messages to Sumo Logic. If the events are not chosen, then messages will not be sent.
6. Click **Add integration**.

![!Sumo Logic integration](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
