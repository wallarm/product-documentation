[ip-list-docs]:              ../../user-guides/ip-lists/overview.md
[api-token]:                  ../../user-guides/settings/api-tokens.md
[filtration-modes-docs]:      ../../admin-en/configure-wallarm-mode.md
[ptrav-attack-docs]:          ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:        ../../images/admin-guides/test-attacks-quickstart.png
[api-spec-enforcement-docs]:  ../../api-specification-enforcement/overview.md
[custom-blocking-page]:       ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:              ../../user-guides/rules/rate-limiting.md
[envoy-port]:                 ../../installation/native-node/all-in-one-conf.md#envoy_external_filteraddress-required


# Wallarm Filter for Gloo Gateway 

This guide describes how to secure your APIs managed by [Gloo Gateway (Gloo Edge API)](https://docs.solo.io/gloo-edge/main/) using the Wallarm Connector based on [Envoy's `ext_proc` filter](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_proc/v3/ext_proc.proto).

To use Wallarm with Gloo, you need to **deploy a Wallarm Node** within your cluster and configure Gloo's `ext_proc` integration to send traffic to the Node over gRPC for analysis.

The Wallarm connector for Gloo Gateway supports only [synchronous (in-line)](../inline/overview.md) traffic analysis:

![Gloo with synchronous traffic flow to the Wallarm Node](../../images/waf-installation/gateways/gloo/traffic-flow-sync.png)

## Use cases

This connector is the optimal choice when you need protection for workloads managed by Gloo Gateway and Envoy.

## Limitations

* A **trusted** SSL/TLS certificate is required for the Wallarm Node domain. Self-signed certificates are not supported.
* [Custom blocking page and blocking code][custom-blocking-page] configurations are not yet supported.
    
    All [blocked][filtration-modes-docs] malicious traffic is returned with status code `403` and the default block page.
* [Rate limiting][rate-limiting] by Wallarm rules is not supported.
    
    Rate limiting cannot be enforced on the Wallarm side for this connector. If you need rate limiting, use the features built into your API gateway or cloud platform.

## Requirements

Before deploying the connector, make sure that the following requirements are met:

* A [Kubernetes cluster](https://docs.solo.io/gloo-edge/latest/installation/platform_configuration/cluster_setup/) with the [Enterprise version of Gloo Gateway](https://docs.solo.io/gloo-edge/latest/installation/enterprise/) installed
* A Gloo Gateway Enterprise license key (it will be later used with the `GLOO_KEY` environment variable)
* Kubernetes v1.30 or later
* Envoy v1.30.0 or later
* Helm v3.x or later
* Applications deployed and reachable through Gloo Gateway and [VirtualService](https://docs.solo.io/gloo-edge/latest/reference/api/github.com/solo-io/gloo/projects/gateway/api/v1/virtual_service.proto.sk/)
* Wallarm Native Node v0.22.0 or later
* Access to the **Administrator** account in Wallarm Console for the [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)
* Outbound access to:

    * `https://charts.wallarm.com` to download the Wallarm Helm chart
    * `https://hub.docker.com/r/wallarm` to download the Docker images required for the deployment
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses and their corresponding hostnames (if any) listed below. This is needed for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* A trusted TLS certificate and private key for the Wallarm Node domain

## Deployment

### 1. Deploy a Wallarm Node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

Choose an artifact for a self-hosted node deployment and follow the instructions for the `envoy-external-filter` mode:

* [All-in-one installer](../native-node/all-in-one.md) for Linux on bare metal or VMs
* [Docker image](../native-node/docker-image.md) for containerized deployments
* [Helm chart](../native-node/helm-chart.md) for Kubernetes (recommended when using Gloo)

**Important deployment notes:**

* **(Recommended setup)** Deploy the Node in the same Kubernetes cluster where Gloo runs (e.g. via the [Helm chart](../native-node/helm-chart.md):
    * Use a **service name** and **namespace** that match the Upstream in [step 4](#4-create-an-upstream-for-the-wallarm-node) (e.g. service name `wallarm-node`, namespace `wallarm`).
    * Make sure the gRPC port is set to 5000. 
    * The Gloo `ext_proc` configuration [(step 2)](#2-configure-gloo-gateway-to-forward-traffic-to-the-wallarm-node) and the Upstream [(step 4)](#4-create-an-upstream-for-the-wallarm-node) will reference this Kubernetes Service.
* If the Node is deployed **outside the cluster** (e.g. [Docker image](../native-node/docker-image.md) on a host or [all-in-one installer](../native-node/all-in-one.md) on a VM):
    * There will be no Kubernetes Service.
    * You must create create a **static** Gloo Upstream pointing to the Node's address and port (see [Gloo static upstreams](https://docs.solo.io/gloo-edge/latest/guides/traffic_management/destination_types/static_upstream/)).
    * Ensure the Node is reachable from the cluster.
    * Configure the Node to listen on the same port (e.g. `5000`) in [`envoy_external_filter.address`][envoy-port] in the Node config.

### 2. Configure Gloo Gateway to forward traffic to the Wallarm Node

You already have Gloo Gateway installed and a Helm values file from [installation](https://docs.solo.io/gloo-edge/main/installation/gateway/kubernetes/). Add the following **Wallarm-specific** block to your existing values (under the `global` key). If `global.extensions` does not exist yet, add it; then add the `extProc` section:

1. Update your existing Gloo Helm values file with the `ext_proc` configuration. Add or merge the following under `global`:

    ```yaml hl_lines="5-6 11-12 14-15"
    global:
      extensions:
        extProc:
          allowModeOverride: false
          failureModeAllow: false # If true, traffic is allowed when the Wallarm Node is unavailable
          filterStage: # Defines when and where the ext_proc filter is applied in the filter chain
            predicate: After
            stage: AuthZStage
          grpcService:
            extProcServerRef:
              name: wallarm-node # Name of the Upstream pointing to the Wallarm Node (step 4)
              namespace: gloo-system # Namespace where the Upstream is created
          processingMode:
            requestBodyMode: STREAMED # Use STREAMED for full request body analysis
            responseBodyMode: STREAMED # Use STREAMED for full response body analysis
          requestAttributes: [request.id, request.time, source.address]
    ```

1. Upgrade the Gloo Gateway release so the new configuration is applied:

    ```
    helm -n gloo-system upgrade gloo glooe/gloo-ee \
      -f <path-to-your-values-file> \
      --set license_key="<GLOO_KEY>"
    ```
    where `GLOO_KEY` is your Gloo Gateway Enterprise license key.

    !!! info "Wait for Gloo to be ready"        
        The Gloo Gateway takes some time to start. Before proceeding, wait about 90 seconds for all Gloo components to become ready. 

### 3. Create a TLS secret for the gRPC connection

Create a Kubernetes TLS secret from your existing certificate and key (see [Requirements](#requirements)):

```
kubectl -n gloo-system create secret tls tlskeys \
  --key /path/to/tls.key \
  --cert /path/to/tls.crt
```

### 4. Create an upstream for the Wallarm Node

The following example is for a Node deployed **in the cluster** (e.g. via the Helm chart). If the Node runs outside the cluster, use a [static Upstream](https://docs.solo.io/gloo-edge/latest/guides/traffic_management/destination_types/static_upstream/) to the Node's address and port instead.

1. Prepare the Wallarm Upstream manifest (e.g. `upstream.yaml`). Key configuration parameters are highlighted and explained in the comments:

    ```yaml hl_lines="8 10-12 14"
    apiVersion: gloo.solo.io/v1
    kind: Upstream
    metadata:
      name: wallarm-node
      namespace: gloo-system
    spec:
      discoveryMetadata: {}
      useHttp2: true # Must be true for gRPC communication
      kube:
        serviceName: wallarm-node # Wallarm Node processing service name
        serviceNamespace: wallarm # Namespace where the Wallarm Node is deployed
        servicePort: 5000 # gRPC port (5000 for Gloo integration)
      sslConfig:
        secretRef: # Reference to the TLS secret for secure gRPC
          name: tlskeys
          namespace: gloo-system
    ```

1. Apply the upstream:

    ```
    kubectl -n gloo-system apply -f <path-to-your-upstream.yaml>
    ```

### 5. Create a VirtualService for traffic routing

1. Prepare the [VirtualService](https://docs.solo.io/gloo-edge/latest/reference/api/github.com/solo-io/gloo/projects/gateway/api/v1/virtual_service.proto.sk/) manifest (e.g. `vs.yaml`):

    ```yaml
    apiVersion: gateway.solo.io/v1
    kind: VirtualService
    metadata:
      name: workload-vsvc
    spec:
      virtualHost:
        domains:
          - "*" # Use only for a single VirtualService or as a catch-all; otherwise, specify explicit domains
        routes:
          - matchers:
              - prefix: /
            routeAction:
              single:
                upstream:
                  name: workload-workload-80 # Auto-discovered upstream
                  namespace: gloo-system
    ```

1. Apply the VirtualService:

    ```
    kubectl -n gloo-system apply -f <path-to-your-virtualservice.yaml>
    ```

    !!! info "Gloo service discovery"        
        Gloo automatically discovers Kubernetes services and creates upstreams. The upstream name follows the pattern: `<namespace>-<service-name>-<port>`.

The Wallarm Connector is now deployed, and your Gloo-managed API traffic is being analyzed and protected in real time.

## Testing

To test the functionality of the deployed filter, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack:

    ```
    curl https://<YOUR_APP_DOMAIN>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.

    ![Attacks in the interface][attacks-in-ui-image]

    If the Wallarm node mode is set to [blocking][filtration-modes-docs] and the traffic flows in-line, the request will also be blocked.