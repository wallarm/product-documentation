[doc-nginx-install]: ../installation/nginx/dynamic-module-from-distr.ja.md
[doc-eu-scanner-ip-addresses]: scanner-address-eu-cloud.ja.md
[doc-us-scanner-ip-addresses]: scanner-address-us-cloud.ja.md
[acl-access-phase]:            #wallarm_acl_access_phase

# NGINXをベースとしたWallarmノードの設定オプション

Wallarm NGINXモジュールのカスタマイズオプションを学び、Wallarmソリューションを最大限に活用しましょう。

!!! info "NGINX公式ドキュメンテーション"
    Wallarmの設定はNGINXの設定と非常に類似しています。[公式NGINXドキュメンテーションをご覧ください](https://www.nginx.com/resources/admin-guide/)。Wallarm固有の設定オプションとともに、NGINX設定の全機能が利用可能です。

## Wallarmディレクティブ

### disable_acl

リクエストの起点の解析を無効にすることができます。無効化（`on`）すると、フィルタリングノードは[IPリスト](../user-guides/ip-lists/overview.ja.md)をWallarmクラウドからダウンロードせず、リクエストソースIPの解析をスキップします。

!!! info
    このパラメータはhttp、サーバー、およびロケーションブロック内で設定できます。

    デフォルト値は`off`です。

### wallarm_acl_access_phase

このディレクティブは、NGINXをベースとしたWallarmノードで、[ブラックリスト化された](../user-guides/ip-lists/denylist.ja.md)IPからのリクエストをNGINXアクセス段階でブロックするよう強制します：

* `wallarm_acl_access_phase on`の場合、Wallarmノードは、任意の[フィルタリングモード](configure-wallarm-mode.ja.md)で、ブラックリスト化されたIPからの任意のリクエストをすぐにブロックし、ブラックリスト化されたIPからのリクエストで攻撃の兆候を検索しません。

    これが**デフォルトおよび推奨**の値であり、ブラックリストを標準的に動作させ、ノードのCPU負荷を大幅に軽減します。

* `wallarm_acl_access_phase off`の場合、Wallarmノードは最初にリクエストで攻撃の兆候を解析し、`block`または`safe_blocking`モードで操作している場合、ブラックリスト化されたIPからのリクエストをブロックします。

    `off`フィルタリングモードでは、ノードはリクエストを解析せず、ブラックリストをチェックしません。

    `monitoring`フィルタリングモードでは、ノードはすべてのリクエストで攻撃の兆候を検索しますが、ソースIPがブラックリストに載っていてもブロックしません。

    `wallarm_acl_access_phase off`でのWallarmノードの動作は、ノードのCPU負荷を大幅に増加させます。

!!! info "デフォルト値と他のディレクティブとの相互作用"
    **デフォルト値**: `on` (Wallarm node 4.2から)

    このディレクティブはNGINX設定ファイルのhttpブロック内でのみ設定できます。

    * [`disable_acl on`](#disable_acl)の場合、`wallarm_acl_access_phase`を有効にすることは意味がありません。
    * `wallarm_acl_access_phase`ディレクティブは、[`wallarm_mode`](#wallarm_mode)を上書きし、フィルタリングノードモードが`off`または`monitoring`であっても(`wallarm_acl_access_phase on`の場合)、ブラックリスト化されたIPからのリクエストをブロックします。

### wallarm_api_conf

Wallarm APIへのアクセス要件が含まれる`node.yaml`ファイルへのパス。

**例**:
```
wallarm_api_conf /etc/wallarm/node.yaml
```

フィルタリングノードからの直列化されたリクエストを、ポストアナリティクスモジュール（Tarantool）にアップロードする代わりに、直接Wallarm API（クラウド）にアップロードするために使用されます。**攻撃を含むリクエストのみがAPIに送信されます。** 攻撃のないリクエストは保存されません。

**node.yamlファイルの内容の例:**
``` bash
# API接続の認証情報

hostname: <ある名前>
uuid: <あるuuid>
secret: <あるシークレット>

# API接続のパラメータ (以下のパラメータはデフォルトで使用)

api:
  host: api.wallarm.com
  port: 443
  ca_verify: true
```

### wallarm_application

保護対象のアプリケーションの一意識別子で、Wallarmクラウドで使用します。値は`0`を除く正の整数が可能です。

アプリケーションのドメインとドメインのパスに対して一意識別子を設定することができます。例えば:

=== "ドメインの識別子"
    ドメイン **example.com**の設定ファイル:

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

    ドメイン **test.com**の設定ファイル:

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
=== "ドメインのパスの識別子"
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

[アプリケーションの設定詳細 →](../user-guides/settings/applications.ja.md)

!!! info
    このパラメータはhttp, サーバー, およびロケーションブロック内で設定できます。

    **デフォルト値**: `-1`.

### wallarm_block_page

ブロックされたリクエストへの応答を設定することができます。

[ブロッキングページとエラーコードの設定詳細 →](configuration-guides/configure-block-page-and-code.ja.md)

!!! info
    このパラメータはhttp、サーバー、およびロケーションブロック内で設定できます。

### wallarm_block_page_add_dynamic_path

このディレクティブは、そのコードとこのブロッキングページへのパスにNGINX変数が含まれているブロッキングページを初期化するために使用されます。それ以外の場合、このディレクティブは使用されません。

[ブロッキングページとエラーコードの設定詳細 →](configuration-guides/configure-block-page-and-code.ja.md)

!!! info
    このディレクティブを設定できるのは、NGINX設定ファイルの`http` ブロック内だけです。

### wallarm_cache_path

サーバーが起動時にproton.dbとカスタムルールセットファイルのコピーを保存するためのバックアップカタログを作成するディレクトリ。このディレクトリは、NGINXを実行するクライアントが書き込むことができる必要があります。

!!! info
    このパラメータはhttpブロック内でのみ設定されます。

### wallarm_custom_ruleset_path

保護対象のアプリケーションとフィルタリングノード設定に関する情報が含まれた[カスタムルールセット](../user-guides/rules/intro.ja.md)ファイルへのパス。

!!! info
    このパラメータはhttp、サーバー、およびロケーションブロック内で設定できます。

    **デフォルト値**: `/etc/wallarm/custom_ruleset`

### wallarm_enable_libdetection

**libdetection**ライブラリを介したSQL Injection攻撃の追加検証を有効/無効にします。**libdetection**の使用は攻撃の二重検出を保証し、偽陽性の数を減らします。

リクエストの**libdetection**ライブラリによる解析は、すべての[デプロイメントオプション](../installation/supported-deployment-options.ja.md)でデフォルトで有効になっています。 偽陽性の数を減らすために、解析を有効にしたままにすることをお勧めします。

[**libdetection**について詳しく →](../about-wallarm/protecting-against-attacks.ja.md#library-libdetection)

!!! warning "メモリ消費の増加"
    libdetectionライブラリを使用して攻撃を解析すると、NGINXおよびWallarmプロセスによって消費されるメモリの量が約10%増加する可能性があります。

!!! info
    このパラメータはhttp、サーバー、およびロケーションブロック内で設定できます。

    すべての[デプロイメントオプション](../installation/supported-deployment-options.ja.md)に対するデフォルト値は`on`です。

### wallarm_fallback

値が`on`に設定されている場合、NGINXは緊急モードに入る能力を持ちます。proton.dbやカスタムルールセットがダウンロードできない場合、この設定はhttp、サーバー、および位置ブロックのWallarmモジュールを無効にします。NGINXは機能し続けます。

!!! info
    デフォルト値は`on`です。

    このパラメータはhttp、サーバー、およびロケーションブロック内で設定できます。

### wallarm_force

NGINXのミラードトラフィックに基づいてリクエストの解析とカスタムルールの生成を設定します。[Analyzing mirrored traffic with NGINX](../installation/oob/web-server-mirroring/overview.ja.md)を参照してください。

### wallarm_general_ruleset_memory_limit

proton.dbとカスタムルールセットの1インスタンスが使用できる最大メモリ量の制限を設定します。

メモリ制限が一部のリクエストの処理中に超過した場合、ユーザは500エラーを受け取ります。

このパラメータでは以下のサフィックスを使用できます:
* `k` or `K` キロバイト
* `m` or `M` メガバイト
* `g` or `G` ギガバイト

**0**の値は、制限を無効にします。

!!! info
    このパラメータはhttp、サーバー、および/またはロケーションブロック内で設定できます。

    **デフォルト値**: `1` GB### wallarm_global_trainingset_path

!!! warning "このディレクティブは廃止されました"
    Wallarmノード3.6以降で、代わりに [`wallarm_protondb_path`](#wallarm_protondb_path) ディレクティブを使用してください。ディレクティブ名を変更するだけで、そのロジックは変わりません。

### wallarm_file_check_interval

proton.dbとカスタムルールセットファイルの新しいデータをチェックする間隔を定義します。測定単位は以下のようにサフィックスで指定します：
* サフィックスなし：分
* `s`：秒
* `ms`：ミリ秒

!!! info
    このパラメータは、httpブロック内でのみ設定されます。

    **デフォルト値**： `1`（1分）

### wallarm_instance

!!! warning "このディレクティブは廃止されました"
    * ディレクティブが保護対象のアプリケーションの一意の識別子を設定するために使用されていた場合、ただ [`wallarm_application`](#wallarm_application) に名前を変更してください。
    * マルチテナントノードのテナントの一意の識別子を設定するために `wallarm_instance` の代わりに [`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid) ディレクティブを使用してください。

    フィルタリングノードのバージョン4.0以前に使用していた設定を更新する場合：

    * マルチテナンシーフィーチャーなしでフィルタリングノードをアップグレードし、保護されたアプリケーションの一意の識別子を設定するために `wallarm_instance` を使用している場合、ただ `wallarm_application` に名前を変更してください。
    * マルチテナンシーフィーチャー付きでフィルタリングノードをアップグレードする場合、すべての `wallarm_instance` を `wallarm_application` と見なし、[マルチテナント再構成手順](../updating-migrating/older-versions/multi-tenant.ja.md#step-3-reconfigure-multitenancy) に記述されているように構成を再記述してください。

### wallarm_key_path

proton.dbとカスタムルールセットファイルの暗号化/復号化に使用されるWallarmのプライベートキーへのパス。

!!! info
    **デフォルト値**： `/etc/wallarm/private.key`（Wallarmノード3.6およびそれ以前では `/etc/wallarm/license.key`）

### wallarm_local_trainingset_path

!!! warning "このディレクティブは廃止されました"
    Wallarmノード3.6以降で、代わりに [`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path) ディレクティブを使用してください。ディレクティブ名を変更するだけで、そのロジックは変わりません。

### wallarm_mode

トラフィック処理モード：

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include/wallarm-modes-description-latest.ja.md"

`wallarm_mode` の使用は `wallarm_mode_allow_override` ディレクティブによって制限されることがあります。

[フィルタリングモード設定の詳細な手順 →](configure-wallarm-mode.ja.md)

!!! info
    このパラメータは、httpブロック、サーバーブロック、およびロケーションブロック内で設定できます。

    **デフォルト値**はフィルタリングノードのデプロイ方法によります（ `off` または `monitoring` になることがあります）

### wallarm_mode_allow_override

Wallarm Cloudからダウンロードしたフィルタリングルールを介して [`wallarm_mode`](#wallarm_mode) の値をオーバーライドする能力を管理します:

- `off` - カスタムルールは無視されます。
- `strict` - カスタムルールは操作モードを強化することしかできません。
- `on` - 操作モードを強化することも緩和することも可能です。

例えば、`wallarm_mode monitoring` と `wallarm_mode_allow_override strict` が設定されている場合、Wallarm Consoleを使用して一部のリクエストをブロックすることができますが、攻撃分析を完全に無効にすることはできません。

[フィルタリングモード設定の詳細な手順 →](configure-wallarm-mode.ja.md)

!!! info
    このパラメータは、httpブロック、サーバーブロック、およびロケーションブロック内で設定できます。

    **デフォルト値**： `on`


### wallarm_parse_response

アプリケーションのレスポンスを解析するかどうか。レスポンス分析は、[パッシブ検出](../about-wallarm/detecting-vulnerabilities.ja.md#passive-detection) および [アクティブな脅威検証](../about-wallarm/detecting-vulnerabilities.ja.md#active-threat-verification) の際に脆弱性検出が必要です。

可能な値は `on`（レスポンス分析が有効）と `off`（レスポンス分析が無効）です。

!!! info
    このパラメータはhttpブロック、サーバーブロック、およびロケーションブロック内で設定できます。

    **デフォルト値**： `on`

!!! warning "パフォーマンスを向上させる"
    パフォーマンスを向上させるために、`location`を通じて静的ファイルの処理を無効にすることを推奨します。

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

WallarmはAPIセキュリティサブスクリプションプラン下で完全なWebSocketのサポートを提供します。デフォルトでは、WebSocketのメッセージは攻撃の対象として解析されません。

この機能を強制するには、APIセキュリティサブスクリプションプランを有効化し、 `wallarm_parse_websocket` ディレクティブを使用します。

可能な値：

- `on`：メッセージ解析が有効。
- `off`：メッセージ解析が無効。

!!! info
    このパラメータはhttpブロック、サーバーブロック、およびロケーションブロック内で設定できます。
    
    **デフォルト値**： `off`

### wallarm_parser_disable

パーサを無効にすることができます。ディレクティブの値は無効にするパーサの名前に対応します：

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
    このパラメータはhttpブロック、サーバーブロック、およびロケーションブロック内で設定できます。

### wallarm_parse_html_response

アプリケーションがレスポンスとして受け取ったHTMLコードにHTMLパーサを適用するかどうか。可能な値は `on`（HTMLパーサが適用されます）と `off`（HTMLパーサが適用されません）です。

このパラメータは `wallarm_parse_response on` の場合にのみ効果があります。

!!! info
    このパラメータはhttpブロック、サーバーブロック、およびロケーションブロック内で設定できます。

    **デフォルト値**： `on`

### wallarm_partner_client_uuid

[マルチテナント](../installation/multi-tenant/overview.ja.md) Wallarmノードのテナントの一意識別子。値は[UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format) 形式の文字列である必要があります。例えば：

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

!!! info
    このパラメータはhttpブロック、サーバーブロック、およびロケーションブロック内で設定できます。

    次の方法を知っておいてください：
    
    * [テナント作成中にテナントのUUIDを取得する →](../installation/multi-tenant/configure-accounts.ja.md#step-3-create-the-tenant-via-the-wallarm-api)
    * [既存のテナントのUUIDのリストを取得する →](../updating-migrating/older-versions/multi-tenant.ja.md#get-uuids-of-your-tenants)
    
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

上記の設定では：

* テナントはパートナーのクライアントを表します。パートナーには2人のクライアントがいます。
* `tenant1.com` と `tenant1-1.com` に向けられたトラフィックはクライアント `11111111-1111-1111-1111-111111111111` に関連付けられます。
* `tenant2.com` に向けられたトラフィックはクライアント `22222222-2222-2222-2222-222222222222` に関連付けられます。
* 最初のクライアントにはまた、[`wallarm_application`](#wallarm_application) ディレクティブを経由して指定された3つのアプリケーションがあります：
    * `tenant1.com/login` – `wallarm_application 21`
    * `tenant1.com/users` – `wallarm_application 22`
    * `tenant1-1.com` – `wallarm_application 23`

    これら3つのパスに向けられたトラフィックは対応するアプリケーションに関連付けられ、その残りは最初のクライアントの一般的なトラフィックになります。### wallarm_process_time_limit

!!! warning "このディレクティブは廃止予定です"
    バージョン3.6以降、 `overlimit_res` 攻撃検出は[ルール **overlimit_res攻撃検出の微調整**](../user-guides/rules/configure-overlimit-res-detection.ja.md) を使用して微調整することを推奨します。
    
    `wallarm_process_time_limit`ディレクティブは一時的にサポートされていますが、将来のリリースで削除される予定です。

Wallarmノードによる単一リクエスト処理の時間制限を設定します。

もし時間が制限を超えると、エラーがログに記録され、リクエストは [`overlimit_res`](../attacks-vulns-list.ja.md#overlimiting-of-computational-resources) 攻撃としてマークされます。 [`wallarm_process_time_limit_block`](#wallarm_process_time_limit_block) の値により、攻撃はブロックされるか、モニタリングされるか、無視されるかが決まります。

値は単位なしのミリ秒で指定します。例えば：

```bash
wallarm_process_time_limit 1200; # 1200 ミリ秒
wallarm_process_time_limit 2000; # 2000 ミリ秒
```

!!! info
    このパラメータはhttp、server、およびlocationブロック内で設定することができます。
    
    **デフォルト値**: 1000ms (1 秒)。

### wallarm_process_time_limit_block

!!! warning "このディレクティブは廃止予定です"
    バージョン3.6以降、 `overlimit_res` 攻撃検出は[ルール **overlimit_res攻撃検出の微調整**](../user-guides/rules/configure-overlimit-res-detection.ja.md) を使用して微調整することを推奨します。
    
    `wallarm_process_time_limit_block`ディレクティブは一時的にサポートされていますが、将来のリリースで削除される予定です。

[`wallarm_process_time_limit`](#wallarm_process_time_limit) ディレクティブで設定された時間制限を超えるリクエストのブロックを管理する能力：

- `on`: `wallarm_mode off`でなければ、リクエストは常にブロックされます。
- `off`: リクエストは常に無視されます。

    !!! warning "保護バイパスのリスク"
        `off` 値は、 `overlimit_res` 攻撃からの保護を無効にするので慎重に使用する必要があります。
        
        大きなファイルのアップロードが行われ、保護の回避や脆弱性の悪用のリスクがない場所など、本当に必要な厳密な特定のロケーションでのみ `off` 値を使用することを推奨します。
        
        httpまたはserverブロック全体で `wallarm_process_time_limit_block` を `off` に設定することは**強くお勧めしません**。
    
- `attack`: `wallarm_mode`ディレクティブで設定された攻撃ブロッキングモードに依存します：
    - `off`: リクエストは処理されません。
    - `monitoring`: リクエストは無視されますが、`overlimit_res`攻撃の詳細はWallarmクラウドにアップロードされ、Wallarmコンソールに表示されます。
    - `safe_blocking`: [graylisted](../user-guides/ip-lists/graylist.ja.md) IPアドレスからのリクエストだけがブロックされ、すべての`overlimit_res`攻撃の詳細はWallarmクラウドにアップロードされ、Wallarmコンソールに表示されます。
    - `block`: リクエストはブロックされます。

ディレクティブの値に関係なく、 `overlimit_res` 攻撃タイプのリクエストは、 [`wallarm_mode off;`](#wallarm_mode) でない限り、Wallarmクラウドにアップロードされます。

!!! info
    このパラメータはhttp、server、およびlocationブロック内で設定することができます。
    
    **デフォルト値**: `wallarm_process_time_limit_block attack`

### wallarm_proton_log_mask_master

NGINXマスタープロセスのデバッグログの設定。

!!! warning "ディレクティブの使用"
    Wallarmのサポートチームのメンバーに指示された場合にのみ、ディレクティブを設定する必要があります。彼らはディレクティブで使用する値を提供します。

!!! info
    このパラメータはメインレベルでのみ設定可能です。

### wallarm_proton_log_mask_worker

NGINXワーカープロセスのデバッグログの設定。

!!! warning "ディレクティブの使用"
    Wallarmのサポートチームのメンバーに指示された場合にのみ、ディレクティブを設定する必要があります。彼らはディレクティブで使用する値を提供します。

!!! info
    このパラメータはメインレベルでのみ設定可能です。

### wallarm_protondb_path

リクエストフィルタリングの全体設定を持つ [proton.db](../about-wallarm/protecting-against-attacks.ja.md#library-libproton) ファイルへのパス。これらの設定はアプリケーション構造に依存しません。

!!! info
    このパラメータはhttp、server、およびlocationブロック内で設定できます。
    
    **デフォルト値**: `/etc/wallarm/proton.db`

### wallarm_rate_limit

次の形式でレート制限設定を設定します：

```
wallarm_rate_limit <KEY_TO_MEASURE_LIMITS_FOR> rate=<RATE> burst=<BURST> delay=<DELAY>;
```

* `KEY_TO_MEASURE_LIMITS_FOR` - 制限を計測するキー。テキスト、[NGINX変数](http://nginx.org/en/docs/varindex.html)、またはその組み合わせを含めることができます。

    例：同じIPからのリクエストと `/login` エンドポイントへのリクエストを制限するには、 `"$remote_addr +login"` を使用します。
* `rate=<RATE>` (必須) - レート制限。 `rate=<number>r/s` または `rate=<number>r/m` にすることができます。
* `burst=<BURST>` (オプション) - RPS/RPMが指定された数値を超えた場合にバッファリングされ、レートが正常に戻ったときに処理される過剰なリクエストの最大数。デフォルトは `0` です。
* `delay=<DELAY>` - `<BURST>` 値が `0` でない場合、バッファリングされた過剰なリクエストの実行間で定義されたRPS/RPMを維持するかどうかを制御できます。 `nodelay` は、すべてのバッファリングされた過剰なリクエストをレート制限の遅延なしで同時に処理することを示します。数値値は、指定された数の過剰なリクエストを同時に処理し、他のリクエストはRPS/RPMで設定された遅延で処理されます。

例：

```
wallarm_rate_limit "$remote_addr +location_name" rate=10r/s burst=9 delay=5;
```

!!! info
    **デフォルト値:** なし。

    このパラメータはhttp、server、locationコンテキスト内で設定できます。

    もし [レート制限](../user-guides/rules/rate-limiting.ja.md) ルールを設定した場合、 `wallarm_rate_limit` ディレクティブは優先度が低くなります。

### wallarm_rate_limit_enabled

Wallarmのレート制限を有効/無効にします。

もし `off` の場合、[レート制限ルール](../user-guides/rules/rate-limiting.ja.md) （推奨）でも `wallarm_rate_limit` ディレクティブでも動作しません。

!!! info
    **デフォルト値:** `on` ですが、[レート制限ルール](../user-guides/rules/rate-limiting.ja.md) (推奨)または `wallarm_rate_limit` ディレクティブを設定していない限り、Wallarmのレート制限は機能しません。
    
    このパラメータはhttp、server、locationコンテキスト内で設定できます。

### wallarm_rate_limit_log_level

レート制限制御によって拒否されたリクエストのロギングレベル。 `info`、`notice`、`warn`、`error` が可能です。

!!! info
    **デフォルト値:** `error`。
    
    このパラメータはhttp、server、locationコンテキスト内で設定できます。

### wallarm_rate_limit_status_code

Wallarmのレート制限モジュールによって拒否されたリクエストに対するレスポンスのコード。

!!! info
    **デフォルト値:** `503`。
    
    このパラメータはhttp、server、locationコンテキスト内で設定できます。

### wallarm_rate_limit_shm_size

Wallarmのレート制限モジュールが消費できる共有メモリの最大量を設定します。

平均キー長が64バイト（文字）で、 `wallarm_rate_limit_shm_size`が64MBの場合、モジュールは同時に約130,000のユニークキーを処理できます。メモリを2倍にすると、モジュールのキャパシティが線形に2倍になります。

キーとは、モジュールが制限を計測するために使用するリクエストポイントの固有値です。たとえば、モジュールがIPアドレスに基づいて接続を制限している場合、各一意のIPアドレスは1つのキーとみなされます。デフォルトのディレクティブ値では、モジュールは同時に約130,000の異なるIPからのリクエストを処理できます。

!!! info
    **デフォルト値:** `64m` (64 MB)。
    
    このパラメータはhttpコンテキスト内でのみ設定できます。

### wallarm_request_chunk_size

一つの反復で処理されるリクエストの部分のサイズを制限します。 `wallarm_request_chunk_size` ディレクティブの値をバイト単位で設定するには、整数を指定します。また、次の接尾辞もサポートしています：
* `k` または `K` はキロバイトを意味します
* `m` または `M` はメガバイトを意味します
* `g` または `G` はギガバイトを意味します

!!! info
    このパラメータはhttp、server、およびlocationブロック内で設定できます。
    **デフォルト値**: `8k` (8 キロバイト)。### wallarm_request_memory_limit

1つのリクエストの処理に使用できるメモリの最大量を制限します。

制限を超えると、リクエストの処理が中断され、ユーザーには500のエラーが返されます。

このパラメータでは次の接尾語を使用できます：
* `k` または `K` はキロバイト用
* `m` または `M` はメガバイト用
* `g` または `G` はギガバイト用

`0` の値は制限をオフにします。

デフォルトでは、制限はオフになっています。

!!! info
    このパラメータは、http、サーバー、および/またはロケーションのブロック内で設定できます。


### wallarm_stalled_worker_timeout

NGINX ワーカーの 1 リクエスト処理のタイムリミットを秒単位で設定します。

時間が制限を超えると、NGINX ワーカーのデータが `stalled_workers_count` および `stalled_workers` [statistic](configure-statistics-service.ja.md##working-with-the-statistics-service) パラメータに書き込まれます。

!!! info
    このパラメータは、http、サーバー、および/またはロケーションのブロック内で設定できます。
    
    **デフォルト値**： `5` (5 秒)

### wallarm_status

[Wallarm statistics service](configure-statistics-service.ja.md) の操作を制御します。

ディレクティブの値は次の形式を持ちます：

```
wallarm_status [on|off] [format=json|prometheus];
```

統計サービスは、別の設定ファイル `/etc/nginx/conf.d/wallarm-status.conf` に設定することを強く推奨し、NGINXの設定を行う際に他のファイルで `wallarm_status` ディレクティブを使用しないでください。なぜなら、後者は安全でない可能性があるからです。

また、デフォルトの `wallarm-status` 設定の既存の行を変更しないことを強く推奨します。なぜなら、これは Wallarm クラウドへのメトリックデータのアップロードのプロセスを破壊する可能性があるからです。

!!! info
    ディレクティブは、 `server` および/または `location` の NGINX コンテキストで設定できます。

    `format` パラメータのデフォルト値は `json` です。

### wallarm_tarantool_upstream

`wallarm_tarantool_upstream` を使って、いくつかの postanalytics サーバー間でリクエストをバランス調整できます。

**例：**

```bash
upstream wallarm_tarantool {
    server 127.0.0.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# omitted

wallarm_tarantool_upstream wallarm_tarantool;
```

[Module ngx_http_upstream_module](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)も参照してください。

!!! warning "必須条件"
    `max_conns` と `keepalive` パラメータに対して次の条件が満たされていることが必要です：

    * `keepalive` パラメータの値は Tarantool サーバーの数より低くないこと。
    * `max_conns` パラメータは上流の各 Tarantool サーバーに対して指定され、過度の接続の作成を防ぎます。

!!! info
    このパラメータは、http ブロック内でのみ設定されます。

### wallarm_timeslice

フィルタリングノードがリクエストの1回の処理に費やす時間の制限。次のリクエストに切り替わる前にリクエストの一回の処理に費やす時間の制限。時間制限に達すると、フィルタリングノードはキュー内の次のリクエストの処理に進みます。キュー内のすべてのリクエストの一回目の処理を実行した後、ノードはキュー内の最初のリクエストの二回目の処理を実行します。

ディレクティブに異なる時間単位の値を割り当てるために、[NGINX documentation](https://nginx.org/en/docs/syntax.html) で説明されている時間間隔の接尾語を使用できます。

!!! info
    このパラメータは、http、サーバー、および/またはロケーションのブロック内で設定できます。
    **デフォルト値**： `0` (一回の処理の時間制限は無効)。

-----

!!! warning
    NGINX サーバーの制限のため、`proxy_request_buffering` NGINX ディレクティブに `off` 値を割り当ててリクエストのバッファリングを無効にする必要があります。これは `wallarm_timeslice` ディレクティブが機能するための必要条件です。

### wallarm_ts_request_memory_limit

!!! warning "このディレクティブは非推奨です"
    Wallarm ノード 4.0 からは、代わりに [`wallarm_general_ruleset_memory_limit`](#wallarm_general_ruleset_memory_limit) ディレクティブを使用してください。ディレクティブ名だけを変更して、そのロジックは変更しないでください。

### wallarm_unpack_response

アプリケーションの応答で返される圧縮データを解凍するかどうかを指定します。可能な値は `on` (解凍が有効) と `off` (解凍が無効) です。

このパラメータは `wallarm_parse_response on` の場合のみ有効です。

!!! info
    **デフォルト値**： `on`。

### wallarm_upstream_backend

シリアル化されたリクエストを送信する方法を指定します。リクエストは、タラントゥールか API へ送信することができます。

ディレクティブの可能な値は：
*   `tarantool`
*   `api`

他のディレクティブにより、デフォルト値は以下のように割り当てられます：
*   `tarantool` - 設定に `wallarm_api_conf` ディレクティブがない場合。
*   `api` - 設定に `wallarm_api_conf` ディレクティブがあり、 `wallarm_tarantool_upstream` ディレクティブがない場合。

    !!! note
        `wallarm_api_conf` と `wallarm_tarantool_upstream` のディレクティブが同時に設定に存在する場合、**directive ambiguous wallarm upstream backend** 形式の設定エラーが発生します。

!!! info
    このパラメータは、http ブロック内でのみ設定できます。

### wallarm_upstream_connect_attempts

Tarantool または Wallarm API への再接続の即時試行回数を定義します。
Tarantool または API への接続が終了すると、再接続の試みは行われません。ただし、これは接続が終了していない場合や、シリアル化されたリクエストのキューが空でない場合には当てはまりません。

!!! note
    再接続は別のサーバーを経由して行われる可能性があります。なぜなら、サーバーの選択は "アップストリーム" サブシステムが担当しているからです。
    
    このパラメータは、http ブロック内でのみ設定できます。

### wallarm_upstream_reconnect_interval

`wallarm_upstream_connect_attempts` のしきい値を超えた不成功な試行の後、Tarantool または Wallarm API への再接続の試行間での間隔を定義します。

!!! info
    このパラメータは、http ブロック内でのみ設定できます。

### wallarm_upstream_connect_timeout

Tarantool または Wallarm API への接続のタイムアウトを定義します。

!!! info
    このパラメータは、http ブロック内でのみ設定できます。

### wallarm_upstream_queue_limit

シリアル化されたリクエストの数の上限を定義します。
`wallarm_upstream_queue_limit` パラメータを設定し、`wallarm_upstream_queue_memory_limit` パラメータを設定しないと、後者には上限がないことを意味します。

!!! info
    このパラメータは、http ブロック内でのみ設定できます。

### wallarm_upstream_queue_memory_limit

シリアル化されたリクエストの総量の上限を定義します。
`wallarm_upstream_queue_memory_limit` パラメータを設定し、`wallarm_upstream_queue_limit` パラメータを設定しないと、後者には上限がないことを意味します。

!!! info
    **デフォルト値：** `100m`。
    
    このパラメータは、http ブロック内でのみ設定できます。