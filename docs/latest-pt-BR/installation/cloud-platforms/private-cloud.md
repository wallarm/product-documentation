[ip-lists-docs]:                    ../../user-guides/ip-lists/overview.md

# Implementando Wallarm em Nuvens Privadas

As nuvens privadas são ambientes de nuvem implementados exclusivamente para uma única organização ou entidade, proporcionando uso e controle exclusivos sobre os recursos. Este artigo fornece uma visão geral dos princípios de implantação do nó Wallarm nas nuvens privadas.

## Passo 1: Entenda seu escopo e abordagem para implantação do Wallarm

Antes de implantar o Wallarm na sua nuvem privada, é fundamental entender o escopo do seu cenário de aplicação e determinar a abordagem mais adequada para a implantação do Wallarm. Considere as seguintes características durante essa avaliação:

* Avaliação de um escopo para garantir a segurança: avalie o seu cenário de aplicação e identifique as aplicações críticas que requerem proteção. Considere fatores como a sensibilidade dos dados, o impacto potencial de violações e os requisitos de conformidade. Essa avaliação ajuda você a priorizar e concentrar seus esforços na proteção dos ativos mais importantes na sua nuvem privada.
* [Análise in-line](../inline/overview.md) vs. [análise out-of-band (OOB)](../oob/overview.md): determine se você deseja implantar o Wallarm para análise in-line ou análise de tráfego out-of-band. Análise in-line envolve a implantação de nós Wallarm no caminho de tráfego de suas aplicações, enquanto a análise OOB envolve a captura e análise de tráfego espelhado.
* Posicionamento dos nós Wallarm: Com base na sua abordagem escolhida (análise in-line ou análise OOB), determine o posicionamento apropriado dos nós Wallarm dentro da infraestrutura da sua nuvem privada. Para análise in-line, considere posicionar os nós Wallarm perto de suas aplicações, como dentro da mesma VLAN ou sub-rede. Para análise OOB, certifique-se de que o tráfego espelhado será devidamente encaminhado para os nós Wallarm para análise.

## Passo 2: Permitir conexões de saída para Wallarm

Em nuvens privadas, geralmente existem restrições sobre as conexões de saída. Para garantir que Wallarm funcione corretamente, é necessário habilitar as conexões de saída, permitindo que ele baixe pacotes durante a instalação, estabeleça conectividade de rede entre as instâncias locais do nó e Wallarm Cloud, e operacionalize totalmente os recursos do Wallarm.

O acesso nas nuvens privadas é normalmente concedido com base em endereços IP. Wallarm requer acesso aos seguintes registros DNS:

* `35.235.66.155` para acessar a Wallarm Cloud dos EUA (`us1.api.wallarm.com`) e obter regras de segurança, fazer upload de dados de ataque, etc.
* `34.90.110.226` para acessar a Wallarm Cloud da UE (`api.wallarm.com`) e obter regras de segurança, fazer upload de dados de ataque, etc.
* Endereços IP usados pelo Docker Hub se você escolher executar Wallarm a partir de uma imagem Docker.
* `34.111.12.147` (`repo.wallarm.com`) se você escolher instalar o nó Wallarm a partir de pacotes Linux individuais para [NGINX estável](../nginx/dynamic-module.md)/[NGINX Plus](../nginx-plus.md)/[NGINX fornecido pela distribuição](../nginx/dynamic-module-from-distr.md). Pacotes para instalação do nó são baixados deste endereço.
* `35.244.197.238` (`https://meganode.wallarm.com`) se você escolher instalar o Wallarm a partir do [instalador all-in-one] (../nginx/all-in-one.md). O instalador é baixado deste endereço.
* Access to the IP addresses below for downloading updates to attack detection rules, as well as retrieving precise IPs for your allowlisted, denylisted, or graylisted countries, regions, or data centers

    === "US Cloud"
        ```
        34.96.64.17
        34.110.183.149
        35.235.66.155
        ```
    === "EU Cloud"
        ```
        34.160.38.183
        34.144.227.90
        34.90.110.226
        ```

## Passo 3: Escolha o modelo de implantação e o artefato Wallarm

Wallarm oferece modelos de implantação flexíveis, permitindo que as organizações selecionem a opção mais adequada para o ambiente de nuvem privada. Dois modelos de implantação comuns são **implantação de aparelho virtual** e **implantação Kubernetes**.

### Implantação de aparelho virtual

Neste modelo, você implementa Wallarm como um aparelho virtual dentro da infraestrutura da sua nuvem privada. O aparelho virtual pode ser instalado como uma VM ou contêiner. Você pode escolher implementar o nó Wallarm usando um dos seguintes artefatos:

* Imagens Docker:
    * [Imagem Docker baseada em NGINX](../../admin-en/installation-docker-en.md)
    * [Imagem Docker baseada em Envoy](../../admin-en/installation-guides/envoy/envoy-docker.md)
* Pacotes Linux:
    * [Pacotes Linux individuais para NGINX estável](../nginx/dynamic-module.md)
    * [Pacotes Linux individuais para NGINX Plus](../nginx-plus.md)
    * [Pacotes Linux individuais para NGINX fornecido pela distribuição](../nginx/dynamic-module-from-distr.md)
    * [Instalador All‑in‑One para Linux](../nginx/all-in-one.md)

### Implantação Kubernetes

Se a sua nuvem privada utiliza Kubernetes para orquestração de contêineres, Wallarm pode ser implementado como uma solução nativa do Kubernetes. Ele se integra perfeitamente com os clusters Kubernetes, aproveitando recursos como controladores de entrada, contêineres auxiliares ou recursos personalizados do Kubernetes. Você pode escolher implementar o Wallarm usando uma das seguintes soluções:

* [NGINX baseado no controlador Ingress](../../admin-en/installation-kubernetes-en.md)
* [Controlador Ingress baseado em Kong](../kubernetes/kong-ingress-controller/deployment.md)
* [Controlador Sidecar](../kubernetes/sidecar-proxy/deployment.md)