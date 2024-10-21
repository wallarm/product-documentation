# Wallarm Connector for Kong Ingress Controller

To secure APIs managed by [Kong Ingress Controller](https://docs.konghq.com/kubernetes-ingress-controller/latest/), Wallarm provides a connector that integrates seamlessly into your Kubernetes environment. By deploying the Wallarm filtering node and connecting it to Kong via a custom Lua plugin, incoming traffic is analyzed in real-time, allowing Wallarm to mitigate malicious requests before they reach your services.

The Wallarm connector for Kong Ingress Controller supports only [in-line](../inline/overview.md) mode:

![Kong with Wallarm plugin](../../images/waf-installation/gateways/kong/traffic-flow-inline.png)

## Use cases

Among all supported [Wallarm deployment options](../supported-deployment-options.md), this solution is the recommended one for securing APIs managed by the Kong Ingress Controller running the Kong API Gateway.

## Limitations

This setup allows fine-tuning Wallarm only via the Wallarm Console UI. Some Wallarm features that require file-based configuration are not supported in this implementation, such as:

* [Multitenancy feature][multitenancy-overview]
* [Application configuration][applications-docs]
* [Custom blocking page and code setup][custom-blocking-page-docs]
* Local control of Wallarm's filtration mode is not supported, and it defaults to [blocking][available-filtration-modes]. You can [change this mode via the Wallarm Console UI][ui-filtration-mode].

## Requirements

To proceed with the deployment, ensure that you meet the following requirements:

* Kong Ingress Controller deployed and managing your API traffic in Kubernetes cluster
* [Helm v3](https://helm.sh/) package manager
* Access to `https://us1.api.wallarm.com` (US Wallarm Cloud) or to `https://api.wallarm.com` (EU Wallarm Cloud)
* Access to `https://charts.wallarm.com` to add the Wallarm Helm chart
* Access to the Wallarm repositories on Docker Hub `https://hub.docker.com/r/wallarm`
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted](../../user-guides/ip-lists/overview.md) countries, regions, or data centers

    --8<-- "../include/wallarm-cloud-ips.md"
* **Administrator** access to Wallarm Console for [US Cloud](https://us1.my.wallarm.com/) or [EU Cloud](https://my.wallarm.com/)

## Deployment

To secure APIs managed by Kong Ingress Controller, follow these steps:

1. Deploy the Wallarm filtering node service in your Kubernetes cluster.
1. Obtain and deploy the Wallarm Lua plugin to route incoming traffic from the Kong Ingress Controller to the Wallarm filtering node for analysis.

### 1: Deploy a Wallarm node

Deploy the Wallarm node as a separate service in your Kubernetes cluster using Helm.

The node operates in **[blocking mode][available-filtration-modes] by default**, meaning malicious requests will be blocked, and a 403 response will be returned. You can [change this mode in the Wallarm Console UI][ui-filtration-mode].

1. Generate an API token to connect the Wallarm node to the Wallarm Cloud:

    1. Open Wallarm Console → **Settings** → **API tokens** in the [US Cloud](https://us1.my.wallarm.com/settings/api-tokens) or [EU Cloud](https://my.wallarm.com/settings/api-tokens).
    1. Find or create API token with the `Deploy` source role.
    1. Copy this token.
1. Add the [Wallarm chart repository](https://charts.wallarm.com/):
    
    ```
    helm repo add wallarm https://charts.wallarm.com
    helm repo update wallarm
    ```
1. Deploy the Wallarm filtering node service:

    === "US Cloud"
        ```
        helm upgrade --install --version 0.7.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=us1.api.wallarm.com --set config.connector.http_inspector.real_ip_header=X-Real-IP
        ```
    === "EU Cloud"
        ```
        helm upgrade --install --version 0.7.0 <WALLARM_RELEASE_NAME> wallarm/wallarm-node-native -n wallarm-node --create-namespace --set config.api.token=<WALLARM_API_TOKEN> --set config.api.host=api.wallarm.com --set config.connector.http_inspector.real_ip_header=X-Real-IP
        ```

    `config.connector.http_inspector.real_ip_header` specifies the header to extract the client's real IP address when traffic passes through proxies or load balancers.

### 2: Obtain and deploy the Wallarm Lua plugin

1. Contact [support@wallarm.com](mailto:support@wallarm.com) to obtain the Wallarm Lua plugin code for your Kong Ingress Controller.
1. Create a ConfigMap with the plugin code:

    ```
    kubectl apply -f wallarm-kong-lua.yaml -n <KONG_NS>
    ```

    `<KONG_NS>` is the namespace where your Kong Ingress Controller is deployed.
1. Update your `values.yaml` file for Kong Ingress Controller to load the Wallarm Lua plugin:

    ```yaml
    gateway:
      plugins:
        configMaps:
        - name: kong-lua
          pluginName: kong-lua
    ```
1. Update Kong Ingress Controller:

    ```
    helm upgrade --install <KONG_RELEASE_NAME> kong/ingress -n <KONG_NS> --values values.yaml
    ```
1. Activate the Wallarm Lua plugin by creating a `KongClusterPlugin` resource and specifying the Wallarm node service address:

    ```yaml
    echo '
    apiVersion: configuration.konghq.com/v1
    kind: KongClusterPlugin
    metadata:
      name: kong-lua
      annotations:
        kubernetes.io/ingress.class: kong
    config:
      wallarm_node_address: "http://next-processing.wallarm-node.svc.cluster.local:5000"
    plugin: kong-lua
    ' | kubectl apply -f -
    ```

    `wallarm-node` is the namespace where the Wallarm node service is deployed.
1. Add the following annotations to your Ingress or Gateway API route to enable the plugin for selected services:

    ```
    konghq.com/plugins: kong-lua
    kubernetes.io/ingress.class: kong
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
    next-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    next-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. Retrieve the Kong Gateway IP (which is usually configured as a `LoadBalancer` service):

    ```
    export PROXY_IP=$(kubectl get svc --namespace <KONG_NS> <KONG_RELEASE_NAME>-gateway-proxy -o jsonpath='{.status.loadBalancer.ingress[0].ip}')
    ```
1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to the balancer:

    ```
    curl -H "Host: kong-lua-test.wallarm" $PROXY_IP/etc/passwd
    ```

    The expected response is the following since the node operates in **[blocking mode][available-filtration-modes] by default**:

    ```json
    {"error": {"code": 403, "message": "request blocked"}}
    ```
1. Open Wallarm Console → **Attacks** section in the [US Cloud](https://us1.my.wallarm.com/attacks) or [EU Cloud](https://my.wallarm.com/attacks) and make sure the attack is displayed in the list.

    ![Attacks in the interface][attacks-in-ui-image]

You can [change the filtration mode via the Wallarm Console UI][ui-filtration-mode] if needed.

<!-- 
TBD before making this docs public:
1. Describe the difference between this Kong installation and https://docs.wallarm.com/installation/kubernetes/kong-ingress-controller/deployment/ - the first one installs the Wallarm plugin for already running Kong IC, the 2nd one deploys the Kong IC with integrated Wallarm services altogether (we patch the official Kong IC and distribute it)
1. Think on how to reflect this solution on the deployment option page and in the left navigation
1. mention Kong connector in connector articles where needed
1. add resource requirements, e.g. 4 CPU fits the solution but 2 is not enough (based on my experience)
1. Add an artifact to the artifact inventory
1. describe all values yaml parameters on a separate page
 -->