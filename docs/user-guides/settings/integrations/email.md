# Email Reports and Notifications

You can enter email addresses that will be used to deliver scheduled reports and instant notifications.

Notifications can be set up for the following events:

* System-related:
  - new user created;
  - integration settings changed.
* Vulnerability detected.
* Network perimeter changed.

You can also schedule a full report delivery on a daily, weekly, or monthly basis.

!!! info
    To add the email addresses, you must have the *Administrator* role in the Wallarm system.


## Add Email Addresses and Configure Notifications

1. Open *Settings* → *Integrations* tab.
2. Click the *Email reports* block or click the *Add integration* button and choose *Email reports*. 

   ![!Adding integration via the button](../../../images/user-guides/settings/add-integration-button.png)
3. Enter email addresses using a comma as a separator.
4. Enter an integration name.
5. Choose the notification types and reports you need.
6. Click *Create*.

Wallarm will now deliver reports and notifications to those email addresses. 


## Disabling Reports and Notifications

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
    * [Slack notifications](slack.md)
    * [Telegram reports and notifications](telegram.md)
    * [OpsGenie notifications](opsgenie.md)
    * [PagerDuty notifications](pagerduty.md)
    * [Splunk notifications](splunk.md)
    * [Sumo Logic notifications](sumologic.md)