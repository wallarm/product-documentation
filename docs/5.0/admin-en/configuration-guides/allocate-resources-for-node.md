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

### Allocating resources if using NGINX-based Docker image

The sizing of wstore memory is controlled using the `TARANTOOL_MEMORY_GB` [environment variable](../../admin-en/installation-docker-en.md) which is passed either in Docker run command or in mounted configuration file.

Example:

```
docker run -d -e WALLARM_API_TOKEN='XXXX' -e WALLARM_LABELS='group=<GROUP NAME>' -e NGINX_BACKEND='example.com' -e SLAB_ALLOC_ARENA=3.0 -p 80:80 wallarm/node:5.6.0
```

Note that when passing `TARANTOOL_MEMORY_GB` in Docker `run` command with the `-e` like in the example above, the variable is not recorded in any configuration file within the container, but it is still used when `wstore` starts.

Used value can be checked in `tarantool-out.log` filtering node log by searching for the `Setting up memory params` line.


### Allocating Resources in Other Deployment Options

The sizing of Tarantool memory is controlled using the `SLAB_ALLOC_ARENA` attribute in the `/etc/default/wallarm-tarantool` configuration file. To allocate memory:

<ol start="1"><li>Open for editing the configuration file of Tarantool:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo vim /etc/default/wallarm-tarantool
    ```
=== "CentOS 7.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo vim /etc/sysconfig/wallarm-tarantool
    ```

<ol start="2"><li>Set the <code>SLAB_ALLOC_ARENA</code> attribute to memory size. The value can be an integer or a float (a dot <code>.</code> is a decimal separator). For example:</li></ol>

```
SLAB_ALLOC_ARENA=1.0
```

<ol start="3"><li>Restart Tarantool:</li></ol>

=== "Debian 10.x (buster)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Debian 11.x (bullseye)"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Ubuntu 18.04 LTS (bionic)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 20.04 LTS (focal)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "Ubuntu 22.04 LTS (jammy)"
    ```bash
    sudo service wallarm-tarantool restart
    ```
=== "CentOS 7.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "Amazon Linux 2.0.2021x and lower"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "AlmaLinux, Rocky Linux or Oracle Linux 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```
=== "RHEL 8.x"
    ```bash
    sudo systemctl restart wallarm-tarantool
    ```

To learn how long a Tarantool instance is capable of keeping traffic details with the current level of filtering node load, you can use the [`wallarm-tarantool/gauge-timeframe_size`](../monitoring/available-metrics.md#time-of-storing-requests-in-the-postanalytics-module-in-seconds) monitoring metric.

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

If a Wallarm node consumes more memory and CPU than it was expected, to reduce resource usage, get familiar with the recommendations from the [CPU high usage troubleshooting](../../troubleshooting/performance.md#wallarm-node-consumes-too-much-cpu) article and follow them.
