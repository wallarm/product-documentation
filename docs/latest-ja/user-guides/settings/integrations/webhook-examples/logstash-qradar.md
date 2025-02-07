# IBM QRadarをLogstash経由で利用

本手順書は、WallarmとLogstashデータコレクタの統合例を紹介し、イベントをQRadar SIEMシステムへ転送する方法について説明します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## 使用リソース

* [Logstash 7.7.0](#logstash-configuration)はDebian 11.x(bullseye)にインストールされ、`https://logstash.example.domain.com`で利用可能です
* [QRadar V7.3.3](#qradar-configuration-optional)はLinux Red Hatにインストールされ、IPアドレス`https://109.111.35.11:514`で利用可能です
* [EU cloud](https://my.wallarm.com)上のWallarm Console管理者アクセス権を持って[Logstash統合の設定](#configuration-of-logstash-integration)を行う必要があります

--8<-- "../include/cloud-ip-by-request.md"

LogstashおよびQRadarサービスへのリンクは例として示しているため、実際には応答しません。

### Logstashの設定

Wallarmはwebhookを介してLogstash中間データコレクタにログを送信するため、Logstashの設定は以下の要件を満たす必要があります：

* POSTまたはPUTリクエストを受け付ける
* HTTPSリクエストを受け付ける
* パブリックURLを持つ
* ログをIBM QRadarへ転送する（今回の例では`syslog`プラグインを使用してログを転送します）

Logstashは`logstash-sample.conf`ファイルで設定されています：

* 受信webhookの処理は`input`セクションで設定されています：
    * 通信はポート5044に送信されます
    * LogstashはHTTPS接続のみを受け付けるように設定されています
    * 公開で信頼されているCAによって署名されたLogstashのTLS証明書は`/etc/server.crt`に配置されています
    * TLS証明書の秘密鍵は`/etc/server.key`に配置されています
* QRadarへのログ転送およびログ出力は`output`セクションで設定されています：
    * すべてのイベントログはLogstashからQRadarへ、IPアドレス`https://109.111.35.11:514`に転送されます
    * [Syslog](https://en.wikipedia.org/wiki/Syslog)規格に従い、LogstashからQRadarへログがJSON形式で転送されます
    * QRadarとの接続はTCP経由で確立されます
    * Logstashのログはコマンドラインにも出力されます（15行目のコード参照）。この設定は、イベントがLogstash経由で記録されていることを確認するために使用されます

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィック用のinputプラグイン
    port => 5044 # 受信リクエスト用ポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
    ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
  }
}
output {
  syslog { # Syslogを介してLogstashからログを転送するoutputプラグイン
    host => "109.111.35.11" # ログ転送先のIPアドレス
    port => "514" # ログ転送先のポート
    protocol => "tcp" # 接続プロトコル
    codec => json # 転送ログのフォーマット
  }
  stdout {} # Logstashのログをコマンドラインに出力するoutputプラグイン
}
```

設定ファイルのより詳細な説明は[公式Logstashドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)に記載されています。

!!! info "Logstash設定のテスト"
    Logstashのログが生成されQRadarへ転送されることを確認するため、POSTリクエストをLogstashに送信することができます。

    **リクエスト例：**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashのログ：**
    ![Logs in Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **QRadarのログ：**
    ![Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **QRadarログペイロード：**
    ![Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### QRadarの設定 (オプション)

QRadarではログソースが設定されます。これにより、QRadar内のすべてのログ一覧からLogstashのログを容易に見つけることが可能になり、さらなるログのフィルタリングにも利用できます。ログソースの設定は以下の通りです：

* **ログソース名**：`Logstash`
* **ログソースの説明**：`Logstashからのログ`
* **ログソースタイプ**：Syslog標準で使用される受信ログパーサの種類`Universal LEEF`
* **プロトコルの設定**：ログ転送規格`Syslog`
* **ログソース識別子**：LogstashのIPアドレス
* その他デフォルト設定

QRadarのログソース設定のより詳細な説明は[IBM公式ドキュメント](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf)に記載されています。

![Logstash用QRadarログソース設定](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### Logstash統合の設定

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![LogstashとのWebhook統合](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合設定の詳細](../logstash.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstashは以下のようにイベントをログに記録します：

![QRadar向けLogstashの新規ユーザーに関するログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

以下のJSON形式のデータがQRadarログペイロードに表示されます：

![QRadarに表示されたLogstashからの新規ユーザー情報](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)