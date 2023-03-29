# Micro Focus ArcSight Logger 経由の Logstash

これらの指示は、WallarmとLogstashデータコレクタとの間の例示的な統合を提供し、さらにイベントをArcSight Loggerシステムに転送します。

--8<-- "../include-ja/integrations/webhook-examples/overview.md"

![!Webhookフロー](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "ArcSight ESMのエンタープライズ版との統合"
    LogstashからArcSight ESMのエンタープライズ版にログを転送するには、ArcSight側でSyslogコネクタを設定し、ログをLogstashからコネクタポートに転送することが推奨されます。コネクタのより詳細な説明については、[公式のArcSight SmartConnectorドキュメント](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs) より**SmartConnector User Guide** をダウンロードしてください。

## 使用されるリソース

* [ArcSight Logger 7.1](#arcsight-logger-configuration) をCentOS 7.8にインストールし、WEB URL `https://192.168.1.73:443`で利用可能
* [Logstash 7.7.0](#logstash-configuration) をDebian 11.x（bullseye）にインストールし、`https://logstash.example.domain.com`で利用可能
* [EUクラウド](https://my.wallarm.com)のWallarmコンソールへの管理者アクセスを使用して、[Logstash統合を設定](#configuration-of-logstash-integration)

--8<-- "../include-ja/cloud-ip-by-request.md"

ArcSight LoggerとLogstashサービスへのリンクは例示的なものであり、応答しません。

### ArcSight Loggerの設定

ArcSight Loggerには、以下のように設定されたログ受信機能「Wallarm Logstashログ」があります。

* ログはUDP経由で受信されます（`Type = UDP Receiver`）
* リスニングポートは「514」
* イベントはsyslogパーサで解析されます
* その他のデフォルト設定

![!ArcSight Loggerの受信機能の設定](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

受信機能の設定の詳細については、[公式のArcSight Loggerドキュメント](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc) より適切なバージョンの**Logger Installation Guide** をダウンロードしてください。

### Logstashの設定

WallarmがWebhookを介してLogstashの中間データコレクタにログを送信するため、Logstashの設定は以下の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* 公開されたURLを持つ
* ログをArcSight Loggerに転送する（この例では`syslog`プラグインを使用してログを転送）

Logstashは`logstash-sample.conf`ファイルで設定されます。

* `input`セクションで受信Webhookの処理が設定されています。
    * トラフィックはポート5044に送信されます
    * LogstashはHTTPS接続のみを受け入れるように設定されています
    * LogstashのTLS証明書（公的に信頼されたCAによって署名されたもの）はファイル`/etc/server.crt`内にあります
    * TLS証明書の秘密鍵はファイル`/etc/server.key`内にあります
* `output`セクションでArcSight Loggerへのログ転送とログ出力が設定されています。
    * すべてのイベントログはLogstashからIPアドレス`https://192.168.1.73:514`のArcSight Loggerに転送されます
    * LogstashからArcSight Loggerにログが転送される際、[Syslog](https://ja.wikipedia.org/wiki/Syslog) 標準に従ってJSON形式で行われます
    * ArcSight Loggerとの接続はUDP経由で確立されます
    * Logstashのログはさらにコマンドラインに表示されます（15行目のコード）これは、Logstashを介してイベントが記録されていることを確認するために使用される設定です

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィックのための入力プラグイン
    port => 5044 # 入力リクエスト用のポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # Logstash TLS証明書
    ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
  }
}
output {
  syslog { # LogstashからSyslog経由でログを転送するための出力プラグイン
    host => "192.168.1.73" # ログを転送するIPアドレス
    port => "514" # ログを転送するポート
    protocol => "udp" # 接続プロトコル
    codec => json # 転送されるログの形式
  }
  stdout {} # コマンドラインにLogstashのログを表示するための出力プラグイン
}
```

設定ファイルの詳細説明は、[公式のLogstashドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)で入手できます。

!!! info "Logstash構成のテスト"
    Logstashのログが作成され、ArcSight Loggerに転送されていることを確認するために、LogstashにPOSTリクエストを送信することができます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashログ:**
    ![!Logstashログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **ArcSight Loggerでのイベント:**
    ![!ArcSight Loggerイベント](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### Logstash統合の設定

--8<-- "../include-ja/integrations/webhook-examples/create-logstash-webhook.md"

![!LogstashとのWebhook統合](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合設定の詳細](../logstash.md)

## 例のテスト

--8<-- "../include-ja/integrations/webhook-examples/send-test-webhook.md"

Logstashは次のようにイベントをログします。

![!LogstashからのArcSight Loggerの新規ユーザーログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

ArcSight Loggerのイベントには次のエントリが表示されます。

![!LogstashからのArcSight Loggerの新規ユーザーカード](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)