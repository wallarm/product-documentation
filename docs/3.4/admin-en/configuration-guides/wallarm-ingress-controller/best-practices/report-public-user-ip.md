# Proper Reporting of End User Public IP Address

--8<-- "../include/ingress-controller-best-practices-intro.md"

By default, the Ingress controller assumes that it is directly exposed to the Internet and that the IP addresses of connecting clients are their actual IPs. When passing client requests to upstream services, the controller will automatically add the HTTP request header `X-FORWARDED-FOR`, which contains the IP addresses of connecting clients.

In situations when a controller is placed behind a load balancer (for example, AWS ELB or Google Network Load Balancer) there are two ways for the Ingress controller to report proper end user IP addresses. These ways are provided below.

#### Enable Passing the Real Client IP on the Network Layer

This feature is highly dependent on the cloud platform being used; in majority of cases it can be activated by setting the `values.yaml` file attribute `controller.service.externalTrafficPolicy` to the value `Local` by using the `--set` CLI option:

=== "Ingress controller installation"
    ```bash
    helm install --set controller.service.externalTrafficPolicy=Local <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

    There are also [other parameters](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart) required for correct Ingress controller installation. Please pass them in the `--set` option too.
=== "Updating Ingress controller parameters"
    ```bash
    helm upgrade --reuse-values --set controller.service.externalTrafficPolicy=Local <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
    ```

#### Enable Ingress Controller to Take the Value from the X-FORWARDED-FOR HTTP Request Header

This option is more relevant when a customer is using an external CDN service like Cloudflare or Fastly. To set up:

1. Make sure that the load balancer is passing the real client IP in an HTTP request header with the name `X-FORWARDED-FOR`.
2. Set the `controller.config.use-forwarded-headers` attribute of the Helm chart to `true`:

    === "Ingress controller installation"
        ```bash
        helm install --set controller.config.use-forwarded-headers=true <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```

        There are also [other parameters](../../../configure-kubernetes-en.md#additional-settings-for-helm-chart) required for correct Ingress controller installation. Please pass them in the `--set` option too.
    === "Updating Ingress controller parameters"
        ```bash
        helm upgrade --reuse-values --set controller.config.use-forwarded-headers=true <INGRESS_CONTROLLER_NAME> wallarm/wallarm-ingress -n <KUBERNETES_NAMESPACE>
        ```
