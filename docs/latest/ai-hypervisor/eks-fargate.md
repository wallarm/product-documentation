# Amazon EKS on Fargate <img src="../../images/ai-hypervisor-tag.svg" class="non-zoomable" style="border: none;">

Pods that Amazon EKS runs on **Fargate** have no node the scanner's DaemonSet could run on. For them, the
scanner's admission webhook adds a small capture lane to each pod instead: its own proxy and its own scanner, as
sidecars. These sidecar scanners hold **no scanner key**. Each one proves its identity with the pod's Kubernetes
service account token and receives a session key that expires within an hour. Pods on EC2 nodes in the same
cluster keep the normal DaemonSet capture. Use scanner 3.12.0 or later.

## Before you start

* Kubernetes **1.29** or later: the sidecars are native sidecars, so they start before your app and stop after it.
* A Fargate profile that selects the namespaces you want captured.
* Cluster DNS served by **CoreDNS pods** (the Amazon EKS CoreDNS add-on). The sidecars resolve your AI Hypervisor
  address and in-cluster names through it. On an **EKS Auto Mode** cluster, DNS runs inside each EC2 node and no
  CoreDNS pods exist, so pods on Fargate cannot resolve any name there. Add the CoreDNS add-on first. To check,
  run `kubectl -n kube-system get pods -l k8s-app=kube-dns`: it must list running pods.

You do not configure the cluster's identity provider: every EKS cluster has one, and the scanner registers it
with AI Hypervisor for you. A cluster with a private API endpoint works too.

## Install

1. Install the scanner with the command from [Install the Scanner](deploy.md), and add:

    ```yaml
    fargate:
      sidecars:
        enabled: true
    clusterName: "payments-eks"   # optional: the cluster's name in AI Hypervisor
    ```

    The scanner itself runs on a node (or its own Fargate profile). The scanner key stays in the scanner's
    namespace and is never copied into your namespaces.

2. Label each namespace whose Fargate pods should be captured:

    ```bash
    kubectl label namespace <namespace> higgs.scan=enabled        # capture
    kubectl label namespace <namespace> higgs.io/enforce=enabled  # capture and enforcement
    ```

3. Restart the workloads in those namespaces (`kubectl -n <namespace> rollout restart deployment/<name>`). The
   webhook adds the sidecars when a pod is created.

To keep a pod out, label it `higgs.io/inject: "false"`. Without `fargate.sidecars.enabled`, pods on Fargate are
left unchanged and carry the annotation `higgs.io/skipped`.

## Trust: Settings › Scanners › Workload identity

Within five minutes of the install, **Settings** → **Scanners** → **Workload identity (EKS Fargate)** shows a row
for the cluster:

| Column | Shows |
|---|---|
| **Cluster** | the cluster's name (`clusterName`, or the detected name) |
| **Status** | Active or Revoked |
| **Namespaces** | the labelled namespaces whose Fargate pods may sign in |
| **Last 24 h** | sign-ins (token exchanges) and refusals, with the last refusal's reason |

The scanner refreshes the row every five minutes and when a namespace label changes. A namespace you unlabel
drops out.

**To stop a cluster's sidecars**, click **Revoke** on its row, then **Revoke** in the dialog. Its sidecars are
refused at their next request and cannot sign in again. The cluster registering itself again does not undo this.
**To allow them again**, click **Trust again**, then **Trust again**. The sidecars reconnect within a minute.

Rotating your tenant's scanner key also ends every session; the sidecars sign in again on their next request.

## What each pod gets

| Added | What it does |
|---|---|
| Proxy sidecar | your app's outbound proxy on `127.0.0.1:8877`; it reads requests to AI providers |
| Scanner sidecar | reports what the proxy and the in-process agents see. It holds no key: it signs in with the pod's service account token |
| CA trust init container | writes a CA bundle (the image's trusted roots plus the proxy's CA) your app trusts |
| In-process agents | Python (`PYTHONPATH`) and Node.js (`NODE_OPTIONS`). On Fargate they are what names the caller of each request |
| Environment | `HTTP_PROXY` and `HTTPS_PROXY` point to the proxy sidecar; `NO_PROXY` keeps loopback, in-cluster names and the AWS metadata endpoints direct. Variables your container already sets are never overwritten |
| Service account token | mounted only in the scanner sidecar, at `/var/run/secrets/aih/token`, valid for one hour and renewed by Kubernetes |
| Annotation | `higgs.io/sidecars: eks-fargate` |

Nothing is added that Fargate refuses: no extra Linux capabilities, no `hostPath` volumes and no privileged
containers.

## Limits

* **Caller identity** comes from the in-process agents. Sessions of Python and Node.js apps carry the caller's
  user (the JWT subject) and the app's name (the pod's `app` label). Apps in other languages are captured
  through the proxy, with the network address as the identity.
* **Your app must use `HTTP_PROXY` / `HTTPS_PROXY`.** Fargate does not allow redirecting traffic in the pod, so
  a client that ignores these variables is not captured.
* **Package inventory and live attach** need the scanner to see your app's processes: set
  `shareProcessNamespace: true` on the pod. The webhook never sets it.
* **HTTP/3 (QUIC)** traffic is not read, as on other platforms without traffic redirection.

## Check a pod

```bash
kubectl -n <namespace> get pod <pod> -o jsonpath='{.spec.schedulerName} {.metadata.annotations.higgs\.io/sidecars}{"\n"}'
# fargate-scheduler eks-fargate
kubectl -n <namespace> logs <pod> -c higgs-scanner | grep "session key obtained"
```

## Tested on

Each change to this lane is installed on an Amazon EKS cluster with a Fargate profile before it ships. The
test checks that:

* the pod runs on Fargate with the sidecars, and no scanner key exists in its namespace;
* the sidecar signs in, and the cluster appears as trusted;
* a caller's session carries the app's request to an AI provider under the app's name;
* **Kill Session** makes the app refuse that caller, and lifting it lets the caller through again;
* **Revoke** refuses the cluster's sidecars, and **Trust again** lets them back in.
