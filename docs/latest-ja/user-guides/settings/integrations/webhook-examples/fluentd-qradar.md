# IBM QRadar via Fluentd

これらの指示により、FluentdデータコレクタとのWallarmの統合の例を提供し、さらにQRadar SIEMシステムにイベントを転送します。

--8<-- "../include-ja/integrations/webhook-examples/overview.md"

![!Webhook flow](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-scheme.png)

## 使用されるリソース

* [Fluentd](#fluentd-configuration) はDebian 11.x (bullseye)にインストールされ、`https://fluentd-example-domain.com` で利用可能
* [QRadar V7.3.3](#qradar-configuration-optional) はLinux Red Hat上にインストールされ、IPアドレス `https://109.111.35.11:514` で利用可能
* Wallarm Consoleへの管理者アクセスは[EU cloud](https://my.wallarm.com)で行い、[Fluentdの統合を設定します](#configuration-of-fluentd-integration)

--8<-- "../include-ja/cloud-ip-by-request.md"

FluentdとQRadarサービスへのリンクは例示されているため、応答しません。

### Fluentdの設定

Wallarmがウェブフック経由でFluentdの中間データコレクタにログを送信するため、Fluentdの設定は次の要件を満たす必要があります：

* POSTまたはPUTリクエストを受け付ける
* HTTPSリクエストを受け入れる
* 公開URLを持つ
* ログをIBM QRadarに転送するため、この例では`remote_syslog`プラグインを使用してログを転送しています

Fluentdは`td-agent.conf`ファイルで設定されます：

* 受信するウェブフックの処理は`source`ディレクティブで設定されています：
    * トラフィックはポート9880に送信されます
    * FluentdはHTTPS接続のみを受け入れるように設定されています
    * FluentdのTLS証明書は公に信頼されたCAによって署名され、ファイル`/etc/ssl/certs/fluentd.crt`内に位置しています
    * TLS証明書の秘密鍵はファイル`/etc/ssl/private/fluentd.key`内に位置しています
* QRadarへのログの転送とログの出力は`match`ディレクティブで設定されています：
    * すべてのイベントログはFluentdからコピーされ、IPアドレス`https://109.111.35.11:514`のQRadarに転送されます
    * ログはFluentdからQRadarへ[Syslog](https://en.wikipedia.org/wiki/Syslog)標準に従ってJSON形式で転送されます
    * QRadarとの接続はTCPを経由して確立されます
    * FluentdのログはさらにコマンドラインでJSON形式（19-22行目のコード）で出力されます。この設定は、イベントがFluentd経由でログ記録されていることを確認するために使用されます

```bash linenums="1"
<source>
  @type http # HTTPおよびHTTPSトラフィックの入力プラグイン
  port 9880 # 入力要求のポート
  <transport tls> # 接続処理の構成
    cert_path /etc/ssl/certs/fluentd.crt
    private_key_path /etc/ssl/private/fluentd.key
  </transport>
</source>
<match **>
  @type copy
  <store>
      @type remote_syslog # Fluentd経由でログを転送する出力プラグイン
      host 109.111.35.11 # ログを転送するIPアドレス
      port 514 # ログを転送するポート
      protocol tcp # 接続プロトコル
    <format>
      @type json # 転送ログの形式
    </format>
  </store>
  <store>
     @type stdout # コマンドラインでFluentdログを出力するプラグイン
     output_type json # コマンドラインで出力されるログの形式
  </store>
</match>
```

設定ファイルの詳細な説明は、[公式のFluentdドキュメンテーション](https://docs.fluentd.org/configuration/config-file)で利用可能です。

!!! info "Fluentd構成のテスト"
    Fluentdログが作成され、QRadarに転送されていることをチェックするために、PUTまたはPOSTリクエストをFluentdに送信できます。

    **リクエストの例：**
    ```curl
    curl -X POST 'https://fluentd-example-domain.com' -H "Content-Type: application/json" -d '{"key1":"value1", "key2":"value2"}'
    ```

    **Fluentdログ：**
    ![!Logs in Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-curl-log.png)

    **QRadarログ：**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log.png)

    **QRadarログペイロード：**
    ![!Logs in QRadar](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-curl-log-payload.png)

### QRadarの設定（オプション）

QRadarでは、ログソースが設定されています。これにより、QRadarのすべてのログのリストでFluentdログを簡単に見つけることができますし、さらなるログフィルタリングにも使用できます。ログソースは次のように設定されています：

* **ログソース名**： `Fluentd`
* **ログソースの説明**： `Fluentdからのログ`
* **ログソースの種類**： Syslog標準と共に使用される入力ログパーサのタイプ `Universal LEEF`
* **プロトコル構成**： ログ転送の標準 `Syslog`
* **ログソース識別子**： Fluentd IPアドレス
* 他のデフォルト設定

QRadarログソース設定の詳細は、[公式IBMドキュメンテーション](https://www.ibm.com/support/knowledgecenter/en/SS42VS_DSM/com.ibm.dsm.doc/b_dsm_guide.pdf?origURL=SS42VS_DSM/b_dsm_guide.pdf)で利用可能です。

![!QRadar log source setup for Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-setup.png)

### Fluentd統合の設定

--8<-- "../include-ja/integrations/webhook-examples/create-fluentd-webhook.md"

![!Webhook integration with Fluentd](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

[Fluentdの統合設定についての詳細](../fluentd.md)

## テストの例

--8<-- "../include-ja/integrations/webhook-examples/send-test-webhook.md"

Fluentdは次のようにイベントをログに記録します：

![!Log about new user in QRadar from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/fluentd/qradar-user-log.png)

QRadarのログペイロードには次のJSON形式のデータが表示されます：

![!New user card in QRadar from Fluentd](../../../../images/user-guides/settings/integrations/webhook-examples/qradar/fluentd-user.png)
