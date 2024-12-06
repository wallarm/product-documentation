# Sumo Logic

[Sumo Logic](https://www.sumologic.com/) is a cloud-native, machine data analytics platform that provides organizations with real-time insights into their IT operations, security, and application performance.  You can set up Wallarm to send messages to Sumo Logic.

## Setting up integration

In Sumo Logic UI:

1. Configure a Hosted Collector following the [instructions](https://help.sumologic.com/03Send-Data/Hosted-Collectors/Configure-a-Hosted-Collector).
2. Configure an HTTP Logs & Metrics Source following the [instructions](https://help.sumologic.com/03Send-Data/Sources/02Sources-for-Hosted-Collectors/HTTP-Source).
3. Copy the provided **HTTP Source Address (URL)**.

In Wallarm UI:

1. Open the **Integrations** section.
1. Click the **Sumo Logic** block or click the **Add integration** button and choose **Sumo Logic**.
1. Enter an integration name.
1. Paste the copied value of HTTP Source Address (URL) to the **HTTP Source Address (URL)** field.
1. Choose event types to trigger notifications.

    ![Sumo Logic integration](../../../images/user-guides/settings/integrations/add-sumologic-integration.png)

    Details on available events:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

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

1. Click **Add integration**.

--8<-- "../include/cloud-ip-by-request.md"

## Setting up additional alerts

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
