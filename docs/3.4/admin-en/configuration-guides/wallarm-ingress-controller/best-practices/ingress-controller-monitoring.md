# Ingress Controller Monitoring

--8<-- "../include/ingress-controller-best-practices-intro.md"

The general aspects of NGINX Ingress controller monitoring are already well covered on the Internet. Wallarm provides an additional set of monitoring metrics that should be enabled and monitored in a mission-critical environment. The `controller.wallarm.metrics` attribute of `values.yaml` enables the `/wallarm-metrics` metrics endpoint of the Ingress controller: 
```
controller:
  wallarm:
    metrics:
      enabled: true
      
      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"
```

To set the attribute, it is recommended to use the `--set` option of the commands `helm install` or `helm upgrade`, for example:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.wallarm.metrics.enabled=true <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.metrics.enabled=true <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

The following is a list of Wallarm-specific metrics in Prometheus format available via the newly exposed endpoint:

```
# HELP wallarm_requests requests count
# TYPE wallarm_requests gauge
wallarm_requests 5
# HELP wallarm_attacks attack requests count
# TYPE wallarm_attacks gauge
wallarm_attacks 5
# HELP wallarm_blocked blocked requests count
# TYPE wallarm_blocked gauge
wallarm_blocked 5
# HELP wallarm_abnormal abnormal requests count
# TYPE wallarm_abnormal gauge
wallarm_abnormal 5
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
wallarm_db_id 9
# HELP wallarm_lom_id LOM file id
# TYPE wallarm_lom_id gauge
wallarm_lom_id 38
# HELP wallarm_proton_instances proton instances count
# TYPE wallarm_proton_instances gauge
wallarm_proton_instances{status="success"} 4
wallarm_proton_instances{status="fallback"} 0
wallarm_proton_instances{status="failed"} 0
# HELP wallarm_stalled_worker_time_seconds time a worker stalled in libproton
# TYPE wallarm_stalled_worker_time_seconds gauge
```

Detailed information about monitoring setup and the list of available metrics is provided in this [documentation](../../../monitoring/intro.md).
