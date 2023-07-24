# Webhook

Wallarm をセットアップして、HTTPS プロトコルを介して Incoming webhooks を受け入れる任意のシステムにインスタント通知を送信できます。これにより、次のイベントタイプの通知を受信するための Webhook URL を指定してください。

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## 通知フォーマット

通知は JSON 形式で送信されます。JSON オブジェクトのセットは、通知が送信されるイベントによって異なります。例：

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
            description:"通知タイプ：vuln

                        あなたのシステムで新しい脆弱性が見つかりました。

                        ID: 
                        タイトル：テスト
                        ドメイン：example.com
                        パス：
                        メソッド：
                        検出者：
                        パラメータ：
                        タイプ：情報
                        脅威：中

                        詳細：https://us1.my.wallarm.com/object/555


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

1. Wallarm UI → **Integrations** を開きます。
2. **Webhook** ブロックをクリックするか、**インテグレーションを追加** ボタンをクリックして **Webhook** を選択します。
3. インテグレーション名を入力します。
4. ターゲット Webhook URL を入力します。
5. 必要に応じて、詳細設定を構成します：

    --8<-- "../include-ja/integrations/webhook-advanced-settings.md"

    ![!詳細設定の例](../../../images/user-guides/settings/integrations/additional-webhook-settings.png)
6. イベントタイプを選択して、Webhook URL に通知を送信するトリガーにします。イベントが選択されていない場合、通知は送信されません。
7. [インテグレーションをテスト](#testing-integration) して、設定が正しいことを確認します。
8. **インテグレーションを追加** をクリックします。

    ![!Webhook インテグレーション](../../../images/user-guides/settings/integrations/add-webhook-integration.png)

## インテグレーションの例

--8<-- "../include-ja/integrations/webhook-examples/overview.md"

人気のログコレクターを使用して SIEM システムにログを転送する方法についてのいくつかの例を説明しました。

* **Fluentd** が設定されていて、[IBM QRadar](webhook-examples/fluentd-qradar.md)、[Splunk Enterprise](webhook-examples/fluentd-splunk.md)、[ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)、[Datadog](webhook-examples/fluentd-logstash-datadog.md) にログを転送します。
* **Logstash** が設定されていて、[IBM QRadar](webhook-examples/logstash-qradar.md)、[Splunk Enterprise](webhook-examples/logstash-splunk.md)、[ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)、[Datadog](webhook-examples/fluentd-logstash-datadog.md) にログを転送します。

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration.md"

テスト Webhook の例：

```json
[
    {
        summary:"[テストメッセージ] [テストパートナー(US)] 新しい脆弱性が検出されました",
        description:"通知タイプ: vuln

                    あなたのシステムで新しい脆弱性が見つかりました。

                    ID: 
                    タイトル：テスト
                    ドメイン：example.com
                    パス：
                    メソッド：
                    検出者：
                    パラメータ：
                    タイプ：情報
                    脅威：中

                    詳細：https://us1.my.wallarm.com/object/555


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

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"
