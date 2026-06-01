# Labels and Annotations <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

AI Hypervisor decides which workloads to observe and how to tag them through Kubernetes labels and annotations applied to your own pods or namespaces. The scanner picks up changes within ~30 seconds — no pod restart needed.

For the Helm chart-level configuration that controls the scanner itself, see [Chart Values](chart-values.md).

## Pod and namespace labels

The scanner is opt-in. You decide which workloads it sees by applying a label at either pod or namespace scope.

### `higgs.scan=enabled` — Onboard a workload

Applied to a pod or a namespace, this label tells the scanner to observe the workload:

* The scanner attaches via eBPF and captures every outbound call.
* Sessions are assembled with user attribution across hops.
* PII is detected on the wire.

```bash
# Observe a single deployment
kubectl label deployment checkout-bot higgs.scan=enabled -n checkout

# Observe everything in a namespace
kubectl label namespace checkout higgs.scan=enabled
```

### Choosing between pod-scope and namespace-scope

Both scopes are honored. A pod is observed when **any** of the following is true:

* The pod has `higgs.scan=enabled`.
* The pod's namespace has `higgs.scan=enabled`.

Use pod-scope to roll out one deployment at a time. Use namespace-scope when the entire namespace is one logical application.

## Pod annotations

### `aih.wallarm.com/tag` — Application tag

Apply this annotation on a pod to tag it for the dynamic-layering picker. The tag value appears as a column in briefings and reports, and gives operators a human-readable label for an app when the scanner-derived name is not descriptive enough.

```bash
kubectl annotate pod checkout-bot-7d8c5b \
  aih.wallarm.com/tag="checkout-v3" \
  -n checkout
```

Unset annotations result in an empty tag column.

## Applying changes

After changing labels or annotations on workloads, no Helm operation is needed — the scanner picks up the change on its next reconcile cycle (~30 seconds).
