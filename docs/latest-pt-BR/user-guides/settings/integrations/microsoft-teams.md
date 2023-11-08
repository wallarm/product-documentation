# Microsoft Teams

Você pode configurar o Wallarm para enviar notificações para o(s) seu(s) canal(is) da Microsoft Teams. Se quiser enviar notificações para vários canais diferentes, crie várias integrações da Microsoft Teams.

## Configurando a integração

1. Abra a seção **Integrações**.
1. Clique no bloco **Microsoft Teams** ou clique no botão **Adicionar integração** e escolha **Microsoft Teams**.
1. Insira um nome para a integração.
1. Abra as configurações do canal da Microsoft Teams onde deseja postar notificações e configure um novo Webhook usando as [instruções](https://docs.microsoft.com/en-us/microsoftteams/platform/webhooks-and-connectors/how-to/add-incoming-webhook).
1. Copie a URL do Webhook fornecida e cole o valor no campo **URL do Webhook** no Console Wallarm.
1. Escolha os tipos de eventos para acionar notificações.

      ![Integração MS Teams](../../../images/user-guides/settings/integrations/add-ms-teams-integration.png)
    
      Detalhes sobre os eventos disponíveis:
      
      --8<-- "../include-pt-BR/integrations/events-for-integrations.md"

1. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

      Isso enviará as notificações de teste com o prefixo `[Mensagem de teste]`:

      ```
      [Mensagem de teste] [Parceiro de teste] O perímetro da rede foi alterado

      Tipo de notificação: new_scope_object_ips

      Novos endereços IP foram descobertos no perímetro da rede:
      8.8.8.8

      Cliente: TestCompany
      Cloud: EU
      ```

1. Clique em **Adicionar integração**.

## Configurando alertas adicionais

--8<-- "../include-pt-BR/integrations/integrations-trigger-setup-limited.md"

## Desativando e excluindo uma integração

--8<-- "../include-pt-BR/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include-pt-BR/integrations/integration-not-working.md"