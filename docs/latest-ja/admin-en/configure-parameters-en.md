[doc-nginx-install]： ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]：scanner-address-eu-cloud.md
[doc-us-scanner-ip-addresses]：scanner-address-us-cloud.md
[acl-access-phase]： #wallarm_acl_access_phase

# NGINXベースのWallarmノードの設定オプション

Wallarm NGINXモジュールで利用可能な微調整オプションを学び、Wallarmソリューションを最大限に活用しましょう。

!!! info "NGINX公式ドキュメント"
    Wallarmの設定はNGINXの設定と非常に似ています。[公式のNGINXドキュメントを参照してください](https://www.nginx.com/resources/admin-guide/)。Wallarm特有の設定オプションに加えて、NGINX設定の全機能が利用できます。

## Wallarmディレクティブ

### disable_acl

リクエストの起源の分析を無効にすることができます。無効にした場合（`on`）、フィルタリングノードはWallarmクラウドから[IPリスト](../user-guides/ip-lists/overview.md)をダウンロードせず、リクエスト元のIPアドレスの分析をスキップします。

!!! info
    このパラメータはhttp, server, locationブロック内で設定できます。

    デフォルト値は `off` です。

### wallarm_acl_access_phase

このディレクティブは、NGINXベースのWallarmノードによって、[ブラックリストに載った](../user-guides/ip-lists/denylist.md) IPアドレスからのリクエストをNGINXアクセスフェーズでブロックするよう強制します。つまり：

* `wallarm_acl_access_phase on` の場合、Wallarmノードはすべての[フィルタリングモード](configure-wallarm-mode.md)でブラックリストに載ったIPアドレスからのリクエストを即座にブロックし、ブラックリストに載ったIPアドレスからのリクエストに攻撃の兆候を検索しません。

    これは、ブラックリストが標準的に機能し、ノードのCPU負荷を大幅に軽減するため、**デフォルトで推奨**される値です。

* `wallarm_acl_access_phase off` の場合、Wallarmノードは最初にリクエストに攻撃の兆候を分析し、`block`または`safe_blocking`モードで動作している場合、ブラックリストに載ったIPアドレスからのリクエストをブロックします。

    `off` のフィルタリングモードでは、ノードはリクエストを分析せず、ブラックリストを確認しません。

    `monitoring` のフィルタリングモードでは、ノードはすべてのリクエストで攻撃の兆候を検索しますが、ソースIPがブラックリストに載っていてもリクエストをブロックしません。

    `wallarm_acl_access_phase off` でのWallarmノードの動作は、ノードのCPU負荷を大幅に増加させます。

!!! info "デフォルト値と他のディレクティブとの相互作用"
    **デフォルト値**： `on` （Wallarmノード4.2から）

    このディレクティブは、NGINX設定ファイルのhttpブロック内でのみ設定できます。

    * [`disable_acl on`](#disable_acl) では、IPリストは処理されず、`wallarm_acl_access_phase` を有効にする意味はありません。
    * `wallarm_acl_access_phase` ディレクティブは、[`wallarm_mode`](#wallarm_mode) よりも優先順位が高く、ブラックリストに載ったIPアドレスからのリクエストをブロックします（`wallarm_acl_access_phase on` の場合）。

### wallarm_api_conf

Wallarm APIのアクセス要件を記載した `node.yaml` ファイルへのパスです。

**例**：
```
wallarm_api_conf /etc/wallarm/node.yaml
```

フィルタリングノードからのシリアライズされたリクエストを、postanalyticsモジュール（Tarantool）にアップロードする代わりに、Wallarm API（クラウド）に直接アップロードするために使用されます。**攻撃が含まれたリクエストのみがAPIに送信されます。** 攻撃のないリクエストは保存されません。

**node.yamlファイルの内容の例：**
``` bash
# API接続の資格情報

hostname: <何らかの名前>
uuid: <何らかのuuid>
secret: <何らかの秘密>

# API接続パラメータ（以下のパラメータはデフォルトで使用されます）

api:
  host: api.wallarm.com
  port: 443
  ca_verify: true
```

### wallarm_application

!!! warning "ディレクティブの前身と変更された動作"
    Wallarmノード3.4以前では、このディレクティブの役割は `wallarm_instance`ディレクティブ（現在非推奨）が担っていました。

    Wallarmノード3.6では、このディレクティブは、このセクションで説明されているようなその主要な目的に加えて、マルチテナントノードのテナントを指定するために使用されていました。現在、第二の役割は削除され、新しい [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid) ディレクティブに移行しています。第一の役割は変わりありません。

    4.0以前のバージョンのフィルタリングノードに使用していた設定を更新する場合：

    * マルチテナント機能を持たないフィルタリングノードをアップグレードする場合で、保護されたアプリケーションの一意の識別子を設定するために`wallarm_instance`を使用している場合、それを`wallarm_application`にリネームしてください。
    * マルチテナント機能を持つフィルタリングノードをアップグレードする場合は、`wallarm_instance` を `wallarm_application` とみなし、[マルチテナント再設定手順](../updating-migrating/multi-tenant.md#step-3-reconfigure-multitenancy)に従って設定を書き直してください。

Wallarmクラウドで使用する保護対象アプリケーションの一意識別子です。値は、`0` を除く正の整数であることができます。

アプリケーションのドメインとドメインパスの両方に一意の識別子を設定できます。例えば：

=== "Identifiers for domains"

​    **example.com** ドメインの設定ファイル：

​    ```bash
​    server {
​        listen 80 default_server;
​        listen [::]:80 default_server ipv6only=on;
​        listen 443 ssl;

​        ...

​        wallarm_mode monitoring;
​        wallarm_application 1;
​        location / {
​                proxy_pass http://example.com;
​                include proxy_params;
​        }
​    }
​    ```

​    **test.com** ドメインの設定ファイル：

​    ```bash
​    server {
​        listen 80 default_server;
​        listen [::]:80 default_server ipv6only=on;
​        listen 443 ssl;

​        ...

​        wallarm_mode monitoring;
​        wallarm_application 2;
​        location / {
​                proxy_pass http://test.com;
​                include proxy_params;
​        }
​    }
​    ```
=== "Identifiers for domain paths"
    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...
        
        wallarm_mode monitoring;
        location /login {
                proxy_pass http://example.com/login;
                include proxy_params;
                wallarm_application 3;
        }
        
        location /users {
                proxy_pass http://example.com/users;
                include proxy_params;
                wallarm_application 4;
        }
    }
    ```

[アプリケーションの設定の詳細についてはこちら →](../user-guides/settings/applications.md)

!!! info
    このパラメータはhttp, server, locationブロック内で設定できます。

    **デフォルト値**： `-1`。

### wallarm_block_page

ブロックされたリクエストへの応答を設定することができます。

[ブロッキングページとエラーコードの設定の詳細 →](configuration-guides/configure-block-page-and-code.md)

!!! info
    このパラメータはhttp, server, locationブロック内で設定できます。

### wallarm_block_page_add_dynamic_path

このディレクティブは、コードにNGINX変数が含まれているブロッキングページを初期化し、このブロッキングページへのパスも変数を使用して設定するために使用されます。それ以外の場合、ディレクティブは使用されません。

[ブロッキングページとエラーコードの設定の詳細 →](configuration-guides/configure-block-page-and-code.md)

!!! info
    このディレクティブは、NGINX設定ファイルの`http`ブロック内で設定できます。

### wallarm_cache_path

サーバー起動時に、proton.dbとカスタムルールセットファイルのバックアップカタログが作成されるディレクトリです。このディレクトリは、NGINXを実行するクライアントが書き込み可能である必要があります。

!!! info
    このパラメータは、httpブロック内でのみ設定されます。### wallarm_custom_ruleset_path

保護対象のアプリケーションとフィルタリングノード設定に関する情報を含む [custom ruleset](../user-guides/rules/intro.md) ファイルへのパス。

!!! info
    このパラメータは、http、server、location ブロック内で設定できます。

    **デフォルト値**： `/etc/wallarm/custom_ruleset` (Wallarmノード3.4およびそれ以前では、`/etc/wallarm/lom`)

!!! warning "ディレクティブの以前の名前"
    Wallarmノード3.4およびそれ以前では、このディレクティブは `wallarm_local_trainingset_path` という名前です。この名前を使用している場合は、[ノードモジュールのアップグレード](../updating-migrating/general-recommendations.md#update-process)時に変更することをお勧めします。`wallarm_local_trainingset_path`ディレクティブは近日中に廃止予定です。ディレクティブのロジックは変更されません。

### wallarm_enable_libdetection

**libdetection** ライブラリを使用してSQLインジェクション攻撃の追加検証を有効/無効にします。**libdetection** を使用することで、攻撃の二重検出が可能になり、誤検出が減ります。

**libdetection** ライブラリを使用したリクエストの解析は、すべての [展開オプション](../installation/supported-deployment-options.md) でデフォルトで有効になっています。誤検出の数を減らすために、解析を有効にしておくことをお勧めします。

[**libdetection** の詳細 →](../about-wallarm/protecting-against-attacks.md#library-libdetection)

!!! warning "メモリ消費の増加"
    libdetectionライブラリを使用して攻撃を解析すると、NGINXおよびWallarmプロセスによって消費されるメモリ量が約10%増加する場合があります。

!!! info
    このパラメータは、http、server、location ブロック内で設定できます。

    すべての [展開オプション](../installation/supported-deployment-options.md) ではデフォルト値が `on` です。

### wallarm_fallback

値が `on` に設定されている場合、NGINXは緊急モードに入る機能があります。proton.dbまたはカスタムルールセットがダウンロードできない場合、この設定は、データがダウンロードできない http、server、location ブロックに対して Wallarm モジュールを無効にします。NGINXは動作し続けます。

!!! info
    デフォルト値は `on` です。

    このパラメータは、http、server、locationブロック内で設定できます。

### wallarm_force

NGINXのミラーリングされたトラフィックに基づいてリクエスト分析とカスタムルールの生成を設定します。[Analyzing mirrored traffic with NGINX](configuration-guides/traffic-mirroring/nginx-example.md)を参照してください。

### wallarm_general_ruleset_memory_limit

!!! warning "ディレクティブの以前の名前"
    Wallarmノード3.6およびそれ以前では、このディレクティブは `wallarm_ts_request_memory_limit` という名前です。この名前を使用している場合は、[ノードモジュールのアップグレード](../updating-migrating/general-recommendations.md#update-process)時に変更することをお勧めします。`wallarm_ts_request_memory_limit`ディレクティブは近日中に廃止予定です。ディレクティブのロジックは変更されません。

proton.dbとカスタムルールセットの1つのインスタンスによって使用できる最大メモリ量の制限を設定します。

メモリ制限を超えて処理されるリクエストがある場合、ユーザーは500エラーを受け取ります。

このパラメータでは、次の接尾辞を使用できます。
* キロバイトの場合は `k` または `K`
* メガバイトの場合は `m` または `M`
* ギガバイトの場合は `g` または `G`

**0** の値は制限をオフにします。

!!! info
    このパラメータは、http、server、および/または location ブロック内で設定できます。

    **デフォルト値**： `1` GB

### wallarm_global_trainingset_path

!!! warning "ディレクティブは近日中に廃止されます"
    Wallarmノード3.6から、代わりに [`wallarm_protondb_path`](#wallarm_protondb_path) ディレクティブを使用してください。

    `wallarm_global_trainingset_path`ディレクティブは引き続きサポートされていますが、将来のリリースで廃止される予定です。ディレクティブを使用している場合は、名前を変更することをお勧めします。ディレクティブのロジックは変更されません。

### wallarm_file_check_interval

proton.dbとカスタムルールセットファイルの新しいデータをチェックする間隔を定義します。単位は次のように接尾辞で指定されます。
* 分の場合はサフィックスがありません
* 秒の場合は `s`
* ミリ秒の場合は `ms`

!!! info
    このパラメータは、httpブロック内でのみ設定されます。

    **デフォルト値**： `1` (1分)

### wallarm_instance

!!! warning "ディレクティブが廃止されました"
    * 保護対象のアプリケーションの一意の識別子を設定するためにディレクティブが使用されていた場合は、単純に [`wallarm_application`](#wallarm_application) に名前を変更してください。
    * マルチテナントノードのテナントの一意の識別子を設定するためには、`wallarm_instance` の代わりに [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid) ディレクティブを使用してください。

    バージョン 4.0 以前のフィルタリングノードに使用していた設定を更新する場合：
    
    * マルチテナンシー機能を持たないフィルタリングノードをアップグレードし、保護対象アプリケーションの一意の識別子を設定するために `wallarm_instance` を使用している場合は、ただ `wallarm_application` に名前を変更してください。
    * マルチテナンシー機能を持つフィルタリングノードをアップグレードする場合は、すべての `wallarm_instance` を `wallarm_application` とみなし、[multitenancy reconfiguration instruction](../updating-migrating/multi-tenant.md#step-3-reconfigure-multitenancy)で説明されているように設定を書き換えます。

### wallarm_key_path

proton.dbとカスタムルールセットファイルの暗号化/復号化に使用されるWallarmの秘密鍵へのパス。

!!! info
    **デフォルト値**： `/etc/wallarm/private.key` (Wallarmノード3.6およびそれ以前では、`/etc/wallarm/license.key`)

### wallarm_local_trainingset_path

!!! warning "ディレクティブは近日中に廃止されます"
    Wallarmノード3.6から、代わりに [`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path) ディレクティブを使用してください。

    `wallarm_local_trainingset_path`ディレクティブは引き続きサポートされていますが、将来のリリースで廃止される予定です。ディレクティブを使用している場合は、名前を変更することをお勧めします。ディレクティブのロジックは変更されません。

### wallarm_mode

トラフィック処理モード：

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include-ja/wallarm-modes-description-latest.md"

`wallarm_mode`の使用は、`wallarm_mode_allow_override`ディレクティブによって制限されることがあります。

[フィルタリングモードの詳細設定方法 →](configure-wallarm-mode.md)

!!! info
    このパラメータは、http、server、location ブロック内で設定できます。

    **デフォルト値**は、フィルタリングノードの展開方法によって異なります（`off` または `monitoring`）

### wallarm_mode_allow_override

Walarm Cloudからダウンロードされたフィルタリングルール（カスタムルールセット）を介して [`wallarm_mode`](#wallarm_mode) の値を上書きする能力を管理します.

- `off` - カスタムルールは無視されます。
- `strict` - カスタムルールは運用モードを強化することしかできません。
- `on` - 運用モードを強化することも緩和することもできます。

たとえば、`wallarm_mode monitoring` と `wallarm_mode_allow_override strict` が設定されている場合、Wallarm Consoleを使用していくつかのリクエストのブロックを有効にできますが、攻撃解析を完全に無効にすることはできません。

[フィルタリングモードの詳細設定方法 →](configure-wallarm-mode.md)

!!! info
    このパラメータは、http、server、location ブロック内で設定できます。

    **デフォルト値**： `on`

### wallarm_parse_response

アプリケーションの応答を解析するかどうかします。応答解析は、[passive detection](../about-wallarm/detecting-vulnerabilities.md#passive-detection) および [active threat verification](../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) 中の脆弱性検出に必要です。

可能な値は `on`（応答解析が有効）、`off`（応答解析が無効）です。

!!! info
    このパラメータは、http、server、location ブロック内で設定できます。

    **デフォルト値**： `on`

!!! warning "パフォーマンスの向上"
    パフォーマンスを向上させるために、`location` を介した静的ファイルの処理を無効にすることをお勧めします。### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

Wallarmは、API Securityサブスクリプションプランの下でWebSocketsの完全なサポートを提供します。デフォルトでは、WebSocketsのメッセージは攻撃のために解析されません。

この機能を強制するには、API Securityサブスクリプションプランを有効にし、`wallarm_parse_websocket`ディレクティブを使用してください。

可能な値:

- `on`: メッセージ解析が有効になります。
- `off`: メッセージ解析が無効になります。

!!! info
    このパラメータは、http、server、locationブロック内で設定できます。
    
    **デフォルト値**: `off`

### wallarm_parser_disable

パーサを無効にするためのディレクティブです。ディレクティブの値は、無効にするパーサの名前に対応します:

- `cookie`
- `zlib`
- `htmljs`
- `json`
- `multipart`
- `base64`
- `percent`
- `urlenc`
- `xml`
- `jwt`

**例**

```
wallarm_parser_disable base64;
wallarm_parser_disable xml;
location /ab {
    wallarm_parser_disable json;
    wallarm_parser_disable base64;
    proxy_pass http://example.com;
}
location /zy {
    wallarm_parser_disable json;
    proxy_pass http://example.com;
}
```

!!! info
    このパラメータは、http、server、locationブロック内で設定できます。

### wallarm_parse_html_response

アプリケーションのレスポンスで受信したHTMLコードにHTMLパーサを適用するかどうか。可能な値は`on`（HTMLパーサが適用される）と`off`（HTMLパーサが適用されない）です。

このパラメータは、`wallarm_parse_response on`の場合にのみ効果があります。

!!! info
    このパラメータは、http、server、locationブロック内で設定できます。
    
    **デフォルト値**: `on`

### wallarm_partner_client_uuid

[マルチテナント](../installation/multi-tenant/overview.md) Wallarmノードのテナントの一意の識別子。値は、[UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format)形式の文字列である必要があります。例:

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

!!! info
    このパラメータは、http、server、locationブロック内で設定できます。

    次の方法を知っておく必要があります。
    
    * [テナント作成時にテナントのUUIDを取得する →](../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api)
    * [既存のテナントのUUIDのリストを取得する →](../updating-migrating/multi-tenant.md#get-uuids-of-your-tenants)
    
設定例：

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
  ...
}
...
}
```

上記の設定では:

* テナントは、パートナーのクライアントを指します。パートナーには2つのクライアントがあります。
* `tenant1.com`および`tenant1-1.com`に向けられたトラフィックは、`11111111-1111-1111-1111-111111111111`のクライアントに関連付けられます。
* `tenant2.com`に向けられたトラフィックは、`22222222-2222-2222-2222-222222222222`のクライアントに関連付けられます。
* 最初のクライアントには、[`wallarm_application`](#wallarm_application)ディレクティブを介して指定された3つのアプリケーションもあります。
    * `tenant1.com/login` – `wallarm_application 21`
    * `tenant1.com/users` – `wallarm_application 22`
    * `tenant1-1.com` – `wallarm_application 23`

    これら3つのパスに対するトラフィックは、対応するアプリケーションに関連付けられ、残りは最初のクライアントの一般的なトラフィックになります。

### wallarm_process_time_limit

!!! warning "ディレクティブは廃止されました"
    バージョン3.6以降、[ルール **overlimit_res攻撃検出の微調整**](../user-guides/rules/configure-overlimit-res-detection.md)を使用して`overlimit_res`攻撃検出を微調整することをお勧めします。
    
    `wallarm_process_time_limit`ディレクティブは一時的にサポートされていますが、今後のリリースで削除される予定です。

Wallarmノードによる単一リクエスト処理の制限時間を設定します。

時間が制限を超えると、ログにエラーが記録され、リクエストは[`overlimit_res`](../attacks-vulns-list.md#overlimiting-of-computational-resources)攻撃としてマークされます。 [`wallarm_process_time_limit_block`](#wallarm_process_time_limit_block)値によって、攻撃をブロック、監視、無視することができます。

値は、ミリ秒単位で単位なしで指定されます。例えば:

```bash
wallarm_process_time_limit 1200; # 1200ミリ秒
wallarm_process_time_limit 2000; # 2000ミリ秒
```

!!! info
    このパラメータは、http、server、およびlocationブロック内で設定できます。
    
    **デフォルト値**: 1000ms（1秒）。

### wallarm_process_time_limit_block

!!! warning "ディレクティブは廃止されました"
    バージョン3.6以降、[ルール **overlimit_res攻撃検出の微調整**](../user-guides/rules/configure-overlimit-res-detection.md)を使用して`overlimit_res`攻撃検出を微調整することをお勧めします。
    
    `wallarm_process_time_limit_block`ディレクティブは一時的にサポートされていますが、今後のリリースで削除される予定です。

[`wallarm_process_time_limit`](#wallarm_process_time_limit)ディレクティブで設定された制限時間を超えるリクエストのブロックを管理する機能:

- `on`: `wallarm_mode off`でない限り、リクエストは常にブロックされます
- `off`: リクエストは常に無視されます

    !!! warning "保護バイパスのリスク"
        `off`値は、`overlimit_res`攻撃からの保護が無効になるため、注意して使用してください。
        
        大きなファイルのアップロードが行われ、保護のバイパスと脆弱性の悪用のリスクがない、実際に必要な厳密に特定の場所でのみ、`off`値を使用することをお勧めします。
        
        httpまたはserverブロックで`wallarm_process_time_limit_block`を`off`に設定することは**強くお勧めできません**。
    
- `attack`: `wallarm_mode`ディレクティブで設定された攻撃ブロックモードに依存します。
    - `off`: リクエストは処理されません。
    - `monitoring`: リクエストは無視されますが、`overlimit_res`攻撃の詳細はWallarm Cloudにアップロードされ、Wallarm Consoleに表示されます。
    - `safe_blocking`: [グレイリストに登録された](../user-guides/ip-lists/graylist.md)IPアドレスからのリクエストのみがブロックされ、すべての`overlimit_res`攻撃の詳細がWallarm Cloudにアップロードされ、Wallarm Consoleに表示されます。
    - `block`: リクエストがブロックされます。

ディレクティブの値に関係なく、`overlimit_res`攻撃タイプのリクエストは、[`wallarm_mode off;`](#wallarm_mode)以外はWallarm Cloudにアップロードされます。

!!! info
    このパラメータは、http、server、およびlocationブロック内で設定できます。
    
    **デフォルト値**: `wallarm_process_time_limit_block attack`

### wallarm_proton_log_mask_master

NGINXマスタープロセスのデバッグログの設定。

!!! warning "ディレクティブの使用"
    Wallarmサポートチームのメンバーが指示する場合にのみ、ディレクティブを設定する必要があります。彼らは、ディレクティブで使用する値を提供します。

!!! info
    このパラメータは、メインレベルでのみ設定できます。

### wallarm_proton_log_mask_worker

NGINXワーカープロセスのデバッグログの設定。

!!! warning "ディレクティブの使用"
    Wallarmサポートチームのメンバーが指示する場合にのみ、ディレクティブを設定する必要があります。彼らは、ディレクティブで使用する値を提供します。

!!! info
    このパラメータは、メインレベルでのみ設定できます。### wallarm_protondb_path

アプリケーション構造に依存しないリクエストフィルタリングのグローバル設定が含まれる [proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton) ファイルへのパス。

!!! info
    このパラメータは、http、server、location ブロック内で設定できます。
    
    **デフォルト値**: `/etc/wallarm/proton.db`

!!! warning "ディレクティブの以前の名称"
    Wallarm ノード 3.4 以前では、このディレクティブは `wallarm_global_trainingset_path` という名称になっています。この名前を使用している場合は、[ノードモジュールのアップグレード](../updating-migrating/general-recommendations.md#update-process)時に変更することをお勧めします。`wallarm_global_trainingset_path`ディレクティブは間もなく非推奨になります。 ディレクティブのロジックは変わっていません。

### wallarm_request_chunk_size

1つの反復で処理されるリクエストの一部のサイズを制限します。`wallarm_request_chunk_size`ディレクティブのカスタム値をバイト単位で設定するには、整数を割り当てます。このディレクティブは以下の接尾辞もサポートしています。
* `k` または `K` キロバイト
* `m` または `M` メガバイト
* `g` または `G` ギガバイト

!!! info
    このパラメータは、http、server、location ブロック内で設定できます。
    **デフォルト値**: `8k` (8キロバイト)。

### wallarm_request_memory_limit

1つのリクエストの処理に使用できるメモリの最大量に制限を設定します。

制限を超えると、リクエストの処理が中断され、ユーザーは 500 エラーを受け取ります。

以下の接尾辞がこのパラメータで使用できます：
* `k` または `K` キロバイト
* `m` または `M` メガバイト
* `g` または `G` ギガバイト

`0` の値は制限をオフにします。

デフォルトでは、制限はオフです。 

!!! info
    このパラメータは、http、server、および/または location ブロック内で設定できます。


### wallarm_stalled_worker_timeout

NGINX ワーカーが 1 つのリクエストを処理するための制限時間を秒単位で設定します。

時間が制限を超えると、NGINX ワーカーに関するデータが `stalled_workers_count` および `stalled_workers` [統計](configure-statistics-service.md##working-with-the-statistics-service)パラメータに書き込まれます。

!!! info
    このパラメータは、http、server、location ブロック内で設定できます。
    
    **デフォルト値**: `5` (5秒)


### wallarm_tarantool_upstream

`wallarm_tarantool_upstream` を使用して、いくつかの postanalytics サーバー間でリクエストのバランスを取ることができます。

**例：**

```bash
upstream wallarm_tarantool {
    server 127.0.0.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# 省略

wallarm_tarantool_upstream wallarm_tarantool;
```

[Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)も参照してください。

!!! warning "必要な条件"
    `max_conns` および `keepalive` パラメータには、次の条件が満たされることが求められます：

    * `keepalive` パラメータの値は、Tarantool サーバーの数よりも低くしてはならない。
    * サーバーが過剰な接続を作成しないよう、各上流 Tarantool サーバーに対して `max_conns` パラメータの値を指定する必要があります。

!!! info
    このパラメータは、http ブロック内でのみ構成されます。

### wallarm_timeslice

フィルタリングノードがキュー内の次のリクエストに切り替える前に、1回のリクエスト処理の反復を実行するために費やす時間の制限。時間制限に達すると、フィルタリングノードはキュー内の次のリクエストを処理し始めます。キュー内の各リクエストで 1 回の反復処理が完了すると、ノードはキュー内の最初のリクエストで 2 回目の反復処理を実行します。

ディレクティブに異なる時間単位の値を割り当てるために、[NGINX ドキュメント](https://nginx.org/en/docs/syntax.html)で説明されている時間間隔の接尾辞を使用できます。

!!! info
    このパラメータは、http、server、location ブロック内で設定できます。
    **デフォルト値**: `0` (1回の反復の制限時間は無効)。
----

!!! warning
    NGINX サーバーの制限のため、`wallarm_timeslice`ディレクティブを機能させるためには、`proxy_request_buffering`NGINXディレクティブに`off`値を割り当てることでリクエストのバッファリングを無効にする必要があります。
