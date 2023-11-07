# Opsgenie

Você pode configurar o Wallarm para enviar alertas para o Opsgenie.

## Configurando a integração

No [UI do Opsgenie](https://app.opsgenie.com/teams/list):

1. Vá para sua equipe ➝ **Integrações**.
2. Clique no botão **Adicionar integração** e escolha **API**.
3. Insira o nome para uma nova integração e clique em **Salvar Integração**.
4. Copie a chave API fornecida.

No UI do Wallarm:

1. Abra a seção **Integrações**.
2. Clique no bloco **Opsgenie** ou clique no botão **Adicionar integração** e escolha **Opsgenie**.
3. Insira um nome de integração.
4. Cole a chave API copiada no campo **Chave API**.
5. Se estiver usando a [instância EU](https://docs.opsgenie.com/docs/european-service-region) do Opsgenie, selecione o endpoint da API do Opsgenie apropriado da lista. Por padrão, o endpoint da instância dos EUA está definido.
6. Escolha os tipos de eventos para disparar notificações.

    ![Integração Opsgenie](../../../images/user-guides/settings/integrations/add-opsgenie-integration.png)

    Detalhes sobre eventos disponíveis:
      
    --8<-- "../include/integrations/events-for-integrations.md"

7. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

    Isso enviará as notificações de teste com o prefixo `[Mensagem de teste]`:

    ![Testar mensagem Opsgenie](../../../images/user-guides/settings/integrations/test-opsgenie-new-vuln.png)

8. Clique em **Adicionar integração**.

## Configurando alertas adicionais

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Desativando e excluindo uma integração

--8<-- "../include/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include/integrations/integration-not-working.md"