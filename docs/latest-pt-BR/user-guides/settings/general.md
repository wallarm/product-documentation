[link-config-parameters]:       ../../admin-en/configure-wallarm-mode.md

[img-general-settings]:         ../../images/configuration-guides/configure-wallarm-mode/en/general-settings-page-with-safe-blocking.png

# Configurações Gerais

Na aba **Geral** da seção **Configurações**, você pode:

* Alternar o modo de filtragem do Wallarm
* Gerenciar tempos limite de logout automático

![Aba Geral](../../images/user-guides/settings/general-tab.png)

## Modo de filtragem

Cada nó Wallarm pode identificar e bloquear ataques no nível de solicitação HTTP. Este [modo de filtragem][link-config-parameters] é definido pelas configurações locais ou globais:

* **Configurações locais (padrão)**: este modo explora as configurações de um arquivo de configuração de nó de filtro.
* **Bloqueio seguro**: todas as solicitações maliciosas originadas de [IPs na lista cinza](../ip-lists/graylist.md) são bloqueadas.
* **Monitoramento**: todas as solicitações são processadas, mas nenhuma delas é bloqueada mesmo se um ataque for detectado.
* **Bloqueio**: todas as solicitações em que um ataque foi detectado são bloqueadas.

## Gerenciamento de logout

Os [administradores](users.md#user-roles) podem configurar os tempos limite de logout para a conta da empresa. As configurações afetarão todos os usuários da conta. É possível definir tempos limite ociosos e absolutos.