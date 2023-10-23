# Webhook

You can set up Wallarm to send instant notifications to any system that accepts incoming webhooks via HTTPS protocol.

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
1. Click the **Webhook** block or click the **Add integration** button and choose **Webhook**.
1. Enter an integration name.
1. Enter target Webhook URL.
1. If required, configure advanced settings:

    --8<-- "../include/integrations/webhook-advanced-settings.md"

    ![Advanced settings example](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
1. Choose event types to trigger notifications.

    ![Webhook integration](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

    Details on available events:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Click **Test integration** to check configuration correctness, availability of the Wallarm Cloud, and the notification format.
1. Click **Add integration**.

## Setting up additional alerts

--8<-- "../include/integrations/integrations-trigger-setup.md"

### Example: notification to Webhook URL if IP address is added to the denylist

If an IP address was added to the denylist, the webhook about this event will be sent to Webhook URL.

![Example of trigger for denylisted IP](../../../images/user-guides/triggers/trigger-example4.png)

**To test the trigger:**

1. Open the Wallarm Console → **IP lists** → **Denylist** and add the IP address to the denylist. For example:

    ![Adding IP to the denylist](../../../images/user-guides/triggers/test-ip-blocking.png)
2. Check that the following webhook was sent to the Webhook URL:

    ```
    [
        {
            "summary": "[Wallarm] Trigger: New IP address was denylisted",
            "description": "Notification type: ip_blocked\n\nIP address 1.1.1.1 was denylisted until 2021-06-10 02:27:15 +0300 for the reason Produces many attacks. You can review blocked IP addresses in the \"Denylist\" section of Wallarm Console.\nThis notification was triggered by the \"Notification about denylisted IP\" trigger. The IP is blocked for the application Application #8.\n\nClient: TestCompany\nCloud: EU\n",
            "details": {
            "client_name": "TestCompany",
            "cloud": "EU",
            "notification_type": "ip_blocked",
            "trigger_name": "Notification about denylisted IP",
            "application": "Application #8",
            "reason": "Produces many attacks",
            "expire_at": "2021-06-10 02:27:15 +0300",
            "ip": "1.1.1.1"
            }
        }
    ]
    ```

    * `Notification about denylisted IP` is the trigger name
    * `TestCompany` is the name of your company account in Wallarm Console
    * `EU` is the Wallarm Cloud where your company account is registered

## Disabling and deleting an integration

--8<-- "../include/integrations/integrations-disable-delete.md"

## System unavailability and incorrect integration parameters

--8<-- "../include/integrations/integration-not-working.md"
