# Labels and Annotations <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

Workload selection and tagging are driven by Kubernetes labels and annotations on your own pods or namespaces. The scanner picks up changes within ~30 seconds; no pod restart needed.

For the Helm chart-level configuration that controls the scanner itself, see [Chart Values](chart-values.md).

## Pod and namespace labels

The scanner is opt-in. You decide which workloads it sees by applying a label at either pod or namespace scope.

### `higgs.scan=enabled` — Onboard a workload

Apply this label to a pod or a namespace to bring the workload under observation. Once it is in place:

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

Pod-scope is the right choice when rolling out one deployment at a time. Namespace-scope fits when the entire namespace is one logical application.

### `higgs.io/enforce=enabled` — Apply enforcement

Apply this label in addition to `higgs.scan=enabled` to opt the workload into runtime enforcement. The scanner adds DNAT rules that route outbound LLM traffic through the local MITM proxy where the active rule set decides block / redact / alert. See [Enforcement](enforcement.md) for what the engine can do and how to drive it from the UI.

```bash
# Observe + enforce on a single deployment
kubectl label deployment checkout-bot higgs.io/enforce=enabled -n checkout

# Observe + enforce on every workload in a namespace
kubectl label namespace checkout higgs.io/enforce=enabled
```

Removing the label or setting it to `=disabled` rolls the workload back to observation-only. Observation continues regardless of the enforcement label.

## Pod annotations

### `aih.wallarm.com/tag` — Application tag

Apply this annotation on a pod to tag it for the dynamic-layering picker. The tag value appears as a column in briefings and reports, and gives operators a readable label for an app when the scanner-derived name is not descriptive enough.

```bash
kubectl annotate pod checkout-bot-7d8c5b \
  aih.wallarm.com/tag="checkout-v3" \
  -n checkout
```

Pods without the annotation show an empty tag column.

## Applying changes

Changing labels or annotations on workloads does not require a Helm operation. The scanner picks up the change on its next reconcile cycle (~30 seconds).
