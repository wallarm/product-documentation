[doc-nginx-install]:    ../installation/nginx/dynamic-module-from-distr.md
[doc-eu-scanner-ip-addresses]: scanner-address-eu-cloud.md
[doc-us-scanner-ip-addresses]: scanner-address-us-cloud.md
[acl-access-phase]:            #wallarm_acl_access_phase

# NGINXベースのWallarmノードの設定オプション

[セルフホスト型のWallarm NGINXノード](../installation/nginx-native-node-internals.md#nginx-node)で利用できる詳細な調整オプションについて説明します。これらを活用してWallarmソリューションを最大限に活用できます。

!!! info "NGINX公式ドキュメント"
    Wallarmの設定はNGINXの設定と非常に似ています。[公式のNGINXドキュメント](https://www.nginx.com/resources/admin-guide/)をご参照ください。Wallarm固有の設定オプションに加えて、NGINXの設定機能をフルに利用できます。

## Wallarmディレクティブ

### disable_acl

リクエストの送信元解析を無効化できます。`on`に設定すると、フィルタリングノードはWallarm Cloudから[IPリスト](../user-guides/ip-lists/overview.md)をダウンロードせず、リクエスト送信元IPの解析をスキップします。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。

    デフォルト値は`off`です。

### wallarm_acl_access_phase

このディレクティブは、NGINXのaccessフェーズで[denylist](../user-guides/ip-lists/overview.md)にあるIPからのリクエストをブロックするようNGINXベースのWallarmノードに指示します。つまり:

* `wallarm_acl_access_phase on`の場合、Wallarmノードは任意の[フィルタリングモード](configure-wallarm-mode.md)（`off`を除く）でdenylistのIPからのあらゆるリクエストを即座にブロックし、denylistのIPからのリクエストに対して攻撃兆候の検索を行いません。

    これはデフォルトかつ推奨の値です。denylistが標準どおりに動作し、ノードのCPU負荷を大幅に低減できます。

* `wallarm_acl_access_phase off`の場合、Wallarmノードはまず攻撃兆候の解析を行い、その後に`block`または`safe_blocking`モードで動作している場合にdenylistのIPからのリクエストをブロックします。

    `monitoring`フィルタリングモードでは、ノードはすべてのリクエストで攻撃兆候を検索しますが、送信元IPがdenylistでもブロックしません。

    `wallarm_acl_access_phase off`の挙動は、ノードのCPU負荷を大幅に増加させます。

!!! info "デフォルト値と他ディレクティブとの相互作用"
    デフォルト値: `on`（Wallarmノード4.2以降）

    このディレクティブはNGINX設定ファイルのhttpブロック内でのみ設定できます。

    * wallarmモードが`off`または[`disable_acl on`](#disable_acl)の場合、IPリストは処理されず、`wallarm_acl_access_phase`を有効化しても意味がありません。
    * `wallarm_acl_access_phase`ディレクティブは[`wallarm_mode`](#wallarm_mode)より優先されるため、フィルタリングノードのモードが`monitoring`でも（`wallarm_acl_access_phase on`のとき）denylistのIPからのリクエストはブロックされます。

### wallarm_acl_export_enable

このディレクティブは、[denylist](../user-guides/ip-lists/overview.md)のIPからのリクエストに関する統計をノードからWallarm Cloudへ送信するかどうかを`on`/`off`で切り替えます。

* `wallarm_acl_export_enable on`の場合、denylistのIPからのリクエストに関する統計が**Attacks**セクションに[表示されます](../user-guides/ip-lists/overview.md#requests-from-denylisted-ips)。
* `wallarm_acl_export_enable off`の場合、denylistのIPからのリクエストに関する統計は表示されません。

!!! info
    このパラメータはhttpブロック内で設定します。
    
    デフォルト値: `on`

### wallarm_api_conf

Wallarm APIへのアクセス要件を含む`node.yaml`ファイルへのパスです。

デフォルト:

```
wallarm_api_conf /opt/wallarm/etc/wallarm/node.yaml
```

フィルタリングノードからのシリアライズ済みリクエストをpostanalyticsモジュール（wstore）へアップロードする代わりに、直接Wallarm API（Cloud）へアップロードするために使用します。**攻撃を含むリクエストのみ**がAPIへ送信されます。攻撃を含まないリクエストは保存されません。

node.yamlの内容例:

``` yaml
# API接続パラメータ（以下のパラメータがデフォルトで使用されます）
api:
  host: api.wallarm.com
  port: 443
  ca_verify: true
```

[その他のパラメータ](configure-cloud-node-synchronization-en.md#access-parameters)

### wallarm_application

Wallarm Cloudで使用する保護対象アプリケーションの一意識別子です。値は`0`を除く正の整数にできます。

一意識別子はアプリケーションのドメインにもドメインパスにも設定できます。例:

=== "ドメインの識別子"
    ドメイン**example.com**の設定ファイル:
    
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

    ドメイン**test.com**の設定ファイル:

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
=== "ドメインパスの識別子"
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

[アプリケーションの設定方法の詳細→](../user-guides/settings/applications.md)

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。

    デフォルト値: `-1`。

### wallarm_block_page

ブロックされたリクエストへの応答内容を設定できます。

[ブロックページとエラーコードの設定の詳細→](configuration-guides/configure-block-page-and-code.md)

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。

### wallarm_block_page_add_dynamic_path

このディレクティブは、コード内にNGINX変数を含むブロックページを初期化し、そのブロックページへのパスも変数で設定する場合に使用します。それ以外の場合は使用しません。

[ブロックページとエラーコードの設定の詳細→](configuration-guides/configure-block-page-and-code.md)

!!! info
    このディレクティブはNGINX設定ファイルの`http`ブロック内で設定できます。

### wallarm_cache_path

サーバー起動時に、proton.dbおよびcustom rulesetファイルのコピーを保存するバックアップカタログが作成されるディレクトリです。このディレクトリはNGINXを実行するクライアントから書き込み可能である必要があります。

!!! info
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_custom_ruleset_path

保護対象アプリケーションやフィルタリングノードの設定情報を含む[custom ruleset](../user-guides/rules/rules.md)ファイルへのパスです。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値:
    
    * DockerのNGINXベースイメージ、クラウドイメージ、NGINX Nodeのall-in-oneインストーラーおよびNative Nodeインストール: `/opt/wallarm/etc/wallarm/custom_ruleset`
    * その他のインストール成果物: `/etc/wallarm/custom_ruleset`

### wallarm_enable_apifw

このディレクティブは、リリース4.10以降で利用可能な[API Specification Enforcement](../api-specification-enforcement/overview.md)を`on`で有効化、`off`で無効化します。この機能を有効化しても、必要なサブスクリプションの契約およびWallarm Console UIでの設定に代わるものではない点にご注意ください。

!!! info
    このパラメータは`server`ブロック内で設定できます。

    デフォルト値: `on`。

### wallarm_enable_libdetection

!!! info "その他のデプロイオプション"
    このセクションは、NGINXの[all-in-oneインストーラー](../installation/inline/compute-instances/linux/all-in-one.md)および[Docker](../admin-en/installation-docker-en.md)インストールでの設定方法を説明します。他のデプロイオプションについては次をご参照ください:
    
    * [NGINX Ingress controller](../admin-en/configure-kubernetes-en.md#managing-libdetection-mode)
    * [Sidecar](../installation/kubernetes/sidecar-proxy/pod-annotations.md#annotation-list)（`wallarm-enable-libdetection` Podアノテーション）
    * [AWS Terraform](../installation/cloud-platforms/aws/terraform-module/overview.md#how-to-use-the-wallarm-aws-terraform-module)（`libdetection`変数）

[**libdetection**](https://github.com/wallarm/libdetection)ライブラリによるSQLインジェクション攻撃の追加検証を有効/無効にします。**libdetection**を使用すると二重検知が行われ、誤検知を減らせます。

**libdetection**ライブラリでのリクエスト解析は、すべての[デプロイオプション](../installation/supported-deployment-options.md)でデフォルト有効です。誤検知を減らすため、有効のままにすることを推奨します。

追加検証を確認するには、保護対象リソースへ次のリクエストを送信します:

```bash
curl "http://localhost/?id=1' UNION SELECT"
```

* [基本の検知セット](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)（ライブラリ**libproton**）は`UNION SELECT`をSQLインジェクション攻撃の兆候として検知します。`UNION SELECT`単体はSQLインジェクション攻撃の兆候ではないため、**libproton**は誤検知を起こします。
* **libdetection**ライブラリでの解析が有効な場合、リクエスト内のSQLインジェクション攻撃の兆候は確認されません。リクエストは正当と見なされ、攻撃はWallarm Cloudへアップロードされず、（フィルタリングノードが`block`モードで動作していても）ブロックされません。

!!! warning "メモリ消費量の増加"
    libdetectionライブラリを使って攻撃を解析すると、NGINXおよびWallarmプロセスが消費するメモリ量が約10%増加する場合があります。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。

    デフォルト値は、すべての[デプロイオプション](../installation/supported-deployment-options.md)で`on`です。

### wallarm_fallback

値を`on`に設定すると、NGINXは緊急モードに入ることができます。proton.dbまたはcustom rulesetをダウンロードできない場合、この設定はデータのダウンロードに失敗したhttp、server、locationブロックについてWallarmモジュールを無効化します。NGINXは動作を継続します。

!!! info
    デフォルト値は`on`です。

    このパラメータはhttp、server、location各ブロック内で設定できます。

### wallarm_file_check_interval

proton.dbおよびcustom rulesetファイルに新しいデータがあるかをチェックする間隔を定義します。単位は接尾辞で指定します:
* 接尾辞なし: 分
* `s`: 秒
* `ms`: ミリ秒

!!! info
    このパラメータはhttpブロック内でのみ設定します。
    
    デフォルト値: `1`（1分）

### wallarm_general_ruleset_memory_limit

proton.dbおよびcustom rulesetの1インスタンスが使用できる最大メモリ量の上限を設定します。

処理中にこのメモリ上限を超えると、ユーザーには500エラーが返されます。

このパラメータでは次の接尾辞を使用できます:
* `k`または`K`: キロバイト
* `m`または`M`: メガバイト
* `g`または`G`: ギガバイト

値が**0**の場合、上限を無効化します。

!!! info
    このパラメータはhttp、server、locationの各ブロック内で設定できます。
    
    デフォルト値: `1` GB

### wallarm_global_trainingset_path

!!! warning "このディレクティブは非推奨です"
    Wallarmノード3.6以降では、代わりに[`wallarm_protondb_path`](#wallarm_protondb_path)ディレクティブを使用してください。ディレクティブ名を変更するだけで、動作ロジックは変わりません。

### wallarm_http_v2_stream_max_len

HTTP/2ストリームの最大許容長をバイト単位で設定します。指定値の半分に達すると、ストリームを穏やかに終了させるためにクライアントへHTTP/2の`GOAWAY`フレームを送信します。ストリームが閉じられず最大長に達した場合、NGINXは接続を強制終了します。

このオプションを設定しない場合、ストリーム長は無制限のままで、特に長時間接続のgRPC環境ではNGINXプロセスが無制限にメモリ消費する可能性があります。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    ディレクティブのデフォルト値はありません。デフォルトではHTTP/2ストリームの長さに制限はありません。

### wallarm_instance

!!! warning "このディレクティブは非推奨です"
    * このディレクティブを保護対象アプリケーションの一意識別子の設定に使用していた場合は、[`wallarm_application`](#wallarm_application)へ名称変更してください。
    * マルチテナントノードのテナントの一意識別子を設定する場合は、`wallarm_instance`の代わりに[`wallarm_partner_client_uuid`](#wallarm_partner_client_uuid)ディレクティブを使用してください。

    バージョン4.0より前のフィルタリングノードで使用していた設定を更新する場合:

    * マルチテナンシー機能なしのフィルタリングノードへアップグレードし、保護対象アプリケーションの一意識別子に`wallarm_instance`を使用している場合は、`wallarm_application`へ名称変更してください。
    * マルチテナンシー機能ありのフィルタリングノードへアップグレードする場合、すべての`wallarm_instance`は`wallarm_application`と見なされます。その上で[マルチテナンシー再設定手順](../updating-migrating/older-versions/multi-tenant.md#step-3-reconfigure-multitenancy)に従って設定を書き換えてください。

### wallarm_key_path

proton.dbおよびcustom rulesetファイルの暗号化/復号に使用するWallarmの秘密鍵へのパスです。

!!! info
    デフォルト値:
    
    * DockerのNGINXベースイメージ、クラウドイメージ、NGINX Nodeのall-in-oneインストーラーおよびNative Nodeインストール: `/opt/wallarm/etc/wallarm/private.key`
    * その他のインストール成果物: `/etc/wallarm/private.key`


### wallarm_local_trainingset_path

!!! warning "このディレクティブは非推奨です"
    Wallarmノード3.6以降では、代わりに[`wallarm_custom_ruleset_path`](#wallarm_custom_ruleset_path)ディレクティブを使用してください。ディレクティブ名を変更するだけで、動作ロジックは変わりません。

### wallarm_max_request_body_size

公開用途では非公開です。

Nodeが解析するHTTPリクエストボディの最大サイズ（バイト）を定義します。リクエストボディが指定上限を超えた場合、超過部分はスキップされ、脅威の検査は行われません。

このディレクティブはリリース6.2.0以降で利用可能です。

!!! info
    このパラメータはhttp、server、locationブロック内で設定します。

    デフォルト値: 無制限。

### wallarm_max_request_stream_message_size

Nodeが解析するgRPCまたはWebSocketストリーム内の単一メッセージペイロードの最大サイズ（バイト）を定義します。メッセージが指定上限を超えた場合、超過データはスキップされ、脅威の検査は行われません。

gRPCメッセージヘッダーはサイズ計算に含まれません。

このディレクティブはリリース6.2.0以降で利用可能です。

!!! info
    このパラメータはhttp、server、locationブロック内で設定します。

    デフォルト値: 1Mb

    * 5 MBのファイルを1つのgRPCメッセージとして送信した場合、最初の1 MBのみが解析されます。
    * ファイルを1 MB以下の複数のgRPCメッセージに分割した場合、すべての断片が解析されます。

### wallarm_max_request_stream_size

Nodeが解析するgRPCまたはWebSocketリクエストストリームボディの合計最大サイズ（バイト）を定義します。ストリームボディが指定上限を超えた場合、超過データはスキップされ、脅威の検査は行われません。

* HTTPヘッダーは計算に含まれません
* gRPCメッセージヘッダー（通常はメッセージ毎に5バイト）は含まれます

例えば、1000バイトのgRPCメッセージを2つ送信すると、合計ストリームサイズは`(1000 + 5) × 2 = 2010 bytes`になります（5バイトは各gRPCメッセージのヘッダー長）。

このディレクティブはリリース6.2.0以降で利用可能です。

!!! info
    このパラメータはhttp、server、locationブロック内で設定します。

    デフォルト値: 無制限。

### wallarm_memlimit_debug

このディレクティブは、メモリ上限超過時にリクエスト詳細を含む`/tmp/proton_last_memlimit.req`ファイルをWallarm NGINXモジュールが生成するかどうかを制御します。これはリクエストのメモリ上限処理に関する問題のデバッグに非常に役立ちます。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値: `on`。

### wallarm_mode

トラフィック処理モード:

* `off`
* `monitoring`
* `safe_blocking`
* `block`

--8<-- "../include/wallarm-modes-description-5.0.md"

`wallarm_mode`の適用は`wallarm_mode_allow_override`ディレクティブで制限できます。

[フィルタリングモード設定の詳細→](configure-wallarm-mode.md)

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値はフィルタリングノードのデプロイ方法に依存します（`off`または`monitoring`）。

### wallarm_mode_allow_override

Wallarm Cloud（custom ruleset）からダウンロードされるフィルタリングルールによる[`wallarm_mode`](#wallarm_mode)の上書き可否を制御します。

- `off` - customルールを無視します。
- `strict` - customルールは動作モードを強化する場合にのみ適用できます。
- `on` - 動作モードの強化と緩和の両方が可能です。

例えば、`wallarm_mode monitoring`かつ`wallarm_mode_allow_override strict`の場合、Wallarm Consoleから一部リクエストのブロックを有効化できますが、攻撃解析を完全に無効化することはできません。

[フィルタリングモード設定の詳細→](configure-wallarm-mode.md)

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値: `on`

### wallarm_parse_response

アプリケーションのレスポンスを解析するかどうかを制御します。レスポンス解析は、[パッシブ検知](../about-wallarm/detecting-vulnerabilities.md#passive-detection)および[脅威リプレイテスト](../about-wallarm/detecting-vulnerabilities.md#threat-replay-testing)での脆弱性検知に必要です。

値は`on`（レスポンス解析を有効化）または`off`（無効化）です。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値: `on`

!!! warning "パフォーマンスの改善"
    パフォーマンスを向上させるため、`location`で静的ファイルの処理を無効化することを推奨します。

### wallarm_parse_websocket <a href="../../about-wallarm/subscription-plans/#core-subscription-plans"><img src="../../images/api-security-tag.svg" style="border: none;height: 24px;margin-bottom: -4px;"></a>

WallarmはAPI Securityサブスクリプションプランの下でWebSocketを完全にサポートします。デフォルトでは、WebSocketのメッセージは攻撃解析が行われません。

この機能を有効化するには、API Securityサブスクリプションプランをアクティベートし、`wallarm_parse_websocket`ディレクティブを使用します。

指定可能な値:

- `on`: メッセージ解析を有効化します。
- `off`: メッセージ解析を無効化します。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値: `off`

### wallarm_parser_disable

パーサーを無効化できます。ディレクティブの値は無効化するパーサー名です:

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
    このパラメータはhttp、server、location各ブロック内で設定できます。

### wallarm_parse_html_response

アプリケーションレスポンスで受信したHTMLコードにHTMLパーサーを適用するかどうかを制御します。値は`on`（HTMLパーサーを適用）または`off`（適用しない）です。

このパラメータは`wallarm_parse_response on`の場合にのみ有効です。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値: `on`

### wallarm_partner_client_uuid

[マルチテナント](../installation/multi-tenant/overview.md)Wallarmノードのテナントの一意識別子です。値は[UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier#Format)形式の文字列である必要があります。例:

* `11111111-1111-1111-1111-111111111111`
* `123e4567-e89b-12d3-a456-426614174000`

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。

    取得方法:
    
    * [テナント作成時にUUIDを取得→](../installation/multi-tenant/configure-accounts.md#via-the-wallarm-api)
    * [既存テナントのUUID一覧を取得→](../updating-migrating/older-versions/multi-tenant.md#get-uuids-of-your-tenants)
    
設定例:

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

* Tenantはパートナーのクライアントを意味します。パートナーには2つのクライアントがあります。
* `tenant1.com`および`tenant1-1.com`向けのトラフィックは、クライアント`11111111-1111-1111-1111-111111111111`に関連付けられます。
* `tenant2.com`向けのトラフィックは、クライアント`22222222-2222-2222-2222-222222222222`に関連付けられます。
* 1つ目のクライアントには、[`wallarm_application`](#wallarm_application)ディレクティブで指定された3つのアプリケーションもあります:
    * `tenant1.com/login` – `wallarm_application 21`
    * `tenant1.com/users` – `wallarm_application 22`
    * `tenant1-1.com` – `wallarm_application 23`

    これら3つのパス向けのトラフィックは対応するアプリケーションに関連付けられ、それ以外は1つ目のクライアントの汎用トラフィックになります。

### wallarm_process_time_limit

!!! warning "このディレクティブは非推奨です"
    バージョン3.6以降では、[**Limit request processing time**](../user-guides/rules/configure-overlimit-res-detection.md)ルール（旧「Fine-tune the overlimit_res attack detection」）を使用して`overlimit_res`攻撃検知を詳細調整することを推奨します。
    
    `wallarm_process_time_limit`ディレクティブは暫定的にサポートされていますが、今後のリリースで削除される予定です。

Wallarmノードによる単一リクエスト処理の時間上限を設定します。

時間が上限を超えると、ログにエラーが記録され、そのリクエストは[`overlimit_res`](../attacks-vulns-list.md#resource-overlimit)攻撃としてマークされます。[`wallarm_process_time_limit_block`](#wallarm_process_time_limit_block)の値に応じて、この攻撃はブロック、モニタリング、無視のいずれかになります。

値は単位なしのミリ秒で指定します。例:

```bash
wallarm_process_time_limit 1200; # 1200ミリ秒
wallarm_process_time_limit 2000; # 2000ミリ秒
```

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値: 1000ms（1秒）。

### wallarm_process_time_limit_block

!!! warning "このディレクティブは非推奨です"
    バージョン3.6以降では、[**Limit request processing time**](../user-guides/rules/configure-overlimit-res-detection.md)ルール（旧「Fine-tune the overlimit_res attack detection」）を使用して`overlimit_res`攻撃検知を詳細調整することを推奨します。
    
    `wallarm_process_time_limit_block`ディレクティブは暫定的にサポートされていますが、今後のリリースで削除される予定です。

[`wallarm_process_time_limit`](#wallarm_process_time_limit)ディレクティブで設定した時間上限を超えたリクエストのブロック動作を制御します:

- `on`: `wallarm_mode off`でない限り常にリクエストをブロックします
- `off`: リクエストを常に無視します

    !!! warning "保護回避のリスク"
        `off`値は`overlimit_res`攻撃からの保護を無効化するため、慎重に使用する必要があります。
        
        例えば大容量ファイルのアップロードを行い、保護回避や脆弱性悪用のリスクがない厳密に特定されたlocationのみで`off`を使用することを推奨します。
        
        httpやserverブロックに対してグローバルに`wallarm_process_time_limit_block`を`off`に設定することは**強く推奨しません**。
    
- `attack`: `wallarm_mode`ディレクティブで設定した攻撃ブロックモードに依存します:
    - `off`: リクエストは処理されません。
    - `monitoring`: リクエストは無視されますが、`overlimit_res`攻撃の詳細はWallarm Cloudへアップロードされ、Wallarm Consoleに表示されます。
    - `safe_blocking`: [graylisted](../user-guides/ip-lists/overview.md)IPアドレスからのリクエストのみブロックされ、すべての`overlimit_res`攻撃の詳細はWallarm Cloudへアップロードされ、Wallarm Consoleに表示されます。
    - `block`: リクエストはブロックされます。

ディレクティブの値に関係なく、[`wallarm_mode off;`](#wallarm_mode)の場合を除き、`overlimit_res`攻撃タイプのリクエストはWallarm Cloudへアップロードされます。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値: `wallarm_process_time_limit_block attack`

### wallarm_proton_log_mask_master

NGINXマスタープロセスのデバッグログ設定です。

!!! warning "ディレクティブの使用について"
    このディレクティブの設定は、Wallarmサポートチームのメンバーから指示があった場合にのみ必要です。使用する値はサポートから提供されます。

!!! info
    このパラメータはmainレベルでのみ設定できます。


### wallarm_proton_log_mask_worker

NGINXワーカープロセスのデバッグログ設定です。

!!! warning "ディレクティブの使用について"
    このディレクティブの設定は、Wallarmサポートチームのメンバーから指示があった場合にのみ必要です。使用する値はサポートから提供されます。

!!! info
    このパラメータはmainレベルでのみ設定できます。

### wallarm_protondb_path

リクエストフィルタリングのグローバル設定を保持する[proton.db](../about-wallarm/protecting-against-attacks.md#basic-set-of-detectors)ファイルへのパスです。アプリケーション構造に依存しない設定です。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値:
    
    * DockerのNGINXベースイメージ、クラウドイメージ、NGINX Nodeのall-in-oneインストーラーおよびNative Nodeインストール: `/opt/wallarm/etc/wallarm/proton.db`
    * その他のインストール成果物: `/etc/wallarm/proton.db`

### wallarm_rate_limit

次の形式でレート制限の設定を行います:

```
wallarm_rate_limit <KEY_TO_MEASURE_LIMITS_FOR> rate=<RATE> burst=<BURST> delay=<DELAY>;
```

* `KEY_TO_MEASURE_LIMITS_FOR` - 制限を測定したいキーです。文字列、[NGINX変数](http://nginx.org/en/docs/varindex.html)、およびその組み合わせを含められます。

    例: `"$remote_addr +login"` は、同一IPから`/login`エンドポイントへのリクエストを制限します。
* `rate=<RATE>`（必須） - レート制限です。`rate=<number>r/s`または`rate=<number>r/m`を指定します。
* `burst=<BURST>`（任意） - 指定したRPS/RPMを超過した際に一度にバッファリングする超過リクエストの最大数で、レートが正常に戻ったときに処理されます。デフォルトは`0`です。
* `delay=<DELAY>` - `<BURST>`が`0`以外の場合、バッファリングされた超過リクエストの実行間で定義したRPS/RPMを維持するかを制御します。`nodelay`はすべてのバッファ済み超過リクエストをレート制限の遅延なしに同時処理することを意味します。数値を指定すると、その数の超過リクエストを同時処理し、残りはRPS/RPMの遅延で処理します。

例:

```
wallarm_rate_limit "$remote_addr +location_name" rate=10r/s burst=9 delay=5;
```

!!! info
    デフォルト値: なし。

    このパラメータはhttp、server、locationコンテキスト内で設定できます。

    [レート制限](../user-guides/rules/rate-limiting.md)ルールを設定した場合、`wallarm_rate_limit`ディレクティブの優先度は低くなります。

### wallarm_rate_limit_enabled

Wallarmのレート制限を有効/無効にします。

`off`の場合、[レート制限ルール](../user-guides/rules/rate-limiting.md)（推奨）も`wallarm_rate_limit`ディレクティブも動作しません。

!!! info
    デフォルト値: `on`ですが、[レート制限ルール](../user-guides/rules/rate-limiting.md)（推奨）または`wallarm_rate_limit`ディレクティブのいずれかを設定しない限り、Wallarmのレート制限は動作しません。
    
    このパラメータはhttp、server、locationコンテキスト内で設定できます。

### wallarm_rate_limit_log_level

レート制限により拒否されたリクエストのログレベルです。指定可能な値: `info`、`notice`、`warn`、`error`。

!!! info
    デフォルト値: `error`。
    
    このパラメータはhttp、server、locationコンテキスト内で設定できます。

### wallarm_rate_limit_status_code

Wallarmのレート制限モジュールによって拒否されたリクエストに対して返すコードです。

!!! info
    デフォルト値: `503`。
    
    このパラメータはhttp、server、locationコンテキスト内で設定できます。

### wallarm_rate_limit_shm_size

Wallarmレート制限モジュールが消費できる共有メモリの最大量を設定します。

平均キー長が64バイト（文字）で`wallarm_rate_limit_shm_size`が64MBの場合、このモジュールは約130,000個の一意キーを同時に処理できます。メモリを2倍にすると、モジュールの容量も線形に2倍になります。

キーとは、モジュールが制限を測定する際に使用するリクエストの一意値です。例えば、IPアドレスに基づいて接続を制限する場合、各一意のIPアドレスが1つのキーと見なされます。デフォルトのディレクティブ値では、約130,000個の異なるIPからのリクエストを同時に処理できます。

!!! info
    デフォルト値: `64m`（64 MB）。
    
    このパラメータはhttpコンテキスト内でのみ設定できます。

### wallarm_request_chunk_size

1回のイテレーションで処理するリクエストの部分のサイズを制限します。`wallarm_request_chunk_size`ディレクティブにはバイト単位の整数値を設定できます。次の接尾辞もサポートします:
* `k`または`K`: キロバイト
* `m`または`M`: メガバイト
* `g`または`G`: ギガバイト

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    デフォルト値: `8k`（8キロバイト）。

### wallarm_request_memory_limit

単一リクエストの処理に使用できる最大メモリ量の上限を設定します。

上限を超えると、リクエスト処理は中断され、ユーザーには500エラーが返されます。

このパラメータでは次の接尾辞を使用できます:
* `k`または`K`: キロバイト
* `m`または`M`: メガバイト
* `g`または`G`: ギガバイト

値が`0`の場合、上限を無効化します。

デフォルトでは上限は無効です。 

!!! info
    このパラメータはhttp、server、locationの各ブロック内で設定できます。

### wallarm_srv_include

[API Specification Enforcement](../api-specification-enforcement/overview.md)用の設定ファイルへのパスを指定します。このファイルはデフォルトで全てのデプロイメント成果物に含まれており、通常は変更不要です。

ただし、[カスタム`nginx.conf`を使用したNGINXベースのDockerイメージ](installation-docker-en.md#run-the-container-mounting-the-configuration-file)を使う場合は、このディレクティブを指定し、ファイルを指定したパスに配置する必要があります。

このディレクティブはリリース4.10.7以降で利用可能です。

!!! info
    このパラメータはhttpブロック内でのみ設定します。

    デフォルト値: `/etc/nginx/wallarm-apifw-loc.conf;`。

### wallarm_stalled_worker_timeout

NGINXワーカーが単一リクエストを処理する時間上限を秒で設定します。

時間が上限を超えると、NGINXワーカーに関するデータが`stalled_workers_count`および`stalled_workers`[統計](configure-statistics-service.md#usage)パラメータに書き込まれます。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    
    デフォルト値: `5`（5秒）

### wallarm_status

[Wallarm統計サービス](configure-statistics-service.md)の動作を制御します。

ディレクティブの値の形式は次のとおりです:

```
wallarm_status [on|off] [format=json|prometheus];
```

統計サービスの設定は専用のファイルで行い、他のNGINX設定ファイルには`wallarm_status`ディレクティブを記述しないことを強く推奨します。後者は安全でない可能性があるためです。`wallarm-status`の設定ファイルは次の場所にあります:

* all-in-oneインストーラー: `/etc/nginx/wallarm-status.conf`
* その他のインストール: `/etc/nginx/conf.d/wallarm-status.conf`

また、デフォルトの`wallarm-status`設定の既存行は変更しないことを強く推奨します。変更すると、Wallarm Cloudへのメトリクスデータのアップロード処理が破損する可能性があるためです。

!!! info
    このディレクティブはNGINXの`server`および`location`コンテキストで設定できます。

    `format`パラメータのデフォルト値は`json`です。

### wallarm_tarantool_upstream

!!! warning "`wallarm_tarantool_upstream`を`wallarm_wstore_upstream`へ名称変更"
    NGINX Nodeバージョン6.x以降では、このパラメータは[`wallarm_wstore_upstream`](#wallarm_wstore_upstream)に[名称変更](../updating-migrating/what-is-new.md#replacing-tarantool-with-wstore-for-postanalytics)され、動作ロジックの変更はありません。
    
    後方互換性は維持されますが、非推奨の警告が出力されます。将来のリリースで旧ディレクティブが削除された際のエラーを避けるため、名称変更を推奨します。警告例:
    
    ```
    2025/03/04 20:43:04 [warn] 3719#3719: "wallarm_tarantool_upstream" directive is deprecated, use "wallarm_wstore_upstream" instead in /etc/nginx/nginx.conf:19
    ```

### wallarm_timeslice

フィルタリングノードがリクエストの1回のイテレーション処理に費やす時間上限です。上限に達すると、ノードはキュー内の次のリクエスト処理に進みます。キュー内の各リクエストに対して1回のイテレーションを行った後、最初のリクエストに対する2回目のイテレーションを実行します。

このディレクティブに異なる時間単位の値を割り当てるには、[NGINXドキュメント](https://nginx.org/en/docs/syntax.html)で説明されている時間間隔の接尾辞を使用できます。

!!! info
    このパラメータはhttp、server、location各ブロック内で設定できます。
    デフォルト値: `0`（単一イテレーションの時間制限を無効化）。

-----

!!! warning
    NGINXサーバーの制限により、`wallarm_timeslice`ディレクティブを機能させるには、NGINXの`proxy_request_buffering`ディレクティブに`off`を設定してリクエストのバッファリングを無効化する必要があります。

### wallarm_ts_request_memory_limit

!!! warning "このディレクティブは非推奨です"
    Wallarmノード4.0以降では、代わりに[`wallarm_general_ruleset_memory_limit`](#wallarm_general_ruleset_memory_limit)ディレクティブを使用してください。ディレクティブ名を変更するだけで、動作ロジックは変わりません。

### wallarm_unpack_response

アプリケーションレスポンスで返される圧縮データを伸長するかどうかを制御します。値は`on`（伸長を有効化）または`off`（無効化）です。

このパラメータは`wallarm_parse_response on`の場合にのみ有効です。

!!! info
    デフォルト値: `on`。

### wallarm_upstream_backend

シリアライズ済みリクエストの送信先を指定します。リクエストはwstoreまたはAPIのいずれかへ送信できます。

ディレクティブの指定可能な値:
* `wstore`
* `api`

他のディレクティブの有無に応じて、デフォルト値は次のように決まります:
* 設定に`wallarm_api_conf`ディレクティブがない場合: `wstore`
* `wallarm_api_conf`ディレクティブがあり、`wallarm_wstore_upstream`ディレクティブがない場合: `api`

    !!! note
        `wallarm_api_conf`と`wallarm_wstore_upstream`ディレクティブが同時に設定されている場合、「directive ambiguous wallarm upstream backend」という形式の設定エラーが発生します。

!!! info
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_upstream_connect_attempts

wstoreまたはWallarm APIへの即時再接続回数を定義します。
wstoreまたはAPIへの接続が切断された場合、その接続に対する再接続は行いません。ただし、接続が1つも残っておらず、シリアライズ済みリクエストのキューが空でない場合は、この限りではありません。

!!! note
    再接続は別のサーバーを経由して行われる場合があります。サーバーの選択は“upstream”サブシステムが担当するためです。
    
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_upstream_reconnect_interval

`wallarm_upstream_connect_attempts`の閾値を超える回数だけ接続に失敗した後、wstoreまたはWallarm APIへ再接続を試みる間隔を定義します。

!!! info
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_upstream_connect_timeout

wstoreまたはWallarm APIへの接続タイムアウトを定義します。

!!! info
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_upstream_queue_limit

シリアライズ済みリクエストの件数上限を定義します。
`wallarm_upstream_queue_limit`を設定し、`wallarm_upstream_queue_memory_limit`を未設定にした場合、後者には上限がなくなります。

!!! info
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_upstream_queue_memory_limit

シリアライズ済みリクエストの総量上限を定義します。
`wallarm_upstream_queue_memory_limit`を設定し、`wallarm_upstream_queue_limit`を未設定にした場合、後者には上限がなくなります。

!!! info
    デフォルト値: `100m`。
    
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_wstore_upstream

NGINX-Wallarmモジュールを[別サーバーのpostanalyticsモジュール](installation-postanalytics-en.md)へ接続する方法（postanalyticsサーバーのupstreamおよびSSL/TLS接続設定）を定義します。

構文:

```
wallarm_wstore_upstream <UPSTREAM> ssl=on|off skip_host_check=on|off insecure=on|off;
```

* `<UPSTREAM>` - postanalyticsモジュールのアドレスを指すupstreamブロック名です。
* `ssl`（リリース6.2.0以降で利用可能） — [postanalyticsモジュールへの接続のSSL/TLS](installation-postanalytics-en.md#ssltls-and-mtls-between-the-nginx-wallarm-module-and-the-postanalytics-module)を有効/無効にします。指定可能な値: `on`または`off`。

    デフォルトは`off`です。

    `on`に設定する場合は、次も設定する必要があります:

    * [`wallarm_wstore_ssl_cert_file`](#wallarm_wstore_ssl_cert_file)
    * [`wallarm_wstore_ssl_key_file`](#wallarm_wstore_ssl_key_file)
    * [`wallarm_wstore_ssl_ca_cert_file`](#wallarm_wstore_ssl_ca_cert_file)
* `skip_host_check`（リリース6.2.0以降で利用可能、`ssl=on`時のみ） - TLSハンドシェイク中のホスト名検証をスキップします。

    localhostやIPアドレスへ、CN（Common Name）の一致しない証明書で接続する場合に有用です。本番環境では推奨しません。
* `insecure`（リリース6.2.0以降で利用可能、`ssl=on`時のみ） - 証明書の完全な検証（CAおよびホスト名チェックを含む）を無効化します。

    自己署名や一時的な証明書を使用する開発・テスト環境でのみ使用してください。

例:

```
upstream wallarm_wstore {
    server 1.1.1.1:3313 max_fails=0 fail_timeout=0 max_conns=1;
    keepalive 1;
}

# omitted

wallarm_wstore_upstream wallarm_wstore ssl=on;
```

!!! info "postanalytics用のupstream設定"
    `wallarm_wstore_upstream`ディレクティブで参照するpostanalyticsモジュール用の`upstream`ブロックでは、次の[標準のupstream設定](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)を構成できます:

    * postanalyticsモジュールのIPアドレスとポート
    * `max_fails`
    * `fail_timeout`
    * `max_conns` - 不要な接続の生成を防ぐため、各upstreamのwstoreサーバーに対して指定する必要があります
    * `keepalive` - wstoreサーバー数未満にしてはいけません

!!! info
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_wstore_ssl_cert_file

NGINX-WallarmモジュールがpostanalyticsモジュールへのSSL/TLS接続を確立する際に自らを認証するためのクライアント証明書のパスを指定します。

NGINX-Wallarmとpostanalyticsモジュールを別サーバーにインストールし、[相互TLS（mTLS）](installation-postanalytics-en.md#mutual-tls-mtls)を有効にしている場合に必要です。

このディレクティブはリリース6.2.0以降で利用可能です。

```
wallarm_wstore_ssl_cert_file /path/to/client.crt;
```

!!! info
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_wstore_ssl_key_file

[`wallarm_wstore_ssl_cert_file`](#wallarm_wstore_ssl_cert_file)で指定したクライアント証明書に対応する秘密鍵のパスを指定します。

NGINX-Wallarmとpostanalyticsモジュールを別サーバーにインストールし、[相互TLS（mTLS）](installation-postanalytics-en.md#mutual-tls-mtls)を有効にしている場合に必要です。

このディレクティブはリリース6.2.0以降で利用可能です。

```
wallarm_wstore_ssl_key_file /path/to/client.key;
```

!!! info
    このパラメータはhttpブロック内でのみ設定します。

### wallarm_wstore_ssl_ca_cert_file

[postanalyticsモジュールが提示するTLS証明書](installation-postanalytics-en.md#ssltls-connection-to-the-postanalytics-module)を検証するために使用する信頼された認証局（CA）証明書のパスを指定します。

カスタムCAが発行した証明書を使用するサーバーへ接続する場合に必要です。

このディレクティブはリリース6.2.0以降で利用可能です。

```
wallarm_wstore_ssl_ca_cert_file /path/to/ca.crt;
```

!!! info
    このパラメータはhttpブロック内でのみ設定します。