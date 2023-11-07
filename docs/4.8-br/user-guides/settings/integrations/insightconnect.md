# InsightConnect

Você pode configurar o Wallarm para enviar notificações ao InsightConnect.

## Configurando a integração

Primeiro, gere e copie uma chave API conforme a seguir:

1. Abra a interface do usuário do InsightConnect → **Configurações** → [**API Keys** page](https://insight.rapid7.com/platform#/apiKeyManagement) e clique em **New User Key**.
2. Insira um nome para a chave API (por exemplo, `Chave API Wallarm`) e clique em **Generate**.
3. Copie a chave API gerada.
4. Vá para a interface do usuário do Wallarm → **Integrações** na nuvem [US](https://us1.my.wallarm.com/integrations/) ou [EU](https://my.wallarm.com/integrations/) e clique em **InsightConnect**.
4. Cole a chave API que você copiou anteriormente no campo **API key**.

Em segundo lugar, gere e copie uma URL da API da seguinte maneira:

1. Volte à interface do usuário do InsightConnect, abra a **Automation** → página **Workflows** e crie um novo fluxo de trabalho para a notificação Wallarm.
2. Quando solicitado a escolher um gatilho, escolha o **API Trigger**.
3. Copie a URL gerada.
4. Volte para a interface do usuário do Wallarm → configuração do **InsightConnect** e cole a URL da API que você copiou anteriormente no campo **API URL**.

Em terceiro lugar, termine a configuração na interface do usuário do Wallarm:

1. Insira um nome para a integração.
1. Escolha tipos de eventos para acionar notificações.

    ![Integração InsightConnect](../../../images/user-guides/settings/integrations/add-insightconnect-integration.png)

    Detalhes sobre eventos disponíveis:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Clique em **Test integration** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud, e o formato da notificação.

    Isso enviará as notificações de teste com o prefixo `[Mensagem de teste]`:

    ![Testar notificação InsightConnect](../../../images/user-guides/settings/integrations/test-insightconnect-scope-changed.png)

1. Clique em **Add integration**.

## Configurando alertas adicionais

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Desabilitando e excluindo uma integração

--8<-- "../include/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros incorretos de integração

--8<-- "../include/integrations/integration-not-working.md"