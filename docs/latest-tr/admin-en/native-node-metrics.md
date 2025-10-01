# Native Node Metriklerinin İzlenmesi

[Native Node](../installation/nginx-native-node-internals.md#native-node), metrikleri [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) formatında sunar; böylece performansını, trafiğini ve tespit edilen saldırıları izleyebilirsiniz. Bu kılavuz, bu metriklere nasıl erişileceğini ve nasıl yorumlanacağını açıklar.

## Metriklere erişim

Varsayılan olarak, Node metrikleri aşağıdaki uç noktada sunar:

```bash
http://<NODE_IP>:9000/metrics
```

Metrik uç noktasına erişmek için:

* **Docker veya sanal makine** - güvenlik duvarında `9000` portunu açın veya Docker ile `-p 9000:9000` olarak yayınlayın.

    Metrikler için port ve yol, [`metrics.*`](../installation/native-node/all-in-one-conf.md#metricsenabled) parametreleri kullanılarak değiştirilebilir.
* **Kubernetes** - portu yerel olarak yönlendirmek için bir `kubectl port-forward` komutu kullanın, örn.:

    ```bash
    kubectl port-forward svc/<NODE-SERVICE-NAME> 9000:9000 -n <NAMESPACE>
    ```

    Metrikler için port ve yol, [`processing.metrics.*`](../installation/native-node/helm-chart-conf.md#processingmetricsenabled) parametreleri kullanılarak değiştirilebilir.

## Kullanılabilir metrikler

Aşağıdaki Prometheus metrik grupları mevcuttur. Her metrik, amacını ayrıntılı olarak açıklayan bir HELP iletisi içerir.

Metriklerin tam listesi, Native Node sürümüne bağlı olarak değişebilir. Değişiklikler [Native Node değişiklik günlüğüne](../updating-migrating/native-node/node-artifact-versions.md) yansıtılır.

### `wallarm_gonode_application_*`

Sürüm, dağıtım türü, mod ve yapılandırma yeniden yükleme istatistikleri dahil olmak üzere Node örneği hakkında genel bilgiler sağlar.

### `wallarm_gonode_files_*`, `wallarm_gonode_http_inspector_ruleset_*`

Uygulanan yapılandırma ve kural seti dosyaları hakkında, biçim ve içerik sürümleri ile son güncelleme zaman damgası dahil ayrıntılar içerir.

### `wallarm_gonode_go_*`, `wallarm_gonode_process_*`

Kaynak kullanımı (CPU, bellek, ağ) ve çöp toplayıcı istatistikleri dahil standart süreç ve Go çalışma zamanı metrikleri.

### `wallarm_gonode_http_connector_*`

Bağlayıcı sunucu bileşeniyle ilgili metrikler; istek işleme, engellenen/atlanan istekler, hata sayaçları ve gecikmeyi kapsar.

### `wallarm_gonode_http_inspector_*`

HTTP denetleyicisinden ayrıntılı istatistikler sağlar; işlenen istek ve yanıtlara, tespit edilen ve engellenen saldırılara ve dahili ardışık düzen metriklerine ilişkin.

### `wallarm_gonode_postanalytics_*`

postanalytics hizmetine (wstore) veri dışa aktarmayla ilgili metrikleri içerir; dışa aktarılan istekler, hatalar ve postanalytics düğümlerine etkin bağlantılar dahil.

## Örnek metrik çıktısı

Aşağıda metrik uç noktasından örnek bir yanıt verilmiştir:

```{.bash .prom-metrics-output}
# HELP wallarm_gonode_application_config_reload_errors_total Yapılandırma yeniden yükleme sırasında oluşan toplam hata sayısı
# TYPE wallarm_gonode_application_config_reload_errors_total counter
wallarm_gonode_application_config_reload_errors_total 0
# HELP wallarm_gonode_application_config_reloads_total Toplam yapılandırma yeniden yükleme sayısı
# TYPE wallarm_gonode_application_config_reloads_total counter
wallarm_gonode_application_config_reloads_total 0
# HELP wallarm_gonode_application_info Uygulama bilgileri. 'version', 'mode' etiketlerine bakın.
# TYPE wallarm_gonode_application_info gauge
wallarm_gonode_application_info{deployment_type="node-native-aio-installer",mode="connector-server",version="0.16.1-rc4"} 1
# HELP wallarm_gonode_files_apply_timestamp_seconds Çeşitli dosyaların ne zaman uygulandığının zaman damgası. 'file' etiketine bakın.
# TYPE wallarm_gonode_files_apply_timestamp_seconds gauge
wallarm_gonode_files_apply_timestamp_seconds{file="custom_ruleset"} 1.753986724e+09
wallarm_gonode_files_apply_timestamp_seconds{file="proton.db"} 1.753986724e+09
# HELP wallarm_gonode_files_content_version Çeşitli dosyaların içerik sürümü. 'file' etiketine bakın.
# TYPE wallarm_gonode_files_content_version gauge
wallarm_gonode_files_content_version{file="custom_ruleset"} 1938
wallarm_gonode_files_content_version{file="proton.db"} 215
# HELP wallarm_gonode_files_format_version Çeşitli dosyaların biçim sürümü. 'file' etiketine bakın.
# TYPE wallarm_gonode_files_format_version gauge
wallarm_gonode_files_format_version{file="custom_ruleset"} 58
wallarm_gonode_files_format_version{file="proton.db"} 10
# HELP wallarm_gonode_go_gc_duration_seconds GC döngülerindeki gerçek zamanlı duraklama (stop-the-world) sürelerinin özeti.
# TYPE wallarm_gonode_go_gc_duration_seconds summary
wallarm_gonode_go_gc_duration_seconds{quantile="0"} 5.4205e-05
wallarm_gonode_go_gc_duration_seconds{quantile="0.25"} 6.0421e-05
wallarm_gonode_go_gc_duration_seconds{quantile="0.5"} 6.5876e-05
wallarm_gonode_go_gc_duration_seconds{quantile="0.75"} 0.000109397
wallarm_gonode_go_gc_duration_seconds{quantile="1"} 0.00016074
wallarm_gonode_go_gc_duration_seconds_sum 0.000900882
wallarm_gonode_go_gc_duration_seconds_count 11
# HELP wallarm_gonode_go_gc_gogc_percent Kullanıcı tarafından yapılandırılan yığın boyutu hedef yüzdesi; aksi halde 100. Bu değer GOGC ortam değişkeni ve runtime/debug.SetGCPercent fonksiyonu tarafından ayarlanır. Kaynak: /gc/gogc:percent.
# TYPE wallarm_gonode_go_gc_gogc_percent gauge
wallarm_gonode_go_gc_gogc_percent 100
# HELP wallarm_gonode_go_gc_gomemlimit_bytes Kullanıcı tarafından yapılandırılan Go çalışma zamanı bellek sınırı; aksi halde math.MaxInt64. Bu değer GOMEMLIMIT ortam değişkeni ve runtime/debug.SetMemoryLimit fonksiyonu tarafından ayarlanır. Kaynak: /gc/gomemlimit:bytes.
# TYPE wallarm_gonode_go_gc_gomemlimit_bytes gauge
wallarm_gonode_go_gc_gomemlimit_bytes 9.223372036854776e+18
# HELP wallarm_gonode_go_goroutines Şu anda var olan goroutine sayısı.
# TYPE wallarm_gonode_go_goroutines gauge
wallarm_gonode_go_goroutines 39
# HELP wallarm_gonode_go_info Go ortamı hakkında bilgi.
# TYPE wallarm_gonode_go_info gauge
wallarm_gonode_go_info{version="go1.24.5"} 1
# HELP wallarm_gonode_go_memstats_alloc_bytes Yığında ayrılan ve şu anda kullanımda olan bayt sayısı. /memory/classes/heap/objects:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_alloc_bytes gauge
wallarm_gonode_go_memstats_alloc_bytes 9.302008e+06
# HELP wallarm_gonode_go_memstats_alloc_bytes_total Şu ana kadar yığında ayrılan toplam bayt sayısı, serbest bırakılmış olsa bile. /gc/heap/allocs:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_alloc_bytes_total counter
wallarm_gonode_go_memstats_alloc_bytes_total 5.7922512e+07
# HELP wallarm_gonode_go_memstats_buck_hash_sys_bytes Profiling bucket hash tablosu tarafından kullanılan bayt sayısı. /memory/classes/profiling/buckets:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_buck_hash_sys_bytes gauge
wallarm_gonode_go_memstats_buck_hash_sys_bytes 91305
# HELP wallarm_gonode_go_memstats_frees_total Yığın nesnesi serbest bırakmalarının toplam sayısı. /gc/heap/frees:objects + /gc/heap/tiny/allocs:objects değerine eşittir.
# TYPE wallarm_gonode_go_memstats_frees_total counter
wallarm_gonode_go_memstats_frees_total 625423
# HELP wallarm_gonode_go_memstats_gc_sys_bytes Çöp toplama sistem üst verileri için kullanılan bayt sayısı. /memory/classes/metadata/other:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_gc_sys_bytes gauge
wallarm_gonode_go_memstats_gc_sys_bytes 3.494312e+06
# HELP wallarm_gonode_go_memstats_heap_alloc_bytes Ayrılan ve şu anda kullanımda olan yığın bayt sayısı; go_memstats_alloc_bytes ile aynıdır. /memory/classes/heap/objects:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_heap_alloc_bytes gauge
wallarm_gonode_go_memstats_heap_alloc_bytes 9.302008e+06
# HELP wallarm_gonode_go_memstats_heap_idle_bytes Kullanılmayı bekleyen yığın bayt sayısı. /memory/classes/heap/released:bytes + /memory/classes/heap/free:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_heap_idle_bytes gauge
wallarm_gonode_go_memstats_heap_idle_bytes 4.374528e+06
# HELP wallarm_gonode_go_memstats_heap_inuse_bytes Kullanımda olan yığın bayt sayısı. /memory/classes/heap/objects:bytes + /memory/classes/heap/unused:bytes değerine eşittir
# TYPE wallarm_gonode_go_memstats_heap_inuse_bytes gauge
wallarm_gonode_go_memstats_heap_inuse_bytes 1.1321344e+07
# HELP wallarm_gonode_go_memstats_heap_objects Şu anda ayrılmış nesne sayısı. /gc/heap/objects:objects değerine eşittir.
# TYPE wallarm_gonode_go_memstats_heap_objects gauge
wallarm_gonode_go_memstats_heap_objects 56658
# HELP wallarm_gonode_go_memstats_heap_released_bytes İşletim sistemine serbest bırakılan yığın bayt sayısı. /memory/classes/heap/released:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_heap_released_bytes gauge
wallarm_gonode_go_memstats_heap_released_bytes 2.29376e+06
# HELP wallarm_gonode_go_memstats_heap_sys_bytes Sistemden edinilen yığın bayt sayısı. /memory/classes/heap/objects:bytes + /memory/classes/heap/unused:bytes + /memory/classes/heap/released:bytes + /memory/classes/heap/free:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_heap_sys_bytes gauge
wallarm_gonode_go_memstats_heap_sys_bytes 1.5695872e+07
# HELP wallarm_gonode_go_memstats_last_gc_time_seconds Son çöp toplamanın 1970'ten bu yana saniye cinsinden zamanı.
# TYPE wallarm_gonode_go_memstats_last_gc_time_seconds gauge
wallarm_gonode_go_memstats_last_gc_time_seconds 1.7539879135438237e+09
# HELP wallarm_gonode_go_memstats_mallocs_total Hem canlı hem de GC tarafından temizlenmiş yığın nesneleri dahil ayrılan toplam yığın nesnesi sayısı. Anlamsal olarak go_memstats_heap_objects göstergesinin sayaç versiyonudur. /gc/heap/allocs:objects + /gc/heap/tiny/allocs:objects değerine eşittir.
# TYPE wallarm_gonode_go_memstats_mallocs_total counter
wallarm_gonode_go_memstats_mallocs_total 682081
# HELP wallarm_gonode_go_memstats_mcache_inuse_bytes mcache yapıları tarafından kullanımda olan bayt sayısı. /memory/classes/metadata/mcache/inuse:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_mcache_inuse_bytes gauge
wallarm_gonode_go_memstats_mcache_inuse_bytes 2416
# HELP wallarm_gonode_go_memstats_mcache_sys_bytes Sistemden edinilen mcache yapıları için kullanılan bayt sayısı. /memory/classes/metadata/mcache/inuse:bytes + /memory/classes/metadata/mcache/free:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_mcache_sys_bytes gauge
wallarm_gonode_go_memstats_mcache_sys_bytes 15704
# HELP wallarm_gonode_go_memstats_mspan_inuse_bytes mspan yapıları tarafından kullanımda olan bayt sayısı. /memory/classes/metadata/mspan/inuse:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_mspan_inuse_bytes gauge
wallarm_gonode_go_memstats_mspan_inuse_bytes 138400
# HELP wallarm_gonode_go_memstats_mspan_sys_bytes Sistemden edinilen mspan yapıları için kullanılan bayt sayısı. /memory/classes/metadata/mspan/inuse:bytes + /memory/classes/metadata/mspan/free:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_mspan_sys_bytes gauge
wallarm_gonode_go_memstats_mspan_sys_bytes 163200
# HELP wallarm_gonode_go_memstats_next_gc_bytes Bir sonraki çöp toplamanın gerçekleşeceği yığın bayt sayısı. /gc/heap/goal:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_next_gc_bytes gauge
wallarm_gonode_go_memstats_next_gc_bytes 1.8470754e+07
# HELP wallarm_gonode_go_memstats_other_sys_bytes Diğer sistem ayırmaları için kullanılan bayt sayısı. /memory/classes/other:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_other_sys_bytes gauge
wallarm_gonode_go_memstats_other_sys_bytes 540825
# HELP wallarm_gonode_go_memstats_stack_inuse_bytes CGO olmayan ortamlarda yığın ayırıcı için sistemden edinilen bayt sayısı. /memory/classes/heap/stacks:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_stack_inuse_bytes gauge
wallarm_gonode_go_memstats_stack_inuse_bytes 1.081344e+06
# HELP wallarm_gonode_go_memstats_stack_sys_bytes Yığın ayırıcı için sistemden edinilen bayt sayısı. /memory/classes/heap/stacks:bytes + /memory/classes/os-stacks:bytes değerine eşittir.
# TYPE wallarm_gonode_go_memstats_stack_sys_bytes gauge
wallarm_gonode_go_memstats_stack_sys_bytes 1.081344e+06
# HELP wallarm_gonode_go_memstats_sys_bytes Sistemden edinilen bayt sayısı. /memory/classes/total:byte değerine eşittir.
# TYPE wallarm_gonode_go_memstats_sys_bytes gauge
wallarm_gonode_go_memstats_sys_bytes 2.1082562e+07
# HELP wallarm_gonode_go_sched_gomaxprocs_threads Geçerli runtime.GOMAXPROCS ayarı veya aynı anda kullanıcı düzeyi Go kodu çalıştırabilen işletim sistemi iş parçacığı sayısı. Kaynak: /sched/gomaxprocs:threads.
# TYPE wallarm_gonode_go_sched_gomaxprocs_threads gauge
wallarm_gonode_go_sched_gomaxprocs_threads 2
# HELP wallarm_gonode_go_threads Oluşturulan OS iş parçacığı sayısı.
# TYPE wallarm_gonode_go_threads gauge
wallarm_gonode_go_threads 11
# HELP wallarm_gonode_http_connector_server_avg_latency_ms Bu düğümde işlenen istekler için ortalama gecikme
# TYPE wallarm_gonode_http_connector_server_avg_latency_ms gauge
wallarm_gonode_http_connector_server_avg_latency_ms 0.819581
# HELP wallarm_gonode_http_connector_server_debug_container_len Şu anda çeşitli dahili veri yapılarındaki öğe sayısı. 'type' etiketine bakın
# TYPE wallarm_gonode_http_connector_server_debug_container_len gauge
wallarm_gonode_http_connector_server_debug_container_len{type="map:activeRequests"} 0
wallarm_gonode_http_connector_server_debug_container_len{type="map:requestWaitMap"} 0
wallarm_gonode_http_connector_server_debug_container_len{type="map:responseWaitMap"} 0
# HELP wallarm_gonode_http_connector_server_errors_total Çeşitli hata sayaçları. 'type' etiketine bakın
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
# HELP wallarm_gonode_http_connector_server_messages_processed_total Başarıyla işlenen iletilerin toplam miktarı. 'type' etiketine bakın
# TYPE wallarm_gonode_http_connector_server_messages_processed_total counter
wallarm_gonode_http_connector_server_messages_processed_total{type="request"} 3
wallarm_gonode_http_connector_server_messages_processed_total{type="response"} 0
# HELP wallarm_gonode_http_connector_server_messages_rejected_total Bağlayıcı sunucu tarafından çeşitli nedenlerle reddedilen iletilerin toplam miktarı. 'reason' etiketine bakın.
# TYPE wallarm_gonode_http_connector_server_messages_rejected_total counter
wallarm_gonode_http_connector_server_messages_rejected_total{reason="connector_info"} 3
wallarm_gonode_http_connector_server_messages_rejected_total{reason="host"} 0
wallarm_gonode_http_connector_server_messages_rejected_total{reason="remote_address"} 0
# HELP wallarm_gonode_http_connector_server_messages_seen_total Bağlayıcı sunucu tarafından görülen iletilerin toplam miktarı. 'type' etiketine bakın. 'total' türü her şeyi içerir: reddedilen, işlenen, iletilen, hatalı vb.
# TYPE wallarm_gonode_http_connector_server_messages_seen_total counter
wallarm_gonode_http_connector_server_messages_seen_total{type="health"} 0
wallarm_gonode_http_connector_server_messages_seen_total{type="request"} 3
wallarm_gonode_http_connector_server_messages_seen_total{type="response"} 0
wallarm_gonode_http_connector_server_messages_seen_total{type="total"} 6
# HELP wallarm_gonode_http_connector_server_requests_blocked_total Wallarm tarafından engellenen istekler
# TYPE wallarm_gonode_http_connector_server_requests_blocked_total counter
wallarm_gonode_http_connector_server_requests_blocked_total 0
# HELP wallarm_gonode_http_connector_server_requests_bypassed_total Denetlenmeyen istekler. 'reason' etiketine bakın.
# TYPE wallarm_gonode_http_connector_server_requests_bypassed_total counter
wallarm_gonode_http_connector_server_requests_bypassed_total{reason="input_filters"} 0
wallarm_gonode_http_connector_server_requests_bypassed_total{reason="mode_off"} 0
# HELP wallarm_gonode_http_connector_server_responses_bypassed_total Denetlenmeyen yanıtlar
# TYPE wallarm_gonode_http_connector_server_responses_bypassed_total counter
wallarm_gonode_http_connector_server_responses_bypassed_total 0
# HELP wallarm_gonode_http_connector_server_step_container_is_overloaded Uygulama verileri aldığı hızdan daha hızlı işliyorsa kaplar aşırı yüklenmiş sayılmaz. 'type' etiketine bakın
# TYPE wallarm_gonode_http_connector_server_step_container_is_overloaded gauge
wallarm_gonode_http_connector_server_step_container_is_overloaded{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_connector_server_step_debug_container_len Şu anda çeşitli dahili veri yapılarındaki öğe sayısı. 'type' etiketine bakın
# TYPE wallarm_gonode_http_connector_server_step_debug_container_len gauge
wallarm_gonode_http_connector_server_step_debug_container_len{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_connector_server_step_is_running Bu ardışık düzen adımının şu anda çalışıp çalışmadığını (1) veya durduğunu (0) gösteren işaret.
# TYPE wallarm_gonode_http_connector_server_step_is_running gauge
wallarm_gonode_http_connector_server_step_is_running 1
# HELP wallarm_gonode_http_connector_server_step_output_messages_total Bu ardışık düzen adımının çıktı iletilerinin toplamı. 'msgtype', 'receiver' ve 'dropped' etiketlerine bakın.
# TYPE wallarm_gonode_http_connector_server_step_output_messages_total counter
wallarm_gonode_http_connector_server_step_output_messages_total{dropped="false",msgtype="MsgHTTP",reciever="0"} 18
wallarm_gonode_http_connector_server_step_output_messages_total{dropped="true",msgtype="MsgHTTP",reciever="0"} 0
# HELP wallarm_gonode_http_inspector_acl_results_per_app_total ACL sonuç sayaçları. 'list' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_acl_results_per_app_total counter
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="black"} 0
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="grey"} 0
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="none"} 0
wallarm_gonode_http_inspector_acl_results_per_app_total{aggregate="sum",application_id="-1",list="white"} 0
# HELP wallarm_gonode_http_inspector_acl_results_per_host_total ACL sonuç sayaçları. 'list' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_acl_results_per_host_total counter
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="black"} 0
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="grey"} 0
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="none"} 0
wallarm_gonode_http_inspector_acl_results_per_host_total{aggregate="sum",host="",list="white"} 0
# HELP wallarm_gonode_http_inspector_acl_results_total ACL sonuç sayaçları. 'list' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_acl_results_total counter
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="black"} 0
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="grey"} 0
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="none"} 0
wallarm_gonode_http_inspector_acl_results_total{aggregate="sum",list="white"} 0
# HELP wallarm_gonode_http_inspector_adjusted_counters_per_app_total Ayarlanmış sayaçlar. Ayarlanmış eski sayaçlara karşılık gelir. 'type' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_adjusted_counters_per_app_total counter
wallarm_gonode_http_inspector_adjusted_counters_per_app_total{aggregate="sum",application_id="-1",type="attacks"} 0
wallarm_gonode_http_inspector_adjusted_counters_per_app_total{aggregate="sum",application_id="-1",type="requests"} 3
# HELP wallarm_gonode_http_inspector_adjusted_counters_per_host_total Ayarlanmış sayaçlar. Ayarlanmış eski sayaçlara karşılık gelir. 'type' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_adjusted_counters_per_host_total counter
wallarm_gonode_http_inspector_adjusted_counters_per_host_total{aggregate="sum",host="",type="attacks"} 0
wallarm_gonode_http_inspector_adjusted_counters_per_host_total{aggregate="sum",host="",type="requests"} 3
# HELP wallarm_gonode_http_inspector_adjusted_counters_total Ayarlanmış sayaçlar. Ayarlanmış eski sayaçlara karşılık gelir. 'type' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_adjusted_counters_total counter
wallarm_gonode_http_inspector_adjusted_counters_total{aggregate="sum",type="attacks"} 0
wallarm_gonode_http_inspector_adjusted_counters_total{aggregate="sum",type="requests"} 3
# HELP wallarm_gonode_http_inspector_adjusted_requests_per_period Son zaman aralığı başına ayarlanmış istek miktarı. 'period' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_adjusted_requests_per_period gauge
wallarm_gonode_http_inspector_adjusted_requests_per_period{aggregate="sum",period="1m"} 0
wallarm_gonode_http_inspector_adjusted_requests_per_period{aggregate="sum",period="1s"} 0
# HELP wallarm_gonode_http_inspector_balancer_container_is_overloaded Uygulama verileri aldığı hızdan daha hızlı işliyorsa kaplar aşırı yüklenmiş sayılmaz. 'type' etiketine bakın
# TYPE wallarm_gonode_http_inspector_balancer_container_is_overloaded gauge
wallarm_gonode_http_inspector_balancer_container_is_overloaded{type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_balancer_debug_container_len Şu anda çeşitli dahili veri yapılarındaki öğe sayısı. 'type' etiketine bakın
# TYPE wallarm_gonode_http_inspector_balancer_debug_container_len gauge
wallarm_gonode_http_inspector_balancer_debug_container_len{type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_balancer_dropped_total drop_percent yapılandırma parametresinin sıfır olmaması nedeniyle düşürülen giriş iletileri
# TYPE wallarm_gonode_http_inspector_balancer_dropped_total counter
wallarm_gonode_http_inspector_balancer_dropped_total 0
# HELP wallarm_gonode_http_inspector_balancer_workers Worker sayısı.
# TYPE wallarm_gonode_http_inspector_balancer_workers gauge
wallarm_gonode_http_inspector_balancer_workers 2
# HELP wallarm_gonode_http_inspector_bytes_processed_per_app_total İşlenen baytlar. Hat üzerindeki bayt miktarıyla birebir eşit değildir. 'type' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_bytes_processed_per_app_total counter
wallarm_gonode_http_inspector_bytes_processed_per_app_total{aggregate="sum",application_id="-1",type="request"} 138
wallarm_gonode_http_inspector_bytes_processed_per_app_total{aggregate="sum",application_id="-1",type="response"} 0
# HELP wallarm_gonode_http_inspector_bytes_processed_per_host_total İşlenen baytlar. Hat üzerindeki bayt miktarıyla birebir eşit değildir. 'type' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_bytes_processed_per_host_total counter
wallarm_gonode_http_inspector_bytes_processed_per_host_total{aggregate="sum",host="",type="request"} 138
wallarm_gonode_http_inspector_bytes_processed_per_host_total{aggregate="sum",host="",type="response"} 0
# HELP wallarm_gonode_http_inspector_bytes_processed_per_period Son zaman aralığında işlenen bayt miktarı. 'period' ve 'type' etiketlerine bakın.
# TYPE wallarm_gonode_http_inspector_bytes_processed_per_period gauge
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1m",type="request"} 0
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1m",type="response"} 0
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1s",type="request"} 0
wallarm_gonode_http_inspector_bytes_processed_per_period{aggregate="sum",period="1s",type="response"} 0
# HELP wallarm_gonode_http_inspector_bytes_processed_total İşlenen baytlar. Hat üzerindeki bayt miktarıyla birebir eşit değildir. 'type' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_bytes_processed_total counter
wallarm_gonode_http_inspector_bytes_processed_total{aggregate="sum",type="request"} 138
wallarm_gonode_http_inspector_bytes_processed_total{aggregate="sum",type="response"} 0
# HELP wallarm_gonode_http_inspector_container_is_overloaded Uygulama verileri aldığı hızdan daha hızlı işliyorsa kaplar aşırı yüklenmiş sayılmaz. 'type' etiketine bakın
# TYPE wallarm_gonode_http_inspector_container_is_overloaded gauge
wallarm_gonode_http_inspector_container_is_overloaded{aggregate="max",type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_debug_container_len Şu anda çeşitli dahili veri yapılarındaki öğe sayısı. 'type' etiketine bakın
# TYPE wallarm_gonode_http_inspector_debug_container_len gauge
wallarm_gonode_http_inspector_debug_container_len{aggregate="avg",type="channel:in"} 0
wallarm_gonode_http_inspector_debug_container_len{aggregate="max",type="channel:in"} 0
wallarm_gonode_http_inspector_debug_container_len{aggregate="min",type="channel:in"} 0
wallarm_gonode_http_inspector_debug_container_len{aggregate="sum",type="channel:in"} 0
# HELP wallarm_gonode_http_inspector_errors_total Çeşitli hata sayaçları. 'type' etiketine bakın
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
# HELP wallarm_gonode_http_inspector_flow_avg_time_ms Bir akışın yaşamındaki çeşitli noktalar arasındaki ortalama zaman süreleri. 'type' ve 'case' etiketlerine bakın.
# TYPE wallarm_gonode_http_inspector_flow_avg_time_ms gauge
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqOnly",type="Flow"} 1.3002335
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqOnly",type="Req"} 0.5557354999999999
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Flow"} 0
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Gap"} 0
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Req"} 0
wallarm_gonode_http_inspector_flow_avg_time_ms{aggregate="avgnz",case="ReqResp",type="Resp"} 0
# HELP wallarm_gonode_http_inspector_flows Şu anda analiz edilen istek/yanıt çiftlerinin sayısı
# TYPE wallarm_gonode_http_inspector_flows gauge
wallarm_gonode_http_inspector_flows{aggregate="avg"} 0
wallarm_gonode_http_inspector_flows{aggregate="max"} 0
wallarm_gonode_http_inspector_flows{aggregate="min"} 0
wallarm_gonode_http_inspector_flows{aggregate="sum"} 0
# HELP wallarm_gonode_http_inspector_ignored_per_app_total Yok sayılan istek/yanıt çiftlerinin toplamı. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_ignored_per_app_total counter
wallarm_gonode_http_inspector_ignored_per_app_total{aggregate="sum",application_id="-1",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_ignored_per_app_total{aggregate="sum",application_id="-1",source="acl_whitelist"} 0
wallarm_gonode_http_inspector_ignored_per_app_total{aggregate="sum",application_id="-1",source="mode"} 0
# HELP wallarm_gonode_http_inspector_ignored_per_host_total Yok sayılan istek/yanıt çiftlerinin toplamı. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_ignored_per_host_total counter
wallarm_gonode_http_inspector_ignored_per_host_total{aggregate="sum",host="",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_ignored_per_host_total{aggregate="sum",host="",source="acl_whitelist"} 0
wallarm_gonode_http_inspector_ignored_per_host_total{aggregate="sum",host="",source="mode"} 0
# HELP wallarm_gonode_http_inspector_ignored_total Yok sayılan istek/yanıt çiftlerinin toplamı. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_ignored_total counter
wallarm_gonode_http_inspector_ignored_total{aggregate="sum",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_ignored_total{aggregate="sum",source="acl_whitelist"} 0
wallarm_gonode_http_inspector_ignored_total{aggregate="sum",source="mode"} 0
# HELP wallarm_gonode_http_inspector_mem_allocated_bytes Şu anda dahili libproton kütüphanesi içinde ayrılan bellek miktarı
# TYPE wallarm_gonode_http_inspector_mem_allocated_bytes gauge
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="avg"} 0
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="max"} 0
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="min"} 0
wallarm_gonode_http_inspector_mem_allocated_bytes{aggregate="sum"} 0
# HELP wallarm_gonode_http_inspector_mem_allocated_max_bytes Başlangıçtan bu yana gözlenen, dahili libproton kütüphanesi içinde ayrılan en yüksek bellek miktarı
# TYPE wallarm_gonode_http_inspector_mem_allocated_max_bytes gauge
wallarm_gonode_http_inspector_mem_allocated_max_bytes{aggregate="avg"} 60486
wallarm_gonode_http_inspector_mem_allocated_max_bytes{aggregate="max"} 60486
wallarm_gonode_http_inspector_mem_allocated_max_bytes{aggregate="min"} 60486
# HELP wallarm_gonode_http_inspector_msgs_ignored_total Yok sayılan dahili veri ardışık düzeni iletilerinin toplamı. '_ignored' metriğine bakın
# TYPE wallarm_gonode_http_inspector_msgs_ignored_total counter
wallarm_gonode_http_inspector_msgs_ignored_total{aggregate="sum"} 0
# HELP wallarm_gonode_http_inspector_requests_processed_per_app_total Farklı denetleyici alt sistemleri tarafından işlenen isteklerin toplamı. Bir istek birden fazla alt sistem tarafından işlenebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_requests_processed_per_app_total counter
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="acl"} 0
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="anything"} 3
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="apifw"} 3
wallarm_gonode_http_inspector_requests_processed_per_app_total{aggregate="sum",application_id="-1",source="proton"} 3
# HELP wallarm_gonode_http_inspector_requests_processed_per_host_total Farklı denetleyici alt sistemleri tarafından işlenen isteklerin toplamı. Bir istek birden fazla alt sistem tarafından işlenebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_requests_processed_per_host_total counter
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="acl"} 0
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="anything"} 3
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="apifw"} 3
wallarm_gonode_http_inspector_requests_processed_per_host_total{aggregate="sum",host="",source="proton"} 3
# HELP wallarm_gonode_http_inspector_requests_processed_total Farklı denetleyici alt sistemleri tarafından işlenen isteklerin toplamı. Bir istek birden fazla alt sistem tarafından işlenebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_requests_processed_total counter
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="acl"} 0
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="anything"} 3
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="apifw"} 3
wallarm_gonode_http_inspector_requests_processed_total{aggregate="sum",source="proton"} 3
# HELP wallarm_gonode_http_inspector_responses_processed_per_app_total Farklı denetleyici alt sistemleri tarafından işlenen yanıtların toplamı. Bir yanıt birden fazla alt sistem tarafından işlenebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_responses_processed_per_app_total counter
wallarm_gonode_http_inspector_responses_processed_per_app_total{aggregate="sum",application_id="-1",source="proton"} 0
# HELP wallarm_gonode_http_inspector_responses_processed_per_host_total Farklı denetleyici alt sistemleri tarafından işlenen yanıtların toplamı. Bir yanıt birden fazla alt sistem tarafından işlenebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_responses_processed_per_host_total counter
wallarm_gonode_http_inspector_responses_processed_per_host_total{aggregate="sum",host="",source="proton"} 0
# HELP wallarm_gonode_http_inspector_responses_processed_total Farklı denetleyici alt sistemleri tarafından işlenen yanıtların toplamı. Bir yanıt birden fazla alt sistem tarafından işlenebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_responses_processed_total counter
wallarm_gonode_http_inspector_responses_processed_total{aggregate="sum",source="proton"} 0
# HELP wallarm_gonode_http_inspector_ruleset_content_version Özel kural seti dosyasının içerik sürümü. İçindeki kurallardan herhangi birindeki her değişiklikle artar
# TYPE wallarm_gonode_http_inspector_ruleset_content_version gauge
wallarm_gonode_http_inspector_ruleset_content_version{aggregate="max"} 1938
wallarm_gonode_http_inspector_ruleset_content_version{aggregate="min"} 1938
# HELP wallarm_gonode_http_inspector_ruleset_format_version Özel kural seti dosyasının biçim sürümü
# TYPE wallarm_gonode_http_inspector_ruleset_format_version gauge
wallarm_gonode_http_inspector_ruleset_format_version{aggregate="max"} 58
wallarm_gonode_http_inspector_ruleset_format_version{aggregate="min"} 58
# HELP wallarm_gonode_http_inspector_step_container_is_overloaded Uygulama verileri aldığı hızdan daha hızlı işliyorsa kaplar aşırı yüklenmiş sayılmaz. 'type' etiketine bakın
# TYPE wallarm_gonode_http_inspector_step_container_is_overloaded gauge
wallarm_gonode_http_inspector_step_container_is_overloaded{type="channel:in"} 0
wallarm_gonode_http_inspector_step_container_is_overloaded{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_inspector_step_debug_container_len Şu anda çeşitli dahili veri yapılarındaki öğe sayısı. 'type' etiketine bakın
# TYPE wallarm_gonode_http_inspector_step_debug_container_len gauge
wallarm_gonode_http_inspector_step_debug_container_len{type="channel:in"} 0
wallarm_gonode_http_inspector_step_debug_container_len{type="channel:worker_out"} 0
# HELP wallarm_gonode_http_inspector_step_input_messages_total Bu ardışık düzen adımının giriş iletilerinin toplamı.
# TYPE wallarm_gonode_http_inspector_step_input_messages_total counter
wallarm_gonode_http_inspector_step_input_messages_total 18
# HELP wallarm_gonode_http_inspector_step_is_running Bu ardışık düzen adımının şu anda çalışıp çalışmadığını (1) veya durduğunu (0) gösteren işaret.
# TYPE wallarm_gonode_http_inspector_step_is_running gauge
wallarm_gonode_http_inspector_step_is_running 1
# HELP wallarm_gonode_http_inspector_step_output_messages_total Bu ardışık düzen adımının çıktı iletilerinin toplamı. 'msgtype', 'receiver' ve 'dropped' etiketlerine bakın.
# TYPE wallarm_gonode_http_inspector_step_output_messages_total counter
wallarm_gonode_http_inspector_step_output_messages_total{dropped="false",msgtype="MsgProtonSerializedRequest",reciever="0"} 3
wallarm_gonode_http_inspector_step_output_messages_total{dropped="true",msgtype="MsgProtonSerializedRequest",reciever="0"} 0
# HELP wallarm_gonode_http_inspector_threats_blocked_per_app_total Engellenen tehditlerin toplamı. Bir istek yalnızca bir denetleyici alt sistemi tarafından engellenebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_threats_blocked_per_app_total counter
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="apifw"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="proton"} 0
wallarm_gonode_http_inspector_threats_blocked_per_app_total{aggregate="sum",application_id="-1",source="vpatch"} 0
# HELP wallarm_gonode_http_inspector_threats_blocked_per_host_total Engellenen tehditlerin toplamı. Bir istek yalnızca bir denetleyici alt sistemi tarafından engellenebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_threats_blocked_per_host_total counter
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="apifw"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="proton"} 0
wallarm_gonode_http_inspector_threats_blocked_per_host_total{aggregate="sum",host="",source="vpatch"} 0
# HELP wallarm_gonode_http_inspector_threats_blocked_total Engellenen tehditlerin toplamı. Bir istek yalnızca bir denetleyici alt sistemi tarafından engellenebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_threats_blocked_total counter
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="apifw"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="proton"} 0
wallarm_gonode_http_inspector_threats_blocked_total{aggregate="sum",source="vpatch"} 0
# HELP wallarm_gonode_http_inspector_threats_found_per_app_total Farklı denetleyici alt sistemleri tarafından bulunan tehditlerin toplamı. Bir istek birden fazla şekilde tehdit olarak değerlendirilebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_threats_found_per_app_total counter
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="anything"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="apifw"} 0
wallarm_gonode_http_inspector_threats_found_per_app_total{aggregate="sum",application_id="-1",source="proton"} 0
# HELP wallarm_gonode_http_inspector_threats_found_per_host_total Farklı denetleyici alt sistemleri tarafından bulunan tehditlerin toplamı. Bir istek birden fazla şekilde tehdit olarak değerlendirilebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_threats_found_per_host_total counter
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="anything"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="apifw"} 0
wallarm_gonode_http_inspector_threats_found_per_host_total{aggregate="sum",host="",source="proton"} 0
# HELP wallarm_gonode_http_inspector_threats_found_total Farklı denetleyici alt sistemleri tarafından bulunan tehditlerin toplamı. Bir istek birden fazla şekilde tehdit olarak değerlendirilebilir. 'source' etiketine bakın.
# TYPE wallarm_gonode_http_inspector_threats_found_total counter
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="acl_blacklist"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="acl_greylist"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="anything"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="apifw"} 0
wallarm_gonode_http_inspector_threats_found_total{aggregate="sum",source="proton"} 0
# HELP wallarm_gonode_postanalytics_exporter_connections postanalytics'e mevcut bağlantı sayısı. Her postanalytics düğümü için bir bağlantı.
# TYPE wallarm_gonode_postanalytics_exporter_connections gauge
wallarm_gonode_postanalytics_exporter_connections 1
# HELP wallarm_gonode_postanalytics_exporter_container_is_overloaded Uygulama verileri aldığı hızdan daha hızlı işliyorsa kaplar aşırı yüklenmiş sayılmaz. 'type' etiketine bakın
# TYPE wallarm_gonode_postanalytics_exporter_container_is_overloaded gauge
wallarm_gonode_postanalytics_exporter_container_is_overloaded{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_debug_container_len Şu anda çeşitli dahili veri yapılarındaki öğe sayısı. 'type' etiketine bakın
# TYPE wallarm_gonode_postanalytics_exporter_debug_container_len gauge
wallarm_gonode_postanalytics_exporter_debug_container_len{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_errors_total Çeşitli hata sayaçları. 'type' etiketine bakın
# TYPE wallarm_gonode_postanalytics_exporter_errors_total counter
wallarm_gonode_postanalytics_exporter_errors_total{type="SubmitConnect"} 6
wallarm_gonode_postanalytics_exporter_errors_total{type="SubmitResp"} 0
# HELP wallarm_gonode_postanalytics_exporter_serialized_requests_dropped_total Hatalar nedeniyle düşürülen serileştirilmiş isteklerin toplam sayısı.
# TYPE wallarm_gonode_postanalytics_exporter_serialized_requests_dropped_total counter
wallarm_gonode_postanalytics_exporter_serialized_requests_dropped_total 3
# HELP wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period Son zaman aralığında postanalytics'e dışa aktarılan serileştirilmiş istek sayısı. 'period' etiketine bakın.
# TYPE wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period gauge
wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period{period="1m"} 0
wallarm_gonode_postanalytics_exporter_serialized_requests_exported_per_period{period="1s"} 0
# HELP wallarm_gonode_postanalytics_exporter_serialized_requests_exported_total postanalytics'e dışa aktarılan serileştirilmiş isteklerin toplam sayısı.
# TYPE wallarm_gonode_postanalytics_exporter_serialized_requests_exported_total counter
wallarm_gonode_postanalytics_exporter_serialized_requests_exported_total 0
# HELP wallarm_gonode_postanalytics_exporter_step_container_is_overloaded Uygulama verileri aldığı hızdan daha hızlı işliyorsa kaplar aşırı yüklenmiş sayılmaz. 'type' etiketine bakın
# TYPE wallarm_gonode_postanalytics_exporter_step_container_is_overloaded gauge
wallarm_gonode_postanalytics_exporter_step_container_is_overloaded{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_step_debug_container_len Şu anda çeşitli dahili veri yapılarındaki öğe sayısı. 'type' etiketine bakın
# TYPE wallarm_gonode_postanalytics_exporter_step_debug_container_len gauge
wallarm_gonode_postanalytics_exporter_step_debug_container_len{type="channel:in"} 0
# HELP wallarm_gonode_postanalytics_exporter_step_input_messages_total Bu ardışık düzen adımının giriş iletilerinin toplamı.
# TYPE wallarm_gonode_postanalytics_exporter_step_input_messages_total counter
wallarm_gonode_postanalytics_exporter_step_input_messages_total 3
# HELP wallarm_gonode_postanalytics_exporter_step_is_running Bu ardışık düzen adımının şu anda çalışıp çalışmadığını (1) veya durduğunu (0) gösteren işaret.
# TYPE wallarm_gonode_postanalytics_exporter_step_is_running gauge
wallarm_gonode_postanalytics_exporter_step_is_running 1
# HELP wallarm_gonode_process_cpu_seconds_total Kullanıcı ve sistem CPU'sunda harcanan toplam süre (saniye).
# TYPE wallarm_gonode_process_cpu_seconds_total counter
wallarm_gonode_process_cpu_seconds_total 1.56
# HELP wallarm_gonode_process_max_fds Açık dosya tanıtıcılarının azami sayısı.
# TYPE wallarm_gonode_process_max_fds gauge
wallarm_gonode_process_max_fds 524287
# HELP wallarm_gonode_process_network_receive_bytes_total Süreç tarafından ağ üzerinden alınan bayt sayısı.
# TYPE wallarm_gonode_process_network_receive_bytes_total counter
wallarm_gonode_process_network_receive_bytes_total 2.53529454e+08
# HELP wallarm_gonode_process_network_transmit_bytes_total Süreç tarafından ağ üzerinden gönderilen bayt sayısı.
# TYPE wallarm_gonode_process_network_transmit_bytes_total counter
wallarm_gonode_process_network_transmit_bytes_total 1.9418293e+07
# HELP wallarm_gonode_process_open_fds Açık dosya tanıtıcılarının sayısı.
# TYPE wallarm_gonode_process_open_fds gauge
wallarm_gonode_process_open_fds 20
# HELP wallarm_gonode_process_resident_memory_bytes Yerleşik bellek boyutu (bayt).
# TYPE wallarm_gonode_process_resident_memory_bytes gauge
wallarm_gonode_process_resident_memory_bytes 1.67747584e+08
# HELP wallarm_gonode_process_start_time_seconds Sürecin başlangıç zamanı, Unix epoch'tan itibaren saniye cinsinden.
# TYPE wallarm_gonode_process_start_time_seconds gauge
wallarm_gonode_process_start_time_seconds 1.75398672336e+09
# HELP wallarm_gonode_process_virtual_memory_bytes Sanal bellek boyutu (bayt).
# TYPE wallarm_gonode_process_virtual_memory_bytes gauge
wallarm_gonode_process_virtual_memory_bytes 1.98490112e+09
# HELP wallarm_gonode_process_virtual_memory_max_bytes Kullanılabilir sanal belleğin azami miktarı (bayt).
# TYPE wallarm_gonode_process_virtual_memory_max_bytes gauge
wallarm_gonode_process_virtual_memory_max_bytes 1.8446744073709552e+19
```

<style>
    .prom-metrics-output pre>code {
        max-height: 1000px;
        overflow-y: auto;
    }
</style>