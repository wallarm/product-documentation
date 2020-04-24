# Proper Reporting of End-user Public IP Address

--8<-- "../include/ingress-controller-best-practices-intro.md"

By default the Ingress controller assumes that it is directly exposed to the Internet and the IP addresses of connecting clients are their actual IPs. When passing client requests to upstream services the controller will automatically add HTTP request header `X-FORWARDED-FOR` containing the IP address of connecting clients.

In situations when a controller is situated behind a load balancer (for example, AWS ELB or Google Network Load Balancer) there are two ways for the Ingress controller to report proper end-user IP addresses. These ways are provided below.

#### Set up Passing the Real Client IP on the Network Layer

This feature highly depends on the used cloud platform, and in majority of cases it can be activated by setting in the `values.yaml` file attribute `controller.service.externalTrafficPolicy` to value `Local`:

```
controller:
    service:
        externalTrafficPolicy: "Local"
```

#### Enable Ingress Controller to Take the Value from X-FORWARDED-FOR HTTP Request Header

This option is more relevant when a customer is using an external CDN service like Cloudflare or Fastly. To set up:

1. Make sure that the load balancer is passing the real client IP in an HTTP request header, with the name `X-FORWARDED-FOR`.
2. Open the `values.yaml` Helm chart file and set the `controller.config.use-forwarded-headers` attribute to `true`:

```
controller:
    config:
        use-forwarded-headers: "true"
```