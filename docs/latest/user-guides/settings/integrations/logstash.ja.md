# Logstash

Wallarm を設定して、Wallarm Console で適切なインテグレーションを作成することで、検出されたイベントの通知を Logstash に送信できます。

Logstash に送信されるイベントを次のように選択できます。

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## 通知フォーマット

Wallarm は、**webhooks**を介して JSON 形式で Logstash に通知を送信します。JSON オブジェクトのセットは、Wallarm が通知するイベントによって異なります。

新しいヒットが検出された通知の例:

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

Logstash の設定は、以下の要件を満たす必要があります。

* POST または PUT リクエストを受け入れる
* HTTPS リクエストを受け付ける
* パブリック URL を持っている

Logstash の設定例:

```bash linenums="1"
input {
  http { # input plugin for HTTP and HTTPS traffic
    port => 5044 # port for incoming requests
    ssl => true # HTTPS traffic processing
    ssl_certificate => "/etc/server.crt" # Logstash TLS certificate
    ssl_key => "/etc/server.key" # private key for TLS certificate
  }
}
output {
  stdout {} # output plugin to print Logstash logs on the command line
  ...
}
```

詳細については、[公式 Logstash ドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) を参照してください。

## インテグレーションの設定

1. Wallarm Console → **Integrations** → **Logstash** で Logstash インテグレーションの設定に進みます。
1. インテグレーション名を入力します。
1. 対象の Logstash URL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を構成します。

    --8<-- "../include-ja/integrations/webhook-advanced-settings.md"
1. 指定された URL に通知を送信するトリガーとなるイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
1. [統合テスト](#testing-integration) を行い、設定が正しいことを確認します。
1. **Add integration** をクリックします。

![!Logstash integration](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

## インテグレーションのテスト

--8<-- "../include-ja/integrations/test-integration.md"

テスト Logstash ログ：

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

## インテグレーションの更新

--8<-- "../include-ja/integrations/update-integration.md"

## インテグレーションの無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## インテグレーションの削除

--8<-- "../include-ja/integrations/remove-integration.md"

## Logstash を中間データ収集器として使用する

--8<-- "../include-ja/integrations/webhook-examples/overview.md"

例：

![!Webhook flow](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

このスキームを使用して Wallarm イベントを記録するには：

1. データ収集器を設定して、着信 Webhooks を読み取り、ログを次のシステムに転送します。Wallarm は、Webhooks 経由でデータ収集器にイベントを送信します。
1. SIEM システムを設定して、データ収集器からログを取得および読み取ります。
1. Wallarm を設定して、データ収集器にログを送信します。

    Wallarm は、Webhooks 経由でデータ収集器にログを送信できます。

    Wallarm を Fluentd や Logstash と統合するには、Wallarm Console UI で対応する統合カードを使用できます。

    Wallarm を他のデータ収集器と統合するには、Wallarm Console UI の [webhook 統合カード](webhook.md) を使用できます。

SIEM システムにログを転送する人気のデータ収集器とのインテグレーションを設定する方法の例をいくつか説明しました。

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    また、Wallarm は [Datadog API を介した Datadog とのネイティブな統合](datadog.md) をサポートしています。ネイティブ統合では、中間データ収集器を使用する必要はありません。