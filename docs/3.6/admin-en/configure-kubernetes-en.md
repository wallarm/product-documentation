[link-helm-chart-details]:  https://github.com/wallarm/ingress-chart#configuration

# Fine‑tuning of NGINX-based Wallarm Ingress Controller

Learn fine-tuning options available for the Wallarm Ingress controller to get the most out of the Wallarm solution.

!!! info "Official documentation for NGINX Ingress Controller"
    The fine‑tuning of Wallarm Ingress Controller is quite similar to that of NGINX Ingress Controller described in the [official documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/). When working with Wallarm, all options for setting up the original NGINX Ingress Controller are available.

## Additional Settings for Helm Chart

The settings are defined in the [`values.yaml`](https://github.com/wallarm/ingress-chart/blob/master/wallarm-ingress/values.yaml) file. By default, the file looks as follows:

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
```

To change this setting, we recommend using the option `--set` of `helm install` (if installing the Ingress controller) or `helm upgrade` (if updating the installed Ingress controller parameters). For example:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

A description of the main parameters you can set up is provided below. Other parameters come with default value and rarely need to be changed; their descriptions are provided at this [link][link-helm-chart-details].

### controller.wallarm.enabled

Allows you to enable or disable Wallarm functions.

**Default value**: `false`

### controller.wallarm.apiHost

Wallarm API endpoint. Can be:
* `api.wallarm.com` for the [EU cloud](../about-wallarm/overview.md#eu-cloud),
* `us1.api.wallarm.com` for the [US cloud](../about-wallarm/overview.md#us-cloud).

**Default value**: `api.wallarm.com`

### controller.wallarm.token

The *Wallarm Node* token is created on the Wallarm portal in the [EU](https://my.wallarm.com/nodes) or [US](https://us1.my.wallarm.com/nodes) cloud. It is required to access to Wallarm API.

**Default value**: `not specified`

### controller.wallarm.tarantool.replicaCount

The number of running pods for postanalytics. Postanalytics is used for the behavior‑based attack detection.

**Default value**: `1`

### controller.wallarm.tarantool.arena

Specifies the amount of memory allocated for postanalytics service. It is recommended to set up a value sufficient to store requests data for the last 5-15 minutes.

**Default value**: `0.2`

### controller.wallarm.metrics.enabled

This switch [toggles](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) information and metrics collection. If [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) is installed in the Kubernetes cluster, no additional configuration is required.

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

## Ingress Annotations

These annotations are used for setting up parameters for processing individual instances of Ingress.

[Besides the standard ones](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/), the following additional annotations are supported:

* [nginx.ingress.kubernetes.io/wallarm-mode](configure-parameters-en.md#wallarm_mode), default: `"off"`
* [nginx.ingress.kubernetes.io/wallarm-mode-allow-override](configure-parameters-en.md#wallarm_mode_allow_override)
* [nginx.ingress.kubernetes.io/wallarm-fallback](configure-parameters-en.md#wallarm_fallback)
* [nginx.ingress.kubernetes.io/wallarm-application](configure-parameters-en.md#wallarm_application)
* [nginx.ingress.kubernetes.io/wallarm-block-page](configure-parameters-en.md#wallarm_block_page)
* [nginx.ingress.kubernetes.io/wallarm-parse-response](configure-parameters-en.md#wallarm_parse_response)
* [nginx.ingress.kubernetes.io/wallarm-parse-websocket](configure-parameters-en.md#wallarm_parse_websocket)
* [nginx.ingress.kubernetes.io/wallarm-unpack-response](configure-parameters-en.md#wallarm_unpack_response)
* [nginx.ingress.kubernetes.io/wallarm-parser-disable](configure-parameters-en.md#wallarm_parser_disable)

### Applying annotation to the Ingress resource

To apply the settings to your Ingress, please use the following command:

```
kubectl annotate --overwrite ingress YOUR_INGRESS_NAME ANNOTATION_NAME=VALUE
```

* `YOUR_INGRESS_NAME` is the name of your Ingress,
* `ANNOTATION_NAME` is the name of the annotation from the list above,
* `VALUE` is the value of the annotation from the list above.

### Annotation examples

#### Configuring the blocking page and error code

The annotation `nginx.ingress.kubernetes.io/wallarm-block-page` is used to configure the blocking page and error code returned in the response to the request blocked for the following reasons:

* Request contains malicious payloads of the following types: [input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md).
* Request containing malicious payloads from the list above is originated from [graylisted IP address](../user-guides/ip-lists/graylist.md) and the node filters requests in the safe blocking [mode](configure-wallarm-mode.md).
* Request is originated from the [denylisted IP address](../user-guides/ip-lists/denylist.md).

For example, to return the default Wallarm blocking page and the error code 445 in the response to any blocked request:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[More details on the blocking page and error code configuration methods →](configuration-guides/configure-block-page-and-code.md)

#### Enabling attack analysis with libdetection

The [**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection) library additionally validates attacks detected by the library [**libproton**](../about-wallarm/protecting-against-attacks.md#library-libproton). Using **libdetection** ensures the double‑detection of attacks and reduces the number of false positives.

To allow **libdetection** to parse and check the request body, buffering of a client request body must be enabled ([`proxy_request_buffering on`](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_request_buffering)).

There are two options to enable attack analysis with **libdetection**:

* Applying the following [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) annotation to the Ingress resource:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection on; proxy_request_buffering on;"
    ```
* Pass the parameter `controller.config.server-snippet` to the Helm chart:

    === "Ingress controller installation"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection on; proxy_request_buffering on;' <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        There are also [other parameters](#additional-settings-for-helm-chart) required for correct Ingress controller installation. Please pass them in the `--set` option too.
    === "Updating Ingress controller parameters"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection on; proxy_request_buffering on;' <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```