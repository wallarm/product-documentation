# IBM QRadar via Fluentd

これらの手順は、WallarmとFluentdデータコレクタを統合し、QRadar SIEMシステムにイベントをさらに転送する例を提供します。

--8<-- "../include/integrations/webhook-examples/overview.ja.md"

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## 使用されるリソース

* [Fluentd](#fluentd-configuration) は Debian 11.x (bullseye) にインストールされ、`https://fluentd-example-domain.com`で使用可能です。
* [QRadar V7.3.3](#qradar-configuration-optional) は Linux Red Hat にインストールされ、IPアドレス `https://109.111.35.11:514`で使用可能です。
* [EU cloud](https://my.wallarm.com) の Wallarm Console への管理者アクセスで、[Fluentd integration の設定が可能](#configuration-of-fluentd-integration)です。

--8<-- "../include/cloud-ip-by-request.ja.md"

Fluentd および QRadar サービスへのリンクは例として挙げられているため、応答しません。

### Fluentd 設定

Wallarm が webhook を介して Fluentd 中間データコレクタにログを送信するため、Fluentd の設定は次の要件を満たす必要があります:

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* 公開URLを持っている
* IBM Qradar へログを転送する。この例では `remote_syslog` プラグインを使ってログを転送しています。

Fluentdは `td-agent.conf` ファイルで設定されます。

* 入力 webhook 処理は `source` ディレクティブで設定されます。
    * トラフィックはポート9880に送信されます
    * SSL 証明書が公開されている `/etc/ssl/certs/fluentd.crt` 内にあります。
    * TLS 証明書の秘密鍵は `source` ディレクティブで設定されます。

* QRadar へのログ転送とログ出力は `match` ディレクティブで設定されます。
    * すべてのイベントログが Fluentd からコピーされ、IPアドレス `https://109.111.35.11:514` の QRadar に転送されます。
    * ログは [Syslog](https://en.wikipedia.org/wiki/Syslog) 標準に従って、JSON形式でFluentdからQRadarに転送されます。
    * QRadarとの接続はTCP経由で確立されます。
    * Fluentdのログは、追加でコマンドライン上のJSON形式（19~22行目のコード行）で表示されます。

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
      host 109.111.35.11 # IP address to forward logs to
      port 514 # port to forward logs to
      protocol tcp # connection protocol
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

設定ファイルの詳細な説明は[公式 Fluentd ドキュメント](https://docs.fluentd.org/configuration/config-file)でも利用可能です。

!!! info "Fluentd 設定のテスト"
    Fluentd のログが作成され、QRadar に転送されることを確認するために、PUT または POST リクエストを Fluentd に送信できます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentd ログ:**
    ![!Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **QRadar ログ:**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **QRadar ログペイロード:**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### QRadar 設定 (オプション)

QRadarでは、ログソースが設定されます。これにより、すべてのQRadarログのリストにあるFluentdログを簡単に見つけられるだけでなく、ログのフィルタリングにも使用できます。ログソースは次のように設定されています。

* **Log Source Name**: `Fluentd`
* **Log Source Description**: `Logs from Fluentd`
* **Log Source Type**: Syslog標準を使用した入力ログパーサのタイプ `Universal LEEF`
* **Protocol Configuration**: ログ転送の標準 `Syslog`
* **Log Source Identifier**: Fluentd IPアドレス
* その他のデフォルト設定

QRadarログソースの詳細な説明は、[公式 IBM ドキュメント](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf)で利用可能です。

![!QRadar log source setup for Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png) 

### Fluentd 連携の設定

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.ja.md"

![!Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd 連携設定の詳しい説明](../fluentd.ja.md)

## 例のテスト

--8<-- "../include/integrations/webhook-examples/send-test-webhook.ja.md")

Fluentd は次のようにイベントをログします。

![!Log about new user in QRadar from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

QRadarログペイロードには次のようなJSON形式のデータが表示されます。

![!New user card in QRadar from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)