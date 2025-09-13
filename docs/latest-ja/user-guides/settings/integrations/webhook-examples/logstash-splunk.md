[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Logstash経由でのSplunk Enterprise連携

本手順では、WallarmとデータコレクターLogstashを連携し、イベントをSplunkのSIEMシステムへ転送するための統合例を示します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhookフロー](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## 使用リソース

* [Splunk Enterprise](#splunk-enterprise-configuration)（WEB URL `https://109.111.35.11:8000`、API URL `https://109.111.35.11:8088`）
* [Logstash 7.7.0](#logstash-configuration)（Debian 11.x（bullseye）にインストール、`https://logstash.example.domain.com`で利用可能）
* [EU cloud](https://my.wallarm.com)のWallarm Consoleへの管理者アクセス（[Logstash統合の設定](#configuration-of-logstash-integration)用）

--8<-- "../include/cloud-ip-by-request.md"

Splunk EnterpriseおよびLogstashのサービスへのリンクは例として記載しているため、応答しません。

### Splunk Enterpriseの設定

Logstashのログは、名前を`Wallarm Logstash logs`とし、その他はデフォルト設定のままでSplunkのHTTP Event Controllerに送信します。

![HTTP Event Collectorの設定](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

HTTP Event Controllerへのアクセスには、生成したトークン`93eaeba4-97a9-46c7-abf3-4e0c545fa5cb`を使用します。

SplunkのHTTP Event Controllerのセットアップの詳細は、[Splunk公式ドキュメント](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector)にあります。

### Logstashの設定

Wallarmはwebhook経由で中継データコレクターLogstashにログを送信するため、Logstashの設定は次の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け付けること
* HTTPSリクエストを受け付けること
* 公開URLを持つこと
* Splunk Enterpriseへログを転送すること（本例では`http`プラグインを使用して転送）

Logstashは`logstash-sample.conf`ファイルで設定します:

* 受信webhookの処理は`input`セクションで設定します:
    * トラフィックはポート5044に送られます
    * LogstashはHTTPS接続のみを受け付けるように設定します
    * 公的に信頼されたCAが署名したLogstashのTLS証明書は`/etc/server.crt`に配置します
    * TLS証明書の秘密鍵は`/etc/server.key`に配置します
* Splunkへの転送とログ出力は`output`セクションで設定します:
    * LogstashからSplunkへはJSON形式でログを転送します
    * すべてのイベントログはPOSTリクエストでLogstashからSplunkのAPIエンドポイント`https://109.111.35.11:8088/services/collector/raw`へ転送します。リクエストの認可にはHTTPS Event Collectorのトークンを使用します
    * さらに、（コードの15行目で）Logstashのログをコマンドラインにも出力します。この設定は、イベントがLogstash経由で記録されていることを確認するために使用します

```bash linenums="1"
input {
  http { # HTTP/HTTPSトラフィック用のinputプラグイン
    port => 5044 # 受信リクエスト用のポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
    ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
  }
}
output {
  http { # HTTP/HTTPSでLogstashからログを転送するためのoutputプラグイン
    format => "json" # 転送するログの形式
    http_method => "post" # ログ転送に使用するHTTPメソッド
    url => "https://109.111.35.11:8088/services/collector/raw" # ログの転送先エンドポイント
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # リクエストの認可に使用するHTTPヘッダー
  }
  stdout {} # Logstashのログをコマンドラインに出力するoutputプラグイン
}
```

設定ファイルの詳細は[Logstash公式ドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)にあります。

!!! info "Logstash設定のテスト"
    Logstashのログが作成されSplunkへ転送されていることを確認するには、LogstashにPOSTリクエストを送信します。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashのログ:**
    ![Logstashのログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **Splunkのイベント:**
    ![Splunkのイベント](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)

### Logstash統合の設定

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![LogstashとのWebhook統合](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合の設定の詳細](../logstash.md)

## テストの例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstashはイベントを次のように記録します。

![LogstashからSplunkへの新規ユーザーに関するログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

Splunkのイベントには次のエントリが表示されます。

![LogstashからSplunkに表示される新規ユーザーカード](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## ダッシュボードでイベントを整理して表示する

--8<-- "../include/integrations/application-for-splunk.md"