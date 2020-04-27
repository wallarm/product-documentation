# OpsGenie Notifications

You can set up Wallarm to send notifications to OpsGenie for the following events:

Notifications can be set up for the following events:

* [Vulnerability](../../../glossary-en.md#vulnerability) detected
* [Hit](../../../glossary-en.md#hit) detected

## Setting up Notifications

1. Add new *API integration* in OpsGenie Dashboard.
2. Copy the API key that was generated upon integration creation in OpsGenie to your clipboard.
3. Open the Wallarm portal in the [EU](https://my.wallarm.com) or [US](https://us1.my.wallarm.com) cloud.
4. Open the *Settings* → *Integrations* tab.
5. Click the *OpsGenie* block or click the *Add integration* button and choose *OpsGenie*.
    
    ![!Adding integration via the button](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)
6. Paste the API key that you copied before into the *API key* field in Wallarm Dashboard.
7. Enter the integration name and select the event types you want to be notified of.
8. Click *Create*.

## Disabling Notifications

1. Go to your Wallarm account > *Settings* > *Integrations* by the link below:
      * https://my.wallarm.com/settings/integrations/ for the [EU cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
      * https://us1.my.wallarm.com/settings/integrations/ for the [US cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)
1. Select an integration and click *Disable*.
1. Click *Save*.

## Removing Integration

1. Go to your Wallarm account > *Settings* > *Integrations* by the link below:

      * https://my.wallarm.com/settings/integrations/ for the [EU cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
      * https://us1.my.wallarm.com/settings/integrations/ for the [US cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)
1. Select an integration and click *Remove*.
1. Click *Sure?*.

!!! info "See also"
    * [Email reports and notifications](email.md)
    * [Slack notifications](slack.md)
    * [Telegram reports and notifications](telegram.md)
    * [PagerDuty notifications](pagerduty.md)
    * [Splunk notifications](splunk.md)
    * [Sumo Logic notifications](sumologic.md)