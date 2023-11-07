# ServiceNow

Você pode configurar o Wallarm para criar tickets de problemas no [ServiceNow](https://www.servicenow.com/).

## Requisitos

ServiceNow é uma plataforma para ajudar as empresas a gerenciar fluxos de trabalho digitais para operações empresariais. Sua empresa precisa de uma instância do ServiceNow de propriedade e aplicativos de fluxo de trabalho [construídos dentro dela](https://www.servicenow.com/lpdem/demonow-cloud-platform-app-dev.html) para integrar esses aplicativos com o Wallarm.

## Configurando a integração

No UI do ServiceNow:

1. Obtenha o nome da sua [instância do ServiceNow](https://docs.servicenow.com/bundle/tokyo-application-development/page/build/team-development/concept/c_InstanceHierarchies.html).
1. Obtenha o nome de usuário e a senha para acessar a instância.
1. Ative a autenticação OAuth e obtenha o ID do cliente e o segredo conforme descrito [aqui](https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/inbound-rest/task/t_EnableOAuthWithREST.html).

No UI do Wallarm:

1. Abra o Console Wallarm → **Integrações** → **ServiceNow**.
1. Insira um nome de integração.
1. Insira o nome da instância do ServiceNow.
1. Insira o nome de usuário e a senha para acessar a instância especificada.
1. Insira os dados de autenticação OAuth: ID do cliente e segredo.
1. Escolha tipos de eventos para acionar notificações.

    ![Integração ServiceNow](../../../images/user-guides/settings/integrations/add-servicenow-integration.png

    Detalhes sobre eventos disponíveis:
     
    --8<-- "../include/integrations/events-for-integrations.md"

1. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

    Isso enviará as notificações de teste com o prefixo `[Mensagem de teste]`.

1. Clique em **Adicionar integração**.

## Desativando e excluindo uma integração

--8<-- "../include/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include/integrations/integration-not-working.md"