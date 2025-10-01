# Fluentd経由のMicro Focus ArcSight Logger

本手順では、WallarmをFluentdデータコレクターと連携し、イベントをArcSight Loggerシステムへ転送するための統合例を示します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhookのフロー](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! info "ArcSight ESMのEnterprise版との連携"
    FluentdからArcSight ESMのEnterprise版へログを転送するには、ArcSight側でSyslog Connectorを設定し、そのコネクターのポートへFluentdからログを転送する構成を推奨します。コネクターの詳細については、[公式のArcSight SmartConnectorドキュメント](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs)から**SmartConnector User Guide**をダウンロードしてください。

## 使用リソース

* CentOS 7.8にインストールされた[ArcSight Logger 7.1](#arcsight-logger-configuration)（WEB URL: `https://192.168.1.73:443`）
* Debian 11.x（bullseye）にインストールされ、`https://fluentd-example-domain.com`で利用可能な[Fluentd](#fluentd-configuration)
* [Fluentd統合の設定](#configuration-of-fluentd-integration)を行うための[EU cloud](https://my.wallarm.com)のWallarm Consoleへの管理者アクセス

--8<-- "../include/cloud-ip-by-request.md"

ArcSight LoggerおよびFluentdサービスへのリンクは例として記載しているため、応答しません。

### ArcSight Loggerの設定 {#arcsight-logger-configuration}

ArcSight Loggerには、ログ受信設定`Wallarm Fluentd logs`が次のとおり構成されています。

* ログはUDPで受信します（Type = UDP Receiver）
* 待ち受けポートは`514`です
* イベントはsyslogパーサーで解析します
* その他はデフォルト設定です

![ArcSight Loggerの受信設定](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

受信設定の詳細は、[公式のArcSight Loggerドキュメント](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc)から該当バージョンの**Logger Installation Guide**をダウンロードしてください。

### Fluentdの設定 {#fluentd-configuration}

Wallarmはwebhook経由で中間データコレクターであるFluentdにログを送信するため、Fluentdの設定は次の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け付けること
* HTTPSリクエストを受け付けること
* 公開URLを持つこと
* ログをArcSight Loggerへ転送すること。本例では転送に`remote_syslog`プラグインを使用します

Fluentdは`td-agent.conf`ファイルで設定します。

* 受信webhookの処理は`source`ディレクティブで設定します:
    * トラフィックはポート`9880`に送信されます
    * FluentdはHTTPS接続のみを受け付けるように設定されています
    * 公的に信頼されたCAが署名したFluentdのTLS証明書は`/etc/ssl/certs/fluentd.crt`にあります
    * TLS証明書の秘密鍵は`/etc/ssl/private/fluentd.key`にあります
* ArcSight Loggerへの転送とログ出力は`match`ディレクティブで設定します:
    * すべてのイベントログがFluentdからコピーされ、IPアドレス`https://192.168.1.73:514`のArcSight Loggerへ転送されます
    * ログは[Syslog](https://en.wikipedia.org/wiki/Syslog)標準に従いJSON形式でFluentdからArcSight Loggerへ転送されます
    * ArcSight Loggerとの接続はUDPで確立されます
    * FluentdのログはJSON形式でコマンドラインにも出力されます（コードの19〜22行目）。この設定は、イベントがFluentd経由で記録されていることを検証するためのものです

```bash linenums="1"
<source>
  @type http # HTTP/HTTPSトラフィック用の入力プラグイン
  port 9880 # 受信リクエストのポート
  <transport tls> # 接続処理の設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # FluentdからSyslog経由でログを転送する出力プラグイン
      host 192.168.1.73 # 転送先のIPアドレス
      port 514 # 転送先ポート
      protocol udp # 接続プロトコル
    <format>
      @type json # 転送されるログの形式
    </format>
  </store>
  <store>
     @type stdout # コマンドラインにFluentdのログを出力するための出力プラグイン
     output_type json # コマンドラインに出力されるログの形式
  </store>
</match>
```

設定ファイルの詳細は[公式のFluentdドキュメント](https://docs.fluentd.org/configuration/config-file)にあります。

!!! info "Fluentd設定のテスト"
    Fluentdでログが作成されArcSight Loggerへ転送されることを確認するには、FluentdにPUTまたはPOSTリクエストを送信できます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdのログ:**
    ![Fluentdのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **ArcSight Loggerのイベント:**
    ![ArcSight Loggerのログ](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-curl-log.png)

### Fluentd統合の設定 {#configuration-of-fluentd-integration}

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![FluentdとのWebhook統合](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd統合設定の詳細](../fluentd.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentdはイベントを次のように記録します。

![新規ユーザーに関するFluentdのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

ArcSight Loggerのイベントには次のエントリが表示されます。

![ArcSight Loggerのイベント](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)