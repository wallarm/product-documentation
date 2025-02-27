# Allocating Resources for Wallarm NGINX Node

The amount of memory and CPU resources allocated for the Wallarm NGINX node determines the quality and speed of request processing. These instructions describe the recommendations for self-hosted NGINX node memory allocation.

In a filtering node there are two main memory and CPU consumers:

* [Tarantool](#tarantool), also called **postanalytics module**. This is the local data analytics backend and the primary memory consumer in a filtering node.
* [NGINX](#nginx) is the main filtering node and reverse proxy component.

NGINX CPU utilization depends on many factors like RPS level, average size of request and response, number of custom ruleset rules handled by the node, types and layers of employed data encodings like Base64 or data compression, etc.

On average, one CPU core can handle about 500 RPS. When running in production mode, it is recommended to allocate at least one CPU core for the NGINX process and one core for the Tarantool process. In the majority of cases it is recommended to initially over-provision a filtering node, see the actual CPU and memory usage for real production traffic levels, and gradually reduce allocated resources to a reasonable level (with at least 2x headroom for traffic spikes and node redundancy).

## Tarantool

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory.md"

### Allocating Resources in Kubernetes Ingress Controller

--8<-- "../include/allocate-resources-for-waf-node/tarantool-memory-ingress-controller.md"

### Allocating Resources if Using All-in-One Installer

The sizing of Tarantool memory is controlled using the `SLAB_ALLOC_ARENA` attribute in the `/opt/wallarm/env.list` configuration file. To allocate memory:

1. Open for editing the `/opt/wallarm/env.list` file:

    ```bash
    sudo vim /opt/wallarm/env.list
    ```
1. Set the `SLAB_ALLOC_ARENA` attribute to memory size. The value can be an integer or a float (a dot `.` is a decimal separator). For example:

    ```
    SLAB_ALLOC_ARENA=1.0
    ```
1. Restart the Wallarm services:

    ```
    sudo systemctl restart wallarm.service
    ```

## NGINX

NGINX memory consumption depends on many factors. On average it can be estimated as the following:

```
Number of concurrent request * Average request size * 3
```

For example:

* Filtering node is processing at peak 10000 concurrent requests,
* average request size is 5 kB.

The NGINX memory consumption can be estimated as follows:

```
10000 * 5 kB * 3 = 150000 kB (or ~150 MB)
```

**To allocate the amount of memory:**

* for the NGINX Ingress controller pod (`ingress-controller`), configure the following sections in the `values.yaml` file by using the `--set` option of `helm install` or `helm upgrade`:
    ```
    controller:
      resources:
        limits:
          cpu: 400m
          memory: 3280Mi
        requests:
          cpu: 200m
          memory: 1640Mi
    ```

    Example of commands changing the parameters:

    === "Ingress controller installation"
        ```bash
        helm install --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        There are also [other parameters](../configure-kubernetes-en.md#additional-settings-for-helm-chart) required for correct Ingress controller installation. Please pass them in the `--set` option too.
    === "Updating Ingress controller parameters"
        ```bash
        helm upgrade --reuse-values --set controller.resources.limits.cpu='2000m',controller.resources.limits.memory='3280Mi' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

* for other deployment options, use the NGINX configuration files.

## Troubleshooting

If a Wallarm node consumes more memory and CPU than it was expected, to reduce resource usage, get familiar with the recommendations from the [CPU high usage troubleshooting](../../faq/cpu.md) article and follow them.
