					# Datadog への Fluentd/Logstash 経由

Wallarm を Fluentd または Logstash の中間データコレクターを介して Datadog に検出されたイベントの通知を送信するように設定できます。

--8<-- "../include/integrations/webhook-examples/overview.ja.md"

![!Wallarm からデータコレクター経由で Datadog へ通知を送信](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "Datadog とのネイティブな統合"
    Wallarm はまた、[Datadog API 経由での Datadog とのネイティブな統合](../datadog.ja.md)もサポートしています。ネイティブな統合では、中間データコレクターを使用する必要はありません。

## 使用されるリソース

* 公開URLで利用可能な Fluentd または Logstash サービス
* 公開URLで利用可能な Datadog サービス
* [Fluentd/Logstash との統合の設定](#fluentd-or-logstash-との統合を設定する)を行うための [EU クラウド](https://my.wallarm.com) の Wallarm Console への管理者アクセス

--8<-- "../include/cloud-ip-by-request.ja.md"

## 要件

Wallarm が Webhooks 経由で中間データコレクターにログを送信するため、Fluentd または Logstash の設定は以下の要件を満たす必要があります。

* POST または PUT リクエストを受け入れる
* HTTPS リクエストを受け入れる
* 公開URLを持つ
* `datadog_logs` Logstash プラグインまたは `fluent-plugin-datadog` Fluentd プラグインを介して Datadog にログを転送する

=== "Logstash 設定例"
    1. [Datadog にログを転送するための `datadog_logs` プラグインをインストール](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it)します。
    1. Logstash で受信リクエストを読み込み、Datadog へログを転送するように設定します。

    `logstash-sample.conf` 設定ファイルの例：

    ```bash linenums="1"
    input {
      http { # HTTP および HTTPS トラフィック用の入力プラグイン
        port => 5044 # 受信リクエスト用のポート
        ssl => true # HTTPS トラフィック処理
        ssl_certificate => "/etc/server.crt" # Logstash の TLS 証明書
        ssl_key => "/etc/server.key" # TLS 証明書の秘密鍵
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # Wallarm ログのさらなるフィルタリングのために、Datadog ログレコードにソースフィールドを追加するミューテーションフィルター
        }
      }
    }
    output {
      stdout {} # コマンドラインに Logstash ログを表示する出力プラグイン
      datadog_logs { # Logstash ログを Datadog に転送する出力プラグイン
          api_key => "XXXX" # Datadog の組織用に生成された API キー
          host => "http-intake.logs.datadoghq.eu" # Datadog エンドポイント（登録地域に依存）
      }
    }
    ```

    * [Logstash 設定ファイル構造のドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [`datadog_logs`プラグインのドキュメント](https://docs.datadoghq.com/integrations/logstash/)
=== "Fluentd 設定例"
    1. [Datadog にログを転送料するための `fluent-plugin-datadog` プラグインをインストール](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements)します。
    1. Fluentd で受信リクエストを読み込み、Datadog へログを転送するように設定します。

    `td-agent.conf` 設定ファイルの例：

    ```bash linenums="1"
    <source>
      @type http # HTTP および HTTPS トラフィック用の入力プラグイン
      port 9880 # 受信リクエスト用のポート
      <transport tls> # 接続処理の設定
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # Fluentd から Datadog にログを転送する出力プラグイン
      @id awesome_agent
      api_key XXXX # Datadog の組織用に生成された API キー
      host 'http-intake.logs.datadoghq.eu' # Datadog エンドポイント（登録地域に依存）
    
      # オプション
      include_tag_key true
      tag_key 'tag'
    
      # オプションのタグ
      dd_source 'wallarm' # Wallarm ログのさらなるフィルタリングのために、Datadog ログレコードにソースフィールドを追加する
      dd_tags 'integration:fluentd'
    
      <buffer>
              @type memory
              flush_thread_count 4
              flush_interval 3s
              chunk_limit_size 5m
              chunk_limit_records 500
      </buffer>
    </match>
    ```

    * [Fluentd 設定ファイル構造のドキュメント](https://docs.fluentd.org/configuration/config-file)
    * [`fluent-plugin-datadog`プラグインのドキュメント](https://docs.datadoghq.com/integrations/fluentd)

## Fluentd または Logstash との統合を設定する

1. Wallarm Console → **Integrations** → **Fluentd**/**Logstash** で、Datadog の統合設定に進みます。
1. 統合名を入力します。
1. 対象の Fluentd または Logstash URL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を構成します。

    --8<-- "../include/integrations/webhook-advanced-settings.ja.md"
1. 指定された URL に通知を送信するイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
1. [統合をテスト](#統合をテストする)して、設定が正しいことを確認します。
1. **統合を追加**をクリックします。

Fluentd の統合例：

![!Fluentd との統合を追加](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## 統合をテストする

--8<-- "../include/integrations/test-integration.ja.md"

Fluentd または Logstash の中間データコレクターのテストログ：

```json
[
    {
        summary:"[Test message] [Test partner(US)] New vulnerability detected",
        description:"Notification type: vuln

                    New vulnerability was detected in your system.

                    ID: 
                    Title: Test
                    Domain: example.com
                    Path: 
                    Method: 
                    Discovered by: 
                    Parameter: 
                    Type: Info
                    Threat: Medium

                    More details: https://us1.my.wallarm.com/object/555


                    Client: TestCompany
                    Cloud: US
                    ",
        details:{
            client_name:"TestCompany",
            cloud:"US",
            notification_type:"vuln",
            vuln_link:"https://us1.my.wallarm.com/object/555",
            vuln:{
                domain:"example.com",
                id:null,
                method:null,
                parameter:null,
                path:null,
                title:"Test",
                discovered_by:null,
                threat:"Medium",
                type:"Info"
            }
        }
    }
]
```

テストの Datadog ログ：

![!テスト Datadog ログ](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

Wallarm ログを他のレコードの中から見つけるために、Datadog Logs サービスで `source:wallarm_cloud` 検索タグを使用できます。