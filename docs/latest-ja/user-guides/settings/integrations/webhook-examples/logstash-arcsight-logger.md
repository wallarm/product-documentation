# Logstash経由のMicro Focus ArcSight Logger

本書では、WallarmとLogstashデータコレクターの統合例をご紹介し、イベントをArcSight Loggerシステムへ転送する方法を説明します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhookフロー](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-scheme.png)

!!! info "Enterprise版のArcSight ESMとの統合"
    LogstashからEnterprise版のArcSight ESMへログを転送する設定には、ArcSight側でSyslog Connectorを構成し、その後LogstashからConnectorポートへログを転送することを推奨します。Connectorの詳細な説明については、[公式 ArcSight SmartConnector documentation](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs)から**SmartConnector User Guide**をダウンロードしてください。

## 使用するリソース

* [ArcSight Logger 7.1](#arcsight-logger-configuration)がCentOS 7.8にインストールされ、WEB URL `https://192.168.1.73:443` を使用します
* [Logstash 7.7.0](#logstash-configuration)がDebian 11.x (bullseye)にインストールされ、`https://logstash.example.domain.com`で利用可能です
* [EU cloud](https://my.wallarm.com)のWallarm Consoleへの管理者アクセスがあり、[Logstash integrationの設定](#configuration-of-logstash-integration)が可能です

--8<-- "../include/cloud-ip-by-request.md"

ArcSight LoggerおよびLogstashサービスへのリンクは例として記載されているため、応答しません。

### ArcSight Loggerの構成

ArcSight Loggerには、`Wallarm Logstash logs`としてログ受信機が次のように構成されています。

* ログはUDP（`Type = UDP Receiver`）経由で受信されます
* リスニングポートは`514`です
* イベントはsyslogパーサーで解析されます
* その他の既定設定

![ArcSight Loggerにおける受信機の構成](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-setup.png)

受信機構成の詳細な説明については、[公式 ArcSight Logger documentation](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc)から該当バージョンの**Logger Installation Guide**をダウンロードしてください。

### Logstashの構成

Wallarmはwebhook経由でLogstash中間データコレクターへログを送信しますので、Logstashの構成は次の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け付けます
* HTTPSリクエストを受け付けます
* 公開URLを持ちます
* ArcSight Loggerへログを転送します。この例ではログ転送に`syslog`プラグインを使用します

Logstashは`logstash-sample.conf`ファイルで構成されています：

* 受信webhook処理は`input`セクションで構成されています：
    * トラフィックはポート5044に送信されます
    * LogstashはHTTPS接続のみを受け付けるように構成されています
    * 公開に信頼されるCAによって署名されたLogstash TLS証明書は`/etc/server.crt`ファイル内にあります
    * TLS証明書の秘密鍵は`/etc/server.key`ファイル内にあります
* ArcSight Loggerへのログ転送およびログ出力は`output`セクションで構成されています：
    * 全てのイベントログはLogstashからIPアドレス`https://192.168.1.73:514`のArcSight Loggerへ転送されます
    * ログは[Syslog](https://en.wikipedia.org/wiki/Syslog)標準に従い、JSON形式でLogstashからArcSight Loggerへ転送されます
    * ArcSight Loggerとの接続はUDP経由で確立されます
    * Logstashログはコマンドラインにも出力されます（15行目のコード）。この設定はLogstash経由でイベントがログされることを確認するために使用されます

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィック用のinputプラグイン
    port => 5044 # 受信リクエスト用のポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # Logstash TLS証明書
    ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
  }
}
output {
  syslog { # LogstashからSyslog経由でログを転送するoutputプラグイン
    host => "192.168.1.73" # ログ転送先のIPアドレス
    port => "514" # ログ転送先のポート
    protocol => "udp" # 接続プロトコル
    codec => json # 転送されるログのフォーマット
  }
  stdout {} # Logstashログをコマンドラインに出力するoutputプラグイン
}
```

構成ファイルの詳細な説明については、[公式 Logstash documentation](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)をご確認ください。

!!! info "Logstash構成のテスト"
    Logstashログが生成され、ArcSight Loggerへ転送されることを確認するために、POSTリクエストをLogstashへ送信することができます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashログ:**
    ![Logstashログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-curl-log.png)

    **ArcSight Loggerのイベント:**
    ![ArcSight Loggerのイベント](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-curl-log.png)

### Logstash統合の構成

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![LogstashとのWebhook統合](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合構成の詳細](../logstash.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstashは次のようにイベントをログします：

![LogstashからArcSight Loggerへの新規ユーザのログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/arcsight-logger-user-log.png)

次のエントリがArcSight Loggerのイベントに表示されます：

![LogstashからのArcSight Loggerにおける新規ユーザカード](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/logstash-user.png)