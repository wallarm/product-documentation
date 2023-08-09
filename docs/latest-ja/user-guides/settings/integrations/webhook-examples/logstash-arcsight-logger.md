# Micro Focus ArcSight Logger経由のLogstash

これらの指示により、WallarmとLogstashデータコレクタの統合の例を提供し、さらにArcSight Loggerシステムにイベントを転送する方法を示します。

--8<-- "../include-ja/integrations/webhook-examples/overview.md"

![!Webhookフロー](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "ArcSight ESMのエンタープライズ版との統合"
    LogstashからArcSight ESMのエンタープライズ版へのログの転送を設定するには、ArcSight側でSyslog Connectorを設定し、その後、Logstashからコネクタポートにログを転送することを推奨します。コネクタについての詳細な説明を得るために、[公式のArcSight SmartConnectorドキュメンテーション](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs)から**SmartConnectorユーザーガイド**をダウンロードしてください。

## 用いたリソース

* WEB URL `https://192.168.1.73:443` でインストールされた [ArcSight Logger 7.1](#arcsight-logger-configuration)
* `https://logstash.example.domain.com` で利用可能で、Debian 11.x (bullseye)にインストールされた [Logstash 7.7.0](#logstash-configuration)
* [EU cloud](https://my.wallarm.com) におけるWallarm Consoleへの管理者アクセス、[Logstash統合の設定](#configuration-of-logstash-integration) ができます

--8<-- "../include-ja/cloud-ip-by-request.md"

ArcSight LoggerおよびLogstashサービスへのリンクは例として引用されているので、対応していません。

### ArcSight Loggerの設定

ArcSight Loggerは、以下のように設定されたログレシーバ `Wallarm Logstash logs` を持っています：

* ログはUDP経由で受信されます（`Type = UDP Receiver`）
* 待ち受けポートは `514`
* イベントはsyslogパーサで解析されます
* その他のデフォルト設定

![!ArcSight Loggerでのレシーバの設定](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

レシーバの設定の詳細な説明を得るために、適切なバージョンの**Loggerインストールガイド**を [公式のArcSight Loggerドキュメンテーション](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc) からダウンロードしてください。

### Logstashの設定

Wallarmがwebhooks経由でLogstashの中間データコレクタにログを送信するため、Logstashの設定は次の要件を満たす必要があります：

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* 公開URLを持つ
* ArcSight Loggerへのログの転送。この例では `syslog` プラグインがログの転送に使用されています

Logstashは `logstash-sample.conf` ファイルで設定されています：

* `input` セクションでの入力webhookの処理は次のように設定されています：
    * トラフィックはポート5044に送信されます
    * LogstashはHTTPS接続のみを受け入れるように設定されています
    * Logstashの公的に信頼できるCAによって署名されたTLS証明書は `/etc/server.crt` ファイル内に配置されています
    * TLS証明書の秘密鍵は `/etc/server.key` ファイル内に配置されています
* ArcSight Loggerへのログ転送とログ出力は `output` セクションで設定されています：
    * すべてのイベントログがLogstashからIPアドレス `https://192.168.1.73:514` 上のArcSight Loggerに転送されます
    * ログはLogstashからArcSight Loggerに、 [Syslog](https://en.wikipedia.org/wiki/Syslog) 標準に基づいてJSON形式で転送されます
    * ArcSight Loggerとの接続はUDP経由で確立されます
    * Logstashのログは追加でコマンドラインに出力されます（15行目）。この設定は、イベントがLogstash経由でログに記録されていることを確認するために使用されます

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィックのための入力プラグイン
    port => 5044 # 入力リクエストのためのポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
    ssl_key => "/etc/server.key" # TLS証明書のための秘密鍵
  }
}
output {
  syslog { # Syslog経由でLogstashからログを転送するための出力プラグイン
    host => "192.168.1.73" # ログを転送するIPアドレス
    port => "514" # ログを転送するポート
    protocol => "udp" # 接続プロトコル
    codec => json # 転送するログの形式
  }
  stdout {} # コマンドライン上にLogstashのログを出力する出力プラグイン
}
```

設定ファイルに関するより詳細な説明は、[公式のLogstashドキュメンテーション](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html) で利用可能です。

!!! info "Logstash設定のテスト"
    Logstashのログが作成され、ArcSight Loggerに転送されていることを確認するために、POSTリクエストをLogstashに送信できます。

    **リクエストの例：**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashのログ：**
    ![!Logstashのログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **ArcSight Loggerでのイベント：**
    ![!ArcSight Loggerでのイベント](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### Logstash統合の設定

--8<-- "../include-ja/integrations/webhook-examples/create-logstash-webhook.md"

![!LogstashとのWebhook統合](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合設定に関する詳細](../logstash.md)

## テスト例

--8<-- "../include-ja/integrations/webhook-examples/send-test-webhook.md"

Logstashは次のようにイベントをログに記録します：

![!ArcSight LoggerでのLogstashからの新規ユーザーに関するログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

ArcSight Loggerのイベントには次のエントリが表示されます：

![!ArcSight LoggerでのLogstashからの新規ユーザーカード](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)
