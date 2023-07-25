# Webhook

Wallarmは、HTTPSプロトコルを通じて受信webhooksを認める任意のシステムへの瞬時の通知を送信するように設定することができます。このために、以下のイベントタイプの通知を受信するためのWebhook URLを指定します：

--8<-- "../include/integrations/advanced-events-for-integrations.ja.md"

## 通知の形式

通知はJSONフォーマットで送信されます。JSONオブジェクトのセットは、通知が送信されるイベントに依存します。例えば：

* ヒット検出

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
* 脆弱性検出

    ```json
    [
        {
            summary:"[Wallarm] New vulnerability detected",
            description:"Notification type: vuln

                        　　システムに新しい脆弱性が検出されました。

                        ID: 
                        タイトル: Test
                        ドメイン: example.com
                        パス: 
                        メソッド: 
                        発見者: 
                        パラメーター: 
                        タイプ: Info
                        脅威: Medium

                        詳細情報：https://us1.my.wallarm.com/object/555


                        クライアント：TestCompany
                        クラウド：US

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

## インテグレーションの設定

1. Wallarm UI → **インテグレーション**を開きます。
2. **Webhook** ブロックをクリックするか、**インテグレーションを追加** ボタンをクリックして **Webhook** を選択します。
3. インテグレーションの名前を入力します。
4. ターゲットWebhook URLを入力します。
5. 必要に応じて、詳細設定を設定します：

    --8<-- "../include/integrations/webhook-advanced-settings.ja.md"

    ![!詳細設定の例](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
6. 通知送信をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
7. [インテグレーションをテスト](#integration-testing)し、設定が正しいことを確認します。
8. **インテグレーションを追加** をクリックします。

    ![!Webhook integration](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

## インテグレーションの例

--8<-- "../include/integrations/webhook-examples/overview.ja.md"

人気のログコレクターとのインテグレーションの設定例をいくつか紹介します。これらのログコレクターはログをSIEMシステムに転送します：

* **Fluentd**は、ログを [IBM QRadar](webhook-examples/fluentd-qradar.ja.md), [Splunk Enterprise](webhook-examples/fluentd-splunk.ja.md), [ArcSight Logger](webhook-examples/fluentd-arcsight-logger.ja.md), [Datadog](webhook-examples/fluentd-logstash-datadog.ja.md) へ転送するように設定されています。
* **Logstash**は、ログを [IBM QRadar](webhook-examples/logstash-qradar.ja.md), [Splunk Enterprise](webhook-examples/logstash-splunk.ja.md), [ArcSight Logger](webhook-examples/logstash-arcsight-logger.ja.md), [Datadog](webhook-examples/fluentd-logstash-datadog.ja.md) へ転送するように設定されています。

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-advanced-data.ja.md"

Webhookのテスト例：

```json
[
    {
        summary:"[Test message] [Test partner(US)] New vulnerability detected",
        description:"Notification type: vuln

                    　　システムに新しい脆弱性が検出されました。

                    ID: 
                    タイトル：Test
                    ドメイン：example.com
                    パス：
                    メソッド：
                    発見者：
                    パラメーター：
                    タイプ：Info
                    脅威：Medium

                    詳細情報：https://us1.my.wallarm.com/object/555

                    クライアント: TestCompany
                    クラウド: US                    
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

## インテグレーションの更新

--8<-- "../include/integrations/update-integration.ja.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.ja.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.ja.md"