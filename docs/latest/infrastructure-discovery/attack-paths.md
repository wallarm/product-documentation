# Attack Paths in Infrastructure Discovery <a href="../../about-wallarm/subscription-plans/#wallarm-infrastructure-discovery"><img src="../../images/infrastructure-discovery-tag.svg" class="non-zoomable" style="border: none;"></a>

A [finding](security.md#findings) tells you that a single resource is misconfigured. An **attack path** tells you which chain of misconfigurations actually leads somewhere — for example, that a publicly reachable EKS cluster is the first hop of a route that ends at a high-value IAM role, and that closing that one cluster removes 13 routes to your most valuable resources at once.

The **Attack Paths** tab in the **Infrastructure Discovery** section is where you review those chains, alongside the [Graph](graph.md) and [Security](security.md) tabs. It has three sub-tabs: **Paths**, **Crown jewels**, and **Key nodes**.

## How attack paths are built

After every scan, Infrastructure Discovery assembles the discovered inventory — assets, network relationships, IAM trust and permissions, and findings — into a graph, then walks it looking for complete routes from a point an attacker could enter to a resource worth stealing:

```
External exposure  →  Pivot  →  Crown jewel
```

Every hop is backed by a specific configuration fact — a public API endpoint, a `0.0.0.0/0` ingress rule, a public-access flag, an IAM statement, a trust policy, a `PassRole` grant. Nothing is inferred from resource names or tags alone. Findings raise the risk of a path that already exists, but they never create one on their own.

!!! info "Read-only analysis"
    Infrastructure Discovery never modifies your cloud resources, so it does not remediate a path for you. Use the recommendation it provides to make the change in AWS, or handle the underlying finding with [policies](security.md#policies).

## Concepts

| Term | Meaning |
| --- | --- |
| **Entry point** | The first resource on a path — where an attacker starts. Its **entry class** is `internet` (reachable from the public internet), `cross_account` (an identity in another AWS account can assume a role here), or `internal` (no external door is known, but an identity compromised inside the account reaches a crown jewel). |
| **Confirmed** and **assume-breach** | How strong the evidence for the entry is. **Confirmed** paths start at a real external door; **assume-breach** paths are conditional on a credential being stolen first. Both counts appear in the header, and confirmed paths are the ones to triage first. |
| **Crown jewel** | A resource worth an attacker's effort — databases, buckets, file systems and snapshots on the data side; secrets, KMS keys, IAM roles, users and access keys on the identity side. Each carries a **value** from low to critical. |
| **Choke point** | The single resource a path — and often several others — must pass through, which makes it the highest-leverage place to break the chain. It is frequently a shared role, security group, or subnet in the middle of the chain rather than the entrance. |
| **Risk** | The headline rating of a path, from low to critical. It combines how reachable the entry is, what the permissions on each hop allow, the value of the target, and the length of the chain. Risk never exceeds what the target is worth, so a route to a low-value resource does not surface as critical. |
| **Attack type** | What the attacker gains at the end: **credential theft** (the chain ends at a secret, key, or identity), **data exfiltration** (it ends at a data store), or **reaches crown jewel** for chains that match neither shape. |
| **Confidence** and **modality** | Per-hop markers of evidence quality, kept separate from **Risk**: confidence rates how sure the analysis is that a hop exists, from 0 to 100 — not how dangerous it is. It is scored per hop, then reduced to the lowest score along the path, so one weak hop caps the whole chain.<br><br>Main drivers: the kind of hop (network reachability, identity and permission grants, trust-based entry, privilege escalation, exploitability), how directly it was resolved, how broad the access is, and any mitigating condition such as a permission boundary.<br><br>Modality reflects the evidence itself — **Observed** when the hop was seen happening in traffic or log data, or **Allowed** when the configuration merely permits it. |

## Paths

The **Paths** sub-tab pairs a list of routes with a graph of the selected one. The header summarizes the current scope — total paths, how many are assume-breach and how many confirmed, the number of entry points, and a breakdown by risk.

The list is ordered by risk. Each row names the target and its value, the risk rating, the route in brief (for example, `via Internet → ai-os-prod`), the resource types along the chain, the hop count, how many paths break if you fix this one, and the attack type.

Selecting a row draws that path on the graph, which is laid out in three lanes — **External exposure**, **Pivot**, and **Crown jewels** — so you can read where a route starts and where it ends.

![Attack paths list](../images/infrastructure-discovery/attack-paths.png)

Filter the view by account, region, severity, attack type, entry class, and status.

Use **Fit to view** to frame the selected path, or **Full screen** for a large estate.

Open a path to see the reasoning behind it:

* **What this means** — the route in plain language, for example "An attacker reaches this path from the internet — reachable via role assumption to a crown jewel."
* **The chain** — the hops in order, each with the configuration fact that makes it possible. Select a hop for its edge evidence, such as a cluster being public through a public EKS API endpoint, or a role being assumable through IRSA by workloads in that cluster.
* **Choke point** — the resource to fix, with the number of paths that closing it removes. On a short path the entry point and the choke point can be the same resource, in which case fixing the front door is also the biggest lever.

![Attack path details](../images/infrastructure-discovery/attack-path-details.png)

A path keeps a stable identity across scans, so you can filter by status to separate new routes from ones you have already reviewed, and confirm on the next scan that a path you fixed is now resolved.

## Crown jewels

The **Crown jewels** sub-tab is the inventory of what Infrastructure Discovery treats as worth protecting, with the value assigned to each resource and the reason for it. Filter by account, region, asset type, and source.

Targets are either detected automatically from the resource type and its configuration, or pinned manually. Automatic detection reads your own metadata: a `prod` environment tag, a data classification tag such as `pii` or `pci`, a name containing `payment` or `customer`, administrative privilege, or deletion protection all raise the value of a resource, while a `dev`, `test`, or `staging` tag lowers it. Tagging your resources consistently is therefore the most effective way to make the ranking match your business, because it improves every path at once rather than one target at a time.

![Attack paths list](../images/infrastructure-discovery/crown-jewels.png)

## Key nodes

Where **Paths** shows routes, the **Key nodes** sub-tab shows the resources those routes depend on, so you can fix one thing and close many paths. Switch between entry points, choke points, or both.

**Entry points** are ranked by impact — by the highest value they reach, then the worst risk, then how much they reach — and each row explains in words why it ranks where it does. This answers which single door to close first.

**Choke points** are grouped by the control that would break the paths running through them: a security group rule open to `0.0.0.0/0`, a public-access flag, a shared security group acting as a hub, an overly permissive IAM permission, a trust policy that admits a foreign or wildcard principal, a world-readable resource policy, an identity that can escalate its own privileges, or a finding that grants credential or host control. Each carries a specific recommendation and the number of crown jewels it protects.

Some choke points have no live path today. The misconfiguration is still real and still worth fixing before something else connects to it.

![Attack paths list](../images/infrastructure-discovery/key-nodes.png)

## Accuracy and limits

Attack Paths is deliberately conservative about what it claims, and states its own uncertainty:

* An empty result is never reported as "you are secure". If no confirmed path exists, the summary says what it did find instead — assume-breach routes, identities that would reach a crown jewel if compromised, or no crown jewels in scope at all.
* Effective permissions — permission boundaries, service control policies, and session policies — are not fully evaluated, and hops that depend on them are labeled accordingly. Such a path may be blocked in practice, so verify it before raising a change ticket.
* When the analysis hits a traversal limit on a very large estate, it says so, and every count on that scan is a lower bound. Read "at least N", not "exactly N".
* Routes that AWS makes impossible are excluded by design, such as a service-linked role that only its owning AWS service can assume. Nothing is deleted from the underlying data — the excluded relationships are kept and labeled with the reason.
* Path data is a snapshot, as fresh as the last scan.
