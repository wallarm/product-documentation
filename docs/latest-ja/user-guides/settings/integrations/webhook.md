# Webhook

Wallarmを使用すると、HTTPSプロトコルを介して受信Webhookを受け入れる任意のシステムに即時通知を送信するよう設定できます。

## 通知フォーマット

通知は、統合設定時に選択した形式に応じてJSON ArrayまたはNew Line Delimited JSON (NDJSON)形式で送信されます。通知が送信されるイベントに応じて、JSONオブジェクトのセットが異なります。例：

* ヒット検出

    === "JSON Array"
        ```json
        [
        {
            "summary": "[Wallarm] New hit detected",
            "details": {
              "client_name": "Test Company",
              "cloud": "EU",
              "notification_type": "new_hits",
              "hit": {
                "domain": "example.com",
                "heur_distance": 20.714285714285715,
                "method": "GET",
                "path": "/",
                "payloads": [
                  "1' select version();"
                ],
                "point": [
                  "get",
                  "id"
                ],
                "probability": 20.714285714285715,
                "remote_country": null,
                "remote_port": 41253,
                "remote_addr4": "8.8.8.8",
                "remote_addr6": null,
                "datacenter": "unknown",
                "tor": "none",
                "request_time": 1703519823,
                "create_time": 1703519826,
                "response_len": 345,
                "response_status": 404,
                "response_time": 359,
                "stamps": [
                  7965
                ],
                "regex": [],
                "stamps_hash": 271168947,
                "regex_hash": -2147483648,
                "type": "sqli",
                "block_status": "monitored",
                "brute_counter": "b:1111:xxxxxxxxxxxxxxxx",
                "final_wallarm_mode": "monitoring",
                "libproton_version": "4.8.0",
                "lom_id": 932,
                "protocol": "rest",
                "proxy_type": null,
                "request_id": "xxxxxxxxxxxxxxxx",
                "wallarm_mode": null,
                "id": [
                  "hits_production_1111_202312_v_1",
                  "xxxxxxxxxxxxxxxx"
                ],
                "object_type": "hit",
                "anomaly": 1.0357142857142858,
                "parameter": "GET_id_value",
                "applications": [
                  "default"
                ]
              }
           }
        },
        {
            "summary": "[Wallarm] New hit detected",
            "details": {
              "client_name": "Test Company",
              "cloud": "EU",
              "notification_type": "new_hits",
              "hit": {
                "domain": "example.com",
                "heur_distance": 2.5,
                "method": "GET",
                "path": "/etc/passwd",
                "payloads": [
                  "/etc/passwd"
                ],
                "point": [
                  "uri"
                ],
                "probability": 2.5,
                "remote_country": null,
                "remote_port": 41254,
                "remote_addr4": "8.8.8.8",
                "remote_addr6": null,
                "datacenter": "unknown",
                "tor": "none",
                "request_time": 1703519826,
                "create_time": 1703519829,
                "response_len": 345,
                "response_status": 404,
                "response_time": 339,
                "stamps": [
                  2907
                ],
                "regex": [],
                "stamps_hash": -1063984326,
                "regex_hash": -2147483648,
                "type": "ptrav",
                "block_status": "monitored",
                "brute_counter": "b:1111:xxxxxxxxxxxxxxxx",
                "final_wallarm_mode": "monitoring",
                "libproton_version": "4.8.0",
                "lom_id": 932,
                "protocol": "none",
                "proxy_type": null,
                "request_id": "xxxxxxxxxxxxxxxx",
                "wallarm_mode": null,
                "id": [
                  "hits_production_1111_202312_v_1",
                  "xxxxxxxxxxxxxxxx"
                ],
                "object_type": "hit",
                "anomaly": 0.22727272727272727,
                "parameter": "URI_value",
                "applications": [
                  "default"
                ]
              }
           }
        }
        ]
        ```
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"summary":"[Wallarm] New hit detected","details":{"client_name":"Test Company","cloud":"EU","notification_type":"new_hits","hit":{"domain":"example.com","heur_distance":20.714285714285715,"method":"GET","path":"/","payloads":["1' select version();"],"point":["get","id"],"probability":20.714285714285715,"remote_country":null,"remote_port":41253,"remote_addr4":"8.8.8.8","remote_addr6":null,"datacenter":"unknown","tor":"none","request_time":1703519823,"create_time":1703519826,"response_len":345,"response_status":404,"response_time":359,"stamps":[7965],"regex":[],"stamps_hash":271168947,"regex_hash":-2147483648,"type":"sqli","block_status":"monitored","brute_counter":"b:1111:xxxxxxxxxxxxxxxx","final_wallarm_mode":"monitoring","libproton_version":"4.8.0","lom_id":932,"protocol":"rest","proxy_type":null,"request_id":"xxxxxxxxxxxxxxxx","wallarm_mode":null,"id":["hits_production_1111_202312_v_1","xxxxxxxxxxxxxxxx"],"object_type":"hit","anomaly":1.0357142857142858,"parameter":"GET_id_value","applications":["default"]}}
        {"summary":"[Wallarm] New hit detected","details":{"client_name":"Test Company","cloud":"EU","notification_type":"new_hits","hit":{"domain":"example.com","heur_distance":2.5,"method":"GET","path":"/etc/passwd","payloads":["/etc/passwd"],"point":["uri"],"probability":2.5,"remote_country":null,"remote_port":41254,"remote_addr4":"8.8.8.8","remote_addr6":null,"datacenter":"unknown","tor":"none","request_time":1703519826,"create_time":1703519829,"response_len":345,"response_status":404,"response_time":339,"stamps":[2907],"regex":[],"stamps_hash":-1063984326,"regex_hash":-2147483648,"type":"ptrav","block_status":"monitored","brute_counter":"b:1111:xxxxxxxxxxxxxxxx","final_wallarm_mode":"monitoring","libproton_version":"4.8.0","lom_id":932,"protocol":"none","proxy_type":null,"request_id":"xxxxxxxxxxxxxxxx","wallarm_mode":null,"id":["hits_production_1111_202312_v_1","xxxxxxxxxxxxxxxx"],"object_type":"hit","anomaly":0.22727272727272727,"parameter":"URI_value","applications":["default"]}}
        ```
* 脆弱性検出

    === "JSON Array"
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
    === "New Line Delimited JSON (NDJSON)"
        ```json
        {"summary":"[Wallarm] New vulnerability detected","description":"Notification type: vuln\nNew vulnerability was detected in your system.\nID: \nTitle: Test\nDomain: example.com\nPath: \nMethod: \nDiscovered by: \nParameter: \nType: Info\nThreat: Medium\nMore details: https://us1.my.wallarm.com/object/555\nClient: TestCompany\nCloud: US","details":{"client_name":"TestCompany","cloud":"US","notification_type":"vuln","vuln_link":"https://us1.my.wallarm.com/object/555","vuln":{"domain":"example.com","id":null,"method":null,"parameter":null,"path":null,"title":"Test","discovered_by":null,"threat":"Medium","type":"Info"}}}
        ```

## 統合の設定

1. Wallarm UI → **Integrations** を開きます。
1. **Webhook**ブロックをクリックするか、**Add integration**ボタンをクリックして**Webhook**を選択します。
1. 統合名を入力します。
1. 対象Webhook URLを入力します。
1. 必要な場合、詳細設定を構成します:

    --8<-- "../include/integrations/webhook-advanced-settings.md"

    ![Advanced settings example](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
1. 通知をトリガーするイベントタイプを選択します。

    ![Webhook integration](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. **Test integration**をクリックして、設定の正確性、Wallarm Cloudの可用性、および通知フォーマットを確認します。テスト通知は、New Line Delimited JSON (NDJSON)が選択されている場合でも常にJSON Array形式で送信されます。
1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

### 例：IPアドレスが拒否リストに追加された場合のWebhook URLへの通知

IPアドレスが拒否リストに追加された場合、このイベントに関するWebhookがWebhook URLに送信されます。

![Example of trigger for denylisted IP](../../../images/user-guides/triggers/trigger-example4.png)

**トリガーをテストするには:**

1. Wallarm Console → **IP lists** → **Denylist** を開き、IPアドレスを拒否リストに追加します。例えば:

    ![Adding IP to the denylist](../../../images/user-guides/triggers/test-ip-blocking.png)
2. 次のWebhookがWebhook URLに送信されたことを確認します:

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

    * 「Notification about denylisted IP」はトリガー名です
    * 「TestCompany」はWallarm Console上の会社アカウント名です
    * 「EU」は会社アカウントが登録されているWallarm Cloudです

## 統合の無効化および削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および統合パラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"