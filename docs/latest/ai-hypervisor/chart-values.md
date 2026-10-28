# Chart Values <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

The scanner ships as a Helm chart (`wallarm/aih-scanner`, current version `2.11.1`). The tables below cover the values most customers tune. Everything else in the [chart's `values.yaml`](https://github.com/wallarm/helm-charts/tree/main/aih-scanner) has a default that rarely needs overriding.

For pod and namespace labels that control which workloads the scanner observes, see [Labels and Annotations](annotations.md).

## Required values

| Key | Description |
|---|---|
| `config.backendUrl` | URL of the AI Hypervisor backend (your tenant). Provided in the install commands on your tenant's empty-state screen. |
| `scannerPrivateKey` | HMAC private key the scanner uses to authenticate to the backend. Provided alongside `backendUrl`. Mutually exclusive with `existingSecret.name`. |
| `existingSecret.name` | Name of a pre-existing Kubernetes Secret in the scanner namespace that holds the private key. Use instead of `scannerPrivateKey` when you manage secrets externally (External Secrets Operator, sealed secrets, and so on). The scanners mount it as a file and re-read it when it changes, so a [key rotation](settings.md#rotate-the-scanner-key) needs only a new value in the Secret — no restart. Recommended: it keeps the key out of your Helm values and Git. |
| `existingSecret.key` | Key inside that Secret that holds the private key. Default `scanner-private-key`. |

## GitOps and secret tooling

Values for installs that ArgoCD or Flux render with `helm template`, and for teams that deliver
secrets with their own tooling. All are optional; the defaults behave as before. Set exactly one key
source: `scannerPrivateKey`, `existingSecret.name` or one `scannerKey.*` — the chart refuses two. See
[Kubernetes with GitOps](deploy.md#kubernetes-with-gitops-argocd-flux).

| Key | Default | Description |
|---|---|---|
| `gitops` | `false` | From 2.17.0; use 2.17.2 or later, where a default install reports Healthy. For ArgoCD: every render is identical. The proxy CA and the internal proxy and classifier tokens are created once by a PreSync Job instead of in the templates, and an existing Secret of the same name is left as it is. Requires `namespace.create: false` (ArgoCD creates the namespace) and a stable webhook certificate (`webhook.tls.certManager` or `webhook.tls.existingSecret`); the render fails with a message otherwise. Flux and plain `helm install` do not need it. |
| `upgrader.enabled` | `true` | The in-cluster upgrader patches the scanner image. Set `false` when Git owns the version (ArgoCD self-heal would revert the patch). |
| `webhook.tls.existingSecret` | (empty) | From 2.17.0. A `kubernetes.io/tls` Secret you provide (`tls.crt`, `tls.key`) for the webhook; nothing is generated. Requires `webhook.caBundle`. `webhook.tls.secretName` is an older name for it. |
| `webhook.caBundle` | (empty) | With `webhook.tls.existingSecret`: the base64 PEM of the CA that signed its certificate (public; safe to commit). |
| `webhook.tls.certManager.enabled` | `false` | From 2.17.0. cert-manager issues the webhook certificate and its CA injector fills the `caBundle`. Set `webhook.tls.certManager.issuerRef.name` (and `.kind`: `Issuer` or `ClusterIssuer`). |
| `proxy.ca.existingSecret` | (empty) | With `proxy.enabled`: a Secret with the proxy's CA (`ca.crt`, `ca.key`); nothing is generated. |
| `secret.annotations`, `secret.labels` | `{}` | From 2.17.0. Metadata on the key Secret the chart creates from `scannerPrivateKey` (none is created with `existingSecret.name`). |
| `podAnnotations`, `podLabels` | `{}` | From 2.17.0. Added to the pods of every scanner workload — for example Vault injector annotations or mesh opt-outs. `webhook.`, `upgrader.`, `collector.` and `classifier.pool.` each take their own `podAnnotations` / `podLabels` on top. Selector labels cannot be overridden. |
| `extraEnvFrom` | `[]` | From 2.17.0. Extra `envFrom` sources (Secret or ConfigMap references) for the scanner, webhook, upgrader and collector. A key passed this way is read at start; with `existingSecret.name` it is mounted as a file and a new key is picked up without a restart. |
| `scannerKey.externalSecret.*` | off | From 2.17.3. The key from your secret manager through the External Secrets Operator: `enabled: true`, `secretStoreRef.name` (and `.kind`), `remoteRef.key` (and `.property`). The operator writes the key Secret the scanners read. |
| `scannerKey.vaultStaticSecret.*` | off | From 2.17.3. The key from Vault through the Vault Secrets Operator: `enabled: true`, `path`, `property` (the key's field name), optional `vaultAuthRef`. |
| `scannerKey.sealedSecret.*` | off | From 2.17.3. The key sealed for your cluster: `enabled: true`, `encryptedKey` — the output of `kubeseal --raw --scope strict --name aih-scanner-private-key --namespace <namespace>`. Safe to commit. |
| `scannerKey.file.path`, `scannerKey.file.csi.secretProviderClass` | (empty) | From 2.17.3. The key as a file already in every scanner pod: the Vault agent injector (annotations through `podAnnotations`) or the Secrets Store CSI driver (set `csi.secretProviderClass`; the chart mounts it). |
| `extraImagePullSecrets` | `[]` | Names of pull Secrets that already exist in the scanner namespace (a private registry mirror), added to every scanner workload. Hooks and the admission webhook use them from 2.17.1. |
| `classifier.pool.autoscaling` | `auto` | From 2.17.2. The classifier pool's HorizontalPodAutoscaler: `auto` creates it only where the cluster serves the metrics API (metrics-server) — without it an autoscaler cannot scale and ArgoCD reports the install Degraded; `true` always; `false` never (the pool runs `classifier.pool.minReplicas`). |

## Capture

| Key | Default | Description |
|---|---|---|
| `config.scanAllPods` | `false` | When `false`, the scanner observes only pods that opted in via the labels described in [Labels and Annotations](annotations.md). When `true`, the scanner observes every pod on the node (anti-loop exclusions still apply). Use `true` for short-lived investigations only. Opt-in is the production pattern. |
| `config.continuousScanEnabled` | `false` | When `true`, the scanner re-scans labeled pods continuously. When `false`, it scans once per pod lifecycle event. |

## Image and namespace

| Key | Default | Description |
|---|---|---|
| `image.tag` | the scanner release the chart ships (chart `2.11.1` ships `2.11.0`) | Override only to pin a specific scanner version. |
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
  --version 2.11.1 \
  --reuse-values \
  --set <KEY>=<NEW_VALUE>
```

The DaemonSet rolls out one node at a time. Scanner restarts do not interrupt observation; events buffer in memory until the new scanner attaches.
