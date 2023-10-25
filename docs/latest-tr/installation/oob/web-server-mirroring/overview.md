# NGINX, Envoy ve Benzerleri Tarafından Aynalanan Trafik İçin Wallarm OOB 

Bu makale, NGINX'inizde, Envoyunuzda veya benzer bir çözümde bir trafik aynası oluşturmayı seçtiyseniz Wallarm'ı [OOB](../overview.md) çözümü olarak nasıl dağıtacağınızı açıklar.

Trafik aynalama, bir web, proxy veya benzer sunucuyu gelen trafiği analiz için Wallarm hizmetlerine kopyalamak üzere yapılandırarak uygulanabilir. Bu yaklaşımla, tipik trafik akışı şu şekildedir:

![OOB şeması](../../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## Dağıtım prosedürü

Wallarm'ı bir trafik aynasını analiz etmek üzere dağıtmak ve yapılandırmak için:

1. Aşağıdaki yöntemlerden birini kullanarak Wallarm düğümünüzü altyapınıza dağıtın:

     * [Terraform modülünü kullanarak AWS'e](../terraform-module/mirroring-by-web-server.md)
     * [Makine İmajını kullanarak AWS'e](aws-ami.md)
     * [Makine İmajını kullanarak GCP'ye](gcp-machine-image.md)

    <!-- * [NGINX tabanlı Docker imajını kullanarak bir konteyner tabanlı ortama](docker-image.md)
     * [DEB/RPM paketlerinden Debian veya Ubuntu işletim sistemi olan bir makineye](packages.md) -->

    !!! bilgi "Aynalanmış trafik analizinin desteği"
        Yalnızca NGINX tabanlı Wallarm düğümleri aynalanmış trafik filtrasyonunu destekler.
1. Wallarm'ı trafiğin bir kopyasını analiz etmek üzere yapılandırın – yukarıdaki talimatlar, gereken adımlarla donatılmıştır.
1. Altyapınızı, gelen trafiğinizin bir kopyasını oluşturup bu kopyayı ek bir arka uç olarak bir Wallarm düğümüne göndermek üzere yapılandırın.

    Yapılandırma detayları için, altyapınızda kullanılan bileşenlerin belgelerine başvurmanızı öneririz. [Aşağıda](#examples-of-web-server-configuration-for-traffic-mirroring), NGINX, Envoy ve benzeri bazı popüler çözümler için yapılandırma örnekleri veririz ancak gerçek yapılandırma, altyapınızın özelliklerine bağlıdır.

## Trafik aynalama için yapılandırma örnekleri

Aşağıda, gelen trafiği Wallarm düğümlerine ek bir arka uç olarak aynalamak üzere NGINX, Envoy, Traefik, Istio'yu nasıl yapılandıracağınıza dair örnekler verilmiştir.

### NGINX

NGINX 1.13 ile başlayarak trafiği ek bir arka uca aynalayabilirsiniz. NGINX'in trafiği aynalaması için:

1. `location` veya `server` bloğunda `mirror` yönergesini ayarlayarak [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) modülünü yapılandırın.

    Aşağıdaki örnek, `location /` adresinde alınan istekleri `location /mirror-test` adresine aynalar.
1. Aynalanan trafiği Wallarm düğümüne göndermek için, aynalanan başlıkları listele ve  `mirror` yönergesinin işaret ettiği `location` bloğunda düğümün bulunduğu makinenin IP adresini belirtin.

```
location / {
        mirror /mirror-test;
        mirror_request_body on;
        root   /usr/share/nginx/html;
        index  index.html index.htm; 
    }
    
location /mirror-test {
        internal;
        #proxy_pass http://111.11.111.1$request_uri;
        proxy_pass http://222.222.222.222$request_uri;
        proxy_set_header X-SERVER-PORT $server_port;
        proxy_set_header X-SERVER-ADDR $server_addr;
        proxy_set_header HOST $http_host;
        proxy_set_header X-Forwarded-For $realip_remote_addr;
        proxy_set_header X-Forwarded-Port $realip_remote_port;
        proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
        proxy_set_header X-Scheme $scheme;
        proxy_set_header X-Request-ID $request_id;
    }
```

[NGINX belgelerini inceleyin](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)

### Envoy

Bu örnek, çift yönlü bir port 80'i (TLS olmadan) dinleyen tek `listener` ve tek `filter` bulunan Envoy ile trafik aynalamasını yapılandırır. Aynalanmış trafiği alan orijinal arka uç ve ek arka uç adresleri `clusters` bloğunda belirtilir.

```yaml
static_resources:
  listeners:
  - address:
      socket_address:
        address: 0.0.0.0
        port_value: 80
    filter_chains:
    - filters:
        - name: envoy.filters.network.http_connection_manager
          typed_config:
            "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
            stat_prefix: ingress_http
            codec_type: AUTO
            route_config:
              name: local_route
              virtual_hosts:
              - name: backend
                domains:
                - "*"
                routes:
                - match:
                    prefix: "/"
                  route:
                    cluster: httpbin     # <-- orijinal küme bağlantısı
                    request_mirror_policies:
                    - cluster: wallarm   # <-- aynalanmış istekleri alan küme bağlantısı
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### Orijinal küme tanımı
  ###
  - name: httpbin
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: httpbin
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              ### Orijinal uç noktanın adresi. Adres DNS adı
              ### veya IP adresi, port_value ise TCP port numarasıdır.
              ###
              socket_address:
                address: httpbin # <-- orijinal küme tanımı
                port_value: 80

  ### Aynalanmış istekleri alan küme tanımı
  ###
  - name: wallarm
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: wallarm
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              ### Orijinal uç noktanın adresi. Adres, DNS adı
              ### veya IP adresi, port_value ise TCP port numarasıdır. Wallarm
              ### ayna şeması herhangi bir portla dağıtılabilir ancak
              ### Terraform modülü için varsayılan değer TCP/8445'tir ve
              ### diğer dağıtım seçenekleri için varsayılan değer 80 olmalıdır.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Envoy belgelerini inceleyin](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

### Istio

Istio'nun trafiği aynalaması için, aynalayan rotaları ya iç uç noktasına (Istio için iç, örneğin Kubernetes'te barındırılan) ya da `ServiceEntry` ile dış uç noktasına aynalamak üzere `VirtualService`'i yapılandırabilirsiniz:

* Kubernetes podları arasındaki isteklerin aynanmasını etkinleştirmek için (örneğin, podlar arası), `mesh`'i `.spec.gateways`'e ekleyin.
* Dış isteklerin aynanmasını etkinleştirmek için (örneğin, LoadBalancer veya NodePort servisi aracılığıyla), Istio `Gateway` bileşenini yapılandırın ve bileşenin adını `VirtualService`'in `.spec.gateways`'ine ekleyin. Bu seçenek aşağıdaki örnekte sunulmuştur.

```yaml
---
### Aynalanacak trafiğin hedefinin yapılandırması
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
    ### Istio `Gateway` bileşeninin adı. Dış kaynaklardan gelen trafiği
    ### işlemek için gereklidir.
    ###
    - httpbin-gateway
    ### Özel etiket, bu sanal servis rotalarının gateway'ler olmayan 
    ### yoluyla Kubernetes podlarından gelen isteklerle çalışmasını 
    ### sağlar (podlar arası iletişim)
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
          number: 8445 # aynalama hedef port
---
### Dış isteklerin işlenmesi için
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

### Traefik

Aşağıdaki yapılandırma örneği, [`dinamik yapılandırma dosyası`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/) yaklaşımına dayanmaktadır. Traefik, diğer yapılandırma modlarını da destekler ve sağladığımız bu örneği, benzer bir yapıya sahip oldukları için herhangi birine kolayca ayarlayabilirsiniz.

```yaml
### Dinamik yapılandırma dosyası
### Not: giriş noktaları statik yapılandırma dosyasında tanımlanır
http:
  services:
    ### Orijinal ve wallarm 'servislerini' eşleştirmek için bu 
    ### şekilde bir harita oluşturun.
    ### Daha sonraki 'routers' yapılandırmasında (aşağıda görün), 
    ### lütfen bu servisin adını kullanın ('with_mirroring').
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### Trafik aynalanacak 'servis' - isteklerin 
    ### aynalandığı (kopyalandığı) noktanın alması gereken 'servis'.
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### Orijinal 'servis'. Bu hizmet orijinal trafiği almalıdır.
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### Router adı, trafiğin aynalanması için 'servis' adıyla aynı 
    ### olmalıdır (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### Orijinal trafiğin yönlendiricisi.
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[Traefik belgelerini inceleyin](https://doc.traefik.io/traefik/routing/services/#mirroring-service)
