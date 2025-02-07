# Datadog経由のFluentd/Logstash

WallarmはFluentdまたはLogstash中継データ収集システムを介して、検出イベントの通知をDatadogに送信するように設定できます。

--8<-- "../include/integrations/webhook-examples/overview.md"

![Wallarmからデータ収集システム経由でDatadogへ通知を送信](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "Datadogとのネイティブ統合"
    Wallarmは[Datadog APIを利用したDatadogとのネイティブ統合](../datadog.md)もサポートします。ネイティブ統合では、中継データ収集システムの使用は不要です。

## 使用リソース

* パブリックURLで利用可能なFluentdまたはLogstashサービス
* パブリックURLで利用可能なDatadogサービス
* Wallarm Console（[EUクラウド](https://my.wallarm.com)）への管理者アクセスで、[Fluentd／Logstash統合の設定](#setting-up-integration-with-fluentd-or-logstash)が可能

--8<-- "../include/cloud-ip-by-request.md"

## 要件

Wallarmはwebhookを介して中継データ収集システムへログを送信するため、FluentdまたはLogstashの構成は以下の要件を満たす必要があります:

* POSTまたはPUTリクエストを受け入れる
* HTTPSリクエストを受信する
* パブリックURLを持つ
* `datadog_logs` Logstashプラグインまたは`fluent-plugin-datadog` Fluentdプラグインを介してログをDatadogに転送する

=== "Logstashの設定例"
    1. Datadogにログを転送するために[Install the `datadog_logs` plugin](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it)を実施します。
    1. Logstashを設定して、受信リクエストを読み取り、ログをDatadogに転送するように構成します。

    例: `logstash-sample.conf`構成ファイルの設定例:

    ```bash linenums="1"
    input {
      http { # HTTPおよびHTTPSトラフィックの入力プラグイン
        port => 5044 # 受信リクエスト用のポート
        ssl => true # HTTPSトラフィックの処理
        ssl_certificate => "/etc/server.crt" # Logstash用TLS証明書
        ssl_key => "/etc/server.key" # TLS証明書用秘密鍵
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # Wallarmログの追加フィルタリングのためにDatadogログレコードにソースフィールドを追加するmutateフィルタ
        }
      }
    }
    output {
      stdout {} # Logstashログをコマンドラインに出力する出力プラグイン
      datadog_logs { # LogstashログをDatadogに転送する出力プラグイン
          api_key => "XXXX" # Datadogで組織向けに生成されたAPIキー
          host => "http-intake.logs.datadoghq.eu" # Datadogのエンドポイント（登録地域に依存）
      }
    }
    ```

    * [Logstash構成ファイルの構造に関するドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [`datadog_logs`プラグインに関するドキュメント](https://docs.datadoghq.com/integrations/logstash/)
=== "Fluentdの設定例"
    1. Datadogにログを転送するために[Install the `fluent-plugin-datadog` plugin](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements)を実施します。
    1. Fluentdを設定して、受信リクエストを読み取り、ログをDatadogに転送するように構成します。

    例: `td-agent.conf`構成ファイルの設定例:

    ```bash linenums="1"
    <source>
      @type http # HTTPおよびHTTPSトラフィックの入力プラグイン
      port 9880 # 受信リクエスト用のポート
      <transport tls> # 接続処理の設定
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # FluentdからDatadogにログを転送する出力プラグイン
      @id awesome_agent
      api_key XXXX # Datadogで組織向けに生成されたAPIキー
      host 'http-intake.logs.datadoghq.eu' # Datadogのエンドポイント（登録地域に依存）
    
      # オプション
      include_tag_key true
      tag_key 'tag'
    
      # オプションのタグ
      dd_source 'wallarm' # Wallarmログの追加フィルタリングのためにDatadogログレコードにソースフィールドを追加
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

    * [Fluentd構成ファイルの構造に関するドキュメント](https://docs.fluentd.org/configuration/config-file)
    * [`fluent-plugin-datadog`プラグインに関するドキュメント](https://docs.datadoghq.com/integrations/fluentd)

## FluentdまたはLogstashとの統合の設定

1. Wallarm Consoleの**Integrations** → **Fluentd**/**Logstash**に進み、Datadog統合設定に移ります。
1. 統合名を入力します。
1. 対象のFluentdまたはLogstashのURL（Webhook URL）を指定します。
1. 必要に応じて、詳細設定を構成します:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. 指定されたURLへ通知送信をトリガーするイベントタイプを選択します。イベントが選択されていない場合、通知は送信されません。
1. [統合のテスト](#testing-integration)を行い、設定が正しいことを確認します。
1. **Add integration**をクリックします。

Fluentd統合の例:

![Fluentdとの統合を追加](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## 統合のテスト

--8<-- "../include/integrations/test-integration-advanced-data.md"

FluentdまたはLogstash中継データ収集システム内のテストログ:

```json
[
    {
        summary:"[テストメッセージ] [テストパートナー(US)] 新たな脆弱性を検出しました",
        description:"通知タイプ: vuln

                    システムで新たな脆弱性が検出されました。

                    ID: 
                    タイトル: テスト
                    ドメイン: example.com
                    パス: 
                    メソッド: 
                    検出者: 
                    パラメータ: 
                    タイプ: Info
                    脅威: Medium

                    詳細: https://us1.my.wallarm.com/object/555


                    クライアント: TestCompany
                    クラウド: US
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
                title:"テスト",
                discovered_by:null,
                threat:"Medium",
                type:"Info"
            }
        }
    }
]
```

![テストDatadogログ](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

他のレコードの中からWallarmログを見つけるには、Datadog Logsサービス内で`source:wallarm_cloud`検索タグを使用します。