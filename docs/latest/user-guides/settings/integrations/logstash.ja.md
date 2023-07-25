# Logstash

Wallarm Consoleで適切な統合を作成することにより、検出されたイベントの通知をLogstashに送信するようにWallarmを設定できます。

Logstashに送信する次のイベントを選択できます：

--8<-- "../include/integrations/advanced-events-for-integrations.ja.md"

## 通知形式

Wallarmは、JSON形式の**webhook**を通じてLogstashに通知を送信します。JSONオブジェクトのセットは、Wallarmが通知するイベントによって異なります。

新たに検出されたヒットの通知の例：

```json
[
    {
        "summary": "[Wallarm] 新しいヒットが検出されました",
        "details": {
        "client_name": "テスト会社",
        "cloud": "EU",
        "notification_type": "new_hits",
        "hit": {
            "domain": "www.example.com",
            "heur_distance": 0.01111,
            "method": "POST",
            "parameter": "いくつかの値",
            "path": "/news/いくつかのパス",
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
            "tor": "なし",
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

Logstashの設定は、以下の要件を満たす必要があります：

* POSTまたはPUTリクエストを受け入れます
* HTTPSリクエストを受け入れます
* 公開URLを持っています

Logstashの設定例：

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィックの入力プラグイン
    port => 5044 # 入ってきたリクエストのポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
    ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
  }
}
output {
  stdout {} # Logstashのログをコマンドラインに出力する出力プラグイン
  ...
}
```

詳細は [公式Logstashドキュメンテーション] (https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) を参照してください。

## 統合の設定

1. Wallarm Console → **統合** → **Logstash**で、Logstash統合の設定に進みます。
1. 統合の名前を入力します。
1. ターゲットLogstash URL (Webhook URL)を指定します。
1. 必要に応じて、詳細設定を設定します：

    --8<-- "../include/integrations/webhook-advanced-settings.ja.md"
1. 指定されたURLに通知を送信するトリガーとなるイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
1. [統合をテスト](#統合のテスト)し、設定が正しいことを確認します。
1. **統合を追加**をクリックします。

![!Logstash統合](../../../images/user-guides/settings/integrations/add-logstash-integration.png)

## 統合のテスト

--8<-- "../include/integrations/test-integration-advanced-data.ja.md"

テストLogstashログ：

```json
[
    {
        summary:"[テストメッセージ] [テストパートナー（US）] 新しい脆弱性が検出されました",
        description:"通知タイプ: 脆弱性

                    あなたのシステムで新しい脆弱性が検出されました。

                    ID: 
                    タイトル: テスト
                    ドメイン: example.com
                    パス: 
                    方法: 
                    発見者: 
                    パラメータ: 
                    タイプ: 情報
                    脅威: 中等度

                    詳細はこちら：https://us1.my.wallarm.com/object/555


                    顧客: テスト会社
                    クラウド: US
                    ",
        details:{
            client_name:"テスト会社",
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

## Logstashを中間データコレクタとして使用する

--8<-- "../include/integrations/webhook-examples/overview.ja.md"

例えば：

![!Webhookフロー](../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

このスキームを使ってWallarmイベントをログに記録するには：

1. データコレクタを設定して、送られてきたWebhookを読み取り、ログを次のシステムに転送します。Wallarmはイベントをwebhookを通じてデータコレクタに送信します。
1. SIEMシステムを設定して、データコレクタからログを取得し読み取ります。
1. Wallarmを設定して、データコレクタにログを送信します。

    Wallarmはwebhookを経由して任意のデータコレクタにログを送信することができます。

    FluentdまたはLogstashとWallarmを統合するには、Wallarm Console UIの対応する統合カードを使用することができます。

    他のデータコレクタとWallarmを統合するには、Wallarm Console UIの[webhook統合カード](webhook.ja.md)を使用することができます。

私たちは人気のあるデータコレクタを設定してSIEMシステムにログを転送する統合のいくつかの例を紹介しました：

* [Wallarm → Logstash → IBM QRadar](webhook-examples/logstash-qradar.ja.md)
* [Wallarm → Logstash → Splunk Enterprise](webhook-examples/logstash-splunk.ja.md)
* [Wallarm → Logstash → Micro Focus ArcSight Logger](webhook-examples/logstash-arcsight-logger.ja.md)
* [Wallarm → Logstash → Datadog](webhook-examples/fluentd-logstash-datadog.ja.md)

    Wallarmはまた、[Datadog APIを通じたDatadogとのネイティブな統合](datadog.ja.md)もサポートしています。ネイティブ統合では、中間データコレクタの使用が必要ありません。
