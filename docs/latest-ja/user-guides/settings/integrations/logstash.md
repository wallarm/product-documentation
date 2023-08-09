# Logstash

Wallarm Consoleで適切な統合を作成することにより、Wallarmが検出したイベントの通知をLogstashに送信するように設定できます。

次のイベントをLogstashに送信するように選択できます：

--8<-- "../include-ja/integrations/advanced-events-for-integrations.md"

## 通知の形式

Wallarmは、**ウェブフック**を通じてJSON形式でLogstashに通知を送信します。JSONオブジェクトのセットは、Wallarmが通知するイベントに依存します。

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

Logstashの設定は次の要件を満たすべきです：

* POSTまたはPUTのリクエストを受け入れる
* HTTPSのリクエストを受け入れる
* 公開URLを持つ

Logstashの設定例：

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィックの入力プラグイン
    port => 5044 # 入力リクエスト用のポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
    ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
  }
}
output {
  stdout {} # コマンドラインにLogstashのログを表示する出力プラグイン
  ...
}
```

詳細は[公式Logstashドキュメンテーション](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)を参照してください。

## 統合の設定

1. Wallarm Console → **統合** → **Logstash**へ進み、Logstash統合の設定を行います。
1. インテグレーションの名前を入力します。
1. ターゲットのLogstash URL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を行います：

    --8<-- "../include-ja/integrations/webhook-advanced-settings.md"
1. 指定したURLに通知を送信するためのイベントの種類を選択します。イベントが選択されていない場合、通知は送信されません。
1. [統合をテスト](#testing-integration)し、設定が正しいことを確認します。
1. **統合を追加**をクリックします。

![!Logstash integration](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

## 統合のテスト

--8<-- "../include-ja/integrations/test-integration-advanced-data.md"

テストLogstashログ：

```json
[
    {
        summary:"[テストメッセージ] [テストパートナー（US）] 新たな脆弱性が検出されました",
        description:"通知の種類：脆弱性

                    あなたのシステムで新たな脆弱性が検出されました。

                    ID: 
                    タイトル：テスト
                    ドメイン：example.com
                    パス： 
                    メソッド： 
                    発見者： 
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

## 統合の更新

--8<-- "../include-ja/integrations/update-integration.md"

## 統合の無効化

--8<-- "../include-ja/integrations/disable-integration.md"

## 統合の削除

--8<-- "../include-ja/integrations/remove-integration.md"

## Logstashを中間的なデータ収集器として使う

--8<-- "../include-ja/integrations/webhook-examples/overview.md"

例えば：

![!Webhook flow](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

このスキームを使用してWallarmイベントをログに記録するには：

1. データ収集器を設定して、受信webhookを読み、ログを次のシステムに転送します。Wallarmはイベントをウェブフック経由でデータ収集器に送信します。
1. SIEMシステムを設定して、データ収集器からログを取得し、読みます。
1. Wallarmを設定して、ログをデータ収集器に送信します。

    Wallarmはログを任意のデータ収集器にウェブフック経由で送信できます。

    WallarmとFluentdまたはLogstashを統合するには、Wallarm Console UIの対応する統合カードを使用できます。

    Wallarmと他のデータ収集器を統合するには、Wallarm Console UIの[webhook統合カード](webhook.md)を使用できます。

私たちは、人気のあるデータ収集器との統合を設定し、SIEMシステムにログを転送する方法のいくつかの例を記述しました：

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.md)

    また、Wallarmは中間的なデータ収集器を必要とせずに、Datadog APIを通じた[native integration with Datadog](datadog.md)もサポートしています。