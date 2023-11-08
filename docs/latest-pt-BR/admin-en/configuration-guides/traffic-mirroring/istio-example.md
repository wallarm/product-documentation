# Exemplo de configuração do Istio para espelhamento de tráfego

Este artigo fornece o exemplo de configuração necessário para o Istio [espelhar o tráfego e encaminhá-lo para o nó Wallarm](overview.md).

## Passo 1: Configurar o Istio para espelhar o tráfego

Para que o Istio espelhe o tráfego, você pode configurar o `VirtualService` para espelhar rotas direcionadas para o endpoint interno (interno para o Istio, por exemplo, hospedado no Kubernetes) ou para o endpoint externo com `ServiceEntry`:

* Para habilitar o espelhamento de solicitações dentro do cluster (por exemplo, entre pods), adicione `mesh` a `.spec.gateways`.
* Para habilitar o espelhamento de solicitações externas (por exemplo, por meio do serviço LoadBalancer ou NodePort), configure o componente `Gateway` do Istio e adicione o nome do componente a `.spec.gateways` de `VirtualService`. Esta opção é apresentada no exemplo abaixo.


```yaml
---
### Configuracao do destino para o trafego espelhado
###
apiVersion: networking.istio.io/v1beta1
kind: ServiceEntry
metadata:
  name: wallarm-external-svc
spec:
  hosts:
    - some.external.service.tld # endereco de destino do espelhamento
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
    ### Nome do componente `Gateway` do Istio. Necessario para lidar com trafego de
    ### fontes externas
    ###
    - httpbin-gateway
    ### Etiqueta especial, permite que as rotas deste serviço virtual trabalhem com solicitações
    ### dos pods do Kubernetes (comunicacao dentro do cluster nao via gateways)
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
        host: some.external.service.tld # endereco de destino do espelhamento
        port:
          number: 8445 #  porta de destino do espelhamento
---
### Para lidar com solicitacoes externas
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
[Verifique a documentação do Istio](https://istio.io/latest/docs/tasks/traffic-management/mirroring/)

## Passo 2: Configurar o nó Wallarm para filtrar o tráfego espelhado

--8<-- "../include-pt-BR/wallarm-node-configuration-for-mirrored-traffic.md"
