# Telegram

Você pode configurar o Wallarm para enviar relatórios agendados e notificações instantâneas para o Telegram.

Os relatórios agendados podem ser enviados diariamente, semanalmente ou mensalmente. Os relatórios incluem informações detalhadas sobre vulnerabilidades, ataques e incidentes detectados em seu sistema durante o período selecionado.

As notificações incluem detalhes breves dos eventos disparados.

## Configurando a integração

1. Abra a seção **Integrações**.
1. Clique no bloco **Telegram** ou clique no botão **Adicionar integração** e escolha **Telegram**.
1. Adicione [@WallarmUSBot](https://t.me/WallarmUSBot) (se você está usando o Wallarm US Cloud) ou [@WallarmBot](https://t.me/WallarmBot) (se você está usando o Wallarm EU Cloud) ao grupo do Telegram que receberá as notificações do Wallarm e siga o link de autenticação.
1. Após o redirecionamento para a interface de usuário do Wallarm, autentique o bot.
1. Insira um nome para a integração.
1. Escolha a frequência do envio de relatórios de segurança. Se a frequência não for escolhida, então os relatórios não serão enviados.
1. Escolha os tipos de evento para disparar notificações.

    ![Integração do Telegram](../../../images/user-guides/settings/integrations/add-telegram-integration.png)

    Detalhes sobre eventos disponíveis:

    --8<-- "../include-pt-BR/integrations/events-for-integrations.md"

    A integração com o Telegram só pode ser testada se essa integração já estiver criada.

1. Clique em **Adicionar integração**.
1. Reabra o cartão da integração criada.
1. Clique em **Testar integração** para verificar a corretude da configuração, a disponibilidade do Wallarm Cloud e o formato da notificação.

    Isso enviará as notificações de teste com o prefixo `[Mensagem de teste]`:

    ```
    [Mensagem de teste] [Parceiro de teste] Perímetro de rede alterado

    Tipo de notificação: novos_ips_de_objeto_de_escopo

    Novos endereços IP foram descobertos no perímetro da rede:
    8.8.8.8

    Cliente: TestCompany
    Cloud: EU
    ```

Você também pode iniciar o chat com [@WallarmUSBot](https://t.me/WallarmUSBot) ou [@WallarmBot](https://t.me/WallarmBot) diretamente. O bot enviará relatórios e notificações também.

## Configurando alertas adicionais

--8<-- "../include-pt-BR/integrations/integrations-trigger-setup-limited.md"

## Desativando e excluindo uma integração

--8<-- "../include-pt-BR/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros de integração incorretos

--8<-- "../include-pt-BR/integrations/integration-not-working.md"