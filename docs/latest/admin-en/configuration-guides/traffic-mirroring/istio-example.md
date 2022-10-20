# Example of Istio configuration for traffic mirroring

This article provides the example configuration required for Istio to [mirror the traffic and route it to the Wallarm node](overview.md).

For Istio to mirror the traffic, you can configure `VirtualService` for mirroring routes either to the internal endpoint (internal for Istio, e.g. hosted in Kubernetes) or to the external endpoint with `ServiceEntry`:

* To enable mirroring of in-cluster requests (e.g. between pods), add `mesh` to `.spec.gateways`.
* To enable mirroring of external requests (e.g. via LoadBalancer or NodePort service), configure the Istio `Gateway` component and add the name of the component to `.spec.gateways` of `VirtualService`. This option is presented in the example below.

```yaml
---
### Configuration of destination for mirrored traffic
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # mirroring destination address
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # mirroring destination port
      name: http
      protocol: HTTP
  resolution: DNS
---
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: httpbin
spec:
  hosts:
    - ...
  gateways:
    ### Name of istio `Gateway` component. Required for handling traffic from
    ### external sources
    ###
    - httpbin-gateway
    ### Special label, enables this virtual service routes to work with requests
    ### from Kubernetes pods (in-cluster communication not via gateways)
    ###
    - mesh
  http:
    - route:
        - destination:
            host: httpbin
            port:
              number: 80
          weight: 100
      mirror:
        host: some.external.service.tld # mirroring destination address
        port:
          number: 8445 # mirroring destination port
---
### For handling external requests
###
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: httpbin-gateway
spec:
  selector:
    istio: ingress
    app: istio-ingress
  servers:
  - port:
      number: 80
      name: http
      protocol: HTTP
    hosts:
    - "httpbin.local"
```

[Review the Istio documentation](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)
