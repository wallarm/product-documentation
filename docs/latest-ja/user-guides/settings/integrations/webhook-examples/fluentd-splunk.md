[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Fluentd経由のSplunk Enterprise

本手順書では、WallarmとFluentdのデータ収集機能を統合し、イベントをSplunk SIEMシステムへ転送するためのサンプル統合方法を示します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## 使用リソース

* [Splunk Enterprise](#splunk-enterprise-configuration)（WEB URL `https://109.111.35.11:8000`およびAPI URL `https://109.111.35.11:8088`）
* [Fluentd](#fluentd-configuration)（Debian 11.x (bullseye)にインストールされ、URL `https://fluentd-example-domain.com`で利用可能）
* EUクラウドのWallarm Consoleに管理者アクセス権があり、[Fluentd統合の設定](#configuration-of-fluentd-integration)が可能

--8<-- "../include/cloud-ip-by-request.md"

Splunk EnterpriseおよびFluentdのサービスへのリンクは例示であるため、実際の応答はありません。

### Splunk Enterpriseの設定

Fluentdのログは、`Wallarm Fluentd logs`という名称およびその他のデフォルト設定でSplunk HTTP Event Controllerに送信されます。

![HTTP Event Collector Configuration](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

HTTP Event Controllerにアクセスするために、生成されたトークン `f44b3179-91aa-44f5-a6f7-202265e10475` が使用されます。

Splunk HTTP Event Controllerの詳細な設定手順については、[公式Splunkドキュメント](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector)を参照してください。

### Fluentdの設定

Wallarmはwebhooks経由でFluentd中間データ収集機能にログを送信するため、Fluentdの設定は以下の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け付ける
* HTTPSリクエストを受け付ける
* パブリックURLを持つ
* ログをSplunk Enterpriseへ転送する（この例では、`splunk_hec`プラグインを使用してログを転送します）

Fluentdは`td-agent.conf`ファイルで設定されます。

* 受信するwebhookの処理は、`source`ディレクティブで設定されます：
    * トラフィックはポート9880に送信されます
    * FluentdはHTTPS接続のみを受け付けるように設定されています
    * 公開された信頼できるCAにより署名されたFluentd TLS証明書は、`/etc/ssl/certs/fluentd.crt`ファイル内に配置されています
    * TLS証明書の秘密鍵は、`/etc/ssl/private/fluentd.key`ファイル内にあります
* ログのSplunkへの転送およびログ出力は、`match`ディレクティブで設定されます：
    * すべてのイベントログはFluentdからコピーされ、出力プラグイン[fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec)経由でSplunk HTTP Event Controllerへ転送されます
    * Fluentdのログは、さらにJSON形式でコマンドラインに表示されます（コード行19～22）。この設定は、イベントがFluentd経由でログに記録されることを確認するために使用されます

```bash linenums="1"
<source>
  @type http # HTTPおよびHTTPSトラフィック用入力プラグイン
  port 9880 # 受信リクエスト用ポート
  <transport tls> # 接続処理の設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # Splunk API経由でログを転送するための出力プラグイン fluent-plugin-splunk-hec
      hec_host 109.111.35.11 # Splunkホスト
      hec_port 8088 # Splunk APIポート
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # HTTP Event Controllerトークン
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

設定ファイルの詳細な説明については、[公式Fluentdドキュメント](https://docs.fluentd.org/configuration/config-file)を参照してください。

!!! info "Fluentd設定のテスト"
    Fluentdのログが作成され、Splunkへ転送されることを確認するために、PUTまたはPOSTリクエストをFluentdに送信することができます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdログ:**
    ![Fluentdログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **Splunkログ:**
    ![Splunkログ](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### Fluentd統合の設定

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![FluentdとのWebhook統合](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd統合設定の詳細](../fluentd.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentdは次のようにイベントをログに記録します。

![FluentdからSplunkへの新規ユーザのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

Splunkのイベントには、次のエントリーが表示されます。

![FluentdからSplunkへの新規ユーザカード](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## Splunk Enterpriseでイベントを整理しダッシュボードに表示する

--8<-- "../include/integrations/application-for-splunk.md"