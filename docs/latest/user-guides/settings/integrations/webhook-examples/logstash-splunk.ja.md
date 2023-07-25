[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Logstashを経由したSplunk Enterprise

この説明書では、WallarmとLogstashデータコレクタの例示的な統合を提供し、Splunk SIEMシステムにイベントをさらにフォワードします。

--8<-- "../include/integrations/webhook-examples/overview.ja.md"

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## 使用されるリソース

* WEB URLが`https://109.111.35.11:8000`でAPI URLが`https://109.111.35.11:8088`の[Splunk Enterprise](#splunk-enterprise-configuration)
* Debian 11.x（bullseye）にインストールされ、`https://logstash.example.domain.com`で利用可能な[Logstash 7.7.0](#logstash-configuration)
* [EUクラウド](https://my.wallarm.com)のWallarmコンソールへの管理者アクセスして、[Logstashへの設定](#configuration-of-logstash-integration)の設定を行います

--8<-- "../include/cloud-ip-by-request.ja.md"

Splunk EnterpriseおよびLogstashサービスへのリンクは例示のため、リンク先が応答しません。

### Splunk Enterpriseの設定

Logstash ログは、名前が `Wallarm Logstash logs` およびその他のデフォルト設定を持つ Splunk HTTP イベントコントローラに送信されます。

![!HTTP Event Collector Configuration](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

HTTPイベントコントローラにアクセスするには、生成されたトークン `93eaeba4-97a9-46c7-abf3-4e0c545fa5cb` が使用されます。

Splunk HTTPイベントコントローラの設定についての詳細な説明は、[公式Splunkドキュメント](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector)にあります。

### Logstashの設定

WallarmはログをWebhooksを通じてLogstash中間データコレクタに送信するため、Logstashの設定は以下の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* パブリックURLを持つ
* この例では、`http`プラグインを使用してログをSplunk Enterpriseに転送する

Logstashは`logstash-sample.conf`ファイルで設定されます。

* `input`セクションで、受信Webhookの処理が構成されます。
    * トラフィックはポート5044に送信されます
    * Logstashは、HTTPS接続のみを受け入れるように設定されています
    * LogstashのTLS証明書が公開されて信頼される認証局によって署名され、`/etc/server.crt`ファイルの中にあります
    * TLS証明書の秘密鍵は、`/etc/server.key`ファイルの中にあります
* `output`セクションで、Splunkへのログの転送とログ出力が構成されます。
    * LogstashからSplunkへのログがJSON形式で転送されます
    * すべてのイベントログがLogstashからSplunk APIエンドポイント`https://109.111.35.11:8088/services/collector/raw`にPOSTリクエストを介して転送されます。リクエストを承認するために、HTTPSイベントコレクタトークンが使用されます
    * Logstashログは、コマンドライン（15行目のコード）に追加で出力されます。この設定は、Logstashを介してイベントがログに記録されていることを確認するために使用されます

```bash linenums="1"
input {
  http { # input plugin for HTTP and HTTPS traffic
    port => 5044 # port for incoming requests
    ssl => true # HTTPS traffic processing
    ssl_certificate => "/etc/server.crt" # Logstash TLS certificate
    ssl_key => "/etc/server.key" # private key for TLS certificate
  }
}
output {
  http { # output plugin to forward logs from Logstash via HTTP/HTTPS protocol
    format => "json" # format of forwarded logs
    http_method => "post" # HTTP method used to forward logs
    url => "https://109.111.35.11:8088/services/collector/raw" # ednpoint to forward logs to
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # HTTP headers to authorize requests
  }
  stdout {} # output plugin to print Logstash logs on the command line
}
```

設定ファイルの詳細な説明については、[公式Logstashドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)を参照してください。

!!! info "Logstash構成のテスト"
    Logstashログが作成され、Splunkに転送されるかどうかを確認するために、POSTリクエストをLogstashに送信することができます。

    **リクエスト例：**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashログ：**
    ![!Logstashログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **Splunkイベント：**
    ![!Splunkイベント](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### Logstash統合の設定

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.ja.md"

![!Webhook統合とLogstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合設定の詳細](../logstash.ja.md)

## サンプルのテスト

--8<-- "../include/integrations/webhook-examples/send-test-webhook.ja.md"

Logstashは次のイベントをログとして記録します。

![!Log about new user in Splunk from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

Splunkイベントには、次のエントリが表示されます。

![!New user card in Splunk from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## ダッシュボードにイベントを整理する

--8<-- "../include/integrations/application-for-splunk.ja.md"
