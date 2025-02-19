# Istio Trafik Aynalama Yapılandırması Örneği

Bu makale, Istio'nun [trafiği aynalaması ve Wallarm node'una yönlendirmesi](overview.md) için gerekli örnek yapılandırmayı sağlar.

## Adım 1: Istio'yu Trafiği Aynalamak İçin Yapılandırın

Istio'nun trafiği aynalaması için, aynalama rotalarını dahili uç noktaya (Istio için dahili, örneğin Kubernetes'te barındırılan) ya da `ServiceEntry` ile harici uç noktaya yapılandırmak üzere `VirtualService`'i yapılandırabilirsiniz:

* Küme içi isteklerin aynalanmasını etkinleştirmek için (.spec.gateways'e `mesh` ekleyin).
* Harici isteklerin (örneğin, LoadBalancer veya NodePort servisi üzerinden) aynalanmasını etkinleştirmek için, Istio `Gateway` bileşenini yapılandırın ve `VirtualService`'in `.spec.gateways` kısmına bileşenin adını ekleyin. Bu seçenek aşağıdaki örnekte sunulmaktadır.

```yaml
---
### Aynalanan trafiğin varış noktası yapılandırması
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # aynalama varış adresi
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # aynalama varış portu
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
    ### Istio `Gateway` bileşeninin adı. Harici kaynaklardan gelen trafiğin işlenmesi için gereklidir
    ###
    - httpbin-gateway
    ### Özel etiket, bu sanal servis rotalarının Kubernetes pod'larından gelen (gateway kullanılmadan yapılan) isteklerle çalışmasını sağlar
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
        host: some.external.service.tld # aynalama varış adresi
        port:
          number: 8445 # aynalama varış portu
---
### Harici isteklerin işlenmesi için
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

[Istio dokümantasyonunu inceleyin](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

## Adım 2: Wallarm Node'unu Aynalanan Trafiği Filtreleyecek Şekilde Yapılandırın

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"