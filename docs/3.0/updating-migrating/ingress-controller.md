# Updating NGINX Ingress controller with integrated Wallarm API Security modules

These instructions describe the steps to update deployed Wallarm Ingress Controller to the new version with Wallarm node 3.0.

* To update Wallarm Ingress controller, you need to clone new Helm chart version and apply updates to the installed version.
* Current Ingress controller settings and Ingress annotations will be saved and applied to a new version automatically.

!!! warning "Breaking changes and skipping partner node update"
    * The Wallarm node 3.0 is **totally incompatible with previous Wallarm node versions**. Before updating the modules up to 3.0, please carefully review the list of [Wallarm node 3.0 changes](what-is-new.md) and consider a possible configuration change.
    * We do NOT recommend updating [partner node](../partner-waf-node/overview.md) up to version 3.0, since most changes will be fully supported only in partner node [3.2](versioning-policy.md#version-list).

## Updating

1. Inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 3.0 and ask to enable new IP lists logic for your Wallarm account. When new IP lists logic is enabled, please open Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.
2. Update the repository containing Wallarm Helm charts:

    === "If using the Helm repository"
        ```bash
        helm repo update wallarm
        ```
    === "If using the cloned GitHub repository"
        Add the [Wallarm Helm repository](https://charts.wallarm.com/) containing all chart versions by using the command below. Please use the Helm repository for further work with the Wallarm Ingress controller.

        ```bash
        helm repo add wallarm https://charts.wallarm.com
        helm repo update wallarm
        ```
3. Update the previous Helm chart:

    === "EU Cloud"
        ``` bash
        helm upgrade --set controller.wallarm.enabled=true,controller.wallarm.token=<YOUR_CLOUD_NODE_TOKEN> --version 3.0.0-3 <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
    === "US Cloud"
        ``` bash
        helm upgrade --set controller.wallarm.enabled=true,controller.wallarm.token=<YOUR_CLOUD_NODE_TOKEN>,controller.wallarm.apiHost=us1.api.wallarm.com --version 3.0.0-3 <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

    * `<YOUR_CLOUD_NODE_TOKEN>` is the token of the cloud node received when [installing Wallarm Ingress controller](../admin-en/installation-kubernetes-en.md)
    * `<INGRESS_CONTROLLER_NAME>` is the name of the Wallarm Ingress controller to update
    * `<KUBERNETES_NAMESPACE>` is the namespace of your Ingress
4. Migrate whitelist and blacklist configuration from previous Wallarm node version to 3.0 following the [instructions](migrate-ip-lists-to-node-3.md).

## Testing

1. Check that the version of Helm chart was updated:

    ```bash
    helm ls
    ```

    The chart version should correspond to `wallarm-ingress-1.8.x`.
2. Get the list of pods specifying the name of the Wallarm Ingress controller in `<INGRESS_CONTROLLER_NAME>`:
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    Each pod status should be **STATUS: Running** or **READY: N/N**. For example:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   8/8       Running   0          5m
    ingress-controller-nginx-ingress-default-backend-584ffc6c7xj5xx   1/1       Running   0          5m
    ```

3. Send the request with test [SQLI](../attacks-vulns-list.md#sql-injection) and [XSS](../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the Wallarm Ingress controller address:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    If the filtering node is working in the `block` mode, the code `403 Forbidden` will be returned in the response to the request and attacks will be displayed in Wallarm Console → **Nodes**.

## Configuring

Ingress controller settings and Ingress annotations will be automatically moved from the previous version to the new version. The list of all settings and annotations is available [here](../admin-en/configure-kubernetes-en.md).

Configuration use cases:

* [Proper Reporting of End User Public IP Address](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
* [Management of IP Addresses Blocking](../user-guides/ip-lists/overview.md)
* [High Availability Considerations](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)
* [Ingress Controller Monitoring](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
