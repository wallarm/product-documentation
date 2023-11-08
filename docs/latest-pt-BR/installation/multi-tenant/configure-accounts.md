# Criando Contas de Inquilino no Console Wallarm

Estas instruções fornecem a você os passos para a configuração correta de [contas de inquilino](overview.md).

--8<-- "../include-pt-BR/waf/features/multi-tenancy/partner-client-term.md"

## Configurando contas de inquilino

Para configurar contas de inquilino:

1. Inscreva-se no Console Wallarm e envie uma solicitação para ativar o recurso de multilocação para sua conta para suporte técnico da Wallarm.
1. Crie uma conta de inquilino.
1. Associe tráfego específico ao inquilino e seus aplicativos.

### Passo 1: Inscreva-se e envie uma solicitação para ativar o recurso de multilocação

1. Preencha e confirme o formulário de registro no Console Wallarm na [Nuvem US](https://us1.my.wallarm.com/signup) ou [Nuvem EU](https://my.wallarm.com/signup).

    ![Formulário de registro](../../images/signup-en.png)

    !!! informação "Email empresarial"
        Por favor inscreva-se usando um endereço de email empresarial.
2. Abra sua caixa de entrada de e-mail e ative a conta usando o link da mensagem recebida.
3. Envie uma solicitação para ativar o recurso de multilocação para sua conta para o [suporte técnico da Wallarm](mailto:support@wallarm.com). Envie os seguintes dados com a solicitação:
    * Nome da Nuvem Wallarm sendo utilizada (Nuvem US ou Nuvem EU)
    * Nomes de uma conta global e conta de inquilino técnico
    * Endereços de e-mail dos funcionários a serem fornecidos com acesso a contas de inquilino (após ativar o recurso de multilocação, você poderá adicionar funcionários você mesmo)
    * Logotipo para o Console Wallarm
    * Domínio personalizado para o Console Wallarm, certificado e chave de criptografia para o domínio
    * Seu endereço de e-mail de suporte técnico 

Depois de receber sua solicitação, o suporte técnico da Wallarm irá:

1. Criar uma conta global e conta de inquilino técnico na Nuvem Wallarm.
2. Adicioná-lo à lista de usuários da conta de cliente técnica com o [papel](../../user-guides/settings/users.md) de **Administrador Global**.
3. Se os endereços de e-mail dos funcionários forem fornecidos, o suporte técnico da Wallarm adicionará funcionários à lista de usuários da conta de inquilino técnica com o [papel](../../user-guides/settings/users.md) de **Apenas leitura global**.

    Funcionários não registrados receberão e-mails com o link para definir uma nova senha para acessar a conta de inquilino técnico.
4. Enviar seu UUID (o principal UUID de inquilino indicando a empresa parceira Wallarm ou cliente Wallarm usando multilocação para ambientes isolados).

    O UUID recebido será necessário nas próximas etapas.

### Passo 2: Criar o inquilino

#### Via Console Wallarm

Embaixo da conta de **Administrador Global**, você pode criar inquilinos via Console Wallarm → seletor de inquilinos → **Criar inquilino**.

![!Criando inquilino via Console Wallarm](../../images/partner-waf-node/tenant-create-via-ui.png)

Você pode criar um novo [usuário](../../user-guides/settings/users.md#user-roles) **Administrador** para seu novo inquilino. O e-mail de convite será enviado para o endereço especificado.

#### Via API Wallarm

Para criar o inquilino, você pode enviar solicitações autenticadas para a API Wallarm. Solicitações autenticadas para a API Wallarm podem ser enviadas do seu próprio cliente da API ou do [Console API Wallarm](../../api/overview.md) que define o método de autenticação:

* Para solicitações serem enviadas do **Console API Wallarm**, é necessário fazer login no Console Wallarm com o papel de usuário **Administrador Global** e atualizar a página do Console API Wallarm disponível em:
    * https://apiconsole.us1.wallarm.com/ para a Nuvem US
    * https://apiconsole.eu1.wallarm.com/ para a Nuvem EU
* Para solicitações serem enviadas do **seu próprio cliente API**, é necessário passar o [token API com permissões do Administrador Global](../../user-guides/settings/api-tokens.md#creating-tokens-with-global-role-permissions) na solicitação.

Neste passo, uma conta de inquilino vinculada a uma conta global será criada.

1. Envie a solicitação POST para a rota `/v1/objects/client/create` com os seguintes parâmetros:

    Parâmetro | Descrição | Parte da Solicitação | Obrigatório
    --------- | -------- | ------------- | ---------
    `X-WallarmApi-Token` | [Token API](../../user-guides/settings/api-tokens.md#configuring-tokens) com as permissões do **Administrador Global**. | Cabeçalho | Sim, ao enviar uma solicitação do seu próprio cliente API
    `name` | Nome do inquilino. | Corpo | Sim
    `vuln_prefix` | Prefixo de vulnerabilidade que a Wallarm usará para rastrear vulnerabilidades e associação com o inquilino. O prefixo deve conter quatro letras maiúsculas ou números e estar ligada ao nome de um inquilino, por exemplo: `TNNT` para o inquilino `Tenant`. | Corpo | Sim
    `partner_uuid` | [UUID principal do inquilino](#step-2-get-access-to-the-tenant-account-creation) recebido ao criar uma conta global. | Corpo | Sim

    ??? info "Mostrar exemplo da solicitação enviada do seu próprio cliente API"
        === "Nuvem US"
            ```bash
            curl -v -X POST "https://us1.api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "Accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```
        === "Nuvem EU"
            ``` bash
            curl -v -X POST "https://api.wallarm.com/v1/objects/client/create" -H "X-WallarmApi-Token: <YOUR_TOKEN>" -H "Accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"Tenant\", \"vuln_prefix\": \"TNNT\", \"partner_uuid\": \"YOUR_PARTNER_UUID\"}"
            ```

    ??? info "Mostrar exemplo da resposta"
        ``` bash
        {
        "status":200,
        "body": {
            "id":10110,
            "name":"Tenant 1",
            "components":["waf"],
            "vuln_prefix":"TNTST",
            ...
            "uuid":"11111111-1111-1111-1111-111111111111",
            ...
            }
        }
        ```

2. Copie o valor do parâmetro `uuid` da resposta à solicitação. O parâmetro será usado ao vincular o tráfego do inquilino à conta de inquilino.

Inquilinos criados serão exibidos no Console Wallarm para [usuários globais](../../user-guides/settings/users.md#user-roles). Por exemplo, `Inquilino 1` e `Inquilino 2`:

![Selecionador de inquilinos no Console Wallarm](../../images/partner-waf-node/clients-selector-in-console.png)

### Passo 3: Associar tráfego específico ao seu inquilino

!!! informação "Quando configurar?"
    Esta configuração é realizada durante o implementação do node e somente se o tráfego de todos os inquilinos é [processado ou será processado](deploy-multi-tenant-node.md) por apenas um node Wallarm.

    Se um node separado processa o tráfego de cada inquilino, por favor, pule este passo e prossiga para a [implementação e configuração do node](deploy-multi-tenant-node.md).

Para fornecer à Nuvem Wallarm com informações sobre qual tráfego deve ser exibido em que conta de inquilino, precisamos associar o tráfego específico ao inquilino criado. Para fazer isso, inclua o inquilino no arquivo de configuração NGINX usando seu `uuid` (obtido em **Passo 3**) como o valor para a diretiva [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid). Por exemplo:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
}
```

Na configuração acima, o tráfego direcionado ao `tenant1.com` será associado ao cliente `11111111-1111-1111-1111-111111111111`.

## Fornecendo usuários com acesso a contas

* Na conta de inquilino técnico, há [funções](../../user-guides/settings/users.md) **global** e **regular** para fornecer aos usuários.

    Usuários globais terão acesso a todas as contas de inquilino vinculadas.

    Usuários regulares terão acesso apenas à conta de inquilino técnico.
* Em certas contas de inquilino, há apenas [funções](../../user-guides/settings/users.md) **regular** para fornecer aos usuários.

    Usuários serão capazes de rastrear solicitações bloqueadas, analisar vulnerabilidades descobertas e realizar configurações adicionais do node de filtragem em uma determinada conta de inquilino. Usuários poderão adicionar uns aos outros por conta própria se as funções permitirem essa ação.

[Prossiga para a implementação e configuração do node de multilocação →](deploy-multi-tenant-node.md)

## Desativando e ativando contas de inquilino no Console Wallarm

No Console Wallarm, o usuário com a função **Administrador Global** pode desativar contas de inquilino vinculadas à conta global que este administrador serve. Quando a conta de inquilino é desativada:

* Usuários desta conta de inquilino não têm acesso ao Console Wallarm.
* Node(s) de filtragem instalados neste [nível de inquilino](deploy-multi-tenant-node.md#multi-tenant-node-characteristics) irão parar o processamento de tráfego.

Contas desativadas não são excluídas e podem ser ativadas novamente.

Para desativar uma conta de inquilino, no seletor de inquilino, do menu de inquilino, selecione **Desativar**, então confirme. A conta de inquilino será desativada e oculta da lista de inquilinos.

![Inquilino - Desativar](../../images/partner-waf-node/tenant-deactivate.png)

Para ativar uma conta de inquilino anteriormente desativada, no seletor de inquilino, clique em **Mostrar inquilinos desativados**, depois selecione **Ativar** para seu inquilino.