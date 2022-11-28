[nginx-process-time-limit-docs]:    ../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../user-guides/ip-lists/graylist.md
[ip-list-docs]:                     ../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../admin-en/configure-wallarm-mode.md

# Upgrading NGINX Ingress controller with integrated Wallarm modules

These instructions describe the steps to upgrade deployed Wallarm NGINX-based Ingress Controller 4.x to the new version with Wallarm node 4.4.

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
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: the name of the release with the deployed Ingress controller
    * `<NAMESPACE>`: the namespace the Ingress controller is deployed to
    * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Ingress controller 4.4 settings - you can use the one created for running the previous Ingress controller version
3. Make sure that no changes can affect the stability of the running services and carefully examine the errors from stdout.

    If stdout is empty, make sure that the `values.yaml` file is valid.

## Step 3: Upgrade the Ingress controller

There are three ways of upgrading the Wallarm Ingress controller. Depending on whether there is a load balancer deployed to your environment, select the upgrade method:

* Deployment of the temporary Ingress controller
* Regular re‑creation of the Ingress controller release
* Ingress controller release re‑creation without affecting the load balancer

!!! warning "Using the staging environment or minikube"
    If the Wallarm Ingress controller is deployed to your staging environment, it is recommended to upgrade it first. With all services operating correctly in the staging environment, you can proceed to the upgrade procedure in the production environment.

    Otherwise it is recommended to [deploy the Wallarm Ingress controller 4.4](../admin-en/installation-kubernetes-en.md) with the updated configuration using minikube or another service first. Make sure that all services operates as expected and then upgrade the Ingress controller in the production environment.

    This approach helps to avoid downtime of the services in the production environment.

### Method 1: Deployment of the temporary Ingress controller

This method enables you to deploy Ingress Controller as an additional entity in your environment and switch the traffic to it gradually. It helps to avoid even temporary downtime of services and ensures safe migration.

1. Copy the IngressClass configuration from the `values.yaml` file of the previous version to the `values.yaml` file for the Ingress controller 4.4.

    With this configuration, the Ingress controller will identify the Ingress objects but will not process their traffic.
2. Deploy the Ingress controller 4.4:

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.0 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: the name for the Ingress controller release
    * `<NAMESPACE>`: the namespace to deploy the Ingress controller to
    * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Ingress controller 4.4 settings
3. Make sure that all services operate correctly.
4. Switch the load to the new Ingress controller gradually.

### Method 2: Regular re‑creation of the Ingress controller release

**If the load balancer and Ingress controller are NOT described in the same Helm chart**, you can just re‑create the Helm release. It will take several minutes and the Ingress controller will be unavailable for this time.

!!! warning "If Helm chart sets the configuration of a load balancer"
    If Helm chart sets the configuration of a load balancer along with the Ingress controller, release re‑creation can result in a long load balancer downtime (depending on the cloud provider). The load balancer IP address can be changed after the upgrade unless the constant address is assigned.

    Please analyze all possible risks if using this method.

To re‑create the Ingress controller release:

=== "Helm CLI"
    1. Delete the previous release:

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: the name of the release with the deployed Ingress controller

        * `<NAMESPACE>`: the namespace the Ingress controller is deployed to

        Please do not use the `--wait` option when executing the command since it can increase the upgrade time.

    2. Create a new release with Ingress controller 4.4:

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.0 -f <PATH_TO_VALUES>
        ```

        * `<RELEASE_NAME>`: the name for the Ingress controller release

        * `<NAMESPACE>`: the namespace to deploy the Ingress controller to

        * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Ingress controller 4.4 settings
=== "Terraform CLI"
    1. Set the `wait = false` option in the Terraform configuration to decrease the upgrade time:
        
        ```diff
        resource "helm_release" "release" {
          ...

        + wait = false

          ...
        }
        ```
    
    2. Delete the previous release:

        ```bash
        terraform taint helm_release.release
        ```
    
    3. Create the new release with the Ingress controller 4.4:

        ```bash
        terraform apply -target=helm_release.release
        ```

### Method 3: Ingress controller release re‑creation without affecting the load balancer

When using the load balancer configured by the cloud provider, it is recommended to upgrade the Ingress controller with this method because it does not affect the load balancer.

Release re‑creation will take several minutes and the Ingress controller will be unavailable for this time.

1. Get objects to be deleted (except for the load balancer):

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | yq -r '. | select(.spec.type != "LoadBalancer") | .kind + "/" + .metadata.name' | tr 'A-Z' 'a-z' > objects-to-remove.txt
    ```

    To install the utility `yq`, please use the [instructions](https://pypi.org/project/yq/).

    Objects to be deleted will be output to the `objects-to-remove.txt` file.
2. Delete listed objects and re‑create the relese:

    ```bash
    cat objects-to-remove.txt | xargs kubectl delete --wait=false -n <NAMESPACE>    && \
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.4.0 -f `<PATH_TO_VALUES>`
    ```

    To decrease service downtime, it is NOT recommended to execute commands separately.
3. Make sure that all objects are created:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    The output should say that all objects already exist.

The following parameters are passed in the commands:

* `<RELEASE_NAME>`: the name of the release with the deployed Ingress controller
* `<NAMESPACE>`: the namespace the Ingress controller is deployed to
* `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the Ingress controller 4.4 settings

## Step 4: Test the upgraded Ingress controller

1. Make sure the version of the Helm chart was upgraded:

    ```bash
    helm ls
    ```

    The chart version should correspond to `wallarm-ingress-4.4.0`.
1. Get the list of pods specifying the name of the Wallarm Ingress controller in `<INGRESS_CONTROLLER_NAME>`:
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    Each pod status should be **STATUS: Running** or **READY: N/N**. For example:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      4/4       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

1. Send the request with the test [Path Traversal](../attacks-vulns-list.md#path-traversal) attack to the Wallarm Ingress controller address:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    If the filtering node is working in the `block` mode, the code `403 Forbidden` will be returned in response to the request and the attack will be displayed in Wallarm Console → **Events**.
