# O que há de novo no Wallarm node 4.8

A nova versão do Wallarm node foi lançada! Ela apresenta o registro de solicitações bloqueadas de fontes na lista negra na seção **Eventos**. Saiba todas as alterações lançadas neste documento.

## Coleta de estatísticas sobre solicitações bloqueadas de fontes da lista negra

A partir da versão 4.8, os nós de filtragem baseados em NGINX do Wallarm agora coletam estatísticas sobre as solicitações que foram bloqueadas quando a sua origem é encontrada na lista negra, aprimorando sua capacidade de avaliar a força do ataque. Isso inclui acesso às estatísticas de solicitações bloqueadas e aos seus exemplos, ajudando a minimizar a atividade despercebida. Você pode encontrar esses dados na seção **Eventos** da interface de usuário do Wallarm Console.

Ao usar o bloqueio automático de IP (por exemplo, com o gatilho de força bruta configurado), agora você pode analisar tanto as solicitações de gatilho inicial quanto os exemplos de solicitações bloqueadas subsequentes. Para solicitações bloqueadas devido à inclusão manual de suas fontes na lista negra, a nova funcionalidade aumenta a visibilidade das ações das fontes bloqueadas.

Nós introduzimos novas [tags de pesquisa e filtros](../user-guides/search-and-filters/use-search.md#search-by-attack-type) dentro da seção **Eventos** para acessar sem esforço os dados recém-introduzidos:

* Use a pesquisa `blocked_source` para identificar as solicitações que foram bloqueadas devido à inclusão manual de endereços IP, sub-redes, países, VPNs e mais na lista negra.
* Use a pesquisa `multiple_payloads` para identificar solicitações bloqueadas pelo gatilho **Número de payloads maliciosos**. Este gatilho é projetado para incluir na lista negra as fontes que originam solicitações maliciosas contendo vários payloads, uma característica comum dos perpetradores de ataques múltiplos.
* Além disso, as tags de pesquisa `api_abuse`, `brute`, `dirbust`e `bola` agora englobam solicitações cujas fontes foram adicionadas automaticamente à lista negra pelos gatilhos Wallarm relevantes para seus respectivos tipos de ataque.

Esta alteração introduz os novos parâmetros de configuração que por padrão são definidos como `on` para habilitar a funcionalidade, mas podem ser alterados para `off` para desabilitá-la:

* A diretiva NGINX [`wallarm_acl_export_enable`](../admin-en/configure-parameters-en.md#wallarm_acl_export_enable).
* O valor [`controller.config.wallarm-acl-export-enable`](../admin-en/configure-kubernetes-en.md#global-controller-settings) para o gráfico do controlador de ingresso NGINX.
* O valor do gráfico [`config.wallarm.aclExportEnable`](../installation/kubernetes/sidecar-proxy/helm-chart-for-wallarm.md#configwallarmaclexportenable) e a anotação do pod [`sidecar.wallarm.io/wallarm-acl-export-enable`](../installation/kubernetes/sidecar-proxy/pod-annotations.md) para a solução Sidecar Controller.

## Wallarm NGINX Ingress Controller para ARM64

Agora suportamos processadores ARM64 com o Wallarm NGINX Ingress Controller. À medida que o ARM64 ganha espaço em soluções de servidor, estamos nos mantendo atualizados para satisfazer as necessidades de nossos clientes. Isso permite uma segurança aprimorada para ambientes de API, cobrindo ambas as arquiteturas x86 e ARM64, fornecendo flexibilidade e proteção.

<!-- Para implantar em máquinas ARM64, siga nossas [instruções](../admin-en/installation-kubernetes-en.md#). -->

## Excluindo URLs e solicitações específicas das verificações de bot

O módulo de prevenção de abuso de API agora é mais flexível. Você pode escolher URLs e solicitações específicas que não devem ser verificadas para ações de bots maliciosos usando a regra [**Definir modo de prevenção de abuso de API**](../api-abuse-prevention/exceptions.md). Isso é útil para evitar falsos positivos e para momentos em que você está testando suas aplicações e precisa desativar as verificações de bot em algumas partes. Por exemplo, se você estiver usando o Klaviyo para marketing, poderá configurar a regra para que ela não verifique as solicitações GET `Klaviyo/1.0`, permitindo que ela funcione sem problemas sem bloqueios desnecessários.

## Verificação da imagem Docker baseada em NGINX com assinatura oficial

A partir da versão 4.8, a Wallarm agora está assinando sua [imagem Docker oficial baseada em NGINX](https://hub.docker.com/r/wallarm/node) com sua chave pública oficial.

Isso significa que agora você pode facilmente [verificar](../integrations-devsecops/verify-docker-image-signature.md) a autenticidade da imagem, aumentando a segurança, protegendo contra imagens comprometidas e ataques à cadeia de suprimentos.

## Estrutura atualizada para a métrica `wallarm_custom_ruleset_id` do Prometheus

A métrica `wallarm_custom_ruleset_id` do Prometheus foi aprimorada com a adição de um atributo `format`. Este novo atributo representa o formato do conjunto de regras personalizadas. Enquanto isso, o valor principal continua a ser a versão de compilação do conjunto de regras personalizadas. Aqui está um exemplo do valor atualizado `wallarm_custom_ruleset_id`:

```
wallarm_custom_ruleset_id{format="51"} 386
```

[Mais detalhes sobre a configuração das métricas do Wallarm node](../admin-en/configure-statistics-service.md)

## Suporte para tokens de API pelo Sidecar Controller

Agora, durante a [implantação do controlador Sidecar](../installation/kubernetes/sidecar-proxy/deployment.md), você pode usar [tokens de API](../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation) para criar nós de filtragem e conectá-los à nuvem durante a implantação da solução. Com tokens de API, você pode controlar o tempo de vida de seus tokens e aprimorar a organização do nó na interface do usuário, definindo um nome de grupo de nós.

Os nomes dos grupos de nós são definidos usando o parâmetro `config.wallarm.api.nodeGroup` em **values.yaml**, com `defaultSidecarGroup` como o nome padrão. Opcionalmente, você pode controlar os nomes dos grupos de nós com base nos pods dos aplicativos usando a anotação `sidecar.wallarm.io/wallarm-node-group`.

## Ao atualizar o nó 3.6 e inferior

Se estiver atualizando a partir da versão 3.6 ou inferior, aprenda todas as mudanças na [lista separada](older-versions/what-is-new.md).

## Quais nós Wallarm são recomendados para serem atualizados?

* Nós Wallarm cliente e multi-inquilino das versões 4.4 e 4.6 para se manter atualizado com as versões do Wallarm e evitar [depreciação do módulo instalado](versioning-policy.md#version-support).
* Nós Wallarm cliente e multi-inquilino das versões [não suportadas](versioning-policy.md#version-list) (4.2 e inferiores). As mudanças disponíveis no Wallarm node 4.8 simplificam a configuração do nó e melhoram a filtragem de tráfego. Por favor, note que algumas configurações do nó 4.8 são **incompatíveis** com os nós de versões anteriores.

## Processo de atualização

1. Revisar [recomendações para a atualização do módulo](general-recommendations.md).
2. Atualize os módulos instalados seguindo as instruções para a sua opção de implantação de nó Wallarm:

      * [Instalador all-in-one](all-in-one.md)
      * [Pacotes individuais para NGINX, NGINX Plus, NGINX Distributive](nginx-modules.md)
      * [Container Docker com os módulos para NGINX ou Envoy](docker-container.md)
      * [NGINX Ingress controller com módulos Wallarm integrados](ingress-controller.md)
      * [Kong Ingress controller com módulos Wallarm integrados](kong-ingress-controller.md)
      * [Sidecar](sidecar-proxy.md)
      * [Imagem de nó em nuvem](cloud-image.md)
      * [Nó CDN](cdn-node.md)
      * [Nó multi-inquilino](multi-tenant.md)

----------

[Outras atualizações nos produtos e componentes do Wallarm →](https://changelog.wallarm.com/)
