You might choose to deploy the Wallarm node via Helm chart when you are already utilizing Kubernetes management platforms such as OpenShift, Amazon EKS, Azure AKS, or Google GKE.

This method sets up the Wallarm node as a load balancer with a public IP, allowing you to direct traffic to it easily.

1. Make sure your K8s cluster meets the following requirements:

    * [Helm v3](https://helm.sh/) package manager
    * Inbound access from your API gateway or CDN where your APIs are running
    * Outbound access to:

        * `https://charts.wallarm.com` to download the Wallarm Helm chart
        * `https://hub.docker.com/r/wallarm` to download the Docker images required for the deployment
        * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
        * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

            === "US Cloud"
                ```
                34.96.64.17
                34.110.183.149
                35.235.66.155
                ```
            === "EU Cloud"
                ```
                34.160.38.183
                34.144.227.90
                34.90.110.226
                ```
1. Open Wallarm Console → **Settings** → **API tokens** and create [API token][api-token] with the `Deploy` role.

    You will need this to connect the cluster with the node to the Wallarm Cloud. 
1. Add the [Wallarm chart repository](https://charts.wallarm.com/) to the cluster:
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. Deploy the Wallarm node load balancer in the cluster:

    === "US Cloud"
        ```
        helm upgrade --install --version 0.5.3 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-next -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com --set processing.service.type=LoadBalancer --set config.connector.http_inspector.real_ip_header=X-Real-IP
        ```
    === "EU Cloud"
        ```
        helm upgrade --install --version 0.5.3 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-next -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com --set processing.service.type=LoadBalancer --set config.connector.http_inspector.real_ip_header=X-Real-IP
        ```

    [All configuration parameters][self-hosted-connector-node-helm-conf]
1. Get the external IP for the Wallarm load balancer:

    ```
    kubectl get svc -n wallarm
    ```

    Find the external IP for the `next-processing` service.
1. Register a domain and point it to the load balancer's external IP by creating an A record in your DNS provider.

    After the DNS propagates, you can access the service via the domain name (this may take some time).
1. Obtain a **trusted** SSL/TLS certificate for the domain. Self-signed certificates are not allowed.

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
                issuerRef: # Tell Wallarm Load Balancer which cert-manager entity to use
                name: letsencrypt-prod # The name of the cert-manager Issuer or ClusterIssuer
                kind: ClusterIssuer # If it is Issuer (namespace-scoped) or ClusterIssuer (cluster-wide)
        ```

        Or with `helm upgrade`:

        ```
        helm upgrade <WALLARM_RELEASE_NAME> wallarm/wallarm-node-next -n wallarm-node --set config.connector.certificate.enabled=true --set config.connector.certificate.certManager.enabled=true --set config.connector.certificate.certManager.issuerRef.name=letsencrypt-prod --set config.connector.certificate.certManager.issuerRef.kind=ClusterIssuer
        ```
    === "existingSecret"
        You can pull SSL/TLS certificate and secret from Kubernetes secrets.

        ```yaml
        config:
          connector:
            certificate:
              enabled: true
              existingSecret:
                enabled: true
                name: my-secret-name # The name of the Kubernetes secret containing the certificate and private key
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
