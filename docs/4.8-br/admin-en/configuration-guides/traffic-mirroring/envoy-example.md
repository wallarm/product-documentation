# Exemplo de configuração do Envoy para espelhamento de tráfego

Este artigo fornece o exemplo de configuração necessária para o Envoy [espelhar o tráfego e roteá-lo para o nó Wallarm](overview.md).

## Passo 1: Configure o Envoy para espelhar o tráfego

Este exemplo configura o espelhamento de tráfego com o Envoy através do único `listener` ouvindo na porta 80 (sem TLS) e tendo um único `filter`. Os endereços do backend original e do backend adicional recebendo tráfego espelhado são especificados no bloco `clusters`.

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
                    - cluster: wallarm   # <-- link para o cluster que recebe os pedidos espelhados
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
              ### Endereço do ponto de extremidade original. O endereço é o nome do DNS
              ### ou o endereço IP, port_value é o número da porta TCP
              ###
              socket_address:
                address: httpbin # <-- definição do cluster original
                port_value: 80

  ### Definição do cluster que recebe os pedidos espelhados
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
              ### Endereço do ponto de extremidade original. O endereço é o nome do DNS
              ### ou o endereço IP, port_value é o número da porta TCP. A
              ### estrutura de espelhamento Wallarm pode ser implantada com qualquer porta, mas o
              ### valor padrão é TCP/8445.
              ###
              socket_address:
                address: wallarm
                port_value: 8445
```

[Revise a documentação do Envoy](https://www.envoyproxy.io/docs/envoy/latest/api-v3/config/route/v3/route_components.proto)

## Passo 2: Configure o nó Wallarm para filtrar o tráfego espelhado

--8<-- "../include/wallarm-node-configuration-for-mirrored-traffic.md"