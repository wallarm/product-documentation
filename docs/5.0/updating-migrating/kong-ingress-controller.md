[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Upgrading Kong Ingress controller with integrated Wallarm modules

These instructions describe the steps to upgrade deployed Wallarm Kong-based Ingress Controller 4.x to the new version with Wallarm node 4.6.

## Requirements

--8<-- "../include/waf/installation/kong-ingress-controller-reqs.md"

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
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: the name of the Helm release with the Ingress controller chart
    * `<NAMESPACE>`: the namespace the Helm chart with the Ingress controller is deployed to
    * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Ingress controller 4.6 settings - you can use the one created for running the previous Ingress controller version
3. Make sure that no changes can affect the stability of the running services and carefully examine the errors from stdout.

    If stdout is empty, make sure that the `values.yaml` file is valid.

## Step 3: Upgrade the Ingress controller

Upgrade the deployed Kong Ingress controller:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/kong --version 4.6.3 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: the name of the Helm release with the Ingress controller chart
* `<NAMESPACE>`: the namespace the Helm chart with the Ingress controller is deployed to
* `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Ingress controller 6 settings - you can use the one created for running the previous Ingress controller version

## Step 4: Test the upgraded Ingress controller

1. Make sure the version of the Helm chart was upgraded:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Where `<NAMESPACE>` is the namespace the Helm chart with the Ingress controller is deployed to.

    The chart version should correspond to `kong-4.6.3`.
1. Get the Wallarm pod details to check they have been successfully started:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=kong
    ```

    Each pod should display the following: **READY: N/N** and **STATUS: Running**, e.g.:

    ```
    NAME                                                      READY   STATUS    RESTARTS   AGE
    wallarm-ingress-kong-54cf88b989-gp2vg                     1/1     Running   0          91m
    wallarm-ingress-kong-wallarm-tarantool-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Send the test [Path Traversal](../attacks-vulns-list.md#path-traversal) attacks to the Kong Ingress Controller Service:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    Check that the solution of the newer version processes the malicious request as it did in the previous version.
