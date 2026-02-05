[ip-list-docs]:              ../../user-guides/ip-lists/overview.md
[api-token]:                  ../../user-guides/settings/api-tokens.md
[filtration-modes-docs]:      ../../admin-en/configure-wallarm-mode.md
[ptrav-attack-docs]:          ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:        ../../images/admin-guides/test-attacks-quickstart.png
[api-spec-enforcement-docs]:  ../../api-specification-enforcement/overview.md
[custom-blocking-page]:       ../../admin-en/configuration-guides/configure-block-page-and-code.md
[rate-limiting]:              ../../user-guides/rules/rate-limiting.md


# Wallarm Filter for Gloo Gateway 

This guide describes how to secure your APIs managed by [Gloo Gateway (Gloo Edge API)](https://docs.solo.io/gloo-edge/main/) using the Wallarm Connector based on [Envoy's ext_proc filter](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_proc/v3/ext_proc.proto).

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

Choose an artifact for a self-hosted node deployment and follow the instructions attached for the `envoy-external-filter` mode:

* [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
* [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
* [AWS AMI](../native-node/aws-ami.md) for AWS infrastructures
* [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

### 2. Configure Gloo Gateway to forward traffic to the Wallarm Node

1. Prepare the Gloo Helm values file (`./test/manifests/gloo/values.yaml`). Key configuration parameters are highlighted and explained in the comments:

    ```yaml hl_lines="33-34 39-40 42-43"
    gloo:
      gloo:
        disableLeaderElection: true
      discovery:
        enabled: true

    gatewayProxies:
      gatewayProxy:
        enabled: true
        gatewaySettings:
          gatewayApi: false

    rateLimit:
      enabled: false

    observability:
      enabled: false

    prometheus:
      enabled: false

    grafana:
      defaultInstallationEnabled: false

    gloo-fed:
      enabled: false

    # Mirror traffic to the Wallarm Node using Envoy ext_proc
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
              name: native-processing # Name of the upstream pointing to the Wallarm Node
              namespace: gloo-system # Namespace where the upstream is created
          processingMode:
            requestBodyMode: STREAMED # How the request body is handled (use STREAMED for full analysis)
            responseBodyMode: STREAMED # How the response body is handled (use STREAMED for full analysis)
          requestAttributes: [request.id, request.time, source.address]
    ```

1. Add the Helm repository

    ```
    helm repo add glooe https://storage.googleapis.com/gloo-ee-helm
    helm repo update glooe
    ```

1. Upgrade the existing Gloo Gateway release with the `ext_proc` configuration:

    ```
    helm -n gloo-system upgrade gloo glooe/gloo-ee \
      -f ./test/manifests/gloo/values.yaml \
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

1. Prepare the Wallarm upstream file (`./test/manifests/gloo/upstream.yaml`). Key configuration parameters are highlighted and explained in the comments:

    ```yaml hl_lines="8 10-12 14"
    apiVersion: gloo.solo.io/v1
    kind: Upstream
    metadata:
      name: native-processing
      namespace: gloo-system
    spec:
      discoveryMetadata: {}
      useHttp2: true # Must be true for gRPC communication
      kube:
        serviceName: native-processing # Native Node processing service name
        serviceNamespace: gonode # Namespace where the Node is deployed
        servicePort: 5000 # gRPC port (5000 for Gloo integration)
      sslConfig:
        secretRef: # Reference to the TLS secret for secure gRPC
          name: tlskeys
          namespace: gloo-system
    ```

1. Apply the upstream:

    ```
    kubectl -n gloo-system apply -f ./test/manifests/gloo/upstream.yaml
    ```

### 5. Create a VirtualService for traffic routing

1. Prepare the [VirtualService](https://docs.solo.io/gloo-edge/latest/reference/api/github.com/solo-io/gloo/projects/gateway/api/v1/virtual_service.proto.sk/) file (`./test/manifests/workload-gloo/vs.yaml`):

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
    kubectl -n gloo-system apply -f ./test/manifests/workload-gloo/vs.yaml
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
