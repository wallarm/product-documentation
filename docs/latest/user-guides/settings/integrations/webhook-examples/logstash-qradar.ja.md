# IBM QRadar via Logstash

これらの指示により、WallarmとLogstashデータコレクタとの間の例としての統合と、さらにQRadar SIEM システムにイベントを転送する方法が提供されます。

--8<-- "../include/integrations/webhook-examples/overview.ja.md"

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-scheme.png)

## 使用されるリソース

* [Logstash 7.7.0](#logstash-configuration)がDebian 11.x (bullseye)にインストールされ、`https://logstash.example.domain.com`で利用可能です。
* [QRadar V7.3.3](#qradar-configuration-optional)がLinux Red Hatにインストールされ、IPアドレス`https://109.111.35.11:514`で利用可能です。
* [EU cloud](https://my.wallarm.com)のWallarm Consoleへの管理者アクセスがある場合は、[Logstash の統合設定](#configuration-of-logstash-integration)が可能です。

--8<-- "../include/cloud-ip-by-request.ja.md"

LogstashおよびQRadar サービスへのリンクは例として挙げられているため、応答はありません。

### Logstash 設定

Wallarm が Webhook を介して Logstash 中間データコレクタにログを送信するため、Logstash の設定は以下の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け付ける
* HTTPSリクエストを受け付ける
* 公開されたURL
* この例では`syslog`プラグインを使用して、IBM Qradar にログを転送する

Logstashは`logstash-sample.conf`ファイルで設定されます。

* 入力Webhook処理は、`input`セクションで設定されます。
    * トラフィックはポート5044に送信されます
    * LogstashはHTTPS接続のみを受け付けるように設定されています
    * Logstash TLS証明書は、ファイル `/etc/server.crt` 内に公開されています。
    * TLS 証明書の秘密鍵は、ファイル `/etc/server.key` 内にあります
* QRadarへのログ転送およびログ出力は、`output`セクションで設定されています。
    * すべてのイベントログが、Logstash から QRadar の IP アドレス `https://109.111.35.11:514` に転送されます
    * Logs are forwarded from Logstash to QRadar in the JSON format according to the [Syslog](https://en.wikipedia.org/wiki/Syslog) standard
    * QRadar との接続はTCP経由で確立されます
    * Logstashログは、さらに15行目のコードでコマンドラインに表示されます。この設定は、Logstash経由でイベントがログに記録されていることを確認するために使用されます

```bash linenums="1"
入力{
  http { # 入力プラグインは HTTP および HTTPS トラフィック用
    ポート=> 5044 # 送信要求用のポート
    ssl => true # HTTPSトラフィック処理
    ssl_certificate => "/etc/server.crt" # Logstash TLS 証明書
    ssl_key => "/etc/server.key"バ #{タイムズバース}TLS証明書のプライベートキー
  }
}
出力 {
  syslog { # Logstash から Syslog 経由でログを転送する出力プラグイン
    ホスト => "109.111.35.11" # ログを転送する IP アドレス
    ポート=> 514"バ #{タイムズバース}ログを転送するポート
    プロトコル => "tcp"バ  {zipoc}接続プロトコル
    コーデック => jsonバ  {送信されるログのフォーマット}
  }
  標準出力 {} # コマンドライン上での Logstash ログの出力プラグイン
}
```

設定ファイルの詳細な説明は、[公式Logstashドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)で利用可能です。

!!! info "Logstash設定のテスト"
    Logstash ログが作成され、QRadar に転送されることを確認するために、Logstash に POST リクエストを送信することができます。

    **リクエストの例:**
    ```curl
    curl -X POST 'https://logstash.example.domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Logstash ログ:**
    ![!Logs in Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-curl-log.png)

    **QRadarログ:**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log.png)

    **QRadarログペイロード:**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-curl-log-payload.png)

### QRadar構成 (オプション)

QRadarでは、ログソースが設定されます。これにより、QRadar のすべてのログリストの中で Logstash ログを簡単に見つけることができ、さらにログのフィルタリングに使用できます。ログソースは以下のように設定されています。

* **ログソース名**: `Logstash`
* **ログソースの説明**: `Logs from Logstash`
* **ログソースタイプ**: Syslog標準を使用した受信ログパーサのタイプ `Universal LEEF`
* **プロトコル構成**: ログ転送の標準 `Syslog`
* **ログソース識別子**: Logstash の IP アドレス
* その他のデフォルト設定は変更されません

QRadar ログソース設定の詳細な説明は、[公式 IBM ドキュメント](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf)で利用可能です。

![!QRadar log source setup for Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-setup.png)

### Logstash 統合の構成

--8<-- "../include/integrations/webhook-examples/create-logstash-webhook.ja.md"

![!Webhook integration with Logstash](../../../../images/user-guides/settings/integrations/add-logstash-integration.png)

\Logstash 統合設定の詳細はこちら](../logstash.ja.md)

## 例のテスト

--8<-- "../include/integrations/webhook-examples/send-test-webhook.ja.md"

Logstash では、次のようにイベントをログに記録します。

![!Log about new user in QRadar from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/logstash/qradar-user-log.png)

QRadarログペイロードには、以下の JSON 形式のデータが表示されます。

![!New user card in QRadar from Logstash](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/logstash-user.png)