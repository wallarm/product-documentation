# NGINX, Envoy ve Benzeri Tarafından Yansıtılan Trafik için Wallarm OOB

Bu makale, NGINX, Envoy veya benzeri çözümünüz tarafından üretilen bir trafik aynası kullanmayı tercih ederseniz Wallarm'ı [OOB](../overview.md) çözümü olarak nasıl dağıtacağınızı açıklar.

Trafik yansıtması, gelen trafiği analiz için Wallarm hizmetlerine kopyalamak üzere bir web, proxy veya benzeri sunucuyu yapılandırarak uygulanabilir. Bu yaklaşımla, tipik trafik akışı aşağıdaki gibidir:

![OOB scheme](../../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## Dağıtım Prosedürü

Wallarm'ı, bir trafik aynasını analiz etmek üzere dağıtıp yapılandırmak için şunları yapmanız gerekir:

1. Aşağıdaki yöntemlerden biriyle Wallarm düğümünü altyapınıza dağıtın:

    * [all-in-one yükleyicisi ile Linux işletim sistemine sahip bir makinede](linux/all-in-one.md)
    * [Terraform modülü kullanarak AWS'ye](../terraform-module/mirroring-by-web-server.md)
    * [Machine Image kullanarak AWS'ye](aws-ami.md)
    * [Machine Image kullanarak GCP'ye](gcp-machine-image.md)
    * [NGINX tabanlı Docker imajı kullanarak konteyner tabanlı bir ortama](docker-image.md)

    !!! info "Yansıtılan Trafik Analiz Desteği"
        Yalnızca NGINX tabanlı Wallarm düğümleri yansıtılan trafiğin filtrelenmesini destekler.
2. Trafik kopyasını analiz etmesi için Wallarm'ı yapılandırın – yukarıdaki talimatlar gerekli adımları içermektedir.
3. Altyapınızı, gelen trafiğin bir kopyasını oluşturacak ve bu kopyayı ek bir backend olarak bir Wallarm düğümüne gönderecek şekilde yapılandırın.

    Yapılandırma detayları için, altyapınızda kullanılan bileşenlerin belgelerine başvurmanızı öneririz. [Aşağıda](#configuration-examples-for-traffic-mirroring) NGINX, Envoy ve benzeri bazı popüler çözümler için yapılandırma örnekleri veriyoruz ancak gerçek yapılandırma, altyapınızın özelliklerine bağlıdır.

## Trafik Yansıtması için Yapılandırma Örnekleri

Aşağıda, gelen trafiği ek bir backend olarak Wallarm düğümlerine yansıtmak için NGINX, Envoy, Traefik, Istio'nun nasıl yapılandırılacağına dair örnekler bulunmaktadır.

### NGINX

NGINX 1.13'ten itibaren, trafiği ek bir backend'e yansıtabilirsiniz. NGINX'in trafiği yansıtması için:

1. `location` veya `server` bloğunda `mirror` yönergesini ayarlayarak [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) modülünü yapılandırın.

    Aşağıdaki örnek, `location /`'da alınan istekleri `location /mirror-test`e yansıtacaktır.
2. Yansıtılan trafiği Wallarm düğümüne göndermek için, yansıtılacak başlıkları listeleyin ve `mirror` yönergesinin işaret ettiği `location` içinde düğümün bulunduğu makinenin IP adresini belirtin.

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

Bu örnek, TLS olmadan 80 numaralı portta dinleyen tek `listener` ve tek `filter` kullanarak Envoy ile trafik yansıtmasını yapılandırır. Orijinal backend ve yansıtılan trafiği alan ek backend'in adresleri `clusters` bloğunda belirtilmiştir.

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
                    cluster: httpbin     # <-- link to the original cluster
                    request_mirror_policies:
                    - cluster: wallarm   # <-- link to the cluster receiving mirrored requests
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### Definition of original cluster
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
              ### Address of the original endpoint. Address is DNS name
              ### or IP address, port_value is TCP port number
              ###
              socket_address:
                address: httpbin # <-- definition of the original cluster
                port_value: 80

  ### Definition of the cluster receiving mirrored requests
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
              ### Address of the original endpoint. Address is DNS name
              ### or IP address, port_value is TCP port number. Wallarm
              ### mirror schema can be deployed with any port but the
              ### default value is TCP/8445 for Terraform module, and
              ### the default value for other deployment options should be 80.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Envoy belgelerini inceleyin](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

### Istio

Istio'nun trafiği yansıtması için, yansıtma yollarını hem dahili uç noktaya (Istio için dahili, örneğin Kubernetes'te barındırılan) ya da `ServiceEntry` kullanarak harici uç noktaya yapılandırmak üzere `VirtualService` ayarlayabilirsiniz:

* Kümeler arası (örn. pod'lar arası) isteklerin yansıtılmasını etkinleştirmek için `.spec.gateways`'e `mesh` ekleyin.
* Harici isteklerin (örn. LoadBalancer veya NodePort servisi aracılığıyla) yansıtılmasını etkinleştirmek için Istio `Gateway` bileşenini yapılandırın ve bileşenin adını `VirtualService`'in `.spec.gateways` kısmına ekleyin. Bu seçenek aşağıdaki örnekte sunulmuştur.

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

[Istio belgelerini inceleyin](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

### Traefik

Aşağıdaki yapılandırma örneği, [`dynamic configuration file`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/) yaklaşımına dayanmaktadır. Traefik ayrıca diğer yapılandırma modlarını da destekler ve sağlanan yapılandırmayı benzer yapıya sahip herhangi birine kolayca uyarlayabilirsiniz.

```yaml
### Dynamic configuration file
### Note: entrypoints are described in static configuration file
http:
  services:
    ### This is how to map original and wallarm `services`.
    ### In further `routers` configuration (see below), please 
    ### use the name of this service (`with_mirroring`).
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### The `service` to mirror traffic to - the endpoint
    ### that should receive the requests mirrored (copied)
    ### from the original `service`.
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### Original `service`. This service should receive the
    ### original traffic.
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### The router name must be the same as the `service` name
    ### for the traffic mirroring to work (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### The router for the original traffic.
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[Traefik belgelerini inceleyin](https://doc.traefik.io/traefik/routing/services/#mirroring-service)