# Trafik aynalama için Istio konfigürasyon örneği

Bu makale, Istio'nun [trafiği aynalamak ve Wallarm düğümüne yönlendirmek](overview.md) için gerekli örnek konfigürasyonu sağlar.

## Adım 1: Istio'yu trafik aynalaması için yapılandırın

Istio'nun trafiği aynaması için, `VirtualService`'i istenen yolları İstio için dahili uç noktaya (örn. Kubernetes'te barındırılan) veya `ServiceEntry` ile dış uç noktaya aynalama için yapılandırabilirsiniz:

* Küme içi isteklerin aynalanmasını etkinleştirmek için (ör. podlar arası), `.spec.gateways`'e `mesh` ekleyin.
* Dış isteklerin aynalanmasını etkinleştirmek için (ör. LoadBalancer veya NodePort hizmeti üzerinden), Istio `Gateway` bileşenini yapılandırın ve bileşenin adını `VirtualService`'in `.spec.gateways`'ine ekleyin. Bu seçenek aşağıdaki örnekte sunulmuştur.

```yaml
---
### Aynalanmış trafiğin hedefi için konfigürasyon
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # aynalama hedef adresi
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # aynalama hedef portu
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
    ### istio `Gateway` bileşeninin adı. Dış kaynaklardan gelen trafiği yönetmek için gerekli
    ###
    - httpbin-gateway
    ### Özel etiket, bu sanal hizmet yollarını Kubernetes podlarından (ağ geçitleri aracılığıyla olmayan küme içi iletişim) gelen isteklerle çalışmasını sağlar
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
        host: some.external.service.tld # aynalama hedef adresi
        port:
          number: 8445 # aynalama hedef portu
---
### Dış isteklerin yönetimi için
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

[Istio belgelerini inceleyin](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

## Adım 2: Wallarm düğümünü aynalanmış trafiği filtrelemeye göre yapılandırın

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"
