[ip-lists-docs]: ../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../api-specification-enforcement/overview.md

# Upgrading Wallarm Sidecar

These instructions describe the steps to upgrade Wallarm Sidecar solution.

## Requirements

--8<-- "../include/waf/installation/sidecar-proxy-reqs-latest.md"

## Step 1: Update the Wallarm Helm chart repository

```bash
helm repo update wallarm
```

## Step 2: Check out all coming K8s manifest changes

To avoid unexpectedly changed Sidecar behavior, check out all coming K8s manifest changes using [Helm Diff Plugin](https://github.com/databus23/helm-diff). This plugin outputs the difference between the K8s manifests of the deployed Sidecar version and of the new one.

To install and run the plugin:

1. Install the plugin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Run the plugin:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n wallarm-sidecar wallarm/wallarm-sidecar --version 5.1.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>` is the name of the Wallarm Sidecar Helm release.
    * `wallarm-sidecar` is the namespace where the Wallarm Sidecar solution has been deployed. According to our [deployment](../installation/kubernetes/sidecar-proxy/deployment.md) guide, it is most likely set to `wallarm-sidecar`.
    * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Sidecar settings - you can use the one created for running the previous Sidecar version.
3. Make sure that no changes can affect the stability of the running services and carefully examine the errors from stdout.

    If stdout is empty, make sure that the `values.yaml` file is valid.

## Upgrading from version 4.10.6 or lower 4.10.x

The [release 4.10.7](/4.10/updating-migrating/node-artifact-versions/#helm-chart-for-sidecar) introduced breaking changes, requiring a reinstallation of the solution. The default method for generating the admission webhook certificate has been replaced with the [`certgen`](https://github.com/kubernetes/ingress-nginx/tree/main/images/kube-webhook-certgen) process. During the upgrade, certificates will be automatically generated using the new `certgen` process.

Additionally, this release allows you to use [`cert-manager` for admission webhook certificate provisioning or specify certificates manually](../installation/kubernetes/sidecar-proxy/customization.md#certificates-for-the-admission-webhook).

### Step 3: Uninstall the previous version of the solution

```
helm uninstall <RELEASE_NAME> -n wallarm-sidecar
```

### Step 4: Remove previous certificate artifacts

```
kubectl delete MutatingWebhookConfiguration <RELEASE_NAME>-wallarm-sidecar
kubectl delete secret <RELEASE_NAME>-wallarm-sidecar-admission-tls -n wallarm-sidecar
```

### Step 5: Deploy the new solution version

``` bash
helm install --version 5.1.0 <RELEASE_NAME> wallarm/wallarm-sidecar --wait -n wallarm-sidecar -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>` is the name for the Helm release. It is recommended to re-use the same name you used for the initial deployment of the solution.
* `wallarm-sidecar` is the namespace to deploy the Helm release. It is recommended to re-use the same namespace you used for the initial deployment of the solution.
* `<PATH_TO_VALUES>` is the path to the `values.yaml` file. You can re-use the one generated during the initial deployment, no changes are required for upgrading.

## Upgrading from version 4.10.7 or above

### Step 3: Upgrade the Sidecar solution

Upgrade the deployed components of the Sidecar solution:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-sidecar --version 5.1.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: the name of the Helm release with the deployed Sidecar chart
* `<NAMESPACE>`: the namespace the Sidecar is deployed to
* `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Sidecar 4.10 settings - you can use the one created for running the previous Sidecar version

## Test the upgraded Sidecar solution

1. Make sure the version of the Helm chart was upgraded:

    ```bash
    helm list -n wallarm-sidecar
    ```

    Where `wallarm-sidecar` is the namespace the Sidecar is deployed to. You can change this value if the namespace is different.

    The chart version should correspond to `wallarm-sidecar-5.1.0`.
1. Get the Wallarm control plane details to check it has been successfully started:

    ```bash
    kubectl get pods -n wallarm-sidecar -l app.kubernetes.io/name=wallarm-sidecar
    ```

    Each pod should display the following: **READY: N/N** and **STATUS: Running**, e.g.:

    ```
    NAME                                              READY   STATUS    RESTARTS   AGE
    wallarm-sidecar-controller-54cf88b989-gp2vg      1/1     Running   0          91m
    wallarm-sidecar-postanalytics-86d9d4b6cd-hpd5k   4/4     Running   0          91m
    ```
1. Send the test [Path Traversal](../attacks-vulns-list.md#path-traversal) attack to the application cluster address:

    ```bash
    curl http://<APPLICATION_CLUSTER_IP>/etc/passwd
    ```

    The requested application Pod should have the `wallarm-sidecar: enabled` label.

    Check that the solution of the newer version processes the malicious request as it did in the previous version.
