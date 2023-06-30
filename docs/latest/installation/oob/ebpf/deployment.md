[deployment-platform-docs]:    ../../supported-deployment-options.md

# Wallarm eBPF-Based Soultion (Pre-Release)

Wallarm offers a pre-release version of its eBPF-based security solution that leverages the power of the Linux kernel and seamlessly integrates with Kubernetes environments. This article explains how to use and deploy the solution using the Helm chart.

## How it works

The Linux operating system comprises the kernel and the user space, where the kernel manages hardware resources and critical tasks, while applications operate in the user space. Within this environment, eBPF (Extended Berkeley Packet Filter) enables the execution of custom programs within the Linux kernel, including those focused on security. [Read more about eBPF](https://ebpf.io/what-is-ebpf/)

As Kubernetes utilizes the capabilities of the Linux kernel for crucial tasks like process isolation, resource management, and networking, it creates a conducive environment for integrating eBPF-based security solutions. In line with this, Wallarm offers an eBPF-based security solution that seamlessly integrates with Kubernetes, leveraging the kernel's functionalities.

Wallarm's eBPF solution attaches probes to kernel functions, capturing an incoming network (ingress) traffic mirror for collecting data on socket transactions. This out-of-band collection method avoids impacting live traffic flow.

The solution consists of an agent that generates a traffic mirror and forwards it to the Wallarm node. During deployment, you can specify the mirror level at either the namespace or pod level. The Wallarm node examines the mirrored traffic for security threats, without blocking any malicious activity. Instead, it records the detected activity in the Wallarm Cloud, providing visibility into traffic security through the Wallarm Console UI.

The DaemonSet is a Kubernetes resource used by Wallarm for deploying security agents. To enable privileged access required by the DaemonSet, Wallarm includes the `SYS_PTRACE` and `SYS_ADMIN` capabilities in the Helm chart:

```
capabilities:
  add:
    - SYS_ADMIN
    - SYS_PTRACE
```

These capabilities grant the necessary permissions for Wallarm's agents to perform privileged tasks, ensuring security coverage across all nodes in the cluster.

## Use cases

Among all supported [Wallarm deployment options](../../supported-deployment-options.md), this solution is the recommended one for the following **use cases**:

* Comprehensive attack observation and reporting.
* Out-of-band operation. By capturing a mirrored copy of traffic instead of directly intercepting or modifying original packets, the eBPF-based solution minimizes the impact on live traffic, ensuring uninterrupted traffic flow.
* Native kernel integration. Leveraging eBPF's native support within Kubernetes, this solution seamlessly integrates with existing infrastructure, providing a streamlined and efficient security solution.

## Limitations

As the solution works only with a traffic copy, the solution has some limitations:

* Wallarm does not instantly block malicious requests since traffic analysis proceeds irrespective of actual traffic flow.

    Wallarm only observes attacks and provides you with the [details in Wallarm Console](../../..//user-guides/events/analyze-attack.md).
* Most of the Wallarm capabilities for vulnerability discovery do not work as server responses required for vulnerability identification are not mirrored. This limitation relates to the following features:

    * [Passive detection](../../../about-wallarm/detecting-vulnerabilities.md#passive-detection)
    * [Vulnerability Scanner](../../../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner)
    * [Active Threat Verification](../../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification)
* The [Wallarm API Discovery](../../../about-wallarm/api-discovery.md) does not explore API inventory based on your traffic as server responses required for the module operation are not mirrored.

## Requirements

* Kubernetes 1.22 and above, it can be running on a cloud platform like Azure, AWS, GCP and others
* [Helm v3](https://helm.sh/) package manager
* Access to `https://charts.wallarm.com` to add the Wallarm Helm charts
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`
* Linux kernel 5.4 and above with BTF (BTP Type Format) enabled on Ubuntu, Debian, RedHat, COS (Container Optimized OS from Google), or Amazon Linux 2.
* [cert-manager](https://cert-manager.io/docs/installation/helm/) installed on Kubernetes to enable the agent to send encrypted traffic to Kubernetes nodes and obtain a certificate
* Traffic flowing through the HTTP 1.x, HTTP 2, TLS (OpenSSL), or Proxy v1 protocols
* An application deployed as a Pod in a Kubernetes cluster
* Access to the account with the **Administrator** role in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or the [EU Cloud](https://my.wallarm.com/)
* Access to `https://us1.api.wallarm.com` for working with US Wallarm Cloud or to `https://api.wallarm.com` for working with EU Wallarm Cloud

## Deployment

To deploy the Wallarm eBPF solution:

1. Create the Wallarm node.
1. Deploy the Wallarm Helm chart.
1. Enable traffic mirroring.
1. Test the Wallarm eBPF operation.

### Step 1: Create the Wallarm node

1. Open Wallarm Console → **Nodes** via the link below:

    * https://us1.my.wallarm.com/nodes for the US Cloud
    * https://my.wallarm.com/nodes for the EU Cloud
1. Create a filtering node with the **Wallarm node** type and copy the generated token.
    
    ![!Creation of a Wallarm node](../../../images/user-guides/nodes/create-wallarm-node-name-specified.png)

### Step 2: Deploy the Wallarm Helm chart

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
    helm install --version 0.13.2 <RELEASE_NAME> wallarm/wallarm-oob --wait -n wallarm-ebpf --create-namespace -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` is the name for the Helm release of the Wallarm eBPF chart
    * `wallarm-ebpf` is the new namespace to deploy the Helm release with the Wallarm eBPF chart, it is recommended to deploy it to a separate namespace
    * `<PATH_TO_VALUES>` is the path to the `values.yaml` file

### Step 3: Enable traffic mirroring

By default, the deployed solution does not analyze any traffic. To enable traffic analysis, you need to enable traffic mirroring at the desired level, which can be:

* For a namespace
* For a pod
* For a node name or a container

There are two ways to enable traffic mirroring: using dynamic filters as namespace labels or pod annotations, or controlling it through the `config.agent.mirror.filters` block in the `values.yaml` file. You can also combine these approaches, where the lower configuration will take precedence.

#### For a namespace using a label

To enable mirroring for a namespace, set the namespace label `wallarm-mirror` to `enabled`:

```
kubectl label ns <NAMESPACE> wallarm-mirror=enabled
```

#### For a pod using an annotation

To enable mirroring for a pod, set the `mirror.wallarm.com/enabled` annotation to `true`:

```bash
kubectl edit deployment -n <NAMESPACE> <APP_LABEL_VALUE>
```

```yaml hl_lines="17"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        wallarm-sidecar: enabled
      annotations:
        mirror.wallarm.com/enabled: "true"
    spec:
      containers:
        - name: application
          image: kennethreitz/httpbin
          ports:
            - name: http
              containerPort: 80
```

#### For a namespace, pod, container, or node using `values.yaml`

For more granular control, you can use the `config.agent.mirror.filters` block in the `values.yaml` file of the Wallarm eBPF to specify the mirroring level. [Learn more](helm-chart-for-wallarm.md#configagentmirrorfilters)

### Step 4: Test the Wallarm eBPF operation

To test that the Wallarm eBPF operates correctly:

1. Get the Wallarm pod details to check they have been successfully started:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-oob
    ```

    Each pod should display the following: **READY: N/N** and **STATUS: Running**, e.g.:

    ```
    NAME                                                   READY   STATUS    RESTARTS   AGE
    wallarm-ebpf-wallarm-oob-agent-599xg                   1/1     Running   0          7m16s
    wallarm-ebpf-wallarm-oob-aggregation-f68959465-vchxb   3/3     Running   0          30m
    wallarm-ebpf-wallarm-oob-processing-694fcf9b47-rknx9   3/3     Running   0          30m
    ```
1. Send the test [Path Traversal](../../../attacks-vulns-list.md#path-traversal) attack to the application cluster address Wallarm is enabled to analyze traffic:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    Since the Wallarm eBPF solution operates in the out-of-band approach, it does not block attacks but only registers them.

    To check that the attack has been registered, proceed to Wallarm Console → **Events**:

    ![!Attacks in the interface](../../../images/admin-guides/test-attacks-quickstart.png)
