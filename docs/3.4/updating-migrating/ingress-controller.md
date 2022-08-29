# Upgrading NGINX Ingress controller with integrated Wallarm modules

These instructions describe the steps to upgrade deployed Wallarm Ingress Controller to the new version with Wallarm node 3.4.

--8<-- "../include/waf/upgrade/warning-node-types-upgrade-to-3.4.md"

## Step 1: Inform Wallarm technical support that you are upgrading filtering node modules

If updating Wallarm node 2.18 or lower, inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 3.4 and ask to enable new IP lists logic for your Wallarm account.

When new IP lists logic is enabled, please open Wallarm Console and ensure that the section [**IP lists**](../user-guides/ip-lists/overview.md) is available.

## Step 2: Update the repository containing Wallarm Helm charts

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

## Step 3: Upgrade the previous Helm chart

```bash
helm upgrade --version 3.4.1 <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
```

* `<INGRESS_CONTROLLER_NAME>` is the name of the deployed Wallarm Ingress controller
* `<KUBERNETES_NAMESPACE>` is the namespace of deployed Ingress and Ingress controller

Parameters specified with the option `--set` during the [Ingress controller deployment](../admin-en/installation-kubernetes-en.md) will not be changed.

To add or update the parameters of the upgraded Helm chart, use one more command `helm upgrade` with the options `--set` and `--reuse-values`. To delete parameters, edit Wallarm ConfigMap.

## Step 4: Adjust the Ingress and Helm chart configuration to changes released in version 3.x

If you have upgraded the Helm chart of version 3.0 or lower, adjust the following configurations to changes released in version 3.x:

1. If you have upgraded the Helm chart of version 2.18 or lower, IP address lists. If you have configured IP whitelists and denylists in version 2.18 or lower, adjust the list settings using the [instructions](migrate-ip-lists-to-node-3.md).

    Since IP list core logic has been significantly changed in Wallarm node 3.x, it is required to adjust IP list configuration appropriately by changing Wallarm ConfigMap parameters and Ingress annotations.
2. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md):
      * [Directive `wallarm_mode`](../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../user-guides/settings/general.md)
      * [Low-level filtration rules configured in Wallarm Console](../user-guides/rules/wallarm-mode-rule.md)

      If the expected behavior does not correspond to the changed filtration mode logic, please adjust the [Ingress annotations](../admin-en/configure-kubernetes-en.md#ingress-annotations) and [other settings](../admin-en/configure-wallarm-mode.md) to released changes.

## Step 5: Move custom configuration specified in the `values.yaml` file to the `--set` option of `helm upgrade`

If some Ingress controller parameters have been configured via **values.yaml** cloned from the Wallarm Helm Chart repository, please copy and pass them to a new chart by using the option `--set` of the command `helm upgrade --reuse-values`.

For example, if the parameter [`wallarm_block_page_add_dynamic_path`](../admin-en/configure-parameters-en.md#wallarm_block_page_add_dynamic_path) has been set via the file **values.yaml**, you can move this parameter to the new version of the Helm chart by using the following command:

```bash
helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/usr/share/nginx/html/wallarm_blocked.html;}' <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
```

The option `--reuse-values` allows keeping intact already configured Helm chart parameters that not passed in the `--set` option. The option `--set` specifies the Helm chart parameters to be changed or added.

## Step 6: Test the upgraded Ingress controller

1. Check that the version of the Helm chart was updated:

    ```bash
    helm ls
    ```

    The chart version should correspond to `wallarm-ingress-3.4.1`.
2. Get the list of pods specifying the name of the Wallarm Ingress controller in `<INGRESS_CONTROLLER_NAME>`:
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    Each pod status should be **STATUS: Running** or **READY: N/N**. For example:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   8/8       Running   0          5m
    ```

3. Send the request with test [SQLI](../attacks-vulns-list.md#sql-injection) and [XSS](../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the Wallarm Ingress controller address:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    If the filtering node is working in the `block` mode, the code `403 Forbidden` will be returned in the response to the request and attacks will be displayed in Wallarm Console → **Events**.
