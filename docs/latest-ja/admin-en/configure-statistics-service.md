[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom
[doc-selinux]:                  ../troubleshooting/detection-and-blocking.md#filtering-node-rps-and-aps-values-are-not-exported-to-cloud

# 統計サービス

Wallarmの[NGINXまたはNative](../installation/nginx-native-node-internals.md)ノードの統計は、`wallarm_status`サービスで取得できます。本記事では、このサービスの設定方法と使用方法を説明します。

!!! info "Nativeノードの統計サービス"
    [Native](../installation/nginx-native-node-internals.md#native-node)ノードでは、`wallarm_status`は利用可能ではあるもののレガシーサービスです。主たるサービスは`metrics`で、`curl localhost:9000/metrics`で利用できます（Nativeノードの設定にある["metrics"](../installation/native-node/all-in-one-conf.md#metricsenabled)パラメータをご参照ください）。

## セットアップ

!!! warning "重要"

    統計サービスは専用ファイルで設定し、他のNGINX設定ファイル内では`wallarm_status`ディレクティブを使用しないことを強く推奨します。後者は安全でない可能性があるためです。`wallarm-status`の設定ファイルは次の場所にあります:

    * オールインワンインストーラーの場合: `/etc/nginx/wallarm-status.conf`
    * その他のインストールの場合: `/etc/nginx/conf.d/wallarm-status.conf`
    
    また、デフォルトの`wallarm-status`設定に含まれる既存の行は変更しないことを強く推奨します。

このディレクティブを使用すると、統計はJSON形式または[Prometheus][link-prometheus]互換形式で提供できます。使用方法:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    このディレクティブは`server`および/または`location`コンテキストで設定できます。

    ほとんどのデプロイメントオプションでは`format`パラメータのデフォルト値は`json`です。例外はNGINXベースのDockerイメージで、コンテナ外部から`/wallarm-status`エンドポイントを呼び出すと、Prometheus形式のメトリクスを返します。

### デフォルト設定

デフォルトでは、フィルタノードの統計サービスは最も安全な設定になっています。`/etc/nginx/conf.d/wallarm-status.conf`（オールインワンインストーラーの場合は`/etc/nginx/wallarm-status.conf`）の設定ファイルは次のとおりです:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.8/8;   # フィルタノードサーバのループバックアドレスからのみアクセス可能です
  # NGINXベースのDockerコンテナで実行している場合:
  # allow 127.0.0.0/8;
  deny all;

  wallarm_mode off;
  disable_acl "on";   # リクエスト送信元のチェックは無効化され、denylistにあるIPでもwallarm-statusサービスへのリクエストが許可されます。 https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  wallarm_enable_apifw off;
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### 統計の取得を許可するIPアドレスの制限

`wallarm_status`ディレクティブの設定時に、統計をリクエストできる送信元IPアドレスを指定できます。デフォルトでは、`127.0.0.1`と`::1`のIPアドレスを除きアクセスは拒否され、Wallarmをインストールしたサーバからのみリクエストを実行できます。

別のサーバからのリクエストを許可するには:

=== "オールインワンインストーラー"
    1. `/etc/nginx/wallarm-status.conf`ファイルで、許可したいサーバのIPアドレスを指定した`allow`ディレクティブを設定に追加します。例:

        ```diff
        ...
        server_name localhost;

        allow 127.0.0.8/8;
        + allow 10.41.29.0;
        ...
        ```
    1. 設定を変更したら、NGINXを再起動して反映します:

        --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
=== "Dockerイメージ"
    * Dockerコンテナを[環境変数のみを渡して実行している場合](installation-docker-en.md#run-the-container-passing-the-environment-variables)、許可するCIDRを環境変数`WALLARM_STATUS_ALLOW`で渡します。
    * Dockerコンテナを[設定ファイルをマウントして実行している場合](installation-docker-en.md#run-the-container-mounting-the-configuration-file):

        1. 許可するアドレスを`allow`ディレクティブで指定した`wallarm-status.conf`ファイルを準備します。例:

            ```diff
            server {
                listen 127.0.0.8:80;

                server_name localhost;

                allow 127.0.0.0/8;
            +    allow 10.41.29.0;
                deny all;

                wallarm_mode off;
                disable_acl "on";
                wallarm_enable_apifw off;
                access_log off;

                location ~/wallarm-status$ {
                    wallarm_status on;
                }
            }
            ```
            
        1. コンテナを起動する際に、準備したファイルをコンテナ内の`/etc/nginx/conf.d/wallarm-status.conf`へマウントします。

=== "AWSまたはGCPのマシンイメージ"
    1. `/etc/nginx/conf.d/wallarm-status.conf`ファイルで、許可したいサーバのIPアドレスを指定した`allow`ディレクティブを設定に追加します。例:

        ```diff
        ...
        server_name localhost;

        allow 127.0.0.8/8;
        + allow 10.41.29.0;
        ...
        ```
    1. 設定を変更したら、NGINXを再起動して反映します:

        --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### 統計サービスのIPアドレスやポートの変更

統計サービスのIPアドレスやポートを変更するには、以下の手順に従います。

=== "オールインワンインストーラー"
    1. `/etc/nginx/wallarm-status.conf`ファイルを開き、`listen`ディレクティブに新しいサービスアドレスを指定します。
    1. NGINXを再起動して変更を反映します:

        --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
=== "Dockerイメージ"
    * [NGINXベースのDockerイメージ](installation-docker-en.md)で統計サービスのデフォルトポートのみを変更する場合は、`NGINX_PORT`変数に新しいポートを設定してコンテナを起動します。その他の変更は不要です。
    * 統計サービスのIPアドレスとポートの両方を変更する場合:

        1. `listen`ディレクティブに新しいアドレスを指定した`wallarm-status.conf`ファイルを準備します:

            ```
            server {
                listen 127.0.0.8:80;

                server_name localhost;

                allow 127.0.0.8/8;
                # NGINXベースのDockerコンテナで実行している場合:
                # allow 127.0.0.0/8;
                deny all;

                wallarm_mode off;
                disable_acl "on";
                wallarm_enable_apifw off;
                access_log off;

                location ~/wallarm-status$ {
                    wallarm_status on;
                }
            }
            ```
            
        1. コンテナを起動する際に、準備したファイルをコンテナ内の`/etc/nginx/conf.d/wallarm-status.conf`へマウントします。
=== "AWSまたはGCPのマシンイメージ"
    1. `/etc/nginx/conf.d/wallarm-status.conf`ファイルを開き、`listen`ディレクティブに新しいサービスアドレスを指定します。
    1. NGINXを再起動して変更を反映します:

        --8<-- "../include/waf/restart-nginx-4.4-and-above.md"

フィルタノードのホストにSELinuxがインストールされている場合は、SELinuxを[適切に設定するか、無効化][doc-selinux]してください。簡潔のため、本ドキュメントではSELinuxが無効であることを前提とします。

上記の設定を適用すると、ローカルの`wallarm-status`出力はリセットされることにご注意ください。

### Prometheus形式で統計を取得する

ほとんどのデプロイメントオプションはデフォルトでJSON形式の統計を返します。NGINXベースのDockerイメージは例外で、コンテナ外部から`/wallarm-status`エンドポイントを呼び出すと、Prometheus形式のメトリクスを返します。

JSONがデフォルトのノードデプロイメントからPrometheus形式の統計を取得するには:

1. 次の設定を`/etc/nginx/conf.d/wallarm-status.conf`ファイル（オールインワンインストーラーの場合は`/etc/nginx/wallarm-status.conf`）に追加します:


    ```diff
    ...

    location /wallarm-status {
      wallarm_status on;
    }

    + location /wallarm-status-prometheus {
    +   wallarm_status on format=prometheus;
    + }

    ...
    ```

    !!! warning "デフォルトの`/wallarm-status`設定を削除・変更しないでください"
        `/wallarm-status`ロケーションのデフォルト設定は削除や変更をしないでください。このエンドポイントの既定の動作は重要です。
1. NGINXを再起動して変更を反映します:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. 新しいエンドポイントを呼び出してPrometheusメトリクスを取得します:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

## 使用方法

フィルタノードの統計を取得するには、許可されたIPアドレスのいずれかからリクエストします（上記参照）:

=== "JSON形式の統計"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    結果として、次のようなレスポンスが得られます:

    ```json
    {
        "requests": 0,
        "streams": 0,
        "messages": 0,
        "attacks": 0,
        "blocked": 0,
        "blocked_by_acl": 0,
        "acl_allow_list": 0,
        "abnormal": 0,
        "tnt_errors": 0,
        "api_errors": 0,
        "requests_lost": 0,
        "overlimits_time": 0,
        "segfaults": 0,
        "memfaults": 0,
        "softmemfaults": 0,
        "proton_errors": 0,
        "time_detect": 0,
        "db_id": 73,
        "lom_id": 102,
        "custom_ruleset_id": 102,
        "custom_ruleset_ver": 51,
        "db_apply_time": 1598525865,
        "lom_apply_time": 1598525870,
        "custom_ruleset_apply_time": 1598525870,
        "proton_instances": {
            "total": 3,
            "success": 3,
            "fallback": 0,
            "failed": 0
        },
        "stalled_workers_count": 0,
        "stalled_workers": [],
        "ts_files": [
            {
            "id": 102,
            "size": 12624136,
            "mod_time": 1598525870,
            "fname": "/etc/wallarm/custom_ruleset"
            }
        ],
        "db_files": [
            {
            "id": 73,
            "size": 139094,
            "mod_time": 1598525865,
            "fname": "/etc/wallarm/proton.db"
            }
        ],
        "startid": 1459972331756458216,
        "timestamp": 1664530105.868875,
        "rate_limit": {
            "shm_zone_size": 67108864,
            "buckets_count": 4,
            "entries": 1,
            "delayed": 0,
            "exceeded": 1,
            "expired": 0,
            "removed": 0,
            "no_free_nodes": 0
        },
        "split": {
            "clients": [
            {
                "client_id": null,
                "requests": 78,
                "streams": 0,
                "messages": 0,
                "attacks": 0,
                "blocked": 0,
                "blocked_by_acl": 0,
                "overlimits_time": 0,
                "time_detect": 0,
                "applications": [
                {
                    "app_id": 4,
                    "requests": 78,
                    "streams": 0,
                    "messages": 0,
                    "attacks": 0,
                    "blocked": 0,
                    "blocked_by_acl": 0,
                    "overlimits_time": 0,
                    "time_detect": 0
                }
                ]
            }
            ]
        }
    }
    ```
=== "Prometheus形式の統計"
    ```
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

    アドレスは異なる場合があります。実際のアドレスは`/etc/nginx/conf.d/wallarm-status.conf`（オールインワンインストーラーの場合は`/etc/nginx/wallarm-status.conf`）でご確認ください。

    結果として、次のようなレスポンスが得られます:


    ```
    # HELP wallarm_requests リクエスト数
    # TYPE wallarm_requests gauge
    wallarm_requests 2
    # HELP wallarm_streams リクエスト数
    # TYPE wallarm_streams gauge
    wallarm_streams 0
    # HELP wallarm_messages リクエスト数
    # TYPE wallarm_messages gauge
    wallarm_messages 0
    # HELP wallarm_attacks 攻撃リクエスト数
    # TYPE wallarm_attacks gauge
    wallarm_attacks 0
    # HELP wallarm_blocked ブロックされたリクエスト数
    # TYPE wallarm_blocked gauge
    wallarm_blocked 0
    # HELP wallarm_blocked_by_acl ACLによってブロックされたリクエスト数
    # TYPE wallarm_blocked_by_acl gauge
    wallarm_blocked_by_acl 0
    # HELP wallarm_acl_allow_list allowlistにより許可されたリクエスト数
    # TYPE wallarm_acl_allow_list gauge
    wallarm_acl_allow_list 0
    # HELP wallarm_abnormal 異常と判定されたリクエスト数
    # TYPE wallarm_abnormal gauge
    wallarm_abnormal 2
    # HELP wallarm_tnt_errors wstore書き込みエラー数
    # TYPE wallarm_tnt_errors gauge
    wallarm_tnt_errors 0
    # HELP wallarm_api_errors API書き込みエラー数
    # TYPE wallarm_api_errors gauge
    wallarm_api_errors 0
    # HELP wallarm_requests_lost ロストしたリクエスト数
    # TYPE wallarm_requests_lost gauge
    wallarm_requests_lost 0
    # HELP wallarm_overlimits_time overlimits_time回数
    # TYPE wallarm_overlimits_time gauge
    wallarm_overlimits_time 0
    # HELP wallarm_segfaults セグメンテーションフォールトの回数
    # TYPE wallarm_segfaults gauge
    wallarm_segfaults 0
    # HELP wallarm_memfaults 仮想メモリ上限到達イベント数
    # TYPE wallarm_memfaults gauge
    wallarm_memfaults 0
    # HELP wallarm_softmemfaults リクエストメモリ上限到達イベント数
    # TYPE wallarm_softmemfaults gauge
    wallarm_softmemfaults 0
    # HELP wallarm_proton_errors libprotonのメモリ以外の障害イベント数
    # TYPE wallarm_proton_errors gauge
    wallarm_proton_errors 0
    # HELP wallarm_time_detect_seconds 検知に費やした時間
    # TYPE wallarm_time_detect_seconds gauge
    wallarm_time_detect_seconds 0
    # HELP wallarm_db_id proton.dbファイルID
    # TYPE wallarm_db_id gauge
    wallarm_db_id 71
    # HELP wallarm_lom_id LOMファイルID
    # TYPE wallarm_lom_id gauge
    wallarm_lom_id 386
    # HELP wallarm_custom_ruleset_id カスタムルールセットファイルID
    # TYPE wallarm_custom_ruleset_id gauge
    wallarm_custom_ruleset_id{format="51"} 386
    # HELP wallarm_custom_ruleset_ver カスタムルールセットのファイルフォーマットバージョン
    # TYPE wallarm_custom_ruleset_ver gauge
    wallarm_custom_ruleset_ver 51
    # HELP wallarm_db_apply_time proton.dbファイルの適用時刻
    # TYPE wallarm_db_apply_time gauge
    wallarm_db_apply_time 1674548649
    # HELP wallarm_lom_apply_time LOMファイルの適用時刻
    # TYPE wallarm_lom_apply_time gauge
    wallarm_lom_apply_time 1674153198
    # HELP wallarm_custom_ruleset_apply_time カスタムルールセットファイルの適用時刻
    # TYPE wallarm_custom_ruleset_apply_time gauge
    wallarm_custom_ruleset_apply_time 1674153198
    # HELP wallarm_proton_instances protonインスタンス数
    # TYPE wallarm_proton_instances gauge
    wallarm_proton_instances{status="success"} 5
    wallarm_proton_instances{status="fallback"} 0
    wallarm_proton_instances{status="failed"} 0
    # HELP wallarm_stalled_worker_time_seconds libprotonでスタックしたworkerの時間
    # TYPE wallarm_stalled_worker_time_seconds gauge
    wallarm_stalled_worker_time_seconds{pid="3169104"} 25

    # HELP wallarm_startid 一意の起動ID
    # TYPE wallarm_startid gauge
    wallarm_startid 3226376659815907920
    ```

利用可能なレスポンスパラメータは次のとおりです（Prometheusのメトリクスには`wallarm_`プレフィックスが付きます）:

*   `requests`: フィルタノードが処理したリクエスト数です。
*   `streams`（Wallarmリリース6.2.0以降で利用可能）: 処理されたgRPC/WebSocketストリームの数です。
*   `messages`（Wallarmリリース6.2.0以降で利用可能）: 処理されたgRPC/WebSocketメッセージの数です。
*   `attacks`: 記録された攻撃の数です。
*   `blocked`: [denylist](../user-guides/ip-lists/overview.md)にあるIPからのリクエストを含む、ブロックされたリクエストの数です。
*   `blocked_by_acl`: [denylist](../user-guides/ip-lists/overview.md)にある送信元によってブロックされたリクエストの数です。
*   `acl_allow_list`: [allowlist](../user-guides/ip-lists/overview.md)にある送信元からのリクエスト数です。
*   `abnormal`: アプリケーションが異常と見なしたリクエストの数です。
*   `tnt_errors`: ポストアナリティクスモジュールで解析されなかったリクエストの数です。これらのリクエストについてはブロック理由は記録されますが、リクエスト自体は統計やふるまい検査にカウントされません。
*   `api_errors`: さらなる解析のためにAPIへ送信されなかったリクエストの数です。これらのリクエストにはブロックパラメータが適用されます（つまり、システムがブロッキングモードで動作している場合は不正なリクエストがブロックされます）が、これらのイベントのデータはUIには表示されません。このパラメータは、Wallarmノードがローカルのポストアナリティクスモジュールと連携している場合にのみ使用されます。
*   `requests_lost`: ポストアナリティクスモジュールで解析されずAPIへ転送されたリクエストの数です。これらのリクエストにはブロックパラメータが適用されます（つまり、システムがブロッキングモードで動作している場合は不正なリクエストがブロックされます）が、これらのイベントのデータはUIには表示されません。このパラメータは、Wallarmノードがローカルのポストアナリティクスモジュールと連携している場合にのみ使用されます。
*   `overlimits_time`: フィルタリングノードが検出した[計算資源の過剰制限](../attacks-vulns-list.md#resource-overlimit)タイプの攻撃数です。
*   `segfaults`: workerプロセスの緊急終了を引き起こした問題の回数です。
*   `memfaults`: 仮想メモリの上限に達した問題の回数です。
* `softmemfaults`: proton.db +lomの仮想メモリ上限を超過した問題の回数です（[`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)）。
* `proton_errors`: 仮想メモリ上限超過によるものを除く、proton.dbのエラー数です。
*   `time_detect`: リクエスト解析に要した総時間です。
*   `db_id`: proton.dbのバージョンです。
*   `lom_id`: まもなく廃止予定です。`custom_ruleset_id`を使用してください。
*   `custom_ruleset_id`: [カスタムルールセット][gl-lom]ビルドのバージョンです。

    リリース4.8以降、Prometheus形式では`wallarm_custom_ruleset_id{format="51"} 386`のように表示され、`format`属性内の`custom_ruleset_ver`がフォーマットバージョンで、メインの値がルールセットのビルドバージョンになります。
*   `custom_ruleset_ver`（Wallarmリリース4.4.3以降で利用可能）: [カスタムルールセット][gl-lom]のフォーマットです:

    * `4x` - [サポート終了](../updating-migrating/versioning-policy.md#version-list)となっているWallarmノード2.x向け。
    * `5x` - Wallarmノード4.xおよび3.x向け（後者は[サポート終了](../updating-migrating/versioning-policy.md#version-list)）。
*   `db_apply_time`: proton.dbファイルの最終更新のUnix時間です。
*   `lom_apply_time`: まもなく廃止予定です。`custom_ruleset_apply_time`を使用してください。
*   `custom_ruleset_apply_time`: [カスタムルールセット](../glossary-en.md#custom-ruleset-the-former-term-is-lom)ファイルの最終更新のUnix時間です。
*   `proton_instances`: ダウンロードされたproton.db + LOMのペアに関する情報です:
    *   `total`: ペアの総数です。
    *   `success`: Wallarm Cloudから正常にダウンロードされたペア数です。
    *   `fallback`: バックアップディレクトリからダウンロードされたペア数です。これは、Cloudから最新のproton.db + LOMをダウンロードする際に問題があったものの、[`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback)ディレクティブが`on`であるため、NGINXがバックアップディレクトリから古いバージョンのproton.db + LOMを読み込めたことを示します。
    *   `failed`: 初期化に失敗したペア数です。つまり、NGINXがCloudおよびバックアップディレクトリのいずれからもproton.db + LOMをダウンロードできなかったことを意味します。[`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback)が有効でこれが発生した場合、Wallarmモジュールは無効化され、NGINXモジュールのみが動作します。原因調査にはNGINXのログを確認するか、[Wallarmサポート](https://support.wallarm.com/)へお問い合わせいただくことを推奨します。
*   `stalled_workers_count`: リクエスト処理の時間制限を超えたworkerの数です（制限は[`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)ディレクティブで設定します）。
*   `stalled_workers`: リクエスト処理の時間制限を超えたworkerの一覧と、処理に費やした時間です（制限は[`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)ディレクティブで設定します）。
*   `ts_files`: [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom)ファイルに関する情報です:
    *   `id`: 使用中のLOMのバージョンです。
    *   `size`: LOMファイルサイズ（バイト）です。
    *   `mod_time`: LOMファイルの最終更新のUnix時間です。
    *   `fname`: LOMファイルへのパスです。
*   `db_files`: proton.dbファイルに関する情報です:
    *   `id`: 使用中のproton.dbのバージョンです。
    *   `size`: proton.dbファイルサイズ（バイト）です。
    *   `mod_time`: proton.dbファイルの最終更新のUnix時間です。
    *   `fname`: proton.dbファイルへのパスです。
* `startid`: フィルタノードのランダムに生成された一意のIDです。
* `timestamp`: 直近の受信リクエストがノードで処理された時刻です（[Unix Timestamp](https://www.unixtimestamp.com/)形式）。
* `rate_limit`: Wallarmの[レート制限](../user-guides/rules/rate-limiting.md)モジュールに関する情報です:
    * `shm_zone_size`: Wallarmのレート制限モジュールが消費できる共有メモリの総量（バイト）です（[`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size)ディレクティブを基に決まり、デフォルトは`67108864`です）。
    * `buckets_count`: バケットの数です（通常はNGINXのworker数に等しく、最大は8です）。
    * `entries`: 制限を計測する一意のリクエストポイント値（キー）の数です。
    * `delayed`: `burst`設定によりレート制限モジュールがバッファしたリクエスト数です。
    * `exceeded`: 上限超過によりレート制限モジュールが拒否したリクエスト数です。
    * `expired`: 60秒ごとの定期的な処理で、制限を超過しなかったキーがバケットから削除された累計数です。
    * `removed`: バケットから突発的に削除されたキーの数です。もし値が`expired`より大きい場合は、[`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size)の値を増やしてください。
    * `no_free_nodes`: `0`以外の値は、レート制限モジュールに割り当てたメモリが不足していることを示します。[`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size)の値を増やすことを推奨します。
* `split.clients`: 各[テナント](../installation/multi-tenant/overview.md)の主要統計です。マルチテナンシー機能が有効でない場合、統計は唯一のテナント（お客様のアカウント）に対して返され、`"client_id":null`という固定値になります。
* `split.clients.applications`: 各[アプリケーション](../user-guides/settings/applications.md)の主要統計です。このセクションに含まれていないパラメータは、すべてのアプリケーションに関する統計を返します。

すべてのカウンタのデータは、NGINXの起動時点から累積されます。既存のNGINXがあるインフラにWallarmを導入した場合は、統計の収集を開始するためにNGINXサーバを再起動する必要があります。