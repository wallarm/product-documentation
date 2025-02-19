# Fluentd経由でIBM QRadarへ

これらの手順は、WallarmとFluentdデータコレクターの統合例を提供し、イベントをQRadar SIEMシステムに転送する例を示します。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Webhookフロー](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## 使用リソース

* Debian 11.x (bullseye)にインストールされた[Fluentd](#fluentd-configuration)が`https://fluentd-example-domain.com`で利用可能です
* Linux Red Hatにインストールされた[QRadar V7.3.3](#qradar-configuration-optional)がIPアドレス`https://109.111.35.11:514`で利用可能です
* [EU cloud](https://my.wallarm.com)のWallarm Consoleへの管理者アクセスで[Fluentd統合を設定](#configuration-of-fluentd-integration)します

--8<-- "../include/cloud-ip-by-request.md"

FluentdおよびQRadarサービスへのリンクは例として引用されているため、実際には応答しません。

### Fluentdの設定

WallarmはWebhookを介してFluentd中間データコレクターにログを送信するため、Fluentdの設定は以下の要件を満たす必要があります:

* POSTまたはPUTリクエストを受け付けます
* HTTPSリクエストを受け付けます
* パブリックURLを持ちます
* ログをIBM QRadarへ転送します。この例では`remote_syslog`プラグインを使用してログを転送します

Fluentdは`td-agent.conf`ファイルで設定されています:

* 受信Webhook処理は`source`ディレクティブで設定されています:
    * トラフィックがポート9880に送信されます
    * FluentdはHTTPS接続のみを受け付けるように設定されています
    * 公開トラスト済みCAが署名したFluentd TLS証明書は`/etc/ssl/certs/fluentd.crt`ファイルにあります
    * TLS証明書のプライベートキーは`/etc/ssl/private/fluentd.key`ファイルにあります
* QRadarへのログ転送とログ出力は`match`ディレクティブで設定されています:
    * すべてのイベントログがFluentdからコピーされ、IPアドレス`https://109.111.35.11:514`のQRadarへ転送されます
    * Fluentdのログは[Syslog](https://en.wikipedia.org/wiki/Syslog)標準に従い、JSON形式でQRadarへ転送されます
    * QRadarとの接続はTCP経由で確立されます
    * FluentdのログはJSON形式でコマンドラインにも出力されます（コード行19～22）。この設定は、Fluentd経由でイベントがログに記録されていることを検証するために使用されます

```bash linenums="1"
<source>
  @type http # HTTPおよびHTTPSトラフィック用の入力プラグイン
  port 9880 # 受信リクエスト用のポート
  <transport tls> # 接続処理の設定
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # Syslog経由でFluentdのログを転送する出力プラグイン
      host 109.111.35.11 # ログ転送先のIPアドレス
      port 514 # ログ転送先のポート
      protocol tcp # 接続プロトコル
    <format>
      @type json # 転送されるログの形式
    </format>
  </store>
  <store>
     @type stdout # Fluentdログをコマンドラインに出力する出力プラグイン
     output_type json # コマンドラインに出力されるログの形式
  </store>
</match>
```

設定ファイルの詳細な説明は[公式Fluentdドキュメント](https://docs.fluentd.org/configuration/config-file)にあります。

!!! info "Fluentd設定のテスト"
    Fluentdログが作成されQRadarへ転送されていることを確認するため、Fluentdに対してPUTまたはPOSTリクエストを送信できます。

    **リクエスト例:**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdログ:**
    ![Fluentdのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **QRadarのログ:**
    ![QRadarのログ](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **QRadarログのペイロード:**
    ![QRadarのログペイロード](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### QRadarの設定（オプション）

QRadarではログソースが設定されます。これにより、QRadarの全ログリストからFluentdログを容易に見つけることができ、さらにログのフィルタリングにも利用できます。ログソースは以下のように設定されます:

* **ログソース名**: `Fluentd`
* **ログソースの説明**: `Fluentdからのログ`
* **ログソースの種類**: Syslog標準で使用される受信ログパーサの種類 `Universal LEEF`
* **プロトコルの設定**: ログ転送の標準 `Syslog`
* **ログソース識別子**: FluentdのIPアドレス
* その他デフォルトの設定

QRadarのログソース設定の詳細は[公式IBMドキュメント](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf)にあります。

![FluentdのためのQRadarログソース設定](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### Fluentd統合の設定

--8<-- "../include/integrations/webhook-examples/create-fluentd-webhook.md"

![FluentdとのWebhook統合](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentd統合の設定の詳細](../fluentd.md)

## テスト例

--8<-- "../include/integrations/webhook-examples/send-test-webhook.md"

Fluentdは次のようにイベントをログに記録します:

![FluentdからのQRadarにおける新規ユーザのログ](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

次のJSON形式のデータがQRadarログのペイロードに表示されます:

![FluentdからのQRadarにおける新規ユーザカード](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)