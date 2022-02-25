# Proper Reporting of End User Public IP Address

These instructions describe the Wallarm Ingress controller configuration required to identify an originating IP address of a client (end user) when a controller is placed behind a load balancer.

By default, the Ingress controller assumes that it is directly exposed to the Internet and that the IP addresses of connecting clients are their actual IPs. However, the requests can be passed through the load balancer (e.g. AWS ELB or Google Network Load Balancer) before being sent to the Ingress controller.

In situations when a controller is placed behind a load balancer the Ingress controller considers the load balancer IP to be a real end user IP that can lead to [incorrect operation of some Wallarm features](../../../using-proxy-or-balancer-en.md#possible-problems-of-using-a-proxy-server-or-load-balancer-ip-address-as-a-request-source-address). To report proper end user IP addresses to the Ingress controller, please configure the controller as described below.

## Step 1: Enable passing the real client IP on the network layer

This feature is highly dependent on the cloud platform being used; in the majority of cases, it can be activated by setting the `values.yaml` file attribute `controller.service.externalTrafficPolicy` to the value `Local`:

```
controller:
  service:
    externalTrafficPolicy: "Local"
```

## Step 2: Enable Ingress controller to take the value from the X-FORWARDED-FOR HTTP request header

Usually, the load balancers append the HTTP header [`X-Forwarded-For`](https://en.wikipedia.org/wiki/X-Forwarded-For) containing an original client IP address. You can find an exact header name in the load balancer documentation.

Wallarm Ingress controller can take the real end user IP address from this header if the controller `values.yaml` is configured as follows:

```
controller:
  config:
    enable-real-ip: "true"
    forwarded-for-header: "X-Forwarded-For"
```

* [Documentation on the `enable-real-ip` parameter](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#enable-real-ip)
* In the [`forwarded-for-header`](https://kubernetes.github.io/ingress-nginx/user-guide/nginx-configuration/configmap/#forwarded-for-header) parameter, please specify the load balancer header name containing an original client IP address

--8<-- "../include/ingress-controller-best-practices-intro.md"
