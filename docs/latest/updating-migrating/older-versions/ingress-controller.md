[nginx-process-time-limit-docs]:    ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit
[nginx-process-time-limit-block-docs]:  ../../admin-en/configure-parameters-en.md#wallarm_process_time_limit_block
[overlimit-res-rule-docs]:           ../../user-guides/rules/configure-overlimit-res-detection.md
[graylist-docs]:                     ../../user-guides/ip-lists/overview.md
[ip-list-docs]:                     ../../user-guides/ip-lists/overview.md
[waf-mode-instr]:                   ../../admin-en/configure-wallarm-mode.md
[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:        ../../api-specification-enforcement/overview.md

# Upgrading EOL NGINX Ingress controller with integrated Wallarm modules

These instructions describe the steps to upgrade deployed end‑of‑life Wallarm Ingress Controller (version 3.6 and lower) to the new version with Wallarm node 4.10.

--8<-- "../include/waf/upgrade/warning-deprecated-version-upgrade-instructions.md"

!!! warning "The upgraded version of Community Ingress NGINX Controller"
    If you upgrade the node from version 3.4 or lower, please note that the version of Community Ingress NGINX Controller the Wallarm Ingress controller is based on has been upgraded from 0.26.2 to 1.9.5.
    
    Since the operation of Community Ingress NGINX Controller 1.9.5 has been significantly changed, its configuration has to be adjusted to these changes during the Wallarm Ingress controller upgrade.

    These instructions contain the list of Community Ingress NGINX Controller settings you probably have to change. Nevertheless, please draw up and individual plan for the configuration migration based on the [Community Ingress NGINX Controller release notes](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md). 

## Requirements

--8<-- "../include/waf/installation/requirements-nginx-ingress-controller-latest.md"

## Step 1: Inform Wallarm technical support that you are upgrading filtering node modules (only if upgrading node 2.18 or lower)

If upgrading node 2.18 or lower, inform [Wallarm technical support](mailto:support@wallarm.com) that you are updating filtering node modules up to 4.10 and ask to enable new IP lists logic for your Wallarm account.

When new IP lists logic is enabled, please open Wallarm Console and ensure that the section [**IP lists**](../../user-guides/ip-lists/overview.md) is available.

## Step 2: Disable the Active threat verification module (only if upgrading node 2.16 or lower)

If upgrading Wallarm node 2.16 or lower, please disable the [Active threat verification](../../about-wallarm/detecting-vulnerabilities.md#active-threat-verification) module in Wallarm Console → **Vulnerabilities** → **Configure**.

The module operation can cause [false positives](../../about-wallarm/protecting-against-attacks.md#false-positives) during the upgrade process. Disabling the module minimizes this risk.

## Step 3: Update API port

--8<-- "../include/waf/upgrade/api-port-443.md"

## Step 4: Update the Wallarm Helm chart repository

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

## Step 5: Update the `values.yaml` configuration

To migrate to Wallarm Ingress controller 4.10, update the following configuration specified in the `values.yaml` file:

* Standard configuration of Community Ingress NGINX Controller
* Wallarm module configuration

### Standard configuration of Community Ingress NGINX Controller

1. Check out the [release notes on Community Ingress NGINX Controller](https://github.com/kubernetes/ingress-nginx/blob/main/Changelog.md) 0.27.0 and higher and define the settings to be changed in the `values.yaml` file.
2. Update the defined settings in the `values.yaml` file.

There are the following setting probably to be changed:

* [Proper reporting of end user public IP address](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/report-public-user-ip.md) if requests are passed through a load balancer before being sent to the Wallarm Ingress controller.

    ```diff
    controller:
      config:
    -    use-forwarded-headers: "true"
    +    enable-real-ip: "true"
    +    forwarded-for-header: "X-Forwarded-For"
    ```
* [IngressClasses configuration](https://kubernetes.github.io/ingress-nginx/user-guide/multiple-ingress/). The version of used Kubernetes API has been upgraded in the new Ingress controller that requires IngressClasses to be configured via the `.controller.ingressClass`, `.controller.ingressClassResource` and `.controller.watchIngressWithoutClass` parameters.

    ```diff
    controller:
    +  ingressClass: waf-ingress
    +  ingressClassResource:
    +    name: waf-ingress
    +    default: true
    +  watchIngressWithoutClass: true
    ```
* [ConfigMap (`.controller.config`) parameter set](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/), e.g.: 

    ```diff
    controller:
    config:
    +  allow-backend-server-header: "false"
      enable-brotli: "true"
      gzip-level: "3"
      hide-headers: Server
      server-snippet: |
        proxy_request_buffering on;
        wallarm_enable_libdetection on;
    ```
* [Validation of Ingress syntax via "admission webhook"](https://kubernetes.github.io/ingress-nginx/how-it-works/#avoiding-outage-from-wrong-configuration) is now enabled by default.

    ```diff
    controller:
    +  admissionWebhooks:
    +    enabled: true
    ```

    !!! warning "Disabling the Ingress syntax validation"
        It is recommended to disable the Ingress syntax validation only if it destabilizes the operation of Ingress objects. 
* [Label](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) format. If the `values.yaml` file sets pod affinity rules, change the label format in these rules, e.g.:

    ```diff
    controller:
      affinity:
        podAntiAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
        - podAffinityTerm:
            labelSelector:
                matchExpressions:
    -            - key: app
    +            - key: app.kubernetes.io/name
                operator: In
                values:
                - waf-ingress
    -            - key: component
    +            - key: app.kubernetes.io/component
                operator: In
                values:
    -              - waf-ingress
    +              - controller
    -            - key: release
    +            - key: app.kubernetes.io/instance
                operator: In
                values:
                - waf-ingress-ingress
            topologyKey: kubernetes.io/hostname
            weight: 100
    ```

### Wallarm module configuration

Change the Wallarm module configuration set in the `values.yaml` file as follows:

* If upgrading from version 2.18 or lower, [migrate](../migrate-ip-lists-to-node-3.md) the IP list configuration. There are the following parameters potentially to be deleted from `values.yaml`:

    ```diff
    controller:
      wallarm:
        enabled: true
        - acl:
        -  enabled: true
        resources: {}
    ```

    Since IP list core logic has been significantly changed in Wallarm node 3.x, it is required to adjust IP list configuration appropriately.
* Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md#filtration-modes):
      
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-general-filtration-rule-in-wallarm-console)
      * [Endpoint-targeted filtration rules configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)

      If the expected behavior does not correspond to the changed filtration mode logic, please adjust the [Ingress annotations](../../admin-en/configure-kubernetes-en.md#ingress-annotations) and [other settings](../../admin-en/configure-wallarm-mode.md) to released changes.
* Get rid of the explicit [monitoring service configuration](../../admin-en/configuration-guides/wallarm-ingress-controller/best-practices/ingress-controller-monitoring.md). In the new Wallarm Ingress controller version, the monitoring service is enabled by default and does not require any additional configuration.

    ```diff
    controller:
    wallarm:
      enabled: true
      tarantool:
        resources: {}
    -  metrics:
    -    enabled: true
    -    service:
    -      annotations: {}
    ```
* If the page `&/usr/share/nginx/html/wallarm_blocked.html` configured via ConfigMap was returned to blocked requests, [adjust its configuration](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) to the released changes.

    In new node version, the Wallarm sample blocking page [has](what-is-new.md#new-blocking-page) the updated UI with no logo and support email specified by default.
* If you have customized the `overlimit_res` attack detection via the [`wallarm_process_time_limit`][nginx-process-time-limit-docs] and [`wallarm_process_time_limit_block`][nginx-process-time-limit-block-docs] NGINX directives, please [transfer](#step-6-transfer-the-overlimit_res-attack-detection-configuration-from-directives-to-the-rule) this settings to the rule and delete from the `values.yaml` file.

## Step 6: Transfer the `overlimit_res` attack detection configuration from directives to the rule

--8<-- "../include/waf/upgrade/migrate-to-overlimit-rule-ingress-controller.md"

## Step 7: Check out all coming K8s manifest changes

To avoid unexpectedly changed Ingress controller behavior, check out all coming K8s manifest changes using [Helm Diff Plugin](https://github.com/databus23/helm-diff). This plugin outputs the difference between the K8s manifests of the deployed Ingress controller version and of the new one.

To install and run the plugin:

1. Install the plugin:

    ```bash
    helm plugin install https://github.com/databus23/helm-diff
    ```
2. Run the plugin:

    ```bash
    helm diff upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.7 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: the name of the Helm release with the Ingress controller chart
    * `<NAMESPACE>`: the namespace the Ingress controller is deployed to
    * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the [Ingress controller 4.10 settings](#step-5-update-the-valuesyaml-configuration)
3. Make sure no changes can affect the stability of the running services and carefully examine the errors from stdout.

    If stdout is empty, ensure the `values.yaml` file is valid.

Please note the changes of the following configuration:

* Immutable field, e.g. the Deployment and/or StatefulSet selectors.
* Pod labels. The changes can lead to the NetworkPolicy operation termination, e.g.:

    ```diff
    apiVersion: networking.k8s.io/v1
    kind: NetworkPolicy
    spec:
      egress:
      - to:
        - namespaceSelector:
            matchExpressions:
            - key: name
              operator: In
              values:
              - kube-system # ${NAMESPACE}
          podSelector:
            matchLabels: # RELEASE_NAME=waf-ingress
    -         app: waf-ingress
    +         app.kubernetes.io/component: "controller"
    +         app.kubernetes.io/instance: "waf-ingress"
    +         app.kubernetes.io/name: "waf-ingress"
    -         component: waf-ingress
    ```
* Configuration of Prometheus with new labels, e.g.:

    ```diff
     - job_name: 'kubernetes-ingress'
       kubernetes_sd_configs:
       - role: pod
         namespaces:
           names:
             - kube-system # ${NAMESPACE}
       relabel_configs: # RELEASE_NAME=waf-ingress
         # Selectors
    -    - source_labels: [__meta_kubernetes_pod_label_app]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_name]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_release]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_instance]
           action: keep
           regex: waf-ingress
    -    - source_labels: [__meta_kubernetes_pod_label_component]
    +    - source_labels: [__meta_kubernetes_pod_label_app_kubernetes_io_component]
           action: keep
    -      regex: waf-ingress
    +      regex: controller
         - source_labels: [__meta_kubernetes_pod_container_port_number]
           action: keep
           regex: "10254|18080"
           # Replacers
         - action: replace
           target_label: __metrics_path__
           regex: /metrics
         - action: labelmap
           regex: __meta_kubernetes_pod_label_(.+)
         - source_labels: [__meta_kubernetes_namespace]
           action: replace
           target_label: kubernetes_namespace
         - source_labels: [__meta_kubernetes_pod_name]
           action: replace
           target_label: kubernetes_pod_name
         - source_labels: [__meta_kubernetes_pod_name]
           regex: (.*)
           action: replace
           target_label: instance
           replacement: "$1"
    ```
* Analyze all other changes.

## Step 8: Upgrade the Ingress controller

There are three ways of upgrading the Wallarm Ingress controller. Depending on whether there is a load balancer deployed to your environment, select the upgrade method:

* Deployment of the temporary Ingress controller
* Regular re‑creation of the Ingress controller release
* Ingress controller release re‑creation without affecting the load balancer

!!! warning "Using the staging environment or minikube"
    If the Wallarm Ingress controller is deployed to your staging environment, it is recommended to upgrade it first. With all services operating correctly in the staging environment, you can proceed to the upgrade procedure in the production environment.

    Unless it is recommended to [deploy the Wallarm Ingress controller 4.10](../../admin-en/installation-kubernetes-en.md) with the updated configuration using minikube or another service first. Ensure all services operates as expected and then upgrade the Ingress controller in the production environment.

    This approach helps to avoid downtime of the services in the production environment.

### Method 1: Deployment of the temporary Ingress controller

By using this method, you can deploy Ingress Controller 4.10 as an additional entity in your environment and switch the traffic to it gradually. It helps to avoid even temporary downtime of services and ensures safe migration.

1. Copy the IngressClass configuration from the `values.yaml` file of the previous version to the `values.yaml` file for the Ingress controller 4.10.

    With this configuration, the Ingress controller will identify the Ingress objects but will not process their traffic.
2. Deploy the Ingress controller 4.10:

    ```bash
    helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.7 -f <PATH_TO_VALUES>
    ```

    * `<RELEASE_NAME>`: the name for the Helm release of the Ingress controller chart
    * `<NAMESPACE>`: the namespace to deploy the Ingress controller to
    * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the [Ingress controller 4.10 settings](#step-5-update-the-valuesyaml-configuration)
3. Ensure all services operate correctly.
4. Switch the load to the new Ingress controller gradually.

### Method 2: Regular re‑creation of the Ingress controller release

**If the load balancer and Ingress controller are NOT described in the same Helm chart**, you can just re‑create the Helm release. It will take several minutes and the Ingress controller will be unavailable for this time.

!!! warning "If Helm chart sets the configuration of a load balancer"
    If Helm chart sets the configuration of a load balancer along with the Ingress controller, release re‑creation can lead to a long load balancer downtime (depends on the cloud provider). The load balancer IP address can be changed after the upgrade if the constant address was not assigned.

    Please analyze all possible risks if using this method.

To re‑create the Ingress controller release:

=== "Helm CLI"
    1. Delete the previous release:

        ```bash
        helm delete <RELEASE_NAME> -n <NAMESPACE>
        ```

        * `<RELEASE_NAME>`: the name of the Helm release with the Ingress controller chart

        * `<NAMESPACE>`: the namespace the Ingress controller is deployed to

        Please do not use the `--wait` option when executing the command since it can increase the upgrade time.

    2. Create a new release with Ingress controller 4.10:

        ```bash
        helm install <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.7 -f <PATH_TO_VALUES>
        ```

        * `<RELEASE_NAME>`: the name for the Helm release of the Ingress controller chart

        * `<NAMESPACE>`: the namespace to deploy the Ingress controller to

        * `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the [Ingress controller 4.10 settings](#step-5-update-the-valuesyaml-configuration)
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
    
    3. Create the new release with the Ingress controller 4.10:

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
    helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-ingress --version 4.10.7 -f `<PATH_TO_VALUES>`
    ```

    To decrease service downtime, it is NOT recommended to execute commands separately.
3. Ensure all objects are created:

    ```bash
    helm get manifest <RELEASE_NAME> -n <NAMESPACE> | kubectl create -f -
    ```

    The output should say that all objects already exist.

There are the following parameters passed in the commands:

* `<RELEASE_NAME>`: the name of the Helm release with the Ingress controller chart
* `<NAMESPACE>`: the namespace the Ingress controller is deployed to
* `<PATH_TO_VALUES>`: the path to the `values.yaml` file defining the [Ingress controller 4.10 settings](#step-5-update-the-valuesyaml-configuration)

## Step 9: Test the upgraded Ingress controller

1. Check that the version of the Helm chart was updated:

    ```bash
    helm ls
    ```

    The chart version should correspond to `wallarm-ingress-4.10.7`.
2. Get the list of pods specifying the name of the Wallarm Ingress controller in `<INGRESS_CONTROLLER_NAME>`:
    
    ``` bash
    kubectl get pods -l release=<INGRESS_CONTROLLER_NAME>
    ```

    Each pod status should be **STATUS: Running** or **READY: N/N**. For example:

    ```
    NAME                                                              READY     STATUS    RESTARTS   AGE
    ingress-controller-nginx-ingress-controller-675c68d46d-cfck8      3/3       Running   0          5m
    ingress-controller-nginx-ingress-controller-wallarm-tarantljj8g   4/4       Running   0          5m
    ```

3. Send the request with the test [Path Traversal](../../attacks-vulns-list.md#path-traversal) attack to the Wallarm Ingress controller address:

    ```bash
    curl http://<INGRESS_CONTROLLER_IP>/etc/passwd
    ```

    If the filtering node is working in the `block` mode, the code `403 Forbidden` will be returned in response to the request and the attack will be displayed in Wallarm Console → **Attacks**.

## Step 10: Adjust the Ingress annotations to released changes

Adjust the following Ingress annotations to the changes released in Ingress controller 4.10:

1. If upgrading from version 2.18 or lower, [migrate](../migrate-ip-lists-to-node-3.md) the IP list configuration. Since IP list core logic has been significantly changed in Wallarm node 3.x, it is required to adjust IP list configuration appropriately by changing Ingress annotations (if applied).
1. Ensure that the expected behavior of settings listed below corresponds to the [changed logic of the `off` and `monitoring` filtration modes](what-is-new.md#filtration-modes):
      
      * [Directive `wallarm_mode`](../../admin-en/configure-parameters-en.md#wallarm_mode)
      * [General filtration rule configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-general-filtration-rule-in-wallarm-console)
      * [Endpoint-targeted filtration rules configured in Wallarm Console](../../admin-en/configure-wallarm-mode.md#setting-up-endpoint-targeted-filtration-rules-in-wallarm-console)

      If the expected behavior does not correspond to the changed filtration mode logic, please adjust the [Ingress annotations](../../admin-en/configure-kubernetes-en.md#ingress-annotations) to released changes.
1. If the Ingress is annotated with `nginx.ingress.kubernetes.io/wallarm-instance`, rename this annotation to `nginx.ingress.kubernetes.io/wallarm-application`.

    Only the annotation name has changed, its logic remains the same. The annotation with the former name will be deprecated soon, so you are recommended to rename it before.
1. If the page `&/usr/share/nginx/html/wallarm_blocked.html` configured via Ingress annotations is returned to blocked requests, [adjust its configuration](../../admin-en/configuration-guides/configure-block-page-and-code.md#customizing-sample-blocking-page) to the released changes.

    In new node versions, the Wallarm blocking page [has](what-is-new.md#new-blocking-page) the updated UI with no logo and support email specified by default.

## Step 11: Re-enable the Active threat verification module (only if upgrading node 2.16 or lower)

Learn the [recommendation on the Active threat verification module setup](../../vulnerability-detection/active-threat-verification/running-test-on-staging.md) and re-enable it if required.

After a while, ensure the module operation does not cause false positives. If discovering false positives, please contact the [Wallarm technical support](mailto:support@wallarm.com).
