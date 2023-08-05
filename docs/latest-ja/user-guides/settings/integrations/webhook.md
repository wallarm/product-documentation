# Webhook

Wallarmを任意のシステムへ即時通知を送付するよう設定することができます。通知を送付するためのシステムはHTTPプロコトコルを通じて受信するWebhookを受け入れることができる必要があります。これを行うには、以下のイベントタイプを受信するためのWebhook URLを指定してください：

--8<-- "../include/integrations/advanced-events-for-integrations.md"

## 通知形式

通知はJSON形式で送られます。JSONオブジェクトのセットは、通知が送られるイベントによります。例えば：

* ヒット検出

    ```json
    [
        {
            "summary": "[Wallarm] 新しいヒットが検出されました",
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
            summary:"[Wallarm] 新しい脆弱性が検出されました",
            description:"通知種類: 脆弱性

                        あなたのシステムで新しい脆弱性が検出されました。

                        ID: 
                        タイトル: テスト
                        ドメイン: example.com
                        パス: 
                        メソッド: 
                        検出者: 
                        パラメータ: 
                        型: 情報
                        脅威: 中程度

                        詳細: https://us1.my.wallarm.com/object/555


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

## インテグレーションの設定

1. Wallarm UI → **インテグレーション**を開きます。
2. **Webhook** ブロックをクリックするか、**インテグレーションを追加** ボタンをクリックして**Webhook**を選択します。
3. インテグレーション名を入力します。
4. 目標とするWebhook URLを入力します。
5. 必要に応じて、詳細設定を行います：

    --8<-- "../include/integrations/webhook-advanced-settings.md"

    ![!Advanced settings example](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
6. Webhook URLへの通知送信をトリガするイベントタイプを選択します。何もイベントが選択されなかった場合、通知は送られません。
7. [インテグレーションをテスト](#testing-integration)し、設定が正しいことを確認します。
8. **インテグレーションを追加**をクリックします。

    ![!Webhook integration](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

## インテグレーションの例

--8<-- "../include/integrations/webhook-examples/overview.md"

以下に、人気のログ収集器を設定してログをSIEMシステムに転送する方法についての例をいくつか説明します：

* [IBM QRadar](webhook-examples/fluentd-qradar.md)、[Splunk Enterprise](webhook-examples/fluentd-splunk.md)、[ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)、[Datadog](webhook-examples/fluentd-logstash-datadog.md)へのログ転送を設定した**Fluentd**とともに
* [IBM QRadar](webhook-examples/logstash-qradar.md)、[Splunk Enterprise](webhook-examples/logstash-splunk.md)、[ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)、[Datadog](webhook-examples/fluentd-logstash-datadog.md)へのログ転送を設定した**Logstash**とともに

## インテグレーションのテスト

--8<-- "../include/integrations/test-integration-advanced-data.md"

ウェブフックの例をテストします：

```json
[
    {
        summary:"[テストメッセージ] [Test partner(US)] 新しい脆弱性が検出されました",
        description:"通知種類: 脆弱性

                    あなたのシステムで新しい脆弱性が検出されました。

                    ID: 
                    タイトル: テスト
                    ドメイン: example.com
                    パス: 
                    メソッド: 
                    検出者: 
                    パラメータ: 
                    型: 情報
                    脅威: 中程度

                    さらなる詳細: https://us1.my.wallarm.com/object/555


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

--8<-- "../include/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include/integrations/remove-integration.md"