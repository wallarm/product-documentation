# Envoy‑ベースWallarmノードの設定オプション

[link-lom]:                     ../../../user-guides/rules/rules.md

[anchor-process-time-limit]:    #processtimelimit  
[anchor-tsets]:                 #filtering-mode-settings

Envoyは、Envoy設定ファイル内で定義されたプラガブルフィルターを使用して受信リクエストを処理します。これらのフィルターは、リクエストに対して実行される動作を記述します。たとえば、`envoy.http_connection_manager`フィルターはHTTPリクエストをプロキシするために使用されます。このフィルターにはリクエストに適用できるHTTPフィルターが設定されています。

Wallarmモジュールは、Envoy HTTPフィルターとして設計されています。モジュールの一般設定は、`wallarm` HTTPフィルター専用のセクションに配置されます:

```
listeners:
   - address:
     filter_chains:
     - filters:
       - name: envoy.http_connection_manager
         typed_config:
           http_filters:
           - name: wallarm
             typed_config:
              "@type": type.googleapis.com/wallarm.Wallarm
              <the Wallarm module configuration>
              ...  
```

!!! warning "リクエストボディ処理を有効化してください"
    WallarmモジュールがHTTPリクエストボディを処理できるようにするためには、Envoy HTTPフィルターチェーン内でバッファーフィルターをWallarmモジュールの前に配置する必要があります。たとえば:

    ```
    http_filters:
    - name: envoy.buffer
      typed_config:
        "@type": type.googleapis.com/envoy.config.filter.http.buffer.v2.Buffer
        max_request_bytes: <maximum request size (in bytes)>
    - name: wallarm
      typed_config:
        "@type": type.googleapis.com/wallarm.Wallarm
        <the Wallarm module configuration>
        ...
    ```

    もし受信リクエストのサイズが`max_request_bytes`パラメータの値を超える場合、このリクエストは破棄され、Envoyは`413`レスポンスコード（「Payload Too Large」）を返します。

## リクエストフィルタリング設定

ファイルの`rulesets`セクションには、リクエストフィルタリング設定に関連するパラメータが含まれています:

```
rulesets:
- name: rs0
  pdb: /etc/wallarm/proton.db
  custom_ruleset: /etc/wallarm/custom_ruleset
  key: /etc/wallarm/private.key
  general_ruleset_memory_limit: 0
  enable_libdetection: "on"
  ...
- name: rsN:
  ...
```

`rs0` ... `rsN`のエントリは1つ以上のパラメータグループです。グループは任意の名前を付けることができ（後に[`ruleset`](#ruleset_param)パラメータを介して参照されます）、フィルタリングノードの設定には少なくとも1つのグループ（たとえば`rs0`）が存在する必要があります。

このセクションにはデフォルト値はありません。コンフィグファイル内で明示的に値を指定する必要があります。

!!! info "定義レベル"
    このセクションはフィルタリングノードレベルでのみ定義できます。

パラメータ | 説明 | デフォルト値
--- | ---- | -----
`pdb` | `proton.db`ファイルへのパス。 このファイルには、アプリケーション構成に依存しないグローバルなリクエストフィルタリング設定が含まれています。 | `/etc/wallarm/proton.db`
`custom_ruleset` | 保護対象アプリケーションに関する情報とフィルタリングノード設定が記述された[custom ruleset][link-lom]ファイルへのパス。 | `/etc/wallarm/custom_ruleset`
`key` | proton.dbおよびcustom rulesetファイルの暗号化/復号に使用されるWallarm秘密鍵が含まれるファイルへのパス。 | `/etc/wallarm/private.key`
`general_ruleset_memory_limit` | proton.dbおよびcustom rulesetの1インスタンスで使用できる最大メモリ量の制限。リクエスト処理中にメモリ制限を超えた場合、ユーザーは500エラーを受け取ります。 このパラメータには以下のサフィックスを使用できます:<ul><li>`k`または`K`（キロバイト）</li><li>`m`または`M`（メガバイト）</li><li>`g`または`G`（ギガバイト）</li></ul>`0`の値は制限を無効にします。 | `0`
`enable_libdetection` | SQL Injection攻撃に対する追加検証を[**libdetection**ライブラリ](../../../about-wallarm/protecting-against-attacks.md#library-libdetection)を使用して有効/無効にします。ライブラリが悪意のあるペイロードを確認しない場合、リクエストは正当なものと見なされます。**libdetection**ライブラリの使用により、SQL Injection攻撃の誤検知数が減少します。<br><br>デフォルトでは**libdetection**ライブラリは有効になっています。最適な攻撃検出のために、ライブラリは有効のままにすることを推奨します。<br><br>**libdetection**ライブラリによる攻撃解析時は、NGINXおよびWallarmプロセスによるメモリ消費量が約10%増加する場合があります。 | `on`

##  Postanalyticsモジュール設定

フィルタリングノードの`tarantool`セクションには、Postanalyticsモジュールに関連するパラメータが含まれています:

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

`server`エントリは、Tarantoolサーバーの設定を記述したパラメータグループです。

!!! info "定義レベル"
    このセクションはフィルタリングノードレベルでのみ定義できます。

パラメータ | 説明 | デフォルト値
--- | ---- | -----
`uri` | Tarantoolサーバーに接続するための認証情報を含む文字列。 文字列の形式は`IP address`または`domain name:port`です。 | `localhost:3313`
`max_packets` | Tarantoolに送信されるシリアライズされたリクエストの数の上限。制限を解除するには、パラメータ値を`0`に設定します。 | `512`
`max_packets_mem` | Tarantoolに送信されるシリアライズされたリクエストの合計容量（バイト単位）の上限。 | `0`（容量に制限はありません）
`reconnect_interval` | Tarantoolへの再接続試行間隔（秒単位）。 値が`0`の場合、サーバーが利用不可能になった場合にフィルタリングノードができるだけ速く再接続を試みます（推奨されません）。 | `1`

##  基本設定

Wallarm設定の`conf`セクションには、フィルタリングノードの基本動作に影響を与えるパラメータが含まれます:

```
conf:
  ruleset: rs0
  mode: "monitoring"
  mode_allow_override: "off"
  application: 42
  process_time_limit: 1000
  process_time_limit_block: "attack"
  request_memory_limit: 104857600
  wallarm_status: "off"
  wallarm_status_format: "json"
  parse_response: true
  unpack_response: true
  parse_html_response: true
```

!!! info "定義レベル"
    より柔軟な保護レベルのため、以下のレベルでこのセクションを上書きできます:

    * ルートレベルで:

        ```
        routes:
        - match:
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <the section parameters>
        ```
        
    * バーチャルホストレベルで:
        ```
        virtual_hosts:
        - name: <the name of the virtual host>
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <the section parameters>
        ```
    ルートレベルで上書きされた`conf`セクションのパラメータは、バーチャルホストレベルで定義されたパラメータより優先され、これらはさらにフィルタリングノードレベルで定義されたパラメータよりも上位の優先順位を持ちます。

パラメータ | 説明 | デフォルト値
--- | ---- | -----
<a name="ruleset_param"></a>`ruleset` | `rulesets`セクションで定義されたパラメータグループのひとつ。 このパラメータグループは、使用されるリクエストフィルタリングルールを設定します。<br>もしこのパラメータがフィルタリングノードの`conf`セクションから省略された場合、ルートまたはバーチャルホストレベルで上書きされた`conf`セクションに記載する必要があります。 | -
`mode` | ノードモード:<ul><li>`block` - 悪意のあるリクエストをブロックします。</li><li>`monitoring` - リクエストの解析のみを行い、ブロックはしません。</li><li>`safe_blocking` - [graylisted IP addresses](../../../user-guides/ip-lists/overview.md)からの悪意のあるリクエストのみをブロックします。</li><li>`monitoring` - リクエストの解析のみを行い、ブロックはしません。</li><li>`off` - トラフィックの解析および処理を無効にします。</li></ul><br>[フィルトレーションモードの詳細 →](../../configure-wallarm-mode.md) | `block`
`mode_allow_override` | `mode`パラメータで設定されたフィルタリングノードモードを[custom ruleset][link-lom]で上書きできるかどうかを設定します:<ul><li>`off` - custom rulesetは無視されます。</li><li>`strict` - custom rulesetは動作モードを強化することのみ可能です。</li><li>`on` - 動作モードを強化もしくは緩和することが可能です。</li></ul>たとえば、`mode`パラメータが`monitoring`に設定され、`mode_allow_override`パラメータが`strict`に設定されている場合、一部のリクエストをブロック（`block`）できますが、フィルタリングノードを完全に無効（`off`）にすることはできません。 | `off`
<a name="application_param"></a>`application` | Wallarm Cloudで使用される保護対象アプリケーションの固有識別子。 値は`0`以外の正の整数でなければなりません。<br><br>[アプリケーション設定の詳細 →](../../../user-guides/settings/applications.md) | `-1`
<a name="partner_client_id_param"></a>`partner_client_uuid` | [multi-tenant](../../../installation/multi-tenant/deploy-multi-tenant-node.md) Wallarmノードの[tenant](../../../installation/multi-tenant/overview.md)の固有識別子。 値は[UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format)形式の文字列である必要があり、たとえば:<ul><li>`11111111-1111-1111-1111-111111111111`</li><li>`123e4567-e89b-12d3-a456-426614174000`</li></ul><p>詳細は以下を参照してください:</p><ul><li>[テナント作成時にUUIDを取得する方法 →](../../../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)</li><li>[既存テナントのUUIDリストの取得方法 →](../../../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)</li><ul>| -
<a name="process_time_limit"></a>`process_time_limit` | <div class="admonition warning"> <p class="admonition-title">このパラメータは非推奨です</p> <p>バージョン3.6からは、<a href="../../../../user-guides/rules/configure-overlimit-res-detection/">**Limit request processing time**</a>ルール（旧「overlimit_res攻撃検知の微調整」）を使用して`overlimit_res`攻撃検知を微調整することを推奨します。<br>`process_time_limit`パラメータは一時的にサポートされていますが、将来のリリースで削除される予定です。</p></div>1つのリクエストの処理時間の上限（ミリ秒単位）。 設定された時間内にリクエストを処理できない場合、エラーメッセージがログに記録され、リクエストは`overlimit_res`攻撃としてマークされます。 | `1000`
<a name="process_time_limit_block"></a>`process_time_limit_block` | <div class="admonition warning"> <p class="admonition-title">このパラメータは非推奨です</p> <p>バージョン3.6からは、<a href="../../../../user-guides/rules/configure-overlimit-res-detection/">**Limit request processing time**</a>ルール（旧「overlimit_res攻撃検知の微調整」）を使用して`overlimit_res`攻撃検知を微調整することを推奨します。<br>`process_time_limit_block`パラメータは一時的にサポートされていますが、将来のリリースで削除される予定です。</p></div>リクエスト処理時間が`process_time_limit`パラメータで設定された上限を超えた場合の動作:<ul><li>`off` - リクエストは常に無視されます。</li><li>`on` - `mode: "off"`でない限り常にリクエストをブロックします。</li><li>`attack` - `mode`パラメータで設定された攻撃ブロックモードに依存します:<ul><li>`off` - リクエストは処理されません。</li><li>`monitoring` - リクエストは無視されます。</li><li>`block` - リクエストはブロックされます。</li></ul></li></ul> | `attack`
`wallarm_status` | [フィルタリングノード統計サービス](../../configure-statistics-service.md)の有効/無効を設定します。 | `false`
`wallarm_status_format` | [フィルタリングノード統計](../../configure-statistics-service.md)のフォーマット: `json`または`prometheus`。 | `json`
`disable_acl` | リクエスト発信元の解析を無効にします。 無効（`on`）の場合、フィルタリングノードはWallarm Cloudから[IP lists](../../../user-guides/ip-lists/overview.md)をダウンロードせず、リクエスト元IPの解析をスキップします。 | `off`
`parse_response` | アプリケーションのレスポンス解析を行うかどうか。 レスポンス解析は[passive detection](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection)および[threat replay testing](../../../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)による脆弱性検出に必要です。<br><br>可能な値は `true`（レスポンス解析を有効）と`false`（レスポンス解析を無効）です。 | `true`
`unpack_response` | アプリケーションレスポンスで返される圧縮データを解凍するかどうか。可能な値は `true`（解凍有効）と`false`（解凍無効）です。<br><br>このパラメータは`parse_response true`の場合のみ有効です。 | `true`
`parse_html_response` | アプリケーションレスポンスで受信したHTMLコードに対してHTMLパーサーを適用するかどうか。可能な値は `true`（HTMLパーサー適用）と`false`（HTMLパーサー非適用）です。<br><br>このパラメータは`parse_response true`の場合のみ有効です。 | `true`