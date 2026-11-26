# Red Hat OpenShift <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

The AI Hypervisor scanner installs on Red Hat OpenShift 4 (and OKD) with the same Helm chart and command as on
any other Kubernetes cluster. You do not need to grant any Security Context Constraint (SCC) by hand: the chart
detects OpenShift and binds what each component needs. Use scanner 3.13.1 or later: it is the first release
whose traffic features (below) pass on OpenShift.

## Install

Use the command from [Install the Scanner](deploy.md). The chart detects OpenShift from the
`security.openshift.io` API. On OpenShift it then:

* binds the scanner's ServiceAccount to the SCC its [permission preset](permissions.md) needs (see the table
  below);
* pins no user ID (UID) in any pod that runs under `restricted-v2`, because OpenShift assigns one from the
  namespace's range;
* runs the containers that read other containers' files under the SELinux type `spc_t`, because RHCOS and RHEL
  enforce SELinux;
* allows DNS to `openshift-dns` on ports 53 and 5353 in its NetworkPolicies, because the cluster DNS Service
  forwards port 53 to the DNS pods' port 5353.

| Permission preset | SCC the chart binds |
|---|---|
| Default (host access: eBPF capture, process attribution, enforcement) | `privileged` |
| `permissions.podSecurity: baseline` | `anyuid` |
| `permissions.podSecurity: restricted` | none (`restricted-v2`, the OpenShift default) |

If your cluster admin grants SCCs themselves, install with `openshift.sccBinding=false`. The admin then runs:

```bash
oc adm policy add-scc-to-user <scc> -z <scanner service account> -n <scanner namespace>
```

To render the chart offline (`helm template`, no cluster to detect from), set `permissions.openshift=true`.

## Traffic capture and enforcement

On OpenShift's OVN-Kubernetes network, CRI-O runtime and SELinux-enforcing RHCOS / RHEL nodes, the scanner
works as on other clusters:

* **eBPF capture**, including TLS plaintext from OpenSSL (`libssl`) before encryption;
* **attribution** of traffic to the pod and container, read from CRI-O;
* **the proxy**: pods with `higgs.io/enforce=enabled` are routed through it, and their HTTPS calls to AI
  providers are decrypted with a CA that the chart creates and the onboarded pods trust;
* **quarantine** of a pod: in the kernel (eBPF on the pod's network interface), with a NetworkPolicy fallback;
* **an egress proxy** for the scanner itself: set `egressProxy.url` when the scanner namespace has no direct
  route out.

CRI-O's default seccomp profile lets a container open performance events (which eBPF probes attach through) only
with the `PERFMON` capability. On OpenShift the chart adds `PERFMON` to the scanner container. On another cluster
that runs CRI-O, add it yourself:

```bash
--set 'securityContext.capabilities.add[0]=PERFMON'
```

Without it, the scanner's eBPF programs load but no probe attaches, so there is no eBPF capture and no kernel
quarantine.

## In-process agents in your pods

When agents are on, the admission webhook adds the in-process agents (Python and Node.js) to onboarded pods.
How it adds them depends on what the pod's SCC admits:

* **Pods under `privileged`, `hostaccess` or `hostmount-anyuid`** get the agents from a node directory
  (`hostPath`), as on other clusters.
* **Every other pod, including the OpenShift default `restricted-v2`,** gets them in **pod-network mode**. An
  init container, `higgs-agent-files`, copies the agents into an `emptyDir` volume, and the agents send their
  events to the node's scanner over the pod network. The pod carries the annotation
  `higgs.io/agents-mode: pod-network`. The runtime policy applies in this mode too.

The webhook never adds anything the pod's SCC or its namespace's Pod Security level would refuse, so onboarding
a pod never makes it fail admission. When a pod runs without the agents, it carries the annotation
`higgs.io/agents-skipped` with the reason. **Settings › Scanners** lists these pods under **Pods without
in-process agents**, with what still works and how to get the agents back.

## Tested on

Every scanner release is installed on single-node OKD 4.20 and on MicroShift 4.20 before it ships. The
tests check:

* each permission preset turns Ready with no manual SCC grant;
* onboarded workloads under `restricted-v2` stay admitted with the agents in pod-network mode;
* HTTPS calls through the proxy are decrypted, eBPF captures `libssl` traffic, and traffic is attributed to its
  pod;
* a quarantined pod cannot reach an AI provider, both in the kernel and with the NetworkPolicy fallback, and
  reaches it again once the quarantine is lifted;
* the scanner reaches the platform through an egress proxy;
* customer traffic keeps flowing when the proxy, the scanner or the admission webhook is down, or the prompt
  classifier hangs.
