# Management of IP addresses blocking

--8<-- "../include/ingress-controller-best-practices-intro.md"

After enabling the [IP blocking functionality](../../../configure-ip-blocking-en.md) Wallarm will provide the following additional features:

* If Wallarm detects at least three different attack vectors from an IP address the address is automatically added to the denylist and blocked for 1 hour. If a similar behavior from the same IP address is detected again the IP is blocked for 2 hours, etc.
* Ability to [manage the denylist of IPs](../../../../user-guides/denylist.md) from your Wallarm account UI.
* Ability to use Wallarm to protect against behavior‑based attacks such as [brute-force](../../../../attacks-vulns-list.md#brute-force-attack), [path traversal attacks](../../../../attacks-vulns-list.md#path-traversal) or [forced browsing](../../../../attacks-vulns-list.md#forced-browsing).

To enable the IP blocking functionality in the Ingress controller, please follow the instructions below:
1. Upgrade Wallarm Ingress controller Helm chart to version 1.7.0 or later from the [GitHub](https://github.com/wallarm/ingress-chart) repository (including the `values.yaml` file).
2. Open the `ingress-chart/wallarm-ingress/values.yaml` file of the updated Helm chart version and set the `controller.wallarm.acl.enabled` attribute to `true`:
    ```
    controller:
      wallarm:
        acl:
          enabled: true
    ```
3. Apply updates to an existing Wallarm Ingress controller using the following command:
    ```
    helm upgrade INGRESS_CONTROLLER_NAME VALUES_YAML_FOLDER --reuse-values
    ```
    * `INGRESS_CONTROLLER_NAME` is the name of an existing Wallarm Ingress controller,
    * `VALUES_YAML_FOLDER` is the path to the folder with the updated `values.yaml` file.

    Synchronization of IP blocking denylist data between the Ingress controller and Wallarm cloud is enabled.
4. Enable the IP blocking functionality for your Ingress using the following command:
    ```
    kubectl annotate ingress YOUR_INGRESS_NAME nginx.ingress.kubernetes.io/wallarm-acl=on
    ```
    * `YOUR_INGRESS_NAME` is the name of your Ingress.

To disable this functionality, please use the same command with the `off` value:
```
kubectl annotate ingress YOUR_INGRESS_NAME nginx.ingress.kubernetes.io/wallarm-acl=off
```
