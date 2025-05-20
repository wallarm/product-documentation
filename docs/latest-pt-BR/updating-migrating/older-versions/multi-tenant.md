[ptrav-attack-docs]:                ../../attacks-vulns-list.md#path-traversal
[attacks-in-ui-image]:              ../../images/admin-guides/test-attacks-quickstart.png

# Atualizando o nó multi-inquilino EOL

Estas instruções descrevem as etapas para atualizar o nó multi-inquilino de fim de vida (versão 3.6 e inferior) até a versão 4.8.

## Requisitos

* Execução de comandos adicionais pelo usuário com a função **Administrador global** adicionada sob a [conta de inquilino técnico](../../installation/multi-tenant/configure-accounts.md#tenant-account-structure)
* Acesso a `https://us1.api.wallarm.com` se trabalhando com Wallarm Cloud dos EUA ou a `https://api.wallarm.com` se trabalhando com Wallarm Cloud da UE. Certifique-se de que o acesso não está bloqueado por um firewall

## Passo 1: Entre em contato com a equipe de suporte da Wallarm

Solicite a assistência da [equipe de suporte da Wallarm](mailto:support@wallarm.com) para obter a versão mais recente do recurso de [construção de conjunto de regras personalizado](../../user-guides/rules/rules.md) durante a atualização do nó multi-inquilino.

!!! info "Atualização bloqueada"
    O uso de uma versão incorreta do recurso de construção de conjunto de regras personalizado pode bloquear o processo de atualização.

A equipe de suporte também ajudará você a responder a todas as perguntas relacionadas à atualização do nó multi-inquilino e à reconfiguração necessária.

## Passo 2: Siga o procedimento padrão de atualização

Os procedimentos padrão são aqueles para:

* [Atualizando os módulos NGINX da Wallarm](nginx-modules.md)
* [Atualizando o módulo de pós-análise](separate-postanalytics.md)
* [Atualizando a imagem NGINX- ou Envoy-baseada em Docker da Wallarm](docker-container.md)
* [Atualizando o controlador de entrada NGINX com módulos Wallarm integrados](ingress-controller.md)
* [Atualizando a imagem do nó na nuvem](cloud-image.md)

!!! warning "Criando o nó multi-inquilino"
    Durante a criação do nó Wallarm, selecione a opção **Nó multi-inquilino**:

    ![Criação de nó multi-inquilino](../../images/user-guides/nodes/create-multi-tenant-node.png)

## Passo 3: Reconfigure a multilocação

Reescreva a configuração de como o tráfego está associado a seus inquilinos e suas aplicações. Considere o exemplo abaixo. No exemplo:

* O inquilino representa o cliente do parceiro. O parceiro tem dois clientes.
* O tráfego direcionado para `tenant1.com`e `tenant1-1.com` deve ser associado ao cliente 1.
* O tráfego direcionado para `tenant2.com` deve ser associado ao cliente 2.
* O cliente 1 também possui três aplicações:
    * `tenant1.com/login`
    * `tenant1.com/users`
    * `tenant1-1.com`
  
    O tráfego direcionado a esses 3 caminhos deve ser associado à aplicação correspondente; o restante deve ser considerado como tráfego genérico do cliente 1.

### Estude sua configuração de versão anterior

Na versão 3.6, isso poderia ser configurado da seguinte maneira:

```
server {
  server_name  tenant1.com;
  wallarm_application 20;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_application 24;
  ...
}
...
}
```

Observações sobre a configuração acima:

* O tráfego direcionado para `tenant1.com` e `tenant1-1.com` está associado ao cliente 1 através dos valores `20` e `23`, vinculados a este cliente através do pedido de API.
* Solicitações de API semelhantes deveriam ter sido enviadas para vincular outras aplicações aos inquilinos.
* Os inquilinos e as aplicações são entidades separadas, portanto, é lógico configurá-los com as diferentes diretivas. Além disso, seria conveniente evitar solicitações adicionais de API. Seria lógico definir relações entre os inquilinos e as aplicações através da própria configuração. Tudo isso está ausente na configuração atual, mas estará disponível na nova abordagem 4.x descrita abaixo.

### Estude a abordagem 4.x

Na versão 4.x, UUID é a forma de definir o inquilino na configuração do nó.

Para reescrever a configuração, faça o seguinte:

1. Obtenha os UUIDs de seus inquilinos.
1. Inclua inquilinos e defina suas aplicações no arquivo de configuração NGINX.

### Obtenha UUIDs de seus inquilinos

Para obter a lista de inquilinos, envie solicitações autenticadas para a API da Wallarm. A abordagem de autenticação é a mesma que a [usada para a criação do inquilino](../../installation/multi-tenant/configure-accounts.md#step-3-create-the-tenant-via-the-wallarm-api).

1. Obtenha o(s) `clientid`(s) para posteriormente encontrar UUIDs relacionados a eles:

    === "Através do Console Wallarm"

        Copie o(s) `clientid`(s) da coluna **ID** na interface do usuário do Console Wallarm:

        ![Selecionador de inquilinos no Console Wallarm](../../images/partner-waf-node/clients-selector-in-console-ann.png)
    === "Ao enviar solicitação para API"
        1. Envie a solicitação GET para a rota `/v2/partner_client`:

            !!! info "Exemplo de solicitação enviada do seu próprio cliente"
                === "Nuvem dos EUA"
                    ``` bash
                    curl -X GET \
                    'https://us1.api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
                === "Nuvem da UE"
                    ``` bash
                    curl -X GET \
                    'https://api.wallarm.com/v2/partner_client?partnerid=PARTNER_ID' \
                    -H 'accept: application/json' \
                    -H "X-WallarmApi-Token: <YOUR_TOKEN>"
                    ```
            
            Onde `PARTNER_ID` é aquele obtido no [**Passo 2**](../../installation/multi-tenant/configure-accounts.md#step-2-get-access-to-the-tenant-account-creation) do procedimento de criação de inquilino.

            Exemplo de resposta:

            ```
            {
            "body": [
                {
                    "id": 1,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_1_ID>,
                    "params": null
                },
                {
                    "id": 3,
                    "partnerid": <PARTNER_ID>,
                    "clientid": <CLIENT_2_ID>,
                    "params": null
                }
            ]
            }
            ```

        1. Copie o(s) `clientid`(s) da resposta.
1. Para obter o UUID de cada inquilino, envie a solicitação POST para a rota `v1/objects/client`:

    !!! info "Exemplo de solicitação enviada do seu próprio cliente"
        === "Nuvem dos EUA"
            ``` bash
            curl -X POST \
            https://us1.api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        
        === "Nuvem da UE"
            ``` bash
            curl -X POST \
            https://api.wallarm.com/v1/objects/client \
            -H 'content-type: application/json' \
            -H 'X-WallarmApi-Token: <YOUR_TOKEN>' \
            -d '{ "filter": { "id": [<CLIENT_1_ID>, <CLIENT_2_ID>]}}'
            ```        

    Exemplo de resposta:

    ```
    {
    "status": 200,
    "body": [
        {
            "id": <CLIENT_1_ID>,
            "name": "<CLIENT_1_NAME>",
            ...
            "uuid": "11111111-1111-1111-1111-111111111111",
            ...
        },
        {
            "id": <CLIENT_2_ID>,
            "name": "<CLIENT_2_NAME>",
            ...
            "uuid": "22222222-2222-2222-2222-222222222222",
            ...
        }
    ]
    }
    ```

1. Da resposta, copie o(s) `uuid`(s).

### Inclua inquilinos e defina suas aplicações no arquivo de configuração NGINX

No arquivo de configuração do NGINX:

1. Especifique os UUIDs de inquilino recebidos acima nas diretivas [`wallarm_partner_client_uuid`](../../admin-en/configure-parameters-en.md#wallarm_partner_client_uuid).
1. Defina os IDs da aplicação protegida nas diretivas [`wallarm_application`](../../admin-en/configure-parameters-en.md#wallarm_application). 

    Se a configuração do NGINX usada para o nó versão 3.6 ou inferior envolvia configuração de aplicação, apenas especifique os UUIDs de inquilino e mantenha a configuração de aplicação inalterada.

Exemplo:

```
server {
  server_name  tenant1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  ...
  location /login {
     wallarm_application 21;
     ...
  }
  location /users {
     wallarm_application 22;
     ...
  }

server {
  server_name  tenant1-1.com;
  wallarm_partner_client_uuid 11111111-1111-1111-1111-111111111111;
  wallarm_application 23;
  ...
}

server {
  server_name  tenant2.com;
  wallarm_partner_client_uuid 22222222-2222-2222-2222-222222222222;
  ...
}
...
}
```

Na configuração acima:

* Inquilinos e aplicações são configurados com diferentes diretivas.
* As relações entre os inquilinos e as aplicações são definidas através das diretivas `wallarm_application` nos blocos correspondentes do arquivo de configuração NGINX.

## Passo 4: Teste a operação do nó multi-inquilino Wallarm

--8<-- "../include-pt-BR/waf/installation/test-waf-operation-no-stats.md"