[link-pagerduty-docs]: https://support.pagerduty.com/docs/services-and-integrations

#   PagerDuty

Você pode configurar o Wallarm para enviar incidentes ao PagerDuty.

##  Configurando a integração

No UI do PagerDuty, [configure uma integração][link-pagerduty-docs] para qualquer serviço existente ou crie um novo serviço especificamente para o Wallarm:

1. Vá para **Configuration** → **Services**.
2. Abra as configurações do serviço existente ou clique no botão **New Service**.
3. Crie uma nova integração:

    * Se você estiver configurando integrações do serviço existente, vá para a guia **Integrations** e clique no botão **New Integration**.
    * Se você estiver criando um novo serviço, insira o nome do serviço e prossiga para a seção **Integration Settings**.
4. Insira o nome da integração e selecione a opção **Use our API directly** como um tipo de integração.
5. Salve as configurações:

    * Se você estiver configurando integrações do serviço existente, clique no botão **Add Integration**.
    * Se você estiver criando um novo serviço, configure o restante das seções de configurações e clique no botão **Add Service**.
    
5. Copie a **Integration Key** fornecida.

No UI do Wallarm:

1. Abra a seção **Integrations**.
1. Clique no bloco **PagerDuty** ou clique no botão **Add integration** e escolha **PagerDuty**.
1. Insira um nome para a integração.
1. Cole o valor da **Integration Key** no campo apropriado.
1. Escolha os tipos de eventos para acionar notificações.

    ![Integração PagerDuty](../../../images/user-guides/settings/integrations/add-pagerduty-integration.png)

    Detalhes sobre eventos disponíveis:
      
    --8<-- "../include-pt-BR/integrations/events-for-integrations.md"

1. Clique em **Test integration** para verificar a correção das configurações, a disponibilidade do Wallarm Cloud e o formato de notificação.

    Isso enviará as notificações de teste com o prefixo `[Test message]`:

    ![Notificação de teste do PagerDuty](../../../images/user-guides/settings/integrations/test-pagerduty-scope-changed.png)

1. Clique em **Add integration**.

## Configurando alertas adicionais

--8<-- "../include-pt-BR/integrations/integrations-trigger-setup.md"

## Desabilitando e excluindo uma integração

--8<-- "../include-pt-BR/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros incorretos de integração

--8<-- "../include-pt-BR/integrations/integration-not-working.md"