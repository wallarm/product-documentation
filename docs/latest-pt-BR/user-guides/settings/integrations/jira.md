# Atlassian Jira

Você pode configurar o Wallarm para criar problemas no Jira quando [vulnerabilidades](../../../glossary-en.md#vulnerability) são detectadas, todas ou apenas para o(s) nível(is) de risco selecionado(s) - alto, médio ou baixo.

## Configurando a integração

No Jira UI: 

1. Gere um token de API conforme descrito [aqui](https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/#Create-an-API-token).
1. Copie o token de API gerado.

No Wallarm UI:

1. Abra o Console Wallarm → **Integrações** → **Jira**.
1. Insira um nome para a integração.
1. Insira o host do Jira (por exemplo, `https://company-x.atlassian.net/`).
1. Insira o e-mail do usuário do Jira, que o Jira requer para autenticação e também será usado para identificar o Reporter para os problemas criados.
1. Cole o token de API gerado. O e-mail e o token serão verificados para autenticar a Wallarm no host do Jira especificado. Em caso de sucesso, os espaços disponíveis para esse usuário do Jira serão listados.
1. Selecione o espaço Jira para criar problemas. Quando selecionado, a lista de tipos de problemas suportados neste espaço será listada.
1. Selecione o tipo de problema do Jira ao qual os problemas criados pertencerão.
1. Selecione os tipos de evento para disparar notificações. Todas as vulnerabilidades ou apenas de um nível de risco específico podem ser selecionadas.

    ![Integração Jira](../../../images/user-guides/settings/integrations/add-jira-integration.png)

1. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

    Teste a criação de problemas do Jira:

    ![Testar a criação de problemas do Jira](../../../images/user-guides/settings/integrations/test-jira-issue-creation.png)

1. Clique em **Adicionar integração**.

## Desativando e excluindo uma integração

--8<-- "../include-pt-BR/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include-pt-BR/integrations/integration-not-working.md"