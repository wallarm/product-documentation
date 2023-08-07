# IBM QRadar経由のLogstash

これらの指示は、WallarmとLogstashデータコレクターの統合の例を提供し、さらにイベントをQRadar SIEMシステムに転送します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## 使用したリソース

* [Logstash 7.7.0](#logstash-configuration) はDebian 11.x (bullseye)にインストールされ、`https://logstash.example.domain.com`で利用可能です
* [QRadar V7.3.3](#qradar-configuration-optional) はLinux Red Hat上にインストールされ、IPアドレス `https://109.111.35.11:514`で利用可能です
* Wallarm Consoleへの管理者アクセスは、[EUクラウド](https://my.wallarm.com)にあり、[Logstash統合の設定](#configuration-of-logstash-integration)を行います

--8<-- "../include/cloud-ip-by-request.md"

LogstashとQRadarのサービスへのリンクは例として引用されていますので、応答しません。

### Logstashの設定

WallarmがWebhooks経由でLogstash中間データコレクターにログを送信するため、Logstashの設定は以下の要件を満たす必要があります：

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受け入れる
* 公開されたURLを有する
* IBM Qradarにログを転送する、この例では `syslog`プラグインを使用してログを転送しています

Logstashは `logstash-sample.conf` ファイルで設定されています：

* 受信Webhookの処理は `input` セクションで設定されています：
    * トラフィックはポート5044に送信されます
    * LogstashはHTTPS接続のみを受け入れるように設定されています
    * LogstashのTLS証明書は公に信頼されたCAによって署名されており、`/etc/server.crt` ファイル内に位置しています
    * TLS証明書の秘密鍵は `/etc/server.key` ファイル内に位置しています
* QRadarへのログの転送とログ出力は `output` セクションで設定されています：
    * すべてのイベントログはLogstashからQRadarに転送され、IPアドレス `https://109.111.35.11:514`で利用可能です
    * ログはLogstashからQRadarにJSON形式で転送され、[Syslog](https://en.wikipedia.org/wiki/Syslog)標準に従います
    * QRadarとの接続はTCP経由で確立されます
    * Logstashのログはさらにコマンドラインに出力されます（15行目のコード）。この設定は、ログがLogstash経由で記録されていることを確認するために使用されます

```bash linenums="1"
input {
  http { # HTTPおよびHTTPSトラフィックの入力プラグイン
    port => 5044 # 受信リクエストのポート
    ssl => true # HTTPSトラフィックの処理
    ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
    ssl_key => "/etc/server.key" # TLS証明書のプライベートキー
  }
}
output {
  syslog { # Syslog経由でLogstashからログを転送するための出力プラグイン
    host => "109.111.35.11" # ログを転送するIPアドレス
    port => "514" # ログを転送するポート
    protocol => "tcp" # 接続プロトコル
    codec => json # 転送されるログの形式
  }
  stdout {} # Logstashのログをコマンドラインに表示する出力プラグイン
}
```

設定ファイルのより詳しい説明は、[公式Logstashドキュメンテーション](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)で利用可能です。

!!! info "Logstash設定のテスト"
    Logstashのログが作成され、QRadarに転送されることを確認するために、POSTリクエストをLogstashに送信できます。

    **リクエストの例：**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashのログ：**
    ![!Logs in Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **QRadarのログ：**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **QRadarのログペイロード：**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### QRadarの設定 (オプショナル)

QRadarでは、ログソースが設定されます。これは、QRadarのすべてのログ一覧でLogstashのログを簡単に見つけるのに役立ち、またさらなるログのフィルタリングにも使用できます。ログソースは以下のように設定されます：

* **ログソース名**: `Logstash`
* **ログソースの説明**: `Logstashからのログ`
* **ログソースタイプ**: Syslog標準を使用した入力ログパーサーのタイプ `Universal LEEF`
* **プロトコル設定**: ログ転送の標準 `Syslog`
* **ログソース識別子**: LogstashのIPアドレス
* その他のデフォルト設定

QRadarログソースの設定についての詳しい説明は、[公式IBMドキュメンテーション](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf)で利用可能です。

![!QRadar log source setup for Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### Logstash統合の設定

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![!Webhook integration with Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合設定の詳細](../logstash.md)

## 例のテスト

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstashは次のようにイベントをログに記録します：

![!Log about new user in QRadar from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

次のデータがQRadarのログペイロードにJSON形式で表示されます：

![!New user card in QRadar from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)