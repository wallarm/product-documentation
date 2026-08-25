# What is New in NGINX Node 7.x

This page describes what is new in **NGINX Node 7.x** and what to prepare for when migrating from 6.x. Wallarm Node 7.x brings changes on two levels:

* [**Node runtime — all deployment types**](#node-architecture-and-process-management-wd). The node now runs on the new `wd` (Wallarm Daemon) service, which replaces `supervisord`, consolidates the Wallarm processes, aggregates metrics on a single endpoint.

    These changes arrived in 7.1.0 and apply to every NGINX Node deployment except for Wallarm Sidecar Controller (not released yet).

* [**Kubernetes Ingress Controller — new F5 base**](#wallarm-ingress-controller-f5-based). It replaces the previous Community Ingress NGINX-based controller, [which has been retired](https://blog.nginx.org/blog/the-ingress-nginx-alternative-open-source-nginx-ingress-controller-for-the-long-term) by the Kubernetes community.

## Node architecture and process management (`wd`)

Starting from 7.1.0, the Wallarm Node runs on the new `wd` (Wallarm Daemon) service — a Go-based process and job manager that replaces `supervisord` and consolidates the previously separate Wallarm containers.

This is the significant technical change in the 7.x line. **Most of the changes in this section are breaking** for custom charts and monitoring setups.

This change applies to **all** [NGINX Node deployments](../installation/supported-deployment-options.md) except for Wallarm Sidecar Controller (not released yet).

### Single aggregated metrics endpoint

`wd` scrapes each component and re-exposes [all metrics on a single aggregated endpoint](../admin-en/nginx-node-metrics.md), `http://127.0.0.1:9445/metrics` — the recommended endpoint for scraping.

For backward compatibility, each component still exposes its own per-component endpoint as well (for example, **wstore** on `9001` and **wcli** on `9003`).

### New and removed Prometheus metrics

* New [`wallarm_wd_*` process metrics](../admin-en/wd-metrics.md) report managed-process state, restarts, and uptime.
* The `wallarm_wstore_throttle_mode` and `wallarm_wstore_throttled_requests` metrics are removed.

### Readiness and liveness probes

`wd` exposes `/health` (liveness) and `/ready` (readiness) on port `9446` for orchestrator [health probes](../admin-en/nginx-node-metrics.md#health-endpoints).

### Startup during a Wallarm Cloud outage

A Wallarm node can now start and begin filtering traffic even when the Wallarm Cloud is temporarily unavailable — for example, on a fresh boot, a restart, or when an orchestrator scales out new node replicas.

The Wallarm Cloud periodically generates the files a node needs to start and uploads them to cloud object storage that is hosted independently of the Cloud. If the Cloud is unavailable when a node starts, the node downloads these startup files from that storage and begins filtering traffic.

### Consolidated containers (Wallarm Ingress Controller)

In the F5-based Wallarm Ingress Controller, the pod layout is flattened. Instead of separate `wcli` and API Firewall sidecars (and, in the postanalytics pod, `wstore` + `wcli` + `appstructure`), each pod now runs a single `wd` container that manages these processes:

* **Controller pod** — the NGINX controller container **plus** one `wd` sidecar that runs wcli and API Firewall.
* **Postanalytics pod** — a single `wd` container that runs wstore and wcli.

Because one `wd` container now runs what used to be several containers, in the Ingress Controller set the **combined** CPU and memory on `controller.wallarm.wd.resources` and `postanalytics.wd.resources` (sum the resources of the old per-container blocks). See [High Availability and Resource Configuration](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md).

This consolidation is also reflected in the chart's `values.yaml`: the per-container blocks — `controller.wallarm.wcli*`, the API Firewall sidecar, `initContainer`, and `controller.wallarm.metrics.*` — are replaced by a single `wd` block per component:

* `config.wallarm.wd.*` — daemon settings: process log levels (`processLogLevels`), metrics and health ports, and scrape targets (`scrape`).
* `controller.wallarm.wd.*` and `postanalytics.wd.*` — per-pod `wd` container settings: `resources`, `extraEnvs`, and the metrics `Service`/`ServiceMonitor`.

## Wallarm Ingress Controller (F5-based)

In 7.x, the Wallarm Ingress Controller is rebuilt on the [F5 NGINX Ingress Controller](https://github.com/nginx/kubernetes-ingress), replacing the previous controller based on the [Community Ingress NGINX](https://github.com/kubernetes/ingress-nginx) project.

The change is driven by upstream: the Community Ingress NGINX project has been [retired](https://blog.nginx.org/blog/the-ingress-nginx-alternative-open-source-nginx-ingress-controller-for-the-long-term) by the Kubernetes community and no longer receives updates or security fixes, so Wallarm moved to the actively maintained F5 project.

The 7.x controller is effectively a new deployment artifact, and existing Community-based (6.x) deployments must be migrated. This section explains what changes and how to migrate; for the retirement timeline and options, see [Migration Plan for Wallarm NGINX Ingress Controller Customers](nginx-ingress-retirement.md).

!!! info "Upstream migration guide"
    Since the F5-based controller is a different upstream project, many changes are not Wallarm-specific. Before migrating, we recommend also reviewing the official [F5 migration guide](https://docs.nginx.com/nginx-ingress-controller/install/migrate-ingress-nginx/) for a complete picture of differences.

### What stays the same

The high-level architecture remains unchanged:

* Wallarm continues to run as an integrated part of the NGINX Ingress Controller
* Your overall traffic flow, Wallarm Cloud connectivity, and security processing model remain consistent
* Wallarm-specific detection and protection features work the same way

### Underlying controller

| | Community-based (6.x) | F5-based (7.x) |
| --- | --- | --- |
| **Base project** | [Community Ingress NGINX](https://github.com/kubernetes/ingress-nginx) (retired) | [F5 NGINX Ingress Controller](https://github.com/nginx/kubernetes-ingress) |
| **Upstream version** | 1.15.0 | 5.5.4 |
| **NGINX version** | NGINX stable 1.25.x | NGINX stable 1.31.x |
| **Base image** | Alpine Linux 3.22 | Alpine Linux 3.23 |
| **Architecture support** | amd64, arm64 | amd64, arm64 |
| **Kubernetes versions** | 1.26–1.30 | 1.29–1.36 |

!!! warning "NGINX Plus is not supported"
    The Wallarm Ingress Controller uses the **open-source** edition of the F5 NGINX Ingress Controller. NGINX Plus is not included and is not supported.

### Helm chart and `values.yaml` structure

The Helm chart name remains the same (`wallarm/wallarm-ingress`), but starting from version 7.x the `values.yaml` structure has been reworked.

While the same settings exist, they have been reorganized into different sections. You will need to craft a new `values.yaml` for the 7.x release.

You can compare the full default values:

* [Community-based `values.yaml` (6.x)](https://github.com/wallarm/ingress/blob/main/charts/ingress-nginx/values.yaml)
* [F5-based `values.yaml` (7.x)](https://github.com/wallarm/ingress-nextgen/blob/main/charts/nginx-ingress/values.yaml)

#### Key structural changes

In the Community-based (6.x) chart, most Wallarm configuration lived under `controller.wallarm.*`. In the F5-based (7.x) chart, settings are split across several top-level sections:

| Section | Purpose |
| --- | --- |
| `config.wallarm.*` | Wallarm Cloud connectivity and feature flags. |
| `config.images.*` | Container image repositories and tags. |
| `controller.*` | Controller workload settings (replicas, affinity, resources, etc.) |
| `controller.config.entries` | NGINX configuration (replaces `controller.config` ConfigMap). |
| `postanalytics.*` | Postanalytics (wstore) workload — now a top-level section. |
| `prometheus.*` | Predefined Prometheus scrape annotations (default port 9113). |
| `prometheusExtended.*` | Extended VTS metrics (experimental). |

#### Wallarm parameter mapping

The table below maps the most commonly customized Wallarm parameters between the Community-based and F5-based charts:

| Community-based (6.x) | F5-based (7.x) |
| --- | --- |
| `controller.wallarm.enabled` | `config.wallarm.enabled` |
| `controller.wallarm.apiHost` | `config.wallarm.api.host` |
| `controller.wallarm.apiPort` | `config.wallarm.api.port` |
| `controller.wallarm.apiSSL` | `config.wallarm.api.ssl` |
| `controller.wallarm.token` | `config.wallarm.api.token` |
| `controller.wallarm.nodeGroup` | `config.wallarm.api.nodeGroup` |
| `controller.wallarm.existingSecret.*` | `config.wallarm.api.existingSecret.*` |
| `controller.wallarm.fallback` | `config.wallarm.fallback` |
| `controller.wallarm.postanalytics.*` | `postanalytics.*` (top-level) |
| `controller.wallarm.metrics.*` | `controller.wallarm.wd.metrics.*` — aggregated on port `9445` |
| `controller.wallarm.wcliPostanalytics.*`, `controller.wallarm.wcliController.*` (log levels) | `config.wallarm.wd.processLogLevels.*` |
| `controller.wallarm.wcliPostanalytics.metrics.*` | Aggregated by `wd` on port `9445` |
| `controller.wallarm.apiFirewall.*` | `config.apiFirewall.*` |
| `controller.wallarm.apiFirewall.metrics.*` | Port `9010`; opt-in aggregation via `config.wallarm.wd.scrape.apiFirewall` |
| `controller.wallarm.<container>.extraEnvs` | `controller.wallarm.<component>.extraEnvs` or `postanalytics.<component>.extraEnvs` |
| `controller.image` | `config.images` |
| `controller.wallarm.helpers` | `config.images.helper` |
| `controller.config` (NGINX ConfigMap) | `controller.config.entries` |
| `controller.configAnnotations` | `controller.config.annotations` |

#### Removed parameters

The following Community-based (6.x) parameters are no longer available:

| Removed parameter | Description |
| --- | --- |
| `controller.proxySetHeaders` | Use `controller.config.entries` or NGINX snippets instead. |
| `controller.addHeaders` | Use `controller.config.entries` or NGINX snippets instead. |
| `controller.admissionWebhooks.*` | Not applicable to the F5-based controller. |
| `validation.enableCel` | Not applicable to the F5-based controller. The F5-based controller is not affected by the CVE-2025-1974 vulnerability for which this setting has been initially introduced. |
| `validation.forbidDangerousAnnotations` | Not applicable to the F5-based controller. The F5-based controller is not affected by the CVE-2025-1974 vulnerability for which this setting has been initially introduced. |

### Annotation namespace

All annotations move from:

```
nginx.ingress.kubernetes.io/*
```

to:

```
nginx.org/*
```

This applies to both general NGINX annotations and Wallarm-specific annotations, e.g.:

=== "Community-based (6.x)"
    ```yaml
    metadata:
      annotations:
        nginx.ingress.kubernetes.io/wallarm-mode: "monitoring"
        nginx.ingress.kubernetes.io/wallarm-application: "42"
        nginx.ingress.kubernetes.io/rewrite-target: "/$2"
    ```
=== "F5-based (7.x)"
    ```yaml
    metadata:
      annotations:
        nginx.org/wallarm-mode: "monitoring"
        nginx.org/wallarm-application: "42"
        nginx.org/rewrites: "serviceName=myservice rewrite=/$2"
    ```

The set of supported **Wallarm-specific annotations** has not changed — only the prefix is different. For the full list of Wallarm annotations and their accepted values, see [Wallarm Ingress Controller annotations](../admin-en/configure-kubernetes-annotations.md#supported-wallarm-ingress-annotations).

For the full mapping of general **NGINX annotations** between the two controllers, refer to the [F5 migration guide](https://docs.nginx.com/nginx-ingress-controller/install/migrate-ingress-nginx/#advanced-configuration-with-annotations).

### Removed features

The following features available in the Community-based controller are **not available** in the F5-based controller:

* Brotli compression (NGINX module)
* ModSecurity (NGINX module)

### NGINX configuration

Default NGINX configuration values may differ between the two controllers. If you previously relied on fine-tuned settings (timeouts, gzip, SSL parameters, worker settings), review how they should be provided in the F5-based chart via:

* [Changes in the global configuration with ConfigMaps](https://docs.nginx.com/nginx-ingress-controller/install/migrate-ingress-nginx/#global-configuration-with-configmaps)
* [`controller.config.entries`](https://docs.nginx.com/nginx-ingress-controller/configuration/global-configuration/configmap-resource/) (replaces ConfigMap-based `controller.config`)
* [Configuration snippets](https://docs.nginx.com/nginx-ingress-controller/configuration/ingress-resources/advanced-configuration-with-snippets/)

### Ingress resource validation

The F5-based controller introduces [restrictions on Ingress resources](https://docs.nginx.com/nginx-ingress-controller/configuration/ingress-resources/basic-configuration/#restrictions). Configurations that were previously accepted may now be rejected or silently skipped.

Before switching production traffic, all Ingress manifests should be reviewed and validated against the F5-based controller.

!!! info "Mergeable Ingress pattern"
    In some scenarios, you may need to use the [Mergeable Ingress](https://docs.nginx.com/nginx-ingress-controller/configuration/ingress-resources/cross-namespace-configuration/) pattern, where:

    * A **master** Ingress defines the host
    * Multiple **minion** Ingress resources define routes under that host

    This pattern is useful when multiple teams manage routes for the same hostname.

### Wallarm Policy Custom Resource Definition (CRD)

The F5-based controller supports [Custom Resource Definitions](https://docs.nginx.com/nginx-ingress-controller/configuration/virtualserver-and-virtualserverroute-resources/) as an alternative to standard Ingress resources for advanced routing (canary deployments, traffic splitting, header-based routing).

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
| `partnerClientUUID` | Partner client UUID for multi-tenant setups. | UUID | — |

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

In this example, `/api` traffic is processed in `block` mode while `/internal` traffic is in `monitoring` mode — each route references a different Wallarm Policy.

### Observability

**Prometheus metrics**

Basic Prometheus metrics are available out of the box via the `prometheus.*` section of the Helm chart (default port 9113). For details, see [F5 NGINX Ingress Controller Prometheus metrics](https://docs.nginx.com/nginx-ingress-controller/logging-and-monitoring/prometheus/).

For richer metrics, the `prometheusExtended.*` section provides VTS (Virtual Host Traffic Status) metrics.

!!! warning "Experimental feature"
    Extended Prometheus metrics via `prometheusExtended.*` are experimental. Enable them in a non-production environment first before rolling out to production.

**Wallarm Node metrics**

The Wallarm-specific metrics (traffic and attack counters, postanalytics, wcli, and the new `wallarm_wd_*` process metrics) are aggregated by the `wd` service on port `9445` — see [Node architecture and process management](#node-architecture-and-process-management-wd) and [Monitoring the NGINX Node metrics and health](../admin-en/nginx-node-metrics.md). This is separate from the controller's own metrics on port `9113`.

**Log format**

The NGINX access log format has changed slightly. If you have log parsing pipelines (ELK, Splunk, Datadog, etc.), review the new format. See [F5 NGINX Ingress Controller logging](https://docs.nginx.com/nginx-ingress-controller/logging-and-monitoring/logging/).

### Deploying from your own registries

The image configuration has moved from `controller.image` and `controller.wallarm.helpers` to `config.images`:

=== "Community-based (6.x)"
    ```yaml
    controller:
      image:
        registry: <YOUR_REGISTRY>
        image: wallarm/ingress-controller
        tag: "6.13.0"
      wallarm:
        helpers:
          image: <YOUR_REGISTRY>/wallarm/node-helpers
          tag: "6.13.0"
    ```
=== "F5-based (7.x)"
    ```yaml
    config:
      images:
        controller:
          repository: "<YOUR_REGISTRY>/wallarm/ingress-controller"
          tag: "7.1.2"
          pullPolicy: IfNotPresent
        helper:
          repository: "<YOUR_REGISTRY>/wallarm/node-helpers"
          tag: "7.1.2"
          pullPolicy: IfNotPresent
    ```

### ARM64 deployment

ARM64 support is available in the F5-based (7.x) controller. The approach for scheduling pods on ARM64 nodes remains the same — use `nodeSelector`, `tolerations`, or affinity rules in the Helm chart. The key differences from 6.x are:

* The `admissionWebhooks` section no longer exists and does not need to be configured.
* Postanalytics scheduling is configured at the top level (`postanalytics.*`) instead of `controller.wallarm.postanalytics.*`.

=== "Community-based (6.x)"
    ```yaml
    controller:
      nodeSelector:
        kubernetes.io/arch: arm64
      admissionWebhooks:
        nodeSelector:
          kubernetes.io/arch: arm64
        patch:
          nodeSelector:
            kubernetes.io/arch: arm64
      wallarm:
        postanalytics:
          nodeSelector:
            kubernetes.io/arch: arm64
        enabled: true
        token: "<NODE_TOKEN>"
        apiHost: "us1.api.wallarm.com"
    ```
=== "F5-based (7.x)"
    ```yaml
    controller:
      nodeSelector:
        kubernetes.io/arch: arm64
    postanalytics:
      nodeSelector:
        kubernetes.io/arch: arm64
    config:
      wallarm:
        enabled: true
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com"
    ```

### OpenShift

Deploying on OpenShift follows the same general approach as before: define a custom Security Context Constraint (SCC) and apply it before deploying the controller.

The key difference is that the `admissionWebhooks`-related SCC (`wallarm-ingress-admission`) is no longer needed — you can omit it from your SCC configuration.

### Installation

Minimal steps:

=== "US Cloud"
    ```yaml
    config:
      wallarm:
        enabled: true
        api:
          token: "<NODE_TOKEN>"
          host: "us1.api.wallarm.com"
          # nodeGroup: defaultIngressGroup
    ```
=== "EU Cloud"
    ```yaml
    config:
      wallarm:
        enabled: true
        api:
          token: "<NODE_TOKEN>"
          # nodeGroup: defaultIngressGroup
    ```

```bash
helm install --version 7.1.2 <RELEASE_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE> -f <PATH_TO_VALUES>
```

For the full installation guide, see [Deploying Wallarm Ingress Controller](../admin-en/installation-kubernetes-en.md).

### Traffic migration planning

Migration to the F5-based controller requires planning how traffic will be switched from the Community-based controller.

**Running both controllers in parallel** is supported and recommended for production environments. This allows you to:

1. Deploy the F5-based (7.x) controller alongside the existing Community-based (6.x) controller
2. Validate that Ingress resources work correctly with the F5-based controller
3. Gradually shift traffic using one of the following strategies:

    * **DNS switch** — update DNS records to point to the F5-based controller's load balancer
    * **Load balancer traffic split** — use weighted routing at the load balancer level
    * **IngressClass selector swap** — update Ingress resources to reference the new IngressClass
    * **Direct replacement** — remove the Community-based controller and deploy the F5-based one (suitable for non-production environments)

4. Decommission the Community-based (6.x) controller after validation

[Full migration guide](ingress-controller.md)

### Migration checklist

When migrating from the Community-based (6.x) to the F5-based (7.x) controller:

- [ ] **Helm configuration**: Create a new `values.yaml` based on the F5-based chart structure. Map all customized parameters using the [mapping table](#wallarm-parameter-mapping) above. Remove any references to `admissionWebhooks`.
- [ ] **Annotations**: Rewrite all Ingress annotations from `nginx.ingress.kubernetes.io/*` to `nginx.org/*`. Replace removed deprecated annotations (`wallarm-instance` → `wallarm-application`, `wallarm-acl-block-page` → `wallarm-block-page`).
- [ ] **Ingress resources**: Validate all Ingress manifests against the F5-based controller. Check for any that may be [silently ignored or rejected](#ingress-resource-validation).
- [ ] **Removed features**: Verify that your setup does not rely on Brotli or ModSecurity. Find alternative approaches if needed.
- [ ] **Node architecture (`wd`)**: The node now runs a single `wd` container per pod. Sum the resources of the old per-container blocks into [`controller.wallarm.wd.resources` / `postanalytics.wd.resources`](#node-architecture-and-process-management-wd), and remove any custom `appstructure` container or startup entry.
- [ ] **NGINX configuration**: Review any custom NGINX tuning (`controller.config` → [`controller.config.entries`](#nginx-configuration)). Review [configuration snippets](https://docs.nginx.com/nginx-ingress-controller/configuration/ingress-resources/advanced-configuration-with-snippets/) syntax.
- [ ] **CRDs** (if applicable): If using VirtualServer/VirtualServerRoute with Wallarm Policy, apply the [Wallarm-provided CRDs](#wallarm-policy-custom-resource-definition-crd) instead of upstream F5 CRDs.
- [ ] **Custom registries** (if applicable): Update image paths from `controller.image` / `controller.wallarm.helpers` to [`config.images`](#deploying-from-your-own-registries).
- [ ] **ARM64** (if applicable): Update scheduling configuration — remove `admissionWebhooks` selectors, move postanalytics to [`postanalytics.nodeSelector`](#arm64-deployment).
- [ ] **OpenShift** (if applicable): Remove the `wallarm-ingress-admission` SCC from your configuration.
- [ ] **Observability**: Update log parsing pipelines for the [new log format](#observability). Scrape the aggregated Wallarm metrics on port `9445` (served by [`wd`](#node-architecture-and-process-management-wd)) and check for `9445`/`9446` port conflicts. Configure the controller's own Prometheus metrics via the `prometheus.*` section.
- [ ] **Traffic migration**: Choose and test your [traffic migration strategy](#traffic-migration-planning). Run both controllers in parallel before the cutover.

The migration requires planning but does not require changing your application workloads.

[Full migration guide](ingress-controller.md)
