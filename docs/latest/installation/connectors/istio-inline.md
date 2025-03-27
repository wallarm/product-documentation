[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[custom-blocking-page-docs]:        ../../admin-en/configuration-guides/configure-block-page-and-code.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[multitenancy-overview]:            ../multi-tenant/overview.md
[applications-docs]:                ../../user-guides/settings/applications.md
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[ui-filtration-mode]:              ../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console
[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Wallarm Filter for Istio Ingress (Inline)

Wallarm provides a filter for securing APIs managed by Istio to analyze traffic [in-line](../inline/overview.md). You deploy the Wallarm node externally and apply the Wallarm-provided configuration in the Envoy settings to route traffic to the Wallarm node for analysis via the gRPC-based external processing filter.

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this is the optimal choice for securing in real time APIs managed by Istio running with Envoy proxy.

## Limitations

* [Custom blocking page and code setup][custom-blocking-page-docs]

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Understanding of Istio technologies
* Istio with Envoy proxy managing API traffic

## Deployment

### 1. Deploy a Wallarm Node

The Wallarm node is a core component of the Wallarm platform that you need to deploy. It inspects incoming traffic, detects malicious activities, and can be configured to mitigate threats.

Choose an artifact for a self-hosted node deployment and follow the instructions attached for the `envoy-external-filter` mode:

* [All-in-one installer](../native-node/all-in-one.md) for Linux infrastructures on bare metal or VMs
* [Docker image](../native-node/docker-image.md) for environments that use containerized deployments
* [Helm chart](../native-node/helm-chart.md) for infrastructures utilizing Kubernetes

### 2. Configure Envoy to proxy traffic to the Wallarm node

1. In your `envoy.yaml` → `http_filters` section, configure the external processing filter for sending requests and responses to the external Wallarm Node for analysis. For this, use the following template:

    ```yaml
    ...

    http_filters:
    - name: ext_proc
      typed_config:
        "@type": type.googleapis.com/envoy.extensions.filters.http.ext_proc.v3.ExternalProcessor
        grpc_service:
          envoy_grpc:
            cluster_name: wallarm_cluster
        processing_mode:
          request_body_mode: STREAMED
          response_body_mode: STREAMED
        request_attributes: ["request.id", "request.time", "source.address"]
    ```
1. In your `envoy.yaml` → `clusters` section, configure the Wallarm cluster used to forward data to the Wallarm Node. For this, use the following template:

    ```yaml
    clusters:
    - ...
    - name: wallarm_cluster
      connect_timeout: 30s
      load_assignment:
        cluster_name: wallarm_cluster
        endpoints: # endpoint of the Wallarm Node
        - lb_endpoints:
          - endpoint:
              address:
                socket_address:
                  address: 127.0.0.1
                  port_value: 5080
      http2_protocol_options: {} # must be set for enabling http2
      transport_socket:
        name: envoy.transport_sockets.tls
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext
          common_tls_context:
            validation_context:
              trusted_ca:
                filename: /path/to/node-ca.pem # CA that issued the certificate used by the Node instance
    ```

## Testing

To test the functionality of the deployed filter, follow these steps:

1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to the Istio Gateway:

    ```
    curl https://<ISTIO_GATEWAY_IP>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.

    ![Attacks in the interface][attacks-in-ui-image]
