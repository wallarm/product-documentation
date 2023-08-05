# Fluentd

Wallarmを設定して、適切な統合をWallarm Consoleで作成することで、検出したイベントの通知をFluentdに送信できます。

次のイベントをFluentdに送信するように選択できます：

--8<-- "../include/integrations/advanced-events-for-integrations.md"

## 通知フォーマット

Wallarmは、**ウェブフック**を介してJSON形式でFluentdに通知を送信します。JSONオブジェクトのセットは、Wallarmが通知するイベントによります。

新たに検出されたヒットの通知の例：

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

## 要件

Fluentdの設定は以下の要件を満たすべきです：

* POSTまたはPUTのリクエストを受け入れる
* HTTPSのリクエストを受け入れる
* 公開URLを持つ

Fluentdの設定例：

```bash linenums="1"
<source>
  @type http # HTTPおよびHTTPSトラフィックの入力プラグイン
  port 9880 # 受信リクエストのポート
  <transport tls> # コネクション処理の設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
     @type stdout # コマンドライン上のFluentdのログを表示する出力プラグイン
     output_type json # コマンドラインに表示されるログの形式
  </store>
</match>
```

詳細は[公式Fluentdドキュメンテーション](https://docs.datadoghq.com/integrations/fluentd)をご覧ください。

## 統合の設定

1. Wallarm Console → **統合** → **Fluentd** でFluentdの統合設定に進みます。
1. 統合の名前を入力します。
1. FluentdのターゲットURL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を設定します：

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. 指定したURLに通知を送信するためのイベントタイプを選択します。もしイベントが選択されていない場合、通知は送信されません。
1. [統合をテスト](#統合のテスト)し、設定が正しいことを確認します。
1. **統合を追加**をクリックします。

![Fluentd統合](../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## 統合のテスト

--8<-- "../include/integrations/test-integration-advanced-data.md"

テストFluentdログ：

```json
[
    {
        summary:"[試験メッセージ] [試験パートナー（US）] 新しい脆弱性が検出されました。",
        description:"通知タイプ: 脆弱性

                    あなたのシステムで新しい脆弱性が検出されました。

                    ID: 
                    タイトル: テスト
                    ドメイン: example.com
                    パス: 
                    メソッド: 
                    発見者: 
                    パラメータ: 
                    タイプ: インフォ
                    脅威: 中級

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
                title:"テスト",
                discovered_by:null,
                threat:"中級",
                type:"インフォ"
            }
        }
    }
]
```

## 統合の更新

--8<-- "../include/integrations/update-integration.md"

## 統合の無効化

--8<-- "../include/integrations/disable-integration.md"

## 統合の削除

--8<-- "../include/integrations/remove-integration.md"

## Fluentdを中間データ収集器として使用する

--8<-- "../include/integrations/webhook-examples/overview.md"

例えば：

![Webhookフロー](../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

このスキームを使用してWallarmイベントをログに記録するには：

1. データ収集器を設定して、受信ウェブフックを読み取り、次のシステムにログを転送します。Wallarmはウェブフック経由でデータ収集器にイベントを送信します。
1. SIEMシステムを設定して、データ収集器からログを取得し、読み取ります。
1. Wallarmを設定して、データ収集器にログを送信します。

    Wallarmはウェブフックを介して任意のデータ収集器にログを送信できます。

    WallarmとFluentdまたはLogstashを統合するには、Wallarm Console UIの対応する統合カードを使用できます。

    Wallarmと他のデータ収集器を統合するには、Wallarm Console UIの[ウェブフック統合カード](webhook.md)を使用できます。

我々はSIEMシステムにログを転送する人気のあるデータ収集器との統合を設定する例をいくつか説明しました：

* [Wallarm → Fluentd → IBM QRadar](webhook-examples/fluentd-qradar.md)
* [Wallarm → Fluentd → Splunk Enterprise](webhook-examples/fluentd-splunk.md)
* [Wallarm → Fluentd → Micro Focus ArcSight Logger](webhook-examples/fluentd-arcsight-logger.md)
* [Wallarm → Fluentd → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    Wallarmはまた、[Datadog APIを介したDatadogとのネイティブな統合](datadog.md)をサポートしています。ネイティブな統合では、中間データ収集器を使用する必要はありません。