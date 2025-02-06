# Trafik Yansıtma için Traefik Yapılandırması Örneği

Bu makale, Traefik'in [trafiği yansıtması ve Wallarm node'una yönlendirmesi](overview.md) için gerekli örnek yapılandırmayı sunar.

## Adım 1: Traefik'i Trafiği Yansıtacak Şekilde Yapılandırın

Aşağıdaki yapılandırma örneği, [`dynamic configuration file`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/) yaklaşımına dayanmaktadır. Traefik web sunucusu diğer yapılandırma modlarını da destekler; sağlanan yapılandırmayı, benzer yapıya sahip olan herhangi bir moda kolayca uyarlayabilirsiniz.

```yaml
### Dinamik yapılandırma dosyası
### Not: entrypoints statik yapılandırma dosyasında tanımlanmıştır
http:
  services:
    ### Bu, orijinal ve wallarm `services`'in nasıl eşleneceğini gösterir.
    ### İlerleyen `routers` yapılandırmasında (aşağıya bakınız), lütfen 
    ### bu servisin adını (`with_mirroring`) kullanın.
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### Trafiğin yansıtılacağı `service` - orijinal `service`'den
    ### yansıtılan (kopyalanan) istekleri alması gereken uç nokta.
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### Orijinal `service`. Bu servis orijinal trafiği almalıdır.
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### Trafik yansıtmanın çalışabilmesi için yönlendirici adı,
    ### `service` adıyla aynı olmalıdır (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### Orijinal trafik için yönlendirici.
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[Traefik belgelerini inceleyin](https://doc.traefik.io/traefik/routing/services/#mirroring-service)

## Adım 2: Yansıtılan Trafiği Filtrelemek İçin Wallarm Node'unu Yapılandırın

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"