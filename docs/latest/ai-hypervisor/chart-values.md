# Chart Values <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

The HIGGS Scanner ships as a Helm chart (`wallarm/aih-scanner`, current version `2.1.1`). The tables below list the values most customers tune; everything else in the [chart's `values.yaml`](https://github.com/wallarm/helm-charts/tree/main/aih-scanner) has a sensible default that rarely needs overriding.

For pod and namespace labels that control which workloads the scanner observes, see [Labels and Annotations](annotations.md).

## Required values

| Key | Description |
|---|---|
| `config.backendUrl` | URL of the AI Hypervisor backend (your tenant). Provided in the install commands on your tenant's empty-state screen. |
| `scannerPrivateKey` | HMAC private key the scanner uses to authenticate to the backend. Provided alongside `backendUrl`. Mutually exclusive with `existingSecret.name`. |
| `existingSecret.name` | Name of a pre-existing Kubernetes Secret in the scanner namespace that holds the private key. Use instead of `scannerPrivateKey` when you manage secrets externally (External Secrets Operator, sealed secrets, and so on). |

## Capture

| Key | Default | Description |
|---|---|---|
| `config.scanAllPods` | `false` | When `false`, the scanner only observes pods that opted in via the labels described in [Labels and Annotations](annotations.md). When `true`, the scanner observes every pod on the node (anti-loop exclusions still apply). Use `true` for short-lived investigations only — opt-in is the production pattern. |
| `config.continuousScanEnabled` | `false` | When `true`, the scanner re-scans labeled pods continuously. When `false`, it scans once per pod lifecycle event. |

## Image and namespace

| Key | Default | Description |
|---|---|---|
| `image.tag` | matches chart version (currently `2.1.1`) | Override only to pin a specific scanner version. |
| `image.pullPolicy` | `IfNotPresent` | Standard image-pull semantics. |
| `imagePullSecretData` | (empty) | Base64-encoded `.dockerconfigjson` for the scanner pull secret. When set, the chart creates the secret automatically. Use when pulling from a private mirror. |
| `namespace.name` | `higgs-system` | The namespace the scanner runs in. Change when `higgs-system` collides with an existing resource. |
| `namespace.create` | `true` | Set to `false` if the namespace already exists and you do not want Helm to take ownership. |

## Resource limits and lifecycle

| Key | Default | Description |
|---|---|---|
| `resources.requests.cpu` | `200m` | Per-scanner-pod CPU request. |
| `resources.limits.cpu` | `2` | Per-scanner-pod CPU limit. Under burst load (50+ concurrent users with full DNAT) the scanner can reach ~950m; the limit gives headroom. |
| `resources.requests.memory` | `512Mi` | Per-scanner-pod memory request. |
| `resources.limits.memory` | `1536Mi` | Per-scanner-pod memory limit. |
| `terminationGracePeriodSeconds` | `75` | Must exceed `config.uploadTimeoutSeconds` so in-flight uploads complete during graceful shutdown. |
| `priorityClassName` | `system-node-critical` | Ensures the scanner is not evicted under node pressure. |

## Disk and retention

| Key | Default | Description |
|---|---|---|
| `config.maxDumpFiles` | `50` | Maximum scan dumps kept on disk per node before pruning. |
| `config.maxDumpAgeHours` | `12` | Maximum age before a dump is pruned. |
| `config.maxDumpSizeMb` | `200` | Maximum total dump size per node. |
| `scanOutputSizeLimit` | `1Gi` | Hard limit on the scanner's `emptyDir` volume. |

## Optional features

| Key | Default | Description |
|---|---|---|
| `agents.enabled` | `true` | Enables in-process language agents. Required for accurate user attribution on multi-hop calls. |
| `prometheus.enabled` | `false` | Adds Prometheus scrape annotations to the scanner pod for metrics collection. |
| `networkPolicy.enabled` | `false` | Creates a `NetworkPolicy` restricting scanner egress to the backend URL only. |

## Inspecting current configuration

To see what values your existing install was deployed with:

```bash
helm get values aih-scanner -n higgs-system
```

To see the rendered manifests:

```bash
helm get manifest aih-scanner -n higgs-system
```

## Updating configuration

To change Helm values, re-run `helm upgrade`:

```bash
helm upgrade aih-scanner wallarm/aih-scanner \
  --namespace higgs-system \
  --version 2.1.1 \
  --reuse-values \
  --set <KEY>=<NEW_VALUE>
```

The DaemonSet rolls out one node at a time. Scanner restarts do not interrupt observation — events buffer in memory until the new scanner attaches.
