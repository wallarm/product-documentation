[doc-configure-kubernetes]:     configure-kubernetes-en.ja.md
[link-prometheus]:              https://prometheus.io/
[gl-lom]:                       ../glossary-en.ja.md#custom-ruleset-the-former-term-is-lom

# 統計サービスの設定

フィルターノードに関する統計情報を取得するには、NGINX設定ファイルに記述されている `wallarm_status` ディレクティブを使用します。

## 統計サービスの設定

!!! warning "重要"
    
    統計サービスは、別々の設定ファイル `/etc/nginx/conf.d/wallarm-status.conf` に設定することを強くお勧めし、NGINXを設定する際に使用する他のファイルで `wallarm_status` ディレクティブを使用しないでください。後者は安全ではない場合があります。
    
    また、既存のデフォルト `wallarm-status` 設定ラインを変更しないことを強くお勧めします。それが Wallarm クラウドへのメトリックデータのアップロードプロセスを破損させる可能性があります。

ディレクティブを使用すると、統計情報を JSON 形式または [Prometheus][link-prometheus] と互換性のある形式で提供できます。使用法:

```
wallarm_status [on|off] [format=json|prometheus];
``` 

!!! info
    ディレクティブは、 `server` および/または `location` のコンテキストで設定できます。

    `format` パラメータのデフォルト値は `json` です。

### デフォルトの設定

デフォルトでは、フィルターノード統計サービスは最も安全な構成を持っています。 `/etc/nginx/conf.d/wallarm-status.conf` 設定ファイルは次のようになります。

```
server {
  listen 127.0.0.8:80;
  server_name localhost;

  allow 127.0.0.0/8;   # フィルタノードサーバーのループバックアドレスのみアクセス可能  
  deny all;

  wallarm_mode off;
  disable_acl "on";   # 要求元のチェックが無効になり、denylisted IPs が wallarm-status サービスをリクエストできるようになります。 https://docs.wallarm.com/admin-en/configure-parameters-en/#disable_acl
  access_log off;

  location /wallarm-status {
    wallarm_status on;
  }
}
```

### 統計情報のリクエストが許可される IP アドレスの制限

`wallarm_status` ディレクティブを設定するとき、統計情報をリクエストすることができる IP アドレスを指定できます。デフォルトでは、 `127.0.0.1` および `::1` の IP アドレスを除くどこからでもアクセスが拒否され、Wallarm がインストールされているサーバーからのみリクエストが実行できます。

別のサーバーからのリクエストを許可するには、設定で `allow` 指示を使用して、目的のサーバーの IP アドレスを追加します。例:

```diff
...
server_name localhost;

allow 127.0.0.0/8;
+ allow 10.41.29.0;
...
```

設定を変更したら、変更を適用するために NGINX を再起動します。

--8<-- "../include/waf/restart-nginx-3.6.ja.md"

### 統計サービスの IP アドレスの変更

統計サービスの IP アドレスを変更するには:

1. `/etc/nginx/conf.d/wallarm-status.conf` ファイルの `listen` ディレクティブに新しいアドレスを指定します
1. 新しいアドレス値を持つ `status_endpoint` パラメータを `/etc/wallarm/node.yaml` ファイルに追加します。例:

    ```bash
    hostname: example-node-name
    uuid: ea1xa0xe-xxxx-42a0-xxxx-b1b446xxxxxx
    ...
    status_endpoint: 'http://127.0.0.2:8082/wallarm-status'
    ```
1. [`collectd`](monitoring/intro.ja.md) 設定ファイルの `URL` パラメータをそれに応じて修正します。このファイルの場所は、あなたが持っているオペレーティングシステム配布のタイプによります:

    --8<-- "../include/monitoring/collectd-config-location.ja.md"
1. ループバックアドレス以外のアドレスからのアクセスを許可するように `allow` ディレクティブを追加または変更します(デフォルトの設定ファイルでは、ループバックアドレスのみへのアクセスが許可されています)。
1. 変更を適用するために NGINX を再起動します:

    --8<-- "../include/waf/restart-nginx-3.6.ja.md"

### Prometheus 形式で統計情報を取得する

デフォルトでは、統計情報は JSON 形式でのみ返されます。Prometheus 形式で統計情報を取得するには:

1. 以下の設定を `/etc/nginx/conf.d/wallarm-status.conf` ファイルに追加します:

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

    !!! warning "デフォルトの `/wallarm-status` 設定を削除または変更しないでください"
        `/wallarm-status` ロケーションのデフォルト設定を削除または変更しないでください。このエンドポイントのデフォルト動作は、 Wallarm Cloud に正しいデータをアップロードするために重要です。
1. 変更を適用するために NGINX を再起動します:

    --8<-- "../include/waf/restart-nginx-3.6.ja.md"
1. 新しいエンドポイントを呼び出して Prometheus のメトリックを取得します:

    ```bash
    curl http://127.0.0.8/wallarm-status-prometheus
    ```
##  Working with the Statistics Service

To obtain the filter node statistics, make a request from one of the allowed IP addresses (see above):

=== "Statistics in the JSON format"
    ```
    curl http://127.0.0.8/wallarm-status
    ```

    As a result, you will get a response of the type:

    ```
    { "requests":0,"attacks":0,"blocked":0,"blocked_by_acl":0,"acl_allow_list":0,"abnormal":0,
    "tnt_errors":0,"api_errors":0,"requests_lost":0,"overlimits_time":0,"segfaults":0,"memfaults":0,
    "softmemfaults":0,"proton_errors":0,"time_detect":0,"db_id":73,"lom_id":102,"custom_ruleset_id":102,
    "custom_ruleset_ver":51,"db_apply_time":1598525865,"lom_apply_time":1598525870,
    "custom_ruleset_apply_time":1598525870,"proton_instances": { "total":3,"success":3,"fallback":0,
    "failed":0 },"stalled_workers_count":0,"stalled_workers":[],"ts_files":[{"id":102,"size":12624136,
    "mod_time":1598525870,"fname":"\/etc\/wallarm\/custom_ruleset"}],"db_files":[{"id":73,"size":139094,
    "mod_time":1598525865,"fname":"\/etc\/wallarm\/proton.db"}],"startid":1459972331756458216,
    "timestamp":1664530105.868875,"split":{"clients":[{"client_id":null,"requests": 78,"attacks": 0,
    "blocked": 0,"blocked_by_acl": 0,"overlimits_time": 0,"time_detect": 0,"applications":
    [{"app_id":4,"requests": 78,"attacks": 0,"blocked": 0,"blocked_by_acl": 0,
    "overlimits_time": 0,"time_detect": 0}]}]} }
    ```
=== "Statistics in the Prometheus format"
    ```
    curl http://127.0.0.8/wallarm-status-prometheus
    ```

    The address can be different, please check the `/etc/nginx/conf.d/wallarm-status.conf` file for the actual address.

    As a result, you will get a response of the type:


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

The following response parameters are available (Prometheus metrics have the `wallarm_` prefix):

*   `requests`: the number of requests that have been processed by the filter node.
*   `attacks`: the number of recorded attacks.
*   `blocked`: the number of blocked requests including those originated from [denylisted](../user-guides/ip-lists/denylist.ja.md) IPs.
*   `blocked_by_acl`: the number of requests blocked due to [denylisted](../user-guides/ip-lists/denylist.ja.md) request sources.
* `acl_allow_list`: the number of requests originating by [allowlisted](../user-guides/ip-lists/allowlist.ja.md) request sources.
*   `abnormal`: the number of requests the application deems abnormal.
*   `tnt_errors`: the number of requests not analyzed by a post-analytics module. For these requests, the reasons for blocking are recorded, but the requests themselves are not counted in statistics and behavior checks.
*   `api_errors`: the number of requests that were not submitted to the API for further analysis. For these requests, blocking parameters were applied (i.e., malicious requests were blocked if the system was operating in blocking mode); however, data on these events is not visible in the UI. This parameter is only used when the Wallarm Node works with a local post-analytics module.
*   `requests_lost`: the number of requests that were not analyzed in a post-analytics module and transferred to API. For these requests, blocking parameters were applied (i.e., malicious requests were blocked if the system was operating in blocking mode); however, data on these events is not visible in the UI. This parameter is only used when the Wallarm Node works with a local post-analytics module.
*   `overlimits_time`: the number of attacks with the type [Overlimiting of computational resources](../attacks-vulns-list.ja.md#overlimiting-of-computational-resources) detected by the filtering node.
*   `segfaults`: the number of issues that led to the emergency termination of the worker process.
*   `memfaults`: the number of issues where the virtual memory limits were reached.
* `softmemfaults`: the number of issues where the virtual memory limit for proton.db +lom was exceeded ([`wallarm_general_ruleset_memory_limit`](configure-parameters-en.ja.md#wallarm_general_ruleset_memory_limit)).
* `proton_errors`: the number of the proton.db errors except for those occurred due to the situations when the virtual memory limit was exceeded.
*   `time_detect`: the total time of requests analysis.
*   `db_id`: proton.db version.
*   `lom_id`: will be deprecated soon, please use `custom_ruleset_id`.
*   `custom_ruleset_id` (in Wallarm node 3.4 and lower, `lom_id`): version of the [custom ruleset][gl-lom] build.
*   `custom_ruleset_ver` (available starting from the Wallarm release 4.4.3): the [custom ruleset][gl-lom] format:

    * `4x` - for Wallarm nodes 2.x which are [out-of-date](../updating-migrating/versioning-policy.ja.md#version-list).
    * `5x` - for Wallarm nodes 4.x and 3.x (the latter are [out-of-date](../updating-migrating/versioning-policy.ja.md#version-list)).
*   `db_apply_time`: Unix time of the last update of the proton.db file.
*   `lom_apply_time`: will be deprecated soon, please use `custom_ruleset_apply_time`.
*   `custom_ruleset_apply_time` (in Wallarm node 3.4 and lower, `lom_apply_time`): Unix time of the last update of the [custom ruleset](../glossary-en.ja.md#custom-ruleset-the-former-term-is-lom) file.
*   `proton_instances`: information about proton.db + LOM pairs:
    *   `total`: the number of proton.db + LOM pairs.
    *   `success`: the number of the successfully uploaded proton.db + LOM pairs.
    *   `fallback`: the number of proton.db + LOM pairs loaded from the last saved files.
    *   `failed`: the number of proton.db + LOM pairs that were not initialized and run in the “do not analyze” mode.
*   `stalled_workers_count`: the quantity of workers that exceeded the time limit for request processing (the limit is set in the [`wallarm_stalled_worker_timeout`](configure-parameters-en.ja.md#wallarm_stalled_worker_timeout) directive).
*   `stalled_workers`: the list of the workers that exceeded the time limit for request processing (the limit is set in the [`wallarm_stalled_worker_timeout`](configure-parameters-en.ja.md#wallarm_stalled_worker_timeout) directive) and the amount of time spent on request processing.
*   `ts_files`: information about the [LOM](../glossary-en.ja.md#custom-ruleset-the-former-term-is-lom) file:
    *   `id`: used LOM version.
    *   `size`: LOM file size in bytes.
    *   `mod_time`: Unix time of the last update of the LOM file.
    *   `fname`: path to the LOM file.
*   `db_files`: information about the proton.db file:
    *   `id`: used proton.db version.
    *   `size`: proton.db file size in bytes.
    *   `mod_time`: Unix time of the last update of the proton.db file.
    *   `fname`: path to the proton.db file.
* `startid`: randomly-generated unique ID of the filtering node.
* `timestamp`: time when the last incoming request was processed by the node (in the [Unix Timestamp](https://www.unixtimestamp.com/) format).
* `split.clients`: main statistics on each [tenant](../installation/multi-tenant/overview.ja.md). If the multitenancy feature is not activated, the statistics is returned for the only tenant (your account) with the static value `"client_id":null`.
* `split.clients.applications`: main statistics on each [application](../user-guides/settings/applications.ja.md). Parameters that are not included into this section returns the statistics on all applications.

The data of all counters is accumulated from the moment NGINX is started. If Wallarm has been installed in a ready-made infrastructure with NGINX, the NGINX server must be restarted to start statistics collection.
