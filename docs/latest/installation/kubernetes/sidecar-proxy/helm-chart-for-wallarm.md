# Wallarm-Specific Values of the Sidecar Helm Chart

This document describes Wallarm-specific Helm chart values you can change during [Wallarm Sidecar deployment](deployment.md) or [upgrade][sidecar-upgrade-docs]. The Wallarm-specific and other chart values are for global configuration of the Sidecar Helm chart.

!!! info "Priorities of global and per-pod's settings"
    Per-pod's annotations [take precedence](customization.md#configuration-area) over Helm chart values.

The Wallarm-specific part of the [default `values.yaml`](https://github.com/wallarm/sidecar/blob/main/helm/values.yaml) looks like the following:

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
postanalytics:
  external:
    enabled: false
    host: ""
    port: 3313
  ...
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
