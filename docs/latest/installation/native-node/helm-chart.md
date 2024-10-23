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

The [Wallarm native node](../nginx-native-node-internals.md), which operates independently of NGINX, is designed for deployment with some connectors. You can run the native node on as a separate service or as a load balancer in your Kubernetes cluster using the Helm chart.

## Use cases

Deploy the native node with Helm chart in the following cases:

* When you deploy a Wallarm connector for [MuleSoft](../connectors/mulesoft.md), [Cloudflare](../connectors/cloudflare.md) or [Amazon CloudFront](../connectors/aws-lambda.md) and require the node to be self-hosted. This is ideal if you are already using Kubernetes management platforms like OpenShift, Amazon EKS, Azure AKS, or Google GKE. The node is set up as a load balancer with a public IP for easy traffic routing.
* When you deploy a Wallarm connector for [Kong API Gateway](../connectors/kong-api-gateway.md) or [Istio](../connectors/istio.md). The node is deployed with the clusterIP type for internal traffic, without exposing a public IP.

## Requirements

The Kubernetes cluster for deploying the native node with the Helm chart must meet the following criteria:

* [Helm v3](https://helm.sh/) package manager installed
* Inbound access from your API gateway or CDN where your APIs are running
* Outbound access to:

    * `https://charts.wallarm.com` to download the Wallarm Helm chart
    * `https://hub.docker.com/r/wallarm` to download the Docker images required for the deployment
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* In addition to the above, you should have the **Administrator** role assigned in Wallarm Console.

## Limitations

* When deploying the Wallarm service with the `LoadBalancer` type, a **trusted** SSL/TLS certificate is required for the domain. Self-signed certificates are not yet supported.
* [Custom blocking page and blocking code](../../admin-en/configuration-guides/configure-block-page-and-code.md) configurations are not yet supported.
* [Rate limiting](../../user-guides/rules/rate-limiting.md) by the Wallarm rule is not supported.
* [Multitenancy](../multi-tenant/overview.md) is not supported yet.

## 1. Deploy a node

=== "LoadBalancer"
    Deploying the native Wallarm node as a LoadBalancer with a public IP allows you to route traffic from MuleSoft, Cloudflare, and Amazon CloudFront to this IP for security analysis and filtration.

    1. Open Wallarm Console → **Settings** → **API tokens** and create [API token][api-token] with the `Deploy` role.

        You will need this to connect the cluster with the node to the Wallarm Cloud. 
    1. Add the [Wallarm chart repository](https://charts.wallarm.com/) to the cluster:
        
        ```
        helm repo add wallarm https://charts.wallarm.com
        helm repo update wallarm
        ```
    1. Deploy the Wallarm load balancer in the cluster:

        === "US Cloud"
            ```
            helm upgrade --install --version 0.7.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com --set processing.service.type=LoadBalancer
            ```
        === "EU Cloud"
            ```
            helm upgrade --install --version 0.7.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com --set processing.service.type=LoadBalancer
            ```

        [All configuration parameters](helm-chart-conf.md)
    1. Get the external IP for the Wallarm load balancer:

        ```
        kubectl get svc -n wallarm
        ```

        Find the external IP for the `next-processing` service.
    1. Register a domain and point it to the load balancer's external IP by creating an A record in your DNS provider.

        After the DNS propagates, you can access the service via the domain name (this may take some time).
    1. Obtain a **trusted** SSL/TLS certificate for the domain. Self-signed certificates are not supported yet.

        There are the following ways to issue and apply the certificate:

        === "cert-manager"
            If you use [`cert-manager`](https://cert-manager.io/) in your cluster, you can generate the SSL/TLS certificate with it.

            ```yaml
            config:
              connector:
                certificate:
                  enabled: true
                  certManager:
                    enabled: true
                    issuerRef:
                      # The name of the cert-manager Issuer or ClusterIssuer
                      name: letsencrypt-prod
                      # If it is Issuer (namespace-scoped) or ClusterIssuer (cluster-wide)
                      kind: ClusterIssuer
            ```

            Or with `helm upgrade`:

            ```
            helm upgrade <WALLARM_RELEASE_NAME> wallarm/wallarm-node-next -n wallarm-node --set config.connector.certificate.enabled=true --set config.connector.certificate.certManager.enabled=true --set config.connector.certificate.certManager.issuerRef.name=letsencrypt-prod --set config.connector.certificate.certManager.issuerRef.kind=ClusterIssuer
            ```
        === "existingSecret"
            You can pull SSL/TLS certificate from an existing Kubernetes secrets in the same namespace.

            ```yaml
            config:
              connector:
                certificate:
                  enabled: true
                  existingSecret:
                    enabled: true
                    # The name of the Kubernetes secret containing the certificate and private key
                    name: my-secret-name
            ```

            Or with `helm upgrade`:

            ```
            helm upgrade <WALLARM_RELEASE_NAME> wallarm/wallarm-node-next -n wallarm-node --set config.connector.certificate.enabled=true --set config.connector.certificate.existingSecret.enabled=true --set config.connector.certificate.existingSecret.name=my-secret-name
            ```
        === "customSecret"
            The `customSecret` configuration allows you to define a certificate directly as base64-encoded values.

            ```yaml
            config:
              connector:
                certificate:
                  enabled: true
                  customSecret:
                    enabled: true
                    ca: LS0...  # Base64-encoded CA
                    crt: LS0... # Base64-encoded certificate
                    key: LS0... # Base64-encoded private key
            ```

            Or with `helm upgrade`:

            ```
            helm upgrade <WALLARM_RELEASE_NAME> wallarm/wallarm-node-next -n wallarm-node --set config.connector.certificate.enabled=true --set config.connector.certificate.customSecret.enabled=true --set config.connector.certificate.customSecret.ca=<BASE64_CA> --set config.connector.certificate.customSecret.crt=<BASE64_CERTIFICATE> --set config.connector.certificate.customSecret.key=<BASE64_PRIVATE_KEY>
            ```
=== "ClusterIP"
    When deploying Wallarm as a connector for Kong API Gateway or Istio you deploy the native node for this connector with the ClusterIP type for internal traffic, without exposing a public IP.

    1. Open Wallarm Console → **Settings** → **API tokens** and create [API token][api-token] with the `Deploy` role.

        You will need this to connect the cluster with the node to the Wallarm Cloud. 
    1. Add the [Wallarm chart repository](https://charts.wallarm.com/):
        
        ```
        helm repo add wallarm https://charts.wallarm.com
        helm repo update wallarm
        ```
    1. Deploy the Wallarm node service:

        === "US Cloud"
            ```
            helm upgrade --install --version 0.7.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com
            ```
        === "EU Cloud"
            ```
            helm upgrade --install --version 0.7.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com
            ```

        [All configuration parameters](helm-chart-conf.md)

## 2. Apply Wallarm code to an API management service

After deploying the node, the next step is to apply the Wallarm code to your API management platform or service in order to route traffic to the deployed node.

1. Contact sales@wallarm.com to obtain the Wallarm code bundle for your connector.
1. Follow the platform-specific instructions to apply the bundle on your API management platform:

    * [MuleSoft](../connectors/mulesoft.md#2-obtain-and-upload-the-wallarm-policy-to-mulesoft-exchange)
    * [Cloudflare](../connectors/cloudflare.md#2-obtain-and-deploy-the-wallarm-worker-code)
    * [Amazon CloudFront](../connectors/aws-lambda.md#2-obtain-and-deploy-the-wallarm-lambdaedge-functions)
    * [Kong API Gateway](../connectors/kong-api-gateway.md#2-obtain-and-deploy-the-wallarm-lua-plugin)
    * [Istio](../connectors/istio.md#2-configure-envoy-to-mirror-traffic-to-the-wallarm-node)

<!-- TBD: upgrade instructions -->