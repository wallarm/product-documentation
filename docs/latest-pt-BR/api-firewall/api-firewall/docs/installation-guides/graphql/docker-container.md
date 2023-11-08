# Executando o Firewall de API no Docker para API GraphQL

Este guia descreve como baixar, instalar e iniciar o [Firewall de API Wallarm](../../index.md) no Docker para validação de solicitação de API GraphQL. No modo GraphQL, o Firewall de API atua como um proxy, encaminhando solicitações GraphQL dos usuários para o servidor backend usando os protocolos HTTP ou WebSocket (`graphql-ws`). Antes da execução do backend, o firewall verifica a complexidade da consulta, a profundidade e a contagem de nós da consulta GraphQL.

O Firewall de API não valida as respostas da consulta GraphQL.

## Requisitos

* [Docker instalado e configurado](https://docs.docker.com/get-docker/)
* [Especificação GraphQL](http://spec.graphql.org/October2021/) desenvolvida para a API GraphQL do aplicativo que deve ser protegido com o Firewall de API Wallarm

## Métodos para executar o Firewall de API no Docker

O método mais rápido para implantar o Firewall de API no Docker é o [Docker Compose](https://docs.docker.com/compose/). Os passos a seguir dependem do uso deste método.

Se necessário, você também pode usar `docker run`. Fornecemos os comandos `docker run` apropriados para implantar o mesmo ambiente [nesta seção](#using-docker-run-to-start-api-firewall).

## Passo 1. Crie o arquivo `docker-compose.yml` 

Para implantar o Firewall de API e o ambiente adequado usando Docker Compose, primeiro crie o **docker-compose.yml** com o seguinte conteúdo. Nos passos seguintes, você alterará este modelo.

```yml
version: '3.8'

networks:
  api-firewall-network:
    name: api-firewall-network

services:
  api-firewall:
    container_name: api-firewall
    image: wallarm/api-firewall:v0.6.13
    restart: on-failure
    volumes:
      - <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>
    environment:
      APIFW_MODE: graphql
      APIFW_GRAPHQL_SCHEMA: <PATH_TO_MOUNTED_SPEC>
      APIFW_URL: <API_FIREWALL_URL>
      APIFW_SERVER_URL: <PROTECTED_APP_URL>
      APIFW_GRAPHQL_REQUEST_VALIDATION: <REQUEST_VALIDATION_MODE>
      APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY: <MAX_QUERY_COMPLEXITY>
      APIFW_GRAPHQL_MAX_QUERY_DEPTH: <MAX_QUERY_DEPTH>
      APIFW_GRAPHQL_NODE_COUNT_LIMIT: <NODE_COUNT_LIMIT>
      APIFW_GRAPHQL_INTROSPECTION: <ALLOW_INTROSPECTION_OR_NOT>
    ports:
      - "8088:8088"
    stop_grace_period: 1s
    networks:
      - api-firewall-network
  backend:
    container_name: api-firewall-backend
    image: <IMAGE_WITH_GRAPHQL_APP>
    restart: on-failure
    ports:
      - <HOST_PORT>:<CONTAINER_PORT>
    stop_grace_period: 1s
    networks:
      - api-firewall-network
```

## Passo 2. Configure a rede Docker

Se necessário, altere a configuração da [rede Docker](https://docs.docker.com/network/) definida em **docker-compose.yml** → `networks`.

O **docker-compose.yml** fornecido instrui o Docker a criar a rede `api-firewall-network` e vincular os contêineres de aplicativos e Firewall de API a ela.

É recomendado usar uma rede Docker separada para o aplicativo protegido em contêiner e o Firewall de API para permitir sua comunicação sem vinculação manual.

## Passo 3. Configure o aplicativo a ser protegido com o Firewall de API

Altere a configuração do aplicativo em contêiner a ser protegido com o Firewall de API. Essa configuração é definida em **docker-compose.yml** → `services.backend`.

O modelo instrui o Docker a inicializar o contêiner do aplicativo Docker especificado, conectando-o à `api-firewall-network` e designando o `backend` como [alias de rede](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname). Você pode definir a porta conforme suas necessidades.

Ao configurar seu aplicativo, inclua apenas as configurações necessárias para uma inicialização bem-sucedida do contêiner. Nenhuma configuração especial do Firewall de API é necessária.

## Passo 4. Configure o Firewall de API

Passe a configuração do Firewall de API em **docker-compose.yml** → `services.api-firewall` da seguinte maneira:

**Com `services.api-firewall.volumes`**, monte a [especificação GraphQL](http://spec.graphql.org/October2021/) no diretório do contêiner do Firewall de API:
    
* `<HOST_PATH_TO_SPEC>`: o caminho para a especificação GraphQL para sua API localizada na máquina host. O formato do arquivo não importa, mas geralmente é `.graphql` ou `gql`. Por exemplo: `/opt/my-api/graphql/schema.graphql`.
* `<CONTAINER_PATH_TO_SPEC>`: o caminho para o diretório do contêiner para montar a especificação GraphQL. Por exemplo: `/api-firewall/resources/schema.graphql`.

**Com `services.api-firewall.environment`**, defina a configuração geral do Firewall de API através das seguintes variáveis de ambiente:

| Variável de ambiente | Descrição | Obrigatório? |
| -------------------- | ----------- | --------- |
| `APIFW_MODE` | Define o modo geral do Firewall de API. Os valores possíveis são [`PROXY`](../docker-container.md) (padrão), `graphql` e [`API`](../api-mode.md). | Não |
| <a name="apifw-api-specs"></a>`APIFW_GRAPHQL_SCHEMA` | Caminho para o arquivo de especificação GraphQL montado no contêiner, por exemplo: `/api-firewall/resources/schema.graphql`. | Sim |
| `APIFW_URL` | URL para o Firewall de API. Por exemplo: `http://0.0.0.0:8088/`. O valor da porta deve corresponder à porta do contêiner publicada no host.<br><br>Se o Firewall de API ouvir o protocolo HTTPS, monte o certificado SSL/TLS gerado e a chave privada no contêiner e passe para o contêiner as **configurações de SSL/TLS do Firewall de API** descritas abaixo. | Sim |
| `APIFW_SERVER_URL` | URL do aplicativo descrito na especificação montada que deve ser protegida com o Firewall de API. Por exemplo: `http://backend:80`. | Sim |
| <a name="apifw-graphql-request-validation"></a>`APIFW_GRAPHQL_REQUEST_VALIDATION` | Modo do Firewall de API ao validar solicitações enviadas para a URL do aplicativo:<ul><li>`BLOCK` bloqueia e registra solicitações que não correspondem ao esquema GraphQL montado, retornando um `403 Forbidden`. Os logs são enviados para os [serviços `STDOUT` e `STDERR` do Docker](https://docs.docker.com/config/containers/logging/).</li><li>`LOG_ONLY` registra (mas não bloqueia) solicitações incompatíveis.</li><li>`DISABLE` desativa a validação da solicitação.</li></ul>Esta variável impacta todos os outros parâmetros, exceto [`APIFW_GRAPHQL_WS_CHECK_ORIGIN`](websocket-origin-check.md). Por exemplo, se `APIFW_GRAPHQL_INTROSPECTION` for `false` e o modo for `LOG_ONLY`, as solicitações de introspecção chegarão ao servidor de backend, mas o Firewall de API gerará um log de erro correspondente. | Sim |
| `APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY` | [Define](limit-compliance.md) o número máximo de solicitações Node que podem ser necessárias para executar a consulta. Definir como `0` desativa a verificação de complexidade. O valor padrão é `0`. | Sim |
| `APIFW_GRAPHQL_MAX_QUERY_DEPTH` | [Especifica](limit-compliance.md) a profundidade máxima permitida de uma consulta GraphQL. Um valor de `0` significa que a verificação da profundidade da consulta é ignorada. | Sim |
| `APIFW_GRAPHQL_NODE_COUNT_LIMIT` | [Define](limit-compliance.md) o limite superior para a contagem de nós em uma consulta. Quando definido como `0`, a verificação do limite de contagem de nós é ignorada. | Sim |
| <a name="apifw-graphql-introspection"></a>`APIFW_GRAPHQL_INTROSPECTION` | Permite consultas de introspecção, que revelam o layout do seu esquema GraphQL. Quando definido como `true`, essas consultas são permitidas. | Sim |
| `APIFW_LOG_LEVEL` | Nível de registro do Firewall de API. Valores possíveis:<ul><li>`DEBUG` para registrar eventos de qualquer tipo (INFO, ERROR, WARNING e DEBUG).</li><li>`INFO` para registrar eventos dos tipos INFO, WARNING e ERROR.</li><li>`WARNING` para registrar eventos dos tipos WARNING e ERROR.</li><li>`ERROR` para registrar apenas eventos do tipo ERROR.</li><li>`TRACE` para registrar solicitações recebidas e respostas do Firewall de API, incluindo seu conteúdo.</li></ul> O valor padrão é `DEBUG`. Logs sobre solicitações e respostas que não correspondem ao esquema fornecido são do tipo ERROR. | Não |
| `APIFW_SERVER_DELETE_ACCEPT_ENCODING` | Se for definido como `true`, o cabeçalho `Accept-Encoding` é excluído das solicitações proxy. O valor padrão é `false`. | Não |
| `APIFW_LOG_FORMAT` | O formato dos logs do Firewall de API. O valor pode ser `TEXT` ou `JSON`. O valor padrão é `TEXT`. | Não |

**Com `services.api-firewall.ports` e `services.api-firewall.networks`**, defina a porta do contêiner do Firewall de API e conecte o contêiner à rede criada.

## Passo 5. Implante o ambiente configurado

Para construir e iniciar o ambiente configurado, execute o seguinte comando:

```bash
docker-compose up -d --force-recreate
```

Para verificar a saída do log:

```bash
docker-compose logs -f
```

## Passo 6. Teste a operação do Firewall de API

Para testar a operação do Firewall de API, envie a solicitação que não corresponde à especificação GraphQL montada para o endereço do contêiner Docker do Firewall de API.

Com `APIFW_GRAPHQL_REQUEST_VALIDATION` definido como `BLOCK`, o firewall funciona da seguinte maneira:

* Se o Firewall de API permitir a solicitação, ele fará proxy da solicitação para o servidor backend. 
* Se o Firewall de API não puder analisar a solicitação, ele responderá com o erro GraphQL com um código de status 500.
* Se a validação falhar pelo Firewall de API, ele não fará proxy da solicitação para o servidor backend, mas responderá ao cliente com o código de status 200 e o erro GraphQL na resposta. 

Se a solicitação não corresponder ao esquema de API fornecido, a mensagem de ERRO apropriada será adicionada aos logs do contêiner Docker do Firewall de API, por exemplo, no formato JSON:

```json
{
  "errors": [
    {
      "message": "field: name not defined on type: Query",
      "path": [
        "query",
        "name"
      ]
    }
  ]
}
```

Nos cenários em que vários campos na solicitação são inválidos, apenas uma mensagem de erro será gerada.

## Passo 7. Ative o tráfego no Firewall de API

Para finalizar a configuração do Firewall de API, habilite o tráfego de entrada no Firewall de API atualizando a configuração do esquema de implantação do seu aplicativo. Por exemplo, isso exigiria a atualização das configurações do Ingress, NGINX ou balanceador de carga.

## Parando o ambiente implantado

Para parar o ambiente implantado usando Docker Compose, execute o seguinte comando:

```bash
docker-compose down
```

## Usando `docker run` para iniciar o Firewall de API

Para iniciar o Firewall de API no Docker, você também pode usar comandos regulares do Docker, conforme os exemplos abaixo:

1. [Para criar uma rede Docker separada](#step-2-configure-the-docker-network) para permitir a comunicação do aplicativo em contêiner e do Firewall de API sem vinculação manual:

    ```bash
    docker network create api-firewall-network
    ```
2. [Inicie o aplicativo em contêiner](#step-3-configure-the-application-to-be-protected-with-api-firewall) a ser protegido com o Firewall de API:

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p <HOST_PORT>:<CONTAINER_PORT> <IMAGE_WITH_GRAPHQL_APP>
    ```
3. [Para iniciar o Firewall de API](#step-4-configure-api-firewall):

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_MODE=graphql \
        -e APIFW_GRAPHQL_SCHEMA=<PATH_TO_MOUNTED_SPEC> -e APIFW_URL=<API_FIREWALL_URL> \
        -e APIFW_SERVER_URL=<PROTECTED_APP_URL> -e APIFW_GRAPHQL_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> \
        -e APIFW_GRAPHQL_MAX_QUERY_COMPLEXITY=<MAX_QUERY_COMPLEXITY> \
        -e APIFW_GRAPHQL_MAX_QUERY_DEPTH=<MAX_QUERY_DEPTH> -e APIFW_GRAPHQL_NODE_COUNT_LIMIT=<NODE_COUNT_LIMIT> \
        -e APIFW_GRAPHQL_INTROSPECTION=<ALLOW_INTROSPECTION_OR_NOT> \
        -p 8088:8088 wallarm/api-firewall:v0.6.13
    ```
4. Quando o ambiente estiver iniciado, teste-o e habilite o tráfego no Firewall de API seguindo os passos 6 e 7.