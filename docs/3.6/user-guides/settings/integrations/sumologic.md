# Sumo Logic

You can set up Wallarm to send messages to Sumo Logic when the following events are triggered:

--8<-- "../include/integrations/advanced-events-for-integrations-4.6.md"

## Setting up integration

In Sumo Logic UI:

1. Configure a Hosted Collector following the [instructions](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector).
2. Configure an HTTP Logs & Metrics Source following the [instructions](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source).
3. Copy the provided **HTTP Source Address (URL)**.

In Wallarm UI:

1. Open the **Integrations** section.
2. Click the **Sumo Logic** block or click the **Add integration** button and choose **Sumo Logic**.
3. Enter an integration name.
4. Paste the copied value of HTTP Source Address (URL) to the **HTTP Source Address (URL)** field.
5. Choose event types to trigger sending messages to Sumo Logic. If the events are not chosen, then messages will not be sent.
6. [Test the integration](#testing-integration) and make sure the settings are correct.
7. Click **Add integration**.

![Sumo Logic integration](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

## Testing integration

--8<-- "../include/integrations/test-integration-advanced-data.md"

Test Sumo Logic notification:

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