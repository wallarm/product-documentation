[ip-lists-docs]: ../user-guides/ip-lists/overview.md

# Upgrading Wallarm Sidecar proxy

These instructions describe the steps to upgrade Wallarm Sidecar proxy 4.x to the new version with Wallarm node 4.8.

## Requirements

--8<-- "../include/waf/installation/sidecar-proxy-reqs.md"

## Step 1: Update the Wallarm Helm chart repository

```bash
helm repo update wallarm
```

## Step 2: Check out all coming K8s manifest changes

To avoid unexpectedly changed Sidecar proxy behavior, check out all coming K8s manifest changes using [Helm Diff Plugin](https://github.com/databus23/helm-diff). This plugin outputs the difference between the K8s manifests of the deployed Sidecar proxy version and of the new one.

To install and run the plugin:

1. Install the plugin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Run the plugin:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.6.5 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: the name of the Helm release with the Sidecar proxy chart
    * `<NAMESPACE>`: the namespace the Sidecar proxy is deployed to
    * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Sidecar proxy 4.8 settings - you can use the one created for running the previous Sidecar proxy version
3. Make sure that no changes can affect the stability of the running services and carefully examine the errors from stdout.

    If stdout is empty, make sure that the `values.yaml` file is valid.

## Step 3: Upgrade the Sidecar proxy solution

Upgrade the deployed components of the Sidecar proxy solution:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 4.6.5 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: the name of the Helm release with the deployed Sidecar proxy chart
* `<NAMESPACE>`: the namespace the Sidecar proxy is deployed to
* `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Sidecar proxy 4.8 settings - you can use the one created for running the previous Sidecar proxy version

## Step 4: Test the upgraded Sidecar solution

1. Make sure the version of the Helm chart was upgraded:

    ```bash
    helm list -n <NAMESPACE>
    ```

    Where `<NAMESPACE>` is the namespace the Sidecar proxy is deployed to.

    The chart version should correspond to `wallarm-sidecar-1.1.5`.
1. Get the Wallarm pod details to check they have been successfully started:

    ```bash
    kubectl get pods -n <NAMESPACE> -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Each pod should display the following: **READY: N/N** and **STATUS: Running**, e.g.:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-f7jtb      1/1     Running   0          91m
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Send the test [Path Traversal](../attacks-vulns-list.md#path-traversal) attack to the application cluster address:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    The requested application Pod should have the `wallarm-sidecar: enabled` label.

    Check that the solution of the newer version processes the malicious request as it did in the previous version.
