# Fluentd/Logstash経由のDatadog連携

FluentdまたはLogstashの中間データコレクターを介して、検出されたイベントの通知をDatadogへ送信するようにWallarmを設定できます。

--8<-- "../include/integrations/webhook-examples/overview.md"

![データコレクター経由でWallarmからDatadogへ通知を送信](../../../../images/user-guides/settings/integrations/wallarm-log-collector-datadog.png)

!!! info "Datadogとのネイティブ連携"
    Wallarmは[Datadog APIを介したDatadogのネイティブ連携](../datadog.md)にも対応しています。ネイティブ連携では中間データコレクターを使用する必要はありません。

## 使用するリソース

* 公開URLで到達可能なFluentdまたはLogstashサービスが必要です
* 公開URLで到達可能なDatadogサービスが必要です
* Wallarm Console（[EU cloud](https://my.wallarm.com)）への管理者アクセス権（[Fluentd/Logstash連携を構成](#setting-up-integration-with-fluentd-or-logstash)するために必要）が必要です

--8<-- "../include/cloud-ip-by-request.md"

## 要件

WallarmはWebhook経由で中間データコレクターにログを送信します。そのため、FluentdまたはLogstashの設定は次の要件を満たす必要があります。

* POSTまたはPUTリクエストを受け付ける必要があります
* HTTPSリクエストを受け付ける必要があります
* 公開URLを持っている必要があります
* `datadog_logs` Logstashプラグインまたは`fluent-plugin-datadog` Fluentdプラグインを介してDatadogへログを転送する必要があります

=== "Logstashの設定例"
    1. Datadogへログを転送するために、[`datadog_logs`プラグインをインストール](https://github.com/DataDog/logstash-output-datadog_logs#how-to-install-it)します。
    1. Logstashが受信リクエストを読み取り、Datadogへログを転送するように構成します。

    設定ファイル`logstash-sample.conf`の例:

    ```bash linenums="1"
    input {
      http { # HTTPおよびHTTPSトラフィック用のinputプラグイン
        port => 5044 # 受信リクエストのポート
        ssl => true # HTTPSトラフィックの処理
        ssl_certificate => "/etc/server.crt" # LogstashのTLS証明書
        ssl_key => "/etc/server.key" # TLS証明書の秘密鍵
      }
    }
    filter {
      mutate {
        add_field => {
            "ddsource" => "wallarm" # Wallarmログを後続でフィルタリングできるよう、Datadogのログレコードにsourceフィールドを追加するmutateフィルター
        }
      }
    }
    output {
      stdout {} # コマンドラインにLogstashのログを表示するoutputプラグイン
      datadog_logs { # LogstashのログをDatadogへ転送するoutputプラグイン
          api_key => "XXXX" # Datadogの組織で生成したAPIキー
          host => "http-intake.logs.datadoghq.eu" # Datadogのエンドポイント（登録リージョンに依存）
      }
    }
    ```

    * [Logstashの設定ファイル構造に関するドキュメント](https://www.elastic.co/guide/en/logstash/current/configuration-file-structure.html)
    * [`datadog_logs`プラグインに関するドキュメント](https://docs.datadoghq.com/integrations/logstash/)
=== "Fluentdの設定例"
    1. Datadogへログを転送するために、[`fluent-plugin-datadog`プラグインをインストール](https://github.com/DataDog/fluent-plugin-datadog#pre-requirements)します。
    1. Fluentdが受信リクエストを読み取り、Datadogへログを転送するように構成します。

    設定ファイル`td-agent.conf`の例:

    ```bash linenums="1"
    <source>
      @type http # HTTPおよびHTTPSトラフィック用のinputプラグイン
      port 9880 # 受信リクエストのポート
      <transport tls> # 接続処理のための設定
        cert_path /etc/ssl/certs/fluentd.crt
        private_key_path /etc/ssl/private/fluentd.key
      </transport>
    </source>
    <match datadog.**>
      @type datadog # FluentdからDatadogへログを転送するoutputプラグイン
      @id awesome_agent
      api_key XXXX # Datadogの組織で生成したAPIキー
      host 'http-intake.logs.datadoghq.eu' # Datadogのエンドポイント（登録リージョンに依存）
    
      # 任意
      include_tag_key true
      tag_key 'tag'
    
      # 任意のタグ
      dd_source 'wallarm' # Wallarmログを後続でフィルタリングできるよう、Datadogのログレコードにsourceフィールドを追加
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

    * [Fluentdの設定ファイル構造に関するドキュメント](https://docs.fluentd.org/configuration/config-file)
    * [`fluent-plugin-datadog`プラグインに関するドキュメント](https://docs.datadoghq.com/integrations/fluentd)

## FluentdまたはLogstashとの連携の設定

1. Wallarm Console → **Integrations** → **Fluentd**/**Logstash**でDatadog連携の設定に進みます。
1. 連携名を入力します。
1. 対象のFluentdまたはLogstashのURL（Webhook URL）を指定します。
1. 必要に応じて、高度な設定を構成します:

    --8<-- "../include/integrations/webhook-advanced-settings.md"
1. 指定したURLへの通知送信をトリガーするイベントタイプを選択します。イベントを選択しない場合、通知は送信されません。
1. [連携をテスト](#testing-integration)して、設定が正しいことを確認します。
1. **Add integration**をクリックします。

Fluentd連携の例:

![Fluentdとの連携の追加](../../../../images/user-guides/settings/integrations/add-fluentd-integration.png)

## 連携のテスト

--8<-- "../include/integrations/test-integration-advanced-data.md"

FluentdまたはLogstashの中間データコレクターにおけるテストログ:

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

Datadogのテストログ:

![Datadogのテストログ](../../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

他のレコードの中からWallarmのログを見つけるには、DatadogのLogsサービスで`source:wallarm_cloud`検索タグを使用できます。