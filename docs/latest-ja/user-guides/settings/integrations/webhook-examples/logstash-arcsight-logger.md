# Logstash経由のMicro Focus ArcSight Logger

本手順では、WallarmとLogstashデータコレクタのインテグレーション例を示し、その後ArcSight Loggerシステムへイベントを転送します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "ArcSight ESMのEnterprise版とのインテグレーション"
    LogstashからArcSight ESMのEnterprise版へログを転送するには、ArcSight側でSyslog Connectorを設定し、その後Logstashから当該コネクタのポートへログを転送することを推奨します。コネクタの詳細な説明については、[公式のArcSight SmartConnectorドキュメント](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs)から**SmartConnector User Guide**をダウンロードしてください。

## 使用リソース

* [ArcSight Logger 7.1](#arcsight-logger-configuration)（CentOS 7.8にインストール、WEB URLは`https://192.168.1.73:443`）
* [Logstash 7.7.0](#logstash-configuration)（Debian 11.x (bullseye)にインストール、`https://logstash.example.domain.com`で利用可能）
* [EUクラウド](https://my.wallarm.com)のWallarm Consoleへの管理者アクセス権（[Logstashインテグレーションを設定](#configuration-of-logstash-integration)するため）

--8<-- "../include/cloud-ip-by-request.md"

ArcSight LoggerおよびLogstashサービスへのリンクは例示ですので、応答しません。

### ArcSight Loggerの設定

ArcSight Loggerには、ログレシーバー`Wallarm Logstash logs`が次のとおり設定されています:

* ログはUDPで受信します（`Type = UDP Receiver`）
* 待受ポートは`514`です
* イベントはsyslogパーサーで解析します
* その他はデフォルト設定です

![ArcSight Loggerのレシーバー設定](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

レシーバー設定の詳細については、[公式のArcSight Loggerドキュメント](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc)から該当バージョンの**Logger Installation Guide**をダウンロードしてください。

### Logstashの設定

Wallarmはwebhookを介して中間のデータコレクタであるLogstashへログを送信しますので、Logstashの設定は次の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け付けます
* HTTPSリクエストを受け付けます
* 公開URLを持ちます
* ArcSight Loggerへログを転送します。本例ではログ転送に`syslog`プラグインを使用します

Logstashは`logstash-sample.conf`ファイルで設定します。

* `input`セクションで着信webhookの処理を設定します:
    * トラフィックはポート5044に送られます
    * LogstashはHTTPS接続のみを受け付けるように設定します
    * 公開信頼CAにより署名されたLogstashのTLS証明書は`/etc/server.crt`に配置します
    * TLS証明書の秘密鍵は`/etc/server.key`に配置します
* `output`セクションでArcSight Loggerへの転送とログ出力を設定します:
    * すべてのイベントログはLogstashからArcSight LoggerのIPアドレス`https://192.168.1.73:514`へ転送します
    * ログは[Syslog](https://en.wikipedia.org/wiki/Syslog)標準に従い、JSON形式でLogstashからArcSight Loggerへ転送します
    * ArcSight Loggerとの接続はUDPで確立します
    * Logstashログは追加でコマンドラインにも出力されます（コード15行目）。この設定は、イベントがLogstash経由で記録されることを確認するために使用します

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィック用inputプラグイン
    port => 5044 # 受信リクエスト用ポート
    ssl => true # HTTPSトラフィック処理
    ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
    ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
  }
}
output {
  syslog { # Syslog経由でLogstashからのログ転送用outputプラグイン
    host => "192.168.1.73" # 転送先IPアドレス
    port => "514" # 転送先ポート
    protocol => "udp" # 接続プロトコル
    codec => json # 転送ログの形式
  }
  stdout {} # コマンドラインへのLogstashログ出力用outputプラグイン
}
```

設定ファイルの詳細な説明は、[公式Logstashドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)にあります。

!!! info "Logstash設定のテスト"
    Logstashログが作成され、ArcSight Loggerへ転送されることを確認するため、LogstashにPOSTリクエストを送信できます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashログ:**
    ![Logstash logs](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **ArcSight Loggerでのイベント:**
    ![ArcSight Logger event](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### Logstashインテグレーションの設定

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![LogstashとのWebhookインテグレーション](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstashインテグレーション設定の詳細](../logstash.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstashはイベントを次のように記録します:

![LogstashからArcSight Loggerへの新規ユーザーに関するログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

ArcSight Loggerのイベントには次のエントリが表示されます:

![LogstashからArcSight Loggerに表示された新規ユーザーのカード](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)