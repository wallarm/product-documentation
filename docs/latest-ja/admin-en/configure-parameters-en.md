```markdown
[doc-nginx-install]:    ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-address-eu-cloud.md
[doc-us-scanner-ip-addresses]: scanner-address-us-cloud.md
[acl-access-phase]:            #wallarm_acl_access_phase

# NGINXベースのWallarmノード用構成オプション

Wallarmソリューションを最大限に活用するために、[self-hosted Wallarm NGINX node](../installation/nginx-native-node-internals.md#nginx-node)で利用可能な微調整オプションを学んでください。

!!! info "NGINX公式ドキュメント"
    Wallarmの構成はNGINXの構成と非常に似ています。[NGINX公式ドキュメントをご参照ください](https://www.nginx.com/resources/admin-guide/)。Wallarm固有の構成オプションに加えて、NGINXの構成の全機能を利用できます。

## Wallarmディレクティブ

### disable_acl

リクエストの送信元解析を無効化できます。無効化（`on`）されると、フィルタリングノードはWallarm Cloudから[IPリスト](../user-guides/ip-lists/overview.md)をダウンロードせず、リクエストソースIPの解析をスキップします。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。

    デフォルト値は`off`です。

### wallarm_acl_access_phase

NGINXベースのWallarmノードに対し、NGINXアクセスフェーズで[denylisted](../user-guides/ip-lists/overview.md) IPからのリクエストをブロックするよう強制します。これは以下を意味します。

* `wallarm_acl_access_phase on`の場合、Wallarmノードは任意の[filtration mode](configure-wallarm-mode.md)（`off`を除く）でdenylisted IPからのリクエストを即座にブロックし、denylisted IPからのリクエストに対して攻撃兆候の探索を行いません。

    これはデフォルトであり推奨される値です。なぜなら、denylistedの標準的な動作を実現し、ノードのCPU負荷を大幅に軽減するためです。

* `wallarm_acl_access_phase off`の場合、Wallarmノードはまずリクエストの攻撃兆候を解析し、その後`block`または`safe_blocking`モードでdenylisted IPからのリクエストをブロックします。

    `monitoring`モードの場合、ノードは全リクエストに対して攻撃兆候を探索しますが、ソースIPがdenylistedであっても決してブロックしません。

    `wallarm_acl_access_phase off`の動作はノードのCPU負荷を大幅に増加させます。

!!! info "デフォルト値と他のディレクティブとの連動"
    **デフォルト値**: `on`（Wallarmノード4.2以降）

    このディレクティブはNGINX構成ファイルのhttpブロック内のみで設定可能です。

    * wallarmモードが`off`または[`disable_acl on`](#disable_acl)の場合、IPリストは処理されず、`wallarm_acl_access_phase`を有効にしても意味がありません。
    * `wallarm_acl_access_phase`ディレクティブは[`wallarm_mode`](#wallarm_mode)より優先されるため、フィルタリングノードのモードが`monitoring`であってもdenylisted IPからのリクエストがブロックされます（`wallarm_acl_access_phase on`の場合）。

### wallarm_acl_export_enable

このディレクティブにより、ノードからCloudへ[denylisted](../user-guides/ip-lists/overview.md) IPからのリクエスト統計情報の送信を`on`で有効化、`off`で無効化できます。

* `wallarm_acl_export_enable on`の場合、denylisted IPからのリクエストに関する統計情報が**Attacks**セクションに[表示](../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)されます。
* `wallarm_acl_export_enable off`の場合、denylisted IPからのリクエストに関する統計情報は表示されません。

!!! info
    このパラメータはhttpブロック内で設定されます。
    
    **デフォルト値**: `on`

### wallarm_api_conf

Wallarm APIのアクセス要件を含む`node.yaml`ファイルへのパスです。

**例**: 
```
wallarm_api_conf /etc/wallarm/node.yaml

# Docker NGINXベースのイメージ、cloudイメージおよびall-in-oneインストーラーでのインストール
# wallarm_api_conf /opt/wallarm/etc/wallarm/node.yaml
```

フィルタリングノードからシリアライズされたリクエストを直接Wallarm API（Cloud）へアップロードするために使用され、postanalyticsモジュール（Tarantool）へアップロードする代わりに使用されます。
**攻撃を検知したリクエストのみAPIへ送信されます。** 攻撃がないリクエストは保存されません。

**node.yamlファイルの内容例:**

``` yaml
# API接続認証情報

hostname: <some name>
uuid: <some uuid>
secret: <some secret>

# API接続パラメータ（以下のパラメータはデフォルトで使用されます）

host: api.wallarm.com
port: 443
ca_verify: true
```

### wallarm_application

Wallarm Cloudで使用される保護対象アプリケーションの一意識別子です。値は`0`を除く正の整数でなければなりません。

一意識別子は、ドメインとドメインパスの両方に設定できます。例えば:

=== "ドメイン用識別子"
    ドメイン**example.com**の構成ファイル:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 1;
        location / {
                proxy_pass http://example.com;
                include proxy_params;
        }
    }
    ```

    ドメイン**test.com**の構成ファイル:

    ```bash
    server {
        listen 80 default_server;
        listen [::]:80 default_server ipv6only=on;
        listen 443 ssl;

        ...

        wallarm_mode monitoring;
        wallarm_application 2;
        location / {
                proxy_pass http://test.com;
                include proxy_params;
        }
    }
    ```
=== "ドメインパス用識別子"
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

[アプリケーションの設定の詳細はこちら→](../user-guides/settings/applications.md)

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。

    **デフォルト値**: `-1`です。

### wallarm_block_page

ブロックされたリクエストに対するレスポンスを設定できます。

[ブロックページおよびエラーコード構成の詳細はこちら→](configuration-guides/configure-block-page-and-code.md)

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。

### wallarm_block_page_add_dynamic_path

NGINX変数を含むコードを持つブロックページを初期化するために使用されるディレクティブであり、このブロックページへのパスも変数を使用して設定されます。それ以外の場合、このディレクティブは使用されません。

[ブロックページおよびエラーコード構成の詳細はこちら→](configuration-guides/configure-block-page-and-code.md)

!!! info
    このディレクティブはNGINX構成ファイルの`http`ブロック内で設定できます。

### wallarm_cache_path

サーバ起動時にproton.dbおよびカスタムルールセットのファイルコピー保存用バックアップカタログが作成されるディレクトリです。このディレクトリはNGINXを実行するクライアントに書き込み可能でなければなりません。

!!! info
    このパラメータはhttpブロック内のみで設定されます。

### wallarm_custom_ruleset_path

保護対象アプリケーションとフィルタリングノードの設定に関する情報を含む[custom ruleset](../user-guides/rules/rules.md)ファイルへのパスです。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**:
    
    * Docker NGINXベースのイメージ、cloudイメージ、NGINX Node all-in-oneインストーラー、Native Nodeインストールの場合: `/opt/wallarm/etc/wallarm/custom_ruleset`
    * その他のインストールアーティファクトの場合: `/etc/wallarm/custom_ruleset`

### wallarm_enable_apifw

[API Specification Enforcement](../api-specification-enforcement/overview.md)を有効化（`on`）または無効化（`off`）するディレクティブです。リリース4.10以降で利用可能です。この機能を有効にしても、必要なサブスクリプションおよびWallarm Console UIでの構成の代替にはなりませんのでご注意ください。

!!! info
    このパラメータは`server`ブロック内で設定できます。

    **デフォルト値**: `on`です。

### wallarm_enable_libdetection

**libdetection**ライブラリを介したSQLインジェクション攻撃の追加検証を有効化または無効化します。**libdetection**を使用することで、攻撃の二重検出が確実になり、偽陽性の数を削減できます。

**libdetection**ライブラリによるリクエスト解析は、すべての[展開オプション](../installation/supported-deployment-options.md)でデフォルトで有効です。偽陽性を減らすため、解析は有効のままにすることを推奨します。

[**libdetection**の詳細はこちら→](../about-wallarm/protecting-against-attacks.md#library-libdetection)

!!! warning "メモリ消費の増加"
    libdetectionライブラリを使用して攻撃を解析する場合、NGINXおよびWallarmプロセスによるメモリ使用量が約10％増加する可能性があります。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。

    デフォルト値は、すべての[展開オプション](../installation/supported-deployment-options.md)で`on`です。

### wallarm_fallback

値を`on`に設定すると、NGINXが緊急モードに入る能力を有し、proton.dbまたはカスタムルールセットがダウンロードできない場合、この設定によりデータのダウンロードに失敗したhttp、server、locationブロック用のWallarmモジュールが無効化されます。NGINXは引き続き動作します。

!!! info
    デフォルト値は`on`です。

    このパラメータはhttp、server、locationブロック内で設定できます。

### wallarm_file_check_interval

proton.dbおよびカスタムルールセットファイル内の新しいデータをチェックする間隔を定義します。単位は以下の接尾辞で指定します:
* 単位なしは分
* `s`は秒
* `ms`はミリ秒

!!! info
    このパラメータはhttpブロック内のみで設定されます。
    
    **デフォルト値**: `1`（1分）

### wallarm_force

NGINXミラーリングトラフィックに基づいたリクエスト解析およびカスタムルール生成を設定します。詳細は[NGINXによるミラーリングトラフィックの解析](../installation/oob/web-server-mirroring/overview.md)をご参照ください。

### wallarm_general_ruleset_memory_limit

proton.dbおよびカスタムルールセットの1インスタンスが使用できるメモリの最大量に制限を設定します。

もしリクエスト処理中にメモリ制限が超過すると、ユーザーには500エラーが返されます。

このパラメータでは以下の接尾辞を使用できます:
* `k` または `K` - キロバイト
* `m` または `M` - メガバイト
* `g` または `G` - ギガバイト

**0**の値は制限を解除します。

!!! info
    このパラメータはhttp、server、および/またはlocationブロック内で設定できます。
    
    **デフォルト値**: `1` GB

### wallarm_global_trainingset_path

!!! warning "このディレクティブは非推奨です"
    Wallarmノード3.6以降では、代わりに[`wallarm_protondb_path`](#wallarm_protondb_path)ディレクティブをご使用ください。ディレクティブ名を変更するだけで、ロジックは変更されていません。

### wallarm_http_v2_stream_max_len

このディレクティブは、HTTP/2ストリームの最大許容長（バイト単位）を設定します。指定された値の半分に達すると、グレースフルなストリーム終了を促進するためにHTTP/2の`GOAWAY`フレームがクライアントに送信されます。ストリームが閉じられず最大長に到達すると、NGINXは接続を強制終了します。

このオプションが設定されていない場合、ストリーム長は無制限となり、特に長時間接続のあるgRPC環境ではNGINXプロセスのメモリ消費が無制限になる可能性があります。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    このディレクティブにはデフォルト値がなく、デフォルトではHTTP/2ストリームの長さに制限はありません。

### wallarm_instance

!!! warning "このディレクティブは非推奨です"
    * 保護対象アプリケーションの一意識別子を設定するために使用していた場合、単に[`wallarm_application`](#wallarm_application)に名称を変更してください。
    * マルチテナントノード用のテナントの一意識別子を設定するには、`wallarm_instance`の代わりに[`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid)ディレクティブを使用してください。

    4.0より前のバージョンで使用していたフィルタリングノードの構成を更新する際:

    * マルチテナント機能がないフィルタリングノードをアップグレードする際に、保護対象アプリケーションの一意識別子として使用している`wallarm_instance`がある場合、単に`wallarm_application`に名称を変更してください。
    * マルチテナント機能があるフィルタリングノードをアップグレードする場合、すべての`wallarm_instance`は`wallarm_application`とみなし、[マルチテナント再構成手順](../updating-migrating/older-versions/multi-tenant.md#step-3-reconfigure-multitenancy)に従って構成を書き換えてください。

### wallarm_key_path

proton.dbおよびカスタムルールセットファイルの暗号化/復号化に使用されるWallarm秘密鍵へのパスです。

!!! info
    **デフォルト値**:
    
    * Docker NGINXベースのイメージ、cloudイメージ、NGINX Node all-in-oneインストーラー、Native Nodeインストールの場合: `/opt/wallarm/etc/wallarm/private.key`
    * その他のインストールアーティファクトの場合: `/etc/wallarm/private.key`

### wallarm_local_trainingset_path

!!! warning "このディレクティブは非推奨です"
    Wallarmノード3.6以降では、代わりに[`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path)ディレクティブをご使用ください。ディレクティブ名を変更するだけで、ロジックは変更されていません。

### wallarm_memlimit_debug

Wallarm NGINXモジュールが1リクエスト分のメモリ使用制限を超えた際に、リクエストの詳細を含む`/tmp/proton_last_memlimit.req`ファイルを生成するかどうかを決定します。リクエストのメモリ制限処理に関連する問題のデバッグに非常に有用です。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**: `on`です。

### wallarm_mode

トラフィック処理モード:

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include/wallarm-modes-description-5.0.md"

`wallarm_mode`の使用は、`wallarm_mode_allow_override`ディレクティブによって制限できます。

[フィルトレーションモード構成の詳細はこちら→](configure-wallarm-mode.md)

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**はフィルタリングノードの展開方法に依存します（`off`または`monitoring`の場合があります）。

### wallarm_mode_allow_override

Wallarm Cloudからダウンロードされるフィルタリングルール（カスタムルールセット）による[`wallarm_mode`](#wallarm_mode)の値の上書きを管理します。

- `off` - カスタムルールは無視されます。
- `strict` - カスタムルールにより動作モードを強化することのみ可能です。
- `on` - 動作モードを強化および緩和することが可能です。

例えば、`wallarm_mode monitoring`および`wallarm_mode_allow_override strict`が設定されている場合、Wallarm Consoleを使用して一部リクエストのブロックを有効にできますが、攻撃解析を完全に無効化することはできません。

[フィルトレーションモード構成の詳細はこちら→](configure-wallarm-mode.md)

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**: `on`です。

### wallarm_parse_response

アプリケーションからのレスポンスの解析を行うかどうかを設定します。レスポンス解析は、[passive detection](../about-wallarm/detecting-vulnerabilities.md#passive-detection)や[threat replay testing](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)中の脆弱性検出に必要です。

可能な値は、`on`（レスポンス解析を有効）と`off`（レスポンス解析を無効）です。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**: `on`です。

!!! warning "パフォーマンス向上のために"
    静的ファイルの処理は`location`で無効にすることを推奨します。これによりパフォーマンスが向上します。

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#waap-and-advanced-api-security"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

WallarmはAPI Securityサブスクリプションプランにおいて、WebSocketsの完全サポートを提供します。デフォルトでは、WebSocketsのメッセージは攻撃解析対象外です。

この機能を強制するには、API Securityサブスクリプションプランを有効にし、`wallarm_parse_websocket`ディレクティブを使用してください。

可能な値:

- `on`: メッセージ解析を有効にします。
- `off`: メッセージ解析を無効にします。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**: `off`です。

### wallarm_parser_disable

パーサーを無効化できます。ディレクティブの値は無効化するパーサーの名称に対応します:

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
    このパラメータはhttp、server、locationブロック内で設定できます。

### wallarm_parse_html_response

アプリケーションレスポンスとして受信されたHTMLコードに対してHTMLパーサーを適用するかどうかを決定します。可能な値は`on`（HTMLパーサーを適用）と`off`（HTMLパーサーを適用しない）です。

このパラメータは`wallarm_parse_response on`の場合にのみ有効です。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**: `on`です。

### wallarm_partner_client_uuid

[マルチテナント](../installation/multi-tenant/overview.md)のWallarmノード用のテナントの一意識別子です。値は[UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format)形式の文字列でなければなりません。例:

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。

    使い方:
    
    * [テナント作成時にテナントのUUIDを取得する方法→](../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)
    * [既存テナントのUUIDリストの取得方法→](../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)
    
構成例:

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

上記の構成では:

* テナントはパートナーのクライアントを意味します。パートナーは2つのクライアントを保有しています。
* `tenant1.com`および`tenant1-1.com`宛のトラフィックは`11111111-1111-1111-1111-111111111111`のクライアントに紐付けられます。
* `tenant2.com`宛のトラフィックは`22222222-2222-2222-2222-222222222222`のクライアントに紐付けられます。
* 最初のクライアントには、[`wallarm_application`](#wallarm_application)ディレクティブで指定された3つのアプリケーションがあります:
    * `tenant1.com/login` – `wallarm_application 21`
    * `tenant1.com/users` – `wallarm_application 22`
    * `tenant1-1.com` – `wallarm_application 23`

    これら3つのパス宛のトラフィックは該当するアプリケーションに、残りは最初のクライアントの一般的なトラフィックとして扱われます。

### wallarm_process_time_limit

!!! warning "このディレクティブは非推奨です"
    バージョン3.6以降、`overlimit_res`攻撃検出の微調整には[**Limit request processing time**](../user-guides/rules/configure-overlimit-res-detection.md)ルール（旧「Fine-tune the overlimit_res attack detection」）の使用を推奨します。
    
    `wallarm_process_time_limit`ディレクティブは一時的にサポートされていますが、将来のリリースで削除される予定です。

Wallarmノードによる単一リクエスト処理の時間制限を設定します。

もし制限時間を超えると、ログにエラーが記録され、リクエストは[`overlimit_res`](../attacks-vulns-list.md#resource-overlimit)攻撃としてマークされます。[`wallarm_process_time_limit_block`](#wallarm_process_time_limit_block)の値に応じて、攻撃はブロック、モニタリング、または無視されます。

値は単位なしのミリ秒で指定します。例:

```bash
wallarm_process_time_limit 1200; # 1200ミリ秒
wallarm_process_time_limit 2000; # 2000ミリ秒
```

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**: 1000ms（1秒）。

### wallarm_process_time_limit_block

!!! warning "このディレクティブは非推奨です"
    バージョン3.6以降、`overlimit_res`攻撃検出の微調整には[**Limit request processing time**](../user-guides/rules/configure-overlimit-res-detection.md)ルール（旧「Fine-tune the overlimit_res attack detection」）の使用を推奨します。
    
    `wallarm_process_time_limit_block`ディレクティブは一時的にサポートされていますが、将来のリリースで削除される予定です。

`wallarm_process_time_limit`ディレクティブで設定した時間制限を超えるリクエストのブロック管理を行います:

- `on`: リクエストは常にブロックされます（`wallarm_mode off`の場合を除く）。
- `off`: リクエストは常に無視されます。

    !!! warning "保護回避リスク"
        `off`の値は、`overlimit_res`攻撃からの保護を無効化するため、慎重に使用する必要があります。
        
        この値は、大容量ファイルのアップロードなど、保護回避と脆弱性の悪用のリスクがない、非常に特定の場所でのみ使用することを推奨します。
        
        **httpまたはserverブロックで`wallarm_process_time_limit_block`をグローバルに`off`に設定することは強く推奨されません。**
    
- `attack`: `wallarm_mode`ディレクティブで設定された攻撃ブロックモードに依存します:
    - `off`: リクエストは処理されません。
    - `monitoring`: リクエストは無視されますが、`overlimit_res`攻撃の詳細はWallarm Cloudへアップロードされ、Wallarm Consoleに表示されます。
    - `safe_blocking`: [graylisted](../user-guides/ip-lists/overview.md) IP由来のリクエストのみがブロックされ、全ての`overlimit_res`攻撃の詳細はWallarm Cloudへアップロードされ、Wallarm Consoleに表示されます。
    - `block`: リクエストはブロックされます。

いずれのディレクティブ値でも、[`wallarm_mode off;`](#wallarm_mode)の場合を除き、`overlimit_res`攻撃タイプのリクエストはWallarm Cloudへアップロードされます。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**: `wallarm_process_time_limit_block attack`です。

### wallarm_proton_log_mask_master

NGINXマスタープロセスのデバッグログの設定です。

!!! warning "このディレクティブの使用について"
    Wallarmサポートチームからの指示があった場合にのみ、このディレクティブの設定を行ってください。指示された値を使用してください。

!!! info
    このパラメータはmainレベルでのみ設定可能です。

### wallarm_proton_log_mask_worker

NGINXワーカープロセスのデバッグログの設定です。

!!! warning "このディレクティブの使用について"
    Wallarmサポートチームからの指示があった場合にのみ、このディレクティブの設定を行ってください。指示された値を使用してください。

!!! info
    このパラメータはmainレベルでのみ設定可能です。

### wallarm_protondb_path

アプリケーション構造に依存しないリクエストフィルタリングのグローバル設定を持つ[proton.db](../about-wallarm/protecting-against-attacks.md#library-libproton)ファイルへのパスです。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**:
    
    * Docker NGINXベースのイメージ、cloudイメージ、NGINX Node all-in-oneインストーラー、Native Nodeインストールの場合: `/opt/wallarm/etc/wallarm/proton.db`
    * その他のインストールアーティファクトの場合: `/etc/wallarm/proton.db`

### wallarm_rate_limit

以下のフォーマットでレート制限の構成を設定します:

```
wallarm_rate_limit <KEY_TO_MEASURE_LIMITS_FOR> rate=<RATE> burst=<BURST> delay=<DELAY>;
```

* `KEY_TO_MEASURE_LIMITS_FOR` - 制限の測定対象となるキーです。テキスト、[NGINX変数](http://nginx.org/en/docs/varindex.html)およびその組み合わせを含めることができます。

    例: 同一IPからのリクエストかつ`/login`エンドポイントを対象とする場合、`"$remote_addr +login"`。
* `rate=<RATE>`（必須） - レート制限で、`rate=<数値>r/s`または`rate=<数値>r/m`が可能です。
* `burst=<BURST>`（任意） - 指定されたRPS/RPMを超えた場合にバッファリングされ、レートが正常に戻った際に処理される過剰リクエストの最大数。デフォルトは`0`です。
* `delay=<DELAY>` - `<BURST>`の値が`0`でない場合、バッファリングされた過剰リクエストの実行間にRPS/RPMを維持するかどうかを制御できます。`nodelay`は、レート制限による遅延なくすべてのバッファリングされた過剰リクエストを同時に処理することを意味します。数値を指定すると、その数だけの過剰リクエストは同時に処理され、その他はRPS/RPMで設定された遅延に従って処理されます。

例:

```
wallarm_rate_limit "$remote_addr +location_name" rate=10r/s burst=9 delay=5;
```

!!! info
    **デフォルト値:** なし

    このパラメータはhttp、server、locationブロック内で設定できます。

    [レート制限ルール](../user-guides/rules/rate-limiting.md)を設定している場合、`wallarm_rate_limit`ディレクティブは優先度が低くなります。

### wallarm_rate_limit_enabled

Wallarmレート制限の有効化・無効化を設定します。

`off`の場合、[レート制限ルール](../user-guides/rules/rate-limiting.md)（推奨）も`wallarm_rate_limit`ディレクティブも動作しません。

!!! info
    **デフォルト値:** `on`ですが、Wallarmレート制限は[レート制限ルール](../user-guides/rules/rate-limiting.md)（推奨）または`wallarm_rate_limit`ディレクティブのいずれかが設定されなければ動作しません。
    
    このパラメータはhttp、server、locationブロック内で設定できます。

### wallarm_rate_limit_log_level

レート制限制御により拒否されたリクエストのログ記録レベルを設定します。可能な値は: `info`、`notice`、`warn`、`error`です。

!!! info
    **デフォルト値:** `error`です。
    
    このパラメータはhttp、server、locationブロック内で設定できます。

### wallarm_rate_limit_status_code

Wallarmレート制限モジュールにより拒否されたリクエストに返すレスポンスコードを設定します。

!!! info
    **デフォルト値:** `503`です。
    
    このパラメータはhttp、server、locationブロック内で設定できます。

### wallarm_rate_limit_shm_size

Wallarmレート制限モジュールが消費できる共有メモリの最大量を設定します。

平均的なキーの長さが64バイト（文字）の場合、`wallarm_rate_limit_shm_size`が64MBだと、モジュールは約130,000個の一意なキーを同時に処理できます。メモリを2倍に増やすと、モジュールの容量が線形的に倍増します。

キーとは、モジュールが制限を測定するためにリクエストポイントの一意な値です。例えば、モジュールがIPアドレスに基づいて接続を制限している場合、一意な各IPアドレスは1つのキーとみなされます。デフォルトディレクティブ値では、約130,000個の異なるIPからのリクエストを同時に処理できます。

!!! info
    **デフォルト値:** `64m`（64 MB）です。
    
    このパラメータはhttpブロック内のみで設定できます。

### wallarm_request_chunk_size

一回の反復処理で処理されるリクエスト部分のサイズに制限をかけます。バイト単位の整数値を割り当てることで、`wallarm_request_chunk_size`ディレクティブにカスタム値を設定できます。以下の接尾辞もサポートされます:
* `k` または `K` - キロバイト
* `m` または `M` - メガバイト
* `g` または `G` - ギガバイト

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    **デフォルト値**: `8k`（8キロバイト）です。

### wallarm_request_memory_limit

単一リクエストの処理に使用可能なメモリの最大量の制限を設定します。

もし制限を超えると、リクエスト処理は中断され、ユーザーには500エラーが返されます。

このパラメータでは以下の接尾辞を使用できます:
* `k` または `K` - キロバイト
* `m` または `M` - メガバイト
* `g` または `G` - ギガバイト

`0`の値は制限を解除します。

デフォルトでは、制限は無効です。

!!! info
    このパラメータはhttp、server、および/またはlocationブロック内で設定できます。

### wallarm_srv_include

[API Specification Enforcement](../api-specification-enforcement/overview.md)の構成ファイルへのパスを指定します。このファイルはすべての展開アーティファクトにデフォルトで含まれており、通常は変更の必要はありません。

ただし、[カスタム`nginx.conf`を使用したNGINXベースのDockerイメージ](installation-docker-en.md#run-the-container-mounting-the-configuration-file)を使用している場合は、このディレクティブを指定し、ファイルを指定されたパスに配置する必要があります。

このディレクティブはリリース4.10.7以降で利用可能です。

!!! info
    このパラメータはhttpブロック内のみで設定されます。

    **デフォルト値**: `/etc/nginx/wallarm-apifw-loc.conf;`です。

### wallarm_stalled_worker_timeout

NGINXワーカーが単一リクエストを処理するための時間制限を秒単位で設定します。

制限時間を超えると、NGINXワーカーに関する情報が`stalled_workers_count`および`stalled_workers` [統計](configure-statistics-service.md#usage)パラメータに記録されます。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    
    **デフォルト値**: `5`（5秒）です。

### wallarm_status

[Wallarm統計サービス](configure-statistics-service.md)の動作を制御します。

ディレクティブの値は以下のフォーマットです:

```
wallarm_status [on|off] [format=json|prometheus];
```

統計サービスは専用のファイルで構成することを強く推奨します。NGINXの他の設定ファイルで`wallarm_status`ディレクティブを使用すると、セキュリティ上のリスクが生じる可能性があります。`wallarm-status`の構成ファイルは以下の場所にあります:

* all-in-oneインストーラーの場合: `/etc/nginx/wallarm-status.conf`
* その他のインストールの場合: `/etc/nginx/conf.d/wallarm-status.conf`

また、既存のデフォルト`wallarm-status`構成のいずれかの行を変更しないことを強く推奨します。変更すると、Wallarm Cloudへのメトリックデータのアップロードプロセスが破損する可能性があります。

!!! info
    このディレクティブは`server`および/または`location`のNGINXコンテキストで構成できます。

    `format`パラメータのデフォルト値は`json`です。

### wallarm_tarantool_upstream

`wallarm_tarantool_upstream`を使用することで、複数のpostanalyticsサーバ間でリクエストを負荷分散できます。

**例:**

```bash
upstream wallarm_tarantool {
    server 127.0.0.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# 省略

wallarm_tarantool_upstream wallarm_tarantool;
```

詳細は[Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)をご参照ください。

!!! warning "必要条件"
    `max_conns`および`keepalive`パラメータについては、次の条件を満たす必要があります:

    * `keepalive`パラメータの値はTarantoolサーバの数以上でなければなりません。
    * 各upstream Tarantoolサーバについて、過剰な接続が作成されないように`max_conns`パラメータの値を指定する必要があります。

!!! info
    このパラメータはhttpブロック内のみで設定できます。

### wallarm_timeslice

フィルタリングノードが1リクエストの処理に費やす時間の上限を設定します。この上限に達すると、ノードはキュー内の次のリクエストの処理に移ります。キュー内の各リクエストに対して1回の反復処理を行った後、最初のリクエストの2回目の処理を行います。

NGINXドキュメントに記載されている[時間間隔の接尾辞](https://nginx.org/en/docs/syntax.html)を使用して、ディレクティブに異なる時間単位を割り当てることができます。

!!! info
    このパラメータはhttp、server、locationブロック内で設定できます。
    **デフォルト値**: `0`（単一反復処理の時間制限は無効）。
    
-----

!!! warning
    NGINXサーバの制限のため、`wallarm_timeslice`ディレクティブが機能するためには、`proxy_request_buffering`NGINXディレクティブに`off`値を割り当て、バッファリング要求を無効にする必要があります。

### wallarm_ts_request_memory_limit

!!! warning "このディレクティブは非推奨です"
    Wallarmノード4.0以降、代わりに[`wallarm_general_ruleset_memory_limit`](#wallarm_general_ruleset_memory_limit)ディレクティブをご使用ください。ディレクティブ名を変更するだけで、ロジックは変更されていません。

### wallarm_unpack_response

アプリケーションレスポンスで返される圧縮データの解凍を行うかどうかを設定します。可能な値は`on`（解凍を有効）と`off`（解凍を無効）です。

このパラメータは`wallarm_parse_response on`の場合にのみ有効です。

!!! info
    **デフォルト値**: `on`です。

### wallarm_upstream_backend

シリアライズされたリクエストの送信先の方式を設定します。リクエストはTarantoolまたはAPIのいずれかに送信されます。

ディレクティブの可能な値:
*   `tarantool`
*   `api`

他のディレクティブに応じて、デフォルト値は次のように割り当てられます:
*   `tarantool` - 構成に`wallarm_api_conf`ディレクティブがない場合。
*   `api` - 構成に`wallarm_api_conf`ディレクティブがあるが、`wallarm_tarantool_upstream`ディレクティブがない場合。

    !!! note
        構成内に`wallarm_api_conf`と`wallarm_tarantool_upstream`ディレクティブが同時に存在する場合、**directive ambiguous wallarm upstream backend**形式の構成エラーが発生します。

!!! info
    このパラメータはhttpブロック内のみで設定できます。

### wallarm_upstream_connect_attempts

TarantoolまたはWallarm APIへの即時再接続の回数を定義します。
TarantoolまたはAPIへの接続が切断された場合、再接続の試行は行われません。しかし、接続がなく、かつシリアライズリクエストキューが空でない場合は例外となります。

!!! note
    再接続は他のサーバを経由して行われる可能性があります。なぜなら、「upstream」サブシステムがサーバの選択を担当するためです。
    
    このパラメータはhttpブロック内のみで設定できます。

### wallarm_upstream_reconnect_interval

`wallarm_upstream_connect_attempts`の閾値を超えた後、TarantoolまたはWallarm APIへの再接続を試みる間隔を定義します。

!!! info
    このパラメータはhttpブロック内のみで設定できます。

### wallarm_upstream_connect_timeout

TarantoolまたはWallarm APIへの接続タイムアウトを定義します。

!!! info
    このパラメータはhttpブロック内のみで設定できます。

### wallarm_upstream_queue_limit

シリアライズされたリクエストの数に対する制限を定義します。
`wallarm_upstream_queue_limit`パラメータを同時に設定し、`wallarm_upstream_queue_memory_limit`パラメータを設定しない場合、後者には制限がなくなります。

!!! info
    このパラメータはhttpブロック内のみで設定できます。

### wallarm_upstream_queue_memory_limit

シリアライズされたリクエストの総ボリュームに対する制限を定義します。
`wallarm_upstream_queue_memory_limit`パラメータを同時に設定し、`wallarm_upstream_queue_limit`パラメータを設定しない場合、後者には制限がなくなります。

!!! info
    **デフォルト値:** `100m`です。
    
    このパラメータはhttpブロック内のみで設定できます。

```