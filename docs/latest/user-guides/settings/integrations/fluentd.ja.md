# Fluentd

Wallarmを設定してFluentdに検出されたイベントの通知を送信するには、Wallarm Consoleで適切な統合を作成します。

Fluentdに送信する次のイベントを選択できます。

--8<-- "../include/integrations/advanced-events-for-integrations.ja.md"

## 通知の形式

Wallarmは**webhooks**を介してFluentdにJSON形式の通知を送信します。 JSONオブジェクトのセットは、Wallarmが通知するイベントに依存します。

新しいヒットが検出された通知の例：

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

Fluentdの構成は次の要件を満たす必要があります：

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* 公開URLを持つ

Fluentdの設定例：

```bash linenums="1"
<source>
  @type http # HTTPおよびHTTPSトラフィックの入力プラグイン
  port 9880 # 受信リクエストのポート
  <transport tls> # 接続の処理を設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # コマンドラインでFluentdログを出力するプラグイン
     output_type json # コマンドラインで出力するログの形式
  </store>
</match>
```

詳細は[公式のFluentdドキュメンテーション](https://docs.datadoghq.com/integrations/fluentd)で確認できます。

## 統合の設定

1. Wallarm Console → **Integrations** → **Fluentd**でFluentd統合の設定に進みます。
1. 統合の名前を入力します。
1. Fluentd URL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を行います：

    --8<-- "../include/integrations/webhook-advanced-settings.ja.md"
1. 指定したURLに通知を送るためにトリガーするイベントの種類を選びます。イベントが選ばれていない場合、通知は送信されません。
1. [統合をテスト](#testing-integration)して、設定が正しいことを確認します。
1. **統合を追加**をクリックします。

![!Fluentd integration](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## 統合のテスト

--8<-- "../include/integrations/test-integration-advanced-data.ja.md"

Fluentdのログをテスト。

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

## 統合の更新

--8<-- "../include/integrations/update-integration.ja.md"

## 統合の無効化

--8<-- "../include/integrations/disable-integration.ja.md"

## 統合の削除

--8<-- "../include/integrations/remove-integration.ja.md"

## Fluentdを中間データコレクターとして使用する

--8<-- "../include/integrations/webhook-examples/overview.ja.md"

例えば：

![!Webhook flow](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

このスキームを使用してWallarmイベントをログに記録するには：

1. データコレクターを設定して、受け入れ先のwebhookを読み取り、ログを次のシステムに転送します。 Wallarmは、webhookを介してデータコレクターにイベントを送信します。
1. SIEMシステムを設定して、データコレクターからログを取得して読み取ります。
1. Wallarmを設定して、データコレクターにログを送信します。

    Wallarmは、webhookを利用して任意のデータコレクターにログを送信できます。

    FluentdまたはLogstashとWallarmを統合するには、Wallarm Console UIの対応する統合カードを使用できます。

    Wallarmと他のデータコレクターを統合するには、Wallarm Console UIの[webhook統合カード](webhook.ja.md)を使用できます。

私たちは人気のあるデータコレクターを統合し、SIEMシステムにログを転送する方法のいくつかの例を説明しました：

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.ja.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.ja.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.ja.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.ja.md)

    Wallarmはまた、[Datadog APIを経由したDatadogとのネイティブな統合](datadog.ja.md)もサポートしています。ネイティブな統合では、中間データコレクターを使用する必要はありません。