# Migrando listas de permissão e negação do Wallarm node 2.18 e inferiores para 4.8

A partir do Wallarm node 3.x, o método de configuração das listas de permissão e negação do endereço IP foi alterado. Este documento instrui como migrar as listas de permissão e negação configuradas no Wallarm node 2.18 ou inferior para o Wallarm node mais recente.

## O que mudou?

A configuração das listas de permissão e negação do endereço IP mudou da seguinte forma:

* As diretivas `wallarm_acl_*` do NGINX, parâmetros `acl` do Envoy e variáveis de ambiente `WALLARM_ACL_*` foram depreciadas. Agora, as listas IP são configuradas da seguinte maneira:

    * Passos adicionais para habilitar a funcionalidade de permissão ou negação por IP não são necessários. O Wallarm node baixa as listas de endereços IP do Wallarm Cloud por padrão e aplica os dados baixados ao processar as requisições recebidas.
    * A página de bloqueio e o código de erro retornados na resposta à solicitação bloqueada são configurados usando a diretiva [`wallarm_block_page`](../admin-en/configure-parameters-en.md#wallarm_block_page) em vez de `wallarm_acl_block_page`.
* Os endereços IP na lista de permissão e negação são gerenciados através do Console Wallarm.
* Os endereços IP do [Scanner de Vulnerabilidades Wallarm](../about-wallarm/detecting-vulnerabilities.md#vulnerability-scanner) estão na lista de permissão por padrão. Não é mais necessário permitir manualmente os endereços IP do Scanner.

## Procedimento para migração de configuração de lista de permissão e negação

1. Informe o [suporte técnico da Wallarm](mailto:support@wallarm.com) que você está atualizando os módulos do nó de filtragem para a versão mais recente e peça para habilitar a nova lógica de listas IP para sua conta Wallarm.

    Quando a nova lógica de listas IP estiver habilitada, abra o Console Wallarm e verifique se a seção [**Listas IP**](../user-guides/ip-lists/overview.md) está disponível.
2. Se estiver atualizando o nó Wallarm multi-tenant, exclua os scripts usados para sincronizar a lista de negação do endereço IP e o nó multi-tenant 2.18 ou inferior. A partir da versão 3.2, a integração manual de [listas IP](../user-guides/ip-lists/overview.md) não é mais necessária.
3. Atualize os módulos do nó de filtragem para a versão 4.8 seguindo as [instruções apropriadas](general-recommendations.md#update-process).
4. Remova a lista de permissão dos endereços IP do Scanner Wallarm dos arquivos de configuração do nó de filtragem. A partir dos nós de filtragem 3.x, os endereços IP do Scanner estão na lista de permissão por padrão.
5. Se os métodos listados são usados para permitir outros endereços IP que não devem ser bloqueados pelo nó de filtragem, mova-os para a [Lista de Permissões no Console Wallarm](../user-guides/ip-lists/allowlist.md).
6. Se você usou a diretiva `wallarm_acl_block_page` para configurar a página de bloqueio e o código de erro retornados quando o IP da lista de negação originou a solicitação, substitua o nome da diretiva por `wallarm_block_page` e atualize seu valor seguindo as [instruções](../admin-en/configuration-guides/configure-block-page-and-code.md).
7. Remova as variáveis de ambiente `WALLARM_ACL_*` do NGINX e do Envoy dos comandos `docker run` [NGINX](../admin-en/installation-docker-en.md) e [Envoy](../admin-en/installation-guides/envoy/envoy-docker.md).
8. (Opcional) Remova as diretivas NGINX `wallarm_acl_*` e parâmetros `acl` do Envoy dos arquivos de configuração do nó de filtragem.