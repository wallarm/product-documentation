# Email Report

You can set additional email addresses that will be used to deliver scheduled [PDF reports](../../../user-guides/search-and-filters/custom-report.md) and instant notifications. Sending messages to your primary email is configured by default.

Scheduled PDF reports can be sent on a daily, weekly, or monthly basis. PDF reports include detailed information about vulnerabilities, attacks, and incidents detected in your system over the selected period. Notifications include brief details of triggered events.

## Setting up integration

1. Open the **Integrations** section.
1. Click the **Email report** block or click the **Add integration** button and choose **Email report**. 
1. Enter an integration name.
1. Enter email addresses using a comma as a separator.
1. Choose the frequency of sending security reports. If the frequency is not chosen, then reports will not be sent.
1. Choose event types to trigger notifications.

    ![Email report integration](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

    Details on available events:

    --8<-- "../include/integrations/events-for-integrations-mail.md"

    !!! info "Notifications that cannot be disabled"
        Wallarm will also send to your user email some notifications that cannot be disabled:

        * [Subscription](../../../about-wallarm/subscription-plans.md) notifications
        * [API token expiration](../../../user-guides/settings/api-tokens.md#token-expiration) notifications
        * [Hit sampling](../../../user-guides/events/grouping-sampling.md#sampling-of-hits) notifications

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

    This will send the test notifications with the prefix `[Test message]`:

    ![Test email message](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

1. Click **Add integration**.

## Setting up additional alerts

* Number of [attacks](../../../glossary-en.md#attack), [hits](../../../glossary-en.md#hit) or incidents per time interval (day, hour, etc.) exceeds the set number
* [Changes in API](../../../api-discovery/track-changes.md) took place
* New user was added to the company account

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
