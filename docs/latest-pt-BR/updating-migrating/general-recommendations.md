# Recomendações de um processo de atualização seguro do nó

Este documento descreve as recomendações e os riscos associados a um upgrade seguro do nó de filtragem Wallarm até a versão 4.8.

## Recomendações Gerais

* Planeje cuidadosamente e monitore o processo de atualização do nó de filtragem. As datas prováveis de lançamento para novas versões dos nódulos Wallarm são publicadas na [política de versionamento do nó Wallarm](versioning-policy.md).
* Se sua infraestrutura possuir vários nós Wallarm instalados, atualize-os gradualmente. Após a atualização do primeiro nó, monitore a operação dos módulos do nó dentro de um dia e atualize gradualmente os outros nós Wallarm se o primeiro nó operar corretamente.
* Para o modelo com ambientes de desenvolvimento e produção separados, atualize o nó de filtragem gradualmente. Primeiro, aplique e teste a nova versão em ambientes não produtivos, depois em ambientes de produção. Recomendações detalhadas estão descritas nas [instruções para configurar nós Wallarm para ambientes separados](../admin-en/configuration-guides/wallarm-in-separated-environments/configure-wallarm-in-separated-environments.md#gradual-rollout-of-new-wallarm-node-changes).
* Antes de atualizar o nó de filtragem, desative a roteamento do tráfego através do nó usando qualquer método disponível para você (por exemplo, definindo o [modo de filtragem de tráfego](../admin-en/configure-wallarm-mode.md) para `desativado`).
* Uma vez que o módulo do nó de filtragem é atualizado, defina o modo de filtragem do nó para `monitoramento`. Se todos os módulos funcionarem corretamente e não houver um número anormal de novos falsos positivos no modo de `monitoramento` por um dia, então coloque o nó de filtragem no modo `bloqueio`.
* Atualize o NGINX para a versão mais recente disponível antes de aplicar as atualizações do nó Wallarm. Se sua infraestrutura precisa usar uma versão específica do NGINX, por favor, contate o [suporte técnico Wallarm](mailto:support@wallarm.com) para construir o módulo Wallarm para uma versão personalizada do NGINX.

## Possíveis Riscos

A seguir, estão os riscos que podem ocorrer ao atualizar o nó de filtragem. Para reduzir o impacto dos riscos, siga as orientações apropriadas quando atualizar.

### Mudança de Funcionalidade

* [O que há de novo no nó Wallarm 4.8](what-is-new.md)
* [O que há de novo ao atualizar o nó EOL (3.6 ou inferior)](older-versions/what-is-new.md)

### Novos Falsos Positivos

Melhoramos a análise de tráfego a cada nova versão do nó de filtragem. Isso significa que o número de falsos positivos diminui com cada nova versão. No entanto, cada aplicativo protegido tem suas próprias especificidades, por isso recomendamos analisar o trabalho da nova versão do nó de filtragem no modo `monitoramento` antes de habilitar o modo de bloqueio (`bloquear`).

Para analisar o número de novos falsos positivos após a atualização:

1. Implemente a nova versão do nó de filtragem no [modo](../admin-en/configure-wallarm-mode.md) `monitoramento` e envie o tráfego ao nó de filtragem.
2. Depois de algum tempo, abra a seção **Eventos** do Console Wallarm e analise o número de solicitações que são erroneamente reconhecidas como ataques.
3. Se você encontrar um crescimento anormal no número de falsos positivos, entre em contato com o [suporte técnico Wallarm](mailto:support@wallarm.com).

### Aumento na Quantidade de Recursos Usados

O uso de alguns novos recursos do nó de filtragem pode causar alterações na quantidade de recursos utilizados. As informações sobre as alterações na quantidade de recursos utilizados são destacadas na seção [O que há de novo](what-is-new.md).

Além disso, recomenda-se monitorar a operação do nó de filtragem: se você detectar diferenças significativas na quantidade real de recursos usados e na quantidade especificada na documentação, por favor, contate o [suporte técnico Wallarm](mailto:support@wallarm.com).

## Processo de Atualização

O processo de atualização do nó Wallarm depende da plataforma e das formas de instalação. Selecione a forma de instalação e siga as instruções apropriadas:

* [Módulos para NGINX, NGINX Plus](nginx-modules.md)
* [Contêiner Docker com os módulos para NGINX ou Envoy](docker-container.md)
* [Controlador de ingresso NGINX com módulos Wallarm integrados](ingress-controller.md)
* [Sidecar](sidecar-proxy.md)
* [Imagem de nó na nuvem](cloud-image.md)
* [Nó multi-inquilino](multi-tenant.md)
* [Nó CDN](cdn-node.md)
* [Migrando listas de permissão e listas de negação do nó Wallarm 2.18 e inferior para 4.8](migrate-ip-lists-to-node-3.md)