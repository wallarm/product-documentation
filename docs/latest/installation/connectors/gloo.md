[ip-list-docs]:              ../../user-guides/ip-lists/overview.md
[api-token]:                  ../../user-guides/settings/api-tokens.md
[filtration-modes-docs]:      ../../admin-en/configure-wallarm-mode.md
[ptrav-attack-docs]:          ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:        ../../images/admin-guides/test-attacks-quickstart.png
[api-spec-enforcement-docs]:  ../../api-specification-enforcement/overview.md


# Wallarm Filter for Gloo Gateway 

This guide describes how to secure your APIs managed by [Gloo Gateway (Gloo Edge API)](https://docs.solo.io/gloo-edge/main/) using the Wallarm Connector based on [Envoy's ext_proc filter](https://www.envoyproxy.io/docs/envoy/latest/api-v3/extensions/filters/http/ext_proc/v3/ext_proc.proto).

To use Wallarm with Gloo, you need to **deploy a Wallarm Node** (either externally or within your cluster) and configure Gloo's `ext_proc` integration to send traffic to the Node over gRPC for analysis.

The Wallarm connector for Gloo Gateway supports both [synchronous (in-line)](../inline/overview.md) and [asynchronous (out‑of‑band)](../oob/overview.md) traffic analysis:

## Use cases

This connector is the optimal choice when you need protection for workloads managed by Gloo Gateway and Envoy.

## Limitations

* A **trusted** SSL/TLS certificate is required for the Wallarm Node domain. Self-signed certificates are not supported.

## Requirements

Before deploying the connector, make sure that the following requirements are met:

* A [Kubernetes cluster](https://docs.solo.io/gloo-edge/latest/installation/platform_configuration/cluster_setup/) with the [Enterprise version of Gloo Gateway](https://docs.solo.io/gloo-edge/latest/installation/enterprise/) installed
* A Gloo Gateway Enterprise license key (it will be later used with the `$GLOO_KEY` environment variable)
* Kubernetes v1.30 or later
* Envoy v1.30.0 or later
* Helm v3.x
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

### 1. Install Gloo Gateway 

1. Prepare the Gloo Helm values file (`./test/manifests/gloo/values.yaml`). Key configuration parameters are explained in the comments below:

    ```yaml
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

1. Install Gloo Gateway with the `ext_proc` configuration:

    ```
    helm -n gloo-system install gloo glooe/gloo-ee \
      --create-namespace \
      -f ./test/manifests/gloo/values.yaml \
      --set license_key=$GLOO_KEY
    ```
    where `$GLOO_KEY` is your Gloo Gateway Enterprise license key.

    !!! info "Wait for Gloo to be ready"        
        The Gloo Gateway takes some time to start. Before proceeding, wait about 90 seconds for all Gloo components to become ready. 

### 2. Create TLS certificates for secure gRPC connection

1. Create a self-signed certificate:

    ```
    mkdir -p test/selfsigned-pair
    openssl req -x509 -nodes -days 365 \
      -newkey rsa:2048 \
      -keyout test/selfsigned-pair/tls.key \
      -out test/selfsigned-pair/tls.crt \
      -subj "/CN=wallarm-node/O=wallarm"
    ```

1. Create a Kubernetes TLS secret from the certificate:

    ```
    kubectl -n gloo-system create secret tls tlskeys \
      --key test/selfsigned-pair/tls.key \
      --cert test/selfsigned-pair/tls.crt
    ```

### 3. Install the Wallarm Native Node

1. Add the Wallarm Helm repository:

    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```

1. Create the namespace and TLS secret:

    ```
    kubectl create ns gonode
    kubectl -n gonode create secret generic tlskeys --from-file=test/selfsigned-pair
    ```

1. Install the Native Node with the required environment variables. Optionally, use [advanced root configuration options](#advanced-route-configuration-options):

    ```
    helm -n gonode upgrade --install gonode wallarm/wallarm-node-native \
      --version 0.22.0 \
      --set config.api.token="${WALLARM_API_TOKEN}" \
      --set config.api.host="${WALLARM_API_HOST}" \
      --set config.api.nodeGroup="${NODE_GROUP_NAME}" \
      --set config.connector.mode=envoy-external-filter \
      --set config.connector.certificate.enabled=true \
      --set config.connector.certificate.existingSecret.enabled=true \
      --set config.connector.certificate.existingSecret.name=tlskeys \
      --set config.connector.route_config.wallarm_mode=${WALLARM_MODE} \
      --set config.connector.route_config.wallarm_application=-1 \
      --set processing.service.clusterIP=None \
      --set fullnameOverride=wallarm-node-native
    ```

    Environment variable | Description
    --- | ---- 
    `WALLARM_API_TOKEN` | Wallarm node or API token. 
    `WALLARM_API_HOST` | Wallarm API server:<ul><li>`us1.api.wallarm.com` for the US Cloud</li><li>`api.wallarm.com` for the EU Cloud</li></ul>
    `WALLARM_MODE` | Node mode:<ul><li>`block` to block malicious requests</li><li>`safe_blocking` to block only those malicious requests originated from [graylisted IP addresses][ip-list-docs]</li><li>`monitoring` to analyze but not block requests</li><li>`off` to disable traffic analyzing and processing</li></ul> <br>[Detailed description of filtration modes →][filtration-modes-docs]
    `NODE_GROUP_NAME` | <p>Works only if `WALLARM_API_TOKEN` is set to [API token][api-token] with the `Deploy` role. Sets the `group` label for node instance grouping, for example:</p> <p>`set config.api.nodeGroup="GROUP"`</p> <p>...will place node instance into the `GROUP` instance group (existing, or, if does not exist, it will be created).</p>

### 4. Create an upstream for the Wallarm Node

1. Prepare the Wallarm upstream file (`./test/manifests/gloo/upstream.yaml`). Key configuration parameters are explained in the comments below:

    ```yaml
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

## Advanced route configuration options

You can install the Native Node to use different modes for specific routes or dynamically assign application IDs, e.g.:

```
# Set global mode for all traffic
--set config.connector.route_config.wallarm_mode=block

# Set monitoring mode for a specific path
--set config.connector.route_config.routes[0].route="/wallarm-mode/monitoring"
--set config.connector.route_config.routes[0].wallarm_mode=monitoring

# Assign application ID dynamically from a request header
--set config.connector.route_config.routes[1].route="/wallarm-application"
--set 'config.connector.route_config.routes[1].wallarm_application=$http.header.custom-id'
```