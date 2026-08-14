[new-annotations]:          ../updating-migrating/what-is-new.md#annotation-namespace


# Wallarm Ingress Controller Annotations and Policies

This page describes the Wallarm-specific Ingress annotations and the Wallarm **Policy** custom resource supported by the [Wallarm Ingress Controller based on F5 NGINX Ingress Controller](installation-kubernetes-en.md).

For the Helm chart values, see [Configuration options](configure-kubernetes-en.md).

## Supported Wallarm Ingress annotations

In this section, you can see the Wallarm-specific Ingress annotations supported by the Wallarm Ingress Controller based on the [F5 NGINX Ingress Controller](https://github.com/nginx/kubernetes-ingress).

Besides the Wallarm-specific annotations described below, [standard NGINX Ingress Controller annotations](https://docs.nginx.com/nginx-ingress-controller/configuration/ingress-resources/advanced-configuration-with-annotations/) are also supported.

| Annotation | Description |
| --- | --- |
| `nginx.org/wallarm-mode` | [Traffic filtration mode](../admin-en/configure-wallarm-mode.md): `monitoring` (default), `safe_blocking`, `block` or `off`. |
| `nginx.org/wallarm-mode-allow-override` | Manages the [ability to override the `wallarm_mode values` via settings in the Cloud](../admin-en/configure-wallarm-mode.md#prioritization-of-methods): `on` (default), `off` or `strict`. |
| `nginx.org/wallarm-fallback` | [Wallarm fallback mode](../admin-en/configure-parameters-en.md#wallarm_fallback) : `on` (default) or `off`. |
| `nginx.org/wallarm-application` | [Wallarm application ID](../user-guides/settings/applications.md). |
| `nginx.org/wallarm-block-page` | [Blocking page and error code](../admin-en/configuration-guides/configure-block-page-and-code.md) to return to blocked requests. |
| `nginx.org/wallarm-unpack-response` | Whether to decompress compressed data returned in the application response: `on` (default) or `off`. |
| `nginx.org/wallarm-parse-response` | Whether to analyze the application responses for attacks: `on` (default) or `off`. Response analysis is required for vulnerability detection during [passive detection](../about-wallarm/detecting-vulnerabilities.md#passive-detection). |
| `nginx.org/wallarm-parse-websocket` | Wallarm has full WebSockets support. By default, the WebSockets' messages are not analyzed for attacks. To force the feature, activate the API Security [subscription plan](../about-wallarm/subscription-plans.md#core-subscription-plans) and use this annotation: `on` or `off` (default). |
| `nginx.org/wallarm-parser-disable` | Allows you to disable [parsers](../user-guides/rules/request-processing.md). The directive values correspond to the name of the parser to be disabled, e.g. `json`. Multiple parsers can be specified, separated by a semicolon, e.g. `json;base64`. |
| `nginx.org/wallarm-partner-client-uuid` | Partner client [UUID](../installation/multi-tenant/configure-accounts.md#getting-uuids-of-existing-tenants) for multi-tenant setups, optionally followed by a space-separated label (for example, `<UUID> Tenant-1`). |

### Applying annotation to the Ingress resource

These annotations are applied to Kubernetes `Ingress` resources processed by the controller.

To set or update an annotation, use:

```
kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> <ANNOTATION_NAME>=<VALUE>
```

* `<YOUR_INGRESS_NAME>` is the name of your Ingress
* `<YOUR_INGRESS_NAMESPACE>` is the namespace of your Ingress
* `<ANNOTATION_NAME>` is the name of the annotation from the list above
* `<VALUE>` is the value of the annotation from the list above

### Annotation examples

#### Configuring the blocking page and error code

The annotation `nginx.org/wallarm-block-page` is used to configure the blocking page and error code returned in the response to the request blocked for the following reasons:

* Request contains malicious payloads of the following types: [input validation attacks](../attacks-vulns-list.md#attack-types), [vpatch attacks](../user-guides/rules/vpatch-rule.md), or [attacks detected based on regular expressions](../user-guides/rules/regex-rule.md).
* Request containing malicious payloads from the list above originates from a [graylisted IP address](../user-guides/ip-lists/overview.md) and the node filters requests in the safe blocking [mode](configure-wallarm-mode.md).
* Request originates from the [denylisted IP address](../user-guides/ip-lists/overview.md).

For example, to return the default Wallarm blocking page and the error code 445 in the response to any blocked request:

``` bash
kubectl annotate ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> nginx.org/wallarm-block-page="&/usr/share/nginx/html/wallarm_blocked.html response_code=445 type=attack,acl_ip,acl_source"
```

[More details on the blocking page and error code configuration methods →](../admin-en/configuration-guides/configure-block-page-and-code.md)

#### Managing libdetection mode

You can control the [**libdetection**](../admin-en/configure-parameters-en.md#wallarm_enable_libdetection) mode by passing the `wallarm_enable_libdetection` directive into the generated NGINX configuration:

* (Per‑Ingress annotation) Requires `controller.enableSnippets: true`:

  ```bash
  kubectl annotate --overwrite ingress <YOUR_INGRESS_NAME> -n <YOUR_INGRESS_NAMESPACE> \
    nginx.org/server-snippets="wallarm_enable_libdetection off;"
  ```

* (Cluster‑wide) Uses the controller `ConfigMap` (via `controller.config.entries`) to apply the setting globally to the Ingress Controller:

  ```bash
  helm upgrade --reuse-values <INGRESS_CONTROLLER_RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> \
    --set-string controller.config.entries.server-snippets="wallarm_enable_libdetection off;"
  ```

!!! info "Libdetection values"
    Available values of `wallarm_enable_libdetection` are `on`/`off`.

## Wallarm policy custom resource definition (CRD)

The F5-based controller supports [Custom Resource Definitions](https://docs.nginx.com/nginx-ingress-controller/configuration/virtualserver-and-virtualserverroute-resources/) as an alternative to standard Ingress resources for advanced routing (canary deployments, traffic splitting, header-based routing). All [standard F5 NGINX Ingress Controller CRDs](https://docs.nginx.com/nginx-ingress-controller/configuration/global-configuration/custom-resources/) are available.

When using CRDs, Wallarm settings are configured via the **Policy** resource instead of annotations. Wallarm patches the upstream Policy CRD to add an optional `spec.wallarm` block — an alternative to Wallarm annotations that provides the same set of settings through a dedicated resource. The Policy is then referenced from `VirtualServer` or `VirtualServerRoute` routes.

!!! info "Wallarm-provided CRDs"
    If you plan to use the Wallarm Policy CRD (`spec.wallarm`), apply the **Wallarm-provided CRDs** instead of the upstream F5 CRDs. The Wallarm-provided CRDs include the patched Policy schema with the `wallarm` block.

**Policy fields:**

| Field | Description | Values | Default |
| --- | --- | --- | --- |
| `mode` | Wallarm filtration mode. | `off`, `monitoring`, `safe_blocking`, `block` | — |
| `modeAllowOverride` | Whether Wallarm Cloud settings can override the local mode. | `on`, `off`, `strict` | `on` |
| `fallback` | Behavior when proton.db or custom ruleset cannot be loaded. | `on`, `off` | `on` |
| `application` | Application ID used to separate traffic in Wallarm Cloud. | Positive integer | — |
| `blockPage` | Custom block page (file path, named location, URL, or variable). | String | — |
| `parseResponse` | Analyze responses from the application. | `on`, `off` | `on` |
| `unpackResponse` | Decompress responses before analysis. | `on`, `off` | `on` |
| `parseWebsocket` | Analyze WebSocket messages. | `on`, `off` | `off` |
| `parserDisable` | Parsers to disable. | List: `cookie`, `zlib`, `htmljs`, `json`, `multipart`, `base64`, `percent`, `urlenc`, `xml`, `jwt` | — |
| `partnerClientUUID` | Partner client UUID for multi-tenant setups, optionally followed by a space-separated label that surfaces as the `client_label` metric label (requires Node 6.12.0+; allowed label characters: alphanumerics, `-`, and `_`). | `<UUID>` or `<UUID> <LABEL>` | — |

**Example — two policies with different modes referenced by routes:**

```yaml
apiVersion: k8s.nginx.org/v1
kind: Policy
metadata:
  name: wallarm-block
spec:
  wallarm:
    mode: block
    application: 42
    fallback: "on"
---
apiVersion: k8s.nginx.org/v1
kind: Policy
metadata:
  name: wallarm-monitoring
spec:
  wallarm:
    mode: monitoring
---
apiVersion: k8s.nginx.org/v1
kind: VirtualServer
metadata:
  name: my-app
spec:
  host: my-app.example.com
  upstreams:
    - name: backend
      service: backend-svc
      port: 80
  routes:
    - path: /api
      policies:
        - name: wallarm-block
      action:
        pass: backend
    - path: /internal
      policies:
        - name: wallarm-monitoring
      action:
        pass: backend
```
