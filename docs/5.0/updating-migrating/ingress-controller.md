[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# Upgrading NGINX Ingress controller with integrated Wallarm modules

These instructions describe the steps to upgrade deployed Wallarm NGINX-based Ingress Controller 4.x to the new version with Wallarm node 5.0.

To upgrade the end‑of‑life node (3.6 or lower), please use the [different instructions](older-versions/ingress-controller.md).

## Requirements

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Step 1: Update the Wallarm Helm chart repository

```bash
helm repo update wallarm
```

## Step 2: Check out all coming K8s manifest changes

To avoid unexpectedly changed Ingress controller behavior, check out all coming K8s manifest changes using [Helm Diff Plugin](https://github.com/databus23/helm-diff). This plugin outputs the difference between the K8s manifests of the deployed Ingress controller version and of the new one.

To install and run the plugin:

1. Install the plugin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Run the plugin:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.18 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: the name of the Helm release with the Ingress controller chart
    * `<NAMESPACE>`: the namespace the Ingress controller is deployed to
    * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Ingress controller 5.0 settings - you can use the one created for running the previous Ingress controller version
3. Make sure that no changes can affect the stability of the running services and carefully examine the errors from stdout.

    If stdout is empty, make sure that the `values.yaml` file is valid.

## Step 3: Upgrade the Ingress controller

Upgrade the deployed NGINX Ingress controller:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 5.3.18 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: the name of the Helm release with the Ingress controller chart
* `<NAMESPACE>`: the namespace the Ingress controller is deployed to
* `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Ingress controller 5.0 settings - you can use the one created for running the previous Ingress controller version

## Step 4: Test the upgraded Ingress controller

1. Make sure the version of the Helm chart was upgraded:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Where `<NAMESPACE>` is the namespace the Helm chart with the Ingress controller is deployed to.

    The chart version should correspond to `wallarm-ingress-5.3.18`.
1. Get the list of pods:
    
    ``` bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-ingress
    ```

    Each pod status should be **STATUS: Running** or **READY: N/N**. For example:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

1. Send the request with the test [Path Traversal](../attacks-vulns-list.md#path-traversal) attack to the Wallarm Ingress controller address:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Check that the solution of the newer version processes the malicious request as it did in the previous version.
