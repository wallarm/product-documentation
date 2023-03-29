# EnvoyベースのWallarmノードの構成オプション

[link-lom]:                     ../../../user-guides/rules/intro.md

[anchor-process-time-limit]:    #processtimelimit
[anchor-tsets]:                 #filtering-mode-settings

Envoyは、Envoy構成ファイルで定義されたプラグインフィルターを使用して、着信リクエストを処理します。これらのフィルターは、リクエストに対して実行されるアクションを記述します。たとえば、`envoy.http_connection_manager`フィルターは、HTTPリクエストをプロキシするために使用されます。このフィルターには、リクエストに適用できる独自のHTTPフィルターセットがあります。

Wallarmモジュールは、Envoy HTTPフィルターとして設計されています。モジュールの一般設定は、`wallarm` HTTPフィルターに専用されたセクションに配置されます。

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

!!! warning "リクエスト本文の処理を有効にする"
    WallarmモジュールがHTTPリクエスト本文を処理できるようにするには、バッファフィルターをEnvoy HTTPフィルターチェーンのフィルタリングノードの前に配置する必要があります。たとえば：
    
    ```
    http_filters:
    - name: envoy.buffer
      typed_config:
        "@type": type.googleapis.com/envoy.config.filter.http.buffer.v2.Buffer
        max_request_bytes: <最大リクエストサイズ（バイト単位）>
    - name: wallarm
      typed_config:
        "@type": type.googleapis.com/wallarm.Wallarm
        <the Wallarm module configuration>
        ...
    ```
    
    入力リクエストサイズが`max_request_bytes`パラメーターの値を超える場合、このリクエストは削除され、Envoyは`413`応答コード（「Payload Too Large」）を返します。

## リクエストフィルタリング設定

ファイルの`rulesets`（Wallarmノード3.6およびそれ以下では`tsets`という名前）セクションには、リクエストフィルタリング設定に関連するパラメーターが含まれています。

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

`rs0` ... `rsN`エントリは、1つ以上のパラメーターグループです。グループには任意の名前を付けることができます（後で[`ruleset`](#ruleset_param)パラメーターで`conf`セクション経由で参照できるように）。フィルタリングノード構成には少なくとも1つのグループが存在する必要があります（たとえば、`rs0`という名前で）。

このセクションにはデフォルト値はありません。設定ファイルで明示的に値を指定する必要があります。

!!! info "定義レベル"
    このセクションは、フィルタリングノードレベルでのみ定義できます。

パラメーター | 説明 | デフォルト値
--- | ---- | -----
`pdb` | `proton.db`ファイルへのパス。このファイルには、アプリケーション構造に依存しないリクエストフィルタリングのグローバル設定が含まれています。 | `/etc/wallarm/proton.db`
`custom_ruleset` | 保護されたアプリケーションとフィルタリングノード設定に関する情報を含む[カスタムルールセット][link-lom]ファイルへのパス。<div class="admonition warning"> <p class="admonition-title">パラメータの以前の名前</p> <p>Wallarmノード3.4およびそれ以下では、このパラメータは`lom`という名前です。この名前を使用している場合は、<a href="/updating-migrating/general-recommendations/#update-process">ノードモジュールの更新</a>時に変更することをお勧めします。`lom`パラメーターは近いうちに非推奨になります。パラメータロジックは変更されていません。</div> | `/etc/wallarm/custom_ruleset`<br><br>(Wallarmノード3.4およびそれ以下では、 `/etc/wallarm/lom`)
`key` | proton.dbファイルとカスタムルールセットファイルの暗号化/復号化に使用されるWallarmプライベートキーのファイルへのパス。 | `/etc/wallarm/private.key`<br><br>(Wallarmノード3.6およびそれ以下では、 `/etc/wallarm/license.key`)
`general_ruleset_memory_limit` | proton.dbとカスタムルールセットの1つのインスタンスで使用できるメモリの最大量の制限。メモリ制限が処理中のリクエストで超過した場合、ユーザーは500エラーが発生します。このパラメーターには次の接尾辞を使用できます。<ul><li>`k`または`K`：キロバイト</li><li>`m`または`M`：メガバイト</li><li>`g`または`G`：ギガバイト</li></ul> `0`の値は制限解除になります。 <div class="admonition warning"> <p class="admonition-title">パラメータの以前の名前</p> <p>Wallarmノード3.6およびそれ以下では、このパラメータは`ts_request_memory_limit`という名前です。この名前を使用している場合は、<a href="/updating-migrating/general-recommendations/#update-process">ノードモジュールの更新</a>時に変更することをお勧めします。`ts_request_memory_limit`パラメーターは近いうちに非推奨になります。パラメータロジックは変更されていません。</div> | `0`
`enable_libdetection` | SQLインジェクション攻撃の追加検証を、[**libdetection**ライブラリ](../../../about-wallarm/protecting-against-attacks.md#library-libdetection)を使用して有効/無効にします。ライブラリが悪意のあるペイロードを確認しない場合、リクエストは正当と見なされます。 **libdetection**ライブラリの使用により、SQLインジェクション攻撃の中での誤検知が減少します。<br><br>デフォルトでは、**libdetection**ライブラリが有効になっています。最適な攻撃検出のために、ライブラリが有効になっていることをお勧めします。<br><br>**libdetection**ライブラリを使用して攻撃を解析すると、NGINXおよびWallarmプロセスが消費するメモリ量が約10%増加する可能性があります。| `on`##  Postanalyticsモジュールの設定

フィルタリングノードの`tarantool`セクションには、postanalyticsモジュールに関連するパラメータが含まれています。

```
tarantool:
  server:
  - uri: localhost:3313
    max_packets: 512
    max_packets_mem: 0
    reconnect_interval: 1
```

`server`エントリは、Tarantoolサーバーの設定を記述するパラメータグループです。

!!! info "定義レベル"
    このセクションは、フィルタリングノードレベルでのみ定義できます。

パラメータ | 説明 | デフォルト値
--- | ---- | -----
`uri` | Tarantoolサーバーに接続するために使用される認証情報が含まれる文字列。文字列形式は `IPアドレス` または `ドメイン名:ポート`。 | `localhost:3313`
`max_packets` | Tarantoolに送信されるシリアル化されたリクエストの数の上限。制限を解除するには、パラメータの値として `0` を設定します。 | `512`
`max_packets_mem` | Tarantoolに送信されるシリアル化されたリクエストの総量 (バイト単位) の上限。 | `0` (量は制限されません)
`reconnect_interval` | Tarantoolに再接続しようとする試みの間隔 (秒単位)。`0` の値は、サーバーが利用できなくなった場合、フィルタリングノードができるだけ早くサーバーに再接続しようとすることを意味します (お勧めしません)。 | `1`## 基本設定

Wallarm設定の `conf` セクションには、フィルタリングノードの基本操作に影響を与えるパラメータが含まれます。

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
    より柔軟な保護レベルのために、このセクションはルートレベルまたは仮想ホストレベルでオーバーライドできます。

    * ルートレベルで：
        
        ```
        routes:
        - match:
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <the section parameters>
        ```

    * 仮想ホストレベルで：

        ```
        virtual_hosts:
        - name: <the name of the virtual host>
          typed_per_filter_config:
            wallarm:
              "@type": type.googleapis.com/wallarm.WallarmConf
              <the section parameters>
        ```
    `conf`セクションのパラメータは、ルートレベルでオーバーライドされたものが最優先され、次いで仮想ホストレベルで定義されたセクション、最後にフィルタリングノードレベルでのセクションとなります。

パラメータ | 説明 | デフォルト値
--- | ---- | -----
<a name="ruleset_param"></a>`ruleset` | `rulesets`セクションで定義されたパラメータグループのうちの1つ。このパラメータグループは、使用するリクエストフィルタリングルールを設定します。<br>このパラメータがフィルタリングノードの`conf`セクションから省略されている場合は、ルートまたは仮想ホストレベルでオーバーライドされた`conf`セクションに存在する必要があります。<div class="admonition warning"> <p class="admonition-title">このパラメータの以前の名前</p> <p>Wallarmノード3.6以前では、このパラメータは`ts`という名前です。この名前を使用している場合は、<a href="/updating-migrating/general-recommendations/#update-process">ノードモジュールのアップグレード</a>時に変更することをお勧めします。`ts`パラメータは近いうちに廃止されます。パラメータロジックは変わりません。</div> | -
`mode` | ノードモード：<ul><li>`block` - 有害なリクエストをブロックする。</li><li>`monitoring` - リクエストを分析するがブロックしない。</li><li>`safe_blocking` - [グレーリストされたIPアドレス](../../../user-guides/ip-lists/graylist.md)から発生した有害なリクエストのみをブロックする。</li><li>`monitoring` - リクエストを分析するがブロックしない。</li><li>`off` - トラフィックの分析と処理を無効にする。</li></ul><br>[フィルタリングモードの詳細説明 →](../../configure-wallarm-mode.md) | `block`
`mode_allow_override` | [カスタムルールセット][link-lom]で`mode`パラメータを使用して設定されたフィルタリングノードモードをオーバーライドできるようにする：<ul><li>`off` - カスタムルールセットは無視される。</li><li>`strict` - カスタムルールセットで操作モードを強化することができる。</li><li>`on` - 操作モードを強化したり緩和したりすることができる。</li></ul>例えば、`mode`パラメータが`monitoring`値に設定され、`mode_allow_override`パラメータが`strict`値に設定されている場合、リクエストをいくつかブロックする (`block`) ことはできますが、フィルタリングノードを完全に無効にする (`off`) ことはできません。 | `off`
<a name="application_param"></a>`application` | Wallarm Cloudで使用される保護対象アプリケーションの一意識別子。値は`0`以外の正の整数であることができます。<br><br>[アプリケーションの設定方法に関する詳細 →](../../../user-guides/settings/applications.md) <div class="admonition warning"> <p class="admonition-title">このパラメータの以前の名前</p> <p>Wallarmノード3.4以前では、このパラメータは`instance`という名前です。この名前を使用している場合は、<a href="/updating-migrating/general-recommendations/#update-process">ノードモジュールのアップグレード</a>時に変更することをお勧めします。`instance`パラメータは近いうちに廃止されます。</div> | `-1`
<a name="partner_client_id_param"></a>`partner_client_uuid` | [マルチテナント](../../../installation/multi-tenant/deploy-multi-tenant-node.md) Wallarmノードの[テナント](../../../installation/multi-tenant/overview.md)の一意識別子。値は[UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format)形式の文字列である必要があります。例：<ul><li> `11111111-1111-1111-1111-111111111111`</li><li>`123e4567-e89b-12d3-a456-426614174000`</li></ul><p>次の方法でUUIDを取得できます。</p><ul><li>[テナント作成時にテナントのUUIDを取得する →](../../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)</li><li>[既存テナントのUUIDリストを取得する →](../../../updating-migrating/multi-tenant.md#get-uuids-of-your-tenants)</li><ul>| -
<a name="process_time_limit"></a>`process_time_limit` | <div class="admonition warning"> <p class="admonition-title">このパラメータは廃止されました</p> <p>バージョン3.6から、`overlimit_res`攻撃検出を<a href="../../../../user-guides/rules/configure-overlimit-res-detection/">ルール **overlimit_res攻撃検出の調整**</a>を使用して微調整することをお勧めします。<br>`process_time_limit`パラメータは一時的にサポートされていますが、今後のリリースで削除される予定です。</p></div>個々のリクエストの処理時間制限（ミリ秒）。リクエストが定義された時間内に処理できない場合は、エラーメッセージがログファイルに記録され、リクエストが`overlimit_res`攻撃としてマークされます。 | `1000`
<a name="process_time_limit_block"></a>`process_time_limit_block` | <div class="admonition warning"> <p class="admonition-title">このパラメータは廃止されました</p> <p>バージョン3.6から、`overlimit_res`攻撃検出を<a href="../../../../user-guides/rules/configure-overlimit-res-detection/">ルール **overlimit_res攻撃検出の調整**</a>を使用して微調整することをお勧めします。<br>`process_time_limit_block`パラメータは一時的にサポートされていますが、今後のリリースで削除される予定です。</p></div>`process_time_limit` パラメータで設定されたリクエスト処理時間が制限を超えた場合のアクション：<ul><li>`off` - リクエストは常に無視される。</li><li>`on` - `mode: "off"`でない限り、リクエストは常にブロックされる。</li><li>`attack` - `mode`パラメータで設定された攻撃ブロックモードによって異なる：<ul><li>`off` - リクエストは処理されない。</li><li>`monitoring` - リクエストは無視される。</li><li>`block` - リクエストはブロックされる。</li></ul></li></ul> | `attack`
`wallarm_status` | [フィルタリングノード統計サービス](../../configure-statistics-service.md)を有効にするかどうか。 | `false`
`wallarm_status_format` | [フィルタリングノード統計](../../configure-statistics-service.md)の形式：`json`または`prometheus`。 | `json`
`disable_acl` | リクエストの起源の分析を無効にすることができます。無効にされている場合（`on`）、フィルタリングノードはWallarm Cloudから[IPリスト](../../../user-guides/ip-lists/overview.md)をダウンロードせず、リクエストの送信元IPの分析をスキップします。 | `off`
`parse_response` | アプリケーションの応答を分析するかどうか。応答分析は、[パッシブ検出](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection)と[アクティブ脅威検証](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)中に脆弱性を検出するために必要です。<br><br>可能な値は`true`（応答分析が有効）と`false`（応答分析が無効）です。 | `true`
`unpack_response` | アプリケーションの応答で返された圧縮されたデータを解凍するかどうか。可能な値は`true`（解凍が有効）と`false`（解凍が無効）です。<br><br>このパラメータは `parse_response true` の場合のみ有効です。 | `true`
`parse_html_response` | アプリケーションの応答で受信したHTMLコードにHTMLパーサを適用するかどうか。可能な値は`true`（HTMLパーサが適用される）と`false`（HTMLパーサが適用されない）です。<br><br>このパラメータは `parse_response true` の場合のみ有効です。 | `true`