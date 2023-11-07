# Datadog

Você pode configurar o Wallarm para enviar notificações de eventos detectados diretamente para o serviço Datadog Logs criando uma integração apropriada através da [chave API Datadog](https://docs.datadoghq.com/account_management/api-app-keys/) no Console Wallarm.

## Configurando a integração

1. Abra a interface do usuário do Datadog → **Configurações da organização** → **Chaves da API** e gere a chave da API para a integração com o Wallarm.
1. Abra o Console do Wallarm → **Integrações** e prossiga para a configuração da integração **Datadog**.
1. Insira um nome para a integração.
1. Cole a chave da API do Datadog no campo **Chave da API**.
1. Selecione a [região do Datadog](https://docs.datadoghq.com/getting_started/site/).
1. Escolha os tipos de eventos que acionarão as notificações.

    ![Integração Datadog](../../../images/user-guides/settings/integrations/add-datadog-integration.png)

    Detalhes sobre eventos disponíveis:

    --8<-- "../include/integrations/advanced-events-for-integrations.md"

1. Clique em **Testar integração** para verificar a correção da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

    O log de teste do Datadog:

    ![O log de teste do Datadog](../../../images/user-guides/settings/integrations/test-datadog-vuln-detected.png)

    Para encontrar os logs Wallarm entre outros registros, você pode usar a tag de pesquisa `source:wallarm_cloud` no serviço Datadog Logs.

1. Clique em **Adicionar integração**.

## Configurando alertas adicionais

--8<-- "../include/integrations/integrations-trigger-setup.md"

## Desabilitando e excluindo uma integração

--8<-- "../include/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include/integrations/integration-not-working.md"