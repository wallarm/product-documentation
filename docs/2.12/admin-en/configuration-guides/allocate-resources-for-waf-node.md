[gauge-timeframe-docs]: ../monitoring/available-metrics.md#time-of-storing-requests-in-the-postanalytics-module-in-seconds

# Allocating Resources for WAF Node

The amount of memory allocated for the WAF node determines the quality and speed of request processing. These instructions describe the recommendations for WAF node memory allocation.

In a WAF node there are two main memory consumers:

* [Tarantool](#tarantool), also called **postanalytics module**. This is the local data analytics backend and the primary memory consumer in a WAF node.
* [NGINX](#nginx) is the main WAF node and reverse proxy component.

## Tarantool

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.md"

### Allocating Resources in Kubernetes Ingress Controller

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.md"

### Allocating Resources in Other Deployment Options

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-others-2.12.md"

## NGINX

NGINX memory consumption depends on many factors. On average it can be estimated as the following:

```
Number of concurrent request * Average request size * 3
```

For example:

* WAF node is processing at peak 10000 concurrent requests,
* average request size is 5 kB.

The NGINX memory consumption can be estimated as follows:

```
10000 * 5 kB * 3 = 150000 kB (or ~150 MB)
```

**To allocate the amount of memory:**

* for the NGINX Ingress controller pod (`ingress-controller`), use the following sections in the `values.yaml` file:
    ```
    controller:
      resources:
        limits:
          cpu: 1000m
          memory: 1640Mi
        requests:
          cpu: 1000m
          memory: 1640Mi
    ```
* for other deployment options, use the NGINX configuration files.

!!! info "Recommendations from the CPU utilization perspective"
    When running in production mode, it is recommended to allocate at least one CPU core for the NGINX process and one core for the Tarantool process.
    
    Actual NGINX CPU utilization depends on many factors like RPS level, average size of request and response, number of LOM rules handled by the node, types and layers of employed data encodings like Base64 or data compression, etc. On average, one CPU core can handle about 500 RPS. In the majority of cases it is recommended to initially over-provision a WAF node, see the actual CPU and memory usage for real production traffic levels, and gradually reduce allocated resources to a reasonable level (with at least 2x headroom for traffic spikes and node redundancy).
