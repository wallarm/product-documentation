# Scanner Permissions <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

From scanner 3.4.0, every permission the scanner asks for is optional. If your cluster withholds one, the
scanner still installs and stays up. It never touches your workloads, and it keeps every feature whose
permissions are granted. It also measures what it was given and reports each feature that is off, together
with the grant that turns it back on. With every permission granted, nothing changes.

## Where you see what is off

- **Infrastructure → a scanner → Permissions.** The block lists each feature that is off on that scanner,
  the missing grant, and how to grant it. "Every enabled feature is granted" means nothing is missing.
  "Not measured" means the scanner is older than 3.4.0.
- **Data pages.** Supply Chain and Infrastructure say "off on N scanners — needs X" when their data comes
  from a feature that is off, instead of showing an empty table.
- **The scanner log.** Each feature that goes off is logged once, with the missing grant
  (`[perm] feature off`).
- **`helm install` output.** The NOTES list what your `permissions:` values withhold.

## What each permission gives you

| Permission | What it gives you | Without it |
|---|---|---|
| `hostPID: true` | Process attribution, TLS plaintext capture (uprobes on the app's TLS library), package and CVE inventory of running workloads | Capture continues at the network level; inventory and plaintext capture are off |
| `hostNetwork: true` | The proxy's node ports (enforce profile) | The scanner listens on its pod IP. Install with `permissions.hostNetwork: false` so the chart adjusts its health probes. |
| `SYS_ADMIN` (or `BPF` + `PERFMON` on kernel 5.8+) | eBPF capture | Capture falls back to packet capture (pcap): sessions continue, TLS plaintext capture is off |
| `SYS_PTRACE` | Package inventory of running processes | Package and CVE inventory is off |
| `NET_ADMIN` | Kernel-lane enforcement and proxy routing (enforce profile) | Enforcement in the kernel lane and proxy routing are off |
| Containerd socket mount | Container identity of each process | The scanner reads it from the host's cgroup files instead (needs `hostPID`) |
| `/sys/fs/cgroup` mount | Runtime process watch | Runtime watch is off |
| `/sys/fs/bpf` mount | Enforcement that survives a scanner restart (enforce profile) | Kernel-lane enforcement is off |
| RBAC `watch pods`, `list namespaces` | Which pods are in scope | Nothing is scanned. Use a [namespace-scoped install](#namespace-scoped-install) instead. |
| RBAC `list services` | Attributing traffic to services | Sessions are attributed by pod only |
| RBAC on inventory kinds (deployments, ingresses, CRDs, ClusterRoles, service accounts, persistent volumes, nodes) | Infrastructure inventory | Only the section of the kind you withheld is empty, marked as not permitted |
| RBAC `patch namespaces` / `patch deployments` | The UI's Monitor / Enforce and Adopt actions | The UI shows the `kubectl` command to run yourself |
| RBAC `patch pods`, `create networkpolicies`, `create events` | Quarantine, and Events on affected pods (enforce profile) | Quarantine is off; no Events are written |

## Withhold permissions with `permissions:`

Set what your cluster does not grant. The chart renders without it, and the install never fails because of
it:

```yaml
permissions:
  hostPID: false              # no host PID namespace
  hostNetwork: false          # no host network; the API listens on the pod IP
  linuxCaps: [BPF, PERFMON, SYS_PTRACE]   # the only capabilities any container may add
  hostPaths:                  # host path -> false: not mounted
    /sys/kernel/debug: false
  podSecurity: restricted     # baseline | restricted: a pod spec that Pod Security level admits
```

- **`podSecurity: baseline`** and **`podSecurity: restricted`** render pod specs that the namespace's Pod
  Security level admits. That means no host namespaces, no host paths and no added capabilities.
  `restricted` also runs as non-root. The scanner then keeps inventory and RBAC-based features, and
  reports capture as off.
- **`linuxCaps`** lists the only capabilities a container may add. `BPF` and `PERFMON` stand in for
  `SYS_ADMIN` for eBPF.

## Namespace-scoped install

To grant the scanner no cluster-wide RBAC, list the namespaces it may watch:

```yaml
permissions:
  watchNamespaces: [payments, assistants]
```

- The chart renders a Role and a RoleBinding in each listed namespace, and no ClusterRole.
- The scanner watches and lists only those namespaces, and every pod in them is in scope.
- Cluster inventory is reported as off: nodes, CRDs, ClusterRoles and persistent volumes.
- Namespace onboarding from the UI is also off.

## Egress through your proxy

If the scanner namespace may reach the internet only through an HTTP(S) proxy, set:

```yaml
egressProxy:
  url: http://proxy.example.internal:3128
  noProxy: 10.0.0.0/8         # optional, added to the defaults
```

- The scanner sends backend traffic through the proxy.
- The Kubernetes API server, cluster DNS names (`.svc`, `.cluster.local`), loopback and instance metadata
  always stay direct.

## AWS Fargate

The Fargate task definition in **Settings → Scanners → AWS Fargate** has two options for platform
restrictions:

- **Egress redirect → HTTPS_PROXY on the app.** Use this for accounts whose policy forbids
  `proxyConfiguration`. The app's HTTPS clients use the proxy container as an explicit proxy.
- **No root init container.** From scanner 3.4.0, the images carry the socket directory with the right
  owner, so the template no longer includes a container that runs as root.
