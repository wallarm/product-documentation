# Scanner permissions and data <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

This page lists everything the AI Hypervisor scanner is allowed to do in your cluster, what it sends to Wallarm, how long Wallarm keeps it, and how to remove the scanner completely. It applies to the `aih-scanner` Helm chart 3.0.0 and later.

## Profiles

The chart value `profile` selects a preset of capabilities. Any single capability can be overridden with `capabilities.<name>: true|false`.

| Profile | What it is for | Writes to the cluster |
|---|---|---|
| `monitor` (default) | Observation only. The scanner inspects pods in namespaces you labelled `higgs.scan=enabled` yourself. | Nothing outside its own namespace. No webhook, no proxy, no enforcement, no DNS observation. |
| `enforce` | Adds blocking: the proxy, the admission webhook, kernel enforcement, and the console's **Monitor**, **Enforce**, **Adopt** and **Revert** actions. | Namespace labels, workload restarts on **Adopt**, quarantine labels and NetworkPolicies, the proxy's CA Secret, Kubernetes Events. |
| `full` | Everything in `enforce`, plus Shadow AI, PodSecurity changes on onboarded namespaces and in-process agents. The 2.x behaviour. | As `enforce`, plus PodSecurity labels. |

If you upgrade from 2.x and want the 2.x behaviour, set `profile: full`. A 2.x value you set explicitly (`proxy.enabled`, `webhook.enabled`, `coreDNS.enableLogPlugin`, `upgrader.enabled`, `agents.enabled`) still takes precedence over the profile.

When the scanner is not allowed to do something, it does not try. The console then disables the action and shows the `kubectl` command that does it by hand. The **Enforcement** page shows how many active block rules are not applied.

## Capabilities

| Capability | What it enables | `monitor` | `enforce` | `full` |
|---|---|---|---|---|
| `capture` | eBPF capture, TLS uprobes, package and model scans, all read-only. | on | on | on |
| `inventory` | Read-only cluster inventory: nodes, services, workloads, ingresses, NetworkPolicies, CRDs, ClusterRole names. | on | on | on |
| `shadowAI` | DNS observation (packet capture of UDP/53), CoreDNS and ingress-controller log reads, the passive MCP server fingerprint, and connection-based LLM egress. | – | – | on |
| `coreDNSPatch` | A post-install job adds the `log` plugin to `kube-system/coredns`. | – | – | – (opt-in) |
| `onboard` | The console's **Monitor**, **Enforce** and **Revert** actions label namespaces. | – | on | on |
| `adopt` | The console's **Adopt** action rolling-restarts workloads. | – | on | on |
| `podSecurity` | Sets PodSecurity `privileged` on onboarded namespaces. The previous values are saved in the namespace annotation `higgs.io/psa-before` and restored on **Revert**. | – | – | on |
| `enforce` | Kernel enforcement, block rules and quarantine. | – | on | on |
| `proxy` | The egress proxy and its CA Secret. | – | on | on |
| `webhook` | The admission webhook. It is installed only together with the proxy or the agents. | – | on | on |
| `agents` | In-process agents for Python and Node.js. | – | – | on |
| `selfUpgrade` | The in-cluster upgrader updates the scanner image. | – | – | – (opt-in) |
| `broker` | Credential brokering: reads the Secrets you list, so the proxy can insert a brokered value toward its bound destinations. | – | – | – (opt-in) |

## Kubernetes RBAC

Each capability has its own ClusterRole and binding, named `<release>-<capability>` and labelled `higgs.wallarm.com/capability`. To list the capabilities an install has, run `kubectl get clusterrole -l higgs.wallarm.com/capability`.

| ClusterRole | Rules |
|---|---|
| `capture` | `pods`, `namespaces`, `services`, `nodes`: `get`, `list`, `watch`. `pods/status`: `get`. |
| `inventory` | `serviceaccounts`, `persistentvolumes`: `get`, `list`. Deployments, StatefulSets, DaemonSets: `get`, `list`. Ingress classes, Ingresses, NetworkPolicies: `get`, `list`. CRDs: `get`, `list`. ClusterRoles: `list`. |
| `shadow-ai` | `pods/log`: `get`. |
| `onboard` | `namespaces`: `patch`. |
| `adopt` | Deployments, StatefulSets, DaemonSets: `get`, `list`, `patch`. ReplicaSets: `get`. |
| `enforce` | `pods`: `patch` (quarantine label). NetworkPolicies: `get`, `list`, `create`, `update`, `delete` (only `aih-quarantine-<id>`, deleted when the quarantine is lifted). Events: `create`, `patch`. |
| `proxy` | Secrets: `get`, `update`, `patch` on the CA Secret by name, and `create`. A ValidatingAdmissionPolicy admits only an Opaque Secret with the CA name. |

A `monitor` install binds only `capture` and `inventory`, which contain no write verb. It never reads ConfigMaps, and it reads no Secret outside its own namespace. In its own namespace the scanner has two Roles, both limited to one object by name:

* `<release>-key-delivery`: `get` and `update` on the Secret `<release>-delivered-key`, where a rotated scanner key is stored.
* `<release>-self-terminate`: `get` and `delete` on its own DaemonSet, used when you remove the scanner from the console.

With `proxy`, it also manages its own CA Secret by name (see the `proxy` row above).

With `broker`, each namespace listed in `broker.secrets` gets one Role, `<release>-broker`, with `get` on exactly the listed Secrets (`resourceNames`). No other Secret is readable, and no Role is created for an empty list.

## Node privileges

The scanner runs as a DaemonSet with `hostPID` and `hostNetwork`.

| Privilege | Profile | Why |
|---|---|---|
| `SYS_PTRACE`, `SYS_ADMIN` | all | Reading `/proc/<pid>/root` of target containers, loading eBPF programs. |
| `NET_ADMIN` | `enforce`, `full`, or with `shadowAI` | tc filters and sockops for kernel enforcement, and the DNS packet capture. |
| `allowPrivilegeEscalation: true`, AppArmor `Unconfined` | `enforce`, `full` | Writing pinned eBPF objects to `/sys/fs/bpf`. In `monitor` the scanner runs with `false` and `RuntimeDefault`. |
| `/proc`, `/var/log`, `/sys/kernel/btf`, `/sys/fs/cgroup`, the containerd socket (all read-only) | all | Process, cgroup and container metadata for capture. |
| `/sys/kernel/debug` (read-write) | all | kprobe and uprobe attachment on kernels without a perf kprobe PMU. |
| `/sys/fs/bpf` (read-write) | `enforce`, `full` | Pinned enforcement maps, so a restart keeps enforcing. |
| `/run/higgs` (host path) | with `agents` | The socket that in-process agents use. Otherwise a per-pod `emptyDir`. |

In `monitor` (no `enforce`), a short-lived init container named `kernel-lane-cleanup` runs before the scanner starts. It holds `NET_ADMIN` and a writable `/sys/fs/bpf` for a few seconds, removes any enforcement objects an earlier version left on the node (tc filters named `session_block`, pins under `/sys/fs/bpf/higgs`), and exits.

`tolerations` defaults to tolerating every taint, so that no node goes unobserved. `priorityClassName` defaults to `system-node-critical`. You can change both values.

The scanner's HTTP port (`config.port`, default 19090) listens on `127.0.0.1` only. The exception is when in-process agents with the Python agent are enabled. Then it also listens on the node address, and every post must carry its namespace's ingest token, which the webhook injects into the pod.

## Data sent to Wallarm

The scanner sends data only to your tenant (`config.backendUrl`). Every request is signed with the scanner key.

| Data | Source | Content |
|---|---|---|
| Package and model inventory | Scans of labelled pods | Packages and versions, model files and their format, MCP server definitions. File contents are not sent. |
| AI traffic | Capture of labelled pods (eBPF, and the proxy in `enforce` and `full`) | One record per request: source and destination application, host, path, status, timings, token counts, the caller identity (JWT subject or a derived anonymous key), personal-data classes found, and the request and response body. Bodies have personal data masked (for example `j***@example.com`) and are cut to 2,048 characters. |
| Cluster inventory | `inventory` | Node, service, workload, ingress and NetworkPolicy names and labels; cluster provider and region. No Secrets or ConfigMaps. |
| DNS lookups (`shadowAI` only) | Packet capture of UDP/53 on the node | Only queries for known AI-provider domains: the domain, the source pod and namespace, and a count. Other lookups are dropped on the node. |
| Ingress traffic (`shadowAI` only) | Ingress-controller logs | Requests whose host matches a known AI provider: host, source and count. |
| Scanner health | The scanner itself | Version, capabilities, memory and CPU, and the counts of what it observed. |

Wallarm keeps this data for your tenant's retention period. If a retention period is set for your tenant, sessions, events and scan inventory are kept for that many days, personal-data records for twice that, findings for four times that, and block lists for that many days. Without a retention period, data is kept until you delete it. To delete everything about one cluster or device, use **Forget environment…** on its card in [Debugger](debugger.md).

## In-process agents and signals

In-process agents run only with the `agents` capability. For Node.js, the scanner attaches to an already running process only when it has positive evidence that the process is the V8 runtime. It never signals other processes. Attaching to running processes is off by default (`agents.nodeLiveAttach`, `agents.pythonLiveAttach`); new pods get the agent through the webhook instead.

## Uninstall

With Helm, run `helm uninstall <release> -n higgs-system`. A pre-delete hook removes the enforcement objects (pins under `/sys/fs/bpf/higgs` and tc filters named `session_block`) from every node, along with the proxy's iptables rules.

Argo CD does not run Helm `pre-delete` hooks when it removes an application. Nothing is left enforcing either way:

* Since chart 3.0.0, the kernel enforcement programs stop dropping traffic within two minutes of the scanner being gone, whether it was uninstalled, crashed or OOM-killed.
* With `monitor`, the `kernel-lane-cleanup` init container removes earlier versions' objects on every start.

To remove the remaining pins by hand on a node, run `rm -r /sys/fs/bpf/higgs` there.
