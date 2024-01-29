[link-helm-chart-details]:  https://github.com/wallarm/ingress-chart#configuration
[node-token-types]:         ../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation

# Fine‑tuning of NGINX-based Wallarm Ingress Controller

Learn fine-tuning options available for the Wallarm Ingress controller to get the most out of the Wallarm solution.

!!! info "Official documentation for NGINX Ingress Controller"
    The fine‑tuning of the Wallarm Ingress Controller is quite similar to that of the NGINX Ingress Controller described in the [official documentation](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/). When working with Wallarm, all options for setting up the original NGINX Ingress Controller are available.

## Additional Settings for Helm Chart

The settings are defined in the [`values.yaml`](https://github.com/wallarm/ingress-chart/blob/master/wallarm-ingress/values.yaml) file. By default, the file looks as follows:

```
controller:
  wallarm:
    enabled: false
    apiHost: api.wallarm.com
    apiPort: 443
    apiSSL: true
    token: ""
    nodeGroup: defaultIngressGroup
    existingSecret:
      enabled: false
      secretKey: token
      secretName: wallarm-api-token
    tarantool:
      kind: Deployment
      service:
        annotations: {}
      replicaCount: 1
      arena: "1.0"
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
        servicePort: 18080
        type: ClusterIP
    synccloud:
      resources: {}
    collectd:
      resources: {}
```

To change this setting, we recommend using the option `--set` of `helm install` (if installing the Ingress controller) or `helm upgrade` (if updating the installed Ingress controller parameters). For example:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.wallarm.enabled=true <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

A description of the main parameters you can set up is provided below. Other parameters come with default values and rarely need to be changed; their descriptions are provided at this [link][link-helm-chart-details].

### controller.wallarm.enabled

Allows you to enable or disable Wallarm functions.

**Default value**: `false`

### controller.wallarm.apiHost

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud](../about-wallarm/overview.md#us-cloud).
* `api.wallarm.com` for the [EU cloud](../about-wallarm/overview.md#eu-cloud),

**Default value**: `api.wallarm.com`

### controller.wallarm.token

A filtering node token value. It is required to access the Wallarm API.

The token can be one of these [types][node-token-types]:

* **API token (recommended)** - Ideal if you need to dynamically add/remove node groups for UI organization or if you want to control token lifecycle for added security. To generate an API token:

    To generate an API token:
    
    1. Go to Wallarm Console → **Settings** → **API tokens** in either the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Create an API token with the **Deploy** source role.
    1. During node deployment, use the generated token and specify the group name using the `controller.wallarm.nodeGroup` parameter. You can add multiple nodes to one group using different API tokens.
* **Node token** - Suitable when you already know the node groups that will be used.

    To generate a node token:
    
    1. Go to Wallarm Console → **Nodes** in either the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Create a node and name the node group.
    1. During node deployment, use the group's token for each node you want to include in that group.

The parameter is ignored if [`controller.wallarm.existingSecret.enabled: true`](#controllerwallarmexistingsecret).

**Default value**: `not specified`

### controller.wallarm.nodeGroup

Starting from Helm chart version 4.6.8, this specifies the name of the group of filtering nodes you want to add newly deployed nodes to. Node grouping this way is available only when you create and connect nodes to the Cloud using an API token with the **Deploy** role (its value is passed in the `controller.wallarm.token` parameter).

**Default value**: `defaultIngressGroup`

### controller.wallarm.existingSecret

Starting from the Helm chart version 4.4.1, you can use this configuration block to pull a Wallarm node token value from Kubernetes secrets. It is useful for environments with separate secret management (e.g. you use an external secrets operator).

To store the node token in K8s secrets and pull it to the Helm chart:

1. Create a Kubernetes secret with the Wallarm node token:

    ```bash
    kubectl -n <KUBERNETES_NAMESPACE> create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * `<KUBERNETES_NAMESPACE>` is the Kubernetes namespace you have created for the Helm release with Wallarm Ingress controller
    * `wallarm-api-token` is the Kubernetes secret name
    * `<WALLARM_NODE_TOKEN>` is the Wallarm node token value copied from the Wallarm Console UI

    If using some external secret operator, follow [appropriate documentation to create a secret](https://external-secrets.io).
1. Set the following configuration in `values.yaml`:

    ```yaml
    controller:
      wallarm:
        token: ""
        existingSecret:
          enabled: true
          secretKey: token
          secretName: wallarm-api-token
    ```

**Default value**: `existingSecret.enabled: false` that points to the Helm chart to get the Wallarm node token from `controller.wallarm.token`.

### controller.wallarm.tarantool.replicaCount

The number of running pods for postanalytics. Postanalytics is used for the behavior‑based attack detection.

**Default value**: `1`

### controller.wallarm.tarantool.arena

Specifies the amount of memory allocated for postanalytics service. It is recommended to set up a value sufficient to store request data for the last 5-15 minutes.

**Default value**: `0.2`

### controller.wallarm.metrics.enabled

This switch [toggles](configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md) information and metrics collection. If [Prometheus](https://github.com/helm/charts/tree/master/stable/prometheus) is installed in the Kubernetes cluster, no additional configuration is required.

**Default value**: `false`

<!--
### controller.wallarm.apifirewall

Controls the configuration of [API Policy Enforcement](../api-policy-enforcement/overview.md), available starting from release 4.10. By default, it is enabled and configured as shown below. If you are using this feature, it is recommended to keep these values unchanged.

```yaml
controller:
  wallarm:
    apiFirewall:
      ### Enable or disable API Firewall functionality (true|false)
      ###
      enabled: true
      config:
        mainPort: 18081
        healthPort: 18082
        specificationUpdatePeriod: 1m
        unknownParametersDetection: true
        #### TRACE|DEBUG|INFO|WARNING|ERROR
        logLevel: DEBUG
        ### TEXT|JSON
        logFormat: TEXT
      ...
```
-->

## Global Controller Settings 

Implemented via [ConfigMap](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/).

Besides the standard ones, the following additional parameters are supported:

* `enable-wallarm` - enables the Wallarm module in NGINX
* [wallarm-acl-export-enable](configure-parameters-en.md#wallarm_acl_export_enable)
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
* [nginx.ingress.kubernetes.io/wallarm-partner-client-uuid](configure-parameters-en.md#wallarm_partner_client_uuid)

### Applying annotation to the Ingress resource

To apply the settings to your Ingress, please use the following command:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>` is the name of your Ingress
* `<YOUR_INGRESS_NAMESPACE>` is the namespace of your Ingress
* `<ANNOTATION_NAME>` is the name of the annotation from the list above
* `<VALUE>` is the value of the annotation from the list above

### Annotation examples

#### Configuring the blocking page and error code

The annotation `nginx.ingress.kubernetes.io/wallarm-block-page` is used to configure the blocking page and error code returned in the response to the request blocked for the following reasons:

* Request contains malicious payloads of the following types: [input validation attacks](../about-wallarm/protecting-against-attacks.md#input-validation-attacks), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md).
* Request containing malicious payloads from the list above is originated from [graylisted IP address](../user-guides/ip-lists/overview.md) and the node filters requests in the safe blocking [mode](configure-wallarm-mode.md).
* Request is originated from the [denylisted IP address](../user-guides/ip-lists/overview.md).

For example, to return the default Wallarm blocking page and the error code 445 in the response to any blocked request:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[More details on the blocking page and error code configuration methods →](configuration-guides/configure-block-page-and-code.md)

#### Managing libdetection mode

!!! info "**libdetection** default mode"
    The default mode of the **libdetection** library is `on` (enabled).

You can control the [**libdetection**](../about-wallarm/protecting-against-attacks.md#library-libdetection) mode using one of the options:

* Applying the following [`nginx.ingress.kubernetes.io/server-snippet`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/annotations/#server-snippet) annotation to the Ingress resource:

    ```bash
    kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.ingress.kubernetes.io/server-snippet="wallarm_enable_libdetection on/off;"
    ```
* Pass the parameter `controller.config.server-snippet` to the Helm chart:

    === "Ingress controller installation"
        ```bash
        helm install --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        There are also [other parameters](#additional-settings-for-helm-chart) required for correct Ingress controller installation. Please pass them in the `--set` option too.
    === "Updating Ingress controller parameters"
        ```bash
        helm upgrade --reuse-values --set controller.config.server-snippet='wallarm_enable_libdetection on/off;' <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
