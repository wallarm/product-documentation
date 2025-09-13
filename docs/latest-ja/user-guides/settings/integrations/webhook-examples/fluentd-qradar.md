# Fluentd経由でのIBM QRadar

本手順では、WallarmをデータコレクターFluentdと統合し、イベントをQRadar SIEMシステムへ転送するための統合例を示します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhookのフロー](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## 使用リソース

* [Fluentd](#fluentd-configuration) がDebian 11.x（bullseye）にインストールされ、`https://fluentd-example-domain.com`で利用可能です
* [QRadar V7.3.3](#qradar-configuration-optional) がLinux Red Hatにインストールされ、IPアドレス `https://109.111.35.11:514` で利用可能です
* [Fluentdインテグレーションを設定する](#configuration-of-fluentd-integration)ための[EUクラウド](https://my.wallarm.com)のWallarm Consoleへの管理者アクセス

--8<-- "../include/cloud-ip-by-request.md"

FluentdおよびQRadarサービスへのリンクは例として記載しているため、応答しません。

### Fluentdの設定 {#fluentd-configuration}

WallarmはWebhookを介して中間データコレクターFluentdにログを送信するため、Fluentdの設定は次の要件を満たす必要があります:

* POSTまたはPUTリクエストを受け付ける必要があります
* HTTPSリクエストを受け付ける必要があります
* 公開URLで到達可能である必要があります
* ログをIBM QRadarへ転送する必要があります。この例ではログ転送に`remote_syslog`プラグインを使用します

Fluentdは`td-agent.conf`ファイルで設定します:

* 受信Webhookの処理は`source`ディレクティブで設定します:
    * トラフィックはポート9880に送信されます
    * FluentdはHTTPS接続のみを受け付けるように設定します
    * 公開信頼されたCAで署名されたFluentdのTLS証明書は`/etc/ssl/certs/fluentd.crt`にあります
    * TLS証明書の秘密鍵は`/etc/ssl/private/fluentd.key`にあります
* QRadarへのログ転送とログ出力は`match`ディレクティブで設定します:
    * すべてのイベントログがFluentdからコピーされ、IPアドレス `https://109.111.35.11:514` のQRadarへ転送されます
    * ログは[Syslog](https://en.wikipedia.org/wiki/Syslog)標準に従ってJSON形式でFluentdからQRadarへ転送されます
    * QRadarとの接続はTCPで確立します
    * Fluentdのログは追加でコマンドラインにJSON形式で出力します（コード19～22行）。この設定は、イベントがFluentd経由で記録されていることを確認するために使用します

```bash linenums="1"
<source>
  @type http # HTTP/HTTPSトラフィック用の入力プラグイン
  port 9880 # 受信リクエスト用ポート
  <transport tls> # 接続処理の設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # Syslog経由でFluentdからログを転送するための出力プラグイン
      host 109.111.35.11 # ログの転送先IPアドレス
      port 514 # ログの転送先ポート
      protocol tcp # 接続プロトコル
    <format>
      @type json # 転送するログの形式
    </format>
  </store>
  <store>
     @type stdout # Fluentdのログをコマンドラインに出力するための出力プラグイン
     output_type json # コマンドラインに出力するログの形式
  </store>
</match>
```

設定ファイルのより詳細な説明は[Fluentdの公式ドキュメント](https://docs.fluentd.org/configuration/config-file)にあります。

!!! info "Fluentd設定のテスト"
    Fluentdのログが作成されQRadarに転送されることを確認するために、FluentdへPUTまたはPOSTリクエストを送信できます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdのログ:**
    ![Fluentdのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **QRadarのログ:**
    ![QRadarのログ](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **QRadarのログペイロード:**
    ![QRadarのログ](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### QRadarの設定（任意） {#qradar-configuration-optional}

QRadarではログソースを設定します。これにより、QRadar内のすべてのログ一覧からFluentdのログを容易に見つけられ、さらにログのフィルタリングにも使用できます。ログソースの設定は以下のとおりです:

* **Log Source Name**: `Fluentd`
* **Log Source Description**: `Logs from Fluentd`
* **Log Source Type**: Syslog標準で使用する受信ログのパーサータイプ `Universal LEEF`
* **Protocol Configuration**: ログ転送の標準 `Syslog`
* **Log Source Identifier**: FluentdのIPアドレス
* その他の設定はデフォルト

QRadarのログソース設定のより詳細な説明は[IBMの公式ドキュメント](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf)にあります。

![Fluentd用のQRadarログソース設定](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### Fluentdインテグレーションの設定 {#configuration-of-fluentd-integration}

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![FluentdとのWebhookインテグレーション](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentdインテグレーションの設定の詳細](../fluentd.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentdはイベントを次のように記録します:

![FluentdからQRadarへの新規ユーザーに関するログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

QRadarのログペイロードには、次のJSON形式のデータが表示されます:

![Fluentdからの新規ユーザーカード（QRadar）](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)