# Upgrading NGINX Ingress controller with integrated Wallarm modules

These instructions describe the steps to upgrade deployed Wallarm Ingress Controller 3.4 or 3.2 to the new version with Wallarm node 3.6.

To upgrade the node 2.18 or lower, please use the [different instructions](older-versions/ingress-controller.md).

## Step 1: Update the repository containing Wallarm Helm charts

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

## Step 2: Upgrade the previous Helm chart

```bash
helm upgrade --version 3.4.1 <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
```

* `<INGRESS_CONTROLLER_NAME>` is the name of the deployed Wallarm Ingress controller
* `<KUBERNETES_NAMESPACE>` is the namespace of deployed Ingress and Ingress controller

Parameters specified with the option `--set` during the [Ingress controller deployment](../admin-en/installation-kubernetes-en.md) will not be changed.

To add or update the parameters of the upgraded Helm chart, use one more command `helm upgrade` with the options `--set` and `--reuse-values`. To delete parameters, edit Wallarm ConfigMap.

## Step 3: Adjust the Ingress and Helm chart configuration to released changes

1. If there is the annotation `nginx.ingress.kubernetes.io/wallarm-instance` explicitly passed to the Helm chart, rename it to `nginx.ingress.kubernetes.io/wallarm-application`.

    Only the annotation name has changed, its logic remains the same. The annotation with the former name will be deprecated soon, so you are recommended to rename its before.
2. If the page `&/usr/share/nginx/html/wallarm_blocked.html` is returned to blocked requests, [adjust its configuration](../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-default-blocking-page) to the released changes.

    In new node versions, the Wallarm blocking page [has](what-is-new.md#when-upgrading-node-34) the updated UI with no logo and support email are specified on the page by default.
    
## Step 4: Move the custom configuration specified in the `values.yaml` file to the `--set` option of `helm upgrade`

If some Ingress controller parameters have been configured via **values.yaml** cloned from the Wallarm Helm Chart repository, please copy and pass them to a new chart by using the option `--set` of the command `helm upgrade --reuse-values`.

For example, if the parameter [`wallarm_block_page_add_dynamic_path`](../admin-en/configure-parameters-en.md#wallarm_block_page_add_dynamic_path) has been set via the file **values.yaml**, you can move this parameter to the new version of the Helm chart by using the following command:

```bash
helm upgrade --reuse-values --set controller.config.http-snippet='wallarm_block_page_add_dynamic_path /usr/custom-block-pages/block_page_firefox.html /usr/share/nginx/html/wallarm_blocked.html; map $http_user_agent $block_page { "~Firefox" &/usr/custom-block-pages/block_page_firefox.html; "~Chrome" &/usr/custom-block-pages/block_page_chrome.html; default &/usr/share/nginx/html/wallarm_blocked.html;}' <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
```

The option `--reuse-values` allows keeping intact already configured Helm chart parameters that not passed in the `--set` option. The option `--set` specifies the Helm chart parameters to be changed or added.

## Step 5: Test the upgraded Ingress controller

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
    ingress-controller-nginx-ingress-default-backend-584ffc6c7xj5xx   1/1       Running   0          5m
    ```

3. Send the request with test [SQLI](../attacks-vulns-list.md#sql-injection) and [XSS](../attacks-vulns-list.md#crosssite-scripting-xss) attacks to the Wallarm Ingress controller address:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/?id='or+1=1--a-<script>prompt(1)</script>'
    ```

    If the filtering node is working in the `block` mode, the code `403 Forbidden` will be returned in the response to the request and attacks will be displayed in Wallarm Console → **Nodes**.
