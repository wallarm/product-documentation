[sidecar-upgrade-docs]:               ../../../updating-migrating/sidecar-proxy.md
[us-cloud-docs]:                      ../../../about-wallarm/overview.md#cloud
[eu-cloud-docs]:                      ../../../about-wallarm/overview.md#cloud
[configure-wallarm-mode-docs]:        ../../../admin-en/configure-wallarm-mode.md
[filtration-mode-priorities-docs]:    ../../../admin-en/configure-wallarm-mode.md#setting-up-priorities-of-filtration-mode-configuration-methods-using-wallarm_mode_allow_override
[libdetection-docs]:                  ../../../about-wallarm/protecting-against-attacks.md#libdetection-overview
[passive-detection-docs]:             ../../../about-wallarm/detecting-vulnerabilities.md#passive-detection
[subscriptions-docs]:                 ../../../about-wallarm/subscription-plans.md#waap-and-advanced-api-security
[active-threat-verification-docs]:    ../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification
[node-token-types]:                   ../../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation
[denylist-docs]:                      ../../../user-guides/ip-lists/overview.md
[denylist-view-events-docs]:          ../../../user-guides/events/analyze-attack.md#analyze-requests-from-denylisted-ips

# Wallarm-Specific Values of the Sidecar Helm Chart

This document describes Wallarm-specific Helm chart values you can change during [Wallarm Sidecar deployment](deployment.md) or [upgrade][sidecar-upgrade-docs]. The Wallarm-specific and other chart values are for global configuration of the Sidecar Helm chart.

!!! info "Priorities of global and per-pod's settings"
    Per-pod's annotations [take precedence](customization.md#configuration-area) over Helm chart values.

The Wallarm-specific part of the [default `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) that you might need to change looks like the following:

```yaml
config:
  wallarm:
    api:
      token: ""
      host: api.wallarm.com
      port: 443
      useSSL: true
      caVerify: true
      nodeGroup: "defaultSidecarGroup"
      existingSecret:
        enabled: false
        secretKey: token
        secretName: wallarm-api-token
    fallback: "on"
    mode: monitoring
    modeAllowOverride: "on"
    enableLibDetection: "on"
    parseResponse: "on"
    aclExportEnable: "on"
    parseWebsocket: "off"
    unpackResponse: "on"
    ...
  nginx:
    workerProcesses: auto
    workerConnections: 4096
postanalytics:
  external:
    enabled: false
    host: ""
    port: 3313
  ...
# Optional part for custom admission webhook certificate provisioning
# controller:
#  admissionWebhook:
#    certManager:
#      enabled: false
#    secret:
#      enabled: false
#      ca: <base64-encoded-CA-certificate>
#      crt: <base64-encoded-certificate>
#      key: <base64-encoded-private-key>
```

## config.wallarm.api.token

A filtering node token value. It is required to access the Wallarm API.

The token can be one of these [types][node-token-types]:

* **API token (recommended)** - Ideal if you need to dynamically add/remove node groups for UI organization or if you want to control token lifecycle for added security. To generate an API token:

    To generate an API token:
    
    1. Go to Wallarm Console → **Settings** → **API tokens** in either the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Create an API token with the **Deploy** source role.
    1. During node deployment, use the generated token and specify the group name using the `config.wallarm.api.nodeGroup` parameter. You can add multiple nodes to one group using different API tokens.
* **Node token** - Suitable when you already know the node groups that will be used.

    To generate a node token:
    
    1. Go to Wallarm Console → **Nodes** in either the [US Cloud](https://us1.my.wallarm.com/nodes) or [EU Cloud](https://my.wallarm.com/nodes).
    1. Create a node and name the node group.
    1. During node deployment, use the group's token for each node you want to include in that group.

The parameter is ignored if [`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret).

## config.wallarm.api.host

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud][us-cloud-docs]
* `api.wallarm.com` for the [EU cloud][eu-cloud-docs] (default)

## config.wallarm.api.nodeGroup

This specifies the name of the group of filtering nodes you want to add newly deployed nodes to. Node grouping this way is available only when you create and connect nodes to the Cloud using an API token with the **Deploy** role (its value is passed in the `config.wallarm.api.token` parameter).

**Default value**: `defaultSidecarGroup`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-node-group`.

## config.wallarm.api.existingSecret

Starting from the Helm chart version 4.4.4, you can use this configuration block to pull a Wallarm node token value from Kubernetes secrets. It is useful for environments with separate secret management (e.g. you use an external secrets operator).

To store the node token in K8s secrets and pull it to the Helm chart:

1. Create a Kubernetes secret with the Wallarm node token:

    ```bash
    kubectl -n wallarm-sidecar create secret generic wallarm-api-token --from-literal=token=<WALLARM_NODE_TOKEN>
    ```

    * If you followed the deployment instructions without modifications, `wallarm-sidecar` is the Kubernetes namespace created for the Helm release with the Wallarm Sidecar controller. Replace the name if using a different namespace.
    * `wallarm-api-token` is the Kubernetes secret name.
    * `<WALLARM_NODE_TOKEN>` is the Wallarm node token value copied from the Wallarm Console UI.

    If using some external secret operator, follow [appropriate documentation to create a secret](https://external-secrets.io).
1. Set the following configuration in `values.yaml`:

    ```yaml
    config:
      wallarm:
        api:
          token: ""
          existingSecret:
            enabled: true
            secretKey: token
            secretName: wallarm-api-token
    ```

**Default value**: `existingSecret.enabled: false` that points the Helm chart to get the Wallarm node token from `config.wallarm.api.token`.

## config.wallarm.fallback

With the value set to `on` (default), NGINX services have the ability to enter an emergency mode. If proton.db or custom ruleset cannot be downloaded from the Wallarm Cloud due to its unavailability, this setting disables the Wallarm module and keeps NGINX functioning.

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-fallback`.

## config.wallarm.mode

Global [traffic filtration mode][configure-wallarm-mode-docs]. Possible values:

* `monitoring` (default)
* `safe_blocking`
* `block`
* `off`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode`.

## config.wallarm.modeAllowOverride

Manages the [ability to override the `wallarm_mode` values via settings in the Cloud][filtration-mode-priorities-docs]. Possible values:

* `on` (default)
* `off`
* `strict`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-mode-allow-override`.

## config.wallarm.enableLibDetection

Whether to additionally validate the SQL Injection attacks using the [libdetection][libdetection-docs] library. Possible values:

* `on` (default)
* `off`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-enable-libdetection`.

## config.wallarm.parseResponse

Whether to analyze the application responses for attacks. Possible values:

* `on` (default)
* `off`

Response analysis is required for vulnerability detection during [passive detection][passive-detection-docs] and [active threat verification][active-threat-verification-docs].

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-response`.

## config.wallarm.aclExportEnable

Enables `on` / disables `off` sending statistics about the requests from the [denylisted][denylist-docs] IPs from node to the Cloud.

* With `config.wallarm.aclExportEnable: "on"` (default) the statistics on the requests from the denylisted IPs will be [displayed][denylist-view-events-docs] in the **Attacks** section.
* With `config.wallarm.aclExportEnable: "off"` the statistics on the requests from the denylisted IPs will not be displayed.

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-acl-export-enable`.

## config.wallarm.parseWebsocket

Wallarm has full WebSockets support. By default, the WebSockets' messages are not analyzed for attacks. To force the feature, activate the API Security [subscription plan][subscriptions-docs] and use this setting.

Possible values:

* `on`
* `off` (default)

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-parse-websocket`.

## config.wallarm.unpackResponse

Whether to decompress compressed data returned in the application response:

* `on` (default)
* `off`

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/wallarm-unpack-response`.

## config.nginx.workerConnections

The maximum [number of simultaneous connections](http://nginx.org/en/docs/ngx_core_module.html#worker_connections) that can be opened by an NGINX worker process.

**Default value**: `4096`.

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-connections`.

## config.nginx.workerProcesses

[NGINX worker process number](http://nginx.org/en/docs/ngx_core_module.html#worker_processes).

**Default value**: `auto`, which means the number of workers is set to the number of CPU cores.

[**Pod's annotation**](pod-annotations.md): `sidecar.wallarm.io/nginx-worker-processes`.

## postanalytics.external.enabled

Determines whether to use the Wallarm postanalytics (Tarantool) module installed on an external host or the one installed during the Sidecar solution deployment.

This feature is supported starting from Helm release 4.6.4.

Possible values:

* `false` (default): use the postanalytics module deployed by the Sidecar solution.
* `true`: If enabled, please provide the external address of the postanalytics module in the `postanalytics.external.host` and `postanalytics.external.port` values.

  If set to `true`, the Sidecar solution does not run the postanalytics module, but expects to reach it at the specified `postanalytics.external.host` and `postanalytics.external.port`.

## postanalytics.external.host

The domain or IP address of the separately installed postanalytics module. This field is required if `postanalytics.external.enabled` is set to `true`.

This feature is supported starting from Helm release 4.6.4.

Example values: `tarantool.domain.external` or `10.10.0.100`.

The specified host must be accessible from the Kubernetes cluster where the Sidecar Helm chart is deployed.

## postanalytics.external.port

The TCP port on which the Wallarm postanalytics module is running. By default, it uses port 3313 as the Sidecar solution deploys the module on this port.

If `postanalytics.external.enabled` is set to `true`, specify the port on which the module is running on the specified external host.

## controller.admissionWebhook.certManager.enabled

Whether to use [`cert-manager`](https://cert-manager.io/) for generating the admission webhook certificate instead of the default [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen). Supported starting with release 4.10.7

**Default value**: `false`.

## controller.admissionWebhook.secret.enabled

Whether to manually upload certificates for the admission webhook instead of using the default [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen). Supported starting with release 4.10.7.

**Default value**: `false`.

If set to `true`, specify the base64-encoded CA certificate, server certificate, and private key, e.g.:

```yaml
controller:
  admissionWebhook:
    secret:
      enabled: true
      ca: <base64-encoded-CA-certificate>
      crt: <base64-encoded-certificate>
      key: <base64-encoded-private-key>
```
