[configure-proxy-balancer-instr]:           ../../admin-en/configuration-guides/access-to-wallarm-api-via-proxy.md
[ptrav-attack-docs]:                        ../../attacks-vulns-list.md#path-traversal
[ip-list-docs]:                             ../../user-guides/ip-lists/overview.md
[api-spec-enforcement-docs]:                ../../api-specification-enforcement/overview.md

# Upgrading Wallarm Native Node with Helm Chart

These instructions describe the steps to upgrade the [Native Node deployed using Helm chart](../../installation/native-node/helm-chart.md).

[View Helm chart releases](node-artifact-versions.md)

## Requirements

The Kubernetes cluster for deploying the Native Node with the Helm chart must meet the following criteria:

* [Helm v3](https://helm.sh/) package manager installed.
* Inbound access from your API gateway or CDN where your APIs are running.
* Outbound access to:

    * `https://charts.wallarm.com` to download the Wallarm Helm chart
    * `https://hub.docker.com/r/wallarm` to download the Docker images required for the deployment
    * `https://us1.api.wallarm.com` or `https://api.wallarm.com` for US/EU Wallarm Cloud
    * IP addresses below for downloading updates to attack detection rules and [API specifications][api-spec-enforcement-docs], as well as retrieving precise IPs for your [allowlisted, denylisted, or graylisted][ip-list-docs] countries, regions, or data centers

        --8<-- "../include/wallarm-cloud-ips.md"
* In addition to the above, you should have the **Administrator** role assigned in Wallarm Console.

## 1. Update the Wallarm Helm chart repository

```bash
helm repo update wallarm
```

## 2. Upgrade the Wallarm Kubernetes service

Upgrade the deployed Kubernetes service or Load Balancer:

``` bash
helm upgrade <RELEASE_NAME> -n <NAMESPACE> wallarm/wallarm-node-native --version 0.10.0 -f <PATH_TO_VALUES>
```

* `<RELEASE_NAME>`: the name of the existing Helm release
* `<NAMESPACE>`: the namespace with the Helm release
* `<PATH_TO_VALUES>`: the path to the [`values.yaml` file](../../installation/native-node/helm-chart-conf.md) defining the deployed solution configuration

    When upgrading to version 0.10.0 or higher, remove the `config.connector.log_level` parameter if specified. It has been replaced by the [`config.connector.log`](../../installation/native-node/helm-chart-conf.md#configconnectorlog) section for more granular logging. Specify the `log.*` parameters if customization is needed.

## 3. Verify the upgrade

1. Verify that the Wallarm pods are up and running:

    ```
    kubectl -n <NAMESPACE> get pods
    ```

    Each pod status should be **STATUS: Running** or **READY: N/N**. For example:

    ```
    NAME                                READY   STATUS    RESTARTS   AGE
    native-aggregation-5fb5d5444b-6c8n8   3/3     Running   0          51m
    native-processing-7c487bbdc6-4j6mz    3/3     Running   0          51m
    ```
1. Send the request with the test [Path Traversal][ptrav-attack-docs] attack to your API gateway:

    ```
    curl https://<GATEWAY_IP>/etc/passwd
    ```
1. Verify that the upgraded node operates as expected compared to the previous version.
