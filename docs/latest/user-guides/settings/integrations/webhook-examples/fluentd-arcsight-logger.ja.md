# Micro Focus ArcSight Logger と Fluentd を経由

これらの指示は、Fluentd データ収集器を使用した Wallarm との例の統合を提供し、その後、ArcSight Logger システムにイベントを転送します。

--8<-- "../include/integrations/webhook-examples/overview.ja.md"

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! info "ArcSight ESM のエンタープライズ版との統合"
    Fluentd から ArcSight ESM のエンタープライズ版にログを転送するように設定するには、ArcSight 側で Syslog Connector を設定し、Fluentd からのログをコネクタポートに転送することをお勧めします. コネクタの詳細な説明を入手するには、[公式 ArcSight SmartConnector ドキュメント](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs)から **SmartConnector User Guide** をダウンロードしてください。

 ## 使用されるリソース

* [ArcSight Logger 7.1](#arcsight-logger-configuration) を WEB URL `https://192.168.1.73:443` にインストールし、CentOS 7.8 上にインストール
* [Fluentd](#fluentd-configuration) を Debian 11.x (bullseye) にインストールし、`https://fluentd-example-domain.com` で利用可能
* [Fluentd 統合の設定](#configuration-of-fluentd-integration)を行うために [EU クラウド](https://my.wallarm.com) での Wallarm Console への管理者アクセス

--8<-- "../include/cloud-ip-by-request.ja.md"

ArcSight Logger および Fluentd サービスへのリンクは、例として引用されているため、応答しません。

### ArcSight Logger の設定

ArcSight Logger は、次のように設定されたログ受信機 `Wallarm Fluentd logs` を持っています。

* ログは UDP 経由で受信されます（`Type = UDP Receiver`）
* 設定されているリスニング・ポートは `514`
* イベントは syslog パーサを使って解析されます
* その他のデフォルトの設定

![!Configuration of receiver in ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

  受信機の設定の詳細な説明を入手するには、適切なバージョンの [公式 ArcSight Logger ドキュメント](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc) から **Logger Installation Guide** をダウンロードしてください。

### Fluentd の設定

Wallarm は、Fluentd の間接データ収集機へのログを Webhook 経由で送信するため、Fluentd の設定は次の要件を満たす必要があります。

* POST または PUT リクエストを受け入れる
* HTTPS リクエストを受け入れる
* 公開された URL を持つ
* この例では、ログを `remote_syslog` プラグインを使って ArcSight Logger に転送する

Fluentd は `td-agent.conf` ファイルで設定されています。

* 入力 Webhook の処理は、 `source` ディレクティブで設定されています。
    * トラフィックはポート 9880 に送られます
    * Fluentd は HTTPS 接続のみを受け入れるように設定されています
    * Fluentd の TLS 証明書は、ファイル `/etc/ssl/certs/fluentd.crt` 中にあります
    * TLS 証明書の秘密鍵は、ファイル `/etc/ssl/private/fluentd.key` にあります
* ArcSight Logger へのログ転送とログ出力は `match` ディレクティブで設定されています。
    * すべてのイベントログが Fluentd からコピーされ、IP アドレス `https://192.168.1.73:514` の ArcSight Logger に転送されます
    * Fluentd から ArcSight Logger へのログ転送は、[Syslog](https://en.wikipedia.org/wiki/Syslog) 標準に従って JSON 形式で行われます
    * ArcSight Logger との接続は UDP 経由で確立されます
    * Fluentd のログはさらにコマンドラインで JSON 形式で表示されます（コード行 19-22）。この設定は、Fluentd を介してイベントがログに記録されることを確認するために使用されます。

```bash linenums="1"
<source>
  @type http # input plugin for HTTP and HTTPS traffic
  port 9880 # port for incoming requests
  <transport tls> # configuration for connections handling
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # output plugin to forward logs from Fluentd via Syslog
      host 192.168.1.73 # IP address to forward logs to
      port 514 # port to forward logs to
      protocol udp # connection protocol
    <format>
      @type json # format of forwarded logs
    </format>
  </store>
  <store>
     @type stdout # output plugin to print Fluentd logs on the command line
     output_type json # format of logs printed on the command line
  </store>
</match>
```

設定ファイルの詳細な説明は、[公式の Fluentd ドキュメント](https://docs.fluentd.org/configuration/config-file)で利用できます。

!!! info "Fluentd の設定のテスト"
    Fluentd のログが作成され、ArcSight Logger に転送されていることを確認するため、PUT または POST リクエストを Fluentd に送信することができます。

    **リクエストの例:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd のログ:**
    ![!Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **ArcSight Logger:**
    ![!Logs in ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-curl-log.png)

### Fluentd 統合の設定

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.ja.md"

![!Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd 統合の設定の詳細について](../fluentd.ja.md)

## 例のテスト

--8<-- "../include/integrations/webhook-examples/send-test-webhook.ja.md"

Fluentd は次のようにイベントをログに記録します。

![!Fluentd log about new user](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

次のエントリが ArcSight Logger イベントに表示されます。

![!Events in ArccSiight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)