[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Logstash経由のSplunk Enterprise

この手順はWallarmをLogstashデータ収集システムと統合し、イベントをSplunk SIEMシステムへ転送する例を示しています。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhookフロー](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## 使用リソース

* [Splunk Enterprise](#splunk-enterprise-configuration)（WEB URL `https://109.111.35.11:8000`およびAPI URL `https://109.111.35.11:8088`）
* [Logstash 7.7.0](#logstash-configuration)はDebian 11.x (bullseye)にインストールされており、`https://logstash.example.domain.com`で利用可能です。
* [EU cloud](https://my.wallarm.com)にあるWallarm Consoleへの管理者アクセスが必要で、[Logstash統合の設定](#configuration-of-logstash-integration)を行います。

--8<-- "../include/cloud-ip-by-request.md"

Splunk EnterpriseおよびLogstashサービスへのリンクは例として示しているため、実際の応答はありません。

### Splunk Enterpriseの設定

Logstashログは`Wallarm Logstash logs`という名前でSplunk HTTP Event Controllerに送信され、他はデフォルト設定となります。

![HTTP Event Collectorの設定](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

HTTP Event Controllerにアクセスするために、生成されたトークン`93eaeba4-97a9-46c7-abf3-4e0c545fa5cb`が使用されます。

Splunk HTTP Event Controllerの設定についての詳細な説明は[公式Splunkドキュメント](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector)に記載されています。

### Logstashの設定

Wallarmはwebhookを介してLogstashの中間データ収集システムへログを送信するため、Logstashの設定は以下の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け付ける
* HTTPSリクエストを受け付ける
* パブリックなURLを有する
* ログをSplunk Enterpriseへ転送する（この例では`http`プラグインを使用してログを転送します）

Logstashは`logstash-sample.conf`ファイルで設定されます。

* 受信するwebhookの処理は`input`セクションで設定されます:
    * トラフィックはポート5044に送信されます
    * LogstashはHTTPS接続のみを受け付けるよう設定されています
    * 公開された信頼できるCAに署名されたLogstash TLS証明書はファイル`/etc/server.crt`に格納されています
    * TLS証明書用の秘密鍵はファイル`/etc/server.key`に格納されています
* Splunkへのログ転送とログ出力は`output`セクションで設定されます:
    * LogstashからSplunkへログはJSON形式で転送されます
    * LogstashからSplunkのAPIエンドポイント`https://109.111.35.11:8088/services/collector/raw`へはPOSTリクエストを介してすべてのイベントログが転送されます。リクエストの認証にはHTTPS Event Collectorトークンが使用されます
    * Logstashログはコマンドライン（15行目）にも出力されます。この設定は、Logstashを介してイベントがログ出力されることを検証するために使用されます

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィック用の入力プラグイン
    port => 5044 # 受信リクエスト用のポート
    ssl => true # HTTPSトラフィック処理
    ssl_certificate => "/etc/server.crt" # Logstash TLS証明書
    ssl_key => "/etc/server.key" # TLS証明書用秘密鍵
  }
}
output {
  http { # HTTP/HTTPSプロトコルを介してLogstashからログを転送する出力プラグイン
    format => "json" # 転送されるログの形式
    http_method => "post" # ログ転送に使用するHTTPメソッド
    url => "https://109.111.35.11:8088/services/collector/raw" # ログ転送先のエンドポイント
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # リクエストを認証するHTTPヘッダー
  }
  stdout {} # コマンドラインにLogstashログを出力する出力プラグイン
}
```

設定ファイルの詳細な説明は[公式Logstashドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)で確認できます。

!!! info "Logstash 設定のテスト"
    Logstashログが生成されSplunkへ転送されるか確認するために、POSTリクエストをLogstashへ送信できます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashログ:**
    ![Logstashログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **Splunkイベント:**
    ![Splunkイベント](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### Logstash統合の設定

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![LogstashとのWebhook統合](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合設定の詳細](../logstash.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstashは次のようにイベントをログ出力します。

![LogstashからのSplunkにおける新規ユーザのログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

Splunkイベントには以下のエントリが表示されます。

![LogstashからのSplunkにおける新規ユーザカード](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## ダッシュボードへのイベント整理

--8<-- "../include/integrations/application-for-splunk.md"