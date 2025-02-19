```markdown
[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom
[doc-selinux]:                  configure-selinux.md

# 統計サービス

Wallarmの[NGINX or Native](../installation/nginx-native-node-internals.md)ノード統計は`wallarm_status`サービスを使用して取得できます。本記事では、サービスの設定方法と使用方法について説明します。

!!! info "Nativeノード統計サービス"
    [Native](../installation/nginx-native-node-internals.md#native-node)ノードでは、`wallarm_status`はレガシーサービスですが、依然として利用可能です。主なサービスは`curl localhost:9000/metrics`で利用可能な`metrics`サービスです（Nativeノードの設定における["metrics"](../installation/native-node/all-in-one-conf.md#metricsenabled)パラメータを参照ください）。

## 設定

!!! warning "重要"
    
    統計サービスは専用の設定ファイルに設定することを強く推奨します。他のNGINX設定ファイル内に`wallarm_status`ディレクティブを記述するとセキュリティ上の問題が発生する可能性があります。`wallarm-status`の設定ファイルは以下の場所にあります:
    
    * all-in-oneインストーラーの場合: `/etc/nginx/wallarm-status.conf`
    * その他のインストールの場合: `/etc/nginx/conf.d/wallarm-status.conf`
    
    また、Wallarm Cloudへのメトリクスデータの送信プロセスに影響が出るため、デフォルトの`wallarm-status`設定ファイルの既存の行を変更しないことを強く推奨します。

`wallarm_status`ディレクティブを使用する場合、統計情報はJSON形式または[Prometheus][link-prometheus]互換形式で出力できます。使用例:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    このディレクティブは`server`または`location`コンテキストで設定できます。
    
    多くのデプロイメントオプションでは`format`パラメータはデフォルトで`json`に設定されていますが、NGINXベースのDockerイメージの場合、コンテナ外から`/wallarm-status`エンドポイントを呼び出すとPrometheus形式のメトリクスを返します。

### デフォルト設定

デフォルトでは、フィルターノード統計サービスは最も安全な設定になっています。`/etc/nginx/conf.d/wallarm-status.conf`（all-in-oneインストーラーの場合は`/etc/nginx/wallarm-status.conf`）の設定ファイルは以下のようになっています:

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # フィルターノードサーバのループバックアドレスでのみアクセスが可能です
  deny all;

  wallarm_mode off;
  disable_acl "on";   # リクエスト元のチェックは無効となっており、denylistに登録されたIPもwallarm-statusサービスへのアクセスが可能です。https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### 統計情報のリクエストを許可するIPアドレスの制限

`wallarm_status`ディレクティブを設定する際、統計情報をリクエストできるIPアドレスを指定できます。デフォルトでは、Wallarmがインストールされているサーバからのみ実行可能なIPアドレス`127.0.0.1`および`::1`以外からのアクセスは拒否されます。

他のサーバからのリクエストを許可するには、設定に対象サーバのIPアドレスを指定する`allow`命令を追加してください。例えば:

```diff
...
server_name localhost;

allow 127.0.0.0/8;
+ allow 10.41.29.0;
...
```

設定変更後、NGINXを再起動して変更を反映してください:

--8<-- "../include/waf/restart-nginx-4.4-and-above.md"

### 統計サービスのIPアドレスおよび/またはポートの変更

統計サービスのIPアドレスおよび/またはポートを変更するには、以下の手順に従ってください。

!!! info "NGINX Dockerイメージで統計サービスのポートを変更"
    [NGINXベースのDockerイメージ](installation-docker-en.md)の場合、コンテナを`NGINX_PORT`変数に新しいポート値を設定して起動してください。他の変更は必要ありません。

1. `/etc/nginx/conf.d/wallarm-status.conf`（all-in-oneインストーラーの場合は`/etc/nginx/wallarm-status.conf`）ファイルを開き、以下を指定してください:
    * `listen`ディレクティブで新しいサービスアドレスを指定。
    * 必要に応じて、デフォルトのループバックアドレスのみアクセスを許可する設定から、他のアドレスへのアクセスを許可するため`allow`ディレクティブを変更。
1. `node.yaml`ファイル（Docker NGINXベースイメージの場合は`/opt/wallarm/etc/wallarm/node.yaml`、cloudイメージ、NGINX Node all-in-oneインストーラーおよびNative Nodeの場合は各インストールの該当ファイル）に新しいアドレス値を指定する`status_endpoint`パラメータを追加してください。例えば:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. [`collectd`](monitoring/intro.md)設定ファイル内の`URL`パラメータを適切に修正してください。このファイルの場所は、使用しているOSやインストール方法によって異なります:

    === "DEBベースのディストリビューション"
        ```bash
        /etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf

        # all-in-oneインストーラーの場合:
        /opt/wallarm/etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf
        ```
    === "RPMベースのディストリビューション"
        ```bash
        /etc/wallarm-collectd.d/nginx-wallarm.conf

        # all-in-oneインストーラーの場合:
        /opt/wallarm/etc/wallarm-collectd.d/nginx-wallarm.conf
        ```
    === "AMI、GCPイメージ、またはDockerイメージ"
        ```bash
        /opt/wallarm/etc/collectd/wallarm-collectd.conf.d/nginx-wallarm.conf
        ```
1. 変更を反映するため、NGINXを再起動してください:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. all-in-oneインストーラーまたはcloudイメージでデプロイされたフィルターノードの場合、 `/opt/wallarm/env.list`ファイルを開き、新しいサービスのポート値（変更されている場合）を`NGINX_PORT`変数に追加してください。例えば:

    ```
    NGINX_PORT=8082
    ```
1. 非標準のIPアドレスまたはポートがTarantoolに使用されている場合は、Tarantoolの設定ファイルも適切に修正してください。このファイルの場所は、使用しているOSディストリビューションの種類によって異なります:

    === "DEBベースのディストリビューション"
        ```bash
        /etc/collectd/collectd.conf.d/wallarm-tarantool.conf

        # all-in-oneインストーラーの場合:
        /opt/wallarm/etc/collectd/collectd.conf.d/wallarm-tarantool.conf
        ```
    === "RPMベースのディストリビューション"
        ```bash
        /etc/collectd.d/wallarm-tarantool.conf

        # all-in-oneインストーラーの場合:
        /opt/wallarm/etc/collectd.d/wallarm-tarantool.conf
        ```
    === "AMI、GCPイメージ、またはDocker NGINXベースイメージ"
        ```bash
        /opt/wallarm/etc/collectd/collectd.conf.d/wallarm-tarantool.conf
        ```

フィルターノードホストにSELinuxがインストールされている場合、SELinuxが[設定済みまたは無効](doc-selinux)であることを確認してください。本ドキュメントでは、SELinuxが無効であると仮定しています。

上記の設定を適用すると、ローカルの`wallarm-status`出力はリセットされます。

### Prometheus形式で統計情報を取得

ほとんどのデプロイメントオプションでは、統計情報はデフォルトでJSON形式を返します。NGINXベースのDockerイメージは例外で、コンテナ外から`/wallarm-status`エンドポイントを呼び出すとPrometheus形式のメトリクスを返します。

JSONをデフォルトとするノードデプロイメントオプションでPrometheus形式の統計情報を取得するには:

1. `/etc/nginx/conf.d/wallarm-status.conf`（all-in-oneインストーラーの場合は`/etc/nginx/wallarm-status.conf`）ファイルに以下の設定を追加します:

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

    !!! warning "デフォルトの`/wallarm-status`設定を削除又は変更しないでください"
        Wallarm Cloudへ正確なデータをアップロードするため、`/wallarm-status`ロケーションのデフォルト設定を削除または変更しないでください。
1. 変更を反映するため、NGINXを再起動してください:

    --8<-- "../include/waf/restart-nginx-4.4-and-above.md"
1. 新しいエンドポイントを呼び出して、Prometheusメトリクスを取得します:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

##  使用方法

フィルターノード統計を取得するには、前述の許可済みIPアドレスからリクエストを実行してください:

=== "JSON形式での統計情報"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    結果として、以下のようなレスポンスが返されます:

    ```
    { "requests":0,"attacks":0,"blocked":0,"blocked_by_acl":0,"acl_allow_list":0,"abnormal":0,
    "tnt_errors":0,"api_errors":0,"requests_lost":0,"overlimits_time":0,"segfaults":0,"memfaults":0,
    "softmemfaults":0,"proton_errors":0,"time_detect":0,"db_id":73,"lom_id":102,"custom_ruleset_id":102,
    "custom_ruleset_ver":51,"db_apply_time":1598525865,"lom_apply_time":1598525870,
    "custom_ruleset_apply_time":1598525870,"proton_instances": { "total":3,"success":3,"fallback":0,
    "failed":0 },"stalled_workers_count":0,"stalled_workers":[],"ts_files":[{"id":102,"size":12624136,
    "mod_time":1598525870,"fname":"\/etc\/wallarm\/custom_ruleset"}],"db_files":[{"id":73,"size":139094,
    "mod_time":1598525865,"fname":"\/etc\/wallarm\/proton.db"}],"startid":1459972331756458216,
    "timestamp":1664530105.868875,"rate_limit":{"shm_zone_size":67108864,"buckets_count":4,"entries":1,
    "delayed":0,"exceeded":1,"expired":0,"removed":0,"no_free_nodes":0},"split":{"clients":[
    {"client_id":null,"requests": 78,"attacks": 0,"blocked": 0,"blocked_by_acl": 0,"overlimits_time": 0,
    "time_detect": 0,"applications":[{"app_id":4,"requests": 78,"attacks": 0,"blocked": 0,
    "blocked_by_acl": 0,"overlimits_time": 0,"time_detect": 0}]}]} }
    ```
=== "Prometheus形式での統計情報"
    ```
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

    アドレスは異なる場合があります。実際のアドレスは`/etc/nginx/conf.d/wallarm-status.conf`（all-in-oneインストーラーの場合は`/etc/nginx/wallarm-status.conf`）ファイルを確認してください。

    結果として、以下のようなレスポンスが返されます:


    ```
    # HELP wallarm_requests requests count
    # TYPE wallarm_requests gauge
    wallarm_requests 2
    # HELP wallarm_attacks attack requests count
    # TYPE wallarm_attacks gauge
    wallarm_attacks 0
    # HELP wallarm_blocked blocked requests count
    # TYPE wallarm_blocked gauge
    wallarm_blocked 0
    # HELP wallarm_blocked_by_acl blocked by acl requests count
    # TYPE wallarm_blocked_by_acl gauge
    wallarm_blocked_by_acl 0
    # HELP wallarm_acl_allow_list requests passed by allow list
    # TYPE wallarm_acl_allow_list gauge
    wallarm_acl_allow_list 0
    # HELP wallarm_abnormal abnormal requests count
    # TYPE wallarm_abnormal gauge
    wallarm_abnormal 2
    # HELP wallarm_tnt_errors tarantool write errors count
    # TYPE wallarm_tnt_errors gauge
    wallarm_tnt_errors 0
    # HELP wallarm_api_errors API write errors count
    # TYPE wallarm_api_errors gauge
    wallarm_api_errors 0
    # HELP wallarm_requests_lost lost requests count
    # TYPE wallarm_requests_lost gauge
    wallarm_requests_lost 0
    # HELP wallarm_overlimits_time overlimits_time count
    # TYPE wallarm_overlimits_time gauge
    wallarm_overlimits_time 0
    # HELP wallarm_segfaults segmentation faults count
    # TYPE wallarm_segfaults gauge
    wallarm_segfaults 0
    # HELP wallarm_memfaults vmem limit reached events count
    # TYPE wallarm_memfaults gauge
    wallarm_memfaults 0
    # HELP wallarm_softmemfaults request memory limit reached events count
    # TYPE wallarm_softmemfaults gauge
    wallarm_softmemfaults 0
    # HELP wallarm_proton_errors libproton non-memory related libproton faults events count
    # TYPE wallarm_proton_errors gauge
    wallarm_proton_errors 0
    # HELP wallarm_time_detect_seconds time spent for detection
    # TYPE wallarm_time_detect_seconds gauge
    wallarm_time_detect_seconds 0
    # HELP wallarm_db_id proton.db file id
    # TYPE wallarm_db_id gauge
    wallarm_db_id 71
    # HELP wallarm_lom_id LOM file id
    # TYPE wallarm_lom_id gauge
    wallarm_lom_id 386
    # HELP wallarm_custom_ruleset_id Custom Ruleset file id
    # TYPE wallarm_custom_ruleset_id gauge
    wallarm_custom_ruleset_id{format="51"} 386
    # HELP wallarm_custom_ruleset_ver custom ruleset file format version
    # TYPE wallarm_custom_ruleset_ver gauge
    wallarm_custom_ruleset_ver 51
    # HELP wallarm_db_apply_time proton.db file apply time id
    # TYPE wallarm_db_apply_time gauge
    wallarm_db_apply_time 1674548649
    # HELP wallarm_lom_apply_time LOM file apply time
    # TYPE wallarm_lom_apply_time gauge
    wallarm_lom_apply_time 1674153198
    # HELP wallarm_custom_ruleset_apply_time Custom Ruleset file apply time
    # TYPE wallarm_custom_ruleset_apply_time gauge
    wallarm_custom_ruleset_apply_time 1674153198
    # HELP wallarm_proton_instances proton instances count
    # TYPE wallarm_proton_instances gauge
    wallarm_proton_instances{status="success"} 5
    wallarm_proton_instances{status="fallback"} 0
    wallarm_proton_instances{status="failed"} 0
    # HELP wallarm_stalled_worker_time_seconds time a worker stalled in libproton
    # TYPE wallarm_stalled_worker_time_seconds gauge
    wallarm_stalled_worker_time_seconds{pid="3169104"} 25

    # HELP wallarm_startid unique start id
    # TYPE wallarm_startid gauge
    wallarm_startid 3226376659815907920
    ```

以下のレスポンスパラメータが利用可能です（Prometheusメトリクスには`wallarm_`プレフィックスが付きます）:

*   `requests`: フィルターノードが処理したリクエスト数。
*   `attacks`: 記録された攻撃の数。
*   `blocked`: [denylisted](../user-guides/ip-lists/overview.md)IPからのリクエストを含む、ブロックされたリクエスト数。
*   `blocked_by_acl`: [denylisted](../user-guides/ip-lists/overview.md)リクエスト元によりブロックされたリクエスト数。
*   `acl_allow_list`: [allowlisted](../user-guides/ip-lists/overview.md)リクエスト元からのリクエスト数。
*   `abnormal`: アプリケーションが異常と判断したリクエスト数。
*   `tnt_errors`: ポストアナリティクスモジュールで解析されなかったリクエスト数。これらのリクエストについては、ブロックの理由が記録されますが、統計および振る舞いのチェックには含まれません。
*   `api_errors`: APIに送信されず、さらに解析されなかったリクエスト数。これらのリクエストにはブロックパラメータが適用されます（システムがブロッキングモードの場合、悪意のあるリクエストはブロックされます）が、これらのイベントのデータはUIに表示されません。このパラメータはWallarm Nodeがローカルのポストアナリティクスモジュールと連携して動作している場合にのみ使用されます。
*   `requests_lost`: ポストアナリティクスモジュールで解析されず、APIに転送されたリクエスト数。これらのリクエストにはブロックパラメータが適用されます（システムがブロッキングモードの場合、悪意のあるリクエストはブロックされます）が、これらのイベントのデータはUIに表示されません。このパラメータはWallarm Nodeがローカルのポストアナリティクスモジュールと連携して動作している場合にのみ使用されます。
*   `overlimits_time`: フィルターノードで検出された[計算リソースの過剰制限](../attacks-vulns-list.md#resource-overlimit)タイプの攻撃の数。
*   `segfaults`: ワーカープロセスの緊急終了につながった問題の数。
*   `memfaults`: 仮想メモリの制限に達した件数。
*   `softmemfaults`: proton.db+lomの仮想メモリ制限を超えた件数（[`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)を参照）。
*   `proton_errors`: 仮想メモリ制限超過以外の理由で発生したproton.dbのエラー数。
*   `time_detect`: リクエスト解析にかかった総時間。
*   `db_id`: proton.dbのバージョン。
*   `lom_id`: 近いうちに廃止予定です。`custom_ruleset_id`をご利用ください。
*   `custom_ruleset_id`: [custom ruleset][gl-lom]のビルドバージョン。

    リリース4.8以降、Prometheus形式では`wallarm_custom_ruleset_id{format="51"} 386`として表示され、`custom_ruleset_ver`は`format`属性内に含まれ、メインの値はルールセットのビルドバージョンとなります。
*   `custom_ruleset_ver` (Wallarmリリース4.4.3以降で利用可能): [custom ruleset][gl-lom]形式:
    * `4x` - Wallarm Node 2.xの場合（[サポート対象外](../updating-migrating/versioning-policy.md#version-list)）。
    * `5x` - Wallarm Node 4.xおよび3.xの場合（後者は[サポート対象外](../updating-migrating/versioning-policy.md#version-list)）。
*   `db_apply_time`: proton.dbファイルの最終更新時刻（Unix time）。
*   `lom_apply_time`: 近いうちに廃止予定です。`custom_ruleset_apply_time`をご利用ください。
*   `custom_ruleset_apply_time`: [custom ruleset](../glossary-en.md#custom-ruleset-the-former-term-is-lom)ファイルの最終更新時刻（Unix time）。
*   `proton_instances`: ダウンロードしたproton.db+LOMペアに関する情報:
    *   `total`: ペアの総数。
    *   `success`: Wallarm Cloudから正常にダウンロードされたペアの数。
    *   `fallback`: バックアップディレクトリからダウンロードされたペアの数。これは、Cloudから最新のproton.db+LOMのダウンロードに問題が発生したが、NGINXがバックアップディレクトリから古いバージョンのproton.db+LOMを読み込んだことを示します（[`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback)が`on`に設定されている場合）。
    *   `failed`: 初期化に失敗したペアの数。NGINXがCloudまたはバックアップディレクトリのいずれからもproton.db+LOMをダウンロードできなかったことを意味します。[`wallarm_fallback`](configure-parameters-en.md#wallarm_fallback)が有効な状態でこの現象が発生した場合、Wallarmモジュールは無効になり、NGINXモジュールのみが動作します。問題の診断にはNGINXのログを確認するか、[Wallarmサポート](https://support.wallarm.com/)にお問い合わせください。
*   `stalled_workers_count`: リクエスト処理時間の制限を超えたワーカーの数（制限は[`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)ディレクティブで設定）。
*   `stalled_workers`: リクエスト処理時間の制限を超えたワーカーのリストおよびリクエスト処理に要した時間（制限は[`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout)ディレクティブで設定）。
*   `ts_files`: [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom)ファイルに関する情報:
    *   `id`: 使用したLOMのバージョン。
    *   `size`: LOMファイルのサイズ（バイト単位）。
    *   `mod_time`: LOMファイルの最終更新時刻（Unix time）。
    *   `fname`: LOMファイルへのパス。
*   `db_files`: proton.dbファイルに関する情報:
    *   `id`: 使用したproton.dbのバージョン。
    *   `size`: proton.dbファイルのサイズ（バイト単位）。
    *   `mod_time`: proton.dbファイルの最終更新時刻（Unix time）。
    *   `fname`: proton.dbファイルへのパス。
*   `startid`: フィルターノードのランダム生成されたユニークID。
*   `timestamp`: ノードが最後のリクエストを処理した時刻（[Unix Timestamp](https://www.unixtimestamp.com/)形式）。
*   `rate_limit`: Wallarmの[rate limiting](../user-guides/rules/rate-limiting.md)モジュールに関する情報:
    * `shm_zone_size`: Wallarm rate limitingモジュールが使用できる共有メモリの合計量（バイト単位）。値は[`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size)ディレクティブに基づき、デフォルトは`67108864`です。
    * `buckets_count`: バケットの数（通常はNGINXワーカー数に等しく、最大は8）。
    * `entries`: 制限を測定する対象となるユニークなリクエストポイント（キー）の数。
    * `delayed`: `burst`設定によりrate limitingモジュールによってバッファリングされたリクエスト数。
    * `exceeded`: 制限を超えたためにrate limitingモジュールによって拒否されたリクエスト数。
    * `expired`: 60秒ごとに、制限が超過されなかったキーが削除された総数。
    * `removed`: バケットから突然削除されたキーの数。`expired`より大きい場合、[`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size)の値を増加することを推奨します。
    * `no_free_nodes`: 値が`0`以外の場合、rate limitingモジュール用に割り当てられたメモリが不十分であることを示し、[`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size)の値を増加することを推奨します。
*   `split.clients`: 各[tenant](../installation/multi-tenant/overview.md)の主要統計情報。マルチテナンシー機能が有効でない場合、統計は1つのtenant（アカウント）に対して`"client_id":null`の静的値となります。
*   `split.clients.applications`: 各[application](../user-guides/settings/applications.md)の主要統計情報。このセクションに含まれないパラメータは、すべてのapplicationの統計情報を返します。

すべてのカウンターのデータはNGINX起動時から累積されます。既存のインフラストラクチャ上にWallarmがインストールされている場合、統計収集を開始するためにNGINXサーバを再起動してください。
```