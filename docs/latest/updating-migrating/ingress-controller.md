# Updating NGINX Ingress controller with integrated Wallarm API Security modules

These instructions describe the steps to update deployed Wallarm Ingress Controller to the new version with Wallarm node 3.2.

* To update Wallarm Ingress controller, you need to clone new Helm chart version and apply updates to the installed version.
* Current Ingress controller settings and Ingress annotations will be saved and applied to a new version automatically.

!!! warning "Breaking changes and recommendations for different node type update"
    * The Wallarm node 3.x is **totally incompatible with Wallarm node of version 2.18 and lower**. Before updating the modules up to 3.2, please carefully review the list of [Wallarm node changes](what-is-new.md) and consider a possible configuration change.
    * We recommend to update both the regular (client) and [partner](../partner-waf-node/overview.md) nodes of version 3.0 or lower up to version 3.2. This release enables IP greylists and other new features and stabilizes Wallarm node operation.

## Updating

1. If updating Wallarm node 2.18 or lower, inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 3.2 and ask to enable new IP lists logic for your Wallarm account.

    When new IP lists logic is enabled, please open the Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.
2. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md):
      * [Directive `wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in the Wallarm Console](../user-guides/settings/general.md)
      * [Low-level filtration rules configured in the Wallarm Console](../user-guides/rules/wallarm-mode-rule.md)

    If the expected behavior does not correspond to the changed filtration mode logic, please adjust the filtration mode settings to released changes using the [instructions](../admin-en/configure-wallarm-mode.md).
3. Clone new Helm chart version from the Wallarm repository:

    ```bash
    git clone https://github.com/wallarm/ingress-chart --branch 3.2.0-1  --single-branch
    ```
4. Update the previous Helm chart:

    === "EU Cloud"
        ``` bash
        helm upgrade --set controller.wallarm.enabled=true,controller.wallarm.token=<YOUR_CLOUD_NODE_TOKEN> <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
    === "US Cloud"
        ``` bash
        helm upgrade --set controller.wallarm.enabled=true,controller.wallarm.token=<YOUR_CLOUD_NODE_TOKEN>,controller.wallarm.apiHost=us1.api.wallarm.com <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

    * `<YOUR_CLOUD_NODE_TOKEN>` is the token of the cloud node received when [installing Wallarm Ingress controller](../admin-en/installation-kubernetes-en.md)
    * `<INGRESS_CONTROLLER_NAME>` is the name of the Wallarm Ingress controller to update
    * `<KUBERNETES_NAMESPACE>` is the namespace of your Ingress
5. If updating Wallarm node 2.18 or lower, migrate whitelist and blacklist configuration from previous Wallarm node version to 3.2 following the [instructions](migrate-ip-lists-to-node-3.md).

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

    If the filtering node is working in the `block` mode, the code `403 Forbidden` will be returned in the response to the request and attacks will be displayed in the Wallarm Console → **Nodes**.

## Configuring

Ingress controller settings and Ingress annotations will be automatically moved from the previous version to the new version. The list of all settings and annotations is available [here](../admin-en/configure-kubernetes-en.md).

Configuration use cases:

* [Proper Reporting of End User Public IP Address](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md)
* [Management of IP Addresses Blocking](../user-guides/ip-lists/overview.md)
* [High Availability Considerations](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/high-availability-considerations.md)
* [Ingress Controller Monitoring](../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md)
