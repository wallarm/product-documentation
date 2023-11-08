# Demonstração do Wallarm API Firewall com Docker Compose

Esta demonstração implementa o aplicativo [**httpbin**](https://httpbin.org/) e o Wallarm API Firewall como um proxy protegendo a API **httpbin**. Ambos os aplicativos estão sendo executados em contêineres Docker conectados usando o Docker Compose.

## Requisitos do sistema

Antes de executar esta demonstração, certifique-se de que seu sistema atende aos seguintes requisitos:

* Docker Engine 20.x ou superior instalado para [Mac](https://docs.docker.com/docker-for-mac/install/), [Windows](https://docs.docker.com/docker-for-windows/install/) ou [Linux](https://docs.docker.com/engine/install/#server)
* [Docker Compose](https://docs.docker.com/compose/install/) instalado
* **make** instalado para [Mac](https://formulae.brew.sh/formula/make), [Windows](https://sourceforge.net/projects/ezwinports/files/make-4.3-without-guile-w32-bin.zip/download), ou Linux (usando utilitários adequados de gerenciamento de pacotes)

## Recursos usados

Os seguintes recursos são usados nesta demonstração:

* [Imagem Docker **httpbin**](https://hub.docker.com/r/kennethreitz/httpbin/)
* [Imagem Docker do Firewall API](https://hub.docker.com/r/wallarm/api-firewall)

## Descrição do código de demonstração

O [código de demonstração](https://github.com/wallarm/api-firewall/tree/main/demo/docker-compose) contém os seguintes arquivos de configuração:

* As seguintes especificações OpenAPI 3.0 localizadas no diretório `volumes`:
    * `httpbin.json` é a [especificação OpenAPI 2.0 **httpbin**](https://httpbin.org/spec.json) convertida para o formato de especificação OpenAPI 3.0.
    * `httpbin-with-constraints.json` é a especificação OpenAPI 3.0 **httpbin** com restrições adicionais de API adicionadas explicitamente.

    Ambos os arquivos serão usados para testar a implantação de demonstração.
* `Makefile` é o arquivo de configuração que define rotinas Docker.
* `docker-compose.yml` é o arquivo que define a configuração das imagens Docker **httpbin** e [Firewall API](https://docs.wallarm.com/api-firewall/installation-guides/docker-container/).

## Passo 1: Executando o código de demonstração

Para executar o código de demonstração:

1. Clone o repositório do GitHub que contém o código de demonstração:

    ```bash
    git clone https://github.com/wallarm/api-firewall.git
    ```
2. Mude para o diretório `demo/docker-compose` do repositório clonado:

    ```bash
    cd api-firewall/demo/docker-compose
    ```
3. Execute o código de demonstração usando o seguinte comando:

    ```bash
    make start
    ```

    * O aplicativo **httpbin** protegido pelo Firewall API estará disponível em http://localhost:8080.
    * O aplicativo **httpbin** desprotegido pelo Firewall API estará disponível em http://localhost:8090. Ao testar a implantação de demonstração, você pode enviar solicitações ao aplicativo desprotegido para saber a diferença.
4. Prossiga com o teste de demonstração.

## Passo 2: Testando a demonstração com base na especificação original OpenAPI 3.0

Por padrão, esta demonstração está em execução com a especificação original **httpbin** OpenAPI 3.0. Para testar esta opção de demonstração, você pode usar as seguintes solicitações:

* Verifique se o Firewall API bloqueia solicitações enviadas para o caminho não exposto:

    ```bash
    curl -sD - http://localhost:8080/unexposed/path
    ```

    Resposta esperada:

    ```bash
    HTTP/1.1 403 Proibido
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* Verifique se o Firewall API bloqueia solicitações com valor de string passado no parâmetro que requer tipo de dados inteiro:

    ```bash
    curl -sD - http://localhost:8080/cache/arewfser
    ```

    Resposta esperada:

    ```bash
    HTTP/1.1 403 Proibido
    Date: Mon, 31 May 2021 06:58:29 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

    Este caso demonstra que o Firewall API protege o aplicativo contra ataques DoS envenenados por cache.

## Passo 3: Testando a demonstração com base na especificação OpenAPI 3.0 mais rigorosa

Primeiro, atualize o caminho para a especificação OpenAPI 3.0 usada na demonstração:

1. No arquivo `docker-compose.yml`, substitua o valor da variável de ambiente `APIFW_API_SPECS` pelo caminho para a especificação OpenAPI 3.0 mais rigorosa (`/opt/resources/httpbin-with-constraints.json`).
2. Reinicie a demonstração usando os comandos:

    ```bash
    make stop
    make start
    ```

Em seguida, para testar esta opção de demonstração, você pode usar os seguintes métodos:

* Verifique se o Firewall API bloqueia solicitações com o parâmetro de consulta necessário `int` que não corresponde à seguinte definição:

    ```json
    ...
    {
      "in": "query",
      "name": "int",
      "schema": {
        "type": "integer",
        "minimum": 10,
        "maximum": 100
      },
      "required": true
    },
    ...
    ```

    Teste a definição usando as seguintes solicitações:

    ```bash
    # Solicitação com parâmetro de consulta necessário ausente
    curl -sD - http://localhost:8080/get

    # Resposta esperada
    HTTP/1.1 403 Proibido
    Date: Mon, 31 May 2021 07:09:08 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro int que está em um intervalo válido
    curl -sD - http://localhost:8080/get?int=15

    # Resposta esperada
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:09:38 GMT
    Content-Type: application/json
    Content-Length: 280
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # Solicitação com o valor do parâmetro int que está fora de alcance
    curl -sD - http://localhost:8080/get?int=5

    # Resposta esperada
    HTTP/1.1 403 Proibido
    Date: Mon, 31 May 2021 07:09:27 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro int que está fora de alcance
    curl -sD - http://localhost:8080/get?int=1000

    # Resposta esperada
    HTTP/1.1 403 Proibido
    Date: Mon, 31 May 2021 07:09:53 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro int que está fora de alcance
    # POTENTIAL EVIL: O estouro de inteiro de 8 bytes pode responder com queda de pilha
    curl -sD - http://localhost:8080/get?int=18446744073710000001

    # Resposta esperada
    HTTP/1.1 403 Proibido
    Date: Mon, 31 May 2021 07:10:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```
* Verifique se o Firewall API bloqueia solicitações com o parâmetro de consulta `str` que não corresponde à seguinte definição:

    ```json
    ...
    {
      "in": "query",
      "name": "str",
      "schema": {
        "type": "string",
        "pattern": "^.{1,10}-\\d{1,10}$"
      }
    },
    ...
    ```

    Teste a definição usando as seguintes solicitações (o parâmetro `int` ainda é necessário):

    ```bash
    # Solicitação com o valor do parâmetro str que não corresponde à expressão regular definida
    curl -sD - "http://localhost:8080/get?int=15&str=fasxxx.xxxawe-6354"

    # Resposta esperada
    HTTP/1.1 403 Proibido
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro str que não corresponde à expressão regular definida
    curl -sD - "http://localhost:8080/get?int=15&str=faswerffa-63sss54"
    
    # Resposta esperada
    HTTP/1.1 403 Proibido
    Date: Mon, 31 May 2021 07:10:42 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0


    # Solicitação com o valor do parâmetro str que corresponde à expressão regular definida
    curl -sD - http://localhost:8080/get?int=15&str=ri0.2-3ur0-6354

    # Resposta esperada
    HTTP/1.1 200 OK
    Server: gunicorn/19.9.0
    Date: Mon, 31 May 2021 07:11:03 GMT
    Content-Type: application/json
    Content-Length: 331
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Credentials: true
    ...


    # Solicitação com o valor do parâmetro str que não corresponde à expressão regular definida
    # POTENCIAL EVIL: Injeção SQL
    curl -sD - 'http://localhost:8080/get?int=15&str=";SELECT%20*%20FROM%20users.credentials;"'

    # Resposta esperada
    HTTP/1.1 403 Proibido
    Date: Mon, 31 May 2021 07:12:04 GMT
    Content-Type: text/plain; charset=utf-8
    Content-Length: 0
    ```

## Passo 4: Parando o código de demonstração

Para parar a implantação de demonstração e limpar seu ambiente, use o comando:

```bash
make stop
```