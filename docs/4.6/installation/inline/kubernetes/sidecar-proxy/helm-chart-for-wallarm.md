---
search:
  exclude: true
---

[sidecar-upgrade-docs]:               ../../../../updating-migrating/sidecar-proxy.md
[us-cloud-docs]:                      ../../../../about-wallarm/overview.md#us-cloud
[eu-cloud-docs]:                      ../../../../about-wallarm/overview.md#eu-cloud
[configure-wallarm-mode-docs]:        ../../../../admin-en/configure-wallarm-mode.md
[filtration-mode-priorities-docs]:    ../../../../admin-en/configure-wallarm-mode.md#setting-up-priorities-of-the-filtration-mode-configuration-methods-using-wallarm_mode_allow_override
[libdetection-docs]:                  ../../../../about-wallarm/protecting-against-attacks.md#libdetection-overview
[passive-detection-docs]:             ../../../../about-wallarm/detecting-vulnerabilities.md#passive-detection
[subscriptions-docs]:                 ../../../../about-wallarm/subscription-plans.md#subscription-plans
[active-threat-verification-docs]:    ../../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification

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
      existingSecret:
        enabled: false
        secretKey: token
        secretName: wallarm-api-token
    fallback: "on"
    mode: monitoring
    modeAllowOverride: "on"
    enableLibDetection: "on"
    parseResponse: "on"
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

The Wallarm node token created in Wallarm Console in the [US](https://us1.my.wallarm.com/nodes) or [EU](https://my.wallarm.com/nodes) Cloud. It is required to access Wallarm API.

The parameter is ignored if [`config.wallarm.api.existingSecret.enabled: true`](#configwallarmapiexistingsecret).

## config.wallarm.api.host

Wallarm API endpoint. Can be:

* `us1.api.wallarm.com` for the [US cloud][us-cloud-docs]
* `api.wallarm.com` for the [EU cloud][eu-cloud-docs] (default)

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
