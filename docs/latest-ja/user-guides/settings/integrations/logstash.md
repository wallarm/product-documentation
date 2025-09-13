# Logstash

[Logstash](https://www.elastic.co/logstash)はElasticにより開発されたオープンソースのデータ処理およびログ管理ツールです。WallarmをLogstashに検出イベントの通知を送信するように設定できます。

## 通知形式

Wallarmは**webhooks**によるJSON形式でLogstashに通知を送信します。JSONオブジェクトのセットは、Wallarmが通知するイベントによって異なります。

新しいhitが検出された場合の通知例:

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

Logstashの構成は次の要件を満たす必要があります:

* POSTまたはPUTリクエストを受け付けること
* HTTPSリクエストを受け付けること
* パブリックURLを持っていること

Logstashの構成例:

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィック用のinputプラグイン
    port => 5044 # 受信リクエスト用のポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
    ssl_key => "/etc/server.key" # TLS証明書用の秘密鍵
  }
}
output {
  stdout {} # コマンドラインにLogstashのログを出力するためのoutputプラグイン
  ...
}
```

詳細は[Logstashの公式ドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)をご参照ください。

## インテグレーションの設定

1. Wallarm Console → **Integrations** → **Logstash**でLogstashインテグレーションの設定に進みます。
1. インテグレーション名を入力します。
1. 対象のLogstash URL（Webhook URL）を指定します。
1. 必要に応じて詳細設定を構成します:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. 通知をトリガーするイベントタイプを選択します。

    ![Logstashインテグレーション](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. **Test integration**をクリックして、設定の正しさ、Wallarm Cloudの可用性、および通知形式を確認します。

    テスト用Logstashログ:

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

1. **Add integration**をクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加のアラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## 中間データコレクターとしてLogstashを使用する

--8<-- "../include/integrations/webhook-examples/overview.md"

例:

![Webhookフロー](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

この方式でWallarmのイベントを記録するには:

1. データコレクターが受信したwebhooksを読み取り、ログを次のシステムに転送するように構成します。Wallarmはwebhooks経由でイベントをデータコレクターに送信します。
1. SIEMシステムがデータコレクターからログを取得して読み取れるように構成します。
1. Wallarmがログをデータコレクターに送信するように構成します。

    Wallarmはwebhooksを介して任意のデータコレクターにログを送信できます。

    WallarmをFluentdまたはLogstashと統合するには、Wallarm Console UIの対応するintegration cardsを使用できます。

    その他のデータコレクターとWallarmを統合するには、Wallarm Console UIの[webhook integration card](webhook.md)を使用できます。

以下に、SIEMシステムへログを転送する一般的なデータコレクターとのインテグレーション設定例をいくつか示します:

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarmは[Datadog API経由のDatadogとのネイティブインテグレーション](datadog.md)にも対応しています。ネイティブインテグレーションでは中間データコレクターは不要です。

## インテグレーションの無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"