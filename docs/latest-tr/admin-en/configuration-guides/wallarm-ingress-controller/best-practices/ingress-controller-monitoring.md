# NGINX Tabanlı Ingress Controller İzlemesi

--8<-- "../include/ingress-controller-best-practices-intro.md"

NGINX Ingress controller izlemenin genel yönleri internet üzerinde zaten iyi bir şekilde ele alınmıştır. Wallarm, iş kritik bir ortamda izlenmesi gereken ek bir metrik seti sunar. `/wallarm-metrics` metrik hizmeti varsayılan olarak devre dışı bırakılmıştır.

Hizmeti etkinleştirmek için, `controller.wallarm.metrics.enabled`'ı `true` olarak ayarlayın:

```
controller:
  wallarm:
    metrics:
      enabled: true
```

Aşağıdaki, yeni açığa çıkan uç nokta üzerinden uygun olan Wallarm'a özgü Prometheus formatında metriklerin listesidir:

```
# HELP wallarm_requests isteklerin sayısı
# TYPE wallarm_requests gauge
wallarm_requests 2
# HELP wallarm_attacks saldırı isteklerinin sayısı
# TYPE wallarm_attacks gauge
wallarm_attacks 0
# HELP wallarm_blocked engellenen isteklerin sayısı
# TYPE wallarm_blocked gauge
wallarm_blocked 0
# HELP wallarm_blocked_by_acl ACL tarafından engellenen isteklerin sayısı
# TYPE wallarm_blocked_by_acl gauge
wallarm_blocked_by_acl 0
# HELP wallarm_acl_allow_list izin listesi tarafından geçirilen istekler
# TYPE wallarm_acl_allow_list gauge
wallarm_acl_allow_list 0
# HELP wallarm_abnormal anormal isteklerin sayısı
# TYPE wallarm_abnormal gauge
wallarm_abnormal 2
# HELP wallarm_tnt_errors tarantool yazma hatalarının sayısı
# TYPE wallarm_tnt_errors gauge
wallarm_tnt_errors 0
# HELP wallarm_api_errors API yazma hatalarının sayısı
# TYPE wallarm_api_errors gauge
wallarm_api_errors 0
# HELP wallarm_requests_lost kaybolan isteklerin sayısı
# TYPE wallarm_requests_lost gauge
wallarm_requests_lost 0
# HELP wallarm_overlimits_time aşırı sınırların zaman sayısı
# TYPE wallarm_overlimits_time gauge
wallarm_overlimits_time 0
# HELP wallarm_segfaults bölüm hatalarının sayısı
# TYPE wallarm_segfaults gauge
wallarm_segfaults 0
# HELP wallarm_memfaults vmem limit olayları sayısı
# TYPE wallarm_memfaults gauge
wallarm_memfaults 0
# HELP wallarm_softmemfaults istek bellek limiti olayları sayısı
# TYPE wallarm_softmemfaults gauge
wallarm_softmemfaults 0
# HELP wallarm_proton_errors bellek ile ilgili olmayan libproton hataları olayları sayısı
# TYPE wallarm_proton_errors gauge
wallarm_proton_errors 0
# HELP wallarm_time_detect_seconds tespit etmek için harcanan zaman
# TYPE wallarm_time_detect_seconds gauge
wallarm_time_detect_seconds 0
# HELP wallarm_db_id proton.db dosya kimliği
# TYPE wallarm_db_id gauge
wallarm_db_id 71
# HELP wallarm_lom_id LOM dosya kimliği
# TYPE wallarm_lom_id gauge
wallarm_lom_id 386
# HELP wallarm_custom_ruleset_id Özel Kural Kümesi dosya kimliği
# TYPE wallarm_custom_ruleset_id gauge
wallarm_custom_ruleset_id{format="51"} 386
# HELP wallarm_custom_ruleset_ver özel kural kümesi dosya biçim versiyonu
# TYPE wallarm_custom_ruleset_ver gauge
wallarm_custom_ruleset_ver 51
# HELP wallarm_db_apply_time proton.db dosya uygulama zamanı kimliği
# TYPE wallarm_db_apply_time gauge
wallarm_db_apply_time 1674548649
# HELP wallarm_lom_apply_time LOM dosya uygulama zamanı
# TYPE wallarm_lom_apply_time gauge
wallarm_lom_apply_time 1674153198
# HELP wallarm_custom_ruleset_apply_time Özel Kural Kümesi dosya uygulama zamanı
# TYPE wallarm_custom_ruleset_apply_time gauge
wallarm_custom_ruleset_apply_time 1674153198
# HELP wallarm_proton_instances proton örneklerinin sayısı
# TYPE wallarm_proton_instances gauge
wallarm_proton_instances{status="success"} 5
wallarm_proton_instances{status="fallback"} 0
wallarm_proton_instances{status="failed"} 0
# HELP wallarm_stalled_worker_time_seconds libproton'da duraklatılan işçinin zamanı
# TYPE wallarm_stalled_worker_time_seconds gauge
wallarm_stalled_worker_time_seconds{pid="3169104"} 25

# HELP wallarm_startid unique start id
# TYPE wallarm_startid gauge
wallarm_startid 3226376659815907920
```

İzleme kurulumu ve mevcut metriklerin listesi hakkında ayrıntılı bilgiler bu [dokümantasyon](../../../monitoring/intro.md)da sağlanmaktadır.