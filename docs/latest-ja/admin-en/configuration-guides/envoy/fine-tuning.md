# EnvoyベースのWallarmノードの設定オプション

[link-lom]:                     ../../../user-guides/rules/rules.md

[anchor-process-time-limit]:    #processtimelimit
[anchor-tsets]:                 #filtering-mode-settings

Envoyは、Envoy設定ファイルで定義されたプラグインフィルターを使って、着信リクエストを処理します。これらのフィルターは、リクエストに対して実行するアクションを記述します。例えば、`envoy.http_connection_manager`フィルターはHTTPリクエストをプロキシするために使用されます。このフィルターには、リクエストに適用できる独自のHTTPフィルターセットがあります。

Wallarmモジュールは、Envoy HTTPフィルタとして設計されています。モジュールの一般的な設定は、`wallarm` HTTPフィルタに専用のセクションに配置されています：

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
              <Wallarmモジュール設定>
              ...  
```

!!! warning "リクエストボディの処理を有効にする"
    WallarmモジュールがHTTPリクエストボディを処理できるようにするためには、Envoy HTTPフィルタチェーンでのフィルタリングノードの前にバッファフィルタが置かれている必要があります。例：

    ```
    http_filters:
    - name: envoy.buffer
      typed_config:
        "@type": type.googleapis.com/envoy.config.filter.http.buffer.v2.Buffer
        max_request_bytes: <最大リクエストサイズ（バイト単位）>
    - name: wallarm
      typed_config:
        "@type": type.googleapis.com/wallarm.Wallarm
        <Wallarmモジュール設定>
        ...
    ```
    
    送信されるリクエストのサイズが `max_request_bytes` のパラメータの値を超えると、このリクエストはドロップされ、Envoyは `413` のレスポンスコード（「ペイロードが大きすぎます」）を返します。

## リクエストフィルタリング設定

ファイルの `rulesets` セクションには、リクエストフィルタリング設定に関連するパラメータが含まれています：

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

`rs0` から `rsN` までのエントリは1つ以上のパラメータグループで、あとで [`ruleset`](#ruleset_param) パラメータを使って参照できる任意の名前を持つことができます（`conf`セクション内）。フィルタリングノードの設定には少なくとも1つのグループが存在する必要があります（例えば、`rs0`という名前で）。

このセクションにはデフォルト値はありません。設定ファイルで明示的に値を指定する必要があります。

!!! info "定義レベル"
    このセクションは、フィルタリングノードレベルでのみ定義できます。

パラメータ | 説明 | デフォルト値
--- | ---- | -----
`pdb` | `proton.db` ファイルへのパス。このファイルには、アプリケーション構造に依存しないリクエストフィルタリングのためのグローバル設定が含まれています。 | `/etc/wallarm/proton.db`
`custom_ruleset` | 保護されたアプリケーションとフィルタリングノード設定についての情報を含む [カスタムルールセット][link-lom] ファイルへのパス。 | `/etc/wallarm/custom_ruleset`
`key` | proton.dbファイルとカスタムルールセットファイルの暗号化/復号化に用いるWallarmプライベートキーを含むファイルへのパス。 | `/etc/wallarm/private.key`
`general_ruleset_memory_limit` | proton.dbとカスタムルールセットの1インスタンスによって使用できるメモリの最大量の制限。メモリ制限を超えてリクエストを処理すると、ユーザーは500エラーを受け取ります。このパラメータには以下の接尾辞を使用できます：<ul><li>`k` または `K` はキロバイト</li><li>`m` または `M` はメガバイト</li><li>`g` または `G` はギガバイト</li></ul>値 `0` は制限をオフにします。 | `0`
`enable_libdetection` | [**libdetection** ライブラリ](../../../about-wallarm/protecting-against-attacks.md#library-libdetection)によるSQLインジェクション攻撃の追加検証を有効/無効にします。ライブラリが悪意のあるペイロードを確認しなかった場合、リクエストは合法と見なされます。**libdetection** ライブラリの使用により、SQLインジェクション攻撃の偽陽性の数を減らすことができます。<br><br>デフォルトでは、**libdetection** ライブラリは有効になっています。最良の攻撃検出のために、ライブラリを有効にしておくことをお勧めします。<br><br>**libdetection** ライブラリを使用して攻撃を分析すると、NGINXとWallarmのプロセスによって消費されるメモリ量は約10％増加する可能性があります。 | `on`

##  Postanalyticsモジュール設定

フィルタリングノードの `tarantool` セクションには、postanalyticsモジュールに関連するパラメータが含まれています：

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

`server` エントリは、Tarantoolサーバの設定を記述するパラメータグループです。

!!! info "定義レベル"
    このセクションは、フィルタリングノードレベルでのみ定義できます。

パラメータ | 説明 | デフォルト値
--- | ---- | -----
`uri` | Tarantoolサーバに接続するために使用される認証情報が含まれる文字列。文字列の形式は `IPアドレス` または `ドメイン名:ポート` です。 | `localhost:3313`
`max_packets` | Tarantoolに送信するシリアライズされたリクエストの数の制限。制限を解除するには `0` をパラメータ値として設定します。 | `512`
`max_packets_mem` | Tarantoolに送信するシリアライズされたリクエストの合計量（バイト単位）の制限。 | `0` (量は制限されません)
`reconnect_interval` | Tarantoolへの再接続の試行間隔（秒）。 `0` の値は、サーバが利用できないときにフィルタリングノードができるだけ早くサーバに再接続しようとすることを意味します（非推奨）。 | `1`

##  基本設定

Wallarm設定の `conf` セクションには、フィルタリングノードの基本操作に影響するパラメータが含まれています：

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
    より柔軟な保護レベルのために、このセクションはルートまたは仮想ホストレベルで上書きすることができます：

    * ルートレベルで:

        ```
        routes:
        - match:
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <セクションのパラメータ>
        ```
        
    * 仮想ホストレベルで:
        ```
        virtual_hosts:
        - name: <仮想ホストの名前>
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <セクションのパラメータ>
        ```
    ルートレベルで上書きされた`conf`セクションのパラメータは、仮想ホストレベルで定義されたセクションのパラメータより優先され、フィルタリングノードレベルでリストされているパラメータよりも優先されます。

パラメータ | 説明 | デフォルト値
--- | ---- | -----
<a name="ruleset_param"></a>`ruleset` | `rulesets`セクションで定義されたパラメータグループの一つ。このパラメータグループは、使用されるリクエストフィルタリングルールを設定します。<br>このパラメータがフィルタリングノードの `conf` セクションから省略された場合、それはルートまたは仮想ホストレベルで上書きされた `conf` セクションに存在しなければなりません。 | -
`mode` | ノードモード：<ul><li>`block` - 悪意のあるリクエストをブロックします。</li><li>`monitoring` - リクエストを分析しますが、ブロックしません。</li><li>`safe_blocking` - [グレイリストのIPアドレス](../../../user-guides/ip-lists/graylist.md)から発生した悪意のあるリクエストのみをブロックします。</li><li>`monitoring` - リクエストを分析しますが、ブロックしません。</li><li>`off` - トラフィックの分析と処理を無効にします。</li></ul><br>[フィルタリングモードの詳細説明 →](../../configure-wallarm-mode.md) | `block`
`mode_allow_override` | `mode`パラメータを使用して設定されたフィルタリングノードモードを、[カスタムルールセット][link-lom]で上書きすることを許可します：<ul><li>`off` - カスタムルールセットは無視されます。</li><li>`strict` - カスタムルールセットは操作モードを強化することしかできません。</li><li>`on` - 操作モードを強化あるいは緩和することが可能です。</li></ul>例えば、`mode` パラメータが `monitoring` の値に設定され、`mode_allow_override` パラメータが `strict` の値に設定されている場合、一部のリクエストをブロックする（`block`）ことは可能ですが、フィルタリングノードを完全に無効にする（`off`）ことはできません。 | `off`
<a name="application_param"></a>`application` | Wallarm Cloudで使用する保護されたアプリケーションの一意の識別子。値は正の整数であり、 `0` を除きます。<br><br>[アプリケーションの設定についての詳細 →](../../../user-guides/settings/applications.md) | `-1`
<a name="partner_client_id_param"></a>`partner_client_uuid` | [マルチテナント](../../../installation/multi-tenant/deploy-multi-tenant-node.md) Wallarmノードの[テナント](../../../installation/multi-tenant/overview.md)の一意の識別子。値は [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) 形式の文字列でなければならず、例えば：<ul><li>`11111111-1111-1111-1111-111111111111`</li><li>`123e4567-e89b-12d3-a456-426614174000`</li></ul><p>以下の方法を知る：</p><ul><li>[テナント作成中にテナントのUUIDを取得する方法 →](../../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)</li><li>[既存のテナントのUUIDのリストを取得する方法 →](../../../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)</li><ul>| -
<a name="process_time_limit"></a>`process_time_limit` | <div class="admonition warning"> <p class="admonition-title">このパラメータは非推奨となりました</p> <p>バージョン3.6からは、<a href="../../../../user-guides/rules/configure-overlimit-res-detection/">規則「overlimit_res攻撃検出の微調整」</a>を使用して `overlimit_res` の攻撃検出を微調整することを推奨します。<br>`process_time_limit` パラメータは一時的にサポートされていますが、将来のリリースで削除されます。</p></div>単一のリクエストの処理時間（ミリ秒）の制限。特定の時間内にリクエストを処理できない場合、エラーメッセージがログファイルに記録され、リクエストは `overlimit_res` の攻撃としてマークされます。 | `1000`
<a name="process_time_limit_block"></a>`process_time_limit_block` | <div class="admonition warning"> <p class="admonition-title">このパラメータは非推奨となりました</p> <p>バージョン3.6からは、<a href="../../../../user-guides/rules/configure-overlimit-res-detection/">規則「overlimit_res攻撃検出の微調整」</a>を使用して `overlimit_res` の攻撃検出を微調整することを推奨します。<br>`process_time_limit_block` パラメータは一時的にサポートされていますが、将来のリリースで削除されます。</p></div>`process_time_limit` パラメータで設定された制限を超えてリクエストの処理時間がかかったときにとる行動：<ul><li>`off` - リクエストは常に無視されます。</li><li>`on` - `mode: "off"` でなければ、リクエストは常にブロックされます。</li><li>`attack` - `mode` パラメータで設定された攻撃ブロックモードに依存します：<ul><li>`off` - リクエストは処理されません。</li><li>`monitoring` - リクエストは無視されます。</li><li>`block` - リクエストはブロックされます。</li></ul></li></ul> | `attack`
`wallarm_status` | [フィルタリングノード統計サービス](../../configure-statistics-service.md)を有効にするかどうか。 | `false`
`wallarm_status_format` | [フィルタリングノード統計](../../configure-statistics-service.md)の形式： `json` または `prometheus`。 | `json`
`disable_acl` | リクエストの発信元の分析を無効にすることができます。無効にする（`on`）と、フィルタリングノードは [IPリスト](../../../user-guides/ip-lists/overview.md) をWallarm Cloudからダウンロードせず、リクエストソースIPの分析をスキップします。 | `off`
`parse_response` | アプリケーションのレスポンスを分析するかどうか。レスポンス分析は、 [パッシブ検出](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection)および [アクティブな脅威検証](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)中の脆弱性検出に必要です。<br><br>可能な値は `true` (レスポンス解析が有効)と `false` (レスポンス解析が無効)です。 | `true`
`unpack_response` | アプリケーションのレスポンスで返される圧縮データを解凍するかどうか。可能な値は `true` (解凍が有効)と `false` (解凍が無効)です。<br><br>このパラメータは `parse_response true` の場合にのみ有効です。 | `true`
`parse_html_response` | アプリケーションのレスポンスで受け取ったHTMLコードにHTMLパーサを適用するかどうか。可能な値は `true` (HTMLパーサが適用されます)と `false` (HTMLパーサが適用されません)です。<br><br>このパラメータは `parse_response true` の場合にのみ有効です。 | `true`