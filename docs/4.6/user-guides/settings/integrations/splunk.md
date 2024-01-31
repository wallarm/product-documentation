[splunk-dashboard-by-wallarm-img]: ../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

#   Splunk

[Splunk](https://www.splunk.com/) is a platform designed for searching, monitoring, and analyzing machine-generated data, including logs, events, and other forms of operational and business data.  You can set up Wallarm to send alerts to Splunk.

##  Setting up integration

In Splunk UI:

1. Open **Settings** ➝ **Add Data** ➝ **Monitor**.
2. Select the **HTTP Event Collector** option, enter an integration name and click **Next**.
3. Skip choosing the data type at the **Input Settings** page and continue to **Review Settings**.
4. Review and **Submit** the settings.
5. Copy the provided token.

In Wallarm UI:

1. Open the **Integrations** section.
1. Click the **Splunk** block or click the **Add integration** button and choose **Splunk**.
1. Enter an integration name.
1. Paste the copied token into the **HEC token** field.
1. Paste HEC URI and the port number of your Splunk instance into the **HEC URI:PORT** field. For example: `https://hec.splunk.com:8088`.
1. Choose event types to trigger notifications.

    ![Splunk integration](../../../images/user-guides/settings/integrations/add-splunk-integration.png)

    Details on available events:

    --8<-- "../include/integrations/advanced-events-for-integrations-4.6.md"

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.

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

1. Click **Add integration**.

--8<-- "../include/cloud-ip-by-request.md"

## Setting up additional alerts

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Getting events organized into a dashboard

--8<-- "../include/integrations/application-for-splunk.md"

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
