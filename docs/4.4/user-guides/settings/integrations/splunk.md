[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

#   Splunk

You can set up Wallarm to send alerts to Splunk when the following events are triggered:

--8<-- "../include/integrations/advanced-events-for-integrations-4.6.md"

##  Setting up integration

In Splunk UI:

1. Open **Settings** ➝ **Add Data** ➝ **Monitor**.
2. Select the **HTTP Event Collector** option, enter an integration name and click **Next**.
3. Skip choosing the data type at the **Input Settings** page and continue to **Review Settings**.
4. Review and **Submit** the settings.
5. Copy the provided token.

In Wallarm UI:

1. Open the **Integrations** section.
2. Click the **Splunk** block or click the **Add integration** button and choose **Splunk**.
3. Enter an integration name.
4. Paste the copied token into the **HEC token** field.
5. Paste HEC URI and the port number of your Splunk instance into the **HEC URI:PORT** field. For example: `https://hec.splunk.com:8088`.
6. Choose event types to trigger notifications. If the events are not chosen, then Splunk alerts will not be sent.
7. [Test the integration](#testing-integration) and make sure the settings are correct.
8. Click **Add integration**.

![Splunk integration](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

--8<-- "../include/cloud-ip-by-request.md"

## Getting events organized into a dashboard

--8<-- "../include/integrations/application-for-splunk.md"

## Testing integration

--8<-- "../include/integrations/test-integration-advanced-data.md"

Test Splunk notification in the JSON format:

```json
{
    summary:"[Test message] [Test partner(US)] New vulnerability detected",
    description:"Notification type: vuln

                New vulnerability was detected in your system.

                ID: 
                Title: Test
                Domain: example.com
                Path: 
                Method: 
                Discovered by: 
                Parameter: 
                Type: Info
                Threat: Medium

                More details: https://us1.my.wallarm.com/object/555


                Client: TestCompany
                Cloud: US
                ",
    details:{
        client_name:"TestCompany",
        cloud:"US",
        notification_type:"vuln",
        vuln_link:"https://us1.my.wallarm.com/object/555",
        vuln:{
            domain:"example.com",
            id:null,
            method:null,
            parameter:null,
            path:null,
            title:"Test",
            discovered_by:null,
            threat:"Medium",
            type:"Info"
        }
    }
}
```

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting integration

--8<-- "../include/integrations/remove-integration.md"
