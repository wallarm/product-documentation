[deployment-platform-docs]:    ../../supported-deployment-options.md

# Wallarm eBPF-Based Solution (Beta)

!!! info "Beta"
    The eBPF-based solution is currently in beta. Your feedback helps improve it — contact [sales@wallarm.com](mailto:sales@wallarm.com) with questions or suggestions.

Wallarm offers an eBPF-based security solution that leverages the power of the Linux kernel and seamlessly integrates with Kubernetes environments. The solution requires no changes to your application code and provides fast time-to-value for [API Discovery](../../../api-discovery/overview.md) — **automatically building your API inventory based on real traffic**. This article explains how to use and deploy the solution using the Helm chart.

## Traffic flow

Traffic flow with Wallarm eBPF-based solution:

![eBPF traffic flow](../../../../images/waf-installation/epbf/ebpf-traffic-flow.png)

The eBPF solution is designed to monitor traffic using the following protocols:

* HTTP 1.x or HTTP 2
* Proxy v1 or Proxy v2

## TLS/SSL visibility

Traffic may utilize TLS/SSL encryption or plain text data transfer. The eBPF agent intercepts traffic data from process memory after it has been decrypted, so visibility depends on the TLS implementation used by the application:

* **Supported**: Applications using the shared OpenSSL library (e.g., NGINX, HAProxy) — the agent can observe decrypted traffic.
* **Not supported**: Applications using other TLS/SSL implementations (e.g., Envoy with BoringSSL, Go's native `crypto/tls`, Java's built-in TLS) — traffic from these applications will not be visible to the agent.

For mTLS scenarios in Kubernetes, visibility depends on where TLS is terminated:

* If mTLS is terminated at a proxy that uses OpenSSL (e.g., NGINX Ingress), the agent can observe the decrypted traffic at that point.
* If mTLS is terminated within the application itself using an unsupported TLS library, the traffic will be invisible to the agent.

## How it works

The Linux operating system comprises the kernel and the user space, where the kernel manages hardware resources and critical tasks, while applications operate in the user space. Within this environment, eBPF (Extended Berkeley Packet Filter) enables the execution of custom programs within the Linux kernel, including those focused on security. [Read more about eBPF](https://ebpf.io/what-is-ebpf/)

As Kubernetes utilizes the capabilities of the Linux kernel for crucial tasks like process isolation, resource management, and networking, it creates a conducive environment for integrating eBPF-based security solutions. In line with this, Wallarm offers an eBPF-based security solution that seamlessly integrates with Kubernetes, leveraging the kernel's functionalities.

### Architecture

The eBPF agent is deployed as a DaemonSet on every Kubernetes worker node. The agent attaches eBPF hooks to processes and memory of containers in target namespaces, extracting protocol-level data without modifying the application code or injecting sidecars. The Helm chart automatically configures the agent pod with `hostPID: true` (access to the host process namespace) and runs the agent container in privileged mode with the `SYS_PTRACE` and `SYS_ADMIN` capabilities — these settings are required for eBPF hooks to function and are applied by default during deployment. Ensure your cluster security policies allow privileged DaemonSets.

The agent monitors **inbound** connections to pods, outbound traffic from those pods is not captured.

The agent generates a traffic mirror and forwards it to the Wallarm Native Node. The Native Node analyzes the mirrored traffic to discover API endpoints and send the data to the Wallarm Cloud. Visibility into the [API inventory](../../../api-discovery/exploring.md) is provided through the Wallarm Console UI.

The following diagram demonstrates the solution components:

![eBPF components](../../../../images/waf-installation/epbf/ebpf-components.png)

### API Discovery

The solution empowers Wallarm's core [API Discovery](../../../api-discovery/overview.md) module to identify your API endpoints, construct your API inventory, and ensure it remains up-to-date.

Because the eBPF agent operates at the node level, it can observe service-to-service traffic within the Kubernetes cluster. This allows API Discovery to map internal microservice communications and identify APIs that services expose to each other — providing visibility into internal API surface that is typically invisible to perimeter-level security tools.

### RBAC

The Helm chart automatically creates the following RBAC resources for the eBPF agent:

* **ServiceAccount** for the agent pod (created by default)
* **ClusterRole** granting `get`, `list`, `watch` permissions on `pods`, `nodes`, and `namespaces` — required for the agent to resolve namespace labels and pod annotations for traffic filtering
* **ClusterRoleBinding** linking the ServiceAccount to the ClusterRole

Processing and aggregation pods use optional ServiceAccounts (disabled by default). Review these RBAC resources if your cluster has strict security policies.

## Use cases

The eBPF-based solution enables [API Discovery](../../../api-discovery/overview.md) in Kubernetes without impacting production — it operates out-of-band, introduces no latency, and requires no changes to application code.

Based on real traffic, API Discovery builds your API inventory — including internal service-to-service endpoints invisible at the perimeter — and provides [sensitive data detection](../../../api-discovery/sensitive-data.md), [risk scoring](../../../api-discovery/risk-score.md), and [change tracking](../../../api-discovery/track-changes.md).

Use this solution to audit your APIs and the sensitive data they process, map internal microservice communications, or evaluate Wallarm on real traffic out-of-band.

## Technical requirements

Ensure the following technical prerequisites are met for a successful deployment of the eBPF solution:

* Supported Kubernetes version:

    * AWS - Kubernetes 1.24 and above
    * Azure - Kubernetes 1.26 and above
    * GCP - any Kubernetes version
    * Bare-metal server - Kubernetes 1.22 and above
* (Optional) Installed [cert-manager](https://cert-manager.io/docs/installation/helm/) — required only if you enable certificate provisioning via cert-manager for secure communication between the agent and the Native Node. Alternatively, you can use a pre-existing secret or provide certificates manually. See [certificate configuration](helm-chart-for-wallarm.md#configconnectorcertificate) for details.
* [Helm v3](https://helm.sh/) package manager.
* Linux kernel version 5.10 or 5.15 with BTF (BPF Type Format) enabled. Supported on Ubuntu, Debian, RedHat, Google COS, or Amazon Linux 2.
* Processor with the x86_64 architecture.
* Applications must use the shared **OpenSSL** library for TLS — this is required for the eBPF agent to observe encrypted traffic. Applications using other TLS implementations (BoringSSL, Go `crypto/tls`, Java built-in TLS) will not be visible. See [TLS/SSL visibility](#tlsssl-visibility) for details.
* Your user account should have [**Administrator** access](../../../user-guides/settings/users.md#user-roles) to the Wallarm Console.

If your use case differs from the listed requirements, contact our [sales engineers](mailto:sales@wallarm.com) providing detailed technical information about your environment to explore potential adjustments to meet your specific needs.

## External outbound access

To ensure the solution functions correctly in environments with restricted outbound traffic, configure network access to allow the following external resources:

* `https://charts.wallarm.com` to add the Wallarm Helm charts.
* `https://hub.docker.com/r/wallarm` to retrieve Wallarm Docker images from Docker Hub.
* For users working with the US Wallarm Cloud, access `https://us1.api.wallarm.com`. For those using the EU Wallarm Cloud, access `https://api.wallarm.com`.
* IP addresses and their corresponding hostnames (if any) listed below. This is needed for downloading updates to attack detection rules and [API specifications](../../../api-specification-enforcement/overview.md), as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted](../../../user-guides/ip-lists/overview.md) countries, regions, or data centers.

    --8<-- "../include/wallarm-cloud-ips.md"

## Internal network communication

If you use Kubernetes [NetworkPolicies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) or similar network restrictions, ensure the following inter‑component communication is allowed. These ports are hardcoded in the Helm chart and cannot be changed via `values.yaml`:

| Source | Destination | Port | Protocol | Description |
| --- | --- | --- | --- | --- |
| Agent (DaemonSet) | Processing (Deployment) | 18443 | TCP | Mirrored traffic delivery |
| Processing (Deployment) | Aggregation (Deployment) | 3313 | TCP | Findings and statistics |
| Processing (Deployment) | Processing (Deployment) | 9009 | TCP | Mesh discovery (multi-replica) |

## Deployment

To deploy the Wallarm eBPF solution:

1. Create the Wallarm node.
1. Deploy the Wallarm Helm chart.
1. Enable traffic mirroring.
1. Test the Wallarm eBPF operation.

### Step 1: Generate a filtering node token

Generate an API token for a Wallarm filtering node to connect to the Wallarm Cloud:

1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Create API token with the `Node deployment/Deployment` usage type.

### Step 2: Deploy the Wallarm Helm chart

1. Make sure that your environment meets the requirements listed above.
1. Add the [Wallarm chart repository](https://charts.wallarm.com/):
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. Create the `values.yaml` file with the [Wallarm eBPF solution configuration](helm-chart-for-wallarm.md).

    Example of the file with the minimum configuration:

    === "US Cloud"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
            host: "us1.api.wallarm.com"
        ```
    === "EU Cloud"
        ```yaml
        config:
          api:
            token: "<NODE_TOKEN>"
        ```
    
    `<NODE_TOKEN>` is the token of the Wallarm node to be run in Kubernetes.

    --8<-- "../include/waf/installation/info-about-using-one-token-for-several-nodes.md"
1. Deploy the Wallarm Helm chart:

    ``` bash
    helm install --version 0.23.0 <RELEASE_NAME> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` is the name for the Helm release of the Wallarm eBPF chart
    * `wallarm-ebpf` is the new namespace to deploy the Helm release with the Wallarm eBPF chart, it is recommended to deploy it to a separate namespace
    * `<PATH_TO_VALUES>` is the path to the `values.yaml` file

### Step 3: Enable traffic mirroring

By default, the deployed solution does not analyze any traffic. To enable traffic analysis, you need to enable traffic mirroring at the desired level, which can be:

* For a namespace
* For a pod
* For a node name or a container

There are two ways to enable traffic mirroring: using dynamic filters as namespace labels or pod annotations, or controlling it through the `config.agent.mirror.filters` block in the `values.yaml` file. You can also combine these approaches. [More details](selecting-packets.md)

#### For a namespace using a label

To enable mirroring for a namespace, set the namespace label `wallarm-mirror` to `enabled`:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

#### For a pod using an annotation

To enable mirroring for a pod, set the `mirror.wallarm.com/enabled` annotation to `true`:

```bash
kubectl patch deployment <DEPLOYMENT_NAME> -n <NAMESPACE> -p '{"spec": {"template":{"metadata":{"annotations":{"mirror.wallarm.com/enabled":"true"}}}} }'
```

#### For a namespace, pod, container, or node using `values.yaml`

For more granular control, you can use the `config.agent.mirror.filters` block in the `values.yaml` file of the Wallarm eBPF to specify the mirroring level. Read the [article](selecting-packets.md) on how to configure filters and how they interact with Wallarm namespace labels and pod annotations.

### Step 4: Test the Wallarm eBPF operation

To test that the Wallarm eBPF operates correctly:

1. Get the Wallarm pod details to check they have been successfully started:

    ```bash
    kubectl get pods -n wallarm-ebpf -l app.kubernetes.io/name=wallarm-oob
    ```

    Each pod should display the following: **READY: N/N** and **STATUS: Running**, e.g.:

    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    wallarm-ebpf-wallarm-oob-agent-599xg                   1/1     Running   0          7m16s
    wallarm-ebpf-wallarm-oob-aggregation-f68959465-vchxb   2/2     Running   0          30m
    wallarm-ebpf-wallarm-oob-processing-694fcf9b47-rknx9   2/2     Running   0          30m
    ```
1. Send several test requests to your application endpoints to generate traffic for API Discovery. Replace `<LOAD_BALANCER_IP_OR_HOSTNAME>` with the actual IP address or DNS name of the load balancer directing traffic to your application:

    ```bash
    curl -X GET https://<LOAD_BALANCER_IP_OR_HOSTNAME>/api/v1/users
    curl -X POST https://<LOAD_BALANCER_IP_OR_HOSTNAME>/api/v1/users -H "Content-Type: application/json" -d '{"name": "test"}'
    curl -X GET https://<LOAD_BALANCER_IP_OR_HOSTNAME>/api/v1/health
    ```

    Send a variety of requests to different endpoints to help the node build a more complete picture of your API structure.

1. Wait a few minutes for the data to be processed and sent to the Wallarm Cloud, then open Wallarm Console → **API Discovery** to verify that the endpoints have been discovered and are displayed in your API inventory.

## Limitations

### Intended for API Discovery only

This solution is designed for [API Discovery](../../../api-discovery/overview.md) and should not be used as a primary tool for attack detection or protection.

### Response data limitations

As server response bodies are not mirrored:

* Vulnerability detection based on [passive detection](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection) is not supported.
* Displaying API endpoint response structure in API Discovery is not supported.

### TLS/SSL visibility limitations

The eBPF agent can only observe traffic from applications that use the shared **OpenSSL** library for TLS/SSL encryption. Traffic from applications using other TLS implementations is **not visible** to the agent:

* **Envoy** with BoringSSL
* **Go** applications using native `crypto/tls`
* **Java** applications using built-in TLS
* Other non-OpenSSL TLS libraries

For mTLS environments, visibility depends on where TLS is terminated — if terminated at a proxy using OpenSSL (e.g., NGINX Ingress), traffic is visible; if terminated within the application using an unsupported library, it is not. See [TLS/SSL visibility](#tlsssl-visibility) for details.
