# NGINX tabanlı Ingress Controller İzleme

--8<-- "../include/ingress-controller-best-practices-intro.md"

NGINX Ingress Controller izlemenin genel yönleri internette zaten kapsamlı bir şekilde ele alınmıştır. Wallarm, kritik öneme sahip bir ortamda izlenmesi gereken ek bir izleme metrikleri kümesi sağlar. `/wallarm-metrics` metrik servisi varsayılan olarak devre dışıdır.

Servisi etkinleştirmek için `controller.wallarm.metrics.enabled` değerini `true` olarak ayarlayın:

```
controller:
  wallarm:
    metrics:
      enabled: true
```

Aşağıda, yeni açığa çıkarılan uç nokta üzerinden erişilebilen Prometheus formatındaki Wallarm’a özgü metriklerin listesi bulunmaktadır:

```
# HELP wallarm_requests istek sayısı
# TYPE wallarm_requests gauge
wallarm_requests 2
# HELP wallarm_messages istek sayısı
# TYPE wallarm_messages gauge
wallarm_messages 0
# HELP wallarm_attacks saldırı istek sayısı
# TYPE wallarm_attacks gauge
wallarm_attacks 0
# HELP wallarm_blocked engellenen istek sayısı
# TYPE wallarm_blocked gauge
wallarm_blocked 0
# HELP wallarm_blocked_by_acl ACL tarafından engellenen istek sayısı
# TYPE wallarm_blocked_by_acl gauge
wallarm_blocked_by_acl 0
# HELP wallarm_acl_allow_list allow list tarafından geçirilen istek sayısı
# TYPE wallarm_acl_allow_list gauge
wallarm_acl_allow_list 0
# HELP wallarm_abnormal anormal istek sayısı
# TYPE wallarm_abnormal gauge
wallarm_abnormal 2
# HELP wallarm_tnt_errors wstore yazma hatası sayısı
# TYPE wallarm_tnt_errors gauge
wallarm_tnt_errors 0
# HELP wallarm_api_errors API yazma hatası sayısı
# TYPE wallarm_api_errors gauge
wallarm_api_errors 0
# HELP wallarm_requests_lost kaybolan istek sayısı
# TYPE wallarm_requests_lost gauge
wallarm_requests_lost 0
# HELP wallarm_overlimits_time overlimits_time sayısı
# TYPE wallarm_overlimits_time gauge
wallarm_overlimits_time 0
# HELP wallarm_segfaults segmentation fault sayısı
# TYPE wallarm_segfaults gauge
wallarm_segfaults 0
# HELP wallarm_memfaults vmem sınırına ulaşma olay sayısı
# TYPE wallarm_memfaults gauge
wallarm_memfaults 0
# HELP wallarm_softmemfaults istek bellek sınırına ulaşma olay sayısı
# TYPE wallarm_softmemfaults gauge
wallarm_softmemfaults 0
# HELP wallarm_proton_errors libproton’da bellekle ilişkili olmayan hatalar olay sayısı
# TYPE wallarm_proton_errors gauge
wallarm_proton_errors 0
# HELP wallarm_time_detect_seconds tespit için harcanan süre
# TYPE wallarm_time_detect_seconds gauge
wallarm_time_detect_seconds 0
# HELP wallarm_db_id proton.db dosya kimliği
# TYPE wallarm_db_id gauge
wallarm_db_id 71
# HELP wallarm_lom_id LOM dosya kimliği
# TYPE wallarm_lom_id gauge
wallarm_lom_id 386
# HELP wallarm_custom_ruleset_id Custom Ruleset dosya kimliği
# TYPE wallarm_custom_ruleset_id gauge
wallarm_custom_ruleset_id{format="51"} 386
# HELP wallarm_custom_ruleset_ver Custom Ruleset dosya formatı sürümü
# TYPE wallarm_custom_ruleset_ver gauge
wallarm_custom_ruleset_ver 51
# HELP wallarm_db_apply_time proton.db dosya uygulanma zamanı kimliği
# TYPE wallarm_db_apply_time gauge
wallarm_db_apply_time 1674548649
# HELP wallarm_lom_apply_time LOM dosya uygulanma zamanı
# TYPE wallarm_lom_apply_time gauge
wallarm_lom_apply_time 1674153198
# HELP wallarm_custom_ruleset_apply_time Custom Ruleset dosya uygulanma zamanı
# TYPE wallarm_custom_ruleset_apply_time gauge
wallarm_custom_ruleset_apply_time 1674153198
# HELP wallarm_proton_instances proton örnek sayısı
# TYPE wallarm_proton_instances gauge
wallarm_proton_instances{status="success"} 5
wallarm_proton_instances{status="fallback"} 0
wallarm_proton_instances{status="failed"} 0
# HELP wallarm_stalled_worker_time_seconds bir worker’ın libproton içinde takılı kaldığı süre
# TYPE wallarm_stalled_worker_time_seconds gauge
wallarm_stalled_worker_time_seconds{pid="3169104"} 25

# HELP wallarm_startid benzersiz başlangıç kimliği
# TYPE wallarm_startid gauge
wallarm_startid 3226376659815907920
```

İzleme kurulumu ve mevcut metriklerin listesi hakkında ayrıntılı bilgi bu [belgelendirmede](../../../configure-statistics-service.md) sağlanmaktadır.