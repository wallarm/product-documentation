[user-roles-article]:       ../../user-guides/settings/users.md#user-roles
[img-api-tokens-edit]:      ../../images/api-tokens-edit.png

# Tokens de API

No Console Wallarm → **Configurações** → **Tokens de API**, você pode gerenciar tokens para [autenticação de solicitação de API](../../api/overview.md).

![Token da API Wallarm][img-api-tokens-edit]

Esta seção está disponível para os usuários de **[todos os papéis][user-roles-article]**, exceto **Somente leitura** e **Desenvolvedor de API**.

## Configurando tokens

Os usuários podem criar seus próprios tokens e usá-los (o que significa, visualizar o valor do token e incluí-lo na solicitação de API para autenticá-lo). Para cada token próprio, você pode definir permissões, mas não mais amplas do que as que seu usuário possui. Opcionalmente, você pode definir uma data de expiração para o token - se definido, o token será desativado após essa data. Além disso, você pode desativar/ativar seus tokens manualmente.

Você pode renovar o valor do token a qualquer momento.

**Administradores** / **Administradores Globais** podem visualizar e gerenciar todos os tokens na conta da empresa. Além dos tokens privados, eles podem criar compartilhados, que podem ser visualizados/usados ​​por outros administradores. Ao especificar permissões para os tokens, eles podem selecionar obter essas permissões do papel selecionado:

* Administrador
* Analista
* Desenvolvedor de API
* Apenas leitura
* Implantar - Tokens de API com este papel são usados ​​para [implantar nós Wallarm](../../user-guides/nodes/nodes.md#creating-a-node)
* Personalizado - volta à seleção manual de permissões

!!! info "Privacidade do token"
    Nenhum outro usuário (mesmo os administradores) pode usar seus tokens privados (o que significa, visualizar ou copiar o valor do token). Além disso, os não-administradores nem mesmo verão seus tokens.

Leve em consideração que:

* Se o proprietário do token foi [desativado](../../user-guides/settings/users.md#disabling-and-deleting-users), todos os seus tokens são automaticamente desativados também.
* Se o proprietário do token teve suas permissões reduzidas, as permissões correspondentes serão removidas de todos os seus tokens.
* Todos os tokens desativados são automaticamente removidos uma semana após a desativação.
* Para ativar um token previamente desativado, salve-o com a nova data de vencimento.

## Criando tokens com permissões de papel global

Para criar um token de API com as permissões baseadas nos [papéis](../../user-guides/settings/users.md#user-roles) globais como Administrador Global, Analista Global ou Somente Leitura Global, faça o seguinte:

1. Faça login no Console Wallarm [US](https://us1.my.wallarm.com/) ou [EU](https://my.wallarm.com/) sob o [usuário apropriado](#configuring-tokens).
1. No canto superior direito, selecione `?` → **Console da API Wallarm**. O console da API Wallarm é aberto:

    * https://apiconsole.us1.wallarm.com/ para a nuvem dos EUA
    * https://apiconsole.eu1.wallarm.com/ para a nuvem da UE

    Note que o Console da API Wallarm recupera dados de autenticação do Console Wallarm. Se você mudar de usuário no Console Wallarm, atualize a página do Console da API Wallarm para a nova autenticação.
 
1. Envie a solicitação POST para a rota `/v2/api_tokens` com os seguintes parâmetros:

    ```bash
    {
    "client_id": <CLIENT_ID>,
    "realname": "<NAME_FOR_YOUR_API_TOKEN>",
    "user_id": <USER_ID>,
    "enabled": true,
    "expire_at": "<TOKEN_EXPIRATION_DATE_AND_TIME>",
    "permissions": [
        "<REQUIRED_GLOBAL_ROLE>"
    ]
    }
    ```

    Onde:

    * `<NAME_FOR_YOUR_API_TOKEN>` é recomendado para explicar o propósito do token.
    * `<USER_ID>` define o usuário que possui o token e `<CLIENT_ID>` - a conta da empresa a que este usuário pertence.
    
        Obtenha esses IDs enviando a solicitação POST para a rota `/v1/user`.

    * `<TOKEN_EXPIRATION_DATE_AND_TIME>` em [formato ISO 8601](https://www.cl.cam.ac.uk/~mgk25/iso-time.html), por exemplo `2033-06-13T04:56:01.037Z`.
    * `<REQUIRED_GLOBAL_ROLE>` podem ser:
        
        * `partner_admin` para Administrador Global
        * `partner_analytic` para Analista Global
        * `partner_auditor` para Somente Leitura Global

    ??? info "Exemplo"
        ```bash
        {
        "client_id": 1010,
        "realname": "Token para criação de inquilino",
        "user_id": 10101011,
        "enabled": true,
        "expire_at": "2033-06-13T04:56:01.037Z",
        "permissions": [
            "partner_admin"
        ]
        }
        ```

        Esta solicitação cria um token de API com permissões de Administrador Global que podem ser usadas ​​para a [criação de inquilinos](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

1. Da resposta, obtenha o `id` do token criado e envie a solicitação GET para a rota `/v2/api_tokens/{id}/secret` usando este `id`.
1. Copie o valor `secret` da resposta e use-o como o token de API para autenticação de solicitações.

    !!! info "Copiando o token do Console Wallarm"
        Como o token de API criado é exibido no Console Wallarm, você também pode copiá-lo do menu de tokens em **Configurações** → **Tokens de API**.

## Tokens compatíveis com versões anteriores

Anteriormente, o UUID e a chave secreta eram usados para autenticação de solicitações, que agora é substituída por tokens. O UUID e a chave secreta que você estava usando são automaticamente transformados no token **compatível com versões anteriores**. Com este token, as solicitações autenticadas com UUID e chave secreta continuarão funcionando.

!!! warning "Renove o token ou ative SSO"
    Se você renovar o valor do token compatível com versões anteriores ou habilitar o [SSO/strict SSO](../../admin-en/configuration-guides/sso/setup.md) para o proprietário deste token, a compatibilidade com versões anteriores termina - todas as solicitações autenticadas com o antigo UUID e chave secreta pararão de funcionar.

Você também pode usar o valor gerado do token compatível com versões anteriores, passando-o no parâmetro de cabeçalho `X-WallarmApi-Token` de suas solicitações.

O token compatível com versões anteriores tem as mesmas permissões que o papel do usuário, essas permissões não são exibidas na janela do token e não podem ser alteradas. Se você quiser controlar as permissões, precisará remover um token compatível com versões anteriores e criar um novo.

## Tokens de API vs. tokens de nó

Você pode usar tokens de API descritos neste artigo para [autenticação de solicitação](../../api/overview.md) da API Wallarm Cloud de qualquer cliente e com qualquer conjunto de permissões.

Um dos clientes acessando a API Wallarm Cloud é o próprio nó de filtragem Wallarm. Para conceder a um nó de filtragem acesso à API de Wallarm Cloud, além dos tokens de API, você pode usar tokens de nó. [Conheça a diferença e o que preferir →](../../user-guides/nodes/nodes.md#api-and-node-tokens-for-node-creation)

!!! info "Tokens de API não são suportados por algumas opções de implantação"
    Atualmente, os tokens de API não podem ser usados ​​para AWS baseadas em [módulo Terraform](../../installation/cloud-platforms/aws/terraform-module/overview.md). Use tokens de nó em vez disso.