[splunk-dashboard-by-wallarm-img]: ../../../../images/user-guides/settings/integrations/splunk-dashboard-by-wallarm.png

# Logstashを介したSplunk Enterprise

これらの手順は、WallarmとLogstashデータコレクターの統合例を提供し、その後Splunk SIEMシステムにイベントを転送します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![!Webhookフロー](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-scheme.png)

## 使用されたリソース

* WEB URL `https://109.111.35.11:8000` および API URL `https://109.111.35.11:8088`の[Splunk Enterprise](#splunk-enterprise-configuration)
* Debian 11.x（bullseye）にインストールされ、`https://logstash.example.domain.com`で利用可能な[Logstash 7.7.0](#logstash-configuration)
* [EUクラウド](https://my.wallarm.com)内のWallarmコンソールへの管理者アクセス、および[Logstash統合の設定](#configuration-of-logstash-integration)

--8<-- "../include/cloud-ip-by-request.md"

Splunk EnterpriseとLogstashサービスへのリンクは例として引用されているので、応答しません。

### Splunk Enterpriseの設定

Logstashログは、`Wallarm Logstashログ`という名前のSplunk HTTPイベントコントローラーに送信され、他の設定はデフォルトのままです：

![!HTTPイベントコレクタ設定](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-setup.png)

HTTPイベントコントローラにアクセスするために、生成されたトークン`93eaeba4-97a9-46c7-abf3-4e0c545fa5cb`が使用されます。

Splunk HTTPイベントコントローラの設定の詳細な説明は、[公式のSplunkドキュメンテーション](https://docs.splunk.com/Documentation/Splunk/8.0.5/Data/UsetheHTTPEventCollector)で利用できます。

### Logstashの設定

WallarmがWebhooks経由でログをLogstash中間データコレクタに送信するため、Logstashの設定は次の要件を満たす必要があります：

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* 公開URLを持つ
* ログをSplunk Enterpriseに転送する、この例ではログの転送に`http`プラグインを使用

Logstashは`logstash-sample.conf`ファイルで設定されます：

* インフラが`input`セクションで設定されます：
    * トラフィックはポート5044に送信されます
    * LogstashはHTTPS接続のみを受け入れるように設定されています
    * パブリックに信頼されたCAによって署名されたLogstashのTLS証明書は`/etc/server.crt`ファイル内にあります
    * TLS証明書の秘密鍵は`/etc/server.key`ファイル内にあります
* Splunkへのログの転送とログ出力は`output`セクションで設定されます：
    * ログはLogstashからSplunkにJSON形式で転送されます
    * すべてのイベントログはPOSTリクエストを介してLogstashからSplunk APIエンドポイント`https://109.111.35.11:8088/services/collector/raw`に転送されます。リクエストを許可するには、HTTPSイベントコレクタトークンが使用されます
    * Logstashログはさらにコマンドライン上で出力されます（15行目のコード）。この設定は、イベントがLogstash経由でログに記録されていることを確認するために使用されます

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィック用の入力プラグイン
    port => 5044 # 受信リクエスト用のポート
    ssl => true # HTTPSトラフィック処理
    ssl_certificate => "/etc/server.crt" # Logstash TLS証明書
    ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
  }
}
output {
  http { # LogstashからのログをHTTP/HTTPSプロトコル経由で転送するための出力プラグイン
    format => "json" # 転送されるログの形式
    http_method => "post" # ログを転送するために使用されるHTTPメソッド
    url => "https://109.111.35.11:8088/services/collector/raw" # ログを転送するエンドポイント
    headers => ["Authorization", "Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb"] # リクエストを許可するためのHTTPヘッダー
  }
  stdout {} # Logstashのログをコマンドラインに出力するプラグイン
}
```

設定ファイルの詳しい説明は、[公式のLogstashドキュメンテーション](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)で利用できます。

!!! info "Logstash設定のテスト"
    Logstashログが作成されてSplunkに転送されているか確認するために、LogstashにPOSTリクエストを送信できます。

    **リクエスト例：**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -H "Authorization: Splunk 93eaeba4-97a9-46c7-abf3-4e0c545fa5cb" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash logs：**
    ![!Logstashログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-curl-log.png)

    **Splunkイベント：**
    ![!Splunkイベント](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-curl-log.png)    

### Logstash統合の設定

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![!LogstashとのWebhook統合](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合設定の詳細](../logstash.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstashは次のようにイベントをログに記録します：

![!LogstashからSplunkに新しいユーザーに関するログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/splunk-user-log.png)

Splunkイベントには次のエントリが表示されます：

![!LogstashからSplunkに新しいユーザーカード](../../../../images/user-guides/settings/integrations/webhook-examples/splunk/logstash-user.png)

## ダッシュボードにイベントを整理する

--8<-- "../include/integrations/application-for-splunk.md"
