# Relatório por Email

Você pode definir endereços de email adicionais que serão usados para entregar [relatórios PDF](../../../user-guides/search-and-filters/custom-report.md) programados e notificações instantâneas. O envio de mensagens para o seu email principal é configurado por padrão.

Os relatórios PDF programados podem ser enviados diariamente, semanalmente, ou mensalmente. Os relatórios PDF incluem informações detalhadas sobre vulnerabilidades, ataques e incidentes detectados em seu sistema durante o período selecionado.

As notificações incluem detalhes breves dos eventos acionados.

## Configurando a integração

1. Abra a seção **Integrações**.
1. Clique no bloco **Relatório por email** ou clique no botão **Adicionar integração** e escolha **Relatório por email**.
1. Insira um nome para a integração.
1. Insira endereços de email usando uma vírgula como separador.
1. Escolha a frequência dos relatórios de segurança. Se a frequência não for escolhida, os relatórios não serão enviados.
1. Escolha os tipos de eventos para acionar as notificações.

    ![Integração de relatório por e-mail](../../../images/user-guides/settings/integrations/add-email-report-integration.png)

    Detalhes sobre eventos disponíveis:

    --8<-- "../include/integrations/events-for-integrations-mail.md"

1. Clique em **Testar integração** para verificar a corretude da configuração, a disponibilidade da Nuvem Wallarm e o formato da notificação.

    Isso enviará as notificações de teste com o prefixo `[Test message]`:

    ![Mensagem de teste por email](../../../images/user-guides/settings/integrations/test-email-scope-changed.png)

1. Clique em **Adicionar integração**.

## Configurando alertas adicionais

--8<-- "../include/integrations/integrations-trigger-setup-limited.md"

## Desativando e excluindo uma integração

--8<-- "../include/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include/integrations/integration-not-working.md"
