# Slack 

Você pode configurar o Wallarm para enviar notificações para seu(s) canal(s) Slack. Se você deseja enviar notificações para vários canais ou contas Slack diferentes, crie várias integrações Slack.

## Configurando a integração

1. Abra a seção **Integrações**.
1. Clique no bloco **Slack** ou clique no botão **Adicionar integração** e escolha **Slack**.
1. Insira um nome para a integração.
1. Abra as [Configurações de Webhook no Slack](https://my.slack.com/services/new/incoming-webhook/) e adicione um novo Webhook escolhendo o canal para postar mensagens.
1. Copie a URL do Webhook fornecida e cole o valor no campo **URL do Webhook** na interface do usuário do Wallarm.
1. Escolha tipos de eventos para acionar notificações.

    ![Integração Slack](../../../images/user-guides/settings/integrations/add-slack-integration.png)

    Detalhes sobre eventos disponíveis:
      
    --8<-- "../include-pt-BR/integrations/events-for-integrations.md"

1. Clique em **Testar integração** para verificar a correção da configuração, disponibilidade do Wallarm Cloud e o formato da notificação.

    Isso enviará as notificações de teste com o prefixo `[Mensagem de teste]`:

    ```
    [Mensagem de teste] [Parceiro de teste] Perímetro de rede mudou

    Tipo de notificação: new_scope_object_ips

    Novos endereços IP foram descobertos no perímetro da rede:
    8.8.8.8

    Cliente: EmpresaTeste
    Nuvem: EU
    ```

1. Clique em **Adicionar integração**.

## Configurando alertas adicionais

--8<-- "../include-pt-BR/integrations/integrations-trigger-setup.md"

### Exemplo: Notificação Slack se 2 ou mais gays SQLi forem detectados em um minuto

Se 2 ou mais [hits](../../../glossary-en.md#hit) SQLi forem enviados para o recurso protegido, uma notificação sobre esse evento será enviada para o canal Slack.

![Exemplo de um gatilho enviando a notificação para Slack](../../../images/user-guides/triggers/trigger-example1.png)

**Para testar o gatilho:**

Envie as seguintes solicitações para o recurso protegido:

```bash
curl 'http://localhost/?id=1%27%20UNION%20SELECT%20username,%20password%20FROM%20users--<script>prompt(1)</script>'
curl 'http://localhost/?id=1%27%20select%20version();'
```
Abra o canal Slack e verifique que a seguinte notificação do usuário **wallarm** foi recebida:

```
[Wallarm] Gatilho: O número de hits detectados excedeu o limite

Tipo de notificação: attacks_exceeded

O número de hits detectados excedeu 1 em 1 minuto.
Esta notificação foi acionada pelo gatilho "Notificação sobre hits SQLi".

Cláusulas adicionais de gatilho:
Tipo de ataque: SQLi.

Veja eventos:
https://my.wallarm.com/attacks?q=attacks&time_from=XXXXXXXXXX&time_to=XXXXXXXXXX

Cliente: EmpresaTeste
Nuvem: EU
```

* `Notificação sobre hits SQLi` é o nome do gatilho
* `EmpresaTeste` é o nome da conta da sua empresa no Console Wallarm
* `EU` é a Nuvem Wallarm onde a conta da sua empresa está registrada

### Exemplo: Notificação Slack e por e-mail se um novo usuário for adicionado à conta

Se um novo usuário com a função **Administrador** ou **Analista** for adicionado à conta da empresa no Console Wallarm, a notificação sobre esse evento será enviada para o endereço de e-mail especificado na integração e para o canal Slack.

![Exemplo de um gatilho enviando a notificação para Slack e por e-mail](../../../images/user-guides/triggers/trigger-example2.png)

**Para testar o gatilho:**

1. Abra o Console Wallarm → **Configurações** → **Usuários** e adicione um novo usuário. Por exemplo:

    ![Usuário adicionado](../../../images/user-guides/settings/integrations/webhook-examples/adding-user.png)
2. Abra sua caixa de entrada de e-mail e verifique se a seguinte mensagem foi recebida:

    ![E-mail sobre novo usuário adicionado](../../../images/user-guides/triggers/test-new-user-email-message.png)
3. Abra o canal Slack e verifique se a seguinte notificação do usuário **wallarm** foi recebida:

    ```
    [Wallarm] Gatilho: Novo usuário foi adicionado à conta da empresa
    
    Tipo de notificação: create_user
    
    Um novo usuário John Smith <johnsmith@example.com> com a função Analyst foi adicionado à conta da empresa por John Doe <johndoe@example.com>.
    Esta notificação foi acionada pelo gatilho "Usuário adicionado".

    Cliente: EmpresaTeste
    Nuvem: EU
    ```

    * `John Smith` e `johnsmith@example.com` são informações sobre o usuário adicionado
    * `Analyst` é a função do usuário adicionado
    * `John Doe` e `johndoe@example.com` são informações sobre o usuário que adicionou um novo usuário
    * `Usuário adicionado` é o nome do gatilho
    * `EmpresaTeste` é o nome da conta da sua empresa no Console Wallarm
    * `EU` é a Nuvem Wallarm onde a conta da sua empresa está registrada

## Desativando e excluindo uma integração

--8<-- "../include-pt-BR/integrations/integrations-disable-delete.md"

## Indisponibilidade do sistema e parâmetros incorretos de integração

--8<-- "../include-pt-BR/integrations/integration-not-working.md"
