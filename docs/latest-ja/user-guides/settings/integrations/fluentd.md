# Fluentd

[Fluentd](https://www.fluentd.org/)は、柔軟かつ軽量なデータ集約および転送機構を備えたオープンソースのデータ収集ソフトウェアです。Wallarmを適切な統合設定をWallarm Consoleで作成することで、検出されたイベントの通知をFluentdに送信するよう設定できます。

## 通知フォーマット

WallarmはJSON形式の**webhooks**を通じてFluentdに通知を送信します。送信されるJSONオブジェクトのセットは、Wallarmが通知するイベントによって異なります。

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

Fluentdの設定は次の要件を満たす必要があります:

* POSTまたはPUTリクエストを受け付ける
* HTTPSリクエストを受け付ける
* パブリックURLを持つ

Fluentdの設定例:

```bash linenums="1"
<source>
  @type http # HTTPおよびHTTPSトラフィック用のインプットプラグイン
  port 9880 # 受信リクエスト用のポート
  <transport tls> # 接続ハンドリング用の設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # コマンドラインにFluentdログを出力するためのアウトプットプラグイン
     output_type json # コマンドラインに出力されるログのフォーマット
  </store>
</match>
```

詳細は[公式Fluentdドキュメント](https://docs.datadoghq.com/integrations/fluentd)をご参照ください。

## 統合の設定

1. Wallarm Console→Integrations→FluentdでFluentd統合の設定に進みます。
1. 統合名を入力します。
1. ターゲットのFluentd URL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を構成します:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. 通知をトリガーするイベントタイプを選択します。

    ![Fluentd integration](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

    利用可能なイベントの詳細:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Test integrationをクリックして、設定内容の正しさ、Wallarm Cloudの稼働状況、通知フォーマットを確認します。

    テスト用Fluentdログ:

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

1. Add integrationをクリックします。

--8<-- "../include/cloud-ip-by-request.md"

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## 中間データ収集ツールとしてFluentdを利用する

--8<-- "../include/integrations/webhook-examples/overview.md"

例:

![Webhook flow](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

このスキームを使用してWallarmイベントをログするには:

1. 受信したwebhookを読み取り、ログを次のシステムに転送するようデータ収集ツールを設定します。Wallarmはwebhookを通じてデータ収集ツールにイベントを送信します。
1. SIEMシステムを設定して、データ収集ツールからログを取得し読み取ります。
1. Wallarmがデータ収集ツールにログを送信するように設定します。

Wallarmはwebhookを通じて任意のデータ収集ツールにログを送信できます。

WallarmをFluentdまたはLogstashと統合するには、Wallarm Console UIにある対応する統合カードを利用できます。

Wallarmを他のデータ収集ツールと統合するには、Wallarm Console UIにある[webhook統合カード](webhook.md)を利用できます。

ログをSIEMシステムに転送する人気のデータ収集ツールとの統合設定例をいくつか紹介します:

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

Wallarmは[Datadog API経由のDatadogとのネイティブ統合](datadog.md)もサポートします。ネイティブ統合では中間のデータ収集ツールを使用する必要がありません。

## 統合の無効化および削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および統合パラメータの不正

--8<-- "../include/integrations/integration-not-working.md"