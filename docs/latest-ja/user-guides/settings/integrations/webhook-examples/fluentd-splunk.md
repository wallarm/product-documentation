[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Fluentd経由のSplunk Enterprise

以下の手順では、Fluentdデータコレクタを通じてWallarmと連携し、イベントをSplunk SIEMシステムに転送する方法の例を提供します。

--8<-- "../include-ja/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-scheme.png)

## 使用リソース

* WEB URLが`https://109.111.35.11:8000`、API URLが `https://109.111.35.11:8088`の[Splunk Enterprise](#splunk-enterprise-configuration)
* Debian 11.x (bullseye)にインストールされ、`https://fluentd-example-domain.com`で利用可能な[Fluentd](#fluentd-configuration)
* [EUクラウド](https://my.wallarm.com)のWallarm Consoleへの管理者アクセス権を持つ[configure the Fluentd integration](#configuration-of-fluentd-integration)

--8<-- "../include-ja/cloud-ip-by-request.md"

Splunk EnterpriseとFluentdサービスへのリンクは例として引用されているため、応答しません。

### Splunk Enterpriseの設定

Fluentdのログは名前が`Wallarm Fluentd logs`、その他はデフォルト設定のSplunk HTTPイベントコントローラに送信されます。

![HTTP Event Collector Configuration](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-setup.png)

HTTPイベントコントローラにアクセスするためには、生成されたトークン`f44b3179-91aa-44f5-a6f7-202265e10475`が使用されます。

Splunk HTTPイベントコントローラの設定についての詳細な説明は、[公式のSplunkドキュメンテーション](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector)を参照してください。

### Fluentdの設定

Wallarmがwebhook経由でFluentdの中間データコレクタへログを送信するため、次の要件を満たすようにFluentdを設定する必要があります。

* POSTまたはPUTリクエストを受け入れること
* HTTPSリクエストを受け入れること
* 公開URLを持つこと
* Splunk Enterpriseへのログ転送設定（この例では、ログ転送のために`splunk_hec`プラグインを使用

Fluentdは`td-agent.conf`ファイルで設定されます。

* 入力webhookの処理は`source`ディレクティブで設定されます：
  * トラフィックはポート9880に送信されます
  * FluentdはHTTPS接続のみを受け入れるように設定されています
  * 公開トラストCAによって署名されたFluentdのTLS証明書は`/etc/ssl/certs/fluentd.crt`ファイル内に配置されています
  * TLS証明書の秘密鍵は`/etc/ssl/private/fluentd.key`ファイル内に配置されています
* Splunkへのログ転送とログ出力は`match`ディレクティブで設定されます
  * 全イベントログはFluentdからコピーされ、出力プラグイン[fluent-plugin-splunk-hec](https://github.com/splunk/fluent-plugin-splunk-hec)経由でSplunk HTTPイベントコントローラへ転送されます
  * FluentdのログはJSON形式でコマンドラインにも出力されます（19-22行目）設定はFluentd経由でログが記録されることを確認するために使用されます

```bash linenums="1"
<source>
  @type http # HTTP and HTTPS traffic input plugin
  port 9880 # port for incoming requests
  <transport tls> # configuration for connections handling
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type splunk_hec # output plugin fluent-plugin-splunk-hec to forward logs to Splunk API via HTTP Event Controller
      hec_host 109.111.35.11 # Splunk host
      hec_port 8088 # Splunk API port
      hec_token f44b3179-91aa-44f5-a6f7-202265e10475 # HTTP Event Controller token
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

設定ファイルの詳細な説明は、[公式のFluentdドキュメンテーション](https://docs.fluentd.org/configuration/config-file)を参照してください。

!!! info "Fluentd設定のテスト"
    Fluentdのログが生成されSplunkに転送されることを確認するには、PUTまたはPOSTリクエストをFluentdに送信できます。

    **リクエスト例：**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk f44b3179-91aa-44f5-a6f7-202265e10475" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdのログ：**
    ![Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-curl-log.png)

    **Splunkのログ：**
    ![Logs in Splunk](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-curl-log.png)

### Fluentd連携の設定

--8<-- "../include-ja/integrations/webhook-examples/create-fluentd-webhook.md"

![Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd連携設定の詳細](../fluentd.md)

## テスト例

--8<-- "../include-ja/integrations/webhook-examples/send-test-webhook.md"

Fluentdは次のようにイベントをログとして記録します。

![Log about new user in Splunk from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/splunk-user-log.png)

次のエントリがSplunkのイベントに表示されます。

![New user card in Splunk from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/fluentd-user.png)

## スプランクエンタープライズでのイベントのダッシュボードへの整理の方法

--8<-- "../include-ja/integrations/application-for-splunk.md"