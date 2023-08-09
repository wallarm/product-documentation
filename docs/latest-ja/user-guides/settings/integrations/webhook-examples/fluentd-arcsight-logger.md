# Fluentdを介したMicro Focus ArcSight Logger 

この指示書は、WallarmとFluentdデータコレクタの統合例を提供し、さらにイベントをArcSight Loggerシステムに転送する方法を説明します。

--8<-- "../include-ja/integrations/webhook-examples/overview.md"

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-scheme.png)

!!! info "ArcSight ESMのエンタープライズ版との統合"
    FluentdからArcSight ESMのエンタープライズ版にログを転送するには、ArcSight側でSyslogコネクタを設定してから、Fluentdからコネクタポートにログを転送することを推奨します。コネクタの詳細な説明を入手するには、[公式のArcSight SmartConnector文書](https://community.microfocus.com/t5/ArcSight-Connectors/ct-p/ConnectorsDocs)から**SmartConnectorユーザーガイド**をダウンロードしてください。

## 使用したリソース

* WEB URL `https://192.168.1.73:443` でインストールされた[ArcSight Logger 7.1](#arcsight-logger-configuration)
* `https://fluentd-example-domain.com`で利用可能なDebian 11.x (bullseye)にインストールされた[Fluentd](#fluentd-configuration)
* [EUクラウド](https://my.wallarm.com)のWallarmコンソールへの管理者アクセスを持つ[Fluentd統合の設定](#configuration-of-fluentd-integration)

--8<-- "../include-ja/cloud-ip-by-request.md"

ArcSight LoggerとFluentdサービスへのリンクは例として引用されているので、応答しません。

### ArcSight Loggerの設定

ArcSight Loggerには、以下のように設定されたログ受信器 `Wallarm Fluentd logs` があります：

* ログはUDP経由で受信されます（`Type = UDP Receiver`）
* リスニングポートは `514`
* イベントはsyslogパーサーで解析されます
* その他のデフォルト設定

![!Configuration of receiver in ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-setup.png)

受信器の設定に関する詳しい説明書を入手するには、適切なバージョンの**Loggerインストールガイド**を[公式のArcSight Logger文書](https://community.microfocus.com/t5/Logger-Documentation/ct-p/LoggerDoc)からダウンロードしてください。

### Fluentdの設定

Wallarmはwebhooksを使ってFluentdの中間データコレクタにログを送信するため、Fluentdの設定は以下の要件を満たすべきです：

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* 公開URLを持つ
* ログをArcSight Loggerに転送する。この例では、`remote_syslog`プラグインを使用してログを転送します

Fluentdは `td-agent.conf` ファイルで設定されます：

* 受信webhookの処理は `source` ディレクティブで設定されます：
    * トラフィックはポート9880に送られます
    * FluentdはHTTPS接続のみ受け入れるように設定されています
    * FluentdのTLS証明書は公開信頼可能なCAによって署名され、ファイル `/etc/ssl/certs/fluentd.crt` 内に位置しています
    * TLS証明書の秘密鍵はファイル `/etc/ssl/private/fluentd.key` 内に位置しています
* ログのArcSight Loggerへの転送とログ出力は `match` ディレクティブで設定されます：
    * すべてのイベントログはFluentdからコピーされ、IPアドレス `https://192.168.1.73:514` のArcSight Loggerに転送されます
    * ログは[Syslog](https://en.wikipedia.org/wiki/Syslog)標準に従ってJSON形式でFluentdからArcSight Loggerに転送されます
    * ArcSight Loggerとの接続はUDP経由で確立されます
    * FluentdのログはさらにJSON形式でコマンドラインに印刷されます（19-22行目のコード）。この設定は、イベントがFluentd経由で記録されていることを確認するために使われます

```bash linenums="1"
<source>
  @type http # HTTPとHTTPSトラフィックの入力プラグイン
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
      host 192.168.1.73 # ログを転送するIPアドレス
      port 514 # ログを転送するポート
      protocol udp # 接続プロトコル
    <format>
      @type json # 転送されるログの形式
    </format>
  </store>
  <store>
     @type stdout # コマンドラインでFluentdログを印刷する出力プラグイン
     output_type json # コマンドラインに印刷されるログの形式
  </store>
</match>
```

設定ファイルの詳しい説明は、[公式のFluentd文書](https://docs.fluentd.org/configuration/config-file)で利用可能です。

!!! info "Fluentd設定のテスト"
    Fluentdのログが作成され、ArcSight Loggerに転送されることを確認するために、PUTまたはPOSTリクエストをFluentdに送信することができます。

    **リクエスト例：**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdのログ：**
    ![!Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-curl-log.png)

    **ArcSight Loggerのイベント：**
    ![!Logs in ArcSight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-curl-log.png)

### Fluentd統合の設定

--8<-- "../include-ja/integrations/webhook-examples/create-fluentd-webhook.md"

![!Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd統合設定の詳細](../fluentd.md)

## 例のテスト

--8<-- "../include-ja/integrations/webhook-examples/send-test-webhook.md"

Fluentdは以下のようにイベントをログします：

![!Fluentd log about new user](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/arcsight-logger-user-log.png)

次のエントリがArcSight Loggerのイベントに表示されます：

![!Events in ArccSiight Logger](../../../../images/user-guides/settings/integrations/webhook-examples/arcsight-logger/fluentd-user.png)