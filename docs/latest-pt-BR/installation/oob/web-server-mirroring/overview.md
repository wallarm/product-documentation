# Wallarm OOB para Tráfego Espelhado por NGINX, Envoy e Similares

Este artigo explica como implantar o Wallarm como a solução de [OOB](../overview.md) se você optar por produzir um espelho de tráfego com o seu NGINX, Envoy ou solução semelhante.

O espelhamento de tráfego pode ser implementado configurando um servidor web, proxy ou semelhante para copiar o tráfego de entrada para os serviços Wallarm para análise. Com essa abordagem, o fluxo de tráfego típico se parece com o seguinte:

![Esquema OOB](../../../images/waf-installation/oob/wallarm-oob-deployment-scheme.png)

## Procedimento de implantação

Para implantar e configurar o Wallarm para analisar um espelho de tráfego, você precisa:

1. Implantar o nó Wallarm na sua infraestrutura por um dos seguintes métodos:

    * [Para AWS usando a Imagem de Máquina](aws-ami.md)
    * [Para GCP usando a Imagem de Máquina](gcp-machine-image.md)

    <!-- * [Para um ambiente baseado em container usando a imagem Docker baseada em NGINX](docker-image.md)
    * [Em uma máquina com um sistema operacional Debian ou Ubuntu a partir de pacotes DEB/RPM](packages.md) -->

    !!! info "Suporte para análise de tráfego espelhado"
        Apenas os nós Wallarm baseados em NGINX suportam a filtragem de tráfego espelhado.
1. Configure o Wallarm para analisar a cópia do tráfego - as instruções acima estão equipadas com as etapas necessárias.
1. Configure sua infraestrutura para produzir uma cópia do seu tráfego de entrada e enviar a cópia para um nó Wallarm como para um back-end adicional.

    Para detalhes da configuração, recomendamos que você consulte a documentação dos componentes que estão sendo usados em sua infraestrutura. [Abaixo](#exemplos-de-configuração-do-servidor-web-para-espelhamento-de-tráfego) damos exemplos de configuração para algumas soluções populares como NGINX, Envoy e similares, mas a configuração real depende das peculiaridades da sua infraestrutura.

## Exemplos de configuração para espelhamento de tráfego

Aqui estão os exemplos de como configurar o NGINX, Envoy, Traefik, Istio para espelhar o tráfego de entrada para os nós Wallarm como para um back-end adicional.

### NGINX

A partir do NGINX 1.13, você pode espelhar o tráfego para um back-end adicional. Para que o NGINX espelhe o tráfego:

1. Configure o módulo [`ngx_http_mirror_module`](http://nginx.org/en/docs/http/ngx_http_mirror_module.html) configurando a diretiva `mirror` no bloco `location` ou `server`.

     O exemplo abaixo irá espelhar as solicitações recebidas em `location /` para `location /mirror-test`.
1. Para enviar o tráfego espelhado para o nó Wallarm, liste os cabeçalhos para serem espelhados e especifique o endereço IP da máquina com o nó na `location` que a diretiva `mirror` aponta.

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

[Revise a documentação do NGINX](http://nginx.org/en/docs/http/ngx_http_mirror_module.html)

### Envoy

Este exemplo configura o espelhamento de tráfego com o Envoy por meio do único `listener` escutando a porta 80 (sem TLS) e tendo um único `filter`. Os endereços de um back-end original e back-end adicional recebendo tráfego espelhado são especificados no bloco `clusters`.

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
                    cluster: httpbin     # <-- link para o cluster original
                    request_mirror_policies:
                    - cluster: wallarm   # <-- link para o cluster que recebe as solicitações espelhadas
                      runtime_fraction:
                        default_value:
                          numerator: 100
            http_filters:
            - name: envoy.filters.http.router
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
  ### Definição do cluster original
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
              ### Endereço do ponto de extremidade original. O endereço é o nome de DNS
              ### ou endereço IP, port_value é o número da porta TCP
              ###
              socket_address:
                address: httpbin # <-- definição do cluster original
                port_value: 80

  ### Definição do cluster que recebe as solicitações espelhadas
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
              ### Endereço do ponto de extremidade original. O endereço é o nome de DNS
              ### ou endereço IP, port_value é o número da porta TCP. O esquema de espelho Wallarm
              ### pode ser implantado com qualquer porta, mas o
              ### valor padrão é TCP/8445 para o módulo Terraform, e
              ### o valor padrão para outras opções de implantação deve ser 80.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Revise a documentação do Envoy](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

### Istio

Para que o Istio espelhe o tráfego, você pode configurar o `VirtualService` para espelhar rotas para o ponto de extremidade interno (interno para o Istio, por exemplo, hospedado no Kubernetes) ou para o ponto de extremidade externo com `ServiceEntry`:

* Para habilitar o espelhamento de solicitações internas do cluster (por exemplo, entre pods), adicione `mesh` a `.spec.gateways`.
* Para habilitar o espelhamento de solicitações externas (por exemplo, via serviço LoadBalancer ou NodePort), configure o componente `Gateway` do Istio e adicione o nome do componente a `.spec.gateways` de `VirtualService`. Esta opção está apresentada no exemplo abaixo.

```yaml
---
### Configuração de destino para tráfego espelhado
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # endereço de destino do espelhamento
  location: MESH_EXTERNAL
  ports:
    - number: 8445 # porta de destino do espelhamento
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
    ### Nome do componente `Gateway` do istio. Necessário para lidar com o tráfego proveniente de
    ### fontes externas
    ###
    - httpbin-gateway
    ### Etiqueta especial, permite que as rotas deste serviço virtual funcionem com solicitações
    ### de pods do Kubernetes (comunicação interna ao cluster, não através de gateways)
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
        host: some.external.service.tld # endereço de destino do espelhamento
        port:
          number: 8445 # porta de destino do espelhamento
---
### Para lidar com solicitações externas
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

[Revise a documentação do Istio](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

### Traefik

O seguinte exemplo de configuração é baseado na abordagem do [‘arquivo de configuração dinâmica’](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/). O Traefik também suporta outros modos de configuração, e você pode facilmente ajustar o fornecido para qualquer um deles, pois eles têm uma estrutura semelhante.

```yaml
### Arquivo de configuração dinâmica
### Nota: os pontos de entrada são descritos no arquivo de configuração estática
http:
  services:
    ### É assim que se mapeia os `services` original e o wallarm.
    ### Nas futuras configurações dos `routers` (veja abaixo), por favor
    ### use o nome deste serviço (`with_mirroring`).
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### O `service` para espelhar o tráfego - o ponto final 
    ### que deve receber as solicitações espelhadas (copiadas)
    ### do `service` original.
    ###
    wallarm:
      loadBalancer:
        servers:
          - url: "http://wallarm:8445"

    ### `Service` original. Este serviço deve receber o
    ### tráfego original.
    ###
    httpbin:
      loadBalancer:
        servers:
          - url: "http://httpbin:80/"

  routers:
    ### O nome do router deve ser o mesmo que o nome do `service`
    ### para o espelhamento de tráfego funcionar (with_mirroring).
    ###
    with_mirroring:
      entryPoints:
        - "web"
      rule: "Host(`mirrored.example.com`)"
      service: "with_mirroring"

    ### O roteador para o tráfego original.
    ###
    just_to_original:
      entryPoints:
        - "web"
      rule: "Host(`original.example.local`)"
      service: "httpbin"
```

[Revise a documentação do Traefik](https://doc.traefik.io/traefik/routing/services/#mirroring-service)
