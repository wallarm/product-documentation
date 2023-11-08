# Exemplo de configuração Traefik para espelhamento de tráfego

Este artigo fornece o exemplo de configuração necessário para o Traefik [espelhar o tráfego e roteá-lo para o nó Wallarm](overview.md).

## Passo 1: Configurar Traefik para espelhar o tráfego

O seguinte exemplo de configuração é baseado na abordagem de [`arquivo de configuração dinâmica`](https://doc.traefik.io/traefik/reference/dynamic-configuration/file/). O servidor web Traefik também suporta outros modos de configuração, e você pode facilmente ajustar o fornecido para qualquer um deles, pois têm uma estrutura similar.

```yaml
### Arquivo de configuração dinâmica
### Observação: entrypoints são descritos no arquivo de configuração estática
http:
  services:
    ### É assim que se mapeia os `services` originais e wallarm.
    ### Na configuração futura de `routers` (veja abaixo), por favor,
    ### use o nome deste serviço (`with_mirroring`).
    ###
    with_mirroring:
      mirroring:
        service: "httpbin"
        mirrors:
          - name: "wallarm"
            percent: 100

    ### O `service` para espelhar o tráfego - o endpoint
    ### que deve receber as requisições espelhadas (copiadas)
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
    ### O nome do roteador deve ser o mesmo que o nome do `service`
    ### para que o espelhamento de tráfego funcione (with_mirroring).
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

[Reveja a documentação Traefik](https://doc.traefik.io/traefik/routing/services/#mirroring-service)

## Passo 2: Configurar o nó Wallarm para filtrar o tráfego espelhado

--8<-- "../include-pt-BR/wallarm-node-configuration-for-mirrored-traffic.md"