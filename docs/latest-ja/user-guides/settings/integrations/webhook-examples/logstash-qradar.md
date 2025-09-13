# Logstash経由のIBM QRadar

本手順では、WallarmとLogstashデータコレクタの統合例を示し、イベントをQRadar SIEMシステムへ転送する方法を説明します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhookのフロー](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## 使用リソース

* [Logstash 7.7.0](#logstash-configuration)がDebian 11.x (bullseye)にインストールされ、`https://logstash.example.domain.com`で利用可能です
* [QRadar V7.3.3](#qradar-configuration-optional)がLinux Red Hatにインストールされ、IPアドレス`https://109.111.35.11:514`で利用可能です
* [EUクラウド](https://my.wallarm.com)のWallarm Consoleに[Logstash統合を設定する](#configuration-of-logstash-integration)ための管理者アクセスが必要です

--8<-- "../include/cloud-ip-by-request.md"

LogstashおよびQRadarのサービスへのリンクは例として記載していますので、応答しません。

### Logstashの設定

Wallarmはwebhook経由で中間データコレクタであるLogstashにログを送信するため、Logstashの設定は次の要件を満たす必要があります:

* POSTまたはPUTリクエストを受け付けます
* HTTPSリクエストを受け付けます
* 公開URLを持ちます
* ログをIBM QRadarへ転送します。本例ではログ転送に`syslog`プラグインを使用します

Logstashの設定は`logstash-sample.conf`ファイルに記述します:

* 受信webhookの処理は`input`セクションで設定します:
    * トラフィックはポート5044に送られます
    * LogstashはHTTPS接続のみを受け付けるように設定します
    * 公的に信頼されたCAが署名したLogstashのTLS証明書は`/etc/server.crt`に配置します
    * TLS証明書の秘密鍵は`/etc/server.key`に配置します
* QRadarへのログ転送とログ出力は`output`セクションで設定します:
    * すべてのイベントログはLogstashからQRadarのIPアドレス`https://109.111.35.11:514`へ転送されます
    * ログは[Syslog](https://en.wikipedia.org/wiki/Syslog)標準に従い、JSON形式でLogstashからQRadarへ転送されます
    * QRadarとの接続はTCPで確立します
    * Logstashのログはコマンドラインにも追加で出力します（15行目）。この設定は、イベントがLogstash経由で記録されていることを確認するために使用します

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
  syslog { # Syslog経由でLogstashからログを転送するためのoutputプラグイン
    host => "109.111.35.11" # 転送先のIPアドレス
    port => "514" # 転送先のポート
    protocol => "tcp" # 接続プロトコル
    codec => json # 転送するログの形式
  }
  stdout {} # コマンドラインにLogstashのログを出力するためのoutputプラグイン
}
```

設定ファイルの詳細は[公式のLogstashドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)を参照できます。

!!! info "Logstash設定のテスト"
    Logstashのログが生成されQRadarへ転送されていることを確認するために、LogstashへPOSTリクエストを送信できます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstashのログ:**
    ![Logstashのログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **QRadarのログ:**
    ![QRadarのログ](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **QRadarのログペイロード:**
    ![QRadarのログ](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### QRadarの設定（任意）

QRadarでは、ログソースを設定します。これにより、QRadarの全ログ一覧からLogstashのログを容易に見つけられますし、さらにログのフィルタリングにも使用できます。ログソースの設定は次のとおりです:

* ログソース名: `Logstash`
* ログソースの説明: `Logs from Logstash`
* ログソースタイプ: Syslog標準で使用する受信ログ用パーサの種類`Universal LEEF`
* プロトコル設定: ログ転送の標準`Syslog`
* ログソース識別子: LogstashのIPアドレス
* その他の設定はデフォルトのままです

QRadarのログソース設定の詳細は[IBM公式ドキュメント](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf)に記載されています。

![Logstash用のQRadarログソース設定](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### Logstash統合の設定

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.md"

![LogstashとのWebhook統合](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

[Logstash統合の設定の詳細](../logstash.md)

## テストの例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Logstashはイベントを次のように記録します:

![LogstashからQRadarへの新規ユーザーに関するログ](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

QRadarのログペイロードには、次のJSON形式のデータが表示されます:

![LogstashからQRadarに表示される新規ユーザーのカード](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)