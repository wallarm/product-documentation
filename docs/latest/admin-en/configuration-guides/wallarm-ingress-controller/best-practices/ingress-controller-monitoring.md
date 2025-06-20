# NGINX-based Ingress Controller Monitoring

--8<-- "../include/ingress-controller-best-practices-intro.md"

The general aspects of NGINX Ingress controller monitoring are already well covered on the Internet. Wallarm provides an additional set of monitoring metrics that should be monitored in a mission-critical environment. The `/wallarm-metrics` metrics service is disabled by default.

To enable the service, set `controller.wallarm.metrics.enabled` to `true`:

```
controller:
  wallarm:
    metrics:
      enabled: true
```

The following is a list of Wallarm-specific metrics in Prometheus format available via the newly exposed endpoint:

```
# HELP wallarm_requests requests count
# TYPE wallarm_requests gauge
wallarm_requests 2
# HELP wallarm_streams requests count
# TYPE wallarm_streams gauge
wallarm_streams 0
# HELP wallarm_messages requests count
# TYPE wallarm_messages gauge
wallarm_messages 0
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
# HELP wallarm_tnt_errors wstore write errors count
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

Detailed information about monitoring setup and the list of available metrics is provided in this [documentation](../../../configure-statistics-service.md).
