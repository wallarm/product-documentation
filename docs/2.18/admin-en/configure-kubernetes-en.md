[link-helm-chart-details]:  https://github.com/wallarm/ingress-chart#configuration

# Fine‑tuning of NGINX-based Wallarm Ingress Controller

Learn fine-tuning options available for the Wallarm Ingress controller to get the most out of the Wallarm solution.

!!! info "Official documentation for NGINX Ingress Controller"
    The fine‑tuning of Wallarm Ingress Controller is quite similar to that of NGINX Ingress Controller described in the [official documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/). When working with Wallarm, all options for setting up the original NGINX Ingress Controller are available.

## Additional Settings for Helm Chart

The settings are performed via the `values.yaml` file. By default, the file looks as follows:

```
controller:
  wallarm:
    enabled: false
    apiHost: api.wallarm.com
    apiPort: 444
    apiSSL: true
    token: ""
    tarantool:
      kind: Deployment
      service:
        annotations: {}
      replicaCount: 1
      arena: "0.2"
      livenessProbe:
        failureThreshold: 3
        initialDelaySeconds: 10
        periodSeconds: 10
        successThreshold: 1
        timeoutSeconds: 1
      resources: {}
    metrics:
      enabled: false

      service:
        annotations:
          prometheus.io/scrape: "true"
          prometheus.io/path: /wallarm-metrics
          prometheus.io/port: "18080"

        ## List of IP addresses at which the stats-exporter service is available
        ## Ref: https://kubernetes.io/docs/user-guide/services/#external-ips
        ##
        externalIPs: []

        loadBalancerIP: ""
        loadBalancerSourceRanges: []
        servicePort: 9913
        type: ClusterIP
    synccloud:
      resources: {}
    collectd:
      resources: {}
    acl:
      enabled: false
      resources: {}
```

A description of the main parameters you can set up is provided below. Other parameters come with default value and rarely need to be changed; their descriptions are provided at this [link][link-helm-chart-details].

### wallarm.enabled

Allows you to enable or disable Wallarm functions.

**Default value**: `false`

### wallarm.apiHost

Wallarm API endpoint. Can be:
* `api.wallarm.com` for the [EU cloud](../about-wallarm/overview.md#eu-cloud),
* `us1.api.wallarm.com` for the [US cloud](../about-wallarm/overview.md#us-cloud).

**Default value**: `api.wallarm.com`

### wallarm.token

The *Wallarm Node* token is created on the Wallarm portal in the [EU](https://my.wallarm.com/nodes) or [US](https://us1.my.wallarm.com/nodes) cloud. It is required to access to Wallarm API.

**Default value**: `not specified`

### wallarm.tarantool.replicaCount

The number of running pods for postanalytics. Postanalytics is used for the behavior‑based attack detection.

**Default value**: `1`

### wallarm.tarantool.arena

Specifies the amount of memory allocated for postanalytics service. It is recommended to set up a value sufficient to store requests data for the last 5-15 minutes.

**Default value**: `0.2`

### wallarm.metrics.enabled

This switch toggles information and metrics collection. If [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) is installed in the Kubernetes cluster, no additional configuration is required.

**Default value**: `false`

## Global Controller Settings 

Implemented via [ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/).

Besides the standard ones, the following additional parameters are supported:

* `enable-wallarm` - enables the Wallarm module in NGINX
* [wallarm-upstream-connect-attempts](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-upstream-reconnect-interval](configure-parameters-en.md#wallarm_tarantool_upstream)
* [wallarm-process-time-limit](configure-parameters-en.md#wallarm_process_time_limit)
* [wallarm-process-time-limit-block](configure-parameters-en.md#wallarm_process_time_limit_block)
* [wallarm-request-memory-limit](configure-parameters-en.md#wallarm_request_memory_limit)
* `enable-wallarm-acl` - enables blocking by IP addresses [specified](../user-guides/denylist.md) in your Wallarm account
* [wallarm-acl-mapsize](configure-parameters-en.md#wallarm_acl_mapsize)

## Ingress Annotations

These annotations are used for setting up parameters for processing individual instances of Ingress.

[Besides the standard ones](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/), the following additional annotations are supported:

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode), default: `"off"`
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-instance](configure-parameters-en.md#wallarm_instance)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)
* [nginx.ingress.kubernetes.io/wallarm-acl](configure-parameters-en.md#wallarm_acl)
* [nginx.ingress.kubernetes.io/wallarm-acl-block-page](configure-parameters-en.md#wallarm_acl_block_page)

### Applying annotation to the Ingress resource

To apply the settings to your Ingress, please use the following command:

```
kubectl annotate --overwrite ingress YOUR_INGRESS_NAME ANNOTATION_NAME=VALUE
```

* `YOUR_INGRESS_NAME` is the name of your Ingress,
* `ANNOTATION_NAME` is the name of the annotation from the list above,
* `VALUE` is the value of the annotation from the list above.

### Annotation examples

#### Enabling IP blocking

To enable IP blocking, [create](../user-guides/denylist.md) the addresses list in your Wallarm account and execute the following command:

```
kubectl annotate --overwrite ingress YOUR_INGRESS_NAME nginx.ingress.kubernetes.io/wallarm-acl=on
```

#### Configuring the blocking page and error code

Annotations used for the blocking page and error code configuration depend on the reason and method of blocking the requests:

* `nginx.ingress.kubernetes.io/wallarm-block-page` is used if the request is [blocked](configure-wallarm-mode.md) by the filtering node due to detected attack signs
* `nginx.ingress.kubernetes.io/wallarm-acl-block-page` is used if the request is originated from a [blocked IP address](configure-ip-blocking-en.md)

For example, to return the default Wallarm blocking page and the error code 445 in the response to the blocked request:

=== "Request with attack signs"
    ``` bash
    kubectl annotate ingress <YOUR_INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page='&/usr/share/nginx/html/wallarm_blocked.html response_code=445'
    ```
=== "Request originated from a blocked IP address"
    ``` bash
    kubectl annotate ingress <YOUR_INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-acl-block-page='&/usr/share/nginx/html/wallarm_blocked.html response_code=445'
    ```

[More details on the blocking page and error code configuration methods →](configuration-guides/configure-block-page-and-code.md)

!!! info "Separating the blocking page path and error code with a comma"
    To separate the blocking page path and error code in the Ingress annotation value, you can use a comma instead of space. For example:

    === "Request with attack signs"
        ``` bash
        kubectl annotate ingress <YOUR_INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page='&/usr/share/nginx/html/wallarm_blocked.html,response_code=445'
        ```
    === "Request originated from a blocked IP address"
        ``` bash
        kubectl annotate ingress <YOUR_INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-acl-block-page='&/usr/share/nginx/html/wallarm_blocked.html,response_code=445'
        ```

#### Enabling attack analysis with libdetection

The [**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection) library additionally validates attacks detected by the library [**libproton**](../about-wallarm/protecting-against-attacks.md#library-libproton). Using **libdetection** ensures the double‑detection of attacks and reduces the number of false positives.

To allow **libdetection** to parse and check the request body, buffering of a client request body must be enabled ([`proxy_request_buffering on`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering)).

There are two options to enable attack analysis with **libdetection**:

* Applying the following [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) annotation to the Ingress resource:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection on; proxy_request_buffering on;"
    ```
* Adding the following snippet to the [`config`](https://github.com/wallarm/ingress-chart/blob/master/wallarm-ingress/values.yaml#L20) object in **values.yaml** of the [cloned Wallarm Helm chart repository](installation-kubernetes-en.md#step-1-installing-the-wallarm-ingress-controller):

    ```bash
    config: {
        server-snippet: 'wallarm_enable_libdetection on; proxy_request_buffering on;'
    }
    ```