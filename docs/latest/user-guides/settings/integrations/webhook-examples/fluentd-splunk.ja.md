[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Fluentd経由のSplunk Enterprise

これらの手順は、WallarmとFluentdデータコレクターを統合して、さらにSplunk SIEMシステムにイベントを転送する例を提供しています。

--8<-- "../include/integrations/webhook-examples/overview.ja.md"

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## 使用されるリソース

* WEB URL `https://109.111.35.11:8000` および API URL `https://109.111.35.11:8088` を備えた [Splunk Enterprise](#splunk-enterprise-configuration)
* Debian 11.x（bullseye）にインストールされ、 `https://fluentd-example-domain.com` で利用可能な [Fluentd](#fluentd-configuration)
* [EU cloud](https://my.wallarm.com) のWallarm Consoleへの管理者アクセス（ [Fluentd統合の設定](#configuration-of-fluentd-integration)）

--8<-- "../include/cloud-ip-by-request.ja.md"

Splunk EnterpriseとFluentdサービスへのリンクは例として示されているため、応答しません。

### Splunk Enterpriseの設定

Fluentd のログは、名前が `Wallarm Fluentd logs` およびその他のデフォルト設定を持つ Splunk HTTP イベントコントローラに送信されます。

![!HTTP Event Collector Configuration](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

HTTP Event Controllerにアクセスするには、生成されたトークン `f44b3179-91aa-44f5-a6f7-202265e10475` が使用されます。

Splunk HTTP Event Controllerの設定の詳細な説明は、 [公式Splunkドキュメント](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector) で利用可能です。

### Fluentdの設定

WallarmはWebhook経由でFluentd中間データコレクタにログを送信するため、Fluentdの設定は次の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* 公開URLを持つ
* この例では`splunk_hec`プラグインを使用してログを転送するSplunk Enterpriseにログを転送する

Fluentdは `td-agent.conf` ファイルで設定されます：

* `source`ディレクティブで着信Webhookの処理が設定されます:
    * トラフィックはポート9880に送信されます
    * FluentdはHTTPS接続のみを受け入れるように設定されています
    * FluentdのTLS証明書は、ファイル `/etc/ssl/certs/fluentd.crt` 内にあります。これは一般的に信頼されるCAによって署名された証明書です
    * TLS証明書の秘密鍵は、ファイル `/etc/ssl/private/fluentd.key` 内に位置しています
* `match`ディレクティブでSplunkへのログの転送とログ出力が設定されています:
    * すべてのイベントログがFluentdからコピーされ、出力プラグイン [fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec) 経由で Splunk HTTP イベントコントローラに転送されます
    * Fluentdのログはさらに、コマンドライン上で JSON形式（19-22行のコード）で表示されます。この設定はFluentdを介したイベントログが生成されることを確認するために使用されます

```bash linenums="1"
<source>
  @type http # HTTPおよびHTTPSトラフィックの入力プラグイン
  port 9880 # 受信リクエストのポート
  <transport tls> # 接続処理の設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # Splunk API にログを転送するための出力プラグイン fluent-plugin-splunk-hec を経由した HTTP Event Controller
      hec_host 109.111.35.11 # Splunk ホスト
      hec_port 8088 # Splunk API ポート
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # HTTP Event Controller トークン
    <format>
      @type json # 転送されるログの形式
    </format>
  </store>
  <store>
     @type stdout # コマンドライン上で Fluentd のログを表示するための出力プラグイン
     output_type json # コマンドラインに表示されるログの形式
  </store>
</match>
```

設定ファイルの詳細な説明は、 [公式 Fluentd ドキュメント](https://docs.fluentd.org/configuration/config-file) で利用可能です。

!!! info "Fluentdの設定のテスト"
    Fluentdログが作成され、Splunkに転送されることを確認するために、PUTまたはPOSTリクエストをFluentdに送信できます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdログ:**
    ![!Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **Splunkログ:**
    ![!Logs in Splunk](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### Fluentd 統合の設定

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.ja.md"

![!Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd統合設定の詳細](../fluentd.md)

## 例のテスト

--8<-- "../include/integrations/webhook-examples/send-test-webhook.ja.md"

Fluentdは次のようにイベントをログします:

![!Log about new user in Splunk from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

Splunkのイベントには次のエントリが表示されます:

![!New user card in Splunk from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## Splunk Enterpriseでダッシュボードにまとめられたイベントの取得

--8<-- "../include/integrations/application-for-splunk.ja.md"