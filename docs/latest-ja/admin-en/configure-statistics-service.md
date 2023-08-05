[doc-configure-kubernetes]:     configure-kubernetes-en.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.md#custom-ruleset-the-former-term-is-lom

# 統計サービスの設定

フィルタノードに関する統計情報を取得するには、NGINXの設定ファイルで記述された `wallarm_status` ディレクティブを使用します。

## 統計サービスの設定

!!! warning "重要"

    統計サービスの設定を `/etc/nginx/conf.d/wallarm-status.conf` という別の設定ファイルで行い、NGINXの設定に使用されている他のファイルで `wallarm_status` ディレクティブを使用しないことを強く推奨します。なぜなら、後者はセキュリティ上問題がある可能性があります。

    また、デフォルトの `wallarm-status` 設定の既存の行を変更しないことを強く推奨します。これは、メトリックデータのアップロードプロセスをWallarmクラウドに壊す可能性があります。

ディレクティブを使用して、統計はJSON形式或いは[Prometheus][link-prometheus]と互換性のある形式で提供することができます。使用法:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    ディレクティブは、 `server` 及び/または `location` のコンテキストで設定することができます。

    `format` パラメータのデフォルト値は、`json`です。

### デフォルトの設定

デフォルトでは、フィルタノード統計サービスは最も安全な設定になっています。 `/etc/nginx/conf.d/wallarm-status.conf` 設定ファイルは次のようになります :

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # フィルタノードサーバーのループバックアドレスのみアクセス可能   
  deny all;

  wallarm_mode off;
  disable_acl "on";   # リクエストソースのチェックは無効、denylistedのIPはwallarm-statusサービスのリクエストを許可します。https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### 統計のリクエストが許可されるIPアドレスの制限

`wallarm_status` ディレクティブを設定する際に、どのIPアドレスから統計情報をリクエストすることができるかを指定することができます。デフォルトでは、Wallarmがインストールされているサーバーからのみリクエストを実行することを許可する `127.0.0.1` および `::1` のIPアドレスを除き、どこからでもアクセスが拒否されます。

他のサーバーからのリクエストを許可するには、設定内で望むサーバーのIPアドレスを持つ `allow` 指示を追加します。例 :

```diff
...
server_name localhost;

allow 127.0.0.0/8;
+ allow 10.41.29.0;
...
```

設定が変更されたら、変更を適用するためにNGINXを再起動します:

--8<-- "../include/waf/restart-nginx-3.6.md"

### 統計サービスのIPアドレスを変更する

統計サービスのIPアドレスを変更するには :

1. `/etc/nginx/conf.d/wallarm-status.conf` ファイルの `listen` ディレクティブで新しいアドレスを指定します。
1. `/etc/wallarm/node.yaml` ファイルに新しいアドレス値を持つ `status_endpoint` パラメータを追加します。例 :

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. [`collectd`](monitoring/intro.md)設定ファイルの `URL` パラメータを適宜修正します。このファイルの場所は、あなたが持っているオペレーティングシステムの分布型によります :

    --8<-- "../include/monitoring/collectd-config-location.md"
1. ループバックアドレス以外のアドレスからのアクセスを許可するために `allow` ディレクティブを追加または変更します (デフォルトの設定ファイルは、ループバックアドレスのみにアクセスを許可します) 。
1. 変更を適用するためにNGINXを再起動します :

    --8<-- "../include/waf/restart-nginx-3.6.md"

### Prometheus形式で統計情報を取得する

デフォルトでは、統計情報はJSON形式でのみ返されます。 Prometheus形式で統計情報を取得するには :

1. `/etc/nginx/conf.d/wallarm-status.conf` ファイルに以下の設定を追加します:


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

    !!! warning "デフォルトの ` /wallarm-status` 設定を削除または変更しないでください"
        `/wallarm-status` ロケーションのデフォルト設定を削除または変更しないでください。このエンドポイントのデフォルトの動作は、Wallarmクラウドへの正しいデータのアップロードにとって重要です。
1. 変更を適用するためにNGINXを再起動します :

    --8<-- "../include/waf/restart-nginx-3.6.md"
1. 新しいエンドポイントを呼び出して、Prometheusメトリクスを取得します:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

##  統計サービスとの連携

フィルタノードの統計情報を取得するには、許可されたIPアドレスの一つからリクエストを行います（上記参照） :

=== "JSON形式での統計情報"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    結果として、以下のタイプのレスポンスが得られます :

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

    アドレスは異なる場合があります、実際のアドレスについては `/etc/nginx/conf.d/wallarm-status.conf` ファイルを確認してください。

    結果として、以下のタイプのレスポンスが得られます :


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
    wallarm_custom_ruleset_id 386
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

    # HELP wallarm_startid unique start id
    # TYPE wallarm_startid gauge
    wallarm_startid 3226376659815907920
    ```

以下のレスポンスパラメータが利用可能です ( Promethusのメトリクスは `wallarm_` というプレフィックスを持ちます ) :

*   `requests` : フィルタノードで処理されたリクエスト数。
*   `attacks` : 収録された攻撃の数。
*   `blocked` : [denylisted](../user-guides/ip-lists/denylist.md) IPから発生したものを含むブロックされたリクエストの数。
*   `blocked_by_acl` : [denylisted](../user-guides/ip-lists/denylist.md) リクエストソースによりブロックされたリクエストの数。
* `acl_allow_list` : [allowlisted](../user-guides/ip-lists/allowlist.md) リクエストソースによるリクエストの数。
*   `abnormal` : アプリケーションが異常と判断したリクエストの数。
*   `tnt_errors` : post- analyticsモジュールで分析されていないリクエストの数。これらのリクエストは、ブロックの理由が記録されるが、これら自体は統計に計上されず、行動チェックも行われません。
*   `api_errors` : これらのリクエストは、API によるさらなる分析が行われませんでした。これらのリクエストに対して、ブロックパラメータが適用されました (つまり、システムがブロックモードで動作している場合、悪意のあるリクエストはブロックされます) ；しかし、これらのイベントに関するデータは UI で見ることができません。このパラメータは、Wallarm Node がローカルの post-analytics モジュールで動作する場合にのみ使用されます。
*   `requests_lost` : post-analyticsモジュールで分析されず、APIに転送されなかったリクエストの数。これらのリクエストに対して、ブロックパラメータが適用されました (つまり、システムがブロックモードで動作している場合、悪意のあるリクエストはブロックされます) ；しかし、これらのイベントに関するデータは UI で見ることができません。このパラメータは、Wallarm Nodeがローカルのpost-analytics moduleで動作するときのみ使用されます。
*   `overlimits_time` : フィルタノードによって検出された [計算リソースの過剰制限](../attacks-vulns-list.md#overlimiting-of-computational-resources) タイプの攻撃の数。
*   `segfaults` : ワーカープロセスが緊急停止した問題の数。
*   `memfaults` : 仮想メモリの制限に達した問題の数。
* `softmemfaults` : 仮想メモリの制限がproton.db +lomを超えた問題の数 ([`wallarm_general_ruleset_memory_limit`](configure-parameters-en.md#wallarm_general_ruleset_memory_limit)) 登録商標。
* `proton_errors` : 仮想メモリ制限超過状況により発生したものを除く proton.db のエラーの数。
*   `time_detect` : リクエスト分析の全時間。
*   `db_id` : proton.dbバージョン。
*   `lom_id` : すぐに非推奨となる予定です、`custom_ruleset_id` を使用してください。
*   `custom_ruleset_id` : [custom ruleset][gl-lom] のビルドのバージョン。
*   `custom_ruleset_ver` (Wallarmリリース4.4.3から使用可能) : [custom ruleset][gl-lom] 形式 :

    * `4x` - バージョン2.xの Wallarm ノード用、これらは [旧バージョン](../updating-migrating/versioning-policy.md#version-list) です。
    * `5x` - バージョン4.xおよび3.xの Wallarm ノード用、後者は [旧バージョン](../updating-migrating/versioning-policy.md#version-list) です。
*   `db_apply_time` : proton.dbファイルの最終更新の Unix 時間。
*   `lom_apply_time` : すぐに非推奨となる予定です、`custom_ruleset_apply_time`を使用してください。
*   `custom_ruleset_apply_time` : [custom ruleset](../glossary-en.md#custom-ruleset-the-former-term-is-lom)文件の最終更新的 Unix时间。
*   `proton_instances` : proton.db + LOMペアに関する情報 :
    *   `total` : proton.db + LOMペアの数。
    *   `success` : 成功したproton.db + LOMペアの数。
    *   `fallback` : 最後に保存したファイルからロードされた proton.db + LOMペアの数。
    *   `failed` : 初期化されず、 "解析しない" モードで実行された proton.db + LOMペアの数。
*   `stalled_workers_count` : リクエスト処理の時間制限を超えたワーカーの数量 (制限は [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) ディレクティブで設定されます。
*   `stalled_workers` : リクエスト処理の時間制限を超えたワーカーのリスト (制限は [`wallarm_stalled_worker_timeout`](configure-parameters-en.md#wallarm_stalled_worker_timeout) ディレクティブで設定されます)とリクエスト処理に費やした時間の量。
*   `ts_files` : [LOM](../glossary-en.md#custom-ruleset-the-former-term-is-lom) ファイルに関する情報 :
    *   `id` : 使用されたLOMバージョン。
    *   `size` : LOMファイルのバイト単位のサイズ。
    *   `mod_time` : LOMファイルの最終更新のUnix時間。
    *   `fname` : LOMファイルへのパス。
*   `db_files` : proton.dbファイルに関する情報 :
    *   `id` : 使用されているproton.dbバージョン。
    *   `size` : proton.dbファイルのバイト単位のサイズ。
    *   `mod_time` : proton.db ファイルの最終更新の Unix 時間。
    *   `fname` : proton.dbファイルへのパス。
* `startid` : フィルタノードのランダムに生成された一意のID。
* `timestamp` : ノードによって処理された最後の入力リクエストの時間 ( [Unix Timestamp](https://www.unixtimestamp.com/) フォーマット ) 。
* `rate_limit` : Wallarm [rate limiting](../user-guides/rules/rate-limiting.md) モジュールに関する情報:
    * `shm_zone_size` : Wallarm レート制限モジュールが消費できる共有メモリの総量をバイト単位で表示 ( これは [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) ディレクティブに基づいていて、デフォルトは `67108864` ) 。
    * `buckets_count` : バケツの数 ( 通常、 NGINXのワーカー数と等しい、最大は8 ) 。
    * `entries` : 制限を測定するための一意のリクエストポイント値 ( いわゆるキー )の数 。
    * `delayed` : `burst` 設定によりレート制限モジュールがバッファリングしたリクエストの数。
    * `exceeded` : レート制限モジュールによりリクーが制限を超えたためにリジェクトされたリクエストの数。
    * `expired` : そのキーのレート制限が超過されなかった場合に、定期的に60秒ごとにバケツから削除されるキーの合計数。
    * `removed` : バケットから急激に削除されたキーの数。この値が `expired` を上回っている場合は、 [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) の値を増やしてください。
    * `no_free_nodes` : `0` 以外の値は、レート制限モジュール用に割り当てられたメモリが不足していることを示しており、 [`wallarm_rate_limit_shm_size`](configure-parameters-en.md#wallarm_rate_limit_shm_size) の値を増やすことが推奨されます。
* `split.clients` : 各 [テナント](../installation/multi-tenant/overview.md) に関する主要な統計情報。マルチテナンシー機能がアクティブ化されていない場合は、唯一のテナント (ご自身のアカウント) の統計情報が静的に返されるため `"client_id":null` を返します。
* `split.clients.applications` : 各 [アプリケーション](../user-guides/settings/applications.md) の主要な統計情報。ここに含まれていないパラメータはすべてのアプリケーションの統計情報を返します。

全てのカウンターのデータは、NGINXが起動された時点から蓄積されます。Wallarmは既存のインフラストラクチャでNGINXとともにインストールされている場合、統計収集を開始するためにNGINXサーバーを再起動する必要があります。