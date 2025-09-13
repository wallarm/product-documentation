[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Fluentd経由のSplunk Enterprise

本書では、WallarmをデータコレクターのFluentdと連携し、イベントをSplunk SIEMシステムへ転送するためのインテグレーション例を示します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhookのフロー](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## 使用リソース

* WEB URL `https://109.111.35.11:8000` とAPI URL `https://109.111.35.11:8088` を持つ[Splunk Enterprise](#splunk-enterprise-configuration)を使用します
* Debian 11.x (bullseye)にインストールされ、`https://fluentd-example-domain.com`で利用可能な[Fluentd](#fluentd-configuration)を使用します
* [EUクラウド](https://my.wallarm.com)のWallarm Consoleへの管理者アクセスを使用して、[Fluentdインテグレーションを構成します](#configuration-of-fluentd-integration)

--8<-- "../include/cloud-ip-by-request.md"

Splunk EnterpriseおよびFluentdサービスへのリンクはサンプルとして記載しているため、応答しません。

### Splunk Enterpriseの構成 {#splunk-enterprise-configuration}

Fluentdのログは、名前を`Wallarm Fluentd logs`とし、その他のデフォルト設定でSplunk HTTP Event Controllerへ送信します:

![HTTP Event Collectorの設定](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

HTTP Event Controllerへのアクセスには、生成されたトークン`f44b3179-91aa-44f5-a6f7-202265e10475`を使用します。

Splunk HTTP Event Controllerの設定の詳細は[Splunk公式ドキュメント](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector)にあります。

### Fluentdの構成 {#fluentd-configuration}

WallarmはWebhook経由で中間のデータコレクターであるFluentdへログを送信するため、Fluentdの構成は次の要件を満たす必要があります:

* POSTまたはPUTリクエストを受け付けます
* HTTPSリクエストを受け付けます
* 公開URLでアクセス可能です
* ログをSplunk Enterpriseへ転送します。この例では、ログ転送に`splunk_hec`プラグインを使用します

Fluentdは`td-agent.conf`ファイルで次のように構成します:

* 受信Webhookの処理は`source`ディレクティブで設定します:
    * トラフィックはポート9880へ送信します
    * FluentdはHTTPS接続のみを受け付けるように構成します
    * 公的に信頼されたCAが署名したFluentdのTLS証明書は`/etc/ssl/certs/fluentd.crt`に配置します
    * TLS証明書の秘密鍵は`/etc/ssl/private/fluentd.key`に配置します
* ログのSplunkへの転送とログ出力は`match`ディレクティブで設定します:
    * すべてのイベントログをFluentdからコピーし、出力プラグイン[fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec)経由でSplunk HTTP Event Controllerへ転送します
    * Fluentdのログは、追加でコマンドラインにJSON形式で出力します（コードの19〜22行目）。この設定は、イベントがFluentd経由で記録されていることを検証するために使用します

```bash linenums="1"
<source>
  @type http # HTTPおよびHTTPSトラフィック用の入力プラグインです
  port 9880 # 受信リクエスト用のポートです
  <transport tls> # 接続処理のための設定です
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # HTTP Event Controller経由でSplunk APIへログを転送するための出力プラグインfluent-plugin-splunk-hecです
      hec_host 109.111.35.11 # Splunkホストです
      hec_port 8088 # Splunk APIポートです
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # HTTP Event Controllerトークンです
    <format>
      @type json # 転送されるログのフォーマットです
    </format>
  </store>
  <store>
     @type stdout # コマンドラインにFluentdログを出力するための出力プラグインです
     output_type json # コマンドラインに出力されるログのフォーマットです
  </store>
</match>
```

設定ファイルのより詳細な説明は[Fluentdの公式ドキュメント](https://docs.fluentd.org/configuration/config-file)にあります。

!!! info "Fluentdの構成のテスト"
    Fluentdのログが作成されSplunkへ転送されていることを確認するには、FluentdにPUTまたはPOSTリクエストを送信できます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdのログ:**
    ![Fluentdのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **Splunkのログ:**
    ![Splunkのログ](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### Fluentdインテグレーションの構成 {#configuration-of-fluentd-integration}

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![FluentdとのWebhookインテグレーション](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentdインテグレーションの構成の詳細](../fluentd.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentdはイベントを次のように記録します:

![FluentdからSplunkへの新規ユーザーログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

Splunkのイベントに以下のエントリが表示されます:

![FluentdからSplunkに表示される新規ユーザーのカード](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## Splunk Enterpriseでイベントをダッシュボードに整理して表示する

--8<-- "../include/integrations/application-for-splunk.md"