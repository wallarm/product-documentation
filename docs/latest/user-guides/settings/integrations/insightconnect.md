# InsightConnect

[InsightConnect](https://www.rapid7.com/products/insightconnect/) is a security orchestration, automation, and response (SOAR) platform designed to help organizations streamline and automate their cybersecurity operations, making it easier to detect, investigate, and respond to security incidents and threats. You can set up Wallarm to send notifications to InsightConnect.

## Setting up integration

First, generate and copy an API key as follows:

1. Open the InsightConnect's UI → **Settings** → [**API Keys** page](https://insight.rapid7.com/platform#/apiKeyManagement) and click **New User Key**.
2. Enter an API key name (e.g. `Wallarm API`) and click **Generate**.
3. Copy the generated API key.
4. Go to Wallarm UI → **Integrations** in the [US](https://us1.my.wallarm.com/integrations/) or [EU](https://my.wallarm.com/integrations/) cloud and click **InsightConnect**.
4. Paste the API key that you copied before into the **API key** field.

Secondly, generate and copy an API URL as follows:

1. Go back to the InsightConnect's UI, open the **Automation** → **Workflows** page and create a new workflow for the Wallarm notification.
2. When asked to choose a trigger, choose the **API Trigger**.
3. Copy the generated URL.
4. Go back to Wallarm UI → **InsightConnect** configuration and paste the API URL that you copied before into the **API URL** field.

Thirdly, finish the setup in Wallarm UI:

1. Enter an integration name.
1. Choose event types to trigger notifications.

    ![InsightConnect integration](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

    Details on available events:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

    This will send the test notifications with the prefix `[Test message]`:

    ![Test InsightConnect notification](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

1. Click **Add integration**.

--8<-- "../include/cloud-ip-by-request.md"

## Setting up additional alerts

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
