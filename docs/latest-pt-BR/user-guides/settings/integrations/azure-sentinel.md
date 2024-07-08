# Microsoft Sentinel

Você pode configurar Wallarm para registrar eventos no [Microsoft Azure Sentinel](https://azure.microsoft.com/en-au/products/microsoft-sentinel/).

## Configurando a integração

Na interface do usuário do Microsoft:

1. [Execute o Microsoft Sentinel em um Workspace](https://learn.microsoft.com/en-us/azure/sentinel/quickstart-onboard#enable-microsoft-sentinel-).
1. Prossiga para as configurações do Workspace do Sentinel → **Agentes** → **Instruções do agente de análise de log** e copie os seguintes dados:

    * ID do Workspace
    * Chave primária

Na interface do usuário do Console Wallarm:

1. Abra a seção **Integrações**.
1. Clique no bloco **Microsoft Sentinel** ou clique no botão **Adicionar integração** e escolha **Microsoft Sentinel**.
1. Digite um nome para a integração.
1. Cole o ID do Workspace e a Chave Primária copiados.
1. Opcionalmente, especifique a tabela do Azure Sentinel para eventos do Wallarm. Se ela não existir, será criada automaticamente. 

    Sem um nome, tabelas separadas são criadas para cada tipo de evento.
1. Escolha os tipos de eventos para acionar notificações.

    ![Integração Sentinel](../../../images/user-guides/settings/integrations/add-sentinel-integration.png)

    Detalhes sobre eventos disponíveis:

    --8<-- "../include-pt-BR/integrations/advanced-events-for-integrations.md"

1. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

    Você pode encontrar os logs do Wallarm em seu Microsoft Workspace → **Logs** → **Log Personalizado**, por exemplo, o log de teste `create_user_CL` no Microsoft Sentinel aparece assim:

    ![Mensagem de teste Sentinel](../../../images/user-guides/settings/integrations/test-sentinel-new-vuln.png)

    !!! info "Atraso no envio de dados para novos espaços de trabalho"
        Criar um espaço de trabalho no Sentinel para integração com Wallarm pode levar até 1 hora para todos os serviços funcionarem. Este atraso pode resultar em erros durante os testes e uso da integração. Se todas as configurações da integração estiverem corretas, mas os erros continuarem a aparecer, tente novamente após 1 hora.

1. Clique em **Adicionar integração**.

## Tipos de logs do Wallarm

Em geral, o Wallarm pode registrar no Sentinel os registros dos seguintes tipos:

| Evento | Tipo de log Sentinel |
| ----- | ----------------- |
| Nova [hit](../../../glossary-en.md#hit) | `new_hits_CL` |
| Novo [usuário](../../../user-guides/settings/users.md) em uma conta da empresa | `create_user_CL` |
| Exclusão de um usuário de uma conta da empresa | `delete_user_CL` |
| Atualização de função do usuário | `update_user_CL` |
| Exclusão de uma [integração](integrations-intro.md) | `delete_integration_CL` |
| Desabilitando uma integração | `disable_integration_CL` ou `integration_broken_CL` se foi desativado devido a configurações incorretas |
| Nova [aplicação](../../../user-guides/settings/applications.md) | `create_application_CL` |
| Exclusão de uma aplicação | `delete_application_CL` |
| Atualização do nome da aplicação | `update_application_CL` |
| Nova [vulnerabilidade](../../../glossary-en.md#vulnerability) de alto risco | `vuln_high_CL` |
| Nova vulnerabilidade de médio risco | `vuln_medium_CL` |
| Nova vulnerabilidade de baixo risco | `vuln_low_CL` |
| Nova [regra](../../../user-guides/rules/rules.md) | `rule_create_CL` |
| Exclusão de uma regra | `rule_delete_CL` |
| Alterações de uma regra existente | `rule_update_CL` |
| Novo [gatilho](../../../user-guides/triggers/triggers.md) | `trigger_create_CL` |
| Exclusão de um gatilho | `trigger_delete_CL` |
| Alterações de um gatilho existente | `trigger_update_CL` |
| Atualizações em hosts, serviços e domínios em [ativos expostos](../../scanner.md) | `scope_object_CL` |
| Alterações no inventário da API (se o [gatilho](../../triggers/triggers.md) correspondente estiver ativo) | `api_structure_changed_CL` |
| A quantidade de ataques excede o limite (se o [gatilho](../../triggers/triggers.md) correspondente estiver ativo) | `attacks_exceeded_CL` |
| Novo IP na lista negra (se o [gatilho](../../triggers/triggers.md) correspondente estiver ativo) | `ip_blocked_CL` |

## Desativando e excluindo uma integração

--8<-- "../include-pt-BR/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros incorretos de integração

--8<-- "../include-pt-BR/integrations/integration-not-working.md"
