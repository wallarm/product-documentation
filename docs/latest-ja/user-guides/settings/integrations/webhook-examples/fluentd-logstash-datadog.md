# Fluentd / Logstash経由でのDatadog

Wallarmを設定して、FluentdまたはLogstashという中間データコレクターを通じてDatadogに検出されたイベントの通知を送信することができます。

![WallarmからDatadogへのデータコレクター経由での通知送信](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "Datadogとのネイティブな統合"
    Wallarmはまた、[Datadog APIを経由したDatadogとのネイティブな統合](../datadog.md)もサポートしています。このネイティブな統合では、中間のデータコレクターの使用は必要ありません。

## 使用されるリソース

* 公開URLで利用可能なFluentdまたはLogstashのサービス
* 公開URLで利用可能なDatadogのサービス
* [EUクラウド](https://my.wallarm.com)のWallarm Consoleへの管理者アクセス、および[Fluentd/Logstash統合の設定](#fluentd-または-logstash-との統合の設定)

## 要件

Wallarmはwebhooks経由で中間データコレクターにログを送信するため、FluentdまたはLogstashの設定は次の要件を満たす必要があります：

* POSTまたはPUTリクエストを受け入れること
* HTTPSリクエストを受け入れること
* 公開URLを持つこと
* `datadog_logs`のLogstashプラグインまたは`fluent-plugin-datadog`のFluentdプラグインを経由してDatadogにログを転送すること

=== "Logstash設定例"
    1. Datadogにログを転送するための [`datadog_logs`プラグインをインストール](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it)します。
    1. Logstashを設定して、受信リクエストを読み込み、Datadogにログを転送します。

    `logstash-sample.conf`設定ファイルの例:

    ```bash linenums="1"
    input {
      http { # HTTPとHTTPSのトラフィック用の入力プラグイン
        port => 5044 # 受信リクエスト用のポート
        ssl => true # HTTPSのトラフィック処理
        ssl_certificate => "/etc/server.crt" # Logstash TLS証明書
        ssl_key => "/etc/server.key" # TLS証明書のプライベートキー
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # Wallarmログのさらなるフィルタリングのために、Datadogログレコードにソースフィールドを追加するミューテートフィルター
        }
      }
    }
    output {
      stdout {} # コマンドライン上のLogstashログを印刷する出力プラグイン
      datadog_logs { # LogstashログをDatadogに転送する出力プラグイン
          api_key => "XXXX" # Datadogの組織で生成されたAPIキー
          host => "http-intake.logs.datadoghq.eu" # Datadogエンドポイント（登録地域に依存する）
      }
    }
    ```

    * [Logstash設定ファイル構造に関する文書](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [`datadog_logs`プラグインに関する文書](https://docs.datadoghq.com/integrations/logstash/)
=== "Fluentd設定例"
    1. Datadogにログを転送するための[`fluent-plugin-datadog`プラグインをインストール](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements)します。
    1. Fluentdを設定して、受信リクエストを読み込み、Datadogにログを転送します。

    `td-agent.conf`設定ファイルの例：

    ```bash linenums="1"
    <source>
      @type http # HTTPとHTTPSのトラフィック用の入力プラグイン
      port 9880 # 受信リクエスト用のポート
      <transport tls> # コネクションハンドリング設定
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # FluentdからDatadogへのログを転送する出力プラグイン
      @id awesome_agent
      api_key XXXX # Datadogの組織で生成されたAPIキー
      host 'http-intake.logs.datadoghq.eu' # Datadogエンドポイント（登録地域に依存する）
    
      # 任意の設定
      include_tag_key true
      tag_key 'tag'
    
      # 任意のタグ
      dd_source 'wallarm' # Wallarmログのさらなるフィルタリングのために、Datadogログレコードにソースフィールドを追加
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

    * [Fluentd設定ファイル構造に関する文書](https://docs.fluentd.org/configuration/config-file)
    * [`fluent-plugin-datadog`プラグインに関する文書](https://docs.datadoghq.com/integrations/fluentd)

## FluentdまたはLogstashとの統合の設定

1. Wallarm Console → **Integrations** → **Fluentd**/**Logstash** に進み、Datadog統合を設定します。
1. 統合の名前を入力します。
1. 対象となるFluentdまたはLogstashのURL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を構成します：

    --8<-- "../include-ja/integrations/webhook-advanced-settings.md"
1. 指定したURLに通知を送信するためにイベントタイプを選択します。イベントが選択されない場合、通知は送信されません。
1. [統合をテスト](#統合のテスト)し、設定が正しいことを確認します。
1. **統合を追加** をクリックします。

Fluentd統合の例：

![Fluentdとの統合を追加する](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## 統合のテスト

--8<-- "../include-ja/integrations/test-integration-advanced-data.md"

FluentdまたはLogstashの中間データコレクターでのテストログ：

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

テストDatadogログ：

![テストDatadogログ](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

他のレコードの中でWallarmログを見つけるために、Datadog Logsサービスで`source:wallarm_cloud`検索タグを使用できます。