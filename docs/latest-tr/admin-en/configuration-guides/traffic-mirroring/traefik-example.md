# Traefik'in trafik aynalandırma için yapılandırma örneği

Bu makale, Traefik'in trafiği aynalandırıp Wallarm düğümüne yönlendirmesi için gereken örnek yapılandırmayı sağlar [trafik aynasını ve Wallarm düğümüne yönlendirir](overview.md).

## Adım 1: Traefik'i trafik aynalandırma için yapılandırın

Aşağıdaki yapılandırma örneği, [`dinamik yapılandırma dosyası`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/) yaklaşımına dayanmaktadır. Traefik web sunucusu diğer yapılandırma modlarını da destekler ve benzer bir yapıya sahip olduklarından sağlananı herhangi birine kolayca ayarlayabilirsiniz.

```yaml
### Dinamik yapılandırma dosyası
### Not: giriş noktaları statik yapılandırma dosyasında anlatılmıştır
http:
  hizmetler:
    ### Bu, orijinal ve wallarm `hizmetleri`nin nasıl eşlendiğini gösterir.
    ### Daha sonraki `yönlendirici` yapılandırmasında (aşağıya bakın),
    ### lütfen bu hizmetin adını (`with_mirroring`) kullanın.
    ###
    with_mirroring:
      aynalandırma:
        hizmet: "httpbin"
        mirrors:
          - name: "wallarm"
            yüzde: 100

    ### Aynalandırma hızmeti - bu hizmet yönlendirilen (kopyalanan)
    ### aynalandırma taleplerini almalıdır.
    ###
    wallarm:
      yükdengeçirici:
        servers:
          - url: "http://wallarm:8445"

    ### Orijinal `hizmet`. Bu hizmet orijinal trafiği almalıdır.
    ###
    httpbin:
      yükdengeçirici:
        servers:
          - url: "http://httpbin:80/"

  yönlendiriciler:
    ### Yönlendiricinin adı, aynalandırma işleminin işlemesi için 
    ### `hizmet` adıyla aynı olmalıdır (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      hizmet: "with_mirroring"

    ### Orijinal trafiği taşıyan yönlendirici.
    ###
    just_to_original:
      girişNoktaları:
        - "web"
      Kural: "Host(`original.example.local`)"
      hizmet: "httpbin"
```

[Traefik belgelendirmesini inceleyin](https://doc.traefik.io/traefik/routing/services/#mirroring-service)

## Adım 2: Wallarm düğümünü aynalanmış trafiği filtrelemek için yapılandırın

--8<-- "../include-tr/wallarm-node-configuration-for-mirrored-traffic.md"
