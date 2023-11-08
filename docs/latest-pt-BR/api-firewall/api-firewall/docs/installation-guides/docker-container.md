# Executando o Firewall da API no Docker para REST API

Este guia percorre o download, instalação e início do [Firewall da API Wallarm](../index.md) no Docker para validação de solicitações de API REST.

## Requisitos

* [Instalado e configurado Docker](https://docs.docker.com/get-docker/)
* [Especificação OpenAPI 3.0](https://swagger.io/specification/) desenvolvida para a API REST do aplicativo que deve ser protegido pelo Firewall da API Wallarm

## Métodos para executar o Firewall da API no Docker

O método mais rápido para implantar o Firewall da API no Docker é [Docker Compose](https://docs.docker.com/compose/). As etapas abaixo dependem do uso deste método.

Se necessário, você também pode usar `docker run`. Fornecemos os comandos `docker run` adequados para implantar o mesmo ambiente [nesta seção](#using-docker-run-to-start-api-firewall).

## Etapa 1. Crie o arquivo `docker-compose.yml`

Para implantar o Firewall da API e o ambiente adequado usando Docker Compose, crie primeiro o **docker-compose.yml** com o seguinte conteúdo:

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
      APIFW_API_SPECS: <PATH_TO_MOUNTED_SPEC>
      APIFW_URL: <API_FIREWALL_URL>
      APIFW_SERVER_URL: <PROTECTED_APP_URL>
      APIFW_REQUEST_VALIDATION: <REQUEST_VALIDATION_MODE>
      APIFW_RESPONSE_VALIDATION: <RESPONSE_VALIDATION_MODE>
    ports:
      - "8088:8088"
    stop_grace_period: 1s
    networks:
      - api-firewall-network
  backend:
    container_name: api-firewall-backend
    image: kennethreitz/httpbin
    restart: on-failure
    ports:
      - 8090:8090
    stop_grace_period: 1s
    networks:
      - api-firewall-network
```

## Etapa 2. Configure a rede Docker

Se necessário, altere a configuração da [rede Docker](https://docs.docker.com/network/) definida em **docker-compose.yml** → `networks`.

O **docker-compose.yml** fornecido instrui o Docker a criar a rede `api-firewall-network` e vincular o aplicativo e os contêineres do Firewall da API a ele.

É recomendado usar uma rede Docker separada para permitir a comunicação do aplicativo com o Firewall da API, sem vinculação manual.

## Etapa 3. Configure o aplicativo a ser protegido com o Firewall da API

Altere a configuração do aplicativo em contêiner a ser protegido com Firewall da API. Esta configuração é definida em **docker-compose.yml** → `services.backend`.

O **docker-compose.yml** fornecido instrui o Docker a iniciar o [contêiner Docker kennethreitz/httpbin](https://hub.docker.com/r/kennethreitz/httpbin/) conectado à `api-firewall-network` e atribuído com o [alias de rede](https://docs.docker.com/config/containers/container-networking/#ip-address-and-hostname) `backend`. A porta do contêiner é 8090.

Se estiver configurando o próprio aplicativo, defina apenas as configurações necessárias para o início correto do contêiner do aplicativo. Nenhuma configuração específica para o Firewall da API é necessária.

## Etapa 4. Configure o Firewall da API

Passe a configuração do Firewall da API em **docker-compose.yml** → `services.api-firewall` da seguinte maneira:

**Com `services.api-firewall.volumes`**, monte a [especificação OpenAPI 3.0](https://swagger.io/specification/) no diretório do contêiner do Firewall da API:

* `<HOST_PATH_TO_SPEC>`: é o caminho para a especificação OpenAPI 3.0 para a API REST do seu aplicativo localizado na máquina host. Os formatos de arquivo aceitos são YAML e JSON (extensões de arquivo `.yaml`, `.yml`, `.json`). Por exemplo: `/opt/my-api/openapi3/swagger.json`.
* `<CONTAINER_PATH_TO_SPEC>`: é o caminho para o diretório do contêiner para montar a especificação OpenAPI 3.0. Por exemplo: `/api-firewall/resources/swagger.json`.

**Com `services.api-firewall.environment`**, defina a configuração geral do Firewall da API por meio das seguintes variáveis de ambiente:

| Variável de ambiente              | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Necessário? |
|-----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|
| <a name="apifw-api-specs"></a>`APIFW_API_SPECS`                 | Caminho para a especificação OpenAPI 3.0. Existem as seguintes maneiras de especificar o caminho:<ul><li>Caminho para o arquivo de especificação montado no contêiner, por exemplo: `/api-firewall/resources/swagger.json`. Ao executar o contêiner, monte este arquivo com a opção `-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>`.</li><li>Endereço URL do arquivo de especificação, por exemplo: `https://example.com/swagger.json`. Ao executar o contêiner, omita a opção `-v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC>`.</li></ul>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Sim       |
| `APIFW_URL`                       | URL para o Firewall da API. Por exemplo: `http://0.0.0.0:8088/`. O valor da porta deve corresponder à porta do contêiner publicada no host.<br><br>Se o Firewall da API ouvir o protocolo HTTPS, monte o certificado SSL/TLS gerado e a chave privada no contêiner e passe ao contêiner as **configurações SSL/TLS do Firewall da API** descritas abaixo.                                                                                                                                                                                                                                                   | Sim       |
| `APIFW_SERVER_URL`                | URL do aplicativo descrito na especificação OpenAPI montada que deve ser protegida com o Firewall da API. Por exemplo: `http://backend:80`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Sim       |
| `APIFW_REQUEST_VALIDATION`        | Modo de Firewall da API ao validar solicitações enviadas para a URL do aplicativo:<ul><li>`BLOCK` para bloquear e registrar as solicitações que não correspondem ao esquema fornecido na especificação OpenAPI 3.0 montada (a resposta `403 Forbidden` será retornada para as solicitações bloqueadas). Os registros são enviados para os [serviços Docker `STDOUT` e `STDERR`](https://docs.docker.com/config/containers/logging/).</li><li>`LOG_ONLY` para registrar, mas não bloquear as solicitações que não correspondem ao esquema fornecido na especificação OpenAPI 3.0 montada. Os registros são enviados para os [serviços Docker `STDOUT` e `STDERR`](https://docs.docker.com/config/containers/logging/).</li><li>`DISABLE` para desativar a validação de solicitações.</li></ul>                                                                                                                           | Sim       |
| `APIFW_RESPONSE_VALIDATION`       | Modo de Firewall da API ao validar as respostas do aplicativo para solicitações recebidas:<ul><li>`BLOCK` para bloquear e registrar a solicitação se a resposta do aplicativo para esta solicitação não corresponder ao esquema fornecido na especificação OpenAPI 3.0 montada. Esta solicitação será encaminhada para o URL do aplicativo, mas o cliente receberá a resposta `403 Forbidden`. Os registros são enviados para os [serviços Docker `STDOUT` e `STDERR`](https://docs.docker.com/config/containers/logging/).</li><li>`LOG_ONLY` para registrar, mas não bloquear a solicitação se a resposta do aplicativo para esta solicitação não corresponder ao esquema fornecido na especificação OpenAPI 3.0 montada. Os registros são enviados para os [serviços Docker `STDOUT` e `STDERR`](https://docs.docker.com/config/containers/logging/).</li><li>`DISABLE` para desativar a validação da solicitação.</li></ul> | Sim       |
| `APIFW_LOG_LEVEL`                 | Nível de registro do Firewall da API. Possíveis valores:<ul><li>`DEBUG` para registrar eventos de qualquer tipo (INFO, ERROR, WARNING e DEBUG).</li><li>`INFO` para registrar eventos dos tipos INFO, WARNING e ERROR.</li><li>`WARNING` para registrar eventos dos tipos WARNING e ERROR.</li><li>`ERROR` para registrar eventos do tipo ERROR.</li><li>`TRACE` para registrar solicitações recebidas e respostas do Firewall da API, incluindo seu conteúdo.</li></ul> O valor padrão é `DEBUG`. Registros em solicitações e respostas que não correspondem ao esquema fornecido têm o tipo ERROR.                                                                                                                                                                                                                                       | Não        |
| <a name="apifw-custom-block-status-code"></a>`APIFW_CUSTOM_BLOCK_STATUS_CODE` | [Código de status de resposta HTTP](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) retornado pelo Firewall da API operando no modo `BLOCK` se a solicitação ou resposta não corresponder ao esquema fornecido na especificação OpenAPI 3.0 montada. O valor padrão é `403`. | Não 
| `APIFW_ADD_VALIDATION_STATUS_HEADER`<br>(EXPERIMENTAL) | Se deve retornar o cabeçalho `Apifw-Validation-Status` contendo o motivo do bloqueio da solicitação na resposta a esta solicitação. O valor pode ser `true` ou `false`. O valor padrão é `false`.| Não
| `APIFW_SERVER_DELETE_ACCEPT_ENCODING` | Se estiver definido como `true`, o cabeçalho `Accept-Encoding` é excluído das solicitações passadas. O valor padrão é `false`. | Não |
| `APIFW_LOG_FORMAT` | O formato dos registros do Firewall da API. O valor pode ser `TEXT` ou `JSON`. O valor padrão é `TEXT`. | Não |
| `APIFW_SHADOW_API_EXCLUDE_LIST`<br>(somente se o Firewall da API estiver operando no modo `LOG_ONLY` para ambas as solicitações e respostas) | [Códigos de status de resposta HTTP](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) indicando que o ponto de extremidade da API solicitada que não está incluído na especificação NÃO é uma sombra. Você pode especificar vários códigos de status separados por ponto e vírgula (por exemplo, `404;401`). O valor padrão é `404`.<br><br>Por padrão, o Firewall da API operando no modo `LOG_ONLY` para ambas as solicitações e respostas marca todos os pontos de extremidade que não estão incluídos na especificação e estão retornando o código diferente de `404` como sombras. | Não
| `APIFW_MODE` | Define o modo geral do Firewall da API. Possíveis valores são `PROXY` (padrão), [`graphql`](graphql/docker-container.md) e [`API`](api-mode.md). | Não |
| `APIFW_PASS_OPTIONS` | Quando definido como `true`, o Firewall da API permite solicitações `OPTIONS` para pontos de extremidade na especificação, mesmo se o método `OPTIONS` não estiver descrito. O valor padrão é `false`. | Não |
| `APIFW_SHADOW_API_UNKNOWN_PARAMETERS_DETECTION` | Especifica se solicitações são identificadas como não correspondendo à especificação se seus parâmetros não estiverem alinhados com aqueles definidos na especificação OpenAPI. O valor padrão é `true`.<br><br>Se estiver executando o Firewall da API no [modo `API`](api-mode.md), esta variável assume um nome diferente `APIFW_API_MODE_UNKNOWN_PARAMETERS_DETECTION`. | Não |

**Com `services.api-firewall.ports` e `services.api-firewall.networks`**, defina a porta do contêiner do Firewall da API e conecte o contêiner à rede criada. O **docker-compose.yml** fornecido instrui o Docker a iniciar o Firewall da API conectado à [rede](https://docs.docker.com/network/) `api-firewall-network` na porta 8088.

## Etapa 5. Implante o ambiente configurado

Para construir e iniciar o ambiente configurado, execute o seguinte comando:

```bash
docker-compose up -d --force-recreate
```

Para verificar a saída do log:

```bash
docker-compose logs -f
```

## Etapa 6. Teste a operação do Firewall da API

Para testar a operação do Firewall da API, envie a solicitação que não corresponde à especificação Open API 3.0 montada para o endereço do contêiner Docker do Firewall da API. Por exemplo, você pode passar o valor da string no parâmetro que requer o valor inteiro.

Se a solicitação não corresponder ao esquema da API fornecido, a mensagem de ERRO apropriada será adicionada aos registros do contêiner Docker do Firewall da API.

## Etapa 7. Ative o tráfego no Firewall da API

Para finalizar a configuração do Firewall da API, ative o tráfego de entrada no Firewall da API atualizando a configuração do esquema de implantação do seu aplicativo. Por exemplo, isso exigiria a atualização das configurações do Ingress, NGINX ou balanceador de carga.

## Parando o ambiente implantado

Para parar o ambiente implantado usando o Docker Compose, execute o seguinte comando:

```bash
docker-compose down
```

## Usando `docker run` para iniciar o Firewall da API

Para iniciar o Firewall da API no Docker, você também pode usar comandos Docker regulares, como nos exemplos abaixo:

1. [Para criar uma rede Docker separada](#step-2-configure-the-docker-network) para permitir a comunicação do aplicativo com o Firewall da API, sem vinculação manual:

    ```bash
    docker network create api-firewall-network
    ```
2. [Para iniciar o aplicativo em contêiner](#step-3-configure-the-application-to-be-protected-with-api-firewall) a ser protegido com Firewall da API:

    ```bash
    docker run --rm -it --network api-firewall-network \
        --network-alias backend -p 8090:8090 kennethreitz/httpbin
    ```
3. [Para iniciar o Firewall da API](#step-4-configure-api-firewall):

    ```bash
    docker run --rm -it --network api-firewall-network --network-alias api-firewall \
        -v <HOST_PATH_TO_SPEC>:<CONTAINER_PATH_TO_SPEC> -e APIFW_API_SPECS=<PATH_TO_MOUNTED_SPEC> \
        -e APIFW_URL=<API_FIREWALL_URL> -e APIFW_SERVER_URL=<PROTECTED_APP_URL> \
        -e APIFW_REQUEST_VALIDATION=<REQUEST_VALIDATION_MODE> -e APIFW_RESPONSE_VALIDATION=<RESPONSE_VALIDATION_MODE> \
        -p 8088:8088 wallarm/api-firewall:v0.6.13
    ```
4. Quando o ambiente estiver iniciado, teste-o e ative o tráfego no Firewall da API seguindo as etapas 6 e 7.
