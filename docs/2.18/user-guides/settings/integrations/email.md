# Email Report

You can set additional email addresses that will be used to deliver scheduled [PDF reports](../../../user-guides/search-and-filters/custom-report.md) and instant notifications. Sending messages to your primary email is configured by default.

* Scheduled PDF reports can be sent on a daily, weekly, or monthly basis. PDF reports include detailed information about vulnerabilities, attacks, and incidents detected in your system over the selected period.
* Notifications include brief details of triggered events:
    --8<-- "../include/integrations/events-for-integrations-mail.md"

## Setting up integration

1. Open the **Integrations** section.
2. Click the **Email report** block or click the **Add integration** button and choose **Email report**. 
3. Enter an integration name.
4. Enter email addresses using a comma as a separator.
5. Choose the frequency of sending security reports. If the frequency is not chosen, then reports will not be sent.
6. Choose event types to trigger notifications. If the events are not chosen, then notifications will not be sent.
7. [Test the integration](#testing-integration) and make sure the settings are correct.
8. Click **Add integration**.

    ![Email report integration](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-with-email.md"

Test notification example:

![Test email message](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"