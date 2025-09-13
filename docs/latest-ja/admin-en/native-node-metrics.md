# Native Nodeメトリクスの監視

[Native Node](../installation/nginx-native-node-internals.md#native-node)は[Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/)形式でメトリクスを公開し、パフォーマンス、トラフィック、検出された攻撃を監視できるようにします。このガイドでは、これらのメトリクスへのアクセス方法と解釈方法を説明します。

## メトリクスへのアクセス

デフォルトでは、Nodeは次のエンドポイントでメトリクスを提供します:

```bash
http://<NODE_IP>:9000/metrics
```

メトリクスエンドポイントへアクセスするには:

* **Dockerまたは仮想マシン** - ファイアウォールでポート`9000`を開放するか、Dockerの`-p 9000:9000`で公開します。

    メトリクスのポートとパスは[`metrics.*`](../installation/native-node/all-in-one-conf.md#metricsenabled)パラメータで変更できます。
* **Kubernetes** - ローカルにポートを転送するために`kubectl port-forward`コマンドを使用します。例:

    ```bash
    kubectl port-forward svc/<NODE-SERVICE-NAME> 9000:9000 -n <NAMESPACE>
    ```

    メトリクスのポートとパスは[`processing.metrics.*`](../installation/native-node/helm-chart-conf.md#processingmetricsenabled)パラメータで変更できます。

## 利用可能なメトリクス

以下のPrometheusメトリクス群が利用できます。各メトリクスには、その目的を詳しく説明する`HELP`メッセージが含まれます。

メトリクスの正確な一覧はNative Nodeのバージョンによって異なる場合があります。変更点は[Native Nodeの変更履歴](../updating-migrating/native-node/node-artifact-versions.md)に反映されます。

### `wallarm_gonode_application_*`

Nodeインスタンスに関する一般情報を提供します。バージョン、デプロイタイプ、モード、設定リロードの統計を含みます。

### `wallarm_gonode_files_*`, `wallarm_gonode_http_inspector_ruleset_*`

適用された設定およびルールセットファイルの詳細を含みます。フォーマットおよびコンテンツのバージョン、最終更新タイムスタンプを示します。

### `wallarm_gonode_go_*`, `wallarm_gonode_process_*`

標準的なプロセスおよびGoランタイムのメトリクスです。リソース使用状況(CPU、メモリ、ネットワーク)やガーベジコレクタの統計を含みます。

### `wallarm_gonode_http_connector_*`

connector serverコンポーネントに関するメトリクスで、リクエスト処理、ブロック/バイパスされたリクエスト、エラーカウンタ、レイテンシを網羅します。

### `wallarm_gonode_http_inspector_*`

HTTP inspectorからの詳細な統計を提供します。処理されたリクエストとレスポンス、検出およびブロックされた攻撃、内部パイプラインの各種メトリクスを含みます。

### `wallarm_gonode_postanalytics_*`

postanalyticsサービス(wstore)へのデータエクスポートに関するメトリクスを含みます。エクスポート済みリクエスト、エラー、postanalyticsノードへのアクティブ接続などを含みます。

## メトリクス出力の例

以下はメトリクスエンドポイントからのレスポンス例です:

```{.bash .prom-metrics-output}
# HELP wallarm_gonode_application_config_reload_errors_total 設定のリロード中に発生したエラーの総数です
# TYPE wallarm_gonode_application_config_reload_errors_total counter
wallarm_gonode_application_config_reload_errors_total 0
# HELP wallarm_gonode_application_config_reloads_total 設定のリロード回数の総数です
# TYPE wallarm_gonode_application_config_reloads_total counter
wallarm_gonode_application_config_reloads_total 0
# HELP wallarm_gonode_application_info アプリケーション情報です。'version'、'mode'ラベルを参照してください。
# TYPE wallarm_gonode_application_info gauge
wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1-rc4"} 1
# HELP wallarm_gonode_files_apply_timestamp_seconds 各種ファイルが適用された時刻のタイムスタンプです。'file'ラベルを参照してください。
# TYPE wallarm_gonode_files_apply_timestamp_seconds gauge
wallarm_gonode_files_apply_timestamp_seconds{file="custom_ruleset"} 1.753986724e+09
wallarm_gonode_files_apply_timestamp_seconds{file="proton.db"} 1.753986724e+09
# HELP wallarm_gonode_files_content_version 各種ファイルのコンテンツバージョンです。'file'ラベルを参照してください。
# TYPE wallarm_gonode_files_content_version gauge
wallarm_gonode_files_content_version{file="custom_ruleset"} 1938
wallarm_gonode_files_content_version{file="proton.db"} 215
# HELP wallarm_gonode_files_format_version 各種ファイルのフォーマットバージョンです。'file'ラベルを参照してください。
# TYPE wallarm_gonode_files_format_version gauge
wallarm_gonode_files_format_version{file="custom_ruleset"} 58
wallarm_gonode_files_format_version{file="proton.db"} 10
# HELP wallarm_gonode_go_gc_duration_seconds ガーベジコレクションサイクルにおけるウォールタイム停止(stop-the-world)時間のサマリです。
# TYPE wallarm_gonode_go_gc_duration_seconds summary
wallarm_gonode_go_gc_duration_seconds{quantile="0"} 5.4205e-05
wallarm_gonode_go_gc_duration_seconds{quantile="0.25"} 6.0421e-05
wallarm_gonode_go_gc_duration_seconds{quantile="0.5"} 6.5876e-05
wallarm_gonode_go_gc_duration_seconds{quantile="0.75"} 0.000109397
wallarm_gonode_go_gc_duration_seconds{quantile="1"} 0.00016074
wallarm_gonode_go_gc_duration_seconds_sum 0.000900882
wallarm_gonode_go_gc_duration_seconds_count 11
# HELP wallarm_gonode_go_gc_gogc_percent ユーザーが設定したヒープサイズ目標の割合で、設定がなければ100です。この値は環境変数GOGCおよびruntime/debug.SetGCPercent関数で設定されます。情報源は/gc/gogc:percentです。
# TYPE wallarm_gonode_go_gc_gogc_percent gauge
wallarm_gonode_go_gc_gogc_percent 100
# HELP wallarm_gonode_go_gc_gomemlimit_bytes ユーザーが設定したGoランタイムのメモリ制限で、設定がなければmath.MaxInt64です。この値は環境変数GOMEMLIMITおよびruntime/debug.SetMemoryLimit関数で設定されます。情報源は/gc/gomemlimit:bytesです。
# TYPE wallarm_gonode_go_gc_gomemlimit_bytes gauge
wallarm_gonode_go_gc_gomemlimit_bytes 9.223372036854776e+18
# HELP wallarm_gonode_go_goroutines 現在存在するgoroutineの数です。
# TYPE wallarm_gonode_go_goroutines gauge
wallarm_gonode_go_goroutines 39
# HELP wallarm_gonode_go_info Go環境に関する情報です。
# TYPE wallarm_gonode_go_info gauge
wallarm_gonode_go_info{version="go1.24.5"} 1
# HELP wallarm_gonode_go_memstats_alloc_bytes ヒープに割り当てられ現在使用中のバイト数です。/memory/classes/heap/objects:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_alloc_bytes gauge
wallarm_gonode_go_memstats_alloc_bytes 9.302008e+06
# HELP wallarm_gonode_go_memstats_alloc_bytes_total これまでにヒープに割り当てられた総バイト数で、既に解放されたものも含みます。/gc/heap/allocs:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_alloc_bytes_total counter
wallarm_gonode_go_memstats_alloc_bytes_total 5.7922512e+07
# HELP wallarm_gonode_go_memstats_buck_hash_sys_bytes プロファイリングのバケットハッシュテーブルが使用するバイト数です。/memory/classes/profiling/buckets:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_buck_hash_sys_bytes gauge
wallarm_gonode_go_memstats_buck_hash_sys_bytes 91305
# HELP wallarm_gonode_go_memstats_frees_total ヒープオブジェクトの解放総数です。/gc/heap/frees:objects + /gc/heap/tiny/allocs:objectsに等しいです。
# TYPE wallarm_gonode_go_memstats_frees_total counter
wallarm_gonode_go_memstats_frees_total 625423
# HELP wallarm_gonode_go_memstats_gc_sys_bytes ガーベジコレクションのシステムメタデータに使用されるバイト数です。/memory/classes/metadata/other:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_gc_sys_bytes gauge
wallarm_gonode_go_memstats_gc_sys_bytes 3.494312e+06
# HELP wallarm_gonode_go_memstats_heap_alloc_bytes ヒープで割り当てられ現在使用中のバイト数で、go_memstats_alloc_bytesと同じです。/memory/classes/heap/objects:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_heap_alloc_bytes gauge
wallarm_gonode_go_memstats_heap_alloc_bytes 9.302008e+06
# HELP wallarm_gonode_go_memstats_heap_idle_bytes 使用待ちのヒープバイト数です。/memory/classes/heap/released:bytes + /memory/classes/heap/free:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_heap_idle_bytes gauge
wallarm_gonode_go_memstats_heap_idle_bytes 4.374528e+06
# HELP wallarm_gonode_go_memstats_heap_inuse_bytes 使用中のヒープバイト数です。/memory/classes/heap/objects:bytes + /memory/classes/heap/unused:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_heap_inuse_bytes gauge
wallarm_gonode_go_memstats_heap_inuse_bytes 1.1321344e+07
# HELP wallarm_gonode_go_memstats_heap_objects 現在割り当てられているオブジェクト数です。/gc/heap/objects:objectsに等しいです。
# TYPE wallarm_gonode_go_memstats_heap_objects gauge
wallarm_gonode_go_memstats_heap_objects 56658
# HELP wallarm_gonode_go_memstats_heap_released_bytes OSに解放されたヒープバイト数です。/memory/classes/heap/released:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_heap_released_bytes gauge
wallarm_gonode_go_memstats_heap_released_bytes 2.29376e+06
# HELP wallarm_gonode_go_memstats_heap_sys_bytes システムから取得したヒープバイト数です。/memory/classes/heap/objects:bytes + /memory/classes/heap/unused:bytes + /memory/classes/heap/released:bytes + /memory/classes/heap/free:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_heap_sys_bytes gauge
wallarm_gonode_go_memstats_heap_sys_bytes 1.5695872e+07
# HELP wallarm_gonode_go_memstats_last_gc_time_seconds 最後のガーベジコレクションが発生した時刻の1970年からの経過秒数です。
# TYPE wallarm_gonode_go_memstats_last_gc_time_seconds gauge
wallarm_gonode_go_memstats_last_gc_time_seconds 1.7539879135438237e+09
# HELP wallarm_gonode_go_memstats_mallocs_total 割り当てられたヒープオブジェクトの総数で、存続中とGC済みの両方を含みます。意味的にはgo_memstats_heap_objectsゲージのカウンタ版です。/gc/heap/allocs:objects + /gc/heap/tiny/allocs:objectsに等しいです。
# TYPE wallarm_gonode_go_memstats_mallocs_total counter
wallarm_gonode_go_memstats_mallocs_total 682081
# HELP wallarm_gonode_go_memstats_mcache_inuse_bytes mcache構造体が使用中のバイト数です。/memory/classes/metadata/mcache/inuse:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_mcache_inuse_bytes gauge
wallarm_gonode_go_memstats_mcache_inuse_bytes 2416
# HELP wallarm_gonode_go_memstats_mcache_sys_bytes システムから取得したmcache構造体用のバイト数です。/memory/classes/metadata/mcache/inuse:bytes + /memory/classes/metadata/mcache/free:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_mcache_sys_bytes gauge
wallarm_gonode_go_memstats_mcache_sys_bytes 15704
# HELP wallarm_gonode_go_memstats_mspan_inuse_bytes mspan構造体が使用中のバイト数です。/memory/classes/metadata/mspan/inuse:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_mspan_inuse_bytes gauge
wallarm_gonode_go_memstats_mspan_inuse_bytes 138400
# HELP wallarm_gonode_go_memstats_mspan_sys_bytes システムから取得したmspan構造体用のバイト数です。/memory/classes/metadata/mspan/inuse:bytes + /memory/classes/metadata/mspan/free:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_mspan_sys_bytes gauge
wallarm_gonode_go_memstats_mspan_sys_bytes 163200
# HELP wallarm_gonode_go_memstats_next_gc_bytes 次回のガーベジコレクションが発生するヒープバイト数です。/gc/heap/goal:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_next_gc_bytes gauge
wallarm_gonode_go_memstats_next_gc_bytes 1.8470754e+07
# HELP wallarm_gonode_go_memstats_other_sys_bytes その他のシステム割り当てに使用されるバイト数です。/memory/classes/other:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_other_sys_bytes gauge
wallarm_gonode_go_memstats_other_sys_bytes 540825
# HELP wallarm_gonode_go_memstats_stack_inuse_bytes 非CGO環境におけるスタックアロケータ用にシステムから取得されたバイト数です。/memory/classes/heap/stacks:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_stack_inuse_bytes gauge
wallarm_gonode_go_memstats_stack_inuse_bytes 1.081344e+06
# HELP wallarm_gonode_go_memstats_stack_sys_bytes スタックアロケータ用にシステムから取得されたバイト数です。/memory/classes/heap/stacks:bytes + /memory/classes/os-stacks:bytesに等しいです。
# TYPE wallarm_gonode_go_memstats_stack_sys_bytes gauge
wallarm_gonode_go_memstats_stack_sys_bytes 1.081344e+06
# HELP wallarm_gonode_go_memstats_sys_bytes システムから取得したバイト数です。/memory/classes/total:byteに等しいです。
# TYPE wallarm_gonode_go_memstats_sys_bytes gauge
wallarm_gonode_go_memstats_sys_bytes 2.1082562e+07
# HELP wallarm_gonode_go_sched_gomaxprocs_threads 現在のruntime.GOMAXPROCS設定、または同時にユーザーレベルのGoコードを実行できるOSスレッド数です。情報源は/sched/gomaxprocs:threadsです。
# TYPE wallarm_gonode_go_sched_gomaxprocs_threads gauge
wallarm_gonode_go_sched_gomaxprocs_threads 2
# HELP wallarm_gonode_go_threads 作成されたOSスレッド数です。
# TYPE wallarm_gonode_go_threads gauge
wallarm_gonode_go_threads 11
# HELP wallarm_gonode_http_connector_server_avg_latency_ms このノードで処理されたリクエストの平均レイテンシです
# TYPE wallarm_gonode_http_connector_server_avg_latency_ms gauge
wallarm_gonode_http_connector_server_avg_latency_ms 0.819581
# HELP wallarm_gonode_http_connector_server_debug_container_len 現在の各種内部データ構造内のアイテム数です。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_connector_server_debug_container_len gauge
wallarm_gonode_http_connector_server_debug_container_len{type="map:activeRequests"} 0
wallarm_gonode_http_connector_server_debug_container_len{type="map:requestWaitMap"} 0
wallarm_gonode_http_connector_server_debug_container_len{type="map:responseWaitMap"} 0
# HELP wallarm_gonode_http_connector_server_errors_total 各種エラーカウンタです。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_connector_server_errors_total counter
wallarm_gonode_http_connector_server_errors_total{type="DroppedOnOverload"} 0
wallarm_gonode_http_connector_server_errors_total{type="DuplicateReqId"} 0
wallarm_gonode_http_connector_server_errors_total{type="MsgDataFormat"} 0
wallarm_gonode_http_connector_server_errors_total{type="MsgType"} 0
wallarm_gonode_http_connector_server_errors_total{type="MsgpackDataFormat"} 0
wallarm_gonode_http_connector_server_errors_total{type="MsgpackDecode"} 0
wallarm_gonode_http_connector_server_errors_total{type="NilBody"} 0
wallarm_gonode_http_connector_server_errors_total{type="ReqBodyReading"} 0
wallarm_gonode_http_connector_server_errors_total{type="RespBodyReading"} 0
# HELP wallarm_gonode_http_connector_server_messages_processed_total 正常に処理されたメッセージの総数です。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_connector_server_messages_processed_total counter
wallarm_gonode_http_connector_server_messages_processed_total{type="request"} 3
wallarm_gonode_http_connector_server_messages_processed_total{type="response"} 0
# HELP wallarm_gonode_http_connector_server_messages_rejected_total connector serverがさまざまな理由で拒否したメッセージの総数です。'reason'ラベルを参照してください。
# TYPE wallarm_gonode_http_connector_server_messages_rejected_total counter
wallarm_gonode_http_connector_server_messages_rejected_total{reason="connector_info"} 3
wallarm_gonode_http_connector_server_messages_rejected_total{reason="host"} 0
wallarm_gonode_http_connector_server_messages_rejected_total{reason="remote_address"} 0
# HELP wallarm_gonode_http_connector_server_messages_seen_total connector serverが受け取ったメッセージの総数です。'type'ラベルを参照してください。'total'タイプには、拒否、処理、転送、エラーなどすべてが含まれます。
# TYPE wallarm_gonode_http_connector_server_messages_seen_total counter
wallarm_gonode_http_connector_server_messages_seen_total{type="health"} 0
wallarm_gonode_http_connector_server_messages_seen_total{type="request"} 3
wallarm_gonode_http_connector_server_messages_seen_total{type="response"} 0
wallarm_gonode_http_connector_server_messages_seen_total{type="total"} 6
# HELP wallarm_gonode_http_connector_server_requests_blocked_total Wallarmによってブロックされたリクエスト数です
# TYPE wallarm_gonode_http_connector_server_requests_blocked_total counter
wallarm_gonode_http_connector_server_requests_blocked_total 0
# HELP wallarm_gonode_http_connector_server_requests_bypassed_total 検査されなかったリクエストです。'reason'ラベルを参照してください。
# TYPE wallarm_gonode_http_connector_server_requests_bypassed_total counter
wallarm_gonode_http_connector_server_requests_bypassed_total{reason="input_filters"} 0
wallarm_gonode_http_connector_server_requests_bypassed_total{reason="mode_off"} 0
# HELP wallarm_gonode_http_connector_server_responses_bypassed_total 検査されなかったレスポンス数です
# TYPE wallarm_gonode_http_connector_server_responses_bypassed_total counter
wallarm_gonode_http_connector_server_responses_bypassed_total 0
# HELP wallarm_gonode_http_connector_server_step_container_is_overloaded アプリが受信より速くデータを処理している場合、コンテナは過負荷ではありません。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_connector_server_step_container_is_overloaded gauge
wallarm_gonode_http_connector_server_step_container_is_overloaded{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_connector_server_step_debug_container_len 現在の各種内部データ構造内のアイテム数です。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_connector_server_step_debug_container_len gauge
wallarm_gonode_http_connector_server_step_debug_container_len{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_connector_server_step_is_running このパイプラインステップが現在実行中(1)か停止中(0)かを示すフラグです。
# TYPE wallarm_gonode_http_connector_server_step_is_running gauge
wallarm_gonode_http_connector_server_step_is_running 1
# HELP wallarm_gonode_http_connector_server_step_output_messages_total このパイプラインステップの出力メッセージ総数です。'msgtype'、'receiver'、'dropped'ラベルを参照してください。
# TYPE wallarm_gonode_http_connector_server_step_output_messages_total counter
wallarm_gonode_http_connector_server_step_output_messages_total{dropped="false",msgtype="MsgHTTP",reciever="0"} 18
wallarm_gonode_http_connector_server_step_output_messages_total{dropped="true",msgtype="MsgHTTP",reciever="0"} 0
# HELP wallarm_gonode_http_inspector_acl_results_per_app_total ACL結果のカウンタです。'list'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_acl_results_per_app_total counter
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="black"} 0
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="grey"} 0
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="none"} 0
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="white"} 0
# HELP wallarm_gonode_http_inspector_acl_results_per_host_total ACL結果のカウンタです。'list'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_acl_results_per_host_total counter
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="black"} 0
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="grey"} 0
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="none"} 0
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="white"} 0
# HELP wallarm_gonode_http_inspector_acl_results_total ACL結果のカウンタです。'list'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_acl_results_total counter
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="black"} 0
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="grey"} 0
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="none"} 0
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="white"} 0
# HELP wallarm_gonode_http_inspector_adjusted_counters_per_app_total 調整済みカウンタです。調整済みレガシーカウンタに対応します。'type'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_adjusted_counters_per_app_total counter
wallarm_gonode_http_inspector_adjusted_counters_per_app_total{aggregate="sum",application_id="-1",type="attacks"} 0
wallarm_gonode_http_inspector_adjusted_counters_per_app_total{aggregate="sum",application_id="-1",type="requests"} 3
# HELP wallarm_gonode_http_inspector_adjusted_counters_per_host_total 調整済みカウンタです。調整済みレガシーカウンタに対応します。'type'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_adjusted_counters_per_host_total counter
wallarm_gonode_http_inspector_adjusted_counters_per_host_total{aggregate="sum",host="",type="attacks"} 0
wallarm_gonode_http_inspector_adjusted_counters_per_host_total{aggregate="sum",host="",type="requests"} 3
# HELP wallarm_gonode_http_inspector_adjusted_counters_total 調整済みカウンタです。調整済みレガシーカウンタに対応します。'type'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_adjusted_counters_total counter
wallarm_gonode_http_inspector_adjusted_counters_total{aggregate="sum",type="attacks"} 0
wallarm_gonode_http_inspector_adjusted_counters_total{aggregate="sum",type="requests"} 3
# HELP wallarm_gonode_http_inspector_adjusted_requests_per_period 直近の期間における調整済みリクエストの量です。'period'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_adjusted_requests_per_period gauge
wallarm_gonode_http_inspector_adjusted_requests_per_period{aggregate="sum",period="1m"} 0
wallarm_gonode_http_inspector_adjusted_requests_per_period{aggregate="sum",period="1s"} 0
# HELP wallarm_gonode_http_inspector_balancer_container_is_overloaded アプリが受信より速くデータを処理している場合、コンテナは過負荷ではありません。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_inspector_balancer_container_is_overloaded gauge
wallarm_gonode_http_inspector_balancer_container_is_overloaded{type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_balancer_debug_container_len 現在の各種内部データ構造内のアイテム数です。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_inspector_balancer_debug_container_len gauge
wallarm_gonode_http_inspector_balancer_debug_container_len{type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_balancer_dropped_total drop_percent設定パラメータが0以外のためにドロップされた入力メッセージです。
# TYPE wallarm_gonode_http_inspector_balancer_dropped_total counter
wallarm_gonode_http_inspector_balancer_dropped_total 0
# HELP wallarm_gonode_http_inspector_balancer_workers ワーカー数です。
# TYPE wallarm_gonode_http_inspector_balancer_workers gauge
wallarm_gonode_http_inspector_balancer_workers 2
# HELP wallarm_gonode_http_inspector_bytes_processed_per_app_total 処理されたバイト数です。実際に通信で流れたバイト数と厳密に一致するわけではありません。'type'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_bytes_processed_per_app_total counter
wallarm_gonode_http_inspector_bytes_processed_per_app_total{aggregate="sum",application_id="-1",type="request"} 138
wallarm_gonode_http_inspector_bytes_processed_per_app_total{aggregate="sum",application_id="-1",type="response"} 0
# HELP wallarm_gonode_http_inspector_bytes_processed_per_host_total 処理されたバイト数です。実際に通信で流れたバイト数と厳密に一致するわけではありません。'type'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_bytes_processed_per_host_total counter
wallarm_gonode_http_inspector_bytes_processed_per_host_total{aggregate="sum",host="",type="request"} 138
wallarm_gonode_http_inspector_bytes_processed_per_host_total{aggregate="sum",host="",type="response"} 0
# HELP wallarm_gonode_http_inspector_bytes_processed_per_period 直近の期間に処理されたバイト数です。'period'および'type'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_bytes_processed_per_period gauge
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1m",type="request"} 0
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1m",type="response"} 0
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1s",type="request"} 0
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1s",type="response"} 0
# HELP wallarm_gonode_http_inspector_bytes_processed_total 処理されたバイト数です。実際に通信で流れたバイト数と厳密に一致するわけではありません。'type'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_bytes_processed_total counter
wallarm_gonode_http_inspector_bytes_processed_total{aggregate="sum",type="request"} 138
wallarm_gonode_http_inspector_bytes_processed_total{aggregate="sum",type="response"} 0
# HELP wallarm_gonode_http_inspector_container_is_overloaded アプリが受信より速くデータを処理している場合、コンテナは過負荷ではありません。'type'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_container_is_overloaded gauge
wallarm_gonode_http_inspector_container_is_overloaded{aggregate="max",type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_debug_container_len 現在の各種内部データ構造内のアイテム数です。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_inspector_debug_container_len gauge
wallarm_gonode_http_inspector_debug_container_len{aggregate="avg",type="channel:in"} 0
wallarm_gonode_http_inspector_debug_container_len{aggregate="max",type="channel:in"} 0
wallarm_gonode_http_inspector_debug_container_len{aggregate="min",type="channel:in"} 0
wallarm_gonode_http_inspector_debug_container_len{aggregate="sum",type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_errors_total 各種エラーカウンタです。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_inspector_errors_total counter
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="AclErrors"} 3
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="ApifwErrors"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="ErrorCreatingFlow"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="ErrorSerializingReq"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowAlreadyExists"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowIsMissing"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowIsMissingRequest"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowIsMissingResponse"} 3
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowIsNotClosed"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="FlowTimeouts"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="LeakedHandleRef"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="RouteConfigNotFound"} 0
wallarm_gonode_http_inspector_errors_total{aggregate="sum",type="UnreleasedBlockers"} 0
# HELP wallarm_gonode_http_inspector_flow_avg_time_ms フローのライフサイクルにおける各ポイント間の平均時間です。'type'および'case'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_flow_avg_time_ms gauge
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqOnly",type="Flow"} 1.3002335
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqOnly",type="Req"} 0.5557354999999999
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Flow"} 0
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Gap"} 0
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Req"} 0
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Resp"} 0
# HELP wallarm_gonode_http_inspector_flows 現在解析中のリクエスト/レスポンスのペア数です。
# TYPE wallarm_gonode_http_inspector_flows gauge
wallarm_gonode_http_inspector_flows{aggregate="avg"} 0
wallarm_gonode_http_inspector_flows{aggregate="max"} 0
wallarm_gonode_http_inspector_flows{aggregate="min"} 0
wallarm_gonode_http_inspector_flows{aggregate="sum"} 0
# HELP wallarm_gonode_http_inspector_ignored_per_app_total 無視されたリクエスト/レスポンスのペアの総数です。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_ignored_per_app_total counter
wallarm_gonode_http_inspector_ignored_per_app_total{aggregate="sum",application_id="-1",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_ignored_per_app_total{aggregate="sum",application_id="-1",source="acl_whitelist"} 0
wallarm_gonode_http_inspector_ignored_per_app_total{aggregate="sum",application_id="-1",source="mode"} 0
# HELP wallarm_gonode_http_inspector_ignored_per_host_total 無視されたリクエスト/レスポンスのペアの総数です。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_ignored_per_host_total counter
wallarm_gonode_http_inspector_ignored_per_host_total{aggregate="sum",host="",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_ignored_per_host_total{aggregate="sum",host="",source="acl_whitelist"} 0
wallarm_gonode_http_inspector_ignored_per_host_total{aggregate="sum",host="",source="mode"} 0
# HELP wallarm_gonode_http_inspector_ignored_total 無視されたリクエスト/レスポンスのペアの総数です。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_ignored_total counter
wallarm_gonode_http_inspector_ignored_total{aggregate="sum",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_ignored_total{aggregate="sum",source="acl_whitelist"} 0
wallarm_gonode_http_inspector_ignored_total{aggregate="sum",source="mode"} 0
# HELP wallarm_gonode_http_inspector_mem_allocated_bytes 内部libprotonライブラリ内で現在割り当てられているメモリ量です。
# TYPE wallarm_gonode_http_inspector_mem_allocated_bytes gauge
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="avg"} 0
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="max"} 0
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="min"} 0
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="sum"} 0
# HELP wallarm_gonode_http_inspector_mem_allocated_max_bytes 起動以降に内部libprotonライブラリ内で観測された最大割り当てメモリ量です。
# TYPE wallarm_gonode_http_inspector_mem_allocated_max_bytes gauge
wallarm_gonode_http_inspector_mem_allocated_max_bytes{aggregate="avg"} 60486
wallarm_gonode_http_inspector_mem_allocated_max_bytes{aggregate="max"} 60486
wallarm_gonode_http_inspector_mem_allocated_max_bytes{aggregate="min"} 60486
# HELP wallarm_gonode_http_inspector_msgs_ignored_total 内部データパイプラインで無視されたメッセージの総数です。'_ignored'メトリクスを参照してください。
# TYPE wallarm_gonode_http_inspector_msgs_ignored_total counter
wallarm_gonode_http_inspector_msgs_ignored_total{aggregate="sum"} 0
# HELP wallarm_gonode_http_inspector_requests_processed_per_app_total 各inspectorサブシステムで処理されたリクエストの総数です。1つのリクエストが複数のサブシステムで処理されることがあります。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_requests_processed_per_app_total counter
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="acl"} 0
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="anything"} 3
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="apifw"} 3
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="proton"} 3
# HELP wallarm_gonode_http_inspector_requests_processed_per_host_total 各inspectorサブシステムで処理されたリクエストの総数です。1つのリクエストが複数のサブシステムで処理されることがあります。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_requests_processed_per_host_total counter
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="acl"} 0
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="anything"} 3
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="apifw"} 3
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="proton"} 3
# HELP wallarm_gonode_http_inspector_requests_processed_total 各inspectorサブシステムで処理されたリクエストの総数です。1つのリクエストが複数のサブシステムで処理されることがあります。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_requests_processed_total counter
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="acl"} 0
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="anything"} 3
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="apifw"} 3
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="proton"} 3
# HELP wallarm_gonode_http_inspector_responses_processed_per_app_total 各inspectorサブシステムで処理されたレスポンスの総数です。1つのレスポンスが複数のサブシステムで処理されることがあります。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_responses_processed_per_app_total counter
wallarm_gonode_http_inspector_responses_processed_per_app_total{aggregate="sum",application_id="-1",source="proton"} 0
# HELP wallarm_gonode_http_inspector_responses_processed_per_host_total 各inspectorサブシステムで処理されたレスポンスの総数です。1つのレスポンスが複数のサブシステムで処理されることがあります。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_responses_processed_per_host_total counter
wallarm_gonode_http_inspector_responses_processed_per_host_total{aggregate="sum",host="",source="proton"} 0
# HELP wallarm_gonode_http_inspector_responses_processed_total 各inspectorサブシステムで処理されたレスポンスの総数です。1つのレスポンスが複数のサブシステムで処理されることがあります。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_responses_processed_total counter
wallarm_gonode_http_inspector_responses_processed_total{aggregate="sum",source="proton"} 0
# HELP wallarm_gonode_http_inspector_ruleset_content_version カスタムルールセットファイルのコンテンツバージョンです。内部のいずれかのルールが変更されるたびに増加します。
# TYPE wallarm_gonode_http_inspector_ruleset_content_version gauge
wallarm_gonode_http_inspector_ruleset_content_version{aggregate="max"} 1938
wallarm_gonode_http_inspector_ruleset_content_version{aggregate="min"} 1938
# HELP wallarm_gonode_http_inspector_ruleset_format_version カスタムルールセットファイルのフォーマットバージョンです。
# TYPE wallarm_gonode_http_inspector_ruleset_format_version gauge
wallarm_gonode_http_inspector_ruleset_format_version{aggregate="max"} 58
wallarm_gonode_http_inspector_ruleset_format_version{aggregate="min"} 58
# HELP wallarm_gonode_http_inspector_step_container_is_overloaded アプリが受信より速くデータを処理している場合、コンテナは過負荷ではありません。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_inspector_step_container_is_overloaded gauge
wallarm_gonode_http_inspector_step_container_is_overloaded{type="channel:in"} 0
wallarm_gonode_http_inspector_step_container_is_overloaded{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_inspector_step_debug_container_len 現在の各種内部データ構造内のアイテム数です。'type'ラベルを参照してください
# TYPE wallarm_gonode_http_inspector_step_debug_container_len gauge
wallarm_gonode_http_inspector_step_debug_container_len{type="channel:in"} 0
wallarm_gonode_http_inspector_step_debug_container_len{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_inspector_step_input_messages_total このパイプラインステップの入力メッセージ総数です。
# TYPE wallarm_gonode_http_inspector_step_input_messages_total counter
wallarm_gonode_http_inspector_step_input_messages_total 18
# HELP wallarm_gonode_http_inspector_step_is_running このパイプラインステップが現在実行中(1)か停止中(0)かを示すフラグです。
# TYPE wallarm_gonode_http_inspector_step_is_running gauge
wallarm_gonode_http_inspector_step_is_running 1
# HELP wallarm_gonode_http_inspector_step_output_messages_total このパイプラインステップの出力メッセージ総数です。'msgtype'、'receiver'、'dropped'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_step_output_messages_total counter
wallarm_gonode_http_inspector_step_output_messages_total{dropped="false",msgtype="MsgProtonSerializedRequest",reciever="0"} 3
wallarm_gonode_http_inspector_step_output_messages_total{dropped="true",msgtype="MsgProtonSerializedRequest",reciever="0"} 0
# HELP wallarm_gonode_http_inspector_threats_blocked_per_app_total ブロックされた脅威の総数です。1つのリクエストは1つのinspectorサブシステムによってのみブロックされます。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_threats_blocked_per_app_total counter
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="apifw"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="proton"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="vpatch"} 0
# HELP wallarm_gonode_http_inspector_threats_blocked_per_host_total ブロックされた脅威の総数です。1つのリクエストは1つのinspectorサブシステムによってのみブロックされます。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_threats_blocked_per_host_total counter
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="apifw"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="proton"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="vpatch"} 0
# HELP wallarm_gonode_http_inspector_threats_blocked_total ブロックされた脅威の総数です。1つのリクエストは1つのinspectorサブシステムによってのみブロックされます。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_threats_blocked_total counter
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="apifw"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="proton"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="vpatch"} 0
# HELP wallarm_gonode_http_inspector_threats_found_per_app_total 各inspectorサブシステムで検知された脅威の総数です。1つのリクエストが複数の観点で脅威と見なされることがあります。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_threats_found_per_app_total counter
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="anything"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="apifw"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="proton"} 0
# HELP wallarm_gonode_http_inspector_threats_found_per_host_total 各inspectorサブシステムで検知された脅威の総数です。1つのリクエストが複数の観点で脅威と見なされることがあります。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_threats_found_per_host_total counter
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="anything"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="apifw"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="proton"} 0
# HELP wallarm_gonode_http_inspector_threats_found_total 各inspectorサブシステムで検知された脅威の総数です。1つのリクエストが複数の観点で脅威と見なされることがあります。'source'ラベルを参照してください。
# TYPE wallarm_gonode_http_inspector_threats_found_total counter
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="anything"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="apifw"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="proton"} 0
# HELP wallarm_gonode_postanalytics_exporter_connections postanalyticsへの現在の接続数です。postanalyticsノードごとに1接続です。
# TYPE wallarm_gonode_postanalytics_exporter_connections gauge
wallarm_gonode_postanalytics_exporter_connections 1
# HELP wallarm_gonode_postanalytics_exporter_container_is_overloaded アプリが受信より速くデータを処理している場合、コンテナは過負荷ではありません。'type'ラベルを参照してください
# TYPE wallarm_gonode_postanalytics_exporter_container_is_overloaded gauge
wallarm_gonode_postanalytics_exporter_container_is_overloaded{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_debug_container_len 現在の各種内部データ構造内のアイテム数です。'type'ラベルを参照してください
# TYPE wallarm_gonode_postanalytics_exporter_debug_container_len gauge
wallarm_gonode_postanalytics_exporter_debug_container_len{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_errors_total 各種エラーカウンタです。'type'ラベルを参照してください
# TYPE wallarm_gonode_postanalytics_exporter_errors_total counter
wallarm_gonode_postanalytics_exporter_errors_total{type="SubmitConnect"} 6
wallarm_gonode_postanalytics_exporter_errors_total{type="SubmitResp"} 0
# HELP wallarm_gonode_postanalytics_exporter_serialized_requests_dropped_total エラーによりドロップされたシリアライズ済みリクエストの総数です。
# TYPE wallarm_gonode_postanalytics_exporter_serialized_requests_dropped_total counter
wallarm_gonode_postanalytics_exporter_serialized_requests_dropped_total 3
# HELP wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period 直近の期間にpostanalyticsへエクスポートされたシリアライズ済みリクエストの数です。'period'ラベルを参照してください。
# TYPE wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period gauge
wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period{period="1m"} 0
wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period{period="1s"} 0
# HELP wallarm_gonode_postanalytics_exporter_serialized_requests_exported_total postanalyticsへエクスポートされたシリアライズ済みリクエストの総数です。
# TYPE wallarm_gonode_postanalytics_exporter_serialized_requests_exported_total counter
wallarm_gonode_postanalytics_exporter_serialized_requests_exported_total 0
# HELP wallarm_gonode_postanalytics_exporter_step_container_is_overloaded アプリが受信より速くデータを処理している場合、コンテナは過負荷ではありません。'type'ラベルを参照してください
# TYPE wallarm_gonode_postanalytics_exporter_step_container_is_overloaded gauge
wallarm_gonode_postanalytics_exporter_step_container_is_overloaded{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_step_debug_container_len 現在の各種内部データ構造内のアイテム数です。'type'ラベルを参照してください
# TYPE wallarm_gonode_postanalytics_exporter_step_debug_container_len gauge
wallarm_gonode_postanalytics_exporter_step_debug_container_len{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_step_input_messages_total このパイプラインステップの入力メッセージ総数です。
# TYPE wallarm_gonode_postanalytics_exporter_step_input_messages_total counter
wallarm_gonode_postanalytics_exporter_step_input_messages_total 3
# HELP wallarm_gonode_postanalytics_exporter_step_is_running このパイプラインステップが現在実行中(1)か停止中(0)かを示すフラグです。
# TYPE wallarm_gonode_postanalytics_exporter_step_is_running gauge
wallarm_gonode_postanalytics_exporter_step_is_running 1
# HELP wallarm_gonode_process_cpu_seconds_total ユーザーおよびシステムCPUに費やされた合計時間(秒)です。
# TYPE wallarm_gonode_process_cpu_seconds_total counter
wallarm_gonode_process_cpu_seconds_total 1.56
# HELP wallarm_gonode_process_max_fds オープン可能なファイルディスクリプタの最大数です。
# TYPE wallarm_gonode_process_max_fds gauge
wallarm_gonode_process_max_fds 524287
# HELP wallarm_gonode_process_network_receive_bytes_total プロセスがネットワーク経由で受信したバイト数です。
# TYPE wallarm_gonode_process_network_receive_bytes_total counter
wallarm_gonode_process_network_receive_bytes_total 2.53529454e+08
# HELP wallarm_gonode_process_network_transmit_bytes_total プロセスがネットワーク経由で送信したバイト数です。
# TYPE wallarm_gonode_process_network_transmit_bytes_total counter
wallarm_gonode_process_network_transmit_bytes_total 1.9418293e+07
# HELP wallarm_gonode_process_open_fds オープンしているファイルディスクリプタの数です。
# TYPE wallarm_gonode_process_open_fds gauge
wallarm_gonode_process_open_fds 20
# HELP wallarm_gonode_process_resident_memory_bytes 常駐メモリサイズ(バイト)です。
# TYPE wallarm_gonode_process_resident_memory_bytes gauge
wallarm_gonode_process_resident_memory_bytes 1.67747584e+08
# HELP wallarm_gonode_process_start_time_seconds プロセスの開始時刻をUnixエポックからの秒数で示します。
# TYPE wallarm_gonode_process_start_time_seconds gauge
wallarm_gonode_process_start_time_seconds 1.75398672336e+09
# HELP wallarm_gonode_process_virtual_memory_bytes 仮想メモリサイズ(バイト)です。
# TYPE wallarm_gonode_process_virtual_memory_bytes gauge
wallarm_gonode_process_virtual_memory_bytes 1.98490112e+09
# HELP wallarm_gonode_process_virtual_memory_max_bytes 使用可能な仮想メモリの最大量(バイト)です。
# TYPE wallarm_gonode_process_virtual_memory_max_bytes gauge
wallarm_gonode_process_virtual_memory_max_bytes 1.8446744073709552e+19
```

<style>
    .prom-metrics-output pre>code {
        max-height: 1000px;
        overflow-y: auto;
    }
</style>