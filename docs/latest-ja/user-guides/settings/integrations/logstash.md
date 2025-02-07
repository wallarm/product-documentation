# Logstash

[Logstash](https://www.elastic.co/logstash) はElasticが開発したオープンソースのデータ処理およびログ管理ツールです。Wallarmを設定して、検出されたイベントの通知をLogstashに送信できます。

## 通知フォーマット

WallarmはJSON形式の**webhooks**を介してLogstashに通知を送信します。JSONオブジェクトのセットは、Wallarmが通知するイベントによって異なります。

新たに検出されたヒットの通知例:

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

## 要件

Logstashの設定は以下の要件を満たす必要があります:

* POSTおよびPUTリクエストを受け付けます
* HTTPSリクエストを受け付けます
* パブリックURLを持ちます

Logstashの設定例:

```bash linenums="1"
input {
  http { # HTTPとHTTPSトラフィック用のinputプラグイン
    port => 5044 # 受信リクエスト用のポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
    ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
  }
}
output {
  stdout {} # コマンドライン上にLogstashログを出力するoutputプラグイン
  ...
}
```

詳細は[公式Logstashドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)をご覧ください。

## 統合の設定

1. Wallarm Console → **Integrations** → **Logstash**でLogstash統合の設定に進みます。
2. 統合名を入力します。
3. 対象のLogstash URL (Webhook URL)を指定します。
4. 必要に応じて詳細設定を行います:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
5. 通知をトリガーするイベントタイプを選択します。

    ![Logstash統合](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

6. **Test integration**をクリックして、設定の正確性、Wallarm Cloudの到達性、および通知フォーマットをご確認ください。

    テスト用のLogstashログ:

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

7. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## 中間データ収集ツールとしてのLogstashの利用

--8<-- "../include/integrations/webhook-examples/overview.md"

例えば:

![Webhookのフロー](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

このスキームを使用してWallarmイベントをログに記録するには:

1. データ収集ツールを構成して、受信したwebhooksを読み取り、ログを次のシステムに転送します。Wallarmはwebhooksを介してイベントをデータ収集ツールに送信します。
2. SIEMシステムを構成して、データ収集ツールからログを取得し読み取ります。
3. Wallarmを構成して、データ収集ツールにログを送信します。

Wallarmはwebhooksを介して任意のデータ収集ツールにログを送信できます。

WallarmをFluentdまたはLogstashと統合するには、Wallarm Console UIの該当する統合カードを使用できます。

Wallarmをその他のデータ収集ツールと統合するには、Wallarm Console UIの[webhook統合カード](webhook.md)を使用できます。

ログをSIEMシステムに転送する人気のデータ収集ツールとの統合の設定例をいくつか説明します:

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

Wallarmは[Datadog API経由のDatadogとのネイティブ統合](datadog.md)もサポートします。ネイティブ統合では中間データ収集ツールは不要です。

## 統合の無効化および削除

--8<-- "../include/integrations/integrations-disable-delete.md"