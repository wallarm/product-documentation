[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png
[custom-blocking-page-docs]:        ../../admin-en/configuration-guides/configure-block-page-and-code.md
[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[multitenancy-overview]:            ../multi-tenant/overview.md
[applications-docs]:                ../../user-guides/settings/applications.md
[available-filtration-modes]:       ../../admin-en/configure-wallarm-mode.md#available-filtration-modes
[ui-filtration-mode]:              ../../admin-en/configure-wallarm-mode.md#general-filtration-rule-in-wallarm-console
[self-hosted-connector-node-helm-conf]: ../native-node/helm-chart-conf.md

# Wallarm Connector for Istio Ingress

Wallarm provides a connector for securing APIs managed by Istio to analyze traffic [out-of-band (OOB)](../oob/overview.md). By deploying Wallarm nodes alongside [Istio's](https://istio.io/) Envoy proxies, the connector mirrors incoming traffic, sending it asynchronously for analysis while allowing traffic to continue flowing uninterrupted.

The integration relies on a Lua plugin, deployed within the Envoy proxy, to handle traffic mirroring and communication with the Wallarm node.

![Istio with Wallarm plugin](../../images/waf-installation/gateways/istio/traffic-flow-oob.png)

## Use cases

This solution is recommended when real-time traffic analysis is unnecessary, and asynchronous analysis is sufficient.

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this is the optimal choice for securing APIs managed by Istio running with Envoy proxy in Kubernetes.

## Limitations

This setup allows fine-tuning Wallarm only via the Wallarm Console UI. Some Wallarm features that require file-based configuration are not supported in this implementation, such as:

* [Multitenancy feature][multitenancy-overview]
* [Application configuration][applications-docs]
* [Custom blocking page and code setup][custom-blocking-page-docs]

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Istio with Envoy proxy managing API traffic in your Kubernetes cluster
* [Helm v3](https://helm.sh/) package manager
* Access to `https://us1.api.wallarm.com` (US Wallarm Cloud) or to `https://api.wallarm.com` (EU Wallarm Cloud)
* Access to `https://charts.wallarm.com` to add the Wallarm Helm chart
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted](../../user-guides/ip-lists/overview.md) countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* **Administrator** access to Wallarm Console for [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)

## Deployment

To secure APIs managed by Istio and Envoy proxy, follow these steps:

1. Deploy the Wallarm filtering node service in your Kubernetes cluster.
1. Configure the Envoy proxy in Istio to mirror traffic and send it to the Wallarm node for out-of-band analysis.

### 1. Deploy a Wallarm Native Node

To deploy the Wallarm node as a separate service in your Kubernetes cluster, follow the [instructions](../native-node/helm-chart.md).

### 2. Configure Envoy to mirror traffic to the Wallarm node

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Lua plugin code for Istio. The filenames provided by the support team are used in the following steps.
1. Apply the Envoy filter and cluster configuration to mirror traffic to the Wallarm node using Lua scripts:

    ```
    kubectl apply -f wallarm-envoy-gw-http-filter.yaml
    kubectl apply -f wallarm-envoy-cluster-svc-endpoint.yaml
    ```
1. Create ConfigMaps to mount the Wallarm connector and its Lua dependencies within the Istio Ingress controller namespace:

    ```
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-mpack-lib.yaml
    kubectl -n <ISTIO_INGRESS_NS> apply -f wallarm-cm-lua-rrasync.yaml
    ```
1. To mount the ConfigMaps, update your Istio Ingress Gateway deployment. Depending on how you manage Istio (Helm, IstioOperator, or custom deployment), apply the changes accordingly.

    For example, if Istio was installed using IstioOperator, you can mount the ConfigMaps by updating the `IstioOperator` resource:

    ```yaml
    apiVersion: install.istio.io/v1alpha1
    kind: IstioOperator
    spec:
      components:
        ingressGateways:
          - name: istio-ingressgateway
            enabled: true
            k8s:
              volumes:
                - name: lua-mpack
                  configMap:
                    name: lua-msgpack-lib
                - name: lua-rrasync
                  configMap:
                    name: rr-async-packed
              volumeMounts:
                - name: lua-mpack
                  mountPath: /usr/local/share/lua/5.1/msgpack
                  container: istio-proxy
                - name: lua-rrasync
                  mountPath: /usr/local/share/lua/5.1/rrasync
                  container: istio-proxy
    ```

    ```
    kubectl apply -f istio-operator.yaml
    ```

## Testing

To test the functionality of the deployed connector, follow these steps:

1. Verify that the Wallarm pods are up and running:

    ```
    kubectl -n wallarm-node get pods
    ```

    `wallarm-node` is the namespace where the Wallarm node service is deployed.

    Each pod status should be **STATUS: Running** or **READY: N/N**. For example:

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to the Istio Gateway:

    ```
    curl https://<ISTIO_GATEWAY_IP>/etc/passwd
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.

    ![Attacks in the interface][attacks-in-ui-image]

    Since the connector operates in the [out-of-band](../oob/overview.md) mode and does not block malicious requests, the Wallarm node will not block the attack but will register it.
1. If needed, monitor the Wallarm logs in a separate console window:

    ```
    kubectl -n gonode logs native-processing-7c487bbdc6-4j6mz --tail 100 -f
    ```

## Upgrading the Wallarm Lua plugin

To upgrade the deployed Wallarm Lua plugin to a [newer version](code-bundle-inventory.md#istio):

1. Contact support@wallarm.com to obtain the updated Wallarm Lua plugin code for your Istio Ingress.
1. Deploy the updated plugin as described in the [Step 2](#2-configure-envoy-to-mirror-traffic-to-the-wallarm-node).

Plugin upgrades may require a Wallarm node upgrade, especially for major version updates. See the [Wallarm Native Node changelog](../../updating-migrating/native-node/node-artifact-versions.md) for release updates and upgrade instructions. Regular node updates are recommended to avoid deprecation and simplify future upgrades.
