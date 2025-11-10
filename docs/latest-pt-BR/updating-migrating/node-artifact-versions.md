# Inventário das versões de artefatos do node

Este documento lista as [versões de patch](versioning-policy.md#version-format) disponíveis do Wallarm node 4.8 em diferentes formatos. Você pode acompanhar os novos lançamentos de versões de patch e planejar atualizações oportunas com base neste documento.

## Instalador all-in-one

O histórico de atualizações se aplica simultaneamente às versões x86_64 e ARM64 do [instalador all-in-one](../installation/nginx/all-in-one.md).

[Como migrar de pacotes DEB/RPM](nginx-modules.md)

[Como migrar da versão anterior do instalador all-in-one](all-in-one.md)

### 4.8.0 (2023-10-19)

* Lançamento inicial 4.8, [veja o changelog](what-is-new.md)

## Pacotes DEB/RPM para NGINX

[Como atualizar](nginx-modules.md)

### 4.8.0 (2023-10-19)

* Lançamento inicial 4.8, [veja o changelog](what-is-new.md)

## Chart Helm para NGINX Ingress controller

[Como atualizar](ingress-controller.md)

### 4.8.2 (2023-10-20)

* Resolvido erros de estatísticas para solicitações em lista de negação conectadas com portas HTTP não padrão (80) a montante

### 4.8.1 (2023-10-19)

* Adicionado suporte para processadores ARM64
* Correção do bug quando o token da API Wallarm não pôde ser aplicado pelo `helm upgrade`
* Correção das seguintes CVEs em golang.org/x/net: [CVE-2023-39325](https://github.com/advisories/GHSA-4374-p667-p6c8), [CVE-2023-3978](https://github.com/advisories/GHSA-2wrh-6pvc-2jm9), [CVE-2023-44487](https://github.com/advisories/GHSA-qppj-fm5r-hxr3)

### 4.8.0 (2023-10-19)

* Lançamento inicial 4.8, [veja o changelog](what-is-new.md)

## Chart Helm para Sidecar

[Como atualizar](sidecar-proxy.md)

### 4.8.0 (2023-10-19)

* Lançamento inicial 4.8, [veja o changelog](what-is-new.md)
* Adicionado suporte para [tokens de API](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) para criar nodes de filtragem e conectá-los à nuvem durante o deployment da solução. Com os tokens de API, você pode controlar o tempo de vida de seus tokens e aprimorar a organização dos nodes na interface do usuário definindo um nome para o grupo de nodes.

    Os nomes do grupo de nodes são definidos usando o parâmetro `config.wallarm.api.nodeGroup` em **values.yaml**, com `defaultSidecarGroup` como o nome padrão. Opcionalmente, você pode controlar os nomes dos grupos de nodes com base nos pods das aplicações usando a anotação `sidecar.wallarm.io/wallarm-node-group`.
* Correção da [CVE-2023-38039](https://github.com/advisories/GHSA-99j9-jf36-9747)

## Imagem Docker baseada em NGINX

[Como atualizar](docker-container.md)

### 4.8.0-1 (2023-10-19)

* Lançamento inicial 4.8, [veja o changelog](what-is-new.md)

## Imagem Docker baseada em Envoy

[Como atualizar](docker-container.md)

### 4.8.0-1 (2023-10-19)

* Lançamento inicial 4.8, [veja o changelog](what-is-new.md)

## Amazon Machine Image (AMI)

[Como atualizar](cloud-image.md)

### 4.8.0-1 (2023-10-19)

* Lançamento inicial 4.8, [veja o changelog](what-is-new.md)

## Imagem do Google Cloud Platform

[Como atualizar](cloud-image.md)

### wallarm-node-4-8-20231019-221905 (2023-10-19)

* Lançamento inicial 4.8, [veja o changelog](what-is-new.md)
