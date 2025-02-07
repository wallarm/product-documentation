# Fluentdを介したMicro Focus ArcSight Logger

これらの手順は、WallarmとFluentdデータコレクターの統合例を提供し、イベントをArcSight Loggerシステムに転送します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! info "ArcSight ESM Enterprise版との統合"
    FluentdからArcSight ESM Enterprise版にログを転送する設定を行うには、ArcSight側でSyslog Connectorを構成し、その後Fluentdからコネクターポートへログを転送することを推奨します。コネクタに関する詳細な説明は、[公式ArcSight SmartConnectorドキュメント](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs)から**SmartConnector User Guide**をダウンロードしてください。

## 使用リソース

* [ArcSight Logger 7.1](#arcsight-logger-configuration)（WEB URL `https://192.168.1.73:443`、CentOS7.8にインストール済み）
* [Fluentd](#fluentd-configuration)（Debian11.x（bullseye）にインストール済み、`https://fluentd-example-domain.com`で利用可能）
* Wallarm Consoleの管理者アクセス権（[EU cloud](https://my.wallarm.com)）を使用して[Fluentd統合の設定](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

ArcSight LoggerおよびFluentdサービスへのリンクは例として示されており、応答はありません。

### ArcSight Loggerの構成

ArcSight Loggerには、`Wallarm Fluentd logs`というログ受信機が以下のように構成されています：

* ログはUDP経由で受信されます（`Type = UDP Receiver`）
* 受信ポートは`514`
* イベントはsyslogパーサで解析されます
* その他のデフォルト設定

![ArcSight Loggerにおける受信機の構成](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

受信機の構成に関する詳細な説明は、[公式ArcSight Loggerドキュメント](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc)から適切なバージョンの**Logger Installation Guide**をダウンロードしてください。

### Fluentdの構成

Wallarmはwebhooks経由でFluentd中間データコレクターにログを送信するため、Fluentdの構成は以下の要件を満たす必要があります：

* POSTまたはPUTリクエストを受け付けます
* HTTPSリクエストを受け入れます
* 公開URLを持ちます
* ログをArcSight Loggerに転送します（この例では、`remote_syslog`プラグインを使用してログを転送します）

Fluentdは`td-agent.conf`ファイルで構成されています：

* 受信webhook処理は`source`ディレクティブで構成されています：
    * トラフィックはポート9880に送信されます
    * FluentdはHTTPS接続のみを受け付けるように構成されています
    * 公開トラストされているCAによって署名されたFluentd TLS証明書はファイル`/etc/ssl/certs/fluentd.crt`に配置されています
    * TLS証明書の秘密鍵はファイル`/etc/ssl/private/fluentd.key`に配置されています
* ArcSight Loggerへのログ転送およびログ出力は`match`ディレクティブで構成されています：
    * すべてのイベントログはFluentdからコピーされ、IPアドレス`https://192.168.1.73:514`のArcSight Loggerに転送されます
    * ログは[Syslog](https://en.wikipedia.org/wiki/Syslog)規格に従い、JSON形式でFluentdからArcSight Loggerに転送されます
    * ArcSight Loggerとの接続はUDP経由で確立されます
    * FluentdのログはJSON形式でコマンドラインにも出力されます（コード行19～22）。この設定は、Fluentd経由でイベントが記録されることを検証するために使用されます

```bash linenums="1"
<source>
  @type http # HTTPおよびHTTPSトラフィックの入力プラグイン
  port 9880 # 受信リクエスト用のポート
  <transport tls> # 接続処理のための設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # Syslog経由でFluentdからログを転送するための出力プラグイン
      host 192.168.1.73 # ログ転送先のIPアドレス
      port 514 # ログ転送先のポート
      protocol udp # 接続プロトコル
    <format>
      @type json # 転送されるログの形式
    </format>
  </store>
  <store>
     @type stdout # コマンドラインにFluentdログを出力するための出力プラグイン
     output_type json # コマンドラインに出力されるログの形式
  </store>
</match>
```

構成ファイルの詳細な説明は、[公式Fluentdドキュメント](https://docs.fluentd.org/configuration/config-file)に記載されています。

!!! info "Fluentd構成のテスト"
    Fluentdのログが作成され、ArcSight Loggerに転送されていることを確認するために、PUTまたはPOSTリクエストをFluentdに送信できます。

    **リクエスト例：**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdログ：**
    ![Fluentdのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **ArcSight Loggerのイベント：**
    ![ArcSight Loggerのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger/fluentd-curl-log.png)

### Fluentd統合の設定

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![FluentdとのWebhook統合](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd統合設定の詳細](../fluentd.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentdは次のようにイベントを記録します：

![新しいユーザーに関するFluentdのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

次のエントリがArcSight Loggerのイベントに表示されます：

![ArcSight Logger内のイベント](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)