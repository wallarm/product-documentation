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

* When you deploy a Wallarm connector for [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md), [Amazon CloudFront](../connectors/aws-lambda.md), [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md), [Fastly](../connectors/fastly.md) and require the node to be self-hosted. This is ideal if you are already using Kubernetes management platforms like OpenShift, Amazon EKS, Azure AKS, or Google GKE. The node is set up as a load balancer with a public IP for easy traffic routing.

    Use the Node in `connector-server` mode.
* When you need an inline [gRPC-based external processing filter](../connectors/istio-inline.md) for APIs managed by Istio. The node is set up as a load balancer with a public IP for easy traffic routing.
    
    Use the Node in `envoy-external-filter` mode.
* When you deploy a Wallarm connector for [Kong API Gateway](../connectors/kong-api-gateway.md) or [Istio (out-of-band)](../connectors/istio.md). The node is deployed with the clusterIP type for internal traffic, without exposing a public IP.
    
    Use the Node in `connector-server` mode.

## Requirements

The Kubernetes cluster for deploying the Native Node with the Helm chart must meet the following criteria:

* [Helm v3](https://helm.sh/) package manager installed.
* Inbound access from your API gateway or CDN where your APIs are running.
* Outbound access to:

    * `https://charts.wallarm.com` to download the Wallarm Helm chart
    * `https://hub.docker.com/r/wallarm` to download the Docker images required for the deployment
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* If deploying with the `LoadBalancer` type, you need a domain and a trusted SSL/TLS certificate.
* In addition to the above, you should have the **Administrator** role assigned in Wallarm Console.

## Limitations

* When deploying the Wallarm service with the `LoadBalancer` type, a **trusted** SSL/TLS certificate is required for the domain. Self-signed certificates are not yet supported.
* [Custom blocking page and blocking code](../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## Deployment

### 1. Prepare Wallarm token

To install node, you will need a token for registering the node in the Wallarm Cloud. To prepare a token:

1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
1. Find or create API token with the `Deploy` source role.
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
            processing:
              service:
                type: LoadBalancer
            ```
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
=== "LoadBalancer (envoy-external-filter)"
    Deploying the native Wallarm node as a LoadBalancer with a public IP allows you to route traffic from MuleSoft, Cloudflare, Amazon CloudFront, Broadcom Layer7 API Gateway, Fastly to this IP for security analysis and filtration.

    1. Register a domain for the load balancer.
    1. Obtain a **trusted** SSL/TLS certificate.
    1. Create the `values.yaml` configuration file with the following minimal configuration. Choose the tab for your preferred method of applying the certificate:
    
        === "cert-manager"
            If you use [`cert-manager`](https://cert-manager.io/) in your cluster, you can generate the SSL/TLS certificate with it.

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
            processing:
              service:
                type: LoadBalancer
            ```
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
=== "ClusterIP"
    When deploying Wallarm as a connector for Kong API Gateway or Istio you deploy the Native Node for this connector with the ClusterIP type for internal traffic, without exposing a public IP.

    Create the `values.yaml` configuration file with the following minimal configuration:

    ```yaml
    processing:
      service:
        type: ClusterIP
    ```

[All configuration parameters](helm-chart-conf.md)

### 4. Deploy the Wallarm service

=== "US Cloud"
    ```
    helm upgrade --install --version 0.13.2 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com
    ```
=== "EU Cloud"
    ```
    helm upgrade --install --version 0.13.2 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com
    ```

### 5. Get the Wallarm load balancer

If deploying with the `LoadBalancer` type:

1. Get the external IP for the Wallarm load balancer:

    ```
    kubectl get svc -n wallarm-node
    ```

    Find the external IP for the `native-processing` service.
1. Create an A record in your DNS provider, pointing your domain to the external IP.

    After the DNS propagates, you can access the service via the domain name.

### 6. Apply Wallarm code to an API management service

After deploying the node, the next step is to apply the Wallarm code to your API management platform or service in order to route traffic to the deployed node.

1. Contact sales@wallarm.com to obtain the Wallarm code bundle for your connector.
1. Follow the platform-specific instructions to apply the bundle on your API management platform:

    * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Broadcom Layer7 API Gateway](../connectors/layer7-api-gateway.md#2-add-the-nodes-ssltls-certificate-to-the-policy-manager)
    * [Fastly](../connectors/fastly.md#2-deploy-wallarm-code-on-fastly)
    * [Kong API Gateway](../connectors/kong-api-gateway.md#2-obtain-and-deploy-the-wallarm-lua-plugin)
    * [Istio (out-of-band)](../connectors/istio.md#2-configure-envoy-to-mirror-traffic-to-the-wallarm-node)
    * [Istio](../connectors/istio-inline.md)

## Upgrade

To upgrade the node, follow the [instructions](../../updating-migrating/native-node/helm-chart.md).
