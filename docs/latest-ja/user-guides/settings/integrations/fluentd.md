# Fluentd

Wallarmを設定して、適切な統合を作成することで、検出されたイベントの通知をFluentdに送信できます。

Fluentdに送信する以下のイベントを選択できます。

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## 通知フォーマット

Wallarmは、JSON形式で**Webhooks**を介してFluentdに通知を送信します。 JSONオブジェクトのセットは、Wallarmが通知するイベントによって異なります。

新しいヒットの検出を通知する例：

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

Fluentdの設定は、以下の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* 公開URLを持つ

Fluentdの設定例：

```bash linenums="1"
<source>
  @type http # input plugin for HTTP and HTTPS traffic
  port 9880 # port for incoming requests
  <transport tls> # configuration for connections handling
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # output plugin to print Fluentd logs on the command line
     output_type json # format of logs printed on the command line
  </store>
</match>
```

詳細については、[公式Fluentdドキュメント](https://docs.datadoghq.com/integrations/fluentd)を参照してください。

## 統合の設定

1. Wallarm Console → **Integrations** → **Fluentd**でFluentd統合の設定に進みます。
1. 統合名を入力します。
1. ターゲットFluentd URL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を構成します：

    --8<-- "../include-ja/integrations/webhook-advanced-settings.md"
1. 指定されたURLに通知を送信するイベントの種類を選択します。 イベントが選択されていない場合、通知は送信されません。
1. [統合をテスト](#testing-integration)して、設定が正しいことを確認します。
1. **Add integration**をクリックします。

![!Fluentd integration](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## 統合のテスト

--8<-- "../include-ja/integrations/test-integration.md"

テストFluentdログ：

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

--8<-- "../include-ja/integrations/update-integration.md"

## 統合の無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## 統合の削除

--8<-- "../include-ja/integrations/remove-integration.md"

## Fluentdを中間データ収集者として使用する

--8<-- "../include-ja/integrations/webhook-examples/overview.md"

例：

![!Webhook flow](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

このスキームを使用してWallarmイベントをログに記録するには：

1. データ収集者を構成して、Webhooksで届くデータを次のシステムに転送します。 WallarmはWebhooksを介してデータ収集者へイベントを送信します。
1. SIEMシステムを構成して、データ収集者からログを取得および読み取ります。
1. Wallarmを構成して、データ収集者にログを送信します。

    WallarmはWebhooksを介して任意のデータ収集者にログを送信できます。

    WallarmをFluentdやLogstashと統合するには、Wallarm Console UIで対応する統合カードを使用できます。

    Wallarmを他のデータ収集者と統合するには、Wallarm Console UIで[webhook統合カード](webhook.md)を使用できます。

SIEMシステムにログを転送する人気のあるデータ収集者との統合を設定する方法のいくつかの例を説明しました：

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarmは、[Datadog API経由のDatadogとのネイティブ統合](datadog.md)もサポートしています。このネイティブ統合では、中間データ収集者を使用する必要はありません。