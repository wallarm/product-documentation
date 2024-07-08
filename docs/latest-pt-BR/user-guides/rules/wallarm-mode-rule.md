[link-wallarm-mode-override]:       ../../admin-en/configure-parameters-en.md#wallarm_mode_allow_override

[img-mode-rule]:        ../../images/user-guides/rules/wallarm-mode-rule-with-safe-blocking.png

# Regra do modo de filtragem

O modo de filtragem permite habilitar e desabilitar o bloqueio de solicitações para várias partes de um aplicativo da web.

Para definir um modo de filtragem, crie uma regra de *Definir modo de filtragem* e selecione o modo apropriado.

O modo de filtragem pode assumir um dos seguintes [valores](../../admin-en/configure-wallarm-mode.md#available-filtration-modes):

* **Padrão**: o sistema funcionará de acordo com os parâmetros especificados nos arquivos de configuração do NGINX.
* **Desativar**: a análise e filtragem de solicitações são desativadas, exceto para solicitações originadas de IPs na [lista de proibidos](../ip-lists/denylist.md). As solicitações de IPs bloqueados são bloqueadas (mas não mostradas na interface).
* **Monitoramento**: as solicitações são analisadas e exibidas na interface, mas não são bloqueadas, a menos que se originem de IPs na lista de proibidos. Solicitações de IPs na lista de proibidos são bloqueadas (mas não aparecem na interface).
* **Bloqueio seguro**: solicitações mal-intencionadas são bloqueadas apenas se forem originadas de [IPs na lista cinza](../ip-lists/graylist.md).
* **Bloqueio**: solicitações mal-intencionadas são bloqueadas e exibidas na interface.

Para implementar essa regra, os arquivos de configuração do NGINX devem permitir o [gerenciamento centralizado do modo de operação][link-wallarm-mode-override].

## Criando e aplicando a regra

--8<-- "../include-pt-BR/waf/features/rules/rule-creation-options.md"

## Instância padrão da regra

A Wallarm cria automaticamente a instância da regra `Definir modo de filtragem` no nível [padrão](../../user-guides/rules/rules.md#default-rules). O sistema define seu valor com base na [configuração do modo de filtragem geral](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console).

Essa instância da regra não pode ser excluída. Para alterar seu valor, modifique a [configuração do modo de filtragem geral](../../admin-en/configure-wallarm-mode.md#setting-up-the-general-filtration-rule-in-wallarm-console) do sistema.

Como todas as outras regras padrão, a regra padrão `Definir modo de filtragem` é [herdada](../../user-guides/rules/rules.md) por todos os ramos.

## Exemplo: Desabilitando o bloqueio de solicitações durante o registro do usuário

**Se** as seguintes condições ocorrerem:

* o registro de novos usuários está disponível em *example.com/signup*
* é melhor ignorar um ataque do que perder um cliente

**Então**, para criar uma regra que desabilita a bloqueio durante o registro do usuário

1. Vá para a guia *Regras*
1. Encontre o ramo para `example.com/signup`, e clique em *Adicionar regra*
1. Escolha *Definir modo de filtragem*
1. Escolha o modo de operação *monitoramento*
1. Clique em *Criar*

![Configurando o modo de filtragem de tráfego][img-mode-rule]

## Chamadas de API para criar a regra

Para criar a regra do modo de filtragem, você pode [chamar a API Wallarm diretamente](../../api/overview.md) além de usar a interface de usuário do Console Wallarm. Abaixo está o exemplo da chamada de API correspondente.

A seguinte solicitação criará a regra definindo o nó para filtrar o tráfego que vai para o [aplicativo](../settings/applications.md) com ID `3` no modo de monitoramento.

--8<-- "../include-pt-BR/api-request-examples/create-filtration-mode-rule-for-app.md"