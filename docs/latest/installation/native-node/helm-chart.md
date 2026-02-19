[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[ptrav-attack-docs]:                     ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:                   ../../images/admin-guides/test-attacks-quickstart.png
[filtration-mode-docs]:                  ../../admin-en/configure-wallarm-mode.md
[se-connector-setup-img]:                ../../images/waf-installation/se-connector-setup.png
[ip-list-docs]:                          ../../user-guides/ip-lists/overview.md
[api-token]:                             ../../user-guides/settings/api-tokens.md
[api-spec-enforcement-docs]:             ../../api-specification-enforcement/overview.md
[self-hosted-connector-node-helm-conf]:  ../connectors/self-hosted-node-conf/helm-chart.md

# Deploying the Native Node with Helm Chart

The [Wallarm Native Node](../nginx-native-node-internals.md), which operates independently of NGINX, is designed for deployment with some connectors. You can run the Native Node on as a separate service or as a load balancer in your Kubernetes cluster using the Helm chart.

## Use cases

Deploy the Native Node with Helm chart in the following cases:

* When you deploy a Wallarm [connector](../nginx-native-node-internals.md#connectors_1) and require the node to be self-hosted. This is ideal if you are already using Kubernetes management platforms like OpenShift, Amazon EKS, Azure AKS, or Google GKE. The node is set up as a load balancer with a public IP for easy traffic routing.

    Use the Node in `connector-server` mode.
* When you need a gRPC-based external processing filter for APIs managed by [Istio](../connectors/istio.md) or [Gloo Gateway](../connectors/gloo.md). The node is set up either as a load balancer with a public IP (Istio only) or as a service inside your Kubernetes cluster (supported by both Istio and Gloo Gateway).
    
    Use the Node in `envoy-external-filter` mode.
* When you deploy a Wallarm connector for [Kong Ingress Controller](../connectors/kong-ingress-controller.md). The node is deployed with the clusterIP type for internal traffic, without exposing a public IP.
    
    Use the Node in `connector-server` mode.

## Requirements

The Kubernetes cluster for deploying the Native Node with the Helm chart must meet the following criteria:

* [Helm v3](https://helm.sh/) package manager installed.
* Inbound access from your API gateway or CDN where your APIs are running.
* Outbound access to:

    * `https://charts.wallarm.com` to download the Wallarm Helm chart
    * `https://hub.docker.com/r/wallarm` to download the Docker images required for the deployment
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses and their corresponding hostnames (if any) listed below. This is needed for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* A domain and a trusted SSL/TLS certificate for the Native Node.
* In addition to the above, you should have the **Administrator** role assigned in Wallarm Console.

## Limitations

* A **trusted** SSL/TLS certificate is required for the Node instance domain. Self-signed certificates are not yet supported.
* [Custom blocking page and blocking code](../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.

## Deployment

### 1. Prepare Wallarm token

To install node, you will need a token for registering the node in the Wallarm Cloud. To prepare a token:

1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Find or create API token with the `Node deployment/Deployment` usage type.
1. Copy this token.

### 2. Add the Wallarm Helm chart repository

```
helm repo add wallarm https://charts.wallarm.com
helm repo update wallarm
```

### 3. Prepare the configuration file

=== "LoadBalancer (connector-server)"
    Deploying the native Wallarm node as a LoadBalancer with a public IP allows you to route traffic from MuleSoft, Cloudflare, Amazon CloudFront, Broadcom Layer7 API Gateway, Fastly to this IP for security analysis and filtration.

    1. Register a domain for the load balancer.
    1. Obtain a **trusted** SSL/TLS certificate.
    1. Create the `values.yaml` configuration file with the following minimal configuration. Choose the tab for your preferred method of applying the certificate:
    
        === "cert-manager"
            If you use [`cert-manager`](https://cert-manager.io/) in your cluster, you can generate the SSL/TLS certificate with it.

            Add the `route_config` section with your Wallarm Node FQDN so that cert-manager issues the certificate for your domain instead of the default service name (`native-processing`):

            ```yaml
            config:
              connector:
                mode: connector-server
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # The name of the cert-manager Issuer or ClusterIssuer
                      name: letsencrypt-prod
                      # If it is Issuer (namespace-scoped) or ClusterIssuer (cluster-wide)
                      kind: ClusterIssuer
              route_config:
                routes:
                  - host: "<WALLARM_NODE_FQDN>"
            processing:
              service:
                type: LoadBalancer
            ```

            !!! note "DNS and certificate generation"
                When you deploy the Wallarm service ([step 4](#4-deploy-the-wallarm-service)), `cert-manager` will try to issue the certificate immediately. This will fail until `<WALLARM_NODE_FQDN>` points to your load balancer IP. After deployment, get the external IP from the load balancer, add the DNS record ([step 5](#5-configure-dns-access-to-the-wallarm-node)), and `cert-manager` will retry and issue the certificate.

        === "existingSecret"
            You can pull SSL/TLS certificate from an existing Kubernetes secrets in the same namespace.

            ```yaml
            config:
              connector:
                mode: connector-server
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # The name of the Kubernetes secret containing the certificate and private key
                    name: my-secret-name
            processing:
              service:
                type: LoadBalancer
            ```
        === "customSecret"
            The `customSecret` configuration allows you to define a certificate directly as base64-encoded values.

            ```yaml
            config:
              connector:
                mode: connector-server
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64-encoded CA
                    crt: LS0... # Base64-encoded certificate
                    key: LS0... # Base64-encoded private key
            processing:
              service:
                type: LoadBalancer
            ```
=== "ClusterIP (connector-server)"
    When deploying Wallarm as a connector for [Kong Ingress Controller connector](../connectors/kong-ingress-controller.md), you deploy the Native Node for this connector with the `ClusterIP` type for internal traffic, without exposing a public IP.

    Create the `values.yaml` configuration file with the following minimal configuration:

    ```yaml
    processing:
      service:
        type: ClusterIP
    ```
=== "LoadBalancer (envoy-external-filter)"
    Deploying the native Wallarm node as a LoadBalancer with a public IP allows you to route traffic from Istio Ingress to this IP for security analysis and filtration.

    1. Register a domain for the load balancer.
    1. Obtain a **trusted** SSL/TLS certificate.
    1. Create the `values.yaml` configuration file with the following minimal configuration. Choose the tab for your preferred method of applying the certificate:
    
        === "cert-manager"
            If you use [`cert-manager`](https://cert-manager.io/) in your cluster, you can generate the SSL/TLS certificate with it.

            Add the `route_config` section with your Wallarm Node FQDN so that cert-manager issues the certificate for your domain instead of the default service name (`native-processing`):

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # The name of the cert-manager Issuer or ClusterIssuer
                      name: letsencrypt-prod
                      # If it is Issuer (namespace-scoped) or ClusterIssuer (cluster-wide)
                      kind: ClusterIssuer
              route_config:
                routes:
                  - host: "<WALLARM_NODE_FQDN>"
            processing:
              service:
                type: LoadBalancer
            ```

            !!! note "DNS and certificate generation"
                When you deploy the Wallarm service ([step 4](#4-deploy-the-wallarm-service)), `cert-manager` will try to issue the certificate immediately. This will fail until `<WALLARM_NODE_FQDN>` points to your load balancer IP. After deployment, get the external IP from the load balancer, add the DNS record ([step 5](#5-configure-dns-access-to-the-wallarm-node)), and `cert-manager` will retry and issue the certificate.

        === "existingSecret"
            You can pull SSL/TLS certificate from an existing Kubernetes secrets in the same namespace.

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # The name of the Kubernetes secret containing the certificate and private key
                    name: my-secret-name
            processing:
              service:
                type: LoadBalancer
            ```
        === "customSecret"
            The `customSecret` configuration allows you to define a certificate directly as base64-encoded values.

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64-encoded CA
                    crt: LS0... # Base64-encoded certificate
                    key: LS0... # Base64-encoded private key
            processing:
              service:
                type: LoadBalancer
            ```   
=== "ClusterIP (envoy-external-filter)"
    When deploying Wallarm as an Istio connector service inside your Kubernetes cluster, the Native Node runs as an internal component (`ClusterIP` service type) without exposing a public IP.

    1. Define a DNS name that resolves to the Wallarm Node service inside your cluster.
    1. Obtain a **trusted** SSL/TLS certificate for that domain.
    1. Create the `values.yaml` configuration file with the following minimal configuration. Choose the tab for your preferred method of applying the certificate:
    
        === "cert-manager"
            If you use [`cert-manager`](https://cert-manager.io/) in your cluster, you can generate the SSL/TLS certificate with it.

            Add the `route_config` section with your Wallarm Node FQDN so that cert-manager issues the certificate for your domain instead of the default service name (`native-processing`):

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # The name of the cert-manager Issuer or ClusterIssuer
                      name: letsencrypt-prod
                      # If it is Issuer (namespace-scoped) or ClusterIssuer (cluster-wide)
                      kind: ClusterIssuer
              route_config:
                routes:
                  - host: "<WALLARM_NODE_FQDN>"
            processing:
              service:
                type: ClusterIP
            ```

            !!! note "DNS and certificate generation"
                When you deploy the Wallarm service ([step 4](#4-deploy-the-wallarm-service)), `cert-manager` will try to issue the certificate immediately. This will fail until `<WALLARM_NODE_FQDN>` resolves to the Wallarm Node (e.g., via the CoreDNS rewrite in [step 5](#5-configure-dns-access-to-the-wallarm-node)). After deployment, complete step 5 so that the FQDN resolves to the Node. `cert-manager` will then retry and issue the certificate.

        === "existingSecret"
            You can pull SSL/TLS certificate from an existing Kubernetes secrets in the same namespace.

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # The name of the Kubernetes secret containing the certificate and private key
                    name: my-secret-name
            processing:
              service:
                type: ClusterIP
            ```
        === "customSecret"
            The `customSecret` configuration allows you to define a certificate directly as base64-encoded values.

            ```yaml
            config:
              connector:
                mode: envoy-external-filter
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64-encoded CA
                    crt: LS0... # Base64-encoded certificate
                    key: LS0... # Base64-encoded private key
            processing:
              service:
                type: ClusterIP
            ```
    
[All configuration parameters](helm-chart-conf.md)

### 4. Deploy the Wallarm service

=== "US Cloud"
    ```
    helm upgrade --install --version 0.22.1 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace -f values.yaml --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com
    ```
=== "EU Cloud"
    ```
    helm upgrade --install --version 0.22.1 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace -f values.yaml --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com
    ```

### 5. Configure DNS access to the Wallarm Node

=== "If deploying with the `LoadBalancer` type"
    1. Get the external IP for the Wallarm load balancer:

        ```
        kubectl get svc -n wallarm-node
        ```

        Find the external IP for the `native-processing` service.
    1. Create an A record in your DNS provider, pointing your domain to the external IP.

        After the DNS propagates, you can access the service via the domain name.

=== "If deploying with the `ClusterIP` type"
    The Wallarm Node does not have a public IP, so it must be accessible internally through a DNS rewrite.

    Create a CoreDNS rewrite rule to map your public domain (used in the certificate) to the Node's internal service address:

    ```bash
    # This assumes you installed the Native Node in the default namespace: wallarm
    # Replace <DOMAIN_NAME> with the domain name used in your certificate
    # Example: wallarm-node.corp.com -> native-processing.wallarm.svc.cluster.local

    kubectl patch configmap coredns -n kube-system --patch='
    data:
      Corefile: |
        .:53 {
            errors
            health {
              lameduck 5s
            }
            ready
            kubernetes cluster.local in-addr.arpa ip6.arpa {
              pods insecure
              fallthrough in-addr.arpa ip6.arpa
              ttl 30
            }
            rewrite name <DOMAIN_NAME> native-processing.wallarm.svc.cluster.local
            prometheus :9153
            forward . /etc/resolv.conf {
              max_concurrent 1000
            }
            cache 30
            loop
            reload
            loadbalance
        }
    '
    ```

    This configuration ensures that all in-cluster requests to `<DOMAIN_NAME>` resolve to the Wallarm Node's internal `ClusterIP` service while keeping traffic entirely within the cluster.

### 6. Apply Wallarm code to an API management service

After deploying the node, the next step is to apply the Wallarm code to your API management platform or service in order to route traffic to the deployed node.

1. Contact sales@wallarm.com to obtain the Wallarm code bundle for your connector.
1. Follow the platform-specific instructions to apply the bundle on your API management platform:

    * [MuleSoft Mule Gateway](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [MuleSoft Flex Gateway](../connectors/mulesoft-flex.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Apigee](../connectors/apigee.md#2-obtain-the-connector-code-bundle)
    * [Akamai](../connectors/akamai-edgeworkers.md#2-obtain-the-wallarm-code-bundle-and-create-edgeworkers)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Amazon API Gateway](../connectors/aws-api-gateway.md)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [Envoy/Istio](../connectors/istio.md#2-configure-istio-envoy-to-forward-traffic-to-the-wallarm-node)
    * [Gloo Gateway ](../connectors/gloo.md#2-configure-gloo-gateway-to-forward-traffic-to-the-wallarm-node)
    * [IBM DataPower](../connectors/ibm-api-connect.md#2-obtain-and-apply-the-wallarm-policies-to-apis-in-ibm-api-connect)
    * [Azure API Management](../connectors/azure-api-management.md#2-create-named-values-in-azure)
    * [Standalone Kong API Gateway](../connectors/standalone-kong-api-gateway.md#2-prepare-the-wallarm-lua-plugin)
    * [Kong Ingress Controller](../connectors/kong-ingress-controller.md#2-obtain-and-deploy-the-wallarm-lua-plugin)

## Upgrade

To upgrade the node, follow the [instructions](../../updating-migrating/native-node/helm-chart.md).
