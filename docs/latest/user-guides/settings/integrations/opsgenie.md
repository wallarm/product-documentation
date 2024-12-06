# Opsgenie

[Opsgenie](https://www.atlassian.com/software/opsgenie) is an incident management and alerting tool by Atlassian. You can set up Wallarm to send alerts to Opsgenie.

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

--8<-- "../include/cloud-ip-by-request.md"

## Setting up additional alerts

--8<-- "../include/integrations/integrations-trigger-setup.md"

### Example: Opsgenie notification if 2 or more incidents are detected in one second

If 2 or more incidents with the application server or database are detected in one second, the notification about this event will be sent to Opsgenie.

![Example of a trigger sending the data to Splunk](../../../images/user-guides/triggers/trigger-example3.png)

**To test the trigger**, it is required to send the attack exploiting an active vulnerability to the protected resource. The Wallarm Console → **Vulnerabilities** section displays active vulnerabilities detected in your applications and the examples of attacks that exploit these vulnerabilities.

If the attack example is sent to the protected resource, Wallarm will record the incident. Two or more recorded incidents will trigger sending the following notification to Opsgenie:

```
[Wallarm] Trigger: The number of incidents exceeded the threshold

Notification type: incidents_exceeded

The number of detected incidents exceeded 1 in 1 second.
This notification was triggered by the "Notification about incidents" trigger.

Additional trigger’s clauses:
Target: server, database.

View events:
https://my.wallarm.com/attacks?q=incidents&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Client: TestCompany
Cloud: EU
```

* `Notification about incidents` is the trigger name
* `TestCompany` is the name of your company account in Wallarm Console
* `EU` is the Wallarm Cloud where your company account is registered

!!! info "Protecting the resource from active vulnerability exploitation"
    To protect the resource from active vulnerability exploitation, we recommend patching the vulnerability in a timely manner. If the vulnerability cannot be patched on the application side, please configure a [virtual patch](../../rules/vpatch-rule.md) to block attacks exploiting this vulnerability.

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
