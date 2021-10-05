# Upgrading NGINX Ingress controller with integrated Wallarm API Security modules

These instructions describe the steps to update deployed Wallarm Ingress Controller to the new version with Wallarm node 3.2.

!!! warning "Breaking changes and recommendations for different node type update"
    * The Wallarm node 3.x is **totally incompatible with Wallarm node of version 2.18 and lower**. Before updating the modules up to 3.2, please carefully review the list of [Wallarm node changes](what-is-new.md) and consider a possible configuration change.
    * We recommend to update both the regular (client) and [partner](../partner-waf-node/overview.md) nodes of version 3.0 or lower up to version 3.2. This release enables IP greylists and other new features and stabilizes Wallarm node operation.

## Step 1: Inform Wallarm technical support that you are updating filtering node modules

If updating Wallarm node 2.18 or lower, inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 3.2 and ask to enable new IP lists logic for your Wallarm account.

When new IP lists logic is enabled, please open the Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.

## Step 2: Clone new Helm chart version from the Wallarm repository

```bash
git clone https://github.com/wallarm/ingress-chart --branch 3.2.1-1  --single-branch
```

## Step 3: Upgrade the previous Helm chart

1. If updating Wallarm node 2.18 or lower with configured IP whitelists and blacklists, [define the changes](migrate-ip-lists-to-node-3.md) of IP list configuration required for its correct operation.

    Since IP list core logic has been significantly changed in Wallarm node 3.2, it is required to adjust IP list configuration appropriately by changing Wallarm ConfigMap parameters and Ingress annotations. For example, you may need to replace the parameter `wallarm_acl_block_page` with `wallarm_block_page`.
2. If some Ingress controller parameters has been configured via **values.yaml** cloned from the Wallarm Helm Chart repository, please copy them and pass to a new chart by using the option `--set` with the command from the next step.
3. Upgrade the previous Helm chart by using the command [`helm upgrade`](https://helm.sh/docs/helm/helm_upgrade/):

    ``` bash
    helm upgrade --reuse-values <INGRESS_CONTROLLER_NAME> ingress-chart/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    * `<INGRESS_CONTROLLER_NAME>` is the name of the deployed Wallarm Ingress controller
    * `<KUBERNETES_NAMESPACE>` is the namespace of deployed Ingress and Ingress controller

    Parameters specified with the option `--set` during the [Ingress controller deployment](../admin-en/installation-kubernetes-en.md) will not be changed. To add or update the parameters, use the option `--set` with the command `helm upgrade`. To delete parameters, edit Wallarm ConfigMap.

## Step 4: Adjust Wallarm node filtration mode settings to changes released in version 3.2

1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md):
      * [Directive `wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in the Wallarm Console](../user-guides/settings/general.md)
      * [Low-level filtration rules configured in the Wallarm Console](../user-guides/rules/wallarm-mode-rule.md)
2. If the expected behavior does not correspond to the changed filtration mode logic, please adjust the [Ingress annotations](../admin-en/configure-kubernetes-en.md#ingress-annotations) to released changes.

## Step 5: Test the upgraded Ingress controller

1. Check that the version of the Helm chart was updated:

    ```bash
    helm ls
    ```

    The chart version should correspond to `wallarm-ingress-3.2.1-1`.
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
