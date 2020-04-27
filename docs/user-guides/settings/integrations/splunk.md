#   Splunk Notifications

You can set up Wallarm to send notifications to Splunk for the following events:

*   System-related:
    *   new user created
    *   integration settings changed
*   [Vulnerability](../../../glossary-en.md#vulnerability) detected
*   Network perimeter changed
*  [Hit](../../../glossary-en.md#hit) detected

##  Setting up Notifications

Perform the following actions in the Splunk interface:

1.  Proceed to the *Settings* → *Add data* menu section.
2.  Select *Monitor* to proceed to the *Select Source* step.
3.  Select *HTTP Event Collector* and enter the integration name into the *Name* field. All other fields are optional.
4.  Press the *Next* button to proceed to the *Input Settings* step.
5.  On the *Input Settings* step, you can keep the default configuration and click the *Review* button.
6.  On the *Review* step, check the correctness of the configuration. Click the *Submit* button to confirm the settings and proceed to the *Done* step.
7.  The generated token is displayed in the *Token Value* field on the *Done* step. Copy it to the clipboard to enter it into the *HEC Token* field when later creating a Splunk integration in the Wallarm interface.

Perform the following actions in the Wallarm interface:

1. Proceed to the *Integrations* tab of the *Settings* section.
2. Click the *Splunk* block or click the *Add integration* button and choose *Splunk*.

   ![!Adding integration via the button](../../../images/user-guides/settings/integrations/add-splunk-integration.png)
3. Paste the token value generated in Splunk into the *HEC Token* field.
4. Paste the URL of your Splunk instance into the *API URL* field. For example, if you are using the Splunk cloud, the URL should be similar to the following: `https://prd-p-tj2xx2f2xntv.cloud.splunk.com`.
5. Enter the integration name and select the event types you want to be notified of.
6. Click *Create*.

Now notifications for events of the selected types will appear in Splunk.

## Disabling Notifications

1. Go to your Wallarm account > *Settings* > *Integrations* by the link below:
      * https://my.wallarm.com/settings/integrations/ for the [EU cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
      * https://us1.my.wallarm.com/settings/integrations/ for the [US cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)
2. Select an integration and click *Disable*.
3. Click *Save*.

## Removing Integration

1. Go to your Wallarm account > *Settings* > *Integrations* by the link below:
      * https://my.wallarm.com/settings/integrations/ for the [EU cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#eu-cloud)
      * https://us1.my.wallarm.com/settings/integrations/ for the [US cloud](../../../quickstart-en/how-wallarm-works/qs-intro-en.md#us-cloud)
2. Select an integration and click *Remove*.
3. Click *Sure?*.

!!! info "See also"
    * [Email reports and notifications](email.md)
    * [Slack notifications](slack.md)
    * [Telegram reports and notifications](telegram.md)
    * [OpsGenie notifications](opsgenie.md)
    * [PagerDuty notifications](pagerduty.md)
    * [Sumo Logic notifications](sumologic.md)
