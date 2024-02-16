# Webhook

You can set up Wallarm to send instant notifications to any system that accepts incoming webhooks via HTTPS protocol. For this, specify Webhook URL to receive the notifications for the following event types:

--8<-- "../include/integrations/advanced-events-for-integrations-4.6.md"

## Notification format

Notifications are sent in JSON format. The set of JSON objects depends on the event for which the notification is sent. For example:

* Hit detected

    ```json
    [
        {
            "summary": "[Wallarm] New hit detected",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "new_hits",
            "hit": {
                "domain": "www.example.com",
                "heur_distance": 0.01111,
                "method": "POST",
                "parameter": "SOME_value",
                "path": "/news/some_path",
                "payloads": [
                    "say ni"
                ],
                "point": [
                    "post"
                ],
                "probability": 0.01,
                "remote_country": "PL",
                "remote_port": 0,
                "remote_addr4": "8.8.8.8",
                "remote_addr6": "",
                "tor": "none",
                "request_time": 1603834606,
                "create_time": 1603834608,
                "response_len": 14,
                "response_status": 200,
                "response_time": 5,
                "stamps": [
                    1111
                ],
                "regex": [],
                "stamps_hash": -22222,
                "regex_hash": -33333,
                "type": "sqli",
                "block_status": "monitored",
                "id": [
                    "hits_production_999_202010_v_1",
                    "c2dd33831a13be0d_AC9"
                ],
                "object_type": "hit",
                "anomaly": 0
                }
            }
        }
    ]
    ```
* Vulnerability detected

    ```json
    [
        {
            summary:"[Wallarm] New vulnerability detected",
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
    ]
    ```

## Setting up integration

1. Open Wallarm UI → **Integrations**.
2. Click the **Webhook** block or click the **Add integration** button and choose **Webhook**.
3. Enter an integration name.
4. Enter target Webhook URL.
5. If required, configure advanced settings:

    --8<-- "../include/integrations/webhook-advanced-settings.md"

    ![Advanced settings example](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
6. Choose event types to trigger sending notifications to Webhook URL. If the events are not chosen, then notifications will not be sent.
7. [Test the integration](#testing-integration) and make sure the settings are correct.
8. Click **Add integration**.

    ![Webhook integration](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

## Examples of integrations

--8<-- "../include/integrations/webhook-examples/overview.md"

We described some examples of how to configure the integration with the popular log collectors forwarding logs to the SIEM systems:

* With **Fluentd** configured to forward logs to [IBM QRadar](webhook-examples/fluentd-qradar.md), [Splunk Enterprise](webhook-examples/fluentd-splunk.md), [ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md), [Datadog](webhook-examples/fluentd-logstash-datadog.md)
* With **Logstash** configured to forward logs to [IBM QRadar](webhook-examples/logstash-qradar.md), [Splunk Enterprise](webhook-examples/logstash-splunk.md), [ArcSight Logger](webhook-examples/logstash-arcsight-logger.md), [Datadog](webhook-examples/fluentd-logstash-datadog.md)

## Testing integration

--8<-- "../include/integrations/test-integration-advanced-data.md"

Test webhook example:

```json
[
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
]
```

## Updating integration

--8<-- "../include/integrations/update-integration.md"

## Disabling integration

--8<-- "../include/integrations/disable-integration.md"

## Deleting Integration

--8<-- "../include/integrations/remove-integration.md"
