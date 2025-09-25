# Fluentd

[Fluentd](https://www.fluentd.org/)は、汎用で軽量なデータ集約および転送メカニズムとして機能するオープンソースのデータ収集ソフトウェアです。Wallarm Consoleで適切な連携を作成することで、検出イベントの通知をFluentdに送信するようにWallarmを設定できます。

## 通知の形式

Wallarmは**webhooks**を介してJSON形式の通知をFluentdに送信します。含まれるJSONオブジェクトは、Wallarmが通知するイベントによって異なります。

新しいヒット検出の通知例：

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

Fluentdの構成は次の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け付けます
* HTTPSリクエストを受け付けます
* パブリックにアクセス可能なURLがあります

Fluentd構成例：

```bash linenums="1"
<source>
  @type http # HTTP/HTTPSトラフィック用のinputプラグイン
  port 9880 # 受信リクエスト用のポート
  <transport tls> # 接続処理の設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # Fluentdのログをコマンドラインに出力する出力プラグイン
     output_type json # コマンドラインに出力されるログの形式
  </store>
</match>
```

詳細は[公式Fluentdドキュメント](https://docs.datadoghq.com/integrations/fluentd)を参照してください。

## 連携の設定

1. Wallarm Console→**Integrations**→**Fluentd**でFluentd連携の設定に進みます。
1. 連携名を入力します。
1. 送信先FluentdのURL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を構成します：

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. 通知をトリガーするイベント種別を選択します。

    ![Fluentd連携](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

    利用可能なイベントの詳細：

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. **Test integration**をクリックして、構成が正しいこと、Wallarm Cloudの可用性、および通知の形式を確認します。

    テスト用Fluentdログ：

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

## 追加アラートの設定

--8<-- "../include/integrations/integrations-trigger-setup.md"

## 中間データコレクターとしてFluentdを使用する

--8<-- "../include/integrations/webhook-examples/overview.md"

例：

![Webhookのフロー](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

この方式でWallarmのイベントを記録するには：

1. データコレクターが受信webhookを読み取り、次のシステムにログを転送するように構成します。Wallarmはwebhookでデータコレクターにイベントを送信します。
1. SIEMシステムがデータコレクターからログを取得して読み取れるように構成します。
1. Wallarmがデータコレクターにログを送信するように構成します。

    Wallarmはwebhook経由で任意のデータコレクターにログを送信できます。

    WallarmをFluentdまたはLogstashと連携するには、Wallarm Console UIの対応するintegration cardsを使用できます。

    その他のデータコレクターと連携するには、Wallarm Console UIの[webhook integration card](webhook.md)を使用できます。

SIEMシステムにログを転送する一般的なデータコレクターとの連携設定例をいくつか紹介します：

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarmは[Datadog API経由のDatadogとのネイティブ連携](datadog.md)にも対応しています。ネイティブ連携では中間データコレクターは不要です。

## 連携の無効化と削除

--8<-- "../include/integrations/integrations-disable-delete.md"

## システムの利用不可および連携パラメータの誤り

--8<-- "../include/integrations/integration-not-working.md"